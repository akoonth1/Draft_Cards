import { CSS } from "@dnd-kit/utilities";
import { useSortable } from "@dnd-kit/sortable";
import FormInfo from "./FormInfo";

function Card({ id, title, points = 0, onPointsChange, isDragging, removeCard }) {
  const { 
    attributes, 
    listeners, 
    setNodeRef, 
    transform, 
    transition 
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    padding: 16,
    margin: "0 0 8px 0",
    backgroundColor: isDragging ? "#e1e1e1" : "white",
    border: "1px solid #ccc",
    borderRadius: "4px",
    cursor: "default", // Changed to default to avoid conflicting with drag handle
    opacity: isDragging ? 0.5 : 1,
    touchAction: "none",
  };

  const handlePointsChangeLocal = (newPoints) => {
    onPointsChange?.(id, newPoints);
  };

  const handleRemove = () => {
    removeCard(id);
  };

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      {...attributes}
      // Removed {...listeners} from the main div
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        
        {/* Title Section */}
        <div
          style={{ 
            padding: '4px 8px',
            border: '1px solid transparent',
            borderRadius: '4px',
            cursor: 'default',
            width: '100%',
            fontSize: '16px',
            fontWeight: 'bold',
            textAlign: 'left',
          }}
        >
          {title || 'Untitled'}
                  {/* Remove Button */}
        <button 
          onClick={handleRemove}
          style={{
            padding: '4px 8px',
            backgroundColor: 'white',
            color: 'gray',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            alignSelf: 'flex-end',
          }}
        >
          X
        </button>
        </div>
        
        {/* FormInfo Section (Handles Points) */}
        <FormInfo 
          points={points}
          onPointsChange={handlePointsChangeLocal}
        />



        {/* Enhanced Drag Handle */}
        <div 
          {...listeners} 
          style={{
            cursor: 'grab',
            paddingTop: '8px',
            textAlign: 'right',
            userSelect: 'none',
            fontSize: '20px', // Increased size for better touch support
            color: '#555', // Improved visibility
          }}
          onClick={(e) => e.stopPropagation()} 
          aria-label="Drag Handle"
        >
          &#x2630; {/* Hamburger Icon */}
        </div>
      </div>
    </div>
  );
}

export default Card;