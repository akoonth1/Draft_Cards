import React, { useState, useEffect, useCallback } from 'react';
import { CSS } from '@dnd-kit/utilities';
import { useSortable } from '@dnd-kit/sortable';
import { useCardContext } from './CardContext';

function Card({ id, isDragging, image_url }) {
  const { getCardById, updateCardPoints } = useCardContext();
  const cardData = getCardById(id) || {};
  const [tempPoints, setTempPoints] = useState(cardData.points || 0);
  const [showPoints, setShowPoints] = useState(true);
  const [isHovered, setIsHovered] = useState(false);

  const handlePointChange = useCallback((newPoints) => {
    const validPoints = Math.max(0, parseInt(newPoints, 10) || 0);
    setTempPoints(validPoints);
    updateCardPoints(id, validPoints);
  }, [id, updateCardPoints]);

  const incrementPoints = (e) => {
    e.stopPropagation();
    const newVal = tempPoints + 1;
    setTempPoints(newVal); 
    updateCardPoints(id, newVal);
  };

  const decrementPoints = (e) => {
    e.stopPropagation();
    const newVal = Math.max(0, tempPoints - 1);
    setTempPoints(newVal);
    updateCardPoints(id, newVal);
  };

  const handlePointsChange = (e) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      handlePointChange(value);
    }
  };

  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });
  const [isEditingPoints, setIsEditingPoints] = useState(false);

  // Sync with cardData changes
  useEffect(() => {
    // Remove or comment out the line that resets tempPoints:
    setTempPoints(cardData.points || 0);
  }, [cardData.points]);

  const handlePointsClick = () => {
    setIsEditingPoints(true);
  };

  const handlePointsBlur = () => {
    const newPoints = parseInt(tempPoints, 10) || 0;
    updateCardPoints(id, newPoints);
    setIsEditingPoints(false);
  };



  const handleTogglePoints = () => {
    setShowPoints(!showPoints);
  };

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: transition || 'transform 250ms ease',
    backgroundImage: `url(${image_url || cardData.image_url})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    width: '120px',
    height: '200px',
    padding: '0px',
    margin: '0 0 0px 0',
    backgroundColor: 'white',
    border: isHovered ? '2px solid #00adee' : '1px solid #ccc', // highlight on hover
    borderRadius: '4px',
    cursor: 'grab', // show grab cursor
    position: 'relative',
    opacity: isDragging ? 0.8 : 1,
  };

  return (
    <div ref={setNodeRef} style={style}>

      {/* Rest of card content */}
      <div 
        onClick={(e) => {
          if (isEditingPoints) e.stopPropagation();
        }}
      >
        {/* Toggle Button */}
        <button
          onClick={handleTogglePoints}
          style={{ position: 'absolute', top: '4px', left: '4px', backgroundColor: 'rgba(241, 230, 230, 0.6)', width: "1vw" , height: "2vh", textAlign: "center", fontSize: "8px" }}
        >
          {showPoints ? 'P' : 'O'}
        </button>

        {/* Conditionally render points */}
        {!showPoints && (
          <div
            style={{
              position: 'absolute',
              top: '8px',
              right: '8px',
              backgroundColor: 'rgba(0, 0, 0, 0.6)',
              color: 'white',
              padding: '4px 8px',
              borderRadius: '12px',
              fontSize: '10px',
              fontWeight: 'bold',
              display: 'flex',
              alignItems: 'center',
              cursor: 'pointer',
            }}
            onClick={handlePointsClick}
            onMouseDown={(e) => e.stopPropagation()}
            onTouchStart={(e) => e.stopPropagation()}
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                decrementPoints(e);
              }}
              onMouseDown={(e) => e.stopPropagation()}
              onTouchStart={(e) => e.stopPropagation()}
              style={{
                marginRight: '4px',
                backgroundColor: 'transparent',
                border: 'none',
                color: 'white',
                fontSize: '10px',
                cursor: 'pointer',
              }}
            >
              -
            </button>

            {isEditingPoints ? (
              <input
                type="text"
                value={tempPoints}
                onChange={handlePointsChange}
                onBlur={handlePointsBlur}
                autoFocus
                style={{
                  width: '30px',
                  textAlign: 'center',
                  border: 'none',
                  outline: 'none',
                  backgroundColor: 'transparent',
                  color: 'white',
                  fontWeight: 'bold',
                }}
                onMouseDown={(e) => e.stopPropagation()}
                onTouchStart={(e) => e.stopPropagation()}
              />
            ) : (
              <span>{tempPoints}</span> // Display tempPoints, not cardData.points
            )}
            <button
              onClick={incrementPoints}
              onMouseDown={(e) => e.stopPropagation()}
              onTouchStart={(e) => e.stopPropagation()}
              style={{
                marginLeft: '4px',
                backgroundColor: 'transparent',
                border: 'none',
                color: 'white',
                fontSize: '10px',
                cursor: 'pointer',
              }}
            >
              +
              
            </button>
          </div>
        )}
      {/* Enlarged Drag Handle fills card */}
      <div
        {...listeners}
        {...attributes}
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: '100%',
          height: '80%',
          cursor: 'grab',
          zIndex: 99,
          // invisible but capturing pointer events:
          opacity: 0,
        }}
      />
        {/* Information at the Bottom Center */}
        <div style={{
          padding: '0px',
          backgroundColor: 'rgba(15, 15, 32, 0.6)',
          borderRadius: '10px',
          position: 'absolute',
          bottom: '0',
          width: '100%',
          color: 'white',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          fontSize: '12px',
      
        }}>
          <h3 style={{ margin: '8px 0' }}>{cardData.title || 'Untitled'}</h3>
        </div>
      </div>
    </div>
  );
}

export default Card;