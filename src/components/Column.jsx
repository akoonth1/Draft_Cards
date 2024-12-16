import Card from "./Card";
import { CSS } from "@dnd-kit/utilities";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { useDroppable } from "@dnd-kit/core";

function Column({ id, title, cards }) {
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
    width: 300,
    backgroundColor: isOver ? "rgba(0, 0, 0, 0.1)" : "transparent",
    border: '2px solid #ccc',
    borderRadius: '4px',
    margin: '8px',
    transition: 'background-color 0.2s ease'
  };

  return (
    <div className="column">
      <h3 className="column-title">{title || id}</h3>
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
              columnId={id}
            >
              {card.title || card.id}
            </Card>
          ))}
        </SortableContext>
      </div>
    </div>
  );
}

export default Column;