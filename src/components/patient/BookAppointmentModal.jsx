import React, { useState } from 'react';
import Modal from '../common/Modal';
import { useHospital } from '../../context/HospitalContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../common/Toast';
import { Calendar, Clock, Stethoscope, User, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function BookAppointmentModal({ isOpen, onClose, preselectedDoctorId = null }) {
  const { doctors, departments, bookAppointment } = useHospital();
  const { currentUser } = useAuth();
  const { addToast } = useToast();

  const [selectedDocId, setSelectedDocId] = useState(preselectedDoctorId || (doctors[0]?.id || ''));
  const [selectedDept, setSelectedDept] = useState('');
  const [appointmentDate, setAppointmentDate] = useState(() => {
    // Default to tomorrow's date
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  });
  const [selectedSlot, setSelectedSlot] = useState('10:00 AM');
  const [reason, setReason] = useState('');
  const [symptoms, setSymptoms] = useState('');

  const selectedDoctor = doctors.find(d => d.id === selectedDocId) || doctors[0];

  const filteredDoctors = selectedDept
    ? doctors.filter(d => d.departmentId === selectedDept && d.active)
    : doctors.filter(d => d.active);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedDoctor) {
      addToast('Please select a doctor', 'danger');
      return;
    }
    if (!appointmentDate || !selectedSlot) {
      addToast('Please select a valid date and time slot', 'danger');
      return;
    }
    if (!reason.trim()) {
      addToast('Please enter the reason for your visit', 'danger');
      return;
    }

    const newApt = bookAppointment({
      patientId: currentUser?.id || 'pat-1',
      patientName: currentUser?.name || 'Alex Morgan',
      doctorId: selectedDoctor.id,
      doctorName: selectedDoctor.name,
      department: selectedDoctor.specialization,
      date: appointmentDate,
      time: selectedSlot,
      reason,
      symptoms: symptoms || 'None reported',
      fee: selectedDoctor.consultationFee,
      notes: 'Booked via Patient Web Portal'
    });

    addToast(`Appointment confirmed with ${selectedDoctor.name} on ${appointmentDate} at ${selectedSlot}!`, 'success');
    setReason('');
    setSymptoms('');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Book Doctor Appointment"
      subtitle="Schedule an in-person or clinical consultation with MediPulse specialists"
      size="lg"
    >
      <form onSubmit={handleSubmit}>
        <div className="form-grid">
          {/* Department Filter */}
          <div className="form-group">
            <label className="form-label">Filter by Department</label>
            <select
              className="form-select"
              value={selectedDept}
              onChange={(e) => {
                setSelectedDept(e.target.value);
                const firstDoc = doctors.find(d => !e.target.value || d.departmentId === e.target.value);
                if (firstDoc) setSelectedDocId(firstDoc.id);
              }}
            >
              <option value="">All Clinical Departments</option>
              {departments.map(dept => (
                <option key={dept.id} value={dept.id}>{dept.name}</option>
              ))}
            </select>
          </div>

          {/* Select Doctor */}
          <div className="form-group">
            <label className="form-label">Select Specialist Doctor</label>
            <select
              className="form-select"
              value={selectedDocId}
              onChange={(e) => setSelectedDocId(e.target.value)}
              required
            >
              {filteredDoctors.map(doc => (
                <option key={doc.id} value={doc.id}>
                  {doc.name} — {doc.specialization} (${doc.consultationFee})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Selected Doctor Summary Card */}
        {selectedDoctor && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '14px 18px',
              borderRadius: 'var(--radius-md)',
              background: 'var(--bg-surface-subtle)',
              border: '1px solid var(--border-default)',
              marginBottom: 18
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div className="avatar avatar-md">
                {selectedDoctor.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{selectedDoctor.name}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  {selectedDoctor.qualifications} • {selectedDoctor.experienceYears} yrs experience
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--primary-600)', fontWeight: 600, marginTop: 2 }}>
                  Available: {selectedDoctor.availableDays.join(', ')}
                </div>
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Consultation Fee</span>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--emerald-600)' }}>
                ${selectedDoctor.consultationFee}
              </div>
            </div>
          </div>
        )}

        <div className="form-grid">
          {/* Appointment Date */}
          <div className="form-group">
            <label className="form-label">
              <Calendar size={15} /> Appointment Date
            </label>
            <input
              type="date"
              className="form-input"
              value={appointmentDate}
              min={new Date().toISOString().split('T')[0]}
              onChange={(e) => setAppointmentDate(e.target.value)}
              required
            />
          </div>

          {/* Time Slots */}
          <div className="form-group">
            <label className="form-label">
              <Clock size={15} /> Available Slot
            </label>
            <select
              className="form-select"
              value={selectedSlot}
              onChange={(e) => setSelectedSlot(e.target.value)}
              required
            >
              {selectedDoctor?.availableSlots?.map(slot => (
                <option key={slot} value={slot}>{slot}</option>
              )) || (
                <>
                  <option value="09:00 AM">09:00 AM</option>
                  <option value="10:30 AM">10:30 AM</option>
                  <option value="02:00 PM">02:00 PM</option>
                  <option value="04:00 PM">04:00 PM</option>
                </>
              )}
            </select>
          </div>
        </div>

        {/* Reason for Visit */}
        <div className="form-group">
          <label className="form-label">Primary Reason for Visit *</label>
          <input
            type="text"
            className="form-input"
            placeholder="e.g. Routine blood pressure checkup, chest discomfort evaluation..."
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            required
          />
        </div>

        {/* Symptoms / Notes */}
        <div className="form-group">
          <label className="form-label">Specific Symptoms or Medical History Notes (Optional)</label>
          <textarea
            className="form-textarea"
            rows="3"
            placeholder="Describe any symptoms, duration, current medications or queries for the doctor..."
            value={symptoms}
            onChange={(e) => setSymptoms(e.target.value)}
          />
        </div>

        {/* Hospital Policy Note */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            padding: '10px 14px',
            borderRadius: 'var(--radius-md)',
            background: 'var(--primary-50)',
            color: 'var(--primary-800)',
            fontSize: '0.8rem',
            marginBottom: 20
          }}
        >
          <AlertCircle size={18} flexShrink={0} />
          <span>You can reschedule or cancel without penalty up to 2 hours prior to the scheduled consultation.</span>
        </div>

        {/* Footer Actions */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary">
            <CheckCircle2 size={16} /> Confirm Booking
          </button>
        </div>
      </form>
    </Modal>
  );
}
