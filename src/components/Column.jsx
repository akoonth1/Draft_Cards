// Column.jsx
import React from 'react';
import Card from './Card';
import { useCardContext } from './CardContext';

function Column({ id, title, cards }) {
  const { removeColumn } = useCardContext();

  const handleRemoveColumn = () => {
    removeColumn(id);
  };

  // Estimate the height of a single card (adjust as needed)
  const cardHeight = 200; // Example card height in pixels

  const columnStyle = {
    margin: '0 16px',
    minHeight: `${2 * cardHeight}px`, // Minimum height set to two card heights
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#f0f0f0', // Optional: background color for visibility
    padding: '8px',
    borderRadius: '4px',
  };

  const headerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '8px',
  };

  const cardsContainerStyle = {
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
  };

  return (
    <div style={columnStyle}>
      <div style={headerStyle}>
        <h2>{title}</h2>
        <button
          onClick={handleRemoveColumn}
          style={{
            background: 'none',
            border: 'none',
            fontSize: '20px',
            cursor: 'pointer',
            color: 'red',
          }}
          aria-label="Remove Column"
        >
          &#x274C;
        </button>
      </div>
      <div style={cardsContainerStyle}>
        {cards.map((card) => (
          <Card key={card.id} id={card.id} isDragging={false} />
        ))}
      </div>
      {/* Additional column controls if any */}
    </div>
  );
}

export default Column;