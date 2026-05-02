import React from 'react';
import { Clock, Calendar, ChevronRight, User, Tag } from 'lucide-react';
import { clsx } from 'clsx';

const ComplaintCard = ({ complaint, onViewDetails }) => {
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
      case 'Urgent': return 'priority-urgent';
      case 'High': return 'priority-high';
      case 'Medium': return 'priority-medium';
      case 'Low': return 'priority-low';
      default: return '';
    }
  };

  return (
    <div className="card p-6 flex flex-col gap-4">
      <div className="flex justify-between items-start">
        <div className="flex flex-col gap-1">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{complaint.id}</span>
          <h3 className="text-lg font-bold text-gray-900 leading-tight">{complaint.title}</h3>
        </div>
        <div className="flex gap-2">
          <span className={clsx("capitalize", getStatusClass(complaint.status))}>{complaint.status}</span>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <span className={clsx(getPriorityClass(complaint.priority))}>{complaint.priority}</span>
        <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-[10px] font-bold uppercase border border-gray-200 flex items-center gap-1">
          <Tag size={10} /> {complaint.category}
        </span>
      </div>

      <p className="text-sm text-gray-600 line-clamp-2">
        {complaint.description}
      </p>

      <div className="space-y-2 mt-2">
        <div className="flex items-center gap-2">
           {complaint.assignedTo ? (
              <div className="flex items-center gap-1.5 text-green-600 bg-green-50 px-2 py-0.5 rounded-md text-[10px] font-bold border border-green-100">
                 <User size={10} /> Assigned to: {complaint.assignedTo}
              </div>
           ) : (
              <div className="text-gray-400 bg-gray-50 px-2 py-0.5 rounded-md text-[10px] font-bold border border-gray-100">
                 Unassigned — Awaiting review
              </div>
           )}
        </div>
        
        {complaint.assignedAt && (
           <p className="text-[10px] text-gray-400 font-medium">Assigned on: {new Date(complaint.assignedAt).toLocaleDateString()}</p>
        )}
      </div>

      <div className="border-t pt-4 mt-auto flex justify-between items-center text-xs text-gray-500">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <Calendar size={14} />
            {new Date(complaint.createdAt).toLocaleDateString()}
          </div>
        </div>
        <button 
          onClick={() => onViewDetails(complaint)}
          className="flex items-center gap-1 text-primary font-bold hover:underline"
        >
          View Details <ChevronRight size={14} />
        </button>
      </div>

      {complaint.status === 'resolved' && complaint.resolution && (
        <div className="mt-3 p-3 bg-success/5 border border-success/10 rounded-lg text-sm text-success flex flex-col gap-1">
          <div className="flex justify-between items-center">
             <span className="font-bold uppercase tracking-wider text-[10px]">Resolution:</span>
             {complaint.resolvedAt && (
                <span className="text-[9px] font-medium opacity-70 italic">{new Date(complaint.resolvedAt).toLocaleDateString()}</span>
             )}
          </div>
          <p className="italic">"{complaint.resolution}"</p>
        </div>
      )}
    </div>
  );
};

export default ComplaintCard;
