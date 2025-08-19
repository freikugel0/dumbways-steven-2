export type ApiResponse<T> = {
  msg: string;
  data: T;
};

export const makeResponse = <T>(msg: string, data: T): ApiResponse<T> => {
  return { msg, data };
};
