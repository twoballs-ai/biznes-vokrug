import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import ImageViewer from "@/components/imageViever";
import { serverUrl } from "@/shared/config";

export default function ServiceCard({ service }) {
  return (
    <Link href={`/service/${service.id}`}>
      <div className="block border p-4 rounded-lg shadow-md text-left hover:shadow-lg transition-shadow">
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

        {/* Информация */}
        <div className="grid grid-cols-2 gap-2 text-sm">
          <p><strong>Название:</strong> {service.name}</p>
          <p><strong>Цена:</strong> {service.price || "Не указана"}</p>
          <p><strong>Категория:</strong> {service.category || "Не указана"}</p>
          <p>
            <strong>{service.organization ? "Фирма" : "ИП"}:</strong>{" "}
            {service.organization || service.individual_entrepreneur || "Не указана"}
          </p>
          <p>
            <strong>Обновлено:</strong>{" "}
            {service.updated_at ? new Date(service.updated_at).toLocaleString() : "Не указана"}
          </p>
        </div>
      </div>
    </Link>
  );
}
