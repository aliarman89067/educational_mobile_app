import { Request, Response } from "express";
import OnlineRoomModel from "../models/OnlineRoom";
import subjectModel from "../models/Subject";
import topicModel from "../models/Topic";
import yearModel from "../models/Year";
import HistoryModel from "../models/History";

export const getAllHistory = async (req: Request, res: Response) => {
  const { userId } = req.params;
  try {
    const historyData: any = {};
    const onlineRooms = await OnlineRoomModel.find({
      $or: [{ user1: userId }, { user2: userId }],
    })
      .select(
        "_id subjectId subject topicId yearId quizType resignation seconds createdAt"
      )
      .populate({ path: "subjectId", select: "_id subject" })
      .populate({ path: "yearId", select: "_id year" })
      .populate({ path: "topicId", select: "_id topic" });

    const formattedOnlineRooms = onlineRooms.map((room) => {
      const subject = room.subjectId as unknown as {
        _id: string;
        subject: string;
      };
      const year = room.yearId as unknown as {
        _id: string;
        year: string;
      };
      const topic = room.topicId as unknown as {
        _id: string;
        topic: string;
      };

      return {
        roomId: room._id,
        subjectId: subject._id,
        subjectName: subject.subject,
        topicId: room.quizType === "Topical" ? topic._id : "",
        topicName: room.quizType === "Topical" ? topic.topic : "",
        yearId: room.quizType === "Yearly" ? year._id : "",
        yearName: room.quizType === "Yearly" ? year.year : "",
        date: room.createdAt,
        quizType: room.quizType,
        resignation: room.resignation,
      };
    });

    const soloHistory = await HistoryModel.find({ user: userId })
      .select("_id createdAt")
      .populate({
        path: "soloRoom",
        populate: [
          { path: "subjectId", select: "_id subject" },
          { path: "yearId", select: "_id year" },
          { path: "topicId", select: "_id topic" },
        ],
      });

    const formattedSoloHistory = soloHistory.map((history) => {
      const soloRoom = history.soloRoom as unknown as {
        _id: string;
        subjectId: {
          _id: string;
          subject: string;
        };
        topicId: {
          _id: string;
          topic: string;
        };
        yearId: {
          _id: string;
          year: string;
        };
        quizType: string;
        createdAt: string;
      };
      return {
        historyId: history._id,
        roomId: history.soloRoom?._id,
        subjectId: soloRoom.subjectId._id,
        subjectName: soloRoom.subjectId.subject,
        topicId: soloRoom.quizType === "Topical" ? soloRoom.topicId._id : "",
        topicName:
          soloRoom.quizType === "Topical" ? soloRoom.topicId.topic : "",
        yearId: soloRoom.quizType === "Yearly" ? soloRoom.yearId._id : "",
        yearName: soloRoom.quizType === "Yearly" ? soloRoom.yearId.year : "",
        quizType: soloRoom.quizType,
        date: history.createdAt,
      };
    });

    historyData["onlineQuizes"] = formattedOnlineRooms;
    historyData["soloQuizes"] = formattedSoloHistory;
    res.status(200).json(historyData);
  } catch (error: any) {
    console.log(error);
    res
      .status(500)
      .json({ message: `Failed to get histories ${error.message ?? error}` });
  }
};
