"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Popover,
  PopoverButton,
  PopoverGroup,
  PopoverPanel,
} from "@headlessui/react";
import { Bars3Icon, ChevronDownIcon } from "@heroicons/react/24/outline";
import dynamic from "next/dynamic";
import UserService from "@/services/user.service"; // Предполагается, что UserService настроен для API-запросов
import { toast } from "react-toastify";

const UserMenuNoSSR = dynamic(() => import("./Header/UserMenu"), {
  ssr: false,
});

export default function Header() {
  const [productCategories, setProductCategories] = useState([]);
  const [serviceCategories, setServiceCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const productResponse = await UserService.getProductCategories();
        const serviceResponse = await UserService.getServiceCategories();
        setProductCategories(productResponse.data || []);
        setServiceCategories(serviceResponse.data || []);
      } catch (error) {
        console.error("Ошибка при загрузке категорий:", error);
        toast.error("Не удалось загрузить категории.");
      }
    };

    fetchCategories();
  }, []);

  return (
    <header className="bg-white shadow">
      <nav
        aria-label="Global"
        className="mx-auto max-w-7xl p-6 flex justify-between items-center lg:px-8"
      >
        {/* Логотип */}
        <div className="flex lg:flex-1">
          <Link href="/" className="-m-1.5 p-1.5">
            <h1 className="text-2xl font-bold text-blue-600">Бизнес Вокруг</h1>
          </Link>
        </div>

        {/* Горизонтальное меню */}
        <PopoverGroup className="hidden lg:flex lg:gap-x-12">
          {/* Продукты */}
          <Popover className="relative">
            <PopoverButton className="flex items-center gap-x-1 text-sm font-semibold text-gray-900">
              Продукты
              <ChevronDownIcon
                aria-hidden="true"
                className="h-5 w-5 text-gray-400"
              />
            </PopoverButton>
            <PopoverPanel className="absolute z-10 mt-3 w-screen max-w-md overflow-hidden rounded-3xl bg-white shadow-lg ring-1 ring-gray-900/5">
            <div className="p-4 max-h-64 overflow-y-auto thin-scrollbar">
                {productCategories.length > 0 ? (
                  productCategories.map((category) => (
                    <Link
                      key={category.key}
                      href={`/products/${category.key}`}
                      className="block text-gray-900 hover:bg-gray-50"
                    >
                      {category.value}
                    </Link>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">Нет категорий продуктов</p>
                )}
              </div>
            </PopoverPanel>
          </Popover>

          {/* Сервисы */}
          <Popover className="relative">
  <PopoverButton className="flex items-center gap-x-1 text-sm font-semibold text-gray-900">
    Сервисы
    <ChevronDownIcon
      aria-hidden="true"
      className="h-5 w-5 text-gray-400"
    />
  </PopoverButton>
  <PopoverPanel className="absolute z-10 mt-3 w-screen max-w-md overflow-hidden rounded-3xl bg-white shadow-lg ring-1 ring-gray-900/5">
    <div className="p-4 max-h-64 overflow-y-auto thin-scrollbar">
      {serviceCategories.length > 0 ? (
        serviceCategories.map((category) => (
          <Link
            key={category.key}
            href={`/services/${category.key}`}
            className="block text-gray-900 hover:bg-gray-50"
          >
            {category.value}
          </Link>
        ))
      ) : (
        <p className="text-sm text-gray-500">Нет категорий сервисов</p>
      )}
    </div>
  </PopoverPanel>
</Popover>

          <Link href="/about" className="text-sm font-semibold text-gray-900">
            О нас
          </Link>
          <Link href="/contact" className="text-sm font-semibold text-gray-900">
            Контакты
          </Link>
        </PopoverGroup>

        {/* Блок вход/выход */}
        <UserMenuNoSSR />
      </nav>
    </header>
  );
}
