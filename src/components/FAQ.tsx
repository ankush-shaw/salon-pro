import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { salonConfig } from '../config/salon';
import { ScrollReveal } from './ScrollReveal';

export const FAQ: React.FC = () => {
  const { faqSection } = salonConfig;
  const [openIndices, setOpenIndices] = useState<number[]>([]);

  const toggleIndex = (index: number) => {
    setOpenIndices((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  return (
    <section id="faq" className="py-20 sm:py-24 px-5 sm:px-6 lg:px-12 max-w-4xl mx-auto">
      <ScrollReveal className="text-center mb-12 sm:mb-16">
        <span className="font-sans text-[10px] sm:text-[11px] uppercase tracking-widest text-secondary font-bold">
          {faqSection.eyebrow}
        </span>
        <h2 className="font-serif text-3xl sm:text-4xl lg:text-[46px] lg:leading-[54px] text-primary mt-2 font-normal">
          {faqSection.title}
        </h2>
      </ScrollReveal>

      <ScrollReveal delay={100} className="space-y-4">
        {faqSection.items.map((item, index) => {
          const isOpen = openIndices.includes(index);
          const controlId = `faq-control-${index}`;
          const panelId = `faq-panel-${index}`;

          return (
            <div
              key={index}
              className="bg-surface-container-lowest border border-outline-variant/30 transition-all"
            >
              <button
                type="button"
                id={controlId}
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => toggleIndex(index)}
                className="w-full flex justify-between items-center p-5 sm:p-6 text-left cursor-pointer select-none font-serif text-base sm:text-lg text-primary font-medium focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <span className="pr-4">{item.question}</span>
                <ChevronDown
                  className={`w-5 h-5 text-secondary shrink-0 transition-transform duration-300 ${
                    isOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              <div
                id={panelId}
                role="region"
                aria-labelledby={controlId}
                className={`grid transition-[grid-template-rows,opacity] duration-300 ease-in-out ${
                  isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0 pointer-events-none'
                }`}
              >
                <div className="overflow-hidden">
                  <div className="px-5 sm:px-6 pb-6 pt-2 border-t border-outline-variant/10 text-on-surface-variant font-sans text-xs sm:text-[14px] leading-relaxed font-normal">
                    {item.answer}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </ScrollReveal>
    </section>
  );
};
