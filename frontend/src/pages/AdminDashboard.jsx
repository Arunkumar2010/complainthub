import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import Navbar from '../components/Navbar';
import { 
  Users, LayoutDashboard, Clock, CheckCircle, 
  Search, Filter, Loader2, AlertCircle, 
  MessageSquare, User, ShieldCheck, Mail, Zap,
  TrendingUp, BarChart3, Target, ChevronDown, Trash2
} from 'lucide-react';
import clsx from 'clsx';
import Toast from '../components/Toast';

const AdminDashboard = () => {
  console.log('Admin dashboard loaded');
  const [complaints, setComplaints] = useState([]);
  const [filteredComplaints, setFilteredComplaints] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    inprogress: 0,
    resolved: 0,
    totalUsers: 0
  });
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [staffList, setStaffList] = useState([]);
  const [selectedStaff, setSelectedStaff] = useState('');

  useEffect(() => {
    fetchComplaints();
    fetchUserCount();
    fetchStaffList();
  }, []);

  const fetchStaffList = async () => {
    try {
      const res = await api.get('/auth/staff-list');
      setStaffList(res.data);
    } catch (err) {
      console.error('Failed to fetch staff:', err);
    }
  };

  const fetchUserCount = async () => {
    try {
      const res = await api.get('/auth/users/count');
      setStats(prev => ({ ...prev, totalUsers: res.data.count }));
    } catch (err) {
      console.error('Error fetching user count:', err);
    }
  };

  const fetchComplaints = async () => {
    setIsLoading(true);
    try {
      const res = await api.get('/complaints');
      if (Array.isArray(res.data)) {
        setComplaints(res.data);
        setFilteredComplaints(res.data);
        
        const counts = res.data.reduce((acc, c) => {
          acc[c.status] = (acc[c.status] || 0) + 1;
          return acc;
        }, { pending: 0, inprogress: 0, resolved: 0, total: res.data.length });
        
        setStats(prev => ({ ...prev, ...counts }));
      } else {
        console.error('Expected array of complaints but got:', res.data);
        setComplaints([]);
        setFilteredComplaints([]);
      }
    } catch (err) {
      console.error('Error fetching complaints:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let result = complaints;
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      result = result.filter(c => {
        // Support both populated userRef.email and legacy flat email field
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
      if (status === 'resolved') {
        const resolution = prompt("Enter resolution message:");
        if (!resolution) return;
        updateData.resolution = resolution;
      } else if (status === 'inprogress') {
        updateData.assignedTo = "Support Team";
      }

      await api.patch(`/complaints/${id}`, updateData);
      setToastMsg(`Complaint ${status} successfully!`);
      setShowToast(true);
      fetchComplaints();
    } catch (err) {
      console.error('Error updating status:', err);
    }
  };

  const handleAssign = async () => {
    if (!selectedStaff || !selectedComplaint) return;
    const staff = staffList.find(s => s._id === selectedStaff);
    if (!staff) return;

    try {
      await api.patch(`/complaints/${selectedComplaint._id}`, {
        assignedTo: staff.name,
        assignedToEmail: staff.email,
        status: 'inprogress'
      });
      setShowAssignModal(false);
      setSelectedStaff('');
      fetchComplaints();
      setToastMsg(`Complaint assigned to ${staff.name}!`);
      setShowToast(true);
    } catch (err) {
      alert('Failed to assign complaint');
    }
  };

  const handleDeleteComplaint = async (id) => {
    if (window.confirm('Are you sure you want to permanently delete this complaint?')) {
      try {
        await api.delete(`/complaints/${id}`);
        setToastMsg('Complaint deleted successfully!');
        setShowToast(true);
        fetchComplaints();
      } catch (err) {
        console.error('Error deleting complaint:', err);
        alert('Failed to delete complaint');
      }
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
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Admin Dashboard</h1>
          <p className="text-gray-500 font-medium">Manage all incoming complaints and customer requests.</p>
        </div>
        <div className="flex bg-white p-2 rounded-2xl border border-gray-100 shadow-subtle gap-2">
           <div className="flex items-center gap-2 px-4 py-2 bg-accent/10 border border-accent/20 rounded-xl text-accent">
              <ShieldCheck size={18} />
              <span className="text-xs font-bold uppercase tracking-widest">Admin Control</span>
           </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-6">
        <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-subtle flex flex-col items-center text-center group">
          <div className="w-12 h-12 bg-gray-50 text-gray-900 rounded-xl flex items-center justify-center mb-3 group-hover:bg-gray-900 group-hover:text-white transition-all">
             <TrendingUp size={24} />
          </div>
          <p className="text-2xl font-extrabold text-gray-900 leading-none">{stats.total}</p>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-2">Total</p>
        </div>
        <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-subtle flex flex-col items-center text-center group">
          <div className="w-12 h-12 bg-amber-50 text-warning rounded-xl flex items-center justify-center mb-3 group-hover:bg-warning group-hover:text-white transition-all">
             <Clock size={24} />
          </div>
          <p className="text-2xl font-extrabold text-gray-900 leading-none">{stats.pending}</p>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-2">Pending</p>
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
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-2">Resolved</p>
        </div>
        <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-subtle flex flex-col items-center text-center group col-span-2 lg:col-span-1">
          <div className="w-12 h-12 bg-purple-50 text-accent rounded-xl flex items-center justify-center mb-3 group-hover:bg-accent group-hover:text-white transition-all">
             <Users size={24} />
          </div>
          <p className="text-2xl font-extrabold text-gray-900 leading-none">{stats.totalUsers}</p>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-2">Total Users</p>
        </div>
      </div>

      {/* Main Table Section */}
      <div className="bg-white rounded-[2.5rem] shadow-premium border border-gray-100 overflow-hidden">
        {/* Table Header / Filters */}
        <div className="p-8 border-b border-gray-100 flex flex-col lg:flex-row justify-between items-center gap-6">
           <div className="flex items-center gap-4 w-full md:w-auto">
              <h3 className="text-xl font-extrabold text-gray-900 tracking-tight whitespace-nowrap">Manage Complaints</h3>
              <div className="relative group w-full md:w-80">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" size={16} />
                <input 
                  type="text" 
                  placeholder="Search ID, Title or Email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-11 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all text-sm font-medium"
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
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all text-sm font-bold appearance-none capitalize"
                 >
                    <option value="All">All Statuses</option>
                    <option value="pending">Pending</option>
                    <option value="inprogress">In Progress</option>
                    <option value="resolved">Resolved</option>
                 </select>
              </div>
           </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100">Complaint Info</th>
                <th className="px-6 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100">User Email</th>
                <th className="px-6 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100">Meta Details</th>
                <th className="px-6 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100">Assigned To</th>
                <th className="px-6 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100">Status & Priority</th>
                <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {isLoading ? (
                <tr>
                  <td colSpan="5" className="py-20 text-center">
                    <div className="flex flex-col items-center gap-4">
                       <Loader2 className="animate-spin text-primary" size={40} />
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
                        <h4 className="text-sm font-bold text-gray-900 group-hover:text-primary transition-colors">{complaint.title}</h4>
                      </div>
                    </td>
                    <td className="px-6 py-6 font-medium text-gray-600 text-sm">{complaint.email}</td>
                    <td className="px-6 py-6">
                      <div className="flex flex-col gap-1">
                        <span className="text-[10px] font-bold text-gray-700 bg-gray-100 px-2 py-0.5 rounded inline-block w-fit">{complaint.category}</span>
                        <span className="text-[10px] text-gray-400 font-bold uppercase">{new Date(complaint.createdAt).toLocaleDateString()}</span>
                      </div>
                    </td>
                    <td className="px-6 py-6">
                       {complaint.assignedTo ? (
                          <div className="flex items-center gap-2">
                             <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                             <span className="text-sm font-bold text-gray-900">{complaint.assignedTo}</span>
                          </div>
                       ) : (
                          <span className="text-sm font-medium text-gray-400">Unassigned</span>
                       )}
                    </td>
                    <td className="px-6 py-6">
                      <div className="flex flex-wrap gap-2">
                        <span className={clsx("capitalize", getStatusClass(complaint.status))}>{complaint.status}</span>
                        <span className={clsx(getPriorityClass(complaint.priority))}>{complaint.priority}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {complaint.status === 'pending' && (
                          <button 
                            onClick={() => handleUpdateStatus(complaint._id, 'inprogress')}
                            className="bg-primary/10 text-primary hover:bg-primary hover:text-white p-2 rounded-lg transition-all"
                            title="Set In Progress"
                          >
                            <Zap size={18} />
                          </button>
                        )}
                        <button 
                          onClick={() => {
                            setSelectedComplaint(complaint);
                            setShowAssignModal(true);
                          }}
                          className="bg-indigo-50 text-indigo-600 hover:bg-indigo-600 hover:text-white p-2 rounded-lg transition-all"
                          title="Assign to Staff"
                        >
                          <User size={18} />
                        </button>
                        {complaint.status !== 'resolved' && (
                          <button 
                            onClick={() => handleUpdateStatus(complaint._id, 'resolved')}
                            className="bg-success/10 text-success hover:bg-success hover:text-white p-2 rounded-lg transition-all"
                            title="Resolve"
                          >
                            <CheckCircle size={18} />
                          </button>
                        )}
                        {complaint.status === 'resolved' && (
                           <div className="p-2 text-success" title="Resolved">
                              <ShieldCheck size={18} />
                           </div>
                        )}
                        <button 
                          onClick={() => handleDeleteComplaint(complaint._id)}
                          className="text-gray-400 hover:text-danger p-2 rounded-lg transition-all"
                          title="Delete Complaint"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="py-20 text-center text-gray-400 font-bold uppercase tracking-widest text-xs">
                    No complaints match your filters
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

      {showAssignModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-300">
           <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-300">
              <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                 <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Workflow Action</p>
                    <h2 className="text-xl font-black text-gray-900">Assign Complaint</h2>
                 </div>
                 <button onClick={() => setShowAssignModal(false)} className="p-2 hover:bg-gray-100 rounded-xl transition-all text-gray-400 hover:text-gray-900">
                    <ChevronDown size={20} className="rotate-90" />
                 </button>
              </div>
              
              <div className="p-8 space-y-6">
                 <div>
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-2 ml-1">Complaint</label>
                    <div className="p-4 bg-gray-50 border border-gray-100 rounded-2xl">
                       <p className="text-sm font-bold text-gray-900">{selectedComplaint?.title}</p>
                       <p className="text-[10px] text-gray-400 font-medium mt-1">ID: {selectedComplaint?.id}</p>
                    </div>
                 </div>

                 <div>
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-2 ml-1">Select Staff Member</label>
                    {staffList.length > 0 ? (
                       <div className="relative group">
                          <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-600 transition-colors" size={16} />
                          <select 
                             value={selectedStaff}
                             onChange={(e) => setSelectedStaff(e.target.value)}
                             className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-600/10 focus:border-indigo-600 transition-all text-sm font-bold appearance-none"
                          >
                             <option value="">-- Choose Staff --</option>
                             {staffList.map(s => (
                                <option key={s._id} value={s._id}>
                                   {s.name} — {s.department || 'General'}
                                </option>
                             ))}
                          </select>
                       </div>
                    ) : (
                       <div className="p-4 bg-amber-50 border border-amber-100 rounded-2xl text-amber-700 text-xs font-medium">
                          No staff members registered yet. Ask staff to create an account with Staff role to appear here.
                       </div>
                    )}
                 </div>
              </div>

              <div className="p-8 bg-gray-50 border-t border-gray-100 flex gap-3">
                 <button 
                    onClick={() => setShowAssignModal(false)}
                    className="flex-1 px-6 py-3.5 bg-white border border-gray-200 text-gray-600 font-bold rounded-2xl hover:bg-gray-50 transition-all active:scale-95 text-sm"
                 >
                    Cancel
                 </button>
                 <button 
                    onClick={handleAssign}
                    disabled={!selectedStaff}
                    className="flex-[2] px-6 py-3.5 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 shadow-lg shadow-indigo-600/20 transition-all active:scale-95 disabled:opacity-50 disabled:active:scale-100 text-sm"
                 >
                    Assign to Staff
                 </button>
              </div>
           </div>
        </div>
      )}
      </div>
    </div>
  );
};

export default AdminDashboard;
