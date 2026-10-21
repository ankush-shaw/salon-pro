import React, { useState } from 'react';
import { X } from 'lucide-react';
import { salonConfig } from '../config/salon';

export const AnnouncementBar: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true);

  if (!salonConfig.announcementBar.enabled || !isVisible) {
    return null;
  }

  return (
    <aside
      id="announcement-bar"
      className="w-full bg-[#E9DFD2] text-primary-container border-b border-outline-variant/30 py-2.5 px-4 sm:px-6 transition-all duration-300 relative z-50"
      aria-label="Announcement"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="w-6 hidden md:block" aria-hidden="true" />
        <div className="flex items-center justify-center gap-2 text-center mx-auto">
          <span className="w-1.5 h-1.5 rounded-full bg-secondary shrink-0" aria-hidden="true" />
          <p className="font-sans text-[11px] sm:text-[12px] font-semibold tracking-widest uppercase text-on-surface-variant">
            {salonConfig.announcementBar.text}
          </p>
        </div>
        <button
          type="button"
          aria-label="Dismiss banner"
          onClick={() => setIsVisible(false)}
          className="text-on-surface-variant hover:text-primary transition-colors p-1 shrink-0 focus:outline-none focus:ring-1 focus:ring-primary"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </aside>
  );
};
