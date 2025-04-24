import express from "express";
import {
  createUser,
  getUsers,
  migrateUser,
  migrateUserOnline,
  updateSession,
  getUserReceivedRequest,
} from "../controllers/userController";

const router = express.Router();

// router.post(
//   "/",
//   bodyParser.raw({ type: "application/json" }),
//   createUserWebhook
// );
router.post("/", createUser);
router.post("/migration", migrateUser);
router.post("/migration-online", migrateUserOnline);
router.get("/:name/:userId", getUsers);
router.put("/updateSession", updateSession);
router.post("/received-request", getUserReceivedRequest);

export default router;
