import { prisma } from "../lib/client.js";
import type { Request, Response } from "express";
import { makePaginationResponse, makeResponse } from "../utils/response.js";
import { StatusCodes } from "http-status-codes";

export const getPostComments = async (req: Request, res: Response) => {
  // Get post id in url param
  const postId = Number(req.params.postId);

  // Validate id params
  if (!postId || isNaN(postId) || !Number.isInteger(postId)) {
    return res.status(StatusCodes.BAD_REQUEST).json(
      makeResponse(StatusCodes.BAD_REQUEST, {
        error: "Invalid post id in url param",
      }),
    );
  }

  // Get query params
  const { sortBy, order, limit, offset } = req.query;

  // NOTE:
  // limit = take
  // offset = skip
  const limitNum = Number(limit);
  const pageNum = Number(offset);

  // Validate pagination value
  const limitSafe = !isNaN(limitNum) && limitNum > 0 ? limitNum : 50;
  const pageSafe = !isNaN(pageNum) && pageNum >= 0 ? pageNum : 1;

  // Get data
  const result = await prisma.comment.findMany({
    where: { postId },
    orderBy: {
      [sortBy as string]: order as "asc" | "desc",
    },
    take: limitSafe,
    skip: (pageSafe - 1) * limitSafe, // prisma need zero based index
  });

  // Get total data
  const total = await prisma.comment.count();

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

export const getCommentsSummary = async (req: Request, res: Response) => {
  // Get query params
  const { sortBy, orderBy, minCount, limit, offset } = req.query;

  // Create count range filters
  const minCountNum = Number(minCount);

  const minCountSafe = !isNaN(minCountNum) && minCountNum > 0 ? minCountNum : 1;

  // NOTE:
  // limit = take
  // offset = skip
  const limitNum = Number(limit);
  const pageNum = Number(offset);

  // Validate pagination value
  const limitSafe = !isNaN(limitNum) && limitNum > 0 ? limitNum : 50;
  const pageSafe = !isNaN(pageNum) && pageNum >= 0 ? pageNum : 1;
  const sortBySafe = sortBy === "postId" ? "postId" : undefined;
  const orderBySafe: "asc" | "desc" = orderBy === "desc" ? "desc" : "asc";

  // Get total result without skip/take
  const totalResult = await prisma.comment.groupBy({
    by: ["postId"],
    _count: { id: true },
    having: {
      postId: {
        _count: {
          gte: minCountSafe,
        },
      },
    },
  });
  const total = totalResult.length;

  // Get data
  const result = await prisma.comment.groupBy({
    by: ["postId"],
    _count: { id: true },
    having: {
      postId: {
        _count: {
          gte: minCountSafe,
        },
      },
    },
    orderBy: sortBySafe
      ? {
          [sortBySafe]: orderBySafe,
        }
      : { postId: "asc" },
    take: limitSafe,
    skip: (pageSafe - 1) * limitSafe, // prisma need zero based index
  });

  // Format into more readable response
  const formattedResult = await Promise.all(
    result.map(async (r) => {
      return {
        postId: r.postId,
        commentCount: r._count.id,
      };
    }),
  );

  res.status(StatusCodes.OK).json(
    makeResponse(
      StatusCodes.OK,
      makePaginationResponse({
        limit: limitSafe,
        page: pageSafe,
        total,
        data: formattedResult,
      }),
    ),
  );
};
