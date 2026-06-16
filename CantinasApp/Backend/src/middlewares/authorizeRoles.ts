import { Request, Response, NextFunction } from "express";
import logger from "../utils/logger";

export const authorizeRoles = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;

    if (!user) {
      logger.warn({ event: "authz_no_user", path: req.path, method: req.method, ip: req.ip });
      return res.status(401).json({ message: "Não autenticado" });
    }

    const allowed = roles.includes(user.role);
    logger.info({ event: "authz_decision", userId: user.id, role: user.role, path: req.path, method: req.method, allowed, required: roles, ip: req.ip });

    if (!allowed) {
      logger.warn({ event: "authz_forbidden", userId: user.id, role: user.role, path: req.path, required: roles });
      return res.status(403).json({ message: "Sem permissão para aceder" });
    }

    next();
  };
};
