import { Request, Response, NextFunction } from "express";
import logger from "../utils/logger";

export const authorizeRoles = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;

    if (!user) {
      logger.warn({ event: "authz_no_user", path: req.path, method: req.method });
      return res.status(401).json({ message: "Não autenticado" });
    }

    if (!roles.includes(user.role)) {
      logger.warn({ event: "authz_forbidden", userId: user.id, role: user.role, path: req.path, required: roles });
      return res.status(403).json({ message: "Sem permissão para aceder" });
    }

    next();
  };
};
