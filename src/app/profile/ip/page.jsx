"use client";

import { useState, useEffect } from "react";
import UserService from "../../../services/user.service";

export default function EntrepreneursPage() {
  const [entrepreneurs, setEntrepreneurs] = useState([]);
  const [selectedEntrepreneur, setSelectedEntrepreneur] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [entrepreneurData, setEntrepreneurData] = useState({
    name: "",
    ogrnip: "",
    inn: "",
    phone: "",
    email: "",
    address: "",
  });

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const fetchEntrepreneursByUser = async () => {
    setLoading(true);
    try {
      const response = await UserService.getIndividualEntrepreneursByUser();
      if (response.data.status) {
        setEntrepreneurs(response.data.data);
        setMessage("");
      } else {
        setEntrepreneurs([]);
        setMessage(response.data.message || "ИП не найдены.");
      }
    } catch (error) {
      console.error("Ошибка при загрузке ИП:", error);
      setMessage("Произошла ошибка при загрузке данных.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEntrepreneursByUser();
  }, []);

  if (loading) {
    return <div>Загрузка...</div>;
  }

  const handleCreateOrUpdate = async () => {
    try {
      if (isEditMode) {
        await UserService.updateIndividualEntrepreneur(selectedEntrepreneur.id, entrepreneurData);
        alert("ИП успешно обновлен");
      } else {
        await UserService.createIndividualEntrepreneur(entrepreneurData);
        alert("ИП успешно создан");
      }
      setIsModalOpen(false);
      setEntrepreneurData({});
      fetchEntrepreneursByUser();
    } catch (error) {
      console.error("Ошибка при сохранении ИП:", error);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Вы уверены, что хотите удалить ИП?")) return;

    try {
      await UserService.deleteIndividualEntrepreneur(id);
      alert("ИП успешно удален");
      fetchEntrepreneursByUser();
    } catch (error) {
      console.error("Ошибка при удалении ИП:", error);
    }
  };

  const handleEdit = (entrepreneur) => {
    setSelectedEntrepreneur(entrepreneur);
    setEntrepreneurData(entrepreneur);
    setIsEditMode(true);
    setIsModalOpen(true);
  };

  const handleCreate = () => {
    setSelectedEntrepreneur(null);
    setEntrepreneurData({});
    setIsEditMode(false);
    setIsModalOpen(true);
  };

  const handleView = (entrepreneur) => {
    setSelectedEntrepreneur(entrepreneur);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Мои индивидуальные предприниматели</h1>

      {entrepreneurs.length > 0 ? (
        entrepreneurs.map((entrepreneur) => (
          <div key={entrepreneur.id} className="border p-4 mb-4 rounded">
            <h2 className="text-xl font-bold">{entrepreneur.name}</h2>
            <p>{entrepreneur.description || "Описание отсутствует"}</p>
            <div className="flex space-x-4 mt-2">
              <button
                onClick={() => handleView(entrepreneur)}
                className="bg-blue-500 text-white py-1 px-4 rounded"
              >
                Просмотр
              </button>
              <button
                onClick={() => handleEdit(entrepreneur)}
                className="bg-yellow-500 text-white py-1 px-4 rounded"
              >
                Редактировать
              </button>
              <button
                onClick={() => handleDelete(entrepreneur.id)}
                className="bg-red-500 text-white py-1 px-4 rounded"
              >
                Удалить
              </button>
            </div>
          </div>
        ))
      ) : (
        <p>ИП отсутствуют</p>
      )}

      <button
        onClick={handleCreate}
        className="mt-4 bg-green-600 text-white py-2 px-4 rounded"
      >
        Добавить ИП
      </button>

      {selectedEntrepreneur && (
        <div className="border mt-6 p-4 rounded bg-gray-100">
          <h2 className="text-xl font-bold mb-2">Детали ИП</h2>
          <p>
            <strong>Название:</strong> {selectedEntrepreneur.name}
          </p>
          <p>
            <strong>ОГРНИП:</strong> {selectedEntrepreneur.ogrnip}
          </p>
          <p>
            <strong>ИНН:</strong> {selectedEntrepreneur.inn}
          </p>
          <p>
            <strong>Адрес:</strong> {selectedEntrepreneur.address || "Не указан"}
          </p>
          <p>
            <strong>Email:</strong> {selectedEntrepreneur.email || "Не указан"}
          </p>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4">
              {isEditMode ? "Редактировать ИП" : "Создать ИП"}
            </h2>
            <input
              type="text"
              placeholder="Название"
              value={entrepreneurData.name || ""}
              onChange={(e) => setEntrepreneurData({ ...entrepreneurData, name: e.target.value })}
              className="w-full mb-3 p-2 border rounded"
            />
            <input
              type="text"
              placeholder="ОГРНИП"
              value={entrepreneurData.ogrnip || ""}
              onChange={(e) => setEntrepreneurData({ ...entrepreneurData, ogrnip: e.target.value })}
              className="w-full mb-3 p-2 border rounded"
            />
            <input
              type="text"
              placeholder="ИНН"
              value={entrepreneurData.inn || ""}
              onChange={(e) => setEntrepreneurData({ ...entrepreneurData, inn: e.target.value })}
              className="w-full mb-3 p-2 border rounded"
            />
            <input
              type="text"
              placeholder="Email"
              value={entrepreneurData.email || ""}
              onChange={(e) => setEntrepreneurData({ ...entrepreneurData, email: e.target.value })}
              className="w-full mb-3 p-2 border rounded"
            />
            <input
              type="text"
              placeholder="Адрес"
              value={entrepreneurData.address || ""}
              onChange={(e) => setEntrepreneurData({ ...entrepreneurData, address: e.target.value })}
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
