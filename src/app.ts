// src/app.ts
import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import connectDB from "./config/database";
import { errorHandler } from "./middlewares/errorHandler";
import cookieParser from "cookie-parser";
import userRoutes from "./routes/user.routes";
import jobRoutes from "./routes/job.routes"
import { validateSecret } from "./middlewares/validate_secret.middleware";
import { validateAuthorization } from "./middlewares/validator";
import { sendResponse } from "./utils/responseHandler";


dotenv.config();
connectDB();

const app = express();

// Middleware
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:3001",
  "https://dotjob-i4y3.onrender.com"
];

app.use(cors({
  origin: (origin, callback) => {
    // allow requests with no origin (like mobile apps or curl)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      callback(null, true); // allow this origin
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true, // allow cookies / credentials
}));

app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser());

// Health check route
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    code: 200,
    message: "Server is healthy 🚀",
    uptime: process.uptime(),
    timestamp: new Date(),
  });
});

// Routes
app.use("/api/user", validateSecret, userRoutes);
app.use("/api/job", validateSecret, validateAuthorization,jobRoutes);

app.use(errorHandler);

app.use((req, res, next) => {
  console.log("404 handler reached for:", req.originalUrl);
  return sendResponse(res, 404, "route not found");
});


export default app;
