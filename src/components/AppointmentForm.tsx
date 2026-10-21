import React, { useState } from 'react';
import { CheckCircle2, Clock, MessageSquare, ExternalLink, AlertCircle } from 'lucide-react';
import { salonConfig } from '../config/salon';
import { ScrollReveal } from './ScrollReveal';

interface AppointmentFormProps {
  selectedServiceId?: string;
}

export const AppointmentForm: React.FC<AppointmentFormProps> = ({ selectedServiceId }) => {
  const { appointmentSection, contact, servicesSection } = salonConfig;

  // Flatten services list for easy selection
  const allServices = servicesSection.categories.flatMap((cat) => cat.items);

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    service: selectedServiceId || '',
    date: '',
    timeSlot: '',
    notes: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [requestDispatched, setRequestDispatched] = useState(false);

  // Sync selectedServiceId if passed from outside
  React.useEffect(() => {
    if (selectedServiceId) {
      setFormData((prev) => ({ ...prev, service: selectedServiceId }));
    }
  }, [selectedServiceId]);

  // Minimum date for booking is today
  const todayDateString = new Date().toISOString().split('T')[0];

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Please enter your full name.';
    } else if (formData.fullName.trim().length < 2) {
      newErrors.fullName = 'Full name must be at least 2 characters.';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Please enter your WhatsApp phone number.';
    } else {
      // Basic international or standard phone check (digits, spaces, plus)
      const cleanPhone = formData.phone.replace(/[^0-9xX]/g, '');
      if (cleanPhone.length < 6 || cleanPhone.length > 15) {
        newErrors.phone = 'Please enter a valid phone number.';
      }
    }

    if (!formData.service) {
      newErrors.service = 'Please select a desired service or ritual.';
    }

    if (!formData.date) {
      newErrors.date = 'Please choose a preferred date.';
    }

    if (!formData.timeSlot) {
      newErrors.timeSlot = 'Please select a preferred time slot.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    // Find service label
    const selectedServiceObj = allServices.find((s) => s.id === formData.service);
    const serviceName = selectedServiceObj
      ? `${selectedServiceObj.name} (${selectedServiceObj.price})`
      : formData.service;

    // Find time slot label
    const selectedSlotObj = appointmentSection.timeSlots.find((s) => s.id === formData.timeSlot);
    const slotLabel = selectedSlotObj ? selectedSlotObj.label : formData.timeSlot;

    // Construct human-readable message
    const messageLines = [
      `Hello ${salonConfig.name} Atelier,`,
      `I would like to request an appointment reservation:`,
      ``,
      `• Guest Name: ${formData.fullName.trim()}`,
      `• Contact Phone: ${formData.phone.trim()}`,
      `• Desired Ritual: ${serviceName}`,
      `• Preferred Date: ${formData.date}`,
      `• Preferred Time: ${slotLabel}`,
    ];

    if (formData.notes.trim()) {
      messageLines.push(`• Notes / Hair History: ${formData.notes.trim()}`);
    }

    messageLines.push(``);
    messageLines.push(`Please let me know if this slot is available for confirmation. Thank you!`);

    const fullMessage = messageLines.join('\n');
    const encodedMessage = encodeURIComponent(fullMessage);
    const whatsappUrl = `https://wa.me/${contact.whatsappNumber}?text=${encodedMessage}`;

    // Open WhatsApp in a new tab with secure attributes
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');

    // Notify user in UI that request was launched in WhatsApp
    setRequestDispatched(true);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <section id="appointment" className="py-20 sm:py-24 px-5 sm:px-6 lg:px-12 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
        {/* Left Column: Context & Guarantees */}
        <ScrollReveal className="lg:col-span-5">
          <span className="font-sans text-[10px] sm:text-[11px] uppercase tracking-widest text-secondary font-bold">
            {appointmentSection.eyebrow}
          </span>
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
              <p className="font-sans text-xs sm:text-[13px] text-on-surface font-normal">
                {appointmentSection.benefits[0]}
              </p>
            </div>
            <div className="flex items-start gap-3">
              <Clock className="w-5 h-5 text-secondary shrink-0 mt-0.5" />
              <p className="font-sans text-xs sm:text-[13px] text-on-surface font-normal">
                {appointmentSection.benefits[1]}
              </p>
            </div>
            <div className="flex items-start gap-3">
              <MessageSquare className="w-5 h-5 text-secondary shrink-0 mt-0.5" />
              <p className="font-sans text-xs sm:text-[13px] text-on-surface font-normal">
                {appointmentSection.benefits[2]}
              </p>
            </div>
          </div>

          {/* Bespoke Concierge Callout */}
          <div className="p-4 sm:p-5 border-l-2 border-secondary bg-surface-container-lowest">
            <p className="font-sans text-xs sm:text-[13px] text-outline italic font-normal leading-relaxed">
              {appointmentSection.conciergeNote}
              <a
                href={`tel:${contact.phone}`}
                className="text-primary font-medium hover:underline not-italic ml-1"
              >
                {appointmentSection.conciergePhone}
              </a>
              .
            </p>
          </div>
        </ScrollReveal>

        {/* Right Column: Appointment Form */}
        <ScrollReveal delay={150} className="lg:col-span-7 bg-surface-container-lowest p-6 sm:p-8 lg:p-12 border border-outline-variant/30">
          {requestDispatched && (
            <div className="mb-6 p-4 bg-[#E9DFD2]/60 border border-secondary/30 text-primary-container">
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-secondary shrink-0 mt-0.5" />
                <div>
                  <p className="font-sans text-xs sm:text-[13px] font-semibold">
                    Appointment Request Prepared in WhatsApp
                  </p>
                  <p className="font-sans text-xs text-on-surface-variant mt-1 leading-relaxed">
                    We have opened WhatsApp in a new tab with your details pre-filled. Please tap <strong>Send</strong> in WhatsApp to deliver the request to our concierge. Our team will verify slot availability and confirm your reservation.
                  </p>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Full Name */}
              <div>
                <label
                  htmlFor="full-name"
                  className="block font-sans text-[10px] sm:text-[11px] uppercase tracking-widest text-secondary font-bold mb-2"
                >
                  Full Name *
                </label>
                <input
                  id="full-name"
                  type="text"
                  required
                  placeholder="e.g. Full Name"
                  value={formData.fullName}
                  onChange={(e) => handleInputChange('fullName', e.target.value)}
                  className={`w-full bg-surface border px-4 py-3 rounded-none text-on-surface font-sans text-sm placeholder:text-outline/50 transition-colors focus:outline-none ${
                    errors.fullName
                      ? 'border-error focus:border-error'
                      : 'border-outline-variant/50 focus:border-primary-container'
                  }`}
                />
                {errors.fullName && (
                  <p className="flex items-center gap-1 text-error text-xs mt-1.5 font-sans">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>{errors.fullName}</span>
                  </p>
                )}
              </div>

              {/* Phone */}
              <div>
                <label
                  htmlFor="phone"
                  className="block font-sans text-[10px] sm:text-[11px] uppercase tracking-widest text-secondary font-bold mb-2"
                >
                  Phone Number (WhatsApp) *
                </label>
                <input
                  id="phone"
                  type="tel"
                  required
                  placeholder="+91 XXXXXXXXXX"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className={`w-full bg-surface border px-4 py-3 rounded-none text-on-surface font-sans text-sm placeholder:text-outline/50 transition-colors focus:outline-none ${
                    errors.phone
                      ? 'border-error focus:border-error'
                      : 'border-outline-variant/50 focus:border-primary-container'
                  }`}
                />
                {errors.phone && (
                  <p className="flex items-center gap-1 text-error text-xs mt-1.5 font-sans">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>{errors.phone}</span>
                  </p>
                )}
              </div>
            </div>

            {/* Service Selection */}
            <div>
              <label
                htmlFor="service-select"
                className="block font-sans text-[10px] sm:text-[11px] uppercase tracking-widest text-secondary font-bold mb-2"
              >
                Desired Service / Ritual *
              </label>
              <select
                id="service-select"
                required
                value={formData.service}
                onChange={(e) => handleInputChange('service', e.target.value)}
                className={`w-full bg-surface border px-4 py-3 rounded-none text-on-surface font-sans text-sm transition-colors focus:outline-none ${
                  errors.service
                    ? 'border-error focus:border-error'
                    : 'border-outline-variant/50 focus:border-primary-container'
                }`}
              >
                <option value="" disabled>
                  Select from treatment portfolio
                </option>
                {servicesSection.categories.map((cat) => (
                  <optgroup key={cat.id} label={cat.name}>
                    {cat.items.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.name} ({item.price}) — {item.duration}
                      </option>
                    ))}
                  </optgroup>
                ))}
                <option value="consultation">Initial Atelier Consultation (Complimentary)</option>
              </select>
              {errors.service && (
                <p className="flex items-center gap-1 text-error text-xs mt-1.5 font-sans">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{errors.service}</span>
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Date */}
              <div>
                <label
                  htmlFor="date-select"
                  className="block font-sans text-[10px] sm:text-[11px] uppercase tracking-widest text-secondary font-bold mb-2"
                >
                  Preferred Date *
                </label>
                <input
                  id="date-select"
                  type="date"
                  required
                  min={todayDateString}
                  value={formData.date}
                  onChange={(e) => handleInputChange('date', e.target.value)}
                  className={`w-full bg-surface border px-4 py-3 rounded-none text-on-surface font-sans text-sm transition-colors focus:outline-none ${
                    errors.date
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

              {/* Time Slot */}
              <div>
                <label
                  htmlFor="time-select"
                  className="block font-sans text-[10px] sm:text-[11px] uppercase tracking-widest text-secondary font-bold mb-2"
                >
                  Preferred Time Slot *
                </label>
                <select
                  id="time-select"
                  required
                  value={formData.timeSlot}
                  onChange={(e) => handleInputChange('timeSlot', e.target.value)}
                  className={`w-full bg-surface border px-4 py-3 rounded-none text-on-surface font-sans text-sm transition-colors focus:outline-none ${
                    errors.timeSlot
                      ? 'border-error focus:border-error'
                      : 'border-outline-variant/50 focus:border-primary-container'
                  }`}
                >
                  <option value="" disabled>
                    Select timing
                  </option>
                  {appointmentSection.timeSlots.map((slot) => (
                    <option key={slot.id} value={slot.id}>
                      {slot.label}
                    </option>
                  ))}
                </select>
                {errors.timeSlot && (
                  <p className="flex items-center gap-1 text-error text-xs mt-1.5 font-sans">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>{errors.timeSlot}</span>
                  </p>
                )}
              </div>
            </div>

            {/* Notes */}
            <div>
              <label
                htmlFor="notes"
                className="block font-sans text-[10px] sm:text-[11px] uppercase tracking-widest text-secondary font-bold mb-2"
              >
                Styling Notes or Hair History (Optional)
              </label>
              <textarea
                id="notes"
                rows={3}
                placeholder="Mention allergies, past chemical treatments, or specific stylist preference..."
                value={formData.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                className="w-full bg-surface border border-outline-variant/50 px-4 py-3 rounded-none text-on-surface font-sans text-sm placeholder:text-outline/50 transition-colors focus:outline-none focus:border-primary-container"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="btn-tactile w-full inline-flex items-center justify-center gap-2 bg-primary-container text-on-primary font-sans text-xs font-semibold tracking-widest uppercase py-4 px-6 hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-secondary"
            >
              <span>Request an Appointment</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>

            {/* Helper Notice */}
            <p className="font-sans text-xs text-center text-outline leading-relaxed">
              This request will open WhatsApp with your chosen details. The salon concierge will verify schedule availability and confirm your booking.
            </p>
          </form>
        </ScrollReveal>
      </div>
    </section>
  );
};
