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
    backgroundColor: isDragging ? "#e1e1e1" : "#f9f9f9", // Light background for better visibility
    backgroundImage: `url('https://via.placeholder.com/400x200.png?text=Card+Background')`, // Placeholder image
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    border: "1px solid #ccc",
    borderRadius: "4px",
    cursor: "default",
    opacity: isDragging ? 0.5 : 1,
    touchAction: "none",
    color: '#fff', // Ensure text is readable over the background image
    position: 'relative',
  };

  const overlayStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Dark overlay for text readability
    borderRadius: "4px",
  };

  const handlePointsChangeLocal = (newPoints) => {
    onPointsChange?.(id, newPoints);
  };

  const handleRemove = () => {
    removeCard(id);
  };

  // Handler to disable spacebar on drag handle
  const handleKeyDown = (e) => {
    if (e.key === ' ') {
      e.preventDefault();
    }
  };

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      {...attributes}
    >
      <div style={overlayStyle}></div> {/* Overlay for better text visibility */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', position: 'relative' }}>
        
        {/* Enhanced Drag Handle */}
        <div 
          {...listeners} 
          style={{
            cursor: 'grab',
            paddingTop: '8px',
            textAlign: 'right',
            userSelect: 'none',
            fontSize: '20px',
            color: '#fff',
          }}
          onClick={(e) => e.stopPropagation()} 
          aria-label="Drag Handle"
          onKeyDown={handleKeyDown} // Disable spacebar
          tabIndex={0} // Make the drag handle focusable
        >
          &#x2630; {/* Hamburger Icon */}
     

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
        </div>
        
        {/* FormInfo Section (Handles Points) */}
        <FormInfo 
          points={points}
          onPointsChange={handlePointsChangeLocal}
        />

        {/* Remove Button */}
        <button 
          onClick={handleRemove}
          style={{
            padding: '4px 8px',
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            color: 'gray',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            alignSelf: 'flex-end',
          }}
        >
          Remove
        </button>
        </div>
      </div>
    </div>
  );
}

export default Card;