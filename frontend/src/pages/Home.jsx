import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import StatCard from '../components/StatCard';
import { 
  PlusCircle, LayoutDashboard, Clock, CheckCircle, 
  ArrowRight, ShieldCheck, Zap, HelpCircle, 
  TrendingUp, BarChart3, AlertCircle 
} from 'lucide-react';

import Navbar from '../components/Navbar';

const Home = () => {
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    inprogress: 0,
    resolved: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/complaints/mine');
        const complaints = res.data;
        setStats({
          total: complaints.length,
          pending: complaints.filter(c => c.status === 'pending').length,
          inprogress: complaints.filter(c => c.status === 'inprogress').length,
          resolved: complaints.filter(c => c.status === 'resolved').length,
        });
      } catch (err) {
        console.error('Error fetching stats:', err);
      }
    };
    fetchStats();
  }, []);

  return (
    <div>
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-8 md:py-12 space-y-12 animate-in fade-in duration-500">
      {/* Hero Section */}
      <section className="bg-white rounded-[2rem] p-8 md:p-16 border border-gray-100 shadow-premium flex flex-col md:flex-row items-center gap-10 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -mr-32 -mt-32 blur-3xl opacity-50" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/5 rounded-full -ml-32 -mb-32 blur-3xl opacity-50" />
        
        <div className="flex-1 space-y-6 relative z-10">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
            <Zap size={14} /> Fast & Reliable Resolution
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 tracking-tight leading-[1.1]">
            We're here to <span className="text-primary">Help You</span> Fix It.
          </h1>
          <p className="text-lg text-gray-500 max-w-xl leading-relaxed">
            Submit your complaints, track their real-time progress, and get dedicated support from our expert team. Your satisfaction is our priority.
          </p>
          <div className="flex flex-wrap gap-4 pt-2">
            <Link to="/submit" className="btn-primary px-8 py-4 flex items-center gap-2 text-base font-bold shadow-xl shadow-primary/20 hover:scale-105 transition-transform">
              <PlusCircle size={20} /> Submit a Complaint
            </Link>
            <Link to="/my-complaints" className="btn-secondary px-8 py-4 flex items-center gap-2 text-base font-bold border border-gray-200">
              <LayoutDashboard size={20} /> View Status
            </Link>
          </div>
        </div>
        
        <div className="flex-1 grid grid-cols-2 gap-4 w-full relative z-10">
           <div className="space-y-4 pt-8">
              <div className="bg-white p-6 rounded-2xl shadow-premium border border-gray-50 flex flex-col items-center text-center">
                 <div className="w-12 h-12 bg-warning/10 text-warning rounded-xl flex items-center justify-center mb-3">
                    <Clock size={24} />
                 </div>
                 <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
                 <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Pending</p>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-premium border border-gray-50 flex flex-col items-center text-center">
                 <div className="w-12 h-12 bg-success/10 text-success rounded-xl flex items-center justify-center mb-3">
                    <CheckCircle size={24} />
                 </div>
                 <p className="text-2xl font-bold text-gray-900">{stats.resolved}</p>
                 <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Resolved</p>
              </div>
           </div>
           <div className="space-y-4">
              <div className="bg-primary p-6 rounded-2xl shadow-premium shadow-primary/20 flex flex-col items-center text-center text-white">
                 <div className="w-12 h-12 bg-white/20 text-white rounded-xl flex items-center justify-center mb-3">
                    <TrendingUp size={24} />
                 </div>
                 <p className="text-2xl font-bold">{stats.total}</p>
                 <p className="text-xs font-bold text-white/70 uppercase tracking-widest mt-1">Total Submissions</p>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-premium border border-gray-50 flex flex-col items-center text-center">
                 <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center mb-3">
                    <BarChart3 size={24} />
                 </div>
                 <p className="text-2xl font-bold text-gray-900">{stats.inprogress}</p>
                 <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">In Progress</p>
              </div>
           </div>
        </div>
      </section>

      {/* Feature Cards Section */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white p-10 rounded-[2rem] border border-gray-100 shadow-subtle hover:shadow-premium transition-all group">
          <div className="w-14 h-14 bg-blue-50 text-primary rounded-2xl flex items-center justify-center mb-8 border border-blue-100 group-hover:scale-110 transition-transform">
            <Zap size={28} />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-4 tracking-tight">Easy Submission</h3>
          <p className="text-gray-500 leading-relaxed text-sm">
            Quickly file your complaints with all necessary details and attachments in just a few clicks.
          </p>
        </div>
        <div className="bg-white p-10 rounded-[2rem] border border-gray-100 shadow-subtle hover:shadow-premium transition-all group">
          <div className="w-14 h-14 bg-amber-50 text-warning rounded-2xl flex items-center justify-center mb-8 border border-amber-100 group-hover:scale-110 transition-transform">
            <TrendingUp size={28} />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-4 tracking-tight">Track Real-time</h3>
          <p className="text-gray-500 leading-relaxed text-sm">
            Stay updated with live status notifications and track exactly where your complaint stands.
          </p>
        </div>
        <div className="bg-white p-10 rounded-[2rem] border border-gray-100 shadow-subtle hover:shadow-premium transition-all group">
          <div className="w-14 h-14 bg-purple-50 text-accent rounded-2xl flex items-center justify-center mb-8 border border-purple-100 group-hover:scale-110 transition-transform">
            <ShieldCheck size={28} />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-4 tracking-tight">Verified Solutions</h3>
          <p className="text-gray-500 leading-relaxed text-sm">
            Our specialized team ensures every issue is resolved thoroughly with a verified resolution message.
          </p>
        </div>
      </section>

      {/* CTA Banner Area */}
      <section className="relative rounded-[2.5rem] bg-gradient-to-r from-primary to-accent p-10 md:p-16 overflow-hidden shadow-2xl shadow-primary/20">
         <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -mr-48 -mt-48 blur-3xl" />
         <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full -ml-32 -mb-32 blur-2xl" />
         
         <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
            <div className="max-w-xl text-center md:text-left space-y-4">
               <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">Still have questions?</h2>
               <p className="text-primary-foreground/80 text-white/80 text-lg">
                  Check out our FAQ section or contact support for personalized assistance. We are available 24/7.
               </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
               <Link to="/help" className="bg-white text-primary px-8 py-4 rounded-xl font-bold text-base hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 shadow-lg">
                 <HelpCircle size={20} /> Visit Help Center
               </Link>
               <button className="bg-white/10 backdrop-blur-md text-white border border-white/20 px-8 py-4 rounded-xl font-bold text-base hover:bg-white/20 transition-colors flex items-center justify-center gap-2">
                  Contact Support <ArrowRight size={20} />
               </button>
            </div>
         </div>
      </section>

      {/* Footer */}
      <footer className="pt-12 border-t border-gray-200 text-center pb-12">
        <div className="flex items-center justify-center gap-2 mb-6 opacity-30">
          <div className="bg-gray-900 w-6 h-6 rounded-md flex items-center justify-center">
            <span className="text-white font-bold text-sm">C</span>
          </div>
          <span className="text-lg font-bold text-gray-900 tracking-tight">ComplaintHub</span>
        </div>
        <p className="text-sm text-gray-400 font-medium tracking-wide">
          © 2026 ComplaintHub. All rights reserved. Precision in resolution.
        </p>
      </footer>
    </div>
    </div>
  );
};

export default Home;
