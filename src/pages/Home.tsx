import React, { useState } from 'react';
import { AnnouncementBar } from '../components/AnnouncementBar';
import { Navbar } from '../components/Navbar';
import { Hero } from '../components/Hero';
import { TrustPillars } from '../components/TrustPillars';
import { Services } from '../components/Services';
import { About } from '../components/About';
import { Gallery } from '../components/Gallery';
import { Testimonials } from '../components/Testimonials';
import { AppointmentForm } from '../components/AppointmentForm';
import { Contact } from '../components/Contact';
import { FAQ } from '../components/FAQ';
import { Footer } from '../components/Footer';
import { WhatsAppButton } from '../components/WhatsAppButton';

export const Home: React.FC = () => {
  const [selectedServiceId, setSelectedServiceId] = useState<string | undefined>(undefined);

  const handleSelectService = (serviceId: string) => {
    setSelectedServiceId(serviceId);
  };

  return (
    <div className="min-h-screen bg-background text-on-surface antialiased flex flex-col">
      {/* 1. Announcement Bar */}
      <AnnouncementBar />

      {/* 2. Sticky Navigation Header */}
      <Navbar />

      {/* Main Content Flows */}
      <main className="flex-1">
        {/* 3. Hero Section */}
        <Hero />

        {/* 4. Trust & Brand Guiding Principles */}
        <TrustPillars />

        {/* 5. Services & Pricing Portfolio */}
        <Services onSelectService={handleSelectService} />

        {/* 6. Philosophy & About The Salon */}
        <About />

        {/* 7. Featured Gallery / Visual Diary */}
        <Gallery />

        {/* 8. Client Testimonials */}
        <Testimonials />

        {/* 9. Appointment Booking via WhatsApp */}
        <AppointmentForm selectedServiceId={selectedServiceId} />

        {/* 10. Studio Location & Contact */}
        <Contact />

        {/* 11. FAQ Accordion */}
        <FAQ />
      </main>

      {/* 12. Footer */}
      <Footer />

      {/* 13. Floating WhatsApp Concierge Action */}
      <WhatsAppButton />
    </div>
  );
};
