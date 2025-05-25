import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 启用静态导出
  output: 'export',
  
  // 禁用图片优化以提高兼容性
  images: {
    unoptimized: true
  },
  
  // 确保路径正确
  trailingSlash: true,
  
  // 输出目录
  distDir: 'out'
};

export default nextConfig;
