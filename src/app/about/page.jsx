import { 
  BriefcaseIcon, 
  LightBulbIcon, 
  GlobeAltIcon,
  UserGroupIcon
} from "@heroicons/react/24/outline";

export default function AboutPage() {
  return (
    <section className="p-6 bg-gray-100 rounded-lg shadow-md">
      <h2 className="text-3xl font-bold mb-6 text-blue-700">О нас</h2>
      <p className="mb-4">
        Мы — команда профессионалов, которая помогает бизнесу развиваться и достигать новых высот.
        Наша миссия — предоставить лучшие услуги для наших клиентов и создавать комфортные условия для роста и
        развития вашего дела.
      </p>
      <p className="mb-8">
        Наш опыт, инновационные подходы и гибкие решения позволяют нам эффективно адаптироваться под
        нужды каждого клиента. Мы стремимся к долгосрочному сотрудничеству и постоянному совершенствованию.
      </p>

      {/* Сетка с иконками и описаниями */}
      <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4">
        {/* Блок 1 */}
        <div className="bg-white rounded-lg p-4 shadow hover:shadow-lg transition-shadow">
          <BriefcaseIcon className="w-12 h-12 text-blue-600 mx-auto mb-3" />
          <h3 className="text-xl font-semibold text-center text-blue-600">Наш опыт</h3>
          <p className="text-center text-sm mt-2">
            Более 10 лет на рынке, десятки успешных проектов и довольных клиентов.
          </p>
        </div>

        {/* Блок 2 */}
        <div className="bg-white rounded-lg p-4 shadow hover:shadow-lg transition-shadow">
          <LightBulbIcon className="w-12 h-12 text-blue-600 mx-auto mb-3" />
          <h3 className="text-xl font-semibold text-center text-blue-600">Инновации</h3>
          <p className="text-center text-sm mt-2">
            Мы внедряем самые современные технологии и идеи, чтобы обеспечить конкурентное преимущество.
          </p>
        </div>

        {/* Блок 3 */}
        <div className="bg-white rounded-lg p-4 shadow hover:shadow-lg transition-shadow">
          <GlobeAltIcon className="w-12 h-12 text-blue-600 mx-auto mb-3" />
          <h3 className="text-xl font-semibold text-center text-blue-600">Глобальное видение</h3>
          <p className="text-center text-sm mt-2">
            Мы ориентируемся на международные стандарты и помогаем выйти на новые рынки.
          </p>
        </div>

        {/* Блок 4 */}
        <div className="bg-white rounded-lg p-4 shadow hover:shadow-lg transition-shadow">
          <UserGroupIcon className="w-12 h-12 text-blue-600 mx-auto mb-3" />
          <h3 className="text-xl font-semibold text-center text-blue-600">Команда экспертов</h3>
          <p className="text-center text-sm mt-2">
            Наши специалисты имеют многолетний опыт и готовы делиться знаниями с вами.
          </p>
        </div>
      </div>
    </section>
  );
}
