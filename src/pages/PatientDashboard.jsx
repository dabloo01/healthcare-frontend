import React, { useState, useEffect } from 'react';
import { Calendar, Receipt, FileText, Beaker, Clock, User } from 'lucide-react';

export default function PatientDashboard() {
  const [appointments, setAppointments] = useState([]);
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const userName = localStorage.getItem('userName') || 'Patient';
  const userEmail = localStorage.getItem('userEmail') || '';

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [apptRes, billRes] = await Promise.all([
        fetch((import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/api/appointments'),
        fetch((import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/api/bills')
      ]);
      const apptData = await apptRes.json();
      const billData = await billRes.json();

      setAppointments(apptData.filter(a => a.patient?.email === userEmail));
      setBills(billData.filter(b => b.patient?.email === userEmail));
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  return (
    <div className="fade-in">
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--text-main)', margin: 0 }}>Hello, {userName}</h1>
        <p style={{ color: 'var(--text-muted)', margin: '8px 0 0 0' }}>Your health summary and upcoming visits.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
        {/* Stats */}
        <div className="glass-panel" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{ background: 'var(--gradient-bg-1)', padding: '12px', borderRadius: '16px', color: 'var(--primary-color)' }}>
            <Calendar size={32} />
          </div>
          <div>
            <div style={{ fontSize: '1.8rem', fontWeight: '800' }}>{appointments.length}</div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Total Visits</div>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{ background: '#d1fae5', padding: '12px', borderRadius: '16px', color: '#10b981' }}>
            <Receipt size={32} />
          </div>
          <div>
            <div style={{ fontSize: '1.8rem', fontWeight: '800' }}>{bills.filter(b => b.status === 'Unpaid').length}</div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Pending Bills</div>
          </div>
        </div>

        {/* Recent Appointments */}
        <div className="glass-panel" style={{ padding: '24px', gridColumn: '1 / -1' }}>
          <h3 style={{ margin: '0 0 20px 0', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Clock size={20} color="var(--primary-color)" /> My Recent Appointments
          </h3>
          <div style={{ display: 'grid', gap: '16px' }}>
            {loading ? (
              <p>Loading records...</p>
            ) : appointments.length === 0 ? (
              <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '20px' }}>No appointments found.</p>
            ) : appointments.map(appt => (
              <div key={appt.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', borderRadius: '16px', background: 'var(--bg-color)', border: '1px solid var(--border-color)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ background: 'var(--gradient-bg-1)', padding: '10px', borderRadius: '12px', color: 'var(--primary-color)' }}>
                    <Calendar size={20} />
                  </div>
                  <div>
                    <div style={{ fontWeight: '700' }}>{appt.doctor?.name}</div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{appt.doctor?.specialty}</div>
                  </div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontWeight: '600' }}>{new Date(appt.appointmentDate).toLocaleDateString('en-GB')}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{appt.appointmentTime}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: '700', padding: '4px 10px', borderRadius: '20px', background: '#d1fae5', color: '#10b981' }}>
                    {appt.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
