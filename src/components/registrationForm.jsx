'use client';
import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AuthService from '@/services/auth.service';

const RegistrationForm = () => {
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
  });

  const [addOrganization, setAddOrganization] = useState(false);
  const [addIndividualEntrepreneur, setAddIndividualEntrepreneur] = useState(false);
  const [organizationData, setOrganizationData] = useState({
    name: '',
    description: '',
    address: '',
    inn: '',
    ogrn: '',
    phone: '',
    website: '',
    email: '',
    category: '',
    is_verified: false,
    rating: 0,
    logo_url: '',
    city: '',
  });
  const [ieData, setIeData] = useState({
    inn: '',
    ogrnip: '',
    phone: '',
  });

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

        <h2 className="text-lg font-semibold">Дополнительные параметры</h2>
        <div className="flex items-center">
          <input
            type="checkbox"
            checked={addOrganization}
            onChange={(e) => setAddOrganization(e.target.checked)}
            className="h-4 w-4 text-blue-600"
          />
          <label className="ml-2 text-sm text-gray-900">Добавить организацию</label>
        </div>

        {addOrganization && (
          <div className="space-y-4">
            <div>
              <label htmlFor="org_name" className="block text-sm font-medium text-gray-700">
                Название организации
              </label>
              <input
                type="text"
                id="org_name"
                name="name"
                placeholder="Введите название организации"
                value={organizationData.name}
                onChange={handleOrganizationChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label htmlFor="org_inn" className="block text-sm font-medium text-gray-700">
                ИНН
              </label>
              <input
                type="text"
                id="org_inn"
                name="inn"
                placeholder="Введите ИНН"
                value={organizationData.inn}
                onChange={handleOrganizationChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label htmlFor="org_ogrn" className="block text-sm font-medium text-gray-700">
                ОГРН
              </label>
              <input
                type="text"
                id="org_ogrn"
                name="ogrn"
                placeholder="Введите ОГРН"
                value={organizationData.ogrn}
                onChange={handleOrganizationChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        )}

        <div className="flex items-center mt-4">
          <input
            type="checkbox"
            checked={addIndividualEntrepreneur}
            onChange={(e) => setAddIndividualEntrepreneur(e.target.checked)}
            className="h-4 w-4 text-blue-600"
          />
          <label className="ml-2 text-sm text-gray-900">Добавить ИП</label>
        </div>

        {addIndividualEntrepreneur && (
          <div className="space-y-4">
            <div>
              <label htmlFor="ie_inn" className="block text-sm font-medium text-gray-700">
                ИНН
              </label>
              <input
                type="text"
                id="ie_inn"
                name="inn"
                placeholder="Введите ИНН"
                value={ieData.inn}
                onChange={handleIeChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label htmlFor="ie_ogrnip" className="block text-sm font-medium text-gray-700">
                ОГРНИП
              </label>
              <input
                type="text"
                id="ie_ogrnip"
                name="ogrnip"
                placeholder="Введите ОГРНИП"
                value={ieData.ogrnip}
                onChange={handleIeChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        )}

        <button
          type="submit"
          className="w-full py-2 px-4 bg-blue-600 text-white rounded-md"
        >
          Зарегистрироваться
        </button>
      </form>
    </div>
  );
};

export default RegistrationForm;
