// src/cli/utils/logger.ts
import * as fs from "fs";
import * as path from "path";

export interface LoggerOptions {
  jsonFile?: string; // optional path to write JSON logs
}

export class Logger {
  private jsonStream: fs.WriteStream | null = null;

  constructor(private options: LoggerOptions = {}) {
    if (options.jsonFile) {
      const fullPath = path.resolve(options.jsonFile);
      this.jsonStream = fs.createWriteStream(fullPath, { flags: "a" });
    }
  }

  info(message: string, data?: unknown) {
    const line = `[INFO] ${message}`;
    console.log(line);
    this.writeJson("info", message, data);
  }

  error(message: string, data?: unknown) {
    const line = `[ERROR] ${message}`;
    console.error(line);
    this.writeJson("error", message, data);
  }

  private writeJson(level: string, message: string, data?: unknown) {
    if (!this.jsonStream) return;
    const entry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      data,
    };
    this.jsonStream.write(JSON.stringify(entry) + "\n");
  }

  close() {
    if (this.jsonStream) {
      this.jsonStream.end();
    }
  }
}
