// src/cli/utils/healthCheck.ts
import axios from "axios";
import { Logger } from "./logger.js";

export interface HealthCheckOptions {
  url: string;
  timeoutMs?: number;
  retries?: number;
  intervalMs?: number;
}

export async function performHealthCheck(
  options: HealthCheckOptions,
  logger = new Logger()
): Promise<void> {
  const {
    url,
    timeoutMs = 5000,
    retries = 5,
    intervalMs = 1000,
  } = options;

  logger.info(`Performing health check against ${url}`);
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const response = await axios.get(url, { timeout: timeoutMs });
      if (response.status === 200 && typeof response.data === "string" && response.data.includes("<!DOCTYPE")) {
        logger.info("Health check succeeded (status 200 and HTML response).");
        return;
      }
      throw new Error(`Unexpected response: status=${response.status}`);
    } catch (err: any) {
      logger.error(`Health check attempt ${attempt} failed: ${err.message}`);
      if (attempt < retries) {
        await new Promise((res) => setTimeout(res, intervalMs));
      } else {
        throw new Error(`Health check failed after ${retries} attempts: ${err.message}`);
      }
    }
  }
}
