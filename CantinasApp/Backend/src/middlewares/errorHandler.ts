import { Request, Response, NextFunction } from "express";
import logger from "../utils/logger";

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  const meta: any = {
    event: "internal_error",
    message: err.message,
    path: req.path,
    method: req.method,
    requestId: (req as any).requestId,
  };

  if ((err as any).code) meta.code = (err as any).code;
  if (process.env.NODE_ENV !== "production") meta.stack = err.stack;

  logger.error(meta);

  res.status(500).json({ message: "Internal server error" });
}
