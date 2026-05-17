import React from 'react';
// Assuming the CSS from earlier is imported in your main App or AuthScreen

const CraftingGrid = ({ currentGrid, onSlotClick }) => {
  return (
    <div className="crafting-grid">
      {currentGrid.map((item, index) => (
        <div 
          key={index} 
          className="grid-cell" 
          data-slot={index}
          onClick={() => onSlotClick(index)}
          style={{
            // A little inline style to center the item perfectly inside the box
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            cursor: 'pointer' 
          }}
        >
          {/* If there is an item in this slot, render it. Otherwise, render nothing. */}
          {item && (
            <div className="crafted-item" title={item.name}>
              {/* If you switch to images later, this becomes <img src={item.icon} alt={item.name} /> */}
              <span style={{ fontSize: '2rem' }}>{item.icon}</span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default CraftingGrid;