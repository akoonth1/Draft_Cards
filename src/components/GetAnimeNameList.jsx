import axios from "axios";
import React, { useState, useEffect } from "react";

export default function GetAnimeNameList() {
  const [animeList, setAnimeList] = useState([]);

  useEffect(() => {
    const fetchAllAnime = async () => {
      try {
        const requests = [];
        for (let i = 5; i <= 6; i++) {
          requests.push(axios.get(`https://api.jikan.moe/v4/anime/${i}`));
        }
        const responses = await Promise.all(requests);
        const allAnime = responses.map(res => res.data.data);
        setAnimeList(allAnime);
      } catch (error) {
        console.error("Failed to fetch anime range:", error);
      }
    };
    fetchAllAnime();
  }, []);

  return (
    <div>
      <h1>Anime Details (IDs 1 - 100)</h1>
      {animeList.length > 0 ? (
        <ul>
          {animeList.map((anime) => (
            <li key={anime.mal_id}>{anime.title}</li>
          ))}
        </ul>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}
