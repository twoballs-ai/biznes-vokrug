"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import DOMPurify from "dompurify";

import UserService from "@/services/user.service";

export default function ArticleDetailPage() {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const fetchArticle = async () => {
      try {
        const response = await UserService.getArticleById(id);
        if (response.data.status) {
          setArticle(response.data.data);
        }
      } catch (error) {
        console.error("Ошибка загрузки статьи:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [id]);

  if (loading) return <p>Загрузка...</p>;
  if (!article) return <p>Статья не найдена.</p>;

  return (
    <article className="container mx-auto p-6 max-w-3xl">
      <header>
        <h1 className="text-3xl font-bold">{article.title}</h1>
        <p className="text-gray-500">
          <time dateTime={new Date(article.created_at).toISOString()}>
            {new Date(article.created_at).toLocaleDateString()}
          </time>
        </p>
      </header>

      <section className="mt-4 prose max-w-none">
        <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(article.content) }} />
      </section>

      <footer className="mt-6">
        <Link href="/articles" className="text-green-600 hover:underline">
          ← Вернуться к статьям
        </Link>
      </footer>
    </article>
  );
}
