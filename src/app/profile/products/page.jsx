"use client";

import { useState, useEffect } from "react";
import UserService from "../../../services/user.service";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [productData, setProductData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
  });

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await UserService.getProductsByUser(); // Предположим, вы реализовали этот метод
      if (response.data.status) {
        setProducts(response.data.data);
        setMessage("");
      } else {
        setProducts([]);
        setMessage(response.data.message || "Продукты не найдены.");
      }
    } catch (error) {
      console.error("Ошибка при загрузке продуктов:", error);
      setMessage("Произошла ошибка при загрузке данных.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  if (loading) {
    return <div>Загрузка...</div>;
  }

  const handleCreateOrUpdate = async () => {
    try {
      if (isEditMode) {
        await UserService.updateProduct(selectedProduct.id, productData);
        alert("Продукт успешно обновлен");
      } else {
        await UserService.createProduct(productData);
        alert("Продукт успешно создан");
      }
      setIsModalOpen(false);
      setProductData({});
      fetchProducts();
    } catch (error) {
      console.error("Ошибка при сохранении продукта:", error);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Вы уверены, что хотите удалить продукт?")) return;

    try {
      await UserService.deleteProduct(id);
      alert("Продукт успешно удален");
      fetchProducts();
    } catch (error) {
      console.error("Ошибка при удалении продукта:", error);
    }
  };

  const handleEdit = (product) => {
    setSelectedProduct(product);
    setProductData(product);
    setIsEditMode(true);
    setIsModalOpen(true);
  };

  const handleCreate = () => {
    setSelectedProduct(null);
    setProductData({});
    setIsEditMode(false);
    setIsModalOpen(true);
  };

  const handleView = (product) => {
    setSelectedProduct(product);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Мои продукты</h1>

      {products.length > 0 ? (
        products.map((product) => (
          <div key={product.id} className="border p-4 mb-4 rounded">
            <h2 className="text-xl font-bold">{product.name}</h2>
            <p>{product.description || "Описание отсутствует"}</p>
            <p>
              <strong>Цена:</strong> {product.price} руб.
            </p>
            <div className="flex space-x-4 mt-2">
              <button
                onClick={() => handleView(product)}
                className="bg-blue-500 text-white py-1 px-4 rounded"
              >
                Просмотр
              </button>
              <button
                onClick={() => handleEdit(product)}
                className="bg-yellow-500 text-white py-1 px-4 rounded"
              >
                Редактировать
              </button>
              <button
                onClick={() => handleDelete(product.id)}
                className="bg-red-500 text-white py-1 px-4 rounded"
              >
                Удалить
              </button>
            </div>
          </div>
        ))
      ) : (
        <p>Продукты отсутствуют</p>
      )}

      <button
        onClick={handleCreate}
        className="mt-4 bg-green-600 text-white py-2 px-4 rounded"
      >
        Добавить продукт
      </button>

      {selectedProduct && (
        <div className="border mt-6 p-4 rounded bg-gray-100">
          <h2 className="text-xl font-bold mb-2">Детали продукта</h2>
          <p>
            <strong>Название:</strong> {selectedProduct.name}
          </p>
          <p>
            <strong>Описание:</strong> {selectedProduct.description || "Не указано"}
          </p>
          <p>
            <strong>Цена:</strong> {selectedProduct.price} руб.
          </p>
          <p>
            <strong>Категория:</strong> {selectedProduct.category || "Не указана"}
          </p>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4">
              {isEditMode ? "Редактировать продукт" : "Создать продукт"}
            </h2>
            <input
              type="text"
              placeholder="Название"
              value={productData.name || ""}
              onChange={(e) => setProductData({ ...productData, name: e.target.value })}
              className="w-full mb-3 p-2 border rounded"
            />
            <input
              type="text"
              placeholder="Описание"
              value={productData.description || ""}
              onChange={(e) => setProductData({ ...productData, description: e.target.value })}
              className="w-full mb-3 p-2 border rounded"
            />
            <input
              type="number"
              placeholder="Цена"
              value={productData.price || ""}
              onChange={(e) => setProductData({ ...productData, price: e.target.value })}
              className="w-full mb-3 p-2 border rounded"
            />
            <input
              type="text"
              placeholder="Категория"
              value={productData.category || ""}
              onChange={(e) => setProductData({ ...productData, category: e.target.value })}
              className="w-full mb-3 p-2 border rounded"
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setIsModalOpen(false)}
                className="bg-gray-500 text-white py-2 px-4 rounded"
              >
                Отмена
              </button>
              <button
                onClick={handleCreateOrUpdate}
                className="bg-green-500 text-white py-2 px-4 rounded"
              >
                Сохранить
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
