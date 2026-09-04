/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    // 构建时不阻塞；本地仍可用 `npm run lint` 检查
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
