import { Request, Response, NextFunction } from "express";
import { ZodObject, ZodError } from "zod";
import AppError from "../utils/appError";
import { DecodedToken } from "../utils/tokenGenerator";
import jwt from "jsonwebtoken";


export const validateBody = (schema: ZodObject<any>) =>
  (req: Request, _res: Response, next: NextFunction) => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (err: any) {
      if (err instanceof ZodError) {
        // Combine all issues into a single string or array
        const errors = err.issues.map((issue) => {
          const field = issue.path.join(".") || "field";
          return `${field}: ${issue.message}`;
        });

        // Throw custom AppError with status 400
        throw new AppError(errors.join(", "), 400);
      }

      // If some other error occurs, wrap it in AppError
      throw new AppError("Internal Server Error", 500);
    }
  };


  export function validateAuthorization(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const token = req.cookies?.token;
  if (!token) {
    return res
      .status(401)
      .json({ error: "error", message: "No token found", code: 401 });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as DecodedToken;

    if (decoded.exp && decoded.exp * 1000 < Date.now()) {
      return res
        .status(401)
        .json({ error: "error", message: "Token expired", code: 401 });
    }
    req.userId = decoded.id;

    return next();
  } catch (err) {
    return res
      .status(401)
      .json({ error: "error", message: "Invalid or expired token", code: 401 });
  }
}
