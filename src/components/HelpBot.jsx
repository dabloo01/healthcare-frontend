import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot } from 'lucide-react';

export default function HelpBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { text: "Hello! I'm MediCare AI. How can I assist you with your hospital dashboard today?", isBot: true }
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  useEffect(() => {
    const handleToggle = () => setIsOpen(prev => !prev);
    window.addEventListener('toggle-help-bot', handleToggle);
    return () => window.removeEventListener('toggle-help-bot', handleToggle);
  }, []);

  const generateBotResponse = (userText) => {
    const text = userText.toLowerCase();
    
    // Keyword matching logic
    if (text.match(/\b(hi|hello|hey|greetings)\b/)) {
      return "Hello there! How can I assist you with your administrative duties today?";
    }
    if (text.includes("appointment") || text.includes("book") || text.includes("schedule")) {
      return "To manage appointments, simply click on the 'Appointments' tab in the left sidebar. There you can book new patients and view available doctor time slots.";
    }
    if (text.includes("patient") || text.includes("record") || text.includes("history")) {
      return "The 'Patients' section lets you track all medical records, view past history, and manage checkups. You can search them dynamically!";
    }
    if (text.includes("bill") || text.includes("pay") || text.includes("invoice") || text.includes("receipt")) {
      return "You can generate digital invoices and manage all financial transactions right in the 'Billing' dashboard.";
    }
    if (text.includes("doctor") || text.includes("staff") || text.includes("specialist")) {
      return "Currently, you can assign patients to our available specialist doctors during booking. Let me know if you need to onboard a new doctor.";
    }
    if (text.includes("password") || text.includes("login") || text.includes("account") || text.includes("profile")) {
      return "You can view your profile by clicking your Avatar at the top right. To reset a password, log out and use the OTP 'Forgot Password' flow.";
    }
    if (text.includes("thanks") || text.includes("thank you") || text.includes("ok") || text.includes("cool")) {
      return "You're very welcome! Feel free to ask if you need any more help. 😊";
    }

    // Default Fallback
    return "I'm still learning! Could you rephrase? I can help you with questions about Appointments, Patients, Billing, or Doctors.";
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    // Add user message
    const newMessages = [...messages, { text: inputMessage, isBot: false }];
    setMessages(newMessages);
    const capturedInput = inputMessage;
    setInputMessage("");

    // Simulate AI thinking and replying contextually
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        text: generateBotResponse(capturedInput), 
        isBot: true 
      }]);
    }, 1000);
  };

  return (
    <>
      {/* Floating Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: 'fixed',
          bottom: '32px',
          right: '32px',
          width: '64px',
          height: '64px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, var(--primary-light), var(--primary-color))',
          color: 'white',
          border: 'none',
          boxShadow: '0 8px 30px rgba(79, 70, 229, 0.4)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          transition: 'transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
          transform: isOpen ? 'scale(0)' : 'scale(1)'
        }}
      >
        <MessageCircle size={32} />
      </button>

      {/* Chat Window */}
      <div style={{
        position: 'fixed',
        bottom: '32px',
        right: '32px',
        width: '360px',
        height: '550px',
        background: 'var(--card-bg)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid var(--border-color)',
        borderRadius: '24px',
        boxShadow: '0 15px 50px rgba(0,0,0,0.2)',
        display: 'flex',
        flexDirection: 'column',
        zIndex: 1000,
        overflow: 'hidden',
        transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        transform: isOpen ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.8)',
        opacity: isOpen ? 1 : 0,
        pointerEvents: isOpen ? 'auto' : 'none'
      }}>
        
        {/* Header */}
        <div style={{ 
          background: 'linear-gradient(135deg, var(--primary-light), var(--primary-color))', 
          padding: '24px', 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          color: 'white',
          boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ width: '48px', height: '48px', background: 'rgba(255,255,255,0.2)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Bot size={28} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: '600', letterSpacing: '0.5px' }}>MediCare Support</h3>
              <p style={{ margin: 0, fontSize: '0.85rem', color: 'rgba(255,255,255,0.85)' }}>AI Assistant - Online 🟢</p>
            </div>
          </div>
          <button onClick={() => setIsOpen(false)} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', cursor: 'pointer', padding: '8px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.2s' }}>
            <X size={20} />
          </button>
        </div>

        {/* Messages Layout */}
        <div style={{ flex: 1, padding: '24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {messages.map((msg, idx) => (
            <div key={idx} style={{ 
              display: 'flex', 
              justifyContent: msg.isBot ? 'flex-start' : 'flex-end',
              alignItems: 'flex-end',
              gap: '12px'
            }}>
              {msg.isBot && <div style={{ width: '32px', height: '32px', background: 'var(--gradient-bg-1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary-color)' }}><Bot size={18} /></div>}
              
              <div style={{
                maxWidth: '75%',
                padding: '14px 18px',
                borderRadius: '18px',
                borderBottomLeftRadius: msg.isBot ? '6px' : '18px',
                borderBottomRightRadius: !msg.isBot ? '6px' : '18px',
                background: msg.isBot ? '#f1f5f9' : 'linear-gradient(135deg, var(--primary-light), var(--primary-color))',
                color: msg.isBot ? '#334155' : 'white',
                fontSize: '0.95rem',
                lineHeight: '1.5',
                boxShadow: '0 4px 15px rgba(0,0,0,0.05)'
              }}>
                {msg.text}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <form onSubmit={handleSendMessage} style={{ 
          padding: '20px', 
          borderTop: '1px solid var(--border-color)', 
          background: 'rgba(255,255,255,0.7)',
          display: 'flex',
          gap: '12px'
        }}>
          <input 
            type="text" 
            placeholder="Type your message..." 
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            style={{ 
              flex: 1, 
              padding: '14px 20px', 
              border: '1px solid var(--border-color)', 
              borderRadius: '30px', 
              outline: 'none',
              background: '#fff',
              fontSize: '1rem',
              color: 'var(--text-main)',
              boxShadow: 'inset 0 2px 5px rgba(0,0,0,0.02)'
            }} 
          />
          <button type="submit" disabled={!inputMessage.trim()} style={{ 
            width: '50px', 
            height: '50px', 
            borderRadius: '50%', 
            background: inputMessage.trim() ? 'var(--primary-color)' : '#94a3b8', 
            color: 'white', 
            border: 'none', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            cursor: inputMessage.trim() ? 'pointer' : 'default',
            boxShadow: inputMessage.trim() ? '0 4px 15px rgba(79, 70, 229, 0.4)' : 'none',
            transition: 'all 0.2s'
          }}>
            <Send size={20} style={{ marginLeft: '4px' }} />
          </button>
        </form>

      </div>
    </>
  );
}
