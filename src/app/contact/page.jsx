export const metadata = {
  title: "Контакты | Бизнес Вокруг",
  description: "Свяжитесь с нами для получения информации, сотрудничества или обратной связи. Мы всегда рады вашим вопросам!",
};

export default function ContactPage() {
  return (
    <>
      <section className="p-6 bg-gray-100 rounded-lg shadow-md">
        <h2 className="text-3xl font-bold mb-6 text-blue-700">Свяжитесь с нами</h2>
        <p className="mb-4">
          У нас всегда открыты двери для общения. Если у вас есть вопросы, предложения
          или вы хотите сотрудничать, свяжитесь с нами удобным для вас способом:
        </p>
        <div className="mb-6">
          <ul className="space-y-3">
            <li>
              <strong>Email:</strong> info@bizvokrug.ru
            </li>
            <li>
              <strong>Телефон:</strong> +7 917 676-7659
            </li>
          </ul>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          <div className="p-4 bg-white rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-blue-600">Поддержка клиентов</h3>
            <p className="text-sm mt-2">
              Мы готовы помочь вам с любыми вопросами, связанными с нашими услугами.
            </p>
          </div>
          <div className="p-4 bg-white rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-blue-600">Сотрудничество</h3>
            <p className="text-sm mt-2">
              Хотите работать с нами? Мы всегда открыты для новых идей и партнеров.
            </p>
          </div>
          <div className="p-4 bg-white rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-blue-600">Обратная связь</h3>
            <p className="text-sm mt-2">
              Мы ценим ваши отзывы и предложения. Напишите нам, чтобы улучшить наш сервис.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
