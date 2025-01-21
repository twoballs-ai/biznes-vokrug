"use client";

import { useEffect, useState } from "react";
import axios from "axios";

export default function CurrencyWidget() {
  const [rates, setRates] = useState({ USD: null, EUR: null, CNY: null });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRates = async () => {
      try {
        const response = await axios.get("https://www.cbr-xml-daily.ru/daily_json.js");
        setRates({
          USD: response.data.Valute.USD.Value,
          EUR: response.data.Valute.EUR.Value,
          CNY: response.data.Valute.CNY.Value,
        });
      } catch (error) {
        console.error("Ошибка загрузки курса валют:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRates();
    // Обновлять курс каждые 6 часов
    const interval = setInterval(fetchRates, 6 * 60 * 60 * 1000);
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
