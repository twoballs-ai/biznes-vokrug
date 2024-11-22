import { NextResponse } from 'next/server';

export async function middleware(req) {
  // Получаем IP-адрес пользователя
  const ip =  '185.177.77.214'; // Используем публичный IP-адрес Google для теста
  
  let city = 'Неизвестный город';
  try {
    // Получаем данные по IP-адресу
    const res = await fetch(`http://ip-api.com/json/${ip}`);
    const data = await res.json();
    if (data.city) {
      city = data.city;
    }
  } catch (error) {
    console.error('Ошибка при определении города:', error);
  }

  // Создаем ответ, добавляем город в cookies
  const response = NextResponse.next();
  response.cookies.set('city', city, { path: '/' });
  return response;
}

// Указываем конфигурацию для применения middleware
export const config = {
  matcher: '/',  // Это middleware будет работать на всех страницах вашего сайта
};
