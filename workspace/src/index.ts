// src/index.ts
import { Command } from "commander";
import verifyBuild from "./cli/commands/verify-build.js";

const program = new Command();
program
  .name("next-verify")
  .description("CLI tool to verify Next.js build and runtime")
  .version("1.0.0");

program
  .command("verify-build")
  .description("Run full verification of a Next.js project")
  .option("-p, --project <path>", "Path to the Next.js project", ".")
  .option("-t, --timeout <ms>", "Timeout in milliseconds", "300000")
  .option("--json", "Output in JSON format")
  .action(async (options) => {
    try {
      await verifyBuild(options);
    } catch (err) {
      console.error("Fatal error:", err);
      process.exit(1);
    }
  });

program.parseAsync(process.argv).catch((err) => {
  console.error(err);
  process.exit(1);
});
