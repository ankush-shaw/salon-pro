import React from 'react';
import { salonConfig } from '../config/salon';
import { ScrollReveal } from './ScrollReveal';

export const About: React.FC = () => {
  const { aboutSection } = salonConfig;

  return (
    <section
      id="philosophy"
      className="bg-surface-container py-20 sm:py-24 px-5 sm:px-6 lg:px-12 border-t border-outline-variant/30"
    >
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
        {/* Left Column (6 cols): Visual + Quote card */}
        <ScrollReveal className="lg:col-span-6 relative">
          <div className="aspect-[4/5] bg-surface overflow-hidden border border-outline-variant/30 relative">
            <img
              src={aboutSection.image.src}
              alt={aboutSection.image.alt}
              loading="lazy"
              decoding="async"
              width="600"
              height="750"
              className="w-full h-full object-cover transition-transform duration-700 ease-out hover:scale-[1.02]"
            />
          </div>

          {/* Floating editorial quote card */}
          <div className="absolute -bottom-6 -right-6 sm:-bottom-8 sm:-right-8 bg-surface-container-lowest p-5 sm:p-6 border border-outline-variant/40 shadow-sm max-w-xs hidden sm:block">
            <p className="font-serif text-lg sm:text-[20px] text-primary italic font-normal leading-snug">
              {aboutSection.quote}
            </p>
            <p className="font-sans text-[10px] sm:text-[11px] uppercase tracking-widest text-secondary mt-2 font-semibold">
              — {aboutSection.quoteAuthor}
            </p>
          </div>
        </ScrollReveal>

        {/* Right Column (6 cols): Story & Philosophy */}
        <ScrollReveal delay={150} className="lg:col-span-6 flex flex-col justify-center">
          <span className="font-sans text-[10px] sm:text-[11px] uppercase tracking-widest text-secondary font-bold mb-3">
            {aboutSection.eyebrow}
          </span>

          <h2 className="font-serif text-3xl sm:text-4xl lg:text-[46px] lg:leading-[54px] text-primary mb-6 font-normal">
            {aboutSection.title}
          </h2>

          <div className="space-y-4 text-on-surface-variant font-sans text-sm sm:text-base leading-relaxed font-normal">
            {aboutSection.paragraphs.map((p, idx) => (
              <p key={idx}>{p}</p>
            ))}
          </div>

          {/* Highlights & Guarantees */}
          <div className="mt-8 pt-8 border-t border-outline-variant/30 flex items-center gap-8">
            {aboutSection.highlights.map((highlight, idx) => (
              <React.Fragment key={idx}>
                {idx > 0 && <div className="w-px h-10 bg-outline-variant/40" aria-hidden="true" />}
                <div>
                  <p className="font-serif text-2xl sm:text-[24px] text-primary font-medium">
                    {highlight.value}
                  </p>
                  <p className="font-sans text-xs sm:text-[12px] uppercase tracking-wider text-outline font-medium">
                    {highlight.label}
                  </p>
                </div>
              </React.Fragment>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};
