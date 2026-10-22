import express from 'express';
import { generateToken } from '../middleware/auth.js';
import { readDB } from '../db.js';

const router = express.Router();

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

// Login Route
router.post('/login', (req, res) => {
  const { role, email, name } = req.body;
  const userBase = DEMO_USERS[role] || DEMO_USERS.patient;

  const user = {
    ...userBase,
    email: email || userBase.email,
    name: name || userBase.name
  };

  const token = generateToken(user);
  res.json({
    success: true,
    user,
    token
  });
});

// Role Switch Route
router.post('/switch-role', (req, res) => {
  const { role } = req.body;
  const user = DEMO_USERS[role] || DEMO_USERS.patient;
  const token = generateToken(user);
  res.json({
    success: true,
    user,
    token
  });
});

// Current User Profile Route
router.get('/me', (req, res) => {
  if (!req.user) {
    return res.status(401).json({ success: false, message: 'Not authenticated' });
  }
  res.json({
    success: true,
    user: req.user
  });
});

export default router;
