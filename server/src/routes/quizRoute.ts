import express from "express";
import {
  createSoloQuiz,
  getQuizByCategory,
  getSoloRoom,
  leaveSoloRoom,
  submitSoloRoom,
  soloRoomResult,
} from "../controllers/quizController";

const router = express.Router();

router.get("/get-all/:quizType", getQuizByCategory);
router.post("/solo-player", createSoloQuiz);
router.get("/get/solo-room/:soloRoomId", getSoloRoom);
router.put("/leave/solo-room/:roomId", leaveSoloRoom);
router.post("/submit/solo-room", submitSoloRoom);
router.get("/get-solo-result/:resultId", soloRoomResult);

export default router;
