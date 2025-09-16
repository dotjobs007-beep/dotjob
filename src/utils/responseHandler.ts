import { Response } from "express";

interface ApiResponse {
  status: "success" | "error";
  code: number;
  message: string;
  data?: any;
}

export const sendResponse = (
  res: Response,
  code: number,
  message: string,
  data?: any
) => {
  const response: ApiResponse = {
    status: "success",
    code,
    message,
  };

  if (data !== undefined) {
    response.data = data;
  }

  return res.status(code).json(response);
};
