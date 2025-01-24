"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { toast } from "react-toastify";

import UserService from "@/services/user.service";
import FormCreateBlog from "@/components/blog/FormCreateBlog";

export default function EditNewsPage() {
  const { id } = useParams();
  const postId = id ? String(id) : null; // Преобразуем в строку
  const [newsItem, setNewsItem] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!postId) return;

    async function fetchNews() {
      try {
        const response = await UserService.getArticleById(postId);
        if (response.data.status) {
          setNewsItem(response.data.data);
        }
      } catch (error) {
        toast.error("Ошибка загрузки новости");
      } finally {
        setLoading(false);
      }
    }

    fetchNews();
  }, [postId]);

  if (loading) return <p>Загрузка...</p>;
  if (!newsItem) return <p>Новость не найдена.</p>;

  return (
    <div className="container">
      <h1>Редактировать статью</h1>
      <FormCreateBlog postId={postId} initialData={newsItem} />
    </div>
  );
}
