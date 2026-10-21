import React, { useState, useEffect } from 'react';
import {
  CheckCircle2,
  Clock,
  MessageSquare,
  AlertCircle,
  Calendar,
  Sparkles,
  Copy,
  Check,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  RefreshCw,
  Search,
  XCircle,
  ArrowRight,
  User,
} from 'lucide-react';
import { salonConfig } from '../config/salon';
import { ScrollReveal } from './ScrollReveal';
import { useBookings } from '../context/BookingContext';
import { getRelativeDate } from '../utils/date';
import type { Booking, TimeOfDay } from '../types/booking';

interface AppointmentFormProps {
  selectedServiceId?: string;
}

export const AppointmentForm: React.FC<AppointmentFormProps> = ({ selectedServiceId }) => {
  const { appointmentSection, contact, servicesSection } = salonConfig;
  const { addBooking, bookings } = useBookings();

  // Mode: 'book' or 'track'
  const [activeTab, setActiveTab] = useState<'book' | 'track'>('book');

  // Track / Lookup state
  const [lookupQuery, setLookupQuery] = useState('');
  const [lookupResult, setLookupResult] = useState<Booking | null | 'not_found'>(null);
  const [lookupError, setLookupError] = useState('');

  // Flatten all services for lookup
  const allServices = React.useMemo(() => {
    const list: Array<{
      id: string;
      name: string;
      category: string;
      duration: string;
      price: string;
      priceNumeric: number;
      description?: string;
    }> = [];

    // Add Curator's Choice
    if (servicesSection.curatorsChoice) {
      list.push({
        id: 'curators-choice',
        name: servicesSection.curatorsChoice.title,
        category: "Curator's Choice",
        duration: servicesSection.curatorsChoice.duration,
        price: servicesSection.curatorsChoice.price,
        priceNumeric: servicesSection.curatorsChoice.priceNumeric,
        description: servicesSection.curatorsChoice.description,
      });
    }

    // Add category items
    servicesSection.categories.forEach((cat) => {
      cat.items.forEach((item) => {
        list.push({
          id: item.id,
          name: item.name,
          category: cat.name,
          duration: item.duration,
          price: item.price,
          priceNumeric: item.priceNumeric,
          description: item.description,
        });
      });
    });

    // Add complimentary consultation
    list.push({
      id: 'consultation',
      name: 'Initial Atelier Diagnostic Consultation',
      category: 'Diagnostic Ritual',
      duration: '20 mins',
      price: 'Complimentary',
      priceNumeric: 0,
      description: 'Microscope scalp and skin porosity diagnostic with organic tea pairing.',
    });

    return list;
  }, [servicesSection]);

  const todayStr = getRelativeDate(0);
  const tomorrowStr = getRelativeDate(1);
  const inTwoDaysStr = getRelativeDate(2);

  // Form state
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    serviceId: selectedServiceId || (allServices[1]?.id ?? 'couture-cut'),
    stylist: appointmentSection.specialists[0]?.name || 'First Available Specialist',
    date: todayStr,
    timePeriod: 'morning' as TimeOfDay,
    timeSlot: '11:15 AM',
    notes: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [confirmedBooking, setConfirmedBooking] = useState<Booking | null>(null);
  const [copiedRef, setCopiedRef] = useState(false);

  // Sync selectedServiceId if changed from outside
  useEffect(() => {
    if (selectedServiceId) {
      const match = allServices.find((s) => s.id === selectedServiceId);
      if (match) {
        setFormData((prev) => ({ ...prev, serviceId: selectedServiceId }));
        setActiveTab('book');
      }
    }
  }, [selectedServiceId, allServices]);

  // Selected service object
  const currentService = React.useMemo(() => {
    return allServices.find((s) => s.id === formData.serviceId) || allServices[0];
  }, [allServices, formData.serviceId]);

  // Available slots based on selected period
  const activePeriodConfig = React.useMemo(() => {
    return (
      appointmentSection.timeSlots.find((s) => s.period === formData.timePeriod) ||
      appointmentSection.timeSlots[0]
    );
  }, [appointmentSection.timeSlots, formData.timePeriod]);

  // If timeSlot is not valid for current period, select first one
  useEffect(() => {
    if (activePeriodConfig && !activePeriodConfig.times.includes(formData.timeSlot)) {
      setFormData((prev) => ({ ...prev, timeSlot: activePeriodConfig.times[0] || '10:00 AM' }));
    }
  }, [activePeriodConfig, formData.timeSlot]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Please enter your full name.';
    } else if (formData.fullName.trim().length < 2) {
      newErrors.fullName = 'Full name must be at least 2 characters.';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Please enter your WhatsApp contact number.';
    } else {
      const cleanPhone = formData.phone.replace(/[^0-9]/g, '');
      if (cleanPhone.length < 8 || cleanPhone.length > 15) {
        newErrors.phone = 'Please provide a valid phone number (8-15 digits).';
      }
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Please provide an email for appointment confirmation.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = 'Please enter a valid email address.';
    }

    if (!formData.serviceId) {
      newErrors.serviceId = 'Please select a treatment ritual.';
    }

    if (!formData.date) {
      newErrors.date = 'Please choose your preferred appointment date.';
    } else if (formData.date < todayStr) {
      newErrors.date = 'Past dates cannot be reserved.';
    }

    if (!formData.timeSlot) {
      newErrors.timeSlot = 'Please select an appointment time.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Smooth scroll up helper to focus on appointment card or form top
  const scrollToAppointmentTop = () => {
    const el = document.getElementById('appointment');
    if (el) {
      const navbarHeight = 85;
      const elementPosition = el.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - navbarHeight;
      window.scrollTo({
        top: Math.max(0, offsetPosition),
        behavior: 'smooth',
      });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      setTimeout(() => {
        scrollToAppointmentTop();
      }, 50);
      return;
    }

    const serviceObj = currentService;
    const formattedSlot = `${activePeriodConfig.label.split('(')[0].trim()} (${formData.timeSlot})`;

    // Add booking to persistent React context
    const created = addBooking({
      customerName: formData.fullName.trim(),
      customerPhone: formData.phone.trim(),
      customerEmail: formData.email.trim(),
      serviceId: serviceObj.id,
      serviceName: serviceObj.name,
      categoryName: serviceObj.category,
      duration: serviceObj.duration,
      price: serviceObj.price,
      priceNumeric: serviceObj.priceNumeric,
      stylist: formData.stylist,
      date: formData.date,
      timeSlot: formattedSlot,
      timePeriod: formData.timePeriod,
      notes: formData.notes.trim() || undefined,
    });

    setConfirmedBooking(created);

    // Scroll up smoothly so customer immediately sees the Confirmation Card
    setTimeout(() => {
      scrollToAppointmentTop();
    }, 60);
  };

  // Track Reservation Lookup Handler
  const handleTrackLookup = (e: React.FormEvent) => {
    e.preventDefault();
    setLookupError('');
    const q = lookupQuery.trim().toLowerCase();

    if (!q) {
      setLookupError('Please enter a booking reference code or phone number.');
      setLookupResult(null);
      return;
    }

    const cleanPhoneQ = q.replace(/[^0-9]/g, '');

    const found = bookings.find((b) => {
      const cleanId = b.id.toLowerCase().replace('#', '');
      const searchClean = q.replace('#', '');
      if (cleanId === searchClean || b.id.toLowerCase().includes(searchClean)) {
        return true;
      }
      if (cleanPhoneQ.length >= 6) {
        const bPhoneClean = b.customerPhone.replace(/[^0-9]/g, '');
        if (bPhoneClean.includes(cleanPhoneQ) || cleanPhoneQ.includes(bPhoneClean)) {
          return true;
        }
      }
      if (b.customerEmail.toLowerCase() === q) {
        return true;
      }
      return false;
    });

    if (found) {
      setLookupResult(found);
    } else {
      setLookupResult('not_found');
    }
  };

  const handleCopyRef = (refId: string) => {
    navigator.clipboard.writeText(refId);
    setCopiedRef(true);
    setTimeout(() => setCopiedRef(false), 2500);
  };

  // Google Calendar URL generator
  const getGoogleCalendarUrl = (booking: Booking) => {
    const title = encodeURIComponent(`Atelier Salon Ritual: ${booking.serviceName}`);
    const dateFormatted = booking.date.replace(/-/g, '');
    const startHour = booking.timePeriod === 'morning' ? '110000' : booking.timePeriod === 'afternoon' ? '143000' : '173000';
    const endHour = booking.timePeriod === 'morning' ? '123000' : booking.timePeriod === 'afternoon' ? '160000' : '190000';
    const dates = `${dateFormatted}T${startHour}Z/${dateFormatted}T${endHour}Z`;
    const details = encodeURIComponent(
      `Reservation Ref: ${booking.id}\nService: ${booking.serviceName} (${booking.duration})\nSpecialist: ${booking.stylist}\nClient: ${booking.customerName}\nStatus: ${booking.status.toUpperCase()}\n\nAtelier Concierge: ${contact.phoneDisplay}\nAddress: ${contact.address.full}`
    );
    const location = encodeURIComponent(contact.address.full);

    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${dates}&details=${details}&location=${location}`;
  };

  // WhatsApp concierge chat link
  const getWhatsAppConciergeUrl = (booking: Booking) => {
    const text = encodeURIComponent(
      `Hello Atelier Concierge, I am inquiring about reservation ${booking.id} for ${booking.serviceName} scheduled on ${booking.date} at ${booking.timeSlot}. Please let me know its current status.`
    );
    return `https://wa.me/${contact.whatsappNumber}?text=${text}`;
  };

  const handleResetForm = () => {
    setConfirmedBooking(null);
    setFormData({
      fullName: '',
      phone: '',
      email: '',
      serviceId: allServices[0]?.id ?? 'couture-cut',
      stylist: appointmentSection.specialists[0]?.name || 'First Available Specialist',
      date: todayStr,
      timePeriod: 'morning',
      timeSlot: '11:15 AM',
      notes: '',
    });
    setErrors({});
    setTimeout(() => {
      scrollToAppointmentTop();
    }, 50);
  };

  return (
    <section id="appointment" className="py-20 sm:py-24 px-5 sm:px-6 lg:px-12 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
        {/* Left Column: Context, Philosophy & Guarantees */}
        <ScrollReveal className="lg:col-span-5">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-surface-container-high border border-outline-variant/40 mb-3">
            <Sparkles className="w-3.5 h-3.5 text-secondary" />
            <span className="font-sans text-[10px] sm:text-[11px] uppercase tracking-widest text-secondary font-bold">
              Direct Reservation System
            </span>
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl lg:text-[46px] lg:leading-[54px] text-primary mt-2 mb-4 sm:mb-6 font-normal">
            {appointmentSection.title}
          </h2>
          <p className="font-sans text-sm sm:text-base text-on-surface-variant mb-6 leading-relaxed font-normal">
            {appointmentSection.description}
          </p>

          {/* Reassurance Checks */}
          <div className="bg-surface-container-low p-5 sm:p-6 border border-outline-variant/30 mb-8 space-y-4">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-secondary shrink-0 mt-0.5" />
              <div>
                <p className="font-sans text-xs sm:text-[13px] text-on-surface font-semibold">
                  Zero Upfront Charge
                </p>
                <p className="font-sans text-xs text-on-surface-variant mt-0.5">
                  {appointmentSection.benefits[0]}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Clock className="w-5 h-5 text-secondary shrink-0 mt-0.5" />
              <div>
                <p className="font-sans text-xs sm:text-[13px] text-on-surface font-semibold">
                  Dedicated Sanctuary Buffer
                </p>
                <p className="font-sans text-xs text-on-surface-variant mt-0.5">
                  {appointmentSection.benefits[1]}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-secondary shrink-0 mt-0.5" />
              <div>
                <p className="font-sans text-xs sm:text-[13px] text-on-surface font-semibold">
                  Live Dispatch & Verification
                </p>
                <p className="font-sans text-xs text-on-surface-variant mt-0.5">
                  Instant reference code generated. Track approval status online anytime.
                </p>
              </div>
            </div>
          </div>

          {/* Bespoke Concierge Callout */}
          <div className="p-4 sm:p-5 border-l-2 border-secondary bg-surface-container-lowest border border-outline-variant/20">
            <p className="font-sans text-xs sm:text-[13px] text-on-surface-variant font-normal leading-relaxed">
              {appointmentSection.conciergeNote}
              <a
                href={`tel:${contact.phone}`}
                className="text-primary font-semibold hover:text-secondary underline ml-1"
              >
                {contact.phoneDisplay}
              </a>
              .
            </p>
          </div>
        </ScrollReveal>

        {/* Right Column: Interactive Booking Experience, Track Lookup, or Confirmation */}
        <ScrollReveal
          delay={150}
          className="lg:col-span-7 bg-surface-container-lowest p-6 sm:p-8 lg:p-10 border border-outline-variant/30 shadow-sm"
        >
          {/* Mode Switcher Tabs (When not displaying immediate confirmation) */}
          {!confirmedBooking && (
            <div className="flex items-center border-b border-outline-variant/40 mb-6">
              <button
                type="button"
                onClick={() => {
                  setActiveTab('book');
                  setLookupResult(null);
                }}
                className={`pb-3 px-4 font-sans text-xs tracking-wider uppercase font-semibold border-b-2 transition-colors ${activeTab === 'book'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-outline hover:text-on-surface'
                  }`}
              >
                1. Reserve an Appointment
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('track')}
                className={`pb-3 px-4 font-sans text-xs tracking-wider uppercase font-semibold border-b-2 transition-colors flex items-center gap-1.5 ${activeTab === 'track'
                  ? 'border-secondary text-secondary'
                  : 'border-transparent text-outline hover:text-on-surface'
                  }`}
              >
                <Search className="w-3.5 h-3.5" />
                <span>2. Track My Reservation</span>
              </button>
            </div>
          )}

          {/* VIEW A: Immediate Confirmation Screen */}
          {confirmedBooking ? (
            <div className="animate-fade-in space-y-6">
              <div className="flex items-center justify-between border-b border-outline-variant/40 pb-5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-secondary-container/60 flex items-center justify-center text-secondary">
                    <CheckCircle2 className="w-6 h-6 text-secondary" />
                  </div>
                  <div>
                    <span className="font-sans text-[10px] uppercase tracking-widest text-secondary font-bold">
                      Direct Booking Confirmed
                    </span>
                    <h3 className="font-serif text-xl sm:text-2xl text-primary font-medium">
                      Your Suite is Requested
                    </h3>
                  </div>
                </div>

                {/* Status Badge */}
                <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-50 border border-amber-300 text-amber-900 text-[11px] font-sans font-semibold tracking-wide">
                  <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                  <span>Pending Atelier Confirmation</span>
                </div>
              </div>

              {/* Reference ID Banner */}
              <div className="bg-surface-container-low p-4 sm:p-5 border border-outline-variant/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <p className="font-sans text-[11px] uppercase tracking-wider text-on-surface-variant font-medium">
                    Booking Reference Code
                  </p>
                  <p className="font-serif text-2xl font-bold tracking-wider text-primary mt-0.5">
                    {confirmedBooking.id}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopyRef(confirmedBooking.id)}
                  className="btn-tactile inline-flex items-center gap-1.5 px-3.5 py-2 bg-surface text-on-surface text-xs font-sans border border-outline-variant/50 hover:bg-surface-container"
                >
                  {copiedRef ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-secondary" />
                      <span className="text-secondary font-semibold">Copied to Clipboard</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-outline" />
                      <span>Copy Reference</span>
                    </>
                  )}
                </button>
              </div>

              {/* Appointment Summary Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-sans">
                <div className="p-4 bg-surface border border-outline-variant/30 space-y-1">
                  <span className="text-[10px] uppercase tracking-wider text-outline">
                    Selected Ritual & Price
                  </span>
                  <p className="font-semibold text-primary text-sm">
                    {confirmedBooking.serviceName}
                  </p>
                  <p className="text-on-surface-variant">
                    {confirmedBooking.categoryName} · {confirmedBooking.duration} ·{' '}
                    <span className="font-bold text-secondary">{confirmedBooking.price}</span>
                  </p>
                </div>

                <div className="p-4 bg-surface border border-outline-variant/30 space-y-1">
                  <span className="text-[10px] uppercase tracking-wider text-outline">
                    Scheduled Time & Artisan
                  </span>
                  <p className="font-semibold text-primary text-sm">
                    {confirmedBooking.date} · {confirmedBooking.timeSlot}
                  </p>
                  <p className="text-on-surface-variant">{confirmedBooking.stylist}</p>
                </div>

                <div className="p-4 bg-surface border border-outline-variant/30 space-y-1 md:col-span-2">
                  <span className="text-[10px] uppercase tracking-wider text-outline">
                    Guest Information
                  </span>
                  <p className="text-on-surface font-medium">
                    {confirmedBooking.customerName} · {confirmedBooking.customerPhone} ·{' '}
                    {confirmedBooking.customerEmail}
                  </p>
                  {confirmedBooking.notes && (
                    <p className="text-on-surface-variant italic mt-1 pt-1 border-t border-outline-variant/20">
                      “{confirmedBooking.notes}”
                    </p>
                  )}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="space-y-3 pt-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Google Calendar */}
                  <a
                    href={getGoogleCalendarUrl(confirmedBooking)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-tactile inline-flex items-center justify-center gap-2 py-3 px-4 bg-surface border border-outline-variant/60 text-primary font-sans text-xs font-semibold hover:border-primary tracking-wide text-center"
                  >
                    <Calendar className="w-4 h-4 text-secondary" />
                    <span>Add to Google Calendar</span>
                    <ExternalLink className="w-3 h-3 text-outline" />
                  </a>

                  {/* WhatsApp Concierge */}
                  <a
                    href={getWhatsAppConciergeUrl(confirmedBooking)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-tactile inline-flex items-center justify-center gap-2 py-3 px-4 bg-primary text-on-primary font-sans text-xs font-semibold hover:bg-secondary tracking-wide text-center"
                  >
                    <MessageSquare className="w-4 h-4 text-secondary-fixed" />
                    <span>Chat with Concierge</span>
                    <ExternalLink className="w-3 h-3 text-secondary-fixed" />
                  </a>
                </div>

                <div className="flex justify-between items-center pt-3 border-t border-outline-variant/30">
                  <p className="text-[11px] text-outline font-sans">
                    You can track your approval status anytime using the <strong>Track Reservation</strong> tab.
                  </p>
                  <button
                    type="button"
                    onClick={handleResetForm}
                    className="inline-flex items-center gap-1.5 text-xs font-sans text-secondary font-semibold hover:underline"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>Book Another Ritual</span>
                  </button>
                </div>
              </div>
            </div>
          ) : activeTab === 'track' ? (
            /* VIEW B: Track / Look Up My Booking */
            <div className="space-y-6 animate-fade-in">
              <div>
                <h3 className="font-serif text-xl sm:text-2xl text-primary font-medium">
                  Track Reservation Status
                </h3>
                <p className="font-sans text-xs text-on-surface-variant mt-1 leading-relaxed">
                  Enter your Booking Reference Code (e.g. <code>#ATL-8492</code>) or your registered WhatsApp phone number to check live appointment confirmation.
                </p>
              </div>

              {/* Lookup Search Input */}
              <form onSubmit={handleTrackLookup} className="space-y-3">
                <div className="flex flex-col sm:flex-row gap-2">
                  <div className="relative flex-1">
                    <Search className="w-4 h-4 text-outline absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="e.g. #ATL-8492 or +91 98201 XXXXX"
                      value={lookupQuery}
                      onChange={(e) => {
                        setLookupQuery(e.target.value);
                        if (lookupError) setLookupError('');
                      }}
                      className="w-full bg-surface border border-outline-variant/60 pl-10 pr-4 py-3 text-sm font-sans placeholder:text-outline/40 focus:outline-none focus:border-primary-container"
                    />
                  </div>
                  <button
                    type="submit"
                    className="btn-tactile bg-primary-container text-on-primary px-6 py-3 text-xs font-sans font-semibold uppercase tracking-wider hover:bg-secondary shrink-0"
                  >
                    Check Status
                  </button>
                </div>

                {lookupError && (
                  <p className="text-error text-xs font-sans flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>{lookupError}</span>
                  </p>
                )}
              </form>

              {/* Lookup Result: Not Found */}
              {lookupResult === 'not_found' && (
                <div className="p-4 bg-amber-50/60 border border-amber-200 text-amber-900 text-xs font-sans space-y-1">
                  <div className="flex items-center gap-2 font-semibold">
                    <AlertCircle className="w-4 h-4 text-amber-700" />
                    <span>No Matching Reservation Found</span>
                  </div>
                  <p className="text-amber-800 leading-relaxed">
                    We could not locate an appointment matching "<strong>{lookupQuery}</strong>". Please check your reference code, or reach out to our concierge at{' '}
                    <a href={`tel:${contact.phone}`} className="underline font-semibold">
                      {contact.phoneDisplay}
                    </a>
                    .
                  </p>
                </div>
              )}

              {/* Lookup Result: Found Live Booking Card */}
              {lookupResult && lookupResult !== 'not_found' && (
                <div className="bg-surface-container-low border border-outline-variant/40 p-5 space-y-4 animate-fade-in">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-outline-variant/30 pb-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] uppercase tracking-wider text-outline font-sans">
                          Booking ID:
                        </span>
                        <span className="font-mono text-xs font-bold text-primary bg-surface px-2 py-0.5 border border-outline-variant/40">
                          {lookupResult.id}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleCopyRef(lookupResult.id)}
                          className="text-outline hover:text-primary"
                          title="Copy Reference"
                        >
                          {copiedRef ? (
                            <Check className="w-3.5 h-3.5 text-secondary" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                      <div className="flex items-center gap-2.5 mt-2">
                        <div className="w-8 h-8 rounded-full bg-secondary-container/70 flex items-center justify-center text-secondary shrink-0">
                          <User className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-[10px] uppercase tracking-wider text-outline font-sans">Client / Guest</p>
                          <h4 className="font-serif text-xl sm:text-2xl font-bold text-primary leading-tight">
                            {lookupResult.customerName}
                          </h4>
                        </div>
                      </div>
                    </div>

                    {/* Live Status Badge */}
                    <div>
                      {lookupResult.status === 'pending' && (
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-amber-50 border border-amber-300 text-amber-900 text-xs font-sans font-semibold">
                          <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                          <span>Pending Atelier Confirmation</span>
                        </div>
                      )}
                      {lookupResult.status === 'confirmed' && (
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-sans font-semibold">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          <span>Confirmed & Suite Reserved</span>
                        </div>
                      )}
                      {lookupResult.status === 'completed' && (
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-100 border border-slate-300 text-slate-800 text-xs font-sans font-semibold">
                          <CheckCircle2 className="w-4 h-4 text-slate-600" />
                          <span>Checked Out</span>
                        </div>
                      )}
                      {lookupResult.status === 'declined' && (
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-rose-50 border border-rose-300 text-rose-900 text-xs font-sans font-semibold">
                          <XCircle className="w-4 h-4 text-rose-600" />
                          <span>Declined</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Status Explanation Message */}
                  <div className="text-xs font-sans text-on-surface-variant p-3.5 bg-surface border border-outline-variant/30 leading-relaxed">
                    {lookupResult.status === 'pending' && (
                      <p>
                        ⏳ <strong>Awaiting Studio Review</strong>: Dear <strong>{lookupResult.customerName}</strong>, your appointment request has been received by our reception team and is currently awaiting slot verification. You will receive an official WhatsApp confirmation once approved.
                      </p>
                    )}
                    {lookupResult.status === 'confirmed' && (
                      <p>
                        ✨ <strong>Appointment Confirmed</strong>: Dear <strong>{lookupResult.customerName}</strong>, your suite and specialist have been reserved. Please arrive 10 minutes prior to your scheduled time to enjoy our herbal tea pairing.
                      </p>
                    )}
                    {lookupResult.status === 'completed' && (
                      <p>
                        🌿 <strong>Ritual Completed</strong>: Dear <strong>{lookupResult.customerName}</strong>, this appointment was fulfilled on {lookupResult.date}. Thank you for visiting ATELIER SALON!
                      </p>
                    )}
                    {lookupResult.status === 'declined' && (
                      <p className="text-rose-900">
                        Notice: Dear <strong>{lookupResult.customerName}</strong>, this reservation could not be accommodated.{' '}
                        {lookupResult.declineReason && (
                          <span>
                            Reason: <em>"{lookupResult.declineReason}"</em>.
                          </span>
                        )}{' '}
                        Please select an alternative date or chat with our concierge.
                      </p>
                    )}
                  </div>

                  {/* Appointment Details Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-sans">
                    <div className="p-3 bg-surface border border-outline-variant/30">
                      <span className="text-[10px] uppercase text-outline block">Ritual & Rate</span>
                      <p className="font-semibold text-primary">{lookupResult.serviceName}</p>
                      <p className="text-on-surface-variant text-[11px]">
                        {lookupResult.duration} · <strong className="text-secondary">{lookupResult.price}</strong>
                      </p>
                    </div>

                    <div className="p-3 bg-surface border border-outline-variant/30">
                      <span className="text-[10px] uppercase text-outline block">Schedule & Specialist</span>
                      <p className="font-semibold text-primary">
                        {lookupResult.date} · {lookupResult.timeSlot}
                      </p>
                      <p className="text-on-surface-variant text-[11px]">{lookupResult.stylist}</p>
                    </div>

                    <div className="p-3 bg-surface border border-outline-variant/30 sm:col-span-2 flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-secondary shrink-0 mt-0.5">
                        <User className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-[10px] uppercase text-outline block">Guest Name & Contact</span>
                        <p className="font-bold text-primary text-sm">{lookupResult.customerName}</p>
                        <p className="text-on-surface-variant text-[11px] mt-0.5">
                          WhatsApp:{' '}
                          <a href={`tel:${lookupResult.customerPhone}`} className="text-secondary underline">
                            {lookupResult.customerPhone}
                          </a>{' '}
                          · Email: {lookupResult.customerEmail}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Actions for Tracked Result */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    <a
                      href={getGoogleCalendarUrl(lookupResult)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-tactile inline-flex items-center justify-center gap-1.5 py-2.5 px-4 bg-surface border border-outline-variant/50 text-xs font-sans text-primary hover:border-primary text-center"
                    >
                      <Calendar className="w-3.5 h-3.5 text-secondary" />
                      <span>Add to Google Calendar</span>
                    </a>

                    <a
                      href={getWhatsAppConciergeUrl(lookupResult)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-tactile inline-flex items-center justify-center gap-1.5 py-2.5 px-4 bg-primary text-on-primary text-xs font-sans hover:bg-secondary text-center"
                    >
                      <MessageSquare className="w-3.5 h-3.5 text-secondary-fixed" />
                      <span>Chat with Concierge</span>
                    </a>
                  </div>
                </div>
              )}

              {/* Return to Booking Link */}
              <div className="pt-4 border-t border-outline-variant/30 text-center">
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('book');
                    setLookupResult(null);
                  }}
                  className="inline-flex items-center gap-1 text-xs font-sans text-secondary font-semibold hover:underline"
                >
                  <span>Need to make a new reservation? Click here</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ) : (
            /* VIEW C: Direct Reservation Booking Form */
            <form onSubmit={handleSubmit} noValidate className="space-y-6">
              {/* Step 1: Category & Ritual Selection */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label
                    htmlFor="service-select"
                    className="font-sans text-[10px] sm:text-[11px] uppercase tracking-widest text-secondary font-bold flex items-center gap-1.5"
                  >
                    <span>1. Desired Service / Ritual *</span>
                  </label>
                  <span className="font-sans text-[11px] text-outline">
                    {currentService ? `${currentService.duration} · ${currentService.price}` : ''}
                  </span>
                </div>

                <select
                  id="service-select"
                  required
                  value={formData.serviceId}
                  onChange={(e) => handleInputChange('serviceId', e.target.value)}
                  className={`w-full bg-surface border px-4 py-3 rounded-none text-on-surface font-sans text-sm transition-colors focus:outline-none ${errors.serviceId
                    ? 'border-error focus:border-error'
                    : 'border-outline-variant/50 focus:border-primary-container'
                    }`}
                >
                  {/* Curator's Choice */}
                  <optgroup label="Curator's Signature Rituals">
                    <option value="curators-choice">
                      Grand Scalp & Botanical Glow Synthesis (₹6,800) — 105 mins
                    </option>
                  </optgroup>

                  {/* Standard Categories */}
                  {servicesSection.categories.map((cat) => (
                    <optgroup key={cat.id} label={cat.name}>
                      {cat.items.map((item) => (
                        <option key={item.id} value={item.id}>
                          {item.name} ({item.price}) — {item.duration}
                        </option>
                      ))}
                    </optgroup>
                  ))}

                  <optgroup label="Complimentary Diagnostics">
                    <option value="consultation">
                      Initial Atelier Diagnostic Consultation (Complimentary) — 20 mins
                    </option>
                  </optgroup>
                </select>

                {/* Selected Ritual Highlight Card */}
                {currentService && (
                  <div className="mt-2.5 p-3.5 bg-surface-container-low border border-outline-variant/30 flex items-start justify-between gap-3 text-xs font-sans">
                    <div>
                      <p className="font-semibold text-primary">{currentService.name}</p>
                      {currentService.description && (
                        <p className="text-on-surface-variant text-[11px] mt-0.5 line-clamp-2">
                          {currentService.description}
                        </p>
                      )}
                    </div>
                    <div className="text-right shrink-0">
                      <span className="font-serif text-sm font-bold text-secondary block">
                        {currentService.price}
                      </span>
                      <span className="text-[10px] text-outline uppercase tracking-wider">
                        {currentService.duration}
                      </span>
                    </div>
                  </div>
                )}

                {errors.serviceId && (
                  <p className="flex items-center gap-1 text-error text-xs mt-1.5 font-sans">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>{errors.serviceId}</span>
                  </p>
                )}
              </div>

              {/* Step 2: Preferred Stylist / Specialist */}
              <div>
                <label
                  htmlFor="stylist-select"
                  className="block font-sans text-[10px] sm:text-[11px] uppercase tracking-widest text-secondary font-bold mb-2"
                >
                  2. Preferred Stylist / Specialist *
                </label>
                <select
                  id="stylist-select"
                  value={formData.stylist}
                  onChange={(e) => handleInputChange('stylist', e.target.value)}
                  className="w-full bg-surface border border-outline-variant/50 px-4 py-3 rounded-none text-on-surface font-sans text-sm transition-colors focus:outline-none focus:border-primary-container"
                >
                  {appointmentSection.specialists.map((spec) => (
                    <option key={spec.id} value={`${spec.name} (${spec.role.split('(')[0].trim()})`}>
                      {spec.name} — {spec.role}
                    </option>
                  ))}
                </select>
              </div>

              {/* Step 3: Date & Time Picker */}
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label
                      htmlFor="date-select"
                      className="font-sans text-[10px] sm:text-[11px] uppercase tracking-widest text-secondary font-bold"
                    >
                      3. Preferred Date *
                    </label>
                    {/* Quick Pick Chips */}
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleInputChange('date', todayStr)}
                        className={`px-2.5 py-1 text-[11px] font-sans transition-colors ${formData.date === todayStr
                          ? 'bg-secondary text-on-secondary font-semibold'
                          : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container'
                          }`}
                      >
                        Today
                      </button>
                      <button
                        type="button"
                        onClick={() => handleInputChange('date', tomorrowStr)}
                        className={`px-2.5 py-1 text-[11px] font-sans transition-colors ${formData.date === tomorrowStr
                          ? 'bg-secondary text-on-secondary font-semibold'
                          : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container'
                          }`}
                      >
                        Tomorrow
                      </button>
                      <button
                        type="button"
                        onClick={() => handleInputChange('date', inTwoDaysStr)}
                        className={`px-2.5 py-1 text-[11px] font-sans transition-colors ${formData.date === inTwoDaysStr
                          ? 'bg-secondary text-on-secondary font-semibold'
                          : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container'
                          }`}
                      >
                        +2 Days
                      </button>
                    </div>
                  </div>

                  <input
                    id="date-select"
                    type="date"
                    required
                    min={todayStr}
                    value={formData.date}
                    onChange={(e) => handleInputChange('date', e.target.value)}
                    className={`w-full bg-surface border px-4 py-3 rounded-none text-on-surface font-sans text-sm transition-colors focus:outline-none ${errors.date
                      ? 'border-error focus:border-error'
                      : 'border-outline-variant/50 focus:border-primary-container'
                      }`}
                  />
                  {errors.date && (
                    <p className="flex items-center gap-1 text-error text-xs mt-1.5 font-sans">
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span>{errors.date}</span>
                    </p>
                  )}
                </div>

                {/* Time Slot Selection */}
                <div>
                  <label className="block font-sans text-[10px] sm:text-[11px] uppercase tracking-widest text-secondary font-bold mb-2">
                    4. Time Window & Slot *
                  </label>

                  {/* Period Tabs: Morning, Afternoon, Evening */}
                  <div className="grid grid-cols-3 gap-2 mb-3">
                    {appointmentSection.timeSlots.map((slot) => {
                      const isSelected = formData.timePeriod === slot.period;
                      return (
                        <button
                          key={slot.id}
                          type="button"
                          onClick={() => {
                            handleInputChange('timePeriod', slot.period);
                            handleInputChange('timeSlot', slot.times[0] || '11:00 AM');
                          }}
                          className={`btn-tactile py-2.5 px-2 text-center border font-sans text-xs transition-colors ${isSelected
                            ? 'bg-primary-container text-on-primary border-primary-container font-semibold'
                            : 'bg-surface border-outline-variant/40 text-on-surface-variant hover:bg-surface-container'
                            }`}
                        >
                          <span className="block font-medium capitalize">{slot.period}</span>
                          <span className="block text-[10px] opacity-80 mt-0.5">
                            {slot.period === 'morning'
                              ? '10am - 1pm'
                              : slot.period === 'afternoon'
                                ? '1pm - 4:30pm'
                                : '4:30pm - 8pm'}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Specific Slot Timings */}
                  <div className="p-3 bg-surface-container-low border border-outline-variant/30">
                    <p className="text-[10px] uppercase tracking-wider text-outline mb-2">
                      Available arrival times for {formData.timePeriod}:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {activePeriodConfig.times.map((time) => {
                        const isChosen = formData.timeSlot === time;
                        return (
                          <button
                            key={time}
                            type="button"
                            onClick={() => handleInputChange('timeSlot', time)}
                            className={`btn-tactile px-3.5 py-1.5 text-xs font-sans border transition-colors ${isChosen
                              ? 'bg-secondary text-on-secondary border-secondary font-semibold shadow-xs'
                              : 'bg-surface text-on-surface border-outline-variant/40 hover:border-secondary'
                              }`}
                          >
                            {time}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 4: Contact Details */}
              <div className="pt-2 border-t border-outline-variant/30 space-y-4">
                <span className="block font-sans text-[10px] sm:text-[11px] uppercase tracking-widest text-secondary font-bold">
                  5. Contact Details
                </span>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Full Name */}
                  <div>
                    <label
                      htmlFor="full-name"
                      className="block font-sans text-[10px] uppercase tracking-wider text-on-surface-variant mb-1.5"
                    >
                      Full Name *
                    </label>
                    <div className="relative">
                      <input
                        id="full-name"
                        type="text"
                        required
                        placeholder="e.g. Priya Sharma"
                        value={formData.fullName}
                        onChange={(e) => handleInputChange('fullName', e.target.value)}
                        className={`w-full bg-surface border px-4 py-2.5 rounded-none text-on-surface font-sans text-sm placeholder:text-outline/40 transition-colors focus:outline-none ${errors.fullName
                          ? 'border-error focus:border-error'
                          : 'border-outline-variant/50 focus:border-primary-container'
                          }`}
                      />
                    </div>
                    {errors.fullName && (
                      <p className="flex items-center gap-1 text-error text-xs mt-1 font-sans">
                        <AlertCircle className="w-3.5 h-3.5" />
                        <span>{errors.fullName}</span>
                      </p>
                    )}
                  </div>

                  {/* Phone */}
                  <div>
                    <label
                      htmlFor="phone"
                      className="block font-sans text-[10px] uppercase tracking-wider text-on-surface-variant mb-1.5"
                    >
                      WhatsApp Phone Number *
                    </label>
                    <input
                      id="phone"
                      type="tel"
                      required
                      placeholder="+91 98201 XXXXX"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className={`w-full bg-surface border px-4 py-2.5 rounded-none text-on-surface font-sans text-sm placeholder:text-outline/40 transition-colors focus:outline-none ${errors.phone
                        ? 'border-error focus:border-error'
                        : 'border-outline-variant/50 focus:border-primary-container'
                        }`}
                    />
                    {errors.phone && (
                      <p className="flex items-center gap-1 text-error text-xs mt-1 font-sans">
                        <AlertCircle className="w-3.5 h-3.5" />
                        <span>{errors.phone}</span>
                      </p>
                    )}
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label
                    htmlFor="email"
                    className="block font-sans text-[10px] uppercase tracking-wider text-on-surface-variant mb-1.5"
                  >
                    Email Address (For Calendar Itinerary) *
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    placeholder="guest@example.com"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className={`w-full bg-surface border px-4 py-2.5 rounded-none text-on-surface font-sans text-sm placeholder:text-outline/40 transition-colors focus:outline-none ${errors.email
                      ? 'border-error focus:border-error'
                      : 'border-outline-variant/50 focus:border-primary-container'
                      }`}
                  />
                  {errors.email && (
                    <p className="flex items-center gap-1 text-error text-xs mt-1 font-sans">
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span>{errors.email}</span>
                    </p>
                  )}
                </div>

                {/* Notes */}
                <div>
                  <label
                    htmlFor="notes"
                    className="block font-sans text-[10px] uppercase tracking-wider text-on-surface-variant mb-1.5"
                  >
                    Styling Notes / Sensitivities / History (Optional)
                  </label>
                  <textarea
                    id="notes"
                    rows={2}
                    placeholder="Allergies, recent chemical treatments, fragrance preferences, or suite requests..."
                    value={formData.notes}
                    onChange={(e) => handleInputChange('notes', e.target.value)}
                    className="w-full bg-surface border border-outline-variant/50 px-4 py-2.5 rounded-none text-on-surface font-sans text-sm placeholder:text-outline/40 transition-colors focus:outline-none focus:border-primary-container"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="btn-tactile w-full inline-flex items-center justify-center gap-2 bg-primary-container text-on-primary font-sans text-xs font-semibold tracking-widest uppercase py-4 px-6 hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-secondary shadow-sm"
              >
                <span>Confirm Direct Atelier Booking</span>
                <ChevronRight className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-between text-outline text-[11px] font-sans">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-secondary" />
                  <span>Instant confirmation code · Zero card required</span>
                </span>
                <button
                  type="button"
                  onClick={() => setActiveTab('track')}
                  className="text-secondary font-semibold hover:underline"
                >
                  Track existing booking →
                </button>
              </div>
            </form>
          )}
        </ScrollReveal>
      </div>
    </section>
  );
};
