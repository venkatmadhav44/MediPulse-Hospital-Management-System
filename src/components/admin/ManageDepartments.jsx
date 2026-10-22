import React, { useState } from 'react';
import { useHospital } from '../../context/HospitalContext';
import { useToast } from '../common/Toast';
import Modal from '../common/Modal';
import {
  Building2,
  Plus,
  Edit,
  Users,
  BedDouble,
  Stethoscope,
  CheckCircle2
} from 'lucide-react';

export default function ManageDepartments() {
  const { departments, doctors, addDepartment, updateDepartment } = useHospital();
  const { addToast } = useToast();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingDept, setEditingDept] = useState(null);

  const [form, setForm] = useState({
    name: '',
    code: '',
    head: '',
    description: '',
    totalBeds: 20
  });

  const handleOpenAdd = () => {
    setForm({
      name: '',
      code: '',
      head: doctors[0]?.name || 'Dr. Sarah Jenkins',
      description: 'Clinical excellence and inpatient specialized care.',
      totalBeds: 24
    });
    setEditingDept(null);
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (dept) => {
    setForm({
      name: dept.name,
      code: dept.code,
      head: dept.head,
      description: dept.description,
      totalBeds: dept.totalBeds
    });
    setEditingDept(dept);
    setIsAddModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingDept) {
      updateDepartment(editingDept.id, {
        ...form,
        totalBeds: Number(form.totalBeds)
      });
      addToast(`Department ${form.name} updated!`, 'success');
    } else {
      addDepartment({
        ...form,
        totalBeds: Number(form.totalBeds)
      });
      addToast(`Department ${form.name} created successfully!`, 'success');
    }
    setIsAddModalOpen(false);
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Clinical Departments & Specializations</h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Manage hospital medical units, assigned department heads, bed capacities, and service lines.
          </p>
        </div>

        <button className="btn btn-primary" onClick={handleOpenAdd}>
          <Plus size={16} /> Add New Department
        </button>
      </div>

      {/* Departments Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 20 }}>
        {departments.map(dept => {
          const deptDocs = doctors.filter(d => d.departmentId === dept.id);

          return (
            <div key={dept.id} className="card card-hover" style={{ display: 'flex', flexDirection: 'column' }}>
              <div className="card-header">
                <div>
                  <span style={{ fontSize: '0.74rem', textTransform: 'uppercase', fontWeight: 800, color: 'var(--primary-600)' }}>
                    CODE: {dept.code}
                  </span>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginTop: 2 }}>{dept.name}</h3>
                </div>
                <button
                  className="btn-icon"
                  onClick={() => handleOpenEdit(dept)}
                  title="Edit Department"
                >
                  <Edit size={16} />
                </button>
              </div>

              <div className="card-body" style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 12 }}>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                  {dept.description}
                </p>

                <div style={{ background: 'var(--bg-surface-subtle)', borderRadius: 'var(--radius-md)', padding: 12, display: 'flex', flexDirection: 'column', gap: 8, fontSize: '0.82rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Department Head:</span>
                    <strong>{dept.head}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Specialist Doctors:</span>
                    <strong>{deptDocs.length} Physicians</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Bed Capacity:</span>
                    <strong style={{ color: 'var(--primary-600)' }}>{dept.totalBeds} Inpatient Beds</strong>
                  </div>
                </div>

                <div style={{ marginTop: 'auto', display: 'flex', flexWrap: 'wrap', gap: 6, paddingTop: 4 }}>
                  {deptDocs.map(d => (
                    <span key={d.id} className="badge badge-info" style={{ fontSize: '0.72rem' }}>
                      {d.name}
                    </span>
                  ))}
                  {deptDocs.length === 0 && (
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>No doctors currently assigned</span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add / Edit Department Modal */}
      {isAddModalOpen && (
        <Modal
          isOpen={true}
          onClose={() => setIsAddModalOpen(false)}
          title={editingDept ? `Edit Department: ${editingDept.name}` : "Create Medical Department"}
          subtitle="Define clinical department parameters and designated chief"
        >
          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">Department Name</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Pulmonology & Respiratory Medicine"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Department Code</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. PULM"
                  value={form.code}
                  onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
                  required
                />
              </div>
            </div>

            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">Designated Head of Department</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Dr. Catherine Brooks"
                  value={form.head}
                  onChange={(e) => setForm({ ...form, head: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Assigned Bed Capacity</label>
                <input
                  type="number"
                  className="form-input"
                  value={form.totalBeds}
                  onChange={(e) => setForm({ ...form, totalBeds: e.target.value })}
                  min="5"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Clinical Scope & Description</label>
              <textarea
                className="form-textarea"
                rows="2"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                required
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 14 }}>
              <button type="button" className="btn btn-secondary" onClick={() => setIsAddModalOpen(false)}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                {editingDept ? 'Save Changes' : 'Create Department'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
