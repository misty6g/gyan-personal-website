# Gyan Mistry — Recruiter Portfolio Website

A fast, barebones, modern developer portfolio website designed specifically for tech recruiters and hiring managers. Features an interactive technology search engine, complete LinkedIn work experience, award-winning GitHub projects, RIT coursework list, and one-click resume access.

## Features

- **⚡ Recruiter Technology Search**: Type any skill or language (e.g. `Python`, `Rust`, `React`, `Docker`, `Tableau`, `MediaPipe`, `SQL`) to instantly see where it was used, with real-time match counters, accent glow spotlights, and quick-jump navigation.
- **🛡️ Recruiter Fast-Facts Snapshot**: Highlights active U.S. DoD Secret Clearance, '27 Summer internship goal, RIT Presidential Scholar honors, and first graduate of RIT's BS in AI program.
- **📄 Resume Integration**: Direct one-click download of `Gyan_Mistry_Resume_9262.pdf` and an embedded in-browser preview modal.
- **💼 Complete Work Experience**: Detailed impact metrics and bullet points from Lockheed Martin (F-16 IFG team), Redis (Cloud Operations R&D), RIT athletics/mentorship, and youth leadership.
- **🚀 Featured Projects**:
  - **Orbit**: Autonomous Multi-Agent OS (xAI Grok Competition Winner)
  - **ASL Study Tool**: Full-stack web app with real-time MediaPipe computer vision (Live on Vercel: https://asl-study-tool-kqbn-one.vercel.app/)
  - **Kalshi Quant**: High-throughput polyglot Python + Rust prediction market execution engine
  - **NFL Prediction Pipeline**: Quantitative sports modeling with Kalman filters and XGBoost
- **📚 Coursework & Class List**: Pre-populated with core RIT courses (NLP, ML, Enterprise Software, Stock Algo Trading, Linear Algebra, ASL Immersion) plus an extensible template for your full class list.
- **🌐 Social Hub**: Configured with LinkedIn, GitHub, Email, Live Vercel link, and ready placeholder slots for X/Twitter, Instagram, Discord, Spotify, etc.
- **🌓 Dark & Light Mode**: Minimalist high-contrast developer theme persisted in `localStorage`.
- **📦 Zero-Bloat Architecture**: Pure React 18 + Vite with clean CSS variables. 100% responsive, sub-second loads, 0 heavy UI dependencies.

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

## How to Customize

All portfolio content is centralized in **`src/data/portfolioData.js`**. You do not need to touch UI components to update your information!

### Adding Your Class List
Open `src/data/portfolioData.js` and locate the `coursework` array. You can add new entries using this format:

```javascript
{
  id: "cs-distributed-systems",
  code: "CSCI 452",
  title: "Operating & Distributed Systems",
  category: "Software Engineering",
  term: "Fall 2026",
  status: "Completed", // or "In Progress"
  technologies: ["C", "Linux", "POSIX", "Sockets"],
  description: "Concurrency, process scheduling, virtual memory, synchronization primitives, and distributed message passing."
}
```

### Adding Social Media Links
Open `src/data/portfolioData.js` and locate the `socials` array. Replace the empty `url` string for any platform:

```javascript
{
  platform: "X / Twitter",
  url: "https://x.com/yourhandle",
  handle: "@yourhandle",
  icon: "twitter",
  primary: false
}
```

### Adding New GitHub Projects
Add an object to `portfolioData.projects`:

```javascript
{
  id: "my-new-project",
  title: "Project Name",
  subtitle: "Short Subtitle",
  badge: "Featured / Award",
  description: "High-level summary of what problem it solves.",
  highlights: [
    "Key architectural achievement 1",
    "Performance metric or algorithm 2"
  ],
  technologies: ["Python", "Docker", "PyTorch"],
  githubUrl: "https://github.com/misty6g/repo",
  liveUrl: "https://myproject.vercel.app",
  featured: true
}
```

### Updating Resume PDF
To update your resume, simply replace `public/resume.pdf` with your updated PDF file. The download button and in-browser preview will automatically serve the updated version.

---

## Deployment

This site is a static React single-page app and can be deployed anywhere in seconds:

### Deploy to Vercel
1. Push your repository to GitHub:
   ```bash
   git add .
   git commit -m "Initial commit of recruiter portfolio"
   git push origin main
   ```
2. Go to [vercel.com](https://vercel.com), import your repository `gyan-personal-webiste`.
3. Framework Preset: **Vite**.
4. Click **Deploy**.

### Deploy to Netlify
1. Run `npm run build`.
2. Drag and drop the `dist/` folder into Netlify, or link the GitHub repo with build command `npm run build` and publish directory `dist`.

### Deploy to GitHub Pages
1. Set `base: './'` or `base: '/<repo-name>/'` in `vite.config.js`.
2. Run `npm run build` and push the `dist/` branch or use GitHub Actions.
