"use client";

import { useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import UserService from "../../../services/user.service";
import CustomModal from "../../../components/CustomModal";

export default function EntrepreneursPage() {
  const [entrepreneurs, setEntrepreneurs] = useState([]);
  const [selectedEntrepreneur, setSelectedEntrepreneur] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const fetchEntrepreneursByUser = async () => {
    setLoading(true);
    try {
      const response = await UserService.getIndividualEntrepreneursByUser();
      if (response.data.status) {
        setEntrepreneurs(response.data.data);
        setMessage("");
      } else {
        setEntrepreneurs([]);
        setMessage(response.data.message || "ИП не найдены.");
      }
    } catch (error) {
      console.error("Ошибка при загрузке ИП:", error);
      setMessage("Произошла ошибка при загрузке данных.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEntrepreneursByUser();
  }, []);

  const validationSchema = Yup.object({
    name: Yup.string().required("Название обязательно"),
    ogrnip: Yup.string()
      .required("ОГРНИП обязателен")
      .matches(/^\d{15}$/, "ОГРНИП должен содержать 15 цифр"),
    inn: Yup.string()
      .required("ИНН обязателен")
      .matches(/^\d{12}$/, "ИНН должен содержать 12 цифр"),
    phone: Yup.string().required("Телефон обязателен"),
    email: Yup.string().email("Некорректный email"),
    address: Yup.string().required("Адрес обязателен"),
  });

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      if (isEditMode) {
        await UserService.updateIndividualEntrepreneur(
          selectedEntrepreneur.id,
          values
        );
        alert("ИП успешно обновлен");
      } else {
        await UserService.createIndividualEntrepreneur(values);
        alert("ИП успешно создан");
      }
      setIsModalOpen(false);
      fetchEntrepreneursByUser();
      resetForm();
    } catch (error) {
      console.error("Ошибка при сохранении ИП:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (entrepreneur) => {
    setSelectedEntrepreneur(entrepreneur);
    setIsEditMode(true);
    setIsModalOpen(true);
  };

  const handleCreate = () => {
    setSelectedEntrepreneur(null);
    setIsEditMode(false);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!confirm("Вы уверены, что хотите удалить ИП?")) return;

    try {
      await UserService.deleteIndividualEntrepreneur(id);
      alert("ИП успешно удален");
      fetchEntrepreneursByUser();
    } catch (error) {
      console.error("Ошибка при удалении ИП:", error);
    }
  };

  if (loading) {
    return <div>Загрузка...</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Мои индивидуальные предприниматели</h1>

      {entrepreneurs.length > 0 ? (
        entrepreneurs.map((entrepreneur) => (
          <div key={entrepreneur.id} className="border p-4 mb-4 rounded">
            <h2 className="text-xl font-bold">{entrepreneur.name}</h2>
            <p>
              <strong>ОГРНИП:</strong> {entrepreneur.ogrnip}
            </p>
            <p>
              <strong>ИНН:</strong> {entrepreneur.inn}
            </p>
            <p>
              <strong>Телефон:</strong> {entrepreneur.phone || "Не указан"}
            </p>
            <div className="flex space-x-4 mt-2">
              <button
                onClick={() => handleEdit(entrepreneur)}
                className="bg-yellow-500 text-white py-1 px-4 rounded"
              >
                Редактировать
              </button>
              <button
                onClick={() => handleDelete(entrepreneur.id)}
                className="bg-red-500 text-white py-1 px-4 rounded"
              >
                Удалить
              </button>
            </div>
          </div>
        ))
      ) : (
        <p>ИП отсутствуют</p>
      )}

      <button
        onClick={handleCreate}
        className="mt-4 bg-green-600 text-white py-2 px-4 rounded"
      >
        Добавить ИП
      </button>

      <CustomModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={isEditMode ? "Редактировать ИП" : "Создать ИП"}
      >
        <Formik
          initialValues={{
            name: selectedEntrepreneur?.name || "",
            ogrnip: selectedEntrepreneur?.ogrnip || "",
            inn: selectedEntrepreneur?.inn || "",
            phone: selectedEntrepreneur?.phone || "",
            email: selectedEntrepreneur?.email || "",
            address: selectedEntrepreneur?.address || "",
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form>
              {[
                { name: "name", placeholder: "Название", required: true },
                { name: "ogrnip", placeholder: "ОГРНИП", required: true },
                { name: "inn", placeholder: "ИНН", required: true },
                { name: "phone", placeholder: "Телефон", required: true },
                { name: "email", placeholder: "Email", required: false },
                { name: "address", placeholder: "Адрес", required: true },
              ].map((field) => (
                <div key={field.name} className="mb-3">
                  <label className="block mb-1 font-medium">
                    {field.placeholder}{" "}
                    {field.required && <span className="text-red-500">*</span>}
                  </label>
                  <Field
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
