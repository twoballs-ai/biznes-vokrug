'use client';
import { useEffect, useState } from "react";
import { useAuth } from '@/contexts/AuthProvider';
import UserService from "../services/user.service";
import ProductCard from "@/components/HomePage/ProductCard";
import ServiceCard from "@/components/HomePage/ServiceCard";
import { toast } from 'react-toastify';

export default function HomePage() {
  const { authenticated } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Получаем товары и услуги
        const [servicesResponse, productsResponse] = await Promise.all([
          UserService.getServicesWithPagination(0, 21),
          UserService.getProductsWithPagination(0, 21),
        ]);

        const services = servicesResponse.data.service || [];
        const products = productsResponse.data.products || [];

        // Ограничиваем данные для неавторизованных пользователей
        const allItems = authenticated
          ? [
              ...services.map((service) => ({ ...service, type: "service" })),
              ...products.map((product) => ({ ...product, type: "product" })),
            ]
          : [
              ...services.slice(0, 5).map((service) => ({ ...service, type: "service" })), // Только часть услуг
              ...products.slice(0, 5).map((product) => ({ ...product, type: "product" })), // Только часть товаров
            ];

        setItems(allItems);
      } catch (error) {
        console.error("Ошибка при загрузке данных:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [authenticated]);

  return (
    <section className="container mx-auto flex flex-col-reverse md:flex-row gap-6">
      <div className="w-full md:w-5/6">
        {loading ? (
          <p>Загрузка...</p>
        ) : (
          <div className="text-center mt-6">
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
    </section>
  );
}
