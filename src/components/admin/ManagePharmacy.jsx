import React, { useState } from 'react';
import { useHospital } from '../../context/HospitalContext';
import { useToast } from '../common/Toast';
import Badge from '../common/Badge';
import Modal from '../common/Modal';
import {
  Pill,
  Search,
  CheckCircle2,
  FileText,
  AlertCircle
} from 'lucide-react';

export default function ManagePharmacy() {
  const { prescriptions } = useHospital();
  const { addToast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRx, setSelectedRx] = useState(null);

  const filteredPrescriptions = prescriptions.filter(p =>
    p.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.doctorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.diagnosis.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Central Hospital Pharmacy & Medication Dispensary</h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          Monitor clinical prescriptions, dispense status, formulary compliance, and active medication courses.
        </p>
      </div>

      <div className="card">
        <div className="card-body">
          <div className="search-filter-bar" style={{ margin: 0 }}>
            <div className="search-input-wrap">
              <Search size={18} />
              <input
                type="text"
                className="search-input"
                placeholder="Search by patient, physician, or diagnosis..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              {filteredPrescriptions.length} Prescriptions Logged
            </span>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-body" style={{ padding: 0 }}>
          <div className="table-container" style={{ border: 'none', borderRadius: 0 }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Prescription ID</th>
                  <th>Patient Name</th>
                  <th>Attending Physician</th>
                  <th>Diagnosis</th>
                  <th>Items Count</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPrescriptions.map(rx => (
                  <tr key={rx.id}>
                    <td style={{ fontWeight: 700, color: 'var(--primary-600)' }}>
                      #{rx.id.toUpperCase()}
                    </td>
                    <td>
                      <strong>{rx.patientName}</strong>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>#{rx.patientId.toUpperCase()}</div>
                    </td>
                    <td>{rx.doctorName}</td>
                    <td>{rx.diagnosis}</td>
                    <td>
                      <span className="badge badge-neutral">{rx.medicines.length} Medicines</span>
                    </td>
                    <td>{rx.date}</td>
                    <td><Badge status={rx.status} /></td>
                    <td style={{ textAlign: 'right' }}>
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => setSelectedRx(rx)}
                      >
                        <FileText size={14} /> Review Rx
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {selectedRx && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedRx(null)}
          title={`Prescription Details: #${selectedRx.id.toUpperCase()}`}
          subtitle={`Patient: ${selectedRx.patientName} • Prescribed by: ${selectedRx.doctorName}`}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ background: 'var(--bg-surface-subtle)', padding: 12, borderRadius: 8 }}>
              <strong>Clinical Diagnosis:</strong> {selectedRx.diagnosis}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {selectedRx.medicines.map((m, idx) => (
                <div key={idx} style={{ background: 'var(--bg-surface-subtle)', padding: 10, borderRadius: 6, display: 'flex', justifyContent: 'space-between' }}>
                  <div>
                    <strong>{m.name}</strong> ({m.strength}, {m.form})
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{m.instructions}</div>
                  </div>
                  <div style={{ textAlign: 'right', fontSize: '0.82rem', color: 'var(--primary-700)', fontWeight: 600 }}>
                    {m.frequency} • {m.duration}
                  </div>
                </div>
              ))}
            </div>

            {selectedRx.advice && (
              <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                <strong>Advice:</strong> {selectedRx.advice}
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 10 }}>
              <button className="btn btn-secondary" onClick={() => setSelectedRx(null)}>
                Close
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
