import axios from 'axios';
import React, { useState, useEffect } from 'react';
import animeCache from '../Data/anime_cache.json';

export default function GetAnimeNameList() {
  const animeArray = animeCache.sfw; 
  const [animeList, setAnimeList] = useState([]);

  useEffect(() => {
    // Try loading cached data from localStorage first
    const cachedData = localStorage.getItem('animeCacheResults');
    if (cachedData) {
      setAnimeList(JSON.parse(cachedData));
      return;
    }

    const fetchAllAnime = async () => {
      try {
        const results = [];
        for (let i = 1; i <= 180; i++) {
          if (animeArray.includes(i)) {
            // Delay between requests
            await new Promise((resolve) => setTimeout(resolve, 500 + i));
            const response = await axios.get(`https://api.jikan.moe/v4/anime/${i}`);
            results.push(response.data.data);
          }
        }
        setAnimeList(results);
        // Store fetched results in localStorage for next time
        localStorage.setItem('animeCacheResults', JSON.stringify(results));
      } catch (error) {
        console.error('Failed to fetch anime:', error);
      }
    };

    fetchAllAnime();
  }, []);

  const clearCache = () => {
    localStorage.removeItem('animeCacheResults');
    setAnimeList([]);
  };

  return (
    <div>
      <button onClick={clearCache} style={buttonStyle}>
        Clear Cache
      </button>
      <h1>Anime Details </h1>
      {animeList.length > 0 ? (
        <ul>
          {animeList.map((anime) => (
            <li key={anime.mal_id} style={listItemStyle}>
              <img src={anime.images?.jpg?.image_url} alt={anime.title} style={imageStyle} />
              {anime.title} (ID: {anime.mal_id})
            </li>
          ))}
        </ul>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}


const buttonStyle = {
  padding: '8px 16px',
  marginBottom: '20px',
  fontSize: '16px',
  cursor: 'pointer',
};

const listItemStyle = {
  display: 'flex',
  alignItems: 'center',
  marginBottom: '10px',
};

const imageStyle = {
  width: '50px',
  height: '70px',
  objectFit: 'cover',
  marginRight: '10px',
};