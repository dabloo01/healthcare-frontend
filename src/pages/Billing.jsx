import React, { useState, useEffect } from 'react';
import { Printer, CheckCircle } from 'lucide-react';

export default function Billing() {
  const [bills, setBills] = useState([]);
  const [patients, setPatients] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ patientId: '', patientName: '', amount: '', description: '' });

  const [printBill, setPrintBill] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [billsRes, patRes, apptRes] = await Promise.all([
        fetch((import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/api/bills'),
        fetch((import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/api/patients'),
        fetch((import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/api/appointments')
      ]);
      setBills(await billsRes.json());
      setPatients(await patRes.json());
      setAppointments(await apptRes.json());
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const handlePatientSelection = (e) => {
    const val = e.target.value;
    const matched = patients.find(p => p.name.toLowerCase() === val.toLowerCase());
    setForm({ ...form, patientName: val, patientId: matched ? matched.id : '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.patientName) return;

    try {
      let finalPatientId = form.patientId;
      if (!finalPatientId) {
        // Create patient inline if missing
        const newPatRes = await fetch((import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/api/patients', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: form.patientName, phone: 'N/A' })
        });
        const newPatData = await newPatRes.json();
        finalPatientId = newPatData.id;
      }

      const payload = {
        patientId: parseInt(finalPatientId),
        amount: parseFloat(form.amount),
        description: form.description,
        status: 'Unpaid'
      };
      const res = await fetch((import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/api/bills', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        setForm({ patientId: '', patientName: '', amount: '', description: '' });
        setShowForm(false);
        fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handlePrint = (bill) => {
    setPrintBill(bill);
    document.title = `Invoice_${bill.patient?.name}_${btoa(bill.id).substr(0,6)}`;
    
    // Allow React state to render the invoice div before executing print protocol
    setTimeout(() => {
      window.print();
      setTimeout(() => { 
        document.title = "Healthcare Management System";
        setPrintBill(null);
      }, 1000);
    }, 300);
  };

  // Helper to find latest appointment for a patient to get doctor/reason
  const getLatestAppointment = (patientId) => {
    const patAppts = appointments.filter(a => a.patientId === patientId).sort((a,b) => new Date(b.appointmentDate) - new Date(a.appointmentDate));
    return patAppts.length > 0 ? patAppts[0] : null;
  };

  return (
    <div>
      <div className="no-print" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1>Billing & Invoices</h1>
        <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Close Form' : '+ Generate Bill'}
        </button>
      </div>

      {/* ============================================================== */}
      {/* HIDDEN INVOICE RENDERED ONLY FOR PRINTING                      */}
      {/* ============================================================== */}
      {printBill && (
        <div id="print-only-invoice">
          {(() => {
            const appt = getLatestAppointment(printBill.patientId);
            return (
              <div style={{ padding: '24px', color: '#111827', fontFamily: 'Arial, sans-serif' }}>
                {/* Hospital Header */}
                <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                  <h1 style={{ margin: '0 0 4px 0', fontSize: '2rem', color: '#111827', letterSpacing: '-1px' }}>MediCare Pro Hospital</h1>
                  <p style={{ margin: 0, color: '#4b5563', fontSize: '1rem' }}>Super Speciality Health Center, New Delhi, India 110001</p>
                  <p style={{ margin: '4px 0 0 0', color: '#4b5563', fontSize: '0.9rem' }}>Ph: +91-9876543210 | Email: billing@medicarepro.com</p>
                </div>

                <hr style={{ border: 'none', borderTop: '2px solid #e5e7eb', marginBottom: '24px' }} />

                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
                  {/* Patient Info */}
                  <div>
                    <h3 style={{ textTransform: 'uppercase', color: '#6b7280', fontSize: '0.8rem', letterSpacing: '1px', marginBottom: '8px' }}>Billed To Patient</h3>
                    <p style={{ margin: '0 0 4px 0', fontSize: '1.2rem', fontWeight: 'bold' }}>{printBill.patient?.name}</p>
                    <p style={{ margin: '0 0 4px 0', color: '#374151' }}>Phone: {printBill.patient?.phone}</p>
                    <p style={{ margin: '0 0 4px 0', color: '#374151' }}>Age: {printBill.patient?.age ? `${printBill.patient?.age} Yrs` : 'N/A'}</p>
                    <p style={{ margin: '0 0 4px 0', color: '#374151' }}>Gender: {printBill.patient?.gender || 'N/A'}</p>
                  </div>
                  
                  {/* Bill Info */}
                  <div style={{ textAlign: 'right' }}>
                    <h3 style={{ textTransform: 'uppercase', color: '#6b7280', fontSize: '0.8rem', letterSpacing: '1px', marginBottom: '8px' }}>Invoice Details</h3>
                    <p style={{ margin: '0 0 4px 0', fontWeight: 'bold' }}>Invoice ID: INV-{(1000 + printBill.id).toString()}</p>
                    <p style={{ margin: '0 0 4px 0' }}>Date: {new Date(printBill.date).toLocaleDateString('en-GB')}</p>
                    <p style={{ margin: '0 0 4px 0' }}>Time: {new Date(printBill.date).toLocaleTimeString()}</p>
                  </div>
                </div>

                {/* Consultation & Doctor Info */}
                <div style={{ background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '16px', marginBottom: '24px' }}>
                  <h3 style={{ margin: '0 0 12px 0', fontSize: '1rem', borderBottom: '1px solid #e5e7eb', paddingBottom: '8px' }}>Medical Case Context</h3>
                  <div style={{ display: 'flex', gap: '32px' }}>
                    <div>
                      <p style={{ margin: '0 0 4px 0', color: '#6b7280', fontSize: '0.85rem' }}>Attending Doctor</p>
                      <p style={{ margin: 0, fontWeight: 'bold', fontSize: '1rem' }}>Dr. {appt?.doctor?.name || 'Assigned Specialist'}</p>
                      <p style={{ margin: '2px 0 0 0', color: '#4b5563', fontSize: '0.9rem' }}>{appt?.doctor?.specialty || 'General'}</p>
                    </div>
                    <div>
                      <p style={{ margin: '0 0 4px 0', color: '#6b7280', fontSize: '0.85rem' }}>Diagnosis / Reason for Visit</p>
                      <p style={{ margin: 0, fontWeight: 'bold', fontSize: '1rem' }}>{appt?.reason || 'General Routine Consultation'}</p>
                    </div>
                  </div>
                </div>

                {/* Pricing Table */}
                <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '32px' }}>
                  <thead>
                    <tr style={{ background: '#f3f4f6' }}>
                      <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #d1d5db', fontSize: '0.9rem' }}>Charge Description</th>
                      <th style={{ padding: '12px', textAlign: 'right', borderBottom: '2px solid #d1d5db', fontSize: '0.9rem' }}>Final Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td style={{ padding: '16px 12px', borderBottom: '1px solid #e5e7eb', fontSize: '1rem' }}>{printBill.description || 'Hospital Services & Consultation'}</td>
                      <td style={{ padding: '16px 12px', borderBottom: '1px solid #e5e7eb', textAlign: 'right', fontSize: '1rem', fontWeight: 'bold' }}>₹{printBill.amount.toFixed(2)}</td>
                    </tr>
                  </tbody>
                </table>

                {/* Total and Success Badge */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' }}>
                  <div>
                    {printBill.status === 'Paid' ? (
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 20px', background: '#ecfdf5', border: '1px solid #10b981', color: '#065f46', borderRadius: '12px', fontWeight: 'bold', fontSize: '1rem' }}>
                        <CheckCircle size={20} />
                        PAYMENT SUCCESSFULLY RECEIVED
                      </div>
                    ) : (
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 20px', background: '#fef2f2', border: '1px solid #ef4444', color: '#991b1b', borderRadius: '12px', fontWeight: 'bold', fontSize: '1rem' }}>
                        DUES PENDING
                      </div>
                    )}
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ margin: '0 0 4px 0', color: '#6b7280', fontSize: '1rem' }}>Total Amount</p>
                    <p style={{ margin: 0, fontSize: '2rem', fontWeight: '900', color: '#111827' }}>₹{printBill.amount.toFixed(2)}</p>
                  </div>
                </div>

                {/* Fake Signature */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '32px' }}>
                  <div style={{ textAlign: 'center', borderTop: '2px solid #000', paddingTop: '8px', width: '250px' }}>
                    <div style={{ fontFamily: '"Brush Script MT", cursive', fontSize: '2.5rem', opacity: 0.7, marginBottom: '8px', marginTop: '-50px' }}>
                      MediCare Auth
                    </div>
                    <b style={{ fontSize: '0.9rem' }}>Authorized Signatory</b><br/>
                    <span style={{ color: '#4b5563', fontSize: '0.8rem' }}>Accounts Department</span>
                  </div>
                </div>

                {/* Footer Stamp */}
                <p style={{ textAlign: 'center', color: '#9ca3af', fontSize: '0.75rem', marginTop: '24px', borderTop: '1px dotted #e5e7eb', paddingTop: '16px' }}>
                  This is an electronically generated receipt for your medical history records and does not require a physical stamp.
                </p>

              </div>
            );
          })()}
        </div>
      )}

      {/* ============================================================== */}
      {/* STANDARD BILLING DASHBOARD                                     */}
      {/* ============================================================== */}
      {showForm && (
        <form className="glass-panel no-print" style={{ padding: '24px', marginBottom: '24px', display: 'flex', gap: '16px', flexWrap: 'wrap' }} onSubmit={handleSubmit}>
          <input required list="billing-patient-list" placeholder="Search or Type Patient Name" value={form.patientName} onChange={handlePatientSelection} style={inputStyle} />
          <datalist id="billing-patient-list">
            {patients.map(p => <option key={p.id} value={p.name} />)}
          </datalist>
          <input type="number" required placeholder="Amount (e.g. 500)" value={form.amount} onChange={e => setForm({...form, amount: e.target.value})} style={inputStyle} min="0" step="0.01" />
          <input type="text" placeholder="Description (e.g. Routine Checkup)" value={form.description} onChange={e => setForm({...form, description: e.target.value})} style={{...inputStyle, flex: 2}} />
          
          <button type="submit" className="btn-primary" style={{ height: '42px', marginTop: 'auto' }}>Save Bill</button>
        </form>
      )}

      <div className="glass-panel no-print" style={{ overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: 'var(--sidebar-bg)', borderBottom: '1px solid var(--border-color)' }}>
              <th style={thStyle}>Date & ID</th>
              <th style={thStyle}>Patient Name</th>
              <th style={thStyle}>Description</th>
              <th style={thStyle}>Amount</th>
              <th style={thStyle}>Status</th>
              <th style={thStyle}>Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? <tr><td colSpan="6" style={tdStyle}>Loading...</td></tr> : bills.length === 0 ? <tr><td colSpan="6" style={tdStyle}>No bills generated yet.</td></tr> : bills.map(b => (
              <tr key={b.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={tdStyle}>
                  {new Date(b.date).toLocaleDateString('en-GB')}<br/>
                  <span style={{fontSize: '0.8rem', color: 'var(--text-muted)'}}>INV-{1000 + b.id}</span>
                </td>
                <td style={tdStyle}>{b.patient?.name}</td>
                <td style={tdStyle}>{b.description || '-'}</td>
                <td style={{ ...tdStyle, fontWeight: '600' }}>₹{b.amount}</td>
                <td style={tdStyle}>
                  <span style={{ padding: '6px 10px', borderRadius: '12px', fontSize: '0.8rem', background: b.status === 'Paid' ? '#d1fae5' : '#fee2e2', color: b.status === 'Paid' ? '#065f46' : '#991b1b', border: '1px solid currentColor', fontWeight: '500' }}>
                    {b.status}
                  </span>
                </td>
                <td style={tdStyle}>
                  <button onClick={() => handlePrint(b)} className="btn-secondary" style={{ padding: '8px 12px', display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <Printer size={16} /> Print Receipt
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <style>{`
        @media print {
          html, body {
            margin: 0 !important;
            padding: 0 !important;
            height: 100vh !important;
            overflow: hidden !important;
          }
          body * {
            visibility: hidden;
          }
          .no-print {
            display: none !important; /* Prevents hidden elements from expanding page height */
          }
          #print-only-invoice, #print-only-invoice * {
            visibility: visible;
          }
          #print-only-invoice {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            background: white !important;
            padding: 0 !important;
            margin: 0 !important;
          }
        }
      `}</style>
    </div>
  );
}

const inputStyle = { padding: '10px 16px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--input-bg)', outline: 'none', flex: '1', minWidth: '200px', color: 'var(--text-main)' };
const thStyle = { padding: '16px', fontWeight: '600', color: 'var(--text-muted)' };
const tdStyle = { padding: '16px', color: 'var(--text-main)' };
