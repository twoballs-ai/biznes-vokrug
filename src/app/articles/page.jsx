"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import DOMPurify from "dompurify";

import UserService from "@/services/user.service";

export default function ArticlesPage() {
  const [articlesComponent, setArticlesComponent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [skip, setSkip] = useState(0);
  const [limit] = useState(10); // Уменьшаем лимит для быстрого тестирования
  const [hasMore, setHasMore] = useState(true);

  const fetchArticles = async () => {
    try {
      const response = await UserService.getArticlesWithPagination(skip, limit);
      if (response.data.status && response.data.data) {
        const newArticles = response.data.data;
        setArticlesComponent((prevArticles) => {
          const filteredArticles = newArticles.filter(
            (article) => !prevArticles.some((prevItem) => prevItem.id === article.id)
          );
          return [...prevArticles, ...filteredArticles];
        });
        setSkip((prevSkip) => prevSkip + limit);
        if (newArticles.length < limit) {
          setHasMore(false);
        }
      }
    } catch (error) {
      console.error("Ошибка загрузки статей:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  const loadMore = () => {
    if (!loading && hasMore) {
      setLoading(true);
      fetchArticles();
    }
  };

  const truncateText = (text, length = 200) => {
    if (!text) return "";
    return text.length > length ? text.substring(0, length) + "..." : text;
  };

  return (
    <section className="p-6 bg-gray-100 rounded-lg shadow-md">
      <h2 className="text-3xl font-bold mb-6 text-blue-700">Статьи</h2>

      {loading && <p>Загрузка статей...</p>}

      <div className="space-y-6">
        {articlesComponent.map((item) => (
          <div key={item.id} className="p-4 bg-white rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-blue-600">
              <Link href={`/articles/${item.id}`} className="hover:underline">
                {item.title}
              </Link>
            </h3>
            {/* Обрезанный текст статьи */}
            <p className="mt-2 text-gray-700">
              {truncateText(item.content, 200)}
            </p>

            <div className="mt-2 text-gray-500">
              <span>Категория: {item.category}</span> |{" "}
              <span>Опубликовано: {new Date(item.created_at).toLocaleDateString()}</span>
            </div>

            {/* Кнопка "Читать далее" */}
            <div className="mt-3">
              <Link href={`/articles/${item.id}`}>
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
