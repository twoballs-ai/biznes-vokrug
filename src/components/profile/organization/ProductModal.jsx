// ProductModal.jsx
"use client";

import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import CustomModal from "../../CustomModal";
import UserService from "../../../services/user.service";

export default function ProductModal({
  isOpen,
  onClose,
  product,
  organization,
  categories,
  onSaved,
}) {
  const [localProduct, setLocalProduct] = useState({
    name: "",
    description: "",
    category: "",
  });

  useEffect(() => {
    if (product) {
      setLocalProduct(product);
    } else {
      setLocalProduct({ name: "", description: "", category: "" });
    }
  }, [product]);

  const handleSave = async () => {
    try {
      if (product) {
        // Редактирование
        await UserService.updateProduct(product.id, localProduct);
        toast.success("Продукт обновлён");
      } else {
        // Создание
        await UserService.createProduct({ ...localProduct, ownerId: organization.id });
        toast.success("Продукт создан");
      }
      onClose();
      onSaved();
    } catch (error) {
      console.error("Ошибка при сохранении продукта:", error);
      toast.error("Ошибка при сохранении продукта.");
    }
  };

  return (
    <CustomModal
      isOpen={isOpen}
      onClose={onClose}
      title={product ? "Редактировать продукт" : "Создать продукт"}
    >
      <div className="mb-3">
        <label className="block mb-1 font-medium">Название продукта *</label>
        <input
          type="text"
          className="w-full p-2 border rounded"
          value={localProduct.name}
          onChange={(e) => setLocalProduct({ ...localProduct, name: e.target.value })}
        />
      </div>
      <div className="mb-3">
        <label className="block mb-1 font-medium">Описание продукта</label>
        <input
          type="text"
          className="w-full p-2 border rounded"
          value={localProduct.description}
          onChange={(e) => setLocalProduct({ ...localProduct, description: e.target.value })}
        />
      </div>
      <div className="mb-3">
        <label className="block mb-1 font-medium">Категория *</label>
        <select
          className="w-full p-2 border rounded"
          value={localProduct.category}
          onChange={(e) => setLocalProduct({ ...localProduct, category: e.target.value })}
        >
          <option value="">Выберите</option>
          {categories.map((c) => (
            <option key={c.key} value={c.key}>
              {c.value}
            </option>
          ))}
        </select>
      </div>
      <div className="flex justify-end space-x-2">
        <button onClick={onClose} className="bg-gray-500 text-white px-4 py-2 rounded">
          Отмена
        </button>
        <button onClick={handleSave} className="bg-green-500 text-white px-4 py-2 rounded">
          Сохранить
        </button>
      </div>
    </CustomModal>
  );
}