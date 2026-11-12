# Gyan Mistry - Portfolio Website

A playful, animated developer portfolio built around a volleyball court. Skills drop into the hero as physics objects you can spike with a ball, and the rest of the page covers experience, projects, and coursework for recruiters and hiring managers.

## Features

- **🏐 Physics court hero**: A matter-js world where skill pills fall onto a court. Drag the ball, or tap the court to spike it. Loaded lazily after first paint, paused when off-screen, and rendered as one static frame for reduced-motion users.
- **⌘ Command palette search**: Press `Cmd K`, `Ctrl K`, or `/` (or click any skill chip) to search every technology across experience, projects, and coursework, then jump straight to the match.
- **📈 Scroll-driven experience timeline**: A rally line fills as you scroll Lockheed Martin and Redis, with animated impact metrics.
- **🚀 Featured project reel**: Orbit, ASL Study Tool, and Kalshi Quant scroll horizontally on large screens and stack on phones. Eight more projects live in an expandable index.
- **🧩 About bento, credentials, and coursework tabs**: Volleyball captaincy, languages including ASL, skills groups, and all 32 RIT courses by category.
- **📄 Resume viewer**: Preview `public/resume.pdf` in a modal or download it.
- **🌓 Light and dark themes**: Follows the system setting, with a toggle that reveals the new theme as a circle (View Transitions API).
- **♿ Accessible by default**: WCAG AA contrast in both themes, 44px touch targets, visible focus, skip link, and full `prefers-reduced-motion` support.

Stack: React 18, Vite, plain CSS tokens in `src/index.css`, Motion, matter-js, Lenis, Phosphor icons, and self-hosted Bricolage Grotesque and Geist fonts.

Hero skill pills come from `portfolioData.personal.heroSkills`. Featured project images live in `public/img/` and are referenced by each project's `image` field.

---

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Local Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Build for Production
```bash
npm run build
```
Creates an optimized static bundle in the `dist/` directory.

### 4. Preview Production Build
```bash
npm run preview
```

---

## Where to Add & Edit Skills Manually

All skills and technologies are stored in **[`src/data/portfolioData.js`](file:///Users/gyanmistry/SoftdevI/gyan-personal-webiste/src/data/portfolioData.js)**. When you add or modify a skill here, it is automatically displayed on the cards and linked into the top recruiter search bar!

### 1. Work Experience Skills
Locate `portfolioData.experiences` in [`src/data/portfolioData.js`](file:///Users/gyanmistry/SoftdevI/gyan-personal-webiste/src/data/portfolioData.js).
Each job entry has a `technologies` array:

```javascript
// Example: Lockheed Martin (around line 140)
technologies: [
  "Python", "AI Agents", "SGML", "XML", "Jira Administration",
  "Your New Skill Here" // <-- Simply add strings here
]
```

### 2. Project Skills
Locate `portfolioData.projects` in [`src/data/portfolioData.js`](file:///Users/gyanmistry/SoftdevI/gyan-personal-webiste/src/data/portfolioData.js).
Each project has a `technologies` array:

```javascript
// Example: Orbit or ASL Study Tool (around line 230)
technologies: [
  "React 19", "TypeScript", "Google MediaPipe Tasks Vision",
  "Your New Skill Here" // <-- Simply add strings here
]
```

### 3. Coursework Skills
Locate `portfolioData.coursework` in [`src/data/portfolioData.js`](file:///Users/gyanmistry/SoftdevI/gyan-personal-webiste/src/data/portfolioData.js).
Each of the 32 courses has a `technologies` array:

```javascript
// Example: CSCI 335 Machine Learning (around line 430)
technologies: [
  "Python", "Scikit-learn", "Support Vector Machines (SVMs)",
  "Your New Skill Here" // <-- Simply add strings here
]
```

### 4. Overall Technical Skills Matrix
Locate `portfolioData.skills` in [`src/data/portfolioData.js`](file:///Users/gyanmistry/SoftdevI/gyan-personal-webiste/src/data/portfolioData.js) (around line 95):

```javascript
skills: {
  "Programming Languages": ["Python", "Rust", "C++", ...],
  "Frameworks & AI/ML": ["PyTorch", "React 19", ...],
  "Data, Cloud & DevOps": ["Redis", "Docker", ...],
  "Systems, Quant & Methodologies": ["Multi-Agent Systems", ...]
}
```

---

## Deployment

This site is a static React single-page app and can be deployed anywhere in seconds:

### Deploy to Vercel
1. Push your repository to GitHub:
   ```bash
   git add .
   git commit -m "Comprehensive portfolio ready for deployment"
   git push origin main
   ```
2. Go to [vercel.com](https://vercel.com), import your repository `gyan-personal-webiste`.
3. Framework Preset: **Vite**.
4. Click **Deploy**.
