import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink, Navigate } from 'react-router-dom';
import { LayoutDashboard, Users, Calendar, Receipt, LogOut, Moon, Sun, Headset, Stethoscope, Menu, X } from 'lucide-react';
import './index.css';

import Dashboard from './pages/Dashboard';
import Patients from './pages/Patients';
import Appointments from './pages/Appointments';
import Billing from './pages/Billing';
import Auth from './pages/Auth';
import Landing from './pages/Landing';
import HelpBot from './components/HelpBot';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('isLoggedIn') === 'true';
  });
  const [darkMode, setDarkMode] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const safeValue = (value, fallback) => {
    if (
      value === undefined ||
      value === null ||
      value === '' ||
      value === 'undefined' ||
      value === 'null'
    ) {
      return fallback;
    }
    return value;
  };

  const rawUserName = localStorage.getItem('userName');
  const rawUserRole = localStorage.getItem('userRole');
  const rawUserEmail = localStorage.getItem('userEmail');
  const rawUserPhone = localStorage.getItem('userPhone');

  const userName = safeValue(rawUserName, 'System Admin');
  const userRole = safeValue(rawUserRole, 'Hospital Admin');
  const userEmail = safeValue(rawUserEmail, 'admin@medicare.com');
  let userPhone = safeValue(rawUserPhone, '9876543210');

  if (userPhone === 'N/A') userPhone = '9876543210';

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }, [darkMode]);

  const handleLogin = () => {
    localStorage.setItem('isLoggedIn', 'true');
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    setIsAuthenticated(false);
  };

  if (!isAuthenticated) {
    return (
      <Router>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/auth" element={<Auth onLogin={handleLogin} />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    );
  }

  return (
    <Router>
      <div className="app-container" style={{ background: 'var(--main-bg)' }}>
        {/* Mobile Overlay */}
        {sidebarOpen && (
          <div 
            className="sidebar-overlay" 
            onClick={() => setSidebarOpen(false)}
          />
        )}
        
        <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
          <div className="sidebar-logo">
            <Stethoscope size={32} color="#818cf8" strokeWidth={2.5} />
            <span>
              MediCare<span style={{ color: '#818cf8' }}>Pro</span>
            </span>
          </div>

          <nav style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
            <NavLink to="/" onClick={() => setSidebarOpen(false)} className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}>
              <LayoutDashboard size={20} /> Dashboard
            </NavLink>

            <NavLink to="/patients" onClick={() => setSidebarOpen(false)} className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}>
              <Users size={20} /> Patients
            </NavLink>

            <NavLink to="/appointments" onClick={() => setSidebarOpen(false)} className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}>
              <Calendar size={20} /> Appointments
            </NavLink>

            <NavLink to="/billing" onClick={() => setSidebarOpen(false)} className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}>
              <Receipt size={20} /> Billing
            </NavLink>
          </nav>

          <div
            style={{
              marginTop: 'auto',
              borderTop: '1px solid rgba(255,255,255,0.05)',
              paddingTop: '16px',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="nav-item"
              style={{
                width: '100%',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                textAlign: 'left',
                borderLeft: '3px solid transparent'
              }}
            >
              {darkMode ? (
                <>
                  <Sun size={20} /> Light Mode
                </>
              ) : (
                <>
                  <Moon size={20} /> Dark Mode
                </>
              )}
            </button>

            <button
              onClick={handleLogout}
              className="nav-item"
              style={{
                color: '#f87171',
                width: '100%',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                textAlign: 'left',
                borderLeft: '3px solid transparent'
              }}
            >
              <LogOut size={20} /> Secure Logout
            </button>
          </div>
        </aside>

        <main className="main-content">
          <div className="top-header">
            {/* Hamburger Menu for Mobile */}
            <button 
              className="hamburger-btn"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu size={24} />
            </button>
            <button
              onClick={() => window.dispatchEvent(new CustomEvent('toggle-help-bot'))}
              title="AI Support Chat"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 18px',
                background: 'var(--gradient-bg-1)',
                border: '1px solid var(--border-color)',
                borderRadius: '24px',
                color: 'var(--primary-color)',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s',
                boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
              }}
            >
              <Headset size={20} />
              <span className="hide-on-mobile" style={{ fontSize: '0.95rem' }}>Help / Support</span>
            </button>

            <div style={{ position: 'relative' }}>
              <div
                onClick={() => setShowProfile(!showProfile)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  cursor: 'pointer',
                  padding: '6px 16px',
                  borderRadius: '40px',
                  background: 'var(--sidebar-bg)',
                  border: '1px solid var(--border-color)',
                  transition: 'all 0.2s',
                  boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
                }}
              >
                <div className="hide-on-mobile" style={{ textAlign: 'right', display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: '0.95rem', fontWeight: '600', color: 'var(--text-main)' }}>
                    {userName}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {userRole}
                  </span>
                </div>

                <div
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, var(--primary-light), var(--primary-color))',
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.2rem',
                    fontWeight: 'bold',
                    boxShadow: '0 2px 5px rgba(79, 70, 229, 0.4)'
                  }}
                >
                  {userName.charAt(0).toUpperCase()}
                </div>
              </div>

              {showProfile && (
                  <div
                    className="glass-panel"
                    style={{
                      position: 'absolute',
                      top: 'calc(100% + 10px)',
                      right: 0,
                      width: '280px',
                      padding: '24px',
                      zIndex: 1000,
                      background: 'var(--card-bg)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '16px',
                      boxShadow: '0 10px 40px rgba(0,0,0,0.2)'
                    }}
                  >
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      borderBottom: '1px solid var(--border-color)',
                      paddingBottom: '16px'
                    }}
                  >
                    <div
                      style={{
                        width: '64px',
                        height: '64px',
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, var(--primary-light), var(--primary-color))',
                        color: '#fff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '2rem',
                        fontWeight: 'bold',
                        marginBottom: '12px',
                        boxShadow: '0 4px 10px rgba(79, 70, 229, 0.4)'
                      }}
                    >
                      {userName.charAt(0).toUpperCase()}
                    </div>

                    <h3 style={{ margin: '0 0 4px 0', color: 'var(--text-main)', fontSize: '1.2rem' }}>
                      {userName}
                    </h3>

                    <span
                      style={{
                        padding: '4px 12px',
                        background: '#e0e7ff',
                        color: 'var(--primary-color)',
                        borderRadius: '12px',
                        fontSize: '0.8rem',
                        fontWeight: '600'
                      }}
                    >
                      {userRole}
                    </span>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', gap: '12px' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Email:</span>
                      <span style={{ color: 'var(--text-main)', fontWeight: '500', textAlign: 'right', wordBreak: 'break-word' }}>
                        {userEmail}
                      </span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', gap: '12px' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Phone:</span>
                      <span style={{ color: 'var(--text-main)', fontWeight: '500', textAlign: 'right' }}>
                        +91 {userPhone}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={handleLogout}
                    style={{
                      width: '100%',
                      padding: '10px',
                      marginTop: '8px',
                      background: '#fee2e2',
                      color: '#dc2626',
                      border: 'none',
                      borderRadius: '8px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      display: 'flex',
                      justifyContent: 'center',
                      gap: '8px',
                      alignItems: 'center',
                      transition: 'background 0.2s'
                    }}
                  >
                    <LogOut size={18} /> Secure Logout
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="page-content">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/patients" element={<Patients />} />
              <Route path="/appointments" element={<Appointments />} />
              <Route path="/billing" element={<Billing />} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </div>
        </main>

        <HelpBot />
      </div>
    </Router>
  );
}

export default App;