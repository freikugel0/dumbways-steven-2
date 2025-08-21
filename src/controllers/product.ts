import { prisma } from "../lib/client.js";
import type { Request, Response } from "express";
import { makePaginationResponse, makeResponse } from "../utils/response.js";
import { StatusCodes } from "http-status-codes";

export const getProducts = async (req: Request, res: Response) => {
  // Get query params
  const { sortBy, order, minPrice, maxPrice, limit, offset } = req.query;

  // Create price range filters
  const filters: any = {};
  if (minPrice) filters.price = { gte: parseFloat(minPrice as string) };
  if (maxPrice) {
    filters.price = {
      ...(filters.price || {}),
      lte: parseFloat(maxPrice as string),
    };
  }

  // NOTE:
  // limit = take
  // offset = skip
  const limitNum = Number(limit);
  const pageNum = Number(offset);

  // Validate pagination value
  const limitSafe = !isNaN(limitNum) && limitNum > 0 ? limitNum : 50;
  const pageSafe = !isNaN(pageNum) && pageNum >= 0 ? pageNum : 1;

  // Get data
  const result = await prisma.product.findMany({
    where: filters,
    orderBy: {
      [sortBy as string]: order as "asc" | "desc",
    },
    take: limitSafe,
    skip: (pageSafe - 1) * limitSafe, // prisma need zero based index
  });

  // Get total data
  const total = await prisma.product.count({ where: filters });

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

export const detailProduct = async (req: Request, res: Response) => {
  const id = Number(req.params.id);

  // Validate id params
  if (!id || isNaN(id) || !Number.isInteger(id)) {
    return res.status(StatusCodes.BAD_REQUEST).json(
      makeResponse(StatusCodes.BAD_REQUEST, {
        error: "Invalid product id in url param",
      }),
    );
  }

  const result = await prisma.product.findUnique({
    where: { id },
  });

  if (!result) {
    res.status(StatusCodes.NOT_FOUND).json(
      makeResponse(StatusCodes.NOT_FOUND, {
        error: "Product not found",
      }),
    );
  }

  res.status(StatusCodes.OK).json(makeResponse(StatusCodes.OK, result));
};

export const createProduct = async (req: Request, res: Response) => {
  // Get request body
  const { name, price, stock } = req.body;

  /**
   * Validate all props
   */
  if (!name || typeof name !== "string") {
    return res.status(StatusCodes.BAD_REQUEST).json(
      makeResponse(StatusCodes.BAD_REQUEST, {
        error: "'name' key is missing",
      }),
    );
  }

  const priceNum = Number(price);
  if (isNaN(priceNum) || priceNum <= 0) {
    return res.status(StatusCodes.BAD_REQUEST).json(
      makeResponse(StatusCodes.BAD_REQUEST, {
        error: "'price' must be a valid positive number",
      }),
    );
  }

  const stockNum = stock !== undefined ? Number(stock) : 0;
  if (isNaN(stockNum) || stockNum < 0) {
    return res.status(StatusCodes.BAD_REQUEST).json(
      makeResponse(StatusCodes.BAD_REQUEST, {
        error: "'stock' must be a non-negative number",
      }),
    );
  }

  // Create data
  const result = await prisma.product.create({
    data: {
      name: name,
      price: priceNum,
      stock: stockNum,
    },
  });

  res
    .status(StatusCodes.CREATED)
    .json(makeResponse(StatusCodes.CREATED, result));
};

export const deleteProduct = async (req: Request, res: Response) => {
  // Get id in param
  const id = Number(req.params.id);

  // Validate id params
  if (!id || isNaN(id) || !Number.isInteger(id)) {
    return res.status(StatusCodes.BAD_REQUEST).json(
      makeResponse(StatusCodes.BAD_REQUEST, {
        error: "Invalid product id in url param",
      }),
    );
  }

  await prisma.product.delete({ where: { id } });

  res
    .status(StatusCodes.NO_CONTENT)
    .json(makeResponse(StatusCodes.NO_CONTENT, null));
};

export const updateProduct = async (req: Request, res: Response) => {
  // Get id in param
  const id = Number(req.params.id);

  // Get request body
  const { name, price, stock } = req.body;

  /**
   * Validate all props
   */

  if (!id || isNaN(id) || !Number.isInteger(id)) {
    return res.status(StatusCodes.BAD_REQUEST).json(
      makeResponse(StatusCodes.BAD_REQUEST, {
        error: "Invalid product id in url param",
      }),
    );
  }

  if (!name || typeof name !== "string") {
    return res.status(StatusCodes.BAD_REQUEST).json(
      makeResponse(StatusCodes.BAD_REQUEST, {
        error: "'name' key is missing",
      }),
    );
  }

  const priceNum = Number(price);
  if (isNaN(priceNum) || priceNum <= 0) {
    return res.status(StatusCodes.BAD_REQUEST).json(
      makeResponse(StatusCodes.BAD_REQUEST, {
        error: "'price' must be a valid positive number",
      }),
    );
  }

  const stockNum = stock !== undefined ? Number(stock) : 0;
  if (isNaN(stockNum) || stockNum < 0) {
    return res.status(StatusCodes.BAD_REQUEST).json(
      makeResponse(StatusCodes.BAD_REQUEST, {
        error: "'stock' must be a non-negative number",
      }),
    );
  }

  const result = await prisma.product.update({
    where: { id },
    data: { name, price },
  });

  res.status(StatusCodes.OK).json(makeResponse(StatusCodes.OK, result));
};
