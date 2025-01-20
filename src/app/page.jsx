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

export default function HomePage() {
  const [city, setCity] = useState("Неизвестный город");
  const [services, setServices] = useState([]);
  const [products, setProducts] = useState([]);
  const [news, setNews] = useState([]);
  const [loadingNews, setLoadingNews] = useState(true);
  const [skip, setSkip] = useState(0);
  const [limit] = useState(50);
  const [hasMoreNews, setHasMoreNews] = useState(true);

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

    const fetchNews = async () => {
      try {
        const response = await UserService.getNewsWithPagination(skip, limit);
        if (response.data.status && response.data.data) {
          const newNews = response.data.data;
          setNews((prevNews) => {
            const filteredNews = newNews.filter(
              (newsItem) => !prevNews.some((prevItem) => prevItem.id === newsItem.id)
            );
            return [...prevNews, ...filteredNews];
          });
          setSkip(skip + limit);
          if (newNews.length < limit) {
            setHasMoreNews(false);
          }
        }
      } catch (error) {
        console.error("Ошибка загрузки новостей:", error);
      } finally {
        setLoadingNews(false);
      }
    };

    fetchData();
    fetchNews();
  }, []);

  const loadMoreNews = () => {
    if (!loadingNews && hasMoreNews) {
      setLoadingNews(true);
      setSkip((prev) => prev + limit);
    }
  };

  return (
    <section className="text-center">
      <h2 className="text-3xl font-bold mb-4">
        Добро пожаловать на площадку Бизнес Вокруг.
      </h2>
      <p className="mb-4">
        Мы предлагаем лучшие бизнес-решения для вашего успеха.
      </p>
      <button className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700">
        Узнать больше
      </button>

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
      <div className="text-center mt-6">
  <h3 className="text-2xl font-semibold mb-4">Новости</h3>
  {loadingNews && <p>Загрузка новостей...</p>}
  <div className="space-y-6">
    {news.map((item) => (
      <div key={item.id} className="p-4 bg-white rounded-lg shadow-md">
        <h3 className="text-xl font-semibold text-blue-600">{item.title}</h3>
        <article
          className="prose max-w-none mt-2"
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(item.content),
          }}
        />
        <div className="mt-2 text-gray-500">
          <span>Категория: {item.category}</span> |{" "}
          <span>Опубликовано: {new Date(item.created_at).toLocaleDateString()}</span>
        </div>
      </div>
    ))}
  </div>
  {hasMoreNews && (
    <div className="text-center mt-6">
      <button
        onClick={loadMoreNews}
        className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
      >
        Загрузить еще
      </button>
    </div>
  )}
</div>;
    </section>
  );
}

/* Компонент карточки услуги */
function ServiceCard({ service }) {
  return (
    <div className="border p-4 rounded-lg shadow-md text-left">
      {/* Изображения */}
      {service.images?.length > 0 ? (
        <div className="mb-2">
          {service.images.length > 1 ? (
            <Swiper
              modules={[Navigation, Pagination]}
              navigation
              pagination={{ clickable: true }}
              spaceBetween={10}
              slidesPerView={1}
            >
              {service.images.map((img, index) => (
                <SwiperSlide key={index}>
                  <ImageViewer
                    src={`${serverUrl}/${img}`}
                    alt={`service-${service.id}-${index}`}
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          ) : (
            <ImageViewer
              src={`${serverUrl}/${service.images[0]}`}
              alt={`service-${service.id}`}
            />
          )}
        </div>
      ) : (
        <div className="mb-2 text-sm text-gray-500 italic">
          Изображения отсутствуют
        </div>
      )}

      {/* Двухколоночный текст */}
      <div className="grid grid-cols-2 gap-2 text-sm">
        <p>
          <strong>Название:</strong> {service.name}
        </p>
        <p>
          <strong>Цена:</strong> {service.price || "Не указана"}
        </p>
        <p>
          <strong>Категория:</strong> {service.category || "Не указана"}
        </p>

        {service.organization ? (
          <p>
            <strong>Фирма:</strong> {service.organization}
          </p>
        ) : service.individual_entrepreneur ? (
          <p>
            <strong>ИП:</strong> {service.individual_entrepreneur}
          </p>
        ) : (
          <p>
            <strong>Организация:</strong> Не указана
          </p>
        )}

        <p>
          <strong>Обновлено:</strong>{" "}
          {service.updated_at
            ? new Date(service.updated_at).toLocaleString()
            : "Не указана"}
        </p>
      </div>
    </div>
  );
}

/* Компонент карточки продукта */
function ProductCard({ product }) {
  return (
    <div className="border p-4 rounded-lg shadow-md text-left">
      {/* Изображения */}
      {product.images?.length > 0 ? (
        <div className="mb-2">
          {product.images.length > 1 ? (
            <Swiper
              modules={[Navigation, Pagination]}
              navigation
              pagination={{ clickable: true }}
              spaceBetween={10}
              slidesPerView={1}
            >
              {product.images.map((img, index) => (
                <SwiperSlide key={index}>
                  <ImageViewer
                    src={`${serverUrl}/${img}`}
                    alt={`product-${product.id}-${index}`}
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          ) : (
            <ImageViewer
              src={`${serverUrl}/${product.images[0]}`}
              alt={`product-${product.id}`}
            />
          )}
        </div>
      ) : (
        <div className="mb-2 text-sm text-gray-500 italic">
          Изображения отсутствуют
        </div>
      )}

      {/* Двухколоночный текст */}
      <div className="grid grid-cols-2 gap-2 text-sm">
        <p>
          <strong>Название:</strong> {product.name}
        </p>
        <p>
          <strong>Цена:</strong> {product.price || "Не указана"}
        </p>
        <p>
          <strong>Категория:</strong> {product.category || "Не указана"}
        </p>

        {product.organization ? (
          <p>
            <strong>Фирма:</strong> {product.organization}
          </p>
        ) : product.individual_entrepreneur ? (
          <p>
            <strong>ИП:</strong> {product.individual_entrepreneur}
          </p>
        ) : (
          <p>
            <strong>Организация:</strong> Не указана
          </p>
        )}

        <p>
          <strong>Обновлено:</strong>{" "}
          {product.updated_at
            ? new Date(product.updated_at).toLocaleString()
            : "Не указана"}
        </p>
      </div>
    </div>
  );
}
