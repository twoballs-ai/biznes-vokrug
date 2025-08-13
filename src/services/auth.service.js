import axios from "axios";
import { apiUrl } from "../shared/config/index";
import api from "./api";
import { toast } from 'react-toastify';
// const API_URL = "http://localhost:8080/api/auth/";
import TokenService from "./token.service";

const Register = async (data) => {
  console.log(data)
  return await api
    .post(apiUrl + "register/",
      data
      // ,{ headers: { Authorization: `Token da0d550bcc813a1b1cc6b905551cb11e3bf95046` } }
    )
}

const login = async (payload) => {
  try {
    const response = await api.post(apiUrl + "login", payload, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });
    const { access_token, refresh_token, user } = response.data;

    TokenService.updateLocalAccessToken(access_token);
    TokenService.updateLocalRefreshToken(refresh_token);
    localStorage.setItem("user_data", JSON.stringify(user));

    return response;
  } catch (error) {
    toast.error("Ошибка при входе!");
    console.error("Ошибка при входе:", error);
    throw error;  // Пробрасываем ошибку, чтобы можно было обработать на фронте
  }
};

const refreshToken = async () => {
  const refresh_token = TokenService.getLocalRefreshToken();
  try {
    const response = await api.post(
      apiUrl + "refresh",
      { refresh_token }, // передаём объект с ключом refresh_token
      {
        headers: { "Content-Type": "application/json" },
      }
    );
    return response.data;
  } catch (error) {
    toast.error("Error refreshing token!");
    console.error("Error refreshing token:", error);
    throw error;
  }
};


const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem("user_data"));
};


const AuthService = {
  Register,
  login,
  getCurrentUser,
  refreshToken,

};

export default AuthService;