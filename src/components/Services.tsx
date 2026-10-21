import React, { useState } from 'react';
import { ArrowRight, CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react';
import { salonConfig } from '../config/salon';
import { ScrollReveal } from './ScrollReveal';

interface ServicesProps {
  onSelectService?: (serviceId: string) => void;
}

export const Services: React.FC<ServicesProps> = ({ onSelectService }) => {
  const { servicesSection } = salonConfig;
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const handleReserveClick = (serviceId: string) => {
    if (onSelectService) {
      onSelectService(serviceId);
    }
  };

  const hairCategory = servicesSection.categories.find((c) => c.id === 'hair');
  const skinCategory = servicesSection.categories.find((c) => c.id === 'skin');
  const beautyCategory = servicesSection.categories.find((c) => c.id === 'beauty');
  const groomingCategory = servicesSection.categories.find((c) => c.id === 'grooming');

  const showHair = selectedCategory === 'all' || selectedCategory === 'hair';
  const showSkin = selectedCategory === 'all' || selectedCategory === 'skin';
  const showBeauty = selectedCategory === 'all' || selectedCategory === 'beauty';
  const showGrooming = selectedCategory === 'all' || selectedCategory === 'grooming';

  return (
    <section id="services" className="py-20 sm:py-24 px-5 sm:px-6 lg:px-12 max-w-7xl mx-auto">
      {/* Section Header */}
      <ScrollReveal className="flex flex-col md:flex-row md:items-end justify-between mb-10 sm:mb-12 pb-6 border-b border-outline-variant/30">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="h-px w-6 bg-secondary" aria-hidden="true" />
            <span className="font-sans text-[10px] sm:text-[11px] uppercase tracking-widest text-secondary font-bold">
              {servicesSection.eyebrow}
            </span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-[46px] lg:leading-[54px] text-primary font-normal">
            {servicesSection.title}
          </h2>
        </div>
        <p className="font-sans text-sm sm:text-base text-on-surface-variant max-w-md mt-4 md:mt-0 leading-relaxed font-normal">
          {servicesSection.description}
        </p>
      </ScrollReveal>

      {/* Interactive Category Switcher / Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-10 sm:mb-12 border-b border-outline-variant/20 select-none no-scrollbar">
        <button
          type="button"
          onClick={() => setSelectedCategory('all')}
          className={`btn-tactile px-4 sm:px-5 py-2.5 font-sans text-xs tracking-wider uppercase shrink-0 font-medium ${
            selectedCategory === 'all'
              ? 'bg-primary text-on-primary'
              : 'border border-outline-variant/40 text-on-surface-variant hover:text-primary hover:border-primary'
          }`}
        >
          All Rituals
          <span className="ml-1.5 text-xs font-normal">(10)</span>
        </button>

        <button
          type="button"
          onClick={() => setSelectedCategory('hair')}
          className={`btn-tactile px-4 sm:px-5 py-2.5 font-sans text-xs tracking-wider uppercase shrink-0 font-medium ${
            selectedCategory === 'hair'
              ? 'bg-primary text-on-primary'
              : 'border border-outline-variant/40 text-on-surface-variant hover:text-primary hover:border-primary'
          }`}
        >
          Hair Architecture
          <span className="ml-1.5 text-xs font-normal">(3)</span>
        </button>

        <button
          type="button"
          onClick={() => setSelectedCategory('skin')}
          className={`btn-tactile px-4 sm:px-5 py-2.5 font-sans text-xs tracking-wider uppercase shrink-0 font-medium ${
            selectedCategory === 'skin'
              ? 'bg-primary text-on-primary'
              : 'border border-outline-variant/40 text-on-surface-variant hover:text-primary hover:border-primary'
          }`}
        >
          Skin &amp; Cellular Facials
          <span className="ml-1.5 text-xs font-normal">(2)</span>
        </button>

        <button
          type="button"
          onClick={() => setSelectedCategory('beauty')}
          className={`btn-tactile px-4 sm:px-5 py-2.5 font-sans text-xs tracking-wider uppercase shrink-0 font-medium ${
            selectedCategory === 'beauty'
              ? 'bg-primary text-on-primary'
              : 'border border-outline-variant/40 text-on-surface-variant hover:text-primary hover:border-primary'
          }`}
        >
          Beauty Rituals
          <span className="ml-1.5 text-xs font-normal">(3)</span>
        </button>

        <button
          type="button"
          onClick={() => setSelectedCategory('grooming')}
          className={`btn-tactile px-4 sm:px-5 py-2.5 font-sans text-xs tracking-wider uppercase shrink-0 font-medium ${
            selectedCategory === 'grooming'
              ? 'bg-primary text-on-primary'
              : 'border border-outline-variant/40 text-on-surface-variant hover:text-primary hover:border-primary'
          }`}
        >
          Grooming &amp; Styling
          <span className="ml-1.5 text-xs font-normal">(3)</span>
        </button>
      </div>

      {/* Main Grid: Editorial Feature Card + Curated Service List */}
      {(showHair || showSkin) && (
        <ScrollReveal>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-10 items-start mb-14 sm:mb-16">
            {/* Left Editorial Feature Card (5 cols) */}
            <div className="lg:col-span-5 bg-surface-container-low border border-outline-variant/40 p-6 lg:p-8 flex flex-col justify-between relative">
              <div className="mb-6">
                <div className="flex items-center justify-between gap-2 mb-4">
                  <span className="bg-secondary/10 border border-secondary/30 text-secondary font-sans text-[10px] font-bold uppercase tracking-widest px-2.5 py-1">
                    {servicesSection.curatorsChoice.badge}
                  </span>
                  <span className="font-sans text-xs text-outline tracking-wider">
                    {servicesSection.curatorsChoice.duration}
                  </span>
                </div>

                <div className="aspect-[4/3] overflow-hidden mb-6 border border-outline-variant/30 bg-surface">
                  <img
                    className="w-full h-full object-cover transition-transform duration-700 ease-out hover:scale-[1.02]"
                    src={servicesSection.curatorsChoice.image.src}
                    alt={servicesSection.curatorsChoice.image.alt}
                    loading="lazy"
                    decoding="async"
                    width="600"
                    height="450"
                  />
                </div>

                <h3 className="font-serif text-xl sm:text-2xl text-primary font-medium mb-2">
                  {servicesSection.curatorsChoice.title}
                </h3>
                <p className="font-sans text-xs sm:text-[13px] text-on-surface-variant leading-relaxed mb-4">
                  {servicesSection.curatorsChoice.description}
                </p>

                <div className="p-3 bg-surface-container-lowest border border-outline-variant/30 text-on-surface-variant font-sans text-xs space-y-1.5">
                  {servicesSection.curatorsChoice.inclusions.map((inclusion, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-secondary shrink-0" />
                      <span>{inclusion}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-outline-variant/30 flex items-center justify-between gap-4">
                <div>
                  <span className="font-sans text-[11px] text-outline uppercase block tracking-wider font-medium">
                    {servicesSection.curatorsChoice.rateLabel}
                  </span>
                  <span className="font-serif text-xl text-primary font-medium">
                    {servicesSection.curatorsChoice.price}
                  </span>
                </div>
                <a
                  href="#appointment"
                  onClick={() => handleReserveClick('curators-choice')}
                  className="btn-tactile inline-flex items-center gap-2 bg-primary text-on-primary font-sans text-xs font-semibold tracking-widest uppercase px-5 sm:px-6 py-3 hover:bg-secondary"
                >
                  <span>Reserve Ritual</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

          {/* Right Service Menu List (7 cols) */}
          <div className="lg:col-span-7 space-y-10">
            {/* Hair Architecture Section */}
            {showHair && hairCategory && (
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <h3 className="font-serif text-lg sm:text-xl text-primary font-medium">
                    {hairCategory.name}
                  </h3>
                  <div className="flex-1 h-px bg-outline-variant/40" />
                  <span className="font-sans text-xs uppercase tracking-wider text-secondary font-medium">
                    {hairCategory.categoryNumber}
                  </span>
                </div>

                <div className="divide-y divide-outline-variant/30 border-y border-outline-variant/30">
                  {hairCategory.items.map((item) => (
                    <div
                      key={item.id}
                      className="py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 group hover:bg-surface-container-lowest transition-colors px-3 -mx-3"
                    >
                      <div className="max-w-md">
                        <div className="flex items-center gap-2.5 mb-1">
                          <h4 className="font-serif text-base text-primary font-medium group-hover:text-secondary transition-colors">
                            {item.name}
                          </h4>
                          {item.tag && (
                            <span className="bg-[#D9B8AE]/30 text-primary-container text-[10px] font-bold uppercase tracking-wider px-2 py-0.5">
                              {item.tag}
                            </span>
                          )}
                        </div>
                        <p className="font-sans text-xs sm:text-[13px] text-on-surface-variant leading-relaxed">
                          {item.description}
                        </p>
                        <div className="mt-2 flex items-center gap-3 text-xs text-outline font-sans">
                          {item.ingredientNote && (
                            <span className="flex items-center gap-1">
                              <Sparkles className="w-3 h-3 text-secondary" />
                              {item.ingredientNote}
                            </span>
                          )}
                          {item.ingredientNote && <span>·</span>}
                          <span>{item.duration}</span>
                        </div>
                      </div>

                      <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 shrink-0">
                        <span className="font-serif text-lg text-primary font-medium">
                          {item.price}
                        </span>
                        <a
                          href="#appointment"
                          onClick={() => handleReserveClick(item.id)}
                          className="btn-tactile border border-primary-container text-primary-container hover:bg-primary-container hover:text-surface font-sans text-[11px] font-semibold tracking-widest uppercase px-3.5 py-1.5"
                        >
                          Reserve
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Skin & Cellular Facials Section */}
            {showSkin && skinCategory && (
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <h3 className="font-serif text-lg sm:text-xl text-primary font-medium">
                    {skinCategory.name}
                  </h3>
                  <div className="flex-1 h-px bg-outline-variant/40" />
                  <span className="font-sans text-xs uppercase tracking-wider text-secondary font-medium">
                    {skinCategory.categoryNumber}
                  </span>
                </div>

                <div className="divide-y divide-outline-variant/30 border-y border-outline-variant/30">
                  {skinCategory.items.map((item) => (
                    <div
                      key={item.id}
                      className="py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 group hover:bg-surface-container-lowest transition-colors px-3 -mx-3"
                    >
                      <div className="max-w-md">
                        <div className="flex items-center gap-2.5 mb-1">
                          <h4 className="font-serif text-base text-primary font-medium group-hover:text-secondary transition-colors">
                            {item.name}
                          </h4>
                          {item.tag && (
                            <span className="bg-[#D9B8AE]/30 text-primary-container text-[10px] font-bold uppercase tracking-wider px-2 py-0.5">
                              {item.tag}
                            </span>
                          )}
                        </div>
                        <p className="font-sans text-xs sm:text-[13px] text-on-surface-variant leading-relaxed">
                          {item.description}
                        </p>
                        <div className="mt-2 flex items-center gap-3 text-xs text-outline font-sans">
                          {item.ingredientNote && (
                            <span className="flex items-center gap-1">
                              <Sparkles className="w-3 h-3 text-secondary" />
                              {item.ingredientNote}
                            </span>
                          )}
                          {item.ingredientNote && <span>·</span>}
                          <span>{item.duration}</span>
                        </div>
                      </div>

                      <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 shrink-0">
                        <span className="font-serif text-lg text-primary font-medium">
                          {item.price}
                        </span>
                        <a
                          href="#appointment"
                          onClick={() => handleReserveClick(item.id)}
                          className="btn-tactile border border-primary-container text-primary-container hover:bg-primary-container hover:text-surface font-sans text-[11px] font-semibold tracking-widest uppercase px-3.5 py-1.5"
                        >
                          Reserve
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        </ScrollReveal>
      )}

      {/* 2-Column Compact Rituals: Beauty & Grooming (Pixel-matched to Stitch Design) */}
      {(showBeauty || showGrooming) && (
        <ScrollReveal>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 pt-2 mb-14 sm:mb-16">
            {/* Beauty Rituals Card */}
            {showBeauty && beautyCategory && (
              <div className="bg-surface-container-low p-6 sm:p-8 lg:p-10 border border-outline-variant/30 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-4 mb-6">
                    <h3 className="font-serif text-2xl sm:text-[24px] text-primary font-normal tracking-tight">
                      {beautyCategory.name}
                    </h3>
                    <div className="flex-1 h-px bg-outline-variant/40" />
                    <span className="font-sans text-xs tracking-wider text-secondary font-medium">
                      03
                    </span>
                  </div>

                  <div className="divide-y divide-outline-variant/30">
                    {beautyCategory.items.map((item) => (
                      <div
                        key={item.id}
                        className="py-5 flex items-center justify-between gap-4 transition-colors"
                      >
                        <div className="max-w-[280px] sm:max-w-xs">
                          <h4 className="font-serif text-[17px] sm:text-[18px] text-primary font-normal leading-snug">
                            {item.name}
                          </h4>
                          <p className="font-sans text-xs sm:text-[13px] text-on-surface-variant/80 mt-1 font-normal leading-relaxed">
                            {item.description} · {item.duration}
                          </p>
                        </div>

                        <div className="flex items-center gap-4 shrink-0">
                          <span className="font-serif text-base sm:text-lg text-primary font-medium">
                            {item.price}
                          </span>
                          <a
                            href="#appointment"
                            onClick={() => handleReserveClick(item.id)}
                            className="btn-tactile border border-primary-container text-primary-container hover:bg-primary-container hover:text-surface font-sans text-[11px] font-medium tracking-widest uppercase px-3.5 py-1.5 text-center shrink-0 min-w-[58px]"
                          >
                            BOOK
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Grooming & Styling Card */}
            {showGrooming && groomingCategory && (
              <div className="bg-surface-container-low p-6 sm:p-8 lg:p-10 border border-outline-variant/30 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-4 mb-6">
                    <h3 className="font-serif text-2xl sm:text-[24px] text-primary font-normal tracking-tight">
                      {groomingCategory.name}
                    </h3>
                    <div className="flex-1 h-px bg-outline-variant/40" />
                    <span className="font-sans text-xs tracking-wider text-secondary font-medium">
                      04
                    </span>
                  </div>

                  <div className="divide-y divide-outline-variant/30">
                    {groomingCategory.items.map((item) => (
                      <div
                        key={item.id}
                        className="py-5 flex items-center justify-between gap-4 transition-colors"
                      >
                        <div className="max-w-[280px] sm:max-w-xs">
                          <h4 className="font-serif text-[17px] sm:text-[18px] text-primary font-normal leading-snug">
                            {item.name}
                          </h4>
                          <p className="font-sans text-xs sm:text-[13px] text-on-surface-variant/80 mt-1 font-normal leading-relaxed">
                            {item.description} · {item.duration}
                          </p>
                        </div>

                        <div className="flex items-center gap-4 shrink-0">
                          <span className="font-serif text-base sm:text-lg text-primary font-medium">
                            {item.price}
                          </span>
                          <a
                            href="#appointment"
                            onClick={() => handleReserveClick(item.id)}
                            className="btn-tactile border border-primary-container text-primary-container hover:bg-primary-container hover:text-surface font-sans text-[11px] font-medium tracking-widest uppercase px-3.5 py-1.5 text-center shrink-0 min-w-[58px]"
                          >
                            BOOK
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollReveal>
      )}

      {/* 4. Value Adds & Transparency Assurance Bar */}
      <ScrollReveal delay={100}>
        <div className="bg-[#E9DFD2]/60 border border-outline-variant/40 p-6 lg:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-surface flex items-center justify-center shrink-0 border border-outline-variant/30 text-secondary">
              <ShieldCheck className="w-6 h-6 text-secondary" />
            </div>
            <div>
              <p className="font-serif text-base sm:text-lg text-primary font-medium">
                {servicesSection.guaranteeBar.title}
              </p>
              <p className="font-sans text-xs sm:text-[13px] text-on-surface-variant mt-0.5 leading-relaxed">
                {servicesSection.guaranteeBar.description}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 shrink-0 w-full sm:w-auto">
            <a
              href={servicesSection.guaranteeBar.ctaHref}
              className="btn-tactile w-full sm:w-auto inline-flex items-center justify-center bg-primary-container text-on-primary font-sans text-xs font-semibold tracking-widest uppercase px-6 py-3.5 hover:bg-secondary text-center"
            >
              {servicesSection.guaranteeBar.ctaText}
            </a>
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
};
