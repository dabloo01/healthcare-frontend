import React from 'react';
import { Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, Calendar, Receipt, Package, FileText, LogOut, Stethoscope } from 'lucide-react';

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

function App() {
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('userRole') || 'Receptionist';
  const userName = localStorage.getItem('userName') || 'User';
  const location = useLocation();

  if (!token) {
    return (
      <Routes>
        <Route path="/auth" element={<Auth />} />
        <Route path="*" element={<Navigate to="/auth" />} />
      </Routes>
    );
  }

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
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f8fafc' }}>
      {/* Basic Sidebar */}
      <div style={{ width: '250px', background: 'white', borderRight: '1px solid #e2e8f0', padding: '20px', display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '30px', padding: '0 10px' }}>
          <Stethoscope color="#4f46e5" size={28} />
          <span style={{ fontWeight: '800', fontSize: '1.2rem', color: '#1e293b' }}>MediCarePro</span>
        </div>
        
        <div style={{ flex: 1 }}>
          {filteredNav.map(item => (
            <Link key={item.path} to={item.path} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 15px', textDecoration: 'none', color: location.pathname === item.path ? '#4f46e5' : '#64748b', background: location.pathname === item.path ? '#f1f5f9' : 'transparent', borderRadius: '10px', marginBottom: '5px', fontWeight: '600' }}>
              {item.icon} <span>{item.label}</span>
            </Link>
          ))}
        </div>

        <button onClick={() => { localStorage.clear(); window.location.href='/auth'; }} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 15px', border: 'none', background: 'none', color: '#ef4444', cursor: 'pointer', fontWeight: '700', marginTop: '20px' }}>
          <LogOut size={20} /> Logout
        </button>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, padding: '30px' }}>
        <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '15px', marginBottom: '30px' }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontWeight: '700', color: '#1e293b' }}>{userName}</div>
            <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{userRole} Portal</div>
          </div>
          <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#4f46e5', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>{userName.charAt(0)}</div>
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