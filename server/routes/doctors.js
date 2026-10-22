import express from 'express';
import { readDB, writeDB } from '../db.js';

const router = express.Router();

// GET list of doctors
router.get('/', (req, res) => {
  const db = readDB();
  let doctors = db.doctors || [];

  const { departmentId, search } = req.query;

  if (departmentId) {
    doctors = doctors.filter(d => d.departmentId === departmentId);
  }

  if (search) {
    const query = search.toLowerCase();
    doctors = doctors.filter(d =>
      d.name.toLowerCase().includes(query) ||
      d.specialization.toLowerCase().includes(query)
    );
  }

  res.json({ success: true, count: doctors.length, doctors });
});

// GET doctor by ID
router.get('/:id', (req, res) => {
  const db = readDB();
  const doc = (db.doctors || []).find(d => d.id === req.params.id);
  if (!doc) {
    return res.status(404).json({ success: false, message: 'Doctor not found' });
  }
  res.json({ success: true, doctor: doc });
});

// POST add new doctor
router.post('/', (req, res) => {
  const db = readDB();
  const newDoc = {
    id: `doc-${Date.now().toString().slice(-4)}`,
    rating: 5.0,
    reviewCount: 1,
    active: true,
    availableDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    availableSlots: ["09:00 AM", "11:00 AM", "02:00 PM", "04:00 PM"],
    ...req.body
  };

  db.doctors = [newDoc, ...(db.doctors || [])];
  writeDB(db);

  res.status(201).json({ success: true, doctor: newDoc });
});

// PUT update doctor fields
router.put('/:id', (req, res) => {
  const db = readDB();
  const index = db.doctors.findIndex(d => d.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Doctor not found' });
  }

  db.doctors[index] = { ...db.doctors[index], ...req.body };
  writeDB(db);

  res.json({ success: true, doctor: db.doctors[index] });
});

// PUT toggle active status
router.put('/:id/toggle-status', (req, res) => {
  const db = readDB();
  const index = db.doctors.findIndex(d => d.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Doctor not found' });
  }

  db.doctors[index].active = !db.doctors[index].active;
  writeDB(db);

  res.json({ success: true, doctor: db.doctors[index] });
});

// PUT update doctor schedule availability
router.put('/:id/availability', (req, res) => {
  const { days, slots } = req.body;
  const db = readDB();

  const index = db.doctors.findIndex(d => d.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Doctor not found' });
  }

  if (days) db.doctors[index].availableDays = days;
  if (slots) db.doctors[index].availableSlots = slots;

  writeDB(db);

  res.json({ success: true, doctor: db.doctors[index] });
});

export default router;
