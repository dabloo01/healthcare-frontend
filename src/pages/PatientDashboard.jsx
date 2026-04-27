import React, { useState, useEffect } from 'react';
import { Calendar, Receipt, FileText, Beaker, Clock, User, Plus, Search, ChevronRight } from 'lucide-react';

export default function PatientDashboard() {
  const [appointments, setAppointments] = useState([]);
  const [bills, setBills] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showBooking, setShowBooking] = useState(false);
  
  const userName = localStorage.getItem('userName') || 'Patient';
  const userEmail = localStorage.getItem('userEmail') || '';

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const [apptRes, billRes, presRes] = await Promise.all([
        fetch(`${apiUrl}/api/appointments`),
        fetch(`${apiUrl}/api/bills`),
        fetch(`${apiUrl}/api/prescriptions`)
      ]);
      
      const apptData = await apptRes.json();
      const billData = await billRes.json();
      const presData = await presRes.json();

      setAppointments(Array.isArray(apptData) ? apptData.filter(a => a.patient?.email === userEmail) : []);
      setBills(Array.isArray(billData) ? billData.filter(b => b.patient?.email === userEmail) : []);
      setPrescriptions(Array.isArray(presData) ? presData.filter(p => p.patient?.email === userEmail) : []);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const handleQuickBook = () => {
    // Navigate to appointments page or open a modal
    // For now, let's just alert or redirect
    window.location.href = '/appointments';
  };

  return (
    <div className="fade-in">
      {/* Header Section */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '2.2rem', fontWeight: '800', color: 'var(--text-main)', margin: 0 }}>Namaste, {userName}</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', marginTop: '8px' }}>Your healthcare journey at a glance.</p>
        </div>
        <button onClick={handleQuickBook} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '14px 24px', borderRadius: '16px' }}>
          <Plus size={20} /> Book New Appointment
        </button>
      </div>

      {/* Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px', marginBottom: '40px' }}>
        <div className="glass-panel" style={{ padding: '24px', borderLeft: '6px solid var(--primary-color)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
            <Calendar size={28} color="var(--primary-color)" />
            <span style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-muted)' }}>VISITS</span>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: '800' }}>{appointments.length}</div>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '4px' }}>Total Appointments</div>
        </div>

        <div className="glass-panel" style={{ padding: '24px', borderLeft: '6px solid #10b981' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
            <Receipt size={28} color="#10b981" />
            <span style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-muted)' }}>PAYMENTS</span>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: '800' }}>{bills.filter(b => b.status === 'Paid').length}</div>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '4px' }}>Paid Invoices</div>
        </div>

        <div className="glass-panel" style={{ padding: '24px', borderLeft: '6px solid #f59e0b' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
            <FileText size={28} color="#f59e0b" />
            <span style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-muted)' }}>CLINICAL</span>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: '800' }}>{prescriptions.length}</div>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '4px' }}>Active Prescriptions</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '32px' }}>
        {/* Recent Activity */}
        <div className="glass-panel" style={{ padding: '28px' }}>
          <h3 style={{ margin: '0 0 24px 0', fontSize: '1.3rem' }}>Recent Medical Activity</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {loading ? (
              <p>Fetching your records...</p>
            ) : appointments.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px', background: 'var(--bg-color)', borderRadius: '20px' }}>
                <Clock size={40} style={{ opacity: 0.2, marginBottom: '12px' }} />
                <p>You haven't booked any appointments yet.</p>
              </div>
            ) : appointments.slice(0, 5).map(appt => (
              <div key={appt.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px', borderRadius: '18px', background: 'var(--bg-color)', border: '1px solid var(--border-color)' }}>
                <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                  <div style={{ width: '50px', height: '50px', borderRadius: '14px', background: 'var(--gradient-bg-1)', color: 'var(--primary-color)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <User size={24} />
                  </div>
                  <div>
                    <div style={{ fontWeight: '700', fontSize: '1.05rem' }}>Dr. {appt.doctor?.name}</div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{appt.doctor?.specialty} • {appt.reason}</div>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: '700' }}>{new Date(appt.appointmentDate).toLocaleDateString('en-GB')}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{appt.appointmentTime}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Links / Health Tips */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div className="glass-panel" style={{ padding: '24px', background: 'linear-gradient(135deg, var(--primary-color), var(--primary-light))', color: 'white' }}>
            <h3 style={{ margin: '0 0 12px 0' }}>Need Help?</h3>
            <p style={{ fontSize: '0.9rem', opacity: 0.9, lineHeight: '1.5' }}>Our support team is available 24/7 for medical emergencies or booking assistance.</p>
            <button style={{ marginTop: '20px', width: '100%', padding: '12px', borderRadius: '12px', border: 'none', background: 'white', color: 'var(--primary-color)', fontWeight: '700', cursor: 'pointer' }}>Call Support</button>
          </div>
          
          <div className="glass-panel" style={{ padding: '24px' }}>
            <h3 style={{ margin: '0 0 16px 0' }}>Health Documents</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', borderRadius: '10px', background: 'var(--bg-color)', cursor: 'pointer' }}>
                <FileText size={18} color="#ef4444" />
                <span style={{ fontSize: '0.9rem', fontWeight: '600' }}>Latest Prescription.pdf</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', borderRadius: '10px', background: 'var(--bg-color)', cursor: 'pointer' }}>
                <Beaker size={18} color="#8b5cf6" />
                <span style={{ fontSize: '0.9rem', fontWeight: '600' }}>Blood Test Report.pdf</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
