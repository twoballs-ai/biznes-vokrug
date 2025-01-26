"use client";

import Link from "next/link";
import { useAuth } from "@/contexts/AuthProvider";

export default function UserMenu() {
  const { user, logout } = useAuth();

  return (
    <div className="flex flex-col lg:flex-row lg:flex-1 lg:justify-end gap-4">
      {user ? (
        <>
          <Link href="/profile" className="text-sm font-semibold text-gray-900 hover:text-blue-600">
            {user.name || user.email}
          </Link>
          <button
            onClick={logout}
            className="text-sm font-semibold text-gray-900 hover:text-blue-600"
          >
            Выйти
          </button>
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
