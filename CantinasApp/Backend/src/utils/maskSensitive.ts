const SENSITIVE_KEYS = [
  "password",
  "pwd",
  "token",
  "accessToken",
  "refreshToken",
  "sessionToken",
  "credit_card",
  "card_number",
  "cvv",
  "ssn",
  "secret",
  "authorization",
];

function maskValue(value: any) {
  if (typeof value === "string") {
    if (value.length <= 4) return "****";
    return "****" + value.slice(-4);
  }
  return "****";
}

export function maskObject(obj: any) {
  if (!obj || typeof obj !== "object") return obj;

  const cloned: any = Array.isArray(obj) ? [] : {};

  for (const key of Object.keys(obj)) {
    const lower = key.toLowerCase();
    const val = obj[key];
    if (SENSITIVE_KEYS.includes(lower)) {
      cloned[key] = maskValue(val);
      continue;
    }

    if (typeof val === "object" && val !== null) {
      cloned[key] = maskObject(val);
      continue;
    }

    cloned[key] = val;
  }

  return cloned;
}

export default maskObject;
