import { AuthProvider } from "../contexts/AuthProvider";
import "./globals.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Header from "@/components/Header";
import Script from "next/script";
import YandexMetrika from "@/components/metrics/YandexMetrika";
import { Suspense } from "react";
import { FaTelegramPlane, FaVk } from "react-icons/fa"; // FontAwesome Icons

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
                <a href="/contact" className="text-sm hover:text-gray-300">
                  Контакты
                </a>
              </div>
              <div className="flex space-x-4">
            
                {/* <a
                  href="https://t.me/yourtelegramchannel"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-gray-300"
                >
                  <FaTelegramPlane className="w-6 h-6" />
                </a>

                <a
                  href="https://vk.com/yourvkpage"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-gray-300"
                >
                  <FaVk className="w-6 h-6" />
                </a> */}
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
