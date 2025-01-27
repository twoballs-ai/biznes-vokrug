/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "api.bizvokrug.ru",
        pathname: "/api/category-products/downloader/**",
      },
    ],
    domains: ["api.bizvokrug.ru"],
  },
};

export default nextConfig;