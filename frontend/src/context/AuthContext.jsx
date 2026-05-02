import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Restore session from localStorage
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    if (storedUser && token) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (err) {
        // Corrupted localStorage — clear it
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        localStorage.removeItem('role');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    const { token, role, name, email: userEmail } = res.data;
    const userData = { name, email: userEmail, role };
    // Save everything to localStorage
    localStorage.setItem('token', token);
    localStorage.setItem('role', role);
    localStorage.setItem('name', name);
    localStorage.setItem('email', userEmail);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
    return userData;
  };

  const signup = async (name, email, password) => {
    const res = await api.post('/auth/register', { name, email, password });
    const { token, role, name: userName, email: userEmail } = res.data;
    const userData = { name: userName, email: userEmail, role };
    localStorage.setItem('token', token);
    localStorage.setItem('role', role);
    localStorage.setItem('name', userName);
    localStorage.setItem('email', userEmail);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
    return userData;
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('role');
    localStorage.removeItem('name');
    localStorage.removeItem('email');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
