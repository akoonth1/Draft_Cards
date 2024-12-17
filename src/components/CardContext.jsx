// CardContext.jsx
import React, { createContext, useContext, useState, useCallback } from 'react';

// Create the context
const CardContext = createContext();

// Provider component
export const CardProvider = ({ children }) => {
  const [columns, setColumns] = useState([
    {
      id: 'column-1',
      title: 'To Do',
      cards: [
        { id: 'card-1', title: 'Card 1', points: 0, image_url: null, mal_id: null, infoText: '' },
        { id: 'card-2', title: 'Card 2', points: 0, image_url: null, mal_id: null, infoText: '' },
        { id: 'card-3', title: 'Card 3', points: 0, image_url: null, mal_id: null, infoText: '' },
      ],
    },
    {
      id: 'column-2',
      title: 'In Progress',
      cards: [
        { id: 'card-4', title: 'Card 4', points: 0, image_url: null, mal_id: null, infoText: '' },
        { id: 'card-5', title: 'Card 5', points: 0, image_url: null, mal_id: null, infoText: '' },
        { id: 'card-6', title: 'Card 6', points: 0, image_url: null, mal_id: null, infoText: '' },
      ],
    },
    {
      id: 'column-3',
      title: 'Done',
      cards: [
        { id: 'card-7', title: 'Card 7', points: 0, image_url: null, mal_id: null, infoText: '' },
        { id: 'card-8', title: 'Card 8', points: 0, image_url: null, mal_id: null, infoText: '' },
        { id: 'card-9', title: 'Card 9', points: 0, image_url: null, mal_id: null, infoText: '' },
      ],
    },
  ]);

  const [columnCount, setColumnCount] = useState(4); // Adjust initial count as needed
  const [cardCount, setCardCount] = useState(10); // Starting from 10 since 9 cards exist

  // Add a new column
  const addColumn = (title) => {
    const newColumn = {
      id: `column-${columnCount}`,
      title: title || `New Column ${columnCount}`,
      cards: [],
    };
    setColumns((prev) => [...prev, newColumn]);
    setColumnCount((prev) => prev + 1);
  };

  // Remove a column if it's empty
  const removeColumn = (columnId) => {
    setColumns((prevColumns) => prevColumns.filter((col) => col.id !== columnId));
  };

  // Update column title
  const updateColumnTitle = (columnId, newTitle) => {
    setColumns((prev) =>
      prev.map((col) =>
        col.id === columnId ? { ...col, title: newTitle } : col
      )
    );
  };

  // Add a new card to a specific column
  const addCard = (columnId, cardData) => {
    const newCard = {
      id: `card-${cardCount}`,
      title: cardData.title || `Card ${cardCount}`,
      points: cardData.points || 0,
      image_url: cardData.image_url || null,
      mal_id: cardData.mal_id || null,
      infoText: cardData.infoText || '',
    };
    setColumns((prev) =>
      prev.map((col) =>
        col.id === columnId ? { ...col, cards: [...col.cards, newCard] } : col
      )
    );
    setCardCount((prev) => prev + 1);
  };

  // Remove a card from a column
  const removeCard = (cardId) => {
    setColumns((prev) =>
      prev.map((col) => ({
        ...col,
        cards: col.cards.filter((card) => card.id !== cardId),
      }))
    );
  };

  // Update card points
  const updateCardPoints = (cardId, newPoints) => {
    setColumns((prevColumns) =>
      prevColumns.map((column) => ({
        ...column,
        cards: column.cards.map((card) =>
          card.id === cardId ? { ...card, points: newPoints } : card
        ),
      }))
    );
  };

  const updateCardInfoText = (cardId, newInfoText) => {
    setColumns((prevColumns) =>
      prevColumns.map((column) => ({
        ...column,
        cards: column.cards.map((card) =>
          card.id === cardId ? { ...card, infoText: newInfoText } : card
        ),
      }))
    );
  };

  // Move card between columns
  const moveCard = (activeId, overId) => {
    setColumns((prevColumns) => {
      let activeCard;
      let sourceColumnId;
      let destinationColumnId;

      // Find and remove the active card from its source column
      const newColumns = prevColumns.map((column) => {
        if (column.cards.some((card) => card.id === activeId)) {
          sourceColumnId = column.id;
          activeCard = column.cards.find((card) => card.id === activeId);
          return {
            ...column,
            cards: column.cards.filter((card) => card.id !== activeId),
          };
        }
        return column;
      });

      // Determine the destination column
      if (overId.startsWith('column')) {
        destinationColumnId = overId;
      } else {
        prevColumns.forEach((column) => {
          if (column.cards.some((card) => card.id === overId)) {
            destinationColumnId = column.id;
          }
        });
      }

      // Add the card to the destination column
      return newColumns.map((column) => {
        if (column.id === destinationColumnId && activeCard) {
          return {
            ...column,
            cards: [...column.cards, activeCard],
          };
        }
        return column;
      });
    });
  };

  const getCardById = useCallback(
    (cardId) => {
      console.log('getCardById called with cardId:', cardId);
      for (const column of columns) {
        const foundCard = column.cards.find((card) => card.id === cardId);
        if (foundCard) {
          console.log('Card found:', foundCard);
          return foundCard;
        }
      }
      console.log('Card not found for id:', cardId);
      return null;
    },
    [columns] // Ensure it updates when columns change
  );

  return (
    <CardContext.Provider
      value={{
        columns,
        addColumn,
        removeColumn,
        updateColumnTitle,
        addCard,
        removeCard,
        updateCardPoints,
        moveCard,
        columnCount,
        cardCount,
        setColumns,
        updateCardInfoText,
        getCardById,
      }}
    >
      {children}
    </CardContext.Provider>
  );
};

// Custom hook for accessing the context
export const useCardContext = () => useContext(CardContext);

const initialColumns = [
  {
    id: 'column-1',
    title: 'To Do',
    cards: [
      {
        id: 'card-1',
        title: 'Sample Card',
        points: 0, // Ensure points property exists
        image_url: null,
        mal_id: null,
        infoText: '',
      },
      // ...other cards
    ],
  },
  // ...other columns
];