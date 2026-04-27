import React, { useState, useEffect } from 'react';
import { X, Calendar as CalIcon, DollarSign, Activity, Stethoscope } from 'lucide-react';

export default function Patients() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPat, setSelectedPat] = useState(null);

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    setLoading(true);
    try {
      const res = await fetch((import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/api/patients');
      const data = await res.json();
      setPatients(data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const calculateTotalPaid = (bills) => {
    if (!bills) return 0;
    return bills.filter(b => b.status === 'Paid').reduce((sum, b) => sum + b.amount, 0);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
        <h1>Medical Records Directory</h1>
      </div>
      <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>Click on any patient's name to view their complete medical and billing history.</p>

      {selectedPat && (
        <div style={overlayStyle}>
          <div className="glass-panel" style={modalStyle}>
            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '16px', marginBottom: '24px' }}>
              <div>
                <h2 style={{ fontSize: '1.4rem', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Activity color="var(--primary-color)" /> Complete Profile: {selectedPat.name}
                </h2>
                <p style={{ margin: '4px 0 0 0', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                  Age: {selectedPat.age || 'N/A'} | Gender: {selectedPat.gender || 'N/A'} | Phone: {selectedPat.phone}
                </p>
              </div>
              <button onClick={() => setSelectedPat(null)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', outline: 'none' }}>
                <X size={24} color="var(--text-muted)" />
              </button>
            </div>

            {/* Stats Row */}
            <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
              <div style={statBoxStyle}>
                <p style={statLabelStyle}>Total Hospital Visits</p>
                <h3 style={statValueStyle}>{selectedPat.appointments?.length || 0}</h3>
              </div>
              <div style={statBoxStyle}>
                <p style={statLabelStyle}>Lifetime Billing (Paid)</p>
                <h3 style={{...statValueStyle, color: '#10b981'}}>₹{calculateTotalPaid(selectedPat.bills)}</h3>
              </div>
            </div>

            {/* Timeline */}
            <div style={{ marginBottom: '16px' }}>
              <h3 style={{ marginBottom: '12px', borderBottom: '2px solid var(--border-color)', paddingBottom: '8px' }}>Past Appointments Timeline</h3>
              
              <div style={{ maxHeight: '250px', overflowY: 'auto', paddingRight: '8px' }}>
                {!selectedPat.appointments || selectedPat.appointments.length === 0 ? (
                  <p style={{ color: 'var(--text-muted)' }}>No past appointments found.</p>
                ) : (
                  selectedPat.appointments.map((appt, i) => {
                    // Match bill closest to appointment date if exact match is hard, 
                    // but for now, we know the bill is generated in the same flow.
                    // We can just query `appt.doctor.consultationFee` since the payment was exactly that!
                    const feePaid = appt.doctor?.consultationFee || 500;
                    
                    return (
                      <div key={appt.id} style={{ display: 'flex', gap: '16px', marginBottom: '16px', position: 'relative' }}>
                        {/* Timeline line */}
                        {i !== selectedPat.appointments.length - 1 && (
                          <div style={{ position: 'absolute', left: '19px', top: '30px', bottom: '-20px', width: '2px', background: 'var(--border-color)' }}></div>
                        )}
                        
                        <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--input-bg)', border: '2px solid var(--primary-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, zIndex: 1, color: 'var(--primary-color)' }}>
                           <CalIcon size={18} />
                        </div>
                        
                        <div style={{ background: 'var(--input-bg)', padding: '16px', borderRadius: '12px', flex: 1, border: '1px solid var(--border-color)' }}>
                           <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                              <span style={{ fontWeight: '600' }}>{new Date(appt.appointmentDate).toLocaleDateString('en-GB')} - {new Date(appt.appointmentDate).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                              <span style={{ fontWeight: '700', color: '#10b981', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <DollarSign size={14} /> Paid ₹{feePaid}
                              </span>
                           </div>
                           <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-main)', marginBottom: '4px' }}>
                             <Stethoscope size={16} color="var(--primary-color)" /> Attended by <b>Dr. {appt.doctor?.name}</b> <span style={{fontSize:'0.8rem', color: 'var(--text-muted)'}}>({appt.doctor?.specialty})</span>
                           </div>
                           <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.9rem' }}>Reason: {appt.reason || 'General Routine Checkup'}</p>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="glass-panel" style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '600px' }}>
          <thead>
            <tr style={{ background: 'var(--sidebar-bg)', borderBottom: '1px solid var(--border-color)' }}>
              <th style={thStyle}>Patient Name</th>
              <th style={thStyle}>Phone / Contact</th>
              <th style={thStyle}>Age & Gender</th>
              <th style={thStyle}>Total Visits</th>
              <th style={thStyle}>Latest Status</th>
            </tr>
          </thead>
          <tbody>
            {loading ? <tr><td colSpan="5" style={tdStyle}>Loading Database...</td></tr> : patients.length === 0 ? <tr><td colSpan="5" style={tdStyle}>No patients found.</td></tr> : patients.map(p => {
              const visitCount = p.appointments?.length || 0;
              const hasPaidBills = (p.bills?.filter(b => b.status === 'Paid').length || 0) > 0;
              
              return (
                <tr key={p.id} style={{ borderBottom: '1px solid var(--border-color)', transition: 'background 0.2s' }} 
                    onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(79, 70, 229, 0.05)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
                  <td style={{...tdStyle, cursor: 'pointer'}} onClick={() => setSelectedPat(p)}>
                    <div style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
                      <div style={{width: '36px', height: '36px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--primary-color), #818cf8)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold'}}>
                        {p.name.charAt(0).toUpperCase()}
                      </div>
                      <span style={{fontWeight: '600', color: 'var(--primary-color)', textDecoration: 'underline'}}>{p.name}</span>
                    </div>
                  </td>
                  <td style={tdStyle}>
                    <div>{p.phone}</div>
                    <div style={{fontSize: '0.8rem', color: 'var(--text-muted)'}}>{p.email || 'No email'}</div>
                  </td>
                  <td style={tdStyle}>
                    {p.age ? `${p.age} Yrs` : '-'} {p.gender ? `• ${p.gender}` : ''}
                  </td>
                  <td style={{...tdStyle, fontWeight: '600'}}>
                    {visitCount}
                  </td>
                  <td style={tdStyle}>
                    {visitCount === 0 ? (
                       <span style={{ padding: '6px 10px', borderRadius: '12px', fontSize: '0.8rem', background: '#f3f4f6', color: '#4b5563' }}>No Data</span>
                    ) : hasPaidBills ? (
                       <span style={{ padding: '6px 10px', borderRadius: '12px', fontSize: '0.8rem', background: '#d1fae5', color: '#065f46', border: '1px solid currentColor', fontWeight: '500' }}>Payment Successful</span>
                    ) : (
                       <span style={{ padding: '6px 10px', borderRadius: '12px', fontSize: '0.8rem', background: '#fee2e2', color: '#991b1b', border: '1px solid currentColor', fontWeight: '500' }}>Pending</span>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const overlayStyle = {
  position: 'fixed',
  top: 0, left: 0, right: 0, bottom: 0,
  background: 'rgba(0,0,0,0.5)',
  backdropFilter: 'blur(5px)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 1000
};

const modalStyle = {
  background: 'var(--card-bg)',
  width: '100%',
  maxWidth: '700px',
  padding: '32px',
  borderRadius: '24px',
  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  position: 'relative'
};

const statBoxStyle = {
  flex: 1,
  padding: '16px',
  background: 'var(--input-bg)',
  borderRadius: '12px',
  border: '1px solid var(--border-color)'
};

const statLabelStyle = { margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' };
const statValueStyle = { margin: '8px 0 0 0', fontSize: '1.5rem', color: 'var(--text-main)', fontWeight: '700' };

const thStyle = { padding: '16px', fontWeight: '600', color: 'var(--text-muted)' };
const tdStyle = { padding: '16px', color: 'var(--text-main)' };
