// components/SearchBar.js
import { useState } from "react";

const SearchBar = ({ onSearch, className = "" }) => {
  const [query, setQuery] = useState("");

  const handleSearch = (event) => {
    setQuery(event.target.value);
    onSearch(event.target.value); // Передаем значение родительскому компоненту
  };

  return (
    <div className={`flex items-center border border-gray-300 rounded-lg px-3 py-2 ${className}`}>
      <input
        type="text"
        placeholder="Поиск по товарам и услугам"
        value={query}
        onChange={handleSearch}
        className="w-full p-2 text-sm outline-none"
      />
    </div>
  );
};

export default SearchBar;
