"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function ProfileLayout({ children }) {
  const pathname = usePathname();

  const menuItems = [
    { name: "Организации", href: "/profile/organizations" },
    { name: "Индивидуальный предприниматель", href: "/profile/ip" },
    { name: "Продукты", href: "/profile/products" },
    { name: "Услуги", href: "/profile/services" },
  ];

  return (
    <div className="flex min-h-screen">
      <nav className="w-1/4 p-4 bg-gray-100 border-r border-gray-300">
        <h2 className="text-xl font-bold mb-4">Меню</h2>
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`block py-2 px-4 rounded ${
                  pathname === item.href
                    ? "bg-blue-600 text-white font-bold"
                    : "text-gray-600 hover:bg-gray-200"
                }`}
              >
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <main className="w-3/4 p-6">{children}</main>
    </div>
  );
}
