"use client";

import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import UserService from "@/services/user.service";
import AddAddressModal from "@/components/adressModal";

export default function UserItemForm({
  initialType = "product",
  item,
  onSaved,
}) {
  const [type, setType] = useState(initialType);
  const [categories, setCategories] = useState([]);
  const [localItem, setLocalItem] = useState({
    name: "",
    description: "",
    category_id: "",
    price: "",
    user_address_id: "",
  });
  const [addresses, setAddresses] = useState([]);
  const [loadingAddresses, setLoadingAddresses] = useState(false);
  const [isAddAddressOpen, setIsAddAddressOpen] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);

  // Загрузка адресов
  const loadAddresses = async () => {
    setLoadingAddresses(true);
    try {
      const res = await UserService.listAddresses();
      console.log(res.data.data)
      if (res.status && Array.isArray(res.data.data)) {
        setAddresses(res.data);
        
        console.log("Адреса загружены:", res.data);
      } else {
        setAddresses([]);
      }
    } catch (error) {
      toast.error("Ошибка загрузки адресов");
      setAddresses([]);
    } finally {
      setLoadingAddresses(false);
    }
  };

  // Загружаем адреса при монтировании
  useEffect(() => {
    loadAddresses();
  }, []);

  // Автоматический выбор первого адреса, если ни один не выбран
  useEffect(() => {
    if (addresses.length > 0 && !localItem.user_address_id) {
      setLocalItem((li) => ({ ...li, user_address_id: addresses[0].id }));
    }
  }, [addresses]);

  // Загрузка категорий в зависимости от типа
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        if (type === "product") {
          const res = await UserService.getProductCategories();
          setCategories(res.data || []);
        } else {
          const res = await UserService.getServiceCategories();
          setCategories(res.data || []);
        }
      } catch (e) {
        toast.error("Ошибка загрузки категорий");
        setCategories([]);
      }
    };
    fetchCategories();
  }, [type]);

  // При изменении item обновляем localItem и очищаем выбранные изображения
  useEffect(() => {
    if (item) {
      setLocalItem({
        name: item.name || "",
        description: item.description || "",
        category_id: item.category_id || "",
        price: item.price || "",
        user_address_id: item.user_address_id || "",
      });
      setSelectedImages([]);
    } else {
      setLocalItem({
        name: "",
        description: "",
        category_id: "",
        price: "",
        user_address_id: "",
      });
      setSelectedImages([]);
    }
  }, [item]);

  // После добавления нового адреса обновляем список и выбираем первый
  const handleAddressAdded = async () => {
    await loadAddresses();
    if (addresses.length > 0) {
      setLocalItem((li) => ({ ...li, user_address_id: addresses[0].id }));
    }
  };

  // Обработка добавления изображений
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const validFiles = files.filter((file) => file.size <= 5 * 1024 * 1024);

    if (validFiles.length !== files.length) {
      toast.error("Некоторые файлы слишком большие (макс. 5MB)");
    }
    if (validFiles.length + selectedImages.length > 5) {
      toast.error("Можно загрузить не более 5 изображений");
      return;
    }
    setSelectedImages((prev) => [...prev, ...validFiles]);
  };

  // Удаление выбранного изображения
  const removeImage = (index) => {
    setSelectedImages(selectedImages.filter((_, i) => i !== index));
  };

  // Сохранение формы
  const handleSave = async (e) => {
    e.preventDefault();

    if (!localItem.name) {
      toast.error("Заполните обязательные поля");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", localItem.name);
      formData.append("description", localItem.description);
      formData.append("category_id", localItem.category_id || "");
      formData.append("price", localItem.price || "");
      formData.append("user_address_id", localItem.user_address_id || "");

      selectedImages.forEach((file) => formData.append("images", file));

      if (type === "product") {
        if (item) {
          await UserService.updateProductForUser(item.id, formData);
          toast.success("Товар успешно обновлён");
        } else {
          await UserService.createProductForUser(formData);
          toast.success("Товар успешно создан");
        }
      } else {
        if (item) {
          await UserService.updateServiceForUser(item.id, formData);
          toast.success("Услуга успешно обновлена");
        } else {
          await UserService.createServiceForUser(formData);
          toast.success("Услуга успешно создана");
        }
      }

      onSaved?.();
    } catch (error) {
      console.error("Ошибка при сохранении:", error);
      toast.error("Ошибка при сохранении.");
    }
  };

  return (
    <>
      <form
        onSubmit={handleSave}
        className="space-y-6 max-w-xl mx-auto p-4 bg-white rounded shadow-md"
      >
        {/* Тип */}
        <div>
          <label className="block mb-2 font-semibold text-gray-700">Тип *</label>
          <div className="flex gap-4">
            {["product", "service"].map((option) => (
              <label
                key={option}
                className={`cursor-pointer px-5 py-2 border rounded-lg transition select-none
                ${
                  type === option
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-blue-50"
                }
              `}
              >
                <input
                  type="radio"
                  name="type"
                  value={option}
                  checked={type === option}
                  onChange={() => setType(option)}
                  className="hidden"
                />
                {option === "product" ? "Товар" : "Услуга"}
              </label>
            ))}
          </div>
        </div>

        {/* Название */}
        <div>
          <label className="block mb-2 font-semibold text-gray-700">Название *</label>
          <input
            type="text"
            className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={localItem.name}
            onChange={(e) => setLocalItem({ ...localItem, name: e.target.value })}
            required
            placeholder="Введите название"
          />
        </div>

        {/* Описание */}
        <div>
          <label className="block mb-2 font-semibold text-gray-700">Описание</label>
          <textarea
            className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            rows={4}
            value={localItem.description}
            onChange={(e) => setLocalItem({ ...localItem, description: e.target.value })}
            placeholder="Введите описание"
          />
        </div>

        {/* Категории */}
        <div>
          <label className="block mb-2 font-semibold text-gray-700">Категория</label>
          <div className="flex flex-wrap gap-4">
            {categories.length === 0 && (
              <p className="text-gray-500">Категории не загружены</p>
            )}
            {categories.map((c) => (
              <label
                key={c.key}
                className={`cursor-pointer px-4 py-2 border rounded-lg transition
                ${
                  localItem.category_id === String(c.key)
                    ? "bg-blue-500 text-white border-blue-500"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-blue-50"
                }
              `}
              >
                <input
                  type="radio"
                  name="category"
                  value={c.key}
                  checked={localItem.category_id === String(c.key)}
                  onChange={() => setLocalItem({ ...localItem, category_id: String(c.key) })}
                  className="hidden"
                />
                {c.value}
              </label>
            ))}
          </div>
        </div>

        {/* Цена */}
        <div>
          <label className="block mb-2 font-semibold text-gray-700">Цена (руб.)</label>
          <input
            type="number"
            className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={localItem.price}
            onChange={(e) => setLocalItem({ ...localItem, price: e.target.value })}
            placeholder="0"
            min={0}
            step="0.01"
          />
        </div>

        {/* Адрес с кнопкой открытия модалки */}
        <div>
          <label className="block mb-2 font-semibold text-gray-700">Адрес</label>
          <div className="flex gap-2 items-center">
            {loadingAddresses ? (
              <p className="text-gray-500">Загрузка адресов...</p>
            ) : !Array.isArray(addresses) || addresses.length === 0 ? (
              <p className="text-red-600 font-semibold">
                Адрес не выбран. Пожалуйста, добавьте адрес.
              </p>
            ) : (
              <select
                className="flex-grow p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={localItem.user_address_id}
                onChange={(e) =>
                  setLocalItem({ ...localItem, user_address_id: e.target.value })
                }
              >
                <option value="">Не привязывать</option>
                {addresses.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.address} {a.type ? `(${a.type})` : ""}
                  </option>
                ))}
              </select>
            )}

            <button
              type="button"
              className="px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
              onClick={() => setIsAddAddressOpen(true)}
            >
              Добавить адрес
            </button>
          </div>
        </div>

        {/* Фото */}
        <div>
          <label className="block mb-2 font-semibold text-gray-700">Фотографии</label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageChange}
            className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4
            file:rounded file:border-0 file:text-sm file:font-semibold
            file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
          <div className="mt-3 flex flex-wrap gap-3">
            {selectedImages.map((file, index) => (
              <div
                key={index}
                className="relative w-20 h-20 rounded overflow-hidden border border-gray-300"
              >
                <img
                  src={URL.createObjectURL(file)}
                  alt="preview"
                  className="object-cover w-full h-full"
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-0 right-0 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-700"
                  aria-label="Удалить изображение"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Кнопка сохранить */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded shadow-md transition"
          >
            Сохранить
          </button>
        </div>
      </form>

      <AddAddressModal
        isOpen={isAddAddressOpen}
        onClose={() => setIsAddAddressOpen(false)}
        onAdded={handleAddressAdded}
      />
    </>
  );
}
