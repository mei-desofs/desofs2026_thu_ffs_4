import rateLimit from "express-rate-limit";

// 🔴 forte (auth)
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10, // poucos attempts
  message: "Too many auth attempts, try again later.",
});

// 🟡 geral API
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
});