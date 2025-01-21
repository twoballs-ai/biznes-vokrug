"use client";

import { useEffect, useState } from "react";
import DOMPurify from "dompurify";
import UserService from "../services/user.service";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import ImageViewer from "@/components/imageViever";
import { serverUrl } from "@/shared/config";
import CurrencyWidget from "@/components/widgets/CurrencyWidget";
import CryptoWidget from "@/components/widgets/CryptoWidget";
import ContentBlock from "@/components/HomePage/ContentBlock";
import ProductCard from "@/components/HomePage/ProductCard";
import ServiceCard from "@/components/HomePage/ServiceCard";
export default function HomePage() {
  const [city, setCity] = useState("Неизвестный город");
  const [services, setServices] = useState([]);
  const [products, setProducts] = useState([]);
  const [news, setNews] = useState([]);
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("news"); 
  const [newsSkip, setNewsSkip] = useState(0);
  const [articlesSkip, setArticlesSkip] = useState(0);

  const limit = 10;
  const [hasMoreNews, setHasMoreNews] = useState(true);
  const [hasMoreArticles, setHasMoreArticles] = useState(true);

  useEffect(() => {
    const allCookies = document.cookie.split("; ");
    const cityCookie = allCookies.find((cookie) => cookie.startsWith("city="));

    if (cityCookie) {
      const cityValue = decodeURIComponent(cityCookie.split("=")[1]);
      setCity(cityValue || "Неизвестный город");
    }

    const fetchData = async () => {
      try {
        const [servicesResponse, productsResponse] = await Promise.all([
          UserService.getServicesWithPagination(0, 21),
          UserService.getProductsWithPagination(0, 21),
        ]);
        setServices(servicesResponse.data.service || []);
        setProducts(productsResponse.data.products || []);
      } catch (error) {
        console.error("Ошибка при загрузке данных:", error);
      }
    };



    fetchData();
  }, []);


  const fetchNews = async () => {
    try {
      const response = await UserService.getNewsWithPagination(newsSkip, limit);
      if (response.data.status && response.data.data) {
        const newNews = response.data.data;
        setNews((prev) => [...prev, ...newNews]);
        setNewsSkip((prevSkip) => prevSkip + limit);
        if (newNews.length < limit) {
          setHasMoreNews(false);
        }
      }
    } catch (error) {
      console.error("Ошибка загрузки новостей:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchArticles = async () => {
    try {
      const response = await UserService.getArticlesWithPagination(articlesSkip, limit);
      if (response.data.status && response.data.data) {
        const newArticles = response.data.data;
        setArticles((prev) => [...prev, ...newArticles]);
        setArticlesSkip((prevSkip) => prevSkip + limit);
        if (newArticles.length < limit) {
          setHasMoreArticles(false);
        }
      }
    } catch (error) {
      console.error("Ошибка загрузки статей:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === "news" && news.length === 0) {
      fetchNews();
    } else if (activeTab === "articles" && articles.length === 0) {
      fetchArticles();
    }
  }, [activeTab]);



  return (
    <section className="container mx-auto flex flex-col-reverse md:flex-row gap-6">
      <div className="w-full md:w-5/6">
        <h2 className="text-3xl font-bold mb-4 text-center">
          Добро пожаловать на площадку Бизнес Вокруг.
        </h2>
        <p className="mb-4 text-center">
          Мы предлагаем лучшие бизнес-решения для вашего успеха.
        </p>
        <div className="text-center mb-6">
          <button className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700">
            Узнать больше
          </button>
        </div>

        {/* Разделение на услуги организаций и ИП */}
        {services.length > 0 && (
          <div className="text-center mt-6">
            <h3 className="text-2xl font-semibold mb-4">Услуги</h3>

            {services.some((s) => s.organization) && (
              <>
                <h4 className="text-xl font-semibold mt-4 mb-3">Фирмы</h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                  {services
                    .filter((s) => s.organization)
                    .map((service) => (
                      <ServiceCard key={service.id} service={service} />
                    ))}
                </div>
              </>
            )}

            {services.some((s) => s.individual_entrepreneur_id) && (
              <>
                <h4 className="text-xl font-semibold mt-6 mb-3">
                  Индивидуальные предприниматели
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                  {services
                    .filter((s) => s.individual_entrepreneur_id)
                    .map((service) => (
                      <ServiceCard key={service.id} service={service} />
                    ))}
                </div>
              </>
            )}
          </div>
        )}

        {/* Разделение на товары организаций и ИП */}
        {products.length > 0 && (
          <div className="text-center mt-6">
            <h3 className="text-2xl font-semibold mb-4">Продукция</h3>

            {products.some((p) => p.organization) && (
              <>
                <h4 className="text-xl font-semibold mt-4 mb-3">Фирмы</h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                  {products
                    .filter((p) => p.organization)
                    .map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                </div>
              </>
            )}

            {products.some((p) => p.individual_entrepreneur_id) && (
              <>
                <h4 className="text-xl font-semibold mt-6 mb-3">
                  Индивидуальные предприниматели
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                  {products
                    .filter((p) => p.individual_entrepreneur_id)
                    .map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                </div>
              </>
            )}
          </div>
        )}

        {/* Новости */}
       {/* Вкладки (Tabs) */}
       <div className="flex justify-center border-b border-gray-300 mb-6 mt-4">
          <button
            className={`relative px-4 py-2 text-lg font-semibold transition-all duration-300 ${
              activeTab === "news"
                ? "text-blue-600 after:absolute after:left-0 after:bottom-0 after:w-full after:h-[3px] after:bg-blue-600"
                : "text-gray-500 hover:text-blue-600"
            }`}
            onClick={() => setActiveTab("news")}
          >
            Новости
          </button>
          <button
            className={`relative px-4 py-2 text-lg font-semibold transition-all duration-300 ${
              activeTab === "articles"
                ? "text-blue-600 after:absolute after:left-0 after:bottom-0 after:w-full after:h-[3px] after:bg-blue-600"
                : "text-gray-500 hover:text-blue-600"
            }`}
            onClick={() => setActiveTab("articles")}
          >
            Статьи
          </button>
        </div>

        {/* Контент вкладок */}
        <div className="text-center mt-6">
          {loading ? (
            <p>Загрузка...</p>
          ) : activeTab === "news" ? (
            <ContentBlock data={news} hasMore={hasMoreNews} loadMore={fetchNews} />
          ) : (
            <ContentBlock data={articles} hasMore={hasMoreArticles} loadMore={fetchArticles} />
          )}
        </div>


      </div>

      {/* ПРАВАЯ ЧАСТЬ: Виджеты */}
      <div className="w-full md:w-1/6 space-y-4 z-10">
        <div className="flex flex-col md:hidden items-center">
          <CurrencyWidget />
          <CryptoWidget />
        </div>

        {/* Виджеты на больших экранах (справа) */}
        <div className="hidden md:block">
          <CurrencyWidget />
          <CryptoWidget />
        </div>
      </div>
    </section>
  );
}
