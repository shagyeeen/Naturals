import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: ["lucide-react", "framer-motion", "recharts"],
    // @ts-expect-error - turbopack is a valid property but may not be in the current types
    turbopack: {
      root: ".",
    },
  },
};

export default nextConfig;
