// src/cli/utils/reporter.ts
import { Logger } from "./logger.js";

export interface StepResult {
  name: string;
  success: boolean;
  error?: string;
}

export class Reporter {
  private steps: StepResult[] = [];
  private logger: Logger;
  private jsonOutput: boolean;

  constructor(logger: Logger, jsonOutput: boolean = false) {
    this.logger = logger;
    this.jsonOutput = jsonOutput;
  }

  addStep(name: string, success: boolean, error?: string) {
    this.steps.push({ name, success, error });
    if (success) {
      this.logger.info(`${name}: PASS`);
    } else {
      this.logger.error(`${name}: FAIL`, error);
    }
  }

  finalize(exitCode = 0) {
    const allPass = this.steps.every((s) => s.success);
    const status = allPass ? "PASS" : "FAIL";
    if (this.jsonOutput) {
      const report = {
        status,
        steps: this.steps,
      };
      console.log(JSON.stringify(report, null, 2));
    } else {
      this.logger.info(`Overall verification result: ${status}`);
    }
    process.exit(allPass ? 0 : 1);
  }
}
