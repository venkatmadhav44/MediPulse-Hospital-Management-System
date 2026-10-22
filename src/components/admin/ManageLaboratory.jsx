import React, { useState } from 'react';
import { useHospital } from '../../context/HospitalContext';
import { useToast } from '../common/Toast';
import Badge from '../common/Badge';
import Modal from '../common/Modal';
import {
  FlaskConical,
  Search,
  CheckCircle2,
  AlertTriangle,
  FileText
} from 'lucide-react';

export default function ManageLaboratory() {
  const { labReports, updateLabResult } = useHospital();
  const { addToast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedReport, setSelectedReport] = useState(null);

  const filteredReports = labReports.filter(l =>
    l.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    l.testName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    l.orderedBy.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleMarkSampleCompleted = (report) => {
    updateLabResult(
      report.id,
      [
        { parameter: 'Diagnostic Analyte Metric', value: 'Within Standard Limit', unit: '-', normalRange: 'Normal', flag: 'normal' }
      ],
      'Diagnostic pathology specimen verified and cleared by central clinical lab.'
    );
    addToast(`Report #${report.id.toUpperCase()} marked as completed!`, 'success');
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Central Diagnostic Laboratory Services Master</h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          Monitor pathology sample throughput, diagnostic panel turnaround times, and verified specimen reports.
        </p>
      </div>

      <div className="card">
        <div className="card-body">
          <div className="search-filter-bar" style={{ margin: 0 }}>
            <div className="search-input-wrap">
              <Search size={18} />
              <input
                type="text"
                className="search-input"
                placeholder="Search diagnostic orders by patient, test title, or ordering physician..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              {filteredReports.length} Diagnostics Active
            </span>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-body" style={{ padding: 0 }}>
          <div className="table-container" style={{ border: 'none', borderRadius: 0 }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Requisition ID</th>
                  <th>Patient Name</th>
                  <th>Diagnostic Test</th>
                  <th>Category</th>
                  <th>Ordering Physician</th>
                  <th>Order Date</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredReports.map(rep => (
                  <tr key={rep.id}>
                    <td style={{ fontWeight: 700, color: 'var(--primary-600)' }}>
                      #{rep.id.toUpperCase()}
                    </td>
                    <td>
                      <strong>{rep.patientName}</strong>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>#{rep.patientId.toUpperCase()}</div>
                    </td>
                    <td style={{ fontWeight: 600 }}>{rep.testName}</td>
                    <td><span className="badge badge-neutral">{rep.category}</span></td>
                    <td>{rep.orderedBy}</td>
                    <td>{rep.orderDate}</td>
                    <td><Badge status={rep.status} /></td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: 6 }}>
                        {rep.status === 'processing' && (
                          <button
                            className="btn btn-success btn-sm"
                            onClick={() => handleMarkSampleCompleted(rep)}
                          >
                            <CheckCircle2 size={14} /> Verify Results
                          </button>
                        )}
                        <button
                          className="btn btn-secondary btn-sm"
                          onClick={() => setSelectedReport(rep)}
                        >
                          <FileText size={14} /> Inspect
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {selectedReport && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedReport(null)}
          title={`Diagnostic Panel: ${selectedReport.testName}`}
          subtitle={`Patient: ${selectedReport.patientName} • Requisition #${selectedReport.id.toUpperCase()}`}
          size="lg"
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-surface-subtle)', padding: 12, borderRadius: 8 }}>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Ordered By:</span>
                <div><strong>{selectedReport.orderedBy}</strong> on {selectedReport.orderDate}</div>
              </div>
              <Badge status={selectedReport.status} />
            </div>

            {selectedReport.results?.length > 0 ? (
              <div className="table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Parameter</th>
                      <th>Measured</th>
                      <th>Reference Range</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedReport.results.map((r, idx) => (
                      <tr key={idx}>
                        <td>{r.parameter}</td>
                        <td style={{ fontWeight: 700, color: r.flag === 'abnormal' ? 'var(--rose-600)' : 'inherit' }}>
                          {r.value} {r.unit}
                        </td>
                        <td>{r.normalRange} {r.unit}</td>
                        <td>
                          {r.flag === 'abnormal' ? (
                            <span className="badge badge-danger">Abnormal</span>
                          ) : (
                            <span className="badge badge-success">Normal</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div style={{ padding: 20, textAlign: 'center', color: 'var(--text-muted)' }}>
                Sample processing underway in laboratory instrumentation.
              </div>
            )}

            {selectedReport.overallImpression && (
              <div style={{ background: 'var(--bg-surface-subtle)', padding: 12, borderRadius: 8, fontSize: '0.85rem' }}>
                <strong>Impression:</strong> {selectedReport.overallImpression}
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
