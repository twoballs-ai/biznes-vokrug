'use client';

import Link from "next/link";
import { Popover } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { useSelector, useDispatch } from "react-redux";
import { logout as logoutAction } from "@/store/features/authSlice";

// Helper function to generate a random color
const getRandomColor = () => {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

export default function UserMenu() {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);

  const handleLogout = () => {
    dispatch(logoutAction());
  };

  const firstLetter = user?.name?.[0] || user?.email?.[0];

  return (
    <div className="flex flex-col lg:flex-row lg:flex-1 lg:justify-end gap-4">
      {user ? (
        <>
          <Popover className="relative">
            <Popover.Button className="flex items-center text-sm font-semibold text-gray-900 hover:text-blue-600">
              <div
                className="w-8 h-8 flex items-center justify-center rounded-full text-white font-semibold"
                style={{ backgroundColor: getRandomColor() }}
              >
                {firstLetter}
              </div>
              <span className="ml-2">{user.name || user.email}</span>
              <ChevronDownIcon className="ml-1 w-5 h-5 text-gray-600" />
            </Popover.Button>

            <Popover.Panel className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg border border-gray-300">
              <div className="py-2">
                <Link href="/profile" className="block px-4 py-2 text-sm text-gray-900 hover:bg-gray-100">
                  Профиль
                </Link>
                <Link href="/favorites" className="block px-4 py-2 text-sm text-gray-900 hover:bg-gray-100">
                  Избранное
                </Link>
                <Link href="/my-advert" className="block px-4 py-2 text-sm text-gray-900 hover:bg-gray-100">
                  Мои объявления
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                >
                  Выйти
                </button>
              </div>
            </Popover.Panel>
          </Popover>

          <Link
            href="/my-advert/add"
            className="text-sm font-semibold text-white bg-blue-600 border border-blue-600 rounded-md px-4 py-2 hover:bg-blue-700 hover:text-white"
          >
            Разместить объявление
          </Link>
        </>
      ) : (
        <>
          <Link
            href="/login"
            className="text-sm font-semibold text-blue-600 border border-blue-600 rounded-md px-4 py-1 hover:bg-blue-600 hover:text-white"
          >
            Вход
          </Link>
          <Link
            href="/register"
            className="text-sm font-semibold text-white border border-blue-600 rounded-md px-4 py-1 hover:bg-blue-600 hover:text-white bg-blue-600"
          >
            Регистрация
          </Link>
        </>
      )}
    </div>
  );
}
