import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import GlowOrbs from './GlowOrb'; // MORE ORBSSS

const Dashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = location.state?.user || { name: 'Explorer' };

  const [content, setContent] = useState('');
  const [saveStatus, setSaveStatus] = useState('All changes saved');
  const typingTimeoutRef = useRef(null);

  useEffect(() => {
    const fetchNotes = async () => {
      const token = localStorage.getItem('gridlock_token');
      try {
        const response = await fetch('http://localhost:5000/api/notes', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        if (response.ok) {
          setContent(data.notes || '');
        }
      } catch (err) {
        console.error("Failed to load notes");
      }
    };
    fetchNotes();
  }, []);

  const handleTextChange = (e) => {
    const newText = e.target.value;
    setContent(newText);
    setSaveStatus('Saving...');

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

    typingTimeoutRef.current = setTimeout(async () => {
      const token = localStorage.getItem('gridlock_token');
      try {
        const response = await fetch('http://localhost:5000/api/notes', {
          method: 'PUT',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` 
          },
          body: JSON.stringify({ notes: newText })
        });
        if (response.ok) {
          setSaveStatus('All changes saved');
        } else {
          setSaveStatus('Failed to save');
        }
      } catch (err) {
        setSaveStatus('Offline - Changes not saved');
      }
    }, 1000);
  };

  const handleLogout = () => {
    localStorage.removeItem('gridlock_token'); 
    navigate('/'); 
  };

  return (
    // Note: 'overflow: hidden' to prevent the orbs from breaking the window boundaries
    <div style={{ minHeight: '100vh', backgroundColor: '#0a0a0a', color: '#fff', position: 'relative', overflow: 'hidden' }}>
      
      {/* Orbs mount at z-index: 0 */}
      <GlowOrbs />

      {/* Content Wrapper sets text and nav to z-index: 10 */}
      <div style={{ position: 'relative', zIndex: 10 }}>
        <nav style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '24px 5%', borderBottom: '1px solid #222'
        }}>
          <div style={{ fontSize: '1.2rem', fontWeight: 'bold', letterSpacing: '1px' }}>
            GRIDLOCK // NOTEBOOK
          </div>
          <div style={{ display: 'flex', gap: '32px', alignItems: 'center' }}>
            <span style={{ cursor: 'pointer', color: '#888' }}>Notes</span>
            <span style={{ cursor: 'pointer', color: '#888' }}>Account</span>
            <span style={{ cursor: 'pointer', color: '#888' }}>About this project</span>
            <button 
              onClick={handleLogout}
              style={{
                background: 'transparent', border: '1px solid #333', color: '#fff',
                padding: '8px 16px', borderRadius: '8px', cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onMouseOver={(e) => e.target.style.borderColor = '#666'}
              onMouseOut={(e) => e.target.style.borderColor = '#333'}
            >
              Logout
            </button>
          </div>
        </nav>

        <main style={{ 
          display: 'flex', flexDirection: 'column', alignItems: 'center', 
          paddingTop: '10vh', maxWidth: '800px', margin: '0 auto' 
        }}>
          <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '1rem' }}>
            <h2 style={{ fontSize: '2.5rem', fontWeight: '400', margin: 0 }}>
              What would you like to type, {user.name}?
            </h2>
            <span style={{ fontSize: '0.85rem', color: saveStatus === 'All changes saved' ? '#4ade80' : '#888' }}>
              {saveStatus}
            </span>
          </div>
          <textarea 
            placeholder="Start typing..."
            value={content}
            onChange={handleTextChange}
            style={{
              width: '100%', minHeight: '400px', backgroundColor: '#0000006b', color: '#eee',
              border: '1px solid #333', borderRadius: '12px', padding: '24px',
              fontSize: '1.1rem', lineHeight: '1.6', resize: 'vertical', outline: 'none'
            }}
            onFocus={(e) => e.target.style.borderColor = '#555'}
            onBlur={(e) => e.target.style.borderColor = '#333'}
          />
        </main>
      </div>
    </div>
  );
};

export default Dashboard;