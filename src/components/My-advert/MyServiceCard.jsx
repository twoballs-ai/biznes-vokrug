"use client";

import { useEffect, useState } from "react";
import Link from "next/link";  // Используем Link для навигации
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import ImageViewer from "@/components/imageViever";
import { serverUrl } from "@/shared/config";
import { toast } from "react-toastify";
import UserService from "@/services/user.service";

// Заполнитель для изображений
const PlaceholderImage = () => (
  <div className="h-32 bg-gray-200 flex items-center justify-center text-gray-500 text-xs">
    Изображение отсутствует
  </div>
);

const truncateAddress = (address) => {
  if (address.length > 30) {
    return address.slice(0, 30) + '...'; // Обрезаем адрес, если он длинный
  }
  return address;
};

export default function MyServiceCard({ service, isLoading }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Возвращаем null, чтобы избежать ошибки SSR
  if (!mounted) {
    return null;
  }

  const address = `${service.region || ''} ${service.city || ''}`.trim();

  // Функция для удаления услуги
  const handleDelete = async () => {
    try {
      await UserService.deleteService(service.id);
      toast.success("Услуга успешно удалена");
      // Примерно перезагрузим страницу
      window.location.reload();
    } catch (error) {
      toast.error("Ошибка при удалении услуги");
    }
  };

  return (
    <div className="block border p-3 rounded-lg shadow-sm text-left hover:shadow-md transition-shadow">
      {/* Изображения */}
      {isLoading ? (
        <div className="mb-2 bg-gray-100 h-32 animate-pulse"></div> // Загрузочный плейсхолдер
      ) : service.images?.length > 0 ? (
        <div className="mb-2">
          {service.images.length > 1 ? (
            <Swiper
              modules={[Navigation, Pagination]}
              navigation
              pagination={{ clickable: true }}
              spaceBetween={8}
              slidesPerView={1}
            >
              {service.images.map((img) => (
                <SwiperSlide key={img}>
                  <ImageViewer
                    src={`${serverUrl}/${img}`}
                    alt={`service-${service.id}`}
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
        <PlaceholderImage /> // Заполнитель, если изображение отсутствует
      )}

      {/* Информация */}
      <div className="text-sm text-gray-700">
        <p className="font-semibold text-lg">{service.name}</p>
        <p className="text-sm text-gray-500">
          <span>Цена: </span>{service.price || "Не указана"}
        </p>
        <p className="text-xs text-gray-400 mt-1 truncate">
          <strong>Адрес:</strong> {truncateAddress(address) || "Не указан"}
        </p>
      </div>

      {/* Кнопки действий */}
      <div className="flex justify-between mt-3">
        <Link
          href={`/service/edit/${service.id}`} // Навигация с помощью Link
          className="text-blue-500 hover:text-blue-700"
        >
          Редактировать
        </Link>
        <button
          onClick={handleDelete}
          className="text-red-500 hover:text-red-700"
        >
          Удалить
        </button>
      </div>
    </div>
  );
}
