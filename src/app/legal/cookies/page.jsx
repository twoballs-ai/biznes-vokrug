// app/legal/cookies/page.tsx
"use client";

import React from "react";

export default function CookiesPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto p-6 sm:p-10">
      <h1 className="text-3xl font-bold mb-6">Политика использования файлов cookie</h1>
      <p className="mb-2">Редакция от: <strong>24.07.2025</strong></p>
      <p className="mb-6">Версия: <strong>1.0</strong></p>

      <p className="mb-6">
        Мы используем cookie‑файлы и иные идентификаторы (SDK, local storage, пиксели) для обеспечения работы Сервиса, аналитики и (в перспективе) маркетинга. Часть cookie необходима для функционирования, иная — используется по отдельному согласию.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-4">1. Что такое cookie</h2>
      <p className="mb-4">
        Cookie — это небольшой фрагмент данных, который сохраняется на устройстве Пользователя. Аналогичные технологии включают идентификаторы мобильных устройств, локальное хранилище, пиксели и SDK.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-4">2. Категории cookie</h2>
      <ul className="list-disc list-inside mb-4">
        <li><strong>Строго необходимые</strong> — обеспечивают базовые функции (авторизация, сохранение настроек, защита от мошенничества). Обработка основана на необходимости исполнения договора и законных интересах Оператора.</li>
        <li><strong>Аналитические</strong> — помогают понять, как используется Сервис, улучшать его (например, Яндекс.Метрика). Требуют <strong>отдельного согласия</strong>.</li>
        <li><strong>Маркетинговые/рекламные</strong> — для персонализации, retargeting и передачи данных в ОРД (при появлении рекламы). Требуют <strong>отдельного согласия</strong>.</li>
      </ul>

      <h2 className="text-2xl font-semibold mt-8 mb-4">3. Управление cookie и отзыв согласия</h2>
      <ul className="list-disc list-inside mb-4">
        <li>Отключить/ограничить cookie в настройках браузера/устройства.</li>
        <li>Отозвать согласие через интерфейс Сервиса (если предусмотрена панель управления cookie) или направив запрос на <strong>manager@toise.ru</strong>.</li>
      </ul>
      <p className="mb-4">
        Отключение строго необходимых cookie может повлечь некорректную работу Сервиса.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-4">4. Срок хранения</h2>
      <p className="mb-4">
        Срок хранения cookie зависит от их типа и указывается в интерфейсе управления cookie (при наличии) или в настройках браузера.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-4">5. Контакты</h2>
      <p>
        По вопросам использования cookie: <strong>manager@toise.ru</strong>.
      </p>
    </div>
  );
}
