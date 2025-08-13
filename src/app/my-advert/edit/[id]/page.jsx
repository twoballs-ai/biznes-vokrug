"use client";

import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import UserService from "@/services/user.service";

export default function UserItemEditForm({ item, onSaved }) {
  const [form, setForm] = useState({
    name: "",
    description: "",
    category_id: "",
    price: "",
  });

  useEffect(() => {
    if (item) {
      setForm({
        name: item.name || "",
        description: item.description || "",
        category_id: item.category_id || "",
        price: item.price || "",
      });
    }
  }, [item]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      await UserService.updateItem(item.id, form); // PUT или PATCH
      toast.success("Объявление обновлено");
      if (onSaved) onSaved();
    } catch (error) {
      toast.error("Ошибка при обновлении");
    }
  };

  if (!item) return null;

  return (
    <form
      onSubmit={handleSave}
      className="space-y-6 max-w-3xl mx-auto p-4 bg-white rounded shadow-md"
    >
      {/* Тип (только для отображения) */}
      <div>
        <label className="block mb-2 font-semibold text-gray-700">Тип</label>
        <div className="px-5 py-2 border rounded-lg bg-gray-100 text-gray-700">
          {item.type === "product" ? "Товар" : "Услуга"}
        </div>
      </div>

      {/* Название */}
      <div>
        <label className="block mb-2 font-semibold text-gray-700">
          Название *
        </label>
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          required
          className="w-full border border-gray-300 rounded-lg px-4 py-2"
        />
      </div>

      {/* Описание */}
      <div>
        <label className="block mb-2 font-semibold text-gray-700">
          Описание
        </label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-lg px-4 py-2"
          rows="4"
        ></textarea>
      </div>

      {/* Цена */}
      <div>
        <label className="block mb-2 font-semibold text-gray-700">Цена</label>
        <input
          type="number"
          name="price"
          value={form.price}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-lg px-4 py-2"
        />
      </div>

      {/* Категория */}
      <div>
        <label className="block mb-2 font-semibold text-gray-700">
          Категория
        </label>
        <input
          type="text"
          name="category_id"
          value={form.category_id}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-lg px-4 py-2"
        />
      </div>

      {/* Кнопка */}
      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700"
      >
        Сохранить
      </button>
    </form>
  );
}
