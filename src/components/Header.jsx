// components/Header.js
"use client";
import { useContext, useState } from "react";
import { AuthContext } from "../contexts/AuthProvider";
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
import {
  ArrowPathIcon,
  Bars3Icon,
  ChartPieIcon,
  CursorArrowRaysIcon,
  FingerPrintIcon,
  SquaresPlusIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import {
  ChevronDownIcon,
  PhoneIcon,
  PlayCircleIcon,
} from "@heroicons/react/20/solid";

const products = [
  {
    name: "Analytics",
    description: "Get a better understanding of your traffic",
    href: "#",
    icon: ChartPieIcon,
  },
  {
    name: "Engagement",
    description: "Speak directly to your customers",
    href: "#",
    icon: CursorArrowRaysIcon,
  },
];

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, logout } = useContext(AuthContext);

  return (
    <header className="bg-white shadow">
    <nav
      aria-label="Global"
      className="mx-auto max-w-7xl p-6 flex justify-between items-center lg:px-8"
    >
      <div className="flex lg:flex-1">
        <a href="/" className="-m-1.5 p-1.5">
          <h1 className="text-2xl font-bold text-blue-600">
            Бизнес Вокруг
          </h1>
        </a>
      </div>
      <div className="flex lg:hidden">
        <button
          type="button"
          onClick={() => setMobileMenuOpen(true)}
          className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
        >
          <Bars3Icon className="h-6 w-6" aria-hidden="true" />
        </button>
      </div>
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
                <div
                  key={item.name}
                  className="group flex items-center gap-x-4 p-4 hover:bg-gray-50"
                >
                  <item.icon className="h-6 w-6 text-gray-600 group-hover:text-indigo-600" />
                  <div>
                    <a
                      href={item.href}
                      className="font-semibold text-gray-900"
                    >
                      {item.name}
                    </a>
                    <p className="text-gray-600">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </PopoverPanel>
        </Popover>
        <a
          href="/about"
          className="text-sm font-semibold text-gray-900"
        >
          О нас
        </a>
        <a
          href="/services"
          className="text-sm font-semibold text-gray-900"
        >
          Услуги
        </a>
        <a
          href="/contact"
          className="text-sm font-semibold text-gray-900"
        >
          Контакты
        </a>
      </PopoverGroup>
      <div className="hidden lg:flex lg:flex-1 lg:justify-end gap-4">
        {user ? (
          <>
            <a
              href="/profile"
              className="text-sm font-semibold text-gray-900 hover:text-blue-600"
            >
              Профиль
            </a>
            <button
              onClick={logout}
              className="text-sm font-semibold text-gray-900 hover:text-blue-600"
            >
              Выйти
            </button>
          </>
        ) : (
          <>
            <a
              href="/login"
              className="text-sm font-semibold text-blue-600 border border-blue-600 rounded-md px-4 py-1 hover:bg-blue-600 hover:text-white"
            >
              Вход
            </a>
            <a
              href="/register"
              className="text-sm font-semibold text-white border border-blue-600 rounded-md px-4 py-1 hover:bg-blue-600 hover:text-white bg-blue-600"
            >
              Регистрация
            </a>
          </>
        )}
      </div>
    </nav>
    <Dialog
      open={mobileMenuOpen}
      onClose={() => setMobileMenuOpen(false)}
      className="lg:hidden"
    >
      <DialogPanel className="fixed inset-y-0 right-0 z-10 w-full bg-white px-6 py-6 sm:max-w-sm">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-blue-600">
            Бизнес Вокруг
          </h2>
          <button
            type="button"
            onClick={() => setMobileMenuOpen(false)}
            className="-m-2.5 rounded-md p-2.5 text-gray-700"
          >
            <XMarkIcon aria-hidden="true" className="h-6 w-6" />
          </button>
        </div>
        <div className="mt-6 space-y-4">
          <Disclosure>
            <DisclosureButton className="flex justify-between w-full py-2 text-base font-semibold text-gray-900">
              Продукты
              <ChevronDownIcon className="h-5 w-5" />
            </DisclosureButton>
            <DisclosurePanel className="mt-2 space-y-2">
              {products.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="block px-4 py-2 text-sm text-gray-900 hover:bg-gray-50"
                >
                  {item.name}
                </a>
              ))}
            </DisclosurePanel>
          </Disclosure>
          <a
            href="/about"
            className="block py-2 text-base font-semibold text-gray-900 hover:bg-gray-50"
          >
            О нас
          </a>
          <a
            href="/services"
            className="block py-2 text-base font-semibold text-gray-900 hover:bg-gray-50"
          >
            Услуги
          </a>
          <a
            href="/contact"
            className="block py-2 text-base font-semibold text-gray-900 hover:bg-gray-50"
          >
            Контакты
          </a>
          {user ? (
            <>
              <a
                href="/profile"
                className="block py-2 text-base font-semibold text-gray-900 hover:bg-gray-50"
              >
                Профиль
              </a>
              <button
                onClick={() => {
                  logout();
                  setMobileMenuOpen(false);
                }}
                className="block w-full text-left py-2 text-base font-semibold text-gray-900 hover:bg-gray-50"
              >
                Выйти
              </button>
            </>
          ) : (
            <>
              <a
                href="/login"
                className="block py-2 text-base font-semibold text-gray-900 hover:bg-gray-50"
              >
                Вход
              </a>
              <a
                href="/register"
                className="block py-2 text-base font-semibold text-blue-600 hover:bg-blue-100"
              >
                Регистрация
              </a>
            </>
          )}
        </div>
      </DialogPanel>
    </Dialog>
  </header>
  );
};

export default Header;
