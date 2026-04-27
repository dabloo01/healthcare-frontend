import React, { useState, useEffect } from 'react';
import { Calendar, Clipboard, Clock, CheckCircle, User } from 'lucide-react';

export default function DoctorDashboard() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const userName = localStorage.getItem('userName') || 'Doctor';

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch((import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/api/appointments');
      const data = await res.json();
      // In a real app, we'd filter by doctor ID. For now, showing all for the demo.
      setAppointments(data.filter(a => a.status === 'Scheduled'));
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  return (
    <div className="fade-in">
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--text-main)', margin: 0 }}>Welcome, {userName}</h1>
        <p style={{ color: 'var(--text-muted)', margin: '8px 0 0 0' }}>You have {appointments.length} appointments scheduled for today.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
        <div className="glass-panel" style={{ padding: '24px', gridColumn: '1 / -1' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Clock size={20} color="var(--primary-color)" /> Upcoming Appointments
            </h3>
            <button onClick={fetchData} style={{ background: 'none', border: 'none', color: 'var(--primary-color)', cursor: 'pointer', fontWeight: '600' }}>Refresh</button>
          </div>

          <div style={{ display: 'grid', gap: '16px' }}>
            {loading ? (
              <p>Loading schedule...</p>
            ) : appointments.length === 0 ? (
              <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '20px' }}>No appointments for today.</p>
            ) : appointments.map(appt => (
              <div key={appt.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', borderRadius: '16px', background: 'var(--bg-color)', border: '1px solid var(--border-color)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'var(--gradient-bg-1)', color: 'var(--primary-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                    {appt.patient?.name.charAt(0)}
                  </div>
                  <div>
                    <div style={{ fontWeight: '700', fontSize: '1.05rem' }}>{appt.patient?.name}</div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Reason: {appt.reason || 'General Checkup'}</div>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: '700', color: 'var(--primary-color)' }}>{new Date(appt.appointmentDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Room 102</div>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button className="btn-primary" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>Start Checkup</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '24px' }}>
          <h3 style={{ margin: '0 0 16px 0' }}>Quick Actions</h3>
          <div style={{ display: 'grid', gap: '12px' }}>
            <button className="nav-item" style={{ width: '100%', justifyContent: 'flex-start', background: 'var(--bg-color)' }}>
              <Clipboard size={18} /> View Medical Records
            </button>
            <button className="nav-item" style={{ width: '100%', justifyContent: 'flex-start', background: 'var(--bg-color)' }}>
              <Calendar size={18} /> Manage Availability
            </button>
            <button className="nav-item" style={{ width: '100%', justifyContent: 'flex-start', background: 'var(--bg-color)' }}>
              <User size={18} /> My Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
