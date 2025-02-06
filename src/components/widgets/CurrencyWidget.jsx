"use client";

import { useEffect, useState } from "react";

import UserService from "@/services/user.service";
export default function CurrencyWidget() {
  const [rates, setRates] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRates = async () => {
      try {
        const response = await UserService.getWidgetCurrency();
        setRates(response.data);
      } catch (error) {
        console.error("Ошибка загрузки курса валют:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRates();
    const interval = setInterval(fetchRates, 6 * 60 * 60 * 1000); // Обновление каждые 6 часов
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-gray-900 bg-opacity-80 backdrop-blur-md text-white rounded-lg p-4 w-60 shadow-lg">
      <h3 className="text-lg font-semibold text-center mb-2">Курс валют</h3>
      {loading ? (
        <p className="text-center text-gray-400">Загрузка...</p>
      ) : (
        <ul className="text-sm space-y-2">
          <li className="flex justify-between">
            <span className="text-gray-300">USD:</span>
            <strong>{rates.USD} ₽</strong>
          </li>
          <li className="flex justify-between">
            <span className="text-gray-300">EUR:</span>
            <strong>{rates.EUR} ₽</strong>
          </li>
          <li className="flex justify-between">
            <span className="text-gray-300">CNY:</span>
            <strong>{rates.CNY} ₽</strong>
          </li>
        </ul>
      )}
    </div>
  );
}
