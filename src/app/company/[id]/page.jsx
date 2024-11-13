import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

export default async function CompanyPage({ params: promiseParams }) {
  const params = await promiseParams;
  const { id } = params;

  const cookieStore = cookies();
  const city = cookieStore.get('city')?.value || 'Неизвестный город';

  // Запрос к FastAPI для получения данных компании
  const response = await fetch(`http://localhost:8001/api/companies/${id}?city=${city}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error('Ошибка при получении данных компании');
  }

  const companyData = await response.json();

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold">{companyData.name}</h1>
      <p>{companyData.description}</p>

      <div className="mt-4">
        <p><strong>Адрес:</strong> {companyData.address || 'Не указан'}</p>
        <p><strong>ИНН:</strong> {companyData.inn || 'Не указан'}</p>
        <p><strong>ОГРН:</strong> {companyData.ogrn || 'Не указан'}</p>
        <p><strong>Телефон:</strong> {companyData.phone || 'Не указан'}</p>
        <p><strong>Сайт:</strong> <a href={companyData.website} target="_blank" rel="noopener noreferrer">{companyData.website || 'Не указан'}</a></p>
        <p><strong>Email:</strong> <a href={`mailto:${companyData.email}`}>{companyData.email || 'Не указан'}</a></p>
        <p><strong>Категория:</strong> {companyData.category || 'Не указана'}</p>
        <p><strong>Рейтинг:</strong> {companyData.rating || 'Нет рейтинга'}</p>
        <p><strong>Проверена:</strong> {companyData.is_verified ? 'Да' : 'Нет'}</p>
      </div>

      <h2 className="text-xl font-semibold mt-6">Услуги</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {companyData.services?.map((service) => (
          <div key={service.id} className="p-4 border rounded">
            <h3 className="font-bold">{service.name}</h3>
            <p>{service.description}</p>
          </div>
        ))}
      </div>

      <h2 className="text-xl font-semibold mt-6">Продукция</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {companyData.products?.map((product) => (
          <div key={product.id} className="p-4 border rounded">
            <h3 className="font-bold">{product.name}</h3>
            <p>{product.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
