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

  const [activeId, setActiveId] = useState(null);
  const [activeCard, setActiveCard] = useState(null);



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
    
      setColumns((prevColumns) => {
        const activeCardIndex = activeColumn.cards.findIndex(card => card.id === activeId);
        const activeCard = activeColumn.cards[activeCardIndex];
        
        return prevColumns.map(column => {
          // Remove from source column
          if (column.id === activeColumn.id) {
            const newCards = [...column.cards];
            newCards.splice(activeCardIndex, 1);
            return { ...column, cards: newCards };
          }
          
          // Add to target column
          if (column.id === overColumn.id) {
            const overIndex = column.cards.findIndex(card => card.id === overId);
            const insertIndex = overIndex >= 0 ? overIndex : column.cards.length;
            const newCards = [...column.cards];
            newCards.splice(insertIndex, 0, activeCard);
            return { ...column, cards: newCards };
          }
          
          return column;
        });
      });
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
      }
    };
    
      return (
        <div>
          <h1>Board</h1>
          <DndContext
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragStart={handleDragStart}
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
            
            <DragOverlay>
              {activeId && activeCard ? (
                <Card 
                  id={activeId}
                  {...activeCard}
                  isDragging={true}
                />
              ) : null}
            </DragOverlay>
          </DndContext>
        </div>
      );

}