import { Request, Response, NextFunction } from "express";
export async function validateSecret(req: Request, res: Response, next: NextFunction) {
  const authSecret = req.headers.secret;
  if (!authSecret) {
    return res.status(401).json({ status: "error", message: "No secret provided", code: 401 });
  }

  if (authSecret != process.env.THIRD_PART_SECRET) {
        return res.status(401).json({ status: "error", message: "Invalid secret", code: 401 });
  }
 next()
}
