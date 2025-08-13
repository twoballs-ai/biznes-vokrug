'use client';
import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch } from "react-redux";
import { login as loginAction } from "@/store/features/authSlice";
import Link from "next/link";
import { useRouter } from "next/navigation"; // <-- добавляем useRouter
import AuthService from '@/services/auth.service';

const LoginForm = () => {
  const dispatch = useDispatch();
  const router = useRouter(); // <-- инициализация роутера
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = new URLSearchParams();
    payload.append("username", email);
    payload.append("password", password);

    try {
      const response = await AuthService.login(payload); 
      console.log(response)
      const userData = response.data.user;
      const accessToken = response.data.access_token;
      const refreshToken = response.data.refresh_token;

      dispatch(loginAction({ user: userData, accessToken, refreshToken }));

      toast.success("Вы успешно вошли!", { position: "top-right", autoClose: 3000 });

      // Перенаправляем на главную страницу
      router.push("/"); 
    } catch (error) {
      console.error("Ошибка при входе:", error);
      toast.error("Произошла ошибка. Пожалуйста, попробуйте снова.", {
        position: "top-right",
        autoClose: 5000,
      });
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
      <ToastContainer />
      <h1 className="text-2xl font-bold text-center mb-6">Вход</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Электронная почта
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            placeholder="Введите email"
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Пароль
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            placeholder="Введите пароль"
          />
        </div>
        <button
          type="submit"
          className="w-full py-2 px-4 bg-blue-600 text-white rounded-md shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Войти
        </button>
      </form>

      <div className="mt-4 text-center">
        <p className="text-sm text-gray-600">
          Нет аккаунта?{" "}
          <Link href="/register" className="text-blue-600 hover:underline">
            Зарегистрируйтесь
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;
