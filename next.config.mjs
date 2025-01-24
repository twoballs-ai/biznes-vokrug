/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["127.0.0.1", "localhost"], // Разрешаем Next.js загружать изображения с этих доменов
  },
};

export default nextConfig;