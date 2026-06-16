import { Request, Response, NextFunction } from "express";

const allowedMethods = [
  "GET",
  "POST",
  "PUT",
  "PATCH",
  "DELETE",
  "OPTIONS",
];

export const allowedMethodsMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (!allowedMethods.includes(req.method)) {
    return res.status(405).json({
      message: "Method Not Allowed",
    });
  }

  next();
};