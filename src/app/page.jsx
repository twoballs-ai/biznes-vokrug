"use client";
import { useEffect, useState, useRef } from "react";
import UserService from "../services/user.service";
import ProductCard from "@/components/HomePage/ProductCard";
import ServiceCard from "@/components/HomePage/ServiceCard";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import CurrencyWidget from "@/components/widgets/CurrencyWidget";
import CryptoWidget from "@/components/widgets/CryptoWidget";
import ContentBlock from "@/components/HomePage/ContentBlock";

export default function HomePage() {
  const [city, setCity] = useState("Неизвестный город");
  const [items, setItems] = useState([]); // для всех объявлений
  const [loading, setLoading] = useState(true);
  const firstLoad = useRef(false);

  const limit = 10;

  useEffect(() => {
    const allCookies = document.cookie.split("; ");
    const cityCookie = allCookies.find((cookie) => cookie.startsWith("city="));

    if (cityCookie) {
      const cityValue = decodeURIComponent(cityCookie.split("=")[1]);
      setCity(cityValue || "Неизвестный город");
    }

    // Функция загрузки данных (услуги и товары)
    const fetchData = async () => {
      try {
        const [servicesResponse, productsResponse] = await Promise.all([
          UserService.getServicesWithPagination(0, 21),
          UserService.getProductsWithPagination(0, 21),
        ]);

        const services = servicesResponse.data.service || [];
        const products = productsResponse.data.products || [];

        // Смешиваем два массива
        const allItems = [
          ...services.map((service) => ({ ...service, type: "service" })),
          ...products.map((product) => ({ ...product, type: "product" })),
        ];

        setItems(allItems); // Обновляем состояние с объявлениями
      } catch (error) {
        console.error("Ошибка при загрузке данных:", error);
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
        <h2 className="text-3xl font-bold mb-4 text-center">
          Добро пожаловать на площадку "И то и сё".
        </h2>
        <p className="mb-4 text-center">
          Мы предлагаем лучшие объявления от пользователей для вашего успеха.
        </p>
        <div className="text-center mb-6">
          <button className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700">
            Узнать больше
          </button>
        </div>

        {/* Объявления */}
        {loading ? (
          <p>Загрузка...</p>
        ) : (
          <div className="text-center mt-6">
            <h3 className="text-2xl font-semibold mb-4">Объявления</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {items.map((item) =>
                item.type === "service" ? (
                  <ServiceCard key={item.id} service={item} />
                ) : (
                  <ProductCard key={item.id} product={item} />
                )
              )}
            </div>
          </div>
        )}
      </div>

      {/* ПРАВАЯ ЧАСТЬ: Виджеты */}
      <div className="w-full md:w-1/6 space-y-4 z-10">

      </div>
    </section>
  );
}
