"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import UserService from "../../services/user.service";

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await UserService.getUserDetails();
        setUser(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Ошибка при загрузке данных пользователя:", error);
        router.push("/login"); // Перенаправление на страницу входа
      }
    };

    fetchUserDetails();
  }, [router]);

  if (loading) {
    return <div>Загрузка...</div>;
  }

  if (!user) {
    return <div>Не удалось загрузить данные пользователя</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">
        Добро пожаловать{user.name ? `, ${user.name}!` : "!"}
      </h1>
      <p className="mb-4">
        <strong>Email:</strong> {user.email}
      </p>
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-blue-100 p-4 rounded">
          <h2 className="text-xl font-bold">Организации</h2>
          <p>{user.organizations?.length || 0} организаций</p>
        </div>
        <div className="bg-green-100 p-4 rounded">
          <h2 className="text-xl font-bold">Индивидуальный предприниматель</h2>
          <p>
            {user.individual_entrepreneur ? "1 зарегистрирован" : "Нет данных"}
          </p>
        </div>
        <div className="bg-yellow-100 p-4 rounded">
          <h2 className="text-xl font-bold">Продукты</h2>
          <p>Данные отображаются в разделе продуктов</p>
        </div>
        <div className="bg-purple-100 p-4 rounded">
          <h2 className="text-xl font-bold">Услуги</h2>
          <p>Данные отображаются в разделе услуг</p>
        </div>
      </div>
    </div>
  );
}
