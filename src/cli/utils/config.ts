// src/cli/utils/config.ts
// Configuration types and defaults for the verification CLI.

export interface VerifyBuildOptions {
  /** Absolute path to the Next.js project */
  project: string;
  /** Maximum total verification time in milliseconds */
  timeout: number;
  /** Output results as JSON */
  json: boolean;
}

/** Default options – can be overridden by CLI flags */
export const defaultOptions: Partial<VerifyBuildOptions> = {
  timeout: 300000, // 5 minutes
  json: false,
};
