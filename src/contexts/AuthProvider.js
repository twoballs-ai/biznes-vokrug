import { useDispatch, useSelector } from 'react-redux';
import { login, logout } from '@/features/authSlice';
import { useEffect } from 'react';
import TokenService from '@/services/token.service';
import AuthService from '@/services/auth.service';
import { useRouter } from 'next/navigation';

export const AuthProvider = ({ children }) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { user, accessToken, refreshToken, isAuthenticated } = useSelector(state => state.auth);

  useEffect(() => {
    if (accessToken && !user) {
      const storedUser = JSON.parse(localStorage.getItem("user_data"));
      if (storedUser) {
        dispatch(login({ user: storedUser, accessToken, refreshToken }));
      }
    }
  }, [accessToken, refreshToken]);

  const login = async (payload) => {
    try {
      const response = await AuthService.login(payload);
      const { access_token, refresh_token, user } = response.data;

      dispatch(login({ user, accessToken: access_token, refreshToken: refresh_token }));
      router.push('/profile');
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const logout = () => {
    dispatch(logout());
    router.push('/');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
