"use client";

import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import CustomModal from "../../CustomModal";
import UserService from "../../../services/user.service";

export default function OrgProductModal({
  isOpen,
  onClose,
  product,        // null => создание, объект => редактирование
  organization,   // для привязки к этой организации
  categories,     // список категорий
  onSaved,
}) {
  const [localProduct, setLocalProduct] = useState({
    name: "",
    description: "",
    category_id: "",
    price: "",
  });

  // Список загруженных (новых) изображений
  const [selectedImages, setSelectedImages] = useState([]);

  // Инициализация state при открытии модалки
  useEffect(() => {
    if (isOpen) {
      if (product) {
        // Редактирование
        setLocalProduct({
          name: product.name || "",
          description: product.description || "",
          category_id: product.category_id || "",
          price: product.price || "",
        });
      } else {
        // Создание
        setLocalProduct({
          name: "",
          description: "",
          category_id: "",
          price: "",
        });
      }
      // Очищаем выбранные изображения при каждом открытии
      setSelectedImages([]);
    }
  }, [isOpen, product]);

  // Обработка выбора изображений
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);

    // Фильтруем файлы по размеру (макс. 5MB) и количеству (макс. 5)
    const validFiles = files.filter((file) => file.size <= 5 * 1024 * 1024);
    if (validFiles.length !== files.length) {
      toast.error("Некоторые файлы слишком большие (макс. 5MB)");
    }

    if (validFiles.length + selectedImages.length > 5) {
      toast.error("Можно загрузить не более 5 изображений");
      return;
    }

    setSelectedImages((prev) => [...prev, ...validFiles]);
  };

  // Удаление изображения до загрузки
  const removeImage = (index) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));
  };

  // Сохранение (создание или редактирование)
  const handleSave = async () => {
    try {
      const formData = new FormData();
      console.log("localProduct перед отправкой:", localProduct);
      // Передаём поля продукта
      formData.append("name", localProduct.name);
      formData.append("description", localProduct.description);
      formData.append("category_id", localProduct.category_id);
      formData.append("price", localProduct.price);
      console.log(organization)
      // Привязываем продукт к определённой организации
      formData.append("organization_id", organization.id);
      
      // Добавляем загруженные изображения
      selectedImages.forEach((file) => {
        formData.append("images", file);
      });

      // Выводим данные для отладки
      for (let [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
      }

      if (product) {
        console.log("dsdd")
        // Редактирование
        await UserService.updateProductOrg(product.id, formData);
        toast.success("Продукт обновлён");
      } else {
        console.log("33333")
        // Создание
        await UserService.createProductForOrg(formData);
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
      {/* Название */}
      <div className="mb-3">
        <label className="block mb-1 font-medium">Название *</label>
        <input
          type="text"
          className="w-full p-2 border rounded"
          value={localProduct.name}
          onChange={(e) =>
            setLocalProduct({ ...localProduct, name: e.target.value })
          }
        />
      </div>

      {/* Описание */}
      <div className="mb-3">
        <label className="block mb-1 font-medium">Описание</label>
        <textarea
          className="w-full p-2 border rounded"
          rows={4}
          value={localProduct.description}
          onChange={(e) =>
            setLocalProduct({ ...localProduct, description: e.target.value })
          }
        />
      </div>

      {/* Категория */}
      <div className="mb-3">
        <label className="block mb-1 font-medium">Категория *</label>
        <select
          className="w-full p-2 border rounded"
          value={localProduct.category_id}
          onChange={(e) =>
            setLocalProduct({ ...localProduct, category_id: e.target.value })
          }
        >
          <option value="">Выберите</option>
          {categories?.length > 0 ? (
            categories.map((c) => (
              <option key={c.key} value={c.key}>
                {c.value}
              </option>
            ))
          ) : (
            <option disabled>Нет категорий</option>
          )}
        </select>
      </div>

      {/* Цена */}
      <div className="mb-3">
        <label className="block mb-1 font-medium">Цена</label>
        <input
          type="number"
          className="w-full p-2 border rounded"
          value={localProduct.price}
          onChange={(e) =>
            setLocalProduct({ ...localProduct, price: e.target.value })
          }
        />
      </div>

      {/* Выбор файлов (изображений) */}
      <div className="mb-3">
        <label className="block mb-1 font-medium">Фотографии продукта</label>
        <input
          type="file"
          multiple
          className="w-full p-2 border rounded"
          onChange={handleImageChange}
        />

        {/* Превью выбранных изображений */}
        <div className="mt-2 flex flex-wrap gap-2">
          {selectedImages.map((file, index) => (
            <div key={index} className="relative">
              <img
                src={URL.createObjectURL(file)}
                alt="preview"
                className="w-20 h-20 object-cover rounded"
              />
              <button
                onClick={() => removeImage(index)}
                className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 text-xs"
              >
                X
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Кнопки */}
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
