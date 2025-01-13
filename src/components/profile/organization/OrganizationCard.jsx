"use client";

import React, { useState } from "react";
import { toast } from "react-toastify";

import OrganizationModal from "./OrganizationModal";
import ProductModal from "./ProductModal";
import ServiceModal from "./ServiceModal";

import UserService from "../../../services/user.service";

export default function OrganizationCard({
  organization,
  product_categories,
  service_categories,
  onRefresh,
}) {
  const [orgModalOpen, setOrgModalOpen] = useState(false);
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const [serviceModalOpen, setServiceModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(null);

  // Редактирование организации
  const openOrgModal = () => {
    setOrgModalOpen(true);
  };

  const onOrgSaved = () => {
    setOrgModalOpen(false);
    onRefresh();
  };

  // Удаление организации
  const handleDeleteOrg = async () => {
    if (!confirm("Удалить организацию?")) return;
    try {
      await UserService.deleteOrganization(organization.id);
      toast.success("Организация успешно удалена");
      onRefresh();
    } catch (error) {
      console.error("Ошибка при удалении организации:", error);
      toast.error("Ошибка при удалении организации.");
    }
  };

  // Работа с продуктами
  const openProductModal = (product = null) => {
    setSelectedProduct(product);
    setProductModalOpen(true);
  };

  const onProductSaved = () => {
    setProductModalOpen(false);
    onRefresh();
  };

  const handleDeleteProduct = async (productId) => {
    if (!confirm("Удалить продукт?")) return;
    try {
      await UserService.deleteProduct(productId);
      toast.success("Продукт успешно удалён");
      onRefresh();
    } catch (error) {
      console.error("Ошибка при удалении продукта:", error);
      toast.error("Ошибка при удалении продукта.");
    }
  };

  // Работа с услугами
  const openServiceModal = (service = null) => {
    setSelectedService(service);
    setServiceModalOpen(true);
  };

  const onServiceSaved = () => {
    setServiceModalOpen(false);
    onRefresh();
  };

  const handleDeleteService = async (serviceId) => {
    if (!confirm("Удалить услугу?")) return;
    try {
      await UserService.deleteService(serviceId);
      toast.success("Услуга успешно удалена");
      onRefresh();
    } catch (error) {
      console.error("Ошибка при удалении услуги:", error);
      toast.error("Ошибка при удалении услуги.");
    }
  };

  return (
    <div className="border p-4 mb-4 rounded">
      <h2 className="text-xl font-bold">{organization.name}</h2>
      <p>{organization.description || "Описание отсутствует"}</p>

      {/* Управление организацией */}
      <div className="flex space-x-2 mt-2">
        <button
          onClick={openOrgModal}
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
      {organization.products?.length > 0 ? (
        organization.products.map((product) => (
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

      {/* Услуги */}
      <h3 className="text-lg font-semibold mt-4">Услуги</h3>
      {organization.services?.length > 0 ? (
        organization.services.map((service) => (
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

      {/* Модальные окна */}
      {orgModalOpen && (
        <OrganizationModal
          isOpen={orgModalOpen}
          onClose={() => setOrgModalOpen(false)}
          organization={organization}
          onSaved={onOrgSaved}
        />
      )}
      {productModalOpen && (
        <ProductModal
          isOpen={productModalOpen}
          onClose={() => setProductModalOpen(false)}
          product={selectedProduct}
         
          organization={organization}
          categories={product_categories}
          onSaved={onProductSaved}
        />
      )}
      {serviceModalOpen && (
        <ServiceModal
          isOpen={serviceModalOpen}
          onClose={() => setServiceModalOpen(false)}
          service={selectedService}
          categories={service_categories}
          organization={organization}
          onSaved={onServiceSaved}
        />
      )}
    </div>
  );
}