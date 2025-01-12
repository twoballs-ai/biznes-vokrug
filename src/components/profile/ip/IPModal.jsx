"use client";

import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import CustomModal from "../../CustomModal";
import UserService from "../../../services/user.service";
import { toast } from "react-toastify";

// Схема валидации
const validationSchema = Yup.object({
  name: Yup.string().required("Название обязательно"),
  ogrnip: Yup.string()
    .required("ОГРНИП обязателен")
    .matches(/^\d{15}$/, "ОГРНИП должен содержать 15 цифр"),
  inn: Yup.string()
    .required("ИНН обязателен")
    .matches(/^\d{12}$/, "ИНН должен содержать 12 цифр"),
  phone: Yup.string().required("Телефон обязателен"),
});

export default function IPModal({ isOpen, onClose, entrepreneur, onSaved }) {
  // Обработка сабмита формы
  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      if (entrepreneur) {
        // Если entrepreneur существует, значит редактирование
        await UserService.updateIndividualEntrepreneur(values);
        toast.success("ИП успешно обновлён");
      } else {
        // Если entrepreneur == null, значит создание
        await UserService.createIndividualEntrepreneur(values);
        toast.success("ИП успешно создан");
      }
      onClose();
      onSaved();     // Сообщаем родителю о сохранении
      resetForm();
    } catch (error) {
      console.error("Ошибка при сохранении ИП:", error);
      toast.error("Ошибка при сохранении ИП.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <CustomModal
      isOpen={isOpen}
      onClose={onClose}
      title={entrepreneur ? "Редактировать ИП" : "Создать ИП"}
    >
      <Formik
        initialValues={{
          name: entrepreneur?.name || "",
          ogrnip: entrepreneur?.ogrnip || "",
          inn: entrepreneur?.inn || "",
          phone: entrepreneur?.phone || "",
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form>
            {[
              { name: "name", label: "Название", required: true },
              { name: "ogrnip", label: "ОГРНИП", required: true },
              { name: "inn", label: "ИНН", required: true },
              { name: "phone", label: "Телефон", required: true },
            ].map((field) => (
              <div key={field.name} className="mb-3">
                <label className="block mb-1 font-medium">
                  {field.label}
                  {field.required && <span className="text-red-500"> *</span>}
                </label>
                <Field
                  name={field.name}
                  placeholder={field.label}
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
                onClick={onClose}
                className="bg-gray-500 text-white px-4 py-2 rounded"
              >
                Отмена
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-green-500 text-white px-4 py-2 rounded"
              >
                {isSubmitting ? "Сохранение..." : "Сохранить"}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </CustomModal>
  );
}
