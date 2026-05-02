import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FileText, Eye, Zap, CheckCircle, 
  LayoutDashboard, MessageSquare, ShieldCheck, 
  Clock, BarChart3, ChevronRight,
  ArrowRight, AlertCircle, Lock, BookOpen, 
  Home, HelpCircle, Users, Search, Target
} from 'lucide-react';
import { clsx } from 'clsx';

const useScrollReveal = () => {
  const [isVisible, setIsVisible] = useState(false);
  const domRef = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) setIsVisible(true);
      });
    }, { threshold: 0.1 });
    
    const current = domRef.current;
    if (current) observer.observe(current);
    
    return () => {
      if (current) observer.unobserve(current);
    };
  }, []);

  return [domRef, isVisible];
};

const RevealSection = ({ children, className }) => {
  const [ref, isVisible] = useScrollReveal();
  return (
    <div
      ref={ref}
      className={clsx(
        className,
        'transition-all duration-1000 transform',
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      )}
    >
      {children}
    </div>
  );
};

const Landing = () => {
  const [selectedRole, setSelectedRole] = useState(null);
  const navigate = useNavigate();

  const handleNavigate = (path) => {
    if (selectedRole) {
      navigate(path, { state: { role: selectedRole } });
    }
  };

  const roles = [
    {
      id: 'student',
      title: 'Student',
      icon: '🎓',
      desc: 'Submit and track complaints',
      color: 'blue'
    },
    {
      id: 'staff',
      title: 'Staff',
      icon: '💼',
      desc: 'Manage department issues',
      color: 'green'
    },
    {
      id: 'admin',
      title: 'Admin',
      icon: '🏛️',
      desc: 'Manage and resolve complaints',
      color: 'purple'
    }
  ];

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900 overflow-x-hidden">
      
      {/* SECTION 1 — HERO */}
      <section id="hero" className="relative min-h-[90vh] bg-gradient-to-br from-[#1e40af] to-[#0d9488] flex flex-col items-center justify-center py-20 px-4">
        {/* Background Decoration */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-64 h-64 bg-blue-400 opacity-20 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-20 w-80 h-80 bg-teal-400 opacity-20 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 w-full max-w-6xl mx-auto flex flex-col items-center text-center">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-12 animate-in fade-in duration-700">
            <div className="bg-white/10 backdrop-blur-md p-2 rounded-xl border border-white/20">
               <div className="bg-white text-blue-600 w-10 h-10 rounded-lg flex items-center justify-center shadow-lg font-black text-xl">C</div>
            </div>
            <span className="text-2xl font-black text-white tracking-tight">ComplaintHub</span>
          </div>

          <h1 className="text-4xl md:text-7xl font-black text-white mb-6 tracking-tight leading-[1.1] animate-in slide-in-from-bottom-4 duration-700">
            Your College Complaints,<br />
            <span className="text-cyan-300">Resolved Faster.</span>
          </h1>
          
          <p className="text-lg md:text-xl text-blue-50 max-w-2xl mb-12 font-medium opacity-90 leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-1000">
            ComplaintHub connects students, staff, and administration in one smart platform. 
            Submit complaints, track progress, and get real resolutions — powered by AI.
          </p>

          {/* Role Selection */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 w-full max-w-4xl px-4 animate-in zoom-in-95 duration-700">
            {roles.map((role) => (
              <div 
                key={role.id}
                onClick={() => setSelectedRole(role.id)}
                className={clsx(
                  "bg-white/10 backdrop-blur-md border-2 p-8 rounded-3xl cursor-pointer transition-all duration-300 group flex flex-col items-center",
                  selectedRole === role.id 
                    ? 'border-white bg-white/20 scale-105 shadow-2xl shadow-black/10' 
                    : 'border-white/10 hover:border-white/30 hover:bg-white/15'
                )}
              >
                <div className="text-5xl mb-4 transform transition-transform group-hover:scale-110 duration-300">{role.icon}</div>
                <h3 className="text-xl font-black text-white mb-2">{role.title}</h3>
                <p className="text-blue-50/70 text-sm font-medium">{role.desc}</p>
                {selectedRole === role.id && (
                  <div className="mt-4 w-2 h-2 rounded-full bg-cyan-300 animate-ping" />
                )}
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-center min-h-[64px]">
            {!selectedRole ? (
              <div className="bg-white/5 border border-white/10 text-white/50 px-10 py-4 rounded-full font-bold tracking-tight text-sm uppercase">
                Select a role to continue
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row gap-4 animate-in fade-in zoom-in-95">
                <button 
                  onClick={() => handleNavigate('/login')}
                  className="bg-white text-blue-700 px-10 py-4 rounded-full font-black text-sm shadow-xl hover:bg-blue-50 transition-all flex items-center gap-2 group active:scale-95"
                >
                  LOGIN AS {selectedRole.toUpperCase()} <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </button>
                <button 
                  onClick={() => handleNavigate('/signup')}
                  className="bg-transparent border-2 border-white text-white px-10 py-4 rounded-full font-black text-sm hover:bg-white/10 transition-all active:scale-95"
                >
                  CREATE ACCOUNT
                </button>
              </div>
            )}
          </div>

          <p className="mt-12 text-blue-50/60 text-sm font-bold tracking-tight">
            Already have an account? <button onClick={() => navigate('/login')} className="text-white hover:underline">Use Login</button>
          </p>
        </div>
        
        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-50 animate-bounce">
           <div className="w-1 h-12 bg-gradient-to-b from-white to-transparent rounded-full" />
        </div>
      </section>

      {/* SECTION 2 — HOW IT WORKS */}
      <RevealSection className="py-32 px-4 max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4 tracking-tight">How It Works</h2>
          <p className="text-gray-500 font-bold uppercase tracking-widest text-sm">Simple 4-step process from complaint to resolution</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
          {/* Connecting Lines (Desktop) */}
          <div className="hidden md:block absolute top-12 left-1/4 right-1/4 h-0.5 bg-gray-100 -z-10" />
          
          {[
            { 
              step: "Step 1", 
              title: "Student Submits", 
              desc: "Student fills complaint form with title, category, priority and description", 
              icon: <FileText className="text-white" size={24} />,
              color: "bg-blue-600",
              label: "Submit 📝"
            },
            { 
              step: "Step 2", 
              title: "Admin Reviews", 
              desc: "Admin reviews complaint and assigns it to the right staff member", 
              icon: <Eye className="text-white" size={24} />,
              color: "bg-purple-600",
              label: "Review 👁"
            },
            { 
              step: "Step 3", 
              title: "Staff Acts", 
              desc: "Staff member handles the issue and updates progress in real time", 
              icon: <Zap className="text-white" size={24} />,
              color: "bg-amber-500",
              label: "Action ⚡"
            },
            { 
              step: "Step 4", 
              title: "Issue Resolved", 
              desc: "Student gets notified with resolution details and closes the case", 
              icon: <CheckCircle className="text-white" size={24} />,
              color: "bg-green-600",
              label: "Resolved ✅"
            }
          ].map((item, idx) => (
            <div key={idx} className="flex flex-col items-center text-center group">
              <div className={clsx("w-20 h-20 rounded-3xl flex items-center justify-center mb-6 shadow-xl transition-all duration-300 group-hover:scale-110 group-hover:rotate-3", item.color)}>
                {item.icon}
              </div>
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2">{item.step} — {item.label}</span>
              <h3 className="text-xl font-black text-gray-900 mb-3">{item.title}</h3>
              <p className="text-gray-500 text-sm font-medium leading-relaxed px-4">{item.desc}</p>
            </div>
          ))}
        </div>
      </RevealSection>

      {/* SECTION 3 — FEATURES GRID */}
      <section className="py-32 bg-gray-50 px-4">
        <RevealSection className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4 tracking-tight">Everything You Need</h2>
            <p className="text-gray-500 font-bold uppercase tracking-widest text-sm">Built for college complaint management</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { title: "Smart Submission 📋", desc: "Submit complaints in under 2 minutes with our guided form. Set priority, category and get instant tracking ID.", icon: <FileText size={24} /> },
              { title: "Real-Time Tracking 📊", desc: "Track your complaint status live. Know exactly when it's pending, in progress or resolved.", icon: <BarChart3 size={24} /> },
              { title: "AI Assistant — Matty 🤖", desc: "Meet Matty, your AI support assistant powered by Gemini. Available 24/7 to answer questions and guide you.", icon: <ShieldCheck size={24} /> },
              { title: "Role-Based Access 🔐", desc: "Separate dashboards for Students, Staff and Admin. Everyone sees only what they need.", icon: <Users size={24} /> },
              { title: "Staff Assignment ⚡", desc: "Admin assigns complaints to the right department staff. Accountability at every step.", icon: <Zap size={24} /> },
              { title: "Complete History 📁", desc: "Full complaint history with timestamps, assigned staff names and resolution notes always available.", icon: <Clock size={24} /> }
            ].map((feature, idx) => (
              <div key={idx} className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-subtle hover:shadow-premium transition-all duration-300 group flex flex-col">
                <div className={clsx(
                  "w-12 h-12 rounded-2xl flex items-center justify-center mb-6 transition-all duration-300 group-hover:rotate-12",
                  idx % 6 === 0 ? "bg-blue-50 text-blue-600" :
                  idx % 6 === 1 ? "bg-cyan-50 text-cyan-600" :
                  idx % 6 === 2 ? "bg-purple-50 text-purple-600" :
                  idx % 6 === 3 ? "bg-green-50 text-green-600" :
                  idx % 6 === 4 ? "bg-amber-50 text-amber-600" : "bg-indigo-50 text-indigo-600"
                )}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-black text-gray-900 mb-4">{feature.title}</h3>
                <p className="text-gray-500 font-medium leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </RevealSection>
      </section>

      {/* SECTION 4 — MATTY AI HIGHLIGHT */}
      <section className="py-32 px-4 bg-gradient-to-br from-blue-700 via-indigo-700 to-purple-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-white/5 skew-x-12 pointer-events-none" />
        
        <RevealSection className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="flex justify-center lg:justify-start">
             <div className="relative group">
                <div className="absolute inset-0 bg-white/20 rounded-full blur-3xl animate-pulse" />
                <div className="relative bg-white/10 backdrop-blur-xl p-16 rounded-[4rem] border border-white/20 shadow-2xl transition-transform duration-500 group-hover:scale-105 group-hover:rotate-2">
                   <ShieldCheck size={160} className="text-white drop-shadow-2xl" />
                   <div className="absolute -top-4 -right-4 bg-cyan-400 text-blue-900 px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest shadow-xl">
                      Live AI
                   </div>
                </div>
             </div>
          </div>

          <div className="text-white">
            <span className="inline-block bg-white/20 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-white/30 mb-6">NEW — AI POWERED</span>
            <h2 className="text-4xl md:text-6xl font-black mb-8 leading-tight tracking-tight">
              Meet Matty, Your AI<br />Support Assistant
            </h2>
            <p className="text-xl text-blue-50/80 font-medium mb-10 leading-relaxed">
              Matty is built into ComplaintHub to help students, staff and admins 24/7. 
              Powered by Google Gemini AI, Matty can:
            </p>

            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
              {[
                "Guide you through submission",
                "Answer status questions",
                "Explain priority levels",
                "Find the right department",
                "Available 24/7 everywhere"
              ].map((text, idx) => (
                <li key={idx} className="flex items-center gap-3 bg-white/10 p-4 rounded-2xl border border-white/10 transition-colors hover:bg-white/15">
                  <div className="bg-cyan-400 p-1 rounded-full"><CheckCircle size={14} className="text-blue-900" /></div>
                  <span className="font-bold text-sm">{text}</span>
                </li>
              ))}
            </ul>

            <p className="text-blue-50/50 text-xs font-bold uppercase tracking-widest">Completely free. No extra setup needed.</p>
          </div>
        </RevealSection>
      </section>

      {/* SECTION 5 — STATS BAR */}
      <section className="bg-[#0f172a] py-16 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12 text-center">
           {[
             { label: "Complaints Resolved", val: "500+", icon: "📋" },
             { label: "Role System", val: "3-Tier", icon: "⚡" },
             { label: "AI Powered by Gemini", val: "24/7", icon: "🤖" },
             { label: "Built for College", val: "Students", icon: "🎓" }
           ].map((stat, idx) => (
             <div key={idx} className="flex flex-col items-center group">
                <span className="text-3xl mb-3 transform group-hover:scale-125 transition-transform duration-300">{stat.icon}</span>
                <span className="text-3xl font-black text-white mb-1">{stat.val}</span>
                <span className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em]">{stat.label}</span>
             </div>
           ))}
        </div>
      </section>

      {/* SECTION 6 — CATEGORIES SECTION */}
      <section className="py-32 px-4 bg-white">
        <RevealSection className="max-w-5xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4 tracking-tight">Complaint Categories</h2>
          <p className="text-gray-500 font-bold uppercase tracking-widest text-sm mb-16">From hostel issues to academic problems — we cover it all</p>

          <div className="flex flex-wrap justify-center gap-4">
            {[
              { icon: <HelpCircle size={16} />, label: "WiFi & Internet", color: "bg-blue-50 text-blue-700" },
              { icon: <AlertCircle size={16} />, label: "Mess & Food Quality", color: "bg-orange-50 text-orange-700" },
              { icon: <Target size={16} />, label: "Maintenance & Repairs", color: "bg-teal-50 text-teal-700" },
              { icon: <BookOpen size={16} />, label: "Billing & Fees", color: "bg-green-50 text-green-700" },
              { icon: <Lock size={16} />, label: "Security & Safety", color: "bg-red-50 text-red-700" },
              { icon: <BookOpen size={16} />, label: "Academic Issues", color: "bg-purple-50 text-purple-700" },
              { icon: <Home size={16} />, label: "Hostel Problems", color: "bg-indigo-50 text-indigo-700" },
              { icon: <HelpCircle size={16} />, label: "Other Issues", color: "bg-gray-100 text-gray-700" }
            ].map((cat, idx) => (
              <div key={idx} className={clsx(
                "flex items-center gap-3 px-6 py-4 rounded-2xl font-black text-sm border shadow-sm transition-all duration-300 hover:scale-105 cursor-default",
                cat.color,
                "border-transparent hover:shadow-md"
              )}>
                {cat.icon} {cat.label}
              </div>
            ))}
          </div>
        </RevealSection>
      </section>

      {/* SECTION 7 — BOTTOM CTA */}
      <section className="py-32 px-4 bg-blue-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-teal-600 opacity-90" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-white opacity-5 rounded-full blur-[120px] pointer-events-none" />

        <RevealSection className="relative z-10 max-w-4xl mx-auto text-center text-white">
          <h2 className="text-4xl md:text-6xl font-black mb-6 tracking-tight">Ready to Get Started?</h2>
          <p className="text-xl text-blue-50/80 font-medium mb-12">Join your college community on ComplaintHub today.</p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <button 
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="bg-white text-blue-700 px-12 py-5 rounded-full font-black text-lg shadow-2xl hover:scale-105 transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              SELECT YOUR ROLE <ArrowRight size={24} className="-rotate-90" />
            </button>
            <button 
              onClick={() => navigate('/signup')}
              className="bg-transparent border-2 border-white text-white px-12 py-5 rounded-full font-black text-lg hover:bg-white/10 transition-all active:scale-95"
            >
              CREATE ACCOUNT
            </button>
          </div>
        </RevealSection>
      </section>

      {/* FOOTER */}
      <footer className="bg-gray-900 py-20 px-4 border-t border-white/5">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-16 items-center">
          <div className="flex flex-col items-center md:items-start gap-4">
            <div className="flex items-center gap-3">
              <div className="bg-blue-600 text-white w-8 h-8 rounded-lg flex items-center justify-center font-black text-lg">C</div>
              <span className="text-xl font-black text-white">ComplaintHub</span>
            </div>
            <p className="text-gray-500 text-sm font-medium">Your voice matters. Submit, track and resolve complaints efficiently.</p>
          </div>

          <div className="flex justify-center gap-12 font-black text-sm text-gray-400 tracking-tight">
            <button onClick={() => navigate('/login')} className="hover:text-white transition-colors">LOGIN</button>
            <button onClick={() => navigate('/signup')} className="hover:text-white transition-colors">SIGN UP</button>
            <button onClick={() => navigate('/help')} className="hover:text-white transition-colors">HELP</button>
          </div>

          <div className="flex flex-col items-center md:items-end gap-2 text-gray-500 font-medium text-xs">
            <p>© 2026 ComplaintHub. All rights reserved.</p>
            <p>Built with ❤️ for college students</p>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default Landing;
