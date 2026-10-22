// MediPulse API Service Client

const API_BASE_URL = 'http://localhost:5000/api';

async function fetchAPI(endpoint, options = {}) {
  try {
    const token = localStorage.getItem('medipulse_token');
    const headers = {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers
    };

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `API Request Failed (${response.status})`);
    }

    return await response.json();
  } catch (err) {
    console.warn(`[MediPulse API Service] Request to ${endpoint} failed:`, err.message);
    throw err;
  }
}

export const api = {
  // Health
  checkHealth: () => fetchAPI('/health'),

  // Auth
  login: (role, email, name) => fetchAPI('/auth/login', { method: 'POST', body: JSON.stringify({ role, email, name }) }),
  switchRole: (role) => fetchAPI('/auth/switch-role', { method: 'POST', body: JSON.stringify({ role }) }),

  // Appointments
  getAppointments: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return fetchAPI(`/appointments${query ? `?${query}` : ''}`);
  },
  bookAppointment: (data) => fetchAPI('/appointments', { method: 'POST', body: JSON.stringify(data) }),
  rescheduleAppointment: (id, newDate, newTime) => fetchAPI(`/appointments/${id}/reschedule`, { method: 'PUT', body: JSON.stringify({ newDate, newTime }) }),
  cancelAppointment: (id, reason) => fetchAPI(`/appointments/${id}/cancel`, { method: 'PUT', body: JSON.stringify({ reason }) }),
  updateAppointmentStatus: (id, status) => fetchAPI(`/appointments/${id}/status`, { method: 'PUT', body: JSON.stringify({ status }) }),
  completeConsultation: (id, consultationData) => fetchAPI(`/appointments/${id}/complete`, { method: 'POST', body: JSON.stringify(consultationData) }),

  // Doctors
  getDoctors: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return fetchAPI(`/doctors${query ? `?${query}` : ''}`);
  },
  addDoctor: (data) => fetchAPI('/doctors', { method: 'POST', body: JSON.stringify(data) }),
  updateDoctor: (id, data) => fetchAPI(`/doctors/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  toggleDoctorStatus: (id) => fetchAPI(`/doctors/${id}/toggle-status`, { method: 'PUT' }),
  updateDoctorAvailability: (id, days, slots) => fetchAPI(`/doctors/${id}/availability`, { method: 'PUT', body: JSON.stringify({ days, slots }) }),

  // Patients
  getPatients: (search) => fetchAPI(`/patients${search ? `?search=${encodeURIComponent(search)}` : ''}`),
  getPatientById: (id) => fetchAPI(`/patients/${id}`),
  addPatient: (data) => fetchAPI('/patients', { method: 'POST', body: JSON.stringify(data) }),
  updatePatientProfile: (id, data) => fetchAPI(`/patients/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  updateVitals: (id, vitals) => fetchAPI(`/patients/${id}/vitals`, { method: 'PUT', body: JSON.stringify(vitals) }),

  // Admin Operations
  getOverviewStats: () => fetchAPI('/admin/overview'),
  getBeds: () => fetchAPI('/admin/beds'),
  assignBed: (id, patientId) => fetchAPI(`/admin/beds/${id}/assign`, { method: 'PUT', body: JSON.stringify({ patientId }) }),
  vacateBed: (id) => fetchAPI(`/admin/beds/${id}/vacate`, { method: 'PUT' }),
  setBedStatus: (id, status) => fetchAPI(`/admin/beds/${id}/status`, { method: 'PUT', body: JSON.stringify({ status }) }),

  getStaff: () => fetchAPI('/admin/staff'),
  addStaff: (data) => fetchAPI('/admin/staff', { method: 'POST', body: JSON.stringify(data) }),
  updateStaff: (id, data) => fetchAPI(`/admin/staff/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteStaff: (id) => fetchAPI(`/admin/staff/${id}`, { method: 'DELETE' }),

  getBills: () => fetchAPI('/admin/bills'),
  createBill: (data) => fetchAPI('/admin/bills', { method: 'POST', body: JSON.stringify(data) }),
  payBill: (id, paymentMethod) => fetchAPI(`/admin/bills/${id}/pay`, { method: 'PUT', body: JSON.stringify({ paymentMethod }) }),

  getLabReports: () => fetchAPI('/admin/lab-reports'),
  orderLabTest: (data) => fetchAPI('/admin/lab-reports', { method: 'POST', body: JSON.stringify(data) }),
  updateLabResult: (id, results, impression) => fetchAPI(`/admin/lab-reports/${id}`, { method: 'PUT', body: JSON.stringify({ results, overallImpression: impression }) }),

  getDepartments: () => fetchAPI('/admin/departments'),
  addDepartment: (data) => fetchAPI('/admin/departments', { method: 'POST', body: JSON.stringify(data) })
};
