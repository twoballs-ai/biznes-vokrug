import DOMPurify from "dompurify";

export default function ContentBlock({ data, hasMore, loadMore }) {
  return (
    <>
      {data.length === 0 ? (
        <p>Нет данных</p>
      ) : (
        <div className="space-y-6">
          {data.map((item) => (
            <div key={item.id} className="p-4 bg-white rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-blue-600">{item.title}</h3>
              <article
                className="prose max-w-none mt-2 text-left"
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(item.content),
                }}
              />
              <div className="mt-2 text-gray-500">
                <span>Категория: {item.category}</span> |{" "}
                <span>Опубликовано: {new Date(item.created_at).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {hasMore && (
        <div className="text-center mt-6">
          <button
            onClick={loadMore}
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
          >
            Загрузить еще
          </button>
        </div>
      )}
    </>
  );
}