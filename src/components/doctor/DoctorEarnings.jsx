import React from 'react';
import { useHospital } from '../../context/HospitalContext';
import { useAuth } from '../../context/AuthContext';
import StatCard from '../common/StatCard';
import {
  DollarSign,
  TrendingUp,
  Users,
  Award,
  Calendar,
  Clock,
  CheckCircle2,
  BarChart3
} from 'lucide-react';

export default function DoctorEarnings() {
  const { doctors, appointments } = useHospital();
  const { currentUser } = useAuth();

  const currentDoctor = doctors.find(d => d.id === (currentUser?.id || 'doc-1')) || doctors[0];
  const doctorAppointments = appointments.filter(a => a.doctorId === currentDoctor.id);
  const completedVisits = doctorAppointments.filter(a => a.status === 'completed');

  const fee = currentDoctor.consultationFee || 150;
  const estimatedRevenue = completedVisits.length * fee;

  // Mock weekly revenue bars
  const weeklyStats = [
    { day: 'Mon', count: 6, rev: 6 * fee },
    { day: 'Tue', count: 8, rev: 8 * fee },
    { day: 'Wed', count: 5, rev: 5 * fee },
    { day: 'Thu', count: 9, rev: 9 * fee },
    { day: 'Fri', count: 7, rev: 7 * fee },
    { day: 'Sat', count: 4, rev: 4 * fee },
  ];
  const maxRev = Math.max(...weeklyStats.map(w => w.rev), 1);

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Consultation Statistics & Clinical Productivity</h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          Detailed breakdown of clinical volume, gross consultation billings, and patient retention analytics.
        </p>
      </div>

      {/* KPI Stats */}
      <div className="stat-grid">
        <StatCard
          label="Total Consultations"
          value={completedVisits.length}
          subtext="Patient appointments completed"
          icon={Users}
          color="blue"
        />
        <StatCard
          label="Estimated OPD Billings"
          value={`$${estimatedRevenue.toLocaleString()}`}
          subtext={`Based on $${fee} / consultation fee`}
          icon={DollarSign}
          color="emerald"
        />
        <StatCard
          label="Patient Satisfaction"
          value={`${currentDoctor.rating} / 5.0`}
          subtext={`Across ${currentDoctor.reviewCount} verified reviews`}
          icon={Award}
          color="amber"
        />
        <StatCard
          label="Avg. Chamber Duration"
          value="18 mins"
          subtext="Per clinical examination"
          icon={Clock}
          color="indigo"
        />
      </div>

      {/* Weekly Clinical Volume Visual Chart */}
      <div className="card">
        <div className="card-header">
          <span className="card-title">
            <BarChart3 size={18} color="var(--primary-600)" />
            Weekly Outpatient Consultation Volume & Revenues
          </span>
          <span className="badge badge-info">This Week OPD</span>
        </div>

        <div className="card-body">
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-around', height: 220, paddingTop: 30, paddingBottom: 10 }}>
            {weeklyStats.map((stat, idx) => {
              const heightPercent = (stat.rev / maxRev) * 100;

              return (
                <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, flex: 1 }}>
                  <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                    ${stat.rev}
                  </span>
                  <div style={{ width: 44, height: 140, background: 'var(--bg-surface-subtle)', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'flex-end', overflow: 'hidden' }}>
                    <div
                      style={{
                        width: '100%',
                        height: `${heightPercent}%`,
                        background: 'linear-gradient(to top, var(--primary-600), var(--primary-400))',
                        borderRadius: 'var(--radius-sm)',
                        transition: 'height 0.4s ease-out'
                      }}
                    />
                  </div>
                  <strong style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{stat.day}</strong>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{stat.count} pts</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Performance Benchmarks */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 20 }}>
        <div className="card">
          <div className="card-header">
            <span className="card-title" style={{ fontSize: '0.95rem' }}>
              <TrendingUp size={16} color="var(--emerald-600)" />
              Clinical Quality Metrics
            </span>
          </div>
          <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 12, fontSize: '0.88rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: 8 }}>
              <span style={{ color: 'var(--text-muted)' }}>Follow-up Adherence Rate</span>
              <strong>94.2% (Top Decile)</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: 8 }}>
              <span style={{ color: 'var(--text-muted)' }}>Electronic Prescription Accuracy</span>
              <strong style={{ color: 'var(--emerald-600)' }}>100% Digital</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: 8 }}>
              <span style={{ color: 'var(--text-muted)' }}>Diagnostic Requisition Turnaround</span>
              <strong>&lt; 3.2 Hours</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Department Productivity Rank</span>
              <strong>#1 in {currentDoctor.specialization}</strong>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <span className="card-title" style={{ fontSize: '0.95rem' }}>
              <Award size={16} color="var(--amber-600)" />
              Department Recognition
            </span>
          </div>
          <div className="card-body">
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              Dr. {currentDoctor.name} has maintained a 4.9+ star rating for patient empathy and clinical outcomes across tertiary coronary and diagnostic care in MediPulse HMS.
            </p>
            <div style={{ marginTop: 14, background: 'var(--primary-50)', padding: 12, borderRadius: 'var(--radius-sm)', fontSize: '0.82rem', color: 'var(--primary-800)' }}>
              Quarterly physician clinical incentive bonus is processed automatically on the 1st of every calendar month.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
