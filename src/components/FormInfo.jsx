import { useState } from 'react';

function FormInfo({ points = 0, onPointsChange }) {
  const [isEditingInfo, setIsEditingInfo] = useState(false);
  const [infoText, setInfoText] = useState('');
  
  const [isEditingPoints, setIsEditingPoints] = useState(false);
  const [pointsInput, setPointsInput] = useState(points.toString());
  
  const [tempInfoText, setTempInfoText] = useState(infoText);
  const [tempPoints, setTempPoints] = useState(pointsInput);

  // Handlers for Info Text
  const handleInfoClick = () => {
    setTempInfoText(infoText);
    setIsEditingInfo(true);
  };

  const handleInfoChange = (e) => {
    setTempInfoText(e.target.value);
  };

  const handleInfoSave = () => {
    setInfoText(tempInfoText);
    // Implement onSubmit for info text if needed
    setIsEditingInfo(false);
  };

  const handleInfoCancel = () => {
    setTempInfoText(infoText);
    setIsEditingInfo(false);
  };

  // Handlers for Points
  const handlePointsClick = (e) => {
    e.stopPropagation();
    setTempPoints(pointsInput);
    setIsEditingPoints(true);
  };

  const handlePointsChangeLocal = (e) => {
    setTempPoints(e.target.value);
  };

  const handlePointsSave = () => {
    const newPoints = parseInt(tempPoints, 10);
    if (!isNaN(newPoints)) {
      onPointsChange(newPoints);
    }
    setIsEditingPoints(false);
  };

  const handlePointsCancel = () => {
    setTempPoints(pointsInput);
    setIsEditingPoints(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      
      {/* Info Text Section */}
      <div>
        {isEditingInfo ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <input
              type="text"
              value={tempInfoText}
              onChange={handleInfoChange}
              autoFocus
              placeholder="Enter info..."
              style={{
                flex: 1,
                padding: '6px 10px',
                border: '1px solid #ccc',
                borderRadius: '4px',
                fontSize: '14px',
                outline: 'none',
                backgroundColor: '#fff',
              }}
            />
            <button
              onClick={handleInfoSave}
              style={{
                padding: '6px 12px',
                backgroundColor: '#4CAF50',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              Save
            </button>
            <button
              onClick={handleInfoCancel}
              style={{
                padding: '6px 12px',
                backgroundColor: '#f44336',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              Cancel
            </button>
          </div>
        ) : (
          <div
            onClick={handleInfoClick}
            style={{
              padding: '4px 8px',
              border: '1px solid transparent',
              borderRadius: '4px',
              cursor: 'text',
              minHeight: '20px',
            }}
          >
            {infoText || 'Click to add info...'}
          </div>
        )}
      </div>
      
      {/* Points Section */}
      <div>
        {isEditingPoints ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <input
              type="number"
              value={tempPoints}
              onChange={handlePointsChangeLocal}
              autoFocus
              style={{
                width: '80px',
                padding: '6px 10px',
                border: '1px solid #ccc',
                borderRadius: '4px',
                fontSize: '14px',
                outline: 'none',
                textAlign: 'right',
                backgroundColor: '#fff',
              }}
            />
            <button
              onClick={handlePointsSave}
              style={{
                padding: '6px 12px',
                backgroundColor: '#4CAF50',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              Save
            </button>
            <button
              onClick={handlePointsCancel}
              style={{
                padding: '6px 12px',
                backgroundColor: '#f44336',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              Cancel
            </button>
          </div>
        ) : (
          <div
            onClick={handlePointsClick}
            style={{
              padding: '4px 8px',
              border: '1px solid transparent',
              borderRadius: '4px',
              cursor: 'text',
              textAlign: 'right',
            }}
          >
            Points: {points}
          </div>
        )}
      </div>
      
    </div>
  );
}

export default FormInfo;