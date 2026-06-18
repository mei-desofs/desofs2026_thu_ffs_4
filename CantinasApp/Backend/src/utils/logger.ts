import winston from "winston";
import path from "path";
import fs from "fs";
import os from "os";

const logsDir = path.join(__dirname, "../../logs");
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || "info",
  defaultMeta: {
    service: process.env.SERVICE_NAME || "cantinas-backend",
    host: os.hostname(),
  },
  format: winston.format.combine(
    winston.format.timestamp({ format: () => new Date().toUTCString() }),
    winston.format.json(),
  ),
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize({ all: false }),
        winston.format.printf((info: winston.Logform.TransformableInfo) => {
          const { level, message, timestamp, ...meta } = info as {
            level: string;
            message: any;
            timestamp: string;
            [key: string]: unknown;
          };
          const msgStr =
            typeof message === "string" ? message : JSON.stringify(message);
          const metaStr = Object.keys(meta).length
            ? ` ${JSON.stringify(meta)}`
            : "";
          return `${timestamp} ${level}: ${msgStr}${metaStr}`;
        }),
      ),
    }),
    new winston.transports.File({
      filename: path.join(logsDir, "error.log"),
      level: "error",
    }),
    new winston.transports.File({
      filename: path.join(logsDir, "app.log"),
    }),
  ],
});

export default logger;
