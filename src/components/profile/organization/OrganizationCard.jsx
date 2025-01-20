"use client";

import React, { useState } from "react";
import { toast } from "react-toastify";

// Swiper
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import UserService from "../../../services/user.service";
import ImageViewer from "@/components/imageViever"; 
import { serverUrl } from "@/shared/config";

// Модальные окна (по аналогии)
import OrganizationModal from "./OrganizationModal";
import OrgProductModal from "./OrgProductModal";
import OrgServiceModal from "./OrgServiceModal";

export default function OrganizationCard({
  organization,
  products,
  services,
  product_categories,
  service_categories,
  onRefresh,
}) {
  const [orgModalOpen, setOrgModalOpen] = useState(false);
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [serviceModalOpen, setServiceModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(null);

  // Организация
  const openOrgModal = () => setOrgModalOpen(true);
  const onOrgSaved = () => {
    setOrgModalOpen(false);
    onRefresh();
  };
  const handleDeleteOrg = async () => {
    if (!confirm("Вы уверены, что хотите удалить организацию?")) return;
    try {
      await UserService.deleteOrganization(organization.id);
      toast.success("Организация успешно удалена");
      onRefresh();
    } catch (error) {
      console.error("Ошибка при удалении организации:", error);
      toast.error("Ошибка при удалении организации.");
    }
  };

  // Продукты
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
      // Удаляем продукт у организации
      await UserService.deleteProduct(productId);
      toast.success("Продукт успешно удалён");
      onRefresh();
    } catch (error) {
      console.error("Ошибка при удалении продукта:", error);
      toast.error("Ошибка при удалении продукта.");
    }
  };

  // Услуги
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
      // Удаляем услугу у организации
      await UserService.deleteService(serviceId);
      toast.success("Услуга успешно удалена");
      onRefresh();
    } catch (error) {
      console.error("Ошибка при удалении услуги:", error);
      toast.error("Ошибка при удалении услуги.");
    }
  };

  return (
    <div className="border p-4 mb-4 rounded bg-white shadow-sm">
      {/* Информация об Организации */}
      <h2 className="text-2xl font-bold mb-2">
        <strong>Организация:</strong> {organization?.name}
      </h2>
      <div className="text-gray-700 space-y-1">
        <p>
          <strong>ОГРН:</strong> {organization?.ogrn}
        </p>
        <p>
          <strong>ИНН:</strong> {organization?.inn}
        </p>
        <p>
          <strong>Телефон:</strong> {organization?.phone || "Не указан"}
        </p>
      </div>

      {/* Кнопки редактирования/удаления организации */}
      <div className="flex gap-3 mt-4">
        <button
          onClick={openOrgModal}
          className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-1 rounded transition"
        >
          Редактировать
        </button>
        <button
          onClick={handleDeleteOrg}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded transition"
        >
          Удалить
        </button>
      </div>

      {/* Продукты */}
      <h3 className="text-xl font-semibold mt-6 mb-2">Продукты</h3>
      {products?.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((product) => (
            <div
              key={product.id}
              className="rounded-md shadow-sm border p-3 bg-white"
            >
              {/* Изображения продукта */}
              {product.images?.length > 0 ? (
                <div className="mb-2">
                  {product.images.length > 1 ? (
                    <Swiper
                      modules={[Navigation, Pagination]}
                      navigation
                      pagination={{ clickable: true }}
                      spaceBetween={10}
                      slidesPerView={1}
                    >
                      {product.images.map((img, index) => (
                        <SwiperSlide key={index}>
                          <ImageViewer
                            src={`${serverUrl}/${img}`}
                            alt={`product-${product.id}-${index}`}
                          />
                        </SwiperSlide>
                      ))}
                    </Swiper>
                  ) : (
                    <ImageViewer
                      src={`${serverUrl}/${product.images[0]}`}
                      alt={`product-${product.id}`}
                    />
                  )}
                </div>
              ) : (
                <div className="mb-2 text-sm text-gray-500 italic">
                  Изображения отсутствуют
                </div>
              )}

              {/* Информация о продукте */}
              <p className="font-medium text-lg mb-1">{product.name}</p>
              <p className="text-sm text-gray-600 mb-1">
                Категория: {product.category || "—"}
              </p>
              <p className="text-sm text-gray-600 mb-2">
                Цена: {product.price} руб.
              </p>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => openProductModal(product)}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded transition"
                >
                  ✎
                </button>
                <button
                  onClick={() => handleDeleteProduct(product.id)}
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded transition"
                >
                  ✕
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-700 ml-4">Нет продуктов</p>
      )}
      <button
        onClick={() => openProductModal(null)}
        className="bg-green-500 hover:bg-green-600 text-white px-4 py-1 mt-4 rounded transition"
      >
        Добавить продукт
      </button>

      {/* Услуги */}
      <h3 className="text-xl font-semibold mt-6 mb-2">Услуги</h3>
      {services?.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {services.map((service) => (
            <div key={service.id} className="rounded-md shadow-sm border p-3 bg-white">
              {/* Изображения услуг */}
              {service.images?.length > 0 ? (
                <div className="mb-2">
                  {service.images.length > 1 ? (
                    <Swiper
                      modules={[Navigation, Pagination]}
                      navigation
                      pagination={{ clickable: true }}
                      spaceBetween={10}
                      slidesPerView={1}
                    >
                      {service.images.map((img, index) => (
                        <SwiperSlide key={index}>
                          <ImageViewer
                            src={`${serverUrl}/${img}`}
                            alt={`service-${service.id}-${index}`}
                          />
                        </SwiperSlide>
                      ))}
                    </Swiper>
                  ) : (
                    <ImageViewer
                      src={`${serverUrl}/${service.images[0]}`}
                      alt={`service-${service.id}`}
                    />
                  )}
                </div>
              ) : (
                <div className="mb-2 text-sm text-gray-500 italic">
                  Изображения отсутствуют
                </div>
              )}

              {/* Информация об услуге */}
              <p className="font-medium text-lg mb-1">{service.name}</p>
              <p className="text-sm text-gray-600 mb-1">
                Категория: {service.category || "—"}
              </p>
              <p className="text-sm text-gray-600 mb-2">
                Описание: {service.description || "Без описания"}
              </p>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => openServiceModal(service)}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded transition"
                >
                  ✎
                </button>
                <button
                  onClick={() => handleDeleteService(service.id)}
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded transition"
                >
                  ✕
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-700 ml-4">Нет услуг</p>
      )}
      <button
        onClick={() => openServiceModal(null)}
        className="bg-green-500 hover:bg-green-600 text-white px-4 py-1 mt-4 rounded transition"
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
        <OrgProductModal
          isOpen={productModalOpen}
          onClose={() => setProductModalOpen(false)}
          product={selectedProduct}
          organization={organization}
          categories={product_categories}
          onSaved={onProductSaved}
        />
      )}
      {serviceModalOpen && (
        <OrgServiceModal
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
