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
  const response = await api.post(apiUrl + "login", payload, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  });
  return response;
};


const refreshToken = async () => {
  const refresh_token = TokenService.getLocalRefreshToken();
  const formData = new URLSearchParams();
  formData.append('refresh_token', refresh_token);
  try {
    const response = await axios.post(apiUrl + "v1/user/token/refresh/", formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    // if (jwtDecode(refreshToken).exp < currentTime / 1000) {
    //   logout();
    //   return Promise.reject("Token expired");
    // }
    return response.data;
  } catch (error) {
    toast.error("Error refreshing token!");
    console.error("Error refreshing token:", error);
    throw error;
  }
};


const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem("user"));
};



const AuthService = {
  Register,
  login,
  getCurrentUser,
  refreshToken,

};

export default AuthService;