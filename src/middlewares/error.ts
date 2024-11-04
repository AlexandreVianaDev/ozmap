import { NextFunction, Request, Response } from "express";
import { AppError } from "../error";
import STATUS from "../constants/status";

import pino from "pino";

const logger = pino({
  level: "info",
  transport: {
    target: "pino-pretty",
    options: {
      translateTime: "SYS:standard",
      ignore: "pid,hostname",
    },
  },
});

const errorHandlerMiddleware = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
): any | void => {
  logger.error(err);

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      message: err.message,
      details: err.details,
      errorCode: err.errorCode,
    });
  }

  return res
    .status(STATUS.INTERNAL_SERVER_ERROR)
    .json({ message: "Internal Server Error." });
};

export default errorHandlerMiddleware;
