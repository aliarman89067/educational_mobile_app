import express from "express";
import {
  createSoloQuiz,
  getQuizByCategory,
  getSoloRoom,
} from "../controllers/quizController";
import subjectModel from "../models/Subject";
import topicModel from "../models/Topic";
import yearModel from "../models/Year";

const router = express.Router();

router.get("/get-all/:quizType", getQuizByCategory);
router.post("/solo-player", createSoloQuiz);
router.get("/get/solo-room/:soloRoomId", getSoloRoom);

export default router;
