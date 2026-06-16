import { Request, Response, NextFunction } from "express";

export const headerSanitizer = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const invalid = /[\r\n]/;

  for (const [k, v] of Object.entries(req.headers)) {
    if (typeof v === "string" && invalid.test(v)) {
      return void res.status(400).json({
        message: "Invalid headers detected",
      });
    }
  }

  next();
};