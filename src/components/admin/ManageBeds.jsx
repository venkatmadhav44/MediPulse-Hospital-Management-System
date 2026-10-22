import React, { useState } from 'react';
import { useHospital } from '../../context/HospitalContext';
import { useToast } from '../common/Toast';
import Modal from '../common/Modal';
import Badge from '../common/Badge';
import StatCard from '../common/StatCard';
import {
  BedDouble,
  UserPlus,
  LogOut,
  Sparkles,
  Search,
  Filter,
  AlertTriangle,
  CheckCircle2,
  Clock
} from 'lucide-react';

export default function ManageBeds() {
  const { beds, patients, assignBed, vacateBed, setBedStatus } = useHospital();
  const { addToast } = useToast();

  const [selectedWard, setSelectedWard] = useState('all');
  const [selectedBedForAllocation, setSelectedBedForAllocation] = useState(null);
  const [targetPatientId, setTargetPatientId] = useState('');

  const unadmittedPatients = patients.filter(p => !p.assignedBedId);

  const totalBeds = beds.length;
  const availableBeds = beds.filter(b => b.status === 'available').length;
  const occupiedBeds = beds.filter(b => b.status === 'occupied').length;
  const cleaningBeds = beds.filter(b => b.status === 'cleaning').length;

  const filteredBeds = beds.filter(b =>
    selectedWard === 'all' || b.ward === selectedWard
  );

  const handleOpenAllocate = (bed) => {
    setSelectedBedForAllocation(bed);
    setTargetPatientId(unadmittedPatients[0]?.id || '');
  };

  const handleAllocateSubmit = (e) => {
    e.preventDefault();
    if (!targetPatientId) {
      addToast('Please select a patient to allocate to this bed', 'danger');
      return;
    }
    const patient = patients.find(p => p.id === targetPatientId);
    assignBed(selectedBedForAllocation.id, targetPatientId);
    addToast(`Bed ${selectedBedForAllocation.id} allocated to ${patient?.name}!`, 'success');
    setSelectedBedForAllocation(null);
  };

  const handleVacate = (bed) => {
    vacateBed(bed.id);
    addToast(`Bed ${bed.id} vacated and queued for clinical sanitation`, 'info');
  };

  const handleCleaned = (bed) => {
    setBedStatus(bed.id, 'available');
    addToast(`Bed ${bed.id} sanitized and marked ready for admission`, 'success');
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Hospital Room & Inpatient Bed Management Matrix</h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          Real-time bed occupancy telemetry, ICU life-support monitoring, ward allocations, and sanitization queues.
        </p>
      </div>

      {/* Stats */}
      <div className="stat-grid">
        <StatCard
          label="Total Hospital Beds"
          value={totalBeds}
          subtext="Capacity across 4 ward types"
          icon={BedDouble}
          color="blue"
        />
        <StatCard
          label="Available Beds"
          value={availableBeds}
          subtext="Ready for immediate admission"
          icon={CheckCircle2}
          color="emerald"
        />
        <StatCard
          label="Occupied Beds"
          value={occupiedBeds}
          subtext={`${((occupiedBeds / totalBeds) * 100).toFixed(0)}% Occupancy rate`}
          icon={BedDouble}
          color="rose"
        />
        <StatCard
          label="Sanitation Queue"
          value={cleaningBeds}
          subtext="Under terminal cleaning"
          icon={Sparkles}
          color="amber"
        />
      </div>

      {/* Filter Tabs */}
      <div className="card">
        <div className="card-body">
          <div className="tabs-header" style={{ margin: 0, border: 'none' }}>
            <button
              className={`tab-btn ${selectedWard === 'all' ? 'active' : ''}`}
              onClick={() => setSelectedWard('all')}
            >
              All Hospital Wards ({beds.length})
            </button>
            <button
              className={`tab-btn ${selectedWard === 'Intensive Care Unit (ICU)' ? 'active' : ''}`}
              onClick={() => setSelectedWard('Intensive Care Unit (ICU)')}
            >
              ICU ({beds.filter(b => b.ward === 'Intensive Care Unit (ICU)').length})
            </button>
            <button
              className={`tab-btn ${selectedWard === 'General Medical Ward' ? 'active' : ''}`}
              onClick={() => setSelectedWard('General Medical Ward')}
            >
              General Ward ({beds.filter(b => b.ward === 'General Medical Ward').length})
            </button>
            <button
              className={`tab-btn ${selectedWard === 'Deluxe Executive Suite' ? 'active' : ''}`}
              onClick={() => setSelectedWard('Deluxe Executive Suite')}
            >
              Deluxe Suites ({beds.filter(b => b.ward === 'Deluxe Executive Suite').length})
            </button>
            <button
              className={`tab-btn ${selectedWard === 'Emergency & Trauma Bay' ? 'active' : ''}`}
              onClick={() => setSelectedWard('Emergency & Trauma Bay')}
            >
              Emergency Bays ({beds.filter(b => b.ward === 'Emergency & Trauma Bay').length})
            </button>
          </div>
        </div>
      </div>

      {/* Visual Bed Grid Matrix */}
      <div className="bed-matrix-grid">
        {filteredBeds.map(bed => {
          const isOccupied = bed.status === 'occupied';
          const isAvailable = bed.status === 'available';
          const isCleaning = bed.status === 'cleaning';

          return (
            <div key={bed.id} className={`bed-card status-${bed.status}`}>
              <div className="bed-header">
                <div>
                  <div className="bed-id">{bed.roomNo}</div>
                  <div className="bed-ward-type">{bed.type}</div>
                </div>
                <Badge status={bed.status} />
              </div>

              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                Ward: <strong>{bed.ward}</strong>
              </div>

              {isOccupied && (
                <div className="bed-occupant-info">
                  <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700 }}>
                    Inpatient Occupant:
                  </span>
                  <div className="bed-occupant-name">{bed.occupantName}</div>
                  <div className="bed-occupant-detail">Patient ID: #{bed.occupantId?.toUpperCase()}</div>
                </div>
              )}

              {isCleaning && (
                <div style={{ background: 'var(--amber-50)', padding: 8, borderRadius: 4, fontSize: '0.75rem', color: 'var(--amber-800)', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Sparkles size={14} /> Terminal cleaning & sterilization in progress
                </div>
              )}

              {isAvailable && (
                <div style={{ background: 'var(--emerald-50)', padding: 8, borderRadius: 4, fontSize: '0.75rem', color: 'var(--emerald-800)', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <CheckCircle2 size={14} /> Ready for emergency or planned admission
                </div>
              )}

              <div style={{ marginTop: 'auto', paddingTop: 8, display: 'flex', justifyContent: 'flex-end', gap: 6 }}>
                {isAvailable && (
                  <button
                    className="btn btn-primary btn-sm"
                    style={{ width: '100%' }}
                    onClick={() => handleOpenAllocate(bed)}
                  >
                    <UserPlus size={14} /> Allocate Bed
                  </button>
                )}

                {isOccupied && (
                  <button
                    className="btn btn-danger btn-sm"
                    style={{ width: '100%' }}
                    onClick={() => handleVacate(bed)}
                  >
                    <LogOut size={14} /> Discharge
                  </button>
                )}

                {isCleaning && (
                  <button
                    className="btn btn-success btn-sm"
                    style={{ width: '100%' }}
                    onClick={() => handleCleaned(bed)}
                  >
                    <Sparkles size={14} /> Mark Sanitized
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Allocate Bed Modal */}
      {selectedBedForAllocation && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedBedForAllocation(null)}
          title={`Allocate Bed: ${selectedBedForAllocation.roomNo}`}
          subtitle={`${selectedBedForAllocation.ward} • ${selectedBedForAllocation.type}`}
        >
          <form onSubmit={handleAllocateSubmit}>
            <div className="form-group">
              <label className="form-label">Select Patient for Inpatient Admission</label>
              {unadmittedPatients.length === 0 ? (
                <div style={{ background: 'var(--rose-50)', padding: 12, borderRadius: 6, color: 'var(--rose-700)', fontSize: '0.85rem' }}>
                  All registered patients currently have an allocated bed. Register a new patient or select from patient directory.
                </div>
              ) : (
                <select
                  className="form-select"
                  value={targetPatientId}
                  onChange={(e) => setTargetPatientId(e.target.value)}
                  required
                >
                  {unadmittedPatients.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.name} (#{p.id.toUpperCase()}) • {p.age} yrs, {p.gender}, Blood: {p.bloodGroup}
                    </option>
                  ))}
                </select>
              )}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 20 }}>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setSelectedBedForAllocation(null)}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={unadmittedPatients.length === 0}
              >
                Confirm Bed Allocation
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
