import type { Request, Response, NextFunction } from "express";
import { prisma } from "../lib/client.js";
import { StatusCodes } from "http-status-codes";
import { makeResponse } from "../utils/response.js";

export const getStocks = async (req: Request, res: Response) => {
  const result = await prisma.supplierStock.findMany();
  res.status(StatusCodes.OK).json(makeResponse(StatusCodes.OK, result));
};

export const supplierStock = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const productId = Number(req.body.productId);
  const { updates } = req.body;

  try {
    if (
      !productId ||
      isNaN(productId) ||
      !Number.isInteger(productId) ||
      !Array.isArray(updates) ||
      updates.length === 0
    ) {
      throw new Error("Invalid request body");
    }

    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new Error("Product not found");
    }

    const result = await prisma.$transaction(async (tx) => {
      const updatedStocks = [];

      for (const update of updates) {
        const { supplierId, amount } = update;

        const supplier = await tx.supplier.findUnique({
          where: { id: supplierId },
        });

        if (!supplier) {
          throw new Error(`Supplier ID ${supplierId} not found`);
        }

        // Stock record
        let stockRecord = await tx.supplierStock.findUnique({
          where: {
            supplierId_productId: {
              supplierId,
              productId,
            },
          },
        });

        // Create new stock for this supplier if not found
        if (!stockRecord) {
          stockRecord = await tx.supplierStock.create({
            data: {
              supplierId,
              productId,
              stock: 0,
            },
          });
        }

        const newStock = stockRecord.stock + amount;

        if (newStock < 0) {
          throw new Error(
            `Stock for supplier ID ${supplier.id} can't be negative`,
          );
        }

        const updated = await tx.supplierStock.update({
          where: { id: stockRecord.id },
          data: { stock: newStock },
        });

        updatedStocks.push(updated);
      }

      return updatedStocks;
    });

    res.status(StatusCodes.OK).json(
      makeResponse(StatusCodes.OK, {
        message: "Stock updated successfully",
        products: result,
      }),
    );
  } catch (err) {
    next(err);
  }
};
