"use client";
import { useState } from "react";
import SearchBar from "@/components/HomePage/SearchBar"; // Подключаем компонент поиска

const CategorySearchBlock = ({ categories, onCategoryChange, onSearch, className = "" }) => {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [isOpen, setIsOpen] = useState(false); // Для открытия/закрытия меню

  // Обработчик клика по категории
  const handleCategoryClick = (categoryId) => {
    setSelectedCategory(categoryId);
    onCategoryChange(categoryId); // Передаем выбранную категорию родительскому компоненту
  };

  // Функция для рендеринга подкатегорий
  const renderSubcategories = (parentId) => {
    const subcategories = categories.filter(category => category.parentId === parentId);
    return subcategories.length > 0 && (
      <ul className="pl-4 mt-2 space-y-2">
        {subcategories.map(subcategory => (
          <li key={subcategory.id}>
            <button
              onClick={() => handleCategoryClick(subcategory.id)}
              className="block text-sm text-gray-700 hover:text-blue-500"
            >
              {subcategory.name}
            </button>
            {renderSubcategories(subcategory.id)} {/* Рекурсивный вызов для вложенных категорий */}
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div className={`relative flex gap-4 mb-6 ${className}`}>
      {/* Кнопка выбора категории */}
      <div className="w-2/6">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full border border-gray-300 rounded-lg p-2 text-sm text-left focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {selectedCategory ? categories.find(c => c.id === selectedCategory)?.name : "Все категории"}
        </button>
        {isOpen && (
          <div className="absolute z-10 bg-white border border-gray-300 shadow-lg rounded-lg w-full mt-2 p-2">
            <button
              onClick={() => handleCategoryClick("")}
              className="block w-full text-sm text-gray-700 hover:text-blue-500"
            >
              Все категории
            </button>
            {categories.filter(c => !c.parentId).map(category => (
              <div key={category.id}>
                <button
                  onClick={() => handleCategoryClick(category.id)}
                  className="block w-full text-sm text-gray-700 hover:text-blue-500"
                >
                  {category.name}
                </button>
                {renderSubcategories(category.id)} {/* Рендерим подкатегории */}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Поле поиска */}
      <div className="w-4/6">
        <SearchBar onSearch={onSearch} className="w-full" />
      </div>

      {/* Кнопка закрытия для меню */}
      {isOpen && (
        <button
          onClick={() => setIsOpen(false)}
          className="absolute top-0 right-0 p-2 text-gray-500 hover:text-gray-700"
        >
          ✖
        </button>
      )}
    </div>
  );
};

export default CategorySearchBlock;
