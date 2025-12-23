/** @type {import('next').NextConfig} */

const isGitHubPages = process.env.DEPLOY_TARGET === 'github'

const nextConfig = {
  // GitHub Pages 部署时启用静态导出
  output: isGitHubPages ? 'export' : undefined,
  
  // GitHub Pages 子路径配置
  basePath: isGitHubPages ? '/AIForRay' : '',
  assetPrefix: isGitHubPages ? '/AIForRay/' : '',
  
  // GitHub Pages 不支持 Image Optimization API
  images: {
    unoptimized: true,
  },
  
  // 禁用 x-powered-by header
  poweredByHeader: false,
}

module.exports = nextConfig

