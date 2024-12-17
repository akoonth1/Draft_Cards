// DragHandle.jsx
import { useDraggable } from '@dnd-kit/core';

function DragHandle() {
  const { attributes, listeners } = useDraggable({
    id: 'unique-handle-id', // Use a unique ID or pass as a prop
  });

  return (
    <div 
      {...listeners} 
      {...attributes} 
      style={{ cursor: 'grab', padding: '8px' }}
    >
      &#x2630;
    </div>
  );
}

export default DragHandle;