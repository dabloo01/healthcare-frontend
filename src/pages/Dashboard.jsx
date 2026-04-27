import React, { useEffect, useMemo, useState } from 'react';
import {
  Users,
  UserPlus,
  Calendar,
  Receipt,
  TrendingUp,
  Clock,
  AlertCircle,
  Activity,
  DollarSign,
  Briefcase
} from 'lucide-react';

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalPatients: 0,
    totalDoctors: 0,
    totalAppointments: 0,
    pendingBillsCount: 0,
    totalRevenue: 0
  });

  const [loading, setLoading] = useState(true);
  const userRole = localStorage.getItem('userRole') || 'Receptionist';

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch((import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/api/dashboard');
      const data = await res.json();
      setStats(data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Loading Dashboard Data...</div>;

  return (
    <div className="fade-in">
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: '800', margin: 0 }}>
          {userRole === 'Admin' ? 'Hospital Analytics' : 'Operational Overview'}
        </h1>
        <p style={{ color: 'var(--text-muted)', marginTop: '8px' }}>
          {userRole === 'Admin' ? 'Real-time performance and financial metrics.' : 'Daily tasks and patient management summary.'}
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '24px' }}>
        {/* Metric 1: Total Patients (Common) */}
        <div className="glass-panel" style={cardStyle}>
          <div style={{ ...iconBox, background: 'var(--gradient-bg-1)', color: 'var(--primary-color)' }}>
            <Users size={24} />
          </div>
          <div>
            <div style={labelStyle}>Total Patients</div>
            <div style={valueStyle}>{stats.totalPatients}</div>
          </div>
        </div>

        {/* Metric 2: Role Based (Revenue for Admin, Pending for Receptionist) */}
        {userRole === 'Admin' ? (
          <div className="glass-panel" style={cardStyle}>
            <div style={{ ...iconBox, background: '#d1fae5', color: '#10b981' }}>
              <DollarSign size={24} />
            </div>
            <div>
              <div style={labelStyle}>Total Revenue</div>
              <div style={valueStyle}>₹{stats.totalRevenue?.toLocaleString()}</div>
            </div>
          </div>
        ) : (
          <div className="glass-panel" style={cardStyle}>
            <div style={{ ...iconBox, background: '#fee2e2', color: '#ef4444' }}>
              <Receipt size={24} />
            </div>
            <div>
              <div style={labelStyle}>Pending Payments</div>
              <div style={valueStyle}>{stats.pendingBillsCount}</div>
            </div>
          </div>
        )}

        {/* Metric 3: Role Based (Doctors for Admin, Appointments for Receptionist) */}
        {userRole === 'Admin' ? (
          <div className="glass-panel" style={cardStyle}>
            <div style={{ ...iconBox, background: '#e0e7ff', color: '#4f46e5' }}>
              <Briefcase size={24} />
            </div>
            <div>
              <div style={labelStyle}>Active Doctors</div>
              <div style={valueStyle}>{stats.totalDoctors}</div>
            </div>
          </div>
        ) : (
          <div className="glass-panel" style={cardStyle}>
            <div style={{ ...iconBox, background: 'var(--gradient-bg-1)', color: 'var(--primary-color)' }}>
              <Calendar size={24} />
            </div>
            <div>
              <div style={labelStyle}>Appointments</div>
              <div style={valueStyle}>{stats.totalAppointments}</div>
            </div>
          </div>
        )}
      </div>

      {/* Analytics Graph Placeholder for Admin */}
      {userRole === 'Admin' && (
        <div className="glass-panel" style={{ marginTop: '32px', padding: '32px' }}>
          <h3 style={{ margin: '0 0 24px 0' }}>Revenue Trends</h3>
          <div style={{ height: '300px', background: 'var(--bg-color)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
            <Activity size={48} style={{ opacity: 0.1, marginRight: '16px' }} />
            Graph will update as data grows.
          </div>
        </div>
      )}
    </div>
  );
}

const cardStyle = { padding: '24px', display: 'flex', alignItems: 'center', gap: '20px', border: '1px solid var(--border-color)' };
const iconBox = { padding: '14px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' };
const labelStyle = { color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: '700', textTransform: 'uppercase' };
const valueStyle = { fontSize: '1.8rem', fontWeight: '800', marginTop: '4px', color: 'var(--text-main)' };
