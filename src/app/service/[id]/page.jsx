"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ImageViewer from "@/components/imageViever";
import { serverUrl } from "@/shared/config";
import UserService from "@/services/user.service";
import { use } from "react";
export default function ServiceDetails({ params }) {

  const { id } = use(params);
  const router = useRouter();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(0); // Индекс выбранного изображения

  useEffect(() => {
    if (!id) {
      setError("Идентификатор услуги не задан");
      setLoading(false);
      return;
    }

    const fetchService = async () => {
      try {
        const response = await UserService.getServiceById(id);
        if (response.data.status) {
          setService(response.data.data);
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

    fetchService();
  }, [id]);

  if (loading) return <div className="text-center">Загрузка...</div>;
  if (error) return <div className="text-center text-red-600">Ошибка: {error}</div>;
  if (!service) return <div className="text-center">Услуга не найдена.</div>;

  return (
    <div className="container mx-auto p-4 bg-white shadow-lg rounded-lg">
      <button
        className="mb-6 text-blue-600 hover:underline"
        onClick={() => router.back()}
      >
        ← Назад
      </button>
      <h1 className="text-3xl font-semibold text-gray-900 mb-4">{service.name}</h1>

      {/* Основное изображение */}
      <div className="mb-6 relative">
        {service.images?.length > 0 ? (
          <div>
            {/* Основное изображение */}
            <div className="w-full max-w-[400px] h-[300px] overflow-hidden rounded-lg shadow-md mx-auto">
              <ImageViewer
                src={`${serverUrl}/${service.images[selectedIndex]}`}
                alt={`Изображение ${selectedIndex + 1} услуги`}
                className="w-full h-full object-cover rounded-lg"
              />
            </div>

            {/* Список миниатюр */}
            <div className="mt-4 flex space-x-4 overflow-x-auto">
              {service.images.map((img, index) => (
                <div
                  key={index}
                  className={`w-[80px] sm:w-[100px] lg:w-[120px] h-[60px] sm:h-[80px] lg:h-[100px] overflow-hidden rounded-lg cursor-pointer border ${
                    selectedIndex === index ? "border-blue-500" : "border-transparent"
                  } transition`}
                  onClick={() => setSelectedIndex(index)} // При клике на миниатюру меняем изображение
                >
                  <img
                    src={`${serverUrl}/${img}`}
                    alt={`Миниатюра ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        ) : (
          <p className="text-gray-500 italic">Изображения отсутствуют</p>
        )}
      </div>

      {/* Информация */}
      <div className="space-y-4">
        <p className="text-lg">
          <strong>Цена:</strong> {service.price ? `${service.price} ₽` : "Не указана"}
        </p>
        <p className="text-lg">
          <strong>Категория:</strong> {service.category || "Не указана"}
        </p>
        <p className="text-lg">
          <strong>Регион:</strong> {service.region || "Не указан"}
        </p>
        <p className="text-lg">
          <strong>Город:</strong> {service.city || "Не указан"}
        </p>
        <p className="text-lg">
          <strong>Обновлено:</strong>{" "}
          {service.updated_at ? new Date(service.updated_at).toLocaleString() : "Не указано"}
        </p>

        <p className="text-lg">
          <strong>Телефон:</strong>{" "}
          {service.show_phone ? service.user_phone : "Не указан"}
        </p>
        <div className="mt-4">
          <strong>Описание:</strong>
          <div
            className="mt-2 text-gray-700"
            dangerouslySetInnerHTML={{
              __html: service.description || "Нет описания",
            }}
          />
        </div>
      </div>
    </div>
  );
}
