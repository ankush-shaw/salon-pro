import React, { useState, useMemo } from 'react';
import {
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
  MessageSquare,
  Search,
  LogOut,
  RotateCcw,
  Plus,
  Copy,
  Check,
  TrendingUp,
  ArrowLeft,
  X,
  Trash2,
} from 'lucide-react';
import { useBookings } from '../../context/BookingContext';
import { getRelativeDate } from '../../utils/date';
import type { Booking, BookingStatus, TimeOfDay } from '../../types/booking';
import { salonConfig } from '../../config/salon';

interface AdminDashboardProps {
  onExit: () => void;
  onLogout: () => void;
}

type DateFilterType = 'today' | 'tomorrow' | 'this_week' | 'all';

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onExit, onLogout }) => {
  const { bookings, updateBookingStatus, deleteBooking, resetToMockData, stats, addBooking, isLiveSync } = useBookings();
  const { servicesSection, appointmentSection } = salonConfig;

  // Filter & Search states
  const [dateFilter, setDateFilter] = useState<DateFilterType>('all');
  const [statusFilter, setStatusFilter] = useState<BookingStatus | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals state
  const [declineModalBooking, setDeclineModalBooking] = useState<Booking | null>(null);
  const [declineReason, setDeclineReason] = useState('Fully booked for this time slot');
  const [customDeclineReason, setCustomDeclineReason] = useState('');
  const [showWalkinModal, setShowWalkinModal] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [actionSuccessNotice, setActionSuccessNotice] = useState<string | null>(null);

  // Dynamic relative dates for filtering
  const todayStr = getRelativeDate(0);
  const tomorrowStr = getRelativeDate(1);
  const inSevenDaysStr = getRelativeDate(7);

  // Filtered Bookings logic
  const filteredBookings = useMemo(() => {
    return bookings.filter((booking) => {
      // 1. Status Filter
      if (statusFilter !== 'all' && booking.status !== statusFilter) {
        return false;
      }

      // 2. Date Filter
      if (dateFilter === 'today' && booking.date !== todayStr) {
        return false;
      }
      if (dateFilter === 'tomorrow' && booking.date !== tomorrowStr) {
        return false;
      }
      if (dateFilter === 'this_week') {
        if (booking.date < todayStr || booking.date > inSevenDaysStr) {
          return false;
        }
      }

      // 3. Search Query (Name, Phone, ID, Service, Stylist)
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesName = booking.customerName.toLowerCase().includes(query);
        const matchesPhone = booking.customerPhone.toLowerCase().includes(query);
        const matchesId = booking.id.toLowerCase().includes(query);
        const matchesService = booking.serviceName.toLowerCase().includes(query);
        const matchesStylist = booking.stylist.toLowerCase().includes(query);
        if (!matchesName && !matchesPhone && !matchesId && !matchesService && !matchesStylist) {
          return false;
        }
      }

      return true;
    });
  }, [bookings, statusFilter, dateFilter, searchQuery, todayStr, tomorrowStr, inSevenDaysStr]);

  // Handle WhatsApp Confirmation Click
  const handleWhatsAppConfirm = (booking: Booking) => {
    // Format message strictly matching requirement:
    // "Dear [Name], your appointment for [Service] at ATELIER SALON is CONFIRMED for [Date] at [Time]. We look forward to welcoming you."
    const cleanPhone = booking.customerPhone.replace(/[^0-9]/g, '');
    const message = `Dear ${booking.customerName}, your appointment for ${booking.serviceName} at ${salonConfig.name} is CONFIRMED for ${booking.date} at ${booking.timeSlot}. We look forward to welcoming you.`;
    const encoded = encodeURIComponent(message);
    const url = `https://wa.me/${cleanPhone}?text=${encoded}`;
    window.open(url, '_blank', 'noopener,noreferrer');

    // Also auto-confirm status if not yet confirmed
    if (booking.status === 'pending') {
      updateBookingStatus(booking.id, 'confirmed');
      showNotice(`Appointment ${booking.id} confirmed and WhatsApp link opened.`);
    }
  };

  // Handle Approve
  const handleApprove = (bookingId: string) => {
    updateBookingStatus(bookingId, 'confirmed');
    showNotice(`Appointment ${bookingId} has been Confirmed.`);
  };

  // Handle Open Decline Modal
  const handleOpenDeclineModal = (booking: Booking) => {
    setDeclineModalBooking(booking);
    setDeclineReason('Fully booked for this time slot');
    setCustomDeclineReason('');
  };

  // Submit Decline
  const handleConfirmDecline = () => {
    if (!declineModalBooking) return;
    const finalReason =
      declineReason === 'Other' ? customDeclineReason.trim() || 'Studio schedule conflict' : declineReason;

    updateBookingStatus(declineModalBooking.id, 'declined', finalReason);
    setDeclineModalBooking(null);
    showNotice(`Appointment ${declineModalBooking.id} marked as Declined.`);
  };

  // Handle Mark Completed / Check Out
  const handleMarkCompleted = (bookingId: string) => {
    updateBookingStatus(bookingId, 'completed');
    showNotice(`Appointment ${bookingId} marked as Checked Out & Finished.`);
  };

  const handleDelete = (bookingId: string) => {
    if (window.confirm(`Are you sure you want to permanently remove reservation ${bookingId}?`)) {
      deleteBooking(bookingId);
      showNotice(`Reservation ${bookingId} has been deleted.`);
    }
  };

  const handleCopyId = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const showNotice = (msg: string) => {
    setActionSuccessNotice(msg);
    setTimeout(() => setActionSuccessNotice(null), 4000);
  };

  // Walk-in Quick Form State
  const [walkinData, setWalkinData] = useState({
    name: '',
    phone: '',
    email: '',
    serviceId: 'couture-cut',
    stylist: appointmentSection.specialists[0]?.name || 'Elena Rostova',
    date: todayStr,
    timePeriod: 'morning' as TimeOfDay,
    timeSlot: '11:15 AM',
    notes: '',
  });

  const handleCreateWalkin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!walkinData.name.trim() || !walkinData.phone.trim()) return;

    // Find service
    let selectedServiceName = 'Couture Cut & Finish';
    let selectedCategory = 'Hair Architecture';
    let duration = '75 mins';
    let price = '₹3,200';
    let priceNumeric = 3200;

    servicesSection.categories.forEach((cat) => {
      const found = cat.items.find((i) => i.id === walkinData.serviceId);
      if (found) {
        selectedServiceName = found.name;
        selectedCategory = cat.name;
        duration = found.duration;
        price = found.price;
        priceNumeric = found.priceNumeric;
      }
    });

    const newBooking = addBooking({
      customerName: walkinData.name.trim(),
      customerPhone: walkinData.phone.trim(),
      customerEmail: walkinData.email.trim() || 'walkin@guest.atelier',
      serviceId: walkinData.serviceId,
      serviceName: selectedServiceName,
      categoryName: selectedCategory,
      duration,
      price,
      priceNumeric,
      stylist: walkinData.stylist,
      date: walkinData.date,
      timeSlot: `${walkinData.timePeriod === 'morning' ? 'Morning' : walkinData.timePeriod === 'afternoon' ? 'Afternoon' : 'Evening'} (${walkinData.timeSlot})`,
      timePeriod: walkinData.timePeriod,
      notes: walkinData.notes.trim() ? `[Walk-in Entry] ${walkinData.notes.trim()}` : '[Walk-in / Phone reservation]',
    });

    // Auto-confirm walk-in
    updateBookingStatus(newBooking.id, 'confirmed');

    setShowWalkinModal(false);
    setWalkinData({
      name: '',
      phone: '',
      email: '',
      serviceId: 'couture-cut',
      stylist: appointmentSection.specialists[0]?.name || 'Elena Rostova',
      date: todayStr,
      timePeriod: 'morning',
      timeSlot: '11:15 AM',
      notes: '',
    });
    showNotice(`Walk-in booking ${newBooking.id} created and confirmed.`);
  };

  return (
    <div className="min-h-screen bg-surface text-on-surface antialiased flex flex-col">
      {/* Top Staff Navigation Header */}
      <header className="bg-primary text-on-primary border-b border-primary-container sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={onExit}
              className="btn-tactile inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-primary-container text-on-primary hover:bg-secondary text-xs font-sans"
              title="Return to Public Website"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Website</span>
            </button>

            <div className="h-4 w-px bg-outline-variant/30 hidden sm:block" />

            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif text-lg tracking-wider font-semibold text-on-primary">
                  {salonConfig.name}
                </span>
                <span className="px-2 py-0.5 bg-secondary text-on-secondary text-[10px] font-sans font-bold tracking-widest uppercase">
                  Manager Suite
                </span>
                {isLiveSync ? (
                  <span className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-emerald-950/80 text-emerald-300 border border-emerald-500/40 text-[10px] font-sans font-semibold">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    Live Cloud Sync
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-surface-variant/40 text-on-surface-variant border border-outline-variant/30 text-[10px] font-sans">
                    Offline Demo Mode
                  </span>
                )}
              </div>
              <p className="text-[11px] text-primary-fixed-dim font-sans hidden sm:block">
                Direct Appointment Booking System & Studio Operations
              </p>
            </div>
          </div>

          {/* Quick Header Actions */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowWalkinModal(true)}
              className="btn-tactile inline-flex items-center gap-1.5 bg-secondary text-on-secondary px-3 py-1.5 text-xs font-sans font-semibold hover:bg-secondary-container hover:text-on-secondary-container"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New Booking</span>
            </button>

            <button
              type="button"
              onClick={() => {
                if (window.confirm('Reset bookings to initial realistic demo dataset?')) {
                  resetToMockData();
                  showNotice('Demo bookings dataset restored successfully.');
                }
              }}
              className="btn-tactile inline-flex items-center gap-1.5 bg-primary-container text-on-primary px-3 py-1.5 text-xs font-sans hover:bg-surface-variant hover:text-on-surface"
              title="Reset demo data"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Reset Demo</span>
            </button>

            <button
              type="button"
              onClick={onLogout}
              className="btn-tactile inline-flex items-center gap-1.5 border border-outline-variant/40 text-primary-fixed-dim hover:text-on-primary px-2.5 py-1.5 text-xs font-sans"
              title="Sign Out / Lock Portal"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Lock Portal</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
        {/* Real-time Action Notification */}
        {actionSuccessNotice && (
          <div className="bg-emerald-50 border border-emerald-300 text-emerald-900 px-4 py-3 text-xs font-sans flex items-center justify-between shadow-xs animate-fade-in">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{actionSuccessNotice}</span>
            </div>
            <button
              onClick={() => setActionSuccessNotice(null)}
              className="text-emerald-700 hover:text-emerald-900"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* 1. Daily Stats Bar */}
        <section aria-label="Daily Statistics" className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {/* Card 1: Today's Appointments */}
          <div className="bg-surface-container-lowest border border-outline-variant/30 p-4 sm:p-5">
            <div className="flex items-center justify-between text-outline mb-2">
              <span className="font-sans text-[11px] uppercase tracking-wider font-semibold">
                Today's Schedule
              </span>
              <Calendar className="w-4 h-4 text-secondary" />
            </div>
            <p className="font-serif text-2xl sm:text-3xl font-bold text-primary">
              {stats.todayTotal}
            </p>
            <p className="font-sans text-[11px] text-on-surface-variant mt-1">
              Reservations scheduled today
            </p>
          </div>

          {/* Card 2: Pending Requests */}
          <div className="bg-surface-container-lowest border border-outline-variant/30 p-4 sm:p-5 relative overflow-hidden">
            {stats.pendingCount > 0 && (
              <span className="absolute top-2 right-2 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
              </span>
            )}
            <div className="flex items-center justify-between text-outline mb-2">
              <span className="font-sans text-[11px] uppercase tracking-wider font-semibold">
                Pending Approval
              </span>
              <Clock className="w-4 h-4 text-amber-600" />
            </div>
            <div className="flex items-baseline gap-2">
              <p className="font-serif text-2xl sm:text-3xl font-bold text-primary">
                {stats.pendingCount}
              </p>
              {stats.pendingCount > 0 && (
                <span className="px-2 py-0.5 bg-amber-100 text-amber-900 text-[10px] font-sans font-bold">
                  Action Required
                </span>
              )}
            </div>
            <p className="font-sans text-[11px] text-on-surface-variant mt-1">
              Awaiting manager confirmation
            </p>
          </div>

          {/* Card 3: Total Confirmed */}
          <div className="bg-surface-container-lowest border border-outline-variant/30 p-4 sm:p-5">
            <div className="flex items-center justify-between text-outline mb-2">
              <span className="font-sans text-[11px] uppercase tracking-wider font-semibold">
                Total Confirmed
              </span>
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            </div>
            <p className="font-serif text-2xl sm:text-3xl font-bold text-primary">
              {stats.confirmedCount}
            </p>
            <p className="font-sans text-[11px] text-on-surface-variant mt-1">
              Confirmed client bookings
            </p>
          </div>

          {/* Card 4: Estimated Daily Revenue */}
          <div className="bg-surface-container-lowest border border-outline-variant/30 p-4 sm:p-5">
            <div className="flex items-center justify-between text-outline mb-2">
              <span className="font-sans text-[11px] uppercase tracking-wider font-semibold">
                Est. Daily Revenue
              </span>
              <TrendingUp className="w-4 h-4 text-secondary" />
            </div>
            <p className="font-serif text-2xl sm:text-3xl font-bold text-secondary">
              ₹{stats.todayEstimatedRevenue.toLocaleString('en-IN')}
            </p>
            <p className="font-sans text-[11px] text-on-surface-variant mt-1">
              Total pipeline: ₹{stats.totalEstimatedRevenue.toLocaleString('en-IN')}
            </p>
          </div>
        </section>

        {/* 2. Controls & Filter Bar */}
        <div className="bg-surface-container-lowest border border-outline-variant/30 p-4 sm:p-5 space-y-4">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            {/* Search Bar */}
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-outline absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by client name, phone, booking ID (#ATL-...)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-surface border border-outline-variant/50 pl-10 pr-9 py-2.5 text-xs sm:text-sm font-sans placeholder:text-outline/50 focus:outline-none focus:border-primary-container rounded-none"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-outline hover:text-primary"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Date Filters */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0">
              <span className="text-[11px] uppercase tracking-wider font-semibold text-outline mr-1.5 shrink-0">
                Date:
              </span>
              <button
                type="button"
                onClick={() => setDateFilter('today')}
                className={`btn-tactile px-3.5 py-1.5 text-xs font-sans shrink-0 border ${dateFilter === 'today'
                  ? 'bg-primary-container text-on-primary border-primary-container font-semibold'
                  : 'bg-surface border-outline-variant/40 text-on-surface-variant hover:bg-surface-container'
                  }`}
              >
                Today
              </button>
              <button
                type="button"
                onClick={() => setDateFilter('tomorrow')}
                className={`btn-tactile px-3.5 py-1.5 text-xs font-sans shrink-0 border ${dateFilter === 'tomorrow'
                  ? 'bg-primary-container text-on-primary border-primary-container font-semibold'
                  : 'bg-surface border-outline-variant/40 text-on-surface-variant hover:bg-surface-container'
                  }`}
              >
                Tomorrow
              </button>
              <button
                type="button"
                onClick={() => setDateFilter('this_week')}
                className={`btn-tactile px-3 py-1.5 text-xs font-sans shrink-0 border ${dateFilter === 'this_week'
                  ? 'bg-primary-container text-on-primary border-primary-container font-semibold'
                  : 'bg-surface border-outline-variant/40 text-on-surface-variant hover:bg-surface-container'
                  }`}
              >
                This Week
              </button>
              <button
                type="button"
                onClick={() => setDateFilter('all')}
                className={`btn-tactile px-3 py-1.5 text-xs font-sans shrink-0 border ${dateFilter === 'all'
                  ? 'bg-primary-container text-on-primary border-primary-container font-semibold'
                  : 'bg-surface border-outline-variant/40 text-on-surface-variant hover:bg-surface-container'
                  }`}
              >
                All Dates
              </button>
            </div>
          </div>

          {/* Status Tabs Bar */}
          <div className="border-t border-outline-variant/30 pt-3 flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
              <button
                type="button"
                onClick={() => setStatusFilter('all')}
                className={`btn-tactile px-3 py-1.5 text-xs font-sans flex items-center gap-1.5 border ${statusFilter === 'all'
                  ? 'bg-secondary text-on-secondary border-secondary font-semibold'
                  : 'bg-surface text-on-surface-variant border-outline-variant/30 hover:border-secondary'
                  }`}
              >
                <span>All</span>
                <span className="opacity-80">({bookings.length})</span>
              </button>

              <button
                type="button"
                onClick={() => setStatusFilter('pending')}
                className={`btn-tactile px-3 py-1.5 text-xs font-sans flex items-center gap-1.5 border ${statusFilter === 'pending'
                  ? 'bg-amber-600 text-white border-amber-600 font-semibold'
                  : 'bg-surface text-amber-800 border-amber-300 hover:bg-amber-50'
                  }`}
              >
                <span>Pending Approval</span>
                <span className="bg-amber-200 text-amber-900 px-1.5 py-0.2 rounded-full font-bold text-[10px]">
                  {stats.pendingCount}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setStatusFilter('confirmed')}
                className={`btn-tactile px-3 py-1.5 text-xs font-sans flex items-center gap-1.5 border ${statusFilter === 'confirmed'
                  ? 'bg-emerald-700 text-white border-emerald-700 font-semibold'
                  : 'bg-surface text-emerald-800 border-emerald-300 hover:bg-emerald-50'
                  }`}
              >
                <span>Confirmed</span>
                <span className="opacity-80">({stats.confirmedCount})</span>
              </button>

              <button
                type="button"
                onClick={() => setStatusFilter('completed')}
                className={`btn-tactile px-3 py-1.5 text-xs font-sans flex items-center gap-1.5 border ${statusFilter === 'completed'
                  ? 'bg-slate-700 text-white border-slate-700 font-semibold'
                  : 'bg-surface text-slate-700 border-outline-variant/30 hover:bg-slate-50'
                  }`}
              >
                <span>Completed</span>
                <span className="opacity-80">({stats.completedCount})</span>
              </button>

              <button
                type="button"
                onClick={() => setStatusFilter('declined')}
                className={`btn-tactile px-3 py-1.5 text-xs font-sans flex items-center gap-1.5 border ${statusFilter === 'declined'
                  ? 'bg-rose-700 text-white border-rose-700 font-semibold'
                  : 'bg-surface text-rose-800 border-rose-300 hover:bg-rose-50'
                  }`}
              >
                <span>Declined</span>
                <span className="opacity-80">({stats.declinedCount})</span>
              </button>
            </div>

            <span className="text-xs text-outline font-sans hidden sm:block">
              Showing <strong>{filteredBookings.length}</strong> of {bookings.length} reservations
            </span>
          </div>
        </div>

        {/* 3. Bookings Listing (Desktop Table + Mobile Cards) */}
        {filteredBookings.length === 0 ? (
          <div className="bg-surface-container-lowest border border-outline-variant/30 p-12 text-center">
            <Calendar className="w-10 h-10 text-outline mx-auto mb-3 opacity-60" />
            <h3 className="font-serif text-lg font-medium text-primary">No Appointments Found</h3>
            <p className="font-sans text-xs text-on-surface-variant max-w-sm mx-auto mt-1">
              There are no reservations matching your current search or date/status filters.
            </p>
            <button
              onClick={() => {
                setStatusFilter('all');
                setDateFilter('all');
                setSearchQuery('');
              }}
              className="mt-4 px-4 py-2 bg-surface-container text-primary font-sans text-xs font-semibold hover:bg-surface-container-high"
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Desktop Table View */}
            <div className="hidden lg:block bg-surface-container-lowest border border-outline-variant/30 overflow-x-auto shadow-xs">
              <table className="w-full text-left border-collapse text-xs font-sans">
                <thead>
                  <tr className="bg-surface-container-low border-b border-outline-variant/40 text-[10px] uppercase tracking-wider text-outline">
                    <th className="py-3 px-4 font-semibold whitespace-nowrap w-[100px]">Reference ID</th>
                    <th className="py-3 px-4 font-semibold w-[22%]">Client Details</th>
                    <th className="py-3 px-4 font-semibold w-[18%]">Service & Ritual</th>
                    <th className="py-3 px-4 font-semibold w-[16%]">Specialist</th>
                    <th className="py-3 px-4 font-semibold whitespace-nowrap w-[115px]">Date & Time</th>
                    <th className="py-3 px-4 font-semibold whitespace-nowrap w-[95px]">Status</th>
                    <th className="py-3 px-4 font-semibold text-right whitespace-nowrap w-[225px]">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/30">
                  {filteredBookings.map((booking) => {
                    return (
                      <tr
                        key={booking.id}
                        className={`hover:bg-surface transition-colors ${booking.status === 'pending' ? 'bg-amber-50/30' : ''
                          }`}
                      >
                        {/* Reference ID */}
                        <td className="py-3.5 px-4 font-mono font-bold text-primary whitespace-nowrap">
                          <div className="flex items-center gap-1.5">
                            <span>{booking.id}</span>
                            <button
                              type="button"
                              onClick={() => handleCopyId(booking.id)}
                              className="text-outline hover:text-primary"
                              title="Copy ID"
                            >
                              {copiedId === booking.id ? (
                                <Check className="w-3 h-3 text-secondary" />
                              ) : (
                                <Copy className="w-3 h-3" />
                              )}
                            </button>
                          </div>
                        </td>

                        {/* Client Details */}
                        <td className="py-3.5 px-4">
                          <p className="font-semibold text-primary">{booking.customerName}</p>
                          <div className="text-[11px] text-on-surface-variant flex items-center gap-2 mt-0.5">
                            <a
                              href={`tel:${booking.customerPhone}`}
                              className="hover:text-secondary underline"
                            >
                              {booking.customerPhone}
                            </a>
                            <span>·</span>
                            <span className="truncate max-w-[125px] text-outline">
                              {booking.customerEmail}
                            </span>
                          </div>
                          {booking.notes && (
                            <p
                              className="text-[10px] text-outline italic mt-1 max-w-[180px] truncate"
                              title={booking.notes}
                            >
                              “{booking.notes}”
                            </p>
                          )}
                        </td>

                        {/* Service & Ritual */}
                        <td className="py-3.5 px-4">
                          <p className="font-semibold text-primary">{booking.serviceName}</p>
                          <p className="text-[11px] text-on-surface-variant">
                            {booking.duration} ·{' '}
                            <span className="font-bold text-secondary">{booking.price}</span>
                          </p>
                        </td>

                        {/* Specialist */}
                        <td className="py-3.5 px-4 text-on-surface-variant">
                          <span className="font-medium text-primary block">{booking.stylist}</span>
                        </td>

                        {/* Date & Time */}
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <p className="font-semibold text-primary">{booking.date}</p>
                          <p className="text-[11px] text-on-surface-variant">{booking.timeSlot}</p>
                        </td>

                        {/* Status */}
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          {booking.status === 'pending' && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-50 border border-amber-300 text-amber-900 font-semibold text-[11px]">
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                              Pending
                            </span>
                          )}
                          {booking.status === 'confirmed' && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 border border-emerald-300 text-emerald-900 font-semibold text-[11px]">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                              Confirmed
                            </span>
                          )}
                          {booking.status === 'completed' && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-100 border border-slate-300 text-slate-800 text-[11px]">
                              Completed
                            </span>
                          )}
                          {booking.status === 'declined' && (
                            <span
                              className="inline-flex items-center gap-1 px-2.5 py-1 bg-rose-50 border border-rose-300 text-rose-900 text-[11px]"
                              title={booking.declineReason || 'Declined'}
                            >
                              <XCircle className="w-3.5 h-3.5 text-rose-600" />
                              Declined
                            </span>
                          )}
                          {booking.declineReason && (
                            <p className="text-[10px] text-rose-700 mt-1 max-w-[120px] truncate" title={booking.declineReason}>
                              {booking.declineReason}
                            </p>
                          )}
                        </td>

                        {/* Actions */}
                        <td className="py-3.5 px-4 text-right whitespace-nowrap w-[225px]">
                          <div className="flex items-center justify-end gap-1.5">
                            {/* WhatsApp One-Click Confirmation */}
                            <button
                              type="button"
                              onClick={() => handleWhatsAppConfirm(booking)}
                              className="btn-tactile inline-flex items-center gap-1 px-2.5 py-1.5 bg-[#25D366]/15 hover:bg-[#25D366]/30 text-emerald-900 border border-emerald-400 text-xs font-sans font-medium"
                              title="Send WhatsApp Confirmation"
                            >
                              <MessageSquare className="w-3.5 h-3.5 text-emerald-700" />
                              <span className="hidden xl:inline">WhatsApp</span>
                            </button>

                            {/* Approve if Pending or Declined */}
                            {booking.status !== 'confirmed' && booking.status !== 'completed' && (
                              <button
                                type="button"
                                onClick={() => handleApprove(booking.id)}
                                className="btn-tactile px-2.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-sans font-medium"
                                title="Approve Appointment"
                              >
                                Approve
                              </button>
                            )}

                            {/* Mark Completed if Confirmed */}
                            {booking.status === 'confirmed' && (
                              <button
                                type="button"
                                onClick={() => handleMarkCompleted(booking.id)}
                                className="btn-tactile px-2.5 py-1.5 bg-primary-container hover:bg-secondary text-on-primary text-xs font-sans font-medium"
                                title="Check Out Guest (Service Finished & Paid)"
                              >
                                Check Out
                              </button>
                            )}

                            {/* Decline if not already declined or completed */}
                            {booking.status !== 'declined' && booking.status !== 'completed' && (
                              <button
                                type="button"
                                onClick={() => handleOpenDeclineModal(booking)}
                                className="btn-tactile px-2.5 py-1.5 border border-rose-300 text-rose-800 hover:bg-rose-50 text-xs font-sans font-medium"
                                title="Decline Appointment"
                              >
                                Decline
                              </button>
                            )}

                            {/* Delete Reservation */}
                            <button
                              type="button"
                              onClick={() => handleDelete(booking.id)}
                              className="btn-tactile p-1.5 text-outline hover:text-rose-600 transition-colors"
                              title="Delete Reservation"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile / Tablet Cards View */}
            <div className="lg:hidden space-y-3">
              {filteredBookings.map((booking) => {
                return (
                  <div
                    key={booking.id}
                    className={`bg-surface-container-lowest border p-4 shadow-xs space-y-3 ${booking.status === 'pending'
                      ? 'border-amber-300 bg-amber-50/20'
                      : 'border-outline-variant/40'
                      }`}
                  >
                    {/* Header: ID + Status */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 font-mono font-bold text-sm text-primary">
                        <span>{booking.id}</span>
                        <button
                          type="button"
                          onClick={() => handleCopyId(booking.id)}
                          className="text-outline hover:text-primary"
                        >
                          {copiedId === booking.id ? (
                            <Check className="w-3.5 h-3.5 text-secondary" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>

                      <div>
                        {booking.status === 'pending' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-amber-50 border border-amber-300 text-amber-900 font-semibold text-[11px]">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                            Pending
                          </span>
                        )}
                        {booking.status === 'confirmed' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-emerald-50 border border-emerald-300 text-emerald-900 font-semibold text-[11px]">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            Confirmed
                          </span>
                        )}
                        {booking.status === 'completed' && (
                          <span className="px-2 py-0.5 bg-slate-100 border border-slate-300 text-slate-800 text-[11px]">
                            Completed
                          </span>
                        )}
                        {booking.status === 'declined' && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-rose-50 border border-rose-300 text-rose-900 text-[11px]">
                            Declined
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Service & Client */}
                    <div className="space-y-1">
                      <p className="font-serif text-base font-semibold text-primary">
                        {booking.serviceName}
                      </p>
                      <p className="text-xs text-on-surface-variant">
                        {booking.categoryName} · {booking.duration} ·{' '}
                        <strong className="text-secondary">{booking.price}</strong>
                      </p>
                    </div>

                    {/* Booking Meta */}
                    <div className="grid grid-cols-2 gap-2 text-xs font-sans p-2.5 bg-surface border border-outline-variant/30">
                      <div>
                        <span className="text-[10px] uppercase text-outline block">Guest</span>
                        <p className="font-semibold text-primary">{booking.customerName}</p>
                        <a href={`tel:${booking.customerPhone}`} className="text-secondary underline">
                          {booking.customerPhone}
                        </a>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase text-outline block">Schedule</span>
                        <p className="font-semibold text-primary">{booking.date}</p>
                        <p className="text-on-surface-variant text-[11px]">{booking.timeSlot}</p>
                      </div>
                      <div className="col-span-2 pt-1 border-t border-outline-variant/20">
                        <span className="text-[10px] uppercase text-outline block">Artisan</span>
                        <p className="text-on-surface-variant">{booking.stylist}</p>
                      </div>
                    </div>

                    {booking.notes && (
                      <p className="text-xs text-outline italic bg-surface-container-low p-2 border-l-2 border-secondary">
                        “{booking.notes}”
                      </p>
                    )}

                    {booking.declineReason && (
                      <p className="text-xs text-rose-800 bg-rose-50 p-2 border border-rose-200">
                        Reason: {booking.declineReason}
                      </p>
                    )}

                    {/* Action Controls for Mobile */}
                    <div className="pt-2 border-t border-outline-variant/30 grid grid-cols-2 gap-2">
                      {/* WhatsApp Confirmation */}
                      <button
                        type="button"
                        onClick={() => handleWhatsAppConfirm(booking)}
                        className="btn-tactile py-2 px-3 bg-emerald-50 text-emerald-900 border border-emerald-400 font-sans text-xs font-semibold flex items-center justify-center gap-1.5"
                      >
                        <MessageSquare className="w-3.5 h-3.5 text-emerald-700" />
                        <span>WhatsApp</span>
                      </button>

                      {/* Status-specific action */}
                      {booking.status === 'pending' && (
                        <button
                          type="button"
                          onClick={() => handleApprove(booking.id)}
                          className="btn-tactile py-2 px-3 bg-emerald-700 text-white font-sans text-xs font-semibold"
                        >
                          Approve
                        </button>
                      )}

                      {booking.status === 'confirmed' && (
                        <button
                          type="button"
                          onClick={() => handleMarkCompleted(booking.id)}
                          className="btn-tactile py-2 px-3 bg-primary-container text-on-primary font-sans text-xs font-semibold"
                          title="Check Out Guest"
                        >
                          Check Out
                        </button>
                      )}

                      {booking.status !== 'declined' && booking.status !== 'completed' && (
                        <button
                          type="button"
                          onClick={() => handleOpenDeclineModal(booking)}
                          className="py-1.5 text-rose-800 hover:bg-rose-50 text-xs font-sans text-center border border-rose-200"
                        >
                          Decline
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => handleDelete(booking.id)}
                        className={`py-1.5 text-outline hover:text-rose-700 text-xs font-sans text-center border border-outline-variant/30 flex items-center justify-center gap-1 ${booking.status === 'declined' || booking.status === 'completed' ? 'col-span-2' : ''
                          }`}
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </main>

      {/* Decline Modal */}
      {declineModalBooking && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest max-w-md w-full border border-outline-variant/50 p-6 shadow-xl animate-fade-in space-y-4">
            <div className="flex items-center justify-between border-b border-outline-variant/30 pb-3">
              <h3 className="font-serif text-lg font-semibold text-primary">
                Decline Reservation {declineModalBooking.id}
              </h3>
              <button
                onClick={() => setDeclineModalBooking(null)}
                className="text-outline hover:text-primary"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="font-sans text-xs text-on-surface-variant">
              Please specify the reason for declining <strong>{declineModalBooking.customerName}</strong>'s
              request for <em>{declineModalBooking.serviceName}</em>.
            </p>

            <div className="space-y-2">
              <label className="block text-[11px] uppercase tracking-wider text-secondary font-bold font-sans">
                Select Reason
              </label>
              {[
                'Fully booked for this time slot',
                'Specialist unavailable on this date',
                'Salon private education / restoration day',
                'Customer requested reschedule',
                'Other',
              ].map((reason) => (
                <label
                  key={reason}
                  className="flex items-center gap-2 p-2.5 bg-surface border border-outline-variant/30 text-xs font-sans cursor-pointer hover:bg-surface-container"
                >
                  <input
                    type="radio"
                    name="decline-reason"
                    checked={declineReason === reason}
                    onChange={() => setDeclineReason(reason)}
                    className="accent-primary"
                  />
                  <span>{reason}</span>
                </label>
              ))}
            </div>

            {declineReason === 'Other' && (
              <textarea
                rows={2}
                placeholder="Enter custom explanation..."
                value={customDeclineReason}
                onChange={(e) => setCustomDeclineReason(e.target.value)}
                className="w-full bg-surface border border-outline-variant/50 p-2.5 text-xs font-sans focus:outline-none focus:border-primary-container"
              />
            )}

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-outline-variant/30">
              <button
                type="button"
                onClick={() => setDeclineModalBooking(null)}
                className="px-4 py-2 border border-outline-variant/50 text-xs font-sans text-on-surface-variant hover:bg-surface-container"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDecline}
                className="btn-tactile px-4 py-2 bg-rose-700 hover:bg-rose-800 text-white text-xs font-sans font-semibold"
              >
                Confirm Decline
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New Walk-in / Phone Booking Modal */}
      {showWalkinModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-surface-container-lowest max-w-lg w-full border border-outline-variant/50 p-6 shadow-xl animate-fade-in my-8 space-y-4">
            <div className="flex items-center justify-between border-b border-outline-variant/30 pb-3">
              <h3 className="font-serif text-lg font-semibold text-primary">
                Record New Walk-in or Phone Reservation
              </h3>
              <button
                onClick={() => setShowWalkinModal(false)}
                className="text-outline hover:text-primary"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateWalkin} className="space-y-4 text-xs font-sans">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-secondary font-bold mb-1">
                    Client Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Aditi Roy"
                    value={walkinData.name}
                    onChange={(e) => setWalkinData({ ...walkinData, name: e.target.value })}
                    className="w-full bg-surface border border-outline-variant/50 p-2 text-xs focus:outline-none focus:border-primary-container"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-secondary font-bold mb-1">
                    WhatsApp Phone *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 XXXXXXXXXX"
                    value={walkinData.phone}
                    onChange={(e) => setWalkinData({ ...walkinData, phone: e.target.value })}
                    className="w-full bg-surface border border-outline-variant/50 p-2 text-xs focus:outline-none focus:border-primary-container"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-wider text-secondary font-bold mb-1">
                  Service / Ritual *
                </label>
                <select
                  value={walkinData.serviceId}
                  onChange={(e) => setWalkinData({ ...walkinData, serviceId: e.target.value })}
                  className="w-full bg-surface border border-outline-variant/50 p-2 text-xs focus:outline-none focus:border-primary-container"
                >
                  {servicesSection.categories.map((cat) => (
                    <optgroup key={cat.id} label={cat.name}>
                      {cat.items.map((item) => (
                        <option key={item.id} value={item.id}>
                          {item.name} ({item.price}) — {item.duration}
                        </option>
                      ))}
                    </optgroup>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-secondary font-bold mb-1">
                    Assigned Specialist
                  </label>
                  <select
                    value={walkinData.stylist}
                    onChange={(e) => setWalkinData({ ...walkinData, stylist: e.target.value })}
                    className="w-full bg-surface border border-outline-variant/50 p-2 text-xs focus:outline-none focus:border-primary-container"
                  >
                    {appointmentSection.specialists.map((s) => (
                      <option key={s.id} value={s.name}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-secondary font-bold mb-1">
                    Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={walkinData.date}
                    onChange={(e) => setWalkinData({ ...walkinData, date: e.target.value })}
                    className="w-full bg-surface border border-outline-variant/50 p-2 text-xs focus:outline-none focus:border-primary-container"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-secondary font-bold mb-1">
                    Time Window
                  </label>
                  <select
                    value={walkinData.timePeriod}
                    onChange={(e) =>
                      setWalkinData({
                        ...walkinData,
                        timePeriod: e.target.value as TimeOfDay,
                        timeSlot: e.target.value === 'morning' ? '11:15 AM' : e.target.value === 'afternoon' ? '2:30 PM' : '5:00 PM',
                      })
                    }
                    className="w-full bg-surface border border-outline-variant/50 p-2 text-xs focus:outline-none focus:border-primary-container"
                  >
                    <option value="morning">Morning (10:00 AM – 1:00 PM)</option>
                    <option value="afternoon">Afternoon (1:00 PM – 4:30 PM)</option>
                    <option value="evening">Evening (4:30 PM – 8:00 PM)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-secondary font-bold mb-1">
                    Specific Slot
                  </label>
                  <input
                    type="text"
                    value={walkinData.timeSlot}
                    onChange={(e) => setWalkinData({ ...walkinData, timeSlot: e.target.value })}
                    className="w-full bg-surface border border-outline-variant/50 p-2 text-xs focus:outline-none focus:border-primary-container"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-wider text-secondary font-bold mb-1">
                  Manager Notes (Optional)
                </label>
                <textarea
                  rows={2}
                  placeholder="Preferences, walk-in context, custom pricing notes..."
                  value={walkinData.notes}
                  onChange={(e) => setWalkinData({ ...walkinData, notes: e.target.value })}
                  className="w-full bg-surface border border-outline-variant/50 p-2 text-xs focus:outline-none focus:border-primary-container"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-outline-variant/30">
                <button
                  type="button"
                  onClick={() => setShowWalkinModal(false)}
                  className="px-4 py-2 border border-outline-variant/50 text-xs font-sans hover:bg-surface-container"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-tactile px-5 py-2 bg-primary-container hover:bg-secondary text-on-primary text-xs font-sans font-semibold"
                >
                  Create & Confirm Booking
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
