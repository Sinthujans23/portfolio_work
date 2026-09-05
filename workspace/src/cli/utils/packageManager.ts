// src/cli/utils/packageManager.ts
import * as fs from "fs/promises";
import * as path from "path";

export type PackageManager = "npm" | "yarn";

export async function detectPackageManager(projectRoot: string): Promise<PackageManager> {
  const npmLock = path.join(projectRoot, "package-lock.json");
  const yarnLock = path.join(projectRoot, "yarn.lock");
  try {
    await fs.access(npmLock);
    return "npm";
  } catch {}
  try {
    await fs.access(yarnLock);
    return "yarn";
  } catch {}
  // Default to npm if no lock file
  return "npm";
}

export function installCommand(pm: PackageManager): string[] {
  if (pm === "npm") {
    return ["npm", "ci"]; // npm ci ensures clean install
  }
  // yarn
  return ["yarn", "install", "--frozen-lockfile"]; 
}

export function buildCommand(pm: PackageManager): string[] {
  // We rely on the project's package.json scripts; use npm run build or yarn build
  if (pm === "npm") {
    return ["npm", "run", "build"]; 
  }
  return ["yarn", "build"]; 
}

export function startCommand(pm: PackageManager): string[] {
  if (pm === "npm") {
    return ["npm", "run", "start"]; 
  }
  return ["yarn", "start"]; 
}
