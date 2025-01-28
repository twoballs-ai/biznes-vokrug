import NewsDetailPage from "@/components/NewsDetailPage";
import UserService from "@/services/user.service";

export async function generateMetadata({ params }) {
  const { id } = params;

  try {
    const response = await UserService.getNewsById(id);
    if (response.data.status) {
      const newsItem = response.data.data;
      console.log(newsItem)
      return {
        title: `${newsItem.title} | Новости`,
        description: newsItem.content.slice(0, 150) + "...", // Обрезка контента для SEO
        openGraph: {
          title: newsItem.title,
          description: newsItem.content.slice(0, 150),
          url: `/news/${id}`,
        },
      };
    }
  } catch (error) {
    console.error("Ошибка загрузки новости:", error);
  }

  return {
    title: "Новость не найдена | Новости",
    description: "Запрашиваемая новость не найдена.",
  };
}

export default function NewsDetailWrapper({ params }) {
  return <NewsDetailPage id={params.id} />;
}


