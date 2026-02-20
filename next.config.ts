import path from "path";
import type { NextConfig } from "next";

// Turbopack needs absolute project root (where package.json and Next.js are resolved).
const projectRoot = path.resolve(process.cwd());

const nextConfig: NextConfig = {
  /* config options here */
  // Turbopack configuration
  turbopack: {
    root: projectRoot,
    rules: {
      "*.svg": {
        loaders: ["@svgr/webpack"],
        as: "*.js",
      },
    },
    resolveExtensions: [".js", ".jsx", ".ts", ".tsx", ".json"],
  },
};

export default nextConfig;
