import { Response } from "express";
import jwt, { Secret, SignOptions, JwtPayload } from "jsonwebtoken";

export interface TokenPayload {
  id: string;
  role?: string;
}

export function generateToken(
  res: Response,
  payload: TokenPayload,
  expiresIn: SignOptions["expiresIn"] = "7d" // ✅ matches jsonwebtoken types
): string {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in environment variables");
  }

  const secret: Secret = process.env.JWT_SECRET as Secret;

  const options: SignOptions = { expiresIn };

  const token = jwt.sign(payload, secret, options);

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // ✅ secure on production
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", // ✅ allow cross-site
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  return token;
}

export function logoutUser(res: Response) {
  // Clear the JWT cookie
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // ✅ secure on production
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", // ✅ allow cross-site
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
}
export interface DecodedToken extends JwtPayload {
  id: string;
  role?: string;
}
