import React, { useState, useEffect } from 'react';
import { Printer, CheckCircle, Receipt, Plus, Search } from 'lucide-react';

export default function Billing() {
  const [bills, setBills] = useState([]);
  const [patients, setPatients] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ patientId: '', patientName: '', amount: '', description: '' });
  const [printBill, setPrintBill] = useState(null);

  const userRole = localStorage.getItem('userRole') || 'Patient';
  const userEmail = localStorage.getItem('userEmail') || '';

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const [billsRes, patRes, apptRes] = await Promise.all([
        fetch(`${apiUrl}/api/bills`).then(res => res.json()).catch(() => []),
        fetch(`${apiUrl}/api/patients`).then(res => res.json()).catch(() => []),
        fetch(`${apiUrl}/api/appointments`).then(res => res.json()).catch(() => [])
      ]);

      const billData = Array.isArray(billsRes) ? billsRes : [];
      const patData = Array.isArray(patRes) ? patRes : [];
      const apptData = Array.isArray(apptRes) ? apptRes : [];

      if (userRole.includes('Admin') || userRole === 'Receptionist') {
        setBills(billData);
      } else {
        // Patient view: filter by email
        setBills(billData.filter(b => b?.patient?.email === userEmail));
      }

      setPatients(patData);
      setAppointments(apptData);
    } catch (err) {
      console.error("Billing fetch error:", err);
    }
    setLoading(false);
  };

  const handlePatientSelection = (e) => {
    const val = e.target.value;
    const matched = patients.find(p => p?.name?.toLowerCase() === val.toLowerCase());
    setForm({ ...form, patientName: val, patientId: matched ? matched.id : '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch((import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/api/bills', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patientId: parseInt(form.patientId),
          amount: parseFloat(form.amount),
          description: form.description,
          status: 'Paid'
        })
      });
      if (res.ok) {
        setShowForm(false);
        fetchData();
        setForm({ patientId: '', patientName: '', amount: '', description: '' });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handlePrint = (bill) => {
    setPrintBill(bill);
    setTimeout(() => window.print(), 300);
  };

  if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Loading billing records...</div>;

  return (
    <div className="fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--text-main)', margin: 0 }}>Patient Billings</h1>
          <p style={{ color: 'var(--text-muted)', margin: '4px 0 0 0' }}>Manage invoices and medical payment history.</p>
        </div>
        {(userRole.includes('Admin') || userRole === 'Receptionist') && (
          <button onClick={() => setShowForm(!showForm)} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Plus size={20} /> Create New Bill
          </button>
        )}
      </div>

      {printBill && (
        <div id="print-only-invoice" style={{ padding: '40px', background: 'white', color: 'black' }}>
          <div style={{ borderBottom: '2px solid #4F46E5', paddingBottom: '20px', marginBottom: '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h1 style={{ color: '#4F46E5', margin: 0 }}>MediCare Pro Receipt</h1>
            <div style={{ textAlign: 'right' }}>
              <p style={{ margin: 0 }}><b>Invoice No:</b> INV-{1000 + printBill.id}</p>
              <p style={{ margin: 0 }}><b>Date:</b> {new Date(printBill.date).toLocaleDateString()}</p>
            </div>
          </div>
          <div style={{ marginBottom: '30px' }}>
            <h3>Patient Details</h3>
            <p>Name: {printBill.patient?.name || 'Unknown'}</p>
            <p>Phone: {printBill.patient?.phone || 'N/A'}</p>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '30px' }}>
            <thead style={{ background: '#f3f4f6' }}>
              <tr>
                <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #ddd' }}>Description</th>
                <th style={{ padding: '12px', textAlign: 'right', border: '1px solid #ddd' }}>Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ padding: '12px', border: '1px solid #ddd' }}>{printBill.description || 'Hospital Services'}</td>
                <td style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'right' }}>₹{(printBill.amount || 0).toFixed(2)}</td>
              </tr>
            </tbody>
          </table>
          <div style={{ textAlign: 'right' }}>
            <h2>Total Paid: ₹{(printBill.amount || 0).toFixed(2)}</h2>
          </div>
        </div>
      )}

      {showForm && (
        <form className="glass-panel no-print" style={{ padding: '24px', marginBottom: '24px', display: 'flex', gap: '16px', flexWrap: 'wrap' }} onSubmit={handleSubmit}>
          <input required list="billing-patient-list" placeholder="Search Patient Name" value={form.patientName} onChange={handlePatientSelection} style={inputStyle} />
          <datalist id="billing-patient-list">
            {patients.map(p => <option key={p.id} value={p.name} />)}
          </datalist>
          <input type="number" required placeholder="Amount" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} style={inputStyle} />
          <input type="text" placeholder="Description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} style={{ ...inputStyle, flex: 2 }} />
          <button type="submit" className="btn-primary">Save Bill</button>
        </form>
      )}

      <div className="glass-panel no-print" style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: 'var(--sidebar-bg)', borderBottom: '1px solid var(--border-color)' }}>
              <th style={{ padding: '16px' }}>Date</th>
              <th style={{ padding: '16px' }}>Patient</th>
              <th style={{ padding: '16px' }}>Description</th>
              <th style={{ padding: '16px' }}>Amount</th>
              <th style={{ padding: '16px' }}>Status</th>
              <th style={{ padding: '16px' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {bills.length === 0 ? (
              <tr><td colSpan="6" style={{ padding: '40px', textAlign: 'center' }}>No billing records found.</td></tr>
            ) : bills.map(b => (
              <tr key={b.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '16px' }}>{new Date(b.date).toLocaleDateString()}</td>
                <td style={{ padding: '16px' }}>{b.patient?.name || 'Unknown'}</td>
                <td style={{ padding: '16px' }}>{b.description || '-'}</td>
                <td style={{ padding: '16px', fontWeight: '600' }}>₹{b.amount || 0}</td>
                <td style={{ padding: '16px' }}>
                  <span style={{ padding: '4px 12px', borderRadius: '20px', fontSize: '0.8rem', background: b.status === 'Paid' ? '#d1fae5' : '#fee2e2', color: b.status === 'Paid' ? '#065f46' : '#991b1b' }}>
                    {b.status}
                  </span>
                </td>
                <td style={{ padding: '16px' }}>
                  <button onClick={() => handlePrint(b)} className="btn-secondary" style={{ padding: '8px 12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Printer size={16} /> Print
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const inputStyle = { padding: '12px 16px', borderRadius: '12px', border: '1px solid var(--border-color)', background: 'var(--input-bg)', color: 'var(--text-main)', outline: 'none', flex: 1, minWidth: '150px' };
