import { cookies } from 'next/headers';

export default async function EntrepreneurPage({ params }) {
  const { id } = params;
  const cookieStore = cookies();
  const city = cookieStore.get('city')?.value || 'Неизвестный город';

  // Получаем данные ИП и фильтруем по городу
  const entrepreneurData = await fetch(`https://api.example.com/entrepreneurs/${id}?city=${city}`).then(res => res.json());

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold">{entrepreneurData.name}</h1>
      <p>{entrepreneurData.description}</p>
      <h2 className="text-xl font-semibold mt-6">Услуги</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {entrepreneurData.services.map((service) => (
          <div key={service.id} className="p-4 border rounded">
            <h3 className="font-bold">{service.name}</h3>
            <p>{service.description}</p>
          </div>
        ))}
      </div>
      <h2 className="text-xl font-semibold mt-6">Продукция</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {entrepreneurData.products.map((product) => (
          <div key={product.id} className="p-4 border rounded">
            <h3 className="font-bold">{product.name}</h3>
            <p>{product.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
