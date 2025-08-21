import { prisma } from "../lib/client.js";
import type { Request, Response } from "express";
import { makePaginationResponse, makeResponse } from "../utils/response.js";
import { StatusCodes } from "http-status-codes";

export const getPosts = async (req: Request, res: Response) => {
  // Get query params
  const { sortBy, order, category, limit, offset } = req.query;

  // Create category filters
  const filters: any = {};
  if (category) filters.category = { name: String(category) };

  // NOTE:
  // limit = take
  // offset = skip
  const limitNum = Number(limit);
  const pageNum = Number(offset);

  // Validate pagination value
  const limitSafe = !isNaN(limitNum) && limitNum > 0 ? limitNum : 50;
  const pageSafe = !isNaN(pageNum) && pageNum >= 0 ? pageNum : 1;

  // Get data
  const result = await prisma.post.findMany({
    where: filters,
    orderBy: {
      [sortBy as string]: order as "asc" | "desc",
    },
    take: limitSafe,
    skip: (pageSafe - 1) * limitSafe, // prisma need zero based index
  });

  // Get total data
  const total = await prisma.post.count({ where: filters });

  res.status(StatusCodes.OK).json(
    makeResponse(
      StatusCodes.OK,
      makePaginationResponse({
        limit: limitSafe,
        page: pageSafe,
        total,
        data: result,
      }),
    ),
  );
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
