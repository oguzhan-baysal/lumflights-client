import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true
  },
  output: 'export'  // Static export için
};

export default nextConfig;
