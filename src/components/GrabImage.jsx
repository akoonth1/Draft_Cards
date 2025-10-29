import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { useCardContext } from './CardContext';
import characterData from '../Data/characters.mjs';

export default function GrabImage() {
  const { addCardFromCharacter } = useCardContext();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  
  // Search functionality state
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedAnime, setSelectedAnime] = useState({
    id: 21,
    title: 'One Piece'
  });

  // Refs for handling search timeout and click-outside
  const searchResultsRef = useRef(null);
  const searchTimeoutRef = useRef(null);

  const normalizeName = (name) => 
    name.replace(/[^a-zA-Z0-9 ]/g, '').toLowerCase().trim();

  // Character name filtering (optional - you can remove this if you want all characters)
  const allCharacterNames = [
    ...characterData.characters[0].straw_hat_crew,
    ...characterData.characters[0].emperors_and_their_crews,
    // ...other character groups...
  ].map(normalizeName);

  // Search for anime by title
  const searchAnime = async () => {
    if (!searchTerm.trim()) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.get(
        `https://api.jikan.moe/v4/anime?q=${encodeURIComponent(searchTerm)}&limit=10`
      );
      setSearchResults(response.data.data);
      resetSearchTimeout();
    } catch (error) {
      console.error('Error searching anime:', error);
      setError('Failed to search anime. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Select an anime from search results
  const selectAnime = (anime) => {
    setSelectedAnime({
      id: anime.mal_id,
      title: anime.title
    });
    setSearchResults([]); // Clear search results
    setSearchTerm(''); // Clear search term
  };

  // Clear search results function
  const clearSearchResults = () => {
    setSearchResults([]);
  };

  // Reset search timeout
  const resetSearchTimeout = () => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    searchTimeoutRef.current = setTimeout(() => {
      clearSearchResults();
    }, 30000); // 30 seconds
  };

  // Click-outside detection
  useEffect(() => {
    if (searchResults.length > 0) {
      const handleClickOutside = (event) => {
        if (
          searchResultsRef.current && 
          !searchResultsRef.current.contains(event.target) &&
          !event.target.closest('form[id="anime-search-form"]')
        ) {
          clearSearchResults();
        }
      };

      resetSearchTimeout();
      document.addEventListener('mousedown', handleClickOutside);

      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
        if (searchTimeoutRef.current) {
          clearTimeout(searchTimeoutRef.current);
        }
      };
    }
  }, [searchResults]);

  // Fetch characters from selected anime
  const fetchCharacters = async () => {
    setLoading(true);
    setError(null);
    setMessage(null);
    
    try {
      const response = await axios.get(`https://api.jikan.moe/v4/anime/${selectedAnime.id}/characters`);
      
      // Option 1: Filter by character names (current logic)
      // const filteredCharacters = response.data.data.filter((character) => {
      //   const characterName = normalizeName(character.character.name);
      //   return allCharacterNames.includes(characterName);
      // });

      // Option 2: Get all characters (uncomment to use all characters instead)
      const filteredCharacters = response.data.data;

      // Transform data to only include relevant fields
      const processedCharacters = filteredCharacters.map((character) => ({
        name: character.character.name,
        image_url: character.character.images?.jpg?.image_url || 'https://via.placeholder.com/400x200.png?text=No+Image',
        mal_id: character.character.mal_id
      }));

      console.log("Processed Characters:", processedCharacters);

      // Keep track of duplicates
      let duplicates = [];
      let addedCount = 0;

      // Add characters to column
      processedCharacters.forEach(character => {
        const success = addCardFromCharacter('column-1', character);
        if (success) {
          addedCount++;
        } else {
          duplicates.push(character.name);
        }
      });

      // Set success/duplicate message
      if (duplicates.length > 0) {
        setMessage(`Added ${addedCount} characters from ${selectedAnime.title}. Skipped duplicates: ${duplicates.join(', ')}`);
      } else {
        setMessage(`Successfully added ${addedCount} characters from ${selectedAnime.title}!`);
      }

    } catch (error) {
      console.error('Error fetching characters:', error);
      setError('Failed to fetch characters. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={containerStyle}>
      <h2>Character Importer</h2>
      
      {/* Search section */}
      <form 
        id="anime-search-form"
        onSubmit={(e) => {
          e.preventDefault();
          searchAnime();
        }} 
        style={searchContainerStyle}
      >
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search anime titles..."
          style={inputStyle}
        />
        <button 
          type="submit"
          disabled={loading || !searchTerm.trim()}
          style={buttonStyle}
        >
          Search
        </button>
      </form>
      
      {/* Search results */}
      {searchResults.length > 0 && (
        <div 
          ref={searchResultsRef} 
          style={resultsContainerStyle}
          onMouseMove={resetSearchTimeout}
        >
          <h3>Search Results:</h3>
          <ul style={resultsListStyle}>
            {searchResults.map((anime) => (
              <li 
                key={anime.mal_id} 
                onClick={() => selectAnime(anime)}
                style={resultItemStyle}
              >
                <div>
                  <strong>{anime.title}</strong>
                  <br />
                  <small>{anime.year || 'N/A'} • {anime.type || 'Unknown'}</small>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
      
      {/* Selected anime info */}
      <div style={selectedAnimeStyle}>
        <p>Currently selected: <strong>{selectedAnime.title}</strong></p>
        
        <button 
          onClick={fetchCharacters} 
          disabled={loading}
          style={importButtonStyle}
        >
          {loading ? 'Loading...' : `Import Characters from ${selectedAnime.title}`}
        </button>
      </div>
      
      {/* Messages */}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {message && <p style={{ color: 'green' }}>{message}</p>}
    </div>
  );
}

// Styles
const containerStyle = {
  padding: '20px',
  maxWidth: '800px',
  margin: '0 auto',
};

const searchContainerStyle = {
  display: 'flex',
  marginBottom: '20px',
};

const inputStyle = {
  flexGrow: 1,
  padding: '8px',
  fontSize: '16px',
  borderRadius: '4px 0 0 4px',
  border: '1px solid #d1d1d1a5',
};

const buttonStyle = {
  padding: '8px 16px',
  backgroundColor: '#4a90e2',
  color: 'white',
  border: 'none',
  borderRadius: '0 4px 4px 0',
  cursor: 'pointer',
};

const resultsContainerStyle = {
  marginBottom: '20px',
  padding: '10px',
  border: '1px solid #ffffffff',
  borderRadius: '4px',
  backgroundColor: '#5c1616ff',
};

const resultsListStyle = {
  listStyleType: 'none',
  padding: 0,
  margin: 0,
};

const resultItemStyle = {
  padding: '10px',
  cursor: 'pointer',
  borderBottom: '1px solid #151463ff',
  transition: 'background-color 0.2s',
  ':hover': {
    backgroundColor: '#301a1aff',
  }
};

const selectedAnimeStyle = {
  marginBottom: '20px',
  padding: '15px',
  backgroundColor: '#351a76ff',
  borderRadius: '4px',
};

const importButtonStyle = {
  padding: '10px 20px',
  backgroundColor: '#4CAF50',
  color: 'white',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
  fontSize: '16px',
  width: '100%',
};
