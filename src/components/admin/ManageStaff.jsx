import React, { useState } from 'react';
import { useHospital } from '../../context/HospitalContext';
import { useToast } from '../common/Toast';
import Modal from '../common/Modal';
import Badge from '../common/Badge';
import {
  Users,
  Plus,
  Search,
  Edit,
  Trash2,
  Clock,
  Phone,
  Building
} from 'lucide-react';

export default function ManageStaff() {
  const { staff, departments, addStaff, updateStaff, deleteStaff } = useHospital();
  const { addToast } = useToast();

  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState(null);

  const [form, setForm] = useState({
    name: '',
    role: 'Staff Nurse',
    department: 'Intensive Care Unit (ICU)',
    shift: 'Morning (07:00 - 15:00)',
    phone: '+1 (555) 000-1111',
    status: 'On Duty'
  });

  const filteredStaff = staff.filter(s =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenAdd = () => {
    setForm({
      name: '',
      role: 'Staff Nurse',
      department: departments[0]?.name || 'Cardiology',
      shift: 'Day (08:00 - 16:00)',
      phone: '+1 (555) 777-2200',
      status: 'On Duty'
    });
    setEditingStaff(null);
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (stf) => {
    setForm({
      name: stf.name,
      role: stf.role,
      department: stf.department,
      shift: stf.shift,
      phone: stf.phone,
      status: stf.status
    });
    setEditingStaff(stf);
    setIsAddModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingStaff) {
      updateStaff(editingStaff.id, form);
      addToast(`Staff member ${form.name} updated!`, 'success');
    } else {
      addStaff(form);
      addToast(`${form.name} added to hospital personnel roster!`, 'success');
    }
    setIsAddModalOpen(false);
  };

  const handleDelete = (id, name) => {
    deleteStaff(id);
    addToast(`Staff member ${name} removed from roster`, 'info');
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Hospital Personnel & Staff Management</h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Manage clinical nursing personnel, diagnostic technicians, pharmacists, and intake coordinators.
          </p>
        </div>

        <button className="btn btn-primary" onClick={handleOpenAdd}>
          <Plus size={16} /> Add Staff Member
        </button>
      </div>

      <div className="card">
        <div className="card-body">
          <div className="search-filter-bar" style={{ margin: 0 }}>
            <div className="search-input-wrap">
              <Search size={18} />
              <input
                type="text"
                className="search-input"
                placeholder="Search staff by name, role, or department..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              {filteredStaff.length} Personnel Enrolled
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
                  <th>Staff Name</th>
                  <th>Clinical Role</th>
                  <th>Department / Unit</th>
                  <th>Assigned Shift</th>
                  <th>Contact Phone</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredStaff.map(stf => (
                  <tr key={stf.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div className="avatar avatar-sm">
                          {stf.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </div>
                        <strong style={{ fontSize: '0.92rem' }}>{stf.name}</strong>
                      </div>
                    </td>
                    <td style={{ fontWeight: 600, color: 'var(--primary-700)' }}>{stf.role}</td>
                    <td>{stf.department}</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.82rem' }}>
                        <Clock size={13} color="var(--text-muted)" /> {stf.shift}
                      </div>
                    </td>
                    <td>{stf.phone}</td>
                    <td><Badge status={stf.status} /></td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: 6 }}>
                        <button
                          className="btn btn-secondary btn-sm"
                          onClick={() => handleOpenEdit(stf)}
                        >
                          <Edit size={14} />
                        </button>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleDelete(stf.id, stf.name)}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add / Edit Staff Modal */}
      {isAddModalOpen && (
        <Modal
          isOpen={true}
          onClose={() => setIsAddModalOpen(false)}
          title={editingStaff ? `Edit Personnel: ${editingStaff.name}` : "Add Hospital Staff Member"}
          subtitle="Assign department duty, shift interval, and operational responsibilities"
        >
          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  className="form-input"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Role Title</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. ICU Charge Nurse, Pharmacist"
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">Department / Unit</label>
                <input
                  type="text"
                  className="form-input"
                  value={form.department}
                  onChange={(e) => setForm({ ...form, department: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Assigned Shift</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Morning (07:00 - 15:00)"
                  value={form.shift}
                  onChange={(e) => setForm({ ...form, shift: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">Phone Number</label>
                <input
                  type="text"
                  className="form-input"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Operational Status</label>
                <select
                  className="form-select"
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                >
                  <option value="On Duty">On Duty</option>
                  <option value="Off Duty">Off Duty</option>
                  <option value="On Leave">On Leave</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 14 }}>
              <button type="button" className="btn btn-secondary" onClick={() => setIsAddModalOpen(false)}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                {editingStaff ? 'Save Changes' : 'Add Staff Member'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
