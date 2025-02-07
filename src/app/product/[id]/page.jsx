"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ImageViewer from "@/components/imageViever";
import { serverUrl } from "@/shared/config";
import UserService from "@/services/user.service";

export default function ServiceDetails({ params }) {
  const { id } = params; // динамический параметр, например, /service/[id]
  const router = useRouter();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
          throw new Error(
            response.data.message || "Не удалось загрузить данные"
          );
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

  if (loading) return <div>Загрузка...</div>;
  if (error) return <div>Ошибка: {error}</div>;
  if (!service) return <div>Услуга не найдена.</div>;

  return (
    <div className="container mx-auto p-4">
      <button
        className="mb-4 text-blue-600 hover:underline"
        onClick={() => router.back()}
      >
        ← Назад
      </button>
      <h1 className="text-3xl font-bold mb-4">{service.name}</h1>

      {/* Изображения */}
      {service.images?.length > 0 ? (
        <div className="mb-4">
          {service.images.map((img, index) => (
            <div key={index} className="mb-2">
              <ImageViewer
                src={`${serverUrl}/${img}`}
                alt={`Изображение ${index + 1} услуги`}
                className="w-32 h-32" // 8rem x 8rem (примерно 128x128 пикселей)
              />
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 italic mb-4">Изображения отсутствуют</p>
      )}

      {/* Информация */}
      <div className="text-lg">
        <p>
          <strong>Цена:</strong> {service.price || "Не указана"}
        </p>
        <p>
          <strong>Категория:</strong> {service.category || "Не указана"}
        </p>
        <p>
          <strong>{service.organization ? "Фирма" : "ИП"}:</strong>{" "}
          {service.organization ||
            service.individual_entrepreneur ||
            "Не указана"}
        </p>
        <p>
          <strong>Обновлено:</strong>{" "}
          {service.updated_at
            ? new Date(service.updated_at).toLocaleString()
            : "Не указана"}
        </p>
        <div className="mt-4">
          <strong>Описание:</strong>
          <div
            className="mt-2"
            dangerouslySetInnerHTML={{
              __html: service.description || "Нет описания",
            }}
          />
        </div>
      </div>
    </div>
  );
}
