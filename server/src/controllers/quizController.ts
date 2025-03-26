import { Request, Response } from "express";
import subjectModel from "../models/Subject";

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
