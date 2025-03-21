import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Activities from './pages/Activities';
import Expeditions from './pages/Expeditions';
import Guides from './pages/Guides';
import Explorers from './pages/Explorers';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Register from './pages/Register';
import NotFound from './pages/NotFound';
import './styles/main.css';

// Protected route component
const ProtectedRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem('token');
    if (token) {
      try {
        // In a real app, you might want to validate the token with the server
        // For now, we just check if it exists and hasn't expired
        const decoded = JSON.parse(atob(token.split('.')[1]));
        const currentTime = Date.now() / 1000;
        
        if (decoded.exp && decoded.exp > currentTime) {
          setIsAuthenticated(true);
        } else {
          // Token expired
          localStorage.removeItem('token');
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('Error validating token:', error);
        localStorage.removeItem('token');
        setIsAuthenticated(false);
      }
    } else {
      setIsAuthenticated(false);
    }
    
    setLoading(false);
  }, []);

  if (loading) {
    // Show loading spinner while checking authentication
    return (
      <div className="full-page-loader">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirect to login if not authenticated
    return <Navigate to="/login" replace />;
  }

  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Protected routes */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/activities" 
          element={
            <ProtectedRoute>
              <Activities />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/expeditions" 
          element={
            <ProtectedRoute>
              <Expeditions />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/guides" 
          element={
            <ProtectedRoute>
              <Guides />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/explorers" 
          element={
            <ProtectedRoute>
              <Explorers />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/profile" 
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } 
        />
        
        {/* Redirect root to dashboard or login */}
        <Route 
          path="/" 
          element={
            localStorage.getItem('token') 
              ? <Navigate to="/dashboard" replace /> 
              : <Navigate to="/login" replace />
          } 
        />
        
        {/* 404 page */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;