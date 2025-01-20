/** @type {import('next-sitemap').IConfig} */
module.exports = {
    siteUrl: "https://bizvokrug.ru", // Укажи свой домен
    generateRobotsTxt: true, // Генерировать robots.txt
    sitemapSize: 5000, // Разделение sitemap, если страниц много
    changefreq: "daily", // Частота обновления страниц
    priority: 0.7, // Приоритет страниц
    exclude: ["/admin", "/secret"], // Исключённые страницы
    robotsTxtOptions: {
      policies: [
        { userAgent: "*", allow: "/" },
        { userAgent: "Googlebot", allow: "/" },
        { userAgent: "Bingbot", allow: "/" },
        { userAgent: "Yandex", allow: "/" },
      ],
    },
  };
  