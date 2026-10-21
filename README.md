# ATELIER SALON — Hair & Beauty Atelier Website

A production-ready, fully responsive salon website template engineered with **React**, **Vite**, **TypeScript**, and **Tailwind CSS**, implemented with pixel-accurate fidelity from the Google Stitch design (`projects/1955867390936911565`).

---

## 🌟 Highlights & Features

- **Google Stitch Design Fidelity**: Matches the Warm Editorial Luxury aesthetic, Playfair Display typography, warm paper-ivory ground (`#fcf9f4`), and volcanic charcoal accents (`#0f0d0c` / `#252321`).
- **New Updated Treatment Menu**:
  - Interactive category switcher tabs (`All Rituals`, `Hair Architecture`, `Skin & Cellular Facials`, `Beauty Rituals`, `Grooming & Styling`).
  - Curator's Choice editorial feature card with inclusive rate and instant reservation CTA.
  - 2-column compact beauty and grooming layout.
  - Atelier Ritual Guarantee assurance bar.
- **WhatsApp Appointment Request Flow**:
  - Full client-side validation (Name, Phone, Service, Date, Time Slot, Notes).
  - Encodes a clean, human-readable WhatsApp request URL (`https://wa.me/INTERNATIONAL_NUMBER?text=...`).
  - Zero backend or database dependencies required; safe new tab opening with status feedback.
- **Universal Configuration**: All business details, treatment pricing, opening hours, contact phone numbers, and gallery assets are centralized in `src/config/salon.ts`.
- **Responsive Across Breakpoints**: Fully optimized for mobile (320px–425px), tablet (768px–1023px), and desktop (1024px–1440px+).
- **Accessibility & SEO**: Semantic HTML5 tags, ARIA attributes for mobile menu drawer and FAQ accordion, descriptive Open Graph and Meta tags.

---

## 🚀 Quick Start & Local Development

### Prerequisites
- Node.js `v18.0.0` or higher
- npm `v9.0.0` or higher

### Installation
```bash
# Navigate to the project directory
cd Salon

# Install dependencies
npm install

# Start local development server
npm run dev
```

The application will be live at `http://127.0.0.1:5173/`.

### Production Build
```bash
# Type check and build static assets for production
npm run build

# Preview production build locally
npm run preview
```

The compiled files will be output to the `dist/` folder.

---

## ☁️ Cloudflare Pages Deployment

This project builds into a static bundle compatible with Cloudflare Pages:

1. **Framework Preset**: `Vite`
2. **Build Command**: `npm run build`
3. **Build Output Directory**: `dist`
4. **Node.js Version**: `20.x` or higher (set via environment variable `NODE_VERSION=20` in Cloudflare Pages dashboard if needed).

---

## 🛠️ Customizing for a New Salon Client

To repurpose this template for another salon client, simply edit:

### `src/config/salon.ts`

Modify the following fields:

1. **Salon Identity**:
   - `name`: Business name (e.g., `"ATELIER NOIR"`)
   - `subTitle`: Tagline (e.g., `"HAIR & SPA"`)
   - `tagline`: Editorial statement
2. **Contact & WhatsApp**:
   - `whatsappNumber`: Phone number in international format **without** `+` or spaces (e.g., `919876543210`)
   - `phone`: Direct telephone number with country code for `tel:` links
   - `email`: Salon contact email
   - `address`: Physical address details
   - `mapsUrl`: Google Maps direction URL
   - `openingHours`: Weekly operating schedule
3. **Hero & About**:
   - Headings, descriptions, and feature images
4. **Services & Pricing**:
   - Treatment categories, items, prices, durations, and ingredient notes
   - Curator's Choice special package
5. **Gallery Images**:
   - Replace URLs in `gallerySection.items` with high-resolution photos of the client's actual salon
6. **Testimonials & FAQs**:
   - Client reviews and frequent inquiries

---

## 📁 Project Architecture

```
Salon/
├── public/
│   └── favicon.svg           # Branded monogram favicon
├── src/
│   ├── assets/               # Local static assets
│   ├── components/
│   │   ├── AnnouncementBar.tsx   # Dismissible banner
│   │   ├── Navbar.tsx            # Sticky header & mobile drawer
│   │   ├── Hero.tsx              # Editorial hero with dual CTAs
│   │   ├── TrustPillars.tsx      # Guiding principle & 3 pillars
│   │   ├── Services.tsx          # Interactive portfolio & menu
│   │   ├── About.tsx             # Philosophy & wash suite highlights
│   │   ├── Gallery.tsx           # Asymmetrical visual mosaic
│   │   ├── Testimonials.tsx      # Client reflections & star ratings
│   │   ├── AppointmentForm.tsx   # WhatsApp request generator
│   │   ├── Contact.tsx           # Location, studio hours & map
│   │   ├── FAQ.tsx               # Accessible accordion
│   │   ├── Footer.tsx            # Footer & Atelier Journal newsletter
│   │   └── WhatsAppButton.tsx    # Floating quick-contact action
│   ├── config/
│   │   └── salon.ts              # Universal client configuration
│   ├── pages/
│   │   └── Home.tsx              # Section orchestration
│   ├── App.tsx                   # Root component
│   ├── main.tsx                  # Vite React entrypoint
│   └── index.css                 # Tailwind directives & base styles
├── index.html                    # SEO meta tags & font preconnects
├── tailwind.config.js            # Custom design tokens & colors
├── postcss.config.js             # PostCSS Tailwind config
├── tsconfig.json                 # TypeScript project configuration
├── vite.config.ts                # Vite configuration
└── package.json                  # Dependencies & scripts
```
