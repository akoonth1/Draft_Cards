import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { useCardContext } from './CardContext';
import characterData from '../Data/characters.mjs';

export default function GrabImage() {
  const { addCardFromCharacter } = useCardContext();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  // Change from single selection to array of selected anime
  const [selectedAnimes, setSelectedAnimes] = useState([
    {
      id: 21,
      title: 'One Piece'
    }
  ]);

  // New refs for handling click-outside and timeout
  const searchResultsRef = useRef(null);
  const searchTimeoutRef = useRef(null);

  const normalizeName = (name) => 
    name.replace(/[^a-zA-Z0-9 ]/g, '').toLowerCase().trim();

  // Replace or expand these with your actual character lists
  const allCharacterNames = [
    ...characterData.characters[0].straw_hat_crew,
    ...characterData.characters[0].emperors_and_their_crews,
    ...characterData.characters[0].marines_and_world_government,
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
      resetSearchTimeout(); // Reset timeout when new results arrive
    } catch (error) {
      console.error('Error searching anime:', error);
      setError('Failed to search anime. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Toggle anime selection
  const toggleAnimeSelection = (anime) => {
    const isAlreadySelected = selectedAnimes.some(
      (selected) => selected.id === anime.mal_id
    );

    if (isAlreadySelected) {
      // Remove from selection
      setSelectedAnimes(
        selectedAnimes.filter((selected) => selected.id !== anime.mal_id)
      );
    } else {
      // Add to selection
      setSelectedAnimes([
        ...selectedAnimes,
        {
          id: anime.mal_id,
          title: anime.title
        }
      ]);
    }
  };

  // Clear all selections
  const clearSelections = () => {
    setSelectedAnimes([]);
  };

  // Check if an anime is selected
  const isAnimeSelected = (animeId) => {
    return selectedAnimes.some((anime) => anime.id === animeId);
  };

  // Fetch characters for all selected anime
  const fetchCharacters = async () => {
    if (selectedAnimes.length === 0) {
      setError("Please select at least one anime first");
      return;
    }
    
    setLoading(true);
    setError(null);
    setMessage(null);
    
    try {
      let allAddedCount = 0;
      let allDuplicates = [];
      
      // Process each selected anime
      for (const anime of selectedAnimes) {
        await new Promise(resolve => setTimeout(resolve, 500)); // Delay to avoid API rate limits
        
        try {
          const response = await axios.get(`https://api.jikan.moe/v4/anime/${anime.id}/characters`);
          
          // Filter characters if needed
          const filteredCharacters = response.data.data;

          // Transform data to only include relevant fields
          const processedCharacters = filteredCharacters.map((character) => ({
            name: character.character.name,
            image_url: character.character.images?.jpg?.image_url || 'https://via.placeholder.com/400x200.png?text=No+Image',
            mal_id: character.character.mal_id
          }));

          // Keep track of duplicates for this anime
          let animeDuplicates = [];
          let animeAddedCount = 0;

          // Populate the column with each fetched character
          processedCharacters.forEach(character => {
            const success = addCardFromCharacter('column-1', character);
            if (success) {
              animeAddedCount++;
              allAddedCount++;
            } else {
              animeDuplicates.push(character.name);
              allDuplicates.push(character.name);
            }
          });

          console.log(`Added ${animeAddedCount} characters from ${anime.title}`);
        } catch (error) {
          console.error(`Error fetching characters from ${anime.title}:`, error);
        }
      }

      // Set final message
      if (allDuplicates.length > 0) {
        setMessage(`Added ${allAddedCount} characters total. Skipped ${allDuplicates.length} duplicates.`);
      } else {
        setMessage(`Successfully added ${allAddedCount} characters from ${selectedAnimes.length} anime!`);
      }
    } catch (error) {
      console.error('Error in batch character fetching:', error);
      setError('Failed to fetch characters. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Function to clear search results
  const clearSearchResults = () => {
    setSearchResults([]);
  };
  
  // Reset the timeout whenever user interacts with search
  const resetSearchTimeout = () => {
    // Clear any existing timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    
    // Set new timeout - close results after 30 seconds of inactivity
    searchTimeoutRef.current = setTimeout(() => {
      clearSearchResults();
    }, 30000); // 30 seconds
  };
  
  // Set up click-outside detection
  useEffect(() => {
    // Only add listener if we have search results showing
    if (searchResults.length > 0) {
      // Handler for clicks outside the search results
      const handleClickOutside = (event) => {
        if (
          searchResultsRef.current && 
          !searchResultsRef.current.contains(event.target) &&
          // Don't clear if clicking the search input or button
          !event.target.closest('form[id="anime-search-form"]')
        ) {
          clearSearchResults();
        }
      };
      
      // Start the inactivity timer
      resetSearchTimeout();
      
      // Add click event listener
      document.addEventListener('mousedown', handleClickOutside);
      
      // Clean up
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
        if (searchTimeoutRef.current) {
          clearTimeout(searchTimeoutRef.current);
        }
      };
    }
  }, [searchResults]);

  return (
    <div style={containerStyle}>
      <h2>Character Importer</h2>
      
      {/* Search section - add id for click detection */}
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
      
      {/* Search results - add ref and mouse events */}
      {searchResults.length > 0 && (
        <div 
          ref={searchResultsRef} 
          style={resultsContainerStyle}
          onMouseMove={resetSearchTimeout}
          onClick={resetSearchTimeout}
        >
          <h3>Search Results: (Click to select multiple)</h3>
          <ul style={resultsListStyle}>
            {searchResults.map((anime) => (
              <li 
                key={anime.mal_id} 
                onClick={() => {
                  toggleAnimeSelection(anime);
                  resetSearchTimeout();
                }}
                style={{
                  ...resultItemStyle,
                  backgroundColor: isAnimeSelected(anime.mal_id) ? '#e3f2fd' : 'transparent',
                  border: isAnimeSelected(anime.mal_id) ? '1px solid #2196f3' : '1px solid transparent',
                }}
              >
                {anime.title}
                {isAnimeSelected(anime.mal_id) && <span style={checkmarkStyle}>✓</span>}
              </li>
            ))}
          </ul>
        </div>
      )}
      
      {/* Selected anime info */}
      {selectedAnimes.length > 0 && (
        <div style={selectedAnimeStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3>Selected Anime ({selectedAnimes.length})</h3>
            <button onClick={clearSelections} style={clearButtonStyle}>
              Clear All
            </button>
          </div>
          
          <ul style={selectedListStyle}>
            {selectedAnimes.map((anime) => (
              <li key={anime.id} style={selectedItemStyle}>
                {anime.title}
                <button 
                  onClick={() => setSelectedAnimes(selectedAnimes.filter(a => a.id !== anime.id))}
                  style={removeButtonStyle}
                >
                  ×
                </button>
              </li>
            ))}
          </ul>
          
          <button 
            onClick={fetchCharacters} 
            disabled={loading || selectedAnimes.length === 0}
            style={importButtonStyle}
          >
            {loading ? 'Loading...' : `Import Characters from ${selectedAnimes.length} Anime`}
          </button>
        </div>
      )}
      
      {/* Messages */}
      {error && <p style={{ color: 'red', fontWeight: 'bold' }}>{error}</p>}
      {message && <p style={{ color: 'green', fontWeight: 'bold' }}>{message}</p>}
    </div>
  );
}

// Styles for the component
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
  border: '1px solid #ccc',
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
  border: '1px solid #ddd',
  borderRadius: '4px',
};

const resultsListStyle = {
  listStyleType: 'none',
  padding: 0,
};

const resultItemStyle = {
  padding: '8px',
  cursor: 'pointer',
  borderBottom: '1px solid #eee',
  transition: 'background-color 0.2s',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
};

const checkmarkStyle = {
  color: '#2196f3',
  fontWeight: 'bold',
};

const selectedAnimeStyle = {
  marginBottom: '20px',
  padding: '10px',
  // backgroundColor: '#f5f5f5',
  borderRadius: '4px',
};

const selectedListStyle = {
  listStyleType: 'none',
  padding: 0,
};

const selectedItemStyle = {
  padding: '8px',
  marginBottom: '5px',
  backgroundColor: '#242424',
  borderRadius: '4px',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
};

const removeButtonStyle = {
  backgroundColor: '#ff4d4f',
  color: 'white',
  border: 'none',
  borderRadius: '50%',
  width: '20px',
  height: '20px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
};

const clearButtonStyle = {
  backgroundColor: '#ff4d4f',
  color: 'white',
  border: 'none',
  borderRadius: '4px',
  padding: '5px 10px',
  cursor: 'pointer',
};

const importButtonStyle = {
  padding: '10px 20px',
  backgroundColor: '#4CAF50',
  color: 'white',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
  fontSize: '16px',
  marginTop: '10px',
  width: '100%',
};

// CardContext.jsx (fixed)
const addCardFromCharacter = (columnId, character) => {
  const newCard = {
    id: `card-${character.mal_id}`,   // or just `${character.mal_id}`
    title: character.name,
    points: 0,
    image_url: character.image_url,
    mal_id: character.mal_id,
    infoText: ''
  };

  setColumns(prevColumns =>
    prevColumns.map(col =>
      col.id === columnId
        ? { ...col, cards: [...col.cards, newCard] }
        : col
    )
  );
};
