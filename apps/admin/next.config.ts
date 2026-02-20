import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@trading-cup/database", "@trading-cup/types"],
};

export default nextConfig;
