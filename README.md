# Gyan Mistry — Recruiter Portfolio Website

A fast, barebones, modern developer portfolio website designed specifically for tech recruiters and hiring managers. Features an interactive technology search engine, complete LinkedIn work experience, award-winning GitHub projects, RIT coursework list, and one-click resume access.

## Features

- **⚡ Recruiter Technology Search**: Type any skill or language (e.g. `Python`, `Rust`, `React`, `Docker`, `Tableau`, `MediaPipe`, `SQL`) to instantly see where it was used, with real-time match counters, accent glow spotlights, and quick-jump navigation.
- **🛡️ Recruiter Fast-Facts Snapshot**: Highlights active U.S. DoD Secret Clearance, '27 Summer internship goal, RIT Presidential Scholar honors, and first graduate of RIT's BS in AI program.
- **📄 Resume Integration**: Direct one-click download of `Gyan_Mistry_Resume_9262.pdf` and an embedded in-browser preview modal.
- **💼 Complete Work Experience**: Detailed impact metrics and bullet points from Lockheed Martin (F-16 IFG team), Redis (Cloud Operations R&D), RIT athletics/mentorship, and youth leadership with clean top-two default view.
- **🚀 Featured Projects**:
  - **Orbit**: Autonomous Multi-Agent OS (xAI Grok Competition Winner, with LinkedIn announcement link)
  - **ASL Study Tool**: Full-stack web app with real-time MediaPipe computer vision (Live on Vercel: https://asl-study-tool-kqbn-one.vercel.app/)
  - **Kalshi Quant & Betting Agent**: High-throughput polyglot Python + Rust prediction market execution engine
  - Plus 8 more open-source repositories from GitHub (Lane Assist Lite, CUDA Kernel Lab, Spike Rally, Anime Frame Search, Gridiron Market Lab, Thrift Swipe, Mancala Move Calculator, Clash Royale Bot).
- **📚 Coursework & Class List**: Full catalog of 32 RIT courses with official descriptions and extrapolated technical skills, with top 8 flagship courses shown by default.
- **🌐 Social Hub**: LinkedIn, GitHub, Twitter / X, Spotify, Email, and Live ASL Web App.
- **🌓 Dark & Light Mode**: Minimalist high-contrast developer theme persisted in `localStorage`.
- **📱 Responsive Mobile Navigation**: Built with full mobile drawer navigation and touch targets >= 44px.

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
