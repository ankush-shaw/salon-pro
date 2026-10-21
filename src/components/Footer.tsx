import React, { useState } from 'react';
import { salonConfig } from '../config/salon';

export const Footer: React.FC = () => {
  const { footer, contact } = salonConfig;
  const [subscribedEmail, setSubscribedEmail] = useState('');
  const [subscriptionSubmitted, setSubscriptionSubmitted] = useState(false);

  const handleJournalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (subscribedEmail.trim()) {
      setSubscriptionSubmitted(true);
      setSubscribedEmail('');
    }
  };

  return (
    <footer className="bg-primary text-on-primary border-t border-primary-container">
      <div className="w-full px-5 sm:px-6 lg:px-16 py-14 sm:py-16 max-w-7xl mx-auto flex flex-col gap-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          {/* Brand & Address Column (5 cols) */}
          <div className="md:col-span-5 space-y-4">
            <span className="font-serif text-2xl sm:text-[28px] tracking-widest uppercase text-on-primary block font-medium">
              {salonConfig.name}
            </span>
            <p className="font-sans text-xs sm:text-[13px] text-primary-fixed-dim max-w-sm leading-relaxed font-normal">
              {footer.description}
            </p>
            <div className="pt-2 text-primary-fixed-dim font-sans text-xs sm:text-[13px] leading-relaxed">
              <p>{contact.address.full}</p>
              <p className="mt-1">
                {contact.openingHours[0]?.days}: {contact.openingHours[0]?.hours}
              </p>
            </div>
          </div>

          {/* Navigation Column (3 cols) */}
          <div className="md:col-span-3 space-y-3">
            <p className="font-sans text-[11px] font-semibold tracking-widest uppercase text-secondary-fixed">
              Navigation
            </p>
            <ul className="space-y-2 font-sans text-xs sm:text-[13px]">
              <li>
                <a
                  href="#services"
                  className="text-primary-fixed-dim hover:text-secondary-fixed transition-colors duration-200"
                >
                  Treatments & Rituals
                </a>
              </li>
              <li>
                <a
                  href="#philosophy"
                  className="text-primary-fixed-dim hover:text-secondary-fixed transition-colors duration-200"
                >
                  Editorial Philosophy
                </a>
              </li>
              <li>
                <a
                  href="#gallery"
                  className="text-primary-fixed-dim hover:text-secondary-fixed transition-colors duration-200"
                >
                  Visual Diary & Space
                </a>
              </li>
              <li>
                <a
                  href="#appointment"
                  className="text-primary-fixed-dim hover:text-secondary-fixed transition-colors duration-200"
                >
                  Atelier & Booking
                </a>
              </li>
              <li>
                <a
                  href="#faq"
                  className="text-primary-fixed-dim hover:text-secondary-fixed transition-colors duration-200"
                >
                  FAQ & Inquiries
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter Column (4 cols) */}
          <div className="md:col-span-4 space-y-3">
            <p className="font-sans text-[11px] font-semibold tracking-widest uppercase text-secondary-fixed">
              {footer.journalTitle}
            </p>
            <p className="font-sans text-xs sm:text-[13px] text-primary-fixed-dim leading-relaxed">
              {footer.journalDescription}
            </p>

            {subscriptionSubmitted ? (
              <p className="font-sans text-xs text-secondary-fixed pt-2">
                Thank you. You have been added to the private journal list.
              </p>
            ) : (
              <form onSubmit={handleJournalSubmit} className="flex items-center gap-2 pt-2">
                <input
                  id="footer-email"
                  type="email"
                  aria-label="Your email address"
                  required
                  placeholder="Your email address"
                  value={subscribedEmail}
                  onChange={(e) => setSubscribedEmail(e.target.value)}
                  className="bg-inverse-surface border border-outline/30 text-on-primary text-xs sm:text-[13px] px-4 py-2.5 w-full rounded-none focus:outline-none focus:border-secondary transition-colors placeholder:text-outline-variant/60 font-sans"
                />
                <button
                  type="submit"
                  className="btn-tactile bg-secondary text-on-secondary px-5 py-2.5 font-sans text-xs font-semibold uppercase tracking-wider hover:bg-secondary-container hover:text-on-secondary-container transition-colors shrink-0"
                >
                  Join
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-primary-container pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-primary-fixed-dim font-sans text-xs">
          <p>{footer.copyright}</p>
          <div className="flex gap-6">
            <a href="#hero" className="hover:text-secondary-fixed transition-colors">
              Privacy Policy
            </a>
            <a href="#hero" className="hover:text-secondary-fixed transition-colors">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
