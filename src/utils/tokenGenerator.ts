import { NextFunction, Response, Request } from "express";
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
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge:
      typeof expiresIn === "string"
        ? 7 * 24 * 60 * 60 * 1000 
        : expiresIn * 1000,
  });

  return token;
}


interface DecodedToken extends JwtPayload {
  id: string;
  role?: string;
}

export function validateAuthorization(req: Request, res: Response, next: NextFunction) {
  const token = req.cookies?.token;
  console.log(token)
  if (!token) {
    return res.status(401).json({ error: "error", message: "No token found", code: 401 });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as DecodedToken;

    if (decoded.exp && decoded.exp * 1000 < Date.now()) {
      return res.status(401).json({ error: "error", message: "Token expired", code: 401 });
    }
    req.userId = decoded.id;

    return next();
  } catch (err) {
    return res.status(401).json({ error: "error", message: "Invalid or expired token", code: 401 });
  }
}