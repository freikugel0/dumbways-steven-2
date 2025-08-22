import type { Request, Response, NextFunction } from "express";
import { prisma } from "../lib/client.js";
import { StatusCodes } from "http-status-codes";
import { makeResponse } from "../utils/response.js";

export const getStocks = async (req: Request, res: Response) => {
  const result = await prisma.product.findMany();
  res.status(StatusCodes.OK).json(makeResponse(StatusCodes.OK, result));
};

export const supplierStock = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { updates } = req.body;

  try {
    if (!Array.isArray(updates) || updates.length === 0) {
      throw new Error("Invalid update stock list");
    }

    const result = await prisma.$transaction(async (tx) => {
      const updatedProducts = [];

      for (const update of updates) {
        const { productId, amount } = update;

        const product = await tx.product.findUnique({
          where: { id: productId },
        });

        if (!product) {
          throw new Error(`Product ID ${productId} not found`);
        }

        const newStock = product.stock + amount;

        if (newStock < 0) {
          throw new Error(
            `Product ${product.name} stock can't be a negative number`,
          );
        }

        const updated = await tx.product.update({
          where: { id: productId },
          data: { stock: newStock },
        });

        updatedProducts.push(updated);
      }

      return updatedProducts;
    });

    res.status(StatusCodes.OK).json(
      makeResponse(StatusCodes.OK, {
        message: "Update stock succeeded",
        products: result,
      }),
    );
  } catch (err) {
    next(err);
  }
};
