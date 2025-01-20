"use client";

import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import CustomModal from "../../CustomModal";
import UserService from "../../../services/user.service";

export default function IpServiceModal({
  isOpen,
  onClose,
  service,        // null => создание, объект => редактирование
  categories,     // список категорий для <select>
  onSaved,
}) {
  const [localService, setLocalService] = useState({
    name: "",
    description: "",
    price: "",
    category_id: "",
  });

  const [selectedImages, setSelectedImages] = useState([]); // Список загруженных изображений

  useEffect(() => {
    if (isOpen) {
      setLocalService(
        service
          ? {
              name: service.name || "",
              description: service.description || "",
              price: service.price || "",
              category_id: service.category_id || "",
            }
          : {
              name: "",
              description: "",
              price: "",
              category_id: "",
            }
      );
      setSelectedImages([]); // Очищаем выбранные изображения при открытии
    }
  }, [isOpen, service]);

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

      formData.append("name", localService.name);
      formData.append("description", localService.description);
      formData.append("category_id", localService.category_id);
      formData.append("price", localService.price);

      // Добавляем изображения
      selectedImages.forEach((file) => {
        formData.append("images", file);
      });

      if (service) {
        await UserService.updateServiceIp(service.id, formData);
        toast.success("Услуга успешно обновлена");
      } else {
        await UserService.createServiceForIp(formData);
        toast.success("Услуга успешно создана");
      }

      onClose();
      onSaved();
    } catch (error) {
      console.error("Ошибка при сохранении услуги:", error);
      toast.error("Ошибка при сохранении услуги.");
    }
  };

  return (
    <CustomModal
      isOpen={isOpen}
      onClose={onClose}
      title={service ? "Редактировать услугу" : "Создать услугу"}
    >
      <div className="mb-3">
        <label className="block mb-1 font-medium">Название услуги *</label>
        <input
          type="text"
          className="w-full p-2 border rounded"
          value={localService.name}
          onChange={(e) =>
            setLocalService({ ...localService, name: e.target.value })
          }
        />
      </div>
      <div className="mb-3">
        <label className="block mb-1 font-medium">Описание услуги</label>
        <textarea
          className="w-full p-2 border rounded"
          value={localService.description}
          rows={4}
          onChange={(e) =>
            setLocalService({ ...localService, description: e.target.value })
          }
        />
      </div>
      <div className="mb-3">
        <label className="block mb-1 font-medium">Категория *</label>
        <select
          className="w-full p-2 border rounded"
          value={localService.category_id}
          onChange={(e) =>
            setLocalService({ ...localService, category_id: e.target.value })
          }
        >
          <option value="">Выберите категорию</option>
          {categories?.map((c) => (
            <option key={c.key} value={c.key}>
              {c.value}
            </option>
          ))}
        </select>
      </div>
      <div className="mb-3">
        <label className="block mb-1 font-medium">Цена *</label>
        <input
          type="number"
          className="w-full p-2 border rounded"
          value={localService.price}
          onChange={(e) =>
            setLocalService({ ...localService, price: e.target.value })
          }
        />
      </div>

      {/* Выбор файлов */}
      <div className="mb-3">
        <label className="block mb-1 font-medium">Фотографии услуги</label>
        <input
          type="file"
          multiple
          className="w-full p-2 border rounded"
          onChange={handleImageChange}
        />
        
        {/* Отображение миниатюр */}
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
