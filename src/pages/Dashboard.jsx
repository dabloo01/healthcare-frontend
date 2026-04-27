import React, { useEffect, useMemo, useState } from 'react';
import {
  Users,
  UserPlus,
  Calendar,
  Receipt,
  TrendingUp,
  Clock,
  AlertCircle,
  Activity
} from 'lucide-react';

function SimpleLineChart({ data }) {
  const width = 900;
  const height = 300;
  const padding = 40;

  const values = data.flatMap((item) => [item.inPatients, item.outPatients]);
  const maxValue = Math.max(...values, 10);

  const getX = (index) =>
    data.length === 1
      ? width / 2
      : padding + (index * (width - padding * 2)) / (data.length - 1);

  const getY = (value) =>
    height - padding - (value / maxValue) * (height - padding * 2);

  const inPoints = data
    .map((item, index) => `${getX(index)},${getY(item.inPatients)}`)
    .join(' ');
  const outPoints = data
    .map((item, index) => `${getX(index)},${getY(item.outPatients)}`)
    .join(' ');

  const areaPath = (key) => {
    const firstX = getX(0);
    const lastX = getX(data.length - 1);
    const points = data
      .map((item, index) => `${getX(index)},${getY(item[key])}`)
      .join(' L ');
    return `M ${firstX},${height - padding} L ${points} L ${lastX},${height - padding} Z`;
  };

  const ySteps = 5;
  const gridLines = Array.from({ length: ySteps + 1 }, (_, i) => {
    const value = Math.round((maxValue / ySteps) * i);
    const y = getY(value);
    return { value, y };
  });

  return (
    <div style={{ width: '100%' }}>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        style={{ width: '100%', height: '320px', display: 'block' }}
      >
        {gridLines.map((line, idx) => (
          <g key={idx}>
            <line
              x1={padding}
              y1={line.y}
              x2={width - padding}
              y2={line.y}
              stroke="rgba(148, 163, 184, 0.25)"
              strokeDasharray="4 4"
            />
            <text
              x={10}
              y={line.y + 4}
              fontSize="11"
              fill="#64748b"
              style={{ userSelect: 'none' }}
            >
              {line.value}
            </text>
          </g>
        ))}

        {data.map((item, index) => (
          <text
            key={item.day}
            x={getX(index)}
            y={height - 10}
            textAnchor="middle"
            fontSize="12"
            fill="#64748b"
            style={{ userSelect: 'none' }}
          >
            {item.day}
          </text>
        ))}

        <path d={areaPath('inPatients')} fill="rgba(79, 70, 229, 0.10)" />
        <path d={areaPath('outPatients')} fill="rgba(239, 68, 68, 0.08)" />

        <polyline
          fill="none"
          stroke="#4f46e5"
          strokeWidth="3"
          strokeLinejoin="round"
          strokeLinecap="round"
          points={inPoints}
        />
        <polyline
          fill="none"
          stroke="#ef4444"
          strokeWidth="3"
          strokeLinejoin="round"
          strokeLinecap="round"
          points={outPoints}
        />

        {data.map((item, index) => (
          <g key={`in-${index}`}>
            <circle
              cx={getX(index)}
              cy={getY(item.inPatients)}
              r="4"
              fill="#4f46e5"
            />
            <text
              x={getX(index)}
              y={getY(item.inPatients) - 10}
              textAnchor="middle"
              fontSize="11"
              fill="#4f46e5"
              fontWeight="700"
            >
              {item.inPatients}
            </text>
          </g>
        ))}

        {data.map((item, index) => (
          <g key={`out-${index}`}>
            <circle
              cx={getX(index)}
              cy={getY(item.outPatients)}
              r="4"
              fill="#ef4444"
            />
            <text
              x={getX(index)}
              y={getY(item.outPatients) + 18}
              textAnchor="middle"
              fontSize="11"
              fill="#ef4444"
              fontWeight="700"
            >
              {item.outPatients}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}

function SimpleBarChart({ data }) {
  const maxValue = Math.max(...data.map((item) => item.value), 100);

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(70px, 1fr))',
        gap: '14px',
        alignItems: 'end',
        height: '260px',
        paddingTop: '16px'
      }}
    >
      {data.map((item, index) => {
        const barHeight = (item.value / maxValue) * 1000;
        return (
          <div
            key={index}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'end',
              height: '100%'
            }}
          >
            <div
              style={{
                fontSize: '0.78rem',
                fontWeight: '700',
                marginBottom: '8px',
                color: 'var(--text-main)'
              }}
            >
              {item.value}
            </div>

            <div
              style={{
                width: '42px',
                height: `${barHeight}px`,
                borderRadius: '12px 12px 6px 6px',
                background: item.color,
                boxShadow: '0 10px 18px rgba(0,0,0,0.08)',
                transition: '0.3s ease'
              }}
            ></div>

            <div
              style={{
                marginTop: '10px',
                fontSize: '0.82rem',
                color: 'var(--text-muted)',
                fontWeight: '700'
              }}
            >
              {item.label}
            </div>
          </div>
        );
      })}
    </div>
  );
}

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
  const [loading, setLoading] = useState(true);

  const userRole = localStorage.getItem('userRole') || 'Receptionist';

  const loadUpcomingAppointments = () => {
    fetch((import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/api/appointments')
      .then((res) => res.json())
      .then((data) => {
        const now = new Date();

        const filteredAppointments = data
          .filter((a) => {
            if (a.status !== 'Scheduled') return false;
            if (!a.appointmentDate) return false;

            const appointmentDate = new Date(a.appointmentDate);
            return appointmentDate >= now;
          })
          .sort(
            (a, b) =>
              new Date(a.appointmentDate) - new Date(b.appointmentDate)
          )
          .slice(0, 5);

        setUpcomingAppointments(filteredAppointments);
      })
      .catch((err) => console.error('Appointments fetch error:', err));
  };

  useEffect(() => {
    Promise.all([
      fetch((import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/api/dashboard').then(res => res.json()),
      fetch((import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/api/patients').then(res => res.json())
    ])
      .then(([dashboardData, patientsData]) => {
        setStats(dashboardData);
        setRecentPatients(patientsData.slice(0, 5));
      })
      .catch((err) => console.error('Dashboard data fetch error:', err))
      .finally(() => setLoading(false));

    loadUpcomingAppointments();

    const interval = setInterval(() => {
      loadUpcomingAppointments();
    }, 60000);

    return () => clearInterval(interval);
  }, []);

 const weekData = useMemo(
  () => [
    { day: 'Mon', inPatients: 0, outPatients: 0 },
    { day: 'Tue', inPatients: 1, outPatients: 0 },
    { day: 'Wed', inPatients: 1, outPatients: 0 },
    { day: 'Thu', inPatients: 0, outPatients: 1 },
    { day: 'Fri', inPatients: 1, outPatients: 0 },
    { day: 'Sat', inPatients: 1, outPatients: 1 },
    { day: 'Sun', inPatients: 0, outPatients: 1 }
  ],
  []

  );

  const departmentData = useMemo(
  () => [
    { label: 'Cardio', value: 3, color: 'linear-gradient(180deg, #4f46e5, #6366f1)' },
    { label: 'Neuro', value: 2, color: 'linear-gradient(180deg, #06b6d4, #0891b2)' },
    { label: 'Ortho', value: 2, color: 'linear-gradient(180deg, #f59e0b, #d97706)' },
    { label: 'ENT', value: 2, color: 'linear-gradient(180deg, #10b981, #059669)' },
    { label: 'Dental', value: 2, color: 'linear-gradient(180deg, #ef4444, #dc2626)' },
    { label: 'Eye', value: 3, color: 'linear-gradient(180deg, #8b5cf6, #7c3aed)' }
  ],
  []
);

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', minHeight: '60vh', gap: '16px' }}>
        <div className="payment-spinner" style={{ borderColor: 'rgba(79, 70, 229, 0.2)', borderTopColor: 'var(--primary-color)' }}></div>
        <p style={{ color: 'var(--text-muted)', fontWeight: '500' }}>Fetching Live Data from Cloud...</p>
        <style>{`
          .payment-spinner {
            width: 50px;
            height: 50px;
            border: 4px solid;
            border-radius: 50%;
            animation: spin 1s linear infinite;
          }
          @keyframes spin { 100% { transform: rotate(360deg); } }
        `}</style>
      </div>
    );
  }

  const adminCards = [
    { label: 'Total Patients', value: stats.totalPatients, icon: <Users size={26} strokeWidth={2.5} />, color: 'var(--primary-color)', bg: 'var(--gradient-bg-1)' },
    { label: 'Active Doctors', value: stats.totalDoctors, icon: <UserPlus size={26} strokeWidth={2.5} />, color: '#10b981', bg: 'rgba(16, 185, 129, 0.1)' },
    { label: 'Appointments', value: stats.totalAppointments, icon: <Calendar size={26} strokeWidth={2.5} />, color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.1)' },
    { label: 'Total Revenue', value: `₹${stats.totalRevenue?.toLocaleString()}`, icon: <Receipt size={26} strokeWidth={2.5} />, color: '#ef4444', bg: 'rgba(239, 68, 68, 0.1)' }
  ];

  // Dummy logic for receptionist specific metrics if not in stats
  const receptionistCards = [
    { label: 'Today Appointments', value: stats.totalAppointments > 0 ? Math.ceil(stats.totalAppointments / 5) : 0, icon: <Clock size={26} strokeWidth={2.5} />, color: 'var(--primary-color)', bg: 'var(--gradient-bg-1)' },
    { label: 'Waiting Patients', value: stats.totalAppointments > 0 ? Math.floor(stats.totalAppointments / 10) : 0, icon: <Activity size={26} strokeWidth={2.5} />, color: '#ef4444', bg: 'rgba(239, 68, 68, 0.1)' },
    { label: 'New Registrations', value: stats.totalPatients > 0 ? Math.ceil(stats.totalPatients / 8) : 0, icon: <UserPlus size={26} strokeWidth={2.5} />, color: '#10b981', bg: 'rgba(16, 185, 129, 0.1)' },
    { label: 'Pending Bills', value: stats.pendingBillsCount, icon: <Receipt size={26} strokeWidth={2.5} />, color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.1)' }
  ];

  const cards = (userRole === 'Admin' || userRole === 'Hospital Admin') ? adminCards : receptionistCards;

  return (
    <div style={{ padding: '8px 16px' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '32px',
          flexWrap: 'wrap',
          gap: '16px'
        }}
      >
        <div>
          <h1
            style={{
              marginBottom: '4px',
              fontSize: '1.9rem',
              fontWeight: '900',
              letterSpacing: '-0.5px'
            }}
          >
            {(userRole === 'Admin' || userRole === 'Hospital Admin') ? 'Admin Dashboard' : 'Receptionist Dashboard'}
          </h1>
          <p
            style={{
              color: 'var(--text-muted)',
              fontSize: '0.95rem',
              fontWeight: '500'
            }}
          >
            Real-time overview of your healthcare facility
          </p>
        </div>

        <div
          style={{
            padding: '8px 16px',
            background: '#ecfdf5',
            color: '#059669',
            borderRadius: '30px',
            border: '1px solid #a7f3d0',
            fontWeight: '800',
            fontSize: '0.85rem',
            display: 'flex',
            gap: '8px',
            alignItems: 'center',
            boxShadow: '0 4px 10px rgba(16, 185, 129, 0.1)'
          }}
        >
          <div
            style={{
              width: '8px',
              height: '8px',
              background: '#10b981',
              borderRadius: '50%',
              animation: 'pulse 2s infinite'
            }}
          ></div>
          SYSTEM ONLINE
        </div>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '24px',
          marginBottom: '32px'
        }}
      >
        {cards.map((card, idx) => (
          <div
            key={idx}
            className="stat-card"
            style={{
              background: 'var(--card-bg)',
              padding: '24px',
              borderRadius: '16px',
              border: '1px solid var(--border-color)',
              boxShadow: '0 4px 6px rgba(0,0,0,0.02)',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
              overflow: 'hidden'
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start'
              }}
            >
              <div>
                <h3
                  style={{
                    color: 'var(--text-muted)',
                    fontSize: '0.85rem',
                    fontWeight: '700',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    margin: 0
                  }}
                >
                  {card.label}
                </h3>
                <p
                  style={{
                    fontSize: '2.5rem',
                    fontWeight: '800',
                    margin: '8px 0',
                    lineHeight: '1',
                    color: 'var(--text-main)',
                    letterSpacing: '-1px'
                  }}
                >
                  {card.value}
                </p>
              </div>
              <div
                style={{
                  padding: '14px',
                  background: card.bg,
                  borderRadius: '14px',
                  color: card.color
                }}
              >
                {card.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '24px',
          marginBottom: '32px'
        }}
      >
        <div
          style={{
            background: 'var(--card-bg)',
            border: '1px solid var(--border-color)',
            borderRadius: '16px',
            overflow: 'hidden',
            boxShadow: '0 4px 6px rgba(0,0,0,0.02)'
          }}
        >
          <div
            style={{
              padding: '24px',
              borderBottom: '1px solid var(--border-color)',
              background: 'var(--sidebar-bg)'
            }}
          >
            <h2
              style={{
                fontSize: '1.1rem',
                fontWeight: '800',
                margin: 0,
                color: 'var(--text-main)',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}
            >
              Weekly Patient Flow
            </h2>
            <p
              style={{
                margin: '8px 0 0 0',
                color: 'var(--text-muted)',
                fontSize: '0.9rem',
                fontWeight: '500'
              }}
            >
              In-patients and out-patients overview for the week
            </p>
          </div>

          <div style={{ padding: '20px 20px 10px 20px' }}>
            <div
              style={{
                display: 'flex',
                gap: '18px',
                alignItems: 'center',
                marginBottom: '8px',
                flexWrap: 'wrap'
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '0.88rem',
                  fontWeight: '700'
                }}
              >
                <span
                  style={{
                    width: '12px',
                    height: '12px',
                    borderRadius: '50%',
                    background: '#4f46e5',
                    display: 'inline-block'
                  }}
                ></span>
                In Patients
              </div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '0.88rem',
                  fontWeight: '700'
                }}
              >
                <span
                  style={{
                    width: '12px',
                    height: '12px',
                    borderRadius: '50%',
                    background: '#ef4444',
                    display: 'inline-block'
                  }}
                ></span>
                Out Patients
              </div>
            </div>

            <SimpleLineChart data={weekData} />
          </div>
        </div>

        <div
          style={{
            background: 'var(--card-bg)',
            border: '1px solid var(--border-color)',
            borderRadius: '16px',
            overflow: 'hidden',
            boxShadow: '0 4px 6px rgba(0,0,0,0.02)'
          }}
        >
          <div
            style={{
              padding: '24px',
              borderBottom: '1px solid var(--border-color)',
              background: 'var(--sidebar-bg)'
            }}
          >
            <h2
              style={{
                fontSize: '1.1rem',
                fontWeight: '800',
                margin: 0,
                color: 'var(--text-main)',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}
            >
              Department Visits
            </h2>
            <p
              style={{
                margin: '8px 0 0 0',
                color: 'var(--text-muted)',
                fontSize: '0.9rem',
                fontWeight: '500'
              }}
            >
              Today's patient load by department
            </p>
          </div>

          <div style={{ padding: '20px' }}>
            <SimpleBarChart data={departmentData} />
          </div>
        </div>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
          gap: '24px'
        }}
      >
        <div
          style={{
            background: 'var(--card-bg)',
            border: '1px solid var(--border-color)',
            borderRadius: '16px',
            overflow: 'hidden',
            boxShadow: '0 4px 6px rgba(0,0,0,0.02)'
          }}
        >
          <div
            style={{
              padding: '24px',
              borderBottom: '1px solid var(--border-color)',
              background: 'var(--sidebar-bg)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <h2
              style={{
                fontSize: '1.1rem',
                fontWeight: '800',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                margin: 0,
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                color: 'var(--text-main)'
              }}
            >
              <Clock size={20} color="var(--primary-color)" />
              Recent Admissions
            </h2>
            <span
              style={{
                fontSize: '0.85rem',
                color: 'var(--primary-color)',
                fontWeight: '700',
                cursor: 'pointer'
              }}
            >
              View All
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {recentPatients.length === 0 ? (
              <p style={{ color: 'var(--text-muted)', padding: '24px' }}>
                No recent patients.
              </p>
            ) : (
              recentPatients.map((p, idx) => (
                <div
                  key={p.id}
                  className="row-hover"
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '16px 24px',
                    borderBottom:
                      idx !== recentPatients.length - 1
                        ? '1px solid var(--border-color)'
                        : 'none',
                    cursor: 'pointer'
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '16px'
                    }}
                  >
                    <div
                      style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        background: 'var(--gradient-bg-1)',
                        color: 'var(--primary-color)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: '800',
                        fontSize: '1.1rem'
                      }}
                    >
                      {p.name?.charAt(0) || 'P'}
                    </div>
                    <div>
                      <p
                        style={{
                          fontWeight: '700',
                          margin: 0,
                          color: 'var(--text-main)',
                          fontSize: '1rem'
                        }}
                      >
                        {p.name}
                      </p>
                      <p
                        style={{
                          fontSize: '0.85rem',
                          color: 'var(--text-muted)',
                          margin: '4px 0 0 0',
                          fontWeight: '500'
                        }}
                      >
                        PID-{String(p.id).padStart(4, '0')} • {p.gender}
                      </p>
                    </div>
                  </div>

                  <div
                    style={{
                      fontSize: '0.85rem',
                      color: 'var(--text-main)',
                      fontWeight: '600'
                    }}
                  >
                    {p.createdAt
                      ? new Date(p.createdAt).toLocaleDateString('en-GB')
                      : '-'}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div
          style={{
            background: 'var(--card-bg)',
            border: '1px solid var(--border-color)',
            borderRadius: '16px',
            overflow: 'hidden',
            boxShadow: '0 4px 6px rgba(0,0,0,0.02)'
          }}
        >
          <div
            style={{
              padding: '24px',
              borderBottom: '1px solid var(--border-color)',
              background: 'var(--sidebar-bg)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <h2
              style={{
                fontSize: '1.1rem',
                fontWeight: '800',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                margin: 0,
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                color: 'var(--text-main)'
              }}
            >
              <AlertCircle size={20} color="#f59e0b" />
              Upcoming Appointments
            </h2>
            <span
              style={{
                fontSize: '0.85rem',
                color: 'var(--primary-color)',
                fontWeight: '700',
                cursor: 'pointer'
              }}
            >
              Manage
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {upcomingAppointments.length === 0 ? (
              <p style={{ color: 'var(--text-muted)', padding: '24px' }}>
                No upcoming appointments.
              </p>
            ) : (
              upcomingAppointments.map((a, idx) => (
                <div
                  key={a.id}
                  className="row-hover"
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '16px 24px',
                    borderBottom:
                      idx !== upcomingAppointments.length - 1
                        ? '1px solid var(--border-color)'
                        : 'none',
                    cursor: 'pointer'
                  }}
                >
                  <div>
                    <p
                      style={{
                        fontWeight: '700',
                        margin: 0,
                        color: 'var(--text-main)',
                        fontSize: '1rem'
                      }}
                    >
                      {a.patient?.name || 'Unknown Patient'}
                    </p>
                    <p
                      style={{
                        fontSize: '0.85rem',
                        color: 'var(--text-muted)',
                        margin: '4px 0 0 0',
                        fontWeight: '500'
                      }}
                    >
                      Dr. {a.doctor?.name || 'Unknown'} (
                      {a.doctor?.specialty || 'General'})
                    </p>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <span
                      style={{
                        fontSize: '0.8rem',
                        fontWeight: '800',
                        padding: '6px 10px',
                        borderRadius: '6px',
                        background: '#fef3c7',
                        color: '#b45309',
                        border: '1px solid #fde68a'
                      }}
                    >
                      {a.appointmentDate
                        ? new Date(a.appointmentDate).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit'
                          })
                        : '--:--'}
                    </span>
                    <p
                      style={{
                        fontSize: '0.8rem',
                        color: 'var(--text-muted)',
                        margin: '8px 0 0 0',
                        fontWeight: '600'
                      }}
                    >
                      {a.appointmentDate
                        ? new Date(a.appointmentDate).toLocaleDateString('en-GB')
                        : '-'}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <style>{`
        .row-hover {
          transition: all 0.2s ease;
        }

        .row-hover:hover {
          background: rgba(0, 0, 0, 0.03);
          padding-left: 28px !important;
        }

        .dark .row-hover:hover {
          background: rgba(255, 255, 255, 0.05);
        }

        @keyframes pulse {
          0% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.2);
            opacity: 0.7;
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}
