import React from 'react';

export default function StatCard({ label, value, subtext, icon: Icon, color = 'blue' }) {
  const colorClass =
    color === 'emerald'
      ? 'stat-emerald'
      : color === 'amber'
      ? 'stat-amber'
      : color === 'rose'
      ? 'stat-rose'
      : color === 'indigo'
      ? 'stat-indigo'
      : '';

  return (
    <div className={`stat-card ${colorClass}`}>
      <div className="stat-content">
        <span className="stat-label">{label}</span>
        <span className="stat-val">{value}</span>
        {subtext && <span className="stat-sub">{subtext}</span>}
      </div>
      {Icon && (
        <div className="stat-icon">
          <Icon size={22} />
        </div>
      )}
    </div>
  );
}
