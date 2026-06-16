import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { JWT_SECRET } from "../Config/auth";
import logger from "../utils/logger";

const SECRET_KEY = process.env.JWT_SECRET;

export const authMiddleware = async (
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
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
    const ipAddress =
      (req.headers["x-forwarded-for"] as string)?.split(",")[0] ||
      (req.socket?.remoteAddress as string) ||
      undefined;
    const userAgent = req.headers["user-agent"] as string | undefined;

    if (!decoded.id || !decoded.role) {
      logger.warn({ event: "auth_invalid_payload", path: req.path });
      return res.status(403).json({ message: "Token inválido" });
    }

    const isTestEnvironment =
      process.env.NODE_ENV === "test" || Boolean(process.env.JEST_WORKER_ID);

    if (!isTestEnvironment) {
      const sessionId = (decoded as JwtPayload & { sessionId?: string })
        .sessionId;

      if (!sessionId) {
        return res.status(403).json({ message: "Token inválido" });
      }

      const { SessionService } = await import("../Service/SessionService");
      const sessionContext = await SessionService.verifySessionTokenWithContext(
        token,
        {
          ipAddress,
          userAgent,
        },
      );

      // anexamos o user ao request
      (req as any).user = {
        id: sessionContext.user.id,
        role: sessionContext.user.role,
        sessionId: sessionContext.sessionId,
      };

      return next();
    }

    // anexamos o user ao request
    (req as any).user = { id: decoded.id, role: decoded.role };

    next();
  } catch (err) {
    logger.warn({ event: "auth_token_rejected", path: req.path });
    return res.status(403).json({ message: "Token inválido ou expirado" });
  }
};
