import React, { useState, useEffect } from 'react';
import { Calendar as CalIcon, Stethoscope, Smartphone, CreditCard, Building2, X, CheckCircle2, Loader2, ShieldCheck, HelpCircle, User, Phone, Mail, Hash, UserCircle } from 'lucide-react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const timeSlots = [
  "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM", 
  "11:00 AM", "11:30 AM", "12:00 PM", "12:30 PM",
  "02:00 PM", "02:30 PM", "03:00 PM", "03:30 PM"
];

export default function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [apptForm, setApptForm] = useState({ 
    patientId: '', patientName: '', phone: '', email: '', age: '', gender: '', doctorId: '', 
    appointmentDate: new Date(), appointmentTime: '', reason: '' 
  });

  const [paymentState, setPaymentState] = useState({ state: 'none', method: 'upi', fee: 0, doctorName: '' });

  const userRole = localStorage.getItem('userRole') || 'Patient';
  const userEmail = localStorage.getItem('userEmail') || '';
  const userName = localStorage.getItem('userName') || '';

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

  const handleBookClick = (e) => {
    e.preventDefault();
    if (!apptForm.doctorId || !apptForm.patientName || !apptForm.appointmentTime) return alert("Please fill all fields.");
    const doc = doctors.find(d => d.id === parseInt(apptForm.doctorId));
    setPaymentState({ ...paymentState, state: 'paying', fee: doc ? doc.consultationFee : 1500, doctorName: doc ? doc.name : 'Specialist' });
  };

  const finalizePayment = async () => {
    setPaymentState(prev => ({ ...prev, state: 'validating' }));
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      let finalPatientId = apptForm.patientId;
      if (!finalPatientId) {
        const pRes = await fetch(`${apiUrl}/api/patients`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: apptForm.patientName, phone: apptForm.phone, email: apptForm.email, age: parseInt(apptForm.age) || 25, gender: apptForm.gender || 'Other' })
        });
        const newPat = await pRes.json();
        finalPatientId = newPat.id;
      }

      await fetch(`${apiUrl}/api/appointments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...apptForm, patientId: parseInt(finalPatientId), doctorId: parseInt(apptForm.doctorId), status: 'Scheduled' })
      });
      
      await fetch(`${apiUrl}/api/bills`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ patientId: parseInt(finalPatientId), amount: parseFloat(paymentState.fee), description: `Consultation Fee - Dr. ${paymentState.doctorName}`, status: 'Paid' })
      });

      setPaymentState(prev => ({ ...prev, state: 'success' }));
      setTimeout(() => {
        setPaymentState({ state: 'none', method: 'upi', fee: 0, doctorName: '' });
        fetchData();
        setApptForm({ patientId: '', patientName: '', phone: '', email: '', age: '', gender: '', doctorId: '', appointmentDate: new Date(), appointmentTime: '', reason: '' });
      }, 2500);
    } catch (err) {
      console.error(err);
      setPaymentState({ state: 'none', method: 'upi', fee: 0, doctorName: '' });
    }
  };

  return (
    <div className="fade-in">
      {/* Top Header Section as seen in photo 2 */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: '800', margin: 0 }}>Appointments</h1>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', borderRadius: '25px', background: '#e0e7ff', color: '#4f46e5', border: 'none' }}>
            <HelpCircle size={18} /> Help / Support
          </button>
        </div>
      </div>

      {/* Booking Card Form (Photo 2) */}
      {(userRole === 'Receptionist' || userRole === 'Patient' || userRole === 'Admin') && (
        <div className="glass-panel" style={{ padding: '24px', marginBottom: '32px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.05)' }}>
          <h4 style={{ color: '#4f46e5', marginBottom: '20px', fontSize: '1rem' }}>Patient Details (Auto-fills for returning patients)</h4>
          <form onSubmit={handleBookClick}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
              <div>
                <label style={labelStyle}>Patient Name:</label>
                <input required placeholder="Patient Name" value={apptForm.patientName} onChange={e => setApptForm({...apptForm, patientName: e.target.value})} className="form-input" />
              </div>
              <div>
                <label style={labelStyle}>Phone Number:</label>
                <input placeholder="Phone Number (10 Digits)" value={apptForm.phone} onChange={e => setApptForm({...apptForm, phone: e.target.value})} className="form-input" />
              </div>
              <div>
                <label style={labelStyle}>Email Address:</label>
                <input placeholder="Email Address" value={apptForm.email} onChange={e => setApptForm({...apptForm, email: e.target.value})} className="form-input" />
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <div style={{ flex: 1 }}>
                  <label style={labelStyle}>Age:</label>
                  <input placeholder="Age" type="number" value={apptForm.age} onChange={e => setApptForm({...apptForm, age: e.target.value})} className="form-input" />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={labelStyle}>Gender:</label>
                  <select value={apptForm.gender} onChange={e => setApptForm({...apptForm, gender: e.target.value})} className="form-input">
                    <option value="">Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
            </div>

            <h4 style={{ color: '#4f46e5', marginBottom: '20px', fontSize: '1rem' }}>Consultation Details</h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', alignItems: 'end' }}>
              <div>
                <label style={labelStyle}>Target Doctor:</label>
                <select required value={apptForm.doctorId} onChange={e => setApptForm({...apptForm, doctorId: e.target.value})} className="form-input">
                  <option value="">Select Target Doctor</option>
                  {doctors.map(d => <option key={d.id} value={d.id}>Dr. {d.name} ({d.specialty})</option>)}
                </select>
              </div>
              <div>
                <label style={labelStyle}>Checkup Date:</label>
                <DatePicker selected={apptForm.appointmentDate} onChange={date => setApptForm({...apptForm, appointmentDate: date})} className="form-input" placeholderText="dd-mm-yyyy" />
              </div>
              <div>
                <label style={labelStyle}>Time Slot:</label>
                <select required value={apptForm.appointmentTime} onChange={e => setApptForm({...apptForm, appointmentTime: e.target.value})} className="form-input">
                  <option value="">Select Time Slot</option>
                  {timeSlots.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label style={labelStyle}>Reason:</label>
                <input placeholder="Reason (e.g. Fever checkup)" value={apptForm.reason} onChange={e => setApptForm({...apptForm, reason: e.target.value})} className="form-input" />
              </div>
              <button type="submit" className="btn-primary" style={{ height: '48px', borderRadius: '10px', background: '#10b981', border: 'none', color: 'white', fontWeight: '700', cursor: 'pointer' }}>
                Proceed to Pay
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Appointments List (Photo 2 Table Style) */}
      <div className="glass-panel" style={{ padding: '0', overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #eee' }}>
              <th style={thStyle}>Date & Time</th>
              <th style={thStyle}>Patient Details</th>
              <th style={thStyle}>Assignee Doctor</th>
              <th style={thStyle}>Case Reason</th>
              <th style={thStyle}>Fee Paid</th>
              <th style={thStyle}>Current Status</th>
            </tr>
          </thead>
          <tbody>
            {loading ? <tr><td colSpan="6" style={tdStyle}>Loading appointments...</td></tr> : appointments.length === 0 ? <tr><td colSpan="6" style={tdStyle}>No records found.</td></tr> : appointments.map(a => (
              <tr key={a.id} style={{ borderBottom: '1px solid #f9f9f9' }}>
                <td style={tdStyle}>
                  <div style={{ fontWeight: '700' }}>{new Date(a.appointmentDate).toLocaleDateString('en-GB')}</div>
                  <div style={{ fontSize: '0.8rem', color: '#666' }}>{a.appointmentTime}</div>
                </td>
                <td style={tdStyle}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ color: '#4f46e5' }}><UserCircle size={18} /></div>
                    <span>{a.patient?.name}</span>
                  </div>
                </td>
                <td style={tdStyle}>
                  <div style={{ fontWeight: '700' }}>Dr. {a.doctor?.name}</div>
                  <div style={{ fontSize: '0.75rem', color: '#4f46e5', background: '#f0f4ff', display: 'inline-block', padding: '2px 8px', borderRadius: '10px' }}>{a.doctor?.specialty}</div>
                </td>
                <td style={tdStyle}>{a.reason}</td>
                <td style={{ ...tdStyle, fontWeight: '700', color: '#10b981' }}>₹{doctors.find(d => d.id === a.doctorId)?.consultationFee || 1500}</td>
                <td style={tdStyle}>
                  <span style={{ padding: '4px 12px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '700', background: a.status === 'Completed' ? '#d1fae5' : '#fff7ed', color: a.status === 'Completed' ? '#065f46' : '#9a3412', border: '1px solid currentColor' }}>
                    {a.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Payment Modal (Photo 3 QR Style) */}
      {paymentState.state !== 'none' && (
        <div style={overlayStyle}>
          <div className="glass-panel" style={{ width: '100%', maxWidth: '700px', padding: '0', background: 'white', borderRadius: '30px', overflow: 'hidden' }}>
            {paymentState.state === 'paying' ? (
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ padding: '32px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <h2 style={{ fontSize: '1.4rem', margin: '0 0 4px 0', color: '#333' }}>Select Payment Method</h2>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ fontSize: '0.8rem', color: '#666', margin: 0 }}>Total Payable</p>
                    <p style={{ fontSize: '1.8rem', fontWeight: '900', color: '#4f46e5', margin: 0 }}>₹{paymentState.fee}</p>
                  </div>
                </div>

                <div style={{ display: 'flex', minHeight: '300px', background: '#f8fafc' }}>
                  {/* Sidebar methods */}
                  <div style={{ width: '220px', borderRight: '1px solid #e2e8f0', padding: '20px' }}>
                    <button onClick={() => setPaymentState({...paymentState, method: 'upi'})} style={paymentMethodStyle(paymentState.method === 'upi')}>
                      UPI / QR Scan
                    </button>
                    <button onClick={() => setPaymentState({...paymentState, method: 'card'})} style={paymentMethodStyle(paymentState.method === 'card')}>
                      Credit / Debit Card
                    </button>
                    <button onClick={() => setPaymentState({...paymentState, method: 'net'})} style={paymentMethodStyle(paymentState.method === 'net')}>
                      Netbanking
                    </button>
                  </div>

                  {/* Main QR Area */}
                  <div style={{ flex: 1, padding: '40px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ background: 'white', padding: '16px', borderRadius: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', marginBottom: '16px' }}>
                      <img src="https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=MediCareProPayment" alt="QR Code" style={{ width: '160px', height: '160px' }} />
                    </div>
                    <p style={{ fontSize: '0.9rem', color: '#444', marginBottom: '8px' }}>Scan with any UPI app</p>
                    <div style={{ display: 'flex', gap: '12px', opacity: 0.6 }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: '800' }}>GPay</span>
                      <span style={{ fontSize: '0.75rem', fontWeight: '800' }}>PhonePe</span>
                      <span style={{ fontSize: '0.75rem', fontWeight: '800' }}>Paytm</span>
                    </div>
                  </div>
                </div>

                <div style={{ padding: '24px 40px', display: 'flex', gap: '16px', borderTop: '1px solid #eee' }}>
                  <button onClick={() => setPaymentState({...paymentState, state: 'none'})} style={{ flex: 1, padding: '14px', borderRadius: '10px', border: '1px solid #ddd', background: 'white', fontWeight: '700', cursor: 'pointer' }}>
                    Cancel Transaction
                  </button>
                  <button onClick={finalizePayment} style={{ flex: 1, padding: '14px', borderRadius: '10px', border: 'none', background: '#10b981', color: 'white', fontWeight: '700', cursor: 'pointer' }}>
                    Confirm Payment (Simulator)
                  </button>
                </div>
              </div>
            ) : paymentState.state === 'validating' ? (
              <div style={{ padding: '80px 40px', textAlign: 'center' }}>
                <Loader2 size={60} className="spin" color="#4f46e5" style={{ marginBottom: '24px' }} />
                <h2 style={{ marginBottom: '8px' }}>Processing Payment...</h2>
                <p style={{ color: '#666' }}>Please wait while we verify your transaction.</p>
              </div>
            ) : (
              <div style={{ padding: '80px 40px', textAlign: 'center' }}>
                <div style={{ width: '100px', height: '100px', borderRadius: '50%', background: '#d1fae5', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
                  <ShieldCheck size={60} />
                </div>
                <h1 style={{ color: '#065f46', margin: '0 0 8px 0' }}>Payment Success!</h1>
                <p style={{ color: '#666', fontSize: '1.1rem' }}>Appointment Confirmed with Dr. {paymentState.doctorName}</p>
                <div style={{ marginTop: '32px', padding: '16px', background: '#f0fdf4', borderRadius: '12px', display: 'inline-block', fontWeight: '700', color: '#10b981', border: '1px solid #10b981' }}>
                  <CheckCircle2 size={20} style={{ verticalAlign: 'middle', marginRight: '8px' }} /> Booking Confirmed
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

const labelStyle = { display: 'block', fontSize: '0.85rem', fontWeight: '700', color: '#333', marginBottom: '8px' };
const paymentMethodStyle = (isActive) => ({
  width: '100%', padding: '14px 20px', borderRadius: '12px', textAlign: 'left', border: 'none', 
  background: isActive ? '#4f46e5' : 'transparent', color: isActive ? 'white' : '#444', 
  fontWeight: '700', cursor: 'pointer', marginBottom: '8px', transition: '0.2s'
});
const thStyle = { padding: '20px 16px', color: '#666', fontSize: '0.85rem', fontWeight: '600', background: '#f8fafc' };
const tdStyle = { padding: '20px 16px', color: '#333', fontSize: '0.9rem' };
const overlayStyle = { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(4px)' };
