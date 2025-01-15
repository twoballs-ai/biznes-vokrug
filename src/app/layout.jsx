
import { AuthProvider } from "../contexts/AuthProvider";
import "./globals.css";
import Header from "@/components/Header";
import Script from 'next/script';
import YandexMetrika from '@/components/metrics/YandexMetrika';
import { Suspense } from 'react';
export default function RootLayout({ children }) {
  return (
    <AuthProvider>
      <html lang="ru">
        <body className="bg-gray-100 text-gray-800 min-h-screen flex flex-col">
          <Header />
          <main className="container mx-auto py-8 flex-1">{children}</main>
          <footer className="bg-blue-600 text-white py-8 mt-auto">
            <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
              <div className="mb-4 md:mb-0">
                <h2 className="text-lg font-bold">Бизнес Вокруг</h2>
                <p className="text-sm">
                  &copy; {new Date().getFullYear()} Бизнес Вокруг. Все права
                  защищены.
                </p>
              </div>
              <div className="flex space-x-4 mb-4 md:mb-0">
                <a href="/about" className="text-sm hover:text-gray-300">
                  О нас
                </a>
                <a href="/services" className="text-sm hover:text-gray-300">
                  Услуги
                </a>
                <a href="/contact" className="text-sm hover:text-gray-300">
                  Контакты
                </a>
              </div>
              <div className="flex space-x-4">
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <svg
                    className="w-6 h-6 fill-current hover:text-gray-300"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                  >
                    <path d="M22.675 0H1.325C.593 0 0 .593 0 1.325v21.351C0 23.407.593 24 1.325 24h11.495v-9.294H9.847v-3.622h2.973V8.414c0-2.946 1.797-4.553 4.418-4.553 1.26 0 2.346.093 2.662.136v3.086h-1.829c-1.435 0-1.713.684-1.713 1.687v2.212h3.422l-.447 3.622h-2.975V24h5.833c.731 0 1.324-.593 1.324-1.325V1.325C24 .593 23.407 0 22.675 0z" />
                  </svg>
                </a>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <svg
                    className="w-6 h-6 fill-current hover:text-gray-300"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                  >
                    <path d="M24 4.557a9.83 9.83 0 01-2.828.775 4.932 4.932 0 002.165-2.724 9.864 9.864 0 01-3.127 1.184 4.92 4.92 0 00-8.384 4.482c-4.087-.205-7.715-2.164-10.148-5.144a4.822 4.822 0 00-.666 2.475 4.92 4.92 0 002.188 4.096 4.904 4.904 0 01-2.228-.616v.061a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.084 4.929 4.929 0 004.6 3.42 9.867 9.867 0 01-6.102 2.104c-.395 0-.779-.023-1.17-.068a13.951 13.951 0 007.548 2.209c9.056 0 14.004-7.496 14.004-13.986 0-.213-.005-.425-.014-.637A10.012 10.012 0 0024 4.557z" />
                  </svg>
                </a>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <svg
                    className="w-6 h-6 fill-current hover:text-gray-300"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.332 3.608 1.307.975.975 1.245 2.242 1.307 3.608.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.062 1.366-.332 2.633-1.307 3.608-.975.975-2.242 1.245-3.608 1.307-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.366-.062-2.633-.332-3.608-1.307-.975-.975-1.245-2.242-1.307-3.608-.058-1.266-.07-1.646-.07-4.85s.012-3.584.07-4.85c.062-1.366.332-2.633 1.307-3.608C5.367 2.495 6.634 2.225 8 2.163c1.266-.058 1.646-.07 4.85-.07zm0-2.163C8.729 0 8.334 0 7.052.07 5.276.15 3.588.66 2.222 2.026 1.066 3.182.44 4.904.07 7.052.012 8.334 0 8.729 0 12s.012 3.666.07 4.948c.37 2.148.996 3.87 2.152 5.026 1.366 1.366 3.054 1.876 4.83 1.956 1.282.07 1.677.07 4.948.07s3.666-.012 4.948-.07c2.148-.37 3.87-.996 5.026-2.152 1.366-1.366 1.876-3.054 1.956-4.83.07-1.282.07-1.677.07-4.948s-.012-3.666-.07-4.948c-.37-2.148-.996-3.87-2.152-5.026C19.87 1.066 18.182.556 16.406.476 15.124.406 14.729.406 12 .406z" />
                  </svg>
                </a>
              </div>
            </div>
          </footer>
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
              });`
            }
          </Script>
          <Suspense fallback={<></>}>
            <YandexMetrika />
          </Suspense>
        </body>
      </html>
    </AuthProvider>
  );
}
