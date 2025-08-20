import type { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { makeResponse } from "../utils/response.js";

const serverErrorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  console.error(err.stack);

  res
    .status(StatusCodes.INTERNAL_SERVER_ERROR)
    .json(
      makeResponse(StatusCodes.INTERNAL_SERVER_ERROR, { error: err.message }),
    );
};

export default serverErrorHandler;
