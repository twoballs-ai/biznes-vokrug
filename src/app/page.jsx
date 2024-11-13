'use client';

import { useEffect, useState } from 'react';
const services = [
  { id: 1, name: 'Консалтинг', description: 'Помощь в бизнес-стратегиях и развитии.' },
  { id: 2, name: 'Маркетинг', description: 'Эффективные маркетинговые стратегии и реклама.' },
  { id: 3, name: 'IT-решения', description: 'Разработка решений для вашего бизнеса.' },
];

const products = [
  { id: 1, name: 'Программное обеспечение для бизнеса', description: 'Автоматизация бизнес-процессов.' },
  { id: 2, name: 'Управление проектами', description: 'Инструмент для управления проектами в компании.' },
  { id: 3, name: 'Облачные решения', description: 'Облачное хранилище для бизнеса.' },
];

export default function HomePage() {
  const [city, setCity] = useState('Неизвестный город');

  useEffect(() => {
    // Читаем cookies вручную
    const allCookies = document.cookie.split('; ');
    const cityCookie = allCookies.find((cookie) => cookie.startsWith('city='));

    if (cityCookie) {
      const cityValue = decodeURIComponent(cityCookie.split('=')[1]);
      setCity(cityValue || 'Неизвестный город');
    }
  }, []);

  return (
    <section className="text-center">
      <h2 className="text-3xl font-bold mb-4">
        Добро пожаловать в {city}
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
              <p className="text-gray-600">{service.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Список последней продукции */}
      <div className="text-center">
        <h3 className="text-2xl font-semibold mb-6">Последняя добавленная продукция</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div key={product.id} className="border p-4 rounded-lg shadow-md">
              <h4 className="text-xl font-semibold mb-2">{product.name}</h4>
              <p className="text-gray-600">{product.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
