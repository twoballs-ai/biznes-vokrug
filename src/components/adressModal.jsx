import React, { useState, useEffect, useRef } from "react";
import UserService from "@/services/user.service";
import { toast } from "react-toastify";

export default function AddAddressModal({ isOpen, onClose, onAdded, initialData = null }) {
  const [region, setRegion] = useState("");
  const [city, setCity] = useState("");
  const [line, setLine] = useState("");
  const [type, setType] = useState("");

  const [regionSuggestions, setRegionSuggestions] = useState([]);
  const [citySuggestions, setCitySuggestions] = useState([]);
  const [lineSuggestions, setLineSuggestions] = useState([]);

  const [showRegionSuggestions, setShowRegionSuggestions] = useState(false);
  const [showCitySuggestions, setShowCitySuggestions] = useState(false);
  const [showLineSuggestions, setShowLineSuggestions] = useState(false);

  // Для управления таймаутами debounce
  const debounceTimeout = useRef(null);

  // Функция для debounce
  const debounce = (func, delay) => {
    if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
    debounceTimeout.current = setTimeout(func, delay);
  };

  // При открытии/смене initialData заполняем поля или сбрасываем
  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setRegion(initialData.region || "");
        setCity(initialData.city || "");
        setLine(initialData.line || "");
        setType(initialData.type || "");
      } else {
        setRegion("");
        setCity("");
        setLine("");
        setType("");
      }
      setRegionSuggestions([]);
      setCitySuggestions([]);
      setLineSuggestions([]);
      setShowRegionSuggestions(false);
      setShowCitySuggestions(false);
      setShowLineSuggestions(false);
    }
  }, [initialData, isOpen]);

  // Запрос подсказок региона
  const fetchRegionSuggestions = (query) => {
    if (!query || query.length < 2) {
      setRegionSuggestions([]);
      return;
    }
    debounce(async () => {
      try {
        const res = await UserService.suggestRegion(query);
        setRegionSuggestions(res.data || []);
        setShowRegionSuggestions(true);
      } catch {
        setRegionSuggestions([]);
      }
    }, 300);
  };

  // Запрос подсказок города
  const fetchCitySuggestions = (query, regionValue) => {
    if (!query || query.length < 2) {
      setCitySuggestions([]);
      return;
    }
    debounce(async () => {
      try {
        const res = await UserService.suggestCity(query, regionValue);
        setCitySuggestions(res.data || []);
        setShowCitySuggestions(true);
      } catch {
        setCitySuggestions([]);
      }
    }, 300);
  };

  // Запрос подсказок улицы
  const fetchLineSuggestions = (query, regionValue, cityValue) => {
    if (!query || query.length < 2) {
      setLineSuggestions([]);
      return;
    }
    debounce(async () => {
      try {
        const res = await UserService.suggestStreet(query, regionValue, cityValue);
        setLineSuggestions(res.data || []);
        setShowLineSuggestions(true);
      } catch {
        setLineSuggestions([]);
      }
    }, 300);
  };

  // Обработчики ввода с автозаполнением
  const onRegionChange = (e) => {
    setRegion(e.target.value);
    setShowRegionSuggestions(true);
    fetchRegionSuggestions(e.target.value);
    setCity("");
    setLine("");
    setCitySuggestions([]);
    setLineSuggestions([]);
  };

  const onCityChange = (e) => {
    setCity(e.target.value);
    setShowCitySuggestions(true);
    fetchCitySuggestions(e.target.value, region);
    setLine("");
    setLineSuggestions([]);
  };

  const onLineChange = (e) => {
    setLine(e.target.value);
    setShowLineSuggestions(true);
    fetchLineSuggestions(e.target.value, region, city);
  };

  // Выбор из подсказок
  const selectRegion = (value) => {
    setRegion(value);
    setShowRegionSuggestions(false);
    setCity("");
    setLine("");
    setCitySuggestions([]);
    setLineSuggestions([]);
  };

  const selectCity = (value) => {
    setCity(value);
    setShowCitySuggestions(false);
    setLine("");
    setLineSuggestions([]);
  };

  const selectLine = (value) => {
    setLine(value);
    setShowLineSuggestions(false);
  };

  // Отправка формы
  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = { region, city, line, type };

    try {
      if (initialData && initialData.id) {
        // Редактирование
        await UserService.updateAddress(initialData.id, data);
        toast.success("Адрес успешно обновлен");
      } else {
        // Добавление
        await UserService.addAddress(data);
        toast.success("Адрес успешно добавлен");
      }
      onAdded();
      onClose();
    } catch (error) {
      toast.error("Ошибка при сохранении адреса");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded shadow-lg max-w-md w-full">
        <h2 className="text-xl font-semibold mb-4">
          {initialData ? "Редактировать адрес" : "Добавить адрес"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4" autoComplete="off">
          {/* Регион */}
          <div className="relative">
            <input
              type="text"
              placeholder="Регион"
              value={region}
              onChange={onRegionChange}
              required
              className="w-full p-2 border rounded"
              onFocus={() => region && setShowRegionSuggestions(true)}
              onBlur={() => setTimeout(() => setShowRegionSuggestions(false), 150)}
            />
            {showRegionSuggestions && regionSuggestions.length > 0 && (
              <ul className="absolute z-10 bg-white border border-gray-300 rounded max-h-48 overflow-auto w-full">
                {regionSuggestions.map((sug) => (
                  <li
                    key={sug.value}
                    className="p-2 cursor-pointer hover:bg-blue-100"
                    onMouseDown={() => selectRegion(sug.value)}
                  >
                    {sug.value}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Город */}
          <div className="relative">
            <input
              type="text"
              placeholder="Город"
              value={city}
              onChange={onCityChange}
              required
              className="w-full p-2 border rounded"
              onFocus={() => city && setShowCitySuggestions(true)}
              onBlur={() => setTimeout(() => setShowCitySuggestions(false), 150)}
              disabled={!region}
            />
            {showCitySuggestions && citySuggestions.length > 0 && (
              <ul className="absolute z-10 bg-white border border-gray-300 rounded max-h-48 overflow-auto w-full">
                {citySuggestions.map((sug) => (
                  <li
                    key={sug.value}
                    className="p-2 cursor-pointer hover:bg-blue-100"
                    onMouseDown={() => selectCity(sug.value)}
                  >
                    {sug.value}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Улица */}
          <div className="relative">
            <input
              type="text"
              placeholder="Адрес (улица, дом и т.п.)"
              value={line}
              onChange={onLineChange}
              className="w-full p-2 border rounded"
              onFocus={() => line && setShowLineSuggestions(true)}
              onBlur={() => setTimeout(() => setShowLineSuggestions(false), 150)}
              disabled={!region || !city}
            />
            {showLineSuggestions && lineSuggestions.length > 0 && (
              <ul className="absolute z-10 bg-white border border-gray-300 rounded max-h-48 overflow-auto w-full">
                {lineSuggestions.map((sug) => (
                  <li
                    key={sug.value}
                    className="p-2 cursor-pointer hover:bg-blue-100"
                    onMouseDown={() => selectLine(sug.value)}
                  >
                    {sug.value}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Тип адреса */}
          <input
            type="text"
            placeholder="Тип адреса (дом, работа и т.д.)"
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full p-2 border rounded"
          />

          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded"
            >
              Отмена
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded"
            >
              {initialData ? "Сохранить" : "Добавить"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
