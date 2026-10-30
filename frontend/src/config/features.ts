/**
 * Feature configuration.
 * Single source of truth for feature descriptions, KPI configs, and quick actions.
 */

export interface FeatureConfig {
  key: string;
  description: string;
  /** Category grouping for UI display */
  category?: string;
  /** Idea-text keywords that suggest this feature */
  ideaKeywords?: string[];
}

export interface KPIConfig {
  id: string;
  label: string;
  /** Features that activate this KPI (any match) */
  triggerFeatures: string[];
  valueMin: number;
  valueMax: number;
  /** Template: use {v} for the generated value */
  valueFormat: string;
  changeMin: number;
  changeMax: number;
  /** Template: use {v} for the generated change value */
  changeFormat: string;
  changeType: 'up' | 'down' | 'neutral';
  icon: string;
  /** Always show this KPI regardless of features */
  alwaysShow?: boolean;
}

export interface QuickActionConfig {
  /** Features that trigger this action (any match) */
  triggerFeatures: string[];
  label: string;
  icon: string;
}

export const FEATURES: FeatureConfig[] = [
  { key: 'patient_management', description: 'Care Recipient records, profiles, demographics, and medical history', ideaKeywords: ['Care Recipient', 'record'] },
  { key: 'ehr', description: 'Comprehensive electronic Visit Noteses with clinical data', ideaKeywords: ['ehr', 'electronic health', 'Visit Notes', 'Visit Notes', 'clinical data', 'chart', 'Care Recipient record'] },
  { key: 'appointment_scheduling', description: 'Calendar management, booking, reminders, and check-in', ideaKeywords: ['Booking', 'schedule'] },
  { key: 'telemedicine', description: 'Video Visits, virtual waiting rooms, and screen sharing', ideaKeywords: ['video', 'remote', 'telemedicine'] },
  { key: 'billing', description: 'Claims processing, invoicing, and payment management', ideaKeywords: ['bill', 'payment', 'insurance'] },
  { key: 'analytics', description: 'Dashboards, reports, and key performance metrics', ideaKeywords: ['analytic', 'report', 'dashboard'] },
  { key: 'reporting', description: 'Custom reports, data exports, and trend analysis', ideaKeywords: ['report', 'export', 'trend'] },
  { key: 'prescription_management', description: 'E-prescriptions, refill tracking, and drug interactions', ideaKeywords: ['prescription', 'medication', 'drug'] },
  { key: 'patient_portal', description: 'Self-service portal for Care Recipients to access their health data', ideaKeywords: ['portal', 'self-service', 'Care Recipient access', 'my health', 'consumer', 'daily health', 'personal health', 'self-manage', 'health app', 'wellness app'] },
  { key: 'user_management', description: 'Role-based access control and user administration', ideaKeywords: ['user', 'role', 'access control', 'admin'] },
  { key: 'encryption', description: 'End-to-end encryption for data at rest and in transit', ideaKeywords: ['encrypt', 'secure data', 'protection'] },
  { key: 'data_privacy', description: 'Data minimization, consent management, and privacy controls', ideaKeywords: ['privacy', 'consent', 'data protection', 'gdpr'] },
  { key: 'audit_logging', description: 'Comprehensive audit trail for all data access and changes', ideaKeywords: ['audit', 'trail', 'log', 'compliance'] },
  { key: 'medication_tracking', description: 'Medication schedules, adherence tracking, and alerts', ideaKeywords: ['medication', 'adherence', 'pill', 'medicine', 'dosage'] },
  { key: 'drug_interaction_checking', description: 'Automated drug-drug interaction warnings', ideaKeywords: ['drug interaction', 'contraindication', 'adverse'] },
  { key: 'lab_integration', description: 'Lab order management and result integration', ideaKeywords: ['lab', 'laboratory', 'test order'] },
  { key: 'test_results_management', description: 'Lab test result tracking and delivery', ideaKeywords: ['test result', 'lab result', 'diagnostics'] },
  { key: 'ai_diagnosis', description: 'AI-powered diagnostic recommendations and clinical decision support', ideaKeywords: ['ai', 'diagnos', 'predict', 'machine learning', 'flag', 'detect', 'intelligent', 'illness', 'early warning'] },
  { key: 'session_notes', description: 'Clinical session documentation and progress notes', ideaKeywords: ['note', 'session', 'documentation', 'chart'] },
  { key: 'treatment_plans', description: 'Structured treatment plans with goals and milestones', ideaKeywords: ['treatment', 'plan', 'goal', 'milestone'] },
  { key: 'health_monitoring', description: 'Remote health monitoring and vital sign tracking', ideaKeywords: ['monitor', 'tracking', 'vital', 'health signal', 'wellness', 'daily health', 'wearable', 'symptom', 'illness', 'fitness', 'activity tracker'] },
  { key: 'claims_processing', description: 'Insurance claims submission and tracking', ideaKeywords: ['claim', 'insurance', 'reimbursement'] },
  { key: 'eligibility_verification', description: 'Real-time insurance eligibility verification', ideaKeywords: ['eligibility', 'verification', 'coverage'] },
  { key: 'medical_imaging', description: 'Medical image viewing, storage, and PACS integration', ideaKeywords: ['imaging', 'pacs', 'x-ray', 'scan', 'mri'] },
  { key: 'radiology_reports', description: 'Structured radiology reporting and image annotation', ideaKeywords: ['radiology', 'radiolog', 'imaging report'] },
  { key: 'surgical_scheduling', description: 'Operating room scheduling and surgical case management', ideaKeywords: ['surgery', 'surgical', 'operating room'] },
  { key: 'operating_room_management', description: 'OR availability, equipment tracking, and surgical workflows', ideaKeywords: ['operating room', 'or management', 'surgical workflow'] },
  { key: 'rehab_plans', description: 'Rehabilitation program design and exercise prescription', ideaKeywords: ['rehab', 'rehabilitation', 'physical therapy', 'recovery'] },
  { key: 'progress_tracking', description: 'Care Recipient progress monitoring with outcome measurements', ideaKeywords: ['progress', 'outcome', 'improvement', 'milestone'] },
  { key: 'emergency_triage', description: 'Emergency triage protocols and acuity-based prioritization', ideaKeywords: ['emergency', 'triage', 'urgent', 'er ', 'ed '] },
  { key: 'real_time_monitoring', description: 'Real-time Care Recipient vitals and status monitoring', ideaKeywords: ['real-time', 'real time', 'live', 'continuous monitor', 'alert', 'flag', 'health signal', 'early warning', 'detect'] },
  { key: 'discharge_planning', description: 'Check-out coordination, instructions, and follow-up scheduling', ideaKeywords: ['Check-out', 'follow-up', 'transition'] },
  { key: 'resource_referrals', description: 'Community resource referrals and social determinants tracking', ideaKeywords: ['referral', 'community', 'social determinant'] },
  { key: 'case_management', description: 'Longitudinal case management and care coordination', ideaKeywords: ['case management', 'care coordination', 'care plan'] },
  { key: 'medical_coding', description: 'ICD-10/CPT code lookup, assignment, and validation', ideaKeywords: ['coding', 'icd', 'cpt', 'medical code'] },
  { key: 'clinical_trials', description: 'Clinical trial management, enrollment, and data collection', ideaKeywords: ['trial', 'clinical trial', 'research study', 'enrollment'] },
  { key: 'data_analytics', description: 'Advanced data analytics and research data visualization', ideaKeywords: ['data analytics', 'visualization', 'research data'] },
  { key: 'research_protocols', description: 'Research study protocol design and compliance tracking', ideaKeywords: ['research', 'protocol', 'study design'] },
  { key: 'icu_management', description: 'ICU bed tracking, ventilator monitoring, critical care dashboards', ideaKeywords: ['icu', 'intensive care', 'critical care'] },
  { key: 'ventilator_monitoring', description: 'Ventilator settings, weaning protocols, respiratory tracking', ideaKeywords: ['ventilator', 'respiratory', 'breathing'] },
  { key: 'bed_management', description: 'Home bed availability, Check-ins board, transfer management', ideaKeywords: ['bed', 'Check-in', 'transfer', 'occupancy'] },
  { key: 'immunization_tracking', description: 'Vaccine registry, immunization schedules, due-date alerts', ideaKeywords: ['vaccine', 'immunization', 'vaccination', 'shot'] },
  { key: 'growth_charts', description: 'Pediatric growth charts, percentile tracking, developmental milestones', ideaKeywords: ['growth', 'percentile', 'development', 'child growth'] },
  { key: 'pediatric_care', description: 'Age-specific care protocols, pediatric dosing, well-child templates', ideaKeywords: ['pediatric', 'child', 'infant', 'newborn', 'kids'] },
  { key: 'pharmacy_inventory', description: 'Pharmacy stock management, expiration tracking, automated reorder', ideaKeywords: ['pharmacy', 'inventory', 'stock', 'dispensing'] },
  { key: 'controlled_substance_tracking', description: 'PDMP integration, controlled substance logs, DEA compliance', ideaKeywords: ['controlled substance', 'narcotic', 'opioid', 'dea'] },
  { key: 'staff_scheduling', description: 'Shift management, on-call rosters, staff availability', ideaKeywords: ['staff', 'shift', 'schedule', 'roster', 'on-call'] },
  { key: 'census_dashboard', description: 'Real-time Home census, unit-level occupancy, Check-in/Check-out', ideaKeywords: ['census', 'occupancy', 'Home dashboard'] },
  { key: 'disease_surveillance', description: 'Reportable disease tracking, outbreak detection, syndromic surveillance', ideaKeywords: ['surveillance', 'outbreak', 'disease tracking', 'epidemiology'] },
  { key: 'population_health', description: 'Population health analytics, risk stratification, health equity', ideaKeywords: ['population', 'public health', 'risk stratification', 'community health'] },
  { key: 'prenatal_tracking', description: 'Pregnancy timeline, ultrasound tracking, risk assessment', ideaKeywords: ['prenatal', 'pregnancy', 'obstetric', 'maternal'] },
  { key: 'labor_delivery', description: 'Labor progression, fetal monitoring, delivery documentation', ideaKeywords: ['labor', 'delivery', 'birth', 'fetal'] },
  { key: 'neonatal_care', description: 'Newborn assessment (APGAR), nursery management, neonatal screening', ideaKeywords: ['neonatal', 'nicu', 'newborn', 'nursery'] },
  { key: 'quality_measures', description: 'CMS quality measures, HEDIS metrics, clinical quality dashboards', ideaKeywords: ['quality', 'hedis', 'cms', 'measure'] },
  { key: 'incident_reporting', description: 'Care Recipient safety incident reports, near-miss tracking, root cause analysis', ideaKeywords: ['incident', 'safety', 'near-miss', 'adverse event'] },
  { key: 'chemotherapy_management', description: 'Chemo protocol management, regimen scheduling, toxicity tracking', ideaKeywords: ['chemo', 'chemotherapy', 'cancer treatment'] },
  { key: 'tumor_board', description: 'Multi-disciplinary tumor board case presentation and decisions', ideaKeywords: ['tumor', 'oncology review', 'tumor board'] },
  { key: 'cancer_staging', description: 'TNM staging, pathology integration, treatment response tracking', ideaKeywords: ['cancer', 'staging', 'tnm', 'oncology'] },
  { key: 'cardiac_monitoring', description: 'ECG/EKG integration, Holter monitoring, cardiac rhythm analysis', ideaKeywords: ['cardiac', 'ecg', 'ekg', 'heart', 'arrhythmia'] },
  { key: 'cardiac_catheterization', description: 'Cath lab scheduling, hemodynamic data, interventional procedures', ideaKeywords: ['cath lab', 'catheterization', 'interventional'] },
  { key: 'home_visit_scheduling', description: 'Home visit scheduling, route optimization, visit documentation', ideaKeywords: ['home visit', 'home care', 'house call'] },
  { key: 'hospice_palliative', description: 'End-of-life care plans, symptom management, advance directives', ideaKeywords: ['hospice', 'palliative', 'end-of-life', 'comfort care'] },
  { key: 'dental_charting', description: 'Interactive dental chart, tooth-level documentation, periodontal', ideaKeywords: ['dental', 'tooth', 'dentist', 'oral'] },
  { key: 'dental_imaging', description: 'Dental X-ray integration, panoramic/periapical image management', ideaKeywords: ['dental x-ray', 'dental imaging', 'panoramic'] },
  { key: 'infection_surveillance', description: 'HAI tracking, culture results monitoring, isolation management', ideaKeywords: ['infection', 'hai', 'isolation', 'infection control'] },
  { key: 'antibiotic_stewardship', description: 'Antibiotic usage tracking, de-escalation alerts, resistance patterns', ideaKeywords: ['antibiotic', 'antimicrobial', 'resistance'] },
  { key: 'blood_bank', description: 'Blood product inventory, type & screen, crossmatch, transfusion', ideaKeywords: ['blood bank', 'transfusion', 'blood product'] },
  { key: 'transfusion_management', description: 'Transfusion reaction monitoring, blood product utilization', ideaKeywords: ['transfusion', 'blood transfusion', 'blood product'] },
  { key: 'genetic_testing', description: 'Genetic test ordering, result interpretation, variant classification', ideaKeywords: ['genetic', 'dna', 'genomic', 'gene test'] },
  { key: 'pharmacogenomics', description: 'Pharmacogenomic profiles, drug-gene interaction alerts', ideaKeywords: ['pharmacogenomic', 'drug-gene', 'genetic drug'] },
  { key: 'nutrition_management', description: 'Nutritional assessment, diet order management, caloric tracking', ideaKeywords: ['nutrition', 'diet', 'calorie', 'meal', 'food'] },
  { key: 'meal_planning', description: 'Home meal planning, dietary restrictions, food preferences', ideaKeywords: ['meal plan', 'dietary', 'food preference'] },
  { key: 'supply_chain', description: 'Medical supply inventory, procurement, par levels, expiration', ideaKeywords: ['supply', 'procurement', 'inventory'] },
  { key: 'equipment_tracking', description: 'Medical equipment asset tracking, maintenance scheduling', ideaKeywords: ['equipment', 'asset', 'maintenance', 'device tracking'] },
  // Cardiology
  { key: 'echocardiography', description: 'Echocardiogram ordering, imaging, and structural heart assessment', ideaKeywords: ['echo', 'echocardiogram', 'heart imaging'] },
  { key: 'heart_failure_management', description: 'Heart failure staging, fluid balance tracking, and readmission prevention', ideaKeywords: ['heart failure', 'chf', 'fluid balance'] },
  { key: 'pacemaker_tracking', description: 'Pacemaker/ICD device interrogation logs, battery life, and lead checks', ideaKeywords: ['pacemaker', 'icd', 'defibrillator'] },
  // Neurology
  { key: 'eeg_monitoring', description: 'EEG recording, waveform analysis, and epilepsy monitoring', ideaKeywords: ['eeg', 'brainwave', 'epilepsy'] },
  { key: 'stroke_assessment', description: 'NIH Stroke Scale scoring, thrombolysis eligibility, and stroke pathway', ideaKeywords: ['stroke', 'neurological', 'thrombolysis'] },
  { key: 'seizure_tracking', description: 'Seizure diary, frequency tracking, and anti-epileptic drug management', ideaKeywords: ['seizure', 'epilepsy', 'convulsion'] },
  { key: 'neuroimaging', description: 'Brain MRI/CT ordering, lesion tracking, and neuro-radiology integration', ideaKeywords: ['brain scan', 'neuro imaging', 'brain mri'] },
  // Dermatology
  { key: 'skin_lesion_tracking', description: 'Skin lesion documentation, ABCDE assessment, and biopsy tracking', ideaKeywords: ['skin', 'lesion', 'mole', 'dermatology'] },
  { key: 'dermoscopy', description: 'Dermoscopic image capture, annotation, and AI-assisted pattern analysis', ideaKeywords: ['dermoscopy', 'skin imaging', 'dermatoscope'] },
  { key: 'wound_care_management', description: 'Wound measurement, healing progress, and dressing change scheduling', ideaKeywords: ['wound', 'wound care', 'healing', 'dressing'] },
  // Ophthalmology
  { key: 'visual_acuity_testing', description: 'Snellen/LogMAR acuity recording, refraction data, and lens prescriptions', ideaKeywords: ['vision', 'eye exam', 'acuity', 'refraction'] },
  { key: 'tonometry', description: 'Intraocular pressure measurement, glaucoma risk tracking, and trend analysis', ideaKeywords: ['glaucoma', 'eye pressure', 'tonometry'] },
  { key: 'retinal_imaging', description: 'Fundus photography, OCT scans, and retinal layer analysis', ideaKeywords: ['retina', 'fundus', 'oct scan', 'eye imaging'] },
  // Orthopedics
  { key: 'fracture_management', description: 'Fracture classification, reduction tracking, and healing timeline', ideaKeywords: ['fracture', 'broken bone', 'orthopedic'] },
  { key: 'joint_replacement_tracking', description: 'Implant registry, post-op milestones, and prosthesis follow-up', ideaKeywords: ['joint replacement', 'knee replacement', 'hip replacement', 'implant'] },
  { key: 'orthopedic_imaging', description: 'Bone X-ray/MRI ordering, alignment measurement, and hardware assessment', ideaKeywords: ['bone imaging', 'ortho imaging', 'skeletal'] },
  // Anesthesiology
  { key: 'anesthesia_records', description: 'Intra-operative anesthesia charting, drug doses, and vital sign timeline', ideaKeywords: ['anesthesia', 'anesthetic', 'sedation'] },
  { key: 'preop_evaluation', description: 'Pre-operative assessment, ASA classification, and airway evaluation', ideaKeywords: ['pre-op', 'preoperative', 'surgical assessment'] },
  { key: 'pain_management', description: 'Pain scale tracking, PCA pump settings, and multimodal analgesia plans', ideaKeywords: ['pain', 'analgesia', 'pain management'] },
  // Pathology
  { key: 'tissue_analysis', description: 'Histopathology reporting, gross/micro descriptions, and grading systems', ideaKeywords: ['pathology', 'histology', 'biopsy', 'tissue'] },
  { key: 'cytology_reports', description: 'Cytology specimen reports, Pap smear results, and fine needle aspirate', ideaKeywords: ['cytology', 'pap smear', 'cell analysis'] },
  { key: 'specimen_tracking', description: 'Specimen accessioning, chain of custody, and slide tracking', ideaKeywords: ['specimen', 'sample tracking', 'accession'] },
  // Respiratory Therapy
  { key: 'pulmonary_function_testing', description: 'Spirometry, lung volume, and diffusion capacity testing', ideaKeywords: ['pulmonary', 'spirometry', 'lung function'] },
  { key: 'oxygen_therapy', description: 'Oxygen delivery method tracking, SpO2 targets, and weaning protocols', ideaKeywords: ['oxygen', 'spo2', 'o2 therapy'] },
  { key: 'respiratory_assessment', description: 'Respiratory assessment charting, ABG interpretation, and ventilator rounds', ideaKeywords: ['respiratory', 'breathing assessment', 'abg'] },
  // Occupational Therapy
  { key: 'occupational_therapy', description: 'OT evaluation, functional goal setting, and activity adaptation plans', ideaKeywords: ['occupational therapy', 'ot ', 'functional goal'] },
  { key: 'adl_assessment', description: 'Activities of daily living assessment and independence scoring', ideaKeywords: ['daily living', 'adl', 'independence'] },
  { key: 'workplace_ergonomics', description: 'Ergonomic assessment, workstation modification, and return-to-work planning', ideaKeywords: ['ergonomic', 'return to work', 'workplace'] },
  // Speech Therapy
  { key: 'speech_therapy', description: 'Speech-language evaluation, articulation goals, and therapy session notes', ideaKeywords: ['speech', 'language therapy', 'articulation'] },
  { key: 'swallowing_assessment', description: 'Dysphagia evaluation, modified barium swallow, and diet texture orders', ideaKeywords: ['swallowing', 'dysphagia', 'barium swallow'] },
  { key: 'communication_aids', description: 'AAC device setup, communication board design, and progress tracking', ideaKeywords: ['aac', 'communication aid', 'augmentative'] },
  // Nutrition / Dietetics
  { key: 'dietary_assessment', description: 'Nutritional status assessment, BMI tracking, and malnutrition screening', ideaKeywords: ['dietary', 'bmi', 'malnutrition', 'nutritional status'] },
  { key: 'enteral_nutrition', description: 'Tube feeding orders, formula selection, and caloric goal tracking', ideaKeywords: ['tube feeding', 'enteral', 'feeding tube'] },
  // Genetic Counseling
  { key: 'genetic_counseling', description: 'Pedigree charting, risk assessment discussion, and genetic test ordering', ideaKeywords: ['genetic counseling', 'pedigree', 'hereditary'] },
  { key: 'hereditary_risk_assessment', description: 'Hereditary cancer/disease risk models, variant interpretation, and family history', ideaKeywords: ['hereditary', 'family history', 'genetic risk'] },
  // Health IT / Informatics
  { key: 'system_integration', description: 'HL7/FHIR interface management, system connectivity, and data mapping', ideaKeywords: ['hl7', 'fhir', 'integration', 'interoperability'] },
  { key: 'data_interoperability', description: 'Cross-system data exchange, terminology mapping, and integration testing', ideaKeywords: ['interoperability', 'data exchange', 'cross-system'] },
  { key: 'health_information_exchange', description: 'HIE participation, Care Recipient record lookup, and document sharing', ideaKeywords: ['hie', 'health exchange', 'record sharing'] },
  // Biomedical Engineering
  { key: 'device_maintenance', description: 'Medical device preventive maintenance schedules and service logs', ideaKeywords: ['device maintenance', 'preventive maintenance', 'biomedical'] },
  { key: 'medical_device_integration', description: 'Bedside device data feeds, alarm management, and device onboarding', ideaKeywords: ['device integration', 'alarm management', 'bedside device'] },
  // Community Health
  { key: 'community_outreach', description: 'Outreach campaign tracking, community event scheduling, and enrollment drives', ideaKeywords: ['outreach', 'community', 'enrollment drive'] },
  { key: 'sdoh_screening', description: 'Social determinants of health screening, resource matching, and follow-up', ideaKeywords: ['sdoh', 'social determinant', 'social needs'] },
  { key: 'health_literacy', description: 'Care Recipient education material management, readability scoring, and multilingual content', ideaKeywords: ['health literacy', 'education material', 'multilingual'] },
  // General (missing)
  { key: 'referral_management', description: 'Specialist referral creation, tracking, and closure loop', ideaKeywords: ['referral', 'specialist', 'refer'] },
  { key: 'prior_authorization', description: 'Prior authorization requests, status tracking, and payer communication', ideaKeywords: ['prior auth', 'authorization', 'payer'] },
  { key: 'consent_management', description: 'Informed consent forms, e-signature, and consent versioning', ideaKeywords: ['consent', 'informed consent', 'e-signature'] },
  { key: 'patient_education', description: 'Care Recipient education materials, Check-out instructions, and health literacy tools', ideaKeywords: ['Care Recipient education', 'health tips', 'educational'] },
  { key: 'fall_risk_assessment', description: 'Fall risk scoring (Morse/Hendrich), prevention protocols, and incident tracking', ideaKeywords: ['fall risk', 'fall prevention', 'elderly safety'] },
  { key: 'chronic_disease_management', description: 'Chronic condition care plans, self-management goals, and outcome tracking', ideaKeywords: ['chronic', 'diabetes', 'hypertension', 'long-term', 'disease management', 'glucose'] },
  { key: 'wearable_integration', description: 'Wearable device data ingestion, activity/sleep tracking, and remote monitoring', ideaKeywords: ['wearable', 'fitbit', 'smartwatch', 'activity', 'sleep', 'step', 'apple watch', 'health signal', 'daily health', 'sensor', 'biometric', 'health tracker', 'health app', 'fitness', 'activity tracker'] },
  { key: 'allergy_tracking', description: 'Allergy and adverse reaction documentation, severity, and cross-reactivity alerts', ideaKeywords: ['allergy', 'allergic', 'adverse reaction'] },
  // Consumer Health / Wellness
  { key: 'activity_tracking', description: 'Steps, distance, calories burned, and active minutes tracking', ideaKeywords: ['activity', 'step', 'walk', 'run', 'apple health', 'fitness tracker', 'pedometer', 'distance', 'active minutes'] },
  { key: 'sleep_tracking', description: 'Sleep quality, stages, duration, and bedtime routines', ideaKeywords: ['sleep', 'insomnia', 'rest', 'bedtime', 'nap', 'sleep quality', 'sleep score'] },
  { key: 'nutrition_tracking', description: 'Food logging, macros, meal photos, and dietary analysis', ideaKeywords: ['food', 'calorie count', 'macro', 'meal track', 'food log', 'diet log', 'nutrition log'] },
  { key: 'fitness_workouts', description: 'Workout library, exercise tracking, and custom routines', ideaKeywords: ['workout', 'gym', 'cardio', 'training', 'exercise', 'strength', 'hiit'] },
  { key: 'mood_tracking', description: 'Mood logging, emotional patterns, and journaling', ideaKeywords: ['mood', 'stress', 'mindful', 'anxiety', 'well-being', 'emotional', 'journal', 'mental wellness'] },
  { key: 'health_score', description: 'Composite health score from all tracked metrics', ideaKeywords: ['health score', 'wellness score', 'readiness', 'health index', 'vitality score'] },
  { key: 'body_measurements', description: 'Weight, BMI, body fat, and body composition tracking', ideaKeywords: ['weight', 'bmi', 'body fat', 'body composition', 'body mass'] },
  { key: 'water_intake', description: 'Water consumption tracking with daily goals', ideaKeywords: ['water', 'hydration', 'fluid', 'water intake', 'drink water'] },
  { key: 'step_counter', description: 'Real-time step counting with goals and streaks', ideaKeywords: ['step count', 'pedometer', '10000 steps', 'step goal', 'daily steps'] },
  { key: 'heart_rate_consumer', description: 'Heart rate tracking from wearables with zones', ideaKeywords: ['heart rate', 'resting heart rate', 'bpm', 'heart rate zone', 'pulse'] },
  { key: 'calorie_tracking', description: 'Calorie intake vs expenditure tracking', ideaKeywords: ['calorie deficit', 'energy balance', 'calorie budget', 'burn calories'] },
  { key: 'symptom_logging', description: 'Consumer symptom logging with pattern detection', ideaKeywords: ['symptom', 'health diary', 'health journal', 'symptom tracker', 'symptom log'] },
  { key: 'health_sharing', description: 'Share health data with family or providers', ideaKeywords: ['share health', 'family health', 'health sharing', 'share data'] },
  { key: 'medication_reminders', description: 'Pill reminders and medication adherence tracking', ideaKeywords: ['pill reminder', 'med reminder', 'medication reminder', 'take medicine'] },
  { key: 'health_goals', description: 'Goal setting, milestones, streaks, and challenges', ideaKeywords: ['health goal', 'fitness goal', 'streak', 'challenge', 'milestone', 'target'] },
  // Non-Clinical / Behavioral Health / Wellness
  { key: 'file_upload', description: 'File and media upload with secure cloud storage (S3/GCS). Supports images, documents, audio, and video files with type validation and virus scanning.', ideaKeywords: ['upload', 'file', 'media', 'attachment', 'document', 'image', 'photo', 'recording', 'voice memo', 'audio'] },
  { key: 'audio_upload', description: 'Audio recording upload and management. Supports voice memos, conversation recordings, and audio journals with secure encrypted storage.', ideaKeywords: ['audio', 'recording', 'voice', 'memo', 'conversation recording', 'speech', 'sound', 'dictation'] },
  { key: 'ai_content_analysis', description: 'AI-powered content analysis using OpenAI APIs. Analyzes text, audio transcripts, or documents to extract insights, sentiment, patterns, and recommendations.', ideaKeywords: ['analyze', 'analysis', 'feedback', 'insight', 'interpret', 'evaluate', 'assess', 'review', 'score', 'detect', 'sentiment', 'nlp'] },
  { key: 'speech_to_text', description: 'Speech-to-text transcription using OpenAI Whisper API. Converts audio recordings to text transcripts for analysis and review.', ideaKeywords: ['transcribe', 'transcription', 'speech to text', 'convert audio', 'whisper', 'voice to text'] },
  { key: 'subscription_billing', description: 'Recurring subscription management with monthly and annual plans. Includes plan selection, upgrade/downgrade, billing history, and payment processing.', ideaKeywords: ['subscription', 'monthly', 'annual', 'recurring', 'plan', 'pricing', 'tier', 'membership', '$', 'per month', 'per year'] },
  { key: 'homework_tasks', description: 'Assignable homework, tasks, and exercises with completion tracking. Supports due dates, reminders, progress tracking, and provider review.', ideaKeywords: ['homework', 'task', 'exercise', 'assignment', 'activity', 'practice', 'worksheet', 'workbook', 'goal'] },
  { key: 'pattern_tracking', description: 'Longitudinal pattern recognition and trend analysis. Tracks changes over time to identify recurring patterns, improvements, and areas needing attention.', ideaKeywords: ['pattern', 'trend', 'over time', 'longitudinal', 'progress', 'history', 'track changes', 'recurring', 'improvement'] },
  { key: 'safety_detection', description: 'AI-powered safety and risk detection. Identifies concerning patterns, provides risk assessments, and surfaces relevant crisis resources and hotline numbers.', ideaKeywords: ['abuse', 'safety', 'risk', 'danger', 'violence', 'crisis', 'hotline', 'emergency resource', 'harm', 'threat', 'domestic violence', 'warning sign'] },
  { key: 'conversation_summary', description: 'AI-powered conversation and content summarization. Generates concise summaries of conversations, sessions, or documents highlighting key points and action items.', ideaKeywords: ['summary', 'summarize', 'recap', 'key points', 'highlight', 'digest', 'brief', 'overview', 'takeaway'] },
  { key: 'shared_profile', description: 'Multi-user shared profiles and accounts. Allows two or more users to share a profile, data, and progress while maintaining individual identity.', ideaKeywords: ['couple', 'shared', 'together', 'partner', 'pair', 'joint', 'family', 'group', 'team', 'duo', 'both'] },
  { key: 'messaging', description: 'Secure in-app messaging between users. Supports text messages, notifications, and conversation threads.', ideaKeywords: ['message', 'chat', 'communicate', 'send', 'inbox', 'conversation', 'discuss', 'talk'] },
  { key: 'resource_library', description: 'Curated resource library with articles, guides, videos, and external links. Supports categories, search, bookmarking, and recommendations.', ideaKeywords: ['resource', 'library', 'article', 'guide', 'education', 'learn', 'information', 'reference', 'help', 'support'] },
  // Elder Care
  { key: 'elder_care_assessment', description: 'Comprehensive geriatric assessment including cognitive screening, mobility evaluation, ADL tracking, and polypharmacy review for senior residents.', ideaKeywords: ['elder', 'senior', 'geriatric', 'aging', 'assisted living', 'nursing home', 'dementia', 'cognitive', 'elderly'] },
  { key: 'caregiver_coordination', description: 'Caregiver scheduling, task assignment, family communication portal, and burnout monitoring for home and facility-based care teams.', ideaKeywords: ['caregiver', 'care team', 'family care', 'home aide', 'care coordination', 'caregiver burnout'] },
  // Blood Bank & Organ Donation
  { key: 'blood_donation_management', description: 'Donor registration, screening, blood collection tracking, inventory by blood type, expiration management, and compatibility testing.', ideaKeywords: ['blood bank', 'blood donation', 'blood drive', 'donor', 'transfusion', 'blood type', 'blood inventory'] },
  { key: 'organ_donation_registry', description: 'Organ donor registry, recipient waitlist management, compatibility matching, procurement coordination, and post-transplant monitoring.', ideaKeywords: ['organ donation', 'transplant', 'donor registry', 'organ matching', 'waitlist', 'procurement', 'organ'] },
  // Ambulance / EMS
  { key: 'ambulance_dispatch', description: 'Emergency dispatch management with real-time unit tracking, priority-based call routing, response time monitoring, and crew scheduling.', ideaKeywords: ['ambulance', 'EMS', 'dispatch', 'emergency response', 'paramedic', 'first responder', '911', 'emergency vehicle'] },
  { key: 'field_care_reporting', description: 'Electronic Care Recipient care reporting (ePCR) for pre-Home care. Capture vitals, interventions, medications, and handoff details in the field.', ideaKeywords: ['ePCR', 'field report', 'pre-Home', 'Care Recipient care report', 'ambulance report', 'field documentation'] },
  // Public Health
  { key: 'outbreak_management', description: 'Outbreak detection, contact tracing, case investigation, quarantine tracking, and public health alert management.', ideaKeywords: ['outbreak', 'contact tracing', 'epidemic', 'pandemic', 'quarantine', 'surveillance', 'public health alert'] },
  { key: 'vaccination_campaign', description: 'Mass vaccination campaign planning, scheduling, inventory tracking, adverse event reporting, and coverage analytics.', ideaKeywords: ['vaccination campaign', 'immunization drive', 'vaccine distribution', 'mass vaccination', 'vaccine coverage'] },
  // Medical Education
  { key: 'medical_training', description: 'Medical education platform with course management, CME credit tracking, competency assessment, simulation scheduling, and learner progress analytics.', ideaKeywords: ['medical education', 'CME', 'training', 'medical school', 'residency', 'clinical training', 'simulation', 'competency'] },
  // Health Analytics / BI
  { key: 'health_bi_analytics', description: 'Healthcare business intelligence with operational KPIs, financial dashboards, clinical outcomes tracking, benchmarking, and predictive analytics.', ideaKeywords: ['health analytics', 'BI', 'business intelligence', 'KPI dashboard', 'Home analytics', 'performance metrics', 'benchmarking'] },
  // Revenue Cycle Management
  { key: 'revenue_cycle_management', description: 'End-to-end revenue cycle management including charge capture, claim scrubbing, submission, denial management, payment posting, and AR aging analysis.', ideaKeywords: ['revenue cycle', 'RCM', 'claim denial', 'charge capture', 'AR aging', 'payment posting', 'medical billing', 'claim scrubbing'] },
  // Home Care
  { key: 'home_care_coordination', description: 'Home healthcare visit scheduling, caregiver routing, visit documentation, Care Recipient progress tracking, and family communication portal.', ideaKeywords: ['home care', 'home health', 'home nursing', 'visiting Caregiver', 'home visit', 'domiciliary care', 'home-based care'] },
  // Veterinary / Animal Health
  { key: 'veterinary_practice', description: 'Veterinary Home management with pet Care Recipient records, vaccination schedules, surgery tracking, boarding management, lab results, and owner communication.', ideaKeywords: ['veterinary', 'vet', 'animal', 'pet', 'Home', 'dog', 'cat', 'pet health', 'animal Home', 'vet Home'] },
  // Prescription Comparison
  { key: 'prescription_comparison', description: 'Compare prescription medication prices across pharmacies, find cheapest options, apply coupons, and calculate savings based on insurance coverage.', ideaKeywords: ['prescription comparison', 'drug price', 'medication cost', 'compare prices', 'cheapest pharmacy', 'prescription savings', 'drug comparison', 'medicine price'] },
  { key: 'drug_database_search', description: 'Search public drug databases for medication information including generic alternatives, drug interactions, side effects, and availability across providers.', ideaKeywords: ['drug database', 'drug search', 'medication lookup', 'drug info', 'generic alternative', 'drug interaction', 'medicine search'] },
  { key: 'pharmacy_finder', description: 'Find nearby pharmacies by location, filter by insurance network, compare services, check hours, and see which pharmacies carry specific medications.', ideaKeywords: ['pharmacy finder', 'find pharmacy', 'nearby pharmacy', 'pharmacy locator', 'pharmacy search', 'drugstore'] },
  { key: 'cost_calculator', description: 'Calculate out-of-pocket medication costs based on insurance plan, deductible status, copay tier, and available coupons or discount programs.', ideaKeywords: ['cost calculator', 'price calculator', 'copay calculator', 'drug cost', 'out of pocket', 'medication cost estimate'] },
  { key: 'insurance_coverage_check', description: 'Check insurance formulary coverage for medications, verify tier status, prior authorization requirements, quantity limits, and step therapy rules.', ideaKeywords: ['insurance coverage', 'formulary', 'coverage check', 'prior authorization', 'drug coverage', 'insurance formulary', 'tier status'] },
];

/** Lookup by key */
export const FEATURE_MAP: Record<string, FeatureConfig> = {};
FEATURES.forEach(f => { FEATURE_MAP[f.key] = f; });

/** Category mapping for all features — used by FeatureCards/FeatureDisplay */
export const FEATURE_CATEGORY_MAP: Record<string, string> = {
  // Clinical
  patient_management: 'Clinical', ehr: 'Clinical', appointment_scheduling: 'Clinical',
  prescription_management: 'Clinical', medication_tracking: 'Clinical',
  drug_interaction_checking: 'Clinical', session_notes: 'Clinical', treatment_plans: 'Clinical',
  allergy_tracking: 'Clinical', chronic_disease_management: 'Clinical',
  // Telehealth
  telemedicine: 'Telehealth', health_monitoring: 'Telehealth', real_time_monitoring: 'Telehealth',
  wearable_integration: 'Telehealth',
  // Consumer
  patient_portal: 'Consumer', patient_education: 'Consumer',
  // Administrative
  billing: 'Administrative', analytics: 'Administrative', reporting: 'Administrative',
  user_management: 'Administrative', claims_processing: 'Administrative',
  eligibility_verification: 'Administrative', medical_coding: 'Administrative',
  referral_management: 'Administrative', prior_authorization: 'Administrative',
  staff_scheduling: 'Administrative', census_dashboard: 'Administrative',
  // Security
  encryption: 'Security', data_privacy: 'Security', audit_logging: 'Security',
  consent_management: 'Security',
  // Diagnostics
  lab_integration: 'Diagnostics', test_results_management: 'Diagnostics',
  ai_diagnosis: 'Diagnostics', medical_imaging: 'Diagnostics', radiology_reports: 'Diagnostics',
  // Surgical
  surgical_scheduling: 'Surgical', operating_room_management: 'Surgical',
  // Rehabilitation
  rehab_plans: 'Rehabilitation', progress_tracking: 'Rehabilitation',
  occupational_therapy: 'Rehabilitation', adl_assessment: 'Rehabilitation',
  workplace_ergonomics: 'Rehabilitation',
  // Emergency
  emergency_triage: 'Emergency',
  // Care Coordination
  discharge_planning: 'Care Coordination', resource_referrals: 'Care Coordination',
  case_management: 'Care Coordination',
  // Research
  clinical_trials: 'Research', data_analytics: 'Research', research_protocols: 'Research',
  // ICU / Critical Care
  icu_management: 'Critical Care', ventilator_monitoring: 'Critical Care',
  bed_management: 'Critical Care',
  // Pediatrics
  immunization_tracking: 'Pediatrics', growth_charts: 'Pediatrics', pediatric_care: 'Pediatrics',
  // Pharmacy
  pharmacy_inventory: 'Pharmacy', controlled_substance_tracking: 'Pharmacy',
  // Population Health
  disease_surveillance: 'Population Health', population_health: 'Population Health',
  community_outreach: 'Population Health', sdoh_screening: 'Population Health',
  health_literacy: 'Population Health',
  // Maternity
  prenatal_tracking: 'Maternity', labor_delivery: 'Maternity', neonatal_care: 'Maternity',
  // Quality
  quality_measures: 'Quality', incident_reporting: 'Quality', fall_risk_assessment: 'Quality',
  infection_surveillance: 'Quality', antibiotic_stewardship: 'Quality',
  // Oncology
  chemotherapy_management: 'Oncology', tumor_board: 'Oncology', cancer_staging: 'Oncology',
  // Cardiology
  cardiac_monitoring: 'Cardiology', cardiac_catheterization: 'Cardiology',
  echocardiography: 'Cardiology', heart_failure_management: 'Cardiology',
  pacemaker_tracking: 'Cardiology',
  // Home Health
  home_visit_scheduling: 'Home Health', hospice_palliative: 'Home Health',
  // Dental
  dental_charting: 'Dental', dental_imaging: 'Dental',
  // Blood Bank
  blood_bank: 'Blood Bank', transfusion_management: 'Blood Bank',
  // Genetics
  genetic_testing: 'Genetics', pharmacogenomics: 'Genetics',
  genetic_counseling: 'Genetics', hereditary_risk_assessment: 'Genetics',
  // Nutrition
  nutrition_management: 'Nutrition', meal_planning: 'Nutrition',
  dietary_assessment: 'Nutrition', enteral_nutrition: 'Nutrition',
  // Operations
  supply_chain: 'Operations', equipment_tracking: 'Operations',
  device_maintenance: 'Operations', medical_device_integration: 'Operations',
  // Neurology
  eeg_monitoring: 'Neurology', stroke_assessment: 'Neurology',
  seizure_tracking: 'Neurology', neuroimaging: 'Neurology',
  // Dermatology
  skin_lesion_tracking: 'Dermatology', dermoscopy: 'Dermatology',
  wound_care_management: 'Dermatology',
  // Ophthalmology
  visual_acuity_testing: 'Ophthalmology', tonometry: 'Ophthalmology',
  retinal_imaging: 'Ophthalmology',
  // Orthopedics
  fracture_management: 'Orthopedics', joint_replacement_tracking: 'Orthopedics',
  orthopedic_imaging: 'Orthopedics',
  // Anesthesiology
  anesthesia_records: 'Anesthesiology', preop_evaluation: 'Anesthesiology',
  pain_management: 'Anesthesiology',
  // Pathology
  tissue_analysis: 'Pathology', cytology_reports: 'Pathology', specimen_tracking: 'Pathology',
  // Respiratory
  pulmonary_function_testing: 'Respiratory', oxygen_therapy: 'Respiratory',
  respiratory_assessment: 'Respiratory',
  // Speech Therapy
  speech_therapy: 'Speech Therapy', swallowing_assessment: 'Speech Therapy',
  communication_aids: 'Speech Therapy',
  // Health IT
  system_integration: 'Health IT', data_interoperability: 'Health IT',
  health_information_exchange: 'Health IT',
  // Wellness
  activity_tracking: 'Wellness', sleep_tracking: 'Wellness', nutrition_tracking: 'Wellness',
  fitness_workouts: 'Wellness', mood_tracking: 'Wellness', health_score: 'Wellness',
  body_measurements: 'Wellness', water_intake: 'Wellness', step_counter: 'Wellness',
  heart_rate_consumer: 'Wellness', calorie_tracking: 'Wellness', symptom_logging: 'Wellness',
  health_sharing: 'Wellness', medication_reminders: 'Wellness', health_goals: 'Wellness',
  // Non-Clinical / Behavioral Health
  file_upload: 'Content', audio_upload: 'Content',
  ai_content_analysis: 'AI', speech_to_text: 'AI', conversation_summary: 'AI',
  subscription_billing: 'Billing',
  homework_tasks: 'Tasks', pattern_tracking: 'Analytics',
  safety_detection: 'Safety', shared_profile: 'Consumer',
  messaging: 'Consumer', resource_library: 'Content',
};

/** Category color palette — used by FeatureCards/FeatureDisplay */
export const CATEGORY_COLORS: Record<string, string> = {
  Clinical: '#0D9488',
  Telehealth: '#7C3AED',
  Consumer: '#D97706',
  Administrative: '#2563EB',
  Security: '#DC2626',
  Diagnostics: '#EA580C',
  Surgical: '#0891B2',
  Rehabilitation: '#059669',
  Emergency: '#E11D48',
  'Care Coordination': '#8B5CF6',
  Research: '#4F46E5',
  'Critical Care': '#B91C1C',
  Pediatrics: '#16A34A',
  Pharmacy: '#9333EA',
  'Population Health': '#0369A1',
  Maternity: '#DB2777',
  Quality: '#CA8A04',
  Oncology: '#9F1239',
  Cardiology: '#DC2626',
  'Home Health': '#15803D',
  Dental: '#0284C7',
  'Blood Bank': '#BE123C',
  Genetics: '#6D28D9',
  Nutrition: '#65A30D',
  Operations: '#475569',
  Neurology: '#7E22CE',
  Dermatology: '#C2410C',
  Ophthalmology: '#0E7490',
  Orthopedics: '#B45309',
  Anesthesiology: '#6366F1',
  Pathology: '#A21CAF',
  Respiratory: '#0D9488',
  'Speech Therapy': '#2563EB',
  'Health IT': '#475569',
  Wellness: '#10B981',
  Content: '#F59E0B',
  AI: '#8B5CF6',
  Tasks: '#14B8A6',
  Other: '#666',
};

/** KPI configurations for DashboardPreview / DynamicDataGenerator */
export const KPI_CONFIGS: KPIConfig[] = [
  {
    id: 'total_patients', label: 'Total Care Recipients',
    triggerFeatures: ['patient_management'], valueMin: 1200, valueMax: 4200,
    valueFormat: '{v}', changeMin: 3, changeMax: 18, changeFormat: '+{v}%',
    changeType: 'up', icon: 'people',
  },
  {
    id: 'appointments_today', label: 'Bookings Today',
    triggerFeatures: ['appointment_scheduling'], valueMin: 15, valueMax: 45,
    valueFormat: '{v}', changeMin: 1, changeMax: 6, changeFormat: '{v} pending',
    changeType: 'neutral', icon: 'calendar',
  },
  {
    id: 'compliance_score', label: 'Compliance Score',
    triggerFeatures: [], valueMin: 90, valueMax: 98,
    valueFormat: '{v}%', changeMin: 1, changeMax: 4, changeFormat: '+{v}%',
    changeType: 'up', icon: 'shield', alwaysShow: true,
  },
  {
    id: 'revenue_mtd', label: 'Revenue MTD',
    triggerFeatures: ['billing'], valueMin: 150, valueMax: 350,
    valueFormat: '${v}K', changeMin: 5, changeMax: 17, changeFormat: '+{v}%', // eslint-disable-line no-template-curly-in-string
    changeType: 'up', icon: 'dollar',
  },
  {
    id: 'reports_generated', label: 'Reports Generated',
    triggerFeatures: ['analytics', 'reporting'], valueMin: 80, valueMax: 280,
    valueFormat: '{v}', changeMin: 8, changeMax: 28, changeFormat: '+{v}%',
    changeType: 'up', icon: 'chart',
  },
  {
    id: 'telehealth_sessions', label: 'Telehealth Sessions',
    triggerFeatures: ['telemedicine'], valueMin: 20, valueMax: 70,
    valueFormat: '{v}', changeMin: 10, changeMax: 35, changeFormat: '+{v}%',
    changeType: 'up', icon: 'video',
  },
  {
    id: 'active_prescriptions', label: 'Active Prescriptions',
    triggerFeatures: ['prescription_management', 'prescription', 'medication_tracking'],
    valueMin: 200, valueMax: 700, valueFormat: '{v}',
    changeMin: 2, changeMax: 10, changeFormat: '{v} refills pending',
    changeType: 'neutral', icon: 'medical',
  },
  {
    id: 'lab_orders_today', label: 'Lab Orders Today',
    triggerFeatures: ['lab_integration', 'test_results_management'],
    valueMin: 12, valueMax: 52, valueFormat: '{v}',
    changeMin: 1, changeMax: 6, changeFormat: '{v} STAT',
    changeType: 'neutral', icon: 'lab',
  },
  {
    id: 'ed_patients', label: 'ED Care Recipients',
    triggerFeatures: ['emergency_triage', 'real_time_monitoring'],
    valueMin: 8, valueMax: 33, valueFormat: '{v}',
    changeMin: 1, changeMax: 5, changeFormat: '{v} critical',
    changeType: 'down', icon: 'emergency',
  },
  {
    id: 'surgeries_today', label: 'Surgeries Today',
    triggerFeatures: ['surgical_scheduling', 'operating_room_management'],
    valueMin: 3, valueMax: 15, valueFormat: '{v}',
    changeMin: 1, changeMax: 4, changeFormat: '{v} in progress',
    changeType: 'neutral', icon: 'surgical',
  },
  {
    id: 'rehab_sessions', label: 'Rehab Sessions',
    triggerFeatures: ['rehab_plans', 'progress_tracking'],
    valueMin: 8, valueMax: 28, valueFormat: '{v}',
    changeMin: 5, changeMax: 15, changeFormat: '+{v}%',
    changeType: 'up', icon: 'rehab',
  },
  {
    id: 'active_trials', label: 'Active Trials',
    triggerFeatures: ['clinical_trials', 'research_protocols'],
    valueMin: 3, valueMax: 18, valueFormat: '{v}',
    changeMin: 20, changeMax: 70, changeFormat: '{v} enrolled',
    changeType: 'neutral', icon: 'research',
  },
  {
    id: 'monitored_patients', label: 'Monitored Care Recipients',
    triggerFeatures: ['health_monitoring', 'medical_imaging', 'radiology_reports'],
    valueMin: 30, valueMax: 130, valueFormat: '{v}',
    changeMin: 3, changeMax: 11, changeFormat: '+{v}%',
    changeType: 'up', icon: 'users',
  },
  {
    id: 'icu_occupancy', label: 'ICU Occupancy',
    triggerFeatures: ['icu_management', 'ventilator_monitoring'],
    valueMin: 14, valueMax: 20, valueFormat: '{v}/20',
    changeMin: 1, changeMax: 5, changeFormat: '{v} on vent',
    changeType: 'neutral', icon: 'medical',
  },
  {
    id: 'active_pregnancies', label: 'Active Pregnancies',
    triggerFeatures: ['prenatal_tracking', 'labor_delivery', 'neonatal_care'],
    valueMin: 15, valueMax: 55, valueFormat: '{v}',
    changeMin: 1, changeMax: 4, changeFormat: '{v} in labor',
    changeType: 'neutral', icon: 'people',
  },
  {
    id: 'active_chemo', label: 'Active Chemo Care Recipients',
    triggerFeatures: ['chemotherapy_management', 'tumor_board'],
    valueMin: 10, valueMax: 40, valueFormat: '{v}',
    changeMin: 2, changeMax: 7, changeFormat: '{v} this week',
    changeType: 'neutral', icon: 'medical',
  },
  {
    id: 'dental_appointments', label: 'Dental Bookings',
    triggerFeatures: ['dental_charting', 'dental_imaging'],
    valueMin: 8, valueMax: 23, valueFormat: '{v}',
    changeMin: 5, changeMax: 15, changeFormat: '+{v}%',
    changeType: 'up', icon: 'calendar',
  },
  {
    id: 'low_stock_alerts', label: 'Low Stock Alerts',
    triggerFeatures: ['supply_chain', 'equipment_tracking'],
    valueMin: 2, valueMax: 10, valueFormat: '{v}',
    changeMin: 1, changeMax: 4, changeFormat: '{v} critical',
    changeType: 'down', icon: 'chart',
  },
  {
    id: 'staff_on_duty', label: 'Staff On Duty',
    triggerFeatures: ['staff_scheduling', 'census_dashboard'],
    valueMin: 30, valueMax: 80, valueFormat: '{v}',
    changeMin: 1, changeMax: 6, changeFormat: '{v} on call',
    changeType: 'neutral', icon: 'people',
  },
  {
    id: 'reportable_cases', label: 'Reportable Cases',
    triggerFeatures: ['disease_surveillance', 'population_health'],
    valueMin: 5, valueMax: 25, valueFormat: '{v}',
    changeMin: 0, changeMax: 3, changeFormat: '{v} new today',
    changeType: 'neutral', icon: 'shield',
  },
  {
    id: 'home_visits_today', label: 'Home Visits Today',
    triggerFeatures: ['home_visit_scheduling', 'hospice_palliative'],
    valueMin: 4, valueMax: 16, valueFormat: '{v}',
    changeMin: 1, changeMax: 4, changeFormat: '{v} in progress',
    changeType: 'neutral', icon: 'calendar',
  },
  // Cardiology
  {
    id: 'echos_today', label: 'Echos Scheduled',
    triggerFeatures: ['echocardiography', 'heart_failure_management', 'pacemaker_tracking'],
    valueMin: 4, valueMax: 18, valueFormat: '{v}',
    changeMin: 1, changeMax: 3, changeFormat: '{v} urgent',
    changeType: 'neutral', icon: 'medical',
  },
  // Neurology
  {
    id: 'neuro_consults', label: 'Neuro Consults',
    triggerFeatures: ['eeg_monitoring', 'stroke_assessment', 'seizure_tracking', 'neuroimaging'],
    valueMin: 3, valueMax: 14, valueFormat: '{v}',
    changeMin: 1, changeMax: 3, changeFormat: '{v} STAT',
    changeType: 'neutral', icon: 'medical',
  },
  // Dermatology
  {
    id: 'skin_exams', label: 'Skin Exams Today',
    triggerFeatures: ['skin_lesion_tracking', 'dermoscopy', 'wound_care_management'],
    valueMin: 6, valueMax: 22, valueFormat: '{v}',
    changeMin: 1, changeMax: 4, changeFormat: '{v} biopsies',
    changeType: 'neutral', icon: 'calendar',
  },
  // Ophthalmology
  {
    id: 'eye_exams', label: 'Eye Exams Today',
    triggerFeatures: ['visual_acuity_testing', 'tonometry', 'retinal_imaging'],
    valueMin: 8, valueMax: 28, valueFormat: '{v}',
    changeMin: 2, changeMax: 6, changeFormat: '{v} dilated',
    changeType: 'neutral', icon: 'calendar',
  },
  // Orthopedics
  {
    id: 'ortho_cases', label: 'Ortho Cases',
    triggerFeatures: ['fracture_management', 'joint_replacement_tracking', 'orthopedic_imaging'],
    valueMin: 4, valueMax: 16, valueFormat: '{v}',
    changeMin: 1, changeMax: 4, changeFormat: '{v} surgical',
    changeType: 'neutral', icon: 'surgical',
  },
  // Anesthesiology
  {
    id: 'anesthesia_cases', label: 'Anesthesia Cases',
    triggerFeatures: ['anesthesia_records', 'preop_evaluation', 'pain_management'],
    valueMin: 5, valueMax: 20, valueFormat: '{v}',
    changeMin: 1, changeMax: 3, changeFormat: '{v} pre-ops',
    changeType: 'neutral', icon: 'medical',
  },
  // Pathology
  {
    id: 'specimens_pending', label: 'Specimens Pending',
    triggerFeatures: ['tissue_analysis', 'cytology_reports', 'specimen_tracking'],
    valueMin: 10, valueMax: 45, valueFormat: '{v}',
    changeMin: 2, changeMax: 8, changeFormat: '{v} STAT',
    changeType: 'neutral', icon: 'lab',
  },
  // Respiratory
  {
    id: 'resp_patients', label: 'Respiratory Care Recipients',
    triggerFeatures: ['pulmonary_function_testing', 'oxygen_therapy', 'respiratory_assessment'],
    valueMin: 6, valueMax: 24, valueFormat: '{v}',
    changeMin: 1, changeMax: 4, changeFormat: '{v} on O2',
    changeType: 'neutral', icon: 'medical',
  },
  // OT / Speech
  {
    id: 'therapy_sessions', label: 'Therapy Sessions',
    triggerFeatures: ['occupational_therapy', 'adl_assessment', 'speech_therapy', 'swallowing_assessment'],
    valueMin: 8, valueMax: 24, valueFormat: '{v}',
    changeMin: 3, changeMax: 10, changeFormat: '+{v}%',
    changeType: 'up', icon: 'rehab',
  },
  // Nutrition
  {
    id: 'nutrition_consults', label: 'Nutrition Consults',
    triggerFeatures: ['dietary_assessment', 'enteral_nutrition', 'nutrition_management'],
    valueMin: 4, valueMax: 15, valueFormat: '{v}',
    changeMin: 1, changeMax: 3, changeFormat: '{v} new',
    changeType: 'neutral', icon: 'calendar',
  },
  // Genetics
  {
    id: 'genetic_cases', label: 'Genetic Cases',
    triggerFeatures: ['genetic_counseling', 'hereditary_risk_assessment', 'genetic_testing'],
    valueMin: 2, valueMax: 10, valueFormat: '{v}',
    changeMin: 1, changeMax: 3, changeFormat: '{v} pending',
    changeType: 'neutral', icon: 'research',
  },
  // Health IT
  {
    id: 'active_interfaces', label: 'Active Interfaces',
    triggerFeatures: ['system_integration', 'data_interoperability', 'health_information_exchange'],
    valueMin: 12, valueMax: 45, valueFormat: '{v}',
    changeMin: 0, changeMax: 2, changeFormat: '{v} errors',
    changeType: 'down', icon: 'chart',
  },
  // Biomedical
  {
    id: 'devices_due', label: 'Devices Due PM',
    triggerFeatures: ['device_maintenance', 'medical_device_integration'],
    valueMin: 3, valueMax: 15, valueFormat: '{v}',
    changeMin: 1, changeMax: 4, changeFormat: '{v} overdue',
    changeType: 'down', icon: 'chart',
  },
  // Community Health
  {
    id: 'community_contacts', label: 'Community Contacts',
    triggerFeatures: ['community_outreach', 'sdoh_screening', 'health_literacy'],
    valueMin: 15, valueMax: 60, valueFormat: '{v}',
    changeMin: 5, changeMax: 20, changeFormat: '+{v}%',
    changeType: 'up', icon: 'people',
  },
  // Referral & Auth
  {
    id: 'pending_referrals', label: 'Pending Referrals',
    triggerFeatures: ['referral_management', 'prior_authorization'],
    valueMin: 8, valueMax: 35, valueFormat: '{v}',
    changeMin: 2, changeMax: 8, changeFormat: '{v} auth needed',
    changeType: 'neutral', icon: 'chart',
  },
  // Chronic Disease
  {
    id: 'chronic_patients', label: 'Chronic Care Care Recipients',
    triggerFeatures: ['chronic_disease_management', 'wearable_integration'],
    valueMin: 50, valueMax: 200, valueFormat: '{v}',
    changeMin: 3, changeMax: 12, changeFormat: '+{v}%',
    changeType: 'up', icon: 'people',
  },
  // Consumer / Wellness
  {
    id: 'daily_check_ins', label: 'Daily Check-Ins',
    triggerFeatures: ['health_monitoring', 'chronic_disease_management'],
    valueMin: 120, valueMax: 450, valueFormat: '{v}',
    changeMin: 5, changeMax: 20, changeFormat: '+{v}%',
    changeType: 'up', icon: 'calendar',
  },
  {
    id: 'active_alerts', label: 'Active Alerts',
    triggerFeatures: ['health_monitoring', 'real_time_monitoring', 'wearable_integration'],
    valueMin: 3, valueMax: 18, valueFormat: '{v}',
    changeMin: 1, changeMax: 5, changeFormat: '{v} critical',
    changeType: 'down', icon: 'emergency',
  },
  {
    id: 'portal_active_users', label: 'Active Users',
    triggerFeatures: ['patient_portal', 'patient_education'],
    valueMin: 200, valueMax: 800, valueFormat: '{v}',
    changeMin: 8, changeMax: 25, changeFormat: '+{v}%',
    changeType: 'up', icon: 'people',
  },
  {
    id: 'connected_devices', label: 'Connected Devices',
    triggerFeatures: ['wearable_integration'],
    valueMin: 50, valueMax: 300, valueFormat: '{v}',
    changeMin: 5, changeMax: 18, changeFormat: '+{v} new',
    changeType: 'up', icon: 'chart',
  },
  // Wellness
  {
    id: 'daily_steps', label: 'Daily Steps',
    triggerFeatures: ['activity_tracking', 'step_counter'],
    valueMin: 4000, valueMax: 12000, valueFormat: '{v}',
    changeMin: 5, changeMax: 20, changeFormat: '+{v}%',
    changeType: 'up', icon: 'rehab',
  },
  {
    id: 'sleep_score', label: 'Sleep Score',
    triggerFeatures: ['sleep_tracking'],
    valueMin: 60, valueMax: 95, valueFormat: '{v}',
    changeMin: 2, changeMax: 8, changeFormat: '+{v}pts',
    changeType: 'up', icon: 'calendar',
  },
  {
    id: 'wellness_score', label: 'Wellness Score',
    triggerFeatures: ['health_score', 'health_goals'],
    valueMin: 55, valueMax: 92, valueFormat: '{v}',
    changeMin: 1, changeMax: 6, changeFormat: '+{v}pts',
    changeType: 'up', icon: 'chart',
  },
  {
    id: 'calories_today', label: 'Calories Today',
    triggerFeatures: ['calorie_tracking', 'nutrition_tracking'],
    valueMin: 1200, valueMax: 2400, valueFormat: '{v}',
    changeMin: 100, changeMax: 500, changeFormat: '{v} remaining',
    changeType: 'neutral', icon: 'chart',
  },
  {
    id: 'active_minutes', label: 'Active Minutes',
    triggerFeatures: ['activity_tracking', 'fitness_workouts'],
    valueMin: 15, valueMax: 90, valueFormat: '{v}min',
    changeMin: 5, changeMax: 30, changeFormat: '+{v}%',
    changeType: 'up', icon: 'rehab',
  },
  {
    id: 'hydration', label: 'Hydration',
    triggerFeatures: ['water_intake'],
    valueMin: 3, valueMax: 8, valueFormat: '{v} glasses',
    changeMin: 1, changeMax: 4, changeFormat: '{v} to go',
    changeType: 'neutral', icon: 'chart',
  },
  // Non-Clinical / Behavioral Health
  {
    id: 'files_uploaded', label: 'Files Uploaded',
    triggerFeatures: ['file_upload', 'audio_upload'],
    valueMin: 45, valueMax: 890, valueFormat: '{v}',
    changeMin: 3, changeMax: 18, changeFormat: '+{v}%',
    changeType: 'up', icon: 'upload_file',
  },
  {
    id: 'analyses_completed', label: 'Analyses Completed',
    triggerFeatures: ['ai_content_analysis', 'speech_to_text'],
    valueMin: 120, valueMax: 2400, valueFormat: '{v}',
    changeMin: 5, changeMax: 22, changeFormat: '+{v}%',
    changeType: 'up', icon: 'psychology',
  },
  {
    id: 'active_subscribers', label: 'Active Subscribers',
    triggerFeatures: ['subscription_billing'],
    valueMin: 50, valueMax: 5000, valueFormat: '{v}',
    changeMin: 2, changeMax: 15, changeFormat: '+{v}%',
    changeType: 'up', icon: 'subscriptions',
  },
  {
    id: 'tasks_completed', label: 'Tasks Completed',
    triggerFeatures: ['homework_tasks'],
    valueMin: 30, valueMax: 500, valueFormat: '{v}',
    changeMin: 5, changeMax: 25, changeFormat: '+{v}%',
    changeType: 'up', icon: 'assignment_turned_in',
  },
  {
    id: 'patterns_identified', label: 'Patterns Identified',
    triggerFeatures: ['pattern_tracking'],
    valueMin: 5, valueMax: 120, valueFormat: '{v}',
    changeMin: 1, changeMax: 12, changeFormat: '+{v}',
    changeType: 'up', icon: 'timeline',
  },
  {
    id: 'safety_alerts', label: 'Safety Alerts',
    triggerFeatures: ['safety_detection'],
    valueMin: 0, valueMax: 15, valueFormat: '{v}',
    changeMin: 0, changeMax: 3, changeFormat: '{v}',
    changeType: 'neutral', icon: 'shield',
  },
];

/** Quick action configurations for DashboardPreview */
export const QUICK_ACTION_CONFIGS: QuickActionConfig[] = [
  { triggerFeatures: ['patient_management'], label: 'New Care Recipient', icon: '+' },
  { triggerFeatures: ['appointment_scheduling'], label: 'Schedule Booking', icon: '\u{1F4C5}' },
  { triggerFeatures: ['telemedicine'], label: 'Start Video Call', icon: '\u{1F4F9}' },
  { triggerFeatures: ['ehr'], label: 'View Records', icon: '\u{1F4CB}' },
  { triggerFeatures: ['billing'], label: 'Process Payment', icon: '\u{1F4B3}' },
  { triggerFeatures: ['analytics'], label: 'Generate Report', icon: '\u{1F4CA}' },
  { triggerFeatures: ['prescription_management', 'prescription'], label: 'New Prescription', icon: '\u{1F48A}' },
  { triggerFeatures: ['lab_integration', 'test_results_management'], label: 'Order Lab Tests', icon: '\u{1F9EA}' },
  { triggerFeatures: ['emergency_triage', 'real_time_monitoring'], label: 'Triage Care Recipient', icon: '\u{1F6A8}' },
  { triggerFeatures: ['surgical_scheduling', 'operating_room_management'], label: 'Schedule Surgery', icon: '\u{1FA7A}' },
  { triggerFeatures: ['clinical_trials', 'research_protocols'], label: 'Enroll Care Recipient', icon: '\u{1F52C}' },
  { triggerFeatures: ['icu_management', 'ventilator_monitoring'], label: 'ICU Dashboard', icon: '\u{1F6CC}' },
  { triggerFeatures: ['prenatal_tracking', 'labor_delivery'], label: 'Labor Board', icon: '\u{1F476}' },
  { triggerFeatures: ['chemotherapy_management', 'tumor_board'], label: 'Tumor Board', icon: '\u{1F9EC}' },
  { triggerFeatures: ['dental_charting', 'dental_imaging'], label: 'Dental Chart', icon: '\u{1F9B7}' },
  { triggerFeatures: ['home_visit_scheduling', 'hospice_palliative'], label: 'Schedule Visit', icon: '\u{1F3E0}' },
  { triggerFeatures: ['pharmacy_inventory', 'controlled_substance_tracking'], label: 'Dispense Med', icon: '\u{1F48A}' },
  { triggerFeatures: ['supply_chain', 'equipment_tracking'], label: 'Check Inventory', icon: '\u{1F4E6}' },
  { triggerFeatures: ['staff_scheduling', 'census_dashboard'], label: 'Staff Schedule', icon: '\u{1F4C5}' },
  { triggerFeatures: ['disease_surveillance', 'population_health'], label: 'Disease Report', icon: '\u{1F4CB}' },
  { triggerFeatures: ['echocardiography', 'heart_failure_management', 'pacemaker_tracking'], label: 'Order Echo', icon: '\u{1FA7A}' },
  { triggerFeatures: ['eeg_monitoring', 'stroke_assessment', 'neuroimaging'], label: 'Neuro Consult', icon: '\u{1F9E0}' },
  { triggerFeatures: ['skin_lesion_tracking', 'dermoscopy'], label: 'Skin Exam', icon: '\u{1F52C}' },
  { triggerFeatures: ['visual_acuity_testing', 'tonometry', 'retinal_imaging'], label: 'Eye Exam', icon: '\u{1F441}' },
  { triggerFeatures: ['fracture_management', 'joint_replacement_tracking'], label: 'Ortho Consult', icon: '\u{1F9B4}' },
  { triggerFeatures: ['anesthesia_records', 'preop_evaluation'], label: 'Pre-Op Eval', icon: '\u{1F4CB}' },
  { triggerFeatures: ['tissue_analysis', 'specimen_tracking'], label: 'Log Specimen', icon: '\u{1F9EA}' },
  { triggerFeatures: ['pulmonary_function_testing', 'oxygen_therapy'], label: 'PFT Order', icon: '\u{1FAC1}' },
  { triggerFeatures: ['occupational_therapy', 'adl_assessment'], label: 'OT Eval', icon: '\u{1F9D1}\u{200D}\u{1F9BD}' },
  { triggerFeatures: ['speech_therapy', 'swallowing_assessment'], label: 'Speech Eval', icon: '\u{1F5E3}' },
  { triggerFeatures: ['dietary_assessment', 'enteral_nutrition', 'nutrition_management'], label: 'Diet Consult', icon: '\u{1F34E}' },
  { triggerFeatures: ['genetic_counseling', 'hereditary_risk_assessment'], label: 'Genetic Consult', icon: '\u{1F9EC}' },
  { triggerFeatures: ['system_integration', 'data_interoperability'], label: 'Interface Monitor', icon: '\u{1F4BB}' },
  { triggerFeatures: ['device_maintenance', 'medical_device_integration'], label: 'Device PM', icon: '\u{1F527}' },
  { triggerFeatures: ['community_outreach', 'sdoh_screening'], label: 'SDOH Screen', icon: '\u{1F3D8}' },
  { triggerFeatures: ['referral_management', 'prior_authorization'], label: 'New Referral', icon: '\u{1F4E4}' },
  { triggerFeatures: ['chronic_disease_management', 'wearable_integration'], label: 'Care Plan', icon: '\u{231A}' },
  { triggerFeatures: ['wound_care_management'], label: 'Wound Check', icon: '\u{1FA79}' },
  { triggerFeatures: ['fall_risk_assessment'], label: 'Fall Risk Screen', icon: '\u{26A0}' },
  { triggerFeatures: ['health_monitoring', 'real_time_monitoring'], label: 'View Vitals', icon: '\u{1FA7A}' },
  { triggerFeatures: ['patient_portal', 'patient_education'], label: 'My Records', icon: '\u{1F4CB}' },
  { triggerFeatures: ['patient_education', 'health_literacy'], label: 'Health Tips', icon: '\u{1F4A1}' },
  { triggerFeatures: ['health_monitoring', 'chronic_disease_management'], label: 'Log Symptoms', icon: '\u{270D}' },
  { triggerFeatures: ['wearable_integration'], label: 'Connect Device', icon: '\u{231A}' },
  // Wellness
  { triggerFeatures: ['activity_tracking', 'step_counter', 'fitness_workouts'], label: 'Log Activity', icon: '\u{1F3C3}' },
  { triggerFeatures: ['nutrition_tracking', 'calorie_tracking'], label: 'Log Meal', icon: '\u{1F957}' },
  { triggerFeatures: ['sleep_tracking'], label: 'Log Sleep', icon: '\u{1F634}' },
  { triggerFeatures: ['mood_tracking'], label: 'Log Mood', icon: '\u{1F60A}' },
  { triggerFeatures: ['fitness_workouts', 'activity_tracking'], label: 'Start Workout', icon: '\u{1F4AA}' },
  { triggerFeatures: ['water_intake'], label: 'Log Water', icon: '\u{1F4A7}' },
  // Non-Clinical / Behavioral Health
  { triggerFeatures: ['file_upload', 'audio_upload'], label: 'Upload File', icon: 'upload_file' },
  { triggerFeatures: ['ai_content_analysis'], label: 'New Analysis', icon: 'psychology' },
  { triggerFeatures: ['homework_tasks'], label: 'Assign Homework', icon: 'assignment' },
  { triggerFeatures: ['subscription_billing'], label: 'Manage Plans', icon: 'subscriptions' },
];

/** Home page task checklist configs — feature-driven */
export interface HomeTaskConfig {
  triggerFeatures: string[];
  label: string;
  priority: 'high' | 'medium' | 'low';
}

export const HOME_TASK_CONFIGS: HomeTaskConfig[] = [
  // Clinical
  { triggerFeatures: ['lab_integration', 'test_results_management'], label: 'Review pending lab results', priority: 'high' },
  { triggerFeatures: ['patient_management'], label: 'Complete Care Recipient intake forms', priority: 'medium' },
  { triggerFeatures: ['discharge_planning'], label: 'Sign Check-out summaries', priority: 'high' },
  { triggerFeatures: ['treatment_plans'], label: 'Update treatment plans', priority: 'medium' },
  { triggerFeatures: ['referral_management'], label: 'Respond to referral requests', priority: 'low' },
  { triggerFeatures: ['prescription_management'], label: 'Review prescription renewals', priority: 'high' },
  { triggerFeatures: ['appointment_scheduling'], label: 'Confirm upcoming Bookings', priority: 'medium' },
  { triggerFeatures: ['billing'], label: 'Process pending claims', priority: 'medium' },
  { triggerFeatures: ['telemedicine'], label: 'Prepare for video Visit', priority: 'high' },
  { triggerFeatures: ['ehr'], label: 'Complete chart documentation', priority: 'medium' },
  // Wellness / Consumer
  { triggerFeatures: ['activity_tracking', 'step_counter'], label: 'Log morning activity', priority: 'high' },
  { triggerFeatures: ['nutrition_tracking', 'calorie_tracking'], label: 'Log breakfast & lunch', priority: 'medium' },
  { triggerFeatures: ['water_intake'], label: 'Drink 4 more glasses of water', priority: 'low' },
  { triggerFeatures: ['mood_tracking'], label: 'Complete mood check-in', priority: 'medium' },
  { triggerFeatures: ['sleep_tracking'], label: 'Review last night\'s sleep data', priority: 'high' },
  { triggerFeatures: ['fitness_workouts'], label: 'Complete today\'s workout', priority: 'high' },
  { triggerFeatures: ['health_goals'], label: 'Check weekly goal progress', priority: 'medium' },
  { triggerFeatures: ['medication_reminders'], label: 'Take afternoon medication', priority: 'high' },
  { triggerFeatures: ['body_measurements'], label: 'Log weekly weight measurement', priority: 'low' },
  { triggerFeatures: ['health_score'], label: 'Review health score insights', priority: 'medium' },
  // Surgical / Emergency / etc.
  { triggerFeatures: ['surgical_scheduling'], label: 'Review pre-op checklists', priority: 'high' },
  { triggerFeatures: ['emergency_triage'], label: 'Check ED waiting room status', priority: 'high' },
  { triggerFeatures: ['clinical_trials'], label: 'Review trial enrollment updates', priority: 'medium' },
  { triggerFeatures: ['icu_management'], label: 'Review ICU Care Recipient handoff notes', priority: 'high' },
];
