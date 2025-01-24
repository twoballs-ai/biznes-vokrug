/** @type {import('next-sitemap').IConfig} */
const axios = require("axios");

const siteUrl = "https://bizvokrug.ru"; // Домен сайта
const apiUrl = "https://api.bizvokrug.ru"; // URL FastAPI сервера

module.exports = {
  siteUrl,
  generateRobotsTxt: true,
  sitemapSize: 5000,
  changefreq: "daily",
  priority: 0.7,
  exclude: ["/admin", "/secret"],

  robotsTxtOptions: {
    policies: [
      { userAgent: "*", allow: "/" },
      { userAgent: "Googlebot", allow: "/" },
      { userAgent: "Bingbot", allow: "/" },
      { userAgent: "Yandex", allow: "/" },
    ],
  },

  // Загружаем динамические пути из FastAPI
  additionalPaths: async () => {
    try {
      console.log("🔄 Загружаем статьи и новости из FastAPI...");

      // Делаем параллельные запросы к FastAPI
      const [articlesRes, newsRes] = await Promise.all([
        axios.get(`${apiUrl}/api/articles`),
        axios.get(`${apiUrl}/api/news`),
      ]);
      console.log(articlesRes.data.data)
      // Проверяем, есть ли данные
      if (!articlesRes.data.data || !newsRes.data.data) {
        console.error("❌ Ошибка API: неверный формат данных", { articlesRes: articlesRes.data, newsRes: newsRes.data });
        return [];
      }

      const staticPaths = [
        { loc: "/", changefreq: "daily", priority: 1.0 },
        { loc: "/articles", changefreq: "daily", priority: 0.9 },
        { loc: "/news", changefreq: "daily", priority: 0.9 },
        { loc: "/about", changefreq: "daily", priority: 0.9 },
        { loc: "/contact", changefreq: "daily", priority: 0.9 },
      ];
  
      // Формируем пути для статей
      const articlePaths = articlesRes.data.data.map((article) => ({
        loc: `/articles/${article.id}`,
        lastmod: new Date(article.updated_at).toISOString(),
        changefreq: "weekly",
        priority: 0.7,
      }));

      // Формируем пути для новостей
      const newsPaths = newsRes.data.data.map((newsItem) => ({
        loc: `/news/${newsItem.id}`,
        lastmod: newsItem.updated_at ? new Date(newsItem.updated_at).toISOString() : new Date().toISOString(),
        changefreq: "weekly",
        priority: 0.7,
      }));
      return [...staticPaths, ...articlePaths, ...newsPaths];
    } catch (error) {
      console.error("❌ Ошибка загрузки данных из FastAPI:", error.message);
      return [];
    }
  },
};
