import { prisma } from "../lib/client.js";
import type { Request, Response } from "express";
import { makeResponse } from "../utils/response.js";
import { StatusCodes } from "http-status-codes";

export const getProducts = async (req: Request, res: Response) => {
  const result = await prisma.product.findMany();
  res.status(StatusCodes.OK).json(makeResponse(StatusCodes.OK, result));
};

export const detailProduct = async (req: Request, res: Response) => {
  const id = Number(req.params.id);

  if (!id || isNaN(id) || !Number.isInteger(id)) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json(makeResponse(StatusCodes.BAD_REQUEST, null));
  }

  const result = await prisma.product.findUnique({
    where: { id },
  });

  if (!result) {
    res
      .status(StatusCodes.NOT_FOUND)
      .json(makeResponse(StatusCodes.NOT_FOUND, null));
  }

  res.status(StatusCodes.OK).json(makeResponse(StatusCodes.OK, result));
};

export const createProduct = async (req: Request, res: Response) => {
  const { name, price } = req.body;
  const result = await prisma.product.create({
    data: {
      name: name,
      price: parseFloat(price),
    },
  });

  res
    .status(StatusCodes.CREATED)
    .json(makeResponse(StatusCodes.CREATED, result));
};

export const deleteProduct = async (req: Request, res: Response) => {
  const id = Number(req.params.id);

  if (!id || isNaN(id) || !Number.isInteger(id)) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json(makeResponse(StatusCodes.BAD_REQUEST, null));
  }

  await prisma.product.delete({
    where: {
      id,
    },
  });

  res
    .status(StatusCodes.NO_CONTENT)
    .json(makeResponse(StatusCodes.NO_CONTENT, null));
};

export const updateProduct = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const { name, price } = req.body;

  if (!id || isNaN(id) || !Number.isInteger(id)) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json(makeResponse(StatusCodes.BAD_REQUEST, null));
  }

  const result = await prisma.product.update({
    where: {
      id,
    },
    data: {
      name,
      price,
    },
  });

  res.status(StatusCodes.OK).json(makeResponse(StatusCodes.OK, result));
};
