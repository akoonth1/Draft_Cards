// Board.jsx
import React, { useState } from 'react';
import { DndContext } from '@dnd-kit/core';
import Column from './Column';
import { useCardContext } from './CardContext'; // Import the context hook

function Board() {
  const { columns, moveCard, addColumn } = useCardContext(); // Destructure addColumn
  const [newColumnTitle, setNewColumnTitle] = useState('');
  const [isAddingColumn, setIsAddingColumn] = useState(false);

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      moveCard(active.id, over.id);
    }
  };

  const handleAddColumn = () => {
    if (newColumnTitle.trim() !== '') {
      addColumn(newColumnTitle.trim());
      setNewColumnTitle('');
      setIsAddingColumn(false);
    }
  };

  return (
    <div>
      <h1>Kanban Board</h1>
      {isAddingColumn ? (
        <div>
          <input
            type="text"
            value={newColumnTitle}
            onChange={(e) => setNewColumnTitle(e.target.value)}
            placeholder="Enter column name"
          />
          <button onClick={handleAddColumn}>Add</button>
          <button onClick={() => setIsAddingColumn(false)}>Cancel</button>
        </div>
      ) : (
        <button onClick={() => setIsAddingColumn(true)} style={{ marginBottom: '16px' }}>
          Add Column
        </button>
      )}
      <DndContext onDragEnd={handleDragEnd}>
        <div style={{ display: "flex" }}>
          {columns.map((column) => (
            <Column 
              key={column.id}
              id={column.id}
              title={column.title}
              cards={column.cards}
            />
          ))}
        </div>
      </DndContext>
    </div>
  );
}

export default Board;