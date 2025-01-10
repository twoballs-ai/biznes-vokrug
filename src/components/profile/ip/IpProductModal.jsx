"use client";

import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import CustomModal from "../../CustomModal";
import UserService from "../../../services/user.service";

export default function IpProductModal({
  isOpen,
  onClose,
  product, // Если редактирование, передаётся объект продукта
  entrepreneur, // Связь с ИП
  categories, // Список категорий
  onSaved,
}) {
  const [localProduct, setLocalProduct] = useState({
    name: "",
    description: "",
    category_id: "",
    price: "",
  });
console.log(product)
  // Сброс состояния при открытии модального окна
  useEffect(() => {
    if (isOpen) {
      if (product) {
        // Редактируем существующий продукт
        setLocalProduct({
          name: product.name || "",
          description: product.description || "",
          category_id: product.category_id || "",
          price: product.price || "",
        });
      } else {
        // Создаём новый продукт, сбрасываем все данные
        setLocalProduct({
          name: "",
          description: "",
          category_id: "",
          price: "",
        });
      }
    }
  }, [isOpen, product]); // Следим за изменениями `isOpen` и `product`

  const handleSave = async () => {
    try {
      if (product) {
        // Редактирование продукта
        await UserService.updateProduct(product.id, localProduct);
        toast.success("Продукт успешно обновлён");
      } else {
        // Создание нового продукта
        await UserService.createProduct({
          ...localProduct,
          individual_entrepreneur_id: entrepreneur.id, // Связываем продукт с ИП
        });
        toast.success("Продукт успешно создан");
      }
      onClose(); // Закрываем модальное окно
      onSaved(); // Обновляем родительский компонент
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
        <input
          type="text"
          className="w-full p-2 border rounded"
          value={localProduct.description}
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
          {categories.length > 0 ? (
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
        <label className="block mb-1 font-medium">Цена *</label>
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
        <button
          onClick={onClose}
          className="bg-gray-500 text-white px-4 py-2 rounded"
        >
          Отмена
        </button>
        <button
          onClick={handleSave}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Сохранить
        </button>
      </div>
    </CustomModal>
  );
}
