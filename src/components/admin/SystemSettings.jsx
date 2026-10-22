import React, { useState } from 'react';
import { useHospital } from '../../context/HospitalContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../common/Toast';
import Badge from '../common/Badge';
import {
  Settings,
  Building,
  Users,
  RotateCcw,
  Save,
  ShieldCheck,
  AlertTriangle,
  Lock
} from 'lucide-react';

export default function SystemSettings() {
  const { hospitalInfo, updateHospitalInfo, resetToDefaults, doctors, patients } = useHospital();
  const { addToast } = useToast();

  const [infoForm, setInfoForm] = useState({
    name: hospitalInfo.name || '',
    tagline: hospitalInfo.tagline || '',
    registrationNo: hospitalInfo.registrationNo || '',
    address: hospitalInfo.address || '',
    phone: hospitalInfo.phone || '',
    emergencyHotline: hospitalInfo.emergencyHotline || '',
    email: hospitalInfo.email || ''
  });

  const [userAccounts, setUserAccounts] = useState([
    { id: 'usr-admin', name: 'Dr. Eleanor Vance', role: 'Admin', email: 'admin@medipulse.org', status: 'Active' },
    { id: 'usr-doc1', name: 'Dr. Sarah Jenkins', role: 'Doctor (Cardiology)', email: 'doctor@medipulse.org', status: 'Active' },
    { id: 'usr-doc2', name: 'Dr. Marcus Vance', role: 'Doctor (Neurology)', email: 'm.vance@medipulse.org', status: 'Active' },
    { id: 'usr-pat1', name: 'Alex Morgan', role: 'Patient', email: 'patient@medipulse.org', status: 'Active' },
    { id: 'usr-pat2', name: 'Clara Oswald', role: 'Patient', email: 'c.oswald@example.com', status: 'Active' },
    { id: 'usr-pat3', name: 'Harold Bennett', role: 'Patient', email: 'h.bennett@example.com', status: 'Active' },
  ]);

  const handleInfoSubmit = (e) => {
    e.preventDefault();
    updateHospitalInfo(infoForm);
    addToast('Hospital information and legal metadata updated!', 'success');
  };

  const handleToggleUser = (userId) => {
    setUserAccounts(prev =>
      prev.map(u => (u.id === userId ? { ...u, status: u.status === 'Active' ? 'Suspended' : 'Active' } : u))
    );
    addToast('User account security status updated!', 'info');
  };

  const handleResetData = () => {
    if (window.confirm('Are you sure you want to reset all data back to the original demo state? All local modifications will be restored.')) {
      resetToDefaults();
      addToast('Hospital database reset to pristine demo default state!', 'success');
    }
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>System Configuration & User Account Access</h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          Manage hospital identity credentials, user account privileges, security states, and demo data resets.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: 20 }}>
        {/* Hospital Identity Settings */}
        <div className="card">
          <div className="card-header">
            <span className="card-title">
              <Building size={18} color="var(--primary-600)" />
              Hospital Institution Profile
            </span>
          </div>

          <div className="card-body">
            <form onSubmit={handleInfoSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div className="form-group">
                <label className="form-label">Hospital Name</label>
                <input
                  type="text"
                  className="form-input"
                  value={infoForm.name}
                  onChange={(e) => setInfoForm({ ...infoForm, name: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Mission Tagline</label>
                <input
                  type="text"
                  className="form-input"
                  value={infoForm.tagline}
                  onChange={(e) => setInfoForm({ ...infoForm, tagline: e.target.value })}
                  required
                />
              </div>

              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">Registration / Accreditation No</label>
                  <input
                    type="text"
                    className="form-input"
                    value={infoForm.registrationNo}
                    onChange={(e) => setInfoForm({ ...infoForm, registrationNo: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Central Email</label>
                  <input
                    type="email"
                    className="form-input"
                    value={infoForm.email}
                    onChange={(e) => setInfoForm({ ...infoForm, email: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">Switchboard Phone</label>
                  <input
                    type="text"
                    className="form-input"
                    value={infoForm.phone}
                    onChange={(e) => setInfoForm({ ...infoForm, phone: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label" style={{ color: 'var(--rose-600)' }}>
                    Emergency Hotline
                  </label>
                  <input
                    type="text"
                    className="form-input"
                    value={infoForm.emergencyHotline}
                    onChange={(e) => setInfoForm({ ...infoForm, emergencyHotline: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Campus Address</label>
                <input
                  type="text"
                  className="form-input"
                  value={infoForm.address}
                  onChange={(e) => setInfoForm({ ...infoForm, address: e.target.value })}
                  required
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 6 }}>
                <button type="submit" className="btn btn-primary">
                  <Save size={16} /> Save Institution Details
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* User Account Access & Activation Control */}
        <div className="card">
          <div className="card-header">
            <span className="card-title">
              <ShieldCheck size={18} color="var(--emerald-600)" />
              User Access & Account Activation
            </span>
          </div>

          <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Activate or suspend user portal access for patients, doctors, and administrative staff:
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {userAccounts.map(user => (
                <div
                  key={user.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    background: 'var(--bg-surface-subtle)',
                    padding: '10px 14px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-subtle)'
                  }}
                >
                  <div>
                    <strong style={{ fontSize: '0.9rem' }}>{user.name}</strong>
                    <div style={{ fontSize: '0.78rem', color: 'var(--primary-700)', fontWeight: 600 }}>{user.role}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{user.email}</div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <Badge status={user.status === 'Active' ? 'active' : 'inactive'} label={user.status} />
                    <button
                      className={`btn ${user.status === 'Active' ? 'btn-danger' : 'btn-success'} btn-sm`}
                      onClick={() => handleToggleUser(user.id)}
                    >
                      {user.status === 'Active' ? 'Deactivate' : 'Activate'}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Reset Database Section */}
            <div style={{ marginTop: 24, borderTop: '1px solid var(--border-default)', paddingTop: 16 }}>
              <div style={{ background: 'var(--rose-50)', border: '1px solid rgba(244, 63, 94, 0.3)', borderRadius: 'var(--radius-md)', padding: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 14 }}>
                <div>
                  <strong style={{ fontSize: '0.9rem', color: 'var(--rose-700)' }}>Reset Demo Data</strong>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: 2 }}>
                    Re-seed all doctors, patients, beds, appointments, and bills to pristine default state.
                  </p>
                </div>
                <button className="btn btn-danger btn-sm" onClick={handleResetData}>
                  <RotateCcw size={14} /> Reset State
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
