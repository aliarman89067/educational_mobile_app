import { Request, Response } from "express";
import subjectModel from "../models/Subject";
import topicModel from "../models/Topic";
import yearModel from "../models/Year";
import SoloRoomModel from "../models/SoloRoom";
import HistoryModel from "../models/History";
import OnlineRoomModel from "../models/OnlineRoom";
import UserModel from "../models/User";
import OnlineHistoryModel from "../models/OnlineHistory";
import GuestModel from "../models/Guest";

export const getQuizByCategory = async (req: Request, res: Response) => {
  try {
    const { quizType } = req.params;
    let data;
    const subjects = await subjectModel.find().select("_id subject");
    if (quizType === "Topical") {
      data = await subjectModel
        .find()
        .populate({ path: "topics" })
        .select("-years");
    } else {
      data = await subjectModel
        .find()
        .populate({ path: "years" })
        .select("-topics");
    }
    console.log(subjects);
    res.status(200).json({ success: true, data: data, subjects });
  } catch (error) {
    console.log(error);
  }
};

export const createSoloQuiz = async (req: Request, res: Response) => {
  try {
    const { subjectId, yearIdOrTopicId, quizLimit, quizType, seconds } =
      req.body;
    console.log(subjectId, yearIdOrTopicId, quizLimit, quizType, seconds);
    if (!subjectId || !yearIdOrTopicId || !quizLimit || !quizType || !seconds) {
      res.status(404).json({
        success: false,
        message: "Payload is not correct!",
      });
      return;
    }
    let data: any;
    if (quizType === "Yearly") {
      data = await yearModel.findOne({ _id: yearIdOrTopicId }).select("mcqs");
    } else if (quizType === "Topical") {
      data = await topicModel.findOne({ _id: yearIdOrTopicId }).select("mcqs");
    } else {
      res.status(404).json({
        success: false,
        message: "Quiz Type is not correct!",
      });
      return;
    }
    const targetQuiz: any = [];
    while (targetQuiz.length < quizLimit) {
      const randomQuizId =
        data.mcqs[Math.ceil(Math.random() * data.mcqs.length - 1)];
      if (!targetQuiz.includes(randomQuizId)) {
        targetQuiz.push(randomQuizId);
      }
    }
    let newSoloRoom;
    if (quizType === "Yearly") {
      newSoloRoom = await SoloRoomModel.create({
        subjectId,
        yearId: yearIdOrTopicId,
        quizes: targetQuiz,
        quizType,
        isAlive: true,
        seconds,
      });
    } else if (quizType === "Topical") {
      newSoloRoom = await SoloRoomModel.create({
        subjectId,
        topicId: yearIdOrTopicId,
        quizType,
        quizes: targetQuiz,
        isAlive: true,
        seconds,
      });
    } else {
      res.status(404).json({
        success: false,
        message: "Quiz Type is not correct!",
      });
      return;
    }
    res.status(201).json({ success: true, data: newSoloRoom._id });
  } catch (error: any) {
    console.log(error);
    res.status(500).json({
      message: `Failed to create solo quiz ${error ?? error.message}`,
    });
  }
};

export const getSoloRoom = async (req: Request, res: Response) => {
  try {
    const { soloRoomId } = req.params;
    if (!soloRoomId) {
      res
        .status(404)
        .json({ success: false, message: "Solo Room Id is not exist!" });
      return;
    }
    const isSoloRoomAlive: any = await SoloRoomModel.findOne({
      _id: soloRoomId,
    }).select("isAlive");
    if (!isSoloRoomAlive.isAlive || !isSoloRoomAlive) {
      res.status(400).json({
        success: false,
        message: "This Solo Room is not valid. Its expired!",
      });
      return;
    }
    const soloRoomData = await SoloRoomModel.findOne({ _id: soloRoomId })
      .populate({ path: "subjectId", select: "_id subject" })
      .populate({ path: "yearId", select: "_id year" })
      .populate({ path: "topicId", select: "_id topic" })
      .populate({ path: "quizes" });
    res.status(200).json({ success: true, data: soloRoomData });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
};

export const reactiveSoloRoom = async (req: Request, res: Response) => {
  try {
    const { soloRoomId, historyId } = req.body;
    if (!soloRoomId) {
      res
        .status(404)
        .json({ success: false, message: "Solo Room Id not exist!" });
      return;
    }
    const soloRoomDoc = await SoloRoomModel.findByIdAndUpdate(
      soloRoomId,
      { isAlive: true, isHistoryId: historyId },
      { new: true }
    );
    res.status(200).json({ success: true, data: soloRoomDoc?._id });
  } catch (error: any) {
    console.log(error);
    res.status(500).json({
      message: `Failed to reactive soloroom ${error.message ?? error}`,
    });
  }
};

export const leaveSoloRoom = async (req: Request, res: Response) => {
  try {
    const { roomId } = req.params;
    if (!roomId) {
      res
        .status(404)
        .json({ success: false, message: "Solo Room Id not exist!" });
      return;
    }
    await SoloRoomModel.findByIdAndUpdate(roomId, { isAlive: false });
    res.status(200).json({
      success: true,
      message: "This Solo room is shut down mean isAlive property set to false",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
};
export const submitSoloRoom = async (req: Request, res: Response) => {
  try {
    const { roomId, type, mcqs, states, userId, time, isGuest } = req.body;

    if (!roomId || !type || !mcqs || !states || !time) {
      res
        .status(404)
        .json({ success: false, message: "Payload are not correct!" });
      return;
    }

    const history = await SoloRoomModel.findByIdAndUpdate(
      roomId,
      { isAlive: false },
      { new: true }
    );
    let historyId;
    if (history?.isHistoryId) {
      await HistoryModel.findByIdAndUpdate(history.isHistoryId, {
        mcqs: mcqs,
        quizIdAndValue: states,
        roomType: type,
        soloRoom: roomId,
        user: userId,
        time,
      });
      historyId = history.isHistoryId;
    } else {
      const newHistory = await HistoryModel.create({
        mcqs: mcqs,
        quizIdAndValue: states,
        roomType: type,
        soloRoom: roomId,
        user: userId,
        time,
      });
      historyId = newHistory._id;
    }
    res.status(201).json({ success: true, data: historyId });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const soloRoomResult = async (req: Request, res: Response) => {
  const { resultId } = req.params;
  try {
    if (!resultId) {
      res.status(404).json({ success: false, message: "Result Id not exist!" });
      return;
    }
    console.log(resultId);
    const data = await HistoryModel.findOne({
      _id: resultId,
    })
      .populate({ path: "mcqs" })
      .populate({ path: "user" })
      .populate({
        path: "soloRoom",
        select: "_id subjectId yearId topicId",
        populate: {
          path: "subjectId yearId topicId",
          select: "subject year topic",
        },
      });
    res.status(200).json({ success: true, data: data });
  } catch (error: any) {
    console.log(error);
    res.status(500).json({
      message: `Failed to get solo room results ${error.message ?? error}`,
    });
  }
};

export const getOnlineRoom = async (req: Request, res: Response) => {
  const { onlineRoomId, userId, isGuest, sessionId } = req.params as {
    onlineRoomId: string;
    userId: string;
    isGuest: string;
    sessionId: string;
  };
  try {
    if (!onlineRoomId || !userId) {
      res.status(404).json({
        success: false,
        message: "Params payload is not correct",
      });
      return;
    }
    const isOnlineRoomAlive = await OnlineRoomModel.findOne({
      _id: onlineRoomId,
    }).select("isUser1Alive isUser2Alive user1 user2");
    if (
      (!isOnlineRoomAlive?.isUser1Alive && !isOnlineRoomAlive?.isUser2Alive) ||
      !isOnlineRoomAlive
    ) {
      res.status(200).json({
        success: false,
        error: "room-expired",
        message: "This Online Room is not valid. Its expired!",
      });
      return;
    }
    if (isOnlineRoomAlive.user1 === userId && !isOnlineRoomAlive.isUser1Alive) {
      res.status(200).json({
        success: false,
        error: "room-expired",
        message: "This room is expired for user 1",
      });
      return;
    } else if (
      isOnlineRoomAlive.user2 === userId &&
      !isOnlineRoomAlive.isUser2Alive
    ) {
      res.status(200).json({
        success: false,
        error: "room-expired",
        message: "This room is expired for user 2",
      });
      return;
    }
    if (
      isOnlineRoomAlive.user1 !== userId &&
      isOnlineRoomAlive.user2 !== userId
    ) {
      res.status(200).json({
        success: false,
        error: "server-error",
        message: "User id is not matching any of the online room user id's",
      });
      return;
    }
    const onlineRoomData = await OnlineRoomModel.findOne({
      _id: onlineRoomId,
    })
      .populate({ path: "subjectId", select: "_id subject" })
      .populate({ path: "yearId", select: "_id year" })
      .populate({ path: "topicId", select: "_id topic" })
      .populate({ path: "quizes" });

    // Finding opponent
    // Validating that both user exist in online room
    if (!onlineRoomData?.user1 || !onlineRoomData.user2) {
      res.status(200).json({
        success: false,
        error: "server-error",
        message:
          "One user is missing in online room means its not completely updated!",
      });
      return;
    }
    let opponent;
    let remainingTime: string | null | undefined = "";
    if (onlineRoomData.user1 === userId) {
      const updatedOnlineRoom = await OnlineRoomModel.findOneAndUpdate(
        {
          _id: onlineRoomId,
          isEnded: false,
        },
        {
          user1SessionId: sessionId,
        },
        { new: true }
      );
      remainingTime = updatedOnlineRoom?.user1RemainingTime;
      if (isGuest === "true") {
        opponent = await GuestModel.findOne({
          _id: onlineRoomData.user2,
        });
      } else {
        opponent = await UserModel.findOne({
          clerkId: onlineRoomData.user2,
        });
      }
    } else if (onlineRoomData.user2 === userId) {
      const updatedOnlineRoom = await OnlineRoomModel.findOneAndUpdate(
        {
          _id: onlineRoomId,
          isEnded: false,
        },
        {
          user2SessionId: sessionId,
        },
        { new: true }
      );
      remainingTime = updatedOnlineRoom?.user2RemainingTime;
      if (isGuest === "true") {
        opponent = await GuestModel.findOne({
          _id: onlineRoomData.user1,
        });
      } else {
        opponent = await UserModel.findOne({
          clerkId: onlineRoomData.user1,
        });
      }
    }
    if (!opponent) {
      res.status(200).json({
        success: false,
        error: "opponent-left",
        message: "Can't find your opponent",
      });
      return;
    }
    res.status(200).json({
      success: true,
      data: { onlineRoomData, opponent, remainingTime },
    });
  } catch (error: any) {
    console.log(error);
    res
      .status(500)
      .json({ message: `Failed to get online room ${error.message ?? error}` });
  }
};

export const getOnlineResult = async (req: Request, res: Response) => {
  const { resultId, roomId, isGuest } = req.params;
  try {
    if (!resultId || !roomId) {
      res.status(404).json({
        success: false,
        message: "Result Id or Room Id is not exist!",
      });
      return;
    }
    const findOpponentHistory = await OnlineHistoryModel.findOne({
      roomId,
      _id: { $ne: resultId },
    })
      .populate({ path: "mcqs" })
      .populate({
        path: "roomId",
        select: "_id subjectId yearId topicId quizType",
        populate: {
          path: "subjectId yearId topicId",
          select: "subject year topic",
        },
      });
    const myHistory = await OnlineHistoryModel.findOne({
      roomId,
      _id: resultId,
    })
      .populate({ path: "mcqs" })
      .populate({
        path: "roomId",
        select: "_id subjectId yearId topicId quizType",
        populate: {
          path: "subjectId yearId topicId",
          select: "subject year topic",
        },
      });

    const findOnlineRoom = await OnlineRoomModel.findOneAndUpdate(
      {
        _id: roomId,
      },
      {
        isEnded: true,
      },
      {
        new: true,
      }
    );
    if (findOnlineRoom?.user1 === myHistory?.user) {
      await OnlineRoomModel.findOneAndUpdate(
        {
          _id: roomId,
        },
        {
          quizIdAndValue1: myHistory?.quizIdAndValue,
          quizIdAndValue2: findOpponentHistory?.quizIdAndValue,
        }
      );
    } else {
      await OnlineRoomModel.findOneAndUpdate(
        {
          _id: roomId,
        },
        {
          quizIdAndValue2: myHistory?.quizIdAndValue,
          quizIdAndValue1: findOpponentHistory?.quizIdAndValue,
        }
      );
    }
    if (!findOnlineRoom) {
      res.status(400).json({ success: false, message: "Room is expired!" });
      return;
    }

    let opponentUser;
    if (findOnlineRoom.user1 === myHistory?.user) {
      if (isGuest === "true") {
        opponentUser = await GuestModel.findOne({
          _id: findOnlineRoom.user2,
        });
      } else {
        opponentUser = await UserModel.findOne({
          clerkId: findOnlineRoom.user2,
        }).select("fullName imageUrl clerkId");
      }
    } else {
      if (isGuest === "true") {
        opponentUser = await GuestModel.findOne({
          clerkId: findOnlineRoom.user1,
        });
      } else {
        opponentUser = await UserModel.findOne({
          clerkId: findOnlineRoom.user1,
        }).select("fullName imageUrl clerkId");
      }
    }

    if (findOpponentHistory) {
      const resignation = findOnlineRoom.resignation ?? "";
      res.status(200).json({
        success: true,
        isPending: false,
        data: {
          myHistory,
          opponentUser,
          opponentHistory: findOpponentHistory,
          resignation,
        },
      });
    } else {
      res.status(200).json({
        success: true,
        isPending: true,
        data: {
          myData: myHistory,
          opponentUser,
          time: {
            fullTime: findOnlineRoom.seconds,
            timeTaken: myHistory?.time,
          },
        },
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
};
