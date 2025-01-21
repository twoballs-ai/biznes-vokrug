"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import UserService from "../../services/user.service";
import ModalWrapper from "../../components/CustomModal"; // Импорт переиспользуемого компонента модального окна
import { toast, ToastContainer } from "react-toastify"; // Импорт Toastify
import "react-toastify/dist/ReactToastify.css"; // Импорт стилей Toastify
export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false); // Управление модальным окном
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const router = useRouter();

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await UserService.getUserDetails();
        setUser(response.data);

        // Изначально заполняем данные для редактирования
        setFormData({
          name: response.data.name || "",
          email: response.data.email || "",
          phone: response.data.phone || "",
        });

        setLoading(false);
      } catch (error) {
        console.error("Ошибка при загрузке данных пользователя:", error);
        router.push("/login"); // Перенаправление на страницу входа
      }
    };

    fetchUserDetails();
  }, [router]);

  const handleOpenModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Обновляем данные пользователя
      await UserService.updateUserInfo({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
      });

      // Обновляем локальное состояние
      setUser((prev) => ({
        ...prev,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
      }));

      // Показываем уведомление об успешном обновлении
      toast.success("Данные профиля успешно обновлены!");

      // Закрываем модальное окно
      setShowModal(false);
    } catch (error) {
      console.error("Ошибка при обновлении профиля:", error);

      // Показываем уведомление об ошибке
      toast.error("Не удалось обновить профиль. Попробуйте позже.");
    }
  };


  if (loading) {
    return <div>Загрузка...</div>
  }

  if (!user) {
    return <div>Не удалось загрузить данные пользователя</div>
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">
        Добро пожаловать{user.name ? `, ${user.name}!` : "!"}
      </h1>
      <ToastContainer />
      {/* Блок основных данных пользователя */}
      <div className="mb-4">
        <p>
          <strong>Email:</strong> {user.email}
        </p>
        <p>
          <strong>Телефон:</strong> {user.phone || "не указан"}
        </p>
      </div>

      {/* Кнопка редактирования профиля */}
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        onClick={handleOpenModal}
      >
        Изменить данные профиля
      </button>

      {/* Модальное окно для редактирования профиля */}
      <ModalWrapper
        isOpen={showModal}
        onClose={handleCloseModal}
        title="Изменить данные профиля"
      >
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block font-medium mb-1" htmlFor="name">
              Имя
            </label>
            <input
              id="name"
              name="name"
              type="text"
              className="border p-2 w-full"
              value={formData.name}
              onChange={handleChange}
            />
          </div>

          <div className="mb-4">
            <label className="block font-medium mb-1" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              className="border p-2 w-full"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div className="mb-4">
            <label className="block font-medium mb-1" htmlFor="phone">
              Телефон
            </label>
            <input
              id="phone"
              name="phone"
              type="text"
              className="border p-2 w-full"
              value={formData.phone}
              onChange={handleChange}
            />
          </div>

          <div className="flex justify-end space-x-2">
            <button
              type="button"
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
              onClick={handleCloseModal}
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

      {/* Пример отображения данных */}
      <div className="grid grid-cols-2 gap-4 mt-6">
        <div className="bg-blue-100 p-4 rounded">
          <h2 className="text-xl font-bold">Организации</h2>
          <p>{user.organizations?.length || 0} организаций</p>

          {user.organizations?.map((org) => (
            <div key={org.id} className="mt-2">
              <p>
                <strong>Название:</strong> {org.name}
              </p>
              <p>
                <strong>Описание:</strong> {org.description}
              </p>
              <p>
                <strong>Услуг:</strong> {org.services?.length || 0}
              </p>
              <p>
                <strong>Продуктов:</strong> {org.products?.length || 0}
              </p>
            </div>
          ))}
        </div>

        <div className="bg-green-100 p-4 rounded">
          <h2 className="text-xl font-bold">Индивидуальный предприниматель</h2>
          {user.individual_entrepreneur ? (
            <>
              <p>
                <strong>ИНН:</strong> {user.individual_entrepreneur.inn}
              </p>
              <p>
                <strong>ОГРНИП:</strong> {user.individual_entrepreneur.ogrnip}
              </p>
              <p>
                <strong>Услуг:</strong>{" "}
                {user.individual_entrepreneur.services?.length || 0}
              </p>
              <p>
                <strong>Продуктов:</strong>{" "}
                {user.individual_entrepreneur.products?.length || 0}
              </p>
            </>
          ) : (
            <p>Нет данных</p>
          )}
        </div>

        <div className="bg-yellow-100 p-4 rounded">
          <h2 className="text-xl font-bold">Продукты</h2>
          <p>
            Здесь вы можете отобразить подробный список продуктов, если хотите.
          </p>
        </div>

        <div className="bg-purple-100 p-4 rounded">
          <h2 className="text-xl font-bold">Услуги</h2>
          <p>
            Здесь вы можете отобразить подробный список услуг или какие-то
            дополнительные детали.
          </p>
        </div>
      </div>
    </div>
  );
}
