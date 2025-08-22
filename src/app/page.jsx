"use client";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import UserService from "../services/user.service";
import ProductCard from "@/components/HomePage/ProductCard";
import ServiceCard from "@/components/HomePage/ServiceCard";
import CategorySearchBlock from "@/components/HomePage/CategorySearchBlock"; // Новый компонент

export default function HomePage() {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filteredItems, setFilteredItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  // Категории для выбора (можно заменить на реальные данные с сервера)
  const categories = [
    { id: "1", name: "Категория 1" },
    { id: "2", name: "Категория 2" },
    { id: "3", name: "Категория 3" },
    { id: "4", name: "Подкатегория 1.1", parentId: "1" },
    { id: "5", name: "Подкатегория 1.2", parentId: "1" },
    { id: "6", name: "Подкатегория 2.1", parentId: "2" },
    { id: "7", name: "Подкатегория 2.2", parentId: "2" },
  ];

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
              ...services
                .slice(0, 5)
                .map((service) => ({ ...service, type: "service" })),
              ...products
                .slice(0, 5)
                .map((product) => ({ ...product, type: "product" })),
            ];

        setItems(allItems);
        setFilteredItems(allItems);
      } catch (error) {
        console.error("Ошибка при загрузке данных:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isAuthenticated]);

  // Функция для фильтрации по запросу и выбранной категории
  const filterItems = () => {
    let filtered = items.filter((item) => {
      const matchesQuery =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory
        ? item.categoryId === selectedCategory
        : true;

      return matchesQuery && matchesCategory;
    });

    setFilteredItems(filtered);
  };

  useEffect(() => {
    filterItems();
  }, [searchQuery, selectedCategory]);

  return (
    <section className="container mx-auto py-6">
      {/* Ряд поиска и выбора категории */}
      <CategorySearchBlock
        categories={categories}
        onCategoryChange={setSelectedCategory}
        onSearch={setSearchQuery}
      />

      {/* Блок с товарами и услугами */}
      <div className="w-full">
        {loading ? (
          <p>Загрузка...</p>
        ) : (
          <div className="text-center mt-6">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredItems.map((item) =>
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
