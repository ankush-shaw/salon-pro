import React from 'react';
import { Sparkles } from 'lucide-react';
import { salonConfig } from '../config/salon';
import { ScrollReveal } from './ScrollReveal';

export const Gallery: React.FC = () => {
  const { gallerySection } = salonConfig;

  const item1 = gallerySection.items.find((i) => i.id === 'look-01');
  const item2 = gallerySection.items.find((i) => i.id === 'craft');
  const item3 = gallerySection.items.find((i) => i.id === 'interior');
  const item4 = gallerySection.items.find((i) => i.id === 'skincare');
  const item5 = gallerySection.items.find((i) => i.id === 'styling');

  return (
    <section id="gallery" className="py-20 sm:py-24 px-5 sm:px-6 lg:px-12 max-w-7xl mx-auto">
      {/* Header */}
      <ScrollReveal className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
        <span className="font-sans text-[10px] sm:text-[11px] uppercase tracking-widest text-secondary font-bold">
          {gallerySection.eyebrow}
        </span>
        <h2 className="font-serif text-3xl sm:text-4xl lg:text-[46px] lg:leading-[54px] text-primary mt-2 font-normal">
          {gallerySection.title}
        </h2>
        <p className="font-sans text-sm sm:text-base text-on-surface-variant mt-3 font-normal">
          {gallerySection.subtitle}
        </p>
      </ScrollReveal>

      {/* Asymmetrical Editorial Mosaic Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        {/* Column 1: 5 cols */}
        <ScrollReveal delay={100} className="md:col-span-5 space-y-6">
          {item1 && (
            <div className="bg-surface-container-high border border-outline-variant/30 overflow-hidden group">
              <div className="aspect-[3/4] overflow-hidden bg-surface">
                <img
                  src={item1.src}
                  alt={item1.alt}
                  loading="lazy"
                  decoding="async"
                  width="600"
                  height="800"
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04] will-change-transform"
                />
              </div>
              <div className="p-4 bg-surface-container-lowest flex justify-between items-center">
                <span className="font-sans text-xs sm:text-[13px] font-semibold text-primary">
                  {item1.title}
                </span>
                <span className="font-sans text-[11px] text-secondary uppercase font-medium">
                  {item1.tag}
                </span>
              </div>
            </div>
          )}

          {item2 && (
            <div className="bg-surface-container-high border border-outline-variant/30 overflow-hidden group">
              <div className="aspect-square overflow-hidden bg-surface">
                <img
                  src={item2.src}
                  alt={item2.alt}
                  loading="lazy"
                  decoding="async"
                  width="600"
                  height="600"
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04] will-change-transform"
                />
              </div>
              <div className="p-4 bg-surface-container-lowest flex justify-between items-center">
                <span className="font-sans text-xs sm:text-[13px] font-semibold text-primary">
                  {item2.title}
                </span>
                <span className="font-sans text-[11px] text-secondary uppercase font-medium">
                  {item2.tag}
                </span>
              </div>
            </div>
          )}
        </ScrollReveal>

        {/* Column 2: 3 cols (Offset vertically on md+) */}
        <ScrollReveal delay={200} className="md:col-span-3 space-y-6 pt-0 md:pt-12">
          {item3 && (
            <div className="bg-surface-container-high border border-outline-variant/30 overflow-hidden group">
              <div className="aspect-[2/3] overflow-hidden bg-surface">
                <img
                  src={item3.src}
                  alt={item3.alt}
                  loading="lazy"
                  decoding="async"
                  width="600"
                  height="900"
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04] will-change-transform"
                />
              </div>
              <div className="p-4 bg-surface-container-lowest flex justify-between items-center">
                <span className="font-sans text-xs sm:text-[13px] font-semibold text-primary">
                  {item3.title}
                </span>
                <span className="font-sans text-[11px] text-secondary uppercase font-medium">
                  {item3.tag}
                </span>
              </div>
            </div>
          )}

          <div className="p-6 bg-[#E9DFD2]/60 border border-outline-variant/30 text-center flex flex-col items-center justify-center">
            <Sparkles className="w-6 h-6 text-secondary mb-2" />
            <p className="font-serif text-lg text-primary font-medium">
              {gallerySection.highlightCard.title}
            </p>
            <p className="font-sans text-xs sm:text-[13px] text-on-surface-variant mt-2 leading-relaxed">
              {gallerySection.highlightCard.description}
            </p>
          </div>
        </ScrollReveal>

        {/* Column 3: 4 cols */}
        <ScrollReveal delay={300} className="md:col-span-4 space-y-6">
          {item4 && (
            <div className="bg-surface-container-high border border-outline-variant/30 overflow-hidden group">
              <div className="aspect-square overflow-hidden bg-surface">
                <img
                  src={item4.src}
                  alt={item4.alt}
                  loading="lazy"
                  decoding="async"
                  width="600"
                  height="600"
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04] will-change-transform"
                />
              </div>
              <div className="p-4 bg-surface-container-lowest flex justify-between items-center">
                <span className="font-sans text-xs sm:text-[13px] font-semibold text-primary">
                  {item4.title}
                </span>
                <span className="font-sans text-[11px] text-secondary uppercase font-medium">
                  {item4.tag}
                </span>
              </div>
            </div>
          )}

          {item5 && (
            <div className="bg-surface-container-high border border-outline-variant/30 overflow-hidden group">
              <div className="aspect-[4/5] overflow-hidden bg-surface">
                <img
                  src={item5.src}
                  alt={item5.alt}
                  loading="lazy"
                  decoding="async"
                  width="600"
                  height="750"
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04] will-change-transform"
                />
              </div>
              <div className="p-4 bg-surface-container-lowest flex justify-between items-center">
                <span className="font-sans text-xs sm:text-[13px] font-semibold text-primary">
                  {item5.title}
                </span>
                <span className="font-sans text-[11px] text-secondary uppercase font-medium">
                  {item5.tag}
                </span>
              </div>
            </div>
          )}
        </ScrollReveal>
      </div>
    </section>
  );
};
