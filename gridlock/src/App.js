import React, { useState, useEffect } from 'react';

// 1. Import your Dumb UI Components
import AuthScreen from './components/AuthScreen';
import InventorySearch from './components/InventorySearch';
import CraftingGrid from './components/CraftingGrid';

// 2. Import your pure logic engine
import { validateRecipe } from './lib/engine';

const App = () => {
  // State 1: The 9 slots of the crafting table
  const [grid, setGrid] = useState(Array(9).fill(null));
  
  // State 2: The item the user currently selected from the dropdown
  const [itemInHand, setItemInHand] = useState(null);

  // State 3: What did the grid just create?
  const [craftedItem, setCraftedItem] = useState(null);

  // The Observer: Every time the grid changes, check the recipe book
  useEffect(() => {
    const result = validateRecipe(grid);
    setCraftedItem(result);
  }, [grid]); 

  // The Action: Dropping an item into a slot
  const handleSlotClick = (slotIndex) => {
    // If they aren't holding anything, don't do anything
    if (!itemInHand) return;

    // Create a copy of the grid, update the specific slot, and save it
    const newGrid = [...grid];
    newGrid[slotIndex] = itemInHand;
    setGrid(newGrid);

    // Optional: Clear their hand after they place it, 
    // or let them keep holding it to place multiple!
    setItemInHand(null); 
  };

  return (
    // We pass our components and state down into the AuthScreen layout
    <AuthScreen 
      leftChild={
        <>
          <InventorySearch onSelectItem={(item) => setItemInHand(item)} />
          {itemInHand && (
            <p style={{ color: '#888', marginTop: '1rem' }}>
              Holding: {itemInHand.icon} {itemInHand.name} 
              (Click a grid slot to place)
            </p>
          )}
          {craftedItem && (
            <div style={{ marginTop: '2rem', color: '#00ff00' }}>
              Successfully crafted: {craftedItem.name}!
            </div>
          )}
        </>
      }
      rightChild={
        <CraftingGrid 
          currentGrid={grid} 
          onSlotClick={handleSlotClick} 
        />
      }
    />
  );
};

export default App;