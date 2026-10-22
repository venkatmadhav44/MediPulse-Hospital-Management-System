import React, { useState } from 'react';
import { useHospital } from '../../context/HospitalContext';
import BookAppointmentModal from './BookAppointmentModal';
import Modal from '../common/Modal';
import {
  Search,
  Stethoscope,
  Star,
  Clock,
  MapPin,
  Calendar,
  CheckCircle,
  Phone,
  Mail,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';

export default function DoctorSearch() {
  const { doctors, departments } = useHospital();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState('all');
  const [bookingDocId, setBookingDocId] = useState(null);
  const [viewingDoctor, setViewingDoctor] = useState(null);

  const filteredDoctors = doctors.filter(doc => {
    const matchesSearch =
      doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.specialization.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.qualifications.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDept = selectedDept === 'all' || doc.departmentId === selectedDept;

    return matchesSearch && matchesDept && doc.active;
  });

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Search & Filter Header */}
      <div className="card">
        <div className="card-body">
          <div className="search-filter-bar" style={{ margin: 0 }}>
            <div className="search-input-wrap">
              <Search size={18} />
              <input
                type="text"
                className="search-input"
                placeholder="Search doctors by name, specialty, or condition..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="filter-group">
              <select
                className="form-select"
                style={{ width: 'auto', minWidth: 220 }}
                value={selectedDept}
                onChange={(e) => setSelectedDept(e.target.value)}
              >
                <option value="all">All Departments ({doctors.filter(d => d.active).length})</option>
                {departments.map(dept => {
                  const count = doctors.filter(d => d.departmentId === dept.id && d.active).length;
                  return (
                    <option key={dept.id} value={dept.id}>
                      {dept.name} ({count})
                    </option>
                  );
                })}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Doctor Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 20 }}>
        {filteredDoctors.length === 0 ? (
          <div className="card" style={{ gridColumn: '1 / -1', padding: 40, textAlign: 'center' }}>
            <Stethoscope size={40} style={{ margin: '0 auto 12px', color: 'var(--text-muted)' }} />
            <h3>No Doctors Found</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: 4 }}>
              Try adjusting your search keywords or department filter.
            </p>
          </div>
        ) : (
          filteredDoctors.map(doctor => (
            <div key={doctor.id} className="card card-hover" style={{ display: 'flex', flexDirection: 'column' }}>
              <div className="card-body" style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 14 }}>
                {/* Doctor Avatar & Headline */}
                <div style={{ display: 'flex', gap: 14 }}>
                  <div className="avatar avatar-lg">
                    {doctor.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </div>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>{doctor.name}</h3>
                    <div style={{ fontSize: '0.84rem', color: 'var(--primary-600)', fontWeight: 600 }}>
                      {doctor.specialization}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4, fontSize: '0.8rem' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 3, color: '#eab308', fontWeight: 700 }}>
                        <Star size={14} fill="#eab308" /> {doctor.rating}
                      </span>
                      <span style={{ color: 'var(--text-muted)' }}>({doctor.reviewCount} reviews)</span>
                      <span style={{ color: 'var(--text-muted)' }}>•</span>
                      <span style={{ color: 'var(--text-muted)' }}>{doctor.experienceYears} yrs exp</span>
                    </div>
                  </div>
                </div>

                {/* Qualification & Bio */}
                <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', borderTop: '1px solid var(--border-subtle)', paddingTop: 10 }}>
                  <p style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>{doctor.qualifications}</p>
                  <p style={{ marginTop: 4, lineHeight: 1.4, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {doctor.bio}
                  </p>
                </div>

                {/* Available Days Tag */}
                <div style={{ background: 'var(--bg-surface-subtle)', padding: '8px 12px', borderRadius: 'var(--radius-sm)', fontSize: '0.78rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--text-secondary)' }}>
                    <Calendar size={14} color="var(--primary-600)" />
                    <span>Days: <strong>{doctor.availableDays.join(', ')}</strong></span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--text-secondary)', marginTop: 4 }}>
                    <Clock size={14} color="var(--emerald-600)" />
                    <span>Slots: {doctor.availableSlots.slice(0, 3).join(', ')}...</span>
                  </div>
                </div>

                {/* Fee & Action Button */}
                <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 8 }}>
                  <div>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                      Consultation
                    </span>
                    <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                      ${doctor.consultationFee}
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: 8 }}>
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => setViewingDoctor(doctor)}
                    >
                      Profile
                    </button>
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => setBookingDocId(doctor.id)}
                    >
                      Book Visit
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Doctor Profile Modal */}
      {viewingDoctor && (
        <Modal
          isOpen={true}
          onClose={() => setViewingDoctor(null)}
          title={`Doctor Profile: ${viewingDoctor.name}`}
          subtitle={viewingDoctor.specialization}
          size="lg"
          footer={
            <>
              <button className="btn btn-secondary" onClick={() => setViewingDoctor(null)}>
                Close
              </button>
              <button
                className="btn btn-primary"
                onClick={() => {
                  const id = viewingDoctor.id;
                  setViewingDoctor(null);
                  setBookingDocId(id);
                }}
              >
                Book Appointment (${viewingDoctor.consultationFee})
              </button>
            </>
          }
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div style={{ display: 'flex', gap: 18, alignItems: 'center' }}>
              <div className="avatar avatar-xl">
                {viewingDoctor.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
              </div>
              <div>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 800 }}>{viewingDoctor.name}</h3>
                <p style={{ color: 'var(--primary-600)', fontWeight: 600 }}>{viewingDoctor.specialization}</p>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: 2 }}>
                  {viewingDoctor.qualifications} • {viewingDoctor.experienceYears} Years Clinical Experience
                </p>
                <div style={{ display: 'flex', gap: 14, marginTop: 8, fontSize: '0.82rem' }}>
                  <span><Star size={14} fill="#eab308" color="#eab308" style={{ display: 'inline', marginRight: 4 }} />{viewingDoctor.rating} rating</span>
                  <span><MapPin size={14} color="var(--text-muted)" style={{ display: 'inline', marginRight: 4 }} />{viewingDoctor.roomNo}</span>
                </div>
              </div>
            </div>

            <div style={{ background: 'var(--bg-surface-subtle)', padding: 16, borderRadius: 'var(--radius-md)' }}>
              <h4 style={{ fontSize: '0.9rem', marginBottom: 6 }}>Clinical Background & Special Interests</h4>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                {viewingDoctor.bio}
              </p>
            </div>

            <div className="form-grid">
              <div>
                <h4 style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 8 }}>
                  Weekly OPD Schedule
                </h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {viewingDoctor.availableDays.map(day => (
                    <span key={day} className="badge badge-info">{day}</span>
                  ))}
                </div>
              </div>

              <div>
                <h4 style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 8 }}>
                  Consultation Slots
                </h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {viewingDoctor.availableSlots.map(slot => (
                    <span key={slot} className="badge badge-neutral">{slot}</span>
                  ))}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 20, fontSize: '0.85rem', color: 'var(--text-secondary)', borderTop: '1px solid var(--border-default)', paddingTop: 14 }}>
              <span><Phone size={14} style={{ display: 'inline', marginRight: 6 }} />{viewingDoctor.phone}</span>
              <span><Mail size={14} style={{ display: 'inline', marginRight: 6 }} />{viewingDoctor.email}</span>
            </div>
          </div>
        </Modal>
      )}

      {/* Direct Booking Modal */}
      {bookingDocId && (
        <BookAppointmentModal
          isOpen={true}
          onClose={() => setBookingDocId(null)}
          preselectedDoctorId={bookingDocId}
        />
      )}
    </div>
  );
}
