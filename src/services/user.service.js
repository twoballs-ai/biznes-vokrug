import { apiUrl } from "../shared/config/index";
import api from "./api";

// Пользовательские сервисы
const getUserDetails = async () => {
    return await api.get(apiUrl + "user/details");
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
    return await api.get(apiUrl + "individual-entrepreneurs/me");
};

const createIndividualEntrepreneur = async (data) => {
    return await api.post(apiUrl + "individual-entrepreneurs/", data);
};

const updateIndividualEntrepreneur = async (id, data) => {
    return await api.put(apiUrl + `individual-entrepreneurs/${id}`, data);
};

const deleteIndividualEntrepreneur = async (id) => {
    return await api.delete(apiUrl + `individual-entrepreneurs/${id}`);
};

const getIndividualEntrepreneurById = async (id) => {
    return await api.get(apiUrl + `individual-entrepreneurs/${id}`);
};

// Экспорт всех методов
const UserService = {
    getUserDetails,
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
};

export default UserService;
