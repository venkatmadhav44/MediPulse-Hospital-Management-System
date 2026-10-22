import React from 'react';
import { useHospital } from '../../context/HospitalContext';
import StatCard from '../common/StatCard';
import Badge from '../common/Badge';
import {
  Building2,
  Users,
  Stethoscope,
  BedDouble,
  Receipt,
  TrendingUp,
  Activity,
  Calendar,
  AlertTriangle,
  UserPlus,
  PlusCircle,
  Clock
} from 'lucide-react';

export default function AdminOverview({ onNavigate }) {
  const {
    patients,
    doctors,
    appointments,
    beds,
    bills,
    departments,
    staff,
    hospitalInfo
  } = useHospital();

  const totalPatients = patients.length;
  const activeDoctors = doctors.filter(d => d.active).length;
  const occupiedBeds = beds.filter(b => b.status === 'occupied').length;
  const occupancyRate = ((occupiedBeds / beds.length) * 100).toFixed(0);

  const totalRevenue = bills
    .filter(b => b.status === 'paid')
    .reduce((sum, b) => sum + b.total, 0);

  const pendingReceivables = bills
    .filter(b => b.status === 'pending')
    .reduce((sum, b) => sum + b.total, 0);

  const admittedPatients = patients.filter(p => p.assignedBedId !== null);

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Executive Welcome Banner */}
      <div
        style={{
          background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
          borderRadius: 'var(--radius-xl)',
          padding: '28px 32px',
          color: '#ffffff',
          boxShadow: '0 10px 25px -5px rgba(15, 23, 42, 0.4)',
          border: '1px solid #334155',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 20
        }}
      >
        <div style={{ maxWidth: 660 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(255, 255, 255, 0.1)', padding: '4px 12px', borderRadius: 'var(--radius-full)', fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.05em', marginBottom: 12 }}>
            <Building2 size={14} color="#38bdf8" /> CHIEF HOSPITAL EXECUTIVE CONSOLE
          </div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#ffffff', marginBottom: 6, letterSpacing: '-0.02em' }}>
            {hospitalInfo.name}
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '0.92rem' }}>
            Operating Status: <strong style={{ color: '#34d399' }}>Nominal</strong> &nbsp;•&nbsp;
            {departments.length} Clinical Departments &nbsp;•&nbsp;
            {staff.length} Active Personnel On Duty
          </p>
        </div>

        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <button className="btn btn-primary" onClick={() => onNavigate('doctors')}>
            <UserPlus size={16} /> Add Doctor
          </button>
          <button className="btn btn-secondary" onClick={() => onNavigate('beds')}>
            <BedDouble size={16} /> Bed Matrix
          </button>
          <button className="btn btn-secondary" onClick={() => onNavigate('reports')}>
            <TrendingUp size={16} /> Audit Reports
          </button>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="stat-grid">
        <StatCard
          label="Total Registered Patients"
          value={totalPatients}
          subtext={`${admittedPatients.length} currently inpatient admitted`}
          icon={Users}
          color="blue"
        />
        <StatCard
          label="Active Physicians"
          value={`${activeDoctors} / ${doctors.length}`}
          subtext="Consulting across 8 specialties"
          icon={Stethoscope}
          color="indigo"
        />
        <StatCard
          label="Bed Occupancy Rate"
          value={`${occupancyRate}%`}
          subtext={`${occupiedBeds} of ${beds.length} beds occupied`}
          icon={BedDouble}
          color={Number(occupancyRate) > 70 ? "amber" : "emerald"}
        />
        <StatCard
          label="Settled Hospital Revenue"
          value={`$${totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          subtext={`Pending: $${pendingReceivables.toFixed(2)}`}
          icon={Receipt}
          color="emerald"
        />
      </div>

      {/* 2-Column Section: Bed Allocation Matrix & Inpatient Census */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: 24 }}>
        {/* Ward Bed Occupancy Breakdown */}
        <div className="card">
          <div className="card-header">
            <span className="card-title">
              <BedDouble size={18} color="var(--primary-600)" />
              Ward & ICU Occupancy Breakdown
            </span>
            <button className="btn btn-outline btn-sm" onClick={() => onNavigate('beds')}>
              Open Full Bed Matrix
            </button>
          </div>

          <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {['Intensive Care Unit (ICU)', 'General Medical Ward', 'Deluxe Executive Suite', 'Emergency & Trauma Bay'].map(wardName => {
              const wardBeds = beds.filter(b => b.ward === wardName);
              const occupiedInWard = wardBeds.filter(b => b.status === 'occupied').length;
              const percent = wardBeds.length > 0 ? ((occupiedInWard / wardBeds.length) * 100).toFixed(0) : 0;

              return (
                <div key={wardName} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem' }}>
                    <strong>{wardName}</strong>
                    <span style={{ color: 'var(--text-muted)' }}>
                      {occupiedInWard} / {wardBeds.length} Beds ({percent}%)
                    </span>
                  </div>
                  <div style={{ width: '100%', height: 8, background: 'var(--border-default)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                    <div
                      style={{
                        width: `${percent}%`,
                        height: '100%',
                        background: Number(percent) > 60 ? 'var(--rose-500)' : 'var(--primary-500)',
                        borderRadius: 'var(--radius-full)'
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Current Inpatient Admissions */}
        <div className="card">
          <div className="card-header">
            <span className="card-title">
              <Activity size={18} color="var(--emerald-600)" />
              Active Inpatient Admissions
            </span>
            <span className="badge badge-info">{admittedPatients.length} Admitted</span>
          </div>

          <div className="card-body" style={{ padding: 0 }}>
            {admittedPatients.length === 0 ? (
              <div style={{ padding: 30, textAlign: 'center', color: 'var(--text-muted)' }}>
                No active inpatient admissions currently assigned to beds.
              </div>
            ) : (
              <div className="table-container" style={{ border: 'none', borderRadius: 0 }}>
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Patient</th>
                      <th>Assigned Bed</th>
                      <th>Blood Group</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {admittedPatients.map(p => {
                      const bed = beds.find(b => b.id === p.assignedBedId);
                      return (
                        <tr key={p.id}>
                          <td>
                            <strong>{p.name}</strong>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>#{p.id.toUpperCase()}</div>
                          </td>
                          <td>
                            <strong style={{ color: 'var(--primary-600)' }}>{bed?.roomNo || p.assignedBedId}</strong>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{bed?.ward}</div>
                          </td>
                          <td style={{ fontWeight: 700, color: 'var(--rose-600)' }}>{p.bloodGroup}</td>
                          <td><Badge status={p.admissionStatus} /></td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Global Quick Action Command Console */}
      <div className="card">
        <div className="card-header">
          <span className="card-title">System Administration Quick Hub</span>
        </div>
        <div className="card-body" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14 }}>
          <button className="btn btn-secondary" style={{ height: 60, justifyContent: 'flex-start' }} onClick={() => onNavigate('doctors')}>
            <Stethoscope size={20} color="var(--primary-600)" />
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontWeight: 700, fontSize: '0.88rem' }}>Manage Doctors</div>
              <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>{doctors.length} Registered</div>
            </div>
          </button>

          <button className="btn btn-secondary" style={{ height: 60, justifyContent: 'flex-start' }} onClick={() => onNavigate('patients')}>
            <Users size={20} color="var(--teal-600)" />
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontWeight: 700, fontSize: '0.88rem' }}>Manage Patients</div>
              <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>Admit, discharge, records</div>
            </div>
          </button>

          <button className="btn btn-secondary" style={{ height: 60, justifyContent: 'flex-start' }} onClick={() => onNavigate('beds')}>
            <BedDouble size={20} color="var(--indigo-600)" />
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontWeight: 700, fontSize: '0.88rem' }}>Bed Matrix</div>
              <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>ICU & Wards floor map</div>
            </div>
          </button>

          <button className="btn btn-secondary" style={{ height: 60, justifyContent: 'flex-start' }} onClick={() => onNavigate('billing')}>
            <Receipt size={20} color="var(--emerald-600)" />
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontWeight: 700, fontSize: '0.88rem' }}>Billing & Finance</div>
              <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>{bills.length} Invoices</div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
