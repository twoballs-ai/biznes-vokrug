'use client';
import { createContext, useState, useEffect, useContext } from 'react';
import AuthService from '@/services/auth.service';
import TokenService from '@/services/token.service';
import { useRouter } from 'next/navigation';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authenticated, setAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const token = TokenService.getLocalAccessToken();
    if (token) {
      const userData = JSON.parse(localStorage.getItem("user_data")); // Храним данные пользователя локально
      if (userData) {
        setUser(userData);
        setAuthenticated(true);
      }
    }
  }, []);

  const login = async (payload) => {
    try {
      const response = await AuthService.login(payload);
      const { access_token, refresh_token, user} = response.data;

      TokenService.updateLocalAccessToken(access_token);
      TokenService.updateLocalRefreshToken(refresh_token);
      localStorage.setItem("user_data", JSON.stringify(user)); // Сохраняем объект user
      setUser(user);
      setAuthenticated(true);

      router.push('/profile');
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const logout = () => {
    TokenService.removeTokens();
    localStorage.removeItem("user_data");
    setUser(null);
    setAuthenticated(false);
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ authenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
