// src/app/blog/create/page.jsx
import FormCreateBlog from "@/components/blog/FormCreateBlog";

export default function CreateArticlesPage() {
  return (
    <div className="container">
      <h1>Создать статью</h1>
      <FormCreateBlog />
    </div>
  );
}