import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { JWT_SECRET } from "../Config/auth";
import logger from "../utils/logger";

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader?.split(" ")[1];

  if (!token) {
    logger.warn({ event: "auth_no_token", path: req.path, method: req.method, ip: req.ip });
    return res.status(401).json({ message: "Token não fornecido" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
    const ipAddress =
      (req.headers["x-forwarded-for"] as string)?.split(",")[0] ||
      (req.socket?.remoteAddress as string) ||
      undefined;
    const userAgent = req.headers["user-agent"] as string | undefined;

    if (!decoded.id || !decoded.role) {
      logger.warn({ event: "auth_invalid_payload", path: req.path, ip: req.ip });
      return res.status(403).json({ message: "Token inválido" });
    }

    req.user = { id: decoded.id as number, role: decoded.role as string };

    logger.info({ event: "auth_success", userId: req.user.id, role: req.user.role, path: req.path, method: req.method, ip: req.ip });

    next();
  } catch (err) {
    logger.warn({ event: "auth_token_rejected", path: req.path, ip: req.ip });
    return res.status(403).json({ message: "Token inválido ou expirado" });
  }
};
