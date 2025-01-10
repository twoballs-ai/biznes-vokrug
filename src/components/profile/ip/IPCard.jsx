"use client";

import React from "react";

export default function IPCard({
  entrepreneur,
  products,
  services,
  onEditIP,
  onDeleteIP,
  openProductModal,
  onDeleteProduct,
  openServiceModal,
  onDeleteService,
}) {
  const handleDeleteIP = () => {
    if (!confirm("Удалить ИП?")) return;
    onDeleteIP(entrepreneur.id);
  };
console.log(entrepreneur)
  const handleDeleteProduct = (id) => {
    if (!confirm("Удалить продукт?")) return;
    onDeleteProduct(id);
  };

  const handleDeleteService = (id) => {
    if (!confirm("Удалить услугу?")) return;
    onDeleteService(id);
  };

  return (
    <div className="border p-4 mb-4 rounded">
      <h2 className="text-xl font-bold"><strong>ИП:</strong> {entrepreneur.name}</h2>
      <p>
        <strong>ОГРНИП:</strong> {entrepreneur.ogrnip}
      </p>
      <p>
        <strong>ИНН:</strong> {entrepreneur.inn}
      </p>
      <p>
        <strong>Номер телефона:</strong> {entrepreneur.phone || "Не указан"}
      </p>
      <div className="flex space-x-2 mt-2">
        <button
          onClick={onEditIP}
          className="bg-yellow-500 text-white px-4 py-1 rounded"
        >
          Редактировать
        </button>
        <button
          onClick={handleDeleteIP}
          className="bg-red-500 text-white px-4 py-1 rounded"
        >
          Удалить
        </button>
      </div>

      <h3 className="text-lg font-semibold mt-4">Продукты</h3>
      {products.length > 0 ? (
        products.map((product) => (
          <div key={product.id} className="mt-2 ml-4 flex items-center">
            <p className="mr-2">{product.name}</p>
            <button
              onClick={() => openProductModal(entrepreneur, product)}
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
        onClick={() => openProductModal(entrepreneur, null)}
        className="bg-green-500 text-white px-4 py-1 mt-2 rounded"
      >
        Добавить продукт
      </button>

      <h3 className="text-lg font-semibold mt-4">Услуги</h3>
      {services.length > 0 ? (
        services.map((service) => (
          <div key={service.id} className="mt-2 ml-4 flex items-center">
            <p className="mr-2">{service.name}</p>
            <button
              onClick={() => openServiceModal(entrepreneur, service)}
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
        onClick={() => openServiceModal(entrepreneur, null)}
        className="bg-green-500 text-white px-4 py-1 mt-2 rounded"
      >
        Добавить услугу
      </button>
    </div>
  );
}
