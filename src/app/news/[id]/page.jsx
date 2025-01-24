"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import DOMPurify from "dompurify";
import { useEffect, useState } from "react";

import UserService from "@/services/user.service";
import AuthService from "@/services/auth.service"; 

export default function NewsDetailPage() {
  const { id } = useParams();
  const [newsItem, setNewsItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false); // Состояние для проверки админа

  useEffect(() => {
    const user = AuthService.getCurrentUser();
    if (user && user.is_admin) {
      setIsAdmin(true);
    }

    if (!id) return;

    async function fetchNews() {
      try {
        const response = await UserService.getNewsById(id);
        if (response.data.status) {
          setNewsItem(response.data.data);
        }
      } catch (error) {
        console.error("Ошибка загрузки новости:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchNews();
  }, [id]);

  if (loading) return <p>Загрузка...</p>;
  if (!newsItem) return <p>Новость не найдена.</p>;

  return (
    <article className="container mx-auto p-6 max-w-3xl">
      <header>
        <h1 className="text-3xl font-bold">{newsItem.title}</h1>
        <p className="text-gray-500">
          <time dateTime={new Date(newsItem.created_at).toISOString()}>
            {new Date(newsItem.created_at).toLocaleDateString()}
          </time>
        </p>
      </header>

      <section className="mt-4 prose max-w-none">
        <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(newsItem.content) }} />
      </section>

      <footer className="mt-6 flex gap-4">
        <Link href="/news" className="text-blue-600 hover:underline">
          ← Вернуться к статьям
        </Link>

        {isAdmin && (
          <Link
            href={`/news/edit/${id}`}
            className="text-white bg-blue-600 px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            ✏️ Редактировать
          </Link>
        )}
      </footer>
    </article>
  );
}
