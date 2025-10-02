// src/app.ts
import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
// Optional Sentry integration (loaded dynamically so missing package won't crash)
let Sentry: any = null;
import connectDB from "./config/database";
import { errorHandler } from "./middlewares/errorHandler";
import cookieParser from "cookie-parser";
import userRoutes from "./routes/user.routes";
import jobRoutes from "./routes/job.routes"
import clientLogs from "./routes/clientLogs.routes";
import { validateSecret } from "./middlewares/validate_secret.middleware";
import { validateToken } from "./middlewares/validate_token";
import publicRoutes from "./routes/public.routes";


dotenv.config();
connectDB();

// Initialize Sentry only if DSN is provided. Use dynamic require to avoid hard dependency.
try {
  if (process.env.SENTRY_DSN) {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    Sentry = require("@sentry/node");
    Sentry.init({
      dsn: process.env.SENTRY_DSN,
      environment: process.env.NODE_ENV || "development",
    });
  }
} catch (e: any) {
  Sentry = null;
}

const app = express();

// Middleware
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:3001",
  "https://dotjob-i4y3.onrender.com",
  "https://r71vnd5h-3000.uks1.devtunnels.ms",
  // Local LAN origins for testing from mobile devices on your Wi-Fi
  "http://192.168.2.100:3000",
  "http://192.168.2.100:3001"
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
app.use("/api/job", validateSecret, validateToken, jobRoutes);
app.use("/api/public", publicRoutes);
// client logs route (no secret) - used to capture mobile/browser logs for debugging
app.use("/api/client", clientLogs);

app.use(errorHandler);

app.use((req, res, next) => {
    res.status(404).json({
    status: "error",
    code: 404,
    message: "Not Found",
  });
});


export default app;
