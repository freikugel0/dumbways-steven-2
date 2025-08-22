import { StatusCodes } from "http-status-codes";
import { makeResponse } from "../utils/response.js";

const serverErrorHandler = (err: any, req: any, res: any, next: any) => {
  console.error(err);
  if (err.message) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json(makeResponse(StatusCodes.BAD_REQUEST, { error: err.message }));
  }

  res
    .status(StatusCodes.INTERNAL_SERVER_ERROR)
    .json(
      makeResponse(StatusCodes.INTERNAL_SERVER_ERROR, { error: err.message }),
    );
};

export default serverErrorHandler;
