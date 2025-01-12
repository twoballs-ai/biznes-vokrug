"use client";

import React, { useState } from "react";
import { toast } from "react-toastify";

import UserService from "../../../services/user.service";

// Модальные окна как дочерние компоненты
import IPModal from "./IPModal";
import IpProductModal from "./IpProductModal";
import IpServiceModal from "./IpServiceModal";

export default function IPCard({
  entrepreneur,
  products,
  services,
  product_categories,
  service_categories,
  onRefresh,
}) {
  // Локальные стейты для управления модалками
  const [ipModalOpen, setIpModalOpen] = useState(false);

  const [productModalOpen, setProductModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const [serviceModalOpen, setServiceModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(null);

  // ─────────────────────────────────────────────────────────────────────────
  // A) Индивидуальный предприниматель (редактирование/удаление)
  // ─────────────────────────────────────────────────────────────────────────
  const openIPModal = () => {
    setIpModalOpen(true);
  };

  const onIPSaved = () => {
    setIpModalOpen(false);
    onRefresh();
  };

  const handleDeleteIP = async () => {
    if (!confirm("Вы уверены, что хотите удалить ИП?")) return;
    try {
      await UserService.deleteIndividualEntrepreneur(entrepreneur.id);
      toast.success("ИП успешно удалён");
      onRefresh();
    } catch (error) {
      console.error("Ошибка при удалении ИП:", error);
      toast.error("Ошибка при удалении ИП.");
    }
  };

  // ─────────────────────────────────────────────────────────────────────────
  // B) Продукты (создание/редактирование/удаление)
  // ─────────────────────────────────────────────────────────────────────────
  const openProductModal = (product = null) => {
    setSelectedProduct(product);
    setProductModalOpen(true);
  };

  const onProductSaved = () => {
    setProductModalOpen(false);
    onRefresh();
  };

  const handleDeleteProduct = async (productId) => {
    if (!confirm("Вы уверены, что хотите удалить продукт?")) return;
    try {
      await UserService.deleteProduct(productId);
      toast.success("Продукт успешно удалён");
      onRefresh();
    } catch (error) {
      console.error("Ошибка при удалении продукта:", error);
      toast.error("Ошибка при удалении продукта.");
    }
  };

  // ─────────────────────────────────────────────────────────────────────────
  // C) Услуги (создание/редактирование/удаление)
  // ─────────────────────────────────────────────────────────────────────────
  const openServiceModal = (service = null) => {
    setSelectedService(service);
    setServiceModalOpen(true);
  };

  const onServiceSaved = () => {
    setServiceModalOpen(false);
    onRefresh();
  };

  const handleDeleteService = async (serviceId) => {
    if (!confirm("Вы уверены, что хотите удалить услугу?")) return;
    try {
      await UserService.deleteService(serviceId);
      toast.success("Услуга успешно удалена");
      onRefresh();
    } catch (error) {
      console.error("Ошибка при удалении услуги:", error);
      toast.error("Ошибка при удалении услуги.");
    }
  };

  // ─────────────────────────────────────────────────────────────────────────
  // Рендер карточки
  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div className="border p-4 mb-4 rounded">
      <h2 className="text-xl font-bold">
        <strong>ИП:</strong> {entrepreneur?.name}
      </h2>
      <p>
        <strong>ОГРНИП:</strong> {entrepreneur?.ogrnip}
      </p>
      <p>
        <strong>ИНН:</strong> {entrepreneur?.inn}
      </p>
      <p>
        <strong>Номер телефона:</strong> {entrepreneur?.phone || "Не указан"}
      </p>
      <div className="flex space-x-2 mt-2">
        {/* Кнопка «Редактировать» (IPModal) */}
        <button
          onClick={openIPModal}
          className="bg-yellow-500 text-white px-4 py-1 rounded"
        >
          Редактировать
        </button>
        {/* Удаление ИП */}
        <button
          onClick={handleDeleteIP}
          className="bg-red-500 text-white px-4 py-1 rounded"
        >
          Удалить
        </button>
      </div>

      {/* Блок с продуктами */}
      <h3 className="text-lg font-semibold mt-4">Продукты</h3>
      {products?.length > 0 ? (
        products.map((product) => (
          <div key={product.id} className="mt-2 ml-4 flex items-center">
            <p className="mr-2">{product.name}</p>
            <button
              onClick={() => openProductModal(product)}
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
        onClick={() => openProductModal(null)}
        className="bg-green-500 text-white px-4 py-1 mt-2 rounded"
      >
        Добавить продукт
      </button>

      {/* Блок с услугами */}
      <h3 className="text-lg font-semibold mt-4">Услуги</h3>
      {services?.length > 0 ? (
        services.map((service) => (
          <div key={service.id} className="mt-2 ml-4 flex items-center">
            <p className="mr-2">{service.name}</p>
            <button
              onClick={() => openServiceModal(service)}
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
        onClick={() => openServiceModal(null)}
        className="bg-green-500 text-white px-4 py-1 mt-2 rounded"
      >
        Добавить услугу
      </button>

      {/* Модальные окна — рендерятся внутри карточки */}
      {ipModalOpen && (
        <IPModal
          isOpen={ipModalOpen}
          onClose={() => setIpModalOpen(false)}
          entrepreneur={entrepreneur}
          onSaved={onIPSaved}
        />
      )}
      {productModalOpen && (
        <IpProductModal
          isOpen={productModalOpen}
          onClose={() => setProductModalOpen(false)}
          product={selectedProduct}
          onSaved={onProductSaved}
          categories={product_categories}
        />
      )}
      {serviceModalOpen && (
        <IpServiceModal
          isOpen={serviceModalOpen}
          onClose={() => setServiceModalOpen(false)}
          service={selectedService}
          categories={service_categories}
          onSaved={onServiceSaved}
        />
      )}
    </div>
  );
}
