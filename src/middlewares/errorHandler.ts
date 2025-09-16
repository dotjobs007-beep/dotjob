import { Request, Response, NextFunction } from "express";
import AppError from "../utils/appError";

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  // If it's our custom AppError
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      status: "error",
      code: err.statusCode,
      message: err.message,
    });
  }

  // Otherwise, fallback to generic 500
  console.error("UNEXPECTED ERROR:", err);

  return res.status(500).json({
    status: "error",
    code: 500,
    message: "Something went wrong",
  });
}
