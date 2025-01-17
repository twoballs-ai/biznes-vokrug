"use client";

import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import CustomModal from "../../CustomModal";
import UserService from "../../../services/user.service";

export default function IpProductModal({
  isOpen,
  onClose,
  product,
  categories,
  onSaved,
}) {
  const [localProduct, setLocalProduct] = useState({
    name: "",
    description: "",
    category_id: "",
    price: "",
  });

  const [selectedImages, setSelectedImages] = useState([]); // Список загруженных изображений

  // При открытии модалки (isOpen), проверяем product:
  useEffect(() => {
    if (isOpen) {
      if (product) {
        setLocalProduct({
          name: product.name || "",
          description: product.description || "",
          category_id: product.category_id || "",
          price: product.price || "",
        });
      } else {
        setLocalProduct({
          name: "",
          description: "",
          category_id: "",
          price: "",
        });
      }
      setSelectedImages([]); // Очищаем выбранные изображения при открытии
    }
  }, [isOpen, product]);

  // Обработчик выбора изображений
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
  
    // Фильтруем файлы (ограничиваем размер 5MB и максимум 5 файлов)
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
  // Удаление изображения перед загрузкой
  const removeImage = (index) => {
    setSelectedImages(selectedImages.filter((_, i) => i !== index));
  };

  // Обработка сохранения (создание/редактирование)
  const handleSave = async () => {
    try {
      const formData = new FormData();
  
      // Проверяем, есть ли данные
      console.log("localProduct перед отправкой:", localProduct);
  
      formData.append("name", localProduct.name);
      formData.append("description", localProduct.description);
      formData.append("category_id", localProduct.category_id);
      formData.append("price", localProduct.price);
  
      // Проверяем, есть ли файлы
      console.log("Выбранные изображения:", selectedImages);
  
      selectedImages.forEach((file, index) => {
        formData.append("images", file);
      });
  
      // Выводим данные formData для отладки
      for (let [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
      }
  
      if (product) {
        await UserService.updateProductIp(product.id, formData);
        toast.success("Продукт успешно обновлён");
      } else {
        await UserService.createProductForIp(formData);
        toast.success("Продукт успешно создан");
      }
  
      onClose();
      onSaved();
    } catch (error) {
      console.error("Ошибка при сохранении продукта:", error);
      toast.error("Ошибка при сохранении продукта.");
    }
  };

  return (
    <CustomModal isOpen={isOpen} onClose={onClose} title={product ? "Редактировать продукт" : "Создать продукт"}>
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
        <textarea
          className="w-full p-2 border rounded"
          value={localProduct.description}
          rows={4}
          onChange={(e) => setLocalProduct({ ...localProduct, description: e.target.value })}
        />
      </div>

      <div className="mb-3">
        <label className="block mb-1 font-medium">Категория *</label>
        <select
          className="w-full p-2 border rounded"
          value={localProduct.category_id}
          onChange={(e) => setLocalProduct({ ...localProduct, category_id: e.target.value })}
        >
          <option value="">Выберите</option>
          {categories?.length > 0 ? (
            categories.map((c) => (
              <option key={c.key} value={c.key}>
                {c.value}
              </option>
            ))
          ) : (
            <option value="" disabled>Категории отсутствуют</option>
          )}
        </select>
      </div>

      <div className="mb-3">
        <label className="block mb-1 font-medium">Цена в рублях *</label>
        <input
          type="number"
          className="w-full p-2 border rounded"
          value={localProduct.price}
          onChange={(e) => setLocalProduct({ ...localProduct, price: e.target.value })}
        />
      </div>

      {/* Выбор файлов */}
      <div className="mb-3">
        <label className="block mb-1 font-medium">Фотографии продукта</label>
        <input type="file" multiple className="w-full p-2 border rounded" onChange={handleImageChange} />
        
        {/* Отображение миниатюр */}
        <div className="mt-2 flex flex-wrap gap-2">
          {selectedImages.map((file, index) => (
            <div key={index} className="relative">
              <img src={URL.createObjectURL(file)} alt="preview" className="w-20 h-20 object-cover rounded" />
              <button onClick={() => removeImage(index)} className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 text-xs">X</button>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end space-x-2">
        <button onClick={onClose} className="bg-gray-500 text-white px-4 py-2 rounded">Отмена</button>
        <button onClick={handleSave} className="bg-green-500 text-white px-4 py-2 rounded">Сохранить</button>
      </div>
    </CustomModal>
  );
}
