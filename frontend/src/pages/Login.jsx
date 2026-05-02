import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import { 
  Loader2, AlertCircle, Mail, Lock, 
  Eye, EyeOff, ShieldCheck, User, GraduationCap, Briefcase
} from 'lucide-react';

const Login = () => {
  const [selectedRole, setSelectedRole] = useState('user'); // Default to student
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      const response = await axios.post('/auth/login', { email, password });
      const { token, role, name, email: userEmail } = response.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('role', role);
      localStorage.setItem('name', name);
      localStorage.setItem('email', userEmail || '');
      localStorage.setItem('user', JSON.stringify({ name, email: userEmail, role }));

      if (role === 'admin') {
        navigate('/admin');
      } else if (role === 'staff') {
        navigate('/staff');
      } else {
        navigate('/home');
      }
    } catch (err) {
      setError(err.response?.data?.error || err.response?.data?.message || 'Invalid credentials');
    } finally {
      setIsLoading(false);
    }
  };

  const roleConfig = {
    user: { 
      color: 'blue', 
      icon: <GraduationCap size={18} />, 
      label: 'Student',
      text: 'text-blue-600',
      bg: 'bg-blue-600',
      hover: 'hover:bg-blue-700',
      ring: 'focus:ring-blue-600/5',
      border: 'focus:border-blue-600',
      shadow: 'shadow-blue-600/20'
    },
    staff: { 
      color: 'green', 
      icon: <Briefcase size={18} />, 
      label: 'Staff',
      text: 'text-green-600',
      bg: 'bg-green-600',
      hover: 'hover:bg-green-700',
      ring: 'focus:ring-green-600/5',
      border: 'focus:border-green-600',
      shadow: 'shadow-green-600/20'
    },
    admin: { 
      color: 'purple', 
      icon: <ShieldCheck size={18} />, 
      label: 'Admin',
      text: 'text-purple-600',
      bg: 'bg-purple-600',
      hover: 'hover:bg-purple-700',
      ring: 'focus:ring-purple-600/5',
      border: 'focus:border-purple-600',
      shadow: 'shadow-purple-600/20'
    }
  };

  const theme = roleConfig[selectedRole];

  return (
    <div className="min-h-screen flex bg-gray-50 overflow-hidden">
      {/* Left Side: Branding (Desktop Only) */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#1e40af] to-[#0d9488] p-12 flex-col justify-between text-white relative">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-12">
            <div className="bg-white/10 backdrop-blur-md w-14 h-14 rounded-2xl flex items-center justify-center border border-white/20 shadow-xl">
              <span className="text-white font-bold text-2xl">C</span>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight">ComplaintHub</h1>
          </div>
          
          <div className="space-y-6 max-w-md">
            <h2 className="text-5xl font-black leading-tight">Your voice matters.</h2>
            <p className="text-xl text-blue-50/80 font-medium leading-relaxed">
              Submit, track, and resolve complaints efficiently with our state-of-the-art management system.
            </p>
          </div>
        </div>

        <div className="relative z-10 grid grid-cols-3 gap-6 pt-12 border-t border-white/10">
           <div className="flex flex-col items-center gap-2 opacity-80">
              <GraduationCap size={32} />
              <span className="text-xs font-bold uppercase tracking-widest">Students</span>
           </div>
           <div className="flex flex-col items-center gap-2 opacity-80">
              <Briefcase size={32} />
              <span className="text-xs font-bold uppercase tracking-widest">Staff</span>
           </div>
           <div className="flex flex-col items-center gap-2 opacity-80">
              <ShieldCheck size={32} />
              <span className="text-xs font-bold uppercase tracking-widest">Admin</span>
           </div>
        </div>
      </div>

      {/* Right Side: Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md animate-in fade-in slide-in-from-right-4 duration-500">
          <div className="text-center mb-10">
            <div className="lg:hidden flex items-center justify-center gap-3 mb-6">
              <div className="bg-blue-600 w-10 h-10 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-xl">C</span>
              </div>
              <h1 className="text-2xl font-bold text-gray-900">ComplaintHub</h1>
            </div>
            <h2 className="text-3xl font-black text-gray-900 tracking-tight">Welcome Back</h2>
            <p className="text-gray-500 font-medium mt-2">Sign in to your account to continue</p>
          </div>

          {/* Role Selector Tabs */}
          <div className="flex p-1 bg-gray-100 rounded-2xl mb-8 border border-gray-200">
            {Object.keys(roleConfig).map((role) => (
              <button
                key={role}
                onClick={() => setSelectedRole(role)}
                className={`flex-1 flex items-center justify-center gap-2 py-3 px-2 rounded-xl text-xs font-bold transition-all ${
                  selectedRole === role 
                    ? `bg-white ${roleConfig[role].text} shadow-md scale-[1.02]` 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {roleConfig[role].icon}
                <span className="hidden sm:inline">{roleConfig[role].label}</span>
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 ml-1">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors" size={18} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-12 pr-4 py-3.5 bg-white border border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-600/5 focus:border-blue-600 transition-all text-sm font-medium"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center ml-1">
                <label className="text-sm font-bold text-gray-700">Password</label>
                <button type="button" className={`text-xs font-bold ${theme.text} hover:underline transition-colors`}>
                  Forgot Password?
                </button>
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors" size={18} />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-12 pr-12 py-3.5 bg-white border border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-600/5 focus:border-blue-600 transition-all text-sm font-medium"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="flex items-center gap-3 ml-1 py-1">
               <input type="checkbox" id="remember" className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-600" />
               <label htmlFor="remember" className="text-xs font-bold text-gray-500 cursor-pointer select-none">Remember me for 30 days</label>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-100 text-red-600 text-xs font-bold p-4 rounded-2xl flex items-center gap-3 animate-in fade-in zoom-in-95">
                <AlertCircle size={16} /> {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full ${theme.bg} ${theme.hover} text-white font-bold rounded-2xl py-4 mt-2 shadow-lg ${theme.shadow} transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-70`}
            >
              {isLoading ? <Loader2 size={20} className="animate-spin" /> : 'Sign In to Dashboard'}
            </button>
          </form>

          <div className="mt-10 pt-10 border-t border-gray-100 text-center">
            <p className="text-sm text-gray-500 font-medium">
              Don't have an account?{' '}
              <button
                onClick={() => navigate('/signup')}
                className={`text-${theme.color}-600 font-bold hover:underline transition-colors`}
              >
                Create an account
              </button>
            </p>
            <button
              onClick={() => navigate('/')}
              className="mt-6 text-gray-400 text-xs font-bold hover:text-gray-600 transition-all uppercase tracking-widest flex items-center justify-center gap-2 mx-auto"
            >
              ← Back to landing page
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
