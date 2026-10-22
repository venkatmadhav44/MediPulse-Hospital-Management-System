import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

const DEMO_USERS = {
  admin: {
    id: "admin-1",
    name: "Dr. Eleanor Vance",
    role: "admin",
    email: "admin@medipulse.org",
    title: "Chief Hospital Administrator",
    avatar: "EV",
    department: "Executive Board"
  },
  doctor: {
    id: "doc-1",
    name: "Dr. Sarah Jenkins",
    role: "doctor",
    email: "doctor@medipulse.org",
    title: "Chief of Cardiology, MD FACC",
    avatar: "SJ",
    department: "Cardiology"
  },
  patient: {
    id: "pat-1",
    name: "Alex Morgan",
    role: "patient",
    email: "patient@medipulse.org",
    title: "Registered Patient (#MED-1082)",
    avatar: "AM",
    bloodGroup: "O+"
  }
};

const INITIAL_NOTIFICATIONS = [
  {
    id: "notif-1",
    role: "patient",
    title: "Upcoming Cardiology Appointment",
    message: "Reminder: You have an appointment with Dr. Sarah Jenkins tomorrow at 10:00 AM.",
    time: "10 minutes ago",
    read: false,
    type: "appointment"
  },
  {
    id: "notif-2",
    role: "patient",
    title: "Lab Report Ready",
    message: "Your Complete Blood Count (CBC) test results have been verified and published.",
    time: "2 hours ago",
    read: false,
    type: "lab"
  },
  {
    id: "notif-3",
    role: "doctor",
    title: "New Patient Scheduled",
    message: "Alex Morgan has booked a follow-up appointment for tomorrow at 10:00 AM.",
    time: "30 minutes ago",
    read: false,
    type: "appointment"
  },
  {
    id: "notif-4",
    role: "doctor",
    title: "Critical Lab Result Flagged",
    message: "Lipid Profile for Alex Morgan reports elevated LDL cholesterol (138 mg/dL).",
    time: "3 hours ago",
    read: false,
    type: "lab"
  },
  {
    id: "notif-5",
    role: "admin",
    title: "Bed Capacity Alert: ICU at 75%",
    message: "Intensive Care Unit capacity is approaching high occupancy. 3 of 4 active beds occupied.",
    time: "1 hour ago",
    read: false,
    type: "system"
  },
  {
    id: "notif-6",
    role: "admin",
    title: "Payment Received",
    message: "Invoice #INV-9004 for Harold Bennett ($593.75) settled via BlueCross Insurance.",
    time: "4 hours ago",
    read: true,
    type: "billing"
  }
];

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('medipulse_auth_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse saved user", e);
      }
    }
    // Default to Patient on initial launch so the user immediately experiences the system
    return DEMO_USERS.patient;
  });

  const [notifications, setNotifications] = useState(() => {
    const saved = localStorage.getItem('medipulse_notifications');
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('medipulse_theme') || 'light';
  });

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('medipulse_auth_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('medipulse_auth_user');
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('medipulse_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('medipulse_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  const login = (role, email = null, name = null) => {
    if (DEMO_USERS[role]) {
      const user = { ...DEMO_USERS[role] };
      if (email) user.email = email;
      if (name) user.name = name;
      setCurrentUser(user);
      return true;
    }
    return false;
  };

  const switchRole = (role) => {
    if (DEMO_USERS[role]) {
      setCurrentUser(DEMO_USERS[role]);
    }
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const markNotificationAsRead = (id) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const clearAllNotifications = () => {
    setNotifications(prev =>
      prev.map(n => ({ ...n, read: true }))
    );
  };

  const activeRole = currentUser?.role || null;
  const roleNotifications = notifications.filter(
    n => !activeRole || n.role === activeRole || n.role === 'all'
  );
  const unreadCount = roleNotifications.filter(n => !n.read).length;

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        activeRole,
        theme,
        toggleTheme,
        login,
        switchRole,
        logout,
        notifications: roleNotifications,
        unreadCount,
        markNotificationAsRead,
        clearAllNotifications
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
