// Board.jsx
import React, { useState } from 'react';
import { DndContext, DragOverlay, rectIntersection } from '@dnd-kit/core';
import { useCardContext } from './CardContext';
import Column from './Column';
import Card from './Card';
import { arrayMove } from '@dnd-kit/sortable';

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

  return (
    <div>
      <h1>Draft Box</h1>
      {isAddingColumn ? (
        <div style={{ marginBottom: '16px' }}>
          <input
            type="text"
            value={newColumnTitle}
            onChange={(e) => setNewColumnTitle(e.target.value)}
            placeholder="Enter column name"
            style={{ marginRight: '8px' }}
          />
          <button onClick={handleAddColumn} style={{ marginRight: '4px' }}>Add</button>
          <button onClick={() => setIsAddingColumn(false)}>Cancel</button>
        </div>
      ) : (
        <button onClick={() => setIsAddingColumn(true)} style={{ marginBottom: '16px' }}>
          Add Column
        </button>
      )}
      <DndContext 
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragCancel={handleDragCancel}
        collisionDetection={rectIntersection}
      >
        <div style={{ 
          display: "flex", 
          gap: '16px', 
          overflowX: 'auto',
          padding: '16px'
        }}>
          {columns.map((column) => (
            <Column 
              key={column.id}
              id={column.id}
              title={column.title}
              cards={column.cards.map(card => ({
                id: card.id, // Ensure ID is explicitly passed
                ...card,
                isDragging: card.id === activeId,
                image_url: card.image_url
              }))}
            />
          ))}
        </div>
        <DragOverlay>
          {activeId && activeCard ? (
            <Card 
              key={activeId}
              id={activeId} 
              isDragging={true}
              {...activeCard}
            />
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
