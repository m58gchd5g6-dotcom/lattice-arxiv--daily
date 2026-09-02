import path from "node:path";
import { fileURLToPath } from "node:url";

import type { NextConfig } from "next";

const appDirectory = path.dirname(fileURLToPath(import.meta.url));
const repositoryRoot = path.resolve(appDirectory, "..");

const nextConfig: NextConfig = {
  agentRules: false,
  outputFileTracingRoot: repositoryRoot,
  turbopack: {
    root: repositoryRoot,
  },
};

export default nextConfig;
