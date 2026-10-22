import React from 'react';

export default function Badge({ status, label, size = 'md' }) {
  const getBadgeStyle = (statusStr) => {
    switch (statusStr?.toLowerCase()) {
      // Success states
      case 'confirmed':
      case 'completed':
      case 'paid':
      case 'available':
      case 'active':
      case 'normal':
      case 'on duty':
        return 'badge-success';

      // Warning states
      case 'pending':
      case 'in-consultation':
      case 'cleaning':
      case 'processing':
      case 'reserved':
        return 'badge-warning';

      // Danger / Critical states
      case 'cancelled':
      case 'overdue':
      case 'occupied':
      case 'inactive':
      case 'abnormal':
      case 'critical':
      case 'no-show':
        return 'badge-danger';

      // Info / Neutral
      case 'outpatient':
      case 'admitted':
      case 'rescheduled':
        return 'badge-info';

      default:
        return 'badge-neutral';
    }
  };

  const badgeClass = getBadgeStyle(status);
  const displayLabel = label || status;

  return (
    <span className={`badge ${badgeClass}`}>
      <span className="badge-dot" />
      <span>{displayLabel}</span>
    </span>
  );
}
