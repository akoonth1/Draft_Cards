import { CSS } from "@dnd-kit/utilities";
import { useSortable } from "@dnd-kit/sortable";
import { useState } from "react";
import FormInfo from "./FormInfo";

function Card({ id, title, points = 0, onPointsChange, onTitleChange, isDragging }) {
  const [isEditing, setIsEditing] = useState(false);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [inputValue, setInputValue] = useState(points.toString());
  const [titleInput, setTitleInput] = useState(title);

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
    cursor: isEditing || isEditingTitle ? "default" : "grab",
    opacity: isDragging ? 0.5 : 1,
    touchAction: "none",
  };

  const pointsStyle = {
    padding: '4px 8px',
    border: '1px solid transparent',
    borderRadius: '4px',
    minWidth: '60px',
    textAlign: 'right',
    cursor: 'text',
  };

  const handlePointsClick = (e) => {
    e.stopPropagation();
    setIsEditing(true);
    setInputValue(points.toString());
  };

  const handlePointsChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleSubmitPoints = () => {
    const newPoints = parseInt(inputValue) || 0;
    onPointsChange?.(id, newPoints);
    setIsEditing(false);
  };

  const handleTitleClick = (e) => {
    e.stopPropagation();
    setIsEditingTitle(true);
    setTitleInput(title);
  };

  const handleTitleChange = (e) => {
    setTitleInput(e.target.value);
  };

  const handleTitleSubmit = () => {
    onTitleChange?.(id, titleInput);
    setIsEditingTitle(false);
  };

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      {...(!isEditing && !isEditingTitle ? { ...attributes, ...listeners } : {})}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        
        {/* Title Section */}
        <div 
          onClick={handleTitleClick}
          style={{ 
            cursor: 'text',
            width: '100%'
          }}
        >
          {isEditingTitle ? (
            <input
              type="text"
              value={titleInput}
              onChange={handleTitleChange}
              onBlur={handleTitleSubmit}
              onKeyDown={(e) => e.key === 'Enter' && handleTitleSubmit()}
              onClick={(e) => e.stopPropagation()}
              autoFocus
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #ccc',
                borderRadius: '4px',
                fontSize: '14px',
                outline: 'none'
              }}
            />
          ) : (
            <span>{title || 'Click to edit title...'}</span>
          )}
        </div>
        
        {/* Points and FormInfo Section */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <FormInfo />
          <div onClick={handlePointsClick}>
            {isEditing ? (
              <input
                type="text"
                value={inputValue}
                onChange={handlePointsChange}
                onBlur={handleSubmitPoints}
                onKeyDown={(e) => e.key === 'Enter' && handleSubmitPoints()}
                onClick={(e) => e.stopPropagation()}
                autoFocus
                style={{
                  width: '60px',
                  padding: '4px 8px',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  textAlign: 'right'
                }}
              />
            ) : (
              <div style={pointsStyle}>
                Points: {points}
              </div>
            )}
          </div>
        </div>

        {/* Drag Handle */}
        <div 
          {...listeners}
          {...attributes}
          style={{
            cursor: 'grab',
            paddingTop: '8px',
            textAlign: 'right',
            userSelect: 'none',
          }}
          onClick={(e) => e.stopPropagation()} // Prevent click from activating edit
        >
          &#x2630; {/* Hamburger Icon */}
        </div>
      </div>
    </div>
  );
}

export default Card;