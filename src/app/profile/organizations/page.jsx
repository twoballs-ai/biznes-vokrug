"use client";

import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import OrganizationCard from "../../../components/profile/organization/OrganizationCard";
import OrganizationModal from "../../../components/profile/organization/OrganizationModal";

import UserService from "../../../services/user.service";

export default function OrganizationsPage() {
  const [loading, setLoading] = useState(true);

  // Основные данные
  const [organizations, setOrganizations] = useState([]);
  const [product_categories, setProductCategories] = useState([]);
  const [service_categories, setServiceCategories] = useState([]);
  
  // Продукты и сервисы для каждой организации
  const [organizationProducts, setOrganizationProducts] = useState({});
  const [organizationServices, setOrganizationServices] = useState({});
  
  // Модалка для создания организации
  const [orgModalOpen, setOrgModalOpen] = useState(false);

  // Загрузка данных о организациях
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

  // Загрузка категорий продуктов и услуг
  const fetchCategories = async () => {
    try {
      const productResponse = await UserService.getProductCategories();
      const serviceResponse = await UserService.getServiceCategories();
      setProductCategories(productResponse.data || []);
      setServiceCategories(serviceResponse.data || []);
    } catch (error) {
      console.error("Ошибка при загрузке категорий продуктов:", error);
      toast.error("Не удалось загрузить категории продуктов.");
    }
  };

  // Загрузка продуктов для конкретной организации
  const fetchProductsForOrganization = async (organizationId) => {
    try {
      const productsResp = await UserService.getProductByUserOrg(organizationId);
      setOrganizationProducts((prev) => ({
        ...prev,
        [organizationId]: productsResp.data.data || [],
      }));
    } catch (error) {
      console.error("Ошибка при загрузке продуктов:", error);
      toast.error("Ошибка при загрузке продуктов.");
    }
  };

  // Загрузка услуг для конкретной организации
  const fetchServicesForOrganization = async (organizationId) => {
    try {
      const servicesResp = await UserService.getServiceByUserOrg(organizationId);
      setOrganizationServices((prev) => ({
        ...prev,
        [organizationId]: servicesResp.data.data || [],
      }));
    } catch (error) {
      console.error("Ошибка при загрузке услуг:", error);
      toast.error("Ошибка при загрузке услуг.");
    }
  };

  // Хук для загрузки данных при монтировании компонента
  useEffect(() => {
    setLoading(true);
    Promise.all([fetchCategories(), fetchOrganizations()])
      .then(() => setLoading(false))
      .catch(() => setLoading(false));
  }, []);  // Вызываем только один раз при монтировании компонента

  // Хук для загрузки продуктов и услуг после получения организаций
  useEffect(() => {
    if (organizations.length > 0) {
      organizations.forEach((org) => {
        fetchProductsForOrganization(org.id);
        fetchServicesForOrganization(org.id);
      });
    }
  }, [organizations]); // Этот useEffect сработает, когда organizations обновится

  // Функция обновления данных (после CRUD)
  const refreshData = async () => {
    await Promise.all([fetchOrganizations(), fetchCategories()]);
  };

  // Создание новой организации
  const openOrgModal = () => {
    setOrgModalOpen(true);
  };

  const onOrgSaved = () => {
    setOrgModalOpen(false);
    refreshData();
  };

  if (loading) return <div>Загрузка...</div>;

  return (
    <div>
      <ToastContainer />
      <h1 className="text-2xl font-bold mb-4">Управление организациями</h1>

      {/* Список организаций */}
      {organizations.length > 0 ? (
        organizations.map((org) => (
          <OrganizationCard
            key={org.id}
            organization={org}
            products={organizationProducts[org.id] || []}  // Продукты для организации
            services={organizationServices[org.id] || []}  // Услуги для организации
            product_categories={product_categories}
            service_categories={service_categories}
            onRefresh={refreshData}
          />
        ))
      ) : (
        <p>Нет организаций</p>
      )}

      <button
        onClick={openOrgModal}
        className="bg-green-600 text-white py-2 px-4 rounded"
      >
        Добавить организацию
      </button>

      {/* Модалка создания новой организации */}
      {orgModalOpen && (
        <OrganizationModal
          isOpen={orgModalOpen}
          onClose={() => setOrgModalOpen(false)}
          organization={null}
          onSaved={onOrgSaved}
        />
      )}
    </div>
  );
}
