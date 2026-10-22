import React, { useState } from 'react';
import { useHospital } from '../../context/HospitalContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../common/Toast';
import {
  Clock,
  Calendar,
  DollarSign,
  CheckCircle2,
  AlertCircle,
  Save,
  Plus,
  Trash2,
  ToggleLeft,
  ToggleRight
} from 'lucide-react';

export default function DoctorAvailability() {
  const { doctors, updateDoctor } = useHospital();
  const { currentUser } = useAuth();
  const { addToast } = useToast();

  const currentDoctor = doctors.find(d => d.id === (currentUser?.id || 'doc-1')) || doctors[0];

  const allDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const [selectedDays, setSelectedDays] = useState(currentDoctor.availableDays || ['Monday', 'Wednesday', 'Friday']);
  const [slots, setSlots] = useState(currentDoctor.availableSlots || ['09:00 AM', '10:00 AM', '11:30 AM', '02:00 PM', '04:00 PM']);
  const [newSlot, setNewSlot] = useState('');
  const [fee, setFee] = useState(currentDoctor.consultationFee || 150);
  const [isActive, setIsActive] = useState(currentDoctor.active ?? true);
  const [roomNo, setRoomNo] = useState(currentDoctor.roomNo || 'Room 302, Tower B');

  const toggleDay = (day) => {
    setSelectedDays(prev =>
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    );
  };

  const handleAddSlot = (e) => {
    e.preventDefault();
    if (!newSlot.trim()) return;
    if (!slots.includes(newSlot.trim())) {
      setSlots(prev => [...prev, newSlot.trim()]);
      setNewSlot('');
    }
  };

  const handleRemoveSlot = (slotToRemove) => {
    setSlots(prev => prev.filter(s => s !== slotToRemove));
  };

  const handleSave = (e) => {
    e.preventDefault();
    updateDoctor(currentDoctor.id, {
      availableDays: selectedDays,
      availableSlots: slots,
      consultationFee: Number(fee),
      active: isActive,
      roomNo
    });
    addToast('OPD availability schedule & clinic settings updated!', 'success');
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Physician Availability & OPD Schedule Manager</h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          Configure working consultation days, patient slot intervals, OPD room numbers, and consultation fees.
        </p>
      </div>

      <form onSubmit={handleSave}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: 20 }}>
          {/* Days of Week */}
          <div className="card">
            <div className="card-header">
              <span className="card-title">
                <Calendar size={18} color="var(--primary-600)" />
                Weekly Clinical OPD Days
              </span>
            </div>
            <div className="card-body">
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: 14 }}>
                Select the days you are available for outpatient appointments and elective consultations:
              </p>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                {allDays.map(day => {
                  const isSelected = selectedDays.includes(day);
                  return (
                    <button
                      key={day}
                      type="button"
                      onClick={() => toggleDay(day)}
                      style={{
                        padding: '9px 16px',
                        borderRadius: 'var(--radius-md)',
                        fontSize: '0.88rem',
                        fontWeight: 600,
                        border: isSelected ? '1px solid var(--primary-500)' : '1px solid var(--border-default)',
                        background: isSelected ? 'var(--primary-50)' : 'var(--bg-surface-subtle)',
                        color: isSelected ? 'var(--primary-700)' : 'var(--text-secondary)',
                        cursor: 'pointer',
                        transition: 'all var(--transition-fast)'
                      }}
                    >
                      {day} {isSelected && '✓'}
                    </button>
                  );
                })}
              </div>

              <div style={{ marginTop: 24, borderTop: '1px solid var(--border-default)', paddingTop: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <strong style={{ fontSize: '0.9rem' }}>OPD Duty Status</strong>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      {isActive ? 'Accepting new appointments' : 'Marked as on leave / Away'}
                    </div>
                  </div>
                  <button
                    type="button"
                    className={`btn ${isActive ? 'btn-success' : 'btn-secondary'} btn-sm`}
                    onClick={() => setIsActive(!isActive)}
                  >
                    {isActive ? 'Active on Duty' : 'On Leave'}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Time Slots & Clinic Settings */}
          <div className="card">
            <div className="card-header">
              <span className="card-title">
                <Clock size={18} color="var(--teal-600)" />
                Consultation Time Slots & Chamber
              </span>
            </div>
            <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {/* Add Slot */}
              <div>
                <label className="form-label">Available Slots</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 12 }}>
                  {slots.map(slot => (
                    <span
                      key={slot}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 6,
                        background: 'var(--bg-surface-subtle)',
                        border: '1px solid var(--border-default)',
                        borderRadius: 'var(--radius-full)',
                        padding: '4px 12px',
                        fontSize: '0.82rem',
                        fontWeight: 600
                      }}
                    >
                      {slot}
                      <button
                        type="button"
                        onClick={() => handleRemoveSlot(slot)}
                        style={{ color: 'var(--rose-600)', border: 'none', background: 'none', cursor: 'pointer', padding: 0 }}
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>

                <div style={{ display: 'flex', gap: 8 }}>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. 03:00 PM"
                    value={newSlot}
                    onChange={(e) => setNewSlot(e.target.value)}
                    style={{ maxWidth: 180 }}
                  />
                  <button type="button" className="btn btn-secondary btn-sm" onClick={handleAddSlot}>
                    <Plus size={14} /> Add Slot
                  </button>
                </div>
              </div>

              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">Consultation Fee ($ USD)</label>
                  <input
                    type="number"
                    className="form-input"
                    value={fee}
                    onChange={(e) => setFee(e.target.value)}
                    min="20"
                    step="10"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Clinic / Chamber Room</label>
                  <input
                    type="text"
                    className="form-input"
                    value={roomNo}
                    onChange={(e) => setRoomNo(e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 20 }}>
          <button type="submit" className="btn btn-primary btn-lg">
            <Save size={18} /> Save Availability & Settings
          </button>
        </div>
      </form>
    </div>
  );
}
