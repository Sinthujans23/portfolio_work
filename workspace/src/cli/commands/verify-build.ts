// src/cli/commands/verify-build.ts
import { locateProject } from "../utils/projectLocator.js";
import { detectPackageManager } from "../utils/packageManager.js";
import { installDependencies } from "../utils/dependencyInstaller.js";
import { executeBuild } from "../utils/buildExecutor.js";
import { verifyArtifacts } from "../utils/artifactVerifier.js";
import { launchServer, ServerHandle } from "../utils/runtimeLauncher.js";
import { performHealthCheck } from "../utils/healthCheck.js";
import { Reporter } from "../utils/reporter.js";
import { Logger } from "../utils/logger.js";
import { VerifyBuildOptions } from "../utils/config.js";
import * as path from "path";

export default async function verifyBuild(rawOptions: any) {
  const options: VerifyBuildOptions = {
    project: rawOptions.project || ".",
    timeout: rawOptions.timeout ? Number(rawOptions.timeout) : undefined,
    json: !!rawOptions.json,
  };

  const logger = new Logger();
  const reporter = new Reporter(logger, options.json);

  let serverHandle: ServerHandle | null = null;

  try {
    // Step 1: Locate project
    const projectInfo = await locateProject(options.project, logger);
    reporter.addStep("Locate Project", true);

    // Step 2: Detect package manager
    const pm = await detectPackageManager(projectInfo.root);
    reporter.addStep("Detect Package Manager", true);

    // Step 3: Install dependencies
    await installDependencies(projectInfo.root, pm, logger);
    reporter.addStep("Install Dependencies", true);

    // Step 4: Execute build
    await executeBuild(projectInfo.root, pm, logger);
    reporter.addStep("Execute Build", true);

    // Step 5: Verify artifacts
    await verifyArtifacts(projectInfo.root, logger);
    reporter.addStep("Verify Artifacts", true);

    // Step 6: Launch server
    serverHandle = await launchServer(projectInfo.root, pm, logger);
    reporter.addStep("Launch Server", true);

    // Step 7: Health check
    const healthUrl = `http://127.0.0.1:${serverHandle.port}/`;
    await performHealthCheck({ url: healthUrl }, logger);
    reporter.addStep("Health Check", true);
  } catch (err: any) {
    // Determine which step failed based on where the error was thrown.
    // For simplicity, we mark the last added step as failed if not already recorded.
    const lastStep = reporter['steps']?.[reporter['steps'].length - 1];
    if (lastStep && lastStep.success) {
      // Mark it as failed now.
      lastStep.success = false;
      lastStep.error = err.message;
    } else {
      // Add a generic failure step.
      reporter.addStep("Verification", false, err.message);
    }
    // Ensure server is stopped if it was started.
    if (serverHandle) {
      try {
        await serverHandle.stop();
      } catch (_) {}
    }
    reporter.finalize(1);
    return;
  }

  // Clean up server
  if (serverHandle) {
    await serverHandle.stop();
  }
  reporter.finalize(0);
}
