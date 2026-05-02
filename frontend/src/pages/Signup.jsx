import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import { Loader2, AlertCircle } from 'lucide-react';

const Signup = () => {
  const [selectedRole, setSelectedRole] = useState('user');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      return setError('Passwords do not match');
    }
    
    setIsLoading(true);
    setError('');
    try {
      const response = await axios.post('/auth/register', {
        name,
        email, 
        password,
        role: selectedRole
      });
      
      const { data } = response;
      localStorage.setItem('token', data.token);
      localStorage.setItem('role', data.role);
      localStorage.setItem('name', data.name);
      localStorage.setItem('email', data.email);
      localStorage.setItem('user', JSON.stringify({ name: data.name, email: data.email, role: data.role }));

      if (data.role === 'admin') {
        window.location.href = '/admin';
      } else if (data.role === 'staff') {
        window.location.href = '/staff';
      } else {
        window.location.href = '/home';
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create account');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-[#1e40af] to-[#0d9488] p-4">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl p-10 overflow-y-auto max-h-[95vh] custom-scrollbar">
        {/* Logo */}
        <div className="flex items-center gap-4 mb-8 justify-center">
          <div className="bg-gradient-to-br from-blue-600 to-blue-800 w-12 h-12 rounded-xl flex items-center justify-center shadow-lg border border-gray-100">
            <span className="text-white font-bold text-[1.5rem]">C</span>
          </div>
          <div className="flex flex-col items-start leading-tight">
            <h1 className="text-gray-900 font-bold text-[1.5rem] tracking-tight">ComplaintHub</h1>
            <p className="text-gray-500 text-[0.85rem] font-medium">Complaint Management System</p>
          </div>
        </div>

        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-800">Create Account</h2>
          <p className="text-gray-500 text-sm mt-1">Choose your role and join us</p>
        </div>

        {/* Role Selector */}
        <div className="flex flex-col md:flex-row gap-4 justify-center mb-8">
          {/* Card 1 - Student */}
          <div 
            onClick={() => setSelectedRole('user')}
            className={`flex-1 p-4 border-2 rounded-xl cursor-pointer transition-all text-center flex flex-col items-center gap-1 ${selectedRole === 'user' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-white hover:border-blue-200'}`}
          >
            <span className="text-2xl">🎓</span>
            <h4 className="font-bold text-gray-900 text-sm">Student</h4>
            <p className="text-[10px] text-gray-500 font-medium leading-tight">Submit and track complaints</p>
          </div>

          {/* Card 2 - Staff */}
          <div 
            onClick={() => setSelectedRole('staff')}
            className={`flex-1 p-4 border-2 rounded-xl cursor-pointer transition-all text-center flex flex-col items-center gap-1 ${selectedRole === 'staff' ? 'border-green-500 bg-green-50' : 'border-gray-200 bg-white hover:border-green-200'}`}
          >
            <span className="text-2xl">💼</span>
            <h4 className="font-bold text-gray-900 text-sm">Staff</h4>
            <p className="text-[10px] text-gray-500 font-medium leading-tight">Manage department issues</p>
          </div>

          {/* Card 3 - Admin */}
          <div 
            onClick={() => setSelectedRole('admin')}
            className={`flex-1 p-4 border-2 rounded-xl cursor-pointer transition-all text-center flex flex-col items-center gap-1 ${selectedRole === 'admin' ? 'border-purple-500 bg-purple-50' : 'border-gray-200 bg-white hover:border-purple-200'}`}
          >
            <span className="text-2xl">🏛️</span>
            <h4 className="font-bold text-gray-900 text-sm">Admin</h4>
            <p className="text-[10px] text-gray-500 font-medium leading-tight">Manage and resolve complaints</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-sm font-bold text-gray-700 ml-1">Full Name</label>
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your full name"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm font-medium"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-bold text-gray-700 ml-1">Email Address</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm font-medium"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-bold text-gray-700 ml-1">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Create a password"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm font-medium"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-bold text-gray-700 ml-1">Confirm Password</label>
            <input 
              type="password" 
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm your password"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm font-medium"
              required
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-100 text-red-600 text-xs font-bold p-3 rounded-lg flex items-center gap-3">
              <AlertCircle size={14} /> {error}
            </div>
          )}

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg py-3 mt-4 shadow-lg transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-70"
          >
            {isLoading ? (
              <Loader2 size={20} className="animate-spin" />
            ) : (
              "Create Account"
            )}
          </button>
        </form>

        <div className="mt-8 flex flex-col items-center gap-4">
          <p className="text-sm text-gray-500 font-medium">
            Already have an account? {' '}
            <span 
              onClick={() => navigate('/login')} 
              className="text-blue-600 font-bold cursor-pointer hover:underline"
            >
              Sign In
            </span>
          </p>
          <span 
            onClick={() => navigate('/')} 
            className="text-blue-600 text-sm font-bold cursor-pointer hover:underline flex items-center gap-1"
          >
            ← Back to Home
          </span>
        </div>
      </div>
    </div>
  );
};

export default Signup;
