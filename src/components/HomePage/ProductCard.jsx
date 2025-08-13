import { useState, useEffect } from "react";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import ImageViewer from "@/components/imageViever";
import { serverUrl } from "@/shared/config";
import UserService from "@/services/user.service";
import { FaHeart, FaRegHeart } from "react-icons/fa";  // иконки сердечек

const PlaceholderImage = () => (
  <div className="h-32 bg-gray-200 flex items-center justify-center text-gray-500 text-xs">
    Изображение отсутствует
  </div>
);

const truncateAddress = (address) => {
  if (address.length > 30) {
    return address.slice(0, 30) + "...";
  }
  return address;
};

export default function ProductCard({ product, isLoading, isAuthenticated }) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [loadingFav, setLoadingFav] = useState(true);

  const address = `${product.region || ""} ${product.city || ""}`.trim();

  useEffect(() => {
    let mounted = true;
      if (isAuthenticated) {
    // Проверяем, в избранном ли продукт
    UserService.checkIsFavorite("product", product.id)
      .then((res) => {
        if (mounted && res.data) {
          setIsFavorite(res.data.isFavorite);
          setLoadingFav(false);
        }
      })
      .catch(() => setLoadingFav(false));
          } else {
      setLoadingFav(false);
    }
    return () => {
      mounted = false;
    };
  }, [product.id, isAuthenticated]);

  const toggleFavorite = async (e) => {
    e.preventDefault(); // чтобы не срабатывал переход по ссылке
    if (!isAuthenticated) return; 
    setLoadingFav(true);
    try {
      if (isFavorite) {
        await UserService.removeFavorite("product", product.id);
        setIsFavorite(false);
        // toast.info("Удалено из избранного");
      } else {
        await UserService.addFavorite("product", product.id);
        setIsFavorite(true);
        // toast.success("Добавлено в избранное");
      }
    } catch (error) {
      toast.error("Ошибка при изменении избранного");
    } finally {
      setLoadingFav(false);
    }
  };

  return (
    <Link href={`/product/${product.id}`}>
      <div className="relative block border p-3 rounded-lg shadow-sm text-left hover:shadow-md transition-shadow">
        {/* Иконка избранного */}
        {isAuthenticated && (
          <button
            onClick={toggleFavorite}
            disabled={loadingFav}
            className="absolute top-2 right-2 z-20 text-red-500 hover:text-red-700 focus:outline-none"
            aria-label={isFavorite ? "Удалить из избранного" : "Добавить в избранное"}
          >
            {isFavorite ? <FaHeart size={20} /> : <FaRegHeart size={20} />}
          </button>
        )}


        {/* Изображения */}
        {isLoading ? (
          <div className="mb-2 bg-gray-100 h-32 animate-pulse"></div>
        ) : product.images?.length > 0 ? (
          <div className="mb-2">
            {product.images.length > 1 ? (
              <Swiper
                modules={[Navigation, Pagination]}
                navigation
                pagination={{ clickable: true }}
                spaceBetween={8}
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
              <ImageViewer src={`${serverUrl}/${product.images[0]}`} alt={`product-${product.id}`} />
            )}
          </div>
        ) : (
          <PlaceholderImage />
        )}

        {/* Информация */}
        <div className="text-sm text-gray-700">
          <p className="font-semibold text-lg">{product.name}</p>
          <p className="text-sm text-gray-500">
            <span>Цена: </span>
            {product.price || "Не указана"}
          </p>
          <p className="text-xs text-gray-400 mt-1 truncate">
            <strong>Адрес:</strong> {truncateAddress(address) || "Не указан"}
          </p>
        </div>
      </div>
    </Link>
  );
}
