import { StatusCodes, getReasonPhrase } from "http-status-codes";

export type ApiResponse<T> = {
  status: number;
  msg: string;
  data: T;
};

export type Meta<T> = {
  limit: number;
  page: number;
  total: number;
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

export const makePaginationResponse = <T>({
  limit,
  page,
  total,
  data,
}: Meta<T>): Meta<T> => {
  return { limit, page, total, data };
};
