import express from "express";
import { authLimiter, apiLimiter } from "../middlewares/rateLimit";

export const createTestApp = () => {
  const app = express();

  app.use("/auth", authLimiter, (req, res) => {
    res.status(200).json({ ok: true });
  });

  app.use("/api", apiLimiter, (req, res) => {
    res.status(200).json({ ok: true });
  });

  return app;
};