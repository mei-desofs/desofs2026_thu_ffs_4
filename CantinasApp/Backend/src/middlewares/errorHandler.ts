import { Request, Response, NextFunction } from "express";
import logger from "../utils/logger";

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  logger.error({
    message: err.message,
    path: req.path,
    method: req.method,
  });

  res.status(500).json({ message: "Internal server error" });
}
