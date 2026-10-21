export type BookingStatus = 'pending' | 'confirmed' | 'completed' | 'declined';

export type TimeOfDay = 'morning' | 'afternoon' | 'evening';

export interface Booking {
  id: string; // Unique Reference Code e.g. '#ATL-8492'
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  serviceId: string;
  serviceName: string;
  categoryName: string;
  duration: string;
  price: string;
  priceNumeric: number;
  stylist: string;
  date: string; // Format: YYYY-MM-DD
  timeSlot: string; // e.g. 'Morning (11:15 AM)' or '11:15 AM'
  timePeriod: TimeOfDay;
  notes?: string;
  status: BookingStatus;
  declineReason?: string;
  createdAt: string; // ISO 8601 string
  updatedAt?: string;
}

export interface Specialist {
  id: string;
  name: string;
  role: string;
  tag?: string;
}

export interface BookingStats {
  todayTotal: number;
  pendingCount: number;
  confirmedCount: number;
  completedCount: number;
  declinedCount: number;
  todayEstimatedRevenue: number;
  totalEstimatedRevenue: number;
}
