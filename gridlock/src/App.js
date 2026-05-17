import React, { useState, useEffect } from 'react';
import AuthScreen from './components/AuthScreen';
import InventoryGrid, { MINECRAFT_ITEMS } from './components/InventoryGrid';
import CraftingGrid from './components/CraftingGrid';
import { validateRecipe } from './lib/engine';

const App = () => {
  const [grid, setGrid] = useState(Array(9).fill(null));
  const [craftedItem, setCraftedItem] = useState(null);

  useEffect(() => {
    const result = validateRecipe(grid);
    setCraftedItem(result);
  }, [grid]); 

  // The Action: When an item is dropped onto the table
  const handleDropItem = (itemId, slotIndex) => {
    // Look up the full item data from our master list using the ID
    const itemData = MINECRAFT_ITEMS.find(item => item.id === itemId);
    if (!itemData) return;

    const newGrid = [...grid];
    newGrid[slotIndex] = itemData;
    setGrid(newGrid);
  };

  // The Action: When they click an item already on the table
  const handleRemoveItem = (slotIndex) => {
    const newGrid = [...grid];
    newGrid[slotIndex] = null; // Clear the slot
    setGrid(newGrid);
  };

  return (
    <AuthScreen 
      leftChild={
        <>
          <InventoryGrid />
          <p style={{ color: '#888', marginTop: '1rem', fontSize: '0.9rem' }}>
            Drag items from the toolbox into the grid. Click an item on the grid to remove it.
          </p>
          {craftedItem && (
            <div style={{ marginTop: '1rem', color: '#00ff00' }}>
              Valid Pattern Detected: {craftedItem.name}
            </div>
          )}
        </>
      }
      rightChild={
        <CraftingGrid 
          currentGrid={grid} 
          onDropItem={handleDropItem} 
          onSlotClick={handleRemoveItem} 
        />
      }
    />
  );
};

export default App;