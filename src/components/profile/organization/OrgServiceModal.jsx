"use client";

import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import CustomModal from "../../CustomModal";
import UserService from "../../../services/user.service";

export default function OrgServiceModal({
  isOpen,
  onClose,
  service,        // null => создание, объект => редактирование
  organization,   // объект организации
  categories,     // список категорий для <select>
  onSaved,
}) {
  const [localService, setLocalService] = useState({
    name: "",
    description: "",
    price: "",
    category_id: "",
  });

  // Список загруженных (новых) изображений
  const [selectedImages, setSelectedImages] = useState([]);

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
      // Очищаем выбранные изображения при каждом открытии модалки
      setSelectedImages([]);
    }
  }, [isOpen, service]);

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

  const handleSave = async () => {
    try {
      const formData = new FormData();
      // Передаем данные услуги
      formData.append("name", localService.name);
      formData.append("description", localService.description);
      formData.append("price", localService.price);
      formData.append("category_id", localService.category_id);
      formData.append("organization_id", organization.id); // Привязываем услугу к организации

      // Добавляем изображения, если они есть
      selectedImages.forEach((file) => {
        formData.append("images", file);
      });

      if (service) {
        // Редактирование
        await UserService.updateServiceOrg(service.id, formData);
        toast.success("Услуга успешно обновлена");
      } else {
        // Создание
        await UserService.createServiceForOrg(formData);
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
      {/* Название услуги */}
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

      {/* Описание услуги */}
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

      {/* Категория услуги */}
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

      {/* Цена услуги */}
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

      {/* Выбор изображений */}
      <div className="mb-3">
        <label className="block mb-1 font-medium">Фотографии услуги</label>
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
