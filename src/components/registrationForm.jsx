'use client';
import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AuthService from '@/services/auth.service';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const RegistrationForm = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [userData, setUserData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const [obscure, setObscure] = useState(true);

  const [agreeLegal, setAgreeLegal] = useState(false);
  const [agreePD, setAgreePD] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    if (!userData.name.trim()) {
      toast.error('Введите имя');
      return false;
    }
    if (!userData.email.includes('@')) {
      toast.error('Введите корректный email');
      return false;
    }
    if (userData.password.length < 6) {
      toast.error('Пароль должен быть минимум 6 символов');
      return false;
    }
    if (!agreeLegal) {
      toast.error('Нужно принять Пользовательское соглашение и Политику конфиденциальности');
      return false;
    }
    if (!agreePD) {
      toast.error('Нужно дать согласие на обработку персональных данных');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);

    const payload = {
      user: {
        ...userData,
        consent_terms: agreeLegal,
        consent_privacy: agreeLegal,
        consent_pd: agreePD,
      },
    };

    try {
      const response = await AuthService.Register(payload);

      if (response.status === 200 || response.status === 201) {
        toast.success('Регистрация прошла успешно!', { autoClose: 3000 });
        router.push('/login'); // ← как Flutter context.go('/listings')
      } else {
        const errorData = await response.json();
        toast.error(`Не удалось зарегистрироваться: ${errorData.message}`);
      }
    } catch (error) {
      console.error(error);
      toast.error('Не удалось зарегистрироваться. Попробуйте снова.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <ToastContainer />
      <h1 className="text-2xl font-bold text-center mb-6">Создайте аккаунт</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Имя */}
        <input
          type="text"
          name="name"
          placeholder="Имя"
          value={userData.name}
          onChange={handleChange}
          className="w-full p-2 border rounded-md"
        />

        {/* Email */}
        <input
          type="email"
          name="email"
          placeholder="Электронная почта"
          value={userData.email}
          onChange={handleChange}
          className="w-full p-2 border rounded-md"
        />

        {/* Пароль */}
        <div className="relative">
          <input
            type={obscure ? 'password' : 'text'}
            name="password"
            placeholder="Пароль (мин. 6 символов)"
            value={userData.password}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
          />
          <button
            type="button"
            onClick={() => setObscure(!obscure)}
            className="absolute right-2 top-2 text-gray-500"
          >
            {obscure ? 'Показать' : 'Скрыть'}
          </button>
        </div>

        {/* Чекбоксы */}
        <div className="flex flex-col space-y-2">
          <label className="flex items-start space-x-2">
            <input type="checkbox" checked={agreeLegal} onChange={(e) => setAgreeLegal(e.target.checked)} />
            <span>
              Я принимаю{' '}
              <Link href="/legal/terms" className="underline text-blue-600">Пользовательское соглашение</Link> и{' '}
              <Link href="/legal/privacy" className="underline text-blue-600">Политику конфиденциальности</Link>
            </span>
          </label>

          <label className="flex items-start space-x-2">
            <input type="checkbox" checked={agreePD} onChange={(e) => setAgreePD(e.target.checked)} />
            <span>
              Даю согласие на{' '}
              <Link href="/legal/consent" className="underline text-blue-600">обработку персональных данных</Link>
            </span>
          </label>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 px-4 bg-blue-600 text-white rounded-md"
        >
          {loading ? 'Загрузка...' : 'Зарегистрироваться'}
        </button>
      </form>

      <div className="mt-4 text-center">
        <Link href="/login" className="text-blue-600 hover:underline">Уже есть аккаунт? Войти</Link>
      </div>
    </div>
  );
};

export default RegistrationForm;
