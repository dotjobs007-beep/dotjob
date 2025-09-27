import {Request, Response, NextFunction } from "express";
import jwt, { Secret, SignOptions, JwtPayload } from "jsonwebtoken";
import { DecodedToken } from "../utils/tokenGenerator";



export function validateToken(req: Request, res: Response, next: NextFunction) {
  // 1️⃣ Try to get token from Authorization header
  const authHeader = req.headers.authorization;
  const tokenFromHeader = authHeader && authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : null;

  // 2️⃣ Optional: fallback to cookie token
  const tokenFromCookie = req.cookies?.token;

  const token = tokenFromHeader || tokenFromCookie;

  if (!token) {
    return res.status(401).json({ 
      error: "Unauthorized", 
      message: "No token provided", 
      code: 401 
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as DecodedToken;

    // Optional: check expiry manually (jwt.verify already throws on expired token)
    if (decoded.exp && decoded.exp * 1000 < Date.now()) {
      return res.status(401).json({ 
        error: "Unauthorized", 
        message: "Token expired", 
        code: 401 
      });
    }

    // Attach user info to request for later middleware/controllers
    req.userId = decoded.id
    next();
  } catch (err) {
    console.error("[Auth] Token validation failed:", err);
    return res.status(401).json({ 
      error: "Unauthorized", 
      message: "Invalid token", 
      code: 401 
    });
  }
}