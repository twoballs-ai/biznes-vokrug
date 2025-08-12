/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "api.toise.ru",
        pathname: "/api/category-products/downloader/**",
      },
    ],
    domains: ["api.toise.ru"],
  },
};

export default nextConfig;