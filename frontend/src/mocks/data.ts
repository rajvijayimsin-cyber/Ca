/**
 * Mock data for CareNest — used when backend API is unavailable.
 * Auto-generated from features: Caregiver search with filters, Caregiver profiles with reviews, 3-step booking with hourly price summary, Booking statuses and cancellation rules, Check-in/check-out visits with notes, Payments, receipts and refunds, Messaging, Reviews...
 */
export const MOCK_DATA: Record<string, any> = {
  kpis: [
    { label: 'Total Records', value: '1,247', change: '+12%', changeType: 'up', icon: 'chart' },
    { label: 'Active Today', value: '38', change: '+3', changeType: 'up', icon: 'users' },
    { label: 'Completed', value: '892', change: '+5%', changeType: 'up', icon: 'shield' },
    { label: 'Pending', value: '15', change: '-2', changeType: 'down', icon: 'clock' },
  ],
  activity: [
    { date: '2 hours ago', title: 'Record updated', description: 'A record was modified.' },
    { date: 'Yesterday', title: 'New entry created', description: 'A new item was added.' },
    { date: '3 days ago', title: 'Status change', description: 'An item status was updated.' },
  ],
  appointments: [],
  trends: [
    { label: 'Jan', value: 45 }, { label: 'Feb', value: 62 }, { label: 'Mar', value: 78 },
    { label: 'Apr', value: 95 }, { label: 'May', value: 88 }, { label: 'Jun', value: 102 },
  ],
  profile: { email: 'user@example.com', name: 'Demo User' },

};

export function getMockData(path: string): any {
  const key = path.replace(/^\/api\//, '').replace(/\?.*$/, '').split('/')[0];
  return MOCK_DATA[key] ?? [];
}
