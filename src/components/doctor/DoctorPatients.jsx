import React, { useState } from 'react';
import { useHospital } from '../../context/HospitalContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../common/Toast';
import Modal from '../common/Modal';
import Badge from '../common/Badge';
import {
  Users,
  Search,
  Activity,
  Heart,
  AlertTriangle,
  FileText,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Save,
  Plus
} from 'lucide-react';

export default function DoctorPatients() {
  const { patients, appointments, prescriptions, updateVitals } = useHospital();
  const { currentUser } = useAuth();
  const { addToast } = useToast();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [isEditingVitals, setIsEditingVitals] = useState(false);
  const [vitalsForm, setVitalsForm] = useState({
    bloodPressure: '120/80 mmHg',
    heartRate: '72 bpm',
    temperature: '98.6 °F',
    spO2: '99%',
    bmi: '23.4'
  });

  const filteredPatients = patients.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.bloodGroup.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenEhr = (patient) => {
    setSelectedPatient(patient);
    setVitalsForm({
      bloodPressure: patient.vitals?.bloodPressure || '120/80 mmHg',
      heartRate: patient.vitals?.heartRate || '72 bpm',
      temperature: patient.vitals?.temperature || '98.6 °F',
      spO2: patient.vitals?.spO2 || '99%',
      bmi: patient.vitals?.bmi || '23.4'
    });
    setIsEditingVitals(false);
  };

  const handleSaveVitals = (e) => {
    e.preventDefault();
    updateVitals(selectedPatient.id, vitalsForm);
    addToast(`Vitals updated for ${selectedPatient.name}`, 'success');
    setIsEditingVitals(false);
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Assigned Patients & Medical History (EHR)</h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          Comprehensive patient directory, clinical vitals telemetry, allergy contraindications, and previous treatment plans.
        </p>
      </div>

      {/* Search Header */}
      <div className="card">
        <div className="card-body">
          <div className="search-filter-bar" style={{ margin: 0 }}>
            <div className="search-input-wrap">
              <Search size={18} />
              <input
                type="text"
                className="search-input"
                placeholder="Search patient by name, ID (#pat-1), or blood group..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Showing {filteredPatients.length} registered patients
            </span>
          </div>
        </div>
      </div>

      {/* Patient Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 18 }}>
        {filteredPatients.map(patient => {
          const patientVisits = appointments.filter(a => a.patientId === patient.id);

          return (
            <div key={patient.id} className="card card-hover" style={{ display: 'flex', flexDirection: 'column' }}>
              <div className="card-body" style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                    <div className="avatar avatar-md">
                      {patient.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </div>
                    <div>
                      <h3 style={{ fontSize: '1.05rem', fontWeight: 800 }}>{patient.name}</h3>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                        #{patient.id.toUpperCase()} • {patient.age} yrs, {patient.gender}
                      </div>
                    </div>
                  </div>
                  <Badge status={patient.admissionStatus} />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, background: 'var(--bg-surface-subtle)', padding: 10, borderRadius: 'var(--radius-sm)', fontSize: '0.8rem' }}>
                  <div>
                    <span style={{ color: 'var(--text-muted)' }}>Blood Group:</span>
                    <strong style={{ display: 'block', color: 'var(--rose-600)' }}>{patient.bloodGroup}</strong>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-muted)' }}>BP / Pulse:</span>
                    <strong style={{ display: 'block' }}>
                      {patient.vitals?.bloodPressure?.split(' ')[0] || '120/80'} / {patient.vitals?.heartRate?.split(' ')[0] || '72'}
                    </strong>
                  </div>
                </div>

                {patient.allergies && (
                  <div style={{ fontSize: '0.78rem', color: 'var(--rose-700)', background: 'var(--rose-50)', padding: '6px 10px', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <AlertTriangle size={13} flexShrink={0} />
                    <span>Allergy: {patient.allergies}</span>
                  </div>
                )}

                <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 8, borderTop: '1px solid var(--border-subtle)' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {patientVisits.length} Consultations
                  </span>
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => handleOpenEhr(patient)}
                  >
                    <FileText size={14} /> Open EHR File
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Comprehensive Patient EHR File Modal */}
      {selectedPatient && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedPatient(null)}
          title={`Electronic Health Record: ${selectedPatient.name}`}
          subtitle={`ID: #${selectedPatient.id.toUpperCase()} • Blood Group: ${selectedPatient.bloodGroup} • Status: ${selectedPatient.admissionStatus}`}
          size="xl"
          footer={
            <button className="btn btn-secondary" onClick={() => setSelectedPatient(null)}>
              Close EHR
            </button>
          }
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {/* Header Demographic & Allergy Details */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14, background: 'var(--bg-surface-subtle)', padding: 16, borderRadius: 'var(--radius-md)' }}>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Phone & Email</span>
                <div style={{ fontWeight: 600, fontSize: '0.88rem' }}>{selectedPatient.phone}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{selectedPatient.email}</div>
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Known Drug Allergies</span>
                <div style={{ fontWeight: 700, color: 'var(--rose-600)', fontSize: '0.88rem' }}>
                  {selectedPatient.allergies || 'None reported'}
                </div>
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Chronic Conditions</span>
                <div style={{ fontWeight: 600, fontSize: '0.88rem' }}>
                  {selectedPatient.chronicConditions || 'None known'}
                </div>
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Emergency Contact</span>
                <div style={{ fontWeight: 600, fontSize: '0.88rem' }}>
                  {selectedPatient.emergencyContact?.name} ({selectedPatient.emergencyContact?.relationship})
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{selectedPatient.emergencyContact?.phone}</div>
              </div>
            </div>

            {/* Clinical Vitals Section with Edit Option */}
            <div className="card">
              <div className="card-header">
                <span className="card-title" style={{ fontSize: '1rem' }}>
                  <Activity size={16} color="var(--emerald-600)" />
                  Recorded Clinical Vitals
                </span>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => setIsEditingVitals(!isEditingVitals)}
                >
                  {isEditingVitals ? 'Cancel Editing' : 'Update Vitals Telemetry'}
                </button>
              </div>

              <div className="card-body">
                {isEditingVitals ? (
                  <form onSubmit={handleSaveVitals}>
                    <div className="form-grid">
                      <div className="form-group">
                        <label className="form-label">Blood Pressure</label>
                        <input
                          type="text"
                          className="form-input"
                          value={vitalsForm.bloodPressure}
                          onChange={(e) => setVitalsForm({ ...vitalsForm, bloodPressure: e.target.value })}
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Heart Rate (Pulse)</label>
                        <input
                          type="text"
                          className="form-input"
                          value={vitalsForm.heartRate}
                          onChange={(e) => setVitalsForm({ ...vitalsForm, heartRate: e.target.value })}
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">SpO2 (Oxygen)</label>
                        <input
                          type="text"
                          className="form-input"
                          value={vitalsForm.spO2}
                          onChange={(e) => setVitalsForm({ ...vitalsForm, spO2: e.target.value })}
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Body Temperature</label>
                        <input
                          type="text"
                          className="form-input"
                          value={vitalsForm.temperature}
                          onChange={(e) => setVitalsForm({ ...vitalsForm, temperature: e.target.value })}
                        />
                      </div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 10 }}>
                      <button type="submit" className="btn btn-primary btn-sm">
                        <Save size={14} /> Save New Vitals
                      </button>
                    </div>
                  </form>
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12 }}>
                    <div className="vital-box">
                      <span className="vital-title">Blood Pressure</span>
                      <span className="vital-value" style={{ fontSize: '1.1rem', color: 'var(--primary-600)' }}>
                        {selectedPatient.vitals?.bloodPressure || '120/80'}
                      </span>
                    </div>
                    <div className="vital-box">
                      <span className="vital-title">Heart Rate</span>
                      <span className="vital-value" style={{ fontSize: '1.1rem', color: 'var(--rose-600)' }}>
                        {selectedPatient.vitals?.heartRate || '72 bpm'}
                      </span>
                    </div>
                    <div className="vital-box">
                      <span className="vital-title">SpO2 Oxygen</span>
                      <span className="vital-value" style={{ fontSize: '1.1rem', color: 'var(--teal-600)' }}>
                        {selectedPatient.vitals?.spO2 || '99%'}
                      </span>
                    </div>
                    <div className="vital-box">
                      <span className="vital-title">Temperature</span>
                      <span className="vital-value" style={{ fontSize: '1.1rem', color: 'var(--amber-600)' }}>
                        {selectedPatient.vitals?.temperature || '98.6 °F'}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Past Consultations & Prescriptions for this Patient */}
            <div className="card">
              <div className="card-header">
                <span className="card-title" style={{ fontSize: '1rem' }}>
                  <FileText size={16} color="var(--primary-600)" />
                  Historical Clinical Encounters & Prescriptions
                </span>
              </div>
              <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {appointments
                  .filter(a => a.patientId === selectedPatient.id)
                  .map(apt => (
                    <div key={apt.id} style={{ borderLeft: '3px solid var(--primary-500)', paddingLeft: 12 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <strong style={{ fontSize: '0.9rem' }}>{apt.diagnosis || apt.reason}</strong>
                        <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{apt.date} • {apt.time}</span>
                      </div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--primary-700)', fontWeight: 600 }}>
                        Attending: {apt.doctorName} ({apt.department})
                      </div>
                      {apt.notes && (
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: 2 }}>
                          {apt.notes}
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
