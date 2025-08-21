import { prisma } from "../lib/client.js";
import type { Request, Response } from "express";
import { makePaginationResponse, makeResponse } from "../utils/response.js";
import { StatusCodes } from "http-status-codes";

export const getOrdersSummary = async (req: Request, res: Response) => {
  // Get query params
  const { sortBy, orderBy, limit, offset } = req.query;

  // NOTE:
  // limit = take
  // offset = skip
  const limitNum = Number(limit);
  const pageNum = Number(offset);

  // Validate pagination value
  const limitSafe = !isNaN(limitNum) && limitNum > 0 ? limitNum : 50;
  const pageSafe = !isNaN(pageNum) && pageNum >= 0 ? pageNum : 1;
  const sortBySafe = sortBy === "userId" ? "userId" : undefined;
  const orderBySafe: "asc" | "desc" = orderBy === "desc" ? "desc" : "asc";

  // Get data
  const result = await prisma.order.groupBy({
    by: ["userId"],
    _sum: { qty: true },
    _count: { id: true },
    orderBy: sortBySafe
      ? {
          [sortBySafe]: orderBySafe,
        }
      : { userId: "asc" },
    take: limitSafe,
    skip: pageSafe - 1, // prisma need zero based index
  });

  // Format into more readable response
  const formattedResult = await Promise.all(
    result.map(async (r) => {
      // Get user details
      const user = await prisma.user.findMany({
        where: { id: r.userId },
        select: { name: true, email: true },
      });

      // Get this user orders
      const ordersWithProducts = await prisma.order.findMany({
        where: { userId: r.userId },
        include: { product: true },
      });

      // Get this user total spending
      const totalSpending = ordersWithProducts.reduce(
        (acc, o) => acc + o.qty * o.product.price,
        0,
      );

      return {
        user,
        totalOrders: r._count.id,
        totalQuantity: r._sum.qty || 0,
        totalSpending,
      };
    }),
  );

  // Get total data
  const total = await prisma.order.count();

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
