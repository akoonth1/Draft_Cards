import React, { useState, useEffect } from 'react';
import { useCardContext } from './CardContext';

function FormInfo({ id }) {
  const [isEditing, setIsEditing] = useState(false);
  const [tempInfo, setTempInfo] = useState('');
  const [cardData, setCardData] = useState(null);
  const [error, setError] = useState(null);
  const { getCardById, updateCardInfo } = useCardContext();

  useEffect(() => {
    if (!id) {
      setError('No card ID provided');
      return;
    }

    const card = getCardById(id);
    if (!card) {
      setError(`Card not found: ${id}`);
      return;
    }

    setCardData(card);
    setTempInfo(card.info || '');
    setError(null);
  }, [id, getCardById]);

  if (error) {
    return <div style={{ color: 'red', padding: '8px' }}>{error}</div>;
  }

  if (!cardData) {
    return <div>Loading...</div>;
  }

  const handleEdit = () => {
    setTempInfo(cardData?.info || '');
    setIsEditing(true);
  };

  const handleSave = () => {
    updateCardInfo(id, tempInfo);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  return (
    <div style={{ padding: '4px 8px' }}>
      {isEditing ? (
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <textarea
            value={tempInfo}
            onChange={(e) => setTempInfo(e.target.value)}
            style={{
              width: '100%',
              padding: '4px 8px',
              borderRadius: '4px',
              border: '1px solid #ccc',
              minHeight: '60px',
              resize: 'vertical'
            }}
          />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <button 
              onClick={handleSave}
              style={{
                padding: '4px 8px',
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
                padding: '4px 8px',
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
        </div>
      ) : (
        <div 
          onClick={handleEdit}
          style={{
            padding: '4px 8px',
            minHeight: '24px',
            cursor: 'pointer',
            color: '#fff'
          }}
        >
          {cardData?.info || 'Click to add info...'}
        </div>
      )}
    </div>
  );
}

export default FormInfo;