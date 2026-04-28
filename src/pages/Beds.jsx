import React, { useEffect, useState } from 'react';
import { BedDouble, Plus, X, UserCheck, LogOut } from 'lucide-react';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const WARD_COLORS = {
  General:   { bg: '#eff6ff', border: '#3b82f6', badge: '#3b82f6', light: '#dbeafe' },
  Private:   { bg: '#f0fdf4', border: '#22c55e', badge: '#22c55e', light: '#dcfce7' },
  ICU:       { bg: '#fff7ed', border: '#f97316', badge: '#f97316', light: '#ffedd5' },
  Emergency: { bg: '#fef2f2', border: '#ef4444', badge: '#ef4444', light: '#fee2e2' },
};

export default function Beds() {
  const [beds, setBeds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [admitModal, setAdmitModal] = useState(null); // bed object
  const [addModal, setAddModal] = useState(false);
  const [patientName, setPatientName] = useState('');
  const [newBedNumber, setNewBedNumber] = useState('');
  const [newWard, setNewWard] = useState('General');
  const [actionLoading, setActionLoading] = useState(false);

  const userRole = localStorage.getItem('userRole') || '';
  const isAdmin = userRole === 'Admin' || userRole === 'Hospital Admin';

  const fetchBeds = () => {
    fetch(`${API}/api/beds`)
      .then(r => r.json())
      .then(data => { setBeds(data); setLoading(false); })
      .catch(() => setLoading(false));
  };

  useEffect(() => { fetchBeds(); }, []);

  const handleAdmit = async () => {
    if (!patientName.trim()) { alert('Patient ka naam daalo!'); return; }
    setActionLoading(true);
    await fetch(`${API}/api/beds/${admitModal.id}/admit`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ patientName: patientName.trim() })
    });
    setActionLoading(false);
    setAdmitModal(null);
    setPatientName('');
    fetchBeds();
  };

  const handleDischarge = async (bed) => {
    if (!window.confirm(`"${bed.patientName}" ko discharge karna chahte ho?`)) return;
    await fetch(`${API}/api/beds/${bed.id}/discharge`, { method: 'PUT' });
    fetchBeds();
  };

  const handleAddBed = async () => {
    if (!newBedNumber.trim()) { alert('Bed number daalo!'); return; }
    setActionLoading(true);
    await fetch(`${API}/api/beds`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ bedNumber: newBedNumber.trim(), ward: newWard })
    });
    setActionLoading(false);
    setAddModal(false);
    setNewBedNumber('');
    setNewWard('General');
    fetchBeds();
  };

  const handleDeleteBed = async (bed) => {
    if (bed.status === 'Occupied') { alert('Pehle patient ko discharge karo, phir bed delete karo.'); return; }
    if (!window.confirm(`Bed "${bed.bedNumber}" delete karna chahte ho?`)) return;
    await fetch(`${API}/api/beds/${bed.id}`, { method: 'DELETE' });
    fetchBeds();
  };

  // Group beds by ward
  const wards = ['General', 'Private', 'ICU', 'Emergency'];
  const grouped = wards.reduce((acc, ward) => {
    acc[ward] = beds.filter(b => b.ward === ward);
    return acc;
  }, {});
  const otherWards = [...new Set(beds.filter(b => !wards.includes(b.ward)).map(b => b.ward))];
  otherWards.forEach(w => { grouped[w] = beds.filter(b => b.ward === w); });
  const allWards = [...wards.filter(w => grouped[w]?.length > 0), ...otherWards];

  const totalBeds = beds.length;
  const occupiedBeds = beds.filter(b => b.status === 'Occupied').length;
  const availableBeds = totalBeds - occupiedBeds;

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ width: 48, height: 48, border: '4px solid #e2e8f0', borderTopColor: '#4f46e5', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 16px' }} />
        <p style={{ color: 'var(--text-muted)' }}>Beds load ho rahe hain...</p>
        <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
      </div>
    </div>
  );

  return (
    <div style={{ padding: '8px 16px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontSize: '1.9rem', fontWeight: 900, letterSpacing: '-0.5px', margin: 0 }}>
            🏥 Bed & Ward Management
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginTop: 4 }}>
            Real-time bed availability across all wards
          </p>
        </div>
        {isAdmin && (
          <button
            id="add-bed-btn"
            onClick={() => setAddModal(true)}
            style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 20px', background: 'var(--primary-color)', color: '#fff', border: 'none', borderRadius: 12, fontWeight: 700, cursor: 'pointer', fontSize: '0.95rem', boxShadow: '0 4px 12px rgba(79,70,229,0.3)' }}
          >
            <Plus size={18} /> Add New Bed
          </button>
        )}
      </div>

      {/* Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 20, marginBottom: 32 }}>
        {[
          { label: 'Total Beds', value: totalBeds, color: '#4f46e5', bg: '#ede9fe' },
          { label: 'Available Beds', value: availableBeds, color: '#22c55e', bg: '#dcfce7' },
          { label: 'Occupied Beds', value: occupiedBeds, color: '#ef4444', bg: '#fee2e2' },
        ].map((c, i) => (
          <div key={i} style={{ background: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: 16, padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
            <div>
              <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.82rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{c.label}</p>
              <p style={{ margin: '6px 0 0', fontSize: '2.4rem', fontWeight: 900, color: 'var(--text-main)', letterSpacing: '-1px' }}>{c.value}</p>
            </div>
            <div style={{ width: 50, height: 50, borderRadius: 14, background: c.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <BedDouble size={24} color={c.color} />
            </div>
          </div>
        ))}
      </div>

      {/* Ward Sections */}
      {allWards.map(ward => {
        const wc = WARD_COLORS[ward] || { bg: '#f8fafc', border: '#94a3b8', badge: '#64748b', light: '#f1f5f9' };
        const wardBeds = grouped[ward] || [];
        const occ = wardBeds.filter(b => b.status === 'Occupied').length;
        return (
          <div key={ward} style={{ marginBottom: 32 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0, color: 'var(--text-main)' }}>
                {ward} Ward
              </h2>
              <span style={{ padding: '3px 12px', borderRadius: 20, background: wc.light, color: wc.badge, fontSize: '0.8rem', fontWeight: 700 }}>
                {wardBeds.length - occ} available / {wardBeds.length} total
              </span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 16 }}>
              {wardBeds.map(bed => (
                <div key={bed.id} style={{
                  background: bed.status === 'Occupied' ? '#fff5f5' : '#f0fdf4',
                  border: `2px solid ${bed.status === 'Occupied' ? '#fca5a5' : '#86efac'}`,
                  borderRadius: 16,
                  padding: '18px 20px',
                  position: 'relative',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                }}>
                  {/* Bed Number + Status Badge */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                    <div>
                      <p style={{ margin: 0, fontWeight: 900, fontSize: '1.1rem', color: 'var(--text-main)' }}>
                        🛏 {bed.bedNumber}
                      </p>
                    </div>
                    <span style={{
                      padding: '3px 10px', borderRadius: 20, fontSize: '0.75rem', fontWeight: 700,
                      background: bed.status === 'Occupied' ? '#fee2e2' : '#dcfce7',
                      color: bed.status === 'Occupied' ? '#dc2626' : '#16a34a'
                    }}>
                      {bed.status === 'Occupied' ? '🔴 Occupied' : '🟢 Available'}
                    </span>
                  </div>

                  {/* Patient Info */}
                  {bed.status === 'Occupied' ? (
                    <div style={{ marginBottom: 14 }}>
                      <p style={{ margin: 0, fontWeight: 700, color: '#1e293b', fontSize: '0.95rem' }}>👤 {bed.patientName}</p>
                      {bed.admittedAt && (
                        <p style={{ margin: '4px 0 0', fontSize: '0.78rem', color: '#64748b' }}>
                          Admitted: {new Date(bed.admittedAt).toLocaleDateString('en-IN')}
                        </p>
                      )}
                    </div>
                  ) : (
                    <p style={{ margin: '0 0 14px', fontSize: '0.88rem', color: '#64748b' }}>No patient assigned</p>
                  )}

                  {/* Action Buttons */}
                  <div style={{ display: 'flex', gap: 8 }}>
                    {bed.status === 'Available' ? (
                      <button
                        id={`admit-btn-${bed.id}`}
                        onClick={() => { setAdmitModal(bed); setPatientName(''); }}
                        style={{ flex: 1, padding: '8px', background: '#4f46e5', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 700, cursor: 'pointer', fontSize: '0.82rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
                      >
                        <UserCheck size={15} /> Admit Patient
                      </button>
                    ) : (
                      <button
                        id={`discharge-btn-${bed.id}`}
                        onClick={() => handleDischarge(bed)}
                        style={{ flex: 1, padding: '8px', background: '#ef4444', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 700, cursor: 'pointer', fontSize: '0.82rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
                      >
                        <LogOut size={15} /> Discharge
                      </button>
                    )}
                    {isAdmin && (
                      <button
                        id={`delete-bed-${bed.id}`}
                        onClick={() => handleDeleteBed(bed)}
                        style={{ padding: '8px 10px', background: '#f1f5f9', color: '#94a3b8', border: '1px solid #e2e8f0', borderRadius: 8, cursor: 'pointer' }}
                        title="Delete Bed"
                      >
                        <X size={15} />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}

      {beds.length === 0 && (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
          <BedDouble size={48} style={{ marginBottom: 16, opacity: 0.3 }} />
          <p style={{ fontSize: '1.1rem', fontWeight: 600 }}>Koi bed nahi mila. Admin se add karwao.</p>
        </div>
      )}

      {/* Admit Modal */}
      {admitModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: '#fff', borderRadius: 20, padding: 32, width: '100%', maxWidth: 420, boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}>
            <h3 style={{ margin: '0 0 6px', fontSize: '1.3rem', fontWeight: 800 }}>🛏 Admit Patient</h3>
            <p style={{ margin: '0 0 24px', color: '#64748b', fontSize: '0.9rem' }}>Bed: <b>{admitModal.bedNumber}</b> ({admitModal.ward} Ward)</p>
            <label style={{ fontWeight: 700, fontSize: '0.9rem', color: '#1e293b', display: 'block', marginBottom: 8 }}>Patient ka naam</label>
            <input
              id="admit-patient-name-input"
              type="text"
              placeholder="e.g. Ramesh Kumar"
              value={patientName}
              onChange={e => setPatientName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleAdmit()}
              style={{ width: '100%', padding: '12px 16px', borderRadius: 12, border: '2px solid #e2e8f0', fontSize: '1rem', boxSizing: 'border-box', marginBottom: 20, outline: 'none' }}
              autoFocus
            />
            <div style={{ display: 'flex', gap: 12 }}>
              <button onClick={() => setAdmitModal(null)} style={{ flex: 1, padding: '12px', background: '#f1f5f9', color: '#64748b', border: 'none', borderRadius: 12, fontWeight: 700, cursor: 'pointer' }}>Cancel</button>
              <button id="confirm-admit-btn" onClick={handleAdmit} disabled={actionLoading} style={{ flex: 1, padding: '12px', background: '#4f46e5', color: '#fff', border: 'none', borderRadius: 12, fontWeight: 700, cursor: 'pointer' }}>
                {actionLoading ? 'Admitting...' : 'Admit Karo'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Bed Modal */}
      {addModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: '#fff', borderRadius: 20, padding: 32, width: '100%', maxWidth: 420, boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}>
            <h3 style={{ margin: '0 0 24px', fontSize: '1.3rem', fontWeight: 800 }}>➕ Naya Bed Add Karo</h3>
            <label style={{ fontWeight: 700, fontSize: '0.9rem', display: 'block', marginBottom: 8 }}>Bed Number</label>
            <input
              id="new-bed-number-input"
              type="text"
              placeholder="e.g. G-106, ICU-04"
              value={newBedNumber}
              onChange={e => setNewBedNumber(e.target.value)}
              style={{ width: '100%', padding: '12px 16px', borderRadius: 12, border: '2px solid #e2e8f0', fontSize: '1rem', boxSizing: 'border-box', marginBottom: 16, outline: 'none' }}
              autoFocus
            />
            <label style={{ fontWeight: 700, fontSize: '0.9rem', display: 'block', marginBottom: 8 }}>Ward</label>
            <select
              id="new-bed-ward-select"
              value={newWard}
              onChange={e => setNewWard(e.target.value)}
              style={{ width: '100%', padding: '12px 16px', borderRadius: 12, border: '2px solid #e2e8f0', fontSize: '1rem', marginBottom: 24, outline: 'none' }}
            >
              <option value="General">General</option>
              <option value="Private">Private</option>
              <option value="ICU">ICU</option>
              <option value="Emergency">Emergency</option>
            </select>
            <div style={{ display: 'flex', gap: 12 }}>
              <button onClick={() => setAddModal(false)} style={{ flex: 1, padding: '12px', background: '#f1f5f9', color: '#64748b', border: 'none', borderRadius: 12, fontWeight: 700, cursor: 'pointer' }}>Cancel</button>
              <button id="confirm-add-bed-btn" onClick={handleAddBed} disabled={actionLoading} style={{ flex: 1, padding: '12px', background: '#4f46e5', color: '#fff', border: 'none', borderRadius: 12, fontWeight: 700, cursor: 'pointer' }}>
                {actionLoading ? 'Adding...' : 'Add Karo'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
