import React, { useState } from 'react';
import { useHospital } from '../../context/HospitalContext';
import { useToast } from '../common/Toast';
import Badge from '../common/Badge';
import {
  Calendar,
  Search,
  Filter,
  Stethoscope,
  User,
  Clock,
  CheckCircle,
  XCircle,
  FileText
} from 'lucide-react';

export default function ManageAppointments() {
  const { appointments, doctors, departments, updateAppointmentStatus, cancelAppointment } = useHospital();
  const { addToast } = useToast();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  const filteredAppointments = appointments.filter(apt => {
    const matchesSearch =
      apt.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      apt.doctorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      apt.id.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDept = selectedDept === 'all' || apt.department.toLowerCase().includes(selectedDept.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || apt.status === selectedStatus;

    return matchesSearch && matchesDept && matchesStatus;
  });

  const handleCancel = (aptId) => {
    cancelAppointment(aptId, 'Administrative Override');
    addToast(`Appointment #${aptId.toUpperCase()} cancelled by hospital administrator`, 'info');
  };

  const handleMarkCompleted = (aptId) => {
    updateAppointmentStatus(aptId, 'completed');
    addToast(`Appointment #${aptId.toUpperCase()} marked as completed`, 'success');
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Hospital-Wide Master Appointment Schedule</h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          Monitor, coordinate, and administrate consultation bookings across all clinical specialties and attending staff.
        </p>
      </div>

      {/* Filter Header */}
      <div className="card">
        <div className="card-body">
          <div className="search-filter-bar" style={{ margin: 0 }}>
            <div className="search-input-wrap">
              <Search size={18} />
              <input
                type="text"
                className="search-input"
                placeholder="Search patient, doctor, or appointment ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="filter-group">
              <select
                className="form-select"
                style={{ width: 'auto', minWidth: 180 }}
                value={selectedDept}
                onChange={(e) => setSelectedDept(e.target.value)}
              >
                <option value="all">All Departments</option>
                {departments.map(d => (
                  <option key={d.id} value={d.name}>{d.name}</option>
                ))}
              </select>

              <select
                className="form-select"
                style={{ width: 'auto', minWidth: 150 }}
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
              >
                <option value="all">All Statuses</option>
                <option value="confirmed">Confirmed / Pending</option>
                <option value="in-consultation">In Consultation</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="card">
        <div className="card-body" style={{ padding: 0 }}>
          <div className="table-container" style={{ border: 'none', borderRadius: 0 }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Booking Ref</th>
                  <th>Patient</th>
                  <th>Attending Physician</th>
                  <th>Specialty</th>
                  <th>Date & Time</th>
                  <th>Fee</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Admin Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredAppointments.map(apt => (
                  <tr key={apt.id}>
                    <td style={{ fontWeight: 700, color: 'var(--primary-600)' }}>
                      #{apt.id.toUpperCase()}
                    </td>
                    <td>
                      <strong style={{ fontSize: '0.92rem' }}>{apt.patientName}</strong>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>ID: #{apt.patientId.toUpperCase()}</div>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600 }}>{apt.doctorName}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>#{apt.doctorId.toUpperCase()}</div>
                    </td>
                    <td>{apt.department}</td>
                    <td>
                      <div>{apt.date}</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{apt.time}</div>
                    </td>
                    <td style={{ fontWeight: 700, color: 'var(--emerald-600)' }}>${apt.fee}</td>
                    <td><Badge status={apt.status} /></td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: 6 }}>
                        {apt.status === 'confirmed' && (
                          <>
                            <button
                              className="btn btn-success btn-sm"
                              onClick={() => handleMarkCompleted(apt.id)}
                              title="Mark Complete"
                            >
                              <CheckCircle size={14} /> Complete
                            </button>
                            <button
                              className="btn btn-danger btn-sm"
                              onClick={() => handleCancel(apt.id)}
                              title="Cancel Booking"
                            >
                              <XCircle size={14} /> Cancel
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
