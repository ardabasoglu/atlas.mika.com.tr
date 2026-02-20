import path from "path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "naturalistverde.com",
        pathname: "/**",
      },
    ],
  },
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
