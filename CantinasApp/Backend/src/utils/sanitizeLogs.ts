export const sanitizeLogData = (data: any): any => {
  if (typeof data === "string") {
    // Escape newlines and carriage returns so they can't split log rows
    return data.replace(/\r/g, "\\r").replace(/\n/g, "\\n");
  }

  if (Array.isArray(data)) {
    return data.map(sanitizeLogData);
  }

  if (data !== null && typeof data === "object") {
    const sanitizedObj: Record<string, any> = {};
    for (const key of Object.keys(data)) {
      sanitizedObj[key] = sanitizeLogData(data[key]);
    }
    return sanitizedObj;
  }

  return data;
};