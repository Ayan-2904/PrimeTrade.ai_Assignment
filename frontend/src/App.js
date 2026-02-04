import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';

// Import pages
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="app">
          <Toaster position="top-right" />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/" element={<Dashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;