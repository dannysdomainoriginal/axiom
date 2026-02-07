import { format } from "date-fns";

interface LoggerOptions {
  levels?: string[];
  format?: (
    level: string,
    message: string,
    content: unknown,
    timestamp: string,
  ) => string;
  dateFormat?: string;
}

type LogFunction = (
  level: "info" | "warn" | "error",
  message: string,
  content?: unknown,
) => void;

export class Logger {
  private levels: string[];
  private dateFormat: string;
  private colors: Record<string, string>;

  constructor(options: LoggerOptions = {}) {
    this.levels = options.levels || ["info", "warn", "error"];
    this.dateFormat = options.dateFormat || "yyyy-MM-dd HH:mm:ss";
    this.colors = {
      info: "\x1b[34m", // Blue
      warn: "\x1b[33m", // Yellow
      error: "\x1b[31m", // Red
    };
  }

  private log: LogFunction = (level, message, content) => {
    const timestamp = format(new Date(), this.dateFormat);
    const text = content
      ? `[${level.toUpperCase()}] [${timestamp}] ${message} ${JSON.stringify(
          content,
          null,
          2,
        )}`
      : `[${level.toUpperCase()}] [${timestamp}] ${message}`;

    console.log(this.colors[level] + text + "\x1b[0m");
  };

  info(message: string, content?: unknown) {
    this.log("info", message, content);
  }

  warn(message: string, content?: unknown) {
    this.log("warn", message, content);
  }

  error(message: string, content?: unknown) {
    this.log("error", message, content);
  }
}

export const logger = new Logger();
