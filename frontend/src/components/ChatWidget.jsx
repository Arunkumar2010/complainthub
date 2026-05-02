import { useState, useRef, useEffect } from 'react';
import api from '../api/axios';
import mattyLogo from '../assets/matty-avatar.svg';

// Detect role from JWT token
const getRoleData = () => {
  const token = localStorage.getItem('token');
  let role = 'user';
  let userName = 'there';
  try {
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      role = payload.role || 'user';
      userName = payload.name || 'there';
    }
  } catch (e) {}
  return { role, userName };
};

const { role, userName } = getRoleData();

const getWelcomeMessage = () => {
  if (role === 'admin') {
    return `👋 Hi ${userName}! I am Matty, your AI assistant. I can help you:
- Check overdue complaints
- Suggest best staff for assignment  
- Give staff performance summary
- Alert you about urgent cases
What would you like to know? 🛡`;
  } else if (role === 'staff') {
    return `👋 Hi ${userName}! I am Matty, your AI assistant. I can help you:
- Show your priority task list today
- Alert you about overdue complaints
- Tell you what is due soon
- Guide you through resolving complaints
What do you need help with? 💼`;
  } else {
    return `👋 Hi ${userName}! I am Matty, your AI support assistant for ComplaintHub! I can help you:
- Track your complaint status
- Tell you if complaints are overdue
- Explain how the system works
- Answer any questions you have
What can I help you with today? 🎓`;
  }
};

const WELCOME_MESSAGE = {
  id: 1,
  role: 'assistant',
  content: getWelcomeMessage(),
  time: new Date().toLocaleTimeString([], {
    hour: '2-digit', minute: '2-digit'
  })
};

const headerColor = 
  role === 'admin' ? '#7c3aed' :
  role === 'staff' ? '#16a34a' : 
  '#2563eb';

const LOCAL_COMMANDS = {
  'hi': 'Hi there! 👋 I am Matty, your AI support assistant! How can I help you today?',
  'hello': 'Hello! 😊 I am Matty! Ask me anything about ComplaintHub!',
  'hey': 'Hey! 👋 Matty here! What can I do for you?',
  'help': 'I can help you with:\n📋 Submitting complaints\n📊 Tracking complaint status\n❓ Understanding categories\n⏰ Due dates and priorities\n👥 Staff assignments\n\nJust ask me your question!',
  'bye': 'Goodbye! 👋 Come back if you need help. Good luck with your studies! 🎓',
  'goodbye': 'Take care! 😊 I am always here when you need me!',
  'thanks': 'You are welcome! 😊 Happy to help anytime!',
  'thank you': 'My pleasure! 🤖 Is there anything else I can help with?',
  'ok': 'Great! Let me know if you need anything else! 😊',
  'okay': 'Perfect! Feel free to ask if you have more questions! 🎓',
  'yes': 'Great! What would you like to know? 😊',
  'no': 'Okay! Let me know if you need anything else! 😊',
  'who are you': 'I am Matty 🤖 — your AI support assistant for ComplaintHub! I help students, staff and admins with complaint management. Ask me anything!',
  'what is complainthub': 'ComplaintHub is an Online Complaint Management System for college students. Students submit complaints, admins assign them to staff, and staff resolves them. I am Matty, the AI assistant built into the system! 🎓',
  'what day is it': `Today is ${new Date().toDateString()}! How can I help you? 📅`,
  'what is today': `Today is ${new Date().toDateString()}! 📅 Need help with anything?`,
  'time': `I do not have real-time clock access, but your device clock is always accurate! ⏰ Is there anything I can help you with?`,
  'test': 'Matty is working perfectly! ✅ All systems operational! How can I help you? 🤖',
  'ping': 'Pong! 🏓 Matty is online and ready to help!',
  'joke': 'Why did the student file a complaint about the WiFi? Because it had too many connection issues! 😄 (But seriously, submit a complaint if your WiFi is actually down!)',
  'fun fact': 'Fun fact: ComplaintHub can handle complaints about 8 different categories including WiFi, Mess Food, Maintenance, Billing, Security, Academics, Hostel Problems and more! 🎓',
  'how many questions': 'I have 130+ pre-programmed answers plus Google Gemini AI for smart questions! That makes me quite knowledgeable 😄🤖',
  'what languages': 'I currently speak English! For other languages use your browser translation feature. Regional language support may come in future updates! 🌐',
  'are you human': 'No, I am Matty — an AI chatbot! 🤖 But I am trained to be as helpful as a human support agent. I use Google Gemini AI plus a custom knowledge base to answer your questions!',
  'do you sleep': 'Never! 😄 I am available 24/7, 365 days a year. Even on holidays and exam nights! That is the advantage of being an AI 🤖',
  'who is your creator': 'I was built as part of the ComplaintHub project — a SEPM academic project! My knowledge base was carefully crafted to help college students with complaint management. 🎓',
  'version': 'Matty v3.0 🤖\nKnowledge base: 185+ Q&A pairs\nAI engine: Google Gemini\nMode: Hybrid (offline + online)\nStatus: Operational ✅',
  'what is due date': 'Due dates are automatically calculated based on priority:\n🔴 URGENT = 1 day\n🟠 HIGH = 3 days\n🟡 MEDIUM = 7 days\n🟢 LOW = 14 days\n\nCheck My Complaints page to see your specific due dates!',
  'what is resolution': 'Resolution is the solution message written by staff when they fix your complaint! You can see it as a green box in My Complaints page under resolved complaints. It explains exactly what was done to fix your issue! ✅',
  'what is in progress': 'In Progress means a staff member has been assigned to your complaint and is actively working on fixing the issue! You can see who is assigned in My Complaints page. Expected resolution depends on your priority level! ⚡',
  'show categories': 'Available complaint categories:\n📶 WiFi & Internet\n🍽 Mess & Food Quality\n🔧 Maintenance & Repairs\n💰 Billing & Fees\n🔒 Security & Safety\n📚 Academic Issues\n🏠 Hostel Problems\n📦 Other\n\nChoose the most relevant one for fastest routing to right department!',
  'show priorities': 'Priority levels:\n🔴 URGENT = 24 hours (safety, medical, no water)\n🟠 HIGH = 3 days (WiFi down, serious issues)\n🟡 MEDIUM = 7 days (minor repairs, billing)\n🟢 LOW = 14 days (suggestions, minor requests)\n\nAlways set honest priority for best results!',
  'my role': 'Ask me what your role can do! Type:\n- "what can student do"\n- "what can staff do"\n- "what can admin do"\n\nEach role has different features and access levels in ComplaintHub! 🎓',
  'contact': 'Contact ComplaintHub support:\n📧 Email: support@complainthub.com\n📞 Phone: +1 (800) 123-4567\nMon-Fri: 9AM to 6PM\nSat: 10AM to 4PM\n\nInclude your complaint ID for faster help!',
  'emergency': '🚨 For real emergencies:\n1. Contact warden IMMEDIATELY\n2. Call security guard\n3. Do NOT wait for complaint system!\n\nFor urgent complaints:\nSubmit with URGENT priority\nSystem alerts admin right away!\n\n📞 Always keep warden number saved!',
  'show status': 'Complaint status meanings:\n🟡 PENDING = Waiting for admin review\n🔵 IN PROGRESS = Staff working on it\n🟢 RESOLVED = Issue fixed!\n⚫ CLOSED = Case archived\n\nCheck My Complaints page for your status!',
  'matty help': 'I am Matty! 🤖 Here is what I can do:\n\n⚡ INSTANT (offline):\n• Answer 185+ common questions\n• Explain categories and priorities\n• Guide complaint submission\n\n🤖 AI-POWERED (online):\n• Check YOUR complaint status\n• Staff overdue alerts\n• Smart assignment suggestions\n• Personalized data analysis\n\nJust ask me anything! 😊'
};

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([WELCOME_MESSAGE]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [conversationHistory, setConversationHistory] = useState([]);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = async (textOverride) => {
    const text = textOverride || inputText;
    const trimmed = text.trim();
    if (!trimmed || isTyping) return;

    const userMsg = {
      id: Date.now(),
      role: 'user',
      content: trimmed,
      time: new Date().toLocaleTimeString([], {
        hour: '2-digit', minute: '2-digit'
      })
    };

    setMessages(prev => [...prev, userMsg]);
    setConversationHistory(prev => [
      ...prev,
      { role: 'user', content: trimmed }
    ]);
    if (!textOverride) setInputText('');

    // --- LOCAL COMMANDS CHECK ---
    const trimmedLower = trimmed.toLowerCase().trim();
    if (LOCAL_COMMANDS[trimmedLower]) {
      console.log('LOCAL:', trimmedLower);
      const localReply = {
        id: Date.now() + 1,
        role: 'assistant',
        content: LOCAL_COMMANDS[trimmedLower],
        time: new Date().toLocaleTimeString([], {
          hour: '2-digit', minute: '2-digit'
        })
      };
      // Delay slightly for natural feel
      setTimeout(() => {
        setMessages(prev => [...prev, localReply]);
        setIsTyping(false);
      }, 300);
      setIsTyping(true);
      return; 
    }

    setIsTyping(true);

    try {
      const res = await api.post('/support/chat', {
        message: trimmed,
        history: conversationHistory
      });

      const aiMsg = {
        id: Date.now() + 1,
        role: 'assistant',
        content: res.data.reply,
        time: new Date().toLocaleTimeString([], {
          hour: '2-digit', minute: '2-digit'
        })
      };

      setMessages(prev => [...prev, aiMsg]);
      setConversationHistory(res.data.history);

    } catch (err) {
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        role: 'assistant',
        content: "Sorry, I am having trouble right now 😅 Please try again or email support@complainthub.com",
        time: new Date().toLocaleTimeString([], {
          hour: '2-digit', minute: '2-digit'
        })
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleQuickAction = (label, message) => {
    handleSend(message);
  };

  const handleClear = () => {
    setMessages([WELCOME_MESSAGE]);
    setConversationHistory([]);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const getQuickActions = () => {
    if (role === 'admin') {
      return [
        { label: '⚠️ Overdue Alert', message: 'show me all overdue complaints' },
        { label: '👥 Staff Performance', message: 'give me staff performance summary' },
        { label: '📊 Summary', message: 'give me a summary of all complaints' }
      ];
    } else if (role === 'staff') {
      return [
        { label: "⚡ Today's Tasks", message: 'what should I focus on today' },
        { label: '🔴 Overdue', message: 'show my overdue complaints' },
        { label: '✅ My Resolved', message: 'show my resolved complaints' }
      ];
    } else {
      return [
        { label: '📋 My Complaints', message: 'show me my complaints' },
        { label: '📊 Check Status', message: 'what is the status of my complaints' },
        { label: '❓ How to Submit', message: 'how do i submit a complaint' }
      ];
    }
  };

  return (
    <div style={{ 
      position: 'fixed', 
      bottom: '24px', 
      right: '24px', 
      zIndex: 1000 
    }}>

      {/* CHAT WINDOW */}
      {isOpen && (
        <div style={{
          width: '360px',
          height: '520px', // Increased slightly for buttons
          background: 'white',
          borderRadius: '16px',
          boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
          display: 'flex',
          flexDirection: 'column',
          marginBottom: '12px',
          overflow: 'hidden',
          border: '1px solid #e5e7eb'
        }}>

          {/* HEADER */}
          <div style={{
            background: headerColor,
            padding: '14px 16px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            {/* Matty Avatar */}
            <img 
              src={mattyLogo}
              alt="Matty"
              style={{ 
                width: '38px', 
                height: '38px', 
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.2)',
                padding: '4px'
              }}
            />

            <div style={{ flex: 1 }}>
              <div style={{
                color: 'white',
                fontWeight: '600',
                fontSize: '15px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                Matty
                <span style={{
                  width: '7px',
                  height: '7px',
                  background: '#34d399',
                  borderRadius: '50%',
                  display: 'inline-block'
                }}/>
              </div>
              <div style={{
                color: 'rgba(255,255,255,0.8)',
                fontSize: '11px'
              }}>
                AI Support · Powered by Gemini
              </div>
            </div>

            {/* Clear button */}
            <button onClick={handleClear} style={{
              background: 'rgba(255,255,255,0.15)',
              border: 'none',
              color: 'white',
              borderRadius: '6px',
              padding: '4px 8px',
              fontSize: '11px',
              cursor: 'pointer'
            }}>Clear</button>

            {/* Close button */}
            <button onClick={() => setIsOpen(false)} style={{
              background: 'rgba(255,255,255,0.15)',
              border: 'none',
              color: 'white',
              borderRadius: '6px',
              padding: '4px 8px',
              fontSize: '16px',
              cursor: 'pointer',
              lineHeight: 1
            }}>×</button>
          </div>

          {/* MESSAGES */}
          <div style={{
            flex: 1,
            overflowY: 'auto',
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            background: '#f8fafc'
          }}>
            {messages.map(msg => (
              <div key={msg.id} style={{
                display: 'flex',
                justifyContent: msg.role === 'user'
                  ? 'flex-end' : 'flex-start',
                alignItems: 'flex-end',
                gap: '6px'
              }}>
                {msg.role === 'assistant' && (
                  <img 
                    src={mattyLogo}
                    alt="Matty"
                    style={{ 
                      width: '28px', 
                      height: '28px', 
                      borderRadius: '50%',
                      flexShrink: 0,
                      background: headerColor,
                      padding: '2px'
                    }}
                  />
                )}
                <div style={{ maxWidth: '75%' }}>
                  <div style={{
                    padding: '10px 14px',
                    borderRadius: msg.role === 'user'
                      ? '18px 18px 4px 18px'
                      : '18px 18px 18px 4px',
                    background: msg.role === 'user'
                      ? headerColor : 'white',
                    color: msg.role === 'user'
                      ? 'white' : '#1f2937',
                    fontSize: '13px',
                    lineHeight: '1.5',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
                    border: msg.role === 'assistant'
                      ? '1px solid #e5e7eb' : 'none',
                    whiteSpace: 'pre-line'
                  }}>
                    {msg.content}
                  </div>
                  <div style={{
                    fontSize: '10px',
                    color: '#9ca3af',
                    marginTop: '3px',
                    textAlign: msg.role === 'user'
                      ? 'right' : 'left',
                    paddingLeft: msg.role === 'assistant'
                      ? '4px' : '0'
                  }}>
                    {msg.time}
                  </div>
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {isTyping && (
              <div style={{
                display: 'flex',
                alignItems: 'flex-end',
                gap: '6px'
              }}>
                <img 
                  src={mattyLogo}
                  alt="Matty"
                  style={{ 
                    width: '28px', 
                    height: '28px', 
                    borderRadius: '50%',
                    flexShrink: 0,
                    background: headerColor,
                    padding: '2px'
                  }}
                />
                <div style={{
                  background: 'white',
                  borderRadius: '18px 18px 18px 4px',
                  padding: '12px 16px',
                  border: '1px solid #e5e7eb',
                  display: 'flex',
                  gap: '4px',
                  alignItems: 'center'
                }}>
                  {[0,1,2].map(i => (
                    <div key={i} style={{
                      width: '7px',
                      height: '7px',
                      background: headerColor,
                      borderRadius: '50%',
                      animation: 'bounce 1s infinite',
                      animationDelay: `${i * 0.2}s`
                    }}/>
                  ))}
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* QUICK ACTIONS */}
          <div style={{
            padding: '8px 12px',
            background: '#f8fafc',
            borderTop: '1px solid #e5e7eb',
            display: 'flex',
            gap: '8px',
            overflowX: 'auto',
            scrollbarWidth: 'none'
          }}>
            {getQuickActions().map((action, idx) => (
              <button
                key={idx}
                onClick={() => handleQuickAction(action.label, action.message)}
                style={{
                  padding: '6px 12px',
                  borderRadius: '16px',
                  background: 'white',
                  border: `1px solid ${headerColor}`,
                  color: headerColor,
                  fontSize: '11px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.2s'
                }}
                onMouseOver={e => {
                  e.currentTarget.style.background = headerColor;
                  e.currentTarget.style.color = 'white';
                }}
                onMouseOut={e => {
                  e.currentTarget.style.background = 'white';
                  e.currentTarget.style.color = headerColor;
                }}
              >
                {action.label}
              </button>
            ))}
          </div>

          {/* INPUT */}
          <div style={{
            padding: '12px',
            background: 'white',
            borderTop: '1px solid #e5e7eb',
            display: 'flex',
            gap: '8px',
            alignItems: 'center'
          }}>
            <input
              type="text"
              value={inputText}
              onChange={e => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask Matty anything..."
              disabled={isTyping}
              style={{
                flex: 1,
                padding: '10px 16px',
                borderRadius: '24px',
                border: '1px solid #e5e7eb',
                fontSize: '13px',
                outline: 'none',
                background: isTyping ? '#f9fafb' : 'white'
              }}
            />
            <button
              onClick={() => handleSend()}
              disabled={isTyping || !inputText.trim()}
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                background: isTyping || !inputText.trim()
                  ? '#e5e7eb' : headerColor,
                border: 'none',
                cursor: isTyping || !inputText.trim()
                  ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '16px',
                flexShrink: 0
              }}
            >➤</button>
          </div>
        </div>
      )}

      {/* FLOATING BUTTON */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        title="Chat with Matty - AI Support"
        style={{
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          background: headerColor,
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '26px',
          boxShadow: `0 4px 20px ${headerColor}66`,
          animation: isOpen ? 'none' : 'pulse 2s infinite',
          marginLeft: 'auto'
        }}
      >
        {isOpen ? (
          <span style={{ fontSize: '26px', color: 'white' }}>✕</span>
        ) : (
          <img 
            src={mattyLogo}
            alt="Matty"
            style={{ width: '32px', height: '32px' }}
          />
        )}
      </button>

      <style>{`
        @keyframes pulse {
          0%, 100% { box-shadow: 0 4px 20px ${headerColor}66; }
          50% { box-shadow: 0 4px 30px ${headerColor}aa; }
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }
      `}</style>
    </div>
  );
}


