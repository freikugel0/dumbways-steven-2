import { StatusCodes } from "http-status-codes";
import { makeResponse } from "../utils/response.js";

// Custom error class
export class AppError extends Error {
  status: number;
  details?: any;

  constructor(status: number, message: string, details?: any) {
    super(message);
    this.status = status;
    this.details = details;
  }
}

const serverErrorHandler = (err: any, req: any, res: any, next: any) => {
  console.error(err);

  if (err instanceof AppError) {
    return res
      .status(err.status)
      .json(
        makeResponse(err.status, { error: err.message, details: err.details }),
      );
  }

  res
    .status(StatusCodes.INTERNAL_SERVER_ERROR)
    .json(
      makeResponse(StatusCodes.INTERNAL_SERVER_ERROR, { error: err.message }),
    );
};

export default serverErrorHandler;
