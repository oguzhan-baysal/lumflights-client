import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true
  },
  output: 'export',
  // API route'larını devre dışı bırak
  async rewrites() {
    return [];
  }
};

export default nextConfig;
