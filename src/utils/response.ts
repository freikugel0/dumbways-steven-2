import { StatusCodes, getReasonPhrase } from "http-status-codes";

export type ApiResponse<T> = {
  status: number;
  msg: string;
  data: T;
};

export const makeResponse = <T>(
  status: (typeof StatusCodes)[keyof typeof StatusCodes],
  data: T,
): ApiResponse<T> => {
  return {
    status,
    msg: getReasonPhrase(status),
    data: data,
  };
};
