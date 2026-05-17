import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Stethoscope, ChevronRight, ChevronUp, BrainCircuit, LineChart, Pill, Network, Phone, LifeBuoy } from 'lucide-react';

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#f8fafc', fontFamily: '"Inter", sans-serif' }}>
      
      {/* Navbar - Two Tier Enterprise Structure (Number 4) */}
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, background: '#fff', boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}>
        {/* Top Info Belt */}
        <div className="landing-top-belt" style={{ background: '#0f172a', color: '#cbd5e1', padding: '10px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem', fontWeight: '600' }}>
          <div style={{ display: 'flex', gap: '24px' }}>
             <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#fff' }}><Phone size={14} /> +1 (800) MED-CARE</span>
             <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><LifeBuoy size={14} /> 24/7 Support</span>
          </div>
          <div style={{ display: 'flex', gap: '24px' }}>
             <a href="#" style={{ color: '#cbd5e1', textDecoration: 'none', transition: 'color 0.2s' }} onMouseOver={(e) => e.target.style.color = '#fff'} onMouseOut={(e) => e.target.style.color = '#cbd5e1'}>Patient Portal</a>
             <a href="#" style={{ color: '#cbd5e1', textDecoration: 'none', transition: 'color 0.2s' }} onMouseOver={(e) => e.target.style.color = '#fff'} onMouseOut={(e) => e.target.style.color = '#cbd5e1'}>Careers</a>
             <a href="#" style={{ color: '#cbd5e1', textDecoration: 'none', transition: 'color 0.2s' }} onMouseOver={(e) => e.target.style.color = '#fff'} onMouseOut={(e) => e.target.style.color = '#cbd5e1'}>Investor Relations</a>
          </div>
        </div>
        
        {/* Main Navigation Belt */}
        <nav className="landing-nav" style={{ padding: '0 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '80px' }}>
          <div className="landing-nav-logo" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Stethoscope size={36} color="var(--primary-color)" />
            <span style={{ fontSize: '1.9rem', fontWeight: '900', color: '#0f172a', letterSpacing: '-0.5px' }}>MediCare<span style={{ color: 'var(--primary-color)' }}>Pro</span></span>
          </div>
          
          <div className="landing-nav-links" style={{ display: 'flex', gap: '40px', alignItems: 'center' }}>
            <a href="#segments" style={{ color: '#1e293b', textDecoration: 'none', fontWeight: '800', fontSize: '1.05rem', transition: 'color 0.2s' }} onMouseOver={(e) => e.target.style.color = 'var(--primary-color)'} onMouseOut={(e) => e.target.style.color = '#1e293b'}>Solutions</a>
            <a href="#success" style={{ color: '#1e293b', textDecoration: 'none', fontWeight: '800', fontSize: '1.05rem', transition: 'color 0.2s' }} onMouseOver={(e) => e.target.style.color = 'var(--primary-color)'} onMouseOut={(e) => e.target.style.color = '#1e293b'}>Impact</a>
            <a href="#insights" style={{ color: '#1e293b', textDecoration: 'none', fontWeight: '800', fontSize: '1.05rem', transition: 'color 0.2s' }} onMouseOver={(e) => e.target.style.color = 'var(--primary-color)'} onMouseOut={(e) => e.target.style.color = '#1e293b'}>Insights</a>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <button 
                className="landing-login-btn"
                onClick={() => navigate('/auth')} 
                style={{ padding: '14px 34px', background: 'var(--primary-color)', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: '800', fontSize: '1.05rem', cursor: 'pointer', transition: 'background 0.3s', display: 'flex', alignItems: 'center', gap: '8px' }}
                onMouseOver={(e) => e.currentTarget.style.background = '#3730a3'}
                onMouseOut={(e) => e.currentTarget.style.background = 'var(--primary-color)'}
            >
                CLIENT LOGIN <ChevronRight size={18} />
            </button>
          </div>
        </nav>
      </div>

      {/* Hero Section */}
      <section className="landing-hero" style={{ 
        position: 'relative', 
        padding: '160px 40px 100px 40px', 
        minHeight: '85vh', 
        display: 'flex', 
        alignItems: 'center', 
        backgroundImage: 'linear-gradient(rgba(15, 23, 42, 0.6), rgba(15, 23, 42, 0.8)), url(https://images.pexels.com/photos/40568/medical-appointment-doctor-healthcare-40568.jpeg?auto=compress&cs=tinysrgb&w=1920)', 
        backgroundSize: 'cover', 
        backgroundPosition: 'center', 
        backgroundAttachment: 'scroll' 
      }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', width: '100%', position: 'relative', zIndex: 10 }}>
          <div className="landing-hero-box" style={{ 
            background: 'rgba(15, 23, 42, 0.4)', 
            backdropFilter: 'blur(20px)', 
            WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.1)', 
            padding: '60px', 
            borderRadius: '16px', 
            maxWidth: '750px',
            boxShadow: '0 25px 50px rgba(0,0,0,0.3)'
          }}>
            <h1 className="landing-hero-title" style={{ fontSize: '4.5rem', fontWeight: '800', color: '#ffffff', lineHeight: '1.15', marginBottom: '32px', letterSpacing: '-1px' }}>
              Unite teams. <br/>Simplify workflows.<br/><span style={{ color: 'var(--primary-color)' }}>Improve outcomes.</span>
            </h1>
            <p style={{ fontSize: '1.25rem', color: '#e2e8f0', lineHeight: '1.7', marginBottom: '40px' }}>
              MediCare Pro empowers healthcare teams by unifying staff, streamlining administration workflows, and ensuring critical patient data is always within secure reach. Explore exactly how we digitize hospitals.
            </p>
            <div style={{ display: 'flex', gap: '16px' }}>
              <button 
                onClick={() => document.getElementById('segments').scrollIntoView({ behavior: 'smooth' })} 
                style={{ padding: '16px 36px', fontSize: '1.1rem', background: 'var(--primary-color)', color: 'white', border: 'none', borderRadius: '30px', fontWeight: '700', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '8px', transition: 'background 0.3s' }}
              >
                Explore Solutions <ChevronRight size={20} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 1. SEGVEMENTS WE SERVE */}
      <section id="segments" className="landing-section" style={{ padding: '100px 40px', background: '#e5e7eb' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <h2 className="landing-section-title" style={{ fontSize: '3rem', fontWeight: '800', color: '#000', marginBottom: '60px', textAlign: 'center', letterSpacing: '-1px' }}>Learn More About the Segments We Serve</h2>
          
          <div style={{ display: 'flex', gap: '40px', flexWrap: 'wrap', justifyContent: 'center' }}>
            <div style={{ flex: '1', minWidth: '350px', maxWidth: '500px' }}>
              <img src="https://images.pexels.com/photos/4173251/pexels-photo-4173251.jpeg?auto=compress&cs=tinysrgb&w=800" alt="Hospitals" style={{ width: '100%', height: '280px', objectFit: 'cover', borderRadius: '16px', marginBottom: '24px' }} />
              <h3 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#000', marginBottom: '16px', letterSpacing: '-0.5px' }}>Hospitals and Health Systems</h3>
              <p style={{ fontSize: '1.1rem', color: '#111', lineHeight: '1.6', marginBottom: '24px', fontWeight: '500' }}>
                Streamline operations with technology that optimises workflows—from registration and asset tracking to point of care and patient experience. With connected teams and real-time data, healthcare providers can deliver safer, compassionate care.
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#0055b8', fontWeight: '800', cursor: 'pointer', fontSize: '1.1rem' }}>Explore <ChevronRight size={20} /></div>
            </div>

            <div style={{ flex: '1', minWidth: '350px', maxWidth: '500px' }}>
              <img src="https://images.pexels.com/photos/3845126/pexels-photo-3845126.jpeg?auto=compress&cs=tinysrgb&w=800" alt="Digital Management" style={{ width: '100%', height: '280px', objectFit: 'cover', borderRadius: '16px', marginBottom: '24px' }} />
              <h3 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#000', marginBottom: '16px', letterSpacing: '-0.5px' }}>Digital Patient Management</h3>
              <p style={{ fontSize: '1.1rem', color: '#111', lineHeight: '1.6', marginBottom: '24px', fontWeight: '500' }}>
                Our EHR system securely indexes demographic data, enabling reception staff to flawlessly book and allocate time slots without reliance on complex paper trails. Eliminate wait times and guarantee precision.
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#0055b8', fontWeight: '800', cursor: 'pointer', fontSize: '1.1rem' }}>Explore <ChevronRight size={20} /></div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. SUCCESS STORIES */}
      <section id="success" className="landing-section" style={{ padding: '120px 40px', background: '#f8f9fa' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <h2 className="landing-section-title" style={{ fontSize: '3rem', fontWeight: '800', color: '#000', marginBottom: '60px', textAlign: 'center', letterSpacing: '-1px' }}>Featured Customer Success Stories</h2>
          
          <div className="landing-success-box" style={{ display: 'flex', gap: '0', flexWrap: 'wrap', alignItems: 'center', background: '#fff', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 20px 50px rgba(0,0,0,0.06)' }}>
            <div className="landing-success-img-container" style={{ flex: 1.2, minWidth: '400px' }}>
               <img className="landing-success-img" src="https://images.pexels.com/photos/4386476/pexels-photo-4386476.jpeg?auto=compress&cs=tinysrgb&w=800" alt="Success Story" style={{ width: '100%', height: '100%', minHeight: '500px', objectFit: 'cover' }} />
            </div>
            <div className="landing-success-content" style={{ flex: 1, minWidth: '400px', padding: '60px' }}>
              <div style={{ fontSize: '0.9rem', fontWeight: '700', color: '#666', letterSpacing: '1px', marginBottom: '16px', textTransform: 'uppercase' }}>Success Story</div>
              <h2 style={{ fontSize: '2.5rem', fontWeight: '800', color: '#000', marginBottom: '24px', lineHeight: '1.1', letterSpacing: '-0.5px' }}>Clínica de las Américas Utilizes Medicare's Automated Solutions to Ensure Patient Safety and Care</h2>
              <p style={{ fontSize: '1.1rem', color: '#333', lineHeight: '1.7', marginBottom: '40px' }}>
                Clínica de las Américas is a leading healthcare provider in Bolivia with a broad clinical infrastructure, including six operating rooms and 28 consultation rooms. Employing 350 professionals, the center serves around 200 patients daily.
              </p>
              <button 
                style={{ padding: '14px 32px', background: '#000', color: '#fff', border: 'none', borderRadius: '30px', fontWeight: '700', fontSize: '1.1rem', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '12px' }}
              >
                Learn More <ChevronRight size={20} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 3. ADDITIONAL INSIGHTS */}
      <section id="insights" className="landing-section" style={{ padding: '100px 40px', background: '#e5e7eb' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <h2 className="landing-section-title" style={{ fontSize: '3rem', fontWeight: '800', color: '#000', marginBottom: '60px', textAlign: 'center', letterSpacing: '-1px' }}>Explore Additional Healthcare Insights</h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px' }}>
             
             <div style={{ background: '#fff', borderRadius: '12px', overflow: 'hidden', display: 'flex', flexDirection: 'column', boxShadow: '0 10px 20px rgba(0,0,0,0.04)' }}>
                <img src="https://images.pexels.com/photos/3259628/pexels-photo-3259628.jpeg?auto=compress&cs=tinysrgb&w=800" alt="Insights 1" style={{ width: '100%', height: '260px', objectFit: 'cover' }} />
                <div style={{ padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flex: 1 }}>
                   <span style={{ fontSize: '1.1rem', fontWeight: '700', color: '#0055b8', lineHeight: '1.4' }}>Critical Supplies, Critical Outcomes: The Quest for Excellence in Materials Management</span>
                   <ChevronUp size={24} color="#0055b8" style={{ marginTop: '4px', flexShrink: 0, marginLeft: '12px' }} />
                </div>
             </div>

             <div style={{ background: '#fff', borderRadius: '12px', overflow: 'hidden', display: 'flex', flexDirection: 'column', boxShadow: '0 10px 20px rgba(0,0,0,0.04)' }}>
                <img src="https://images.pexels.com/photos/3861458/pexels-photo-3861458.jpeg?auto=compress&cs=tinysrgb&w=800" alt="Insights 2" style={{ width: '100%', height: '260px', objectFit: 'cover' }} />
                <div style={{ padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flex: 1 }}>
                   <span style={{ fontSize: '1.1rem', fontWeight: '700', color: '#0055b8', lineHeight: '1.4' }}>Maximizing Digital Solutions for Greater Efficiency and Care</span>
                   <ChevronUp size={24} color="#0055b8" style={{ marginTop: '4px', flexShrink: 0, marginLeft: '12px' }} />
                </div>
             </div>

             <div style={{ background: '#fff', borderRadius: '12px', overflow: 'hidden', display: 'flex', flexDirection: 'column', boxShadow: '0 10px 20px rgba(0,0,0,0.04)' }}>
                <img src="https://images.pexels.com/photos/4386466/pexels-photo-4386466.jpeg?auto=compress&cs=tinysrgb&w=800" alt="Insights 3" style={{ width: '100%', height: '260px', objectFit: 'cover' }} />
                <div style={{ padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flex: 1 }}>
                   <span style={{ fontSize: '1.1rem', fontWeight: '700', color: '#0055b8', lineHeight: '1.4' }}>Is Technology the Key to Future Proofing Our Healthcare System?</span>
                   <ChevronUp size={24} color="#0055b8" style={{ marginTop: '4px', flexShrink: 0, marginLeft: '12px' }} />
                </div>
             </div>

          </div>
        </div>
      </section>

      {/* TECH ECOSYSTEM */}
      <section className="landing-section" style={{ padding: '120px 40px', background: '#0f172a', color: 'white' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '80px' }}>
            <h2 className="landing-section-title" style={{ fontSize: '3.5rem', fontWeight: '800', marginBottom: '24px', letterSpacing: '-0.5px' }}>Comprehensive Tech Ecosystem</h2>
            <p style={{ fontSize: '1.25rem', color: '#94a3b8', maxWidth: '800px', margin: '0 auto', lineHeight: '1.6' }}>Beyond baseline tracking, MediCare Pro provides specialized modules covering every edge case in modern clinic administration and patient operations.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px' }}>
             <div style={{ background: 'rgba(255,255,255,0.03)', padding: '40px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)', transition: 'background 0.3s' }} onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'} onMouseOut={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}>
               <BrainCircuit size={48} color="var(--primary-color)" style={{ marginBottom: '24px' }} />
               <h3 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '16px', color: 'white' }}>AI Predictive Diagnosis</h3>
               <p style={{ color: '#94a3b8', lineHeight: '1.6', fontSize: '1.05rem' }}>Utilize machine learning pipelines to flag historical EHR patterns and automatically notify head doctors prior to active consultations.</p>
             </div>
             <div style={{ background: 'rgba(255,255,255,0.03)', padding: '40px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)', transition: 'background 0.3s' }} onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'} onMouseOut={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}>
               <Pill size={48} color="#10b981" style={{ marginBottom: '24px' }} />
               <h3 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '16px', color: 'white' }}>Pharmacy Automation</h3>
               <p style={{ color: '#94a3b8', lineHeight: '1.6', fontSize: '1.05rem' }}>Seamless interoperability between doctors' prescriptions and internal pharmacy inventory logic to stop medicine shortages.</p>
             </div>
             <div style={{ background: 'rgba(255,255,255,0.03)', padding: '40px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)', transition: 'background 0.3s' }} onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'} onMouseOut={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}>
               <LineChart size={48} color="#0ea5e9" style={{ marginBottom: '24px' }} />
               <h3 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '16px', color: 'white' }}>Real-Time Financials</h3>
               <p style={{ color: '#94a3b8', lineHeight: '1.6', fontSize: '1.05rem' }}>Intelligent invoice mapping, automated patient billing cycles, and insurance claim tracking unified under one reliable dashboard.</p>
             </div>
             <div style={{ background: 'rgba(255,255,255,0.03)', padding: '40px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)', transition: 'background 0.3s' }} onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'} onMouseOut={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}>
               <Network size={48} color="#f59e0b" style={{ marginBottom: '24px' }} />
               <h3 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '16px', color: 'white' }}>Device Connectivity</h3>
               <p style={{ color: '#94a3b8', lineHeight: '1.6', fontSize: '1.05rem' }}>Full mobile synchronization for on-the-go doctors. Verify wards, check lab results, and message staff directly from any tablet.</p>
             </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ background: '#000000', color: '#ffffff', paddingTop: '60px', paddingBottom: '30px', fontFamily: '"Inter", sans-serif' }}>
        <div className="landing-footer-container" style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 40px' }}>
          
          <div className="landing-footer-top" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '60px', paddingBottom: '40px', borderBottom: '1px solid #333', flexWrap: 'wrap', gap: '32px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Stethoscope size={40} color="#ffffff" strokeWidth={2} />
              <span style={{ fontSize: '2rem', fontWeight: '800', letterSpacing: '1px' }}>MediCare Pro</span>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '32px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '1.2rem', fontWeight: '700' }}>Connect with Our Team</span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <button style={{ padding: '12px 24px', background: 'var(--primary-color)', color: '#ffffff', border: 'none', borderRadius: '24px', fontWeight: '700', fontSize: '1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between', minWidth: '220px' }}>
                  Contact Sales <ChevronRight size={18} />
                </button>
                <button style={{ padding: '12px 24px', background: 'var(--primary-color)', color: '#ffffff', border: 'none', borderRadius: '24px', fontWeight: '700', fontSize: '1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between', minWidth: '220px' }}>
                  Find a Partner <ChevronRight size={18} />
                </button>
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '40px', marginBottom: '60px' }}>
            <div>
              <h4 style={{ fontSize: '1.05rem', fontWeight: '700', marginBottom: '20px' }}>About Us</h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <li><a href="#" style={{ color: '#d1d5db', textDecoration: 'none', fontSize: '0.9rem', fontWeight: '500' }}>Careers</a></li>
                <li><a href="#" style={{ color: '#d1d5db', textDecoration: 'none', fontSize: '0.9rem', fontWeight: '500' }}>Events</a></li>
                <li><a href="#" style={{ color: '#d1d5db', textDecoration: 'none', fontSize: '0.9rem', fontWeight: '500' }}>Story Hub</a></li>
                <li><a href="#" style={{ color: '#d1d5db', textDecoration: 'none', fontSize: '0.9rem', fontWeight: '500' }}>Investors</a></li>
              </ul>
            </div>
            <div>
              <h4 style={{ fontSize: '1.05rem', fontWeight: '700', marginBottom: '20px' }}>Discover</h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <li><a href="#" style={{ color: '#d1d5db', textDecoration: 'none', fontSize: '0.9rem', fontWeight: '500' }}>Industry</a></li>
                <li><a href="#" style={{ color: '#d1d5db', textDecoration: 'none', fontSize: '0.9rem', fontWeight: '500' }}>Products</a></li>
                <li><a href="#" style={{ color: '#d1d5db', textDecoration: 'none', fontSize: '0.9rem', fontWeight: '500' }}>Services</a></li>
              </ul>
            </div>
            <div>
              <h4 style={{ fontSize: '1.05rem', fontWeight: '700', marginBottom: '20px' }}>Support Resources</h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <li><a href="#" style={{ color: '#d1d5db', textDecoration: 'none', fontSize: '0.9rem', fontWeight: '500' }}>Support Centre</a></li>
                <li><a href="#" style={{ color: '#d1d5db', textDecoration: 'none', fontSize: '0.9rem', fontWeight: '500' }}>Contact Support</a></li>
              </ul>
            </div>
            <div>
              <h4 style={{ fontSize: '1.05rem', fontWeight: '700', marginBottom: '12px' }}>Stay up to date.</h4>
              <button style={{ padding: '12px 24px', background: '#ffffff', color: '#000', border: 'none', borderRadius: '24px', fontWeight: '700', fontSize: '1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', maxWidth: '240px', marginBottom: '24px' }}>
                Register Now <ChevronRight size={18} />
              </button>
            </div>
          </div>

          <div style={{ borderTop: '1px solid #333', paddingTop: '32px' }}>
             <p style={{ color: '#6b7280', fontSize: '0.75rem', lineHeight: '1.6', maxWidth: '1000px', margin: 0 }}>
                MEDICARE PRO and the stylized Stethoscope head are trademarks of MediCare Technologies Corp. All other trademarks are the property of their respective owners.
             </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
