import express from 'express';
import { readDB, writeDB } from '../db.js';

const router = express.Router();

// GET Admin System Overview Statistics
router.get('/overview', (req, res) => {
  const db = readDB();

  const totalDoctors = (db.doctors || []).length;
  const activeDoctors = (db.doctors || []).filter(d => d.active).length;
  const totalPatients = (db.patients || []).length;
  const admittedPatients = (db.patients || []).filter(p => p.assignedBedId).length;
  const totalBeds = (db.beds || []).length;
  const occupiedBeds = (db.beds || []).filter(b => b.status === 'occupied').length;
  const totalAppointments = (db.appointments || []).length;
  const totalRevenue = (db.bills || [])
    .filter(b => b.status === 'paid')
    .reduce((sum, b) => sum + (b.total || 0), 0);

  res.json({
    success: true,
    stats: {
      totalDoctors,
      activeDoctors,
      totalPatients,
      admittedPatients,
      totalBeds,
      occupiedBeds,
      bedOccupancyRate: totalBeds ? Math.round((occupiedBeds / totalBeds) * 100) : 0,
      totalAppointments,
      totalRevenue: +totalRevenue.toFixed(2)
    }
  });
});

// BED MANAGEMENT
router.get('/beds', (req, res) => {
  const db = readDB();
  res.json({ success: true, count: (db.beds || []).length, beds: db.beds || [] });
});

router.put('/beds/:id/assign', (req, res) => {
  const { id } = req.params;
  const { patientId } = req.body;
  const db = readDB();

  const patient = db.patients.find(p => p.id === patientId);
  if (!patient) {
    return res.status(404).json({ success: false, message: 'Patient not found' });
  }

  db.beds = db.beds.map(bed =>
    bed.id === id ? { ...bed, status: 'occupied', occupantId: patientId, occupantName: patient.name } : bed
  );

  db.patients = db.patients.map(p =>
    p.id === patientId ? { ...p, assignedBedId: id, admissionStatus: `Admitted (${id})` } : p
  );

  writeDB(db);
  res.json({ success: true, message: 'Bed assigned successfully' });
});

router.put('/beds/:id/vacate', (req, res) => {
  const { id } = req.params;
  const db = readDB();

  const bed = db.beds.find(b => b.id === id);
  const occupantId = bed?.occupantId;

  db.beds = db.beds.map(b =>
    b.id === id ? { ...b, status: 'cleaning', occupantId: null, occupantName: null } : b
  );

  if (occupantId) {
    db.patients = db.patients.map(p =>
      p.id === occupantId ? { ...p, assignedBedId: null, admissionStatus: 'Discharged' } : p
    );
  }

  writeDB(db);
  res.json({ success: true, message: 'Bed vacated successfully' });
});

router.put('/beds/:id/status', (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const db = readDB();

  const index = db.beds.findIndex(b => b.id === id);
  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Bed not found' });
  }

  db.beds[index].status = status;
  writeDB(db);
  res.json({ success: true, bed: db.beds[index] });
});

// STAFF MANAGEMENT
router.get('/staff', (req, res) => {
  const db = readDB();
  res.json({ success: true, staff: db.staff || [] });
});

router.post('/staff', (req, res) => {
  const db = readDB();
  const newStaff = {
    id: `stf-${Date.now().toString().slice(-4)}`,
    status: 'On Duty',
    ...req.body
  };
  db.staff = [...(db.staff || []), newStaff];
  writeDB(db);
  res.status(201).json({ success: true, staffMember: newStaff });
});

router.put('/staff/:id', (req, res) => {
  const db = readDB();
  const index = db.staff.findIndex(s => s.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Staff member not found' });
  }
  db.staff[index] = { ...db.staff[index], ...req.body };
  writeDB(db);
  res.json({ success: true, staffMember: db.staff[index] });
});

router.delete('/staff/:id', (req, res) => {
  const db = readDB();
  db.staff = (db.staff || []).filter(s => s.id !== req.params.id);
  writeDB(db);
  res.json({ success: true, message: 'Staff member removed' });
});

// BILLING API
router.get('/bills', (req, res) => {
  const db = readDB();
  res.json({ success: true, bills: db.bills || [] });
});

router.post('/bills', (req, res) => {
  const db = readDB();
  const newBill = {
    id: `inv-${Date.now().toString().slice(-4)}`,
    date: new Date().toISOString().split('T')[0],
    dueDate: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
    status: 'pending',
    paymentMethod: null,
    paidAt: null,
    discountAmount: 0,
    ...req.body
  };
  db.bills = [newBill, ...(db.bills || [])];
  writeDB(db);
  res.status(201).json({ success: true, bill: newBill });
});

router.put('/bills/:id/pay', (req, res) => {
  const { paymentMethod = 'Online Payment' } = req.body;
  const db = readDB();

  const index = db.bills.findIndex(b => b.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Invoice not found' });
  }

  db.bills[index] = {
    ...db.bills[index],
    status: 'paid',
    paymentMethod,
    paidAt: new Date().toLocaleString()
  };

  writeDB(db);
  res.json({ success: true, bill: db.bills[index] });
});

// LAB REPORTS API
router.get('/lab-reports', (req, res) => {
  const db = readDB();
  res.json({ success: true, labReports: db.labReports || [] });
});

router.post('/lab-reports', (req, res) => {
  const db = readDB();
  const newReport = {
    id: `lab-${Date.now().toString().slice(-4)}`,
    orderDate: new Date().toISOString().split('T')[0],
    reportDate: null,
    status: 'processing',
    results: [],
    overallImpression: 'Sample collected, processing under pathology verification.',
    ...req.body
  };
  db.labReports = [newReport, ...(db.labReports || [])];
  writeDB(db);
  res.status(201).json({ success: true, report: newReport });
});

router.put('/lab-reports/:id', (req, res) => {
  const { results, overallImpression } = req.body;
  const db = readDB();

  const index = db.labReports.findIndex(l => l.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Lab report not found' });
  }

  db.labReports[index] = {
    ...db.labReports[index],
    status: 'completed',
    reportDate: new Date().toISOString().split('T')[0],
    results: results || db.labReports[index].results,
    overallImpression: overallImpression || db.labReports[index].overallImpression
  };

  writeDB(db);
  res.json({ success: true, report: db.labReports[index] });
});

// DEPARTMENTS API
router.get('/departments', (req, res) => {
  const db = readDB();
  res.json({ success: true, departments: db.departments || [] });
});

router.post('/departments', (req, res) => {
  const db = readDB();
  const newDept = {
    id: `dept-${Date.now().toString().slice(-4)}`,
    totalBeds: 20,
    color: '#0ea5e9',
    ...req.body
  };
  db.departments = [...(db.departments || []), newDept];
  writeDB(db);
  res.status(201).json({ success: true, department: newDept });
});

export default router;
