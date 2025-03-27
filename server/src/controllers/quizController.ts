import { Request, Response } from "express";
import subjectModel from "../models/Subject";
import topicModel from "../models/Topic";
import yearModel from "../models/Year";
import SoloRoomModel from "../models/SoloRoom";

export const getQuizByCategory = async (req: Request, res: Response) => {
  try {
    const { quizType } = req.params;
    let data;
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
    res.status(200).json({ success: true, data: data });
  } catch (error) {
    console.log(error);
  }
};

export const createSoloQuiz = async (req: Request, res: Response) => {
  try {
    const { subjectId, yearIdOrTopicId, quizLimit, quizType, seconds } =
      req.body;
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
