// src/cli/utils/dependencyInstaller.ts
import execa from "execa";
import { Logger } from "./logger.js";
import { installCommand, PackageManager } from "./packageManager.js";

export async function installDependencies(
  projectRoot: string,
  pm: PackageManager,
  logger = new Logger()
): Promise<void> {
  const cmd = installCommand(pm);
  logger.info(`Installing dependencies using ${pm}: ${cmd.join(" ")}`);
  try {
    await execa(cmd[0], cmd.slice(1), {
      cwd: projectRoot,
      stdio: "inherit",
    });
    logger.info("Dependency installation completed successfully.");
  } catch (error: any) {
    logger.error("Dependency installation failed.", { error: error.message, stderr: error.stderr });
    throw new Error(`Dependency installation failed: ${error.message}`);
  }
}
