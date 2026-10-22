import React, { useState } from 'react';
import { useHospital } from '../../context/HospitalContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../common/Toast';
import {
  User,
  Phone,
  Mail,
  MapPin,
  Heart,
  AlertCircle,
  Save,
  ShieldCheck,
  Calendar
} from 'lucide-react';

export default function PatientProfile() {
  const { patients, updatePatientProfile } = useHospital();
  const { currentUser, setCurrentUser } = useAuth();
  const { addToast } = useToast();

  const currentPatient = patients.find(p => p.id === (currentUser?.id || 'pat-1')) || patients[0];

  const [formData, setFormData] = useState({
    name: currentPatient.name || '',
    email: currentPatient.email || '',
    phone: currentPatient.phone || '',
    age: currentPatient.age || 34,
    gender: currentPatient.gender || 'Male',
    bloodGroup: currentPatient.bloodGroup || 'O+',
    address: currentPatient.address || '',
    allergies: currentPatient.allergies || '',
    chronicConditions: currentPatient.chronicConditions || '',
    emergencyName: currentPatient.emergencyContact?.name || '',
    emergencyRel: currentPatient.emergencyContact?.relationship || '',
    emergencyPhone: currentPatient.emergencyContact?.phone || ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updatePatientProfile(currentPatient.id, {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      age: Number(formData.age),
      gender: formData.gender,
      bloodGroup: formData.bloodGroup,
      address: formData.address,
      allergies: formData.allergies,
      chronicConditions: formData.chronicConditions,
      emergencyContact: {
        name: formData.emergencyName,
        relationship: formData.emergencyRel,
        phone: formData.emergencyPhone
      }
    });

    if (currentUser?.id === currentPatient.id) {
      setCurrentUser(prev => ({ ...prev, name: formData.name, email: formData.email, bloodGroup: formData.bloodGroup }));
    }

    addToast('Profile and medical records updated successfully!', 'success');
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Patient Profile & Clinical Metadata</h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          Manage your contact credentials, clinical alerts, emergency contacts, and identification.
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: 20 }}>
          {/* Personal Information */}
          <div className="card">
            <div className="card-header">
              <span className="card-title">
                <User size={18} color="var(--primary-600)" />
                Personal Information
              </span>
              <span className="badge badge-info">ID: #{currentPatient.id.toUpperCase()}</span>
            </div>
            <div className="card-body">
              <div className="form-group">
                <label className="form-label">Full Legal Name</label>
                <input
                  type="text"
                  name="name"
                  className="form-input"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    className="form-input"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Contact Phone</label>
                  <input
                    type="text"
                    name="phone"
                    className="form-input"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">Age</label>
                  <input
                    type="number"
                    name="age"
                    className="form-input"
                    value={formData.age}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Gender</label>
                  <select
                    name="gender"
                    className="form-select"
                    value={formData.gender}
                    onChange={handleChange}
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
                  name="address"
                  className="form-input"
                  value={formData.address}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          {/* Clinical Alerts & Emergency Contacts */}
          <div className="card">
            <div className="card-header">
              <span className="card-title">
                <Heart size={18} color="var(--rose-600)" />
                Clinical Alerts & Emergency Contact
              </span>
            </div>
            <div className="card-body">
              <div className="form-group">
                <label className="form-label">Blood Group</label>
                <select
                  name="bloodGroup"
                  className="form-select"
                  value={formData.bloodGroup}
                  onChange={handleChange}
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

              <div className="form-group">
                <label className="form-label" style={{ color: 'var(--rose-600)' }}>
                  <AlertCircle size={15} /> Known Drug & Environmental Allergies
                </label>
                <input
                  type="text"
                  name="allergies"
                  className="form-input"
                  value={formData.allergies}
                  onChange={handleChange}
                  placeholder="e.g. Penicillin, Sulfa, Aspirin..."
                />
              </div>

              <div className="form-group">
                <label className="form-label">Chronic Medical Conditions</label>
                <input
                  type="text"
                  name="chronicConditions"
                  className="form-input"
                  value={formData.chronicConditions}
                  onChange={handleChange}
                  placeholder="e.g. Asthma, Hypertension, Diabetes..."
                />
              </div>

              <div style={{ borderTop: '1px solid var(--border-default)', marginTop: 16, paddingTop: 14 }}>
                <h4 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: 10 }}>Primary Emergency Contact</h4>
                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">Contact Name</label>
                    <input
                      type="text"
                      name="emergencyName"
                      className="form-input"
                      value={formData.emergencyName}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Relationship</label>
                    <input
                      type="text"
                      name="emergencyRel"
                      className="form-input"
                      value={formData.emergencyRel}
                      onChange={handleChange}
                      placeholder="e.g. Spouse, Parent"
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Emergency Phone</label>
                  <input
                    type="text"
                    name="emergencyPhone"
                    className="form-input"
                    value={formData.emergencyPhone}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 20 }}>
          <button type="submit" className="btn btn-primary btn-lg">
            <Save size={18} /> Save Profile Changes
          </button>
        </div>
      </form>
    </div>
  );
}
