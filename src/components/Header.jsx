"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Popover,
  PopoverButton,
  PopoverGroup,
  PopoverPanel,
  Transition,
} from "@headlessui/react";
import { Bars3Icon, XMarkIcon, ChevronDownIcon } from "@heroicons/react/24/outline";
import dynamic from "next/dynamic";
import UserService from "@/services/user.service";
import { toast } from "react-toastify";

const UserMenuNoSSR = dynamic(() => import("./Header/UserMenu"), {
  ssr: false,
});

export default function Header() {
  const [productCategories, setProductCategories] = useState([]);
  const [serviceCategories, setServiceCategories] = useState([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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

  // Функция закрытия меню при выборе пункта
  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 w-full bg-white/80 backdrop-blur-md shadow-md z-50">

      <nav
        aria-label="Global"
        className="mx-auto max-w-7xl p-6 flex justify-between items-center lg:px-8"
      >
        {/* Логотип */}
        <div className="flex lg:flex-1">
          <Link href="/" className="-m-1.5 p-1.5">
            <h1 className="text-2xl font-bold text-blue-600">И то и сё</h1>
          </Link>
        </div>

        {/* Кнопка мобильного меню */}
        <div className="lg:hidden">
          <button
            className="text-gray-700 focus:outline-none"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <XMarkIcon className="h-8 w-8" />
            ) : (
              <Bars3Icon className="h-8 w-8" />
            )}
          </button>
        </div>

        {/* Блок вход/выход */}
        <div className="hidden lg:block">
          <UserMenuNoSSR />
        </div>
      </nav>

      {/* Мобильное меню */}
      <Transition
        show={isMobileMenuOpen}
        enter="transition-opacity duration-200"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="transition-opacity duration-150"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <div className="lg:hidden absolute top-0 left-0 w-full h-screen bg-white shadow-md z-50 overflow-y-auto">
          <div className="p-4 space-y-4 relative">
            {/* Кнопка закрытия */}
            <button
              className="absolute top-4 right-4 text-gray-700"
              onClick={closeMobileMenu}
            >
              <XMarkIcon className="h-8 w-8" />
            </button>
            <div className="border-b pb-4 flex justify-center">
              <UserMenuNoSSR />
            </div>
            <Link href="/" className="block text-sm font-semibold text-gray-900" onClick={closeMobileMenu}>
              Главная
            </Link>
          </div>
        </div>
      </Transition>
    </header>
  );
}
