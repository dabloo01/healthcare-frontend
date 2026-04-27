import React from 'react';
import { Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  Receipt, 
  Package, 
  FileText, 
  LogOut, 
  Moon, 
  Sun,
  Stethoscope,
  ChevronLeft,
  ChevronRight,
  UserCircle
} from 'lucide-react';
import Dashboard from './pages/Dashboard';
import Patients from './pages/Patients';
import Appointments from './pages/Appointments';
import Billing from './pages/Billing';
import Inventory from './pages/Inventory';
import LabReports from './pages/LabReports';
import Auth from './pages/Auth';
import DoctorDashboard from './pages/DoctorDashboard';
import PatientDashboard from './pages/PatientDashboard';
import Prescriptions from './pages/Prescriptions';

function Sidebar({ userRole }) {
  const location = useLocation();
  const [collapsed, setCollapsed] = React.useState(false);

  const navItems = [
    { path: '/', label: 'Dashboard', icon: <LayoutDashboard size={20} />, roles: ['Admin', 'Receptionist', 'Doctor', 'Patient'] },
    { path: '/patients', label: 'Patients', icon: <Users size={20} />, roles: ['Admin', 'Receptionist', 'Doctor'] },
    { path: '/appointments', label: 'Appointments', icon: <Calendar size={20} />, roles: ['Admin', 'Receptionist', 'Doctor', 'Patient'] },
    { path: '/billing', label: 'Billing', icon: <Receipt size={20} />, roles: ['Admin', 'Receptionist', 'Patient'] },
    { path: '/inventory', label: 'Inventory', icon: <Package size={20} />, roles: ['Admin', 'Receptionist'] },
    { path: '/lab-reports', label: 'Lab Reports', icon: <FileText size={20} />, roles: ['Admin', 'Doctor', 'Patient'] },
    { path: '/prescriptions', label: 'Prescriptions', icon: <Stethoscope size={20} />, roles: ['Doctor', 'Patient'] },
  ];

  const filteredNav = navItems.filter(item => item.roles.includes(userRole));

  return (
    <div style={{ width: collapsed ? '80px' : '260px', background: 'var(--sidebar-bg)', height: '100vh', borderRight: '1px solid var(--border-color)', position: 'sticky', top: 0, transition: '0.3s' }}>
      <div style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{ background: 'var(--primary-color)', padding: '8px', borderRadius: '12px' }}><Stethoscope color="white" size={24} /></div>
        {!collapsed && <span style={{ fontWeight: '800', fontSize: '1.2rem' }}>MediCarePro</span>}
      </div>
      <div style={{ flex: 1, padding: '12px' }}>
        {filteredNav.map(item => (
          <Link key={item.path} to={item.path} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', textDecoration: 'none', color: location.pathname === item.path ? 'var(--primary-color)' : 'var(--text-muted)', background: location.pathname === item.path ? 'rgba(79, 70, 229, 0.08)' : 'transparent', borderRadius: '12px', marginBottom: '4px', fontWeight: location.pathname === item.path ? '700' : '500' }}>
            {item.icon} {!collapsed && <span>{item.label}</span>}
          </Link>
        ))}
      </div>
      <div style={{ padding: '20px', borderTop: '1px solid var(--border-color)' }}>
        <button onClick={() => { localStorage.clear(); window.location.href='/auth'; }} style={{ display: 'flex', alignItems: 'center', gap: '12px', width: '100%', background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontWeight: '600' }}>
          <LogOut size={20} /> {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </div>
  );
}

function App() {
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('userRole') || 'Admin';
  const userName = localStorage.getItem('userName') || 'User';

  if (!token) {
    return (
      <Routes>
        <Route path="/auth" element={<Auth />} />
        <Route path="*" element={<Navigate to="/auth" />} />
      </Routes>
    );
  }

  return (
    <div style={{ display: 'flex', background: 'var(--bg-color)', minHeight: '100vh' }}>
      <Sidebar userRole={userRole} />
      <div style={{ flex: 1, padding: '32px' }}>
        {/* Simple Top Bar */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '32px', alignItems: 'center', gap: '16px' }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontWeight: '700' }}>{userName}</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{userRole}</div>
          </div>
          <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'var(--gradient-bg-1)', color: 'var(--primary-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800' }}>{userName.charAt(0)}</div>
        </div>

        <Routes>
          <Route path="/" element={
            userRole === 'Doctor' ? <DoctorDashboard /> : 
            userRole === 'Patient' ? <PatientDashboard /> : <Dashboard />
          } />
          <Route path="/patients" element={<Patients />} />
          <Route path="/appointments" element={<Appointments />} />
          <Route path="/billing" element={<Billing />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/lab-reports" element={<LabReports />} />
          <Route path="/prescriptions" element={<Prescriptions />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;