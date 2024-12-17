// Column.jsx
import { useState } from 'react';
import Card from "./Card";
import { CSS } from "@dnd-kit/utilities";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { useDroppable } from "@dnd-kit/core";

function Column({ id, title, cards, onPointsChange, onTitleChange, addCard, removeCard, removeColumn }) {
  const { setNodeRef, isOver } = useDroppable({
    id,
    data: {
      type: 'column',
      accepts: ['card']
    }
  });

  const style = {
    padding: 16,
    minHeight: 200,
    width: 400,
    backgroundColor: isOver ? "rgba(0, 0, 0, 0.1)" : "transparent",
    border: '2px solid #ccc',
    borderRadius: '4px',
    margin: '8px',
    transition: 'background-color 0.2s ease'
  };

  // Calculate total points
  const totalPoints = cards.reduce((sum, card) => sum + (card.points || 0), 0);

  // State for editing title
  const [isEditing, setIsEditing] = useState(false);
  const [tempTitle, setTempTitle] = useState(title);

  const handleTitleClick = () => {
    setIsEditing(true);
  };

  const handleTitleChangeLocal = (e) => {
    setTempTitle(e.target.value);
  };

  const handleTitleSave = () => {
    onTitleChange(id, tempTitle);
    setIsEditing(false);
  };

  const handleTitleCancel = () => {
    setTempTitle(title);
    setIsEditing(false);
  };

  const handleAddCard = () => {
    addCard(id);
  };

  const handleRemoveColumn = () => {
    if (cards.length > 0) {
      alert("Cannot remove a column that is not empty.");
      return;
    }
    removeColumn(id);
  };

  return (
    <div className="column">
      <h3 className="column-title">
        {isEditing ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <input
              type="text"
              value={tempTitle}
              onChange={handleTitleChangeLocal}
              autoFocus
              style={{
                flex: 1,
                padding: '6px 10px',
                border: '1px solid #ccc',
                borderRadius: '4px',
                fontSize: '14px',
                outline: 'none',
              }}
            />
            <button
              onClick={handleTitleSave}
              style={{
                padding: '6px 12px',
                backgroundColor: '#4CAF50',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              Save
            </button>
            <button
              onClick={handleTitleCancel}
              style={{
                padding: '6px 12px',
                backgroundColor: '#f44336',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              Cancel
            </button>
          </div>
        ) : (
          <span onClick={handleTitleClick} style={{ cursor: 'pointer' }}>
            {title || 'Untitled Column'}
          </span>
        )}
      </h3>
      <div style={{ marginBottom: '8px', fontWeight: 'bold' }}>
        Total Points: {totalPoints}
      </div>
      <div ref={setNodeRef} style={style}>
        <SortableContext 
          id={id} 
          items={cards.map(card => card.id)} 
          strategy={verticalListSortingStrategy}
        >
          {cards.map((card) => (
            <Card 
              key={card.id} 
              id={card.id} 
              title={card.title}
              points={card.points}
              isDragging={card.isDragging}
              onPointsChange={onPointsChange}
              removeCard={removeCard} // Pass removeCard handler
            />
          ))}
        </SortableContext>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '12px' }}>
        <button 
          onClick={handleAddCard} 
          style={{ padding: '6px 12px', cursor: 'pointer' }}
        >
          Add Card
        </button>
        {cards.length === 0 && (
          <button 
            onClick={handleRemoveColumn} 
            style={{ 
              padding: '6px 12px', 
              cursor: 'pointer', 
              backgroundColor: '#f44336',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
            }}
          >
            Remove Column
          </button>
        )}
      </div>
    </div>
  );
}

export default Column;