import {
  closestCenter,
  DndContext,
  DragOverlay,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import Column from "./Column";
import Card from "./Card";
import { useState } from "react";

export default function Board() {
  const [columns, setColumns] = useState([
    {
      id: 'column-1',
      title: 'To Do',
      cards: [
        { id: 'card-1', title: 'Card 1', points: 0 },
        { id: 'card-2', title: 'Card 2', points: 0 },
        { id: 'card-3', title: 'Card 3', points: 0 },
      ],
    },
    {
      id: 'column-2',
      title: 'In Progress',
      cards: [
        { id: 'card-4', title: 'Card 4', points: 0 },
        { id: 'card-5', title: 'Card 5', points: 0 },
        { id: 'card-6', title: 'Card 6', points: 0 },
      ],
    },
    {
      id: 'column-3',
      title: 'Done',
      cards: [
        { id: 'card-7', title: 'Card 7', points: 0 },
        { id: 'card-8', title: 'Card 8', points: 0 },
        { id: 'card-9', title: 'Card 9', points: 0 },
      ],
    },
  ]);

  const [activeId, setActiveId] = useState(null);
  const [activeCard, setActiveCard] = useState(null);
  const [columnCount, setColumnCount] = useState(4); // Starting from 4 since 3 columns exist

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5, // Minimum drag distance
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const addColumn = () => {
    const newColumnId = `column-${columnCount}`;
    const newColumn = {
      id: newColumnId,
      title: `New Column ${columnCount}`,
      cards: [],
    };
    setColumns([...columns, newColumn]);
    setColumnCount(columnCount + 1);
  };

  const findColumn = (id) => {
    const column = columns.find((column) => column.id === id);
    if (column) return column;
    return columns.find((column) =>
      column.cards.some((card) => card.id === id)
    );
  };

  const handleDragStart = (event) => {
    const { active } = event;
    setActiveId(active.id);

    const activeColumn = findColumn(active.id);
    if (activeColumn) {
      const card = activeColumn.cards.find(card => card.id === active.id);
      setActiveCard(card);
    }
  };

  const handleDragOver = (event) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    const activeColumn = findColumn(activeId);
    const overColumn = findColumn(overId);

    if (!activeColumn || !overColumn || activeColumn === overColumn) return;
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    setActiveId(null);
    setActiveCard(null);

    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    const activeColumn = findColumn(activeId);
    const overColumn = findColumn(overId);

    if (!activeColumn || !overColumn) return;

    if (activeColumn === overColumn) {
      // Same column - reorder
      const oldIndex = activeColumn.cards.findIndex(card => card.id === activeId);
      const newIndex = overColumn.cards.findIndex(card => card.id === overId);

      setColumns(prevColumns => 
        prevColumns.map(column => {
          if (column.id === activeColumn.id) {
            const newCards = [...column.cards];
            const [movedCard] = newCards.splice(oldIndex, 1);
            newCards.splice(newIndex, 0, movedCard);
            return { ...column, cards: newCards };
          }
          return column;
        })
      );
    } else {
      // Cross-column move
      const activeCardIndex = activeColumn.cards.findIndex(card => card.id === activeId);
      const activeCard = activeColumn.cards[activeCardIndex];
      const overIndex = overColumn.cards.findIndex(card => card.id === overId);
      const insertIndex = overIndex >= 0 ? overIndex : overColumn.cards.length;

      setColumns(prevColumns => 
        prevColumns.map(column => {
          if (column.id === activeColumn.id) {
            // Remove from source
            return {
              ...column,
              cards: column.cards.filter(card => card.id !== activeId)
            };
          }
          if (column.id === overColumn.id) {
            // Add to target
            const newCards = [...column.cards];
            newCards.splice(insertIndex, 0, activeCard);
            return { ...column, cards: newCards };
          }
          return column;
        })
      );
    }
  };

  const handlePointsChange = (cardId, newPoints) => {
    setColumns(prevColumns => 
      prevColumns.map(column => ({
        ...column,
        cards: column.cards.map(card => 
          card.id === cardId 
            ? { ...card, points: newPoints }
            : card
        )
      }))
    );
  };

  const handleTitleChange = (cardId, newTitle) => {
    setColumns(prevColumns => 
      prevColumns.map(column => ({
        ...column,
        cards: column.cards.map(card => 
          card.id === cardId 
            ? { ...card, title: newTitle }
            : card
        )
      }))
    );
  };

  const handleColumnTitleChange = (columnId, newTitle) => {
    setColumns(prevColumns =>
      prevColumns.map(column =>
        column.id === columnId
          ? { ...column, title: newTitle }
          : column
      )
    );
  };

  return (
    <div>
      <h1>Board</h1>
      <button onClick={addColumn} style={{ marginBottom: '16px', padding: '8px 16px' }}>
        Add Column
      </button>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragOver={handleDragOver}
      >
        <div style={{ display: "flex" }}>
          {columns.map((column) => (
            <Column 
              key={column.id} 
              id={column.id} 
              title={column.title}
              cards={column.cards.map(card => ({
                ...card,
                isDragging: card.id === activeId
              }))}
              onPointsChange={handlePointsChange}
              onTitleChange={handleColumnTitleChange}
            />
          ))}
        </div>
        <DragOverlay>
          {activeId ? (
            <Card
              id={activeId}
              title={activeCard?.title || 'Loading...'}
              points={activeCard?.points || 0}
              isDragging={true}
              onPointsChange={handlePointsChange}
              onTitleChange={handleTitleChange}
            />
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}