"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import UserService from "../../services/user.service";
import ModalWrapper from "../../components/CustomModal";
import AddAddressModal from "@/components/adressModal"; // Импорт твоей модалки адреса
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FiEdit2, FiTrash2 } from "react-icons/fi";

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Для модалки изменения имени
  const [showNameModal, setShowNameModal] = useState(false);
  const [nameInput, setNameInput] = useState("");

  // Для модалки добавления/редактирования адреса
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null); // null — добавление, иначе редактирование объекта

  const router = useRouter();

  useEffect(() => {
    fetchUserDetails();
  }, [router]);

  const fetchUserDetails = async () => {
    try {
      const response = await UserService.getUserDetails();
      setUser(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Ошибка при загрузке данных пользователя:", error);
      router.push("/login");
    }
  };

  // Имя
  const openNameModal = () => {
    setNameInput(user.name || "");
    setShowNameModal(true);
  };
  const closeNameModal = () => setShowNameModal(false);
  const handleNameChange = (e) => setNameInput(e.target.value);
  const handleNameSubmit = async (e) => {
    e.preventDefault();
    try {
      await UserService.updateUserInfo({ name: nameInput });
      setUser((prev) => ({ ...prev, name: nameInput }));
      toast.success("Имя успешно обновлено!");
      setShowNameModal(false);
    } catch (error) {
      console.error("Ошибка при обновлении имени:", error);
      toast.error("Не удалось обновить имя. Попробуйте позже.");
    }
  };

  // Адреса
  const openAddAddressModal = () => {
    setEditingAddress(null);
    setShowAddressModal(true);
  };

  const openEditAddressModal = (address) => {
    setEditingAddress(address);
    setShowAddressModal(true);
  };

  const closeAddressModal = () => {
    setShowAddressModal(false);
    setEditingAddress(null);
  };

  // Добавление и редактирование адреса — передаем в модалку
  // Здесь в твоем AddAddressModal надо добавить поддержку initialData и режим редактирования
  // Я ниже напишу пример, как доработать AddAddressModal

  // Удаление адреса
  const handleDeleteAddress = async (id) => {
    if (!confirm("Вы уверены, что хотите удалить этот адрес?")) return;

    try {
      await UserService.deleteAddress(id);
      toast.success("Адрес успешно удалён");
      fetchUserDetails(); // Обновляем список адресов
    } catch (error) {
      toast.error("Ошибка при удалении адреса");
      console.error(error);
    }
  };

  if (loading) return <div>Загрузка...</div>;
  if (!user) return <div>Не удалось загрузить данные пользователя</div>;

  return (
    <div>
      <ToastContainer />

      <h1 className="text-2xl font-bold mb-4 flex items-center">
        Добро пожаловать{user.name ? `, ${user.name}!` : "!"}
        <button
          onClick={openNameModal}
          aria-label="Изменить имя"
          className="ml-3 text-blue-500 hover:text-blue-700 focus:outline-none"
          title="Изменить имя"
        >
          <FiEdit2 size={20} />
        </button>
      </h1>

      <div className="mb-4">
        <p>
          <strong>Email:</strong> {user.email}
        </p>
        <p>
          <strong>Телефон:</strong> {user.phone || "не указан"}
        </p>
      </div>

      <div className="mt-6">
        <h2 className="text-xl font-bold mb-2 flex justify-between items-center">
          Адреса
          <button
            onClick={openAddAddressModal}
            className="text-green-600 hover:text-green-800"
            title="Добавить адрес"
            aria-label="Добавить адрес"
          >
            + Добавить
          </button>
        </h2>

        {user.addresses && user.addresses.length > 0 ? (
          <ul className="list-disc pl-5 space-y-2">
            {user.addresses.map((addr) => (
              <li key={addr.id} className="flex justify-between items-center">
                <span>
                  {addr.region}, {addr.city}
                  {addr.line ? `, ${addr.line}` : ""}
                  {addr.type ? ` (${addr.type})` : ""}
                </span>

                <span className="space-x-3 text-gray-600">
                  <button
                    onClick={() => openEditAddressModal(addr)}
                    aria-label="Редактировать адрес"
                    title="Редактировать адрес"
                    className="hover:text-blue-600"
                  >
                    <FiEdit2 />
                  </button>
                  <button
                    onClick={() => handleDeleteAddress(addr.id)}
                    aria-label="Удалить адрес"
                    title="Удалить адрес"
                    className="hover:text-red-600"
                  >
                    <FiTrash2 />
                  </button>
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p>Адреса не указаны</p>
        )}
      </div>

      {/* Модалка для изменения имени */}
      <ModalWrapper isOpen={showNameModal} onClose={closeNameModal} title="Изменить имя">
        <form onSubmit={handleNameSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="block font-medium mb-1">
              Имя
            </label>
            <input
              id="name"
              name="name"
              type="text"
              className="border p-2 w-full"
              value={nameInput}
              onChange={handleNameChange}
              required
            />
          </div>

          <div className="flex justify-end space-x-2">
            <button
              type="button"
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
              onClick={closeNameModal}
            >
              Отмена
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Сохранить
            </button>
          </div>
        </form>
      </ModalWrapper>

      {/* Модалка добавления/редактирования адреса */}
      <AddAddressModal
        isOpen={showAddressModal}
        onClose={closeAddressModal}
        onAdded={fetchUserDetails}
        initialData={editingAddress} // сюда передаем адрес для редактирования или null для добавления
      />
    </div>
  );
}
