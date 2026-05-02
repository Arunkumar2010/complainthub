import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import ComplaintCard from '../components/ComplaintCard';
import Modal from '../components/Modal';
import { 
  Search, Filter, ArrowLeft, 
  ChevronDown, LayoutGrid, List,
  Loader2, AlertCircle, Inbox
} from 'lucide-react';
import Navbar from '../components/Navbar';

const MyComplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [filteredComplaints, setFilteredComplaints] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const categories = [
    'All', 'Technical Issues', 'Billing & Payments', 'Customer Service', 
    'Product Quality', 'Delivery & Shipping', 'Other'
  ];

  const statuses = ['All', 'pending', 'inprogress', 'resolved', 'closed'];

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        // Use the global api instance (src/api/axios.js) which includes the token interceptor
        const res = await api.get('/complaints/mine');
        setComplaints(res.data);
        setFilteredComplaints(res.data);
      } catch (err) {
        console.error('Fetch error:', err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchComplaints();
  }, []);

  useEffect(() => {
    let result = complaints;
    if (searchTerm) {
      result = result.filter(c => 
        c.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
        c.id.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (statusFilter !== 'All') {
      result = result.filter(c => c.status === statusFilter);
    }
    if (categoryFilter !== 'All') {
      result = result.filter(c => c.category === categoryFilter);
    }
    setFilteredComplaints(result);
  }, [searchTerm, statusFilter, categoryFilter, complaints]);

  const handleViewDetails = (complaint) => {
    setSelectedComplaint(complaint);
    setIsModalOpen(true);
  };

  return (
    <div>
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-8 md:py-12 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div className="space-y-1">
          <Link to="/home" className="inline-flex items-center gap-2 text-gray-500 font-bold hover:text-primary mb-2 transition-colors text-xs uppercase tracking-widest">
            <ArrowLeft size={16} /> Home
          </Link>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight flex items-center gap-3">
             Track My Complaints
             <span className="text-sm font-bold bg-primary/10 text-primary px-3 py-1 rounded-full">{filteredComplaints.length}</span>
          </h1>
        </div>
        <Link to="/submit" className="btn-primary px-6 py-3 flex items-center justify-center gap-2 text-sm font-bold shadow-lg shadow-primary/10">
           Submit New <ChevronDown size={18} className="-rotate-90" />
        </Link>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-subtle mb-10 flex flex-col lg:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" size={18} />
          <input 
            type="text" 
            placeholder="Search by Title or Complaint ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all text-sm font-medium"
          />
        </div>
        
        <div className="flex flex-wrap gap-4 w-full lg:w-auto">
          <div className="relative flex-1 lg:min-w-[200px]">
            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all text-sm font-bold appearance-none capitalize"
            >
              {statuses.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          
          <div className="relative flex-1 lg:min-w-[200px]">
            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
            <select 
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all text-sm font-bold appearance-none"
            >
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-32 space-y-4">
          <Loader2 className="animate-spin text-primary" size={48} />
          <p className="text-gray-500 font-bold tracking-tight">Fetching your complaints...</p>
        </div>
      ) : filteredComplaints.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-in fade-in zoom-in-95 duration-500">
          {filteredComplaints.map(complaint => (
            <ComplaintCard 
              key={complaint._id} 
              complaint={complaint} 
              onViewDetails={handleViewDetails}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-32 bg-white rounded-[2.5rem] border-2 border-dashed border-gray-100 flex flex-col items-center gap-4">
          <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center text-gray-300">
            <Inbox size={40} />
          </div>
          <div className="space-y-1">
             <h3 className="text-xl font-bold text-gray-900 tracking-tight">No complaints found</h3>
             <p className="text-gray-400 text-sm font-medium">Try adjusting your search or filters.</p>
          </div>
          <button 
            onClick={() => {setSearchTerm(''); setStatusFilter('All'); setCategoryFilter('All');}}
            className="text-primary font-bold hover:underline py-2"
          >
            Clear all filters
          </button>
        </div>
      )}

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        complaint={selectedComplaint}
      />
    </div>
    </div>
  );
};

export default MyComplaints;
