import { Provider } from 'react-redux';
import { store } from '@/store/store'; 
import "./globals.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Header from "@/components/Header";
import Script from "next/script";
import YandexMetrika from "@/components/metrics/YandexMetrika";
import { Suspense } from "react";
import Link from "next/link";
import Head from "next/head";

export const metadata = {
  title: {
    template: "%s | toise.ru",
    default: "toise.ru",
  },
};

export default function RootLayout({ children }) {
  return (
    <Provider store={store}> 
      <html lang="ru">
        <Head>
          {/* 📌 Title и мета-теги */}
          <title>toise.ru — Платформа для ваших объявлений</title>
          <meta
            name="description"
            content="toise.ru - это удобная площадка для поиска товаров и услуг, статей и новостей."
          />
          <meta
            name="keywords"
            content="бизнес, услуги, предприниматели, новости, статьи, товары"
          />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />

          {/* Open Graph (для соцсетей) */}
          <meta property="og:title" content="toise.ru" />
          <meta property="og:description" content="Платформа для ваших объявлений" />
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
                <h2 className="text-lg font-bold">toise.ru</h2>
                <p className="text-sm">
                  &copy; {new Date().getFullYear()} toise.ru. Все права защищены.
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

              {/* 📌 Кнопка RuStore */}
              <div className="w-full md:w-auto mt-4 md:mt-0 flex justify-center md:justify-end">
   <iframe src="https://www.rustore.ru/external/simple-selection/buttons?theme=coloredLight&orientation=horizontal&stores=rustore%3Ahttps%3A%2F%2Fwww.rustore.ru%2Fcatalog%2Fapp%2Fru.toise.app%3Futm_source%3Davailable_in_rustore%26utm_medium%3Dru.toise.app%26rsm%3D1%26mt_link_id%3Diios36%26mt_sub1%3Dru.toise.app" border="0" 
width="100%" height="80px"></iframe>
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
    </Provider>
  );
}
