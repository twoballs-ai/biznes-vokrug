"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ImageViewer from "@/components/imageViever";
import { serverUrl } from "@/shared/config";
import UserService from "@/services/user.service";

export default function ProductDetails({ params }) {
  const { id } = params; 
  const router = useRouter();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) {
      setError("Идентификатор продукта не задан");
      setLoading(false);
      return;
    }

    const fetchProduct = async () => {
      try {
        const response = await UserService.getProductById(id);
        if (response.data.status) {
          setProduct(response.data.data);
        } else {
          throw new Error(response.data.message || "Не удалось загрузить данные");
        }
      } catch (err) {
        console.error("Ошибка:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) return <div className="text-center text-lg font-semibold text-gray-600">Загрузка...</div>;
  if (error) return <div className="text-center text-lg font-semibold text-red-600">Ошибка: {error}</div>;
  if (!product) return <div className="text-center text-lg font-semibold text-gray-600">Продукт не найден.</div>;

  return (
    <div className="container mx-auto p-4  bg-white shadow-xl rounded-lg">
      <button
        className="mb-6 text-blue-600 hover:underline focus:outline-none"
        onClick={() => router.back()}
      >
        ← Назад
      </button>
      <h1 className="text-3xl font-semibold text-gray-900 mb-6">{product.name}</h1>

      {/* Изображения */}
      <div className="mb-6">
        {product.images?.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {product.images.map((img, index) => (
              <div key={index} className="w-full h-48 sm:h-56 lg:h-72 overflow-hidden rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <ImageViewer
                  src={`${serverUrl}/${img}`}
                  alt={`Изображение ${index + 1} продукта`}
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 italic">Изображения отсутствуют</p>
        )}
      </div>

      {/* Информация */}
      <div className="space-y-6 text-lg text-gray-700">
        <p><strong>Цена:</strong> {product.price ? `${product.price} ₽` : "Не указана"}</p>
        <p><strong>Категория:</strong> {product.category || "Не указана"}</p>
        <p><strong>Регион:</strong> {product.region || "Не указан"}</p>
        <p><strong>Город:</strong> {product.city || "Не указан"}</p>
        <p><strong>Обновлено:</strong> {product.updated_at ? new Date(product.updated_at).toLocaleString() : "Не указано"}</p>
        <p><strong>Телефон:</strong> {product.show_phone ? product.user_phone : "Не указан"}</p>

        <div className="mt-4">
          <strong>Описание:</strong>
          <div
            className="mt-2 text-gray-600"
            dangerouslySetInnerHTML={{
              __html: product.description || "Нет описания",
            }}
          />
        </div>
      </div>
    </div>
  );
}
