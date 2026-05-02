import React from 'react';
import { X, Clock, Calendar, User, Tag, ShieldCheck, Mail, Target } from 'lucide-react';
import { clsx } from 'clsx';

const Modal = ({ isOpen, onClose, complaint }) => {
  if (!isOpen || !complaint) return null;

  const getStatusClass = (status) => {
    switch (status) {
      case 'pending': return 'status-pending';
      case 'inprogress': return 'status-inprogress';
      case 'resolved': return 'status-resolved';
      case 'closed': return 'status-closed';
      default: return '';
    }
  };

  const getPriorityClass = (priority) => {
    switch (priority) {
      case 'Urgent': return 'priority-urgent px-4 py-1';
      case 'High': return 'priority-high px-4 py-1';
      case 'Medium': return 'priority-medium px-4 py-1';
      case 'Low': return 'priority-low px-4 py-1';
      default: return '';
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col animate-in zoom-in-95 duration-300">
        <div className="flex justify-between items-center p-6 border-b">
          <div>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{complaint.id}</span>
            <h2 className="text-xl font-bold text-gray-900">{complaint.title}</h2>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-400 hover:text-gray-900"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-8 overflow-y-auto space-y-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
             <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                <span className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Status</span>
                <span className={clsx("text-xs font-bold tracking-tight inline-block capitalize", getStatusClass(complaint.status))}>{complaint.status}</span>
             </div>
             <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                <span className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Priority</span>
                <span className={clsx("text-xs font-bold tracking-tight inline-block", getPriorityClass(complaint.priority))}>{complaint.priority}</span>
             </div>
             <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                <span className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Category</span>
                <span className="text-xs font-bold text-gray-700 flex items-center gap-1"><Tag size={12}/>{complaint.category}</span>
             </div>
             <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                <span className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Submitted On</span>
                <span className="text-xs font-bold text-gray-700 flex items-center gap-1"><Calendar size={12}/>{new Date(complaint.createdAt).toLocaleDateString()}</span>
             </div>
          </div>

          <div className="space-y-3">
             <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                Complaint Description
             </h3>
             <div className="bg-gray-50 p-5 rounded-xl border border-gray-100 text-sm leading-relaxed text-gray-700 whitespace-pre-wrap">
                {complaint.description}
             </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-gray-100">
             <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                Additional Details
             </h3>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-3 bg-white border border-gray-100 rounded-lg shadow-sm">
                   <div className="p-2 bg-blue-50 text-blue-600 rounded-md">
                      <Mail size={16} />
                   </div>
                   <div>
                      <p className="text-[10px] text-gray-400 font-bold uppercase">Customer Email</p>
                      <p className="text-xs font-bold text-gray-700 truncate">{complaint.email}</p>
                   </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-white border border-gray-100 rounded-lg shadow-sm">
                   <div className="p-2 bg-purple-50 text-purple-600 rounded-md">
                      <ShieldCheck size={16} />
                   </div>
                   <div>
                      <p className="text-[10px] text-gray-400 font-bold uppercase">Assigned To</p>
                      <p className="text-xs font-bold text-gray-700">{complaint.assignedTo || 'Not Assigned'}</p>
                   </div>
                </div>
             </div>
          </div>

          {complaint.status === 'resolved' && (
             <div className="space-y-3 pt-4 border-t border-gray-100">
                <h3 className="text-sm font-bold text-success flex items-center gap-2">
                   <div className="w-1.5 h-1.5 rounded-full bg-success" />
                   Resolution Message
                </h3>
                <div className="bg-success/5 p-5 rounded-xl border border-success/10 text-sm leading-relaxed text-success whitespace-pre-wrap italic">
                   "{complaint.resolution}"
                </div>
             </div>
          )}
        </div>

        <div className="p-6 bg-gray-50 border-t flex justify-end">
          <button 
            onClick={onClose}
            className="btn-secondary px-8 font-bold"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
