import type { NextConfig } from "next";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  // Pin the tracing root to this project (a stray lockfile in the user's home
  // dir otherwise makes Next infer the wrong workspace root).
  outputFileTracingRoot: __dirname,
};

export default nextConfig;
