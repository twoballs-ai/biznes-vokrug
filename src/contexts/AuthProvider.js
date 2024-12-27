"use client";

import { createContext, useState, useEffect, useContext } from "react";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    // Читаем из localStorage при первом рендере (если есть)
    if (typeof window !== "undefined") {
      const userData = localStorage.getItem("user_data");
      return userData ? JSON.parse(userData) : null;
    }
    return null;
  });

  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    // Отмечаем, что инициализация завершена
    setInitialized(true);
  }, []);

  const login = (userData) => {
    // Сохраняем пользователя
    localStorage.setItem("user_data", JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    // Убираем пользователя
    localStorage.removeItem("user_data");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, initialized }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
