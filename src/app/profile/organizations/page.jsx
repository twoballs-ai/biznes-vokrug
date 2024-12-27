"use client";

import { useState, useEffect } from "react";
import UserService from "../../../services/user.service";

export default function OrganizationsPage() {
  const [organizations, setOrganizations] = useState([]);
  const [selectedOrg, setSelectedOrg] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [orgData, setOrgData] = useState({
    name: "",
    description: "",
    ogrn: "",
    inn: "",
    phone: "",
    email: "",
    address: "",
    city: "",
  });

  const [loading, setLoading] = useState(true); // Добавим индикатор загрузки
  const [message, setMessage] = useState(""); // Для сообщения об ошибке или пустом списке

  const fetchOrganizationsByUser = async () => {
    setLoading(true); // Начинаем загрузку
    try {
      const response = await UserService.getOrganizationsByUser();
      if (response.data.status) {
        // Если есть организации
        setOrganizations(response.data.data);
        setMessage(""); // Очищаем сообщение
      } else {
        // Если организаций нет
        setOrganizations([]);
        setMessage(response.data.message || "Организации не найдены.");
      }
    } catch (error) {
      console.error("Ошибка при загрузке организаций:", error);
      setMessage("Произошла ошибка при загрузке данных.");
    } finally {
      setLoading(false); // Завершаем загрузку
    }
  };

  useEffect(() => {
    fetchOrganizationsByUser();
  }, []);

  if (loading) {
    return <div>Загрузка...</div>; // Индикатор загрузки
  }


  const handleCreateOrUpdate = async () => {
    try {
      if (isEditMode) {
        await UserService.updateOrganization(selectedOrg.id, orgData);
        alert("Организация успешно обновлена");
      } else {
        await UserService.createOrganization(orgData);
        alert("Организация успешно создана");
      }
      setIsModalOpen(false);
      setOrgData({});
      fetchOrganizationsByUser();
    } catch (error) {
      console.error("Ошибка при сохранении организации:", error);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Вы уверены, что хотите удалить организацию?")) return;

    try {
      await UserService.deleteOrganization(id);
      alert("Организация успешно удалена");
      fetchOrganizationsByUser();
    } catch (error) {
      console.error("Ошибка при удалении организации:", error);
    }
  };

  const handleEdit = (org) => {
    setSelectedOrg(org);
    setOrgData(org);
    setIsEditMode(true);
    setIsModalOpen(true);
  };

  const handleCreate = () => {
    setSelectedOrg(null);
    setOrgData({});
    setIsEditMode(false);
    setIsModalOpen(true);
  };

  const handleView = (org) => {
    setSelectedOrg(org);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Мои организации</h1>

      {/* Список организаций */}
      {organizations.length > 0 ? (
        organizations.map((org) => (
          <div key={org.id} className="border p-4 mb-4 rounded">
            <h2 className="text-xl font-bold">{org.name}</h2>
            <p>{org.description || "Описание отсутствует"}</p>
            <div className="flex space-x-4 mt-2">
              <button
                onClick={() => handleView(org)}
                className="bg-blue-500 text-white py-1 px-4 rounded"
              >
                Просмотр
              </button>
              <button
                onClick={() => handleEdit(org)}
                className="bg-yellow-500 text-white py-1 px-4 rounded"
              >
                Редактировать
              </button>
              <button
                onClick={() => handleDelete(org.id)}
                className="bg-red-500 text-white py-1 px-4 rounded"
              >
                Удалить
              </button>
            </div>
          </div>
        ))
      ) : (
        <p>Организации отсутствуют</p>
      )}

      <button
        onClick={handleCreate}
        className="mt-4 bg-green-600 text-white py-2 px-4 rounded"
      >
        Добавить организацию
      </button>

      {/* Детали выбранной организации */}
      {selectedOrg && (
        <div className="border mt-6 p-4 rounded bg-gray-100">
          <h2 className="text-xl font-bold mb-2">Детали организации</h2>
          <p>
            <strong>Название:</strong> {selectedOrg.name}
          </p>
          <p>
            <strong>ОГРН:</strong> {selectedOrg.ogrn}
          </p>
          <p>
            <strong>ИНН:</strong> {selectedOrg.inn}
          </p>
          <p>
            <strong>Адрес:</strong> {selectedOrg.address || "Не указан"}
          </p>
          <p>
            <strong>Email:</strong> {selectedOrg.email || "Не указан"}
          </p>
        </div>
      )}

      {/* Модальное окно для создания/редактирования */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4">
              {isEditMode ? "Редактировать организацию" : "Создать организацию"}
            </h2>
            <input
              type="text"
              placeholder="Название"
              value={orgData.name || ""}
              onChange={(e) => setOrgData({ ...orgData, name: e.target.value })}
              className="w-full mb-3 p-2 border rounded"
            />
            <input
              type="text"
              placeholder="ОГРН"
              value={orgData.ogrn || ""}
              onChange={(e) => setOrgData({ ...orgData, ogrn: e.target.value })}
              className="w-full mb-3 p-2 border rounded"
            />
            <input
              type="text"
              placeholder="ИНН"
              value={orgData.inn || ""}
              onChange={(e) => setOrgData({ ...orgData, inn: e.target.value })}
              className="w-full mb-3 p-2 border rounded"
            />
            <input
              type="text"
              placeholder="Email"
              value={orgData.email || ""}
              onChange={(e) => setOrgData({ ...orgData, email: e.target.value })}
              className="w-full mb-3 p-2 border rounded"
            />
            <input
              type="text"
              placeholder="Адрес"
              value={orgData.address || ""}
              onChange={(e) =>
                setOrgData({ ...orgData, address: e.target.value })
              }
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
