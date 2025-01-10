import { apiUrl } from "../shared/config/index";
import api from "./api";

// Пользовательские сервисы
const getUserDetails = async () => {
    return await api.get(apiUrl + "user/details");
};
const updateUserInfo = async (data) => {
  return await api.put(apiUrl + "user/update", data);
};
// Сервисы для организаций
const getOrganizations = async () => {
    return await api.get(apiUrl + "organizations/");
};

const createOrganization = async (data) => {
    return await api.post(apiUrl + "organizations/", data);
};

const updateOrganization = async (id, data) => {
    return await api.put(apiUrl + `organizations/${id}`, data);
};

const deleteOrganization = async (id) => {
    return await api.delete(apiUrl + `organizations/${id}`);
};

const getOrganizationById = async (id) => {
    return await api.get(apiUrl + `organization/${id}`);
};

const getOrganizationsByUser = async () => {
    return await api.get(apiUrl + `organizations/me`);
};

// Сервисы для индивидуальных предпринимателей
const getIndividualEntrepreneursByUser = async () => {
    return await api.get(apiUrl + "individual-entrepreneur/me");
};

const createIndividualEntrepreneur = async (data) => {
    return await api.post(apiUrl + "individual-entrepreneurs/", data);
};

const updateIndividualEntrepreneur = async (data) => {
    return await api.put(apiUrl + `individual-entrepreneurs`, data);
};

const deleteIndividualEntrepreneur = async (id) => {
    return await api.delete(apiUrl + `individual-entrepreneurs/${id}`);
};

const getIndividualEntrepreneurById = async (id) => {
    return await api.get(apiUrl + `individual-entrepreneurs/${id}`);
};

// Сервисы для услуг
const createService = async (data) => {
    return await api.post(apiUrl + "services/", data);
};

const getServiceById = async (id) => {
    return await api.get(apiUrl + `services/${id}`);
};

const updateService = async (id, data) => {
    return await api.put(apiUrl + `services/${id}`, data);
};

const deleteService = async (id) => {
    return await api.delete(apiUrl + `services/${id}`);
};

// Сервисы для продуктов
const createProduct = async (data) => {
    return await api.post(apiUrl + "products/", data);
};

const getProductById = async (id) => {
    return await api.get(apiUrl + `products/${id}`);
};

const updateProduct = async (id, data) => {
    return await api.put(apiUrl + `products/${id}`, data);
};

const deleteProduct = async (id) => {
    return await api.delete(apiUrl + `products/${id}`);
};
const getProductByUser = async () => {
    return await api.get(apiUrl + "category-products/products_by_user/");
};
const getServiceByUser= async () => {
    return await api.get(apiUrl + "category-products/services_by_user");
};
const getProductCategories= async () => {
    return await api.get(apiUrl + "category-products/product-categories-dropdown");
};

// Экспорт всех методов
const UserService = {
    getUserDetails,
    updateUserInfo,
    getOrganizations,
    createOrganization,
    updateOrganization,
    deleteOrganization,
    getOrganizationById,
    getOrganizationsByUser,
    getIndividualEntrepreneursByUser,
    createIndividualEntrepreneur,
    updateIndividualEntrepreneur,
    deleteIndividualEntrepreneur,
    getIndividualEntrepreneurById,
    createService,
    getServiceById,
    updateService,
    deleteService,
    createProduct,
    getProductById,
    updateProduct,
    deleteProduct,
    getProductByUser,
    getServiceByUser,
    getProductCategories
};

export default UserService;
