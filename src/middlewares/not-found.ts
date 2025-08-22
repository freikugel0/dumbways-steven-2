import type { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { makeResponse } from "../utils/response.js";

const notFoundHandler = (req: Request, res: Response, next: NextFunction) => {
  res.status(StatusCodes.NOT_FOUND).json(
    makeResponse(StatusCodes.NOT_FOUND, {
      path: req.originalUrl,
      method: req.method,
    }),
  );
};

export default notFoundHandler;
