import React, { useState } from 'react';
import Modal from '../common/Modal';
import { useHospital } from '../../context/HospitalContext';
import { useToast } from '../common/Toast';
import {
  Stethoscope,
  Pill,
  Plus,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  FlaskConical,
  FileText,
  User,
  Activity
} from 'lucide-react';

export default function DoctorConsultationModal({ isOpen, onClose, appointment }) {
  const { patients, completeConsultation } = useHospital();
  const { addToast } = useToast();

  const patient = patients.find(p => p.id === appointment?.patientId) || {
    id: appointment?.patientId || 'pat-1',
    name: appointment?.patientName || 'Patient',
    age: 34,
    gender: 'Male',
    bloodGroup: 'O+',
    allergies: 'Penicillin',
    vitals: { bloodPressure: '120/80 mmHg', heartRate: '72 bpm', spO2: '99%', temperature: '98.6 °F' }
  };

  const [diagnosis, setDiagnosis] = useState('');
  const [clinicalNotes, setClinicalNotes] = useState('');
  const [advice, setAdvice] = useState('');
  const [medicines, setMedicines] = useState([
    {
      name: '',
      strength: '500 mg',
      form: 'Tablet',
      frequency: 'Twice daily (After meals)',
      duration: '5 Days',
      instructions: 'Take with warm water.'
    }
  ]);
  const [orderedTests, setOrderedTests] = useState([]);

  const commonTests = [
    'Complete Blood Count (CBC)',
    'Comprehensive Lipid Profile',
    'Glycated Hemoglobin (HbA1c)',
    'Chest Radiograph (X-Ray)',
    '12-Lead Resting Electrocardiogram (ECG)',
    'Arterial Blood Gas (ABG)'
  ];

  const handleAddMedicine = () => {
    setMedicines(prev => [
      ...prev,
      {
        name: '',
        strength: '10 mg',
        form: 'Tablet',
        frequency: 'Once daily (Morning)',
        duration: '7 Days',
        instructions: ''
      }
    ]);
  };

  const handleRemoveMedicine = (index) => {
    setMedicines(prev => prev.filter((_, idx) => idx !== index));
  };

  const handleMedChange = (index, field, value) => {
    setMedicines(prev => {
      const updated = [...prev];
      updated[index][field] = value;
      return updated;
    });
  };

  const toggleTestOrder = (testName) => {
    setOrderedTests(prev =>
      prev.includes(testName) ? prev.filter(t => t !== testName) : [...prev, testName]
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!diagnosis.trim()) {
      addToast('Please enter a primary diagnosis', 'danger');
      return;
    }

    const validMedicines = medicines.filter(m => m.name.trim() !== '');

    completeConsultation({
      appointmentId: appointment.id,
      diagnosis,
      notes: clinicalNotes,
      prescriptionMedicines: validMedicines,
      advice,
      orderedTests
    });

    addToast(
      `Consultation completed for ${patient.name}! Prescription & invoice generated.`,
      'success'
    );
    onClose();
  };

  if (!appointment) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Clinical Consultation & EHR Workspace"
      subtitle={`Patient: ${patient.name} • ${appointment.date} at ${appointment.time}`}
      size="xl"
    >
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {/* Patient Medical Banner */}
        <div
          style={{
            background: 'var(--bg-surface-subtle)',
            border: '1px solid var(--border-default)',
            borderRadius: 'var(--radius-md)',
            padding: 16,
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 16
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <User size={18} color="var(--primary-600)" />
              <strong style={{ fontSize: '1.05rem' }}>{patient.name}</strong>
              <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                ({patient.age} yrs, {patient.gender}, Blood: <strong>{patient.bloodGroup}</strong>)
              </span>
            </div>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: 4 }}>
              Chief Complaint: <strong>{appointment.reason}</strong>
              {appointment.symptoms && <span> • Symptoms: {appointment.symptoms}</span>}
            </div>
          </div>

          <div style={{ display: 'flex', gap: 14 }}>
            {patient.allergies && (
              <div style={{ background: 'var(--rose-50)', padding: '6px 12px', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(244, 63, 94, 0.3)', fontSize: '0.8rem', color: 'var(--rose-700)', display: 'flex', alignItems: 'center', gap: 6 }}>
                <AlertTriangle size={14} />
                <span>Allergies: <strong>{patient.allergies}</strong></span>
              </div>
            )}
            <div style={{ background: 'var(--primary-50)', padding: '6px 12px', borderRadius: 'var(--radius-sm)', fontSize: '0.8rem', color: 'var(--primary-800)' }}>
              BP: <strong>{patient.vitals?.bloodPressure || '120/80'}</strong> | Pulse: <strong>{patient.vitals?.heartRate || '72'}</strong>
            </div>
          </div>
        </div>

        {/* Diagnosis & Examination Notes */}
        <div className="form-grid">
          <div className="form-group">
            <label className="form-label" style={{ color: 'var(--primary-700)' }}>
              <Stethoscope size={15} /> Primary Clinical Diagnosis *
            </label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Essential Pre-Hypertension (ICD-10 I10), Sinus Arrhythmia..."
              value={diagnosis}
              onChange={(e) => setDiagnosis(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Consultation Advice & Patient Guidance</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Low sodium diet, 30 min cardio daily, repeat lipid panel in 4 weeks"
              value={advice}
              onChange={(e) => setAdvice(e.target.value)}
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Physician Clinical Notes & Observations</label>
          <textarea
            className="form-textarea"
            rows="2"
            placeholder="Document examination findings, heart sounds, chest auscultation, clinical rationale..."
            value={clinicalNotes}
            onChange={(e) => setClinicalNotes(e.target.value)}
          />
        </div>

        {/* Digital Prescription Builder */}
        <div style={{ border: '1px solid var(--border-default)', borderRadius: 'var(--radius-md)', padding: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <span style={{ fontWeight: 700, fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: 6 }}>
              <Pill size={16} color="var(--emerald-600)" />
              Digital Prescription Builder
            </span>
            <button type="button" className="btn btn-secondary btn-sm" onClick={handleAddMedicine}>
              <Plus size={14} /> Add Medicine
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {medicines.map((med, idx) => (
              <div
                key={idx}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '2fr 1fr 1fr 1.5fr 1fr 1.5fr auto',
                  gap: 8,
                  alignItems: 'center',
                  background: 'var(--bg-surface-subtle)',
                  padding: '8px 10px',
                  borderRadius: 'var(--radius-sm)'
                }}
              >
                <input
                  type="text"
                  className="form-input"
                  placeholder="Medicine Name (e.g. Atorvastatin)"
                  value={med.name}
                  onChange={(e) => handleMedChange(idx, 'name', e.target.value)}
                  style={{ padding: '6px 10px', fontSize: '0.84rem' }}
                />
                <input
                  type="text"
                  className="form-input"
                  placeholder="Strength"
                  value={med.strength}
                  onChange={(e) => handleMedChange(idx, 'strength', e.target.value)}
                  style={{ padding: '6px 8px', fontSize: '0.84rem' }}
                />
                <select
                  className="form-select"
                  value={med.form}
                  onChange={(e) => handleMedChange(idx, 'form', e.target.value)}
                  style={{ padding: '6px 8px', fontSize: '0.84rem' }}
                >
                  <option value="Tablet">Tablet</option>
                  <option value="Capsule">Capsule</option>
                  <option value="Syrup">Syrup</option>
                  <option value="Injection">Injection</option>
                  <option value="Inhaler">Inhaler</option>
                  <option value="Drops">Drops</option>
                </select>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Frequency"
                  value={med.frequency}
                  onChange={(e) => handleMedChange(idx, 'frequency', e.target.value)}
                  style={{ padding: '6px 8px', fontSize: '0.84rem' }}
                />
                <input
                  type="text"
                  className="form-input"
                  placeholder="Duration"
                  value={med.duration}
                  onChange={(e) => handleMedChange(idx, 'duration', e.target.value)}
                  style={{ padding: '6px 8px', fontSize: '0.84rem' }}
                />
                <input
                  type="text"
                  className="form-input"
                  placeholder="Instructions"
                  value={med.instructions}
                  onChange={(e) => handleMedChange(idx, 'instructions', e.target.value)}
                  style={{ padding: '6px 8px', fontSize: '0.84rem' }}
                />
                {medicines.length > 1 && (
                  <button
                    type="button"
                    className="btn-icon"
                    onClick={() => handleRemoveMedicine(idx)}
                    style={{ color: 'var(--rose-600)' }}
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Order Diagnostic Laboratory Tests */}
        <div style={{ border: '1px solid var(--border-default)', borderRadius: 'var(--radius-md)', padding: 16 }}>
          <span style={{ fontWeight: 700, fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
            <FlaskConical size={16} color="var(--indigo-600)" />
            Order Hospital Diagnostic Laboratory Tests (Optional)
          </span>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 10 }}>
            {commonTests.map(test => {
              const isChecked = orderedTests.includes(test);
              return (
                <label
                  key={test}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    fontSize: '0.85rem',
                    padding: '8px 12px',
                    borderRadius: 'var(--radius-sm)',
                    background: isChecked ? 'var(--primary-50)' : 'var(--bg-surface-subtle)',
                    border: isChecked ? '1px solid var(--primary-400)' : '1px solid var(--border-subtle)',
                    cursor: 'pointer'
                  }}
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => toggleTestOrder(test)}
                  />
                  <span>{test}</span>
                </label>
              );
            })}
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 10 }}>
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="btn btn-success btn-lg">
            <CheckCircle2 size={18} /> Complete Consultation & Issue Prescription
          </button>
        </div>
      </form>
    </Modal>
  );
}
