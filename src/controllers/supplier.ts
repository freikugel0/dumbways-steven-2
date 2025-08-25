import type { Request, Response } from "express";
import { prisma } from "../lib/client.js";
import type { JwtUser } from "../middlewares/authz.js";
import { StatusCodes } from "http-status-codes";
import { makeResponse } from "../utils/response.js";

export const getProducts = async (req: Request, res: Response) => {
  const user = (req as any).user as JwtUser;

  const products = await prisma.product.findMany({
    where: {
      userId: Number(user.sub),
    },
    select: {
      id: true,
      userId: true,
      name: true,
      stocks: true,
    },
  });

  return res
    .status(StatusCodes.OK)
    .json(makeResponse(StatusCodes.OK, products));
};

export const createProduct = async (req: Request, res: Response) => {
  const user = (req as any).user as JwtUser;
  const { name, stocks } = req.body;

  const products = await prisma.product.create({
    data: { userId: Number(user.sub), name, stocks },
  });

  return res
    .status(StatusCodes.CREATED)
    .json(makeResponse(StatusCodes.CREATED, products));
};

export const updateProduct = async (req: Request, res: Response) => {
  const productId = req.params.productId;
  const { name, stocks } = req.body;

  const products = await prisma.product.update({
    where: { id: Number(productId) },
    data: { name, stocks },
  });

  return res
    .status(StatusCodes.OK)
    .json(makeResponse(StatusCodes.OK, products));
};
