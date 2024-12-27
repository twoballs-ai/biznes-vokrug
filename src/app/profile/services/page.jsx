"use client";

import { useState, useEffect } from "react";
import UserService from "../../../services/user.service";

export default function ServicesPage() {
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [serviceData, setServiceData] = useState({
    name: "",
    description: "",
    price: "",
  });

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const fetchServices = async () => {
    setLoading(true);
    try {
      const response = await UserService.getServicesByUser(); // Предполагаем, что метод реализован
      if (response.data.status) {
        setServices(response.data.data);
        setMessage("");
      } else {
        setServices([]);
        setMessage(response.data.message || "Услуги не найдены.");
      }
    } catch (error) {
      console.error("Ошибка при загрузке услуг:", error);
      setMessage("Произошла ошибка при загрузке данных.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  if (loading) {
    return <div>Загрузка...</div>;
  }

  const handleCreateOrUpdate = async () => {
    try {
      if (isEditMode) {
        await UserService.updateService(selectedService.id, serviceData);
        alert("Услуга успешно обновлена");
      } else {
        await UserService.createService(serviceData);
        alert("Услуга успешно создана");
      }
      setIsModalOpen(false);
      setServiceData({});
      fetchServices();
    } catch (error) {
      console.error("Ошибка при сохранении услуги:", error);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Вы уверены, что хотите удалить услугу?")) return;

    try {
      await UserService.deleteService(id);
      alert("Услуга успешно удалена");
      fetchServices();
    } catch (error) {
      console.error("Ошибка при удалении услуги:", error);
    }
  };

  const handleEdit = (service) => {
    setSelectedService(service);
    setServiceData(service);
    setIsEditMode(true);
    setIsModalOpen(true);
  };

  const handleCreate = () => {
    setSelectedService(null);
    setServiceData({});
    setIsEditMode(false);
    setIsModalOpen(true);
  };

  const handleView = (service) => {
    setSelectedService(service);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Мои услуги</h1>

      {services.length > 0 ? (
        services.map((service) => (
          <div key={service.id} className="border p-4 mb-4 rounded">
            <h2 className="text-xl font-bold">{service.name}</h2>
            <p>{service.description || "Описание отсутствует"}</p>
            <p>
              <strong>Цена:</strong> {service.price} руб.
            </p>
            <div className="flex space-x-4 mt-2">
              <button
                onClick={() => handleView(service)}
                className="bg-blue-500 text-white py-1 px-4 rounded"
              >
                Просмотр
              </button>
              <button
                onClick={() => handleEdit(service)}
                className="bg-yellow-500 text-white py-1 px-4 rounded"
              >
                Редактировать
              </button>
              <button
                onClick={() => handleDelete(service.id)}
                className="bg-red-500 text-white py-1 px-4 rounded"
              >
                Удалить
              </button>
            </div>
          </div>
        ))
      ) : (
        <p>Услуги отсутствуют</p>
      )}

      <button
        onClick={handleCreate}
        className="mt-4 bg-green-600 text-white py-2 px-4 rounded"
      >
        Добавить услугу
      </button>

      {selectedService && (
        <div className="border mt-6 p-4 rounded bg-gray-100">
          <h2 className="text-xl font-bold mb-2">Детали услуги</h2>
          <p>
            <strong>Название:</strong> {selectedService.name}
          </p>
          <p>
            <strong>Описание:</strong> {selectedService.description || "Не указано"}
          </p>
          <p>
            <strong>Цена:</strong> {selectedService.price} руб.
          </p>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4">
              {isEditMode ? "Редактировать услугу" : "Создать услугу"}
            </h2>
            <input
              type="text"
              placeholder="Название"
              value={serviceData.name || ""}
              onChange={(e) => setServiceData({ ...serviceData, name: e.target.value })}
              className="w-full mb-3 p-2 border rounded"
            />
            <input
              type="text"
              placeholder="Описание"
              value={serviceData.description || ""}
              onChange={(e) => setServiceData({ ...serviceData, description: e.target.value })}
              className="w-full mb-3 p-2 border rounded"
            />
            <input
              type="number"
              placeholder="Цена"
              value={serviceData.price || ""}
              onChange={(e) => setServiceData({ ...serviceData, price: e.target.value })}
              className="w-full mb-3 p-2 border rounded"
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setIsModalOpen(false)}
                className="bg-gray-500 text-white py-2 px-4 rounded"
              >
                Отмена
              </button>
              <button
                onClick={handleCreateOrUpdate}
                className="bg-green-500 text-white py-2 px-4 rounded"
              >
                Сохранить
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
