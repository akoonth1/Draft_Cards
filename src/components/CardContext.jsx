// CardContext.jsx
import React, { createContext, useContext, useState, useCallback } from 'react';
import { arrayMove } from '@dnd-kit/sortable';

export const CardContext = createContext();

export function CardProvider({ children }) {
  const [columns, setColumns] = useState([
    {
      id: 'column-1',
      title: 'Source',
      cards: []
    },
    {
      id: 'column-2',
      title: 'Team 1',
      cards: []
    },
    {
      id: 'column-3',
      title: 'Team 2',
      cards: []
    }
  ]);

  const updateCardPoints = (id, points) => {
    setColumns(prev =>
      prev.map(col => ({
        ...col,
        cards: col.cards.map(card =>
          card.id === id ? { ...card, points } : card
        )
      }))
    );
  };

  // Function to add a new card from a character
  const addCardFromCharacter = (columnId, character) => {
    const newCardId = `card-${character.mal_id}`;

    // Check if the card already exists in any column
    const cardExists = columns.some(column =>
      column.cards.some(card => card.id === newCardId)
    );

    if (cardExists) {
      console.warn(`Card with id ${newCardId} already exists. Skipping addition.`);
      return false; // Indicate that the card was not added
    }

    const newCard = {
      id: newCardId, // Ensuring uniqueness
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

    console.log(`Card added: ${JSON.stringify(newCard)}`);
    return true; // Indicate successful addition
  };


  // Function to move or reorder a card
  const moveCard = (activeId, overId, fromColumnId, toColumnId) => {
    if (fromColumnId === toColumnId) {
      // Reordering within the same column
      const column = columns.find(col => col.id === fromColumnId);
      const oldIndex = column.cards.findIndex(card => card.id === activeId);
      const newIndex = column.cards.findIndex(card => card.id === overId);

      if (oldIndex === -1 || newIndex === -1) return;

      const newCards = arrayMove(column.cards, oldIndex, newIndex);

      setColumns(prevColumns =>
        prevColumns.map(col =>
          col.id === fromColumnId
            ? { ...col, cards: newCards }
            : col
        )
      );

      console.log(`Reordered card in ${fromColumnId}: ${activeId} to position ${newIndex}`);
    } else {
      // Moving to a different column
      const sourceColumn = columns.find(col => col.id === fromColumnId);
      const targetColumn = columns.find(col => col.id === toColumnId);
      const cardToMove = sourceColumn.cards.find(card => card.id === activeId);

      if (!cardToMove) return;

      // Remove card from source column
      const updatedSourceCards = sourceColumn.cards.filter(card => card.id !== activeId);
      // Insert card into target column at the overIndex position
      const overIndex = targetColumn.cards.findIndex(card => card.id === overId);
      const insertIndex = overIndex === -1 ? targetColumn.cards.length : overIndex;

      const updatedTargetCards = [
        ...targetColumn.cards.slice(0, insertIndex),
        cardToMove,
        ...targetColumn.cards.slice(insertIndex)
      ];

      setColumns(prevColumns =>
        prevColumns.map(col => {
          if (col.id === fromColumnId) {
            return { ...col, cards: updatedSourceCards };
          }
          if (col.id === toColumnId) {
            return { ...col, cards: updatedTargetCards };
          }
          return col;
        })
      );

      console.log(`Moved card ${activeId} from ${fromColumnId} to ${toColumnId} at position ${insertIndex}`);
    }
  };

  // Function to add a new column
  const addColumn = (title) => {
    const newColumn = {
      id: `column-${Date.now()}`, // Unique ID based on timestamp
      title,
      cards: []
    };
    setColumns(prevColumns => [...prevColumns, newColumn]);
    console.log(`Added new column: ${title}`);
  };

  // Function to get card by ID
  const getCardById = (id) => {
    if (!id) {
      console.warn('getCardById called with undefined id');
      return null;
    }

    for (const column of columns) {
      const card = column.cards.find(card => card.id === id);
      if (card) {
        return card;
      }
    }
    console.warn(`Card not found with id: ${id}`);
    return null;
  };

  // Function to clear all cards in a column
  const clearColumn = (columnId) => {
    setColumns(prevColumns =>
      prevColumns.map(col =>
        col.id === columnId
          ? { ...col, cards: [] }
          : col
      )
    );
    console.log(`Cleared all cards from ${columnId}`);
  };

  return (
    <CardContext.Provider
      value={{
        columns,
        addCardFromCharacter,
        moveCard,
        addColumn,
        getCardById,
        clearColumn,
        updateCardPoints, // Added here
      }}
    >
      {children}
    </CardContext.Provider>
  );
};

// Custom hook for accessing the context
export const useCardContext = () => useContext(CardContext);