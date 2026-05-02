import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  LogOut, User as UserIcon, Home, 
  LayoutDashboard, HelpCircle, ShieldCheck
} from 'lucide-react';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const name = localStorage.getItem('name') || 'User';
  const email = localStorage.getItem('email') || '';
  const role = localStorage.getItem('role') || 'user';

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const isAdmin = role === 'admin';
  const isStaff = role === 'staff';
  const isUser = role === 'user';

  const getActiveColor = () => {
    if (isAdmin) return 'text-purple-600';
    if (isStaff) return 'text-green-600';
    return 'text-blue-600';
  };

  const getHoverColor = () => {
    if (isAdmin) return 'hover:text-purple-600';
    if (isStaff) return 'hover:text-green-600';
    return 'hover:text-blue-600';
  };

  const activeCls = getActiveColor();
  const hoverCls = getHoverColor();

  const getDashboardLink = () => {
    if (isAdmin) return "/admin";
    if (isStaff) return "/staff";
    return "/home";
  };

  const initials = name.charAt(0).toUpperCase();

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50 h-[70px] flex items-center border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 w-full flex justify-between items-center">
        {/* Left: Logo */}
        <Link to={getDashboardLink()} className="flex items-center gap-2">
          <div className={`bg-gradient-to-br ${isAdmin ? 'from-purple-600 to-purple-800' : isStaff ? 'from-green-600 to-green-800' : 'from-blue-600 to-blue-800'} w-9 h-9 rounded-lg flex items-center justify-center shadow-md`}>
            <span className="text-white font-bold text-xl">C</span>
          </div>
          <div className="flex flex-col leading-none">
            <span className="text-lg font-bold tracking-tight text-gray-900">ComplaintHub</span>
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">System</span>
          </div>
        </Link>

        {/* Center: Navigation Links */}
        <div className="hidden md:flex items-center gap-8">
          {/* STUDENT LINKS */}
          {isUser && (
            <>
              <Link to="/home" className={`flex items-center gap-1.5 text-sm font-bold transition-colors ${location.pathname === '/home' ? activeCls : `text-gray-500 ${hoverCls}`}`}>
                <Home size={18} /> Dashboard
              </Link>
              <Link to="/my-complaints" className={`flex items-center gap-1.5 text-sm font-bold transition-colors ${location.pathname === '/my-complaints' ? activeCls : `text-gray-500 ${hoverCls}`}`}>
                <LayoutDashboard size={18} /> Complaints Filed & Process
              </Link>
            </>
          )}

          {/* STAFF LINKS */}
          {isStaff && (
            <>
              <Link to="/staff" className={`flex items-center gap-1.5 text-sm font-bold transition-colors ${location.pathname === '/staff' ? activeCls : `text-gray-500 ${hoverCls}`}`}>
                <LayoutDashboard size={18} /> Dashboard
              </Link>
              <Link to="/staff" className={`flex items-center gap-1.5 text-sm font-bold transition-colors ${location.pathname === '/staff' ? activeCls : `text-gray-500 ${hoverCls}`}`}>
                <ShieldCheck size={18} /> My Assigned
              </Link>
            </>
          )}

          {/* ADMIN LINKS */}
          {isAdmin && (
            <Link to="/admin" className={`flex items-center gap-1.5 text-sm font-bold transition-colors ${location.pathname === '/admin' ? activeCls : `text-gray-500 ${hoverCls}`}`}>
              <LayoutDashboard size={18} /> Admin Dashboard
            </Link>
          )}

          {/* COMMON LINKS (Profile & Help) */}
          <Link to="/profile" className={`flex items-center gap-1.5 text-sm font-bold transition-colors ${location.pathname === '/profile' ? activeCls : `text-gray-500 ${hoverCls}`}`}>
            <UserIcon size={18} /> Profile
          </Link>
          <Link to="/help" className={`flex items-center gap-1.5 text-sm font-bold transition-colors ${location.pathname === '/help' ? activeCls : `text-gray-500 ${hoverCls}`}`}>
            <HelpCircle size={18} /> Help
          </Link>
        </div>

        {/* Right: User Info & Logout */}
        <div className="flex items-center gap-4">
          <div className="flex flex-col items-end">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-gray-900">{name}</span>
              {isAdmin && (
                <span className="bg-purple-100 text-purple-700 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                  ADMIN
                </span>
              )}
              {isStaff && (
                <span className="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                  STAFF
                </span>
              )}
            </div>
            <span className="text-[10px] text-gray-400 font-medium">{email}</span>
          </div>
          
          <div className="flex items-center justify-center w-10 h-10 bg-gray-100 rounded-full font-bold text-gray-600 border border-gray-200">
            {initials}
          </div>

          <div className="w-[1px] h-8 bg-gray-100 mx-1"></div>

          <button 
            onClick={handleLogout}
            className="text-gray-400 hover:text-red-500 p-2 rounded-xl hover:bg-red-50 transition-all"
            title="Logout"
          >
            <LogOut size={22} />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
