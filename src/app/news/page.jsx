"use client";
import { useState, useEffect } from "react";
import DOMPurify from "dompurify"; // Импортируем библиотеку

import UserService from "@/services/user.service";

export default function NewsPage() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [skip, setSkip] = useState(0);
  const [limit] = useState(50); // Вы можете изменить лимит
  const [hasMore, setHasMore] = useState(true); // Для отслеживания, есть ли еще новости

  const fetchNews = async () => {
    try {
      const response = await UserService.getNewsWithPagination(skip, limit);
      if (response.data.status && response.data.data) {
        // Фильтруем новости, чтобы избежать дублирования
        const newNews = response.data.data;
        setNews((prevNews) => {
          // Отфильтровываем новости, которые уже есть в текущем списке
          const filteredNews = newNews.filter(
            (newsItem) => !prevNews.some((prevItem) => prevItem.id === newsItem.id)
          );
          return [...prevNews, ...filteredNews]; // Добавляем только уникальные новости
        });
        setSkip(skip + limit); // Обновляем сдвиг для следующего запроса
        if (newNews.length < limit) {
          setHasMore(false); // Если новостей меньше, чем лимит, больше нет новостей
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
  }, []); // Загружаем новости при первом рендере

  const loadMore = () => {
    if (!loading && hasMore) {
      setLoading(true);
      fetchNews();
    }
  };

  return (
    <section className="p-6 bg-gray-100 rounded-lg shadow-md">
      <h2 className="text-3xl font-bold mb-6 text-blue-700">Новости</h2>

      {loading && <p>Загрузка новостей...</p>}

      <div className="space-y-6">
        {news.map((item) => (
          <div key={item.id} className="p-4 bg-white rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-blue-600">{item.title}</h3>
            {/* Используем dompurify для очистки HTML */}
            <div
              className="text-sm mt-2"
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(item.content), // Очищаем HTML
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
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
          >
            Загрузить еще
          </button>
        </div>
      )}
    </section>
  );
}
