import {
  closestCenter,
  DndContext,
  DragOverlay,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { arrayMove, sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import Column from "./Column";
import Card from "./Card";
import { useState } from "react";

export default function Board() {
  const [columns, setColumns] = useState([
    {
      id: 'column-1',
      title: 'To Do',
      cards: [
        { 
          id: 'card-1', 
          title: 'Click to edit title...', 
          points: 0,
          isEditing: false 
        },
        { 
          id: 'card-2', 
          title: 'Click to edit title...', 
          points: 0,
          isEditing: false 
        },
        { 
          id: 'card-3', 
          title: 'Click to edit title...', 
          points: 0,
          isEditing: false 
        },
      ],
    },
    {
      id: 'column-2',
      title: 'In Progress',
      cards: [
        { 
          id: 'card-4', 
          title: 'Click to edit title...', 
          points: 0,
          isEditing: false 
        },
        { 
          id: 'card-5', 
          title: 'Click to edit title...', 
          points: 0,
          isEditing: false 
        },
        { 
          id: 'card-6', 
          title: 'Click to edit title...', 
          points: 0,
          isEditing: false 
        },
      ],
    },
    {
      id: 'column-3',
      title: 'Done',
      cards: [
        { 
          id: 'card-7', 
          title: 'Click to edit title...', 
          points: 0,
          isEditing: false 
        },
        { 
          id: 'card-8', 
          title: 'Click to edit title...', 
          points: 0,
          isEditing: false 
        },
        { 
          id: 'card-9', 
          title: 'Click to edit title...', 
          points: 0,
          isEditing: false 
        },
      ],
    }
  ]);

  const [activeId, setActiveId] = useState(null);
  const [activeCard, setActiveCard] = useState(null);

  // Initialize sensors with activation constraints
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5, // Minimum distance (in pixels) before drag starts
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

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

    // Optional: Visual feedback can be handled here without moving the card
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
      // Same column - just reorder
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

  return (
    <div>
      <h1>Board</h1>
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
              onTitleChange={handleTitleChange}
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
            />
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}