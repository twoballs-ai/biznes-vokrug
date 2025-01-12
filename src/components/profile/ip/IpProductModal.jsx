"use client";

import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import CustomModal from "../../CustomModal";
import UserService from "../../../services/user.service";

export default function IpProductModal({
  isOpen,
  onClose,
  product,       // null => создание, объект => редактирование
  categories,    // Список категорий для <select>
  onSaved,
}) {
  const [localProduct, setLocalProduct] = useState({
    name: "",
    description: "",
    category_id: "",
    price: "",
  });

  // При открытии модалки (isOpen), проверяем product:
  useEffect(() => {
    if (isOpen) {
      if (product) {
        // Редактирование существующего продукта
        setLocalProduct({
          name: product.name || "",
          description: product.description || "",
          category_id: product.category_id || "",
          price: product.price || "",
        });
      } else {
        // Создание нового продукта (сброс полей)
        setLocalProduct({
          name: "",
          description: "",
          category_id: "",
          price: "",
        });
      }
    }
  }, [isOpen, product]);

  // Обработка сохранения (создание/редактирование)
  const handleSave = async () => {
    try {
      if (product) {
        // Редактирование
        await UserService.updateProduct(product.id, localProduct);
        toast.success("Продукт успешно обновлён");
      } else {
        // Создание
        await UserService.createProductForIp(localProduct);
        toast.success("Продукт успешно создан");
      }
      onClose();  // Закрываем модалку
      onSaved();  // Обновляем родительские данные
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
          onChange={(e) =>
            setLocalProduct({ ...localProduct, name: e.target.value })
          }
        />
      </div>

      <div className="mb-3">
        <label className="block mb-1 font-medium">Описание продукта</label>
        <textarea
          className="w-full p-2 border rounded"
          value={localProduct.description}
          rows={4}
          onChange={(e) =>
            setLocalProduct({ ...localProduct, description: e.target.value })
          }
        />
      </div>

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
            <option value="" disabled>
              Категории отсутствуют
            </option>
          )}
        </select>
      </div>

      <div className="mb-3">
        <label className="block mb-1 font-medium">Цена в рублях *</label>
        <input
          type="number"
          className="w-full p-2 border rounded"
          value={localProduct.price}
          onChange={(e) =>
            setLocalProduct({ ...localProduct, price: e.target.value })
          }
        />
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
