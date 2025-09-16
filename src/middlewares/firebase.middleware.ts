import { Request, Response, NextFunction } from "express";
import admin from "../config/firebase";

export async function firebaseAuth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ status: "error", message: "No token provided", code: 401 });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken; // attach user info to request
    next();
  } catch (error) {
    return res.status(401).json({ status: "error", message: "Invalid or expired token", code: 401 });
  }
}
