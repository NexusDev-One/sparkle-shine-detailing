# Sparkle & Shine Detailing 🚗✨

> **Luxury Mobile Automotive Detailing Experience for the Dallas–Fort Worth Metroplex.**  
> Built with React 19, TypeScript, Tailwind CSS v4, Three.js, GSAP, and Lenis.

---

## 🌟 Overview

**Sparkle & Shine Detailing** is a modern, high-performance web application designed for a premium mobile auto detailing service. It delivers an immersive, interactive digital experience inspired by luxury automotive design with real-time WebGL shaders, fluid scroll dynamics, custom cursor interactions, and interactive service exploration.

---

## 🚀 Key Features

- **🎨 3D WebGL Background Canvas (`Three.js`)**: Real-time fluid particle and shader effects rendering behind the application.
- **🌊 Smooth Inertial Scrolling (`Lenis`)**: Silky, physics-based smooth wheel scrolling synchronized with GSAP `ScrollTrigger`.
- **🎯 Interactive Custom Cursor**:
  - Desktop magnetic dot and trailing ring cursor with contextual modes (`VIEW`, `DRAG`, links).
  - **Dynamic Image Cursor**: In the **Services** section, the cursor transforms directly into the preview image of the hovered service row.
- **✨ Services Overview**:
  - Interactive service tier exploration (Dazzle Wash, Glamorous Wash, Sparkling Detail, Cabin Detailing, Paint Correction, Full Detail).
  - Zero-latency cursor-tracking visuals and mobile accordion fallbacks.
- **🌓 Interactive Before & After Slider**: Drag/sweep interactive dual-layer image comparison slider revealing paint transformation.
- **🖼️ Results Gallery**:
  - Horizontal parallax multi-panel scroll gallery showcasing ceramic coating, paint correction, wheel restoration, and cabin resets.
  - Edge-to-edge cropped layout with click-to-expand high-resolution lightbox.
- **🗺️ Real Interactive Google Maps (Service Area)**:
  - Live embedded Google Maps covering Dallas, Fort Worth, Arlington, Plano, Frisco, and Irving.
  - Quick-jump city badges to navigate the map instantly.
  - **Dark / Light Theme Toggle**: Matches the dark luxury palette or switches to standard Google Maps view.
  - External link to open the full map in Google Maps.
- **📋 Instant Quote & Booking Form**: Interactive vehicle condition selector, service package choice, and instant quote calculation.
- **📱 Fully Responsive**: Optimized for all screen sizes with accessible mobile accordion fallbacks and touch detection.
- **♿ Accessibility & Performance**: Respects `prefers-reduced-motion` settings, implements lazy-loaded media, and utilizes GPU-accelerated transforms.

---

## 🛠️ Tech Stack

| Technology | Purpose |
| :--- | :--- |
| **[React 19](https://react.dev/)** | Core UI component framework |
| **[TypeScript 5.9](https://www.typescriptlang.org/)** | Type-safe application development |
| **[Vite 7](https://vitejs.dev/)** | Fast dev server and optimized production bundler |
| **[Tailwind CSS v4](https://tailwindcss.com/)** | Modern utility-first CSS framework |
| **[Three.js](https://threejs.org/)** | WebGL 3D background rendering |
| **[GSAP](https://greensock.com/gsap/)** & **ScrollTrigger** | Complex timelines, reveals, and scroll-driven choreographies |
| **[Lenis](https://lenis.darkroom.engineering/)** | Smooth momentum-based scrolling |
| **[Lucide React](https://lucide.dev/)** | Clean, lightweight SVG iconography |

---

## 📁 Project Structure

```text
Sparkle & Shine Detailing/
├── index.html               # Main HTML entry point
├── package.json             # Dependencies and build scripts
├── tsconfig.json            # TypeScript compiler configuration
├── vite.config.ts           # Vite configuration with React & Tailwind plugins
├── src/
│   ├── main.tsx             # Application bootstrap
│   ├── App.tsx              # Root component & animation orchestrator
│   ├── index.css            # Global Tailwind CSS and styling variables
│   ├── assets/              # Local image assets
│   ├── components/
│   │   ├── BackgroundCanvas.tsx  # Three.js 3D WebGL background
│   │   ├── Cursor.tsx            # Custom cursor with image mode
│   │   ├── Navbar.tsx            # Sticky navigation bar
│   │   ├── MobileCTA.tsx         # Floating mobile action bar
│   │   └── shared.tsx            # Eyebrows, line reveal components
│   ├── sections/
│   │   ├── Hero.tsx              # Hero header with call-to-action
│   │   ├── Manifesto.tsx         # Brand philosophy section
│   │   ├── Services.tsx          # Service offerings with cursor image preview
│   │   ├── Immersive.tsx         # Visual brand statement
│   │   ├── Showcase.tsx          # Multi-layer scroll showcase
│   │   ├── BeforeAfter.tsx       # Interactive comparison slider
│   │   ├── Marquee.tsx           # Looping animated text banner
│   │   ├── Process.tsx           # Step-by-step detailing workflow
│   │   ├── Gallery.tsx           # Results horizontal gallery + lightbox
│   │   ├── Reviews.tsx           # Customer reviews & ratings
│   │   ├── ServiceArea.tsx       # Live Google Maps DFW service area
│   │   ├── QuoteForm.tsx         # Estimate & quote request form
│   │   ├── FinalCTA.tsx          # Closing booking CTA
│   │   └── Footer.tsx            # Footer navigation & contact info
│   ├── lib/
│   │   ├── media.ts              # Media URLs and asset constants
│   │   └── motion.ts             # GSAP & Lenis motion utilities
│   └── utils/
│       └── cn.ts                 # Class merging utility (clsx + tailwind-merge)
```

---

## ⚡ Getting Started

### Prerequisites
- **Node.js**: `v18.0.0` or higher (Node v20+ recommended)
- **npm** or **pnpm** / **yarn**

### Installation

1. **Clone or navigate to the project directory:**
   ```bash
   cd "Sparkle & Shine Detailing"
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

   > **Note for Windows PowerShell users:** If running into command-parsing issues with the ampersand (`&`) in the folder name, start the server using direct quoting:
   > ```powershell
   > Set-Location 'c:\Users\DELL\Downloads\Sparkle & Shine Detailing'; node .\node_modules\vite\bin\vite.js
   > ```

4. **Open in browser:**
   Open [http://localhost:5173](http://localhost:5173) to view the live site.

---

## 📜 Available Scripts

- **`npm run dev`**: Starts the local Vite development server with Hot Module Replacement (HMR).
- **`npm run build`**: Type-checks and compiles the production build to the `dist/` folder.
- **`npm run preview`**: Locally previews the production build.

---

## 🎨 Design & Animation Architecture

- **Color Palette**:
  - Deep Ink Black (`#020304`) & Coal (`#070a0e`)
  - Crisp Snow White (`#f6f7f8`) & Mist Gray (`#9199a5`)
  - Electric Glint Blue (`#3ba7ff`)
- **Typography**:
  - Display: `Archivo`
  - Labels & Monospace: `Space Grotesk`
- **Performance Optimizations**:
  - `will-change-transform` and hardware acceleration applied to scrubbed panels.
  - Image assets loaded via CDN with auto-compression (`tinysrgb`, `q=80`).
  - Automatic disabling of heavy animations when `prefers-reduced-motion` is active.

---

## 📄 License

Private commercial project for **Sparkle & Shine Detailing**. All rights reserved.
