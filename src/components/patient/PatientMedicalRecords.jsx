import React from 'react';
import { useHospital } from '../../context/HospitalContext';
import { useAuth } from '../../context/AuthContext';
import Badge from '../common/Badge';
import {
  FileText,
  Activity,
  AlertCircle,
  Clock,
  Stethoscope,
  Heart,
  Pill,
  Download,
  Calendar
} from 'lucide-react';

export default function PatientMedicalRecords() {
  const { patients, appointments, prescriptions } = useHospital();
  const { currentUser } = useAuth();

  const currentPatient = patients.find(p => p.id === (currentUser?.id || 'pat-1')) || patients[0];
  const patientAppointments = appointments.filter(a => a.patientId === currentPatient.id);
  const completedVisits = patientAppointments.filter(a => a.status === 'completed');

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Electronic Health Record (EHR)</h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          Comprehensive patient medical summary, clinical histories, allergy warnings, and historical consultations.
        </p>
      </div>

      {/* Patient Health Summary Bar */}
      <div className="card" style={{ background: 'linear-gradient(to right, var(--bg-card), var(--bg-surface-subtle))' }}>
        <div className="card-body" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
          <div>
            <span style={{ fontSize: '0.74rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700 }}>Blood Group</span>
            <div style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--rose-600)', marginTop: 2 }}>
              {currentPatient.bloodGroup}
            </div>
          </div>
          <div>
            <span style={{ fontSize: '0.74rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700 }}>Known Allergies</span>
            <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--rose-600)', marginTop: 2 }}>
              {currentPatient.allergies}
            </div>
          </div>
          <div>
            <span style={{ fontSize: '0.74rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700 }}>Chronic Conditions</span>
            <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: 2 }}>
              {currentPatient.chronicConditions}
            </div>
          </div>
          <div>
            <span style={{ fontSize: '0.74rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700 }}>Current Status</span>
            <div style={{ marginTop: 2 }}>
              <Badge status={currentPatient.admissionStatus} />
            </div>
          </div>
        </div>
      </div>

      {/* 2-Column Clinical Encounters & Vitals History */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: 20 }}>
        {/* Clinical Consultations Timeline */}
        <div className="card">
          <div className="card-header">
            <span className="card-title">
              <Stethoscope size={18} color="var(--primary-600)" />
              Clinical Encounters & Diagnoses
            </span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              {completedVisits.length} Consultations
            </span>
          </div>

          <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {completedVisits.length === 0 ? (
              <div style={{ textAlign: 'center', padding: 20, color: 'var(--text-muted)' }}>
                No completed clinical consultations on file yet.
              </div>
            ) : (
              completedVisits.map(visit => (
                <div
                  key={visit.id}
                  style={{
                    borderLeft: '3px solid var(--primary-500)',
                    paddingLeft: 14,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 6
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <strong style={{ fontSize: '0.95rem', color: 'var(--text-primary)' }}>
                      {visit.diagnosis || 'Clinical Followup'}
                    </strong>
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{visit.date}</span>
                  </div>

                  <div style={{ fontSize: '0.84rem', color: 'var(--primary-700)', fontWeight: 600 }}>
                    {visit.doctorName} • {visit.department}
                  </div>

                  <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                    <strong>Reason:</strong> {visit.reason}
                  </div>

                  {visit.notes && (
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', background: 'var(--bg-surface-subtle)', padding: 8, borderRadius: 'var(--radius-sm)' }}>
                      <strong>Doctor Notes:</strong> {visit.notes}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Vitals History & Health Metrics */}
        <div className="card">
          <div className="card-header">
            <span className="card-title">
              <Activity size={18} color="var(--emerald-600)" />
              Clinical Vitals History & Parameters
            </span>
          </div>

          <div className="card-body">
            <div className="table-container" style={{ border: 'none' }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Parameter</th>
                    <th>Measured Value</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Blood Pressure</td>
                    <td style={{ fontWeight: 700 }}>{currentPatient.vitals?.bloodPressure || '120/80 mmHg'}</td>
                    <td><span className="badge badge-success">Optimal</span></td>
                  </tr>
                  <tr>
                    <td>Pulse (Heart Rate)</td>
                    <td style={{ fontWeight: 700 }}>{currentPatient.vitals?.heartRate || '72 bpm'}</td>
                    <td><span className="badge badge-success">Resting Normal</span></td>
                  </tr>
                  <tr>
                    <td>Oxygen Saturation (SpO2)</td>
                    <td style={{ fontWeight: 700 }}>{currentPatient.vitals?.spO2 || '99%'}</td>
                    <td><span className="badge badge-success">Healthy</span></td>
                  </tr>
                  <tr>
                    <td>Body Temperature</td>
                    <td style={{ fontWeight: 700 }}>{currentPatient.vitals?.temperature || '98.6 °F'}</td>
                    <td><span className="badge badge-success">Normothermic</span></td>
                  </tr>
                  <tr>
                    <td>Respiratory Rate</td>
                    <td style={{ fontWeight: 700 }}>{currentPatient.vitals?.respiratoryRate || '16 bpm'}</td>
                    <td><span className="badge badge-success">Normal</span></td>
                  </tr>
                  <tr>
                    <td>Body Mass Index (BMI)</td>
                    <td style={{ fontWeight: 700 }}>{currentPatient.vitals?.bmi || '23.4'}</td>
                    <td><span className="badge badge-info">Standard</span></td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div style={{ marginTop: 16, textAlign: 'right' }}>
              <button className="btn btn-secondary btn-sm" onClick={() => window.print()}>
                <Download size={15} /> Export Health Record Summary
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
