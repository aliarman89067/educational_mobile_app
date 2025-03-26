import express from "express";
import { getQuizByCategory } from "../controllers/quizController";
import subjectModel from "../models/Subject";
import topicModel from "../models/Topic";
import yearModel from "../models/Year";

const router = express.Router();

// Get all Quiz for QuizGrid Function
router.get("/get-all/:quizType", getQuizByCategory);

export default router;
