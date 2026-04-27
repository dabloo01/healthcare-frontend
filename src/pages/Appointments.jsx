import React, { useState, useEffect } from 'react';
import { Calendar as CalIcon, UserCheck, Stethoscope, Banknote, ShieldCheck, Plus, X, CheckCircle2, Loader2, CreditCard } from 'lucide-react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const timeSlots = [
  "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM", 
  "11:00 AM", "11:30 AM", "12:00 PM", "12:30 PM",
  "02:00 PM", "02:30 PM", "03:00 PM", "03:30 PM"
];

export default function AppointmentsAndDoctors() {
  const [activeTab, setActiveTab] = useState('appointments');
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showApptForm, setShowApptForm] = useState(false);
  const [apptForm, setApptForm] = useState({ 
    patientId: '', patientName: '', phone: '', email: '', age: '', gender: '', doctorId: '', 
    appointmentDate: new Date(), 
    appointmentTime: '', reason: '' 
  });

  const userRole = localStorage.getItem('userRole') || 'Patient';
  const userEmail = localStorage.getItem('userEmail') || '';
  const userName = localStorage.getItem('userName') || '';

  const [paymentState, setPaymentState] = useState({ state: 'none', fee: 0, doctorName: '' });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const [apptcRes, patRes, docRes] = await Promise.all([
        fetch(`${apiUrl}/api/appointments`),
        fetch(`${apiUrl}/api/patients`),
        fetch(`${apiUrl}/api/doctors`)
      ]);
      const apptData = await apptcRes.json();
      const patData = await patRes.json();
      const docData = await docRes.json();

      if (userRole === 'Patient') {
        setAppointments(Array.isArray(apptData) ? apptData.filter(a => a.patient?.email === userEmail) : []);
      } else if (userRole === 'Doctor' || userRole === 'Head Doctor') {
        setAppointments(Array.isArray(apptData) ? apptData.filter(a => {
          const docEmailMatch = a.doctor?.email && a.doctor.email.toLowerCase() === userEmail.toLowerCase();
          const docNameMatch = a.doctor?.name && a.doctor.name.toLowerCase().includes(userName.toLowerCase().replace('dr.', '').trim());
          return docEmailMatch || docNameMatch;
        }) : []);
      } else {
        setAppointments(Array.isArray(apptData) ? apptData : []);
      }
      setPatients(Array.isArray(patData) ? patData : []);
      setDoctors(Array.isArray(docData) ? docData : []);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const handleBookApptClick = (e) => {
    e.preventDefault();
    if (!apptForm.doctorId || !apptForm.patientName || !apptForm.appointmentTime) return alert("Please fill all fields.");
    const doc = doctors.find(d => d.id === parseInt(apptForm.doctorId));
    setPaymentState({ state: 'paying', fee: doc ? doc.consultationFee : 500, doctorName: doc ? doc.name : 'Specialist' });
  };

  const finalizeAppointment = async () => {
    setPaymentState(prev => ({ ...prev, state: 'validating' }));
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      
      // 1. Find or Create Patient
      let finalPatientId = apptForm.patientId;
      if (!finalPatientId) {
        const pRes = await fetch(`${apiUrl}/api/patients`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            name: apptForm.patientName, 
            phone: apptForm.phone || 'N/A', 
            email: apptForm.email || `${apptForm.patientName.toLowerCase().replace(/ /g,'')}@example.com`, 
            age: parseInt(apptForm.age) || 25, 
            gender: apptForm.gender || 'Other' 
          })
        });
        const newPat = await pRes.json();
        finalPatientId = newPat.id;
      }

      // 2. Create Appointment
      const payload = { 
        patientId: parseInt(finalPatientId), 
        doctorId: parseInt(apptForm.doctorId),
        appointmentDate: apptForm.appointmentDate,
        appointmentTime: apptForm.appointmentTime,
        reason: apptForm.reason || 'General Checkup',
        status: 'Scheduled'
      };

      await fetch(`${apiUrl}/api/appointments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      // 3. Generate Bill
      await fetch(`${apiUrl}/api/bills`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          patientId: parseInt(finalPatientId), 
          amount: parseFloat(paymentState.fee), 
          description: `Consultation Fee - Dr. ${paymentState.doctorName}`, 
          status: 'Paid' 
        })
      });

      setPaymentState(prev => ({ ...prev, state: 'success' }));
      setTimeout(() => {
        setPaymentState({ state: 'none', fee: 0, doctorName: '' });
        setShowApptForm(false);
        fetchData();
        setApptForm({ patientId: '', patientName: '', phone: '', email: '', age: '', gender: '', doctorId: '', appointmentDate: new Date(), appointmentTime: '', reason: '' });
      }, 2000);
    } catch (err) {
      console.error(err);
      alert("Failed to book appointment. Please try again.");
      setPaymentState({ state: 'none', fee: 0, doctorName: '' });
    }
  };

  return (
    <div className="fade-in">
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: '800', margin: 0 }}>Appointments & Roster</h1>
          <p style={{ color: 'var(--text-muted)', margin: '4px 0 0 0' }}>{userRole === 'Doctor' ? 'Your personal schedule.' : 'Manage hospital bookings.'}</p>
        </div>
        {(userRole === 'Receptionist' || userRole === 'Patient') && (
          <button onClick={() => setShowApptForm(true)} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Plus size={20} /> Book New Appointment
          </button>
        )}
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', borderBottom: '2px solid var(--border-color)', paddingBottom: '16px' }}>
        <button onClick={() => setActiveTab('appointments')} style={activeTab === 'appointments' ? activeTabStyle : inactiveTabStyle}>
          <CalIcon size={18} /> {userRole === 'Doctor' ? 'My Schedule' : 'All Appointments'}
        </button>
        <button onClick={() => setActiveTab('doctors')} style={activeTab === 'doctors' ? activeTabStyle : inactiveTabStyle}>
          <Stethoscope size={18} /> Doctor Directory
        </button>
      </div>

      {/* Table Section */}
      <div className="glass-panel" style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: 'var(--sidebar-bg)', borderBottom: '1px solid var(--border-color)' }}>
              <th style={thStyle}>Date & Time</th>
              <th style={thStyle}>Patient</th>
              <th style={thStyle}>Doctor</th>
              <th style={thStyle}>Reason</th>
              <th style={thStyle}>Status</th>
            </tr>
          </thead>
          <tbody>
            {loading ? <tr><td colSpan="5" style={tdStyle}>Loading...</td></tr> : appointments.length === 0 ? <tr><td colSpan="5" style={tdStyle}>No records found.</td></tr> : appointments.map(a => (
              <tr key={a.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={tdStyle}>{new Date(a.appointmentDate).toLocaleDateString()}<br/><span style={{fontSize:'0.8rem', color:'var(--text-muted)'}}>{a.appointmentTime}</span></td>
                <td style={tdStyle}>{a.patient?.name}</td>
                <td style={tdStyle}>Dr. {a.doctor?.name}</td>
                <td style={tdStyle}>{a.reason}</td>
                <td style={tdStyle}>
                  <span style={{ padding: '4px 12px', borderRadius: '20px', fontSize: '0.8rem', background: a.status === 'Completed' ? '#d1fae5' : '#fef3c7', color: a.status === 'Completed' ? '#065f46' : '#d97706' }}>
                    {a.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Booking Form Modal */}
      {showApptForm && (
        <div style={overlayStyle}>
          <div className="glass-panel" style={{ width: '100%', maxWidth: '500px', padding: '32px', background: 'white' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
              <h2 style={{ margin: 0 }}>Book Appointment</h2>
              <button onClick={() => setShowApptForm(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={24} /></button>
            </div>
            <form onSubmit={handleBookApptClick} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <input required placeholder="Patient Full Name" value={apptForm.patientName} onChange={e => setApptForm({...apptForm, patientName: e.target.value})} style={inputStyle} />
              <select required value={apptForm.doctorId} onChange={e => setApptForm({...apptForm, doctorId: e.target.value})} style={inputStyle}>
                <option value="">-- Select Doctor --</option>
                {doctors.map(d => <option key={d.id} value={d.id}>Dr. {d.name} ({d.specialty})</option>)}
              </select>
              <div style={{ display: 'flex', gap: '10px' }}>
                <DatePicker selected={apptForm.appointmentDate} onChange={date => setApptForm({...apptForm, appointmentDate: date})} className="form-input" style={{ width: '100%' }} placeholderText="Select Date" />
                <select required value={apptForm.appointmentTime} onChange={e => setApptForm({...apptForm, appointmentTime: e.target.value})} style={inputStyle}>
                  <option value="">-- Time --</option>
                  {timeSlots.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <input placeholder="Reason for Visit" value={apptForm.reason} onChange={e => setApptForm({...apptForm, reason: e.target.value})} style={inputStyle} />
              <button type="submit" className="btn-primary" style={{ padding: '14px' }}>Proceed to Payment (₹{doctors.find(d => d.id === parseInt(apptForm.doctorId))?.consultationFee || 500})</button>
            </form>
          </div>
        </div>
      )}

      {/* Simplified Payment Modal */}
      {paymentState.state !== 'none' && (
        <div style={overlayStyle}>
          <div className="glass-panel" style={{ width: '100%', maxWidth: '400px', padding: '32px', background: 'white', textAlign: 'center' }}>
            {paymentState.state === 'paying' ? (
              <>
                <CreditCard size={48} color="var(--primary-color)" style={{ marginBottom: '16px' }} />
                <h3>Secure Payment</h3>
                <p>Consultation Fee: <b>₹{paymentState.fee}</b></p>
                <button onClick={finalizeAppointment} className="btn-primary" style={{ width: '100%', marginTop: '20px' }}>Pay & Confirm</button>
              </>
            ) : paymentState.state === 'validating' ? (
              <>
                <Loader2 size={48} className="spin" color="var(--primary-color)" style={{ marginBottom: '16px' }} />
                <h3>Processing Payment...</h3>
              </>
            ) : (
              <>
                <CheckCircle2 size={48} color="#10b981" style={{ marginBottom: '16px' }} />
                <h3 style={{ color: '#10b981' }}>Success!</h3>
                <p>Appointment Booked Successfully.</p>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

const activeTabStyle = { display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px', background: 'var(--primary-color)', color: 'white', border: 'none', borderRadius: '14px', cursor: 'pointer', fontWeight: '700' };
const inactiveTabStyle = { display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px', background: 'none', color: 'var(--text-muted)', border: 'none', cursor: 'pointer', fontWeight: '600' };
const inputStyle = { padding: '12px 16px', borderRadius: '12px', border: '1px solid var(--border-color)', background: 'var(--input-bg)', color: 'var(--text-main)', outline: 'none' };
const overlayStyle = { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' };
const thStyle = { padding: '16px', color: 'var(--text-muted)', fontSize: '0.85rem' };
const tdStyle = { padding: '16px', color: 'var(--text-main)' };
