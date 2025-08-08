import { apiUrl } from "../shared/config/index";
import api from "./api";

// Пользовательские сервисы
const getUserDetails = async () => {
    return await api.get(apiUrl + "user/details");
};
const updateUserInfo = async (data) => {
  return await api.put(apiUrl + "user/update", data);
};



// Сервисы для услуг

const getServiceById = async (id) => {
    return await api.get(apiUrl + `category-products/service/${id}`);
};


const deleteService = async (id) => {
    return await api.delete(apiUrl + `category-products/services/${id}`);
};



const getProductById = async (id) => {
    return await api.get(apiUrl + `category-products/product/${id}`);
};

const deleteProduct = async (id) => {
    return await api.delete(apiUrl + `category-products/products/${id}`);
};

const getProductCategories= async () => {
    return await api.get(apiUrl + "category-products/product-categories-dropdown");
};
const getServiceCategories= async () => {
    return await api.get(apiUrl + "category-products/service-categories-dropdown");
};
const getServicesWithPagination = async (skip = 0, limit = 100) => {
    return await api.get(apiUrl + "category-products/services", {
        params: { skip, limit },
    });
};

const getProductsWithPagination = async (skip = 0, limit = 100) => {
    return await api.get(apiUrl + "category-products/products", {
        params: { skip, limit },
    });
};
const getNewsWithPagination = async (skip = 0, limit = 50) => {
    return await api.get(apiUrl + "news/", {
        params: { skip, limit },
    });
};
const getArticlesWithPagination = async (skip = 0, limit = 50) => {
    return await api.get(apiUrl + "articles/", {
        params: { skip, limit },
    });
};
const getNewsById = async (id) => {
    return await api.get(apiUrl + `news/${id}`);
};

const getArticleById = async (id) => {
    return await api.get(apiUrl + `articles/${id}`);
};
const getNewsCategories = async () => {
    return await api.get(apiUrl + `categories`);
};
const createPostBlog = async (data) => {
    return await api.post(apiUrl + "blogs/create", data, {
        headers: { "Content-Type": "multipart/form-data" }
    });
};
const updatePostBlog = async (blogId, data) => {
    return await api.put(`${apiUrl}blogs/${blogId}`, data, {
        headers: { "Content-Type": "multipart/form-data" }
    });
};
const getWidgetsCrypto = async () => {
    return await api.get(apiUrl + "crypto/");
};
const getWidgetCurrency = async () => {
    return await api.get(apiUrl + "currency/");
};
// Экспорт всех методов
const UserService = {
    getUserDetails,
    updateUserInfo,
    getServiceById,
    deleteService,
    getProductById,
    deleteProduct,
    getProductCategories,
    getServiceCategories,
    getServicesWithPagination,
    getProductsWithPagination,
    getNewsWithPagination,
    getArticlesWithPagination,
    getNewsById,
    getArticleById,
    createPostBlog,
    getNewsCategories,
    updatePostBlog,
    getWidgetsCrypto,
    getWidgetCurrency
};

export default UserService;
