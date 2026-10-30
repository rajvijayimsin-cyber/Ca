// Auto-generated from project blueprint. Do not edit by hand.
// Regenerated on every build from the blueprint spec.

/** Families search, filter, and view caregiver profiles. */
export interface Caregiver {
  id?: number | string;
  name?: string;
  photo_url?: string;
  hourly_rate?: number;
  years_experience?: number;
  services_offered?: string;
  languages?: string;
  gender?: string;
  rating?: number;
  verified?: boolean;
  distance?: number;
  availability?: string;
}

/** Families view and manage their bookings by status. */
export interface Booking {
  id?: number | string;
  caregiver_name: string;
  date: string;
  start_time: string;
  duration_hours: number;
  total: number;
  status: string;
  can_cancel?: boolean;
  can_reschedule?: boolean;
}

/** Families view payment history, manage cards, and download receipts. */
export interface Payment {
  id?: number | string;
  booking_id: string;
  amount: number;
  date: string;
  payment_method: string;
  receipt_url?: string;
  status: string;
}

/** Families and caregivers chat about active bookings. */
export interface Message {
  id?: number | string;
  booking_id: string;
  sender_id: string;
  recipient_id: string;
  message_text: string;
  timestamp: string;
  read?: boolean;
}

/** Families leave and view reviews for completed visits. */
export interface Review {
  id?: number | string;
  caregiver_id: string;
  family_id: string;
  booking_id: string;
  rating: number;
  comment?: string;
  date: string;
}
