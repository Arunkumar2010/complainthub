import React, { useEffect } from 'react';
import { CheckCircle, AlertCircle, X } from 'lucide-react';

const Toast = ({ message, type = 'success', onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const bgClass = type === 'success' ? 'bg-success border-success' : 'bg-danger border-danger';
  const Icon = type === 'success' ? CheckCircle : AlertCircle;

  return (
    <div className={`fixed top-6 right-6 z-[100] flex items-center gap-3 px-6 py-4 rounded-xl border shadow-2xl text-white ${bgClass} animate-in slide-in-from-right-10 duration-300`}>
      <Icon size={20} className="shrink-0" />
      <span className="font-bold text-sm">{message}</span>
      <button onClick={onClose} className="ml-4 p-1 hover:bg-white/20 rounded-lg transition-colors">
        <X size={16} />
      </button>
    </div>
  );
};

export default Toast;
