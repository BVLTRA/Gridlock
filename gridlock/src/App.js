import React, { useState } from 'react';
import AuthScreen from './components/AuthScreen';
import InventoryGrid, { MINECRAFT_ITEMS } from './components/InventoryGrid';
import CraftingGrid from './components/CraftingGrid';

const App = () => {
  const [grid, setGrid] = useState(Array(9).fill(null));
  
  const [email, setEmail] = useState('');
  
  // State to handle the server's response (success or error messages)
  const [serverMessage, setServerMessage] = useState(null);
  const [isError, setIsError] = useState(false);

  // The Action: Drag and Drop stuff
  const handleDropItem = (itemId, slotIndex) => {
    const itemData = MINECRAFT_ITEMS.find(item => item.id === itemId);
    if (!itemData) return;
    const newGrid = [...grid];
    newGrid[slotIndex] = itemData;
    setGrid(newGrid);
  };

  const handleRemoveItem = (slotIndex) => {
    const newGrid = [...grid];
    newGrid[slotIndex] = null; 
    setGrid(newGrid);
  };

  const handleRegister = async () => {
    
    if (!email) {
      setIsError(true);
      setServerMessage("Please enter an email first.");
      return;
    }

    const gridString = grid.map(slot => slot ? slot.id : 'empty').join(',');

    try {
      // Network Call
      const response = await fetch('http://localhost:5000/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email, gridString: gridString })
      });

      // Unpack the JSON response from the server
      const data = await response.json();

      if (response.ok) {
        setIsError(false);
        setServerMessage(data.message); // "Account secured..."
      } else {
        setIsError(true);
        setServerMessage(data.error); // "Email already registered", etc.
      }
    } catch (err) {
      // If the Node server is turned off entirely, fetch throws a hard error
      setIsError(true);
      setServerMessage("Cannot connect to the server. Is it running?");
    }
  };

  return (
    <AuthScreen 
      // Passing the state down to the input fields
      email={email}
      setEmail={setEmail}
      leftChild={
        <>
          <InventoryGrid />
          <p style={{ color: '#888', marginTop: '1rem', fontSize: '0.9rem' }}>
            Drag items from the toolbox into the grid. Click an item on the grid to remove it.
          </p>
        </>
      }
      rightChild={
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
          <CraftingGrid 
            currentGrid={grid} 
            onDropItem={handleDropItem} 
            onSlotClick={handleRemoveItem} 
          />
          
          {/* THE SUBMIT BUTTON */}
          <button 
            onClick={handleRegister}
            style={{
              marginTop: '2.5rem',
              padding: '16px 24px',
              backgroundColor: '#ffffff', 
              color: '#000000',
              border: 'none',
              borderRadius: '12px',
              fontSize: '1.1rem',
              fontWeight: '600',
              cursor: 'pointer',
              width: '400px', 
              transition: 'transform 0.1s ease, background-color 0.2s ease'
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = '#e0e0e0'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#ffffff'}
            onMouseDown={(e) => e.target.style.transform = 'scale(0.98)'}
            onMouseUp={(e) => e.target.style.transform = 'scale(1)'}
          >
            Register
          </button>

          {/* Server Feedback */}
          {serverMessage && (
            <div style={{ 
              marginTop: '1.5rem', 
              color: isError ? '#ff4d4d' : '#00ff00',
              backgroundColor: isError ? 'rgba(255, 77, 77, 0.1)' : 'rgba(0, 255, 0, 0.1)',
              padding: '12px',
              borderRadius: '12px',
              width: '400px',
              maxWidth: '376px',
              textAlign: 'center',
              border: `1px solid ${isError ? 'rgba(255, 77, 77, 0.3)' : 'rgba(0, 255, 0, 0.3)'}`
            }}>
              {serverMessage}
            </div>
          )}
        </div>
      }
    />
  );
};

export default App;