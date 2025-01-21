"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import DOMPurify from "dompurify";

import UserService from "@/services/user.service";

export default function NewsPage() {
  const [newsComponent, setNewsComponent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [skip, setSkip] = useState(0);
  const [limit] = useState(10); // Уменьшаем лимит
  const [hasMore, setHasMore] = useState(true);

  const fetchNews = async () => {
    try {
      const response = await UserService.getNewsWithPagination(skip, limit);
      if (response.data.status && response.data.data) {
        const newNews = response.data.data;
        setNewsComponent((prevNews) => {
          const filteredNews = newNews.filter(
            (newsItem) => !prevNews.some((prevItem) => prevItem.id === newsItem.id)
          );
          return [...prevNews, ...filteredNews];
        });
        setSkip((prevSkip) => prevSkip + limit);
        if (newNews.length < limit) {
          setHasMore(false);
        }
      }
    } catch (error) {
      console.error("Ошибка загрузки новостей:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  const loadMore = () => {
    if (!loading && hasMore) {
      setLoading(true);
      fetchNews();
    }
  };

  const truncateText = (text, length = 200) => {
    if (!text) return "";
    return text.length > length ? text.substring(0, length) + "..." : text;
  };

  return (
    <section className="p-6 bg-gray-100 rounded-lg shadow-md">
      <h2 className="text-3xl font-bold mb-6 text-blue-700">Новости</h2>

      {loading && <p>Загрузка новостей...</p>}

      <div className="space-y-6">
        {newsComponent.map((item) => (
          <div key={item.id} className="p-4 bg-white rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-blue-600">
              <Link href={`/news/${item.id}`} className="hover:underline">
                {item.title}
              </Link>
            </h3>
            {/* Отображаем укороченный текст */}
            <p className="mt-2 text-gray-700">
              {truncateText(DOMPurify.sanitize(item.content), 200)}
            </p>

            <div className="mt-2 text-gray-500">
              <span>Категория: {item.category}</span> |{" "}
              <span>Опубликовано: {new Date(item.created_at).toLocaleDateString()}</span>
            </div>

            {/* Кнопка "Читать далее" */}
            <div className="mt-3">
              <Link href={`/news/${item.id}`}>
                <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
                  Читать далее
                </button>
              </Link>
            </div>
          </div>
        ))}
      </div>

      {hasMore && (
        <div className="text-center mt-6">
          <button
            onClick={loadMore}
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
          >
            Загрузить еще
          </button>
        </div>
      )}
    </section>
  );
}
