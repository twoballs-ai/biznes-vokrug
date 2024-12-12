"use client";
// import { useContext, useEffect } from 'react';
// import { AuthContext } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  // const { user, logout } = useContext(AuthContext);
  const router = useRouter();

  // useEffect(() => {
  //   if (!user) {
  //     // Если пользователь не авторизован, перенаправляем на страницу входа
  //     router.push('/login');
  //   }
  // }, [user, router]);

  // if (!user) {
  //   return <div>Загрузка...</div>; // Или спиннер загрузки
  // }

  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Профиль</h1>
      {/* <p><strong>Имя:</strong> {user.name}</p>
      <p><strong>Email:</strong> {user.email}</p> */}
      {/* Добавьте другую информацию по необходимости */}
      <button
        // onClick={logout}
        className="mt-4 bg-blue-600 text-white py-2 px-4 rounded"
      >
        Выйти
      </button>
    </div>
  );
}
