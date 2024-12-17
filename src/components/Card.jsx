import React from 'react';
import { CSS } from "@dnd-kit/utilities";
import { useSortable } from "@dnd-kit/sortable";
import { useCardContext } from './CardContext';
import FormInfo from "./FormInfo";

function Card({ id, isDragging }) {
  const { 
    attributes, 
    listeners, 
    setNodeRef, 
    transform, 
    transition,
  } = useSortable({ id });

  const { getCardById, updateCardPoints, removeCard } = useCardContext();
  const cardData = getCardById(id);

  if (!cardData) {
    console.warn(`Card data not found for id: ${id}`);
    return null;
  }

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    padding: 16,
    margin: "0 0 8px 0",
    backgroundColor: isDragging ? "#e1e1e1" : "white",
    backgroundImage: cardData.image_url
      ? `url(${cardData.image_url})`
      : 'url("https://via.placeholder.com/400x200.png?text=No+Image")',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    border: "1px solid #ccc",
    borderRadius: "4px",
    cursor: "default",
    opacity: isDragging ? 0.5 : 1,
    touchAction: "none",
    color: '#fff',
    position: 'relative',
  };

  const overlayStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: "4px",
  };

  const handlePointsChangeLocal = (newPoints) => {
    updateCardPoints(id, newPoints);
  };

  const handleRemove = () => {
    removeCard(id);
  };

  // Handler to disable spacebar on drag handle
  const handleKeyDown = (e) => {
    if (e.key === ' ') {
      e.preventDefault();
    }
  };

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      {...attributes}
    >
      <div style={overlayStyle}></div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', position: 'relative' }}>
        
        {/* Drag Handle */}
        <div 
          {...listeners} 
          style={{
            cursor: 'grab',
            paddingTop: '8px',
            textAlign: 'right',
            userSelect: 'none',
            fontSize: '20px',
            color: '#fff',
          }}
          onClick={(e) => e.stopPropagation()} 
          aria-label="Drag Handle"
          onKeyDown={handleKeyDown}
          tabIndex={0}
        >
          &#x2630;
        </div>

        {/* Title Section */}
        <div
          style={{ 
            padding: '4px 8px',
            border: '1px solid transparent',
            borderRadius: '4px',
            cursor: 'default',
            width: '100%',
            fontSize: '16px',
            fontWeight: 'bold',
            textAlign: 'left',
            color: '#fff',
          }}
        >
          {cardData.title || 'Untitled'}
        </div>

        {/* Points Section */}
        <div
          style={{ 
            padding: '4px 8px',
            color: '#fff',
          }}
        >
          <span>Points: {cardData.points}</span>
          <button onClick={() => handlePointsChangeLocal(cardData.points + 1)}>+</button>
          <button onClick={() => handlePointsChangeLocal(cardData.points - 1)}>-</button>
        </div>

        {/* Info Section */}
        <FormInfo id={id} />

        {/* Remove Button */}
        <button 
          onClick={handleRemove}
          style={{
            padding: '4px 8px',
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            color: 'gray',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            alignSelf: 'flex-end',
          }}
        >
          Remove
        </button>
      </div>
    </div>
  );
}

export default Card;