// src/types/config.d.ts
// Type declarations for shared configuration interfaces.

export interface VerifyBuildOptions {
  /** Absolute path to the Next.js project */
  project: string;
  /** Maximum total verification time in milliseconds */
  timeout: number;
  /** Output results as JSON */
  json: boolean;
}
