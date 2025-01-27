/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "api.bizvokrug.ru",  // Основной API
      "79.174.94.29"        // Сервер изображений
    ],
  },
};

export default nextConfig;
