import Link from "next/link";

export default function LegalPage() {
  return (
    <div className="container mx-auto py-16">
      <h1 className="text-2xl font-bold mb-8">Правовая информация</h1>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Политика конфиденциальности</h2>
        <Link href="/legal/privacy" className="text-blue-600 hover:underline">
          Просмотреть документ
        </Link>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Пользовательское соглашение</h2>
        <Link href="/legal/terms" className="text-blue-600 hover:underline">
          Просмотреть документ
        </Link>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Политика cookie</h2>
        <Link href="/legal/cookies" className="text-blue-600 hover:underline">
          Просмотреть документ
        </Link>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Политика модерации</h2>
        <Link href="/legal/moderation" className="text-blue-600 hover:underline">
          Просмотреть документ
        </Link>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Согласие на обработку ПД</h2>
        <Link href="/legal/consent" className="text-blue-600 hover:underline">
          Просмотреть документ
        </Link>
      </section>
    </div>
  );
}
