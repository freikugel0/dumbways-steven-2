import type { Request, Response, NextFunction } from "express";
import { verifyJWT } from "../utils/security.js";
import { StatusCodes } from "http-status-codes";
import { AppError } from "./server-error.js";

export type JwtUser = {
  sub: string;
  email: string;
  role: "USER" | "ADMIN";
  iat: number;
  exp: number;
};

export const requireAuth = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    throw new AppError(
      StatusCodes.UNAUTHORIZED,
      "Missing or invalid authorization",
    );
  }

  const token = header.slice("Bearer ".length);
  try {
    const decoded = verifyJWT<JwtUser>(token);
    (req as any).user = decoded;
    next();
  } catch {
    throw new AppError(StatusCodes.UNAUTHORIZED, "Invalid or expired token");
  }
};

export const authorize = (roles: Array<"USER" | "ADMIN">) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user as JwtUser | undefined;
    if (!user) throw new AppError(StatusCodes.UNAUTHORIZED, "Unauthorized");
    if (!roles.includes(user.role)) {
      throw new AppError(StatusCodes.FORBIDDEN, "Access forbidden");
    }
    next();
  };
};
