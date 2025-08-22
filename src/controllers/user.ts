import { StatusCodes } from "http-status-codes";
import { prisma } from "../lib/client.js";
import type { Request, Response } from "express";
import { makeResponse } from "../utils/response.js";

export const getUsers = async (req: Request, res: Response) => {
  const result = await prisma.user.findMany();
  res.status(StatusCodes.OK).json(makeResponse(StatusCodes.OK, result));
};
