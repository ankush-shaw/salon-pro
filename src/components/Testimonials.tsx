import React from 'react';
import { Star } from 'lucide-react';
import { salonConfig } from '../config/salon';
import { ScrollReveal } from './ScrollReveal';

export const Testimonials: React.FC = () => {
  const { testimonialsSection } = salonConfig;

  return (
    <section className="bg-surface-container-low py-20 sm:py-24 px-5 sm:px-6 lg:px-12 border-y border-outline-variant/30">
      <div className="max-w-7xl mx-auto">
        <ScrollReveal className="text-center max-w-xl mx-auto mb-12 sm:mb-16">
          <span className="font-sans text-[10px] sm:text-[11px] uppercase tracking-widest text-secondary font-bold">
            {testimonialsSection.eyebrow}
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-[46px] lg:leading-[54px] text-primary mt-2 font-normal">
            {testimonialsSection.title}
          </h2>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {testimonialsSection.items.map((item, idx) => (
            <ScrollReveal
              key={item.id}
              delay={idx * 100}
              className="bg-surface-container-lowest p-6 sm:p-8 border border-outline-variant/30 flex flex-col justify-between transition-colors duration-200 hover:border-outline-variant/60"
            >
              <div>
                <div role="img" aria-label={`${item.rating} out of 5 stars`} className="flex gap-1 text-secondary mb-5 sm:mb-6">
                  {Array.from({ length: item.rating }).map((_, i) => (
                    <Star key={i} aria-hidden="true" className="w-3.5 h-3.5 fill-current text-secondary" />
                  ))}
                </div>
                <p className="font-sans text-xs sm:text-[14px] text-on-surface-variant leading-relaxed italic mb-6 font-normal">
                  {item.quote}
                </p>
              </div>

              <div className="pt-5 sm:pt-6 border-t border-outline-variant/20">
                <p className="font-serif text-base text-primary font-medium">
                  {item.name}
                </p>
                <p className="font-sans text-xs text-outline font-normal mt-0.5">
                  {item.role}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};
