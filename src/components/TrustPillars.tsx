import React from 'react';
import { Sparkles, Scissors, HeartHandshake } from 'lucide-react';
import { salonConfig } from '../config/salon';
import { ScrollReveal } from './ScrollReveal';

export const TrustPillars: React.FC = () => {
  const { trustPillars } = salonConfig;

  const renderIcon = (icon: string) => {
    switch (icon) {
      case 'spa':
        return <Sparkles className="w-6 h-6 text-secondary mb-3" />;
      case 'scissors':
        return <Scissors className="w-6 h-6 text-secondary mb-3" />;
      default:
        return <HeartHandshake className="w-6 h-6 text-secondary mb-3" />;
    }
  };

  return (
    <section className="bg-surface-container-low border-y border-outline-variant/30 py-16 sm:py-20 px-5 sm:px-6 lg:px-12">
      <div className="max-w-5xl mx-auto text-center">
        <ScrollReveal>
          <p className="font-sans text-[10px] sm:text-[11px] uppercase tracking-widest text-secondary font-bold mb-3 sm:mb-4">
            {trustPillars.eyebrow}
          </p>

          <blockquote className="font-serif text-2xl sm:text-3xl lg:text-[42px] lg:leading-[52px] text-primary mb-12 sm:mb-16 italic font-light max-w-4xl mx-auto">
            {trustPillars.guidingPrincipleQuote}
          </blockquote>
        </ScrollReveal>

        <ScrollReveal delay={150}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-0 divide-y md:divide-y-0 md:divide-x divide-outline-variant/40 pt-4">
            {trustPillars.pillars.map((pillar) => (
              <div key={pillar.id} className="flex flex-col items-center px-4 sm:px-6 py-4">
                {renderIcon(pillar.icon)}
                <h2 className="font-serif text-lg sm:text-[20px] text-primary font-medium mb-2">
                  {pillar.title}
                </h2>
                <p className="font-sans text-xs sm:text-[13px] text-on-surface-variant max-w-xs leading-relaxed font-normal">
                  {pillar.description}
                </p>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};
