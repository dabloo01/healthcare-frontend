import React, { useState, useEffect } from 'react';
import { Calendar, Users, Clock, CheckCircle, Activity, FileText, Send, ChevronRight } from 'lucide-react';

export default function DoctorDashboard() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, pending: 0, completed: 0 });
  const [selectedAppt, setSelectedAppt] = useState(null); // For Checkup Modal
  const [prescriptionForm, setPrescriptionForm] = useState({ medications: '', instructions: '' });

  const doctorEmail = localStorage.getItem('userEmail') || '';
  const doctorName = localStorage.getItem('userName') || 'Doctor';

  useEffect(() => {
    fetchDoctorData();
  }, []);

  const fetchDoctorData = async () => {
    setLoading(true);
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const res = await fetch(`${apiUrl}/api/appointments`);
      const data = await res.json();
      
      // Filter appointments for this doctor
      // In a real system we'd match by doctorId, here we match by doctor name or email if possible
      // Let's assume the seeded data has doctor info
      const docAppts = data.filter(a => a.doctor?.email === doctorEmail || a.doctor?.name?.includes(doctorName));
      
      setAppointments(docAppts);
      setStats({
        total: docAppts.length,
        pending: docAppts.filter(a => a.status === 'Scheduled').length,
        completed: docAppts.filter(a => a.status === 'Completed').length
      });
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const handleStartCheckup = (appt) => {
    setSelectedAppt(appt);
    setPrescriptionForm({ medications: '', instructions: '' });
  };

  const savePrescription = async () => {
    if (!prescriptionForm.medications) return alert("Please write medications first.");
    
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      
      // 1. Save Prescription
      await fetch(`${apiUrl}/api/prescriptions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          appointmentId: selectedAppt.id,
          patientId: selectedAppt.patientId,
          doctorId: selectedAppt.doctorId,
          medications: prescriptionForm.medications,
          instructions: prescriptionForm.instructions
        })
      });

      // 2. Mark Appointment as Completed
      await fetch(`${apiUrl}/api/appointments/${selectedAppt.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'Completed' })
      });

      alert("Checkup Completed & Prescription Saved!");
      setSelectedAppt(null);
      fetchDoctorData();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Loading Doctor Dashboard...</div>;

  return (
    <div className="fade-in">
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: '800', margin: 0 }}>Welcome, Dr. {doctorName}</h1>
        <p style={{ color: 'var(--text-muted)', margin: '4px 0 0 0' }}>Here is your schedule and patient queue for today.</p>
      </div>

      {/* Stats Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '32px' }}>
        <div className="glass-panel" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ padding: '12px', background: '#e0e7ff', color: '#4f46e5', borderRadius: '12px' }}><Users size={24} /></div>
          <div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Total Patients</div>
            <div style={{ fontSize: '1.5rem', fontWeight: '800' }}>{stats.total}</div>
          </div>
        </div>
        <div className="glass-panel" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ padding: '12px', background: '#fef3c7', color: '#d97706', borderRadius: '12px' }}><Clock size={24} /></div>
          <div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Pending</div>
            <div style={{ fontSize: '1.5rem', fontWeight: '800' }}>{stats.pending}</div>
          </div>
        </div>
        <div className="glass-panel" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ padding: '12px', background: '#d1fae5', color: '#059669', borderRadius: '12px' }}><CheckCircle size={24} /></div>
          <div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Completed</div>
            <div style={{ fontSize: '1.5rem', fontWeight: '800' }}>{stats.completed}</div>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
        {/* Patient Queue */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h3 style={{ margin: '0 0 20px 0', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Activity size={20} color="var(--primary-color)" /> Active Patient Queue
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {appointments.length === 0 ? (
              <p style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>No appointments scheduled for you.</p>
            ) : appointments.map(appt => (
              <div key={appt.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', borderRadius: '16px', background: appt.status === 'Completed' ? 'rgba(0,0,0,0.02)' : 'var(--bg-color)', border: '1px solid var(--border-color)' }}>
                <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--primary-color)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700' }}>
                    {appt.patient?.name?.charAt(0) || 'P'}
                  </div>
                  <div>
                    <div style={{ fontWeight: '700' }}>{appt.patient?.name}</div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{appt.appointmentTime} • {appt.reason}</div>
                  </div>
                </div>
                {appt.status === 'Scheduled' ? (
                  <button onClick={() => handleStartCheckup(appt)} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', borderRadius: '12px' }}>
                    Start Checkup <ChevronRight size={16} />
                  </button>
                ) : (
                  <span style={{ color: '#059669', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <CheckCircle size={16} /> Checked
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Small Schedule Sidebar */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h3 style={{ margin: '0 0 20px 0' }}>Quick Calendar</h3>
          <div style={{ background: 'var(--bg-color)', borderRadius: '12px', padding: '16px', textAlign: 'center' }}>
            <Calendar size={40} color="var(--primary-color)" style={{ marginBottom: '10px' }} />
            <div style={{ fontWeight: '700', fontSize: '1.1rem' }}>{new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })}</div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '8px' }}>Your availability is set to Auto-Accept today.</p>
          </div>
        </div>
      </div>

      {/* Checkup Modal (Prescription Writing Pad) */}
      {selectedAppt && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
          <div className="glass-panel" style={{ width: '100%', maxWidth: '600px', padding: '32px', background: 'white' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px', borderBottom: '1px solid #eee', paddingBottom: '16px' }}>
              <div>
                <h2 style={{ margin: 0, color: 'var(--primary-color)' }}>Medical Checkup</h2>
                <p style={{ margin: 0, color: '#666' }}>Patient: <b>{selectedAppt.patient?.name}</b></p>
              </div>
              <button onClick={() => setSelectedAppt(null)} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer' }}>&times;</button>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontWeight: '700', marginBottom: '8px' }}>Medications (Rx)</label>
              <textarea 
                rows="4" 
                placeholder="Ex: Paracetamol 500mg (1-0-1), Azithromycin..."
                style={{ width: '100%', padding: '16px', borderRadius: '12px', border: '1px solid #ddd', outline: 'none', fontFamily: 'inherit' }}
                value={prescriptionForm.medications}
                onChange={e => setPrescriptionForm({...prescriptionForm, medications: e.target.value})}
              ></textarea>
            </div>

            <div style={{ marginBottom: '32px' }}>
              <label style={{ display: 'block', fontWeight: '700', marginBottom: '8px' }}>Instructions</label>
              <textarea 
                rows="2" 
                placeholder="Ex: Take after meals for 3 days."
                style={{ width: '100%', padding: '16px', borderRadius: '12px', border: '1px solid #ddd', outline: 'none', fontFamily: 'inherit' }}
                value={prescriptionForm.instructions}
                onChange={e => setPrescriptionForm({...prescriptionForm, instructions: e.target.value})}
              ></textarea>
            </div>

            <div style={{ display: 'flex', gap: '16px' }}>
              <button onClick={savePrescription} className="btn-primary" style={{ flex: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', padding: '14px' }}>
                <Send size={18} /> Finish & Save Prescription
              </button>
              <button onClick={() => setSelectedAppt(null)} style={{ flex: 1, padding: '14px', borderRadius: '12px', border: '1px solid #ddd', cursor: 'pointer' }}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
