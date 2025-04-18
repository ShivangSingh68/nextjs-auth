import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true, // ✅ This skips ESLint errors in production builds
  },
};

export default nextConfig;
