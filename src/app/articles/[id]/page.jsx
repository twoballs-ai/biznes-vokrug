import ArticleDetailPage from "@/components/ArticleDetailPage";
import UserService from "@/services/user.service";

export async function generateMetadata({ params }) {
  const { id } = params;

  try {
    const response = await UserService.getArticleById(id);
    if (response.data.status) {
      const article = response.data.data;
      return {
        title: `${article.title} | Статьи`,
        description: article.content.slice(0, 150) + "...",
        openGraph: {
          title: article.title,
          description: article.content.slice(0, 150),
          url: `/articles/${id}`,
        },
      };
    }
  } catch (error) {
    console.error("Ошибка загрузки статьи:", error);
  }

  return {
    title: "Статья не найдена | Статьи",
    description: "Запрашиваемая статья не найдена.",
  };
}

export default function ArticleDetailWrapper({ params }) {
  return <ArticleDetailPage id={params.id} />;
}
