import React, { useEffect, useState } from 'react';
import { Users, UserPlus, Calendar, Receipt, TrendingUp, TrendingDown, Clock, AlertCircle, CheckCircle2, ChevronRight, Activity } from 'lucide-react';

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalPatients: 0,
    totalDoctors: 0,
    totalAppointments: 0,
    pendingBillsCount: 0,
    totalRevenue: 0
  });

  const [recentPatients, setRecentPatients] = useState([]);
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/dashboard')
      .then(res => res.json())
      .then(data => setStats(data))
      .catch(err => console.error(err));

    fetch('http://localhost:5000/api/patients')
      .then(res => res.json())
      .then(data => setRecentPatients(data.slice(0, 5))) 
      .catch(err => console.error(err));

    fetch('http://localhost:5000/api/appointments')
      .then(res => res.json())
      .then(data => setUpcomingAppointments(data.filter(a => a.status === 'Scheduled').slice(0, 5)))
      .catch(err => console.error(err));
  }, []);

  // Mock data for analytics chart
  const weekData = [
    { day: 'Mon', in: 40, out: 30 },
    { day: 'Tue', in: 65, out: 40 },
    { day: 'Wed', in: 50, out: 45 },
    { day: 'Thu', in: 85, out: 60 },
    { day: 'Fri', in: 75, out: 55 },
    { day: 'Sat', in: 45, out: 40 },
    { day: 'Sun', in: 35, out: 20 },
  ];

  return (
    <div style={{ padding: '8px 16px' }}>
      {/* HEADER */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 style={{ marginBottom: '4px', fontSize: '1.9rem', fontWeight: '900', letterSpacing: '-0.5px' }}>Hospital Analytics</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', fontWeight: '500' }}>Real-time overview of your healthcare facility</p>
        </div>
        <div style={{ padding: '8px 16px', background: '#ecfdf5', color: '#059669', borderRadius: '30px', border: '1px solid #a7f3d0', fontWeight: '800', fontSize: '0.85rem', display: 'flex', gap: '8px', alignItems: 'center', boxShadow: '0 4px 10px rgba(16, 185, 129, 0.1)' }}>
          <div style={{ width: '8px', height: '8px', background: '#10b981', borderRadius: '50%', animation: 'pulse 2s infinite' }}></div>
          SYSTEM ONLINE
        </div>
      </div>
      
      {/* STAT BLOCKS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px', marginBottom: '32px' }}>
        
        {/* Stat 1 */}
        <div className="stat-card" style={{ background: 'var(--card-bg)', padding: '24px', borderRadius: '16px', border: '1px solid var(--border-color)', boxShadow: '0 4px 6px rgba(0,0,0,0.02)', display: 'flex', flexDirection: 'column', gap: '16px', position: 'relative', overflow: 'hidden' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
               <h3 style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px', margin: 0 }}>Total Patients</h3>
               <p style={{ fontSize: '2.5rem', fontWeight: '800', margin: '8px 0', lineHeight: '1', color: 'var(--text-main)', letterSpacing: '-1px' }}>{stats.totalPatients}</p>
            </div>
            <div style={{ padding: '14px', background: 'var(--gradient-bg-1)', borderRadius: '14px', color: 'var(--primary-color)' }}>
               <Users size={26} strokeWidth={2.5} />
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', fontWeight: '700', color: '#10b981' }}>
             <TrendingUp size={16} strokeWidth={3} /> <span>+12.5%</span> <span style={{color: 'var(--text-muted)', fontWeight: '500'}}>vs last month</span>
          </div>
        </div>

        {/* Stat 2 */}
        <div className="stat-card" style={{ background: 'var(--card-bg)', padding: '24px', borderRadius: '16px', border: '1px solid var(--border-color)', boxShadow: '0 4px 6px rgba(0,0,0,0.02)', display: 'flex', flexDirection: 'column', gap: '16px', position: 'relative', overflow: 'hidden' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
               <h3 style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px', margin: 0 }}>Active Doctors</h3>
               <p style={{ fontSize: '2.5rem', fontWeight: '800', margin: '8px 0', lineHeight: '1', color: 'var(--text-main)', letterSpacing: '-1px' }}>{stats.totalDoctors}</p>
            </div>
            <div style={{ padding: '14px', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '14px', color: '#10b981' }}>
               <UserPlus size={26} strokeWidth={2.5} />
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', fontWeight: '700', color: '#10b981' }}>
             <TrendingUp size={16} strokeWidth={3} /> <span>+2</span> <span style={{color: 'var(--text-muted)', fontWeight: '500'}}>new onboardings</span>
          </div>
        </div>

        {/* Stat 3 */}
        <div className="stat-card" style={{ background: 'var(--card-bg)', padding: '24px', borderRadius: '16px', border: '1px solid var(--border-color)', boxShadow: '0 4px 6px rgba(0,0,0,0.02)', display: 'flex', flexDirection: 'column', gap: '16px', position: 'relative', overflow: 'hidden' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
               <h3 style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px', margin: 0 }}>Appointments</h3>
               <p style={{ fontSize: '2.5rem', fontWeight: '800', margin: '8px 0', lineHeight: '1', color: 'var(--text-main)', letterSpacing: '-1px' }}>{stats.totalAppointments}</p>
            </div>
            <div style={{ padding: '14px', background: 'rgba(245, 158, 11, 0.1)', borderRadius: '14px', color: '#f59e0b' }}>
               <Calendar size={26} strokeWidth={2.5} />
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', fontWeight: '700', color: '#f59e0b' }}>
             <Activity size={16} strokeWidth={3} /> <span>High Volume</span> <span style={{color: 'var(--text-muted)', fontWeight: '500'}}>this week</span>
          </div>
        </div>

        {/* Stat 4 */}
        <div className="stat-card" style={{ background: 'var(--card-bg)', padding: '24px', borderRadius: '16px', border: '1px solid var(--border-color)', boxShadow: '0 4px 6px rgba(0,0,0,0.02)', display: 'flex', flexDirection: 'column', gap: '16px', position: 'relative', overflow: 'hidden' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div style={{ flex: 1 }}>
               <h3 style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px', margin: 0 }}>Total Revenue</h3>
               <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', flexWrap: 'wrap' }}>
                 <p style={{ fontSize: '2.5rem', fontWeight: '800', margin: '8px 0', lineHeight: '1', color: 'var(--text-main)', letterSpacing: '-1px' }}>₹{stats.totalRevenue}</p>
               </div>
            </div>
            <div style={{ padding: '14px', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '14px', color: '#ef4444' }}>
               <Receipt size={26} strokeWidth={2.5} />
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', fontWeight: '700', color: '#ef4444' }}>
             <AlertCircle size={16} strokeWidth={3} /> <span>{stats.pendingBillsCount}</span> <span style={{color: 'var(--text-muted)', fontWeight: '500'}}>Bills Pending Collection</span>
          </div>
        </div>
      </div>



      {/* DETAILED INFORMATION PANELS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px' }}>
        
        {/* Panel 1 */}
        <div style={{ background: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 4px 6px rgba(0,0,0,0.02)' }}>
          <div style={{ padding: '24px', borderBottom: '1px solid var(--border-color)', background: 'var(--sidebar-bg)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ fontSize: '1.1rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '12px', margin: 0, textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--text-main)' }}>
              <Clock size={20} color="var(--primary-color)" /> Recent Admissions
            </h2>
            <span style={{ fontSize: '0.85rem', color: 'var(--primary-color)', fontWeight: '700', cursor: 'pointer' }}>View All</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {recentPatients.length === 0 ? <p style={{color: 'var(--text-muted)', padding: '24px'}}>No recent patients.</p> : recentPatients.map((p, idx) => (
              <div key={p.id} className="row-hover" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 24px', borderBottom: idx !== recentPatients.length - 1 ? '1px solid var(--border-color)' : 'none', cursor: 'pointer' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--gradient-bg-1)', color: 'var(--primary-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '1.1rem' }}>
                    {p.name.charAt(0)}
                  </div>
                  <div>
                    <p style={{ fontWeight: '700', margin: 0, color: 'var(--text-main)', fontSize: '1rem' }}>{p.name}</p>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: '4px 0 0 0', fontWeight: '500' }}>PID-{p.id.toString().padStart(4, '0')} • {p.gender}</p>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-main)', fontWeight: '600' }}>
                    {new Date(p.createdAt).toLocaleDateString('en-GB')}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Panel 2 */}
        <div style={{ background: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 4px 6px rgba(0,0,0,0.02)' }}>
          <div style={{ padding: '24px', borderBottom: '1px solid var(--border-color)', background: 'var(--sidebar-bg)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ fontSize: '1.1rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '12px', margin: 0, textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--text-main)' }}>
              <AlertCircle size={20} color="#f59e0b" /> Upcoming Appointments
            </h2>
            <span style={{ fontSize: '0.85rem', color: 'var(--primary-color)', fontWeight: '700', cursor: 'pointer' }}>Manage</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {upcomingAppointments.length === 0 ? <p style={{color: 'var(--text-muted)', padding: '24px'}}>No upcoming appointments.</p> : upcomingAppointments.map((a, idx) => (
              <div key={a.id} className="row-hover" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 24px', borderBottom: idx !== upcomingAppointments.length - 1 ? '1px solid var(--border-color)' : 'none', cursor: 'pointer' }}>
                <div>
                  <p style={{ fontWeight: '700', margin: 0, color: 'var(--text-main)', fontSize: '1rem' }}>{a.patient?.name}</p>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: '4px 0 0 0', fontWeight: '500' }}>Dr. {a.doctor?.name} ({a.doctor?.specialty})</p>
                </div>
                <div style={{ textAlign: 'right', display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div>
                    <span style={{ fontSize: '0.8rem', fontWeight: '800', padding: '6px 10px', borderRadius: '6px', background: '#fef3c7', color: '#b45309', border: '1px solid #fde68a' }}>
                      {new Date(a.appointmentDate).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </span>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '8px 0 0 0', fontWeight: '600' }}>
                      {new Date(a.appointmentDate).toLocaleDateString('en-GB')}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      <style>{`
        .row-hover {
           transition: all 0.2s ease;
        }
        .row-hover:hover {
           background: rgba(0,0,0,0.03);
           padding-left: 28px !important;
        }
        .dark .row-hover:hover {
           background: rgba(255,255,255,0.05);
        }
      `}</style>
    </div>
  );
}
