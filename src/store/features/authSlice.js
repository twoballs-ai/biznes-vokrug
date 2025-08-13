'use client';

import { createSlice } from '@reduxjs/toolkit';
import TokenService from '@/services/token.service';

const isBrowser = typeof window !== 'undefined';

const initialState = {
  user: isBrowser ? JSON.parse(localStorage.getItem("user_data")) || null : null,
  accessToken: isBrowser ? TokenService.getLocalAccessToken() || null : null,
  refreshToken: isBrowser ? TokenService.getLocalRefreshToken() || null : null,
  isAuthenticated: isBrowser ? !!localStorage.getItem("user_data") : false,
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

      if (isBrowser) {
        localStorage.setItem("user_data", JSON.stringify(action.payload.user));
        TokenService.updateLocalAccessToken(action.payload.accessToken);
        TokenService.updateLocalRefreshToken(action.payload.refreshToken);
      }
    },
    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.isAuthenticated = false;

      if (isBrowser) {
        localStorage.removeItem("user_data");
        TokenService.removeTokens();
      }
    },
    updateTokens: (state, action) => {
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;

      if (isBrowser) {
        TokenService.updateLocalAccessToken(action.payload.accessToken);
        TokenService.updateLocalRefreshToken(action.payload.refreshToken);
      }
    },
  },
});

export const { login, logout, updateTokens } = authSlice.actions;
export default authSlice.reducer;
