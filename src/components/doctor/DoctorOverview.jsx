import React, { useState } from 'react';
import { useHospital } from '../../context/HospitalContext';
import { useAuth } from '../../context/AuthContext';
import StatCard from '../common/StatCard';
import Badge from '../common/Badge';
import DoctorConsultationModal from './DoctorConsultationModal';
import {
  Calendar,
  Users,
  CheckCircle2,
  Clock,
  Stethoscope,
  Activity,
  PlayCircle,
  FileText,
  AlertCircle
} from 'lucide-react';

export default function DoctorOverview({ onNavigate }) {
  const { currentUser } = useAuth();
  const { doctors, appointments, updateAppointmentStatus } = useHospital();

  const currentDoctor = doctors.find(d => d.id === (currentUser?.id || 'doc-1')) || doctors[0];
  const doctorAppointments = appointments.filter(a => a.doctorId === currentDoctor.id);

  // Today's appointments (for demo, showing all or confirmed/in-consultation)
  const todayAppointments = doctorAppointments.filter(
    a => a.status === 'confirmed' || a.status === 'in-consultation'
  );
  const completedToday = doctorAppointments.filter(a => a.status === 'completed');

  const [activeConsultationApt, setActiveConsultationApt] = useState(null);

  const handleStartConsultation = (apt) => {
    updateAppointmentStatus(apt.id, 'in-consultation');
    setActiveConsultationApt(apt);
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Doctor Header Banner */}
      <div
        style={{
          background: 'linear-gradient(135deg, #0d9488 0%, #0f766e 100%)',
          borderRadius: 'var(--radius-xl)',
          padding: '28px 32px',
          color: '#ffffff',
          boxShadow: '0 10px 25px -5px rgba(13, 148, 136, 0.35)',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 20
        }}
      >
        <div style={{ maxWidth: 640 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(255, 255, 255, 0.18)', padding: '4px 12px', borderRadius: 'var(--radius-full)', fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.05em', marginBottom: 12 }}>
            <Stethoscope size={14} /> ATTENDING PHYSICIAN • {currentDoctor.roomNo}
          </div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#ffffff', marginBottom: 6, letterSpacing: '-0.02em' }}>
            {currentDoctor.name}
          </h2>
          <p style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: '0.92rem' }}>
            {currentDoctor.qualifications} &nbsp;•&nbsp;
            Specialty: <strong style={{ color: '#ffffff' }}>{currentDoctor.specialization}</strong> &nbsp;•&nbsp;
            OPD Fee: <strong style={{ color: '#ffffff' }}>${currentDoctor.consultationFee}</strong>
          </p>
        </div>

        <div style={{ display: 'flex', gap: 12 }}>
          <button
            className="btn"
            style={{ background: '#ffffff', color: '#0f766e', fontWeight: 700 }}
            onClick={() => onNavigate('availability')}
          >
            <Clock size={16} /> Update OPD Schedule
          </button>
          <button
            className="btn"
            style={{ background: 'rgba(255, 255, 255, 0.15)', color: '#ffffff', border: '1px solid rgba(255, 255, 255, 0.3)' }}
            onClick={() => onNavigate('patients')}
          >
            <Users size={16} /> Patient Directory
          </button>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="stat-grid">
        <StatCard
          label="Today's Patient Queue"
          value={todayAppointments.length}
          subtext="Patients waiting for OPD intake"
          icon={Calendar}
          color="blue"
        />
        <StatCard
          label="Completed Consultations"
          value={completedToday.length}
          subtext="Diagnosed & prescriptions issued"
          icon={CheckCircle2}
          color="emerald"
        />
        <StatCard
          label="In Consultation"
          value={todayAppointments.filter(a => a.status === 'in-consultation').length}
          subtext="Active patient in clinic chamber"
          icon={Clock}
          color="amber"
        />
        <StatCard
          label="Total Consultations"
          value={doctorAppointments.length}
          subtext="Historical patient encounters"
          icon={Activity}
          color="indigo"
        />
      </div>

      {/* Today's Queue Table */}
      <div className="card">
        <div className="card-header">
          <div>
            <span className="card-title">
              <Users size={18} color="var(--primary-600)" />
              Today's Consultation Schedule & Patient Queue
            </span>
            <span className="card-subtitle">
              Review assigned patients, open clinical EHR, add diagnosis, and issue digital prescriptions.
            </span>
          </div>

          <button className="btn btn-secondary btn-sm" onClick={() => onNavigate('appointments')}>
            View All Schedule
          </button>
        </div>

        <div className="card-body" style={{ padding: 0 }}>
          {todayAppointments.length === 0 ? (
            <div style={{ padding: 36, textAlign: 'center', color: 'var(--text-muted)' }}>
              <Clock size={36} style={{ margin: '0 auto 10px', opacity: 0.5 }} />
              <h4 style={{ fontWeight: 700 }}>No Patients in Active Queue</h4>
              <p style={{ fontSize: '0.85rem', marginTop: 4 }}>All scheduled consultations for today have been completed or none booked.</p>
            </div>
          ) : (
            <div className="table-container" style={{ border: 'none', borderRadius: 0 }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Slot Time</th>
                    <th>Patient Name</th>
                    <th>Chief Complaint / Reason</th>
                    <th>Status</th>
                    <th style={{ textAlign: 'right' }}>Clinical Action</th>
                  </tr>
                </thead>
                <tbody>
                  {todayAppointments.map(apt => (
                    <tr key={apt.id}>
                      <td style={{ fontWeight: 700, color: 'var(--text-primary)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <Clock size={14} color="var(--primary-600)" />
                          {apt.time}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{apt.date}</div>
                      </td>
                      <td>
                        <strong style={{ fontSize: '0.95rem' }}>{apt.patientName}</strong>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>ID: #{apt.patientId.toUpperCase()}</div>
                      </td>
                      <td>
                        <span style={{ fontSize: '0.88rem' }}>{apt.reason}</span>
                        {apt.symptoms && (
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Symptoms: {apt.symptoms}</div>
                        )}
                      </td>
                      <td>
                        <Badge status={apt.status} />
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <button
                          className="btn btn-primary btn-sm"
                          onClick={() => handleStartConsultation(apt)}
                        >
                          <PlayCircle size={15} />
                          {apt.status === 'in-consultation' ? 'Resume Consultation' : 'Start Consultation'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Consultation Modal */}
      {activeConsultationApt && (
        <DoctorConsultationModal
          isOpen={true}
          onClose={() => setActiveConsultationApt(null)}
          appointment={activeConsultationApt}
        />
      )}
    </div>
  );
}
