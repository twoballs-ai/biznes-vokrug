import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import ImageViewer from "@/components/imageViever";
import { serverUrl } from "@/shared/config";

export default function ProductCard({ product }) {
  return (
    <Link href={`/product/${product.id}`}>
      <div className="block border p-4 rounded-lg shadow-md text-left hover:shadow-lg transition-shadow">
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

        {/* Информация */}
        <div className="grid grid-cols-2 gap-2 text-sm">
          <p><strong>Название:</strong> {product.name}</p>
          <p><strong>Цена:</strong> {product.price || "Не указана"}</p>
          <p><strong>Категория:</strong> {product.category || "Не указана"}</p>
          <p>
            <strong>{product.organization ? "Фирма" : "ИП"}:</strong>{" "}
            {product.organization || product.individual_entrepreneur || "Не указана"}
          </p>
          <p>
            <strong>Обновлено:</strong>{" "}
            {product.updated_at ? new Date(product.updated_at).toLocaleString() : "Не указана"}
          </p>
          <p>
            <strong>Телефон:</strong> {service.individual_entrepreneur_phone || "Не указан"}
          </p>
        </div>
      </div>
    </Link>
  );
}
