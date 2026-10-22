import React, { useState } from 'react';
import { useHospital } from '../../context/HospitalContext';
import StatCard from '../common/StatCard';
import Badge from '../common/Badge';
import {
  FileText,
  Printer,
  Download,
  Calendar,
  Users,
  BedDouble,
  DollarSign,
  Building,
  TrendingUp,
  ShieldCheck
} from 'lucide-react';

export default function SystemReports() {
  const { hospitalInfo, patients, doctors, appointments, beds, bills, departments } = useHospital();
  const [reportType, setReportType] = useState('census'); // 'census', 'financial', 'occupancy'

  const occupiedBeds = beds.filter(b => b.status === 'occupied').length;
  const occupancyPercent = ((occupiedBeds / beds.length) * 100).toFixed(0);

  const totalRev = bills.filter(b => b.status === 'paid').reduce((s, b) => s + b.total, 0);
  const pendingRev = bills.filter(b => b.status === 'pending').reduce((s, b) => s + b.total, 0);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Hospital Executive Analytics & Operational Reports</h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Generate and audit clinical metrics, patient census records, department occupancy, and fiscal balance sheets.
          </p>
        </div>

        <button className="btn btn-primary" onClick={handlePrint}>
          <Printer size={16} /> Print / Export Report
        </button>
      </div>

      {/* Tabs */}
      <div className="card">
        <div className="card-body">
          <div className="tabs-header" style={{ margin: 0, border: 'none' }}>
            <button
              className={`tab-btn ${reportType === 'census' ? 'active' : ''}`}
              onClick={() => setReportType('census')}
            >
              Daily Hospital Census
            </button>
            <button
              className={`tab-btn ${reportType === 'occupancy' ? 'active' : ''}`}
              onClick={() => setReportType('occupancy')}
            >
              Bed Utilization Audit
            </button>
            <button
              className={`tab-btn ${reportType === 'financial' ? 'active' : ''}`}
              onClick={() => setReportType('financial')}
            >
              Fiscal Revenue Summary
            </button>
          </div>
        </div>
      </div>

      {/* Printable Report Document Container */}
      <div className="printable-area card" style={{ padding: 32 }}>
        <div style={{ borderBottom: '2px solid var(--primary-600)', paddingBottom: 16, marginBottom: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h2 style={{ color: 'var(--primary-600)', fontSize: '1.4rem', fontWeight: 800 }}>
              {hospitalInfo.name}
            </h2>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              Accreditation: {hospitalInfo.accreditation} • Reg: {hospitalInfo.registrationNo}
            </p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: '0.82rem', textTransform: 'uppercase', fontWeight: 700, color: 'var(--text-muted)' }}>
              Report Generated
            </span>
            <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{new Date().toLocaleDateString()}</div>
          </div>
        </div>

        {reportType === 'census' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800 }}>Daily Clinical Census & Patient Volume</h3>
            <div className="stat-grid" style={{ margin: 0 }}>
              <StatCard label="Total Registered" value={patients.length} icon={Users} color="blue" />
              <StatCard label="Active Inpatients" value={patients.filter(p => p.assignedBedId).length} icon={BedDouble} color="emerald" />
              <StatCard label="Scheduled OPD" value={appointments.length} icon={Calendar} color="indigo" />
            </div>

            <div className="table-container" style={{ marginTop: 12 }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Patient Name</th>
                    <th>Age / Gender</th>
                    <th>Blood Group</th>
                    <th>Status</th>
                    <th>Assigned Bed</th>
                  </tr>
                </thead>
                <tbody>
                  {patients.map(p => (
                    <tr key={p.id}>
                      <td style={{ fontWeight: 600 }}>{p.name}</td>
                      <td>{p.age} yrs, {p.gender}</td>
                      <td style={{ fontWeight: 700, color: 'var(--rose-600)' }}>{p.bloodGroup}</td>
                      <td><Badge status={p.admissionStatus} /></td>
                      <td>{p.assignedBedId || 'Outpatient'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {reportType === 'occupancy' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800 }}>Hospital Ward Bed Utilization Audit</h3>
            <div className="stat-grid" style={{ margin: 0 }}>
              <StatCard label="Occupancy Rate" value={`${occupancyPercent}%`} icon={BedDouble} color="blue" />
              <StatCard label="Occupied Beds" value={occupiedBeds} icon={Users} color="rose" />
              <StatCard label="Available Beds" value={beds.filter(b => b.status === 'available').length} icon={ShieldCheck} color="emerald" />
            </div>

            <div className="table-container" style={{ marginTop: 12 }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Bed Identifier</th>
                    <th>Ward / Sector</th>
                    <th>Room Type</th>
                    <th>Status</th>
                    <th>Current Occupant</th>
                  </tr>
                </thead>
                <tbody>
                  {beds.map(b => (
                    <tr key={b.id}>
                      <td style={{ fontWeight: 700 }}>{b.roomNo}</td>
                      <td>{b.ward}</td>
                      <td>{b.type}</td>
                      <td><Badge status={b.status} /></td>
                      <td>{b.occupantName || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {reportType === 'financial' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800 }}>Hospital Revenue & Fiscal Audit</h3>
            <div className="stat-grid" style={{ margin: 0 }}>
              <StatCard label="Gross Settled" value={`$${totalRev.toFixed(2)}`} icon={DollarSign} color="emerald" />
              <StatCard label="Pending Receivables" value={`$${pendingRev.toFixed(2)}`} icon={TrendingUp} color="amber" />
              <StatCard label="Invoices Cleared" value={bills.filter(b => b.status === 'paid').length} icon={FileText} color="blue" />
            </div>

            <div className="table-container" style={{ marginTop: 12 }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Invoice ID</th>
                    <th>Patient</th>
                    <th>Date Settled</th>
                    <th>Payment Method</th>
                    <th style={{ textAlign: 'right' }}>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {bills.map(b => (
                    <tr key={b.id}>
                      <td style={{ fontWeight: 700 }}>#{b.id.toUpperCase()}</td>
                      <td>{b.patientName}</td>
                      <td>{b.paidAt || b.date}</td>
                      <td>{b.paymentMethod || 'Pending Payment'}</td>
                      <td style={{ textAlign: 'right', fontWeight: 800 }}>${b.total.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <div style={{ marginTop: 30, borderTop: '1px solid var(--border-default)', paddingTop: 14, display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
          <span>Confidential Hospital Administration Document • MediPulse HMS</span>
          <span>Verified by Chief Hospital Administrator</span>
        </div>
      </div>
    </div>
  );
}
