import { Request, Response, NextFunction } from "express";

export const verifySelfOrRole = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {

    const loggedUser = (req as any).user;
    const targetUserId = Number(req.params.userId);

    if (
      loggedUser.id === targetUserId ||
      roles.includes(loggedUser.role)
    ) {
      return next();
    }

    return res.status(403).json({
      message: "Access denied"
    });
  };
};