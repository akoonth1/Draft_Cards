import React, { useState } from 'react';
import axios from 'axios';
import characterData from '../Data/characters.mjs';

export default function GrabImage() {

  const normalizeName = (name) => {
    return name.replace(/[^a-zA-Z0-9 ]/g, '').toLowerCase().trim();
  };

  const [availableCharacters, setAvailableCharacters] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const allCharacterNames = [
    ...characterData.characters[0].straw_hat_crew,
    // ...characterData.characters[0].emperors_and_their_crews,
    // ...characterData.characters[0].marines_and_world_government,
    // ...characterData.characters[0].warlords_former_and_current,
    // ...characterData.characters[0].revolutionary_army,
    // ...characterData.characters[0].major_allies,
    // ...characterData.characters[0].significant_antagonists,
    // ...characterData.characters[0].wano_characters,
    // ...characterData.characters[0].other_important_characters,
    // ...characterData.characters[0].baroque_works,
    // ...characterData.characters[0].the_giants
  ].map(normalizeName);

  const fetchCharacters = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get('https://api.jikan.moe/v4/anime/21/characters');
      const filteredCharacters = response.data.data.filter((character) => {
        const characterName = normalizeName(character.character.name);
        return allCharacterNames.includes(characterName);
      });

      // Transform filteredCharacters to include only name, image_url, and mal_id
      const processedCharacters = filteredCharacters.map((character) => ({
        name: character.character.name,
        image_url:character.character.images?.jpg?.image_url || null,
        mal_id: character.character.mal_id,
      }));

      setAvailableCharacters(processedCharacters);
      console.log('Processed Characters:', processedCharacters);
    } catch (error) {
      console.error('Error fetching characters:', error);
      setError('Failed to fetch characters. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Characters</h1>
      <button onClick={fetchCharacters} disabled={loading} style={{ padding: '8px 16px', cursor: 'pointer' }}>
        {loading ? 'Fetching...' : 'Fetch Characters'}
      </button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {availableCharacters.length > 0 ? (
        <ul style={{ listStyleType: 'none', padding: 0 }}>
          {availableCharacters.map((character) => (
            <li key={character.mal_id} style={{ marginBottom: '16px', display: 'flex', alignItems: 'center' }}>
              {character.image_url ? (
                <img 
                  src={character.image_url} 
                  alt={character.name} 
                  style={{ width: '100px', height: 'auto', borderRadius: '8px', marginRight: '16px' }} 
                />
              ) : (
                <div 
                  style={{
                    width: '100px',
                    height: '150px',
                    backgroundColor: '#ccc',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '8px',
                    marginRight: '16px',
                    color: '#fff',
                    fontSize: '14px'
                  }}
                >
                  No Image Available
                </div>
              )}
              <div>
                <h2 style={{ margin: '0 0 8px 0' }}>{character.name}</h2>
                <p><strong>MAL ID:</strong> {character.mal_id}</p>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        !loading && <p>No characters fetched yet. Click "Fetch Characters" to load data.</p>
      )}
    </div>
  );
}
