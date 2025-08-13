import axios from 'axios';
import TokenService from './token.service';
import AuthService from './auth.service';
import { updateTokens } from '@/features/authSlice';  // Путь к действиям
import { store } from '@/store';  // Путь к store


const instance = axios.create({
  headers: {
    'Content-Type': 'application/json',
  },
});

// Интерцептор для запроса
instance.interceptors.request.use(
  (config) => {
    const { accessToken } = store.getState().auth;
    if (accessToken) {
      config.headers['Authorization'] = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Интерцептор для ответа
instance.interceptors.response.use(
  (res) => res,
  async (err) => {
    const originalConfig = err.config;

    if (err.response && err.response.status === 401 && !originalConfig._retry) {
      originalConfig._retry = true;

      try {
        const rs = await AuthService.refreshToken();
        const { access_token, refresh_token } = rs.data;

        // Обновляем токены в Redux
        store.dispatch(updateTokens({ accessToken: access_token, refreshToken: refresh_token }));

        // Обновляем заголовок Authorization в axios
        instance.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;

        // Повторяем запрос
        return instance(originalConfig);
      } catch (_error) {
        console.error('Ошибка при обновлении токена');
        TokenService.removeTokens();
        store.dispatch(logout());
        return Promise.reject(_error);
      }
    }

    return Promise.reject(err);
  }
);

export default instance;
