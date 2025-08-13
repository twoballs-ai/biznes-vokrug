'use client';
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import UserService from "../services/user.service";
import ProductCard from "@/components/HomePage/ProductCard";
import ServiceCard from "@/components/HomePage/ServiceCard";

export default function HomePage() {
  const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
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
        const allItems = isAuthenticated
          ? [
              ...services.map((service) => ({ ...service, type: "service" })),
              ...products.map((product) => ({ ...product, type: "product" })),
            ]
          : [
              ...services.slice(0, 5).map((service) => ({ ...service, type: "service" })),
              ...products.slice(0, 5).map((product) => ({ ...product, type: "product" })),
            ];

        setItems(allItems);
      } catch (error) {
        console.error("Ошибка при загрузке данных:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isAuthenticated]);

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
                  <ServiceCard key={item.id} service={item} isAuthenticated={isAuthenticated}/>
                ) : (
                  <ProductCard key={item.id} product={item} isAuthenticated={isAuthenticated} />
                )
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
