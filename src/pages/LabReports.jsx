import React, { useState, useEffect } from 'react';
import { Beaker, Plus, ExternalLink, FileText, Search, Clock, X, FileCheck } from 'lucide-react';

export default function LabReports() {
  const [reports, setReports] = useState([]);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null); // For View Modal
  const [userRole, setUserRole] = useState(localStorage.getItem('userRole') || 'Patient');
  const [userEmail, setUserEmail] = useState(localStorage.getItem('userEmail') || '');

  const [form, setForm] = useState({
    testName: '',
    result: '',
    status: 'Completed',
    patientId: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [repRes, patRes] = await Promise.all([
        fetch((import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/api/lab-reports'),
        fetch((import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/api/patients')
      ]);
      const repData = await repRes.json();
      const patData = await patRes.json();

      if (userRole === 'Patient') {
        setReports(repData.filter(r => r.patient?.email === userEmail));
      } else {
        setReports(repData);
      }
      setPatients(patData);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch((import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/api/lab-reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      if (res.ok) {
        setShowForm(false);
        fetchData();
        setForm({ testName: '', result: '', status: 'Completed', patientId: '' });
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--text-main)', margin: 0 }}>Clinical Lab Reports</h1>
          <p style={{ color: 'var(--text-muted)', margin: '4px 0 0 0' }}>
            {userRole === 'Patient' ? 'Access your medical test results and diagnostic data.' : 'Manage and upload patient diagnostic lab results.'}
          </p>
        </div>
        {(userRole.includes('Admin') || userRole === 'Receptionist') && (
          <button 
            onClick={() => setShowForm(!showForm)} 
            className="btn-primary" 
            style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <Plus size={20} /> Upload Result
          </button>
        )}
      </div>

      {showForm && (
        <div className="glass-panel" style={{ padding: '24px', marginBottom: '24px', border: '1px solid var(--primary-color)' }}>
          <h3 style={{ margin: '0 0 20px 0' }}>Enter Lab Test Result</h3>
          <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: '600' }}>Patient</label>
              <select 
                required 
                className="form-input" 
                value={form.patientId} 
                onChange={e => setForm({...form, patientId: e.target.value})}
              >
                <option value="">-- Choose Patient --</option>
                {patients.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: '600' }}>Test Name</label>
              <input 
                type="text" 
                required 
                placeholder="e.g. CBC, Blood Sugar, X-Ray Chest" 
                className="form-input" 
                value={form.testName} 
                onChange={e => setForm({...form, testName: e.target.value})}
              />
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: '600' }}>Test Result / Findings</label>
              <textarea 
                required 
                placeholder="Enter detailed results or observations..." 
                style={{ width: '100%', height: '100px', padding: '12px', borderRadius: '12px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-main)', fontFamily: 'inherit' }}
                value={form.result} 
                onChange={e => setForm({...form, result: e.target.value})}
              />
            </div>
            <div style={{ gridColumn: '1 / -1', display: 'flex', gap: '12px' }}>
              <button type="submit" className="btn-primary" style={{ flex: 1 }}>Publish Report</button>
              <button type="button" onClick={() => setShowForm(false)} style={{ flex: 1, background: 'var(--bg-color)', border: '1px solid var(--border-color)', borderRadius: '12px', cursor: 'pointer' }}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div className="glass-panel" style={{ padding: '0', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: 'rgba(0,0,0,0.02)', borderBottom: '1px solid var(--border-color)' }}>
              <th style={{ padding: '16px', color: 'var(--text-muted)', fontSize: '0.85rem', textTransform: 'uppercase' }}>Date</th>
              <th style={{ padding: '16px', color: 'var(--text-muted)', fontSize: '0.85rem', textTransform: 'uppercase' }}>Patient Name</th>
              <th style={{ padding: '16px', color: 'var(--text-muted)', fontSize: '0.85rem', textTransform: 'uppercase' }}>Test Name</th>
              <th style={{ padding: '16px', color: 'var(--text-muted)', fontSize: '0.85rem', textTransform: 'uppercase' }}>Result Summary</th>
              <th style={{ padding: '16px', color: 'var(--text-muted)', fontSize: '0.85rem', textTransform: 'uppercase' }}>Status</th>
              <th style={{ padding: '16px', color: 'var(--text-muted)', fontSize: '0.85rem', textTransform: 'uppercase' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="6" style={{ padding: '40px', textAlign: 'center' }}>Loading reports...</td></tr>
            ) : reports.length === 0 ? (
              <tr><td colSpan="6" style={{ padding: '40px', textAlign: 'center' }}>No reports found.</td></tr>
            ) : reports.map(report => (
              <tr key={report.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '16px' }}>
                  <div style={{ fontSize: '0.9rem', fontWeight: '600' }}>
                    {new Date(report.date).toLocaleDateString('en-GB')}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {new Date(report.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </td>
                <td style={{ padding: '16px', fontWeight: '500' }}>{report.patient?.name}</td>
                <td style={{ padding: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Beaker size={16} color="var(--primary-color)" />
                    <span style={{ fontWeight: '700' }}>{report.testName}</span>
                  </div>
                </td>
                <td style={{ padding: '16px', fontSize: '0.9rem', maxWidth: '300px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {report.result}
                </td>
                <td style={{ padding: '16px' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: '700', padding: '4px 10px', borderRadius: '20px', background: '#d1fae5', color: '#10b981' }}>
                    {report.status}
                  </span>
                </td>
                <td style={{ padding: '16px' }}>
                  <button 
                    onClick={() => setSelectedReport(report)}
                    style={{ background: 'none', border: 'none', color: 'var(--primary-color)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: '600' }}
                  >
                    View <ExternalLink size={14} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Report View Modal */}
      {selectedReport && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
          <div className="glass-panel" style={{ width: '100%', maxWidth: '500px', padding: '32px', background: 'white', position: 'relative' }}>
            <button onClick={() => setSelectedReport(null)} style={{ position: 'absolute', right: '20px', top: '20px', background: 'none', border: 'none', cursor: 'pointer' }}><X size={24} /></button>
            
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <div style={{ width: '60px', height: '60px', background: 'var(--gradient-bg-1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                <FileCheck size={32} color="var(--primary-color)" />
              </div>
              <h2 style={{ margin: 0 }}>Lab Report Detail</h2>
              <p style={{ color: 'var(--text-muted)' }}>Official Diagnostic Result</p>
            </div>

            <div style={{ background: 'var(--bg-color)', borderRadius: '12px', padding: '20px', marginBottom: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>
                <span style={{ color: 'var(--text-muted)' }}>Patient Name:</span>
                <span style={{ fontWeight: '700' }}>{selectedReport.patient?.name}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>
                <span style={{ color: 'var(--text-muted)' }}>Test Name:</span>
                <span style={{ fontWeight: '700', color: 'var(--primary-color)' }}>{selectedReport.testName}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>
                <span style={{ color: 'var(--text-muted)' }}>Date:</span>
                <span>{new Date(selectedReport.date).toLocaleDateString('en-GB')}</span>
              </div>
              <div style={{ marginTop: '16px' }}>
                <div style={{ color: 'var(--text-muted)', marginBottom: '8px', fontSize: '0.9rem' }}>Detailed Findings:</div>
                <div style={{ background: 'white', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', fontSize: '0.95rem', lineHeight: '1.6' }}>
                  {selectedReport.result}
                </div>
              </div>
            </div>

            <button onClick={() => setSelectedReport(null)} className="btn-primary" style={{ width: '100%', padding: '12px' }}>Close Report</button>
          </div>
        </div>
      )}
    </div>
  );
}
