"use client";

import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import IPCard from "../../../components/profile/ip/IPCard";
import IPModal from "../../../components/profile/ip/IPModal";
import IpProductModal from "../../../components/profile/ip/IpProductModal";
import IpServiceModal from "../../../components/profile/ip/IpServiceModal";

import UserService from "../../../services/user.service";

export default function EntrepreneurPage() {
  const [loading, setLoading] = useState(true);

  // Основные данные
  const [entrepreneur, setEntrepreneur] = useState(null);
  const [products, setProducts] = useState([]);
  const [services, setServices] = useState([]);

  // Модальные окна
  const [ipModalOpen, setIpModalOpen] = useState(false);
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const [serviceModalOpen, setServiceModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
const [categories, setCategories] = useState([]);

const fetchCategories = async () => {
  try {
    const response = await UserService.getProductCategories();
    setCategories(response.data); // Убедитесь, что data содержит массив категорий
  } catch (error) {
    console.error("Ошибка при загрузке категорий продуктов:", error);
    toast.error("Не удалось загрузить категории продуктов.");
  }
};

useEffect(() => {
  setLoading(true);
  Promise.all([fetchEntrepreneur(), fetchProductsAndServices(), fetchCategories()])
    .then(() => setLoading(false))
    .catch(() => setLoading(false));
}, []);
  // ─────────────────────────────────────────────────────────────────────────
  // Функции загрузки данных
  // ─────────────────────────────────────────────────────────────────────────
  const fetchEntrepreneur = async () => {
    try {
      const response = await UserService.getIndividualEntrepreneursByUser();
      if (response.data.status) {
      console.log(response.data.data)
        setEntrepreneur(response.data.data); // Получаем первого (единственного) ИП
      } else {
        setEntrepreneur(null);
        toast.error(response.data.message || "ИП не найден.");
      }
    } catch (error) {
      console.error("Ошибка при загрузке ИП:", error);
      toast.error("Ошибка при загрузке ИП.");
    }
  };

  const fetchProductsAndServices = async () => {
    try {
      const productsResp = await UserService.getProductByUser();
      console.log()
      const servicesResp = await UserService.getServiceByUser();
      setProducts(productsResp.data.data || []);
      setServices(servicesResp.data.data || []);
    } catch (error) {
      console.error("Ошибка при загрузке продуктов/услуг:", error);
      toast.error("Ошибка при загрузке продуктов/услуг.");
    }
  };

  useEffect(() => {
    setLoading(true);
    Promise.all([fetchEntrepreneur(), fetchProductsAndServices()])
      .then(() => setLoading(false))
      .catch(() => setLoading(false));
  }, []);

  // ─────────────────────────────────────────────────────────────────────────
  // CRUD-операции
  // ─────────────────────────────────────────────────────────────────────────

  // A) Индивидуальный предприниматель
  const openIPModal = () => {
    setIpModalOpen(true);
  };

  const onIPSaved = () => {
    setIpModalOpen(false);
    fetchEntrepreneur();
  };

  const handleDeleteIP = async () => {
    if (!confirm("Вы уверены, что хотите удалить ИП?")) return;
    try {
      await UserService.deleteIndividualEntrepreneur(entrepreneur.id);
      toast.success("ИП успешно удалён");
      setEntrepreneur(null);
    } catch (error) {
      console.error("Ошибка при удалении ИП:", error);
      toast.error("Ошибка при удалении ИП.");
    }
  };

  // B) Продукты
  const openProductModal = (product = null) => {
    setSelectedProduct(product);
    setProductModalOpen(true);
  };

  const onProductSaved = () => {
    setProductModalOpen(false);
    fetchProductsAndServices();
  };

  const handleDeleteProduct = async (productId) => {
    if (!confirm("Вы уверены, что хотите удалить продукт?")) return;
    try {
      await UserService.deleteProduct(productId);
      toast.success("Продукт успешно удалён");
      fetchProductsAndServices();
    } catch (error) {
      console.error("Ошибка при удалении продукта:", error);
      toast.error("Ошибка при удалении продукта.");
    }
  };

  // C) Услуги
  const openServiceModal = (service = null) => {
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
  // Рендер
  // ─────────────────────────────────────────────────────────────────────────
  if (loading) {
    return <div>Загрузка...</div>;
  }

  return (
    <div>
      <ToastContainer />

      <h1 className="text-2xl font-bold mb-4">Управление индивидуальным предпринимателем</h1>

      {entrepreneur ? (
        <IPCard
          entrepreneur={entrepreneur}
          products={products.filter((p) => p.ownerId === entrepreneur.id && p.ownerType === "individual")}
          services={services.filter((s) => s.ownerId === entrepreneur.id && s.ownerType === "individual")}
          onEditIP={openIPModal}
          onDeleteIP={handleDeleteIP}
          openProductModal={openProductModal}
          onDeleteProduct={handleDeleteProduct}
          openServiceModal={openServiceModal}
          onDeleteService={handleDeleteService}
        />
      ) : (
        <div>
          <p>ИП отсутствует</p>
          <button
            onClick={openIPModal}
            className="bg-green-600 text-white py-2 px-4 rounded"
          >
            Добавить ИП
          </button>
        </div>
      )}

      {/* Модальные окна */}
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
          entrepreneur={entrepreneur}
          onSaved={onProductSaved}
          categories={categories} // Передаем категории
        />
      )}

      {serviceModalOpen && (
        <IpServiceModal
          isOpen={serviceModalOpen}
          onClose={() => setServiceModalOpen(false)}
          service={selectedService}
          entrepreneur={entrepreneur}
          onSaved={onServiceSaved}
        />
      )}
    </div>
  );
}
