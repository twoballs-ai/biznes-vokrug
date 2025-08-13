'use client';
import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AuthService from '@/services/auth.service';
import Link from 'next/link'; // Import Link for navigation

const RegistrationForm = () => {
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
  });

  const handleUserChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      user: userData,
    };

    console.log('Отправляемый payload:', JSON.stringify(payload, null, 2));

    try {
      const response = await AuthService.Register(payload);

      if (response.status === 200 || response.status === 201) {
        toast.success('Регистрация прошла успешно!', {
          position: 'top-right',
          autoClose: 3000,
        });
      } else {
        const errorData = await response.json();
        toast.error(`Ошибка регистрации: ${errorData.message}`, {
          position: 'top-right',
          autoClose: 5000,
        });
      }
    } catch (error) {
      console.error('Ошибка при регистрации:', error);
      toast.error('Произошла ошибка. Пожалуйста, попробуйте снова.', {
        position: 'top-right',
        autoClose: 5000,
      });
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
      <ToastContainer />
      <h1 className="text-2xl font-bold text-center mb-6">Регистрация</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Имя
          </label>
          <input
            type="text"
            id="name"
            name="name"
            placeholder="Введите имя"
            value={userData.name}
            onChange={handleUserChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
          />
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
            Телефон
          </label>
          <input
            type="text"
            id="phone"
            name="phone"
            placeholder="Введите телефон"
            value={userData.phone}
            onChange={handleUserChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Электронная почта
          </label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Введите email"
            value={userData.email}
            onChange={handleUserChange}
            required
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Пароль
          </label>
          <input
            type="password"
            id="password"
            name="password"
            placeholder="Введите пароль"
            value={userData.password}
            onChange={handleUserChange}
            required
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
          />
        </div>

        <button
          type="submit"
          className="w-full py-2 px-4 bg-blue-600 text-white rounded-md"
        >
          Зарегистрироваться
        </button>
      </form>

      {/* Link to Login page */}
      <div className="mt-4 text-center">
        <p className="text-sm text-gray-600">
          Уже есть аккаунт?{" "}
          <Link href="/login" className="text-blue-600 hover:underline">
            Войдите
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegistrationForm;
