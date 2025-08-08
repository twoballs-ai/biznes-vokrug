import { AuthProvider } from "../contexts/AuthProvider";
import "./globals.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Header from "@/components/Header";
import Script from "next/script";
import YandexMetrika from "@/components/metrics/YandexMetrika";
import { Suspense } from "react";
import { FaTelegramPlane, FaVk } from "react-icons/fa";
import Link from "next/link";
import Head from "next/head";

export const metadata = {
  title: {
    template: '%s | И то и сё',
    default: 'И то и сё', // новый default
  },
};

export default function RootLayout({ children }) {
  return (
    <AuthProvider>
      <html lang="ru">
        <Head>
          {/* 📌 Title и мета-теги */}
          <title>И то и сё — Барахолка и онлайн-объявления</title>
          <meta name="description" content="И то и сё - онлайн-платформа для размещения объявлений, покупок и продаж товаров и услуг, похожая на Авито." />
          <meta name="keywords" content="барахолка, объявления, товары, услуги, купить, продать, Авито" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />

          {/* Open Graph (для соцсетей) */}
          <meta property="og:title" content="И то и сё" />
          <meta property="og:description" content="Онлайн-объявления и барахолка для покупки и продажи товаров и услуг." />
          <meta property="og:image" content="/favicon.ico" />
          <meta property="og:url" content="https://toise.ru" />
          <meta property="og:type" content="website" />

          {/* Favicon */}
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <body className="bg-gray-100 text-gray-800 min-h-screen flex flex-col">
          <header>
            <Header />
          </header>

          <main className="container mx-auto pt-32 py-8 flex-1">{children}</main>

          <footer className="bg-blue-600 text-white py-8 mt-auto">
            <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
              <div className="mb-4 md:mb-0">
                <h2 className="text-lg font-bold">И то и сё</h2>
                <p className="text-sm">
                  &copy; {new Date().getFullYear()} И то и сё. Все права защищены.
                </p>
              </div>
              <nav>
                <div className="flex space-x-4 mb-4 md:mb-0">
                  <Link href="/about" className="text-sm font-semibold text-white">
                    О нас
                  </Link>
                  <Link href="/contact" className="text-sm font-semibold text-white">
                    Контакты
                  </Link>
                  <Link href="/news" className="text-sm font-semibold text-white">
                    Новости
                  </Link>
                  <Link href="/articles" className="text-sm font-semibold text-white">
                    Статьи
                  </Link>
                </div>
              </nav>
              <div className="flex space-x-4">
                {/* Заменим ссылки на соцсети на актуальные */}
                <a href="https://t.me/yourtelegramchannel" target="_blank" rel="noopener noreferrer">
                  <FaTelegramPlane className="w-6 h-6 text-white hover:text-gray-300" />
                </a>
                <a href="https://vk.com/yourvkpage" target="_blank" rel="noopener noreferrer">
                  <FaVk className="w-6 h-6 text-white hover:text-gray-300" />
                </a>
              </div>
            </div>
          </footer>

          {/* Яндекс Метрика */}
          <Script id="metrika-counter" strategy="afterInteractive">
            {`(function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
              m[i].l=1*new Date();
              for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
              k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
              (window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");
 
              ym(99538507, "init", {
                    defer: true,
                    clickmap:true,
                    trackLinks:true,
                    accurateTrackBounce:true,
                    webvisor:true
              });`}
          </Script>

          <Suspense fallback={<></>}>
            <YandexMetrika />
          </Suspense>
        </body>
      </html>
    </AuthProvider>
  );
}
