import type { Request, Response } from "express";
import type { JwtUser } from "../middlewares/authz.js";
import { prisma } from "../lib/client.js";
import { StatusCodes } from "http-status-codes";
import { makeResponse } from "../utils/response.js";
import { AppError } from "../middlewares/server-error.js";

export const getMe = async (req: Request, res: Response) => {
  const user = (req as any).user as JwtUser;

  // Get user details
  const userDetails = await prisma.user.findUnique({
    where: { id: Number(user.sub) },
    select: {
      id: true,
      email: true,
      password: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!userDetails) {
    throw new AppError(StatusCodes.BAD_REQUEST, "User is not found");
  }

  return res
    .status(StatusCodes.OK)
    .json(makeResponse(StatusCodes.OK, userDetails));
};

export const getAllUsers = async (req: Request, res: Response) => {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    },
  });
  return res.status(StatusCodes.OK).json(makeResponse(StatusCodes.OK, users));
};
