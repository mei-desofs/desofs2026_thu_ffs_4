import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import logger from "../utils/logger";

const SECRET_KEY = process.env.JWT_SECRET;

if (!SECRET_KEY) {
  throw new Error("JWT_SECRET não definido no .env");
}

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader?.split(" ")[1];

  if (!token) {
    logger.warn({ event: "auth_no_token", path: req.path, method: req.method });
    return res.status(401).json({ message: "Token não fornecido" });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY) as JwtPayload;

    if (!decoded.id || !decoded.role) {
      logger.warn({ event: "auth_invalid_payload", path: req.path });
      return res.status(403).json({ message: "Token inválido" });
    }

    req.user = { id: decoded.id as number, role: decoded.role as string };

    next();
  } catch (err) {
    logger.warn({ event: "auth_token_rejected", path: req.path });
    return res.status(403).json({ message: "Token inválido ou expirado" });
  }
};
