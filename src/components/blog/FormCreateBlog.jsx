"use client";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import UserService from "@/services/user.service";
import TinyMCEEditor from "../TinyMCEEditor";

export default function FormCreateBlog() {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([]);

  const [content, setContent] = useState("<article></article>");
  const [loading, setLoading] = useState(false);
  const [postId, setPostId] = useState(null); // ID статьи
  const [images, setImages] = useState([]); // Хранение загруженных файлов
  const [tags, setTags] = useState(""); // Теги через запятую

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("category_id", category);
      formData.append("content", content);

      // Добавляем изображения
      images.forEach((image) => {
        formData.append("images", image);
      });

      // Добавляем теги в виде строки, разделённой запятыми
      formData.append("tags", tags);

      let response;
      if (postId) {
        response = await UserService.updatePostBlog(postId, formData);
      } else {
        response = await UserService.createPostBlog(formData);
      }

      if (response.status !== 200) {
        throw new Error("Ошибка при сохранении статьи");
        throw new Error("Ошибка при сохранении статьи");
      }

      toast.success(postId ? "Статья обновлена!" : "Статья успешно создана!");

      if (!postId) {
        setPostId(response.data.id);
      }
    } catch (err) {
      toast.error(err.message || "Ошибка при сохранении статьи");
    }

    setLoading(false);
  };

  const handleImageChange = (e) => {
    setImages([...e.target.files]); // Добавляем выбранные файлы в state
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4 text-center">
        {postId ? "Редактировать статью" : "Создать статью"}
      </h2>
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

      {/* Поле для тегов */}
      <input
        type="text"
        placeholder="Теги (через запятую)"
        value={tags}
        onChange={(e) => setTags(e.target.value)}
        className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:ring-2 focus:ring-blue-500"
      />

      {/* Поле загрузки изображений */}
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
