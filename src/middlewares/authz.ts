import type { Request, Response, NextFunction } from "express";
import { verifyJWT } from "../utils/security.js";
import { StatusCodes } from "http-status-codes";
import { AppError } from "./server-error.js";
import { prisma } from "../lib/client.js";

export type JwtUser = {
  sub: string;
  email: string;
  role: "USER" | "SUPPLIER" | "ADMIN";
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

export const authorize = (roles: Array<"USER" | "SUPPLIER" | "ADMIN">) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user as JwtUser | undefined;
    if (!user) throw new AppError(StatusCodes.UNAUTHORIZED, "Unauthorized");
    if (!roles.includes(user.role)) {
      throw new AppError(StatusCodes.FORBIDDEN, "Access forbidden");
    }
    next();
  };
};

export const authorizeSupplier = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const productId = Number(req.params.productId);
    const userId = Number(((req as any).user as JwtUser).sub);

    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: { userId: true },
    });

    if (!product) {
      throw new AppError(StatusCodes.NOT_FOUND, "Product not found");
    }

    if (product.userId !== userId) {
      throw new AppError(
        StatusCodes.FORBIDDEN,
        "Access forbidden: Not your product",
      );
    }

    next();
  } catch (error) {
    next(error);
  }
};
