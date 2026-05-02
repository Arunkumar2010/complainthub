import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';

import { 
  Send, X, ArrowLeft, AlertCircle, 
  Tag, Flag, FileText, Info, Loader2 
} from 'lucide-react';
import Toast from '../components/Toast';
import Navbar from '../components/Navbar';

const SubmitComplaint = () => {
  const userName = localStorage.getItem('name')
  const userEmail = localStorage.getItem('email')
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    category: 'Technical Issues',
    priority: 'Medium',
    description: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showToast, setShowToast] = useState(false);

  const categories = [
    'Technical Issues', 'Billing & Payments', 'Customer Service', 
    'Product Quality', 'Delivery & Shipping', 'Other'
  ];

  const priorities = ['Low', 'Medium', 'High', 'Urgent'];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.description.length < 20) {
      return setError('Description must be at least 20 characters.');
    }

    setIsLoading(true);
    setError('');
    try {
      await api.post('/complaints', formData);
      setShowToast(true);
      setTimeout(() => navigate('/my-complaints'), 2000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to submit complaint');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-8 md:py-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <Link to="/home" className="inline-flex items-center gap-2 text-gray-500 font-bold hover:text-primary mb-8 transition-colors text-sm">
        <ArrowLeft size={18} /> Back to Dashboard
      </Link>

      <div className="bg-white rounded-[2rem] shadow-premium border border-gray-100 overflow-hidden">
        <div className="bg-primary p-8 md:p-12 text-white relative overflow-hidden">
           <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl" />
           <div className="relative z-10">
              <h1 className="text-3xl font-extrabold tracking-tight mb-2">Submit a Complaint</h1>
              <p className="text-white/80 font-medium">Please provide detailed information about your issue.</p>
           </div>
        </div>

        <form onSubmit={handleSubmit} className="p-8 md:p-12 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-1.5 col-span-full">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Complaint Title</label>
              <div className="relative group">
                <FileText className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" size={18} />
                <input 
                  type="text" 
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  placeholder="Summarize the issue in a few words"
                  className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all text-sm font-bold"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Category</label>
              <div className="relative group">
                <Tag className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" size={18} />
                <select 
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all text-sm font-bold appearance-none"
                  required
                >
                  {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Priority Level</label>
              <div className="relative group">
                <Flag className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" size={18} />
                <select 
                  value={formData.priority}
                  onChange={(e) => setFormData({...formData, priority: e.target.value})}
                  className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all text-sm font-bold appearance-none"
                  required
                >
                  {priorities.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
            </div>

            <div className="space-y-1.5 col-span-full">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Detailed Description (Min 20 chars)</label>
              <textarea 
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                rows={6}
                placeholder="Explain the issue in detail. What happened? When? What was expected?"
                className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all text-sm font-medium leading-relaxed"
                required
              />
            </div>
          </div>

          <div className="bg-blue-50/50 p-6 rounded-2xl border border-blue-100/50 flex items-start gap-4">
            <div className="bg-primary/10 p-2 rounded-lg text-primary">
              <Info size={20} />
            </div>
            <div>
              <p className="text-xs font-bold text-primary uppercase tracking-widest mb-1">Important Note</p>
              <p className="text-xs text-blue-800 leading-relaxed font-medium">
                After submission, you'll receive a confirmation with your <strong>Complaint ID</strong>. Our support team will review it within 24 hours. You can track the status in the "My Complaints" section.
              </p>
            </div>
          </div>

          {error && (
            <div className="bg-danger/5 border border-danger/20 text-danger text-xs font-bold p-4 rounded-xl flex items-center gap-3 animate-shake">
              <AlertCircle size={16} /> {error}
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <button 
              type="submit" 
              disabled={isLoading}
              className="flex-1 btn-primary py-4 flex items-center justify-center gap-2 text-base font-bold shadow-xl shadow-primary/20 hover:scale-[1.02] transition-transform active:scale-95"
            >
              {isLoading ? (
                <Loader2 size={24} className="animate-spin" />
              ) : (
                <>Submit Complaint <Send size={20} /></>
              )}
            </button>
            <button 
              type="button" 
              onClick={() => navigate('/home')}
              className="px-10 py-4 bg-gray-100 text-gray-600 rounded-xl font-bold text-base hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
            >
              <X size={20} /> Cancel
            </button>
          </div>
        </form>
      </div>

      {showToast && (
        <Toast 
          message="Complaint submitted successfully! Redirecting..." 
          type="success"
          onClose={() => setShowToast(false)}
        />
      )}
    </div>
    </div>
  );
};

export default SubmitComplaint;
