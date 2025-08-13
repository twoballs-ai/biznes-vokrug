import { createSlice } from '@reduxjs/toolkit';
import TokenService from '@/services/token.service';

// Начальное состояние
const initialState = {
  user: JSON.parse(localStorage.getItem("user_data")) || null,
  accessToken: TokenService.getLocalAccessToken() || null,
  refreshToken: TokenService.getLocalRefreshToken() || null,
  isAuthenticated: !!localStorage.getItem("user_data"),
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action) => {
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.isAuthenticated = true;

      // Сохраняем данные в localStorage
      localStorage.setItem("user_data", JSON.stringify(action.payload.user));
      TokenService.updateLocalAccessToken(action.payload.accessToken);
      TokenService.updateLocalRefreshToken(action.payload.refreshToken);
    },
    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.isAuthenticated = false;

      // Убираем данные из localStorage
      localStorage.removeItem("user_data");
      TokenService.removeTokens();
    },
    updateTokens: (state, action) => {
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;

      TokenService.updateLocalAccessToken(action.payload.accessToken);
      TokenService.updateLocalRefreshToken(action.payload.refreshToken);
    },
  },
});

export const { login, logout, updateTokens } = authSlice.actions;

export default authSlice.reducer;
