import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { Request, Response, NextFunction } from "express";

export function validationMiddleware<T extends object>(dtoClass: new () => T) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const dtoObj = plainToInstance(dtoClass, req.body);
    const errors = await validate(dtoObj as object);

    if (errors.length > 0) {
      const firstError = errors[0];
      const firstMessage = firstError.constraints
        ? Object.values(firstError.constraints)[0]
        : "Validation failed";

      return res.status(400).json({
        status: "error",
        code: 400,
        message: firstMessage,
      });
    }

    next();
  };
}
