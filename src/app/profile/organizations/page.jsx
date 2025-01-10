"use client";

import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import OrganizationCard from "../../../components/profile/organization/OrganizationCard";
import OrganizationModal from "../../../components/profile/organization/OrganizationModal";
import ProductModal from "../../../components/profile/organization/ProductModal";
import ServiceModal from "../../../components/profile/organization/ServiceModal";

import UserService from "../../../services/user.service";

export default function OrganizationsPage() {
  const [loading, setLoading] = useState(true);

  // Основные данные
  const [organizations, setOrganizations] = useState([]);
  const [products, setProducts] = useState([]);
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);

  // Модальные окна (организация / продукт / услуга)
  const [orgModalOpen, setOrgModalOpen] = useState(false);
  const [selectedOrg, setSelectedOrg] = useState(null);

  const [productModalOpen, setProductModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [currentOrgForProduct, setCurrentOrgForProduct] = useState(null);

  const [serviceModalOpen, setServiceModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [currentOrgForService, setCurrentOrgForService] = useState(null);

  // ─────────────────────────────────────────────────────────────────────────
  // 1. Загрузка данных
  // ─────────────────────────────────────────────────────────────────────────
  const fetchOrganizations = async () => {
    try {
      const response = await UserService.getOrganizationsByUser();
      if (response.data.status) {
        setOrganizations(response.data.data);
      } else {
        toast.error(response.data.message || "Организации не найдены.");
      }
    } catch (error) {
      console.error("Ошибка при загрузке организаций:", error);
      toast.error("Ошибка при загрузке организаций.");
    }
  };

  const fetchProductsAndServices = async () => {
    try {
      const productsResp = await UserService.getProductByUser();
      const servicesResp = await UserService.getServiceByUser();
      setProducts(productsResp.data.data || []);
      setServices(servicesResp.data.data || []);
    } catch (error) {
      console.error("Ошибка при загрузке продуктов/услуг:", error);
      toast.error("Ошибка при загрузке продуктов/услуг.");
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await UserService.getProductCategories();
      setCategories(response.data || []);
    } catch (error) {
      console.error("Ошибка при загрузке категорий:", error);
      toast.error("Ошибка при загрузке категорий.");
    }
  };

  useEffect(() => {
    setLoading(true);
    Promise.all([fetchOrganizations(), fetchProductsAndServices(), fetchCategories()])
      .then(() => setLoading(false))
      .catch(() => setLoading(false));
  }, []);

  // ─────────────────────────────────────────────────────────────────────────
  // 2. CRUD-операции (Организация, Продукт, Услуга)
  // ─────────────────────────────────────────────────────────────────────────

  // A) Организации
  const openOrgModal = (org = null) => {
    setSelectedOrg(org);
    setOrgModalOpen(true);
  };

  const onOrgSaved = () => {
    setOrgModalOpen(false);
    fetchOrganizations();
  };

  // ===> Вот та самая функция удаления организации <===
  const handleDeleteOrg = async (id) => {
    if (!confirm("Вы уверены, что хотите удалить организацию?")) return;
    try {
      await UserService.deleteOrganization(id);
      toast.success("Организация успешно удалена");
      fetchOrganizations();
    } catch (error) {
      console.error("Ошибка при удалении организации:", error);
      toast.error("Ошибка при удалении организации.");
    }
  };

  // B) Продукты
  const openProductModal = (org, product = null) => {
    setCurrentOrgForProduct(org);
    setSelectedProduct(product);
    setProductModalOpen(true);
  };

  const onProductSaved = () => {
    setProductModalOpen(false);
    fetchProductsAndServices();
  };

  const handleDeleteProduct = async (productId) => {
    try {
      await UserService.deleteProduct(productId);
      toast.success("Продукт успешно удален");
      fetchProductsAndServices();
    } catch (error) {
      console.error("Ошибка при удалении продукта:", error);
      toast.error("Ошибка при удалении продукта.");
    }
  };

  // C) Услуги
  const openServiceModal = (org, service = null) => {
    setCurrentOrgForService(org);
    setSelectedService(service);
    setServiceModalOpen(true);
  };

  const onServiceSaved = () => {
    setServiceModalOpen(false);
    fetchProductsAndServices();
  };

  const handleDeleteService = async (serviceId) => {
    if (!confirm("Вы уверены, что хотите удалить услугу?")) return;
    try {
      await UserService.deleteService(serviceId);
      toast.success("Услуга успешно удалена");
      fetchProductsAndServices();
    } catch (error) {
      console.error("Ошибка при удалении услуги:", error);
      toast.error("Ошибка при удалении услуги.");
    }
  };

  // ─────────────────────────────────────────────────────────────────────────
  // 3. Рендер
  // ─────────────────────────────────────────────────────────────────────────
  if (loading) {
    return <div>Загрузка...</div>;
  }

  return (
    <div>
      <ToastContainer />

      <h1 className="text-2xl font-bold mb-4">Управление организациями, продуктами, услугами</h1>

      {organizations.length > 0 ? (
        organizations.map((org) => {
          const orgProducts = products.filter((p) => p.organizationId === org.id);
          const orgServices = services.filter((s) => s.organizationId === org.id);

          return (
            <OrganizationCard
              key={org.id}
              organization={org}
              products={orgProducts}
              services={orgServices}

              // Редактирование организации
              onEditOrg={() => openOrgModal(org)}
              // Удаление организации (колбэк с id)
              onDeleteOrg={handleDeleteOrg}

              // Продукты
              openProductModal={openProductModal}
              onDeleteProduct={handleDeleteProduct}

              // Услуги
              openServiceModal={openServiceModal}
              onDeleteService={handleDeleteService}
            />
          );
        })
      ) : (
        <p>Нет организаций</p>
      )}

      <button
        onClick={() => openOrgModal(null)}
        className="bg-green-600 text-white py-2 px-4 rounded"
      >
        Добавить организацию
      </button>

      {/* Модальное окно для организации */}
      {orgModalOpen && (
        <OrganizationModal
          isOpen={orgModalOpen}
          onClose={() => setOrgModalOpen(false)}
          organization={selectedOrg}
          onSaved={onOrgSaved}
        />
      )}

      {/* Модальное окно для продуктов */}
      {productModalOpen && (
        <ProductModal
          isOpen={productModalOpen}
          onClose={() => setProductModalOpen(false)}
          product={selectedProduct}
          categories={categories}
          organization={currentOrgForProduct}
          onSaved={onProductSaved}
        />
      )}

      {/* Модальное окно для услуг */}
      {serviceModalOpen && (
        <ServiceModal
          isOpen={serviceModalOpen}
          onClose={() => setServiceModalOpen(false)}
          service={selectedService}
          organization={currentOrgForService}
          onSaved={onServiceSaved}
        />
      )}
    </div>
  );
}
