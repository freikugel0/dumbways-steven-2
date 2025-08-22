import type { NextFunction, Request, Response } from "express";
import { prisma } from "../lib/client.js";
import { StatusCodes } from "http-status-codes";
import { makeResponse } from "../utils/response.js";

export const transferPoints = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { senderId, receiverId, amount } = req.body;

  try {
    // Validate point amount
    if (amount <= 0) {
      throw new Error("Point must be greater than 0");
    }

    // Get user data
    const sender = await prisma.user.findUnique({ where: { id: senderId } });
    const receiver = await prisma.user.findUnique({
      where: { id: receiverId },
    });

    if (!sender || !receiver) {
      throw new Error("Sender or Receiver not found");
    }

    if (sender.points < amount) {
      throw new Error("Insufficient points");
    }

    const [updatedSender, updatedReceiver] = await prisma.$transaction([
      prisma.user.update({
        where: { id: senderId },
        data: { points: { decrement: amount } },
      }),
      prisma.user.update({
        where: { id: receiverId },
        data: { points: { increment: amount } },
      }),
    ]);

    res.status(StatusCodes.OK).json(
      makeResponse(StatusCodes.OK, {
        message: "Transfer point succeeded",
        sender: updatedSender,
        receiver: updatedReceiver,
      }),
    );
  } catch (err) {
    next(err);
  }
};
