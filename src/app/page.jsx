'use client';

import { useEffect, useState } from 'react';
import UserService from '../services/user.service';

export default function HomePage() {
  const [city, setCity] = useState('Неизвестный город');
  const [services, setServices] = useState([]);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    // Читаем cookies вручную
    const allCookies = document.cookie.split('; ');
    const cityCookie = allCookies.find((cookie) => cookie.startsWith('city='));

    if (cityCookie) {
      const cityValue = decodeURIComponent(cityCookie.split('=')[1]);
      setCity(cityValue || 'Неизвестный город');
    }

    // Загружаем услуги и продукты из API
    const fetchData = async () => {
      try {
        const [servicesResponse, productsResponse] = await Promise.all([
          UserService.getServicesWithPagination(0, 21),
          UserService.getProductsWithPagination(0, 21),
        ]);
        setServices(servicesResponse.data.service || []); // Получаем список услуг
        setProducts(productsResponse.data.products || []); // Получаем список продуктов
      } catch (error) {
        console.error('Ошибка при загрузке данных:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <section className="text-center">
      <h2 className="text-3xl font-bold mb-4">
        Добро пожаловать на площадку бизнес вокруг.
      </h2>
      <p className="mb-4">Мы предлагаем лучшие бизнес-решения для вашего успеха.</p>
      <button className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700">
        Узнать больше
      </button>

      {/* Список последних услуг */}
      <div className="text-center">
        <h3 className="text-2xl font-semibold mb-6">Последние добавленные услуги</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <div key={service.id} className="border p-4 rounded-lg shadow-md">
              <h4 className="text-xl font-semibold mb-2">{service.name}</h4>
              <p className="text-gray-600 mb-2">{service.description}</p>
              <p className="text-gray-800 font-bold mb-2">Цена: {service.price || 'Не указана'}</p>
              <p className="text-gray-600 mb-2">Категория: {service.category || 'Не указана'}</p>
              {service.organization && (
                <p className="text-gray-600 mb-2">Фирма: {service.organization}</p>
              )}
              {service.individual_entrepreneur_id && (
                <p className="text-gray-600 mb-2">
                  Индивидуальный предприниматель ID: {service.individual_entrepreneur_id}
                </p>
              )}
              <p className="text-gray-500 text-sm">
                Дата обновления: {service.updated_at ? new Date(service.updated_at).toLocaleString() : 'Не указана'}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Список последней продукции */}
      <div className="text-center">
        <h3 className="text-2xl font-semibold mb-6">Последняя добавленная продукция</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products
            .filter(
              (product) =>
                product.organization || product.individual_entrepreneur_id // Отображаем только если хотя бы одно из полей указано
            )
            .map((product) => (
              <div key={product.id} className="border p-4 rounded-lg shadow-md">
                <h4 className="text-xl font-semibold mb-2">{product.name}</h4>
                <p className="text-gray-600 mb-2">{product.description}</p>
                <p className="text-gray-800 font-bold mb-2">Цена: {product.price || 'Не указана'}</p>
                <p className="text-gray-600 mb-2">Категория: {product.category || 'Не указана'}</p>
                {product.organization && (
                  <p className="text-gray-600 mb-2">Фирма: {product.organization}</p>
                )}
                {product.individual_entrepreneur_id && (
                  <p className="text-gray-600 mb-2">
                    Индивидуальный предприниматель ID: {product.individual_entrepreneur_id}
                  </p>
                )}
                <p className="text-gray-500 text-sm">
                  Дата обновления: {product.updated_at ? new Date(product.updated_at).toLocaleString() : 'Не указана'}
                </p>
              </div>
            ))}
        </div>
      </div>
    </section>
  );
}
