"use client";

import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import CustomModal from "../../CustomModal";
import UserService from "../../../services/user.service";
import { toast } from "react-toastify";

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
  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      if (entrepreneur) {
        await UserService.updateIndividualEntrepreneur(values);
        toast.success("ИП успешно обновлён");
      } else {
        await UserService.createIndividualEntrepreneur(values);
        toast.success("ИП успешно создан");
      }
      onClose();
      onSaved();
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
              { name: "name", placeholder: "Название", required: true },
              { name: "ogrnip", placeholder: "ОГРНИП", required: true },
              { name: "inn", placeholder: "ИНН", required: true },
              { name: "phone", placeholder: "Телефон", required: true },
            ].map((field) => (
              <div key={field.name} className="mb-3">
                <label className="block mb-1 font-medium">
                  {field.placeholder}
                  {field.required && <span className="text-red-500"> *</span>}
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
