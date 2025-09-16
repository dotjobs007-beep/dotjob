import { Request, Response, NextFunction } from "express";
import { ZodObject } from "zod";

export const validateBody = (schema: ZodObject) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (err: any) {
      return res.status(400).json({
        error: "ValidationError",
        details: err.errors.map((e: any) => e.message),
      });
    }
  };
