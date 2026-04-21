import React, { useState, useEffect } from 'react';
import { Calendar as CalIcon, UserCheck, Stethoscope, Banknote, ShieldCheck } from 'lucide-react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const timeSlots = [
  "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM", 
  "11:00 AM", "11:30 AM", "12:00 PM", "12:30 PM",
  "02:00 PM", "02:30 PM", "03:00 PM", "03:30 PM",
  "04:00 PM", "04:30 PM", "05:00 PM", "05:30 PM"
];

export default function AppointmentsAndDoctors() {
  const [activeTab, setActiveTab] = useState('appointments'); // 'appointments' or 'doctors'
  
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [showApptForm, setShowApptForm] = useState(false);
  const [apptForm, setApptForm] = useState({ 
    patientId: '', patientName: '', phone: '', email: '', age: '', gender: '', doctorId: '', 
    appointmentDate: null, 
    appointmentTime: '', reason: '' 
  });

  const [showDocForm, setShowDocForm] = useState(false);
  const [docForm, setDocForm] = useState({ name: '', specialty: '', phone: '', email: '', consultationFee: 500 });

  const [paymentState, setPaymentState] = useState({ state: 'none', message: '', doctorName: '', fee: 0, method: 'upi' }); // none, paying, processing, success

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [apptcRes, patRes, docRes] = await Promise.all([
        fetch('http://localhost:5000/api/appointments'),
        fetch('http://localhost:5000/api/patients'),
        fetch('http://localhost:5000/api/doctors')
      ]);
      setAppointments(await apptcRes.json());
      setPatients(await patRes.json());
      setDoctors(await docRes.json());
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const handlePatientSelection = (e) => {
    const rawVal = e.target.value;
    const val = rawVal.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    
    const matched = patients.find(p => p.name.toLowerCase() === val.toLowerCase());
    if (matched) {
      setApptForm({ 
        ...apptForm, 
        patientName: val, 
        patientId: matched.id,
        phone: matched.phone || '',
        email: matched.email || '',
        age: matched.age || '',
        gender: matched.gender || ''
      });
    } else {
      setApptForm({ 
        ...apptForm, 
        patientName: val, 
        patientId: '',
        phone: '',
        email: '',
        age: '',
        gender: ''
      });
    }
  };

  const handleBookApptClick = (e) => {
    e.preventDefault();
    if(!apptForm.patientName || !apptForm.doctorId || !apptForm.appointmentDate || !apptForm.appointmentTime) return;
    
    const selectedDoc = doctors.find(d => d.id == apptForm.doctorId);
    if(selectedDoc) {
      setPaymentState({
        state: 'paying',
        doctorName: selectedDoc.name,
        fee: selectedDoc.consultationFee,
        method: 'upi'
      });
    }
  };

  const processPaymentAndBooking = async () => {
    setPaymentState(prev => ({...prev, state: 'processing'}));
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    try {
      let finalPatientId = apptForm.patientId;
      if (!finalPatientId) {
        // Create patient inline if missing
        const newPatRes = await fetch('http://localhost:5000/api/patients', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
             name: apptForm.patientName, 
             phone: apptForm.phone || 'N/A',
             email: apptForm.email || null,
             age: apptForm.age ? parseInt(apptForm.age) : null,
             gender: apptForm.gender || null
          })
        });
        const newPatData = await newPatRes.json();
        finalPatientId = newPatData.id;
      }

      // Convert "02:30 PM" to "14:30:00"
      const [timeMatch, hoursStr, minutesStr, period] = apptForm.appointmentTime.match(/(\d{2}):(\d{2}) (AM|PM)/);
      let formattedHour = parseInt(hoursStr);
      if (period === 'PM' && formattedHour !== 12) formattedHour += 12;
      if (period === 'AM' && formattedHour === 12) formattedHour = 0;
      const time24 = `${String(formattedHour).padStart(2, '0')}:${minutesStr}:00`;

      const year = apptForm.appointmentDate.getFullYear();
      const month = String(apptForm.appointmentDate.getMonth() + 1).padStart(2, '0');
      const day = String(apptForm.appointmentDate.getDate()).padStart(2, '0');
      
      const combinedDateTime = new Date(`${year}-${month}-${day}T${time24}`);

      const payload = {
        patientId: parseInt(finalPatientId),
        doctorId: parseInt(apptForm.doctorId),
        appointmentDate: combinedDateTime.toISOString(),
        reason: apptForm.reason,
        status: 'Scheduled'
      };
      
      const apptRes = await fetch('http://localhost:5000/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      if (!apptRes.ok) {
         const errorText = await apptRes.text();
         alert("System Error: Appointment saving failed -> " + errorText);
         throw new Error(errorText);
      }
      
      await fetch('http://localhost:5000/api/bills', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patientId: parseInt(finalPatientId),
          amount: parseFloat(paymentState.fee),
          description: `Consultation Fee - Dr. ${paymentState.doctorName}`,
          status: 'Paid'
        })
      });

      setPaymentState(prev => ({...prev, state: 'success', message: 'Appointment Confirmed & Fee Paid!'}));
      setTimeout(() => {
        setPaymentState({state: 'none', message: '', doctorName: '', fee: 0, method: 'upi'});
        setApptForm({ 
          patientId: '', patientName: '', phone: '', email: '', age: '', gender: '', doctorId: '', 
          appointmentDate: null, 
          appointmentTime: '', reason: '' 
        });
        setShowApptForm(false);
        fetchData();
      }, 2000);
    } catch (err) {
      console.error(err);
      alert('Network error connecting to payment validation server.');
      setPaymentState(prev => ({...prev, state: 'paying'}));
    }
  };

  const handleAddDoctor = async (e) => {
    e.preventDefault();
    try {
      const payload = Object.assign({}, docForm);
      payload.consultationFee = parseFloat(payload.consultationFee) || 500;

      const res = await fetch('http://localhost:5000/api/doctors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        setDocForm({ name: '', specialty: '', phone: '', email: '', consultationFee: 500 });
        setShowDocForm(false);
        fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
        <h1>Appointments & Roster</h1>
      </div>

      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', borderBottom: '2px solid var(--border-color)', paddingBottom: '16px' }}>
        <button 
          onClick={() => setActiveTab('appointments')} 
          style={activeTab === 'appointments' ? activeTabStyle : inactiveTabStyle}
        >
          <CalIcon size={18} /> Manage Appointments
        </button>
        <button 
          onClick={() => setActiveTab('doctors')} 
          style={activeTab === 'doctors' ? activeTabStyle : inactiveTabStyle}
        >
          <Stethoscope size={18} /> Doctor Directory
        </button>
      </div>

      {paymentState.state !== 'none' && (
        <div style={overlayStyle}>
          <div className="glass-panel" style={modalStyle}>
            {paymentState.state === 'paying' && (
              <div style={{ width: '100%' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '16px', marginBottom: '24px' }}>
                  <h2 style={{ fontSize: '1.2rem', margin: 0 }}>Select Payment Method</h2>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>Total Payable</p>
                    <p style={{ fontSize: '1.4rem', fontWeight: '700', color: 'var(--primary-color)', margin: 0 }}>₹{paymentState.fee}</p>
                  </div>
                </div>
                
                <div style={{ display: 'flex', gap: '24px', marginBottom: '24px' }}>
                  {/* Left Side: Navigation */}
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px', borderRight: '1px solid var(--border-color)', paddingRight: '16px' }}>
                     <button type="button" onClick={() => setPaymentState({...paymentState, method: 'upi'})} style={{ padding: '12px', background: paymentState.method === 'upi' ? 'var(--primary-color)' : 'transparent', color: paymentState.method === 'upi' ? 'white' : 'var(--text-muted)', border: 'none', borderRadius: '8px', fontWeight: paymentState.method === 'upi' ? '600' : '500', cursor: 'pointer', textAlign: 'left' }}>UPI / QR Scan</button>
                     <button type="button" onClick={() => setPaymentState({...paymentState, method: 'card'})} style={{ padding: '12px', background: paymentState.method === 'card' ? 'var(--primary-color)' : 'transparent', color: paymentState.method === 'card' ? 'white' : 'var(--text-muted)', border: 'none', borderRadius: '8px', fontWeight: paymentState.method === 'card' ? '600' : '500', cursor: 'pointer', textAlign: 'left' }}>Credit / Debit Card</button>
                     <button type="button" onClick={() => setPaymentState({...paymentState, method: 'netbanking'})} style={{ padding: '12px', background: paymentState.method === 'netbanking' ? 'var(--primary-color)' : 'transparent', color: paymentState.method === 'netbanking' ? 'white' : 'var(--text-muted)', border: 'none', borderRadius: '8px', fontWeight: paymentState.method === 'netbanking' ? '600' : '500', cursor: 'pointer', textAlign: 'left' }}>Netbanking</button>
                  </div>

                  {/* Right Side: QR Code Area or Form */}
                  <div style={{ flex: 1.5, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    {paymentState.method === 'upi' && (
                      <>
                        <div style={{ background: 'white', padding: '16px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', textAlign: 'center' }}>
                           <img 
                             src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=upi://pay?pa=medicare@ybl&pn=MediCare%20Pro&am=${paymentState.fee}&cu=INR`} 
                             alt="Payment QR Code" 
                             style={{ width: '150px', height: '150px', display: 'block', margin: '0 auto' }} 
                           />
                        </div>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-main)', marginTop: '16px', fontWeight: '500' }}>Scan with any UPI app</p>
                        <div style={{ display: 'flex', gap: '12px', marginTop: '8px', opacity: 0.6 }}>
                          <span style={{fontSize: '0.8rem', background: 'var(--border-color)', padding: '4px 8px', borderRadius: '4px'}}>GPay</span>
                          <span style={{fontSize: '0.8rem', background: 'var(--border-color)', padding: '4px 8px', borderRadius: '4px'}}>PhonePe</span>
                          <span style={{fontSize: '0.8rem', background: 'var(--border-color)', padding: '4px 8px', borderRadius: '4px'}}>Paytm</span>
                        </div>
                      </>
                    )}
                    {paymentState.method === 'card' && (
                      <div style={{ width: '100%', padding: '0 8px', maxWidth: '300px' }}>
                        <input type="text" placeholder="Card Number" style={{...inputStyle, width: '100%', marginBottom: '12px', boxSizing: 'border-box', minWidth: '0'}} />
                        <div style={{ display: 'flex', gap: '12px', marginBottom: '12px' }}>
                          <input type="text" placeholder="MM/YY" style={{...inputStyle, width: '50%', minWidth: '0', boxSizing: 'border-box'}} />
                          <input type="password" placeholder="CVV" style={{...inputStyle, width: '50%', minWidth: '0', boxSizing: 'border-box'}} />
                        </div>
                        <input type="text" placeholder="Name on Card" style={{...inputStyle, width: '100%', boxSizing: 'border-box', minWidth: '0'}} />
                      </div>
                    )}
                    {paymentState.method === 'netbanking' && (
                      <div style={{ width: '100%', padding: '0 8px' }}>
                        <select style={{...inputStyle, width: '100%', marginBottom: '16px'}}>
                          <option value="">Select your Bank</option>
                          <option>HDFC Bank</option>
                          <option>State Bank of India (SBI)</option>
                          <option>ICICI Bank</option>
                          <option>Axis Bank</option>
                          <option>Punjab National Bank</option>
                        </select>
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textAlign: 'center', background: 'var(--sidebar-bg)', padding: '16px', borderRadius: '8px' }}>
                           You will be securely redirected to your bank's portal.
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div style={{display: 'flex', gap: '12px', borderTop: '1px solid var(--border-color)', paddingTop: '20px'}}>
                  <button className="btn-secondary" style={{flex: 1}} onClick={() => setPaymentState({state: 'none'})}>Cancel Transaction</button>
                  <button className="btn-primary" style={{flex: 2, background: '#10b981', boxShadow: '0 4px 15px rgba(16, 185, 129, 0.3)'}} onClick={processPaymentAndBooking}>
                    Confirm Payment (Simulator)
                  </button>
                </div>
              </div>
            )}

            {paymentState.state === 'processing' && (
              <div style={{textAlign: 'center', padding: '40px 0'}}>
                <div className="payment-spinner"></div>
                <h3 style={{marginTop: '24px', color: 'var(--primary-color)'}}>Processing Payment...</h3>
                <p style={{color: 'var(--text-muted)'}}>Please wait, do not close the window.</p>
              </div>
            )}

            {paymentState.state === 'success' && (
              <div style={{textAlign: 'center', padding: '40px 0'}}>
                <ShieldCheck size={64} color="#10b981" style={{marginBottom: '16px'}} />
                <h2 style={{color: '#10b981', marginBottom: '8px'}}>Payment Successful!</h2>
                <p style={{color: 'var(--text-muted)'}}>Your appointment is confirmed and a paid bill has been generated in your records.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'appointments' && (
        <>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '16px' }}>
            <button className="btn-primary" onClick={() => setShowApptForm(!showApptForm)}>
              {showApptForm ? 'Cancel Booking' : '+ Book Appointment'}
            </button>
          </div>

          {showApptForm && (
            <form className="glass-panel" style={{ padding: '24px', marginBottom: '24px', display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'flex-end' }} onSubmit={handleBookApptClick}>
              <div style={{ width: '100%', marginBottom: '4px', color: 'var(--primary-color)', fontWeight: '600' }}>Patient Details (Auto-fills for returning patients)</div>
              
              <div style={{ flex: '1', minWidth: '200px' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-main)', marginBottom: '6px' }}>Patient Name:</label>
                <input required list="patient-list" placeholder="Patient Name" value={apptForm.patientName} onChange={handlePatientSelection} style={{...inputStyle, width: '100%', boxSizing: 'border-box'}} />
                <datalist id="patient-list">
                  {patients.map(p => <option key={p.id} value={p.name} />)}
                </datalist>
              </div>
              
              <div style={{ flex: '1', minWidth: '200px' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-main)', marginBottom: '6px' }}>Phone Number:</label>
                <input 
                  required 
                  type="tel" 
                  placeholder="Phone Number (10 Digits)" 
                  maxLength="10"
                  value={apptForm.phone} 
                  onChange={e => {
                    const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                    setApptForm({...apptForm, phone: val});
                  }} 
                  style={{...inputStyle, width: '100%', boxSizing: 'border-box'}} 
                />
              </div>
              
              <div style={{ flex: '1', minWidth: '200px' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-main)', marginBottom: '6px' }}>Email Address:</label>
                <input type="email" placeholder="Email Address" value={apptForm.email} onChange={e => setApptForm({...apptForm, email: e.target.value})} style={{...inputStyle, width: '100%', boxSizing: 'border-box'}} />
              </div>
              
              <div style={{ flex: '0.4', minWidth: '80px' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-main)', marginBottom: '6px' }}>Age:</label>
                <input type="number" placeholder="Age" value={apptForm.age} onChange={e => setApptForm({...apptForm, age: e.target.value})} style={{...inputStyle, width: '100%', boxSizing: 'border-box'}} />
              </div>
              
              <div style={{ flex: '0.6', minWidth: '120px' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-main)', marginBottom: '6px' }}>Gender:</label>
                <select value={apptForm.gender} onChange={e => setApptForm({...apptForm, gender: e.target.value})} style={{...inputStyle, width: '100%', boxSizing: 'border-box'}}>
                  <option value="">Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div style={{ width: '100%', marginBottom: '4px', marginTop: '12px', color: 'var(--primary-color)', fontWeight: '600' }}>Consultation Details</div>

              <div style={{ flex: '1', minWidth: '200px' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-main)', marginBottom: '6px' }}>Target Doctor:</label>
                <select required value={apptForm.doctorId} onChange={e => setApptForm({...apptForm, doctorId: e.target.value})} style={{...inputStyle, width: '100%', boxSizing: 'border-box'}}>
                  <option value="">Select Target Doctor</option>
                  {doctors.map(d => <option key={d.id} value={d.id}>Dr. {d.name} ({d.specialty}) - Fee: ₹{d.consultationFee}</option>)}
                </select>
              </div>
              
              <div style={{ flex: '1', minWidth: '200px' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-main)', marginBottom: '6px' }}>Checkup Date:</label>
                <input 
                  type="date"
                  required
                  value={apptForm.appointmentDate ? apptForm.appointmentDate.toISOString().split('T')[0] : ''}
                  onChange={(e) => {
                     const val = e.target.value;
                     if(val) {
                       const [year, month, day] = val.split('-');
                       setApptForm({...apptForm, appointmentDate: new Date(year, month - 1, day)});
                     } else {
                       setApptForm({...apptForm, appointmentDate: null});
                     }
                  }}
                  style={{...inputStyle, width: '100%', boxSizing: 'border-box', fontFamily: 'inherit'}}
                />
              </div>
              
              <div style={{ flex: '1', minWidth: '200px' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-main)', marginBottom: '6px' }}>Time Slot:</label>
                <select required value={apptForm.appointmentTime} onChange={e => setApptForm({...apptForm, appointmentTime: e.target.value})} style={{...inputStyle, width: '100%', boxSizing: 'border-box'}}>
                  <option value="">Select Time Slot</option>
                  {timeSlots.map(slot => (
                    <option key={slot} value={slot}>{slot}</option>
                  ))}
                </select>
              </div>
              
              <div style={{ flex: '1', minWidth: '200px' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-main)', marginBottom: '6px' }}>Reason:</label>
                <input type="text" placeholder="Reason (e.g. Fever checkup)" value={apptForm.reason} onChange={e => setApptForm({...apptForm, reason: e.target.value})} style={{...inputStyle, width: '100%', boxSizing: 'border-box'}} />
              </div>
              
              <button type="submit" className="btn-primary" style={{ height: '42px', background: '#10b981', boxShadow: '0 4px 15px rgba(16, 185, 129, 0.3)' }}>
                Proceed to Pay
              </button>
            </form>
          )}

          <div className="glass-panel" style={{ overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ background: 'var(--sidebar-bg)', borderBottom: '1px solid var(--border-color)' }}>
                  <th style={thStyle}>Date & Time</th>
                  <th style={thStyle}>Patient Details</th>
                  <th style={thStyle}>Assignee Doctor</th>
                  <th style={thStyle}>Case Reason</th>
                  <th style={thStyle}>Fee Paid</th>
                  <th style={thStyle}>Current Status</th>
                </tr>
              </thead>
              <tbody>
                {loading ? <tr><td colSpan="6" style={tdStyle}>Loading API...</td></tr> : appointments.length === 0 ? <tr><td colSpan="6" style={tdStyle}>No appointments booked yet.</td></tr> : appointments.map(a => (
                  <tr key={a.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={tdStyle}>
                      <span style={{fontWeight: '600'}}>{new Date(a.appointmentDate).toLocaleDateString('en-GB')}</span><br/>
                      <span style={{color: 'var(--text-muted)'}}>{new Date(a.appointmentDate).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                    </td>
                    <td style={tdStyle}>
                      <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                        <UserCheck size={16} color="var(--primary-color)" /> {a.patient?.name}
                      </div>
                    </td>
                    <td style={tdStyle}>
                      <span style={{fontWeight: '500'}}>Dr. {a.doctor?.name}</span><br/>
                      <span style={{fontSize: '0.8rem', background: '#e0e7ff', color: 'var(--primary-color)', padding: '2px 8px', borderRadius: '10px'}}>{a.doctor?.specialty}</span>
                    </td>
                    <td style={tdStyle}>{a.reason || '-'}</td>
                    <td style={{...tdStyle, fontWeight: '700', color: '#10b981'}}>
                      ₹{a.doctor?.consultationFee || 500}
                    </td>
                    <td style={tdStyle}>
                      <span style={{ padding: '6px 12px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: '500', background: a.status === 'Completed' ? '#d1fae5' : '#fef3c7', color: a.status === 'Completed' ? '#065f46' : '#b45309', border: '1px solid currentColor' }}>
                        {a.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* DOCTORS TAB */}
      {activeTab === 'doctors' && (
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <p style={{color: 'var(--text-muted)'}}>Manage all clinic doctors and their contact information.</p>
            <button className="btn-primary" onClick={() => setShowDocForm(!showDocForm)}>
              {showDocForm ? 'Close Form' : '+ Add New Doctor'}
            </button>
          </div>

          {showDocForm && (
            <form className="glass-panel" style={{ padding: '24px', marginBottom: '24px', display: 'flex', gap: '16px', flexWrap: 'wrap' }} onSubmit={handleAddDoctor}>
              <input type="text" required placeholder="Doctor Name (e.g. Verma)" value={docForm.name} onChange={e => setDocForm({...docForm, name: e.target.value})} style={inputStyle} />
              <input type="text" required placeholder="Specialty (e.g. Cardiologist)" value={docForm.specialty} onChange={e => setDocForm({...docForm, specialty: e.target.value})} style={inputStyle} />
              <input type="tel" required placeholder="Phone Contact" value={docForm.phone} onChange={e => setDocForm({...docForm, phone: e.target.value})} style={inputStyle} />
              <input type="number" required placeholder="Consultation Fee (₹)" value={docForm.consultationFee} onChange={e => setDocForm({...docForm, consultationFee: e.target.value})} style={inputStyle} />
              <input type="email" placeholder="Email Address" value={docForm.email} onChange={e => setDocForm({...docForm, email: e.target.value})} style={inputStyle} />
              
              <button type="submit" className="btn-primary" style={{ height: '42px', marginTop: 'auto' }}>Onboard Doctor</button>
            </form>
          )}

          <div className="glass-panel" style={{ overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ background: 'var(--sidebar-bg)', borderBottom: '1px solid var(--border-color)' }}>
                  <th style={thStyle}>Doctor Name</th>
                  <th style={thStyle}>Specialty</th>
                  <th style={thStyle}>Direct Phone</th>
                  <th style={thStyle}>Consulting Fee</th>
                  <th style={thStyle}>Date Enrolled</th>
                </tr>
              </thead>
              <tbody>
                {loading ? <tr><td colSpan="5" style={tdStyle}>Loading API...</td></tr> : doctors.length === 0 ? <tr><td colSpan="5" style={tdStyle}>No doctors found in directory.</td></tr> : doctors.map(d => (
                  <tr key={d.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{...tdStyle, fontWeight: '600'}}>Dr. {d.name}</td>
                    <td style={tdStyle}>
                      <span style={{fontSize: '0.9rem', background: '#e0e7ff', color: 'var(--primary-color)', padding: '4px 10px', borderRadius: '12px'}}>{d.specialty}</span>
                    </td>
                    <td style={tdStyle}>{d.phone}</td>
                    <td style={{...tdStyle, fontWeight: '700', color: '#10b981'}}>₹{d.consultationFee}</td>
                    <td style={tdStyle}>{new Date(d.createdAt).toLocaleDateString('en-GB')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      <style>{`
        .payment-spinner {
          width: 50px;
          height: 50px;
          border: 4px solid rgba(79, 70, 229, 0.2);
          border-top-color: var(--primary-color);
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin: 0 auto;
        }
        @keyframes spin { 100% { transform: rotate(360deg); } }
      `}</style>
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
  maxWidth: '550px',
  padding: '32px',
  borderRadius: '24px',
  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
};

const activeTabStyle = {
  padding: '12px 20px',
  background: 'var(--primary-color)',
  color: 'white',
  fontWeight: '600',
  borderRadius: '8px',
  border: 'none',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  transition: 'all 0.2s',
  boxShadow: '0 4px 12px rgba(79, 70, 229, 0.3)'
};

const inactiveTabStyle = {
  padding: '12px 20px',
  background: 'transparent',
  color: 'var(--text-muted)',
  fontWeight: '600',
  borderRadius: '8px',
  border: '1px solid var(--border-color)',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  transition: 'all 0.2s'
};

const inputStyle = { padding: '10px 16px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--input-bg)', outline: 'none', flex: '1', minWidth: '200px', color: 'var(--text-main)' };
const thStyle = { padding: '16px', fontWeight: '600', color: 'var(--text-muted)' };
const tdStyle = { padding: '16px', color: 'var(--text-main)' };
