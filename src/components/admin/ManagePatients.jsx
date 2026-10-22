import React, { useState } from 'react';
import { useHospital } from '../../context/HospitalContext';
import { useToast } from '../common/Toast';
import Modal from '../common/Modal';
import Badge from '../common/Badge';
import {
  Users,
  Search,
  UserPlus,
  BedDouble,
  Heart,
  Phone,
  FileText,
  AlertTriangle,
  CheckCircle2,
  LogOut
} from 'lucide-react';

export default function ManagePatients() {
  const { patients, beds, addPatient, assignBed, vacateBed } = useHospital();
  const { addToast } = useToast();

  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [admittingPatient, setAdmittingPatient] = useState(null);
  const [selectedBedId, setSelectedBedId] = useState('');
  const [viewingPatient, setViewingPatient] = useState(null);

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    age: 30,
    gender: 'Male',
    bloodGroup: 'O+',
    address: '',
    allergies: 'None',
    chronicConditions: 'None'
  });

  const availableBeds = beds.filter(b => b.status === 'available');

  const filteredPatients = patients.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.phone.includes(searchTerm)
  );

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    const newPat = addPatient({
      ...form,
      age: Number(form.age),
      emergencyContact: { name: 'Family Contact', relationship: 'Relative', phone: form.phone }
    });
    addToast(`Patient ${form.name} registered with ID #${newPat.id.toUpperCase()}!`, 'success');
    setIsAddModalOpen(false);
  };

  const handleAdmitSubmit = (e) => {
    e.preventDefault();
    if (!selectedBedId) {
      addToast('Please choose an available bed', 'danger');
      return;
    }
    assignBed(selectedBedId, admittingPatient.id);
    addToast(`${admittingPatient.name} admitted to bed ${selectedBedId}`, 'success');
    setAdmittingPatient(null);
    setSelectedBedId('');
  };

  const handleDischarge = (patient) => {
    if (!patient.assignedBedId) return;
    vacateBed(patient.assignedBedId);
    addToast(`${patient.name} successfully discharged from ${patient.assignedBedId}`, 'info');
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Hospital Patient Registry & Inpatient Admissions</h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Administer patient electronic health folders, room/ward allocations, and hospital admissions.
          </p>
        </div>

        <button className="btn btn-primary" onClick={() => setIsAddModalOpen(true)}>
          <UserPlus size={16} /> Register New Patient
        </button>
      </div>

      {/* Search Bar */}
      <div className="card">
        <div className="card-body">
          <div className="search-filter-bar" style={{ margin: 0 }}>
            <div className="search-input-wrap">
              <Search size={18} />
              <input
                type="text"
                className="search-input"
                placeholder="Search patient by full name, ID (#pat-1), or telephone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              {filteredPatients.length} Patients Enrolled
            </span>
          </div>
        </div>
      </div>

      {/* Patients Master Table */}
      <div className="card">
        <div className="card-body" style={{ padding: 0 }}>
          <div className="table-container" style={{ border: 'none', borderRadius: 0 }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Patient ID & Name</th>
                  <th>Demographics</th>
                  <th>Blood Group</th>
                  <th>Contact Phone</th>
                  <th>Admission Status</th>
                  <th>Assigned Bed</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPatients.map(patient => (
                  <tr key={patient.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div className="avatar avatar-sm">
                          {patient.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </div>
                        <div>
                          <strong style={{ fontSize: '0.95rem' }}>{patient.name}</strong>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>#{patient.id.toUpperCase()}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      {patient.age} yrs • {patient.gender}
                    </td>
                    <td>
                      <span style={{ fontWeight: 800, color: 'var(--rose-600)' }}>{patient.bloodGroup}</span>
                    </td>
                    <td>{patient.phone}</td>
                    <td>
                      <Badge status={patient.admissionStatus} />
                    </td>
                    <td>
                      {patient.assignedBedId ? (
                        <span style={{ fontWeight: 700, color: 'var(--primary-600)' }}>
                          {patient.assignedBedId}
                        </span>
                      ) : (
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>None (Outpatient)</span>
                      )}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: 6 }}>
                        <button
                          className="btn btn-secondary btn-sm"
                          onClick={() => setViewingPatient(patient)}
                        >
                          <FileText size={14} /> File
                        </button>

                        {!patient.assignedBedId ? (
                          <button
                            className="btn btn-outline btn-sm"
                            onClick={() => {
                              setAdmittingPatient(patient);
                              setSelectedBedId(availableBeds[0]?.id || '');
                            }}
                          >
                            <BedDouble size={14} /> Admit
                          </button>
                        ) : (
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => handleDischarge(patient)}
                          >
                            <LogOut size={14} /> Discharge
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Register Patient Modal */}
      {isAddModalOpen && (
        <Modal
          isOpen={true}
          onClose={() => setIsAddModalOpen(false)}
          title="Register New Hospital Patient"
          subtitle="Generate clinical patient identification and initial medical profile"
        >
          <form onSubmit={handleRegisterSubmit}>
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">Full Name *</label>
                <input
                  type="text"
                  className="form-input"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Email Address *</label>
                <input
                  type="email"
                  className="form-input"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">Phone *</label>
                <input
                  type="text"
                  className="form-input"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Blood Group *</label>
                <select
                  className="form-select"
                  value={form.bloodGroup}
                  onChange={(e) => setForm({ ...form, bloodGroup: e.target.value })}
                >
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                </select>
              </div>
            </div>

            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">Age</label>
                <input
                  type="number"
                  className="form-input"
                  value={form.age}
                  onChange={(e) => setForm({ ...form, age: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Gender</label>
                <select
                  className="form-select"
                  value={form.gender}
                  onChange={(e) => setForm({ ...form, gender: e.target.value })}
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Residential Address</label>
              <input
                type="text"
                className="form-input"
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
              />
            </div>

            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">Known Allergies</label>
                <input
                  type="text"
                  className="form-input"
                  value={form.allergies}
                  onChange={(e) => setForm({ ...form, allergies: e.target.value })}
                  placeholder="e.g. Penicillin, Aspirin"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Chronic Conditions</label>
                <input
                  type="text"
                  className="form-input"
                  value={form.chronicConditions}
                  onChange={(e) => setForm({ ...form, chronicConditions: e.target.value })}
                  placeholder="e.g. Hypertension, Asthma"
                />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 14 }}>
              <button type="button" className="btn btn-secondary" onClick={() => setIsAddModalOpen(false)}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                Register Patient
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Admit Patient Modal */}
      {admittingPatient && (
        <Modal
          isOpen={true}
          onClose={() => setAdmittingPatient(null)}
          title={`Inpatient Ward Admission: ${admittingPatient.name}`}
          subtitle={`Patient ID #${admittingPatient.id.toUpperCase()}`}
        >
          <form onSubmit={handleAdmitSubmit}>
            <div className="form-group">
              <label className="form-label">Select Available Ward / ICU Bed</label>
              {availableBeds.length === 0 ? (
                <div style={{ background: 'var(--rose-50)', color: 'var(--rose-700)', padding: 12, borderRadius: 6, fontSize: '0.85rem' }}>
                  No available beds! Please vacate or clean occupied beds in Bed Matrix.
                </div>
              ) : (
                <select
                  className="form-select"
                  value={selectedBedId}
                  onChange={(e) => setSelectedBedId(e.target.value)}
                  required
                >
                  {availableBeds.map(b => (
                    <option key={b.id} value={b.id}>
                      {b.id.toUpperCase()} — {b.ward} ({b.roomNo}, {b.type})
                    </option>
                  ))}
                </select>
              )}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 20 }}>
              <button type="button" className="btn btn-secondary" onClick={() => setAdmittingPatient(null)}>
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={availableBeds.length === 0}
              >
                Confirm Ward Admission
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Viewing Patient Detail Modal */}
      {viewingPatient && (
        <Modal
          isOpen={true}
          onClose={() => setViewingPatient(null)}
          title={`Patient Record: ${viewingPatient.name}`}
          subtitle={`ID #${viewingPatient.id.toUpperCase()} • Blood Group: ${viewingPatient.bloodGroup}`}
          size="lg"
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14, fontSize: '0.88rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12, background: 'var(--bg-surface-subtle)', padding: 14, borderRadius: 8 }}>
              <div>
                <span style={{ color: 'var(--text-muted)' }}>Email:</span>
                <div><strong>{viewingPatient.email}</strong></div>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)' }}>Phone:</span>
                <div><strong>{viewingPatient.phone}</strong></div>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)' }}>Address:</span>
                <div><strong>{viewingPatient.address || 'N/A'}</strong></div>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)' }}>Status:</span>
                <div><Badge status={viewingPatient.admissionStatus} /></div>
              </div>
            </div>

            <div style={{ background: 'var(--rose-50)', border: '1px solid rgba(244, 63, 94, 0.2)', padding: 12, borderRadius: 6, color: 'var(--rose-700)' }}>
              <strong>Known Allergies:</strong> {viewingPatient.allergies} <br />
              <strong>Chronic Conditions:</strong> {viewingPatient.chronicConditions}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button className="btn btn-secondary" onClick={() => setViewingPatient(null)}>
                Close
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
