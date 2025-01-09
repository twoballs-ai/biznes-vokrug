import React from "react";

export default function CustomModal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null; // Если окно закрыто, ничего не рендерим

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      {/* Контейнер модального окна */}
      <div className="bg-white p-6 rounded shadow-lg w-full max-w-md mx-auto relative">
        {/* Кнопка с крестиком */}
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
          onClick={onClose}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="2"
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {/* Заголовок окна */}
        {title && <h2 className="text-xl font-bold mb-4">{title}</h2>}

        {/* Контент окна */}
        <div>{children}</div>
      </div>
    </div>
  );
}
