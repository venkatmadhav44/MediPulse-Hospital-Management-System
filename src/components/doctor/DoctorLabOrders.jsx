import React, { useState } from 'react';
import { useHospital } from '../../context/HospitalContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../common/Toast';
import Badge from '../common/Badge';
import Modal from '../common/Modal';
import {
  FlaskConical,
  Plus,
  Search,
  CheckCircle2,
  AlertTriangle,
  FileText,
  User,
  Calendar
} from 'lucide-react';

export default function DoctorLabOrders() {
  const { labReports, patients, orderLabTest } = useHospital();
  const { currentUser } = useAuth();
  const { addToast } = useToast();

  const [searchTerm, setSearchTerm] = useState('');
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);

  // New order form
  const [targetPatientId, setTargetPatientId] = useState(patients[0]?.id || '');
  const [testName, setTestName] = useState('Complete Blood Count (CBC) with Differential');
  const [category, setCategory] = useState('Hematology');
  const [notes, setNotes] = useState('');

  const currentDoctorName = currentUser?.name || 'Dr. Sarah Jenkins';
  const doctorLabOrders = labReports.filter(l =>
    l.orderedBy.toLowerCase().includes(currentDoctorName.toLowerCase()) ||
    l.orderedBy.includes('Jenkins')
  );

  const filteredOrders = doctorLabOrders.filter(l =>
    l.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    l.testName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOrderSubmit = (e) => {
    e.preventDefault();
    const patient = patients.find(p => p.id === targetPatientId);
    if (!patient) return;

    orderLabTest({
      testName,
      category,
      patientId: patient.id,
      patientName: patient.name,
      orderedBy: currentDoctorName,
      overallImpression: notes || 'Specimen collected; awaiting laboratory analysis.'
    });

    addToast(`Laboratory test ordered for ${patient.name}!`, 'success');
    setIsOrderModalOpen(false);
    setNotes('');
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Physician Laboratory & Diagnostic Requisitions</h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Track ordered diagnostic panels, sample processing statuses, and reviewed abnormal pathology reports.
          </p>
        </div>

        <button className="btn btn-primary" onClick={() => setIsOrderModalOpen(true)}>
          <Plus size={16} /> Order Diagnostic Test
        </button>
      </div>

      {/* Search Header */}
      <div className="card">
        <div className="card-body">
          <div className="search-filter-bar" style={{ margin: 0 }}>
            <div className="search-input-wrap">
              <Search size={18} />
              <input
                type="text"
                className="search-input"
                placeholder="Search ordered tests by patient name or test title..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              {filteredOrders.length} Diagnostic Orders
            </span>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="card">
        <div className="card-body" style={{ padding: 0 }}>
          {filteredOrders.length === 0 ? (
            <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>
              <FlaskConical size={36} style={{ margin: '0 auto 12px', opacity: 0.5 }} />
              <h4>No Laboratory Requisitions Found</h4>
              <p style={{ fontSize: '0.85rem', marginTop: 4 }}>Order a new diagnostic panel for an admitted or OPD patient.</p>
            </div>
          ) : (
            <div className="table-container" style={{ border: 'none', borderRadius: 0 }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Order Date</th>
                    <th>Patient Name</th>
                    <th>Diagnostic Test</th>
                    <th>Category</th>
                    <th>Status</th>
                    <th>Abnormal Flags</th>
                    <th style={{ textAlign: 'right' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map(order => {
                    const hasAbnormal = order.results?.some(r => r.flag === 'abnormal');

                    return (
                      <tr key={order.id}>
                        <td style={{ fontWeight: 600 }}>{order.orderDate}</td>
                        <td>
                          <div style={{ fontWeight: 700 }}>{order.patientName}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>#{order.patientId.toUpperCase()}</div>
                        </td>
                        <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{order.testName}</td>
                        <td><span className="badge badge-neutral">{order.category}</span></td>
                        <td><Badge status={order.status} /></td>
                        <td>
                          {order.status === 'completed' ? (
                            hasAbnormal ? (
                              <span className="badge badge-danger">Out of Range</span>
                            ) : (
                              <span className="badge badge-success">All Normal</span>
                            )
                          ) : (
                            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Awaiting Specimen</span>
                          )}
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <button
                            className="btn btn-secondary btn-sm"
                            onClick={() => setSelectedReport(order)}
                          >
                            <FileText size={14} /> Review Findings
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* New Lab Order Modal */}
      {isOrderModalOpen && (
        <Modal
          isOpen={true}
          onClose={() => setIsOrderModalOpen(false)}
          title="Order Laboratory Diagnostic Panel"
          subtitle="Requisition will be dispatched immediately to Central Pathology"
        >
          <form onSubmit={handleOrderSubmit}>
            <div className="form-group">
              <label className="form-label">Select Patient</label>
              <select
                className="form-select"
                value={targetPatientId}
                onChange={(e) => setTargetPatientId(e.target.value)}
                required
              >
                {patients.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.name} (#{p.id.toUpperCase()}) • {p.age} yrs, {p.gender}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">Diagnostic Test Name</label>
                <input
                  type="text"
                  className="form-input"
                  value={testName}
                  onChange={(e) => setTestName(e.target.value)}
                  placeholder="e.g. Complete Blood Count (CBC)"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Category</label>
                <select
                  className="form-select"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option value="Hematology">Hematology</option>
                  <option value="Biochemistry">Biochemistry</option>
                  <option value="Radiology">Radiology & Imaging</option>
                  <option value="Endocrinology">Endocrinology</option>
                  <option value="Microbiology">Microbiology</option>
                  <option value="Cardiology Diagnostics">Cardiology Diagnostics</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Clinical Indication / Special Specimen Instructions</label>
              <textarea
                className="form-textarea"
                rows="3"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Fasting sample requested, stat turnaround required for urgent surgical clearance..."
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 16 }}>
              <button type="button" className="btn btn-secondary" onClick={() => setIsOrderModalOpen(false)}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                Confirm & Dispatch Requisition
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Review Findings Modal */}
      {selectedReport && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedReport(null)}
          title={`Diagnostic Findings: ${selectedReport.testName}`}
          subtitle={`Patient: ${selectedReport.patientName} • Requisition #${selectedReport.id.toUpperCase()}`}
          size="lg"
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {selectedReport.results?.length > 0 ? (
              <div className="table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Analyte Parameter</th>
                      <th>Measured Level</th>
                      <th>Reference Range</th>
                      <th>Diagnostic Flag</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedReport.results.map((r, idx) => (
                      <tr key={idx}>
                        <td style={{ fontWeight: 600 }}>{r.parameter}</td>
                        <td style={{ fontWeight: 800, color: r.flag === 'abnormal' ? 'var(--rose-600)' : 'inherit' }}>
                          {r.value} {r.unit}
                        </td>
                        <td style={{ color: 'var(--text-secondary)' }}>{r.normalRange} {r.unit}</td>
                        <td>
                          {r.flag === 'abnormal' ? (
                            <span className="badge badge-danger">Abnormal</span>
                          ) : (
                            <span className="badge badge-success">Within Range</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div style={{ padding: 20, textAlign: 'center', color: 'var(--text-muted)' }}>
                Specimen processing in progress in central clinical laboratory.
              </div>
            )}

            {selectedReport.overallImpression && (
              <div style={{ background: 'var(--bg-surface-subtle)', padding: 14, borderRadius: 'var(--radius-md)', fontSize: '0.85rem' }}>
                <strong>Physician Clinical Impression:</strong>
                <p style={{ marginTop: 4, color: 'var(--text-secondary)' }}>{selectedReport.overallImpression}</p>
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button className="btn btn-secondary" onClick={() => setSelectedReport(null)}>
                Close
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
