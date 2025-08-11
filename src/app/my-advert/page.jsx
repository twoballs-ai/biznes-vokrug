"use client";

import { useEffect, useState, useRef } from "react";
import UserService from "@/services/user.service";
import MyProductCard from "@/components/My-advert/MyProductCard";
import MyServiceCard from "@/components/My-advert/MyServiceCard";
import { toast, ToastContainer } from "react-toastify";

export default function MyAds() {
  const [items, setItems] = useState([]); // для всех объявлений пользователя
  const [loading, setLoading] = useState(true);
  const firstLoad = useRef(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [servicesResponse, productsResponse] = await Promise.all([
          UserService.getMyServices(),
          UserService.getMyProducts(),
        ]);

        const services = servicesResponse.data.data || [];
        const products = productsResponse.data.data || [];

        // Смешиваем два массива (услуги и товары)
        const allItems = [
          ...services.map((service) => ({ ...service, type: "service" })),
          ...products.map((product) => ({ ...product, type: "product" })),
        ];

        setItems(allItems); // Обновляем состояние с объявлениями
      } catch (error) {
        console.error("Ошибка при загрузке данных:", error);
        toast.error("Ошибка при загрузке данных.");
      } finally {
        setLoading(false);
      }
    };

    if (!firstLoad.current) {
      firstLoad.current = true;
      fetchData();
    }
  }, []);

  return (
    <section className="container mx-auto flex flex-col-reverse md:flex-row gap-6">
      <div className="w-full md:w-5/6">
        {/* Объявления пользователя */}
        {loading ? (
          <p>Загрузка...</p>
        ) : (
          <div className="text-center mt-6">
<div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
  {items.map((item) => (
    item.type === "service" ? (
      <MyServiceCard key={`${item.id}-service`} service={item} />  // Unique key for service
    ) : (
      <MyProductCard key={`${item.id}-product`} product={item} />  // Unique key for product
    )
  ))}
</div>
          </div>
        )}
      </div>

      {/* ПРАВАЯ ЧАСТЬ: Виджеты */}
      <div className="w-full md:w-1/6 space-y-4 z-10">
        {/* Добавьте виджеты по необходимости */}
      </div>
    </section>
  );
}
