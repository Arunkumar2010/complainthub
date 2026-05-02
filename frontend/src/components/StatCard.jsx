import React from 'react';

const StatCard = ({ title, count, icon: Icon, colorClass, borderClass }) => {
  return (
    <div className={`bg-white border-l-4 ${borderClass} rounded-xl shadow-subtle p-5 flex items-center gap-4`}>
      <div className={`p-3 rounded-lg ${colorClass}`}>
        <Icon size={24} />
      </div>
      <div>
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <p className="text-2xl font-bold text-gray-900">{count}</p>
      </div>
    </div>
  );
};

export default StatCard;
