"use client";

import React from "react";

export default function OrganizationCard({
  organization,
  products,
  services,
  onEditOrg,
  onDeleteOrg,        // Функция, которая принимает id
  openProductModal,
  onDeleteProduct,     // Функция, которая принимает id
  openServiceModal,
  onDeleteService,     // Функция, которая принимает id
}) {

  // Удаление организации
  const handleDeleteOrg = () => {
    if (!confirm("Удалить организацию?")) return;
    // Вызываем колбэк из пропсов, передаём id
    onDeleteOrg(organization.id);
  };

  // Удаление продукта
  const handleDeleteProduct = (id) => {
    if (!confirm("Удалить продукт?")) return;
    onDeleteProduct(id);
  };

  // Удаление услуги
  const handleDeleteService = (id) => {
    if (!confirm("Удалить услугу?")) return;
    onDeleteService(id);
  };

  return (
    <div className="border p-4 mb-4 rounded">
      <h2 className="text-xl font-bold">{organization.name}</h2>
      <p>{organization.description || "Описание отсутствует"}</p>

      {/* Кнопки управления организацией */}
      <div className="flex space-x-2 mt-2">
        <button
          onClick={onEditOrg}
          className="bg-yellow-500 text-white px-4 py-1 rounded"
        >
          Редактировать
        </button>
        <button
          onClick={handleDeleteOrg}
          className="bg-red-500 text-white px-4 py-1 rounded"
        >
          Удалить
        </button>
      </div>

      {/* Продукты */}
      <h3 className="text-lg font-semibold mt-4">Продукты</h3>
      {products.length > 0 ? (
        products.map((product) => (
          <div key={product.id} className="mt-2 ml-4 flex items-center">
            <p className="mr-2">{product.name}</p>
            <button
              onClick={() => openProductModal(organization, product)}
              className="bg-yellow-500 text-white px-2 py-1 rounded mr-2"
            >
              ✎
            </button>
            <button
              onClick={() => handleDeleteProduct(product.id)}
              className="bg-red-500 text-white px-2 py-1 rounded"
            >
              ✕
            </button>
          </div>
        ))
      ) : (
        <p className="ml-4">Нет продуктов</p>
      )}
      <button
        onClick={() => openProductModal(organization, null)}
        className="bg-green-500 text-white px-4 py-1 mt-2 rounded"
      >
        Добавить продукт
      </button>

      {/* Услуги */}
      <h3 className="text-lg font-semibold mt-4">Услуги</h3>
      {services.length > 0 ? (
        services.map((service) => (
          <div key={service.id} className="mt-2 ml-4 flex items-center">
            <p className="mr-2">{service.name}</p>
            <button
              onClick={() => openServiceModal(organization, service)}
              className="bg-yellow-500 text-white px-2 py-1 rounded mr-2"
            >
              ✎
            </button>
            <button
              onClick={() => handleDeleteService(service.id)}
              className="bg-red-500 text-white px-2 py-1 rounded"
            >
              ✕
            </button>
          </div>
        ))
      ) : (
        <p className="ml-4">Нет услуг</p>
      )}
      <button
        onClick={() => openServiceModal(organization, null)}
        className="bg-green-500 text-white px-4 py-1 mt-2 rounded"
      >
        Добавить услугу
      </button>
    </div>
  );
}
