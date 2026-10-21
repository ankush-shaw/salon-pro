export interface ServiceItem {
  id: string;
  name: string;
  tag?: string;
  description: string;
  duration: string;
  price: string;
  priceNumeric: number;
  ingredientNote?: string;
}

export interface ServiceCategory {
  id: string;
  categoryNumber: string;
  name: string;
  items: ServiceItem[];
}

export interface CuratorsChoice {
  badge: string;
  duration: string;
  image: {
    src: string;
    alt: string;
  };
  title: string;
  description: string;
  inclusions: string[];
  price: string;
  priceNumeric: number;
  rateLabel: string;
}

export interface GuaranteeBar {
  title: string;
  description: string;
  ctaText: string;
  ctaHref: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  tag: string;
  src: string;
  alt: string;
  aspectRatio: string;
}

export interface TestimonialItem {
  id: string;
  name: string;
  role: string;
  quote: string;
  rating: number;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface SalonConfig {
  name: string;
  subTitle: string;
  tagline: string;
  contact: {
    phone: string;
    phoneDisplay: string;
    whatsappNumber: string; // International format without + or spaces
    whatsappDisplay: string;
    email: string;
    address: {
      street: string;
      area: string;
      city: string;
      state: string;
      pincode: string;
      full: string;
    };
    mapsUrl: string;
    openingHours: {
      days: string;
      hours: string;
      note?: string;
    }[];
    social: {
      instagram?: string;
      instagramHandle?: string;
      facebook?: string;
    };
  };
  announcementBar: {
    enabled: boolean;
    text: string;
    badgeText?: string;
  };
  hero: {
    eyebrow: string;
    title: string;
    description: string;
    primaryCta: { text: string; href: string };
    secondaryCta: { text: string; href: string };
    locationBadge: string;
    policyBadge: string;
    image: {
      src: string;
      alt: string;
      suiteNumber: string;
      volumeTag: string;
    };
  };
  trustPillars: {
    eyebrow: string;
    guidingPrincipleQuote: string;
    pillars: {
      id: string;
      icon: 'spa' | 'scissors' | 'home';
      title: string;
      description: string;
    }[];
  };
  servicesSection: {
    eyebrow: string;
    title: string;
    description: string;
    curatorsChoice: CuratorsChoice;
    guaranteeBar: GuaranteeBar;
    categories: ServiceCategory[];
  };
  aboutSection: {
    eyebrow: string;
    title: string;
    paragraphs: string[];
    quote: string;
    quoteAuthor: string;
    image: {
      src: string;
      alt: string;
    };
    highlights: {
      value: string;
      label: string;
    }[];
  };
  gallerySection: {
    eyebrow: string;
    title: string;
    subtitle: string;
    items: GalleryItem[];
    highlightCard: {
      title: string;
      description: string;
    };
  };
  testimonialsSection: {
    eyebrow: string;
    title: string;
    items: TestimonialItem[];
  };
  appointmentSection: {
    eyebrow: string;
    title: string;
    description: string;
    benefits: string[];
    conciergeNote: string;
    conciergePhone: string;
    timeSlots: { id: string; label: string }[];
  };
  locationSection: {
    eyebrow: string;
    title: string;
    mapEmbedUrl: string;
    badgeTitle: string;
    badgeSubtitle: string;
    mapImage?: {
      src: string;
      alt: string;
      badgeTitle: string;
      badgeSubtitle: string;
    };
  };
  faqSection: {
    eyebrow: string;
    title: string;
    items: FAQItem[];
  };
  footer: {
    description: string;
    copyright: string;
    journalTitle: string;
    journalDescription: string;
  };
}

export const salonConfig: SalonConfig = {
  name: "ATELIER SALON",
  subTitle: "HAIR & BEAUTY ATELIER",
  tagline: "Your beauty, thoughtfully refined.",

  contact: {
    phone: "+91XXXXXXXXXX",
    phoneDisplay: "+91 XXXXXXXXXX",
    whatsappNumber: "91XXXXXXXXXX", // International number without +, spaces, or dashes
    whatsappDisplay: "+91 XXXXXXXXXX",
    email: "concierge@example.com",
    address: {
      street: "42 Atelier Studio Avenue",
      area: "Design District",
      city: "City",
      state: "State",
      pincode: "XXXXXX",
      full: "42 Atelier Studio Avenue, Design District, City, State XXXXXX",
    },
    mapsUrl: "https://maps.google.com/?q=42+Atelier+Studio+Avenue,+Design+District",
    openingHours: [
      {
        days: "Tuesday – Sunday",
        hours: "10:00 AM – 8:00 PM",
        note: "Mondays reserved for private education & deep restoration",
      },
    ],
    social: {
      instagram: "https://instagram.com/",
      instagramHandle: "@atelier.salon",
      facebook: "https://facebook.com/",
    },
  },

  announcementBar: {
    enabled: true,
    text: "Now welcoming new guests · Complimentary consultation with every ritual",
    badgeText: "Private Atelier Notice",
  },

  hero: {
    eyebrow: "HAIR · SKIN · BEAUTY ATELIER",
    title: "A little time for yourself.",
    description:
      "Thoughtful beauty rituals, expert care and a space designed around you. Imbued with tranquility and the timeless precision of bespoke Parisian craftsmanship.",
    primaryCta: {
      text: "Book an Appointment",
      href: "#appointment",
    },
    secondaryCta: {
      text: "Explore Our Services",
      href: "#services",
    },
    locationBadge: "Central District, Atelier Studio",
    policyBadge: "By Appointment Only",
    image: {
      src: "https://lh3.googleusercontent.com/aida-public/AB6AXuCV2vfryExHhgMg88eCCO3FgQYO3qJ06gipcXYU4Ll0-f8Aben7ZKaB1cVLtuPWaOMDczXP2SAoXDkLyhFIv_DhWiBUXO377UI7cJhQGRxhsWSgK8lmGnuSLb98UG0bbljW1E912rOMp5MiKPG06Vm7oRAPiNs9ghzATIEK3Z5kAC_s0rx9gveO_L7Qg7SWzjyEB6UWYMtHx0X_hHkG8vhZRstgFijLhng_pWVu-_wclR19NJ2_l7lN",
      alt: "An elegant, softly lit luxury salon interior with natural daylight streaming through tall arched windows onto smooth limestone floors.",
      suiteNumber: "Private Atelier Suite No. 04",
      volumeTag: "Vol. 2025",
    },
  },

  trustPillars: {
    eyebrow: "Our Guiding Principle",
    guidingPrincipleQuote: "“A sanctuary dedicated to mindful craft and personal rejuvenation.”",
    pillars: [
      {
        id: "pillar-1",
        icon: "spa",
        title: "Personalised Care",
        description:
          "Every consultation commences with a bespoke texture, skin, and lifestyle assessment.",
      },
      {
        id: "pillar-2",
        icon: "scissors",
        title: "Experienced Artisans",
        description:
          "Trained in European techniques, our specialists balance structural precision with effortless ease.",
      },
      {
        id: "pillar-3",
        icon: "home",
        title: "Welcoming Atmosphere",
        description:
          "Unrushed appointments, organic herbal infusions, and an acoustically calmed environment.",
      },
    ],
  },

  servicesSection: {
    eyebrow: "The Treatment Portfolio",
    title: "Rituals & Care Menu",
    description:
      "All rituals utilize cold-pressed biodynamic botanicals and dermatologically pure formulations. Every price encompasses a personalized diagnosis.",
    curatorsChoice: {
      badge: "Curator's Choice · Winter 2025",
      duration: "105 mins",
      image: {
        src: "https://lh3.googleusercontent.com/aida-public/AB6AXuCl4yWhFFXVoRltZIbLvi3rBbRlMx-KurYZDsLP-El2mQ4OM46YTyfDogilgEbVVCAsIIgTeZkp41LEQUOrGbO08WwSOm_vGXOunEh4XIdVMSlXMluqWMCry6mNfvaMw4MzaqD7JvN-9YeDOAqeGtgrEpenRBhw-uazmkdTo0fl7yzCX7SUAacUFhdGYEHFkygD18TODyll6-jRjsppx3uaMP2LGu_9Z7CsHhx95k6Kd-Aa93RoHuxw",
        alt: "Close up of artisanal amber dropper vial and dried botanical ingredients used in hair and skin restoration rituals",
      },
      title: "Grand Scalp & Botanical Glow Synthesis",
      description:
        "A multi-sensory restorative sequence combining cold-pressed Ayurvedic cedarwood head massage, jade-stone lymphatic facial sculpt, and bespoke acidic silk hair gloss finish.",
      inclusions: [
        "Includes custom organic herbal tea blend & scalp analysis",
        "Single-guest acoustic private suite reserved",
      ],
      price: "₹6,800",
      priceNumeric: 6800,
      rateLabel: "Inclusive Ritual Rate",
    },
    guaranteeBar: {
      title: "The Atelier Ritual Guarantee",
      description:
        "Every ritual includes a 15-minute diagnostic consultation, custom botanical herbal tea pairing, and soothing acupressure. No hidden charges or surge rates.",
      ctaText: "Reserve a Consultation",
      ctaHref: "#appointment",
    },
    categories: [
      {
        id: "hair",
        categoryNumber: "01 / 04",
        name: "Hair Architecture",
        items: [
          {
            id: "couture-cut",
            name: "Couture Cut & Finish",
            tag: "Signature",
            description:
              "Bespoke structural sculpture tailored to cranial geometry, completed with botanical shampoo and blow-dry.",
            duration: "75 mins",
            price: "₹3,200",
            priceNumeric: 3200,
            ingredientNote: "Argan & Horsetail Balm",
          },
          {
            id: "botanical-gloss",
            name: "Botanical Gloss Treatment",
            description:
              "Acidic demi-permanent shine infusion that enriches tonal depth, seals cuticles, and restores luminous silk reflectance.",
            duration: "60 mins",
            price: "₹4,500",
            priceNumeric: 4500,
            ingredientNote: "Bio-Fermented Lipids",
          },
          {
            id: "balayage",
            name: "Balayage & Dimensional Colour",
            tag: "Atelier Exclusive",
            description:
              "Hand-painted gradient luminescence designed for seamless regrowth, paired with a micro-toning floral glaze.",
            duration: "180 mins",
            price: "₹8,500",
            priceNumeric: 8500,
            ingredientNote: "Clay & Cottonseed Extract",
          },
        ],
      },
      {
        id: "skin",
        categoryNumber: "02 / 04",
        name: "Skin & Cellular Facials",
        items: [
          {
            id: "cellular-facial",
            name: "Cellular Hydration Facial",
            description:
              "Multi-molecular hyaluronic acid infusion with rhythmic compressions for lasting cellular plumpness.",
            duration: "60 mins",
            price: "₹4,200",
            priceNumeric: 4200,
            ingredientNote: "Rose Otto Hydrosol",
          },
          {
            id: "gua-sha",
            name: "Gua Sha Lymphatic Lift",
            tag: "Signature",
            description:
              "Traditional jade sculpting ritual releasing deep facial myofascial tension, contour puffiness, and neck stagnation.",
            duration: "75 mins",
            price: "₹5,000",
            priceNumeric: 5000,
            ingredientNote: "Cold-Pressed Camellia Oil",
          },
        ],
      },
      {
        id: "beauty",
        categoryNumber: "03",
        name: "Beauty Rituals",
        items: [
          {
            id: "manicure",
            name: "Signature Manicure & Polish",
            description: "Organic sweet almond oil soak & cuticles",
            duration: "50 mins",
            price: "₹2,200",
            priceNumeric: 2200,
          },
          {
            id: "brow-sculpt",
            name: "Brow Sculpt & Tint",
            description: "Architectural bone-structure mapping",
            duration: "35 mins",
            price: "₹1,800",
            priceNumeric: 1800,
          },
          {
            id: "ayurvedic-head",
            name: "Ayurvedic Head Massage",
            description: "Warm brahmi & sesame oil infusion",
            duration: "45 mins",
            price: "₹2,400",
            priceNumeric: 2400,
          },
        ],
      },
      {
        id: "grooming",
        categoryNumber: "04",
        name: "Grooming & Styling",
        items: [
          {
            id: "occasion-hair",
            name: "Occasion Hair Styling",
            description: "Architectural chignons or red-carpet waves",
            duration: "60 mins",
            price: "₹3,800",
            priceNumeric: 3800,
          },
          {
            id: "executive-beard",
            name: "Executive Beard & Hair Sculpt",
            description: "Eucalyptus hot towel and straight-edge blade",
            duration: "60 mins",
            price: "₹2,900",
            priceNumeric: 2900,
          },
          {
            id: "scalp-therapy",
            name: "Scalp Rejuvenation Therapy",
            description: "French green clay scrub & serum mist",
            duration: "50 mins",
            price: "₹2,800",
            priceNumeric: 2800,
          },
        ],
      },
    ],
  },

  aboutSection: {
    eyebrow: "Our Philosophy",
    title: "Beauty in the details.",
    paragraphs: [
      "Founded on the belief that personal grooming is not a hasty errand but an act of restoration, our atelier brings mindful European salon hospitality to the vibrant heart of the city.",
      "We deliberately limit our appointments per day. This guarantees your stylist will never be rushed, your wash ritual will never be cut short, and our tranquil atmosphere remains preserved.",
      "From custom tea pairings formulated by regional herbalists to our low-noise Dyson hair instruments and ethically sourced biodynamic balms, every micro-detail is an invitation to exhale.",
    ],
    quote: "“Silence is the highest form of luxury.”",
    quoteAuthor: "Atelier Protocol",
    image: {
      src: "https://lh3.googleusercontent.com/aida-public/AB6AXuCkaAH13kVli_L_-yQmb5cdgmviUQyiZYd9msxXgcNHCnS1gzBs-AF2FFSF0JP_XhT0DKi-CYTKCg6-ModQBkV8AAMELRVDIpzbHoJUEwPorQw3GtMFLS889w_BzL5AUHaa8qVkd2ElMFrqWjHu-c5Cf0m0XBClOBT19gF5YTBdzRsug53kR6jTUGA-Oo8i3m_yipGIuN_fRh1NCyg7wDc_TS_1_V075gkfbEYR7wpNGofIm8G2SnTh",
      alt: "Curated ceramic earthen jars containing pure botanical hair extracts and folded warm ivory linen towels on raw oak console.",
    },
    highlights: [
      {
        value: "100%",
        label: "Cruelty-Free Products",
      },
      {
        value: "Single-Guest",
        label: "Private Wash Suites",
      },
    ],
  },

  gallerySection: {
    eyebrow: "The Visual Diary",
    title: "Atmosphere & Moments",
    subtitle: "An unhurried glance into the everyday poetry of our studio sanctuary.",
    items: [
      {
        id: "look-01",
        title: "Couture Dimensional Colour",
        tag: "Look 01",
        src: "https://lh3.googleusercontent.com/aida-public/AB6AXuASDPPRp9EZeQQkZc5OAmMmCv-OvtiYPOgS-KS0EnBS-89BCL9mzq0t_etkbRokMyfWMxuS5VOHPuEbbnh3rz_9z0Rgcq_v9Tu7AornyZH53vqHkbpi2-x39xW0L74TnXAAJ8wptJ2JpD_SYUUNXBdkobay8DzwVPGmaPrUW79OBz2h2h8f4kPbUXvObzPElAgZ1MMqpb1IVTL1EPwpnjvPTnS04C8y_2gQl6ZY1rzCFxuDKjsl-iin",
        alt: "Editorial portrait of woman with glossy chestnut hair displaying refined dimension and gentle waves against sandstone wall.",
        aspectRatio: "aspect-[3/4]",
      },
      {
        id: "craft",
        title: "Artisanal Implements",
        tag: "Craft",
        src: "https://lh3.googleusercontent.com/aida-public/AB6AXuCl4yWhFFXVoRltZIbLvi3rBbRlMx-KurYZDsLP-El2mQ4OM46YTyfDogilgEbVVCAsIIgTeZkp41LEQUOrGbO08WwSOm_vGXOunEh4XIdVMSlXMluqWMCry6mNfvaMw4MzaqD7JvN-9YeDOAqeGtgrEpenRBhw-uazmkdTo0fl7yzCX7SUAacUFhdGYEHFkygD18TODyll6-jRjsppx3uaMP2LGu_9Z7CsHhx95k6Kd-Aa93RoHuxw",
        alt: "Minimalist flat lay of pure brass hair scissors, carved horn comb, and glass dropper bottle of amber scalp serum.",
        aspectRatio: "aspect-square",
      },
      {
        id: "interior",
        title: "Wash Sanctuary",
        tag: "Interior",
        src: "https://lh3.googleusercontent.com/aida-public/AB6AXuARJOo5UdYXFzVAnIH9GfztW1AzrQAI0yGyOZRRt051jVdFsv4-ya4474UZCdImx83zKjOIWLYveCOWNarDcWh5cmJFwGOGxJWPdfVwZzWAi1Q5LblsiKW4KlwFnOnGtzOvyNV3poa8XJbE5q4JoaHEbAz2bR9CSj3lWkSwHO-IsGU1a358vsEpCg-tkmOV1VNHPDTR7k6h6TRHhxSJ-Pk_k0CP-sz3ADPXfgpofo5Duqgfdq5Eflct",
        alt: "Minimalist salon wash basin area with fluted pale limestone tiles and warm dim cove lighting.",
        aspectRatio: "aspect-[2/3]",
      },
      {
        id: "skincare",
        title: "Gua Sha Ritual",
        tag: "Skincare",
        src: "https://lh3.googleusercontent.com/aida-public/AB6AXuCJY-EfQ7op_CF7OocsuN0CFWJxdVEwdYDFZdrgOrnrdpoZGye_NNhF_rhIRdjr2qgHENYdy6ewDmqtwTfjjt8n6JX0Aph6I7giZ7WIbgh1bmUFBNv7lGFsyDc8Pb8VqmzTEEFx8EIQQlP2CRTXydJay9M_MfSFPRWa6A3pZ-rxjndNSVPp_eGmAKZwmqPDn7sZTC51DNd6QK-J7x2YvbF-hK44mnZGBB4jmg5XWqcEw_kamhjYev22",
        alt: "Facial massage showing pure organic facial oil smoothed over cheekbones with a smooth rose quartz gua sha stone.",
        aspectRatio: "aspect-square",
      },
      {
        id: "styling",
        title: "Geometric Precision Bob",
        tag: "Styling",
        src: "https://lh3.googleusercontent.com/aida-public/AB6AXuBV7XLIhrAHEG5hH-xmZlo6rBaV89PTX2ynLXB9yljjtaPdLLqg_cD4muOboRT1oMyuL4kQJzvlnyVfjA1qkXBEBLwlikBrvlwKsHgg7bQQaeg34sHx1NImpBMpalSH_MAOE0Bk_IE2fIYQcaXv42duLfowIf_WW2pzaLV-LYcMDdwGBnTi0jsr8vl2bMOJqu5wPzcOspmu5KPbDVlZGsTyIP_Ht3gF0cff18Djnj_PiFq9opSWTjCa",
        alt: "Side profile photo of modern precision bob haircut with blunt lines on dark espresso hair.",
        aspectRatio: "aspect-[4/5]",
      },
    ],
    highlightCard: {
      title: "Pure Aesthetic Balance",
      description: "Every mirror and light fixture is angled to reflect genuine skin and hair tones.",
    },
  },

  testimonialsSection: {
    eyebrow: "Client Notes",
    title: "Reflections & Words",
    items: [
      {
        id: "testimonial-1",
        name: "Ananya Rao",
        role: "Architect & Creative Director",
        quote:
          "“The absence of salon chatter and jarring blow-dryer noise alone makes this atelier singular. My haircut was easily the cleanest, most flattering shape I have ever had.”",
        rating: 5,
      },
      {
        id: "testimonial-2",
        name: "Devika Nambiar",
        role: "Writer",
        quote:
          "“The Gua Sha facial lifted tension I didn't even realize I had in my jaw. Their tea ritual at the beginning sets an immediate tone of calm. Unhurried and genuinely therapeutic.”",
        rating: 5,
      },
      {
        id: "testimonial-3",
        name: "Vikramaditya S.",
        role: "Entrepreneur",
        quote:
          "“Their subtle balayage technique grows out so naturally without any harsh demarcation lines. The atelier space feels more like an art gallery than a salon.”",
        rating: 5,
      },
    ],
  },

  appointmentSection: {
    eyebrow: "Reservations",
    title: "Reserve your time.",
    description:
      "Please submit your preferred schedule. Because we respect your personal time, all appointments are scheduled with dedicated buffer intervals to guarantee an uninterrupted sanctuary.",
    benefits: [
      "No pre-payment required for standard reservations.",
      "We honor a strict 15-minute grace period to preserve scheduled start times.",
      "Instant schedule confirmation sent directly to WhatsApp.",
    ],
    conciergeNote:
      "Need a consultation for wedding parties or bespoke group bookings? Contact our concierge at ",
    conciergePhone: "+91 XXXXXXXXXX",
    timeSlots: [
      { id: "morning", label: "Morning (10:00 AM – 1:00 PM)" },
      { id: "afternoon", label: "Afternoon (1:00 PM – 4:30 PM)" },
      { id: "evening", label: "Evening (4:30 PM – 8:00 PM)" },
    ],
  },

  locationSection: {
    eyebrow: "Studio Visit",
    title: "Visit the Atelier",
    mapEmbedUrl:
      "https://maps.google.com/maps?q=42+Atelier+Studio+Avenue,+Design+District&t=&z=15&ie=UTF8&iwloc=&output=embed",
    badgeTitle: "THE ATELIER STUDIO",
    badgeSubtitle: "Valet parking available",
    mapImage: {
      src: "https://lh3.googleusercontent.com/aida-public/AB6AXuCX7JgFui7910Vkq4ikI4mjFkxkj-X5bvXrLCPSRjL5tEHjGlGzsvtHk6UkqFPkEhutKClVGvi-B7UOF2beine5SZSiHtXzNdPJB1QwJvK6q6APbVhboW9meoSSuZ5Su8ypijOwkcK18itILYTuPWZaTX0Kk0C3UCNqv1eeeHD0y1c8_DxHXC-qwIeHsR-Y6Ck1m8ubfmytuyNv3-x2DJJLoMQPpWqnLlx5oBoJ_OnlKBOCzU1Cfa8a",
      alt: "Minimalist architectural map graphic showing Atelier location.",
      badgeTitle: "THE ATELIER STUDIO",
      badgeSubtitle: "Valet parking available",
    },
  },

  faqSection: {
    eyebrow: "Answers",
    title: "Frequently Asked Inquiries",
    items: [
      {
        question: "Do I need an advance appointment?",
        answer:
          "Yes. To preserve the calm, unrushed ambience and ensure dedicated time with your assigned specialist, we operate strictly by prior appointment. Same-day appointments can occasionally be accommodated based on cancellations via our WhatsApp concierge.",
      },
      {
        question: "What is your cancellation policy?",
        answer:
          "We kindly ask for at least 12 hours notice for standard cancellations or rescheduling. This allows us to offer the reserved suite to clients on our waitlist. For bridal and private suite bookings, a 24-hour notice is appreciated.",
      },
      {
        question: "Can I request a specific stylist or aesthetician?",
        answer:
          "Certainly. You may note your preferred specialist during online booking or mention their name directly to our reception. We will coordinate their schedule seamlessly to accommodate you.",
      },
      {
        question: "What products do you use in your treatments?",
        answer:
          "We exclusively curate dermatologically tested, cruelty-free, and ethically formulated botanical lines. Our hair colorations are ammonia-free and infused with protective botanical lipids, while all skincare treatments employ clean, biodynamic extracts without synthetic fragrances.",
      },
    ],
  },

  footer: {
    description:
      "Your beauty, thoughtfully refined. An atelier dedicated to calm craftsmanship, restorative rituals, and mindful hair and skin aesthetics.",
    copyright: "© 2025 ATELIER SALON. ALL RIGHTS RESERVED.",
    journalTitle: "Atelier Journal",
    journalDescription:
      "Receive seasonal hair care essays and private ritual notices.",
  },
};
