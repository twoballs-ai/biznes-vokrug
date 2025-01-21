"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import DOMPurify from "dompurify";

import UserService from "@/services/user.service";

export default function NewsDetailPage() {
  const { id } = useParams();
  const [newsItem, setNewsItem] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const fetchNews = async () => {
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
    };

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

      <footer className="mt-6">
        <Link href="/news" className="text-blue-600 hover:underline">
          ← Вернуться к новостям
        </Link>
      </footer>
    </article>
  );
}
