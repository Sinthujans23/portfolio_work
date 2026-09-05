// src/cli/utils/config.ts
export interface VerifyBuildOptions {
  project: string; // path to the Next.js project
  timeout?: number; // overall timeout in ms (not used currently)
  json?: boolean; // output JSON report
}
