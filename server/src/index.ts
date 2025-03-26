// Lib Imports
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import helmet from "helmet";
import mongoose from "mongoose";
import dotEnv from "dotenv";
import { createServer } from "http";
import { Server } from "socket.io";
// Route Imports
import quizRoutes from "./routes/quizRoute";
import "./models/Topic";
import "./models/Year";
import "./models/Subject";

dotEnv.config();

const app = express();
const server = createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

// Middleware
app.use(express.json());
app.use(
  cors({
    origin: "*",
  })
);
app.use(cookieParser());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
// Routes
app.use("/quiz", quizRoutes);

app.get("/", (req, res) => {
  res.status(200).json({ message: "Hello World" });
});

const PORT = process.env.PORT || 4001;

mongoose
  .connect(process.env.MONGO_URI!)
  .then(() => {
    server.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error: any) => {
    console.log(`Failed to connect database ${error.message ?? error}`);
  });
