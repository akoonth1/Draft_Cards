// Column.jsx
import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, horizontalListSortingStrategy } from '@dnd-kit/sortable';
import { useCardContext } from './CardContext';
import Card from './Card';

function Column({ id, title, cards }) {
  const { isOver, setNodeRef } = useDroppable({
    id: id,
  });

  const { clearColumn, removeColumn } = useCardContext(); // Access removeColumn from context

  // Calculate total points
  const totalPoints = cards.reduce((sum, card) => sum + (card.points || 0), 0);

  const columnStyle = {
    margin: '16px 0', // Adjust margin for vertical spacing
    padding: '16px',
    backgroundColor: isOver ? '#cce5ff' : '#f0f0f0',
    borderRadius: '8px',
    width: '100%', // Make column take full width or adjust as needed
    maxWidth: '90vw', // Optional: Limit maximum width
    minHeight: '20vh',
    boxShadow: isOver ? '0 0 10px rgba(0, 123, 255, 0.5)' : 'none',
    transition: 'background-color 0.3s ease, box-shadow 0.3s ease',
    position: 'relative',
  };

  const headerStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    marginBottom: '16px',
  };

  const removeButtonStyle = {
    position: 'absolute',
    left: '0',
    top: '50%',
    transform: 'translateY(-50%)',
    backgroundColor: 'transparent',
    border: 'none',
    color: '#ff4d4f',
    fontWeight: 'bold',
    cursor: 'pointer',
    fontSize: '16px',
  };

  const cardsContainerStyle = {
    display: 'flex',
    flexDirection: 'row', // Arrange cards horizontally
    flexWrap: 'wrap', // Allow wrapping to new lines if necessary
    gap: '16px', // Space between cards
    overflowX: 'auto', // Enable horizontal scrolling if overflow
  };

  return (
    <div ref={setNodeRef} style={columnStyle}>
      <div style={headerStyle}>
        {/* "X" Remove Button */}
        <button
          onClick={() => removeColumn(id)}
          style={removeButtonStyle}
          aria-label={`Remove ${title} column`}
        >
          ×
        </button>
        
        {/* Column Title and Total Points */}
        <h2 style={{ textAlign: 'center', flexGrow: 1 }}>
          {title} <span style={{ fontSize: '16px', color: '#555' }}>({totalPoints} pts)</span>
        </h2>
      </div>

      {/* Clear Column Button */}
      <button 
        onClick={() => clearColumn(id)} 
        style={{
          position: 'absolute',
          top: '16px',
          right: '16px',
          padding: '4px 8px',
          backgroundColor: '#ff4d4f',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
        }}
      >
        Clear
      </button>

      {/* Cards within the Column */}
      <SortableContext
        items={cards.map(card => card.id)}
        strategy={horizontalListSortingStrategy} // Use horizontal sorting strategy
      >
        <div style={cardsContainerStyle}>
          {cards.map((card, index) => (
            <Card
              key={card.id}
              id={card.id}
              image_url={card.image_url}
              index={index}
            />
          ))}
        </div>
      </SortableContext>
    </div>
  );
}

export default Column;
