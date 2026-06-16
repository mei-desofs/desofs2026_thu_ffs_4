import { Request, Response, NextFunction } from "express";
import { v4 as uuidv4 } from "uuid";
import logger from "../utils/logger";
import maskObject from "../utils/maskSensitive";
import { sanitizeLogData } from "../utils/sanitizeLogs";

export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  const requestId = uuidv4();
  // attach for downstream correlation
  (req as any).requestId = requestId;
  res.setHeader("X-Request-Id", requestId);

  const who = req.user ? { id: req.user.id, role: req.user.role } : undefined;
  const rawMeta = {
    event: "http_request",
    requestId,
    method: req.method,
    path: req.path,
    ip: req.ip || req.headers["x-forwarded-for"] || req.socket.remoteAddress,
    userAgent: req.headers["user-agent"],
    who,
    body: maskObject(req.body),
  };

  const meta = sanitizeLogData(rawMeta);

  logger.info(`Incoming ${req.method} ${req.path}`, meta);

  res.on("finish", () => {
    logger.info(`Response ${res.statusCode} ${req.method} ${req.path}`, {
      ...meta,
      statusCode: res.statusCode,
    });
  });

  next();
};

export default requestLogger;
