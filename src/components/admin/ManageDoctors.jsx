import React, { useState } from 'react';
import { useHospital } from '../../context/HospitalContext';
import { useToast } from '../common/Toast';
import Modal from '../common/Modal';
import Badge from '../common/Badge';
import {
  Stethoscope,
  Plus,
  Search,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  Star,
  Phone,
  Mail,
  Building2
} from 'lucide-react';

export default function ManageDoctors() {
  const { doctors, departments, addDoctor, updateDoctor, toggleDoctorStatus } = useHospital();
  const { addToast } = useToast();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState(null);
  // HCI: Confirmation state for destructive action — Shneiderman Rule 4 (Error Prevention)
  // Nielsen H3 (User Control): user can cancel before the irreversible status change
  const [pendingToggleDoc, setPendingToggleDoc] = useState(null);

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    departmentId: 'dept-cardio',
    specialization: 'Cardiology',
    qualifications: 'MD, FACC',
    experienceYears: 10,
    consultationFee: 150,
    roomNo: 'Room 101, Main Block',
    bio: 'Dedicated hospital specialist providing advanced clinical care.'
  });

  const filteredDoctors = doctors.filter(doc => {
    const matchesSearch =
      doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.specialization.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = selectedDept === 'all' || doc.departmentId === selectedDept;
    return matchesSearch && matchesDept;
  });

  const handleOpenAdd = () => {
    setForm({
      name: '',
      email: '',
      phone: '',
      departmentId: departments[0]?.id || 'dept-cardio',
      specialization: departments[0]?.name || 'Cardiology',
      qualifications: 'MD, MBBS',
      experienceYears: 8,
      consultationFee: 140,
      roomNo: 'Room 205, Clinic Wing',
      bio: 'Board-certified medical specialist dedicated to patient wellness and clinical precision.'
    });
    setEditingDoctor(null);
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (doc) => {
    setForm({
      name: doc.name,
      email: doc.email,
      phone: doc.phone,
      departmentId: doc.departmentId,
      specialization: doc.specialization,
      qualifications: doc.qualifications,
      experienceYears: doc.experienceYears,
      consultationFee: doc.consultationFee,
      roomNo: doc.roomNo,
      bio: doc.bio
    });
    setEditingDoctor(doc);
    setIsAddModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const dept = departments.find(d => d.id === form.departmentId);
    const spec = dept ? dept.name : form.specialization;

    if (editingDoctor) {
      updateDoctor(editingDoctor.id, {
        ...form,
        specialization: spec,
        experienceYears: Number(form.experienceYears),
        consultationFee: Number(form.consultationFee)
      });
      addToast(`Doctor ${form.name} updated successfully!`, 'success');
    } else {
      addDoctor({
        ...form,
        specialization: spec,
        experienceYears: Number(form.experienceYears),
        consultationFee: Number(form.consultationFee)
      });
      addToast(`Dr. ${form.name} added to medical roster!`, 'success');
    }
    setIsAddModalOpen(false);
  };

  const handleToggleActive = (doc) => {
    // HCI: Shneiderman Rule 4 — Error Prevention
    // Deactivating a doctor is a significant action with clinical implications.
    // A confirmation step prevents accidental status changes.
    if (doc.active) {
      // Only confirm before DEACTIVATING (destructive direction)
      setPendingToggleDoc(doc);
    } else {
      // Re-activating is safe — do it immediately
      toggleDoctorStatus(doc.id);
      addToast(`${doc.name} has been re-activated successfully.`, 'success');
    }
  };

  const handleConfirmDeactivate = () => {
    if (!pendingToggleDoc) return;
    toggleDoctorStatus(pendingToggleDoc.id);
    addToast(`${pendingToggleDoc.name} has been deactivated.`, 'warning');
    setPendingToggleDoc(null);
  };

  const handleCancelDeactivate = () => {
    setPendingToggleDoc(null);
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Medical Staff & Doctor Management</h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Administer physician credentials, clinical departments, consultation fees, and active statuses.
          </p>
        </div>

        <button className="btn btn-primary" onClick={handleOpenAdd}>
          <Plus size={16} /> Add New Doctor
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="card">
        <div className="card-body">
          <div className="search-filter-bar" style={{ margin: 0 }}>
            <div className="search-input-wrap">
              <Search size={18} />
              <input
                type="text"
                className="search-input"
                placeholder="Search doctors by name or specialty..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="filter-group">
              <select
                className="form-select"
                style={{ width: 'auto', minWidth: 200 }}
                value={selectedDept}
                onChange={(e) => setSelectedDept(e.target.value)}
              >
                <option value="all">All Departments ({doctors.length})</option>
                {departments.map(d => (
                  <option key={d.id} value={d.id}>{d.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Doctors Table */}
      <div className="card">
        <div className="card-body" style={{ padding: 0 }}>
          <div className="table-container" style={{ border: 'none', borderRadius: 0 }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Physician Name</th>
                  <th>Specialization &amp; Dept</th>
                  <th>Qualifications &amp; Exp</th>
                  <th>Fee</th>
                  <th>Rating</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredDoctors.length === 0 ? (
                  /* HCI: Empty State — Nielsen H6 (Recognition rather than Recall) */
                  /* Gestalt: Clear visual feedback when no data matches the filter */
                  <tr>
                    <td colSpan={7} style={{ textAlign: 'center', padding: '40px 20px' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, color: 'var(--text-muted)' }}>
                        <Stethoscope size={40} style={{ opacity: 0.3 }} aria-hidden="true" />
                        <p style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-secondary)' }}>No doctors found</p>
                        <p style={{ fontSize: '0.85rem' }}>
                          {searchTerm
                            ? `No results for "${searchTerm}" in the selected department. Try a different name or specialty.`
                            : 'No doctors are registered in this department yet.'}
                        </p>
                        {searchTerm && (
                          <button
                            className="btn btn-outline btn-sm"
                            onClick={() => { setSearchTerm(''); setSelectedDept('all'); }}
                          >
                            Clear Filters
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredDoctors.map(doc => (

                  <tr key={doc.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div className="avatar avatar-sm">
                          {doc.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </div>
                        <div>
                          <strong style={{ fontSize: '0.95rem' }}>{doc.name}</strong>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{doc.email}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600, color: 'var(--primary-700)' }}>{doc.specialization}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{doc.roomNo}</div>
                    </td>
                    <td>
                      <div style={{ fontSize: '0.85rem' }}>{doc.qualifications}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{doc.experienceYears} Years Clinical</div>
                    </td>
                    <td style={{ fontWeight: 700, color: 'var(--emerald-600)' }}>
                      ${doc.consultationFee}
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontWeight: 700, fontSize: '0.85rem' }}>
                        <Star size={13} fill="#eab308" color="#eab308" /> {doc.rating}
                      </div>
                    </td>
                    <td>
                      <Badge status={doc.active ? 'active' : 'inactive'} />
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: 6 }}>
                        <button
                          className="btn btn-secondary btn-sm"
                          onClick={() => handleOpenEdit(doc)}
                          title="Edit Doctor Details"
                          aria-label={`Edit details for ${doc.name}`}
                        >
                          <Edit size={14} aria-hidden="true" /> Edit
                        </button>
                        <button
                          className={`btn ${doc.active ? 'btn-warning' : 'btn-success'} btn-sm`}
                          onClick={() => handleToggleActive(doc)}
                          title={doc.active ? 'Deactivate this doctor account' : 'Activate this doctor account'}
                          aria-label={doc.active ? `Deactivate ${doc.name}` : `Activate ${doc.name}`}
                        >
                          {doc.active ? 'Deactivate' : 'Activate'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add / Edit Doctor Modal */}
      {isAddModalOpen && (
        <Modal
          isOpen={true}
          onClose={() => setIsAddModalOpen(false)}
          title={editingDoctor ? `Edit Doctor: ${editingDoctor.name}` : "Add New Medical Specialist"}
          subtitle="Register physician credentials and OPD consultation parameters"
          size="lg"
        >
          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">Doctor Full Name (with Title)</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Dr. Catherine Brooks"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Clinical Department</label>
                <select
                  className="form-select"
                  value={form.departmentId}
                  onChange={(e) => setForm({ ...form, departmentId: e.target.value })}
                  required
                >
                  {departments.map(d => (
                    <option key={d.id} value={d.id}>{d.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input
                  type="email"
                  className="form-input"
                  placeholder="doctor@medipulse.org"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Contact Telephone</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="+1 (555) 000-0000"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">Qualifications & Degrees</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. MD, FACC, FRCS"
                  value={form.qualifications}
                  onChange={(e) => setForm({ ...form, qualifications: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Years of Experience</label>
                <input
                  type="number"
                  className="form-input"
                  value={form.experienceYears}
                  onChange={(e) => setForm({ ...form, experienceYears: e.target.value })}
                  min="1"
                  required
                />
              </div>
            </div>

            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">Consultation Fee ($ USD)</label>
                <input
                  type="number"
                  className="form-input"
                  value={form.consultationFee}
                  onChange={(e) => setForm({ ...form, consultationFee: e.target.value })}
                  min="20"
                  step="10"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">OPD Chamber / Room Location</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Room 302, Tower B"
                  value={form.roomNo}
                  onChange={(e) => setForm({ ...form, roomNo: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Professional Clinical Bio</label>
              <textarea
                className="form-textarea"
                rows="2"
                value={form.bio}
                onChange={(e) => setForm({ ...form, bio: e.target.value })}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 14 }}>
              <button type="button" className="btn btn-secondary" onClick={() => setIsAddModalOpen(false)}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                {editingDoctor ? 'Save Changes' : 'Add Doctor to Roster'}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* HCI: Deactivation Confirmation Modal — Shneiderman Rule 4 (Error Prevention)
          Nielsen H3 (User Control & Freedom): User can cancel before irreversible action.
          The warning modal provides a 'safe exit' (Cancel) and a clear consequence (Deactivate). */}
      {pendingToggleDoc && (
        <Modal
          isOpen={true}
          onClose={handleCancelDeactivate}
          title="Confirm Doctor Deactivation"
          subtitle="This action will prevent the doctor from receiving new appointments."
          size="md"
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 14,
                background: 'rgba(245, 158, 11, 0.08)',
                border: '1px solid rgba(245, 158, 11, 0.3)',
                borderRadius: 'var(--radius-md)',
                padding: '14px 16px'
              }}
            >
              <span style={{ fontSize: '1.5rem' }} aria-hidden="true">⚠️</span>
              <div>
                <p style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-primary)' }}>
                  Deactivate {pendingToggleDoc.name}?
                </p>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: 4, lineHeight: 1.5 }}>
                  This doctor will be marked as <strong>Inactive</strong>. Their existing appointments will remain,
                  but no new bookings will be possible until the account is re-activated.
                </p>
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
              <button
                className="btn btn-secondary"
                onClick={handleCancelDeactivate}
                aria-label="Cancel — keep doctor active"
              >
                Cancel
              </button>
              <button
                className="btn btn-danger"
                onClick={handleConfirmDeactivate}
                aria-label={`Confirm deactivation of ${pendingToggleDoc.name}`}
              >
                Yes, Deactivate
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
