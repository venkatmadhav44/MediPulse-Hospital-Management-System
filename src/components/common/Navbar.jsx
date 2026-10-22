import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useHospital } from '../../context/HospitalContext';
import {
  Bell,
  Sun,
  Moon,
  LogOut,
  User,
  ShieldCheck,
  Stethoscope,
  HeartPulse,
  Menu,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Clock,
  Server
} from 'lucide-react';

export default function Navbar({ currentTab, onToggleMobileSidebar }) {
  const { isBackendOnline } = useHospital();
  const {
    currentUser,
    activeRole,
    switchRole,
    theme,
    toggleTheme,
    logout,
    notifications,
    unreadCount,
    markNotificationAsRead,
    clearAllNotifications
  } = useAuth();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const notifRef = useRef(null);
  const userMenuRef = useRef(null);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getRoleIcon = (role) => {
    switch (role) {
      case 'admin': return <ShieldCheck size={14} />;
      case 'doctor': return <Stethoscope size={14} />;
      case 'patient': return <HeartPulse size={14} />;
      default: return <User size={14} />;
    }
  };

  const formatTabTitle = (tab) => {
    if (!tab) return 'Dashboard';
    return tab
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <header className="header">
      <div className="header-left">
        <button
          className="btn-icon mobile-menu-btn"
          onClick={onToggleMobileSidebar}
          aria-label="Toggle navigation menu"
          style={{ display: 'none' }}
        >
          <Menu size={20} />
        </button>

        <div className="header-title-wrap">
          <h1 className="header-page-title">{formatTabTitle(currentTab)}</h1>
          <div className="header-breadcrumbs">
            <span>MediPulse HMS</span>
            <span>/</span>
            <span style={{ textTransform: 'capitalize' }}>{activeRole} Portal</span>
            <span>/</span>
            <span style={{ color: 'var(--primary-600)', fontWeight: 600 }}>{formatTabTitle(currentTab)}</span>
          </div>
        </div>
      </div>

      <div className="header-right">
        {/* Live Express Server Status Badge */}
        <div
          title={isBackendOnline ? "Express API Server Online & Syncing" : "Running in Resilient Offline Mode"}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '4px 10px',
            borderRadius: 'var(--radius-full)',
            background: isBackendOnline ? 'rgba(16, 185, 129, 0.12)' : 'rgba(245, 158, 11, 0.12)',
            border: `1px solid ${isBackendOnline ? 'rgba(16, 185, 129, 0.3)' : 'rgba(245, 158, 11, 0.3)'}`,
            fontSize: '0.75rem',
            fontWeight: 600,
            color: isBackendOnline ? '#10b981' : '#f59e0b'
          }}
        >
          <Server size={13} />
          <span>{isBackendOnline ? 'API Engine Online' : 'Offline Mode'}</span>
          <span style={{
            width: 6,
            height: 6,
            borderRadius: '50%',
            backgroundColor: isBackendOnline ? '#10b981' : '#f59e0b',
            boxShadow: `0 0 6px ${isBackendOnline ? '#10b981' : '#f59e0b'}`
          }} />
        </div>

        {/* Instant Role Switcher Pill */}
        <div className="role-switcher-pill" title="Instant Role Switcher for Pair Programming & Testing">
          <button
            className={`role-pill-btn ${activeRole === 'patient' ? 'active' : ''}`}
            onClick={() => switchRole('patient')}
          >
            <HeartPulse size={13} style={{ marginRight: 4, display: 'inline' }} />
            Patient
          </button>
          <button
            className={`role-pill-btn ${activeRole === 'doctor' ? 'active' : ''}`}
            onClick={() => switchRole('doctor')}
          >
            <Stethoscope size={13} style={{ marginRight: 4, display: 'inline' }} />
            Doctor
          </button>
          <button
            className={`role-pill-btn ${activeRole === 'admin' ? 'active' : ''}`}
            onClick={() => switchRole('admin')}
          >
            <ShieldCheck size={13} style={{ marginRight: 4, display: 'inline' }} />
            Admin
          </button>
        </div>

        {/* Dark/Light Theme Toggle */}
        <button
          className="header-action-btn"
          onClick={toggleTheme}
          title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
        >
          {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
        </button>

        {/* Notifications Dropdown */}
        <div style={{ position: 'relative' }} ref={notifRef}>
          <button
            className="header-action-btn"
            onClick={() => setShowNotifications(!showNotifications)}
            title="Notifications"
          >
            <Bell size={18} />
            {unreadCount > 0 && <span className="header-badge-dot" />}
          </button>

          {showNotifications && (
            <div className="dropdown-menu">
              <div className="dropdown-header">
                <span>Notifications ({unreadCount} new)</span>
                {unreadCount > 0 && (
                  <button
                    onClick={clearAllNotifications}
                    style={{ fontSize: '0.75rem', color: 'var(--primary-600)', fontWeight: 600 }}
                  >
                    Mark all read
                  </button>
                )}
              </div>
              <div className="dropdown-list">
                {notifications.length === 0 ? (
                  <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                    No notifications
                  </div>
                ) : (
                  notifications.map(notif => (
                    <div
                      key={notif.id}
                      className="dropdown-item"
                      onClick={() => markNotificationAsRead(notif.id)}
                      style={{
                        background: notif.read ? 'transparent' : 'var(--primary-50)',
                        opacity: notif.read ? 0.75 : 1
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span className="dropdown-item-title">{notif.title}</span>
                        {!notif.read && <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--primary-600)' }} />}
                      </div>
                      <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.3 }}>
                        {notif.message}
                      </p>
                      <span className="dropdown-item-time">{notif.time}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Current User Pill & Dropdown */}
        <div style={{ position: 'relative' }} ref={userMenuRef}>
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '4px 10px 4px 4px',
              borderRadius: 'var(--radius-full)',
              background: 'var(--bg-surface-subtle)',
              border: '1px solid var(--border-default)',
              cursor: 'pointer'
            }}
          >
            <div className="avatar avatar-sm">
              {currentUser?.avatar || currentUser?.name?.slice(0, 2).toUpperCase() || 'U'}
            </div>
            <div style={{ textAlign: 'left', display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.1 }}>
                {currentUser?.name || 'Guest'}
              </span>
              <span style={{ fontSize: '0.7rem', color: 'var(--primary-600)', textTransform: 'capitalize', fontWeight: 600 }}>
                {activeRole}
              </span>
            </div>
          </button>

          {showUserMenu && (
            <div className="dropdown-menu" style={{ width: '220px' }}>
              <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--border-default)' }}>
                <p style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-primary)' }}>{currentUser?.name}</p>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{currentUser?.email}</p>
                <div style={{ marginTop: '6px' }}>
                  <span className="badge badge-info" style={{ fontSize: '0.7rem' }}>
                    {getRoleIcon(activeRole)}
                    <span style={{ textTransform: 'capitalize', marginLeft: 4 }}>{activeRole}</span>
                  </span>
                </div>
              </div>
              <div style={{ padding: '6px' }}>
                <button
                  onClick={logout}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.85rem',
                    color: 'var(--rose-600)',
                    fontWeight: 600,
                    textAlign: 'left'
                  }}
                >
                  <LogOut size={16} />
                  Sign Out / Switch User
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
