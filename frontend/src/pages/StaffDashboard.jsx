import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import Navbar from '../components/Navbar';
import { 
  LayoutDashboard, Clock, CheckCircle, 
  Search, Filter, Loader2, AlertCircle, 
  MessageSquare, User, ShieldCheck, Zap,
  TrendingUp, BarChart3, Target, ChevronDown
} from 'lucide-react';
import { clsx } from 'clsx';
import Toast from '../components/Toast';

const StaffDashboard = () => {
  const [complaints, setComplaints] = useState([]);
  const [filteredComplaints, setFilteredComplaints] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    inprogress: 0,
    resolved: 0
  });
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  const [showResolveModal, setShowResolveModal] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [resolutionText, setResolutionText] = useState('');

  const staffName = localStorage.getItem('name') || 'Staff';
  const staffEmail = localStorage.getItem('email') || '';

  useEffect(() => {
    fetchAssignedComplaints();
  }, []);

  const fetchAssignedComplaints = async () => {
    setIsLoading(true);
    try {
      const res = await api.get('/complaints/assigned');
      setComplaints(res.data);
      setFilteredComplaints(res.data);
      
      const counts = res.data.reduce((acc, c) => {
        acc[c.status] = (acc[c.status] || 0) + 1;
        return acc;
      }, { pending: 0, inprogress: 0, resolved: 0, total: res.data.length });
      
      setStats(prev => ({ ...prev, ...counts }));
    } catch (err) {
      console.error('Error fetching assigned complaints:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let result = complaints;
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      result = result.filter(c => {
        const email = c.userRef?.email || c.email || '';
        const id = c.id || c._id || '';
        return (
          c.title.toLowerCase().includes(q) ||
          id.toLowerCase().includes(q) ||
          email.toLowerCase().includes(q)
        );
      });
    }
    if (statusFilter !== 'All') {
      result = result.filter(c => c.status === statusFilter);
    }
    setFilteredComplaints(result);
  }, [searchTerm, statusFilter, complaints]);

  const handleUpdateStatus = async (id, status) => {
    try {
      let updateData = { status };
      if (status === 'inprogress') {
        updateData.assignedTo = staffName;
        updateData.assignedToEmail = staffEmail;
      }

      await api.patch(`/complaints/${id}`, updateData);
      setToastMsg(`Complaint ${status} successfully!`);
      setShowToast(true);
      fetchAssignedComplaints();
    } catch (err) {
      console.error('Error updating status:', err);
    }
  };

  const handleResolve = async () => {
    if (!resolutionText || resolutionText.length < 10) {
      alert('Resolution details must be at least 10 characters.');
      return;
    }
    try {
      await api.patch(`/complaints/${selectedComplaint._id}`, {
        status: 'resolved',
        resolution: resolutionText,
        resolvedAt: new Date()
      });
      setShowResolveModal(false);
      setResolutionText('');
      setToastMsg('Complaint marked as resolved!');
      setShowToast(true);
      fetchAssignedComplaints();
    } catch (err) {
      console.error('Error resolving complaint:', err);
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'pending': return 'status-pending';
      case 'inprogress': return 'status-inprogress';
      case 'resolved': return 'status-resolved';
      default: return '';
    }
  };

  const getPriorityClass = (priority) => {
    switch (priority) {
      case 'Urgent': return 'priority-urgent';
      case 'High': return 'priority-high';
      case 'Medium': return 'priority-medium';
      case 'Low': return 'priority-low';
      default: return '';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 py-8 md:py-12 space-y-12 animate-in fade-in duration-500">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Staff Dashboard</h1>
            <p className="text-gray-500 font-medium">Handle and resolve assigned complaints efficiently.</p>
          </div>
          <div className="flex bg-white p-2 rounded-2xl border border-gray-100 shadow-subtle gap-2">
             <div className="flex items-center gap-2 px-4 py-2 bg-green-50 border border-green-200 rounded-xl text-green-700">
                <ShieldCheck size={18} />
                <span className="text-xs font-bold uppercase tracking-widest">Staff Panel</span>
             </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-subtle flex flex-col items-center text-center group">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-3 group-hover:bg-blue-600 group-hover:text-white transition-all">
               <Target size={24} />
            </div>
            <p className="text-2xl font-extrabold text-gray-900 leading-none">{stats.total}</p>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-2">Assigned to Me</p>
          </div>
          <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-subtle flex flex-col items-center text-center group">
            <div className="w-12 h-12 bg-amber-50 text-warning rounded-xl flex items-center justify-center mb-3 group-hover:bg-warning group-hover:text-white transition-all">
               <Clock size={24} />
            </div>
            <p className="text-2xl font-extrabold text-gray-900 leading-none">{stats.pending}</p>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-2">Pending Action</p>
          </div>
          <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-subtle flex flex-col items-center text-center group">
            <div className="w-12 h-12 bg-blue-50 text-primary rounded-xl flex items-center justify-center mb-3 group-hover:bg-primary group-hover:text-white transition-all">
               <BarChart3 size={24} />
            </div>
            <p className="text-2xl font-extrabold text-gray-900 leading-none">{stats.inprogress}</p>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-2">In Progress</p>
          </div>
          <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-subtle flex flex-col items-center text-center group">
            <div className="w-12 h-12 bg-green-50 text-success rounded-xl flex items-center justify-center mb-3 group-hover:bg-success group-hover:text-white transition-all">
               <CheckCircle size={24} />
            </div>
            <p className="text-2xl font-extrabold text-gray-900 leading-none">{stats.resolved}</p>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-2">Resolved by Me</p>
          </div>
        </div>

        {/* Main Table Section */}
        <div className="bg-white rounded-[2.5rem] shadow-premium border border-gray-100 overflow-hidden">
          <div className="p-8 border-b border-gray-100 flex flex-col lg:flex-row justify-between items-center gap-6">
             <div className="flex items-center gap-4 w-full md:w-auto">
                <h3 className="text-xl font-extrabold text-gray-900 tracking-tight whitespace-nowrap">Assigned Complaints</h3>
                <div className="relative group w-full md:w-80">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-green-600 transition-colors" size={16} />
                  <input 
                    type="text" 
                    placeholder="Search ID, Title or Email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-11 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-green-600/10 focus:border-green-600 transition-all text-sm font-medium"
                  />
                </div>
             </div>
             
             <div className="flex items-center gap-4 w-full md:w-auto lg:ml-auto">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Filter:</span>
                <div className="relative w-full md:w-48">
                   <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                   <select 
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-green-600/10 focus:border-green-600 transition-all text-sm font-bold appearance-none capitalize"
                   >
                      <option value="All">All Statuses</option>
                      <option value="pending">Pending</option>
                      <option value="inprogress">In Progress</option>
                      <option value="resolved">Resolved</option>
                   </select>
                </div>
             </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100">Complaint Info</th>
                  <th className="px-6 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100">Student Email</th>
                  <th className="px-6 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100">Category</th>
                  <th className="px-6 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100">Status & Priority</th>
                  <th className="px-6 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100">Assigned Date</th>
                  <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {isLoading ? (
                  <tr>
                    <td colSpan="5" className="py-20 text-center">
                      <div className="flex flex-col items-center gap-4">
                         <Loader2 className="animate-spin text-green-600" size={40} />
                         <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Loading data...</p>
                      </div>
                    </td>
                  </tr>
                ) : filteredComplaints.length > 0 ? (
                  filteredComplaints.map(complaint => (
                    <tr key={complaint._id} className="hover:bg-gray-50 transition-colors group">
                      <td className="px-8 py-6">
                        <div className="flex flex-col gap-1">
                          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">#{complaint.id}</span>
                          <h4 className="text-sm font-bold text-gray-900 group-hover:text-green-600 transition-colors">{complaint.title}</h4>
                        </div>
                      </td>
                      <td className="px-6 py-6 font-medium text-gray-600 text-sm">{complaint.email}</td>
                      <td className="px-6 py-6">
                        <span className="text-[10px] font-bold text-gray-700 bg-gray-100 px-2 py-0.5 rounded inline-block w-fit">{complaint.category}</span>
                      </td>
                      <td className="px-6 py-6">
                        <div className="flex flex-wrap gap-2">
                          <span className={clsx("capitalize", getStatusClass(complaint.status))}>{complaint.status}</span>
                          <span className={clsx(getPriorityClass(complaint.priority))}>{complaint.priority}</span>
                        </div>
                      </td>
                      <td className="px-6 py-6 font-medium text-gray-400 text-[10px] uppercase">
                         {complaint.assignedAt ? new Date(complaint.assignedAt).toLocaleDateString() : 'N/A'}
                      </td>
                      <td className="px-8 py-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {complaint.status === 'pending' && (
                            <button 
                              onClick={() => handleUpdateStatus(complaint._id, 'inprogress')}
                              className="bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
                              title="Set In Progress"
                            >
                              <Zap size={14} /> In Progress
                            </button>
                          )}
                          {complaint.status !== 'resolved' && (
                            <button 
                              onClick={() => {
                                setSelectedComplaint(complaint);
                                setShowResolveModal(true);
                              }}
                              className="bg-green-50 text-green-700 hover:bg-green-600 hover:text-white px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
                              title="Resolve"
                            >
                              <CheckCircle size={14} /> Resolve
                            </button>
                          )}
                          {complaint.status === 'resolved' && (
                             <div className="flex items-center gap-1.5 text-green-700 font-bold text-xs" title="Resolved">
                                <ShieldCheck size={16} /> Finalized
                             </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="py-20 text-center">
                       <div className="flex flex-col items-center gap-4">
                          <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center text-gray-200">
                             <Target size={40} />
                          </div>
                          <div>
                             <h3 className="text-lg font-bold text-gray-900">No Complaints Assigned Yet</h3>
                             <p className="text-gray-400 text-sm">Complaints assigned to you by admin will appear here. Check back later.</p>
                          </div>
                       </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {showToast && (
          <Toast 
            message={toastMsg} 
            type="success"
            onClose={() => setShowToast(false)}
          />
        )}

      {showResolveModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-300">
           <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-300">
              <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-success/5">
                 <div>
                    <p className="text-[10px] font-bold text-success uppercase tracking-widest mb-1">Final Action</p>
                    <h2 className="text-xl font-black text-gray-900">Resolve Complaint</h2>
                 </div>
                 <button onClick={() => setShowResolveModal(false)} className="p-2 hover:bg-gray-100 rounded-xl transition-all text-gray-400 hover:text-gray-900">
                    <ChevronDown size={20} className="rotate-90" />
                 </button>
              </div>
              
              <div className="p-8 space-y-6">
                 <div>
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-2 ml-1">Resolving Issue</label>
                    <div className="p-4 bg-gray-50 border border-gray-100 rounded-2xl">
                       <p className="text-sm font-bold text-gray-900">{selectedComplaint?.title}</p>
                    </div>
                 </div>

                 <div>
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-2 ml-1">Resolution Details</label>
                    <textarea 
                       value={resolutionText}
                       onChange={(e) => setResolutionText(e.target.value)}
                       placeholder="Describe how this issue was resolved..."
                       rows="4"
                       className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-success/10 focus:border-success transition-all text-sm font-medium resize-none"
                    />
                    <p className="text-[10px] text-gray-400 mt-2 ml-1">Min 10 characters required.</p>
                 </div>
              </div>

              <div className="p-8 bg-gray-50 border-t border-gray-100 flex gap-3">
                 <button 
                    onClick={() => setShowResolveModal(false)}
                    className="flex-1 px-6 py-3.5 bg-white border border-gray-200 text-gray-600 font-bold rounded-2xl hover:bg-gray-50 transition-all active:scale-95 text-sm"
                 >
                    Cancel
                 </button>
                 <button 
                    onClick={handleResolve}
                    disabled={!resolutionText || resolutionText.length < 10}
                    className="flex-[2] px-6 py-3.5 bg-success text-white font-bold rounded-2xl hover:bg-success-dark shadow-lg shadow-success/20 transition-all active:scale-95 disabled:opacity-50 disabled:active:scale-100 text-sm"
                 >
                    Mark as Resolved
                 </button>
              </div>
           </div>
        </div>
      )}
      </div>
    </div>
  );
};

export default StaffDashboard;
