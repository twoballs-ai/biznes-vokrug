"use client";

import dynamic from "next/dynamic";
import { useRef } from "react";

const Editor = dynamic(() => import("@tinymce/tinymce-react").then((mod) => mod.Editor), {
  ssr: false,
  loading: () => <p>Загрузка редактора...</p>,
});

export default function TinyMCEEditor({ content, setContent, setImages }) {
  const editorRef = useRef(null);

  return (
    <Editor
      apiKey="f0bffv00borq5e1ccsaqrtwykn2d3cf4s8syyhdxjkt60hvd"
      onInit={(_evt, editor) => (editorRef.current = editor)}
      initialValue={content}
      init={{
        height: 500,
        plugins: [
          "advlist", "autolink", "lists", "link", "image", "charmap",
          "anchor", "searchreplace", "visualblocks", "code", "fullscreen",
          "insertdatetime", "media", "table", "preview", "help", "wordcount",
          "image", "imagetools"
        ],
        toolbar:
          "undo redo | blocks | " +
          "bold italic forecolor | alignleft aligncenter " +
          "alignright alignjustify | bullist numlist outdent indent | " +
          "removeformat | image",
        file_picker_types: "image",
        file_picker_callback: (callback, value, meta) => {
          const input = document.createElement("input");
          input.setAttribute("type", "file");
          input.setAttribute("accept", "image/*");
          input.onchange = function () {
            const file = this.files[0];
            if (file) {
              const reader = new FileReader();
              reader.onload = function (e) {
                callback(e.target.result, { title: file.name });
              };
              reader.readAsDataURL(file);
              
              setImages((prev) => [...prev, file]); // Сохраняем файл в state
            }
          };
          input.click();
        },
      }}
      onEditorChange={(newContent) => setContent(newContent)}
    />
  );
}
