# AccessAble — Inclusive Campus Mobility & Accessibility Navigator

[![Vite](https://img.shields.io/badge/Vite-6.0-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-18.3-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![WCAG](https://img.shields.io/badge/WCAG-2.2%20AAA-success)](#)
[![Deployment](https://img.shields.io/badge/Deployment-Ready-brightgreen)](#)

> **AccessAble** is a high-performance, accessible, and reactive frontend platform designed to empower students with mobility and accessibility requirements. It surfaces verified wheelchair-accessible entrances, active elevators, single-occupancy & universal washrooms, and crowdsourced real-time accessibility disruptions with automatic step-free bypass navigation.

---

## 🌟 Key Features

### 1. 🏢 Interactive Campus Mobility Map
- **Visual Quad & Building Canvas**: Architectural SVG floor and quad view with color-coded interactive pins.
- **Facility Types**:
  - 🚪 **Accessible Entrances**: Door actuator types (automatic motion radar, push pads), ramp slope gradients (1:20, 1:12), zero-threshold curb cuts.
  - 🛗 **High-Capacity Elevators**: Working status, Braille buttons, audio floor announcements, door clearance width, bariatric capacity.
  - 🚻 **Universal Restrooms**: Single-occupancy, grab bar configurations (L-shaped/horizontal), motorized doors, adult changing benches, emergency pull cords.
  - 🎧 **Sensory & Quiet Rooms**: Circadian lighting, soundproofing, low-sensory recharge spaces.
- **Deep-Dive Specification Sheets**: Inspect slope ratios, door width in inches/cm, verified dates, and student tips.

### 2. ⚠️ Live Accessibility Disruption Radar
- **Real-Time Outage Tracking**: Immediate alerts for broken elevator hydraulic lifts, stuck push buttons, icy/blocked ramps, and construction trenching.
- **Community Verification**: Students can confirm disruptions ("+1 I saw this too") to validate crowdsourced alerts.
- **Instant Detour Recommendations**: Every disruption provides an automated verified step-free bypass.
- **Crowdsourced Barrier Reporting**: Instant reporting modal with optimistic UI updates and `localStorage` persistence.

### 3. 🧭 Intelligent Step-Free Route Planner
- **Point-to-Point Navigation**: Select any starting campus building and destination.
- **Disruption-Aware Autopilot**: Detects outages along the path and dynamically reroutes students around closed ramps or elevators.
- **Turn-by-Turn Timeline**: Interactive step check-offs as students navigate campus in real time.
- **🎙️ Voice Guide (Text-to-Speech)**: Integrated Web Speech API audio synthesis for hands-free audio directions for manual wheelchair users or visually impaired students.

### 4. ♿ Built-In Accessibility Toolkit
- **High-Contrast Mode**: WCAG AAA black/white/yellow high-contrast color scheme.
- **Dyslexia-Friendly Typography**: Enhanced letter spacing and heavy baseline fonts (Lexend / OpenDyslexic).
- **Text Scaling**: Scalable between 100%, 125%, and 150% without layout breakage.
- **Reduced Motion**: Disables all animations and pulses for vestibular sensitivity.
- **Screen Reader Announcements**: Live `aria-live="polite"` feedback for every user interaction.

### 5. 📞 Emergency & Mobility Shuttle Hub
- Direct access to 24/7 on-demand campus accessibility carts, rapid elevator entrapment dispatch, and disability resources.

---

## 🚀 Quick Start & Development

### 1. Installation
```bash
git clone <your-repo-url>
cd accessable
npm install
```

### 2. Run Local Development Server
```bash
npm run dev
```
Open `http://localhost:3000` in your browser.

### 3. Production Build
```bash
npm run build
```
Creates an optimized, tree-shaken, production-ready bundle in the `dist/` directory.

### 4. Preview Production Build
```bash
npm run preview
```

---

## 🚢 Direct Deployment Ready

This project is 100% frontend and ready for instant one-click deployment to any platform:

### Deploy to Vercel
Includes `vercel.json` for SPA route rewrites:
```bash
npx vercel
```

### Deploy to Netlify
Includes `netlify.toml` pre-configured for redirects:
```bash
npx netlify deploy --prod
```

### Deploy to GitHub Pages
Includes `.github/workflows/deploy.yml` automated GitHub Actions workflow:
1. Push this repository to GitHub.
2. In GitHub repository **Settings** → **Pages**, set source to **GitHub Actions** (or `gh-pages` branch).
3. Every commit to `main` automatically builds and deploys the live app.

---

## ♿ Accessibility Compliance Standards
- **WCAG 2.2 Level AA / AAA** compliance
- Full keyboard tab navigation with visible outline focus rings
- ARIA landmarks (`role="region"`, `role="dialog"`, `aria-live="polite"`, `aria-modal="true"`)
- Color contrast ratios exceeding 7:1 for critical text elements
- Skip-to-content links for quick screen reader access

---

## 📄 License
MIT License. Built for inclusive education and accessible campuses everywhere.
