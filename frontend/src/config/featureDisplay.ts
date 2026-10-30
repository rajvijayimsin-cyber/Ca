/**
 * Feature-to-display mapping for context-aware Welcome, Home, and Dashboard pages.
 * Maps feature keys to human-readable titles, descriptions, icons, and KPI formats.
 */

export interface FeatureDisplayInfo {
  title: string;
  description: string;
  icon: string; // NAV_ICONS key
  kpiLabel: string;
  kpiValueFormat: string; // e.g. '{v}' or '{v}%'
}

export const FEATURE_DISPLAY: Record<string, FeatureDisplayInfo> = {
  // Non-clinical / behavioral / wellness features
  file_upload: { title: 'Secure File Upload', description: 'Upload and manage files with encrypted cloud storage and virus scanning.', icon: 'upload', kpiLabel: 'Files Uploaded', kpiValueFormat: '{v}' },
  audio_upload: { title: 'Audio Recording Upload', description: 'Upload voice memos and conversation recordings for AI-powered analysis.', icon: 'upload', kpiLabel: 'Recordings Uploaded', kpiValueFormat: '{v}' },
  ai_content_analysis: { title: 'AI Communication Analysis', description: 'AI analyzes conversations to provide personalized feedback and insights.', icon: 'chart', kpiLabel: 'Analyses Completed', kpiValueFormat: '{v}' },
  speech_to_text: { title: 'Audio Transcription', description: 'Automatically transcribe recordings to text using AI speech recognition.', icon: 'chart', kpiLabel: 'Transcriptions', kpiValueFormat: '{v}' },
  conversation_summary: { title: 'Conversation Summaries', description: 'AI-generated summaries highlighting what each person was trying to communicate.', icon: 'chart', kpiLabel: 'Summaries Generated', kpiValueFormat: '{v}' },
  subscription_billing: { title: 'Subscription Management', description: 'Flexible monthly and annual plans with secure payment processing.', icon: 'subscriptions', kpiLabel: 'Active Subscribers', kpiValueFormat: '{v}' },
  homework_tasks: { title: 'Homework & Exercises', description: 'Personalized assignments with progress tracking and completion reminders.', icon: 'assignment', kpiLabel: 'Tasks Completed', kpiValueFormat: '{v}' },
  pattern_tracking: { title: 'Pattern Recognition', description: 'Track changes over time to identify recurring patterns and measure improvement.', icon: 'timeline', kpiLabel: 'Improvement Score', kpiValueFormat: '{v}%' },
  safety_detection: { title: 'Safety Monitoring', description: 'AI-powered safety screening with crisis resource referrals when needed.', icon: 'emergency', kpiLabel: 'Safety Status', kpiValueFormat: 'Clear' },
  resource_library: { title: 'Resource Library', description: 'Curated guides, articles, and support resources tailored to your needs.', icon: 'library', kpiLabel: 'Resources Available', kpiValueFormat: '{v}+' },
  shared_profile: { title: 'Shared Profiles', description: 'Create joint profiles to track progress together while maintaining individual identity.', icon: 'group', kpiLabel: 'Active Profiles', kpiValueFormat: '{v}' },
  messaging: { title: 'Secure Messaging', description: 'Private in-app messaging with encryption and notification support.', icon: 'dashboard', kpiLabel: 'Messages Sent', kpiValueFormat: '{v}' },

  // Clinical features
  patient_management: { title: 'Care Recipient Management', description: 'Comprehensive Care Recipient records, demographics, and medical history management.', icon: 'people', kpiLabel: 'Active Care Recipients', kpiValueFormat: '{v}' },
  ehr: { title: 'Electronic Visit Noteses', description: 'Unified Care Recipient records with real-time access across departments.', icon: 'medical', kpiLabel: 'Records Managed', kpiValueFormat: '{v}' },
  appointment_scheduling: { title: 'Smart Scheduling', description: 'Intelligent Booking routing with automated reminders.', icon: 'calendar', kpiLabel: 'Bookings Today', kpiValueFormat: '{v}' },
  telemedicine: { title: 'Telehealth Built-In', description: 'HIPAA-compliant video Visits integrated into Care Recipient workflow.', icon: 'video', kpiLabel: 'Video Sessions', kpiValueFormat: '{v}' },
  billing: { title: 'Billing & Claims', description: 'Claims processing, invoicing, and payment management.', icon: 'dollar', kpiLabel: 'Revenue', kpiValueFormat: '${v}K' }, // eslint-disable-line no-template-curly-in-string
  analytics: { title: 'Advanced Analytics', description: 'AI-powered insights, metrics, and real-time operational dashboards.', icon: 'chart', kpiLabel: 'Reports Generated', kpiValueFormat: '{v}' },
  prescription_management: { title: 'E-Prescribing', description: 'Electronic prescriptions with drug interaction checking.', icon: 'prescription', kpiLabel: 'Prescriptions', kpiValueFormat: '{v}' },
  ai_diagnosis: { title: 'AI Clinical Decision Support', description: 'AI-powered diagnostic recommendations and early warning alerts.', icon: 'chart', kpiLabel: 'AI Insights', kpiValueFormat: '{v}' },
  session_notes: { title: 'Session Documentation', description: 'Clinical session notes, progress tracking, and treatment documentation.', icon: 'medical', kpiLabel: 'Notes Created', kpiValueFormat: '{v}' },
  treatment_plans: { title: 'Treatment Plans', description: 'Structured care plans with goals, milestones, and outcome tracking.', icon: 'medical', kpiLabel: 'Active Plans', kpiValueFormat: '{v}' },
  lab_integration: { title: 'Lab Integration', description: 'Lab order management and automated result integration.', icon: 'lab', kpiLabel: 'Lab Orders', kpiValueFormat: '{v}' },
  health_monitoring: { title: 'Health Monitoring', description: 'Remote health monitoring and vital sign tracking.', icon: 'monitoring', kpiLabel: 'Devices Connected', kpiValueFormat: '{v}' },
  emergency_triage: { title: 'Emergency Triage', description: 'Emergency triage protocols and acuity-based prioritization.', icon: 'emergency', kpiLabel: 'Triage Cases', kpiValueFormat: '{v}' },
  medication_tracking: { title: 'Medication Tracking', description: 'Medication schedules, adherence tracking, and alerts.', icon: 'prescription', kpiLabel: 'Med Adherence', kpiValueFormat: '{v}%' },
  patient_portal: { title: 'Care Recipient Portal', description: 'Self-service portal for Care Recipients to access their health data.', icon: 'patienthub', kpiLabel: 'Portal Logins', kpiValueFormat: '{v}' },
  wearable_integration: { title: 'Wearable Integration', description: 'Wearable device data ingestion, activity/sleep tracking.', icon: 'activity', kpiLabel: 'Synced Devices', kpiValueFormat: '{v}' },

  // Consumer / Wellness features
  activity_tracking: { title: 'Activity Tracking', description: 'Steps, distance, calories burned, and active minutes tracking.', icon: 'activity', kpiLabel: 'Active Minutes', kpiValueFormat: '{v}' },
  sleep_tracking: { title: 'Sleep Tracking', description: 'Sleep quality, stages, duration, and bedtime routines.', icon: 'sleep', kpiLabel: 'Sleep Score', kpiValueFormat: '{v}' },
  nutrition_tracking: { title: 'Nutrition Tracking', description: 'Food logging, macros, meal photos, and dietary analysis.', icon: 'nutrition', kpiLabel: 'Meals Logged', kpiValueFormat: '{v}' },
  fitness_workouts: { title: 'Fitness Workouts', description: 'Workout library, exercise tracking, and custom routines.', icon: 'activity', kpiLabel: 'Workouts', kpiValueFormat: '{v}' },
  mood_tracking: { title: 'Mood Tracking', description: 'Mood logging, emotional patterns, and journaling.', icon: 'mood', kpiLabel: 'Mood Score', kpiValueFormat: '{v}' },
  health_score: { title: 'Health Score', description: 'Composite health score from all tracked metrics.', icon: 'wellness', kpiLabel: 'Health Score', kpiValueFormat: '{v}' },
  health_goals: { title: 'Health Goals', description: 'Goal setting, milestones, streaks, and challenges.', icon: 'goals', kpiLabel: 'Goals Active', kpiValueFormat: '{v}' },
};

/**
 * Given a list of feature keys, returns the top N display items for the welcome page.
 * Prioritizes non-generic features (new features first, then clinical).
 */
export function getFeatureDisplayForWelcome(features: string[], maxCount: number = 6): FeatureDisplayInfo[] {
  // Priority order: new non-clinical features first, then clinical
  const priorityOrder = [
    'ai_content_analysis', 'audio_upload', 'conversation_summary', 'safety_detection',
    'homework_tasks', 'pattern_tracking', 'shared_profile', 'subscription_billing',
    'file_upload', 'speech_to_text', 'resource_library', 'messaging',
    // Consumer / wellness
    'activity_tracking', 'sleep_tracking', 'mood_tracking', 'health_score',
    'nutrition_tracking', 'fitness_workouts', 'health_goals', 'wearable_integration',
    // Clinical
    'telemedicine', 'ehr', 'appointment_scheduling', 'ai_diagnosis', 'billing',
    'prescription_management', 'analytics', 'patient_management', 'session_notes',
    'treatment_plans', 'lab_integration', 'health_monitoring', 'emergency_triage',
    'medication_tracking', 'patient_portal',
  ];

  const result: FeatureDisplayInfo[] = [];
  const seen = new Set<string>();

  // First pass: features in priority order
  for (const key of priorityOrder) {
    if (features.includes(key) && FEATURE_DISPLAY[key] && !seen.has(key)) {
      result.push(FEATURE_DISPLAY[key]);
      seen.add(key);
      if (result.length >= maxCount) break;
    }
  }

  // Second pass: any remaining selected features that have display info
  if (result.length < maxCount) {
    for (const key of features) {
      if (FEATURE_DISPLAY[key] && !seen.has(key)) {
        result.push(FEATURE_DISPLAY[key]);
        seen.add(key);
        if (result.length >= maxCount) break;
      }
    }
  }

  // Third pass: novel features without display info — generate from key name
  if (result.length < maxCount) {
    for (const key of features) {
      if (!seen.has(key) && !FEATURE_DISPLAY[key]) {
        const title = key.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
        result.push({
          title,
          description: `${title} management and tracking.`,
          icon: 'dashboard',
          kpiLabel: title,
          kpiValueFormat: '{v}',
        });
        seen.add(key);
        if (result.length >= maxCount) break;
      }
    }
  }

  return result;
}

/**
 * Given features, returns context-aware KPIs for the dashboard.
 * Uses a seeded approach for consistent values (no Math.random).
 */
export function getDashboardKPIs(
  features: string[],
  seed: string = 'default',
  maxCount: number = 4
): Array<{ label: string; value: string; trend: string }> {
  // Simple seeded hash
  let h = 0;
  for (let i = 0; i < seed.length; i++) {
    h = Math.imul(31, h) + seed.charCodeAt(i) | 0;
  }
  const nextVal = () => {
    h = Math.imul(h ^ (h >>> 16), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    h ^= h >>> 16;
    return (h >>> 0) / 4294967296;
  };

  const kpis: Array<{ label: string; value: string; trend: string }> = [];
  const seen = new Set<string>();

  for (const key of features) {
    const display = FEATURE_DISPLAY[key];
    if (display && !seen.has(display.kpiLabel)) {
      seen.add(display.kpiLabel);
      const v = Math.floor(nextVal() * 200) + 20;
      const value = display.kpiValueFormat.replace('{v}', String(v));
      const trend = `+${Math.floor(nextVal() * 15) + 1}%`;
      kpis.push({ label: display.kpiLabel, value, trend });
      if (kpis.length >= maxCount) break;
    }
  }

  return kpis;
}
