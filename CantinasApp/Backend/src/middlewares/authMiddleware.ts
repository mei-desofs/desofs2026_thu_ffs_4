import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { JWT_SECRET } from "../Config/auth";
import { SessionService } from "../Service/SessionService";

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader?.split(" ")[1]; // "Bearer <token>"

  if (!token) {
    return res.status(401).json({ message: "Token não fornecido" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;

    // Garantir que id e role existem
    if (!decoded.id || !decoded.role) {
      return res.status(403).json({ message: "Token inválido" });
    }

    if (process.env.NODE_ENV !== "test") {
      const sessionId = (decoded as JwtPayload & { sessionId?: string })
        .sessionId;

      if (!sessionId) {
        return res.status(403).json({ message: "Token inválido" });
      }

      const sessionContext = await SessionService.verifySessionToken(token);

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
    return res.status(403).json({ message: "Token inválido ou expirado" });
  }
};
