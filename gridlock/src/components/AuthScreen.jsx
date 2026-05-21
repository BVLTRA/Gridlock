import React from 'react';
import './AuthScreen.css';
import GlowOrbs from './GlowOrb'; 

const AuthScreen = ({ leftChild, rightChild, email, setEmail }) => {
  return (
    <div className="auth-container">
      {/* The super duper extra mega magic orbs from the wizard of the cosmos */}
      <GlowOrbs />

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
              // The input is controlled by App.js
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="toolbox-wrapper" style={{ marginTop: '2rem' }}>
             <p style={{ color: '#888', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
               Craft your authentication key:
             </p>
             {leftChild}
          </div>
        </div>

        {/* Right Side: Crafting Grid */}
        <div className="grid-section">
           {rightChild}
        </div>
      </div>
    </div>
  );
};

export default AuthScreen;