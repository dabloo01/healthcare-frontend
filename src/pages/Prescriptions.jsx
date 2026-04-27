import React, { useState, useEffect } from 'react';
import { FileText, Plus, Download, Search, User, Clipboard } from 'lucide-react';

export default function Prescriptions() {
  const [prescriptions, setPrescriptions] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [userRole, setUserRole] = useState(localStorage.getItem('userRole') || 'Patient');
  const [userEmail, setUserEmail] = useState(localStorage.getItem('userEmail') || '');

  const [form, setForm] = useState({
    appointmentId: '',
    medications: '',
    instructions: '',
    patientId: '',
    doctorId: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [presRes, apptRes] = await Promise.all([
        fetch((import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/api/prescriptions'),
        fetch((import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/api/appointments')
      ]);
      const presData = await presRes.json();
      const apptData = await apptRes.json();

      // Filter based on role if needed
      if (userRole === 'Patient') {
        setPrescriptions(presData.filter(p => p.patient?.email === userEmail));
      } else {
        setPrescriptions(presData);
      }
      setAppointments(apptData.filter(a => a.status === 'Scheduled'));
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const handleApptSelect = (apptId) => {
    const appt = appointments.find(a => a.id == apptId);
    if (appt) {
      setForm({
        ...form,
        appointmentId: apptId,
        patientId: appt.patientId,
        doctorId: appt.doctorId
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch((import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/api/prescriptions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      if (res.ok) {
        setShowForm(false);
        fetchData();
        setForm({ appointmentId: '', medications: '', instructions: '', patientId: '', doctorId: '' });
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--text-main)', margin: 0 }}>Digital Prescriptions</h1>
          <p style={{ color: 'var(--text-muted)', margin: '4px 0 0 0' }}>
            {userRole === 'Patient' ? 'View your prescribed medications and instructions.' : 'Issue and manage digital prescriptions for patients.'}
          </p>
        </div>
        {(userRole === 'Admin' || userRole === 'Doctor') && (
          <button 
            onClick={() => setShowForm(!showForm)} 
            className="btn-primary" 
            style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <Plus size={20} /> New Prescription
          </button>
        )}
      </div>

      {showForm && (
        <div className="glass-panel" style={{ padding: '24px', marginBottom: '24px', border: '1px solid var(--primary-color)' }}>
          <h3 style={{ margin: '0 0 20px 0' }}>Write New Prescription</h3>
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', marginBottom: '20px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: '600' }}>Select Appointment</label>
                <select 
                  required 
                  className="form-input" 
                  value={form.appointmentId} 
                  onChange={e => handleApptSelect(e.target.value)}
                >
                  <option value="">-- Choose active appointment --</option>
                  {appointments.map(a => (
                    <option key={a.id} value={a.id}>
                      {a.patient?.name} - {new Date(a.appointmentDate).toLocaleDateString()} ({a.doctor?.name})
                    </option>
                  ))}
                </select>
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: '600' }}>Medications (Name & Dosage)</label>
                <textarea 
                  required 
                  placeholder="e.g. Paracetamol 500mg (1-0-1), Cetirizine 10mg (0-0-1)" 
                  style={{ width: '100%', height: '100px', padding: '12px', borderRadius: '12px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-main)', fontFamily: 'inherit' }}
                  value={form.medications} 
                  onChange={e => setForm({...form, medications: e.target.value})}
                />
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: '600' }}>Additional Instructions</label>
                <textarea 
                  placeholder="e.g. Take after meals, avoid cold water for 3 days." 
                  style={{ width: '100%', height: '80px', padding: '12px', borderRadius: '12px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-main)', fontFamily: 'inherit' }}
                  value={form.instructions} 
                  onChange={e => setForm({...form, instructions: e.target.value})}
                />
              </div>
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button type="submit" className="btn-primary" style={{ flex: 1 }}>Submit Prescription</button>
              <button type="button" onClick={() => setShowForm(false)} style={{ flex: 1, background: 'var(--bg-color)', border: '1px solid var(--border-color)', borderRadius: '12px', cursor: 'pointer' }}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '20px' }}>
        {loading ? (
          <p>Loading prescriptions...</p>
        ) : prescriptions.length === 0 ? (
          <div className="glass-panel" style={{ padding: '40px', textAlign: 'center', gridColumn: '1 / -1' }}>
            <Clipboard size={48} color="var(--text-muted)" style={{ marginBottom: '16px' }} />
            <p style={{ color: 'var(--text-muted)' }}>No digital prescriptions found.</p>
          </div>
        ) : prescriptions.map(pres => (
          <div key={pres.id} className="glass-panel" style={{ padding: '24px', position: 'relative' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div>
                <span style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--primary-color)', textTransform: 'uppercase' }}>
                  {new Date(pres.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                </span>
                <h3 style={{ margin: '4px 0 0 0', fontSize: '1.2rem' }}>{pres.patient?.name}</h3>
              </div>
              <button title="Download PDF" style={{ background: 'var(--gradient-bg-1)', color: 'var(--primary-color)', border: 'none', padding: '8px', borderRadius: '8px', cursor: 'pointer' }}>
                <Download size={20} />
              </button>
            </div>

            <div style={{ background: 'var(--bg-color)', padding: '16px', borderRadius: '12px', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: '600' }}>
                <FileText size={16} /> MEDICATIONS
              </div>
              <div style={{ whiteSpace: 'pre-wrap', color: 'var(--text-main)', fontSize: '0.95rem', fontWeight: '500' }}>
                {pres.medications}
              </div>
            </div>

            {pres.instructions && (
              <div style={{ marginBottom: '16px' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-muted)', marginBottom: '4px' }}>INSTRUCTIONS:</div>
                <div style={{ fontSize: '0.9rem', color: 'var(--text-main)' }}>{pres.instructions}</div>
              </div>
            )}

            <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--primary-light)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '0.8rem' }}>
                {pres.doctor?.name.charAt(0)}
              </div>
              <div>
                <div style={{ fontSize: '0.85rem', fontWeight: '700' }}>{pres.doctor?.name}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{pres.doctor?.specialty}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
