import { useState } from 'react';

function FormInfo({ initialText = '', onSubmit }) {
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(initialText);

  const handleSubmit = () => {
    onSubmit?.(text);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setText(initialText);
    setIsEditing(false);
  };

  return (
    <div style={{ position: 'relative' }}>
      {isEditing ? (
        <div style={{ display: 'flex', gap: '8px' }}>
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            autoFocus
            style={{
              padding: '8px 12px',
              border: '1px solid #ccc',
              borderRadius: '4px',
              fontSize: '14px',
              outline: 'none',
              flex: 1
            }}
          />
          <button 
            onClick={handleSubmit}
            style={{
              padding: '8px 16px',
              backgroundColor: '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Save
          </button>
          <button 
            onClick={handleCancel}
            style={{
              padding: '8px 16px',
              backgroundColor: '#f44336',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Cancel
          </button>
        </div>
      ) : (
        <div
          onClick={() => setIsEditing(true)}
          style={{
            padding: '8px 12px',
            border: '1px solid transparent',
            borderRadius: '4px',
            cursor: 'text',
            minHeight: '20px',
          }}
        >
          {text || 'Click to edit...'}
        </div>
      )}
    </div>
  );
}

export default FormInfo;