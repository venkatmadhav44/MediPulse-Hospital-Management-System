import express from 'express';
import { readDB, writeDB } from '../db.js';

const router = express.Router();

// GET list of patients
router.get('/', (req, res) => {
  const db = readDB();
  let patients = db.patients || [];
  const { search } = req.query;

  if (search) {
    const query = search.toLowerCase();
    patients = patients.filter(p =>
      p.name.toLowerCase().includes(query) ||
      p.id.toLowerCase().includes(query)
    );
  }

  res.json({ success: true, count: patients.length, patients });
});

// GET single patient by ID
router.get('/:id', (req, res) => {
  const db = readDB();
  const patient = (db.patients || []).find(p => p.id === req.params.id);
  if (!patient) {
    return res.status(404).json({ success: false, message: 'Patient not found' });
  }

  // Include patient's prescriptions, lab reports, and bills
  const prescriptions = (db.prescriptions || []).filter(rx => rx.patientId === req.params.id);
  const labReports = (db.labReports || []).filter(lab => lab.patientId === req.params.id);
  const bills = (db.bills || []).filter(b => b.patientId === req.params.id);

  res.json({
    success: true,
    patient,
    prescriptions,
    labReports,
    bills
  });
});

// POST register new patient
router.post('/', (req, res) => {
  const db = readDB();
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
    ...req.body
  };

  db.patients = [newPat, ...(db.patients || [])];
  writeDB(db);

  res.status(201).json({ success: true, patient: newPat });
});

// PUT update patient profile
router.put('/:id', (req, res) => {
  const db = readDB();
  const index = db.patients.findIndex(p => p.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Patient not found' });
  }

  db.patients[index] = { ...db.patients[index], ...req.body };
  writeDB(db);

  res.json({ success: true, patient: db.patients[index] });
});

// PUT update vitals
router.put('/:id/vitals', (req, res) => {
  const db = readDB();
  const index = db.patients.findIndex(p => p.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Patient not found' });
  }

  db.patients[index].vitals = {
    ...db.patients[index].vitals,
    ...req.body,
    lastUpdated: 'Just now'
  };

  writeDB(db);

  res.json({ success: true, vitals: db.patients[index].vitals });
});

export default router;
