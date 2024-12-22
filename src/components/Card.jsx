import React from 'react';
import { CSS } from '@dnd-kit/utilities';
import { useSortable } from '@dnd-kit/sortable';
import { useCardContext } from './CardContext';

function Card({ id, isDragging, image_url }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });
  const { getCardById } = useCardContext();
  const cardData = getCardById(id) || {};

  console.log(`Rendering card: ${id}, title: ${cardData.title}`);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: transition || 'transform 250ms ease',
    backgroundImage: `url(${image_url || cardData.image_url})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    width: '200px',
    height: '350px',
    padding: 16,
    margin: '0 0 8px 0',
    backgroundColor: 'white',
    border: '1px solid #ccc',
    borderRadius: '4px',
    cursor: isDragging ? 'grabbing' : 'grab',
    position: 'relative',
    opacity: isDragging ? 0.8 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <div style={{ padding: '8px', backgroundColor: 'rgba(255, 255, 255, 0.7)', borderRadius: '4px' }}>
        <h3>{cardData.title || 'Untitled'}</h3>
        {/* Additional card content */}
      </div>
    </div>
  );
}

export default Card;