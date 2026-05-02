import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const FAQItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden bg-white mb-4 hover:border-primary/30 transition-colors">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full text-left p-6 flex justify-between items-center transition-colors hover:bg-gray-50"
      >
        <span className="font-bold text-gray-900 tracking-tight">{question}</span>
        {isOpen ? (
          <ChevronUp className="text-primary" size={20} />
        ) : (
          <ChevronDown className="text-gray-400" size={20} />
        )}
      </button>
      {isOpen && (
        <div className="px-6 pb-6 text-sm text-gray-600 leading-relaxed animate-in slide-in-from-top-2 duration-200">
          {answer}
        </div>
      )}
    </div>
  );
};

export default FAQItem;
