import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AuthFlow from './pages/AuthFlow';
import Dashboard from './components/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Route 1: Login/Signup screen */}
        <Route path="/" element={<AuthFlow />} />
        
        {/* Route 2: The Dashboard*/}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </Router>
  );
};

export default App;