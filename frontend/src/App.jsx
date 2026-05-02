import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Home from './pages/Home'
import SubmitComplaint from './pages/SubmitComplaint'
import MyComplaints from './pages/MyComplaints'
import Help from './pages/Help'
import Profile from './pages/Profile'
import AdminDashboard from './pages/AdminDashboard'
import StaffDashboard from './pages/StaffDashboard'
import ChatWidget from './components/ChatWidget'

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token')
  if (!token) return <Navigate to="/login" replace />
  return children
}

const AdminRoute = ({ children }) => {
  const token = localStorage.getItem('token')
  const role = localStorage.getItem('role')
  if (!token) return <Navigate to="/login" replace />
  if (role !== 'admin' && role !== 'staff') return <Navigate to="/home" replace />
  return children
}

function AppContent() {
  const location = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));

  useEffect(() => {
    const checkAuth = () => {
      setIsAuthenticated(!!localStorage.getItem('token'));
    };
    window.addEventListener('storage', checkAuth);
    // Also listen for a custom event if login/logout doesn't trigger 'storage' (same-window changes)
    window.addEventListener('authChange', checkAuth);
    
    checkAuth();
    return () => {
      window.removeEventListener('storage', checkAuth);
      window.removeEventListener('authChange', checkAuth);
    };
  }, []);

  const hideChatOn = ['/', '/login', '/signup'];
  const shouldShowChat = isAuthenticated && !hideChatOn.includes(location.pathname);

  return (
    <>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/home" element={
          <ProtectedRoute><Home /></ProtectedRoute>
        } />
        <Route path="/submit" element={
          <ProtectedRoute><SubmitComplaint /></ProtectedRoute>
        } />
        <Route path="/my-complaints" element={
          <ProtectedRoute><MyComplaints /></ProtectedRoute>
        } />
        <Route path="/help" element={
          <ProtectedRoute><Help /></ProtectedRoute>
        } />
        <Route path="/profile" element={
          <ProtectedRoute><Profile /></ProtectedRoute>
        } />
        <Route path="/admin" element={
          <AdminRoute><AdminDashboard /></AdminRoute>
        } />
        <Route path="/staff" element={
          <ProtectedRoute><StaffDashboard /></ProtectedRoute>
        } />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      {shouldShowChat && <ChatWidget />}
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  )
}

export default App

