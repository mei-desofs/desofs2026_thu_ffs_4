import path from "path";
import crypto from "crypto";

export function safeFilename(originalName: string) {
  const ext = path.extname(originalName);

  // gera nome seguro e único
  return crypto.randomUUID() + ext;
}