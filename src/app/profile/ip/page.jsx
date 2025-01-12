"use client";

import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import IPCard from "../../../components/profile/ip/IPCard";
import IPModal from "../../../components/profile/ip/IPModal"; // Для создания нового ИП
import UserService from "../../../services/user.service";

export default function EntrepreneurPage() {
  const [loading, setLoading] = useState(true);

  // Основные данные
  const [entrepreneur, setEntrepreneur] = useState(null);
  const [products, setProducts] = useState([]);
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);

  // Модалка для создания нового ИП, если в базе его нет
  const [ipModalOpen, setIpModalOpen] = useState(false);

  // ─────────────────────────────────────────────────────────────────────────
  // 1) Функции загрузки данных
  // ─────────────────────────────────────────────────────────────────────────
  const fetchEntrepreneur = async () => {
    try {
      const response = await UserService.getIndividualEntrepreneursByUser();
      if (response.data.status) {
        setEntrepreneur(response.data.data);
      } else {
        setEntrepreneur(null);
        toast.error(response.data.message || "ИП не найден.");
      }
    } catch (error) {
      console.error("Ошибка при загрузке ИП:", error);
      toast.error("Ошибка при загрузке ИП.");
    }
  };

  const fetchProducts = async () => {
    try {
      const productsResp = await UserService.getProductByUserIP();
      setProducts(productsResp.data.data || []);
    } catch (error) {
      console.error("Ошибка при загрузке продуктов:", error);
      toast.error("Ошибка при загрузке продуктов/услуг.");
    }
  };

  const fetchServices = async () => {
    // Если у вас есть отдельный эндпоинт для загрузки услуг — раскомментируйте:
    // try {
    //   const servicesResp = await UserService.getServiceByUser();
    //   setServices(servicesResp.data.data || []);
    // } catch (error) {
    //   console.error("Ошибка при загрузке услуг:", error);
    //   toast.error("Ошибка при загрузке услуг.");
    // }
  };

  const fetchCategories = async () => {
    try {
      const response = await UserService.getProductCategories();
      setCategories(response.data || []);
    } catch (error) {
      console.error("Ошибка при загрузке категорий продуктов:", error);
      toast.error("Не удалось загрузить категории продуктов.");
    }
  };

  // ─────────────────────────────────────────────────────────────────────────
  // 2) useEffect: загрузка всех данных при монтировании
  // ─────────────────────────────────────────────────────────────────────────
  useEffect(() => {
    setLoading(true);
    Promise.all([fetchEntrepreneur(), fetchProducts(), fetchServices(), fetchCategories()])
      .then(() => setLoading(false))
      .catch(() => setLoading(false));
  }, []);

  // ─────────────────────────────────────────────────────────────────────────
  // 3) Колбэк для обновления данных (CRUD завершился)
  // ─────────────────────────────────────────────────────────────────────────
  const refreshData = async () => {
    await Promise.all([fetchEntrepreneur(), fetchProducts(), fetchServices()]);
  };

  // ─────────────────────────────────────────────────────────────────────────
  // 4) Сохранение (создание) ИП через модалку
  // ─────────────────────────────────────────────────────────────────────────
  const onIPSaved = () => {
    setIpModalOpen(false);
    refreshData();
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
      <h1 className="text-2xl font-bold mb-4">
        Управление индивидуальным предпринимателем
      </h1>

      {entrepreneur ? (
        // Если ИП есть, рендерим карточку (дочерний компонент)
        <IPCard
          entrepreneur={entrepreneur}
          products={products}
          services={services}
          categories={categories}
          onRefresh={refreshData}
        />
      ) : (
        // Если ИП нет, предлагаем создать
        <div>
          <p>ИП отсутствует</p>
          <button
            onClick={() => setIpModalOpen(true)}
            className="bg-green-600 text-white py-2 px-4 rounded"
          >
            Добавить ИП
          </button>
        </div>
      )}

      {/* Модалка создания ИП (открывается, если ИП отсутствует) */}
      {ipModalOpen && (
        <IPModal
          isOpen={ipModalOpen}
          onClose={() => setIpModalOpen(false)}
          entrepreneur={null}
          onSaved={onIPSaved}
        />
      )}
    </div>
  );
}
