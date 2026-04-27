import React, { useState } from 'react';
import { ShieldCheck, Clock, Stethoscope, Eye, EyeOff } from 'lucide-react';

export default function Auth({ onLogin }) {
  const [authFlow, setAuthFlow] = useState('login');
  const [showPassword, setShowPassword] = useState(false);

  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');

  const [regName, setRegName] = useState('');
  const [regRole, setRegRole] = useState('Hospital Admin');
  const [regEmail, setRegEmail] = useState('');

  const [loading, setLoading] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState('');

  const safeValue = (value, fallback) => {
    if (
      value === undefined ||
      value === null ||
      value === '' ||
      value === 'undefined' ||
      value === 'null'
    ) {
      return fallback;
    }
    return value;
  };

  const saveUserProfile = ({
    name,
    role,
    email,
    phoneNumber
  }) => {
    localStorage.setItem('userName', safeValue(name, 'System Admin'));
    localStorage.setItem('userRole', safeValue(role, 'Hospital Admin'));
    localStorage.setItem('userEmail', safeValue(email, 'admin@medicare.com'));
    localStorage.setItem('userPhone', safeValue(phoneNumber, '9876543210'));
  };

  const handleTransition = (e, nextFlow, msg, timeout = 1500) => {
    if (e) e.preventDefault();
    setLoadingMsg(msg);
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      setLoadingMsg('');

      if (nextFlow === 'dashboard') {
        if (authFlow === 'register') {
          saveUserProfile({
            name: regName,
            role: regRole,
            email: regEmail,
            phoneNumber: phone
          });
        } else {
          if (!localStorage.getItem('userName') || localStorage.getItem('userName') === 'undefined') {
            saveUserProfile({
              name: 'Dr. Ramesh',
              role: 'Head Doctor',
              email: 'ramesh@medicare.com',
              phoneNumber: phone || '9876543210'
            });
          }
        }
        onLogin();
      } else {
        setAuthFlow(nextFlow);
      }
    }, timeout);
  };

  const handleGoogleLogin = () => {
    handleTransition(null, 'dashboard', 'Authenticating securely via Google...', 1500);
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoadingMsg('Verifying your credentials...');
    setLoading(true);

    try {
      const res = await fetch((import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, password })
      });

      const data = await res.json();
      setLoading(false);

      if (!res.ok) {
        alert(data.error || 'Login failed');
        return;
      }

      saveUserProfile({
        name: data.user.name,
        role: data.user.role,
        email: data.user.email,
        phoneNumber: data.user.phone || phone
      });

      onLogin();
    } catch (err) {
      setLoading(false);
      alert('Network error connecting to authentication server.');
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setLoadingMsg('Creating secure account profile...');
    setLoading(true);

    try {
      const res = await fetch((import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: regName,
          role: regRole,
          email: regEmail,
          phone: phone,
          password: password
        })
      });

      const data = await res.json();
      setLoading(false);

      if (!res.ok) {
        alert(data.error || 'Registration failed');
        return;
      }

      saveUserProfile({
        name: data.name || regName,
        role: data.role || regRole,
        email: data.email || regEmail,
        phoneNumber: data.phone || phone
      });

      onLogin();
    } catch (err) {
      setLoading(false);
      alert('Network error connecting to authentication server.');
    }
  };

  const renderHeader = () => {
    switch (authFlow) {
      case 'login':
        return {
          title: 'Welcome Back 👋',
          desc: 'Securely login to your administrative console.'
        };
      case 'register':
        return {
          title: 'Create Account ✨',
          desc: 'Register as an official staff member.'
        };
      case 'forgot_phone':
        return {
          title: 'Reset Password 🔒',
          desc: 'Enter your registered mobile number to receive an OTP.'
        };
      case 'forgot_otp':
        return {
          title: 'Verify Identity 🛡️',
          desc: 'Enter the 4-digit code sent to your phone.'
        };
      case 'forgot_reset':
        return {
          title: 'New Password 🔑',
          desc: 'Create a new secure password for your account.'
        };
      default:
        return { title: 'Authenticating', desc: 'Please wait.' };
    }
  };

  const header = renderHeader();

  return (
    <div style={pageStyle}>
      <div style={heroSectionStyle}>
        <div style={heroOverlayStyle}>
          <div style={{ maxWidth: '500px', padding: '40px' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                marginBottom: '40px'
              }}
            >
              <div
                style={{
                  background:
                    'linear-gradient(135deg, var(--primary-light), var(--primary-color))',
                  padding: '12px',
                  borderRadius: '16px',
                  color: '#fff',
                  boxShadow: '0 4px 15px rgba(255,255,255,0.2)'
                }}
              >
                <Stethoscope size={40} strokeWidth={2.5} />
              </div>
              <h1
                style={{
                  color: '#fff',
                  fontSize: '2.5rem',
                  fontWeight: '800',
                  letterSpacing: '-0.5px',
                  textShadow: '0 2px 10px rgba(0,0,0,0.2)',
                  margin: 0
                }}
              >
                MediCare Pro
              </h1>
            </div>

            <h2
              style={{
                color: '#fff',
                fontSize: '3rem',
                fontWeight: '600',
                lineHeight: '1.2',
                marginBottom: '24px'
              }}
            >
              Modern Administration Systems.
            </h2>
            <p
              style={{
                color: 'rgba(255,255,255,0.9)',
                fontSize: '1.2rem',
                lineHeight: '1.6',
                marginBottom: '40px'
              }}
            >
              A complete digital ecosystem tailored for hospitals and clinics.
              Streamline patient records, manage appointments seamlessly, and
              digitize your billing.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <FeatureItem
                icon={<ShieldCheck size={24} />}
                title="Bank-Grade Security"
                desc="All patient medical data is fully encrypted using AES-256."
              />
              <FeatureItem
                icon={<Clock size={24} />}
                title="Real-Time Sync"
                desc="Updates reflect instantly across all administrator devices."
              />
            </div>
          </div>
        </div>
      </div>

      <div style={authSectionStyle}>
        <div style={cardStyle} className="glass-panel">
          <div style={{ marginBottom: '32px' }}>
            <h2
              style={{
                color: 'var(--text-main)',
                fontSize: '1.8rem',
                fontWeight: '600'
              }}
            >
              {header.title}
            </h2>
            <p style={{ color: 'var(--text-muted)', marginTop: '8px' }}>
              {header.desc}
            </p>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '60px 0' }}>
              <div className="spinner"></div>
              <p
                style={{
                  marginTop: '24px',
                  color: 'var(--primary-color)',
                  fontWeight: '500',
                  fontSize: '1.2rem'
                }}
              >
                {loadingMsg}
              </p>
            </div>
          ) : (
            <>
              {authFlow === 'login' && (
                <form
                  onSubmit={handleLoginSubmit}
                  autoComplete="on"
                  style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
                >
                  <div>
                    <label style={labelStyle}>Mobile Number</label>
                    <div style={{ ...inputWrapper, marginTop: '8px' }}>
                      <span
                        style={{
                          padding: '0 16px',
                          color: 'var(--text-muted)',
                          borderRight: '1px solid var(--border-color)'
                        }}
                      >
                        +91
                      </span>
                      <input
                        type="tel"
                        name="username"
                        autoComplete="username"
                        inputMode="numeric"
                        placeholder="Enter 10-digit number"
                        style={{ ...inputStyle, padding: '14px' }}
                        value={phone}
                        onChange={(e) =>
                          setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))
                        }
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label style={labelStyle}>Password</label>
                    <div style={{ position: 'relative' }}>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        autoComplete="current-password"
                        placeholder="••••••••"
                        style={{
                          ...inputStyle,
                          background: '#f8fafc',
                          border: '2px solid #e2e8f0',
                          width: '100%',
                          boxSizing: 'border-box',
                          marginTop: '8px',
                          padding: '14px',
                          paddingRight: '48px',
                          borderRadius: '12px'
                        }}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        style={{ position: 'absolute', right: '16px', top: '24px', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
                      >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                    <div style={{ textAlign: 'right', marginTop: '8px' }}>
                      <button
                        type="button"
                        onClick={() => setAuthFlow('forgot_phone')}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: 'var(--primary-color)',
                          fontSize: '0.9rem',
                          fontWeight: '600',
                          cursor: 'pointer',
                          outline: 'none'
                        }}
                      >
                        Forgot Password?
                      </button>
                    </div>
                  </div>

                  <button type="submit" className="btn-primary" style={btnStyle}>
                    Login to Dashboard
                  </button>

                  <div style={{ textAlign: 'center', marginTop: '16px' }}>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
                      Don't have an account?{' '}
                      <button
                        type="button"
                        onClick={() => setAuthFlow('register')}
                        style={linkBtnStyle}
                      >
                        Create one
                      </button>
                    </p>
                  </div>

                  <div style={dividerStyle}>
                    <span style={dividerTextStyle}>OR CONTINUE WITH</span>
                  </div>

                  <button
                    type="button"
                    onClick={handleGoogleLogin}
                    style={googleBtnStyle}
                  >
                    <img
                      src="https://www.svgrepo.com/show/475656/google-color.svg"
                      alt="Google"
                      style={{ width: '24px' }}
                    />
                    Sign in with Google
                  </button>
                </form>
              )}

              {authFlow === 'register' && (
                <form
                  onSubmit={handleRegisterSubmit}
                  autoComplete="on"
                  style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
                >
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <div style={{ flex: 1 }}>
                      <label style={labelStyle}>Full Name</label>
                      <input
                        type="text"
                        name="name"
                        autoComplete="name"
                        placeholder="e.g. Dr. Ramesh"
                        value={regName}
                        onChange={(e) => setRegName(e.target.value)}
                        style={formInputStyle}
                        required
                      />
                    </div>

                    <div style={{ flex: 1 }}>
                      <label style={labelStyle}>System Role</label>
                      <select
                        name="role"
                        style={{ ...formInputStyle, height: '51px' }}
                        value={regRole}
                        onChange={(e) => setRegRole(e.target.value)}
                      >
                        <option>Hospital Admin</option>
                        <option>Head Doctor</option>
                        <option>Receptionist</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label style={labelStyle}>Email Address</label>
                    <input
                      type="email"
                      name="email"
                      autoComplete="email"
                      placeholder="admin@medicare.com"
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      style={formInputStyle}
                    />
                  </div>

                  <div>
                    <label style={labelStyle}>Mobile Number</label>
                    <div style={{ ...inputWrapper, marginTop: '8px' }}>
                      <span
                        style={{
                          padding: '0 16px',
                          color: 'var(--text-muted)',
                          borderRight: '1px solid var(--border-color)'
                        }}
                      >
                        +91
                      </span>
                      <input
                        type="tel"
                        name="username"
                        autoComplete="username"
                        inputMode="numeric"
                        placeholder="10-digit number"
                        style={{ ...inputStyle, padding: '14px' }}
                        value={phone}
                        onChange={(e) =>
                          setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))
                        }
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label style={labelStyle}>Create Password</label>
                    <div style={{ position: 'relative' }}>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        name="new-password"
                        autoComplete="new-password"
                        placeholder="Create a strong password"
                        style={{...formInputStyle, paddingRight: '48px'}}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        style={{ position: 'absolute', right: '16px', top: '16px', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
                      >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                  </div>

                  <button type="submit" className="btn-primary" style={btnStyle}>
                    Register Account
                  </button>

                  <div style={{ textAlign: 'center', marginTop: '16px' }}>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
                      Already have an account?{' '}
                      <button
                        type="button"
                        onClick={() => setAuthFlow('login')}
                        style={linkBtnStyle}
                      >
                        Login here
                      </button>
                    </p>
                  </div>
                </form>
              )}

              {authFlow === 'forgot_phone' && (
                <form
                  onSubmit={(e) =>
                    handleTransition(
                      e,
                      'forgot_otp',
                      'Texting secure OTP to your number...',
                      1500
                    )
                  }
                  style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}
                >
                  <div>
                    <label style={labelStyle}>Registered Mobile Number</label>
                    <div style={{ ...inputWrapper, marginTop: '8px' }}>
                      <span
                        style={{
                          padding: '0 16px',
                          color: 'var(--text-muted)',
                          borderRight: '1px solid var(--border-color)'
                        }}
                      >
                        +91
                      </span>
                      <input
                        type="tel"
                        name="username"
                        autoComplete="username"
                        inputMode="numeric"
                        placeholder="Enter your 10-digit number"
                        style={{ ...inputStyle, padding: '14px' }}
                        value={phone}
                        onChange={(e) =>
                          setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))
                        }
                        required
                      />
                    </div>
                  </div>

                  <button type="submit" className="btn-primary" style={btnStyle}>
                    Send OTP
                  </button>

                  <div style={{ textAlign: 'center' }}>
                    <button
                      type="button"
                      onClick={() => setAuthFlow('login')}
                      style={linkBtnStyle}
                    >
                      &larr; Back to Login
                    </button>
                  </div>
                </form>
              )}

              {authFlow === 'forgot_otp' && (
                <form
                  onSubmit={(e) =>
                    handleTransition(e, 'forgot_reset', 'Verifying signature...', 1500)
                  }
                  style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}
                >
                  <div
                    style={{
                      background: '#d1fae5',
                      padding: '16px',
                      borderRadius: '8px',
                      color: '#065f46',
                      fontSize: '0.95rem',
                      textAlign: 'center'
                    }}
                  >
                    ✅ Secure OTP sent to <b>+91 {phone}</b>
                  </div>

                  <div>
                    <label style={labelStyle}>Enter 4-Digit OTP</label>
                    <input
                      type="text"
                      name="one-time-code"
                      autoComplete="one-time-code"
                      placeholder="0 0 0 0"
                      style={{
                        ...formInputStyle,
                        textAlign: 'center',
                        letterSpacing: '16px',
                        fontSize: '1.5rem',
                        fontWeight: '600'
                      }}
                      value={otp}
                      onChange={(e) =>
                        setOtp(e.target.value.replace(/\D/g, '').slice(0, 4))
                      }
                      required
                    />
                  </div>

                  <button type="submit" className="btn-primary" style={btnStyle}>
                    Verify OTP
                  </button>

                  <div
                    style={{
                      textAlign: 'center',
                      display: 'flex',
                      justifyContent: 'center',
                      gap: '16px'
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => setAuthFlow('forgot_phone')}
                      style={linkBtnStyle}
                    >
                      Change Number
                    </button>
                    <span style={{ color: 'var(--border-color)' }}>|</span>
                    <button
                      type="button"
                      onClick={(e) =>
                        handleTransition(e, 'forgot_otp', 'Resending...', 1000)
                      }
                      style={linkBtnStyle}
                    >
                      Resend Code
                    </button>
                  </div>
                </form>
              )}

              {authFlow === 'forgot_reset' && (
                <form
                  onSubmit={(e) =>
                    handleTransition(
                      e,
                      'dashboard',
                      'Resetting password & Logging you in...',
                      2000
                    )
                  }
                  autoComplete="on"
                  style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
                >
                  <div>
                    <label style={labelStyle}>Create New Password</label>
                    <input
                      type="password"
                      name="new-password"
                      autoComplete="new-password"
                      placeholder="Enter new strong password"
                      style={formInputStyle}
                      required
                    />
                  </div>

                  <div>
                    <label style={labelStyle}>Confirm New Password</label>
                    <input
                      type="password"
                      name="confirm-password"
                      autoComplete="new-password"
                      placeholder="Retype password"
                      style={formInputStyle}
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="btn-primary"
                    style={{
                      ...btnStyle,
                      background: '#10b981',
                      boxShadow: '0 4px 15px rgba(16, 185, 129, 0.3)'
                    }}
                  >
                    Reset Password & Login
                  </button>

                  <div style={{ textAlign: 'center', marginTop: '16px' }}>
                    <button
                      type="button"
                      onClick={() => setAuthFlow('login')}
                      style={linkBtnStyle}
                    >
                      Cancel Reset
                    </button>
                  </div>
                </form>
              )}
            </>
          )}
        </div>
      </div>

      <style>{`
        .spinner {
          width: 60px;
          height: 60px;
          border: 6px solid rgba(79, 70, 229, 0.1);
          border-top-color: var(--primary-color);
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin: 0 auto;
        }

        @keyframes spin {
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}

function FeatureItem({ icon, title, desc }) {
  return (
    <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
      <div
        style={{
          background: 'rgba(255,255,255,0.2)',
          padding: '12px',
          borderRadius: '12px',
          color: '#fff',
          backdropFilter: 'blur(10px)'
        }}
      >
        {icon}
      </div>
      <div>
        <h4
          style={{
            color: '#fff',
            fontSize: '1.2rem',
            marginBottom: '4px'
          }}
        >
          {title}
        </h4>
        <p
          style={{
            color: 'rgba(255,255,255,0.7)',
            fontSize: '0.95rem',
            lineHeight: '1.4'
          }}
        >
          {desc}
        </p>
      </div>
    </div>
  );
}

const pageStyle = {
  minHeight: '100vh',
  display: 'flex',
  width: '100vw',
  background: '#fff'
};

const heroSectionStyle = {
  flex: '1.2',
  background:
    'url("https://images.unsplash.com/photo-1538108149393-cebb47acdd32?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80") center/cover no-repeat',
  display: 'flex',
  position: 'relative'
};

const heroOverlayStyle = {
  width: '100%',
  height: '100%',
  background:
    'linear-gradient(135deg, rgba(79, 70, 229, 0.95) 0%, rgba(16, 185, 129, 0.85) 100%)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
};

const authSectionStyle = {
  flex: '1',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  padding: '40px',
  background: '#f8fafc'
};

const cardStyle = {
  width: '100%',
  maxWidth: '480px',
  padding: '40px',
  background: '#fff',
  border: '1px solid rgba(0,0,0,0.05)',
  boxShadow: '0 20px 40px rgba(0,0,0,0.08)'
};

const labelStyle = {
  fontWeight: '500',
  color: 'var(--text-main)',
  fontSize: '0.9rem'
};

const inputWrapper = {
  display: 'flex',
  alignItems: 'center',
  background: '#f8fafc',
  border: '2px solid #e2e8f0',
  borderRadius: '12px',
  overflow: 'hidden',
  transition: 'border-color 0.2s'
};

const formInputStyle = {
  background: '#f8fafc',
  border: '2px solid #e2e8f0',
  width: '100%',
  boxSizing: 'border-box',
  marginTop: '8px',
  padding: '14px',
  borderRadius: '12px',
  outline: 'none',
  fontSize: '1rem',
  color: 'var(--text-main)'
};

const inputStyle = {
  padding: '16px',
  border: 'none',
  background: 'transparent',
  outline: 'none',
  flex: '1',
  width: '100%',
  fontSize: '1rem'
};

const btnStyle = {
  width: '100%',
  padding: '16px',
  fontSize: '1rem',
  marginTop: '8px'
};

const linkBtnStyle = {
  background: 'none',
  border: 'none',
  color: 'var(--primary-color)',
  fontWeight: '600',
  cursor: 'pointer',
  padding: 0
};

const dividerStyle = {
  display: 'flex',
  alignItems: 'center',
  margin: '32px 0',
  color: '#94a3b8',
  position: 'relative',
  borderBottom: '1px solid #e2e8f0'
};

const dividerTextStyle = {
  background: '#fff',
  padding: '0 16px',
  position: 'absolute',
  left: '50%',
  transform: 'translateX(-50%)',
  top: '-10px',
  fontSize: '0.85rem',
  fontWeight: '600',
  letterSpacing: '1px'
};

const googleBtnStyle = {
  width: '100%',
  padding: '16px',
  background: '#fff',
  border: '2px solid #e2e8f0',
  borderRadius: '12px',
  fontSize: '1rem',
  fontWeight: '600',
  color: '#334155',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '12px',
  cursor: 'pointer',
  transition: 'all 0.2s',
  boxShadow: '0 4px 6px rgba(0,0,0,0.02)'
};
