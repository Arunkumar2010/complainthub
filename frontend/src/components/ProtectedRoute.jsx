import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, role }) => {
  const { user, loading } = useAuth();

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
    </div>
  );

  // No token or user → redirect to login
  const token = localStorage.getItem('token');
  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  // Admin-only route: non-admins get sent back to /home
  if (role === 'admin' && user.role !== 'admin') {
    return <Navigate to="/home" replace />;
  }

  return children;
};

export default ProtectedRoute;
