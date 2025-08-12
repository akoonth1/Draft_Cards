import React, { useState } from "react";
import axios from "axios";

export default function SearchAnime() {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const handleSearch = async () => {
    try {
      // Jikan supports search by passing the query as 'q'
      const response = await axios.get(
        `https://api.jikan.moe/v4/anime?q=${encodeURIComponent(searchTerm)}`
      );
      setSearchResults(response.data.data);
    } catch (error) {
      console.error("Failed to search for anime:", error);
    }
  };

  return (
    <div>
      <h1>Search Anime</h1>
      <input
        type="text"
        placeholder="Enter anime name..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <button onClick={handleSearch}>Search</button>

      {searchResults.length > 0 && (
        <ul>
          {searchResults.map((anime) => (
            <li key={anime.mal_id}>
              {anime.title} (ID: {anime.mal_id})
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}