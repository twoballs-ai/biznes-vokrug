import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import ImageViewer from "@/components/imageViever";
import { serverUrl } from "@/shared/config";

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

export default function ServiceCard({ service, isLoading }) {
  // Объединяем город и регион в одно поле
  const address = `${service.region || ''} ${service.city || ''}`.trim();

  return (
    <Link href={`/service/${service.id}`}>
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
          <PlaceholderImage /> // Заполнитель, если изображение отсутствует
        )}

        {/* Информация */}
        <div className="text-sm text-gray-700">
          <p className="font-semibold text-lg">{service.name}</p>
          <p className="text-sm text-gray-500"><span>Цена: </span>{service.price || "Не указана"}</p>
          <p className="text-xs text-gray-400 mt-1 truncate">
            <strong>Адрес:</strong> {truncateAddress(address) || "Не указан"}
          </p>
        </div>
      </div>
    </Link>
  );
}
