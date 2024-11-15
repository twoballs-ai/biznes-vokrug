'use client';
import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const RegistrationForm = () => {
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
  });

  const [addOrganization, setAddOrganization] = useState(false);
  const [addIndividualEntrepreneur, setAddIndividualEntrepreneur] = useState(false);
  const [organizationData, setOrganizationData] = useState(null);
  const [ieData, setIeData] = useState(null);

  const handleUserChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
  };

  const handleOrganizationChange = (e) => {
    const { name, value } = e.target;
    setOrganizationData((prev) => ({ ...prev, [name]: value }));
  };

  const handleIeChange = (e) => {
    const { name, value } = e.target;
    setIeData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      user: userData,
      add_organization: addOrganization,
      add_individual_entrepreneur: addIndividualEntrepreneur,
      org_data: addOrganization ? organizationData : null,
      ie_data: addIndividualEntrepreneur ? ieData : null,
    };

    try {
      const response = await fetch('http://localhost:8001/api/register/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const data = await response.json();
        toast.success('Регистрация прошла успешно!', {
          position: 'top-right',
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        console.log(data);
      } else {
        const errorData = await response.json();
        toast.error(`Ошибка регистрации: ${errorData.detail}`, {
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
    } catch (error) {
      console.error('Ошибка при регистрации:', error);
      toast.error('Произошла ошибка. Пожалуйста, попробуйте снова.', {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
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
            Имя (необязательно)
          </label>
          <input
            type="text"
            id="name"
            name="name"
            placeholder="Введите имя"
            value={userData.name}
            onChange={handleUserChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Электронная почта (обязательно)
          </label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Введите email"
            value={userData.email}
            onChange={handleUserChange}
            required
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
            Телефон (необязательно)
          </label>
          <input
            type="text"
            id="phone"
            name="phone"
            placeholder="Введите телефон"
            value={userData.phone}
            onChange={handleUserChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Пароль (обязательно)
          </label>
          <input
            type="password"
            id="password"
            name="password"
            placeholder="Введите пароль"
            value={userData.password}
            onChange={handleUserChange}
            required
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <h2 className="text-lg font-semibold">Дополнительные параметры</h2>
        <div className="flex items-center">
          <input
            type="checkbox"
            checked={addOrganization}
            onChange={(e) => setAddOrganization(e.target.checked)}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label className="ml-2 text-sm text-gray-900">Добавить организацию</label>
        </div>

        <div className="flex items-center mt-4">
          <input
            type="checkbox"
            checked={addIndividualEntrepreneur}
            onChange={(e) => setAddIndividualEntrepreneur(e.target.checked)}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label className="ml-2 text-sm text-gray-900">Добавить ИП</label>
        </div>

        <button
          type="submit"
          className="w-full py-2 px-4 bg-blue-600 text-white rounded-md shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Зарегистрироваться
        </button>
      </form>
    </div>
  );
};

export default RegistrationForm;
