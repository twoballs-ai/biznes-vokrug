'use client';
import { createContext, useState, useEffect, useContext } from 'react';
import AuthService from '@/services/auth.service';
import TokenService from '@/services/token.service';
import { useRouter } from 'next/navigation';

export const AuthContext = createContext();

function getInitialUserState() {
  if (typeof window !== 'undefined') {
    const userData = localStorage.getItem("user_data");
    return userData ? JSON.parse(userData) : null;
  }
  return null;
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => getInitialUserState());
  const [authenticated, setAuthenticated] = useState(() => !!user);
  const router = useRouter();

  useEffect(() => {
    const token = TokenService.getLocalAccessToken();
    if (token && !user) {
      const userData = localStorage.getItem("user_data");
      if (userData) {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        setAuthenticated(true);
      }
    }
  }, []); // Убираем зависимость от `user`

  const login = async (payload) => {
    try {
      const response = await AuthService.login(payload);
      const { access_token, refresh_token, user } = response.data;
  
      TokenService.updateLocalAccessToken(access_token);
      TokenService.updateLocalRefreshToken(refresh_token);
      localStorage.setItem("user_data", JSON.stringify(user));
      setUser(user); // Обновляем пользователя
      setAuthenticated(true); // Ставим authenticated в true
  
      router.push('/profile');
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };
  
  const logout = () => {
    TokenService.removeTokens();
    localStorage.removeItem("user_data");
    setUser(null); // Сбрасываем пользователя
    setAuthenticated(false); // Ставим authenticated в false
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ authenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
