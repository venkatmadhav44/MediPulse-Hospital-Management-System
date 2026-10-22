import React, { useState } from 'react';
import { useHospital } from '../../context/HospitalContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../common/Toast';
import Badge from '../common/Badge';
import Modal from '../common/Modal';
import {
  Receipt,
  CreditCard,
  Printer,
  Calendar,
  CheckCircle2,
  DollarSign,
  ShieldCheck,
  Building,
  AlertCircle
} from 'lucide-react';

export default function PatientBills() {
  const { bills, payBill, hospitalInfo } = useHospital();
  const { currentUser } = useAuth();
  const { addToast } = useToast();

  const [payingBill, setPayingBill] = useState(null);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('Credit Card (Visa/Mastercard)');
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [isProcessing, setIsProcessing] = useState(false);

  const myBills = bills.filter(b => b.patientId === (currentUser?.id || 'pat-1'));

  const handlePaymentSubmit = (e) => {
    e.preventDefault();
    setIsProcessing(true);

    setTimeout(() => {
      payBill(payingBill.id, `${paymentMethod} (Ref #${Date.now().toString().slice(-6)})`);
      setIsProcessing(false);
      addToast(`Invoice #${payingBill.id.toUpperCase()} successfully paid! Amount: $${payingBill.total.toFixed(2)}`, 'success');
      setPayingBill(null);
    }, 1200);
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Hospital Invoices & Billing Center</h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          Review itemized clinical consultation fees, laboratory diagnostics, pharmacy medications, and hospital stay charges.
        </p>
      </div>

      {myBills.length === 0 ? (
        <div className="card" style={{ padding: 40, textAlign: 'center' }}>
          <Receipt size={38} color="var(--text-muted)" style={{ margin: '0 auto 12px' }} />
          <h3>No Billing Records Available</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginTop: 4 }}>
            All settled charges and generated bills will be archived here.
          </p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: 20 }}>
          {myBills.map(bill => (
            <div key={bill.id} className="card card-hover" style={{ display: 'flex', flexDirection: 'column' }}>
              <div className="card-header">
                <div>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary-600)' }}>
                    INVOICE #{bill.id.toUpperCase()}
                  </span>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: 2 }}>
                    ${bill.total.toFixed(2)}
                  </div>
                </div>
                <Badge status={bill.status} />
              </div>

              <div className="card-body" style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.84rem' }}>
                  <div>
                    <span style={{ color: 'var(--text-muted)' }}>Issue Date:</span>
                    <div style={{ fontWeight: 600 }}>{bill.date}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Due Date:</span>
                    <div style={{ fontWeight: 600 }}>{bill.dueDate}</div>
                  </div>
                </div>

                {/* Itemized summary */}
                <div style={{ background: 'var(--bg-surface-subtle)', borderRadius: 'var(--radius-md)', padding: 12 }}>
                  <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 700, color: 'var(--text-muted)', marginBottom: 8 }}>
                    Charge Breakdown ({bill.items.length} items)
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {bill.items.map((item, idx) => (
                      <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem' }}>
                        <span style={{ color: 'var(--text-secondary)' }}>{item.description}</span>
                        <strong style={{ color: 'var(--text-primary)' }}>${item.amount.toFixed(2)}</strong>
                      </div>
                    ))}
                  </div>

                  <div style={{ borderTop: '1px solid var(--border-default)', marginTop: 10, paddingTop: 8, display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Tax (5%): ${bill.taxAmount?.toFixed(2) || '0.00'}</span>
                    {bill.discountAmount > 0 && (
                      <span style={{ color: 'var(--emerald-600)', fontWeight: 600 }}>Discount: -${bill.discountAmount.toFixed(2)}</span>
                    )}
                  </div>
                </div>

                {bill.status === 'paid' && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.8rem', color: 'var(--emerald-700)', background: 'var(--emerald-50)', padding: '6px 12px', borderRadius: 'var(--radius-sm)' }}>
                    <CheckCircle2 size={15} />
                    <span>Paid on {bill.paidAt || 'Recently'} via {bill.paymentMethod}</span>
                  </div>
                )}

                <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'flex-end', gap: 8, paddingTop: 8 }}>
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => setSelectedInvoice(bill)}
                  >
                    <Receipt size={14} /> View Invoice
                  </button>

                  {bill.status !== 'paid' && (
                    <button
                      className="btn btn-success btn-sm"
                      onClick={() => setPayingBill(bill)}
                    >
                      <CreditCard size={14} /> Pay Now (${bill.total.toFixed(2)})
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Payment Checkout Modal Simulation */}
      {payingBill && (
        <Modal
          isOpen={true}
          onClose={() => !isProcessing && setPayingBill(null)}
          title="Secure Hospital Bill Payment"
          subtitle={`Invoice #${payingBill.id.toUpperCase()} • Total: $${payingBill.total.toFixed(2)}`}
        >
          <form onSubmit={handlePaymentSubmit}>
            <div style={{ background: 'var(--primary-50)', padding: 14, borderRadius: 'var(--radius-md)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div>
                <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--primary-800)', fontWeight: 700 }}>Total Payable</span>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary-700)' }}>
                  ${payingBill.total.toFixed(2)}
                </div>
              </div>
              <ShieldCheck size={32} color="var(--primary-600)" />
            </div>

            <div className="form-group">
              <label className="form-label">Select Payment Method</label>
              <select
                className="form-select"
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
              >
                <option value="Credit Card (Visa/Mastercard)">Credit / Debit Card</option>
                <option value="Digital Health Insurance Claim">Direct Health Insurance</option>
                <option value="Apple Pay / Google Pay">Apple Pay / Google Pay</option>
                <option value="Hospital UPI / Instant Net Banking">Net Banking / Instant Transfer</option>
              </select>
            </div>

            {paymentMethod.includes('Card') && (
              <>
                <div className="form-group">
                  <label className="form-label">Card Number</label>
                  <input
                    type="text"
                    className="form-input"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    required
                  />
                </div>
                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">Expiry Date</label>
                    <input type="text" className="form-input" defaultValue="12/28" required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">CVV</label>
                    <input type="password" className="form-input" defaultValue="982" maxLength="4" required />
                  </div>
                </div>
              </>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 20 }}>
              <button
                type="button"
                className="btn btn-secondary"
                disabled={isProcessing}
                onClick={() => setPayingBill(null)}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-success"
                disabled={isProcessing}
              >
                {isProcessing ? 'Processing Transaction...' : `Pay $${payingBill.total.toFixed(2)}`}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Official Tax Invoice Sheet Modal */}
      {selectedInvoice && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedInvoice(null)}
          title="Official Hospital Tax Invoice"
          size="xl"
          footer={
            <>
              <button className="btn btn-secondary" onClick={() => setSelectedInvoice(null)}>
                Close
              </button>
              <button className="btn btn-primary" onClick={() => window.print()}>
                <Printer size={16} /> Print Tax Invoice
              </button>
            </>
          }
        >
          <div className="printable-area invoice-sheet">
            <div className="invoice-header">
              <div>
                <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0284c7' }}>
                  {hospitalInfo.name}
                </h2>
                <p style={{ fontSize: '0.82rem', color: '#64748b' }}>
                  {hospitalInfo.address} • {hospitalInfo.phone}
                </p>
                <p style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                  Tax ID / Registration: {hospitalInfo.registrationNo}
                </p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <h3 style={{ fontSize: '1.3rem', color: '#0f172a' }}>TAX INVOICE</h3>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0284c7', marginTop: 4 }}>
                  #{selectedInvoice.id.toUpperCase()}
                </div>
                <div style={{ marginTop: 6 }}>
                  <Badge status={selectedInvoice.status} />
                </div>
              </div>
            </div>

            <div className="invoice-meta-grid">
              <div>
                <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#64748b', fontWeight: 700 }}>
                  Billed To (Patient)
                </span>
                <div style={{ fontWeight: 800, fontSize: '1rem', marginTop: 2 }}>{selectedInvoice.patientName}</div>
                <div style={{ fontSize: '0.85rem', color: '#475569' }}>Patient ID: #{selectedInvoice.patientId.toUpperCase()}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.85rem' }}>Invoice Date: <strong>{selectedInvoice.date}</strong></div>
                <div style={{ fontSize: '0.85rem' }}>Due Date: <strong>{selectedInvoice.dueDate}</strong></div>
                {selectedInvoice.paidAt && (
                  <div style={{ fontSize: '0.85rem', color: '#059669', marginTop: 4 }}>
                    Settled on: {selectedInvoice.paidAt}
                  </div>
                )}
              </div>
            </div>

            <table className="invoice-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Service / Description</th>
                  <th>Category</th>
                  <th style={{ textAlign: 'right' }}>Amount</th>
                </tr>
              </thead>
              <tbody>
                {selectedInvoice.items.map((item, idx) => (
                  <tr key={idx}>
                    <td>{idx + 1}</td>
                    <td style={{ fontWeight: 600 }}>{item.description}</td>
                    <td><span className="badge badge-neutral">{item.category}</span></td>
                    <td style={{ textAlign: 'right', fontWeight: 700 }}>${item.amount.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="invoice-summary-box">
              <table className="invoice-totals-table">
                <tbody>
                  <tr>
                    <td style={{ color: '#64748b' }}>Subtotal:</td>
                    <td style={{ textAlign: 'right', fontWeight: 600 }}>${selectedInvoice.subtotal.toFixed(2)}</td>
                  </tr>
                  <tr>
                    <td style={{ color: '#64748b' }}>Hospital Service Tax (5%):</td>
                    <td style={{ textAlign: 'right', fontWeight: 600 }}>${selectedInvoice.taxAmount.toFixed(2)}</td>
                  </tr>
                  {selectedInvoice.discountAmount > 0 && (
                    <tr>
                      <td style={{ color: '#059669' }}>Health Plan Discount:</td>
                      <td style={{ textAlign: 'right', color: '#059669', fontWeight: 600 }}>-${selectedInvoice.discountAmount.toFixed(2)}</td>
                    </tr>
                  )}
                  <tr className="total-row">
                    <td>Grand Total:</td>
                    <td style={{ textAlign: 'right' }}>${selectedInvoice.total.toFixed(2)}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div style={{ marginTop: 30, borderTop: '1px solid #e2e8f0', paddingTop: 16, fontSize: '0.78rem', color: '#94a3b8', textAlign: 'center' }}>
              Thank you for trusting MediPulse Super-Specialty Medical Center. This is a computer generated invoice with electronic verification.
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
