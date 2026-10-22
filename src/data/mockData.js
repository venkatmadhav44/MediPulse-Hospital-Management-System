// ==========================================================================
// MEDIPULSE HMS - COMPREHENSIVE CLINICAL MOCK DATASET
// ==========================================================================

export const INITIAL_DEPARTMENTS = [
  {
    id: "dept-cardio",
    name: "Cardiology",
    code: "CARD",
    head: "Dr. Sarah Jenkins",
    description: "Advanced cardiac care, non-invasive diagnostics, and surgical intervention.",
    totalBeds: 24,
    color: "#0ea5e9"
  },
  {
    id: "dept-neuro",
    name: "Neurology & Neurosurgery",
    code: "NEUR",
    head: "Dr. Marcus Vance",
    description: "Comprehensive neurology, stroke unit, and complex neuro-trauma care.",
    totalBeds: 18,
    color: "#8b5cf6"
  },
  {
    id: "dept-pediatrics",
    name: "Pediatrics & Neonatology",
    code: "PEDI",
    head: "Dr. Priya Patel",
    description: "Specialized childcare, pediatric intensive care, and neonatal surgery.",
    totalBeds: 30,
    color: "#f59e0b"
  },
  {
    id: "dept-ortho",
    name: "Orthopedics & Joint Replacement",
    code: "ORTH",
    head: "Dr. Robert Chen",
    description: "Joint arthroplasty, sports medicine, trauma, and spinal surgery.",
    totalBeds: 26,
    color: "#10b981"
  },
  {
    id: "dept-oncology",
    name: "Oncology & Chemotherapy",
    code: "ONCO",
    head: "Dr. Elena Rostova",
    description: "Precision cancer therapies, radiation oncology, and palliative care.",
    totalBeds: 20,
    color: "#ec4899"
  },
  {
    id: "dept-emergency",
    name: "Emergency & Critical Trauma",
    code: "ER",
    head: "Dr. David Miller",
    description: "24/7 Level 1 Trauma Care, rapid resuscitation, and stroke response.",
    totalBeds: 22,
    color: "#ef4444"
  },
  {
    id: "dept-general",
    name: "Internal & General Medicine",
    code: "GENM",
    head: "Dr. David Miller",
    description: "Adult chronic care, internal diagnostics, endocrinology, and infectious disease.",
    totalBeds: 35,
    color: "#06b6d4"
  },
  {
    id: "dept-icu",
    name: "Intensive Care Unit (ICU)",
    code: "ICU",
    head: "Dr. Marcus Vance",
    description: "Multi-disciplinary advanced life support and continuous telemetry.",
    totalBeds: 16,
    color: "#6366f1"
  }
];

export const INITIAL_DOCTORS = [
  {
    id: "doc-1",
    name: "Dr. Sarah Jenkins",
    email: "doctor@medipulse.org",
    specialization: "Cardiology",
    departmentId: "dept-cardio",
    qualifications: "MD, FACC, Harvard Medical School",
    experienceYears: 14,
    rating: 4.9,
    reviewCount: 142,
    consultationFee: 150,
    phone: "+1 (555) 432-8811",
    roomNo: "Room 302, Tower B",
    bio: "Chief of Cardiology specializing in non-invasive coronary intervention, heart failure management, and preventive cardiac wellness.",
    availableDays: ["Monday", "Wednesday", "Friday"],
    availableSlots: ["09:00 AM", "10:00 AM", "11:30 AM", "02:00 PM", "03:30 PM", "04:30 PM"],
    active: true
  },
  {
    id: "doc-2",
    name: "Dr. Marcus Vance",
    email: "m.vance@medipulse.org",
    specialization: "Neurology & Neurosurgery",
    departmentId: "dept-neuro",
    qualifications: "MD, PhD, Johns Hopkins Medicine",
    experienceYears: 18,
    rating: 4.8,
    reviewCount: 98,
    consultationFee: 180,
    phone: "+1 (555) 674-2900",
    roomNo: "Room 410, Neuro Wing",
    bio: "Internationally recognized neurologist specializing in complex migraine disorders, epilepsy management, and neurological rehabilitation.",
    availableDays: ["Tuesday", "Thursday", "Saturday"],
    availableSlots: ["10:00 AM", "11:00 AM", "01:30 PM", "03:00 PM", "04:00 PM"],
    active: true
  },
  {
    id: "doc-3",
    name: "Dr. Priya Patel",
    email: "p.patel@medipulse.org",
    specialization: "Pediatrics & Neonatology",
    departmentId: "dept-pediatrics",
    qualifications: "MBBS, MD (Pediatrics), DCH",
    experienceYears: 10,
    rating: 4.9,
    reviewCount: 210,
    consultationFee: 120,
    phone: "+1 (555) 891-3401",
    roomNo: "Room 105, Children Clinic",
    bio: "Compassionate pediatrician dedicated to infant growth tracking, childhood immunizations, and pediatric respiratory conditions.",
    availableDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    availableSlots: ["08:30 AM", "09:30 AM", "10:30 AM", "11:30 AM", "12:30 PM"],
    active: true
  },
  {
    id: "doc-4",
    name: "Dr. Robert Chen",
    email: "r.chen@medipulse.org",
    specialization: "Orthopedics & Joint Replacement",
    departmentId: "dept-ortho",
    qualifications: "MS Orthopedics, FRCS (Ortho)",
    experienceYears: 15,
    rating: 4.7,
    reviewCount: 88,
    consultationFee: 160,
    phone: "+1 (555) 321-9988",
    roomNo: "Room 215, Ortho Center",
    bio: "Senior orthopedic surgeon specializing in robotic total knee & hip arthroplasty, meniscus repairs, and sports trauma reconstruction.",
    availableDays: ["Monday", "Wednesday", "Thursday"],
    availableSlots: ["11:00 AM", "12:00 PM", "02:00 PM", "03:30 PM", "05:00 PM"],
    active: true
  },
  {
    id: "doc-5",
    name: "Dr. Elena Rostova",
    email: "e.rostova@medipulse.org",
    specialization: "Oncology & Chemotherapy",
    departmentId: "dept-oncology",
    qualifications: "MD, DM (Medical Oncology)",
    experienceYears: 12,
    rating: 4.9,
    reviewCount: 76,
    consultationFee: 200,
    phone: "+1 (555) 762-1144",
    roomNo: "Room 501, Cancer Pavilion",
    bio: "Expert medical oncologist focusing on targeted monoclonal therapies, immunotherapy protocols, and holistic cancer rehabilitation.",
    availableDays: ["Tuesday", "Friday"],
    availableSlots: ["09:00 AM", "11:00 AM", "01:00 PM", "03:00 PM"],
    active: true
  },
  {
    id: "doc-6",
    name: "Dr. David Miller",
    email: "d.miller@medipulse.org",
    specialization: "Emergency & Critical Trauma",
    departmentId: "dept-emergency",
    qualifications: "MD (Emergency Medicine), FACEP",
    experienceYears: 8,
    rating: 4.8,
    reviewCount: 165,
    consultationFee: 100,
    phone: "+1 (555) 990-2311",
    roomNo: "Emergency Bay 1",
    bio: "Trauma specialist directing acute patient stabilization, critical toxicology management, and urgent diagnostic triage.",
    availableDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    availableSlots: ["08:00 AM", "10:00 AM", "12:00 PM", "02:00 PM", "04:00 PM"],
    active: true
  }
];

export const INITIAL_PATIENTS = [
  {
    id: "pat-1",
    name: "Alex Morgan",
    email: "patient@medipulse.org",
    age: 34,
    gender: "Male",
    bloodGroup: "O+",
    phone: "+1 (555) 234-8901",
    address: "742 Evergreen Terrace, Metro City",
    allergies: "Penicillin, Cephalosporins",
    chronicConditions: "Mild Seasonal Asthma",
    emergencyContact: {
      name: "Claire Morgan",
      relationship: "Spouse",
      phone: "+1 (555) 234-8902"
    },
    assignedBedId: null,
    admissionStatus: "Outpatient",
    vitals: {
      bloodPressure: "120/80 mmHg",
      heartRate: "72 bpm",
      temperature: "98.6 °F",
      spO2: "99%",
      respiratoryRate: "16 bpm",
      bmi: "23.4",
      lastUpdated: "Today, 08:30 AM"
    }
  },
  {
    id: "pat-2",
    name: "Clara Oswald",
    email: "c.oswald@example.com",
    age: 29,
    gender: "Female",
    bloodGroup: "A+",
    phone: "+1 (555) 431-7722",
    address: "12 Rosewood Lane, Sector 4",
    allergies: "Sulfa antibiotics",
    chronicConditions: "None",
    emergencyContact: {
      name: "Arthur Oswald",
      relationship: "Father",
      phone: "+1 (555) 431-7700"
    },
    assignedBedId: "bed-icu-02",
    admissionStatus: "Admitted (ICU)",
    vitals: {
      bloodPressure: "110/70 mmHg",
      heartRate: "78 bpm",
      temperature: "99.1 °F",
      spO2: "96%",
      respiratoryRate: "18 bpm",
      bmi: "21.8",
      lastUpdated: "Today, 07:15 AM"
    }
  },
  {
    id: "pat-3",
    name: "Harold Bennett",
    email: "h.bennett@example.com",
    age: 64,
    gender: "Male",
    bloodGroup: "B+",
    phone: "+1 (555) 902-3341",
    address: "88 Birchwood Drive, North Hills",
    allergies: "None known",
    chronicConditions: "Hypertension, Type 2 Diabetes",
    emergencyContact: {
      name: "Martha Bennett",
      relationship: "Spouse",
      phone: "+1 (555) 902-3342"
    },
    assignedBedId: "bed-gen-104",
    admissionStatus: "Admitted (General Ward)",
    vitals: {
      bloodPressure: "138/88 mmHg",
      heartRate: "82 bpm",
      temperature: "98.4 °F",
      spO2: "97%",
      respiratoryRate: "19 bpm",
      bmi: "28.1",
      lastUpdated: "Yesterday, 06:00 PM"
    }
  },
  {
    id: "pat-4",
    name: "Sophia Martinez",
    email: "s.martinez@example.com",
    age: 42,
    gender: "Female",
    bloodGroup: "AB-",
    phone: "+1 (555) 349-1190",
    address: "310 Canyon Crest, Westside",
    allergies: "NSAIDs (Ibuprofen)",
    chronicConditions: "Chronic Migraines",
    emergencyContact: {
      name: "Carlos Martinez",
      relationship: "Brother",
      phone: "+1 (555) 349-1199"
    },
    assignedBedId: null,
    admissionStatus: "Outpatient",
    vitals: {
      bloodPressure: "118/76 mmHg",
      heartRate: "68 bpm",
      temperature: "98.7 °F",
      spO2: "99%",
      respiratoryRate: "15 bpm",
      bmi: "24.0",
      lastUpdated: "3 days ago"
    }
  },
  {
    id: "pat-5",
    name: "Liam Vance",
    email: "liam.family@example.com",
    age: 7,
    gender: "Male",
    bloodGroup: "O+",
    phone: "+1 (555) 674-2901",
    address: "54 Meadowbrook Court",
    allergies: "Peanuts",
    chronicConditions: "Mild Eczema",
    emergencyContact: {
      name: "Sarah Vance",
      relationship: "Mother",
      phone: "+1 (555) 674-2900"
    },
    assignedBedId: null,
    admissionStatus: "Outpatient",
    vitals: {
      bloodPressure: "100/65 mmHg",
      heartRate: "88 bpm",
      temperature: "98.2 °F",
      spO2: "100%",
      respiratoryRate: "22 bpm",
      bmi: "16.4",
      lastUpdated: "5 days ago"
    }
  }
];

export const INITIAL_APPOINTMENTS = [
  {
    id: "apt-101",
    patientId: "pat-1",
    patientName: "Alex Morgan",
    doctorId: "doc-1",
    doctorName: "Dr. Sarah Jenkins",
    department: "Cardiology",
    date: "2026-09-18",
    time: "10:00 AM",
    status: "confirmed", // 'confirmed', 'in-consultation', 'completed', 'cancelled'
    reason: "Quarterly cardiovascular routine follow-up & resting ECG review",
    symptoms: "Mild chest tightness on high exertion, occasional fatigue",
    notes: "Patient is requested to bring fasting lipid panel report.",
    fee: 150
  },
  {
    id: "apt-102",
    patientId: "pat-1",
    patientName: "Alex Morgan",
    doctorId: "doc-3",
    doctorName: "Dr. Priya Patel",
    department: "Pediatrics & Neonatology",
    date: "2026-09-22",
    time: "11:30 AM",
    status: "confirmed",
    reason: "Allergy consultation for child seasonal triggers",
    symptoms: "Sneezing and runny nose in dry weather",
    notes: "Reviewing inhaler technique.",
    fee: 120
  },
  {
    id: "apt-103",
    patientId: "pat-1",
    patientName: "Alex Morgan",
    doctorId: "doc-1",
    doctorName: "Dr. Sarah Jenkins",
    department: "Cardiology",
    date: "2026-08-14",
    time: "09:00 AM",
    status: "completed",
    reason: "Palpitation screening and blood pressure titration",
    symptoms: "Reported flutter sensation while resting",
    diagnosis: "Benign sinus arrhythmia; stage 1 pre-hypertension controlled.",
    notes: "Advised 30 minutes daily aerobic exercise. Continue low-sodium diet.",
    prescriptionId: "rx-301",
    fee: 150
  },
  {
    id: "apt-104",
    patientId: "pat-3",
    patientName: "Harold Bennett",
    doctorId: "doc-1",
    doctorName: "Dr. Sarah Jenkins",
    department: "Cardiology",
    date: "2026-09-18",
    time: "11:30 AM",
    status: "confirmed",
    reason: "Post-admission cardiac telemetry review",
    symptoms: "Shortness of breath climbing stairs",
    notes: "Check electrolytes and renal function.",
    fee: 150
  },
  {
    id: "apt-105",
    patientId: "pat-4",
    patientName: "Sophia Martinez",
    doctorId: "doc-2",
    doctorName: "Dr. Marcus Vance",
    department: "Neurology & Neurosurgery",
    date: "2026-09-18",
    time: "01:30 PM",
    status: "confirmed",
    reason: "Chronic migraine prophylactic review",
    symptoms: "Throbbing temporal headache with photophobia",
    notes: "Evaluate response to topiramate regimen.",
    fee: 180
  },
  {
    id: "apt-106",
    patientId: "pat-2",
    patientName: "Clara Oswald",
    doctorId: "doc-6",
    doctorName: "Dr. David Miller",
    department: "Emergency & Critical Trauma",
    date: "2026-09-17",
    time: "08:00 AM",
    status: "completed",
    reason: "Emergency intake acute respiratory distress",
    symptoms: "Acute wheezing, fever, oxygen saturation 93%",
    diagnosis: "Severe Acute Bronchospasm with secondary upper airway infection.",
    notes: "Admitted to ICU Bed 02 for continuous oxygen therapy and IV bronchodilators.",
    prescriptionId: "rx-302",
    fee: 100
  }
];

export const INITIAL_PRESCRIPTIONS = [
  {
    id: "rx-301",
    appointmentId: "apt-103",
    patientId: "pat-1",
    patientName: "Alex Morgan",
    doctorId: "doc-1",
    doctorName: "Dr. Sarah Jenkins",
    doctorSpecialty: "Chief of Cardiology",
    date: "2026-08-14",
    diagnosis: "Pre-hypertension & Sinus Tachycardia",
    medicines: [
      {
        name: "Metoprolol Tartrate",
        strength: "25 mg",
        form: "Tablet",
        frequency: "Once Daily (Morning)",
        duration: "30 Days",
        instructions: "Take with food; do not skip doses."
      },
      {
        name: "Atorvastatin Calcium",
        strength: "10 mg",
        form: "Tablet",
        frequency: "Once Daily (Bedtime)",
        duration: "30 Days",
        instructions: "Take at night after dinner."
      }
    ],
    advice: "Hydrate adequately (2.5L/day), keep sodium under 2g/day, perform regular walking.",
    status: "active"
  },
  {
    id: "rx-302",
    appointmentId: "apt-106",
    patientId: "pat-2",
    patientName: "Clara Oswald",
    doctorId: "doc-6",
    doctorName: "Dr. David Miller",
    doctorSpecialty: "Critical Care Specialist",
    date: "2026-09-17",
    diagnosis: "Acute Bronchospasm & Respiratory Infection",
    medicines: [
      {
        name: "Levofloxacin Infusion",
        strength: "500 mg / 100 ml",
        form: "IV Drip",
        frequency: "Once every 24 hours",
        duration: "5 Days",
        instructions: "Administer over 60 minutes."
      },
      {
        name: "Salbutamol Nebulizer Solution",
        strength: "2.5 mg / 2.5 ml",
        form: "Nebulization",
        frequency: "Every 6 hours",
        duration: "4 Days",
        instructions: "Combine with 2ml saline in nebulizer chamber."
      }
    ],
    advice: "Continuous SpO2 and arterial blood gas monitoring.",
    status: "active"
  },
  {
    id: "rx-303",
    appointmentId: "apt-manual",
    patientId: "pat-1",
    patientName: "Alex Morgan",
    doctorId: "doc-1",
    doctorName: "Dr. Sarah Jenkins",
    doctorSpecialty: "Cardiology",
    date: "2026-05-10",
    diagnosis: "Seasonal Allergic Rhinitis",
    medicines: [
      {
        name: "Cetirizine Hydrochloride",
        strength: "10 mg",
        form: "Tablet",
        frequency: "Once daily (Bedtime)",
        duration: "14 Days",
        instructions: "May cause slight drowsiness."
      }
    ],
    advice: "Avoid dusty environments and wear protective mask outdoors.",
    status: "completed"
  }
];

export const INITIAL_LAB_REPORTS = [
  {
    id: "lab-501",
    testName: "Complete Blood Count (CBC) with Differential",
    category: "Hematology",
    patientId: "pat-1",
    patientName: "Alex Morgan",
    orderedBy: "Dr. Sarah Jenkins",
    orderDate: "2026-09-15",
    reportDate: "2026-09-16",
    status: "completed",
    results: [
      { parameter: "Hemoglobin", value: 14.8, unit: "g/dL", normalRange: "13.5 - 17.5", flag: "normal" },
      { parameter: "White Blood Cells (WBC)", value: 7.2, unit: "x10^3/uL", normalRange: "4.5 - 11.0", flag: "normal" },
      { parameter: "Platelet Count", value: 245, unit: "x10^3/uL", normalRange: "150 - 450", flag: "normal" },
      { parameter: "Hematocrit (HCT)", value: 44.1, unit: "%", normalRange: "41.0 - 50.0", flag: "normal" }
    ],
    overallImpression: "Normal hematological panel with no signs of acute infection or anemia."
  },
  {
    id: "lab-502",
    testName: "Comprehensive Lipid Profile",
    category: "Biochemistry",
    patientId: "pat-1",
    patientName: "Alex Morgan",
    orderedBy: "Dr. Sarah Jenkins",
    orderDate: "2026-09-15",
    reportDate: "2026-09-16",
    status: "completed",
    results: [
      { parameter: "Total Cholesterol", value: 215, unit: "mg/dL", normalRange: "< 200", flag: "abnormal" },
      { parameter: "HDL (Good Cholesterol)", value: 54, unit: "mg/dL", normalRange: "> 40", flag: "normal" },
      { parameter: "LDL (Bad Cholesterol)", value: 138, unit: "mg/dL", normalRange: "< 100", flag: "abnormal" },
      { parameter: "Triglycerides", value: 165, unit: "mg/dL", normalRange: "< 150", flag: "abnormal" }
    ],
    overallImpression: "Mild hypercholesterolemia. Dietary modification and regular statin therapy recommended."
  },
  {
    id: "lab-503",
    testName: "High-Resolution Chest Radiograph (X-Ray)",
    category: "Radiology",
    patientId: "pat-2",
    patientName: "Clara Oswald",
    orderedBy: "Dr. David Miller",
    orderDate: "2026-09-17",
    reportDate: "2026-09-17",
    status: "completed",
    results: [
      { parameter: "Bilateral Lung Fields", value: "Mild peribronchial thickening", unit: "-", normalRange: "Clear", flag: "abnormal" },
      { parameter: "Cardiothoracic Ratio", value: "Normal (0.44)", unit: "-", normalRange: "< 0.50", flag: "normal" },
      { parameter: "Costophrenic Angles", value: "Sharp and clear", unit: "-", normalRange: "Clear", flag: "normal" }
    ],
    overallImpression: "Findings consistent with acute reactive bronchospasm without consolidative pneumonia."
  },
  {
    id: "lab-504",
    testName: "Glycated Hemoglobin (HbA1c)",
    category: "Endocrinology",
    patientId: "pat-3",
    patientName: "Harold Bennett",
    orderedBy: "Dr. David Miller",
    orderDate: "2026-09-16",
    reportDate: "2026-09-17",
    status: "completed",
    results: [
      { parameter: "HbA1c", value: 7.8, unit: "%", normalRange: "< 5.7", flag: "abnormal" },
      { parameter: "Estimated Average Glucose", value: 177, unit: "mg/dL", normalRange: "< 126", flag: "abnormal" }
    ],
    overallImpression: "Sub-optimal glycemic control. Anti-diabetic medication adjustment required."
  },
  {
    id: "lab-505",
    testName: "Arterial Blood Gas (ABG) Analysis",
    category: "Critical Care",
    patientId: "pat-2",
    patientName: "Clara Oswald",
    orderedBy: "Dr. David Miller",
    orderDate: "2026-09-17",
    reportDate: null,
    status: "processing",
    results: [],
    overallImpression: "Sample processing in central laboratory."
  }
];

export const INITIAL_BEDS = [
  // ICU Beds
  { id: "bed-icu-01", ward: "Intensive Care Unit (ICU)", roomNo: "ICU-01", type: "Critical Care", status: "available", occupantId: null, occupantName: null },
  { id: "bed-icu-02", ward: "Intensive Care Unit (ICU)", roomNo: "ICU-02", type: "Critical Care", status: "occupied", occupantId: "pat-2", occupantName: "Clara Oswald" },
  { id: "bed-icu-03", ward: "Intensive Care Unit (ICU)", roomNo: "ICU-03", type: "Critical Care", status: "cleaning", occupantId: null, occupantName: null },
  { id: "bed-icu-04", ward: "Intensive Care Unit (ICU)", roomNo: "ICU-04", type: "Critical Care", status: "available", occupantId: null, occupantName: null },

  // General Ward Beds
  { id: "bed-gen-101", ward: "General Medical Ward", roomNo: "Ward 1A", type: "Standard", status: "available", occupantId: null, occupantName: null },
  { id: "bed-gen-102", ward: "General Medical Ward", roomNo: "Ward 1A", type: "Standard", status: "available", occupantId: null, occupantName: null },
  { id: "bed-gen-103", ward: "General Medical Ward", roomNo: "Ward 1B", type: "Standard", status: "available", occupantId: null, occupantName: null },
  { id: "bed-gen-104", ward: "General Medical Ward", roomNo: "Ward 1B", type: "Standard", status: "occupied", occupantId: "pat-3", occupantName: "Harold Bennett" },
  { id: "bed-gen-105", ward: "General Medical Ward", roomNo: "Ward 2A", type: "Standard", status: "available", occupantId: null, occupantName: null },
  { id: "bed-gen-106", ward: "General Medical Ward", roomNo: "Ward 2A", type: "Standard", status: "cleaning", occupantId: null, occupantName: null },

  // Deluxe & Executive Rooms
  { id: "bed-dlx-301", ward: "Deluxe Executive Suite", roomNo: "Suite 301", type: "Private Suite", status: "available", occupantId: null, occupantName: null },
  { id: "bed-dlx-302", ward: "Deluxe Executive Suite", roomNo: "Suite 302", type: "Private Suite", status: "available", occupantId: null, occupantName: null },

  // Emergency & Trauma Beds
  { id: "bed-er-01", ward: "Emergency & Trauma Bay", roomNo: "ER Bay 1", type: "Rapid Triage", status: "available", occupantId: null, occupantName: null },
  { id: "bed-er-02", ward: "Emergency & Trauma Bay", roomNo: "ER Bay 2", type: "Rapid Triage", status: "available", occupantId: null, occupantName: null },
  { id: "bed-er-03", ward: "Emergency & Trauma Bay", roomNo: "ER Bay 3", type: "Rapid Triage", status: "available", occupantId: null, occupantName: null }
];

export const INITIAL_BILLS = [
  {
    id: "inv-9001",
    patientId: "pat-1",
    patientName: "Alex Morgan",
    date: "2026-08-14",
    dueDate: "2026-08-28",
    status: "paid", // 'paid', 'pending', 'overdue'
    paymentMethod: "Credit Card (Visa ****4129)",
    paidAt: "2026-08-14 11:30 AM",
    items: [
      { description: "Cardiology Specialist Consultation (Dr. Sarah Jenkins)", category: "Consultation", amount: 150 },
      { description: "Resting 12-Lead Electrocardiogram (ECG)", category: "Diagnostics", amount: 65 },
      { description: "Pharmacy Dispense (Metoprolol Tartrate & Atorvastatin)", category: "Pharmacy", amount: 48.50 }
    ],
    subtotal: 263.50,
    taxRate: 5,
    taxAmount: 13.18,
    discountAmount: 0,
    total: 276.68
  },
  {
    id: "inv-9002",
    patientId: "pat-1",
    patientName: "Alex Morgan",
    date: "2026-09-16",
    dueDate: "2026-09-30",
    status: "pending",
    paymentMethod: null,
    paidAt: null,
    items: [
      { description: "Complete Blood Count (CBC) with Differential", category: "Laboratory", amount: 45 },
      { description: "Comprehensive Lipid Profile Panel", category: "Laboratory", amount: 60 }
    ],
    subtotal: 105.00,
    taxRate: 5,
    taxAmount: 5.25,
    discountAmount: 10.00, // Health membership discount
    total: 100.25
  },
  {
    id: "inv-9003",
    patientId: "pat-2",
    patientName: "Clara Oswald",
    date: "2026-09-17",
    dueDate: "2026-09-24",
    status: "pending",
    paymentMethod: null,
    paidAt: null,
    items: [
      { description: "Level 1 Trauma Triage & Emergency Resuscitation", category: "Emergency", amount: 350 },
      { description: "ICU Bed Accommodation (24 Hours)", category: "Hospital Stay", amount: 550 },
      { description: "Chest Radiograph (X-Ray) High Resolution", category: "Radiology", amount: 90 },
      { description: "Emergency IV Medications & Inhalers", category: "Pharmacy", amount: 125 }
    ],
    subtotal: 1115.00,
    taxRate: 5,
    taxAmount: 55.75,
    discountAmount: 0,
    total: 1170.75
  },
  {
    id: "inv-9004",
    patientId: "pat-3",
    patientName: "Harold Bennett",
    date: "2026-09-16",
    dueDate: "2026-09-23",
    status: "paid",
    paymentMethod: "Medical Insurance (BlueCross Shield #BC-9923)",
    paidAt: "2026-09-16 04:15 PM",
    items: [
      { description: "General Ward Room 1B Stay (3 Days)", category: "Hospital Stay", amount: 450 },
      { description: "Endocrinology & Diabetic Assessment", category: "Consultation", amount: 120 },
      { description: "HbA1c & Fasting Glucose Profile", category: "Laboratory", amount: 55 }
    ],
    subtotal: 625.00,
    taxRate: 5,
    taxAmount: 31.25,
    discountAmount: 62.50,
    total: 593.75
  }
];

export const INITIAL_STAFF = [
  { id: "stf-1", name: "Nurse Jessica Alba", role: "Head ICU Nurse", department: "Intensive Care Unit (ICU)", shift: "Morning (07:00 - 15:00)", phone: "+1 (555) 777-1011", status: "On Duty" },
  { id: "stf-2", name: "David Kim", role: "Senior Radiographer", department: "Radiology", shift: "Day (08:00 - 16:00)", phone: "+1 (555) 777-1012", status: "On Duty" },
  { id: "stf-3", name: "Angela Rossi", role: "Chief Clinical Pharmacist", department: "Pharmacy", shift: "Day (09:00 - 17:00)", phone: "+1 (555) 777-1013", status: "On Duty" },
  { id: "stf-4", name: "Carlos Santana", role: "Emergency Intake Coordinator", department: "Emergency & Critical Trauma", shift: "Night (19:00 - 07:00)", phone: "+1 (555) 777-1014", status: "Off Duty" },
  { id: "stf-5", name: "Emily Watson", role: "Senior Biochemist / Lab Tech", department: "Central Pathology Lab", shift: "Day (08:30 - 16:30)", phone: "+1 (555) 777-1015", status: "On Duty" }
];

export const INITIAL_HOSPITAL_INFO = {
  name: "MediPulse Super-Specialty Medical Center",
  tagline: "Advanced Clinical Excellence & Patient-Centric Compassion",
  registrationNo: "HOSP-US-2024-99824",
  address: "100 Healthcare Boulevard, Metro Medical City, NY 10001",
  phone: "+1 (800) 456-PULSE",
  emergencyHotline: "+1 (800) 911-MED1",
  email: "support@medipulse.org",
  website: "https://medipulse-hms.health",
  establishedYear: 2012,
  accreditation: "JCI & NABH Accredited Tertiary Center"
};
