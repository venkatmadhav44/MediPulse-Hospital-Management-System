import React, { useState } from 'react';
import { useHospital } from '../../context/HospitalContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../common/Toast';
import Badge from '../common/Badge';
import DoctorConsultationModal from './DoctorConsultationModal';
import {
  Calendar,
  Clock,
  Search,
  CheckCircle2,
  XCircle,
  PlayCircle,
  FileText,
  User
} from 'lucide-react';

export default function DoctorAppointments() {
  const { doctors, appointments, updateAppointmentStatus } = useHospital();
  const { currentUser } = useAuth();
  const { addToast } = useToast();

  const currentDoctor = doctors.find(d => d.id === (currentUser?.id || 'doc-1')) || doctors[0];
  const doctorAppointments = appointments.filter(a => a.doctorId === currentDoctor.id);

  const [activeTab, setActiveTab] = useState('all'); // 'all', 'confirmed', 'completed', 'cancelled'
  const [searchTerm, setSearchTerm] = useState('');
  const [consultingApt, setConsultingApt] = useState(null);

  const filteredAppointments = doctorAppointments.filter(apt => {
    const matchesTab = activeTab === 'all' || apt.status === activeTab;
    const matchesSearch =
      apt.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      apt.reason.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const handleStatusChange = (aptId, newStatus) => {
    updateAppointmentStatus(aptId, newStatus);
    addToast(`Appointment status updated to ${newStatus}`, 'info');
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Clinical Schedule & Appointment Registry</h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          Manage patient queue, conduct live examinations, update consultation statuses, and review diagnoses.
        </p>
      </div>

      {/* Filter Tabs & Search */}
      <div className="card">
        <div className="card-body">
          <div className="search-filter-bar" style={{ margin: 0 }}>
            <div className="search-input-wrap">
              <Search size={18} />
              <input
                type="text"
                className="search-input"
                placeholder="Search patient name, reason, or appointment ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="tabs-header" style={{ margin: 0, border: 'none' }}>
              <button
                className={`tab-btn ${activeTab === 'all' ? 'active' : ''}`}
                onClick={() => setActiveTab('all')}
              >
                All ({doctorAppointments.length})
              </button>
              <button
                className={`tab-btn ${activeTab === 'confirmed' ? 'active' : ''}`}
                onClick={() => setActiveTab('confirmed')}
              >
                Pending ({doctorAppointments.filter(a => a.status === 'confirmed').length})
              </button>
              <button
                className={`tab-btn ${activeTab === 'completed' ? 'active' : ''}`}
                onClick={() => setActiveTab('completed')}
              >
                Completed ({doctorAppointments.filter(a => a.status === 'completed').length})
              </button>
              <button
                className={`tab-btn ${activeTab === 'cancelled' ? 'active' : ''}`}
                onClick={() => setActiveTab('cancelled')}
              >
                Cancelled ({doctorAppointments.filter(a => a.status === 'cancelled').length})
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Appointments Data Table */}
      <div className="card">
        <div className="card-body" style={{ padding: 0 }}>
          {filteredAppointments.length === 0 ? (
            <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>
              <Calendar size={36} style={{ margin: '0 auto 12px', opacity: 0.5 }} />
              <h4>No Appointments Found</h4>
              <p style={{ fontSize: '0.85rem', marginTop: 4 }}>No records matching current filter.</p>
            </div>
          ) : (
            <div className="table-container" style={{ border: 'none', borderRadius: 0 }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Date & Slot</th>
                    <th>Patient</th>
                    <th>Consultation Reason</th>
                    <th>Status</th>
                    <th>Diagnosis / Notes</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAppointments.map(apt => (
                    <tr key={apt.id}>
                      <td>
                        <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{apt.date}</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--primary-600)' }}>{apt.time}</div>
                      </td>
                      <td>
                        <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{apt.patientName}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>ID: #{apt.patientId.toUpperCase()}</div>
                      </td>
                      <td>
                        <div style={{ fontSize: '0.88rem' }}>{apt.reason}</div>
                        {apt.symptoms && (
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Symptoms: {apt.symptoms}</div>
                        )}
                      </td>
                      <td>
                        <Badge status={apt.status} />
                      </td>
                      <td>
                        {apt.diagnosis ? (
                          <div style={{ fontSize: '0.82rem', color: 'var(--emerald-700)', fontWeight: 600 }}>
                            {apt.diagnosis}
                          </div>
                        ) : (
                          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Pending exam</span>
                        )}
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: 6 }}>
                          {(apt.status === 'confirmed' || apt.status === 'in-consultation') && (
                            <button
                              className="btn btn-primary btn-sm"
                              onClick={() => {
                                updateAppointmentStatus(apt.id, 'in-consultation');
                                setConsultingApt(apt);
                              }}
                            >
                              <PlayCircle size={14} />
                              Consult
                            </button>
                          )}

                          {apt.status === 'confirmed' && (
                            <button
                              className="btn btn-secondary btn-sm"
                              onClick={() => handleStatusChange(apt.id, 'cancelled')}
                              title="Cancel / No Show"
                            >
                              <XCircle size={14} />
                            </button>
                          )}

                          {apt.status === 'completed' && (
                            <button
                              className="btn btn-outline btn-sm"
                              onClick={() => setConsultingApt(apt)}
                            >
                              <FileText size={14} /> View
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Consultation Modal */}
      {consultingApt && (
        <DoctorConsultationModal
          isOpen={true}
          onClose={() => setConsultingApt(null)}
          appointment={consultingApt}
        />
      )}
    </div>
  );
}
