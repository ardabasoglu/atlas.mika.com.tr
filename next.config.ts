import path from "path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  turbopack: {
    root: path.resolve(process.cwd()),
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
