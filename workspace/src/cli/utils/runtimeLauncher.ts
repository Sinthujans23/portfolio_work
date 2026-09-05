// src/cli/utils/runtimeLauncher.ts
import execa from "execa";
import { Logger } from "./logger.js";
import { startCommand, PackageManager } from "./packageManager.js";
import { getFreePort } from "./portAllocator.js";
import * as path from "path";

export interface ServerHandle {
  process: execa.ExecaChildProcess;
  port: number;
  stop: () => Promise<void>;
}

export async function launchServer(
  projectRoot: string,
  pm: PackageManager,
  logger = new Logger()
): Promise<ServerHandle> {
  const port = await getFreePort();
  const env = { ...process.env, PORT: port.toString() };
  const cmd = startCommand(pm);
  logger.info(`Launching production server on port ${port} using ${pm}: ${cmd.join(" ")}`);
  const child = execa(cmd[0], cmd.slice(1), {
    cwd: projectRoot,
    env,
    stdio: "inherit",
  });

  const stop = async () => {
    logger.info("Stopping production server...");
    child.kill();
    await child;
  };

  // Give the server a moment to start (caller should perform health check with retries)
  return { process: child, port, stop };
}
