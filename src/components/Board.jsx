// Board.jsx
import React, { useState, useEffect } from 'react';
import { DndContext, DragOverlay, rectIntersection } from '@dnd-kit/core';
import { useCardContext } from './CardContext';
import Column from './Column';
import Card from './Card';
import { arrayMove, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';

export default function Board() {
  const { columns, moveCard, addColumn, getCardById } = useCardContext();
  const [activeId, setActiveId] = useState(null);
  const [activeCard, setActiveCard] = useState(null);
  const [newColumnTitle, setNewColumnTitle] = useState('');
  const [isAddingColumn, setIsAddingColumn] = useState(false);

  const handleAddColumn = () => {
    if (newColumnTitle.trim() !== '') {
      addColumn(newColumnTitle.trim());
      setNewColumnTitle('');
      setIsAddingColumn(false);
    }
  };

  const handleDragStart = (event) => {
    setActiveId(event.active.id);
    const card = getCardById(event.active.id);
    setActiveCard(card);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (!over) {
      setActiveId(null);
      setActiveCard(null);
      return;
    }

    const activeId = active.id;
    const overId = over.id;

    // Determine the source and destination columns
    let fromColumnId = null;
    let toColumnId = null;

    columns.forEach(column => {
      if (column.cards.some(card => card.id === activeId)) {
        fromColumnId = column.id;
      }
      if (column.cards.some(card => card.id === overId)) {
        toColumnId = column.id;
      }
    });

    // If dropping over a column (not a card), move to that column's end
    if (columns.some(column => column.id === overId)) {
      toColumnId = overId;
    }

    if (fromColumnId && toColumnId) {
      moveCard(activeId, overId, fromColumnId, toColumnId);
    }

    setActiveId(null);
    setActiveCard(null);
  };

  const handleDragCancel = () => {
    setActiveId(null);
    setActiveCard(null);
  };

  // Handler to clear localStorage and reload the app
  const handleClearLocalStorage = () => {
    localStorage.removeItem('columnsData');
    window.location.reload();
  };

  return (
    <div>
      <h1>Draft Box</h1>
      
      {/* Reset Board Button */}
      <button 
        onClick={handleClearLocalStorage} 
        style={{ 
          marginBottom: '16px', 
          backgroundColor: '#ff4d4f', 
          color: 'white', 
          padding: '8px 16px', 
          border: 'none', 
          borderRadius: '4px', 
          cursor: 'pointer',
          marginRight: '8px'
        }}
      >
        Reset Board
      </button>

      {isAddingColumn ? (
        <div style={{ marginBottom: '16px' }}>
          <input
            type="text"
            value={newColumnTitle}
            onChange={(e) => setNewColumnTitle(e.target.value)}
            placeholder="Enter column name"
            style={{ marginRight: '8px', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
          />
          <button 
            onClick={handleAddColumn} 
            style={{ marginRight: '4px', padding: '8px 16px', border: 'none', borderRadius: '4px', cursor: 'pointer', backgroundColor: '#1a1a1a', color: 'white' }}
          >
            Add
          </button>
          <button 
            onClick={() => setIsAddingColumn(false)} 
            style={{ padding: '8px 16px', border: 'none', borderRadius: '4px', cursor: 'pointer', backgroundColor: '#ccc' }}
          >
            Cancel
          </button>
        </div>
      ) : (
        <button 
          onClick={() => setIsAddingColumn(true)} 
          style={{ 
            marginBottom: '16px', 
            padding: '8px 16px', 
            border: 'none', 
            borderRadius: '4px', 
            cursor: 'pointer', 
            backgroundColor: '#1a1a1a', 
            color: 'white' 
          }}
        >
          Add Column
        </button>
      )}
      <DndContext 
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragCancel={handleDragCancel}
        collisionDetection={rectIntersection}
      >
        <div style={boardStyle}>
          <SortableContext
            items={columns.map(column => column.id)}
            strategy={verticalListSortingStrategy} // Arrange columns vertically
          >
            {Array.isArray(columns) && columns.length > 0 ? (
              columns.map((column) => (
                <Column 
                  key={column.id}
                  id={column.id}
                  title={column.title}
                  cards={column.cards.map(card => ({
                    ...card,
                    isDragging: card.id === activeId,
                    image_url: card.image_url
                  }))}
                />
              ))
            ) : (
              <p>No columns available. Please add a column.</p>
            )}
          </SortableContext>
        </div>
        <DragOverlay>
          {activeId && activeCard ? (
            <Card 
              key={activeId}
              id={activeId} 
              isDragging={true}
              image_url={activeCard.image_url}
              title={activeCard.title}
              points={activeCard.points}
            />
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}

const boardStyle = {
  display: 'flex',
  flexDirection: 'column', // Stack columns vertically
  alignItems: 'center',
  padding: '16px',
  backgroundColor: '#e9ecef',
  minHeight: '100vh',
  minWidth: '100vw',
};
