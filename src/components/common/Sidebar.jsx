import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useHospital } from '../../context/HospitalContext';
import {
  LayoutDashboard,
  Calendar,
  UserSearch,
  FileText,
  Pill,
  FlaskConical,
  Receipt,
  UserCheck,
  PhoneCall,
  Users,
  Clock,
  BarChart3,
  Stethoscope,
  Building2,
  BedDouble,
  ShieldCheck,
  Settings,
  HeartPulse,
  LogOut,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  AlertTriangle
} from 'lucide-react';

/**
 * HCI-Enhanced Sidebar Navigation
 *
 * Improvements applied:
 * 1. Fitts's Law: Collapse toggle button enlarged from 28×28 to 38×38 px
 *    (larger target = faster, more accurate clicks — Fitts 1954)
 * 2. Shneiderman Rule 4 + Nielsen H3: Sign Out confirmation prevents accidental logout
 *    User must confirm before irreversible action is taken
 * 3. ARIA aria-current="page": marks the active nav item for screen readers
 *    (WCAG 2.1 SC 2.4.4 — Link Purpose)
 * 4. Shneiderman Rule 8: Nav items are consistently structured with icon + label
 */
export default function Sidebar({ currentTab, onSelectTab, isCollapsed, onToggleCollapse }) {
  const { currentUser, activeRole, logout } = useAuth();
  const { appointments, bills, beds } = useHospital();

  // HCI: Sign Out confirmation state — Shneiderman Rule 4 (Error Prevention)
  // Accidental logout is a common pain point; a two-step confirm prevents data loss
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  // Badges calculations
  const pendingAptsCount = appointments.filter(a => a.status === 'confirmed').length;
  const pendingBillsCount = bills.filter(b => b.status === 'pending').length;
  const occupiedBedsCount = beds.filter(b => b.status === 'occupied').length;

  const patientNavItems = [
    { id: 'overview',        label: 'Dashboard',       icon: LayoutDashboard },
    { id: 'doctors',         label: 'Find Doctors',     icon: UserSearch },
    { id: 'appointments',    label: 'Appointments',     icon: Calendar,    badge: pendingAptsCount },
    { id: 'medical-records', label: 'Medical Records',  icon: FileText },
    { id: 'prescriptions',   label: 'Prescriptions',    icon: Pill },
    { id: 'lab-reports',     label: 'Lab Reports',      icon: FlaskConical },
    { id: 'billing',         label: 'Bills & Payments', icon: Receipt,     badge: pendingBillsCount },
    { id: 'profile',         label: 'My Profile',       icon: UserCheck },
    { id: 'contact',         label: 'Hospital Contact', icon: PhoneCall },
  ];

  const doctorNavItems = [
    { id: 'overview',      label: 'Dashboard',               icon: LayoutDashboard },
    { id: 'appointments',  label: "Today's Schedule",         icon: Calendar,    badge: pendingAptsCount },
    { id: 'patients',      label: 'Patient Directory & EHR', icon: Users },
    { id: 'availability',  label: 'My Availability',         icon: Clock },
    { id: 'lab-orders',    label: 'Lab Test Orders',         icon: FlaskConical },
    { id: 'prescriptions', label: 'Issued Prescriptions',    icon: Pill },
    { id: 'earnings',      label: 'Analytics & Earnings',    icon: BarChart3 },
  ];

  const adminNavItems = [
    { id: 'overview',      label: 'Hospital Overview',    icon: LayoutDashboard },
    { id: 'doctors',       label: 'Manage Doctors',       icon: Stethoscope },
    { id: 'patients',      label: 'Manage Patients',      icon: Users },
    { id: 'appointments',  label: 'All Appointments',     icon: Calendar,    badge: pendingAptsCount },
    { id: 'departments',   label: 'Departments',          icon: Building2 },
    { id: 'staff',         label: 'Hospital Staff',       icon: Users },
    { id: 'beds',          label: 'Bed & Room Matrix',    icon: BedDouble,   badge: `${occupiedBedsCount}/${beds.length}` },
    { id: 'pharmacy',      label: 'Pharmacy & Meds',      icon: Pill },
    { id: 'laboratory',    label: 'Laboratory Services',  icon: FlaskConical },
    { id: 'billing',       label: 'Billing & Finance',    icon: Receipt,     badge: pendingBillsCount },
    { id: 'reports',       label: 'Hospital Reports',     icon: ClipboardList },
    { id: 'settings',      label: 'System Settings',      icon: Settings },
  ];

  const getNavItems = () => {
    switch (activeRole) {
      case 'doctor': return doctorNavItems;
      case 'admin':  return adminNavItems;
      default:       return patientNavItems;
    }
  };

  const navItems = getNavItems();

  const handleLogoutClick = () => {
    // HCI: Two-step confirmation — Shneiderman Rule 4 (Prevent errors)
    // Show inline confirmation instead of immediately logging out
    setShowLogoutConfirm(true);
  };

  const handleLogoutConfirm = () => {
    setShowLogoutConfirm(false);
    logout();
  };

  const handleLogoutCancel = () => {
    setShowLogoutConfirm(false);
  };

  return (
    <aside className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      {/* Brand Header */}
      <div className="sidebar-header">
        <a
          href="#dashboard"
          className="brand-link"
          onClick={(e) => { e.preventDefault(); onSelectTab('overview'); }}
          aria-label="MediPulse HMS — Go to Dashboard"
        >
          <div className="brand-logo-wrap">
            <HeartPulse size={22} strokeWidth={2.5} aria-hidden="true" />
          </div>
          {!isCollapsed && (
            <div className="brand-info">
              <span className="brand-title">Medi<span>Pulse</span></span>
              <span className="brand-sub">Clinical HMS Suite</span>
            </div>
          )}
        </a>

        {/*
          HCI: Fitts's Law — Enlarged collapse toggle button
          Original: 28×28 px → Improved: 38×38 px
          Larger targets are faster to click (Fitts, 1954). The collapse button
          is frequently used to manage screen real estate and deserves adequate size.
        */}
        <button
          className="btn-icon"
          onClick={onToggleCollapse}
          title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          aria-label={isCollapsed ? 'Expand navigation sidebar' : 'Collapse navigation sidebar'}
          aria-expanded={!isCollapsed}
          style={{ width: 38, height: 38 }}
        >
          {isCollapsed ? <ChevronRight size={18} aria-hidden="true" /> : <ChevronLeft size={18} aria-hidden="true" />}
        </button>
      </div>

      {/* Navigation List */}
      <nav className="sidebar-nav" aria-label={`${activeRole} navigation`}>
        {!isCollapsed && (
          <div className="nav-section-label" aria-hidden="true">
            {activeRole} Management
          </div>
        )}

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;

          return (
            <button
              key={item.id}
              className={`nav-item ${isActive ? 'active' : ''}`}
              onClick={() => onSelectTab(item.id)}
              title={isCollapsed ? item.label : undefined}
              /* HCI: aria-current="page" — WCAG 2.1 SC 2.4.4 (Link Purpose in Context)
                 Screen readers announce "current page" so keyboard users know where they are.
                 This is Nielsen H6 — Recognition rather than Recall */
              aria-current={isActive ? 'page' : undefined}
              aria-label={isCollapsed ? item.label : undefined}
            >
              <div className="nav-item-left">
                <Icon className="nav-item-icon" aria-hidden="true" />
                {!isCollapsed && <span>{item.label}</span>}
              </div>

              {!isCollapsed && item.badge !== undefined && item.badge !== 0 && (
                <span className="nav-counter" aria-label={`${item.badge} items`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer User Info */}
      <div className="sidebar-footer">
        {!isCollapsed && currentUser && (
          <div className="user-badge-card">
            <div className="avatar avatar-sm" aria-hidden="true">
              {currentUser.avatar || currentUser.name.slice(0, 2).toUpperCase()}
            </div>
            <div className="user-badge-info">
              <div className="user-badge-name">{currentUser.name}</div>
              <div className="user-badge-role">{currentUser.title || activeRole}</div>
            </div>
          </div>
        )}

        {/* HCI: Inline Sign Out confirmation — Shneiderman Rule 4 (Error Prevention)
            Replaces immediate logout with a visible two-button confirm/cancel step.
            Nielsen H3 (User Control): user can cancel if they clicked by accident. */}
        {showLogoutConfirm ? (
          <div
            style={{
              background: 'rgba(244, 63, 94, 0.08)',
              border: '1px solid rgba(244, 63, 94, 0.25)',
              borderRadius: 'var(--radius-md)',
              padding: '10px 12px',
              display: 'flex',
              flexDirection: 'column',
              gap: 8
            }}
            role="alertdialog"
            aria-label="Confirm sign out"
          >
            {!isCollapsed && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.82rem', fontWeight: 600, color: 'var(--rose-600)' }}>
                <AlertTriangle size={14} aria-hidden="true" />
                Sign out of MediPulse?
              </div>
            )}
            <div style={{ display: 'flex', gap: 6 }}>
              <button
                className="btn btn-danger btn-sm"
                onClick={handleLogoutConfirm}
                style={{ flex: 1, justifyContent: 'center' }}
                aria-label="Confirm sign out"
              >
                {isCollapsed ? <LogOut size={14} /> : 'Sign Out'}
              </button>
              <button
                className="btn btn-secondary btn-sm"
                onClick={handleLogoutCancel}
                style={{ flex: 1, justifyContent: 'center' }}
                aria-label="Cancel sign out"
              >
                {isCollapsed ? <ChevronLeft size={14} /> : 'Cancel'}
              </button>
            </div>
          </div>
        ) : (
          <button
            className="btn btn-secondary btn-sm"
            onClick={handleLogoutClick}
            style={{ width: '100%', justifyContent: isCollapsed ? 'center' : 'flex-start' }}
            title="Sign Out"
            aria-label="Sign out of MediPulse HMS"
          >
            <LogOut size={16} aria-hidden="true" />
            {!isCollapsed && <span>Sign Out</span>}
          </button>
        )}
      </div>
    </aside>
  );
}
