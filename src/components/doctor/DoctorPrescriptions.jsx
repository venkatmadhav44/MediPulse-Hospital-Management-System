import React, { useState } from 'react';
import { useHospital } from '../../context/HospitalContext';
import { useAuth } from '../../context/AuthContext';
import Badge from '../common/Badge';
import Modal from '../common/Modal';
import {
  Pill,
  Search,
  Printer,
  FileCheck2,
  Calendar,
  User,
  Clock
} from 'lucide-react';

export default function DoctorPrescriptions() {
  const { prescriptions, hospitalInfo } = useHospital();
  const { currentUser } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRx, setSelectedRx] = useState(null);

  const currentDoctorName = currentUser?.name || 'Dr. Sarah Jenkins';
  const doctorRxList = prescriptions.filter(p =>
    p.doctorName.toLowerCase().includes(currentDoctorName.toLowerCase()) ||
    p.doctorName.includes('Jenkins')
  );

  const filteredRx = doctorRxList.filter(rx =>
    rx.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    rx.diagnosis.toLowerCase().includes(searchTerm.toLowerCase()) ||
    rx.medicines.some(m => m.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Issued Digital Prescriptions & Pharmacy Orders</h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          Historical record of all clinical electronic prescriptions authored by you.
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
                placeholder="Search by patient name, medication, or diagnosis..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              {filteredRx.length} Prescriptions Recorded
            </span>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: 18 }}>
        {filteredRx.map(rx => (
          <div key={rx.id} className="card card-hover" style={{ display: 'flex', flexDirection: 'column' }}>
            <div className="card-header">
              <div>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary-600)' }}>
                  #{rx.id.toUpperCase()} • {rx.date}
                </span>
                <h4 style={{ fontSize: '1.05rem', fontWeight: 800, marginTop: 2 }}>{rx.patientName}</h4>
              </div>
              <Badge status={rx.status} />
            </div>

            <div className="card-body" style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ fontSize: '0.85rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Diagnosis:</span>
                <strong style={{ display: 'block', color: 'var(--text-primary)' }}>{rx.diagnosis}</strong>
              </div>

              <div style={{ background: 'var(--bg-surface-subtle)', borderRadius: 'var(--radius-md)', padding: 10 }}>
                <div style={{ fontSize: '0.74rem', textTransform: 'uppercase', fontWeight: 700, color: 'var(--text-muted)', marginBottom: 6 }}>
                  Prescribed Medications ({rx.medicines.length})
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  {rx.medicines.map((m, idx) => (
                    <div key={idx} style={{ fontSize: '0.82rem', display: 'flex', justifyContent: 'space-between' }}>
                      <span><strong>{m.name}</strong> ({m.strength})</span>
                      <span style={{ color: 'var(--text-muted)' }}>{m.frequency}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'flex-end', paddingTop: 8 }}>
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => setSelectedRx(rx)}
                >
                  <FileCheck2 size={14} /> View Digital Script
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Printable Prescription Modal */}
      {selectedRx && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedRx(null)}
          title="Digital Prescription Copy"
          size="xl"
          footer={
            <>
              <button className="btn btn-secondary" onClick={() => setSelectedRx(null)}>
                Close
              </button>
              <button className="btn btn-primary" onClick={() => window.print()}>
                <Printer size={16} /> Print Prescription
              </button>
            </>
          }
        >
          <div className="printable-area prescription-sheet">
            <div className="rx-hospital-header">
              <div>
                <h2 style={{ color: '#0284c7', fontSize: '1.4rem', fontWeight: 800 }}>{hospitalInfo.name}</h2>
                <p style={{ fontSize: '0.8rem', color: '#64748b' }}>{hospitalInfo.address}</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontWeight: 700 }}>Ref: #{selectedRx.id.toUpperCase()}</div>
                <div style={{ fontSize: '0.78rem', color: '#64748b' }}>Date: {selectedRx.date}</div>
              </div>
            </div>

            <div className="rx-patient-bar">
              <div>
                <span style={{ color: '#64748b', fontSize: '0.75rem' }}>Patient</span>
                <div style={{ fontWeight: 700 }}>{selectedRx.patientName}</div>
              </div>
              <div>
                <span style={{ color: '#64748b', fontSize: '0.75rem' }}>Patient ID</span>
                <div style={{ fontWeight: 700 }}>#{selectedRx.patientId.toUpperCase()}</div>
              </div>
              <div>
                <span style={{ color: '#64748b', fontSize: '0.75rem' }}>Diagnosis</span>
                <div style={{ fontWeight: 700, color: '#0369a1' }}>{selectedRx.diagnosis}</div>
              </div>
            </div>

            <div className="rx-symbol">℞</div>

            <table className="rx-med-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Medication & Strength</th>
                  <th>Dosage Form</th>
                  <th>Frequency</th>
                  <th>Duration</th>
                </tr>
              </thead>
              <tbody>
                {selectedRx.medicines.map((m, idx) => (
                  <tr key={idx}>
                    <td>{idx + 1}</td>
                    <td><strong>{m.name}</strong> ({m.strength})</td>
                    <td>{m.form}</td>
                    <td style={{ color: '#0369a1', fontWeight: 600 }}>{m.frequency}</td>
                    <td>{m.duration}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {selectedRx.advice && (
              <div style={{ background: '#f8fafc', padding: 12, borderRadius: 6, border: '1px solid #e2e8f0', marginTop: 14, fontSize: '0.85rem' }}>
                <strong>Physician Advice:</strong> {selectedRx.advice}
              </div>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
}
