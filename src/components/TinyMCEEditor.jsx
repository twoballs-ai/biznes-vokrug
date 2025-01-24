"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef } from "react";

// Динамический импорт TinyMCE (без SSR)
const Editor = dynamic(() => import("@tinymce/tinymce-react").then((mod) => mod.Editor), {
  ssr: false,
  loading: () => <p>Загрузка редактора...</p>,
});

export default function TinyMCEEditor({ content, setContent }) {
  const editorRef = useRef(null);

  useEffect(() => {
    if (editorRef.current && content) {
      editorRef.current.setContent(content);
    }
  }, [content]);

  return (
    <Editor
      apiKey="f0bffv00borq5e1ccsaqrtwykn2d3cf4s8syyhdxjkt60hvd"
      onInit={(_evt, editor) => (editorRef.current = editor)}
      initialValue={content} // Передаём текущее значение контента
      init={{
        height: 500,
        plugins: [
          "advlist", "autolink", "lists", "link", "image", "charmap",
          "anchor", "searchreplace", "visualblocks", "code", "fullscreen",
          "insertdatetime", "media", "table", "preview", "help", "wordcount"
        ],
        toolbar:
          "undo redo | blocks | " +
          "bold italic forecolor | alignleft aligncenter " +
          "alignright alignjustify | bullist numlist outdent indent | " +
          "removeformat | help",
        block_formats: "Абзац=p; Заголовок 1=h1; Заголовок 2=h2; Заголовок 3=h3;",
        content_style: "body { font-family: Arial, sans-serif; font-size: 16px; }",
      }}
      onEditorChange={(newContent) => setContent(newContent)}
    />
  );
}
