import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true
  },
  output: 'export',
  // rewrites kısmını kaldıralım çünkü static export ile uyumlu değil
  // async rewrites() {
  //   return [];
  // }
  trailingSlash: true,
  // distDir'i kaldıralım çünkü Vercel kendi output dizinini kullanıyor
  // distDir: 'out'
};

export default nextConfig;
