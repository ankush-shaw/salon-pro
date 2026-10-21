import React from 'react';
import { MapPin, ArrowRight } from 'lucide-react';
import { salonConfig } from '../config/salon';

export const Hero: React.FC = () => {
  const { hero } = salonConfig;

  return (
    <section
      id="hero"
      className="relative pt-10 pb-16 sm:pt-14 sm:pb-20 lg:pt-20 lg:pb-32 px-5 sm:px-6 lg:px-12 max-w-7xl mx-auto overflow-hidden"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-10 items-center">
        {/* Left Editorial Column (7 cols) */}
        <div className="lg:col-span-7 flex flex-col justify-center">
          <div className="flex items-center gap-3 mb-4 sm:mb-6 animate-hero-eyebrow">
            <span className="h-px w-8 bg-secondary" aria-hidden="true" />
            <span className="font-sans text-[10px] sm:text-[11px] uppercase tracking-widest text-secondary font-bold">
              {hero.eyebrow}
            </span>
          </div>

          <h1 className="font-serif text-4xl sm:text-5xl lg:text-[64px] lg:leading-[72px] text-primary tracking-tight mb-6 sm:mb-8 font-normal animate-hero-title">
            {hero.title}
          </h1>

          <p className="font-sans text-base sm:text-lg lg:text-[19px] lg:leading-[32px] text-on-surface-variant max-w-xl mb-8 sm:mb-10 leading-relaxed font-normal animate-hero-desc">
            {hero.description}
          </p>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 sm:gap-5 mb-10 sm:mb-12 animate-hero-cta">
            <a
              href={hero.primaryCta.href}
              className="btn-tactile inline-flex items-center justify-center gap-2 bg-primary-container text-on-primary font-sans text-xs font-semibold tracking-widest uppercase px-7 sm:px-8 py-3.5 sm:py-4 hover:bg-secondary text-center shadow-none focus:outline-none focus:ring-2 focus:ring-secondary"
            >
              <span>{hero.primaryCta.text}</span>
              <ArrowRight className="w-3.5 h-3.5 sm:hidden" />
            </a>
            <a
              href={hero.secondaryCta.href}
              className="btn-tactile inline-flex items-center justify-center border border-primary-container text-primary-container font-sans text-xs font-semibold tracking-widest uppercase px-7 sm:px-8 py-3.5 sm:py-4 hover:bg-primary-container hover:text-surface text-center focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {hero.secondaryCta.text}
            </a>
          </div>

          <div className="pt-6 sm:pt-8 border-t border-outline-variant/40 flex flex-wrap items-center gap-3 text-on-surface-variant text-xs sm:text-[13px] animate-hero-badge">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-secondary shrink-0" />
              <span className="font-sans uppercase tracking-wider font-medium text-on-surface">
                {hero.locationBadge}
              </span>
            </div>
            <span className="text-outline-variant hidden sm:inline" aria-hidden="true">·</span>
            <span className="font-sans text-outline italic">
              {hero.policyBadge}
            </span>
          </div>
        </div>

        {/* Right Editorial Visual (5 cols) */}
        <div className="lg:col-span-5 relative animate-hero-image">
          <div className="relative bg-surface-container-high p-2.5 sm:p-3 border border-outline-variant/30">
            <div className="aspect-[4/5] overflow-hidden relative bg-surface">
              <img
                src={hero.image.src}
                alt={hero.image.alt}
                loading="eager"
                fetchPriority="high"
                decoding="async"
                width="480"
                height="600"
                className="w-full h-full object-cover grayscale-[15%] contrast-[105%]"
              />
            </div>
            <div className="mt-3 flex justify-between items-center px-1">
              <span className="font-sans text-[10px] sm:text-[11px] uppercase tracking-widest text-on-surface-variant font-medium">
                {hero.image.suiteNumber}
              </span>
              <span className="font-sans text-xs text-outline italic">
                {hero.image.volumeTag}
              </span>
            </div>
          </div>

          {/* Decorative geometric frame accent */}
          <div
            className="absolute -bottom-6 -left-6 w-32 h-32 border border-secondary/30 -z-10 hidden sm:block"
            aria-hidden="true"
          />
        </div>
      </div>
    </section>
  );
};
