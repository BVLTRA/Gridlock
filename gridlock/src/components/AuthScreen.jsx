import React from 'react';
import './AuthScreen.css';
import GlowOrbs from './GlowOrb'; // Import the orbs here

const AuthScreen = ({ leftChild, rightChild }) => {
  return (
    <div className="auth-container">
      
      {/* The super duper extra mega magic orbs from the wizard of the cosmos */}
      <GlowOrbs />

      {/* Content now floats above the new orbs */}
      <div className="auth-content">
        
        {/* Left Side: Email and Toolbox */}
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

          <div className="toolbox-wrapper" style={{ marginTop: '2rem' }}>
             <p style={{ color: '#888', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
               Craft your authentication key:
             </p>
             {leftChild}
          </div>
        </div>

        {/* Right Side: Grid */}
        <div className="grid-section">
           {rightChild}
        </div>

      </div>
    </div>
  );
};

export default AuthScreen;