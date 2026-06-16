import { Request, Response, NextFunction } from "express";

export const urlLengthLimit = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  if (req.originalUrl.length > 2048) {
    return void res.status(414).json({
      message: "URI too long",
    });
  }

  next();
};