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

const getProductCategories = async () => {
  return await api.get(
    apiUrl + "category-products/product-categories-dropdown"
  );
};
const getServiceCategories = async () => {
  return await api.get(
    apiUrl + "category-products/service-categories-dropdown"
  );
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
    headers: { "Content-Type": "multipart/form-data" },
  });
};
const updatePostBlog = async (blogId, data) => {
  return await api.put(`${apiUrl}blogs/${blogId}`, data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};
const getWidgetsCrypto = async () => {
  return await api.get(apiUrl + "crypto/");
};
const getWidgetCurrency = async () => {
  return await api.get(apiUrl + "currency/");
};
const createProductForUser = async (formData) =>
  api.post(apiUrl + "category-products/products/user", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

const updateProductForUser = async (id, formData) =>
  api.put(apiUrl + `category-products/products/user/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

const createServiceForUser = async (formData) =>
  api.post(apiUrl + "category-products/services/user", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

const updateServiceForUser = async (id, formData) =>
  api.put(apiUrl + `category-products/services/user/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  const addAddress = async (data) => {
  return await api.post(apiUrl + "user/addresses", data);
};
const updateAddress = async (id, data) => {
  return await api.put(apiUrl + `user/addresses/${id}`, data);
};

const deleteAddress = async (id) => {
  return await api.delete(apiUrl + `user/addresses/${id}`);
};
const listAddresses = async () => {
  return await api.get(apiUrl + "user/addresses");
};
const suggestRegion = async (query) => {
  if (!query || query.length < 2) return { data: [] };
  return await api.get(apiUrl + "dadata/region", { params: { q: query } });
};

const suggestCity = async (query, region) => {
  if (!query || query.length < 2) return { data: [] };
  const params = { q: query };
  if (region) params.region = region;
  return await api.get(apiUrl + "dadata/city", { params });
};

const suggestStreet = async (query, region, city) => {
  if (!query || query.length < 2) return { data: [] };
  const params = { q: query };
  if (region) params.region = region;
  if (city) params.city = city;
  return await api.get(apiUrl + "dadata/street", { params });
};
const getMyProducts = async () => {
  return await api.get(apiUrl + "category-products/user/products");
};

const getMyServices = async () => {
  return await api.get(apiUrl + "category-products/user/services");
};
// ----------- Избранное -----------
const checkIsFavorite = async (itemType, itemId, includeItem = false) =>
  api.get(apiUrl + `category-products/favorites/${itemType}/${itemId}`, { params: { include_item: includeItem } });

const addFavorite = async (itemType, itemId) =>
  api.post(apiUrl + `category-products/favorites/${itemType}/${itemId}`);

const removeFavorite = async (itemType, itemId) =>
  api.delete(apiUrl + `category-products/favorites/${itemType}/${itemId}`);

const getFavorites = async () =>
  api.get(apiUrl + "category-products/favorites");

const getUserFavoritesFlat = async () =>
  api.get(apiUrl + "category-products/favorites/user");
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
  getWidgetCurrency,
  createProductForUser,
  updateProductForUser,
  createServiceForUser,
  updateServiceForUser,
    addAddress,
  listAddresses,
    suggestRegion,
  suggestCity,
  suggestStreet,
    suggestCity,
  suggestStreet,
  updateAddress,
  deleteAddress,
  getMyProducts,
  getMyServices,
    checkIsFavorite,
  addFavorite,
  removeFavorite,
  getFavorites,
  getUserFavoritesFlat,
};

export default UserService;
