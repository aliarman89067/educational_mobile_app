import bodyParser from "body-parser";
import express from "express";
import { createUserWebhook, getUsers } from "../controllers/userRoute";

const router = express.Router();

router.post(
  "/",
  bodyParser.raw({ type: "application/json" }),
  createUserWebhook
);
router.get("/users/:name/:userId", getUsers);

export default router;
