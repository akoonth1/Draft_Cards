import React, { useState, useEffect } from 'react';
import { useCardContext } from './CardContext';

function FormInfo({ id }) {
  const { getCardById, updateCardInfoText } = useCardContext();
  const cardData = getCardById(id);

  if (!cardData) {
    console.warn(`Card data not found for id: ${id}`);
    return null;
  }

  // State for editing info text
  const [isEditingInfo, setIsEditingInfo] = useState(false);
  const [tempInfoText, setTempInfoText] = useState(cardData.infoText || '');

  useEffect(() => {
    setTempInfoText(cardData.infoText || '');
  }, [cardData.infoText]);

  // Handlers for editing info text
  const handleInfoClick = () => {
    setIsEditingInfo(true);
  };

  const handleInfoChangeLocal = (e) => {
    setTempInfoText(e.target.value);
  };

  const handleInfoSave = () => {
    updateCardInfoText(id, tempInfoText);
    setIsEditingInfo(false);
  };

  const handleInfoCancel = () => {
    setTempInfoText(cardData.infoText || '');
    setIsEditingInfo(false);
  };

  return (
    <div>
      {isEditingInfo ? (
        <div>
          <textarea
            value={tempInfoText}
            onChange={handleInfoChangeLocal}
            autoFocus
            style={{
              width: '100%',
              padding: '6px 10px',
              border: '1px solid #ccc',
              borderRadius: '4px',
              fontSize: '14px',
              outline: 'none',
              backgroundColor: '#fff',
              resize: 'vertical',
            }}
          />
          <button onClick={handleInfoSave}>Save</button>
          <button onClick={handleInfoCancel}>Cancel</button>
        </div>
      ) : (
        <div
          onClick={handleInfoClick}
          style={{
            padding: '4px 8px',
            cursor: 'text',
            minHeight: '20px',
          }}
        >
          {cardData.infoText || 'Click to add info...'}
        </div>
      )}
    </div>
  );
}

export default FormInfo;