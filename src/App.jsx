import React, { useState, useEffect } from 'react';
import { useAuth } from './context/AuthContext';

// Common Shell Components
import Navbar from './components/common/Navbar';
import Sidebar from './components/common/Sidebar';
import AuthScreens from './components/auth/AuthScreens';

// Patient Portal Components
import PatientOverview from './components/patient/PatientOverview';
import DoctorSearch from './components/patient/DoctorSearch';
import PatientAppointments from './components/patient/PatientAppointments';
import PatientMedicalRecords from './components/patient/PatientMedicalRecords';
import PatientPrescriptions from './components/patient/PatientPrescriptions';
import PatientLabReports from './components/patient/PatientLabReports';
import PatientBills from './components/patient/PatientBills';
import PatientProfile from './components/patient/PatientProfile';
import ContactHospital from './components/patient/ContactHospital';

// Doctor Portal Components
import DoctorOverview from './components/doctor/DoctorOverview';
import DoctorAppointments from './components/doctor/DoctorAppointments';
import DoctorPatients from './components/doctor/DoctorPatients';
import DoctorAvailability from './components/doctor/DoctorAvailability';
import DoctorLabOrders from './components/doctor/DoctorLabOrders';
import DoctorPrescriptions from './components/doctor/DoctorPrescriptions';
import DoctorEarnings from './components/doctor/DoctorEarnings';

// Admin Portal Components
import AdminOverview from './components/admin/AdminOverview';
import ManageDoctors from './components/admin/ManageDoctors';
import ManagePatients from './components/admin/ManagePatients';
import ManageAppointments from './components/admin/ManageAppointments';
import ManageDepartments from './components/admin/ManageDepartments';
import ManageStaff from './components/admin/ManageStaff';
import ManageBeds from './components/admin/ManageBeds';
import ManagePharmacy from './components/admin/ManagePharmacy';
import ManageLaboratory from './components/admin/ManageLaboratory';
import ManageBilling from './components/admin/ManageBilling';
import SystemReports from './components/admin/SystemReports';
import SystemSettings from './components/admin/SystemSettings';

export default function App() {
  const { currentUser, activeRole } = useAuth();
  const [currentTab, setCurrentTab] = useState('overview');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Reset tab to 'overview' when switching between Patient, Doctor, Admin
  useEffect(() => {
    setCurrentTab('overview');
  }, [activeRole]);

  // If not logged in, render authentication screens
  if (!currentUser) {
    return <AuthScreens />;
  }

  // Render role-specific content
  const renderContent = () => {
    switch (activeRole) {
      // -----------------------------------------------------------------------
      // PATIENT PORTAL
      // -----------------------------------------------------------------------
      case 'patient':
        switch (currentTab) {
          case 'overview':
            return <PatientOverview onNavigate={setCurrentTab} />;
          case 'doctors':
            return <DoctorSearch />;
          case 'appointments':
            return <PatientAppointments />;
          case 'medical-records':
            return <PatientMedicalRecords />;
          case 'prescriptions':
            return <PatientPrescriptions />;
          case 'lab-reports':
            return <PatientLabReports />;
          case 'billing':
            return <PatientBills />;
          case 'profile':
            return <PatientProfile />;
          case 'contact':
            return <ContactHospital />;
          default:
            return <PatientOverview onNavigate={setCurrentTab} />;
        }

      // -----------------------------------------------------------------------
      // DOCTOR PORTAL
      // -----------------------------------------------------------------------
      case 'doctor':
        switch (currentTab) {
          case 'overview':
            return <DoctorOverview onNavigate={setCurrentTab} />;
          case 'appointments':
            return <DoctorAppointments />;
          case 'patients':
            return <DoctorPatients />;
          case 'availability':
            return <DoctorAvailability />;
          case 'lab-orders':
            return <DoctorLabOrders />;
          case 'prescriptions':
            return <DoctorPrescriptions />;
          case 'earnings':
            return <DoctorEarnings />;
          default:
            return <DoctorOverview onNavigate={setCurrentTab} />;
        }

      // -----------------------------------------------------------------------
      // ADMIN PORTAL
      // -----------------------------------------------------------------------
      case 'admin':
        switch (currentTab) {
          case 'overview':
            return <AdminOverview onNavigate={setCurrentTab} />;
          case 'doctors':
            return <ManageDoctors />;
          case 'patients':
            return <ManagePatients />;
          case 'appointments':
            return <ManageAppointments />;
          case 'departments':
            return <ManageDepartments />;
          case 'staff':
            return <ManageStaff />;
          case 'beds':
            return <ManageBeds />;
          case 'pharmacy':
            return <ManagePharmacy />;
          case 'laboratory':
            return <ManageLaboratory />;
          case 'billing':
            return <ManageBilling />;
          case 'reports':
            return <SystemReports />;
          case 'settings':
            return <SystemSettings />;
          default:
            return <AdminOverview onNavigate={setCurrentTab} />;
        }

      default:
        return <PatientOverview onNavigate={setCurrentTab} />;
    }
  };

  return (
    <div className="app-shell">
      {/* Role-Specific Navigation Sidebar */}
      <Sidebar
        currentTab={currentTab}
        onSelectTab={(tab) => {
          setCurrentTab(tab);
          setIsMobileSidebarOpen(false);
        }}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />

      {/* Main Wrapper */}
      <div className="main-wrapper">
        {/* Top Header Navigation */}
        <Navbar
          currentTab={currentTab}
          onToggleMobileSidebar={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
        />

        {/* Dynamic Content Area */}
        <main className="content-area">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}
