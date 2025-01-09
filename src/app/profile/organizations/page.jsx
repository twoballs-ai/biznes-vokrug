"use client";

import { useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import UserService from "../../../services/user.service";
import CustomModal from "../../../components/CustomModal";

export default function OrganizationsPage() {
  const [organizations, setOrganizations] = useState([]);
  const [selectedOrg, setSelectedOrg] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const fetchOrganizationsByUser = async () => {
    setLoading(true);
    try {
      const response = await UserService.getOrganizationsByUser();
      if (response.data.status) {
        setOrganizations(response.data.data);
        setMessage("");
      } else {
        setOrganizations([]);
        setMessage(response.data.message || "Организации не найдены.");
      }
    } catch (error) {
      console.error("Ошибка при загрузке организаций:", error);
      setMessage("Произошла ошибка при загрузке данных.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrganizationsByUser();
  }, []);

  const validationSchema = Yup.object({
    name: Yup.string().required("Название обязательно"),
    address: Yup.string().required("Адрес обязателен"),
    inn: Yup.string()
      .required("ИНН обязателен")
      .matches(/^\d{10}$/, "ИНН должен содержать 10 цифр"),
    ogrn: Yup.string()
      .required("ОГРН обязателен")
      .matches(/^\d{13}$/, "ОГРН должен содержать 13 цифр"),
    phone: Yup.string().required("Телефон обязателен"),
    email: Yup.string().email("Некорректный email"),
    website: Yup.string().url("Некорректный URL"),
  });

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      if (isEditMode) {
        await UserService.updateOrganization(selectedOrg.id, values);
        alert("Организация успешно обновлена");
      } else {
        await UserService.createOrganization(values);
        alert("Организация успешно создана");
      }
      setIsModalOpen(false);
      fetchOrganizationsByUser();
      resetForm();
    } catch (error) {
      console.error("Ошибка при сохранении организации:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (org) => {
    setSelectedOrg(org);
    setIsEditMode(true);
    setIsModalOpen(true);
  };

  const handleCreate = () => {
    setSelectedOrg(null);
    setIsEditMode(false);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!confirm("Вы уверены, что хотите удалить организацию?")) return;

    try {
      await UserService.deleteOrganization(id);
      alert("Организация успешно удалена");
      fetchOrganizationsByUser();
    } catch (error) {
      console.error("Ошибка при удалении организации:", error);
    }
  };

  if (loading) {
    return <div>Загрузка...</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Мои организации</h1>

      {/* Список организаций */}
      {organizations.length > 0 ? (
        organizations.map((org) => (
          <div key={org.id} className="border p-4 mb-4 rounded">
            <h2 className="text-xl font-bold">{org.name}</h2>
            <p>{org.description || "Описание отсутствует"}</p>
            <div className="flex space-x-4 mt-2">
              <button
                onClick={() => handleEdit(org)}
                className="bg-yellow-500 text-white py-1 px-4 rounded"
              >
                Редактировать
              </button>
              <button
                onClick={() => handleDelete(org.id)}
                className="bg-red-500 text-white py-1 px-4 rounded"
              >
                Удалить
              </button>
            </div>
          </div>
        ))
      ) : (
        <p>Организации отсутствуют</p>
      )}

      <button
        onClick={handleCreate}
        className="mt-4 bg-green-600 text-white py-2 px-4 rounded"
      >
        Добавить организацию
      </button>

      {/* Модальное окно для создания/редактирования */}
      <CustomModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={isEditMode ? "Редактировать организацию" : "Создать организацию"}
      >
        <Formik
          initialValues={{
            name: selectedOrg?.name || "",
            description: selectedOrg?.description || "",
            address: selectedOrg?.address || "",
            inn: selectedOrg?.inn || "",
            ogrn: selectedOrg?.ogrn || "",
            phone: selectedOrg?.phone || "",
            website: selectedOrg?.website || "",
            email: selectedOrg?.email || "",
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form>
              {[
                { name: "name", placeholder: "Название", type: "text", required: true },
                { name: "description", placeholder: "Описание", type: "text", required: false },
                { name: "address", placeholder: "Адрес", type: "text", required: true },
                { name: "inn", placeholder: "ИНН", type: "text", required: true },
                { name: "ogrn", placeholder: "ОГРН", type: "text", required: true },
                { name: "phone", placeholder: "Телефон", type: "text", required: true },
                { name: "website", placeholder: "Веб-сайт", type: "text", required: false },
                { name: "email", placeholder: "Email", type: "email", required: false },
              ].map((field) => (
                <div key={field.name} className="mb-3">
                  <label className="block mb-1 font-medium">
                    {field.placeholder}{" "}
                    {field.required && <span className="text-red-500">*</span>}
                  </label>
                  <Field
                    type={field.type}
                    name={field.name}
                    placeholder={field.placeholder}
                    className="w-full p-2 border rounded"
                  />
                  <ErrorMessage
                    name={field.name}
                    component="p"
                    className="text-red-500 text-sm"
                  />
                </div>
              ))}

              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="bg-gray-500 text-white py-2 px-4 rounded"
                >
                  Отмена
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-green-500 text-white py-2 px-4 rounded"
                >
                  {isSubmitting ? "Сохранение..." : "Сохранить"}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </CustomModal>
    </div>
  );
}
