import { randomBytes } from "crypto";

export const generateSecureToken = (length: number = 32): string => {
  return randomBytes(length).toString("hex");
};

export const getTokenExpiry = (minutesFromNow: number = 60): Date => {
  const expiry = new Date();
  expiry.setMinutes(expiry.getMinutes() + minutesFromNow);
  return expiry;
};
