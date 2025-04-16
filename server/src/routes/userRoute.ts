import bodyParser from "body-parser";
import express from "express";
import { createUserWebhook, getAllUser } from "../controllers/userRoute";

const router = express.Router();

router.post(
  "/",
  bodyParser.raw({ type: "application/json" }),
  createUserWebhook
);
router.get("/all-users/:userId", getAllUser);

export default router;
