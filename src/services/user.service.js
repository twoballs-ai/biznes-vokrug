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

const getServiceById = async (id) => {
    return await api.get(apiUrl + `services/${id}`);
};


const deleteService = async (id) => {
    return await api.delete(apiUrl + `category-products/services/${id}`);
};


const createProductForIp = async (data) => {
    console.log(data)
    return await api.post(apiUrl + "category-products/products/entrepreneur", data, {
      headers: { "Content-Type": "multipart/form-data" }
    });
  };
  
  const updateProductIp = async (id, data) => {
    return await api.put(apiUrl + `category-products/products/entrepreneur/${id}`, data, {
      headers: { "Content-Type": "multipart/form-data" }
    });
  };
  const createServiceForIp = async (data) => {
    console.log(data);
    return await api.post(apiUrl + "category-products/services/entrepreneur", data, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  };
  const updateServiceIp = async (id, data) => {
    return await api.put(apiUrl + `category-products/services/entrepreneur/${id}`, data,{
        headers: { "Content-Type": "multipart/form-data" }
      });
};
const createProductForOrg = async (data) => {
    console.log(data);
    return await api.post(apiUrl + "category-products/products/organization", data, {
        headers: { "Content-Type": "multipart/form-data" }
    });
};

const updateProductOrg = async (id, data) => {
    return await api.put(apiUrl + `category-products/products/organization/${id}`, data, {
        headers: { "Content-Type": "multipart/form-data" }
    });
};

const createServiceForOrg = async (data) => {
    console.log(data);
    return await api.post(apiUrl + "category-products/services/organization", data, {
        headers: { "Content-Type": "multipart/form-data" }
    });
};

const updateServiceOrg = async (id, data) => {
    return await api.put(apiUrl + `category-products/services/organization/${id}`, data, {
        headers: { "Content-Type": "multipart/form-data" }
    });
};

const getProductById = async (id) => {
    return await api.get(apiUrl + `products/${id}`);
};

const deleteProduct = async (id) => {
    return await api.delete(apiUrl + `category-products/products/${id}`);
};
const getProductByUserIP = async () => {
    return await api.get(apiUrl + "category-products/entrepreneur/products");
};

const getServiceByUserIP= async () => {
    return await api.get(apiUrl + "category-products/entrepreneur/services");
};
const getServiceByUserOrg = async (organizationId) => {
    return await api.get(`${apiUrl}category-products/organization/services?organization_id=${organizationId}`);
};

const getProductByUserOrg = async (organizationId) => {
    return await api.get(`${apiUrl}category-products/organization/products?organization_id=${organizationId}`);
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
<<<<<<< HEAD

const updatePostBlog = async (blogId, data) => {
    return await api.put(`${apiUrl}blogs/update/${blogId}`, data, {
=======
const updatePostBlog = async (blogId, data) => {
    return await api.put(`${apiUrl}blogs/${blogId}`, data, {
>>>>>>> origin/main
        headers: { "Content-Type": "multipart/form-data" }
    });
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
    getServiceById,
    deleteService,
    createProductForIp,
    createServiceForIp,
    createProductForOrg,
    createServiceForOrg,
    getProductById,
    updateProductIp,
    updateServiceIp,
    deleteProduct,
    getProductByUserIP,
    getServiceByUserIP,
    getServiceByUserOrg,
    getProductByUserOrg,
    getProductCategories,
    getServiceCategories,
    updateProductOrg,
    updateServiceOrg,
    getServicesWithPagination,
    getProductsWithPagination,
    getNewsWithPagination,
    getArticlesWithPagination,
    getNewsById,
    getArticleById,
    createPostBlog,
    getNewsCategories,
<<<<<<< HEAD
    updatePostBlog,
=======
    updatePostBlog
>>>>>>> origin/main
};

export default UserService;
