// src/cli/utils/projectLocator.ts
import * as fs from "fs/promises";
import * as path from "path";
import { Logger } from "./logger.js";

export interface ProjectInfo {
  root: string; // absolute path to project root
  packageJsonPath: string;
  packageJson: any;
}

export async function locateProject(
  startDir: string,
  logger = new Logger()
): Promise<ProjectInfo> {
  const resolvedStart = path.resolve(startDir);
  logger.info(`Locating Next.js project starting at ${resolvedStart}`);
  let dir = resolvedStart;
  while (true) {
    const pkgPath = path.join(dir, "package.json");
    try {
      const content = await fs.readFile(pkgPath, "utf-8");
      const pkg = JSON.parse(content);
      const deps = { ...pkg.dependencies, ...pkg.devDependencies };
      if (deps["next"]) {
        logger.info(`Found Next.js project at ${dir}`);
        return { root: dir, packageJsonPath: pkgPath, packageJson: pkg };
      }
    } catch (e) {
      // ignore and continue upwards
    }
    const parent = path.dirname(dir);
    if (parent === dir) {
      throw new Error("Project not found: No package.json with Next.js dependency.");
    }
    dir = parent;
  }
}
