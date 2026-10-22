import React, { useState } from 'react';
import { useHospital } from '../../context/HospitalContext';
import { useToast } from '../common/Toast';
import Badge from '../common/Badge';
import Modal from '../common/Modal';
import StatCard from '../common/StatCard';
import {
  Receipt,
  Plus,
  Search,
  DollarSign,
  CheckCircle2,
  Clock,
  Printer,
  FileText
} from 'lucide-react';

export default function ManageBilling() {
  const { bills, patients, createBill, payBill } = useHospital();
  const { addToast } = useToast();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  // New Invoice Form
  const [targetPatientId, setTargetPatientId] = useState(patients[0]?.id || '');
  const [itemDescription, setItemDescription] = useState('General Consultation & Treatment Charge');
  const [itemCategory, setItemCategory] = useState('Consultation');
  const [itemAmount, setItemAmount] = useState(150);

  const totalPaid = bills.filter(b => b.status === 'paid').reduce((s, b) => s + b.total, 0);
  const totalPending = bills.filter(b => b.status === 'pending').reduce((s, b) => s + b.total, 0);

  const filteredBills = bills.filter(b => {
    const matchesSearch =
      b.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || b.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const handleCreateSubmit = (e) => {
    e.preventDefault();
    const patient = patients.find(p => p.id === targetPatientId);
    if (!patient) return;

    const amt = Number(itemAmount);
    const tax = +(amt * 0.05).toFixed(2);
    const total = +(amt + tax).toFixed(2);

    createBill({
      patientId: patient.id,
      patientName: patient.name,
      items: [{ description: itemDescription, category: itemCategory, amount: amt }],
      subtotal: amt,
      taxRate: 5,
      taxAmount: tax,
      total
    });

    addToast(`Invoice generated for ${patient.name} ($${total.toFixed(2)})!`, 'success');
    setIsCreateModalOpen(false);
  };

  const handleMarkPaid = (billId) => {
    payBill(billId, 'Counter Cash / Admin Manual Settlement');
    addToast(`Invoice #${billId.toUpperCase()} marked as settled!`, 'success');
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Hospital Financial & Billing Management Console</h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Track hospital gross revenues, patient accounts, insurance settlements, and itemized clinical charges.
          </p>
        </div>

        <button className="btn btn-primary" onClick={() => setIsCreateModalOpen(true)}>
          <Plus size={16} /> Generate Hospital Invoice
        </button>
      </div>

      {/* Stats */}
      <div className="stat-grid">
        <StatCard
          label="Gross Settled Revenues"
          value={`$${totalPaid.toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
          subtext="Cleared through cards, cash, and insurance"
          icon={DollarSign}
          color="emerald"
        />
        <StatCard
          label="Pending Receivables"
          value={`$${totalPending.toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
          subtext={`${bills.filter(b => b.status === 'pending').length} unpaid patient accounts`}
          icon={Clock}
          color="amber"
        />
        <StatCard
          label="Total Invoices Issued"
          value={bills.length}
          subtext="Hospital-wide clinical statements"
          icon={Receipt}
          color="blue"
        />
      </div>

      {/* Filter Bar */}
      <div className="card">
        <div className="card-body">
          <div className="search-filter-bar" style={{ margin: 0 }}>
            <div className="search-input-wrap">
              <Search size={18} />
              <input
                type="text"
                className="search-input"
                placeholder="Search invoices by patient name or invoice ID (#inv-9001)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="filter-group">
              <select
                className="form-select"
                style={{ width: 'auto', minWidth: 160 }}
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
              >
                <option value="all">All Invoices ({bills.length})</option>
                <option value="paid">Settled / Paid</option>
                <option value="pending">Pending</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Billing Table */}
      <div className="card">
        <div className="card-body" style={{ padding: 0 }}>
          <div className="table-container" style={{ border: 'none', borderRadius: 0 }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Invoice ID</th>
                  <th>Patient Name</th>
                  <th>Date Issued</th>
                  <th>Due Date</th>
                  <th>Items Count</th>
                  <th>Total Amount</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredBills.map(bill => (
                  <tr key={bill.id}>
                    <td style={{ fontWeight: 700, color: 'var(--primary-600)' }}>
                      #{bill.id.toUpperCase()}
                    </td>
                    <td>
                      <strong>{bill.patientName}</strong>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>#{bill.patientId.toUpperCase()}</div>
                    </td>
                    <td>{bill.date}</td>
                    <td>{bill.dueDate}</td>
                    <td><span className="badge badge-neutral">{bill.items.length} Items</span></td>
                    <td style={{ fontWeight: 800, fontSize: '0.95rem' }}>${bill.total.toFixed(2)}</td>
                    <td><Badge status={bill.status} /></td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: 6 }}>
                        {bill.status === 'pending' && (
                          <button
                            className="btn btn-success btn-sm"
                            onClick={() => handleMarkPaid(bill.id)}
                          >
                            <CheckCircle2 size={14} /> Record Payment
                          </button>
                        )}
                        <button
                          className="btn btn-secondary btn-sm"
                          onClick={() => setSelectedInvoice(bill)}
                        >
                          <FileText size={14} /> View Statement
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

      {/* Generate Invoice Modal */}
      {isCreateModalOpen && (
        <Modal
          isOpen={true}
          onClose={() => setIsCreateModalOpen(false)}
          title="Generate Hospital Patient Invoice"
          subtitle="Itemize diagnostic, procedural, or inpatient accommodation charges"
        >
          <form onSubmit={handleCreateSubmit}>
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
                    {p.name} (#{p.id.toUpperCase()})
                  </option>
                ))}
              </select>
            </div>

            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">Primary Charge Description</label>
                <input
                  type="text"
                  className="form-input"
                  value={itemDescription}
                  onChange={(e) => setItemDescription(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Category</label>
                <select
                  className="form-select"
                  value={itemCategory}
                  onChange={(e) => setItemCategory(e.target.value)}
                >
                  <option value="Consultation">Consultation</option>
                  <option value="Diagnostics">Diagnostics / Labs</option>
                  <option value="Pharmacy">Pharmacy</option>
                  <option value="Hospital Stay">Hospital Stay / Room</option>
                  <option value="Surgery">Surgical Procedure</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Amount ($ USD)</label>
              <input
                type="number"
                className="form-input"
                value={itemAmount}
                onChange={(e) => setItemAmount(e.target.value)}
                min="10"
                step="5"
                required
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 14 }}>
              <button type="button" className="btn btn-secondary" onClick={() => setIsCreateModalOpen(false)}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                Issue Invoice
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Invoice Detail Modal */}
      {selectedInvoice && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedInvoice(null)}
          title={`Hospital Tax Statement: #${selectedInvoice.id.toUpperCase()}`}
          subtitle={`Patient: ${selectedInvoice.patientName} • Date: ${selectedInvoice.date}`}
          size="lg"
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Status:</span>
                <div style={{ marginTop: 2 }}><Badge status={selectedInvoice.status} /></div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Total Amount:</span>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--primary-600)' }}>
                  ${selectedInvoice.total.toFixed(2)}
                </div>
              </div>
            </div>

            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Item Description</th>
                    <th>Category</th>
                    <th style={{ textAlign: 'right' }}>Price</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedInvoice.items.map((it, idx) => (
                    <tr key={idx}>
                      <td style={{ fontWeight: 600 }}>{it.description}</td>
                      <td><span className="badge badge-neutral">{it.category}</span></td>
                      <td style={{ textAlign: 'right', fontWeight: 700 }}>${it.amount.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
              <button className="btn btn-secondary" onClick={() => setSelectedInvoice(null)}>
                Close
              </button>
              <button className="btn btn-primary" onClick={() => window.print()}>
                <Printer size={15} /> Print Statement
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
