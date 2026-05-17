import React from 'react';
import './AuthScreen.css';

const AuthScreen = ({ leftChild, rightChild }) => {
  return (
    <div className="auth-container">
      <div className="auth-content">
        
        {/* Left Side: Email AND Toolbox */}
        <div className="text-section">
          <h1>Let's create<br/>your account</h1>
          <p>Join us to start building your custom workspace.</p>
          
          {/* 1. The actual email input is back */}
          <div className="input-wrapper">
            <input 
              type="email" 
              placeholder="Enter your email" 
              className="email-input"
            />
          </div>

          {/* 2. A separate section for the crafting toolbox */}
          <div className="toolbox-wrapper" style={{ marginTop: '2rem' }}>
             <p style={{ color: '#888', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
               Craft your authentication key:
             </p>
             {leftChild}
          </div>
        </div>

        {/* Right Side: The Interactive Grid */}
        <div className="grid-section">
           {rightChild}
        </div>

      </div>
    </div>
  );
};

export default AuthScreen;