import React, { useState, useEffect } from 'react';
import { Calendar, Menu, X, Phone } from 'lucide-react';
import { salonConfig } from '../config/salon';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');

  // Track scroll position to highlight active section
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['hero', 'services', 'philosophy', 'gallery', 'atelier', 'contact', 'appointment'];
      const scrollY = window.scrollY + 120;

      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollY >= top && scrollY < top + height) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const closeMenu = () => setMobileMenuOpen(false);

  return (
    <header className="sticky top-0 z-40 bg-surface/90 backdrop-blur-md border-b border-outline-variant/30 transition-all duration-200">
      <nav
        className="flex justify-between items-center w-full px-5 sm:px-6 lg:px-12 py-3.5 sm:py-4 max-w-7xl mx-auto"
        aria-label="Main Navigation"
      >
        {/* Brand Wordmark & Identity */}
        <a
          href="#hero"
          className="group flex flex-col focus:outline-none focus:ring-1 focus:ring-primary py-0.5"
          onClick={closeMenu}
        >
          <span className="font-serif text-2xl sm:text-[24px] tracking-wider uppercase text-primary font-medium leading-none">
            {salonConfig.name}
          </span>
          <span className="font-sans text-[9px] sm:text-[10px] tracking-widest text-secondary mt-1 font-semibold">
            {salonConfig.subTitle}
          </span>
        </a>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-7 lg:gap-8">
          <a
            href="#hero"
            className={`font-sans text-[13px] tracking-widest uppercase transition-colors duration-200 pb-1 ${
              activeSection === 'hero'
                ? 'text-primary font-semibold border-b border-primary'
                : 'text-on-surface-variant hover:text-secondary'
            }`}
          >
            Home
          </a>
          <a
            href="#services"
            className={`font-sans text-[13px] tracking-widest uppercase transition-colors duration-200 pb-1 ${
              activeSection === 'services'
                ? 'text-primary font-semibold border-b border-primary'
                : 'text-on-surface-variant hover:text-secondary'
            }`}
          >
            Treatments
          </a>
          <a
            href="#philosophy"
            className={`font-sans text-[13px] tracking-widest uppercase transition-colors duration-200 pb-1 ${
              activeSection === 'philosophy'
                ? 'text-primary font-semibold border-b border-primary'
                : 'text-on-surface-variant hover:text-secondary'
            }`}
          >
            Philosophy
          </a>
          <a
            href="#gallery"
            className={`font-sans text-[13px] tracking-widest uppercase transition-colors duration-200 pb-1 ${
              activeSection === 'gallery'
                ? 'text-primary font-semibold border-b border-primary'
                : 'text-on-surface-variant hover:text-secondary'
            }`}
          >
            Gallery
          </a>
          <a
            href="#atelier"
            className={`font-sans text-[13px] tracking-widest uppercase transition-colors duration-200 pb-1 ${
              activeSection === 'atelier'
                ? 'text-primary font-semibold border-b border-primary'
                : 'text-on-surface-variant hover:text-secondary'
            }`}
          >
            Atelier
          </a>
          <a
            href="#contact"
            className={`font-sans text-[13px] tracking-widest uppercase transition-colors duration-200 pb-1 ${
              activeSection === 'contact'
                ? 'text-primary font-semibold border-b border-primary'
                : 'text-on-surface-variant hover:text-secondary'
            }`}
          >
            Contact
          </a>
        </div>

        {/* Action Cluster */}
        <div className="flex items-center gap-3 sm:gap-4">
          <a
            href="#appointment"
            className="btn-tactile inline-flex items-center gap-2 bg-primary-container text-on-primary font-sans text-xs sm:text-[12px] font-semibold tracking-widest uppercase px-4 sm:px-5 py-2.5 sm:py-3 hover:bg-secondary shadow-none focus:outline-none focus:ring-1 focus:ring-secondary"
          >
            <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-secondary-container" />
            <span className="hidden xs:inline">Reserve Appointment</span>
            <span className="xs:hidden">Reserve</span>
          </a>

          {/* Mobile Menu Toggle Button */}
          <button
            type="button"
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-nav-drawer"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-primary p-2 focus:outline-none focus:ring-1 focus:ring-primary -mr-1 transition-transform duration-200 active:scale-95"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer Menu */}
      <div
        id="mobile-nav-drawer"
        className={`md:hidden grid transition-[grid-template-rows,opacity] duration-300 ease-in-out border-t border-outline-variant/30 bg-surface ${
          mobileMenuOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0 pointer-events-none'
        }`}
      >
        <div className="overflow-hidden">
          <div className="px-6 py-6 flex flex-col gap-4 font-sans text-xs tracking-widest uppercase text-on-surface-variant">
          <a
            href="#hero"
            onClick={closeMenu}
            className="block py-2 text-primary font-semibold border-b border-outline-variant/20 hover:text-secondary transition-colors"
          >
            Home
          </a>
          <a
            href="#services"
            onClick={closeMenu}
            className="block py-2 text-primary font-semibold border-b border-outline-variant/20 hover:text-secondary transition-colors"
          >
            Treatments & Rituals
          </a>
          <a
            href="#philosophy"
            onClick={closeMenu}
            className="block py-2 hover:text-primary transition-colors border-b border-outline-variant/20"
          >
            Editorial Philosophy
          </a>
          <a
            href="#gallery"
            onClick={closeMenu}
            className="block py-2 hover:text-primary transition-colors border-b border-outline-variant/20"
          >
            Visual Diary & Gallery
          </a>
          <a
            href="#atelier"
            onClick={closeMenu}
            className="block py-2 hover:text-primary transition-colors border-b border-outline-variant/20"
          >
            Atelier & Studio
          </a>
          <a
            href="#contact"
            onClick={closeMenu}
            className="block py-2 hover:text-primary transition-colors border-b border-outline-variant/20"
          >
            Contact & Directions
          </a>
          <a
            href="#appointment"
            onClick={closeMenu}
            className="block py-2.5 bg-primary-container text-on-primary text-center font-semibold tracking-widest mt-2 hover:bg-secondary transition-colors"
          >
            Reserve an Appointment
          </a>

          {/* Quick info in drawer */}
          <div className="mt-4 pt-4 border-t border-outline-variant/20 flex flex-col sm:flex-row sm:items-center justify-between text-[11px] text-on-surface-variant font-normal normal-case gap-2">
            <span>{salonConfig.contact.address.area}, {salonConfig.contact.address.city}</span>
            <a
              href={`tel:${salonConfig.contact.phone}`}
              className="inline-flex items-center gap-1.5 text-secondary font-medium hover:underline"
            >
              <Phone className="w-3 h-3" />
              <span>{salonConfig.contact.phoneDisplay}</span>
            </a>
          </div>
        </div>
        </div>
      </div>
    </header>
  );
};
