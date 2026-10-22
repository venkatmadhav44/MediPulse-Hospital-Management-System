import React, { useState } from 'react';
import { useHospital } from '../../context/HospitalContext';
import { useAuth } from '../../context/AuthContext';
import Badge from '../common/Badge';
import Modal from '../common/Modal';
import {
  FlaskConical,
  Printer,
  Calendar,
  User,
  AlertTriangle,
  CheckCircle2,
  FileText,
  Clock
} from 'lucide-react';

export default function PatientLabReports() {
  const { labReports, hospitalInfo } = useHospital();
  const { currentUser } = useAuth();
  const [selectedReport, setSelectedReport] = useState(null);

  const myLabReports = labReports.filter(l => l.patientId === (currentUser?.id || 'pat-1'));

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Laboratory Diagnostics & Pathology Reports</h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          Review hematology, biochemistry, and imaging diagnostic results with normal reference range comparisons.
        </p>
      </div>

      {myLabReports.length === 0 ? (
        <div className="card" style={{ padding: 40, textAlign: 'center' }}>
          <FlaskConical size={38} color="var(--text-muted)" style={{ margin: '0 auto 12px' }} />
          <h3>No Laboratory Reports Found</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginTop: 4 }}>
            Diagnostic tests ordered by your physician will appear here once processed.
          </p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: 20 }}>
          {myLabReports.map(report => {
            const hasAbnormal = report.results?.some(r => r.flag === 'abnormal');

            return (
              <div key={report.id} className="card card-hover" style={{ display: 'flex', flexDirection: 'column' }}>
                <div className="card-header">
                  <div>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary-600)' }}>
                      #{report.id.toUpperCase()} • {report.category}
                    </span>
                    <h4 style={{ fontSize: '1.05rem', fontWeight: 800, marginTop: 2 }}>{report.testName}</h4>
                  </div>
                  <Badge status={report.status} />
                </div>

                <div className="card-body" style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 14 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.84rem' }}>
                    <div>
                      <span style={{ color: 'var(--text-muted)' }}>Ordered by:</span>
                      <div style={{ fontWeight: 700 }}>{report.orderedBy}</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Report Date:</span>
                      <div style={{ fontWeight: 700 }}>{report.reportDate || 'Under Processing'}</div>
                    </div>
                  </div>

                  {report.status === 'completed' && report.results?.length > 0 ? (
                    <div style={{ background: 'var(--bg-surface-subtle)', borderRadius: 'var(--radius-md)', padding: 12 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                        <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 700, color: 'var(--text-muted)' }}>
                          Sample Parameters ({report.results.length})
                        </span>
                        {hasAbnormal ? (
                          <span className="badge badge-warning" style={{ fontSize: '0.7rem' }}>
                            <AlertTriangle size={12} /> Out of Range Flags
                          </span>
                        ) : (
                          <span className="badge badge-success" style={{ fontSize: '0.7rem' }}>
                            <CheckCircle2 size={12} /> All Normal
                          </span>
                        )}
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                        {report.results.slice(0, 3).map((res, idx) => (
                          <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem' }}>
                            <span style={{ color: 'var(--text-secondary)' }}>{res.parameter}</span>
                            <span style={{ fontWeight: 700, color: res.flag === 'abnormal' ? 'var(--rose-600)' : 'var(--text-primary)' }}>
                              {res.value} {res.unit}
                            </span>
                          </div>
                        ))}
                        {report.results.length > 3 && (
                          <span style={{ fontSize: '0.75rem', color: 'var(--primary-600)', fontWeight: 600 }}>
                            + {report.results.length - 3} more parameters in full report...
                          </span>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div style={{ background: 'var(--amber-50)', padding: 12, borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', gap: 10, color: 'var(--amber-800)', fontSize: '0.82rem' }}>
                      <Clock size={16} />
                      <span>Diagnostic sample is currently in the hospital laboratory queue.</span>
                    </div>
                  )}

                  {report.overallImpression && (
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', background: 'var(--bg-surface-subtle)', padding: '8px 12px', borderRadius: 'var(--radius-sm)' }}>
                      <strong>Impression:</strong> {report.overallImpression}
                    </div>
                  )}

                  <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'flex-end', paddingTop: 8 }}>
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => setSelectedReport(report)}
                    >
                      <FileText size={15} />
                      View Full Analysis
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Detailed Lab Report Modal */}
      {selectedReport && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedReport(null)}
          title={`Diagnostic Analysis: ${selectedReport.testName}`}
          subtitle={`Report Ref: #${selectedReport.id.toUpperCase()} • Patient: ${selectedReport.patientName}`}
          size="lg"
          footer={
            <>
              <button className="btn btn-secondary" onClick={() => setSelectedReport(null)}>
                Close
              </button>
              <button className="btn btn-primary" onClick={() => window.print()}>
                <Printer size={16} /> Print Diagnostic Report
              </button>
            </>
          }
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: 12,
                background: 'var(--bg-surface-subtle)',
                padding: '14px 18px',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.85rem'
              }}
            >
              <div>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase' }}>Ordering Doctor</span>
                <div style={{ fontWeight: 700 }}>{selectedReport.orderedBy}</div>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase' }}>Order Date</span>
                <div style={{ fontWeight: 700 }}>{selectedReport.orderDate}</div>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase' }}>Status</span>
                <div style={{ marginTop: 2 }}><Badge status={selectedReport.status} /></div>
              </div>
            </div>

            {selectedReport.results?.length > 0 ? (
              <div className="table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Test Parameter</th>
                      <th>Measured Result</th>
                      <th>Standard Reference Range</th>
                      <th>Interpretation</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedReport.results.map((r, idx) => (
                      <tr key={idx}>
                        <td style={{ fontWeight: 600 }}>{r.parameter}</td>
                        <td style={{ fontWeight: 800, fontSize: '0.95rem', color: r.flag === 'abnormal' ? 'var(--rose-600)' : 'var(--text-primary)' }}>
                          {r.value} <span style={{ fontSize: '0.78rem', fontWeight: 400, color: 'var(--text-muted)' }}>{r.unit}</span>
                        </td>
                        <td style={{ color: 'var(--text-secondary)' }}>{r.normalRange} {r.unit}</td>
                        <td>
                          {r.flag === 'abnormal' ? (
                            <span className="badge badge-danger">Out of Range</span>
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
                Report data currently pending laboratory release.
              </div>
            )}

            {selectedReport.overallImpression && (
              <div style={{ background: 'var(--primary-50)', border: '1px solid rgba(14, 165, 233, 0.25)', borderRadius: 'var(--radius-md)', padding: 14 }}>
                <strong style={{ fontSize: '0.85rem', color: 'var(--primary-800)', textTransform: 'uppercase' }}>
                  Pathologist Final Clinical Impression:
                </strong>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-primary)', marginTop: 4, lineHeight: 1.4 }}>
                  {selectedReport.overallImpression}
                </p>
              </div>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
}
