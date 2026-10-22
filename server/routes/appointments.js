import express from 'express';
import { readDB, writeDB } from '../db.js';

const router = express.Router();

// GET all appointments
router.get('/', (req, res) => {
  const db = readDB();
  let appointments = db.appointments || [];

  const { patientId, doctorId, status } = req.query;

  if (patientId) {
    appointments = appointments.filter(a => a.patientId === patientId);
  }
  if (doctorId) {
    appointments = appointments.filter(a => a.doctorId === doctorId);
  }
  if (status) {
    appointments = appointments.filter(a => a.status === status);
  }

  res.json({ success: true, count: appointments.length, appointments });
});

// POST book new appointment
router.post('/', (req, res) => {
  const db = readDB();
  const newId = `apt-${Date.now().toString().slice(-4)}`;
  const newAppointment = {
    id: newId,
    status: 'confirmed',
    ...req.body
  };

  db.appointments = [newAppointment, ...(db.appointments || [])];
  writeDB(db);

  res.status(201).json({ success: true, appointment: newAppointment });
});

// PUT reschedule appointment
router.put('/:id/reschedule', (req, res) => {
  const { id } = req.params;
  const { newDate, newTime } = req.body;
  const db = readDB();

  const index = db.appointments.findIndex(a => a.id === id);
  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Appointment not found' });
  }

  db.appointments[index] = {
    ...db.appointments[index],
    date: newDate,
    time: newTime,
    status: 'confirmed'
  };

  writeDB(db);
  res.json({ success: true, appointment: db.appointments[index] });
});

// PUT cancel appointment
router.put('/:id/cancel', (req, res) => {
  const { id } = req.params;
  const { reason = 'Cancelled by user' } = req.body;
  const db = readDB();

  const index = db.appointments.findIndex(a => a.id === id);
  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Appointment not found' });
  }

  const existingNotes = db.appointments[index].notes || '';
  db.appointments[index] = {
    ...db.appointments[index],
    status: 'cancelled',
    notes: `${existingNotes} [Cancellation: ${reason}]`.trim()
  };

  writeDB(db);
  res.json({ success: true, appointment: db.appointments[index] });
});

// PUT update status
router.put('/:id/status', (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const db = readDB();

  const index = db.appointments.findIndex(a => a.id === id);
  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Appointment not found' });
  }

  db.appointments[index].status = status;
  writeDB(db);

  res.json({ success: true, appointment: db.appointments[index] });
});

// POST complete consultation by Doctor
router.post('/:id/complete', (req, res) => {
  const { id } = req.params;
  const { diagnosis, notes, prescriptionMedicines = [], advice = '', orderedTests = [] } = req.body;
  const db = readDB();

  const aptIndex = db.appointments.findIndex(a => a.id === id);
  if (aptIndex === -1) {
    return res.status(404).json({ success: false, message: 'Appointment not found' });
  }

  const apt = db.appointments[aptIndex];
  let rxId = null;

  // Generate Prescription if medicines provided
  if (prescriptionMedicines.length > 0) {
    rxId = `rx-${Date.now().toString().slice(-4)}`;
    const newRx = {
      id: rxId,
      appointmentId: id,
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
    db.prescriptions = [newRx, ...(db.prescriptions || [])];
  }

  // Order Lab Tests if selected
  orderedTests.forEach((testName, idx) => {
    const labId = `lab-${Date.now().toString().slice(-4)}-${idx + 1}`;
    db.labReports.unshift({
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

  // Update appointment status to completed
  db.appointments[aptIndex] = {
    ...apt,
    status: 'completed',
    diagnosis,
    notes: notes || apt.notes,
    prescriptionId: rxId
  };

  // Generate Invoice
  const invId = `inv-${Date.now().toString().slice(-4)}`;
  const consultationFee = apt.fee || 150;
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

  db.bills = [newBill, ...(db.bills || [])];

  writeDB(db);

  res.json({
    success: true,
    appointment: db.appointments[aptIndex],
    prescriptionId: rxId,
    invoiceId: invId
  });
});

export default router;
