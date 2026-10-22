import React, { useState } from 'react';
import { useHospital } from '../../context/HospitalContext';
import { useAuth } from '../../context/AuthContext';
import StatCard from '../common/StatCard';
import Badge from '../common/Badge';
import BookAppointmentModal from './BookAppointmentModal';
import {
  Calendar,
  Pill,
  FlaskConical,
  Receipt,
  Heart,
  Activity,
  Thermometer,
  Wind,
  Clock,
  ArrowRight,
  Stethoscope,
  PhoneCall,
  AlertCircle
} from 'lucide-react';

export default function PatientOverview({ onNavigate }) {
  const { currentUser } = useAuth();
  const { patients, appointments, prescriptions, labReports, bills } = useHospital();
  const [isBookModalOpen, setIsBookModalOpen] = useState(false);

  // Active patient record
  const currentPatient = patients.find(p => p.id === currentUser?.id) || patients[0];

  // Filter items for this patient
  const myAppointments = appointments.filter(a => a.patientId === currentPatient.id);
  const upcomingAppointments = myAppointments.filter(a => a.status === 'confirmed');
  const nextAppointment = upcomingAppointments[0] || null;

  const myPrescriptions = prescriptions.filter(p => p.patientId === currentPatient.id);
  const activePrescriptions = myPrescriptions.filter(p => p.status === 'active');

  const myLabs = labReports.filter(l => l.patientId === currentPatient.id);
  const myBills = bills.filter(b => b.patientId === currentPatient.id);
  const pendingBills = myBills.filter(b => b.status === 'pending');
  const pendingBillsTotal = pendingBills.reduce((sum, b) => sum + b.total, 0);

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Welcome Banner */}
      <div
        style={{
          background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
          borderRadius: 'var(--radius-xl)',
          padding: '28px 32px',
          color: '#ffffff',
          boxShadow: '0 10px 25px -5px rgba(2, 132, 199, 0.35)',
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 20
        }}
      >
        <div style={{ maxWidth: 640 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(255, 255, 255, 0.18)', padding: '4px 12px', borderRadius: 'var(--radius-full)', fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.05em', marginBottom: 12 }}>
            <Heart size={14} fill="#ffffff" /> PATIENT HEALTH HUB • ID: #{currentPatient.id.toUpperCase()}
          </div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#ffffff', marginBottom: 8, letterSpacing: '-0.02em' }}>
            Welcome back, {currentPatient.name}
          </h2>
          <p style={{ color: 'rgba(255, 255, 255, 0.88)', fontSize: '0.95rem', lineHeight: 1.5 }}>
            Blood Group: <strong style={{ color: '#ffffff' }}>{currentPatient.bloodGroup}</strong> &nbsp;|&nbsp;
            Known Allergies: <strong style={{ color: '#fecdd3' }}>{currentPatient.allergies}</strong> &nbsp;|&nbsp;
            Admission: <strong style={{ color: '#ffffff' }}>{currentPatient.admissionStatus}</strong>
          </p>
        </div>

        <div style={{ display: 'flex', gap: 12 }}>
          <button
            className="btn"
            style={{ background: '#ffffff', color: '#0284c7', fontWeight: 700, padding: '11px 20px', borderRadius: 'var(--radius-md)' }}
            onClick={() => setIsBookModalOpen(true)}
          >
            <Calendar size={17} />
            Book New Appointment
          </button>
          <button
            className="btn"
            style={{ background: 'rgba(255, 255, 255, 0.15)', color: '#ffffff', border: '1px solid rgba(255, 255, 255, 0.3)' }}
            onClick={() => onNavigate('contact')}
          >
            <PhoneCall size={17} />
            Helpline
          </button>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="stat-grid">
        <StatCard
          label="Upcoming Visits"
          value={upcomingAppointments.length}
          subtext={nextAppointment ? `Next: ${nextAppointment.date}` : "No visits scheduled"}
          icon={Calendar}
          color="blue"
        />
        <StatCard
          label="Active Prescriptions"
          value={activePrescriptions.length}
          subtext="Medications currently ongoing"
          icon={Pill}
          color="emerald"
        />
        <StatCard
          label="Lab Reports"
          value={myLabs.length}
          subtext={`${myLabs.filter(l => l.status === 'completed').length} verified & ready`}
          icon={FlaskConical}
          color="indigo"
        />
        <StatCard
          label="Pending Invoices"
          value={`$${pendingBillsTotal.toFixed(2)}`}
          subtext={`${pendingBills.length} unpaid hospital bills`}
          icon={Receipt}
          color={pendingBills.length > 0 ? "rose" : "emerald"}
        />
      </div>

      {/* 2-Column Main Section */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: 24 }}>
        {/* Next Scheduled Appointment Spotlight */}
        <div className="card">
          <div className="card-header">
            <span className="card-title">
              <Calendar size={18} color="var(--primary-600)" />
              Next Scheduled Appointment
            </span>
            {nextAppointment && <Badge status={nextAppointment.status} />}
          </div>

          <div className="card-body">
            {nextAppointment ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div className="avatar avatar-lg">
                    {nextAppointment.doctorName.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </div>
                  <div>
                    <h4 style={{ fontSize: '1.1rem', fontWeight: 800 }}>{nextAppointment.doctorName}</h4>
                    <span style={{ fontSize: '0.85rem', color: 'var(--primary-600)', fontWeight: 600 }}>
                      {nextAppointment.department}
                    </span>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: 2 }}>
                      {nextAppointment.reason}
                    </div>
                  </div>
                </div>

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: 12,
                    background: 'var(--bg-surface-subtle)',
                    padding: '14px 18px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-default)'
                  }}
                >
                  <div>
                    <span style={{ fontSize: '0.74rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700 }}>
                      Date & Time
                    </span>
                    <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-primary)', marginTop: 2 }}>
                      {nextAppointment.date} at {nextAppointment.time}
                    </div>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.74rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700 }}>
                      Consultation Fee
                    </span>
                    <div style={{ fontWeight: 800, fontSize: '1.05rem', color: 'var(--emerald-600)', marginTop: 2 }}>
                      ${nextAppointment.fee}
                    </div>
                  </div>
                </div>

                {nextAppointment.notes && (
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', background: 'var(--primary-50)', padding: '8px 12px', borderRadius: 'var(--radius-sm)' }}>
                    <strong>Doctor Instructions:</strong> {nextAppointment.notes}
                  </div>
                )}

                <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
                  <button className="btn btn-secondary btn-sm" onClick={() => onNavigate('appointments')}>
                    Manage All Appointments
                  </button>
                </div>
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '30px 20px', color: 'var(--text-muted)' }}>
                <Clock size={36} strokeWidth={1.5} style={{ margin: '0 auto 12px', opacity: 0.5 }} />
                <p style={{ fontWeight: 600, fontSize: '0.95rem' }}>No Upcoming Appointments</p>
                <p style={{ fontSize: '0.82rem', marginTop: 4 }}>Schedule a consultation with our hospital specialists today.</p>
                <button
                  className="btn btn-primary btn-sm"
                  style={{ marginTop: 14 }}
                  onClick={() => setIsBookModalOpen(true)}
                >
                  Book Appointment Now
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Latest Clinical Vitals */}
        <div className="card">
          <div className="card-header">
            <span className="card-title">
              <Activity size={18} color="var(--emerald-600)" />
              Recorded Patient Vitals
            </span>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              {currentPatient.vitals?.lastUpdated || 'Recent'}
            </span>
          </div>

          <div className="card-body">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 14 }}>
              <div className="vital-box">
                <span className="vital-title">Blood Pressure</span>
                <span className="vital-value" style={{ color: 'var(--primary-600)' }}>
                  {currentPatient.vitals?.bloodPressure || '120/80 mmHg'}
                </span>
                <span style={{ fontSize: '0.72rem', color: 'var(--emerald-600)', fontWeight: 600, marginTop: 4 }}>
                  Optimal Range
                </span>
              </div>

              <div className="vital-box">
                <span className="vital-title">Heart Rate (Pulse)</span>
                <span className="vital-value" style={{ color: 'var(--rose-600)' }}>
                  {currentPatient.vitals?.heartRate || '72 bpm'}
                </span>
                <span style={{ fontSize: '0.72rem', color: 'var(--emerald-600)', fontWeight: 600, marginTop: 4 }}>
                  Resting Rhythm
                </span>
              </div>

              <div className="vital-box">
                <span className="vital-title">Blood Oxygen (SpO2)</span>
                <span className="vital-value" style={{ color: 'var(--teal-600)' }}>
                  {currentPatient.vitals?.spO2 || '99%'}
                </span>
                <span style={{ fontSize: '0.72rem', color: 'var(--emerald-600)', fontWeight: 600, marginTop: 4 }}>
                  Healthy Saturation
                </span>
              </div>

              <div className="vital-box">
                <span className="vital-title">Body Temp</span>
                <span className="vital-value" style={{ color: 'var(--amber-600)' }}>
                  {currentPatient.vitals?.temperature || '98.6 °F'}
                </span>
                <span style={{ fontSize: '0.72rem', color: 'var(--emerald-600)', fontWeight: 600, marginTop: 4 }}>
                  Normothermic
                </span>
              </div>
            </div>

            <div
              style={{
                marginTop: 16,
                padding: '10px 14px',
                borderRadius: 'var(--radius-md)',
                background: 'var(--bg-surface-subtle)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontSize: '0.82rem'
              }}
            >
              <span>Body Mass Index (BMI): <strong>{currentPatient.vitals?.bmi || '23.4'}</strong> (Normal)</span>
              <button
                className="btn-outline btn-sm"
                onClick={() => onNavigate('medical-records')}
                style={{ padding: '3px 8px', fontSize: '0.75rem' }}
              >
                View History
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Action Portals Bar */}
      <div className="card">
        <div className="card-header">
          <span className="card-title">Direct Patient Quick Actions</span>
        </div>
        <div className="card-body" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14 }}>
          <button
            className="btn btn-secondary"
            style={{ height: 60, justifyContent: 'flex-start', padding: '12px 18px' }}
            onClick={() => onNavigate('doctors')}
          >
            <Stethoscope size={20} color="var(--primary-600)" />
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontWeight: 700, fontSize: '0.88rem' }}>Find Doctors</div>
              <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>Browse 8+ departments</div>
            </div>
          </button>

          <button
            className="btn btn-secondary"
            style={{ height: 60, justifyContent: 'flex-start', padding: '12px 18px' }}
            onClick={() => onNavigate('prescriptions')}
          >
            <Pill size={20} color="var(--emerald-600)" />
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontWeight: 700, fontSize: '0.88rem' }}>Prescriptions</div>
              <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>{activePrescriptions.length} active courses</div>
            </div>
          </button>

          <button
            className="btn btn-secondary"
            style={{ height: 60, justifyContent: 'flex-start', padding: '12px 18px' }}
            onClick={() => onNavigate('lab-reports')}
          >
            <FlaskConical size={20} color="var(--indigo-600)" />
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontWeight: 700, fontSize: '0.88rem' }}>Lab Test Reports</div>
              <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>CBC, Lipid, Metabolic</div>
            </div>
          </button>

          <button
            className="btn btn-secondary"
            style={{ height: 60, justifyContent: 'flex-start', padding: '12px 18px' }}
            onClick={() => onNavigate('billing')}
          >
            <Receipt size={20} color="var(--rose-600)" />
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontWeight: 700, fontSize: '0.88rem' }}>Pay Bills Online</div>
              <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>{pendingBills.length} pending invoice(s)</div>
            </div>
          </button>
        </div>
      </div>

      {/* Booking Modal */}
      <BookAppointmentModal
        isOpen={isBookModalOpen}
        onClose={() => setIsBookModalOpen(false)}
      />
    </div>
  );
}
