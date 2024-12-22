import React, { useState } from 'react';
import axios from 'axios';
import { useCardContext } from './CardContext';
import characterData from '../Data/characters.mjs';

export default function GrabImage() {
  const { addCardFromCharacter } = useCardContext();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null); // New state for success messages

  const normalizeName = (name) => 
    name.replace(/[^a-zA-Z0-9 ]/g, '').toLowerCase().trim();

  // Replace or expand these with your actual character lists
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
    setMessage(null); // Reset message
    try {
      const response = await axios.get('https://api.jikan.moe/v4/anime/21/characters');
      const filteredCharacters = response.data.data.filter((character) => {
        const characterName = normalizeName(character.character.name);
        console.log("Filtered characterName:", response.data.data);
        return allCharacterNames.includes(characterName);
      });

      // Transform data to only include relevant fields
      const processedCharacters = filteredCharacters.map((character) => ({
        name: character.character.name,
        image_url: character.character.images?.jpg?.image_url || 'https://via.placeholder.com/400x200.png?text=No+Image',
        mal_id: character.character.mal_id
      }));

      console.log("Processed Characters:", processedCharacters);

      // Keep track of duplicates
      let duplicates = [];

      // Populate the "To Do" column with each fetched character
      processedCharacters.forEach(character => {
        console.log(
          "Adding card - Name:",
          character.name,
          "| Image:",
          character.image_url,
          "| mal_id:",
          character.mal_id
        );
        const success = addCardFromCharacter('column-1', character);
        if (!success) {
          duplicates.push(character.name);
        }
      });

      if (duplicates.length > 0) {
        setMessage(`Skipped adding duplicate cards for: ${duplicates.join(', ')}`);
      } else {
        setMessage('All characters added successfully!');
      }

    } catch (error) {
      console.error('Error fetching characters:', error);
      setError('Failed to fetch characters. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button onClick={fetchCharacters} disabled={loading}>
        {loading ? 'Loading...' : 'Fetch Characters'}
      </button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {message && <p style={{ color: 'green' }}>{message}</p>}
    </div>
  );
}

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
