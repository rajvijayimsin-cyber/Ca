/**
 * Generates realistic healthcare data dynamically from workflow inputs.
 * Uses seeded random for consistency across re-renders.
 */

import { KPI_CONFIGS } from '../config/features';

// Simple seeded PRNG for deterministic data
function createSeededRandom(seed: string): () => number {
  let h = 0;
  for (let i = 0; i < seed.length; i++) {
    h = Math.imul(31, h) + seed.charCodeAt(i) | 0;
  }
  return () => {
    h = Math.imul(h ^ (h >>> 16), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    h ^= h >>> 16;
    return (h >>> 0) / 4294967296;
  };
}

const FIRST_NAMES = [
  'Amara', 'Carlos', 'Priya', 'James', 'Fatima', 'Liam', 'Sofia', 'Wei',
  'Olga', 'Raj', 'Elena', 'Marcus', 'Yuki', 'Samuel', 'Nadia', 'Thomas',
  'Leila', 'Andre', 'Maya', 'David', 'Zara', 'Omar', 'Hannah', 'Kenji',
  'Grace', 'Ivan', 'Chloe', 'Diego', 'Aisha', 'Nathan',
];

const LAST_NAMES = [
  'Patel', 'Rodriguez', 'Chen', 'Williams', 'Okonkwo', 'Kim', 'Mueller',
  'Nakamura', 'Singh', 'Lopez', 'Anderson', 'Petrov', 'Hassan', 'Taylor',
  'Yamamoto', 'Johansson', 'Brown', 'Garcia', 'Ivanova', 'Park',
  'Thompson', 'Santos', 'Nguyen', 'Sato', 'Martinez', 'Ali', 'Lee',
  'Wilson', 'Kumar', 'Johnson',
];

const CONDITIONS = [
  'Hypertension', 'Type 2 Diabetes', 'Asthma', 'COPD', 'Atrial Fibrillation',
  'Chronic Kidney Disease', 'Hypothyroidism', 'Osteoarthritis', 'Depression',
  'Anxiety Disorder', 'Heart Failure', 'Migraine', 'Rheumatoid Arthritis',
  'Hyperlipidemia', 'GERD',
];

const MEDICATIONS = [
  'Lisinopril 10mg', 'Metformin 500mg', 'Amlodipine 5mg', 'Atorvastatin 20mg',
  'Omeprazole 20mg', 'Levothyroxine 50mcg', 'Albuterol Inhaler', 'Metoprolol 25mg',
  'Losartan 50mg', 'Gabapentin 300mg', 'Sertraline 50mg', 'Hydrochlorothiazide 25mg',
];

const DEPARTMENTS = [
  'Internal Medicine', 'Cardiology', 'Endocrinology', 'Pulmonology',
  'Orthopedics', 'Neurology', 'Dermatology', 'Gastroenterology',
  'Psychiatry', 'Pediatrics',
];

const APPOINTMENT_TYPES = [
  'Follow-up Visit', 'Annual Physical', 'Visit', 'Lab Review',
  'Procedure', 'Urgent Care', 'Telehealth', 'Pre-op Assessment',
];

const STATUSES = ['Active', 'Inactive', 'Critical', 'Discharged', 'Pending'];
const APPOINTMENT_STATUSES = ['Confirmed', 'Pending', 'In Progress', 'Completed', 'Cancelled'];
const INVOICE_STATUSES = ['Paid', 'Pending', 'Overdue', 'Partially Paid', 'Cancelled'];
const INSURANCE_PROVIDERS = ['BlueCross', 'Aetna', 'UnitedHealth', 'Cigna', 'Humana', 'Kaiser', 'Medicare', 'Medicaid'];

export interface PatientRecord {
  id: string;
  mrn: string;
  firstName: string;
  lastName: string;
  fullName: string;
  age: number;
  dob: string;
  gender: string;
  email: string;
  phone: string;
  status: string;
  lastVisit: string;
  nextAppointment: string;
  conditions: string[];
  medications: string[];
  insurance: string;
  bloodType: string;
  allergies: string[];
}

export interface AppointmentRecord {
  id: string;
  patientName: string;
  providerName: string;
  department: string;
  type: string;
  date: string;
  time: string;
  duration: string;
  status: string;
  notes: string;
}

export interface BillingRecord {
  id: string;
  invoiceNumber: string;
  patientName: string;
  service: string;
  amount: number;
  insurance: string;
  insuranceCovered: number;
  patientOwes: number;
  status: string;
  date: string;
  dueDate: string;
}

export interface AnalyticsDataPoint {
  label: string;
  value: number;
  change?: number;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  resource: string;
  ipAddress: string;
  status: string;
}

export interface VitalRecord {
  date: string;
  systolic: number;
  diastolic: number;
  heartRate: number;
  temperature: number;
  oxygenSat: number;
  weight: number;
}

export interface PrescriptionRecord {
  id: string;
  patientName: string;
  medication: string;
  dosage: string;
  frequency: string;
  prescriber: string;
  startDate: string;
  refillsRemaining: number;
  status: string;
  interactionRisk: string;
}

export interface LabOrderRecord {
  id: string;
  patientName: string;
  testName: string;
  orderingProvider: string;
  priority: string;
  orderDate: string;
  resultDate: string;
  resultFlag: string;
  status: string;
}

export interface TriageRecord {
  id: string;
  patientName: string;
  chiefComplaint: string;
  esiLevel: number;
  arrivalTime: string;
  waitMinutes: number;
  vitalsFlag: string;
  status: string;
}

export interface SurgicalCaseRecord {
  id: string;
  patientName: string;
  procedure: string;
  surgeon: string;
  orRoom: string;
  scheduledTime: string;
  estimatedDuration: string;
  anesthesiaType: string;
  preOpComplete: boolean;
  status: string;
}

export interface RehabPlanRecord {
  id: string;
  patientName: string;
  therapist: string;
  diagnosis: string;
  planType: string;
  progressPercent: number;
  sessionsCompleted: number;
  sessionsTotal: number;
  status: string;
}

export interface DischargeCaseRecord {
  id: string;
  patientName: string;
  admissionDate: string;
  expectedDischarge: string;
  caseManager: string;
  destination: string;
  pendingItems: number;
  insuranceAuth: string;
  status: string;
}

export interface ResearchTrialRecord {
  id: string;
  trialId: string;
  title: string;
  phase: string;
  principalInvestigator: string;
  enrolled: number;
  target: number;
  status: string;
  startDate: string;
  sponsor: string;
}

export interface ImagingOrderRecord {
  id: string;
  patientName: string;
  modality: string;
  bodyPart: string;
  orderingProvider: string;
  radiologist: string;
  priority: string;
  reportStatus: string;
  status: string;
}

function pick<T>(arr: T[], rng: () => number): T {
  return arr[Math.floor(rng() * arr.length)];
}

function pickN<T>(arr: T[], count: number, rng: () => number): T[] {
  const shuffled = [...arr].sort(() => rng() - 0.5);
  return shuffled.slice(0, Math.min(count, arr.length));
}

function formatDate(daysAgo: number): string {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString().split('T')[0];
}

function formatTime(hour: number, minute: number): string {
  const h = hour % 12 || 12;
  const ampm = hour < 12 ? 'AM' : 'PM';
  return `${h}:${minute.toString().padStart(2, '0')} ${ampm}`;
}

export function generatePatientData(count: number, seed: string = 'default'): PatientRecord[] {
  const rng = createSeededRandom(seed + '-Care Recipients');
  const patients: PatientRecord[] = [];
  const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];
  const genders = ['Male', 'Female'];
  const allergyOptions = ['Penicillin', 'Sulfa', 'Aspirin', 'Latex', 'Iodine', 'None'];

  for (let i = 0; i < count; i++) {
    const firstName = pick(FIRST_NAMES, rng);
    const lastName = pick(LAST_NAMES, rng);
    const age = Math.floor(rng() * 60) + 18;
    const daysAgoVisit = Math.floor(rng() * 90);
    const daysUntilNext = Math.floor(rng() * 60) + 1;

    patients.push({
      id: `PAT-${(1000 + i).toString()}`,
      mrn: `MRN-${(100000 + Math.floor(rng() * 900000)).toString()}`,
      firstName,
      lastName,
      fullName: `${firstName} ${lastName}`,
      age,
      dob: formatDate(age * 365 + Math.floor(rng() * 365)),
      gender: pick(genders, rng),
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@email.com`,
      phone: `(${Math.floor(rng() * 900) + 100}) ${Math.floor(rng() * 900) + 100}-${Math.floor(rng() * 9000) + 1000}`,
      status: pick(STATUSES.slice(0, 3), rng),
      lastVisit: formatDate(daysAgoVisit),
      nextAppointment: formatDate(-daysUntilNext),
      conditions: pickN(CONDITIONS, Math.floor(rng() * 3) + 1, rng),
      medications: pickN(MEDICATIONS, Math.floor(rng() * 4) + 1, rng),
      insurance: pick(INSURANCE_PROVIDERS, rng),
      bloodType: pick(bloodTypes, rng),
      allergies: pickN(allergyOptions, Math.floor(rng() * 2) + 1, rng),
    });
  }

  return patients;
}

export function generateAppointmentData(
  count: number,
  stakeholders: string[] = [],
  seed: string = 'default'
): AppointmentRecord[] {
  const rng = createSeededRandom(seed + '-Bookings');
  const appointments: AppointmentRecord[] = [];
  const providerTitles = stakeholders.includes('Caregivers') || stakeholders.includes('healthcare_providers')
    ? ['Dr.', 'Dr.', 'Dr.', 'NP']
    : ['Dr.', 'NP', 'PA'];

  for (let i = 0; i < count; i++) {
    const patientFirst = pick(FIRST_NAMES, rng);
    const patientLast = pick(LAST_NAMES, rng);
    const providerFirst = pick(FIRST_NAMES, rng);
    const providerLast = pick(LAST_NAMES, rng);
    const hour = Math.floor(rng() * 9) + 8; // 8 AM to 5 PM
    const minute = pick([0, 15, 30, 45], rng);

    appointments.push({
      id: `APT-${(2000 + i).toString()}`,
      patientName: `${patientFirst} ${patientLast}`,
      providerName: `${pick(providerTitles, rng)} ${providerFirst} ${providerLast}`,
      department: pick(DEPARTMENTS, rng),
      type: pick(APPOINTMENT_TYPES, rng),
      date: formatDate(Math.floor(rng() * 14) - 7),
      time: formatTime(hour, minute),
      duration: pick(['15 min', '30 min', '45 min', '60 min'], rng),
      status: pick(APPOINTMENT_STATUSES, rng),
      notes: pick([
        'Routine check-up',
        'Follow-up on lab results',
        'Medication review',
        'New Care Recipient Visit',
        'Post-procedure follow-up',
        'Chronic condition management',
      ], rng),
    });
  }

  return appointments;
}

export function generateBillingData(count: number, seed: string = 'default'): BillingRecord[] {
  const rng = createSeededRandom(seed + '-billing');
  const records: BillingRecord[] = [];
  const services = [
    'Office Visit', 'Lab Work', 'X-Ray', 'MRI Scan', 'Physical Therapy',
    'Surgery Visit', 'Annual Wellness Exam', 'Urgent Care Visit',
    'Telehealth Visit', 'Specialist Referral',
  ];

  for (let i = 0; i < count; i++) {
    const patientFirst = pick(FIRST_NAMES, rng);
    const patientLast = pick(LAST_NAMES, rng);
    const amount = Math.floor(rng() * 4500) + 75;
    const coveragePercent = pick([0.6, 0.7, 0.8, 0.85, 0.9], rng);
    const insuranceCovered = Math.round(amount * coveragePercent);

    records.push({
      id: `BIL-${(3000 + i).toString()}`,
      invoiceNumber: `INV-${(20240000 + Math.floor(rng() * 10000)).toString()}`,
      patientName: `${patientFirst} ${patientLast}`,
      service: pick(services, rng),
      amount,
      insurance: pick(INSURANCE_PROVIDERS, rng),
      insuranceCovered,
      patientOwes: amount - insuranceCovered,
      status: pick(INVOICE_STATUSES, rng),
      date: formatDate(Math.floor(rng() * 60)),
      dueDate: formatDate(Math.floor(rng() * 30) * -1),
    });
  }

  return records;
}

export function generateAnalyticsData(
  features: string[] = [],
  seed: string = 'default'
): {
  patientTrends: AnalyticsDataPoint[];
  appointmentVolume: AnalyticsDataPoint[];
  revenueData: AnalyticsDataPoint[];
  complianceScores: AnalyticsDataPoint[];
  departmentStats: AnalyticsDataPoint[];
} {
  const rng = createSeededRandom(seed + '-analytics');
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const patientTrends = months.map(m => ({
    label: m,
    value: Math.floor(rng() * 300) + 800,
    change: Math.floor(rng() * 20) - 5,
  }));

  const appointmentVolume = months.map(m => ({
    label: m,
    value: Math.floor(rng() * 200) + 400,
    change: Math.floor(rng() * 15) - 3,
  }));

  const revenueData = months.map(m => ({
    label: m,
    value: Math.floor(rng() * 50000) + 150000,
  }));

  const complianceScores = [
    { label: 'HIPAA', value: Math.floor(rng() * 10) + 88 },
    { label: 'GDPR', value: Math.floor(rng() * 12) + 82 },
    { label: 'SOC 2', value: Math.floor(rng() * 8) + 90 },
    { label: 'HITRUST', value: Math.floor(rng() * 15) + 78 },
  ];

  const departmentStats = DEPARTMENTS.slice(0, 6).map(d => ({
    label: d,
    value: Math.floor(rng() * 150) + 50,
  }));

  return { patientTrends, appointmentVolume, revenueData, complianceScores, departmentStats };
}

export function generateAuditLogData(
  compliance: string[] = [],
  seed: string = 'default'
): AuditLogEntry[] {
  const rng = createSeededRandom(seed + '-audit');
  const entries: AuditLogEntry[] = [];

  const actions = [
    'LOGIN', 'LOGOUT', 'VIEW_RECORD', 'UPDATE_RECORD', 'CREATE_RECORD',
    'DELETE_RECORD', 'EXPORT_DATA', 'PRINT_RECORD', 'ACCESS_PHI',
    'MODIFY_PERMISSIONS', 'GENERATE_REPORT', 'SYSTEM_BACKUP',
  ];

  const resources = [
    'Care Recipient Record', 'Booking', 'Billing Invoice', 'Lab Result',
    'Prescription', 'User Account', 'Compliance Report', 'Audit Log',
    'System Settings', 'EHR Document',
  ];

  const statusOptions = ['Success', 'Success', 'Success', 'Denied', 'Warning'];

  for (let i = 0; i < 20; i++) {
    const firstName = pick(FIRST_NAMES, rng);
    const lastName = pick(LAST_NAMES, rng);
    const hoursAgo = Math.floor(rng() * 168);
    const d = new Date();
    d.setHours(d.getHours() - hoursAgo);

    entries.push({
      id: `AUD-${(4000 + i).toString()}`,
      timestamp: d.toISOString(),
      user: `${firstName} ${lastName}`,
      action: pick(actions, rng),
      resource: pick(resources, rng),
      ipAddress: `192.168.${Math.floor(rng() * 255)}.${Math.floor(rng() * 255)}`,
      status: pick(statusOptions, rng),
    });
  }

  return entries.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
}

export function generateVitalsData(count: number, seed: string = 'default'): VitalRecord[] {
  const rng = createSeededRandom(seed + '-vitals');
  const records: VitalRecord[] = [];

  for (let i = 0; i < count; i++) {
    records.push({
      date: formatDate(i * 7),
      systolic: Math.floor(rng() * 30) + 110,
      diastolic: Math.floor(rng() * 20) + 65,
      heartRate: Math.floor(rng() * 30) + 60,
      temperature: Math.round((rng() * 1.5 + 97.5) * 10) / 10,
      oxygenSat: Math.floor(rng() * 4) + 95,
      weight: Math.floor(rng() * 40) + 140,
    });
  }

  return records.reverse();
}

export function generatePrescriptionData(count: number, seed: string = 'default'): PrescriptionRecord[] {
  const rng = createSeededRandom(seed + '-prescriptions');
  const records: PrescriptionRecord[] = [];
  const meds = [
    'Lisinopril', 'Metformin', 'Atorvastatin', 'Amlodipine', 'Omeprazole',
    'Levothyroxine', 'Metoprolol', 'Losartan', 'Gabapentin', 'Sertraline',
    'Warfarin', 'Prednisone', 'Amoxicillin', 'Hydrochlorothiazide', 'Clopidogrel',
  ];
  const dosages = ['5mg', '10mg', '20mg', '25mg', '50mg', '100mg', '250mg', '500mg'];
  const frequencies = ['QD', 'BID', 'TID', 'QID', 'PRN', 'QHS', 'Q8H'];
  const rxStatuses = ['Active', 'Pending Refill', 'Expired', 'Discontinued', 'On Hold'];
  const risks = ['None', 'None', 'None', 'Low', 'Low', 'Moderate', 'High'];

  for (let i = 0; i < count; i++) {
    const firstName = pick(FIRST_NAMES, rng);
    const lastName = pick(LAST_NAMES, rng);
    const prescriberFirst = pick(FIRST_NAMES, rng);
    const prescriberLast = pick(LAST_NAMES, rng);

    records.push({
      id: `RX-${(5000 + i).toString()}`,
      patientName: `${firstName} ${lastName}`,
      medication: pick(meds, rng),
      dosage: pick(dosages, rng),
      frequency: pick(frequencies, rng),
      prescriber: `Dr. ${prescriberFirst} ${prescriberLast}`,
      startDate: formatDate(Math.floor(rng() * 180)),
      refillsRemaining: Math.floor(rng() * 6),
      status: pick(rxStatuses, rng),
      interactionRisk: pick(risks, rng),
    });
  }
  return records;
}

export function generateLabOrderData(count: number, seed: string = 'default'): LabOrderRecord[] {
  const rng = createSeededRandom(seed + '-laborders');
  const records: LabOrderRecord[] = [];
  const tests = [
    'CBC with Differential', 'BMP (Basic Metabolic Panel)', 'Lipid Panel', 'HbA1c',
    'TSH', 'Urinalysis', 'Liver Function Panel', 'Coagulation Panel', 'Vitamin D',
    'Iron Studies', 'PSA', 'Troponin I', 'D-Dimer', 'CRP',
  ];
  const priorities = ['Routine', 'Routine', 'Routine', 'Urgent', 'STAT'];
  const flags = ['Normal', 'Normal', 'Normal', 'High', 'Low', 'Critical'];
  const labStatuses = ['Completed', 'Resulted', 'Pending', 'Processing', 'Ordered'];

  for (let i = 0; i < count; i++) {
    const firstName = pick(FIRST_NAMES, rng);
    const lastName = pick(LAST_NAMES, rng);
    const provFirst = pick(FIRST_NAMES, rng);
    const provLast = pick(LAST_NAMES, rng);
    const daysAgo = Math.floor(rng() * 14);

    records.push({
      id: `LAB-${(6000 + i).toString()}`,
      patientName: `${firstName} ${lastName}`,
      testName: pick(tests, rng),
      orderingProvider: `Dr. ${provFirst} ${provLast}`,
      priority: pick(priorities, rng),
      orderDate: formatDate(daysAgo),
      resultDate: daysAgo > 1 ? formatDate(daysAgo - 1) : '',
      resultFlag: pick(flags, rng),
      status: pick(labStatuses, rng),
    });
  }
  return records;
}

export function generateTriageData(count: number, seed: string = 'default'): TriageRecord[] {
  const rng = createSeededRandom(seed + '-triage');
  const records: TriageRecord[] = [];
  const complaints = [
    'Chest Pain', 'Shortness of Breath', 'Abdominal Pain', 'Headache',
    'Laceration', 'Fall Injury', 'Fever', 'Allergic Reaction', 'Back Pain',
    'Syncope', 'Seizure', 'Altered Mental Status', 'Motor Vehicle Accident',
    'Fracture', 'Nausea/Vomiting',
  ];
  const vitalsFlags = ['Stable', 'Stable', 'Stable', 'Abnormal', 'Critical'];
  const triageStatuses = ['Waiting', 'In Treatment', 'Admitted', 'Discharged', 'Observation'];

  for (let i = 0; i < count; i++) {
    const firstName = pick(FIRST_NAMES, rng);
    const lastName = pick(LAST_NAMES, rng);
    const hour = Math.floor(rng() * 24);
    const minute = Math.floor(rng() * 60);

    records.push({
      id: `ED-${(7000 + i).toString()}`,
      patientName: `${firstName} ${lastName}`,
      chiefComplaint: pick(complaints, rng),
      esiLevel: Math.floor(rng() * 5) + 1,
      arrivalTime: formatTime(hour, minute),
      waitMinutes: Math.floor(rng() * 120) + 5,
      vitalsFlag: pick(vitalsFlags, rng),
      status: pick(triageStatuses, rng),
    });
  }
  return records;
}

export function generateSurgicalCaseData(count: number, seed: string = 'default'): SurgicalCaseRecord[] {
  const rng = createSeededRandom(seed + '-surgical');
  const records: SurgicalCaseRecord[] = [];
  const procedures = [
    'Total Knee Replacement', 'Laparoscopic Cholecystectomy', 'CABG', 'Appendectomy',
    'Rotator Cuff Repair', 'Hernia Repair', 'Spinal Fusion', 'Hip Arthroplasty',
    'Cataract Surgery', 'Thyroidectomy', 'Mastectomy', 'ACL Reconstruction',
  ];
  const orRooms = ['OR-1', 'OR-2', 'OR-3', 'OR-4', 'OR-5', 'OR-6'];
  const anesthesia = ['General', 'General', 'Regional', 'Spinal', 'Local', 'MAC'];
  const durations = ['45 min', '1 hr', '1.5 hr', '2 hr', '2.5 hr', '3 hr', '4 hr'];
  const surgStatuses = ['Scheduled', 'Pre-Op', 'In Progress', 'Recovery', 'Completed', 'Delayed'];

  for (let i = 0; i < count; i++) {
    const firstName = pick(FIRST_NAMES, rng);
    const lastName = pick(LAST_NAMES, rng);
    const surgFirst = pick(FIRST_NAMES, rng);
    const surgLast = pick(LAST_NAMES, rng);
    const hour = Math.floor(rng() * 8) + 7;
    const minute = pick([0, 15, 30], rng);

    records.push({
      id: `SUR-${(8000 + i).toString()}`,
      patientName: `${firstName} ${lastName}`,
      procedure: pick(procedures, rng),
      surgeon: `Dr. ${surgFirst} ${surgLast}`,
      orRoom: pick(orRooms, rng),
      scheduledTime: formatTime(hour, minute),
      estimatedDuration: pick(durations, rng),
      anesthesiaType: pick(anesthesia, rng),
      preOpComplete: rng() > 0.2,
      status: pick(surgStatuses, rng),
    });
  }
  return records;
}

export function generateRehabPlanData(count: number, seed: string = 'default'): RehabPlanRecord[] {
  const rng = createSeededRandom(seed + '-rehab');
  const records: RehabPlanRecord[] = [];
  const diagnoses = [
    'ACL Tear Post-Op', 'Rotator Cuff Injury', 'Lower Back Pain', 'Stroke Recovery',
    'Total Knee Replacement', 'Hip Fracture', 'Carpal Tunnel', 'Ankle Sprain',
    'Cervical Radiculopathy', 'Frozen Shoulder',
  ];
  const planTypes = ['Physical Therapy', 'Occupational Therapy', 'Speech Therapy', 'Cardiac Rehab'];
  const rehabStatuses = ['Active', 'On Track', 'Behind Schedule', 'Completed', 'On Hold'];

  for (let i = 0; i < count; i++) {
    const firstName = pick(FIRST_NAMES, rng);
    const lastName = pick(LAST_NAMES, rng);
    const therapistFirst = pick(FIRST_NAMES, rng);
    const therapistLast = pick(LAST_NAMES, rng);
    const total = Math.floor(rng() * 20) + 8;
    const completed = Math.floor(rng() * total);

    records.push({
      id: `RHB-${(9000 + i).toString()}`,
      patientName: `${firstName} ${lastName}`,
      therapist: `${therapistFirst} ${therapistLast}`,
      diagnosis: pick(diagnoses, rng),
      planType: pick(planTypes, rng),
      progressPercent: Math.floor((completed / total) * 100),
      sessionsCompleted: completed,
      sessionsTotal: total,
      status: pick(rehabStatuses, rng),
    });
  }
  return records;
}

export function generateDischargeCaseData(count: number, seed: string = 'default'): DischargeCaseRecord[] {
  const rng = createSeededRandom(seed + '-Check-out');
  const records: DischargeCaseRecord[] = [];
  const destinations = ['Home', 'Home with Services', 'SNF', 'Rehab Facility', 'LTAC', 'Hospice'];
  const authStatuses = ['Approved', 'Pending', 'Denied', 'Not Required'];
  const dcStatuses = ['Planning', 'Ready', 'Pending Auth', 'Discharged', 'Delayed'];

  for (let i = 0; i < count; i++) {
    const firstName = pick(FIRST_NAMES, rng);
    const lastName = pick(LAST_NAMES, rng);
    const cmFirst = pick(FIRST_NAMES, rng);
    const cmLast = pick(LAST_NAMES, rng);
    const admitDays = Math.floor(rng() * 14) + 1;

    records.push({
      id: `DC-${(10000 + i).toString()}`,
      patientName: `${firstName} ${lastName}`,
      admissionDate: formatDate(admitDays),
      expectedDischarge: formatDate(Math.max(0, admitDays - Math.floor(rng() * 5) - 1)),
      caseManager: `${cmFirst} ${cmLast}`,
      destination: pick(destinations, rng),
      pendingItems: Math.floor(rng() * 5),
      insuranceAuth: pick(authStatuses, rng),
      status: pick(dcStatuses, rng),
    });
  }
  return records;
}

export function generateResearchTrialData(count: number, seed: string = 'default'): ResearchTrialRecord[] {
  const rng = createSeededRandom(seed + '-research');
  const records: ResearchTrialRecord[] = [];
  const titles = [
    'Novel Immunotherapy for Stage III Melanoma',
    'mRNA Vaccine Efficacy in Elderly Populations',
    'AI-Assisted Diabetic Retinopathy Screening',
    'Gene Therapy for Sickle Cell Disease',
    'Wearable Device Cardiac Arrhythmia Detection',
    'Microbiome Impact on Autoimmune Disorders',
    'Targeted Therapy for HER2+ Breast Cancer',
    'Stem Cell Treatment for Spinal Cord Injury',
  ];
  const phases = ['Phase I', 'Phase II', 'Phase III', 'Phase IV'];
  const sponsors = ['NIH', 'Pfizer', 'Novartis', 'Internal', 'Johnson & Johnson', 'AstraZeneca', 'Merck'];
  const trialStatuses = ['Enrolling', 'Active', 'Completed', 'Suspended', 'Analysis'];

  for (let i = 0; i < count; i++) {
    const piFirst = pick(FIRST_NAMES, rng);
    const piLast = pick(LAST_NAMES, rng);
    const target = Math.floor(rng() * 400) + 50;
    const enrolled = Math.floor(rng() * target);

    records.push({
      id: `RES-${(11000 + i).toString()}`,
      trialId: `NCT${(10000000 + Math.floor(rng() * 90000000)).toString()}`,
      title: pick(titles, rng),
      phase: pick(phases, rng),
      principalInvestigator: `Dr. ${piFirst} ${piLast}`,
      enrolled,
      target,
      status: pick(trialStatuses, rng),
      startDate: formatDate(Math.floor(rng() * 365) + 30),
      sponsor: pick(sponsors, rng),
    });
  }
  return records;
}

export function generateImagingOrderData(count: number, seed: string = 'default'): ImagingOrderRecord[] {
  const rng = createSeededRandom(seed + '-imaging');
  const records: ImagingOrderRecord[] = [];
  const modalities = ['X-Ray', 'CT', 'MRI', 'Ultrasound', 'PET', 'Mammography', 'Fluoroscopy'];
  const bodyParts = [
    'Chest', 'Abdomen', 'Brain', 'Spine', 'Knee', 'Shoulder', 'Hip',
    'Pelvis', 'Ankle', 'Wrist', 'Neck', 'Lumbar Spine',
  ];
  const imgPriorities = ['Routine', 'Routine', 'Urgent', 'STAT'];
  const reportStatuses = ['Final', 'Preliminary', 'Pending', 'Addendum'];
  const imgStatuses = ['Completed', 'Scheduled', 'In Progress', 'Ordered'];

  for (let i = 0; i < count; i++) {
    const firstName = pick(FIRST_NAMES, rng);
    const lastName = pick(LAST_NAMES, rng);
    const provFirst = pick(FIRST_NAMES, rng);
    const provLast = pick(LAST_NAMES, rng);
    const radFirst = pick(FIRST_NAMES, rng);
    const radLast = pick(LAST_NAMES, rng);

    records.push({
      id: `IMG-${(12000 + i).toString()}`,
      patientName: `${firstName} ${lastName}`,
      modality: pick(modalities, rng),
      bodyPart: pick(bodyParts, rng),
      orderingProvider: `Dr. ${provFirst} ${provLast}`,
      radiologist: `Dr. ${radFirst} ${radLast}`,
      priority: pick(imgPriorities, rng),
      reportStatus: pick(reportStatuses, rng),
      status: pick(imgStatuses, rng),
    });
  }
  return records;
}

// ============ NEW DATA INTERFACES & GENERATORS ============

export interface ICUBedRecord {
  id: string;
  bedNumber: string;
  patientName: string;
  diagnosis: string;
  ventilator: boolean;
  ventMode: string;
  heartRate: number;
  bp: string;
  oxygenSat: number;
  temperature: number;
  esiLevel: number;
  nurseName: string;
  admitDate: string;
  status: string;
}

export interface PharmacyItemRecord {
  id: string;
  medication: string;
  ndc: string;
  category: string;
  stockLevel: number;
  parLevel: number;
  expirationDate: string;
  location: string;
  controlledSchedule: string;
  lastDispensed: string;
  status: string;
}

export interface StaffScheduleRecord {
  id: string;
  staffName: string;
  role: string;
  unit: string;
  shiftType: string;
  shiftStart: string;
  shiftEnd: string;
  onCall: boolean;
  overtime: boolean;
  status: string;
}

export interface PopulationHealthRecord {
  id: string;
  condition: string;
  cohortSize: number;
  riskLevel: string;
  prevalence: number;
  trend: string;
  interventions: number;
  lastUpdated: string;
}

export interface MaternityRecord {
  id: string;
  patientName: string;
  gestationalWeeks: number;
  gravida: number;
  para: number;
  riskLevel: string;
  nextVisit: string;
  provider: string;
  status: string;
}

export interface OncologyRecord {
  id: string;
  patientName: string;
  cancerType: string;
  stage: string;
  regimen: string;
  cycleNumber: number;
  totalCycles: number;
  nextTreatment: string;
  responseStatus: string;
  status: string;
}

export interface HomeVisitRecord {
  id: string;
  patientName: string;
  address: string;
  visitType: string;
  clinician: string;
  scheduledTime: string;
  duration: string;
  priority: string;
  lastVisit: string;
  status: string;
}

export interface DentalRecord {
  id: string;
  patientName: string;
  procedure: string;
  toothNumber: string;
  surface: string;
  provider: string;
  date: string;
  insurance: string;
  status: string;
}

export interface InventoryItemRecord {
  id: string;
  itemName: string;
  sku: string;
  category: string;
  quantity: number;
  parLevel: number;
  unitCost: number;
  location: string;
  expirationDate: string;
  lastOrdered: string;
  status: string;
}

export function generateICUBedData(count: number, seed: string = 'default'): ICUBedRecord[] {
  const rng = createSeededRandom(seed + '-icu');
  const records: ICUBedRecord[] = [];
  const icuDiagnoses = [
    'Septic Shock', 'ARDS', 'Status Epilepticus', 'STEMI', 'Respiratory Failure',
    'Hemorrhagic Stroke', 'Pulmonary Embolism', 'DKA', 'Multi-Organ Failure',
    'Post-Cardiac Arrest', 'Acute Liver Failure', 'Severe Pneumonia',
  ];
  const ventModes = ['AC/VC', 'SIMV', 'PS/CPAP', 'PRVC', 'BiPAP', 'None'];
  const icuStatuses = ['Critical', 'Stable', 'Improving', 'Worsening', 'Step-Down Ready'];

  for (let i = 0; i < count; i++) {
    const firstName = pick(FIRST_NAMES, rng);
    const lastName = pick(LAST_NAMES, rng);
    const nurseFirst = pick(FIRST_NAMES, rng);
    const nurseLast = pick(LAST_NAMES, rng);
    const isVented = rng() > 0.4;

    records.push({
      id: `ICU-${(13000 + i).toString()}`,
      bedNumber: `ICU-${(i + 1).toString().padStart(2, '0')}`,
      patientName: `${firstName} ${lastName}`,
      diagnosis: pick(icuDiagnoses, rng),
      ventilator: isVented,
      ventMode: isVented ? pick(ventModes.slice(0, 5), rng) : 'None',
      heartRate: Math.floor(rng() * 60) + 55,
      bp: `${Math.floor(rng() * 50) + 90}/${Math.floor(rng() * 30) + 50}`,
      oxygenSat: Math.floor(rng() * 8) + 90,
      temperature: Math.round((rng() * 3 + 97) * 10) / 10,
      esiLevel: Math.floor(rng() * 3) + 1,
      nurseName: `${nurseFirst} ${nurseLast}`,
      admitDate: formatDate(Math.floor(rng() * 14) + 1),
      status: pick(icuStatuses, rng),
    });
  }
  return records;
}

export function generatePharmacyData(count: number, seed: string = 'default'): PharmacyItemRecord[] {
  const rng = createSeededRandom(seed + '-pharmacy');
  const records: PharmacyItemRecord[] = [];
  const meds = [
    'Morphine Sulfate 10mg', 'Fentanyl 50mcg', 'Heparin 5000U', 'Vancomycin 1g',
    'Norepinephrine 4mg', 'Insulin Lispro 100U', 'Ceftriaxone 1g', 'Propofol 200mg',
    'Amoxicillin 500mg', 'Azithromycin 250mg', 'Ondansetron 4mg', 'Ketorolac 30mg',
    'Pantoprazole 40mg', 'Epinephrine 1mg', 'Midazolam 5mg', 'Dexmedetomidine 200mcg',
  ];
  const categories = ['Analgesic', 'Antibiotic', 'Anticoagulant', 'Cardiovascular', 'Sedative', 'Anti-emetic', 'PPI', 'Emergency'];
  const locations = ['Main Pharmacy', 'Satellite A', 'Satellite B', 'OR Pharmacy', 'ED Pyxis'];
  const schedules = ['None', 'None', 'None', 'Schedule II', 'Schedule III', 'Schedule IV'];
  const pharmStatuses = ['In Stock', 'Low Stock', 'Critical Low', 'On Order', 'Expired'];

  for (let i = 0; i < count; i++) {
    const parLevel = Math.floor(rng() * 200) + 50;
    const stockLevel = Math.floor(rng() * parLevel * 1.5);

    records.push({
      id: `PHR-${(14000 + i).toString()}`,
      medication: pick(meds, rng),
      ndc: `${Math.floor(rng() * 90000) + 10000}-${Math.floor(rng() * 9000) + 1000}-${Math.floor(rng() * 90) + 10}`,
      category: pick(categories, rng),
      stockLevel,
      parLevel,
      expirationDate: formatDate(-(Math.floor(rng() * 365) + 30)),
      location: pick(locations, rng),
      controlledSchedule: pick(schedules, rng),
      lastDispensed: formatDate(Math.floor(rng() * 7)),
      status: stockLevel < parLevel * 0.2 ? 'Critical Low' : stockLevel < parLevel * 0.5 ? 'Low Stock' : pick(pharmStatuses.slice(0, 1), rng),
    });
  }
  return records;
}

export function generateStaffScheduleData(count: number, seed: string = 'default'): StaffScheduleRecord[] {
  const rng = createSeededRandom(seed + '-staffsched');
  const records: StaffScheduleRecord[] = [];
  const roles = ['RN', 'LPN', 'CNA', 'RT', 'MD', 'PA', 'NP', 'Charge RN'];
  const units = ['ICU', 'Med-Surg', 'ED', 'OR', 'L&D', 'Telemetry', 'Pediatrics', 'Oncology'];
  const shifts = ['Day (7a-7p)', 'Night (7p-7a)', 'Day (7a-3p)', 'Evening (3p-11p)', 'Night (11p-7a)'];
  const schedStatuses = ['Confirmed', 'Pending', 'Called Off', 'Overtime', 'On Leave'];

  for (let i = 0; i < count; i++) {
    const firstName = pick(FIRST_NAMES, rng);
    const lastName = pick(LAST_NAMES, rng);
    const shift = pick(shifts, rng);

    records.push({
      id: `SCH-${(15000 + i).toString()}`,
      staffName: `${firstName} ${lastName}`,
      role: pick(roles, rng),
      unit: pick(units, rng),
      shiftType: shift,
      shiftStart: shift.includes('7a') ? '07:00' : shift.includes('3p') ? '15:00' : shift.includes('11p') ? '23:00' : '19:00',
      shiftEnd: shift.includes('7p') ? '19:00' : shift.includes('3p') ? '15:00' : shift.includes('7a') ? '07:00' : '23:00',
      onCall: rng() > 0.8,
      overtime: rng() > 0.85,
      status: pick(schedStatuses, rng),
    });
  }
  return records;
}

export function generatePopulationHealthData(count: number, seed: string = 'default'): PopulationHealthRecord[] {
  const rng = createSeededRandom(seed + '-pophealth');
  const records: PopulationHealthRecord[] = [];
  const conditions = [
    'Diabetes Mellitus', 'Hypertension', 'COPD', 'Asthma', 'Heart Failure',
    'Obesity', 'Depression', 'Chronic Kidney Disease', 'HIV/AIDS', 'Influenza',
    'COVID-19', 'Tuberculosis',
  ];
  const riskLevels = ['Low', 'Moderate', 'High', 'Critical'];
  const trends = ['Increasing', 'Decreasing', 'Stable', 'Seasonal'];

  for (let i = 0; i < count; i++) {
    records.push({
      id: `PH-${(16000 + i).toString()}`,
      condition: pick(conditions, rng),
      cohortSize: Math.floor(rng() * 5000) + 200,
      riskLevel: pick(riskLevels, rng),
      prevalence: Math.round(rng() * 15 * 10) / 10,
      trend: pick(trends, rng),
      interventions: Math.floor(rng() * 10) + 1,
      lastUpdated: formatDate(Math.floor(rng() * 30)),
    });
  }
  return records;
}

export function generateMaternityData(count: number, seed: string = 'default'): MaternityRecord[] {
  const rng = createSeededRandom(seed + '-maternity');
  const records: MaternityRecord[] = [];
  const riskLevels = ['Low', 'Low', 'Moderate', 'High'];
  const matStatuses = ['Active', 'Postpartum', 'Labor', 'Scheduled C-Section', 'High-Risk Monitoring'];

  for (let i = 0; i < count; i++) {
    const firstName = pick(FIRST_NAMES, rng);
    const lastName = pick(LAST_NAMES, rng);
    const provFirst = pick(FIRST_NAMES, rng);
    const provLast = pick(LAST_NAMES, rng);

    records.push({
      id: `MAT-${(17000 + i).toString()}`,
      patientName: `${firstName} ${lastName}`,
      gestationalWeeks: Math.floor(rng() * 32) + 8,
      gravida: Math.floor(rng() * 4) + 1,
      para: Math.floor(rng() * 3),
      riskLevel: pick(riskLevels, rng),
      nextVisit: formatDate(-(Math.floor(rng() * 14) + 1)),
      provider: `Dr. ${provFirst} ${provLast}`,
      status: pick(matStatuses, rng),
    });
  }
  return records;
}

export function generateOncologyData(count: number, seed: string = 'default'): OncologyRecord[] {
  const rng = createSeededRandom(seed + '-oncology');
  const records: OncologyRecord[] = [];
  const cancerTypes = [
    'Breast Cancer', 'Lung Cancer', 'Colorectal Cancer', 'Prostate Cancer',
    'Lymphoma', 'Leukemia', 'Melanoma', 'Pancreatic Cancer', 'Ovarian Cancer',
    'Bladder Cancer',
  ];
  const stages = ['I', 'II', 'IIA', 'IIB', 'III', 'IIIA', 'IV'];
  const regimens = [
    'FOLFOX', 'AC-T', 'R-CHOP', 'Carboplatin/Paclitaxel', 'ABVD',
    'Pembrolizumab', 'Nivolumab + Ipilimumab', 'Gemcitabine/Cisplatin',
  ];
  const responses = ['Complete Response', 'Partial Response', 'Stable Disease', 'Progressive Disease', 'Pending Assessment'];
  const oncStatuses = ['Active Treatment', 'On Cycle', 'Between Cycles', 'Follow-Up', 'Remission'];

  for (let i = 0; i < count; i++) {
    const firstName = pick(FIRST_NAMES, rng);
    const lastName = pick(LAST_NAMES, rng);
    const totalCycles = Math.floor(rng() * 8) + 4;

    records.push({
      id: `ONC-${(18000 + i).toString()}`,
      patientName: `${firstName} ${lastName}`,
      cancerType: pick(cancerTypes, rng),
      stage: pick(stages, rng),
      regimen: pick(regimens, rng),
      cycleNumber: Math.floor(rng() * totalCycles) + 1,
      totalCycles,
      nextTreatment: formatDate(-(Math.floor(rng() * 21) + 1)),
      responseStatus: pick(responses, rng),
      status: pick(oncStatuses, rng),
    });
  }
  return records;
}

export function generateHomeVisitData(count: number, seed: string = 'default'): HomeVisitRecord[] {
  const rng = createSeededRandom(seed + '-homevisit');
  const records: HomeVisitRecord[] = [];
  const visitTypes = ['Skilled Nursing', 'Physical Therapy', 'Wound Care', 'Hospice Check-In', 'Med Management', 'Assessment'];
  const priorities = ['Routine', 'Routine', 'Urgent', 'Priority'];
  const durations = ['30 min', '45 min', '60 min', '90 min'];
  const hvStatuses = ['Scheduled', 'In Transit', 'In Progress', 'Completed', 'Rescheduled'];

  for (let i = 0; i < count; i++) {
    const firstName = pick(FIRST_NAMES, rng);
    const lastName = pick(LAST_NAMES, rng);
    const clinFirst = pick(FIRST_NAMES, rng);
    const clinLast = pick(LAST_NAMES, rng);
    const hour = Math.floor(rng() * 8) + 8;

    records.push({
      id: `HV-${(19000 + i).toString()}`,
      patientName: `${firstName} ${lastName}`,
      address: `${Math.floor(rng() * 9000) + 100} ${pick(['Oak', 'Maple', 'Elm', 'Pine', 'Cedar'], rng)} ${pick(['St', 'Ave', 'Dr', 'Ln', 'Ct'], rng)}`,
      visitType: pick(visitTypes, rng),
      clinician: `${clinFirst} ${clinLast}`,
      scheduledTime: formatTime(hour, pick([0, 15, 30, 45], rng)),
      duration: pick(durations, rng),
      priority: pick(priorities, rng),
      lastVisit: formatDate(Math.floor(rng() * 14) + 1),
      status: pick(hvStatuses, rng),
    });
  }
  return records;
}

export function generateDentalData(count: number, seed: string = 'default'): DentalRecord[] {
  const rng = createSeededRandom(seed + '-dental');
  const records: DentalRecord[] = [];
  const procedures = [
    'Prophylaxis (Cleaning)', 'Composite Filling', 'Crown Prep', 'Root Canal',
    'Extraction', 'Scaling & Root Planing', 'Sealant', 'Whitening',
    'Periodontal Exam', 'Implant Placement', 'Bridge', 'Denture Adjustment',
  ];
  const surfaces = ['O', 'MOD', 'DO', 'MO', 'B', 'L', 'Full', 'N/A'];
  const dentalStatuses = ['Completed', 'Scheduled', 'In Progress', 'Treatment Planned', 'Cancelled'];

  for (let i = 0; i < count; i++) {
    const firstName = pick(FIRST_NAMES, rng);
    const lastName = pick(LAST_NAMES, rng);
    const provFirst = pick(FIRST_NAMES, rng);
    const provLast = pick(LAST_NAMES, rng);

    records.push({
      id: `DNT-${(20000 + i).toString()}`,
      patientName: `${firstName} ${lastName}`,
      procedure: pick(procedures, rng),
      toothNumber: `#${Math.floor(rng() * 32) + 1}`,
      surface: pick(surfaces, rng),
      provider: `Dr. ${provFirst} ${provLast}`,
      date: formatDate(Math.floor(rng() * 30)),
      insurance: pick(INSURANCE_PROVIDERS, rng),
      status: pick(dentalStatuses, rng),
    });
  }
  return records;
}

export function generateInventoryData(count: number, seed: string = 'default'): InventoryItemRecord[] {
  const rng = createSeededRandom(seed + '-inventory');
  const records: InventoryItemRecord[] = [];
  const items = [
    'Surgical Gloves (M)', 'IV Start Kit', 'Foley Catheter 16Fr', 'N95 Respirator',
    'Pulse Oximeter Sensor', 'Blood Collection Tube (Purple)', 'Gauze Pads 4x4',
    'Suture Kit 3-0 Vicryl', 'Sterile Saline 1L', 'Syringe 10mL',
    'Central Line Kit', 'Chest Tube 28Fr', 'Ventilator Circuit', 'Infusion Pump Tubing',
    'Wound VAC Dressing', 'Oxygen Nasal Cannula',
  ];
  const categories = ['PPE', 'IV Supplies', 'Surgical', 'Diagnostic', 'Respiratory', 'Wound Care', 'General'];
  const locations = ['Central Supply', 'OR Storage', 'ED Supply', 'ICU Supply', 'Floor Stock'];
  for (let i = 0; i < count; i++) {
    const parLevel = Math.floor(rng() * 500) + 50;
    const quantity = Math.floor(rng() * parLevel * 1.5);

    records.push({
      id: `INV-${(21000 + i).toString()}`,
      itemName: pick(items, rng),
      sku: `SKU-${Math.floor(rng() * 90000) + 10000}`,
      category: pick(categories, rng),
      quantity,
      parLevel,
      unitCost: Math.round((rng() * 100 + 0.5) * 100) / 100,
      location: pick(locations, rng),
      expirationDate: formatDate(-(Math.floor(rng() * 365) + 30)),
      lastOrdered: formatDate(Math.floor(rng() * 30)),
      status: quantity < parLevel * 0.15 ? 'Critical' : quantity < parLevel * 0.4 ? 'Low Stock' : 'In Stock',
    });
  }
  return records;
}

// ============ UNIVERSAL PAGE DATA INTERFACES & GENERATORS ============

export interface NotificationRecord {
  id: string;
  title: string;
  message: string;
  category: 'clinical' | 'system' | 'administrative';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  read: boolean;
  timeAgo: string;
  actionLabel?: string;
}

export interface ActivityRecord {
  id: string;
  type: string;
  description: string;
  user: string;
  timeAgo: string;
  icon: string;
}

export interface FAQRecord {
  id: string;
  question: string;
  answer: string;
  category: string;
}

export interface ProfileData {
  displayName: string;
  role: string;
  department: string;
  email: string;
  phone: string;
  employeeId: string;
  licenseNumber: string;
  npi: string;
  certifications: { name: string; expiry: string; status: string }[];
  stats: { label: string; value: number }[];
}

export function generateNotificationData(count: number, seed: string = 'default'): NotificationRecord[] {
  const rng = createSeededRandom(seed + '-notifications');
  const records: NotificationRecord[] = [];

  const clinicalTitles = [
    'Lab Results Available', 'Care Recipient Vitals Alert', 'Medication Interaction Warning',
    'Check-out Summary Ready', 'New Referral Received', 'Critical Lab Value',
  ];
  const clinicalMessages = [
    'CBC results for Care Recipient MRN-284751 are now available for review.',
    'Heart rate elevated above threshold for ICU bed 04.',
    'Potential interaction detected between Warfarin and new prescription.',
    'Check-out summary for Sofia Rodriguez has been completed.',
    'New cardiology referral from Dr. James Williams pending review.',
    'Potassium level critically low (2.8 mEq/L) for Care Recipient in Room 312.',
  ];
  const systemTitles = [
    'System Maintenance Scheduled', 'Software Update Available', 'Backup Completed',
    'Security Patch Applied', 'Server Performance Alert', 'Database Optimization Complete',
  ];
  const systemMessages = [
    'Planned maintenance window: Saturday 2:00 AM - 4:00 AM EST.',
    'Version 3.2.1 is available with improved telehealth features.',
    'Nightly backup completed successfully. All data secured.',
    'Critical security patch CVE-2026-1234 has been applied.',
    'API response times elevated. Engineering team investigating.',
    'Database indexes optimized. Query performance improved by 40%.',
  ];
  const adminTitles = [
    'New Policy Update', 'Staff Meeting Reminder', 'Credential Renewal Due',
    'Compliance Training Required', 'Schedule Change Notification', 'Department Budget Review',
  ];
  const adminMessages = [
    'Updated infection control policy effective immediately. Please review.',
    'Monthly department meeting tomorrow at 10:00 AM in Conference Room B.',
    'Your medical license renewal is due in 30 days.',
    'Annual HIPAA compliance training must be completed by end of month.',
    'Your shift on Friday has been changed from Day to Evening.',
    'Q1 budget review meeting scheduled for next Tuesday.',
  ];

  const timeAgos = [
    '2 min ago', '5 min ago', '12 min ago', '28 min ago', '1 hr ago',
    '2 hrs ago', '3 hrs ago', '5 hrs ago', '8 hrs ago', '1 day ago',
    '2 days ago', '3 days ago',
  ];
  const priorities: Array<'low' | 'medium' | 'high' | 'urgent'> = ['low', 'medium', 'high', 'urgent'];
  const categories: Array<'clinical' | 'system' | 'administrative'> = ['clinical', 'system', 'administrative'];

  for (let i = 0; i < count; i++) {
    const category = pick(categories, rng);
    let title: string;
    let message: string;
    if (category === 'clinical') {
      const idx = Math.floor(rng() * clinicalTitles.length);
      title = clinicalTitles[idx];
      message = clinicalMessages[idx];
    } else if (category === 'system') {
      const idx = Math.floor(rng() * systemTitles.length);
      title = systemTitles[idx];
      message = systemMessages[idx];
    } else {
      const idx = Math.floor(rng() * adminTitles.length);
      title = adminTitles[idx];
      message = adminMessages[idx];
    }

    records.push({
      id: `NOTIF-${(30000 + i).toString()}`,
      title,
      message,
      category,
      priority: pick(priorities, rng),
      read: rng() > 0.4,
      timeAgo: timeAgos[Math.min(i, timeAgos.length - 1)],
      actionLabel: rng() > 0.5 ? pick(['View', 'Review', 'Acknowledge', 'Open'], rng) : undefined,
    });
  }
  return records;
}

export function generateRecentActivityData(count: number, seed: string = 'default', features?: string[]): ActivityRecord[] {
  const rng = createSeededRandom(seed + '-activity');
  const records: ActivityRecord[] = [];

  const WELLNESS_FEATURES = ['activity_tracking', 'sleep_tracking', 'fitness_workouts', 'health_score', 'nutrition_tracking', 'mood_tracking', 'water_intake', 'step_counter', 'calorie_tracking', 'body_measurements', 'health_goals'];
  const isWellness = features && features.some(f => WELLNESS_FEATURES.includes(f));

  const clinicalActivities = [
    { type: 'check-in', desc: 'Care Recipient check-in completed', icon: 'people' },
    { type: 'lab', desc: 'Lab results reviewed and signed', icon: 'lab' },
    { type: 'message', desc: 'Secure message sent to Care Recipient', icon: 'care' },
    { type: 'appointment', desc: 'Booking scheduled', icon: 'calendar' },
    { type: 'prescription', desc: 'Prescription renewed', icon: 'prescription' },
    { type: 'record', desc: 'Care Recipient record updated', icon: 'medical' },
    { type: 'discharge', desc: 'Check-out summary finalized', icon: 'care' },
    { type: 'referral', desc: 'Referral submitted', icon: 'people' },
    { type: 'vitals', desc: 'Vitals recorded', icon: 'emergency' },
    { type: 'billing', desc: 'Billing code submitted', icon: 'dollar' },
  ];

  const wellnessActivities = [
    { type: 'workout', desc: 'Workout completed', icon: 'rehab' },
    { type: 'meal', desc: 'Meal logged', icon: 'calendar' },
    { type: 'sleep', desc: 'Sleep tracked', icon: 'calendar' },
    { type: 'water', desc: 'Water goal reached', icon: 'chart' },
    { type: 'steps', desc: 'Steps goal reached', icon: 'rehab' },
    { type: 'mood', desc: 'Mood check-in completed', icon: 'people' },
    { type: 'weight', desc: 'Weight logged', icon: 'chart' },
    { type: 'goal', desc: 'Health goal milestone reached', icon: 'shield' },
    { type: 'heart-rate', desc: 'Heart rate zone session', icon: 'emergency' },
    { type: 'mindfulness', desc: 'Mindfulness session completed', icon: 'care' },
  ];

  const activities = isWellness ? wellnessActivities : clinicalActivities;

  const timeAgos = [
    '3 min ago', '8 min ago', '15 min ago', '32 min ago',
    '1 hr ago', '1.5 hrs ago', '2 hrs ago', '3 hrs ago',
    '4 hrs ago', '6 hrs ago',
  ];

  for (let i = 0; i < count; i++) {
    const activity = pick(activities, rng);
    const firstName = pick(FIRST_NAMES, rng);
    const lastName = pick(LAST_NAMES, rng);
    records.push({
      id: `ACT-${(31000 + i).toString()}`,
      type: activity.type,
      description: isWellness ? activity.desc : `${activity.desc} — ${firstName} ${lastName}`,
      user: `${firstName} ${lastName}`,
      timeAgo: timeAgos[Math.min(i, timeAgos.length - 1)],
      icon: activity.icon,
    });
  }
  return records;
}

export function generateFAQData(seed: string = 'default'): FAQRecord[] {
  // FAQs are static but we use seed for consistent ordering
  const _rng = createSeededRandom(seed + '-faq');
  return [
    {
      id: 'faq-1',
      question: 'How do I reset my password?',
      answer: 'Navigate to the login page and click "Forgot Password". Enter your registered email address, and a reset link will be sent. The link expires after 24 hours. For security, you\'ll need to create a password that meets our complexity requirements.',
      category: 'Account',
    },
    {
      id: 'faq-2',
      question: 'How is Care Recipient data protected?',
      answer: 'All Care Recipient data is encrypted at rest using AES-256 and in transit using TLS 1.3. We maintain HIPAA compliance through role-based access controls, audit logging, automatic session timeouts, and regular security assessments. Data is stored in SOC 2 Type II certified facilities.',
      category: 'Security',
    },
    {
      id: 'faq-3',
      question: 'Can I access the system on mobile devices?',
      answer: 'Yes, the platform is fully responsive and supports iOS and Android devices through our progressive web app. You can also download our native apps from the App Store and Google Play for enhanced features like push notifications and biometric authentication.',
      category: 'Access',
    },
    {
      id: 'faq-4',
      question: 'How do I submit a prescription electronically?',
      answer: 'Navigate to the Care Recipient\'s chart, click "New Prescription", search for the medication, set dosage and frequency, then click "Send to Pharmacy". The system performs automatic drug interaction checks and formulary verification before submission.',
      category: 'Clinical',
    },
    {
      id: 'faq-5',
      question: 'What should I do if the system is slow or unresponsive?',
      answer: 'First, check the System Status page for any known outages. Try clearing your browser cache and refreshing. If the issue persists, check your internet connection and try a different browser. Contact IT support if problems continue — include your browser version and any error messages.',
      category: 'Technical',
    },
    {
      id: 'faq-6',
      question: 'How do I generate compliance reports?',
      answer: 'Go to Settings > Compliance > Reports. Select the report type (HIPAA audit, access log, incident report), date range, and scope. Reports can be exported as PDF or CSV. Automated monthly reports can be configured under Report Scheduling.',
      category: 'Compliance',
    },
  ];
}

export function generateProfileData(displayName: string, userRole: string, seed: string = 'default'): ProfileData {
  const rng = createSeededRandom(seed + '-profile');
  const nameParts = displayName.split(' ');
  const firstName = nameParts[0] || 'Sarah';
  const lastName = nameParts.length > 1 ? nameParts[nameParts.length - 1] : 'Chen';

  const certifications = [
    { name: 'Board Certification — Internal Medicine', expiry: formatDate(-(Math.floor(rng() * 365) + 180)), status: 'Valid' },
    { name: 'BLS/ACLS Certification', expiry: formatDate(-(Math.floor(rng() * 90) + 30)), status: rng() > 0.3 ? 'Valid' : 'Renewal Due' },
    { name: 'DEA Registration', expiry: formatDate(-(Math.floor(rng() * 365) + 60)), status: 'Valid' },
    { name: 'State Medical License', expiry: formatDate(-(Math.floor(rng() * 200) + 30)), status: rng() > 0.2 ? 'Valid' : 'Renewal Due' },
  ];

  return {
    displayName,
    role: userRole,
    department: pick(DEPARTMENTS, rng),
    email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@healthcare.org`,
    phone: `(${Math.floor(rng() * 900) + 100}) ${Math.floor(rng() * 900) + 100}-${Math.floor(rng() * 9000) + 1000}`,
    employeeId: `EMP-${Math.floor(rng() * 9000) + 1000}`,
    licenseNumber: `ML-${Math.floor(rng() * 900000) + 100000}`,
    npi: `${Math.floor(rng() * 9000000000) + 1000000000}`,
    certifications,
    stats: [
      { label: 'Care Recipients Managed', value: Math.floor(rng() * 200) + 50 },
      { label: 'Bookings This Month', value: Math.floor(rng() * 40) + 10 },
      { label: 'Documents Reviewed', value: Math.floor(rng() * 100) + 20 },
      { label: 'Messages Sent', value: Math.floor(rng() * 80) + 15 },
    ],
  };
}

export function generateKPIData(
  features: string[] = [],
  _stakeholders: string[] = [],
  seed: string = 'default'
): { label: string; value: string; change: string; changeType: 'up' | 'down' | 'neutral'; icon: string }[] {
  const rng = createSeededRandom(seed + '-kpi');
  const kpis: { label: string; value: string; change: string; changeType: 'up' | 'down' | 'neutral'; icon: string }[] = [];

  // KPI_CONFIGS imported at top of file

  for (const kc of KPI_CONFIGS) {
    if (kc.alwaysShow || kc.triggerFeatures.some((f: string) => features.includes(f))) {
      const val = kc.valueMin + Math.floor(rng() * (kc.valueMax - kc.valueMin));
      const change = kc.changeMin + Math.floor(rng() * (kc.changeMax - kc.changeMin));
      kpis.push({
        label: kc.label,
        value: kc.valueFormat.replace('{v}', val.toLocaleString()),
        change: kc.changeFormat.replace('{v}', change.toString()),
        changeType: kc.changeType,
        icon: kc.icon,
      });
    }
  }

  // Ensure at least 4 cards
  while (kpis.length < 4) {
    kpis.push({
      label: 'Active Users',
      value: (Math.floor(rng() * 100) + 30).toString(),
      change: `+${Math.floor(rng() * 10) + 2}%`,
      changeType: 'up',
      icon: 'users',
    });
  }

  return kpis.slice(0, 4);
}

// ── Storefront / E-Commerce Data Generators ──────────────────────────

const MEDICINE_NAMES = [
  'Dolo 650', 'Crocin Advance', 'Azithromycin 500mg', 'Amoxicillin 250mg',
  'Paracetamol 500mg', 'Cetirizine 10mg', 'Pantoprazole 40mg', 'Metformin 500mg',
  'Atorvastatin 20mg', 'Omeprazole 20mg', 'Vitamin D3 60K', 'Calcium + D3',
  'Multivitamin Daily', 'Omega-3 Fish Oil', 'Zinc 50mg', 'Iron Folic Acid',
  'Cough Syrup', 'Antacid Gel', 'Betadine Solution', 'Band-Aid Strips',
  'Digital Thermometer', 'Pulse Oximeter', 'BP Monitor', 'Glucometer Strips',
];

const MEDICINE_CATEGORIES = [
  'Prescription Medicines', 'OTC Medicines', 'Health Supplements',
  'Personal Care', 'Baby Care', 'Medical Devices', 'Ayurvedic',
  'Diabetes Care', 'Heart Care', 'Skin Care',
];

const MEDICINE_BRANDS = [
  'Cipla', 'Sun Pharma', 'Dr. Reddy\'s', 'Lupin', 'Zydus', 'Abbott',
  'Mankind', 'Torrent', 'Alkem', 'Glenmark', 'Himalaya', 'Dabur',
];

export interface ProductRecord {
  id: string;
  name: string;
  brand: string;
  category: string;
  price: number;
  mrp: number;
  discount: number;
  rating: number;
  reviews: number;
  inStock: boolean;
  prescriptionRequired: boolean;
  image: string;
}

export interface CartItemRecord {
  product: ProductRecord;
  quantity: number;
}

export interface OrderRecord {
  id: string;
  orderNumber: string;
  date: string;
  items: Array<{ name: string; qty: number; price: number }>;
  total: number;
  status: 'placed' | 'confirmed' | 'packed' | 'shipped' | 'delivered';
  deliveryDate: string;
  address: string;
  paymentMethod: string;
}

export interface StorefrontData {
  products: ProductRecord[];
  categories: string[];
  cartItems: CartItemRecord[];
  offers: Array<{ title: string; description: string; discount: string }>;
  orders: OrderRecord[];
}

export function generateStorefrontData(count: number, seed: string = 'default'): StorefrontData {
  const rng = createSeededRandom(seed);
  const pick = <T>(arr: T[]): T => arr[Math.floor(rng() * arr.length)];
  const pickN = (min: number, max: number) => Math.floor(rng() * (max - min + 1)) + min;

  const products: ProductRecord[] = [];
  for (let i = 0; i < count; i++) {
    const mrp = pickN(20, 1500);
    const discountPct = pickN(0, 30);
    const price = Math.round(mrp * (1 - discountPct / 100));
    products.push({
      id: `PRD-${1000 + i}`,
      name: MEDICINE_NAMES[i % MEDICINE_NAMES.length],
      brand: pick(MEDICINE_BRANDS),
      category: pick(MEDICINE_CATEGORIES),
      price,
      mrp,
      discount: discountPct,
      rating: Math.round((3.5 + rng() * 1.5) * 10) / 10,
      reviews: pickN(10, 5000),
      inStock: rng() > 0.15,
      prescriptionRequired: rng() > 0.6,
      image: '',
    });
  }

  const cartItems: CartItemRecord[] = products.slice(0, pickN(2, 5)).map(p => ({
    product: p,
    quantity: pickN(1, 3),
  }));

  const statuses: OrderRecord['status'][] = ['placed', 'confirmed', 'packed', 'shipped', 'delivered'];
  const payments = ['UPI', 'Credit Card', 'Debit Card', 'Net Banking', 'Cash on Delivery', 'Wallet'];
  const addresses = [
    '42, MG Road, Bangalore 560001',
    '15, Linking Road, Mumbai 400050',
    '8, Connaught Place, New Delhi 110001',
    '23, Park Street, Kolkata 700016',
  ];

  const orders: OrderRecord[] = [];
  for (let i = 0; i < 5; i++) {
    const itemCount = pickN(1, 4);
    const items = products.slice(i * 3, i * 3 + itemCount).map(p => ({
      name: p.name, qty: pickN(1, 2), price: p.price,
    }));
    const total = items.reduce((s, it) => s + it.price * it.qty, 0);
    orders.push({
      id: `ORD-${2000 + i}`,
      orderNumber: `#VC${pickN(100000, 999999)}`,
      date: `2026-03-${String(pickN(1, 28)).padStart(2, '0')}`,
      items,
      total,
      status: statuses[i % statuses.length],
      deliveryDate: `2026-04-${String(pickN(1, 15)).padStart(2, '0')}`,
      address: pick(addresses),
      paymentMethod: pick(payments),
    });
  }

  const offers = [
    { title: 'Flat 20% OFF', description: 'On first order above ₹500', discount: '20%' },
    { title: 'Free Delivery', description: 'On orders above ₹299', discount: 'FREE' },
    { title: 'Health Combo', description: 'Vitamins + Supplements pack', discount: '15%' },
  ];

  return {
    products,
    categories: MEDICINE_CATEGORIES,
    cartItems,
    offers,
    orders,
  };
}

// ── Booking / Service Catalog Data Generators ────────────────────────

const TEST_NAMES = [
  'Complete Blood Count (CBC)', 'Thyroid Profile (T3, T4, TSH)', 'Lipid Profile',
  'Liver Function Test', 'Kidney Function Test', 'HbA1c (Diabetes)',
  'Vitamin D Test', 'Vitamin B12 Test', 'Iron Studies', 'Urine Routine',
  'Blood Sugar Fasting', 'CRP (C-Reactive Protein)', 'ESR Test',
  'Calcium Test', 'Uric Acid Test', 'Electrolytes Panel',
];

const TEST_CATEGORIES = [
  'Blood Tests', 'Diabetes', 'Thyroid', 'Heart Health', 'Liver',
  'Kidney', 'Vitamins', 'Allergy', 'Full Body Checkup',
];

const LAB_NAMES = [
  'Thyrocare Labs', 'Dr. Lal PathLabs', 'SRL Diagnostics', 'Metropolis',
  'Redcliffe Labs', 'Orange Health', 'HealthifyMe Labs',
];

export interface ServiceRecord {
  id: string;
  name: string;
  category: string;
  price: number;
  mrp: number;
  discount: number;
  turnaround: string;
  lab: string;
  homeCollection: boolean;
  popular: boolean;
  parametersCount: number;
}

export interface BookingRecord {
  id: string;
  bookingNumber: string;
  service: string;
  lab: string;
  date: string;
  timeSlot: string;
  status: 'scheduled' | 'sample_collected' | 'processing' | 'report_ready' | 'completed';
  patientName: string;
  address: string;
  homeCollection: boolean;
  total: number;
}

export interface BookingData {
  services: ServiceRecord[];
  categories: string[];
  packages: Array<{ name: string; tests: number; price: number; mrp: number }>;
  bookings: BookingRecord[];
  labs: string[];
}

export function generateBookingData(count: number, seed: string = 'default'): BookingData {
  const rng = createSeededRandom(seed);
  const pick = <T>(arr: T[]): T => arr[Math.floor(rng() * arr.length)];
  const pickN = (min: number, max: number) => Math.floor(rng() * (max - min + 1)) + min;

  const services: ServiceRecord[] = [];
  for (let i = 0; i < count; i++) {
    const mrp = pickN(200, 3000);
    const discountPct = pickN(10, 40);
    services.push({
      id: `SRV-${3000 + i}`,
      name: TEST_NAMES[i % TEST_NAMES.length],
      category: pick(TEST_CATEGORIES),
      price: Math.round(mrp * (1 - discountPct / 100)),
      mrp,
      discount: discountPct,
      turnaround: `${pickN(4, 48)} hours`,
      lab: pick(LAB_NAMES),
      homeCollection: rng() > 0.3,
      popular: rng() > 0.6,
      parametersCount: pickN(3, 80),
    });
  }

  const packages = [
    { name: 'Full Body Checkup', tests: 72, price: 999, mrp: 2500 },
    { name: 'Diabetes Screening', tests: 12, price: 499, mrp: 1200 },
    { name: 'Heart Health Package', tests: 18, price: 799, mrp: 1800 },
    { name: 'Thyroid Care', tests: 5, price: 399, mrp: 900 },
  ];

  const slots = ['7:00 AM', '8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM', '2:00 PM', '4:00 PM'];
  const statuses: BookingRecord['status'][] = ['scheduled', 'sample_collected', 'processing', 'report_ready', 'completed'];

  const bookings: BookingRecord[] = [];
  for (let i = 0; i < 5; i++) {
    const svc = pick(services);
    bookings.push({
      id: `BKG-${4000 + i}`,
      bookingNumber: `#BK${pickN(100000, 999999)}`,
      service: svc.name,
      lab: svc.lab,
      date: `2026-04-${String(pickN(1, 28)).padStart(2, '0')}`,
      timeSlot: pick(slots),
      status: statuses[i % statuses.length],
      patientName: `${FIRST_NAMES[i % FIRST_NAMES.length]} ${LAST_NAMES[i % LAST_NAMES.length]}`,
      address: ['42, MG Road, Bangalore', '15, Linking Road, Mumbai', '8, CP, New Delhi'][i % 3],
      homeCollection: rng() > 0.4,
      total: svc.price,
    });
  }

  return { services, categories: TEST_CATEGORIES, packages, bookings, labs: LAB_NAMES };
}

// ── Marketplace Data Generators ──────────────────────────────────────

const SPECIALIZATIONS = [
  'General Physician', 'Dermatologist', 'Cardiologist', 'Orthopedic',
  'Pediatrician', 'Gynecologist', 'ENT Specialist', 'Ophthalmologist',
  'Neurologist', 'Psychiatrist', 'Dentist', 'Urologist',
];

export interface DoctorListingRecord {
  id: string;
  name: string;
  specialization: string;
  experience: number;
  rating: number;
  reviews: number;
  consultationFee: number;
  hospital: string;
  location: string;
  available: boolean;
  nextSlot: string;
  languages: string[];
  image: string;
}

export interface MarketplaceData {
  doctors: DoctorListingRecord[];
  specializations: string[];
  locations: string[];
  topRated: DoctorListingRecord[];
}

export function generateMarketplaceData(count: number, seed: string = 'default'): MarketplaceData {
  const rng = createSeededRandom(seed);
  const pick = <T>(arr: T[]): T => arr[Math.floor(rng() * arr.length)];
  const pickN = (min: number, max: number) => Math.floor(rng() * (max - min + 1)) + min;

  const hospitals = ['Apollo Home', 'Fortis Healthcare', 'Max Home', 'Medanta', 'AIIMS', 'Narayana Health', 'Manipal Home'];
  const locations = ['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Hyderabad', 'Pune', 'Kolkata'];
  const languages = ['English', 'Hindi', 'Telugu', 'Tamil', 'Kannada', 'Marathi', 'Bengali'];

  const doctors: DoctorListingRecord[] = [];
  for (let i = 0; i < count; i++) {
    const exp = pickN(3, 30);
    doctors.push({
      id: `DOC-${5000 + i}`,
      name: `Dr. ${FIRST_NAMES[i % FIRST_NAMES.length]} ${LAST_NAMES[i % LAST_NAMES.length]}`,
      specialization: SPECIALIZATIONS[i % SPECIALIZATIONS.length],
      experience: exp,
      rating: Math.round((3.5 + rng() * 1.5) * 10) / 10,
      reviews: pickN(20, 3000),
      consultationFee: pickN(300, 2000),
      hospital: pick(hospitals),
      location: pick(locations),
      available: rng() > 0.2,
      nextSlot: `${pickN(1, 5)} days`,
      languages: [languages[0], pick(languages)].filter((v, i, a) => a.indexOf(v) === i),
      image: '',
    });
  }

  return {
    doctors,
    specializations: SPECIALIZATIONS,
    locations,
    topRated: [...doctors].sort((a, b) => b.rating - a.rating).slice(0, 4),
  };
}

// ── Insurance Portal Data Generators ─────────────────────────────────

export interface ClaimRecord {
  id: string;
  claimNumber: string;
  policyNumber: string;
  type: string;
  amount: number;
  status: 'submitted' | 'under_review' | 'approved' | 'rejected' | 'settled';
  submittedDate: string;
  hospital: string;
  diagnosis: string;
  patientName: string;
}

export interface PolicyRecord {
  id: string;
  policyNumber: string;
  planName: string;
  sumInsured: number;
  premium: number;
  validUntil: string;
  members: number;
  status: 'active' | 'expired' | 'pending_renewal';
}

export interface InsuranceData {
  claims: ClaimRecord[];
  policies: PolicyRecord[];
  claimTypes: string[];
}

export function generateInsuranceData(count: number, seed: string = 'default'): InsuranceData {
  const rng = createSeededRandom(seed);
  const pick = <T>(arr: T[]): T => arr[Math.floor(rng() * arr.length)];
  const pickN = (min: number, max: number) => Math.floor(rng() * (max - min + 1)) + min;

  const claimTypes = ['Hospitalization', 'Day Care', 'Pre-Hospitalization', 'Post-Hospitalization', 'Maternity', 'OPD'];
  const hospitals = ['Apollo', 'Fortis', 'Max', 'Medanta', 'AIIMS', 'Narayana'];
  const plans = ['Health Shield Gold', 'Family Floater Plus', 'Senior Care Plan', 'Individual Protect', 'Corporate Health'];
  const statuses: ClaimRecord['status'][] = ['submitted', 'under_review', 'approved', 'rejected', 'settled'];

  const claims: ClaimRecord[] = [];
  for (let i = 0; i < count; i++) {
    claims.push({
      id: `CLM-${6000 + i}`,
      claimNumber: `#CL${pickN(100000, 999999)}`,
      policyNumber: `POL-${pickN(10000, 99999)}`,
      type: pick(claimTypes),
      amount: pickN(5000, 500000),
      status: statuses[i % statuses.length],
      submittedDate: `2026-03-${String(pickN(1, 28)).padStart(2, '0')}`,
      hospital: pick(hospitals),
      diagnosis: pick(CONDITIONS),
      patientName: `${FIRST_NAMES[i % FIRST_NAMES.length]} ${LAST_NAMES[i % LAST_NAMES.length]}`,
    });
  }

  const policies: PolicyRecord[] = [];
  for (let i = 0; i < 3; i++) {
    policies.push({
      id: `POL-${7000 + i}`,
      policyNumber: `POL-${pickN(10000, 99999)}`,
      planName: plans[i % plans.length],
      sumInsured: [500000, 1000000, 2000000][i],
      premium: pickN(8000, 25000),
      validUntil: `2027-0${i + 1}-01`,
      members: pickN(1, 5),
      status: (['active', 'active', 'pending_renewal'] as PolicyRecord['status'][])[i],
    });
  }

  return { claims, policies, claimTypes };
}
