import { prisma } from "../lib/client.js";
import type { Request, Response } from "express";
import { makeResponse } from "../utils/response.js";
import { StatusCodes } from "http-status-codes";

export const getPosts = async (req: Request, res: Response) => {
  const result = await prisma.post.findMany();
  res.status(StatusCodes.OK).json(makeResponse(StatusCodes.OK, result));
};

export const detailPost = async (req: Request, res: Response) => {
  const id = Number(req.params.id);

  if (!id || isNaN(id) || !Number.isInteger(id)) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json(makeResponse(StatusCodes.BAD_REQUEST, null));
  }

  const result = await prisma.post.findUnique({
    where: { id },
  });

  if (!result) {
    res
      .status(StatusCodes.NOT_FOUND)
      .json(makeResponse(StatusCodes.NOT_FOUND, null));
  }

  res.status(StatusCodes.OK).json(makeResponse(StatusCodes.OK, result));
};

export const createPost = async (req: Request, res: Response) => {
  const { user_id, title, content } = req.body;
  const result = await prisma.post.create({
    data: { title, content, author: { connect: { id: user_id } } },
  });

  res
    .status(StatusCodes.CREATED)
    .json(makeResponse(StatusCodes.CREATED, result));
};

export const deletePost = async (req: Request, res: Response) => {
  const id = Number(req.params.id);

  if (!id || isNaN(id) || !Number.isInteger(id)) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json(makeResponse(StatusCodes.BAD_REQUEST, null));
  }

  await prisma.post.delete({ where: { id } });

  res
    .status(StatusCodes.NO_CONTENT)
    .json(makeResponse(StatusCodes.NO_CONTENT, null));
};

export const updatePost = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const { user_id, title, content } = req.body;

  if (!id || isNaN(id) || !Number.isInteger(id)) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json(makeResponse(StatusCodes.BAD_REQUEST, null));
  }

  const result = await prisma.post.update({
    where: { id },
    data: { title, content, author: { connect: { id: user_id } } },
  });

  res.status(StatusCodes.OK).json(makeResponse(StatusCodes.OK, result));
};
