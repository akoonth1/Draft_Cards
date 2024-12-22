// Column.jsx
import React from 'react';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useDroppable } from '@dnd-kit/core';
import Card from './Card';
import { useCardContext } from './CardContext';

function Column({ id, title, cards }) {
  const { isOver, setNodeRef } = useDroppable({
    id: id,
  });

  const { clearColumn } = useCardContext(); // Access clearColumn from context

  const columnStyle = {
    margin: '0 16px',
    padding: '16px',
    backgroundColor: isOver ? '#cce5ff' : '#f0f0f0',
    borderRadius: '8px',
    width: '220px',
    minHeight: '100px',
    boxShadow: isOver ? '0 0 10px rgba(0, 123, 255, 0.5)' : 'none',
    transition: 'background-color 0.3s ease, box-shadow 0.3s ease',
    position: 'relative',
  };

  return (
    <div ref={setNodeRef} style={columnStyle}>
      <h2 style={{ textAlign: 'center' }}>{title}</h2>
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
      <SortableContext
        items={cards.map(card => card.id)}
        strategy={verticalListSortingStrategy}
      >
        {cards.map((card, index) => (
          <Card
            key={card.id}
            id={card.id}
            image_url={card.image_url}
            index={index}
          />
        ))}
      </SortableContext>
    </div>
  );
}

export default Column;