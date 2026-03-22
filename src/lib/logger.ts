type LogLevel = "info" | "warn" | "error";

const PHI_PATTERNS = [
  /\b\d{3}-\d{2}-\d{4}\b/g,
  /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g,
  /\b\d{10,}\b/g,
];

function sanitize(message: string): string {
  return PHI_PATTERNS.reduce((msg, pattern) => msg.replace(pattern, "[REDACTED]"), message);
}

function log(level: LogLevel, message: string, meta?: Record<string, unknown>) {
  const entry = {
    timestamp: new Date().toISOString(),
    level,
    message: sanitize(message),
    ...(meta && { meta: JSON.parse(sanitize(JSON.stringify(meta))) }),
  };

  switch (level) {
    case "error":
      console.error(JSON.stringify(entry));
      break;
    case "warn":
      console.warn(JSON.stringify(entry));
      break;
    default:
      console.log(JSON.stringify(entry));
  }
}

export const logger = {
  info: (message: string, meta?: Record<string, unknown>) => log("info", message, meta),
  warn: (message: string, meta?: Record<string, unknown>) => log("warn", message, meta),
  error: (message: string, meta?: Record<string, unknown>) => log("error", message, meta),
};
