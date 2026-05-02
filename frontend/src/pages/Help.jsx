import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

import FAQItem from '../components/FAQItem';
import { 
  ArrowLeft, HelpCircle, Mail, Phone, 
  MessageSquare, Info, ShieldCheck, Zap,
  Send, Loader2, CheckCircle, Clock
} from 'lucide-react';
import Toast from '../components/Toast';
import Navbar from '../components/Navbar';

const Help = () => {
  const userName = localStorage.getItem('name')
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [formData, setFormData] = useState({ subject: '', message: '' });

  const faqs = [
    {
      question: "How do I submit a complaint?",
      answer: "Navigate to the 'Submit' page from the navbar or dashboard. Fill in the title, category, priority level, and a detailed description (at least 20 characters), then click 'Submit Complaint'."
    },
    {
      question: "How can I track my complaint status?",
      answer: "Go to the 'Complaints Filed & Process' page. You'll see a list of all your submissions with their current status (Pending, In Progress, Resolved). You can also search or filter by status."
    },
    {
      question: "What are the different complaint statuses?",
      answer: "Pending: newly submitted. In Progress: assigned to a support team. Resolved: issue fixed with a resolution message. Closed: finalized by the system."
    },
    {
      question: "How long does it take to resolve a complaint?",
      answer: "Most complaints are reviewed within 24 hours. Resolution time varies based on complexity, typically ranging from 1-3 business days."
    },
    {
      question: "Can I edit or delete a submitted complaint?",
      answer: "Currently, you cannot edit or delete a complaint once it's submitted to maintain an accurate audit trail."
    },
    {
      question: "What information should I include in my complaint?",
      answer: "Be as specific as possible. Include what happened, when it occurred, and any steps to reproduce the issue."
    },
    {
      question: "How will I be notified about complaint updates?",
      answer: "You'll receive email notifications and status updates will be visible on your dashboard and complaints list."
    },
    {
      question: "What if I'm not satisfied with the resolution?",
      answer: "You can use the 'Contact Us' form on this page or start a live chat to request a follow-up review of your case."
    }
  ];

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await api.post('/support/contact', {
        ...formData,
        email: localStorage.getItem('email') || 'guest'
      });
      setShowToast(true);
      setFormData({ subject: '', message: '' });
    } catch (err) {
      console.error('Error submitting support request:', err);
      alert('Failed to send message. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-8 md:py-12 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div className="space-y-1">
          <Link to="/home" className="inline-flex items-center gap-2 text-gray-500 font-bold hover:text-primary mb-2 transition-colors text-xs uppercase tracking-widest">
            <ArrowLeft size={16} /> Dashboard
          </Link>
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight leading-tight">Help Hub & Support Center</h1>
          <p className="text-gray-500 font-medium">Find answers instantly or connect with our support specialists.</p>
        </div>
      </div>

      {/* TOP ROW — 3 contact cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-premium flex flex-col items-center text-center group hover:border-primary/20 transition-all">
          <div className="w-16 h-16 bg-blue-50 text-primary rounded-2xl flex items-center justify-center mb-6 border border-blue-100 group-hover:scale-110 transition-transform shadow-sm">
            <Mail size={32} />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Email Support</h3>
          <p className="text-gray-400 text-sm font-medium mb-1">Get help via email</p>
          <p className="text-primary font-extrabold mb-4">support@complainthub.com</p>
          <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest bg-gray-50 px-4 py-1.5 rounded-full">
            <Clock size={12} /> Response within 24 hours
          </div>
        </div>

        <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-premium flex flex-col items-center text-center group hover:border-success/20 transition-all">
          <div className="w-16 h-16 bg-green-50 text-success rounded-2xl flex items-center justify-center mb-6 border border-green-100 group-hover:scale-110 transition-transform shadow-sm">
            <Phone size={32} />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Phone Support</h3>
          <p className="text-gray-400 text-sm font-medium mb-1">Call our support line</p>
          <p className="text-success font-extrabold mb-4">+1 (800) 123-4567</p>
          <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest bg-gray-50 px-4 py-1.5 rounded-full">
            <Info size={12} /> Mon-Fri, 9 AM - 6 PM EST
          </div>
        </div>

        <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-premium flex flex-col items-center text-center group hover:border-accent/20 transition-all">
          <div className="w-16 h-16 bg-purple-50 text-accent rounded-2xl flex items-center justify-center mb-6 border border-purple-100 group-hover:scale-110 transition-transform shadow-sm">
            <MessageSquare size={32} />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Live Chat</h3>
          <p className="text-gray-400 text-sm font-medium mb-6">Chat with our team</p>
          <button className="bg-accent text-white px-8 py-3 rounded-xl font-bold text-sm shadow-lg shadow-accent/20 mb-4 hover:bg-purple-700 transition-colors">
             Start Chat
          </button>
          <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest bg-gray-50 px-4 py-1.5 rounded-full">
            <Zap size={12} className="text-accent" /> Available 24/7
          </div>
        </div>
      </div>

      {/* MIDDLE ROW — 2 column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* LEFT (wider): FAQ Accordion */}
        <div className="lg:col-span-2 space-y-8">
          <div>
            <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight mb-2">Frequently Asked Questions</h2>
            <p className="text-gray-400 font-medium tracking-tight">Find quick answers to common questions about our platform.</p>
          </div>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <FAQItem key={index} {...faq} />
            ))}
          </div>
        </div>

        {/* RIGHT (narrower): Contact Us Form */}
        <div className="space-y-8">
          <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-premium flex flex-col">
            <div className="mb-8">
              <h3 className="text-xl font-extrabold text-gray-900 tracking-tight mb-1">Contact Us</h3>
              <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Send us a message</p>
            </div>
            
            <form onSubmit={handleContactSubmit} className="space-y-5">
               <div className="space-y-1.5">
                  <input 
                    type="text" 
                    placeholder="What do you need help with?"
                    value={formData.subject}
                    onChange={(e) => setFormData({...formData, subject: e.target.value})}
                    className="w-full px-5 py-3.5 bg-gray-50 border border-transparent rounded-2xl focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all text-sm font-bold"
                    required
                  />
               </div>
               <div className="space-y-1.5">
                  <textarea 
                    placeholder="Describe your issue or question..."
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    rows={4}
                    className="w-full px-5 py-3.5 bg-gray-50 border border-transparent rounded-2xl focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all text-sm font-bold leading-relaxed"
                    required
                  />
               </div>
               <button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full py-4 bg-gray-900 text-white rounded-2xl text-sm font-extrabold shadow-lg shadow-gray-200 hover:bg-black transition-all flex items-center justify-center gap-2 active:scale-95"
               >
                 {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <><Send size={18} /> Send Message</>}
               </button>
            </form>

            <div className="mt-10 pt-8 border-t border-gray-50">
               <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Business Hours</h4>
               <div className="space-y-2">
                  <div className="flex justify-between text-xs font-bold text-gray-700">
                     <span>Monday - Friday</span>
                     <span>9 AM - 6 PM</span>
                  </div>
                  <div className="flex justify-between text-xs font-bold text-gray-700">
                     <span>Saturday</span>
                     <span>10 AM - 4 PM</span>
                  </div>
                  <div className="flex justify-between text-xs font-bold text-gray-400 tracking-tight">
                     <span>Sunday</span>
                     <span>Closed</span>
                  </div>
               </div>
            </div>
          </div>

          <div className="bg-primary/5 p-8 rounded-[2rem] border border-primary/10 flex items-start gap-4">
             <div className="p-3 bg-white text-primary rounded-xl shadow-sm border border-primary/10">
                <ShieldCheck size={24} />
             </div>
             <div>
                <p className="text-xs font-bold text-primary uppercase tracking-widest mb-1">Privacy First</p>
                <p className="text-xs text-gray-600 leading-relaxed font-medium">
                  Your data is encrypted and handled with the highest security standards. Check our Privacy Policy for more.
                </p>
             </div>
          </div>
        </div>
      </div>

      {showToast && (
        <Toast 
          message="Message sent successfully! Our team will contact you soon." 
          type="success"
          onClose={() => setShowToast(false)}
        />
      )}
      </div>
    </div>
  );
};

export default Help;
