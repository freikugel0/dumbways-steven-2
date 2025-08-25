import type { Request, Response } from "express";
import { loginSchema, registerSchema } from "../utils/validate.js";
import { StatusCodes } from "http-status-codes";
import { makeResponse } from "../utils/response.js";
import { hashPassword, signJWT, verifyPassword } from "../utils/security.js";
import { prisma } from "../lib/client.js";
import { Prisma } from "../generated/prisma/index.js";
import { AppError } from "../middlewares/server-error.js";
import crypto from "crypto";
import bcrypt from "bcrypt";

export const register = async (req: Request, res: Response) => {
  const parse = registerSchema.safeParse(req.body);
  if (!parse.success) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      "Error in validation",
      parse.error.issues.map((err) => ({
        path: err.path,
        msg: err.message,
      })),
    );
  }
  const { email, password, role } = parse.data;

  try {
    const passwordHash = await hashPassword(password);
    const user = await prisma.user.create({
      data: {
        email,
        password: passwordHash,
        role: role ?? "USER",
      },
    });
    return res
      .status(StatusCodes.CREATED)
      .json(makeResponse(StatusCodes.CREATED, user));
  } catch (err: any) {
    if ((err as Prisma.PrismaClientKnownRequestError).code === "P2002") {
      throw new AppError(StatusCodes.CONFLICT, "Email already registered");
    }
    console.error(err);
  }
};

export const login = async (req: Request, res: Response) => {
  const parse = loginSchema.safeParse(req.body);
  if (!parse.success) {
    throw new AppError(StatusCodes.BAD_REQUEST, "Email or password is invalid");
  }
  const { email, password } = parse.data;

  // Get user by email
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new AppError(StatusCodes.BAD_REQUEST, "User not found");

  // Validate password
  const valid = await verifyPassword(password, user.password);
  if (!valid)
    throw new AppError(StatusCodes.BAD_REQUEST, "Password is incorrect");

  const token = signJWT({
    sub: user.id,
    email: user.email,
    role: user.role,
  });
  return res.status(StatusCodes.OK).json(makeResponse(StatusCodes.OK, token));
};

export const resetPasswordRequest = async (req: Request, res: Response) => {
  const { email } = req.body;
  const user = await prisma.user.findUnique({
    where: { email },
  });
  if (!user) throw new AppError(StatusCodes.NOT_FOUND, "User not found");

  // Generate random token
  const resetToken = crypto.randomBytes(32).toString("hex");
  const hashedToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  // Store temporary reset password token in db
  await prisma.passwordResetToken.create({
    data: {
      userId: user.id,
      token: hashedToken,
      expiresAt: new Date(Date.now() + 1000 * 60 * 15), // 15 minutes
    },
  });

  return res
    .status(StatusCodes.OK)
    .json(makeResponse(StatusCodes.OK, resetToken));
};

export const resetPassword = async (req: Request, res: Response) => {
  const { token, newPassword } = req.body;

  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
  const record = await prisma.passwordResetToken.findUnique({
    where: { token: hashedToken },
  });

  if (!record || record.expiresAt < new Date()) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      "Invalid or expired token reset",
    );
  }

  // Update user password
  const hashedPassword = await bcrypt.hash(newPassword, 12);
  await prisma.user.update({
    where: { id: record.userId },
    data: { password: hashedPassword },
  });

  // Delete temporary token from database
  await prisma.passwordResetToken.delete({
    where: { id: record.id },
  });

  res
    .status(StatusCodes.NO_CONTENT)
    .json(makeResponse(StatusCodes.NO_CONTENT, null));
};
