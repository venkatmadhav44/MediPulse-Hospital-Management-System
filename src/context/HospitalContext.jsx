import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';
import {
  INITIAL_DEPARTMENTS,
  INITIAL_DOCTORS,
  INITIAL_PATIENTS,
  INITIAL_APPOINTMENTS,
  INITIAL_PRESCRIPTIONS,
  INITIAL_LAB_REPORTS,
  INITIAL_BEDS,
  INITIAL_BILLS,
  INITIAL_STAFF,
  INITIAL_HOSPITAL_INFO
} from '../data/mockData';

const HospitalContext = createContext(null);

const STORAGE_KEY = 'medipulse_hms_state_v1';

export function HospitalProvider({ children }) {
  // Load initial state from localStorage or pristine defaults
  const [data, setData] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (err) {
        console.error("Failed to parse hospital data from localStorage", err);
      }
    }
    return {
      departments: INITIAL_DEPARTMENTS,
      doctors: INITIAL_DOCTORS,
      patients: INITIAL_PATIENTS,
      appointments: INITIAL_APPOINTMENTS,
      prescriptions: INITIAL_PRESCRIPTIONS,
      labReports: INITIAL_LAB_REPORTS,
      beds: INITIAL_BEDS,
      bills: INITIAL_BILLS,
      staff: INITIAL_STAFF,
      hospitalInfo: INITIAL_HOSPITAL_INFO
    };
  });

  const [isBackendOnline, setIsBackendOnline] = useState(false);

  // Sync with live Node.js Express backend on mount
  useEffect(() => {
    async function syncWithBackend() {
      try {
        const health = await api.checkHealth();
        if (health && health.status === 'healthy') {
          setIsBackendOnline(true);
          console.log('✅ Live MediPulse Backend Server Connected!');

          // Fetch fresh server state across all entities
          const [deptsRes, docsRes, patsRes, aptsRes, bedsRes, billsRes, staffRes, labRes] = await Promise.allSettled([
            api.getDepartments(),
            api.getDoctors(),
            api.getPatients(),
            api.getAppointments(),
            api.getBeds(),
            api.getBills(),
            api.getStaff(),
            api.getLabReports()
          ]);

          setData(prev => ({
            ...prev,
            departments: deptsRes.status === 'fulfilled' && deptsRes.value.departments ? deptsRes.value.departments : prev.departments,
            doctors: docsRes.status === 'fulfilled' && docsRes.value.doctors ? docsRes.value.doctors : prev.doctors,
            patients: patsRes.status === 'fulfilled' && patsRes.value.patients ? patsRes.value.patients : prev.patients,
            appointments: aptsRes.status === 'fulfilled' && aptsRes.value.appointments ? aptsRes.value.appointments : prev.appointments,
            beds: bedsRes.status === 'fulfilled' && bedsRes.value.beds ? bedsRes.value.beds : prev.beds,
            bills: billsRes.status === 'fulfilled' && billsRes.value.bills ? billsRes.value.bills : prev.bills,
            staff: staffRes.status === 'fulfilled' && staffRes.value.staff ? staffRes.value.staff : prev.staff,
            labReports: labRes.status === 'fulfilled' && labRes.value.labReports ? labRes.value.labReports : prev.labReports
          }));
        }
      } catch (err) {
        setIsBackendOnline(false);
        console.info('ℹ️ Operating in resilient offline/localStorage fallback mode.');
      }
    }
    syncWithBackend();
  }, []);

  // Persist local copy whenever state changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data]);

  // --- Reset to Pristine Mock Dataset ---
  const resetToDefaults = () => {
    const freshData = {
      departments: INITIAL_DEPARTMENTS,
      doctors: INITIAL_DOCTORS,
      patients: INITIAL_PATIENTS,
      appointments: INITIAL_APPOINTMENTS,
      prescriptions: INITIAL_PRESCRIPTIONS,
      labReports: INITIAL_LAB_REPORTS,
      beds: INITIAL_BEDS,
      bills: INITIAL_BILLS,
      staff: INITIAL_STAFF,
      hospitalInfo: INITIAL_HOSPITAL_INFO
    };
    setData(freshData);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(freshData));
  };

  // =========================================================================
  // APPOINTMENT ACTIONS
  // =========================================================================
  const bookAppointment = (appointmentData) => {
    const newId = `apt-${Date.now().toString().slice(-4)}`;
    const newAppointment = {
      id: newId,
      status: 'confirmed',
      ...appointmentData
    };

    setData(prev => ({
      ...prev,
      appointments: [newAppointment, ...prev.appointments]
    }));

    return newAppointment;
  };

  const rescheduleAppointment = (appointmentId, newDate, newTime) => {
    setData(prev => ({
      ...prev,
      appointments: prev.appointments.map(apt =>
        apt.id === appointmentId
          ? { ...apt, date: newDate, time: newTime, status: 'confirmed' }
          : apt
      )
    }));
  };

  const cancelAppointment = (appointmentId, cancelReason = 'Cancelled by user') => {
    setData(prev => ({
      ...prev,
      appointments: prev.appointments.map(apt =>
        apt.id === appointmentId
          ? { ...apt, status: 'cancelled', notes: `${apt.notes || ''} [Cancellation: ${cancelReason}]` }
          : apt
      )
    }));
  };

  const updateAppointmentStatus = (appointmentId, newStatus) => {
    setData(prev => ({
      ...prev,
      appointments: prev.appointments.map(apt =>
        apt.id === appointmentId ? { ...apt, status: newStatus } : apt
      )
    }));
  };

  // Comprehensive consultation completion by Doctor
  const completeConsultation = ({
    appointmentId,
    diagnosis,
    notes,
    prescriptionMedicines = [],
    advice = '',
    orderedTests = []
  }) => {
    const apt = data.appointments.find(a => a.id === appointmentId);
    if (!apt) return;

    let rxId = null;
    let newPrescriptions = [...data.prescriptions];

    // Generate digital prescription if medicines provided
    if (prescriptionMedicines.length > 0) {
      rxId = `rx-${Date.now().toString().slice(-4)}`;
      const newRx = {
        id: rxId,
        appointmentId,
        patientId: apt.patientId,
        patientName: apt.patientName,
        doctorId: apt.doctorId,
        doctorName: apt.doctorName,
        doctorSpecialty: apt.department,
        date: new Date().toISOString().split('T')[0],
        diagnosis: diagnosis || 'Clinical Examination Complete',
        medicines: prescriptionMedicines,
        advice: advice || 'Follow instructions on medication packaging.',
        status: 'active'
      };
      newPrescriptions = [newRx, ...newPrescriptions];
    }

    // Order lab tests if selected
    let newLabReports = [...data.labReports];
    orderedTests.forEach((testName, idx) => {
      const labId = `lab-${Date.now().toString().slice(-4)}-${idx + 1}`;
      newLabReports.unshift({
        id: labId,
        testName,
        category: "Diagnostics",
        patientId: apt.patientId,
        patientName: apt.patientName,
        orderedBy: apt.doctorName,
        orderDate: new Date().toISOString().split('T')[0],
        reportDate: null,
        status: "processing",
        results: [],
        overallImpression: "Sample processing underway in central hospital lab."
      });
    });

    // Update appointment
    const updatedAppointments = data.appointments.map(a =>
      a.id === appointmentId
        ? {
            ...a,
            status: 'completed',
            diagnosis,
            notes: notes || a.notes,
            prescriptionId: rxId
          }
        : a
    );

    // Create consultation bill
    const invId = `inv-${Date.now().toString().slice(-4)}`;
    const consultationFee = apt.fee || 120;
    const pharmacyFee = prescriptionMedicines.length * 20;
    const subtotal = consultationFee + pharmacyFee;
    const tax = +(subtotal * 0.05).toFixed(2);
    const total = +(subtotal + tax).toFixed(2);

    const newBill = {
      id: invId,
      patientId: apt.patientId,
      patientName: apt.patientName,
      date: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
      status: 'pending',
      paymentMethod: null,
      paidAt: null,
      items: [
        { description: `Consultation with ${apt.doctorName} (${apt.department})`, category: 'Consultation', amount: consultationFee },
        ...(prescriptionMedicines.length > 0 ? [{ description: `Dispensed Prescriptions (${prescriptionMedicines.length} items)`, category: 'Pharmacy', amount: pharmacyFee }] : [])
      ],
      subtotal,
      taxRate: 5,
      taxAmount: tax,
      discountAmount: 0,
      total
    };

    setData(prev => ({
      ...prev,
      appointments: updatedAppointments,
      prescriptions: newPrescriptions,
      labReports: newLabReports,
      bills: [newBill, ...prev.bills]
    }));
  };

  // =========================================================================
  // DOCTOR ACTIONS
  // =========================================================================
  const addDoctor = (docData) => {
    const newDoc = {
      id: `doc-${Date.now().toString().slice(-4)}`,
      rating: 5.0,
      reviewCount: 1,
      active: true,
      availableDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      availableSlots: ["09:00 AM", "11:00 AM", "02:00 PM", "04:00 PM"],
      ...docData
    };
    setData(prev => ({ ...prev, doctors: [newDoc, ...prev.doctors] }));
    return newDoc;
  };

  const updateDoctor = (docId, updatedFields) => {
    setData(prev => ({
      ...prev,
      doctors: prev.doctors.map(doc =>
        doc.id === docId ? { ...doc, ...updatedFields } : doc
      )
    }));
  };

  const toggleDoctorStatus = (docId) => {
    setData(prev => ({
      ...prev,
      doctors: prev.doctors.map(doc =>
        doc.id === docId ? { ...doc, active: !doc.active } : doc
      )
    }));
  };

  const updateDoctorAvailability = (docId, days, slots) => {
    setData(prev => ({
      ...prev,
      doctors: prev.doctors.map(doc =>
        doc.id === docId ? { ...doc, availableDays: days, availableSlots: slots } : doc
      )
    }));
  };

  // =========================================================================
  // PATIENT ACTIONS
  // =========================================================================
  const updatePatientProfile = (patientId, updatedFields) => {
    setData(prev => ({
      ...prev,
      patients: prev.patients.map(p =>
        p.id === patientId ? { ...p, ...updatedFields } : p
      )
    }));
  };

  const updateVitals = (patientId, newVitals) => {
    setData(prev => ({
      ...prev,
      patients: prev.patients.map(p =>
        p.id === patientId
          ? {
              ...p,
              vitals: {
                ...p.vitals,
                ...newVitals,
                lastUpdated: 'Just now'
              }
            }
          : p
      )
    }));
  };

  const addPatient = (patientData) => {
    const newId = `pat-${Date.now().toString().slice(-4)}`;
    const newPat = {
      id: newId,
      assignedBedId: null,
      admissionStatus: "Outpatient",
      vitals: {
        bloodPressure: "120/80 mmHg",
        heartRate: "72 bpm",
        temperature: "98.6 °F",
        spO2: "99%",
        respiratoryRate: "16 bpm",
        bmi: "22.5",
        lastUpdated: "Today"
      },
      ...patientData
    };
    setData(prev => ({ ...prev, patients: [newPat, ...prev.patients] }));
    return newPat;
  };

  // =========================================================================
  // BED & WARD ACTIONS
  // =========================================================================
  const assignBed = (bedId, patientId) => {
    const patient = data.patients.find(p => p.id === patientId);
    if (!patient) return;

    setData(prev => ({
      ...prev,
      beds: prev.beds.map(bed =>
        bed.id === bedId
          ? { ...bed, status: 'occupied', occupantId: patientId, occupantName: patient.name }
          : bed
      ),
      patients: prev.patients.map(p =>
        p.id === patientId
          ? { ...p, assignedBedId: bedId, admissionStatus: `Admitted (${bedId})` }
          : p
      )
    }));
  };

  const vacateBed = (bedId) => {
    const bed = data.beds.find(b => b.id === bedId);
    const occupantId = bed?.occupantId;

    setData(prev => ({
      ...prev,
      beds: prev.beds.map(b =>
        b.id === bedId
          ? { ...b, status: 'cleaning', occupantId: null, occupantName: null }
          : b
      ),
      patients: prev.patients.map(p =>
        p.id === occupantId
          ? { ...p, assignedBedId: null, admissionStatus: 'Discharged' }
          : p
      )
    }));
  };

  const setBedStatus = (bedId, status) => {
    setData(prev => ({
      ...prev,
      beds: prev.beds.map(b => (b.id === bedId ? { ...b, status } : b))
    }));
  };

  // =========================================================================
  // BILLING ACTIONS
  // =========================================================================
  const createBill = (billData) => {
    const newBill = {
      id: `inv-${Date.now().toString().slice(-4)}`,
      date: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
      status: 'pending',
      paymentMethod: null,
      paidAt: null,
      discountAmount: 0,
      ...billData
    };
    setData(prev => ({ ...prev, bills: [newBill, ...prev.bills] }));
    return newBill;
  };

  const payBill = (billId, paymentMethod = 'Online Payment') => {
    setData(prev => ({
      ...prev,
      bills: prev.bills.map(b =>
        b.id === billId
          ? {
              ...b,
              status: 'paid',
              paymentMethod,
              paidAt: new Date().toLocaleString()
            }
          : b
      )
    }));
  };

  // =========================================================================
  // LAB REPORT ACTIONS
  // =========================================================================
  const orderLabTest = (testData) => {
    const newReport = {
      id: `lab-${Date.now().toString().slice(-4)}`,
      orderDate: new Date().toISOString().split('T')[0],
      reportDate: null,
      status: 'processing',
      results: [],
      overallImpression: 'Sample collected, processing under pathology verification.',
      ...testData
    };
    setData(prev => ({ ...prev, labReports: [newReport, ...prev.labReports] }));
    return newReport;
  };

  const updateLabResult = (reportId, results, impression) => {
    setData(prev => ({
      ...prev,
      labReports: prev.labReports.map(rep =>
        rep.id === reportId
          ? {
              ...rep,
              status: 'completed',
              reportDate: new Date().toISOString().split('T')[0],
              results,
              overallImpression: impression
            }
          : rep
      )
    }));
  };

  // =========================================================================
  // DEPARTMENTS & STAFF ACTIONS
  // =========================================================================
  const addDepartment = (dept) => {
    const newDept = {
      id: `dept-${Date.now().toString().slice(-4)}`,
      totalBeds: 20,
      color: '#0ea5e9',
      ...dept
    };
    setData(prev => ({ ...prev, departments: [...prev.departments, newDept] }));
  };

  const updateDepartment = (deptId, fields) => {
    setData(prev => ({
      ...prev,
      departments: prev.departments.map(d =>
        d.id === deptId ? { ...d, ...fields } : d
      )
    }));
  };

  const addStaff = (staffMember) => {
    const newStaff = {
      id: `stf-${Date.now().toString().slice(-4)}`,
      status: 'On Duty',
      ...staffMember
    };
    setData(prev => ({ ...prev, staff: [...prev.staff, newStaff] }));
  };

  const updateStaff = (staffId, fields) => {
    setData(prev => ({
      ...prev,
      staff: prev.staff.map(s =>
        s.id === staffId ? { ...s, ...fields } : s
      )
    }));
  };

  const deleteStaff = (staffId) => {
    setData(prev => ({
      ...prev,
      staff: prev.staff.filter(s => s.id !== staffId)
    }));
  };

  const updateHospitalInfo = (info) => {
    setData(prev => ({
      ...prev,
      hospitalInfo: { ...prev.hospitalInfo, ...info }
    }));
  };

  return (
    <HospitalContext.Provider
      value={{
        ...data,
        isBackendOnline,
        bookAppointment,
        rescheduleAppointment,
        cancelAppointment,
        updateAppointmentStatus,
        completeConsultation,
        addDoctor,
        updateDoctor,
        toggleDoctorStatus,
        updateDoctorAvailability,
        updatePatientProfile,
        updateVitals,
        addPatient,
        assignBed,
        vacateBed,
        setBedStatus,
        createBill,
        payBill,
        orderLabTest,
        updateLabResult,
        addDepartment,
        updateDepartment,
        addStaff,
        updateStaff,
        deleteStaff,
        updateHospitalInfo,
        resetToDefaults
      }}
    >
      {children}
    </HospitalContext.Provider>
  );
}

export function useHospital() {
  const context = useContext(HospitalContext);
  if (!context) {
    throw new Error('useHospital must be used within a HospitalProvider');
  }
  return context;
}
