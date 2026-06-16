import rateLimit from "express-rate-limit";

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: "Too many auth attempts, try again later.",
});

export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  message: "Too many requests, try again later.",
});

export const reservationLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 5,
  message: "Too many reservation requests, try again later.",
});