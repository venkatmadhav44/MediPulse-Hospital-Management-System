import React, { useState } from 'react';
import { useHospital } from '../../context/HospitalContext';
import { useToast } from '../common/Toast';
import {
  PhoneCall,
  MapPin,
  Mail,
  Clock,
  Send,
  AlertTriangle,
  Building,
  Ambulance,
  CheckCircle2
} from 'lucide-react';

export default function ContactHospital() {
  const { hospitalInfo } = useHospital();
  const { addToast } = useToast();

  const [inquiryName, setInquiryName] = useState('');
  const [inquiryEmail, setInquiryEmail] = useState('');
  const [inquirySubject, setInquirySubject] = useState('');
  const [inquiryMessage, setInquiryMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleInquirySubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    addToast('Your inquiry has been logged! Hospital desk coordinator will reach out shortly.', 'success');
  };

  const handleSosTrigger = () => {
    addToast('🚨 EMERGENCY CALL DISPATCHED: Ambulance triage team notified at dispatch bay!', 'danger', 6000);
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Critical Emergency Banner */}
      <div
        style={{
          background: 'linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)',
          borderRadius: 'var(--radius-xl)',
          padding: '24px 30px',
          color: '#ffffff',
          boxShadow: '0 10px 25px -5px rgba(239, 68, 68, 0.4)',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 18
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            <AlertTriangle size={16} /> 24/7 Rapid Emergency & Trauma Response
          </div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#ffffff', marginTop: 4 }}>
            Emergency Line: {hospitalInfo.emergencyHotline}
          </h2>
          <p style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: '0.88rem', marginTop: 2 }}>
            Instant response for acute chest pain, stroke symptoms, trauma, or severe respiratory distress.
          </p>
        </div>

        <button
          className="btn"
          style={{ background: '#ffffff', color: '#dc2626', fontWeight: 800, padding: '12px 24px', fontSize: '0.95rem', borderRadius: 'var(--radius-lg)' }}
          onClick={handleSosTrigger}
        >
          <Ambulance size={20} />
          Request Emergency Ambulance
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: 20 }}>
        {/* Hospital Directory & Extensions */}
        <div className="card">
          <div className="card-header">
            <span className="card-title">
              <Building size={18} color="var(--primary-600)" />
              Hospital Department Directory
            </span>
          </div>

          <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
              <MapPin size={20} color="var(--primary-600)" style={{ flexShrink: 0, marginTop: 2 }} />
              <div>
                <strong>Physical Campus Address</strong>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{hospitalInfo.address}</p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
              <Clock size={20} color="var(--emerald-600)" style={{ flexShrink: 0, marginTop: 2 }} />
              <div>
                <strong>Operational Hours</strong>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  Emergency & Inpatient Admissions: 24/7 Continuous <br />
                  Specialist Outpatient (OPD): Monday – Saturday (08:00 AM – 08:00 PM)
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
              <Mail size={20} color="var(--indigo-600)" style={{ flexShrink: 0, marginTop: 2 }} />
              <div>
                <strong>General Email</strong>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{hospitalInfo.email}</p>
              </div>
            </div>

            <div style={{ borderTop: '1px solid var(--border-default)', paddingTop: 14 }}>
              <h4 style={{ fontSize: '0.9rem', marginBottom: 10 }}>Direct Extensions</h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, fontSize: '0.84rem' }}>
                <div style={{ background: 'var(--bg-surface-subtle)', padding: 10, borderRadius: 'var(--radius-sm)' }}>
                  <div style={{ color: 'var(--text-muted)' }}>Emergency Trauma</div>
                  <strong>Ext. 101 / 102</strong>
                </div>
                <div style={{ background: 'var(--bg-surface-subtle)', padding: 10, borderRadius: 'var(--radius-sm)' }}>
                  <div style={{ color: 'var(--text-muted)' }}>Cardiology Wing</div>
                  <strong>Ext. 204</strong>
                </div>
                <div style={{ background: 'var(--bg-surface-subtle)', padding: 10, borderRadius: 'var(--radius-sm)' }}>
                  <div style={{ color: 'var(--text-muted)' }}>Central Laboratory</div>
                  <strong>Ext. 312</strong>
                </div>
                <div style={{ background: 'var(--bg-surface-subtle)', padding: 10, borderRadius: 'var(--radius-sm)' }}>
                  <div style={{ color: 'var(--text-muted)' }}>Pharmacy Dispense</div>
                  <strong>Ext. 405</strong>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Send Inquiry Form */}
        <div className="card">
          <div className="card-header">
            <span className="card-title">
              <PhoneCall size={18} color="var(--teal-600)" />
              Send Patient Inquiry or Feedback
            </span>
          </div>

          <div className="card-body">
            {submitted ? (
              <div style={{ textAlign: 'center', padding: '30px 20px' }}>
                <CheckCircle2 size={44} color="var(--emerald-600)" style={{ margin: '0 auto 12px' }} />
                <h3>Inquiry Successfully Submitted</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginTop: 6 }}>
                  Our patient desk representative will review your message and reach back via email or SMS.
                </p>
                <button
                  className="btn btn-secondary btn-sm"
                  style={{ marginTop: 16 }}
                  onClick={() => {
                    setSubmitted(false);
                    setInquirySubject('');
                    setInquiryMessage('');
                  }}
                >
                  Send Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleInquirySubmit}>
                <div className="form-group">
                  <label className="form-label">Your Name</label>
                  <input
                    type="text"
                    className="form-input"
                    value={inquiryName}
                    onChange={(e) => setInquiryName(e.target.value)}
                    placeholder="Enter your name"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Contact Email</label>
                  <input
                    type="email"
                    className="form-input"
                    value={inquiryEmail}
                    onChange={(e) => setInquiryEmail(e.target.value)}
                    placeholder="name@example.com"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Department / Inquiry Subject</label>
                  <input
                    type="text"
                    className="form-input"
                    value={inquirySubject}
                    onChange={(e) => setInquirySubject(e.target.value)}
                    placeholder="e.g. Appointment rescheduling, billing inquiry..."
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Message Details</label>
                  <textarea
                    className="form-textarea"
                    rows="3"
                    value={inquiryMessage}
                    onChange={(e) => setInquiryMessage(e.target.value)}
                    placeholder="Type your message or questions here..."
                    required
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 10 }}>
                  <button type="submit" className="btn btn-primary">
                    <Send size={16} /> Submit Inquiry
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
