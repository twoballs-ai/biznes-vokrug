"use client";

import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import CustomModal from "../../CustomModal";
import UserService from "../../../services/user.service";

export default function IpServiceModal({
  isOpen,
  onClose,
  service,
  entrepreneur,
  onSaved,
}) {
  const [localService, setLocalService] = useState({
    name: "",
    description: "",
    price: "",
  });

  useEffect(() => {
    setLocalService(
      service
        ? { name: service.name || "", description: service.description || "", price: service.price || "" }
        : { name: "", description: "", price: "" }
    );
  }, [service]);

  const handleSave = async () => {
    try {
      if (service) {
        // Редактирование
        await UserService.updateService(service.id, localService);
        toast.success("Услуга обновлена");
      } else {
        // Создание
        await UserService.createService({
          ...localService,
          individualEntrepreneurId: entrepreneur.id,
        });
        toast.success("Услуга создана");
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
          onChange={(e) => setLocalService({ ...localService, name: e.target.value })}
        />
      </div>
      <div className="mb-3">
        <label className="block mb-1 font-medium">Описание услуги</label>
        <input
          type="text"
          className="w-full p-2 border rounded"
          value={localService.description}
          onChange={(e) => setLocalService({ ...localService, description: e.target.value })}
        />
      </div>
      <div className="mb-3">
        <label className="block mb-1 font-medium">Цена *</label>
        <input
          type="number"
          className="w-full p-2 border rounded"
          value={localService.price}
          onChange={(e) => setLocalService({ ...localService, price: e.target.value })}
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
