import React, { useState } from 'react';
import { useHospital } from '../../context/HospitalContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../common/Toast';
import Badge from '../common/Badge';
import Modal from '../common/Modal';
import BookAppointmentModal from './BookAppointmentModal';
import {
  Calendar,
  Clock,
  User,
  Stethoscope,
  XCircle,
  CalendarCheck2,
  FileText,
  PlusCircle,
  AlertTriangle
} from 'lucide-react';

export default function PatientAppointments() {
  const { appointments, rescheduleAppointment, cancelAppointment } = useHospital();
  const { currentUser } = useAuth();
  const { addToast } = useToast();

  const [activeFilter, setActiveFilter] = useState('upcoming'); // 'upcoming', 'completed', 'cancelled'
  const [isBookModalOpen, setIsBookModalOpen] = useState(false);
  const [reschedulingApt, setReschedulingApt] = useState(null);
  const [cancellingApt, setCancellingApt] = useState(null);
  const [viewingApt, setViewingApt] = useState(null);

  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('10:00 AM');
  const [cancelReason, setCancelReason] = useState('');

  const patientAppointments = appointments.filter(a => a.patientId === (currentUser?.id || 'pat-1'));

  const filteredAppointments = patientAppointments.filter(apt => {
    if (activeFilter === 'upcoming') return apt.status === 'confirmed' || apt.status === 'in-consultation';
    if (activeFilter === 'completed') return apt.status === 'completed';
    if (activeFilter === 'cancelled') return apt.status === 'cancelled';
    return true;
  });

  const handleRescheduleSubmit = (e) => {
    e.preventDefault();
    if (!newDate || !newTime) {
      addToast('Please select a valid date and time', 'danger');
      return;
    }
    rescheduleAppointment(reschedulingApt.id, newDate, newTime);
    addToast(`Appointment rescheduled to ${newDate} at ${newTime}`, 'success');
    setReschedulingApt(null);
  };

  const handleCancelSubmit = (e) => {
    e.preventDefault();
    cancelAppointment(cancellingApt.id, cancelReason || 'Cancelled by patient');
    addToast('Appointment cancelled successfully', 'info');
    setCancellingApt(null);
    setCancelReason('');
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Header bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
        <div className="tabs-header" style={{ margin: 0 }}>
          <button
            className={`tab-btn ${activeFilter === 'upcoming' ? 'active' : ''}`}
            onClick={() => setActiveFilter('upcoming')}
          >
            Upcoming Visits ({patientAppointments.filter(a => a.status === 'confirmed' || a.status === 'in-consultation').length})
          </button>
          <button
            className={`tab-btn ${activeFilter === 'completed' ? 'active' : ''}`}
            onClick={() => setActiveFilter('completed')}
          >
            Past Consultations ({patientAppointments.filter(a => a.status === 'completed').length})
          </button>
          <button
            className={`tab-btn ${activeFilter === 'cancelled' ? 'active' : ''}`}
            onClick={() => setActiveFilter('cancelled')}
          >
            Cancelled ({patientAppointments.filter(a => a.status === 'cancelled').length})
          </button>
        </div>

        <button className="btn btn-primary" onClick={() => setIsBookModalOpen(true)}>
          <PlusCircle size={16} />
          Book Appointment
        </button>
      </div>

      {/* Appointment Cards / Table */}
      {filteredAppointments.length === 0 ? (
        <div className="card" style={{ padding: 40, textAlign: 'center' }}>
          <Calendar size={38} color="var(--text-muted)" style={{ margin: '0 auto 12px' }} />
          <h3>No {activeFilter} appointments found</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: 4 }}>
            {activeFilter === 'upcoming'
              ? 'You do not have any upcoming visits booked currently.'
              : `No appointments recorded under ${activeFilter} status.`}
          </p>
          {activeFilter === 'upcoming' && (
            <button className="btn btn-primary btn-sm" style={{ marginTop: 14 }} onClick={() => setIsBookModalOpen(true)}>
              Book Your Next Visit
            </button>
          )}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {filteredAppointments.map(apt => (
            <div key={apt.id} className="card card-hover">
              <div className="card-body" style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
                {/* Doctor info */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 14, minWidth: 260 }}>
                  <div className="avatar avatar-lg">
                    {apt.doctorName.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </div>
                  <div>
                    <h4 style={{ fontSize: '1.05rem', fontWeight: 800 }}>{apt.doctorName}</h4>
                    <span style={{ fontSize: '0.82rem', color: 'var(--primary-600)', fontWeight: 600 }}>
                      {apt.department}
                    </span>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: 2 }}>
                      Reason: <strong>{apt.reason}</strong>
                    </p>
                  </div>
                </div>

                {/* Date & Time */}
                <div style={{ display: 'flex', gap: 20 }}>
                  <div>
                    <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700 }}>
                      Date & Slot
                    </span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 700, fontSize: '0.9rem', marginTop: 2 }}>
                      <Calendar size={14} color="var(--primary-600)" /> {apt.date}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: 2 }}>
                      <Clock size={14} color="var(--text-muted)" /> {apt.time}
                    </div>
                  </div>

                  <div>
                    <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700 }}>
                      Status & Fee
                    </span>
                    <div style={{ marginTop: 2 }}>
                      <Badge status={apt.status} />
                    </div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--emerald-600)', marginTop: 3 }}>
                      ${apt.fee}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {apt.status === 'confirmed' && (
                    <>
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => {
                          setReschedulingApt(apt);
                          setNewDate(apt.date);
                          setNewTime(apt.time);
                        }}
                      >
                        Reschedule
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => setCancellingApt(apt)}
                      >
                        Cancel
                      </button>
                    </>
                  )}

                  <button
                    className="btn btn-outline btn-sm"
                    onClick={() => setViewingApt(apt)}
                  >
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Reschedule Modal */}
      {reschedulingApt && (
        <Modal
          isOpen={true}
          onClose={() => setReschedulingApt(null)}
          title="Reschedule Appointment"
          subtitle={`With ${reschedulingApt.doctorName} (${reschedulingApt.department})`}
        >
          <form onSubmit={handleRescheduleSubmit}>
            <div className="form-group">
              <label className="form-label">Select New Date</label>
              <input
                type="date"
                className="form-input"
                min={new Date().toISOString().split('T')[0]}
                value={newDate}
                onChange={(e) => setNewDate(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Select Time Slot</label>
              <select
                className="form-select"
                value={newTime}
                onChange={(e) => setNewTime(e.target.value)}
              >
                <option value="09:00 AM">09:00 AM</option>
                <option value="10:00 AM">10:00 AM</option>
                <option value="11:30 AM">11:30 AM</option>
                <option value="02:00 PM">02:00 PM</option>
                <option value="03:30 PM">03:30 PM</option>
              </select>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 18 }}>
              <button type="button" className="btn btn-secondary" onClick={() => setReschedulingApt(null)}>
                Keep Current
              </button>
              <button type="submit" className="btn btn-primary">
                Confirm Reschedule
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Cancel Modal */}
      {cancellingApt && (
        <Modal
          isOpen={true}
          onClose={() => setCancellingApt(null)}
          title="Cancel Appointment"
          subtitle="Are you sure you want to cancel this consultation?"
        >
          <form onSubmit={handleCancelSubmit}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'var(--rose-50)', padding: 12, borderRadius: 'var(--radius-md)', color: 'var(--rose-700)', marginBottom: 16 }}>
              <AlertTriangle size={20} flexShrink={0} />
              <span style={{ fontSize: '0.85rem' }}>
                You are cancelling consultation #{cancellingApt.id} on {cancellingApt.date} at {cancellingApt.time}.
              </span>
            </div>
            <div className="form-group">
              <label className="form-label">Reason for cancellation (Optional)</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Schedule conflict, feeling better, personal reasons..."
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
              />
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 18 }}>
              <button type="button" className="btn btn-secondary" onClick={() => setCancellingApt(null)}>
                Don't Cancel
              </button>
              <button type="submit" className="btn btn-danger">
                Yes, Cancel Appointment
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* View Appointment Details Modal */}
      {viewingApt && (
        <Modal
          isOpen={true}
          onClose={() => setViewingApt(null)}
          title={`Appointment Details: #${viewingApt.id.toUpperCase()}`}
          subtitle={`${viewingApt.date} at ${viewingApt.time}`}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h4 style={{ fontSize: '1.1rem', fontWeight: 800 }}>{viewingApt.doctorName}</h4>
                <p style={{ color: 'var(--primary-600)', fontSize: '0.88rem', fontWeight: 600 }}>{viewingApt.department}</p>
              </div>
              <Badge status={viewingApt.status} />
            </div>

            <div style={{ background: 'var(--bg-surface-subtle)', padding: 14, borderRadius: 'var(--radius-md)' }}>
              <div style={{ fontSize: '0.85rem' }}>
                <strong>Reason for Visit:</strong> {viewingApt.reason}
              </div>
              {viewingApt.symptoms && (
                <div style={{ fontSize: '0.85rem', marginTop: 6 }}>
                  <strong>Reported Symptoms:</strong> {viewingApt.symptoms}
                </div>
              )}
              {viewingApt.notes && (
                <div style={{ fontSize: '0.85rem', marginTop: 6, color: 'var(--text-secondary)' }}>
                  <strong>Physician Clinical Notes:</strong> {viewingApt.notes}
                </div>
              )}
              {viewingApt.diagnosis && (
                <div style={{ fontSize: '0.85rem', marginTop: 6, color: 'var(--emerald-700)', fontWeight: 600 }}>
                  <strong>Final Clinical Diagnosis:</strong> {viewingApt.diagnosis}
                </div>
              )}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button className="btn btn-secondary" onClick={() => setViewingApt(null)}>
                Close
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Book modal */}
      <BookAppointmentModal
        isOpen={isBookModalOpen}
        onClose={() => setIsBookModalOpen(false)}
      />
    </div>
  );
}
