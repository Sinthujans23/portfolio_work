// src/cli/utils/buildExecutor.ts
import execa from "execa";
import { Logger } from "./logger.js";
import { buildCommand, PackageManager } from "./packageManager.js";

export async function executeBuild(
  projectRoot: string,
  pm: PackageManager,
  logger = new Logger()
): Promise<void> {
  const cmd = buildCommand(pm);
  logger.info(`Running build command: ${cmd.join(" ")}`);
  try {
    await execa(cmd[0], cmd.slice(1), {
      cwd: projectRoot,
      stdio: "inherit",
    });
    logger.info("Build completed successfully.");
  } catch (error: any) {
    logger.error("Build failed.", { error: error.message, stderr: error.stderr });
    throw new Error(`Build failed: ${error.message}`);
  }
}
