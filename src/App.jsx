import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink, Navigate } from 'react-router-dom';
import { 
  LayoutDashboard, Users, Calendar, Receipt, LogOut, 
  Moon, Sun, Headset, Stethoscope, Menu, X, 
  Package, FileText, Beaker, Clipboard 
} from 'lucide-react';
import { GoogleOAuthProvider } from '@react-oauth/google';
import './index.css';

import Dashboard from './pages/Dashboard';
import Patients from './pages/Patients';
import Appointments from './pages/Appointments';
import Billing from './pages/Billing';
import Auth from './pages/Auth';
import Landing from './pages/Landing';
import HelpBot from './components/HelpBot';

// New Role-Based Dashboards
import PatientDashboard from './pages/PatientDashboard';
import DoctorDashboard from './pages/DoctorDashboard';

// New Modules
import Inventory from './pages/Inventory';
import Prescriptions from './pages/Prescriptions';
import LabReports from './pages/LabReports';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('isLoggedIn') === 'true';
  });
  const [darkMode, setDarkMode] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const safeValue = (value, fallback) => {
    if (value === undefined || value === null || value === '' || value === 'undefined' || value === 'null') {
      return fallback;
    }
    return value;
  };

  const rawUserName = localStorage.getItem('userName');
  const rawUserRole = localStorage.getItem('userRole');
  const rawUserEmail = localStorage.getItem('userEmail');
  const rawUserPhone = localStorage.getItem('userPhone');

  const userName = safeValue(rawUserName, 'System Admin');
  const userRole = safeValue(rawUserRole, 'Admin');
  const userEmail = safeValue(rawUserEmail, 'admin@medicare.com');
  let userPhone = safeValue(rawUserPhone, '9876543210');

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
    localStorage.removeItem('userName');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userPhone');
    setIsAuthenticated(false);
  };

  const NavItem = ({ to, icon: Icon, label }) => (
    <NavLink 
      to={to} 
      onClick={() => setSidebarOpen(false)} 
      className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}
    >
      <Icon size={20} /> {label}
    </NavLink>
  );

  return (
    <GoogleOAuthProvider clientId="604836049021-tq8kl8hav9ne94tqmk7mmlf6h66f775t.apps.googleusercontent.com">
      <Router>
        {!isAuthenticated ? (
          <Routes>
            <Route path="/" element={<Landing onLoginClick={() => {}} />} />
            <Route path="/auth" element={<Auth onLogin={handleLogin} />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        ) : (
          <div className="app-container" style={{ background: 'var(--bg-color)', minHeight: '100vh', width: '100vw' }}>
            {sidebarOpen && (
              <div 
                style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 40 }}
                onClick={() => setSidebarOpen(false)}
              />
            )}
            
            <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
              <div className="sidebar-logo">
                <Stethoscope size={32} color="#818cf8" strokeWidth={2.5} />
                <span>MediCare<span style={{ color: '#818cf8' }}>Pro</span></span>
              </div>

              <nav style={{ display: 'flex', flexDirection: 'column', flex: 1, gap: '4px' }}>
                {/* Admin & Receptionist Nav */}
                {(userRole === 'Admin' || userRole === 'Receptionist') && (
                  <>
                    <NavItem to="/" icon={LayoutDashboard} label="Admin Dashboard" />
                    <NavItem to="/patients" icon={Users} label="Patients" />
                    <NavItem to="/appointments" icon={Calendar} label="Appointments" />
                    <NavItem to="/billing" icon={Receipt} label="Billing" />
                    <NavItem to="/inventory" icon={Package} label="Inventory" />
                    <NavItem to="/lab-reports" icon={Beaker} label="Lab Reports" />
                  </>
                )}

                {/* Doctor Nav */}
                {userRole === 'Doctor' && (
                  <>
                    <NavItem to="/" icon={LayoutDashboard} label="Doctor Dashboard" />
                    <NavItem to="/patients" icon={Users} label="My Patients" />
                    <NavItem to="/appointments" icon={Calendar} label="My Schedule" />
                    <NavItem to="/prescriptions" icon={FileText} label="Prescriptions" />
                    <NavItem to="/lab-reports" icon={Beaker} label="Lab Reports" />
                  </>
                )}

                {/* Patient Nav */}
                {userRole === 'Patient' && (
                  <>
                    <NavItem to="/" icon={LayoutDashboard} label="My Dashboard" />
                    <NavItem to="/appointments" icon={Calendar} label="My Appointments" />
                    <NavItem to="/prescriptions" icon={FileText} label="My Prescriptions" />
                    <NavItem to="/lab-reports" icon={Beaker} label="My Lab Reports" />
                    <NavItem to="/billing" icon={Receipt} label="My Billings" />
                  </>
                )}
              </nav>

              <div style={{ marginTop: 'auto', borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}>
                <button onClick={() => setDarkMode(!darkMode)} className="nav-item" style={{ width: '100%', background: 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left' }}>
                  {darkMode ? <><Sun size={20} /> Light Mode</> : <><Moon size={20} /> Dark Mode</>}
                </button>
                <button onClick={handleLogout} className="nav-item" style={{ width: '100%', background: 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left', color: '#f87171' }}>
                  <LogOut size={20} /> Logout
                </button>
              </div>
            </aside>

            <main className={`main-content ${sidebarOpen ? 'shifted' : ''}`} style={{ flex: 1, height: '100vh', overflowY: 'auto' }}>
              <div className="glass-panel" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 24px', position: 'sticky', top: 0, zIndex: 10, marginBottom: '24px', borderBottom: '1px solid var(--border-color)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <button className="mobile-menu-btn" onClick={() => setSidebarOpen(!sidebarOpen)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-main)' }}>
                    <Menu size={24} />
                  </button>
                  <h2 style={{ fontSize: '1.4rem', fontWeight: '700', color: 'var(--text-main)', margin: 0 }}>
                    {userRole} Portal
                  </h2>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ position: 'relative' }}>
                    <div onClick={() => setShowProfile(!showProfile)} style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
                      <div className="hide-on-mobile" style={{ textAlign: 'right' }}>
                        <div style={{ fontWeight: '600', color: 'var(--text-main)' }}>{userName}</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{userRole}</div>
                      </div>
                      <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--primary-color)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                        {userName.charAt(0).toUpperCase()}
                      </div>
                    </div>

                    {showProfile && (
                      <>
                        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 999 }} onClick={() => setShowProfile(false)} />
                        <div className="glass-panel" style={{ position: 'absolute', top: 'calc(100% + 10px)', right: 0, width: '250px', padding: '20px', zIndex: 1000, background: darkMode ? '#1e293b' : '#fff' }}>
                          <div style={{ textAlign: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '15px', marginBottom: '15px' }}>
                            <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'var(--primary-color)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 'bold', margin: '0 auto 10px' }}>
                              {userName.charAt(0).toUpperCase()}
                            </div>
                            <div style={{ fontWeight: '600' }}>{userName}</div>
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{userRole}</div>
                          </div>
                          <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '15px' }}>
                            <div style={{ wordBreak: 'break-all' }}>Email: {userEmail}</div>
                            <div>Phone: +91 {userPhone}</div>
                          </div>
                          <button onClick={handleLogout} style={{ width: '100%', padding: '10px', background: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' }}>
                            Logout
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="page-content">
                <Routes>
                  {/* Dashboard Route changes based on role */}
                  <Route path="/" element={
                    userRole === 'Admin' || userRole === 'Receptionist' ? <Dashboard /> :
                    userRole === 'Doctor' ? <DoctorDashboard /> :
                    <PatientDashboard />
                  } />
                  
                  <Route path="/patients" element={<Patients />} />
                  <Route path="/appointments" element={<Appointments />} />
                  <Route path="/billing" element={<Billing />} />
                  <Route path="/inventory" element={<Inventory />} />
                  <Route path="/prescriptions" element={<Prescriptions />} />
                  <Route path="/lab-reports" element={<LabReports />} />
                  <Route path="*" element={<Navigate to="/" />} />
                </Routes>
              </div>
            </main>
            <HelpBot />
          </div>
        )}
      </Router>
    </GoogleOAuthProvider>
  );
}

export default App;