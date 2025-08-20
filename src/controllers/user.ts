import { prisma } from "../lib/client.js";
import type { Request, Response } from "express";
import { makeResponse } from "../utils/response.js";
import { StatusCodes } from "http-status-codes";

export const getUsers = async (req: Request, res: Response) => {
  const result = await prisma.user.findMany();
  res.status(StatusCodes.OK).json(makeResponse(StatusCodes.OK, result));
};

export const detailUser = async (req: Request, res: Response) => {
  const id = Number(req.params.id);

  if (!id || isNaN(id) || !Number.isInteger(id)) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json(makeResponse(StatusCodes.BAD_REQUEST, null));
  }

  const result = await prisma.user.findUnique({
    where: { id },
  });

  if (!result) {
    res
      .status(StatusCodes.NOT_FOUND)
      .json(makeResponse(StatusCodes.NOT_FOUND, null));
  }

  res.status(StatusCodes.OK).json(makeResponse(StatusCodes.OK, result));
};

export const createUser = async (req: Request, res: Response) => {
  const { name } = req.body;
  const result = await prisma.user.create({
    data: { name: name },
  });

  res
    .status(StatusCodes.CREATED)
    .json(makeResponse(StatusCodes.CREATED, result));
};

export const deleteUser = async (req: Request, res: Response) => {
  const id = Number(req.params.id);

  if (!id || isNaN(id) || !Number.isInteger(id)) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json(makeResponse(StatusCodes.BAD_REQUEST, null));
  }

  await prisma.user.delete({ where: { id } });

  res
    .status(StatusCodes.NO_CONTENT)
    .json(makeResponse(StatusCodes.NO_CONTENT, null));
};

export const updateUser = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const { name } = req.body;

  if (!id || isNaN(id) || !Number.isInteger(id)) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json(makeResponse(StatusCodes.BAD_REQUEST, null));
  }

  const result = await prisma.user.update({
    where: { id },
    data: { name },
  });

  res.status(StatusCodes.OK).json(makeResponse(StatusCodes.OK, result));
};
