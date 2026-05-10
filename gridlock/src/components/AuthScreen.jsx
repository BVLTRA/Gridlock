import React from 'react';
import './AuthScreen.css';

const AuthScreen = () => {
  // Creating an array of 9 empty slots for the grid
  const gridSlots = Array.from({ length: 9 });

  return (
    <div className="auth-container">
      <div className="auth-content">
        
        {/* Left Side: Text and Input */}
        <div className="text-section">
          <h1>Let's create<br/>your account</h1>
          <p>Join us to start building your custom workspace.</p>
          
          <div className="input-wrapper">
            <input 
              type="email" 
              placeholder="Enter your email" 
              className="email-input"
            />
          </div>
        </div>

        {/* Right Side: The Grid */}
        <div className="grid-section">
          <div className="crafting-grid">
            {gridSlots.map((_, index) => (
              <div key={index} className="grid-cell" data-slot={index}>
                {/* My Minecraft items will eventually go here */}
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default AuthScreen;