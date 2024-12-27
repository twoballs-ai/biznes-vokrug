"use client";

import Link from "next/link";
import {
  Dialog,
  DialogPanel,
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Popover,
  PopoverButton,
  PopoverGroup,
  PopoverPanel,
} from "@headlessui/react";
import { Bars3Icon, ChevronDownIcon, XMarkIcon } from "@heroicons/react/24/outline";
import dynamic from "next/dynamic";

const UserMenuNoSSR = dynamic(() => import("./Header/UserMenu"), {
  ssr: false,
});

// Пример массива с продуктами
const products = [
  {
    name: "Analytics",
    description: "Get a better understanding of your traffic",
    href: "/analytics",
  },
  {
    name: "Engagement",
    description: "Speak directly to your customers",
    href: "/engagement",
  },
];

export default function Header() {
  return (
    <header className="bg-white shadow">
      <nav
        aria-label="Global"
        className="mx-auto max-w-7xl p-6 flex justify-between items-center lg:px-8"
      >
        {/* Логотип (статично) */}
        <div className="flex lg:flex-1">
          <Link href="/" className="-m-1.5 p-1.5">
            <h1 className="text-2xl font-bold text-blue-600">Бизнес Вокруг</h1>
          </Link>
        </div>

        {/* Кнопка для мобильного меню (статичная, но работать будет, только если вынести логику в клиентский компонент) */}
        <div className="flex lg:hidden">
          <button
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
          >
            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>

        {/* Горизонтальное меню (Desktop) */}
        <PopoverGroup className="hidden lg:flex lg:gap-x-12">
          <Popover className="relative">
            <PopoverButton className="flex items-center gap-x-1 text-sm font-semibold text-gray-900">
              Продукты
              <ChevronDownIcon
                aria-hidden="true"
                className="h-5 w-5 text-gray-400"
              />
            </PopoverButton>
            <PopoverPanel className="absolute z-10 mt-3 w-screen max-w-md overflow-hidden rounded-3xl bg-white shadow-lg ring-1 ring-gray-900/5">
              <div className="p-4">
                {products.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="block py-2 text-gray-900 hover:bg-gray-50"
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </PopoverPanel>
          </Popover>
          <Link href="/about" className="text-sm font-semibold text-gray-900">
            О нас
          </Link>
          <Link href="/services" className="text-sm font-semibold text-gray-900">
            Услуги
          </Link>
          <Link href="/contact" className="text-sm font-semibold text-gray-900">
            Контакты
          </Link>
        </PopoverGroup>

        {/* Блок вход/выход (Client Component, без SSR) */}
        <UserMenuNoSSR />
      </nav>
    </header>
  );
}
