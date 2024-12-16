import {
  closestCenter,
  DndContext,
  DragOverlay,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  closestCorners,
} from '@dnd-kit/core';

import { arrayMove, sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import Column from "./column";
import Card from "./Card";
import { useState } from "react";

export default function Board() {
  const [columns, setColumns] = useState([
    {
      id: 'column-1',
      cards: [
        { id: 'card-1' },
        { id: 'card-2' },
        { id: 'card-3' },
      ],
    },
    {
      id: 'column-2',
      cards: [
        { id: 'card-4' },
        { id: 'card-5' },
        { id: 'card-6' },
      ],
    },
    {
      id: 'column-3',
      cards: [
        { id: 'card-7' },
        { id: 'card-8' },
        { id: 'card-9' },
      ],
    },
  ]);

  // Initialize sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

    // Updated findColumn function
    const findColumn = (id) => {
      // Check if the ID matches a column ID
      const column = columns.find((column) => column.id === id);
      if (column) return column;
      
      // Otherwise, find the column containing the card ID
      return columns.find((column) =>
        column.cards.some((card) => card.id === id)
      );
    };
    
    const handleDragEnd = (event) => {
      const { active, over } = event;
      if (!over) return;
    
      const activeId = String(active.id);
      const overId = String(over.id);
      const activeColumn = findColumn(activeId);
      const overColumn = findColumn(overId);
    
      if (!activeColumn || !overColumn) return;
    
      const activeIndex = activeColumn.cards.findIndex((i) => i.id === activeId);
      const overIndex = overColumn.cards.findIndex((i) => i.id === overId);
      
      const newIndex = overIndex >= 0 ? overIndex : overColumn.cards.length;
    
      setColumns((prevState) => 
        prevState.map((column) => {
          if (column.id === activeColumn.id) {
            return {
              ...column,
              cards: column.cards.filter((card) => card.id !== activeId)
            };
          }
          
          if (column.id === overColumn.id) {
            const newCards = [...column.cards];
            newCards.splice(newIndex, 0, activeColumn.cards[activeIndex]);
            return { ...column, cards: newCards };
          }
          
          return column;
        })
      );
    };
    
    const handleDragOver = (event) => {
      const { active, over } = event;
      if (!over) return;
    
      const activeId = String(active.id);
      const overId = String(over.id);
      const activeColumn = findColumn(activeId);
      const overColumn = findColumn(overId);
    
      if (!activeColumn || !overColumn || activeColumn === overColumn) return;
    
      setColumns((prevState) => {
        const activeItems = [...activeColumn.cards];
        const overItems = [...overColumn.cards];
        const activeIndex = activeItems.findIndex((i) => i.id === activeId);
        const overIndex = overItems.findIndex((i) => i.id === overId);
        
        const newIndex = overIndex >= 0 ? overIndex : overItems.length;
    
        return prevState.map((column) => {
          if (column.id === activeColumn.id) {
            return {
              ...column,
              cards: activeItems.filter((i) => i.id !== activeId)
            };
          }
          
          if (column.id === overColumn.id) {
            const newCards = [...overItems];
            newCards.splice(newIndex, 0, activeItems[activeIndex]);
            return { ...column, cards: newCards };
          }
          
          return column;
        });
      });
    };


    
    return (
      <div>
        <h1>Board</h1>
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragEnd={handleDragEnd}
          onDragOver={handleDragOver}
        >
          <div style={{ display: "flex" }}>
            {columns.map((column) => (
              <Column 
                key={column.id} 
                id={column.id} 
                title={`Column ${column.id}`}
                cards={column.cards}
              />
            ))}
          </div>
        </DndContext>
      </div>
    );

}