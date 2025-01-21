"use client";
import { useState, useEffect } from "react";
import DOMPurify from "dompurify"; // Импортируем библиотеку

import UserService from "@/services/user.service";

export default function ArticlesPage() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [skip, setSkip] = useState(0);
  const [limit] = useState(50); // Лимит статей
  const [hasMore, setHasMore] = useState(true); // Есть ли еще статьи

  const fetchArticles = async () => {
    try {
      const response = await UserService.getArticlesWithPagination(skip, limit);
      if (response.data.status && response.data.data) {
        const newArticles = response.data.data;
        setArticles((prevArticles) => {
          const filteredArticles = newArticles.filter(
            (article) => !prevArticles.some((prevItem) => prevItem.id === article.id)
          );
          return [...prevArticles, ...filteredArticles];
        });
        setSkip(skip + limit);
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
  }, []); // Загружаем статьи при первом рендере

  const loadMore = () => {
    if (!loading && hasMore) {
      setLoading(true);
      fetchArticles();
    }
  };

  return (
    <section className="p-6 bg-gray-100 rounded-lg shadow-md">
      <h2 className="text-3xl font-bold mb-6 text-blue-700">Статьи</h2>

      {loading && <p>Загрузка статей...</p>}

      <div className="space-y-6">
        {articles.map((item) => (
          <div key={item.id} className="p-4 bg-white rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-green-600">{item.title}</h3>
            {/* Используем dompurify для очистки HTML */}
            <div
              className="text-sm mt-2"
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(item.content),
              }}
            />
            <div className="mt-2 text-gray-500">
              <span>Категория: {item.category}</span> |{" "}
              <span>Опубликовано: {new Date(item.created_at).toLocaleDateString()}</span>
            </div>
          </div>
        ))}
      </div>

      {hasMore && (
        <div className="text-center mt-6">
          <button
            onClick={loadMore}
            className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600"
          >
            Загрузить еще
          </button>
        </div>
      )}
    </section>
  );
}
