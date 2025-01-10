"use client";

import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import CustomModal from "../../CustomModal";
import UserService from "../../../services/user.service";
import { toast } from "react-toastify";

const orgValidationSchema = Yup.object({
  name: Yup.string().required("Название обязательно"),
  address: Yup.string().required("Адрес обязателен"),
  inn: Yup.string().required("ИНН обязателен").matches(/^\d{10}$/, "ИНН должен содержать 10 цифр"),
  ogrn: Yup.string().required("ОГРН обязателен").matches(/^\d{13}$/, "ОГРН должен содержать 13 цифр"),
  phone: Yup.string().required("Телефон обязателен"),
  website: Yup.string().url("Некорректный URL"),
  email: Yup.string().email("Некорректный email"),
});

export default function OrganizationModal({ isOpen, onClose, organization, onSaved }) {
  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      if (organization) {
        // Редактирование
        await UserService.updateOrganization(organization.id, values);
        toast.success("Организация успешно обновлена");
      } else {
        // Создание
        await UserService.createOrganization(values);
        toast.success("Организация успешно создана");
      }
      onClose();
      onSaved();
      resetForm();
    } catch (error) {
      console.error("Ошибка при сохранении организации:", error);
      toast.error("Ошибка при сохранении организации.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <CustomModal
      isOpen={isOpen}
      onClose={onClose}
      title={organization ? "Редактировать организацию" : "Создать организацию"}
    >
      <Formik
        initialValues={{
          name: organization?.name || "",
          description: organization?.description || "",
          address: organization?.address || "",
          inn: organization?.inn || "",
          ogrn: organization?.ogrn || "",
          phone: organization?.phone || "",
          website: organization?.website || "",
          email: organization?.email || "",
        }}
        validationSchema={orgValidationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form>
            {[
              { name: "name", placeholder: "Название", required: true },
              { name: "description", placeholder: "Описание", required: false },
              { name: "address", placeholder: "Адрес", required: true },
              { name: "inn", placeholder: "ИНН", required: true },
              { name: "ogrn", placeholder: "ОГРН", required: true },
              { name: "phone", placeholder: "Телефон", required: true },
              { name: "website", placeholder: "Веб-сайт", required: false },
              { name: "email", placeholder: "Email", required: false },
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
