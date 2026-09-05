// src/cli/utils/artifactVerifier.ts
import * as fs from "fs/promises";
import * as path from "path";
import { Logger } from "./logger.js";

export async function verifyArtifacts(projectRoot: string, logger = new Logger()): Promise<void> {
  const nextDir = path.join(projectRoot, ".next");
  logger.info(`Verifying build artifacts in ${nextDir}`);
  try {
    const stats = await fs.stat(nextDir);
    if (!stats.isDirectory()) {
      throw new Error(".next exists but is not a directory");
    }
  } catch (e) {
    throw new Error("Build artifacts missing: .next directory not found");
  }
  // Required subfolders
  const required = ["server", "static"]; // can be extended
  for (const sub of required) {
    const subPath = path.join(nextDir, sub);
    try {
      const stats = await fs.stat(subPath);
      if (!stats.isDirectory()) {
        throw new Error(`${subPath} exists but is not a directory`);
      }
    } catch (e) {
      throw new Error(`Build artifact missing: .next/${sub}`);
    }
  }
  logger.info("All required build artifacts are present.");
}
