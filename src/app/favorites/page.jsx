"use client";
import { useEffect, useState } from "react";
import UserService from "@/services/user.service";
import ProductCard from "@/components/HomePage/ProductCard";
import ServiceCard from "@/components/HomePage/ServiceCard";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  // Загружаем избранное при монтировании
  useEffect(() => {
    const fetchFavorites = async () => {
      setLoading(true);
      try {
        const res = await UserService.getUserFavoritesFlat(); // сделаем метод в UserService ниже
        if (res.data && res.data.status) {
          setFavorites(res.data.data);
        } else {
          setFavorites([]);
          toast.error("Ошибка загрузки избранного");
        }
      } catch (error) {
        toast.error("Ошибка при загрузке избранного");
      } finally {
        setLoading(false);
      }
    };
    fetchFavorites();
  }, []);

  // Удалить из избранного в текущем списке и на сервере
  const handleToggleFavorite = async (type, id) => {
    try {
      await UserService.removeFavorite(type, id);
setFavorites((prev = []) => prev.filter((f) => !(f.type === type && f.item.id === id)));      toast.info("Удалено из избранного");
    } catch {
      toast.error("Ошибка при удалении из избранного");
    }
  };

  if (loading) {
    return <p className="text-center mt-10">Загрузка избранного...</p>;
  }

  if (favorites.length === 0) {
    return <p className="text-center mt-10">У вас пока нет избранных товаров или услуг.</p>;
  }

  return (
    <section className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Избранное</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {favorites.map(({ favorite_id, type, item }) =>
          type === "product" ? (
            <div key={favorite_id} className="relative">
              <ProductCard product={item} />
              <button
                onClick={() => handleToggleFavorite(type, item.id)}
                className="absolute top-2 right-2 z-20 text-red-500 hover:text-red-700 focus:outline-none"
                aria-label="Удалить из избранного"
              >
                {/* Здесь можно просто залитое сердечко для удаления */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 8.25L12 21l9-12.75M12 12v9"
                  />
                </svg>
              </button>
            </div>
          ) : (
            <div key={favorite_id} className="relative">
              <ServiceCard service={item} />
              <button
                onClick={() => handleToggleFavorite(type, item.id)}
                className="absolute top-2 right-2 z-20 text-red-500 hover:text-red-700 focus:outline-none"
                aria-label="Удалить из избранного"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 8.25L12 21l9-12.75M12 12v9"
                  />
                </svg>
              </button>
            </div>
          )
        )}
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </section>
  );
}
