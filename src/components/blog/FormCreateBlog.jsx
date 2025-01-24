"use client";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import UserService from "@/services/user.service";
import TinyMCEEditor from "../TinyMCEEditor";

export default function FormCreateBlog({ postId: propPostId = null, initialData = null }) {
  const [postId, setPostId] = useState(propPostId || null);
  const [title, setTitle] = useState(initialData?.title || "");
  const [category, setCategory] = useState(initialData?.category_id || "");
  const [categories, setCategories] = useState([]);
  const [content, setContent] = useState(initialData?.content || "<article></article>");
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState([]);
  const [tags, setTags] = useState(initialData?.tags || "");

  useEffect(() => {
    async function loadCategories() {
      try {
        const response = await UserService.getNewsCategories();
        setCategories(response.data.data);
      } catch (err) {
        console.error("Ошибка загрузки категорий:", err);
        toast.error("Ошибка загрузки категорий");
      }
    }
    loadCategories();
  }, []);

  useEffect(() => {
    if (initialData?.content) {
      setContent(initialData.content);
    }
    if (initialData?.images) {
      setImages(initialData.images);
    }
  }, [initialData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("category_id", category);
      formData.append("content", content);
      formData.append("tags", tags);

      images.forEach((image) => {
        formData.append("images", image);
      });

      let response;
      if (postId) {
        response = await UserService.updatePostBlog(postId, formData);
      } else {
        response = await UserService.createPostBlog(formData);
      }

      if (response.status !== 200) {
        throw new Error("Ошибка при сохранении статьи");
      }

      toast.success(postId ? "Статья обновлена!" : "Статья успешно создана!");

      if (!postId) {
        setPostId(response.data.data.id);
      }
    } catch (err) {
      toast.error(err.message || "Ошибка при сохранении статьи");
    }

    setLoading(false);
  };

  const handleImageChange = (e) => {
    setImages([...e.target.files]);
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4 text-center">
        {postId ? "Редактировать статью" : "Создать статью"}
      </h2>
      <input
        type="text"
        placeholder="Заголовок"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
        className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:ring-2 focus:ring-blue-500"
      />

      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        required
        className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:ring-2 focus:ring-blue-500"
      >
        <option value="">Выберите категорию</option>
        {categories.map((cat) => (
          <option key={cat.value} value={cat.value}>
            {cat.label}
          </option>
        ))}
      </select>

      <input
        type="text"
        placeholder="Теги (через запятую)"
        value={tags}
        onChange={(e) => setTags(e.target.value)}
        className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:ring-2 focus:ring-blue-500"
      />

      <input
        type="file"
        multiple
        accept="image/*"
        onChange={handleImageChange}
        className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:ring-2 focus:ring-blue-500"
      />

      <TinyMCEEditor content={content} setContent={setContent} />

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white py-3 mt-4 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
      >
        {loading ? "Сохраняем..." : postId ? "Сохранить изменения" : "Создать"}
      </button>
    </form>
  );
}
