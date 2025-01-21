"use client";

import { useEffect, useState } from "react";
import axios from "axios";

export default function CryptoWidget() {
  const [cryptoRates, setCryptoRates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCryptoRates = async () => {
      try {
        const response = await axios.get(
          "https://api.coingecko.com/api/v3/simple/price",
          {
            params: {
              ids: "bitcoin,ethereum,binancecoin,solana,cardano",
              vs_currencies: "usd",
            },
          }
        );
        setCryptoRates(response.data);
      } catch (error) {
        console.error("Ошибка загрузки курсов криптовалют:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCryptoRates();
    // Обновлять данные каждую минуту
    const interval = setInterval(fetchCryptoRates, 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-gray-900 bg-opacity-80 backdrop-blur-md text-white rounded-lg p-4 w-60 shadow-lg">
      <h3 className="text-lg font-semibold text-center mb-2">Курс криптовалют</h3>
      {loading ? (
        <p className="text-center text-gray-400">Загрузка...</p>
      ) : (
        <ul className="text-sm space-y-2">
          <li className="flex justify-between">
            <span className="text-gray-300">BTC:</span>
            <strong>${cryptoRates.bitcoin?.usd}</strong>
          </li>
          <li className="flex justify-between">
            <span className="text-gray-300">ETH:</span>
            <strong>${cryptoRates.ethereum?.usd}</strong>
          </li>
          <li className="flex justify-between">
            <span className="text-gray-300">BNB:</span>
            <strong>${cryptoRates.binancecoin?.usd}</strong>
          </li>
          <li className="flex justify-between">
            <span className="text-gray-300">SOL:</span>
            <strong>${cryptoRates.solana?.usd}</strong>
          </li>
          <li className="flex justify-between">
            <span className="text-gray-300">ADA:</span>
            <strong>${cryptoRates.cardano?.usd}</strong>
          </li>
        </ul>
      )}
    </div>
  );
}
