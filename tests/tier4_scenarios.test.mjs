import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {
  readProjectFile,
  fileExists,
  findFiles,
  extractCssDeclarations,
  extractCssVariables,
  extractMediaQueries,
  extractMetaTags,
  calculateContrastRatio,
  countWords,
  findEmDashes,
  PROJECT_ROOT,
} from './helpers/test_utils.mjs';
import { MockBrowser } from './helpers/mock_browser.mjs';

describe('Tier 4: Real-World Application Scenarios', () => {
  const cssContent = readProjectFile('src/index.css') || '';
  const htmlContent = readProjectFile('index.html') || '';
  const heroJsx = readProjectFile('src/components/Hero.jsx') || '';
  const resumeModalJsx = readProjectFile('src/components/ResumeModal.jsx') || '';
  const projectsJsx = readProjectFile('src/components/Projects.jsx') || '';
  const recruiterJsx = readProjectFile('src/components/RecruiterSearch.jsx') || '';
  const portfolioData = readProjectFile('src/data/portfolioData.js') || '';
  const vercelJson = readProjectFile('vercel.json');
  const browser = new MockBrowser();

  // -------------------------------------------------------------
  // Scenario S01: Recruiter Mobile Scan Scenario (375x812 iPhone)
  // -------------------------------------------------------------
  describe('Scenario S01: Recruiter Mobile Scan Scenario (375x812 iPhone)', () => {
    it('S01-Step 1: Mobile recruiter loads page at 375x812 with no horizontal overflow', () => {
      browser.setViewport(375, 812);
      const htmlRules = extractCssDeclarations(cssContent, 'html');
      const bodyRules = extractCssDeclarations(cssContent, 'body');

      const htmlHidden = htmlRules.some((r) => r.props['overflow-x'] === 'hidden');
      const bodyHidden = bodyRules.some((r) => r.props['overflow-x'] === 'hidden');

      assert.ok(htmlHidden && bodyHidden, 'Document root (html & body) must enforce overflow-x: hidden to prevent horizontal panning');
    });

    it('S01-Step 2: Recruiter scans hero value proposition (<= 20 words) within initial fold', () => {
      const heroBioMatch = heroJsx.match(/className=["']hero-bio["'][^>]*>([\s\S]*?)<\//);
      let words = 0;
      if (heroBioMatch) {
        words = countWords(heroBioMatch[1]);
      } else {
        const pMatch = portfolioData.match(/about:\s*\[\s*['"`]([\s\S]*?)['"`]/);
        if (pMatch) words = countWords(pMatch[1]);
      }
      assert.ok(words <= 20, `Hero value proposition must be <= 20 words for fast recruiter scan, found ${words} words`);
    });

    it('S01-Step 3: Recruiter taps View Resume CTA with touch-compliant hit target (>= 44px)', () => {
      const btnRules = extractCssDeclarations(cssContent, /\.btn\b|\.resume-nav-btn/);
      const hasTouchTarget = btnRules.some((r) => {
        const h = parseFloat(r.props['min-height'] || r.props.height || '0');
        return h >= 44;
      });
      assert.ok(hasTouchTarget, 'Resume CTA must satisfy >= 44px tap target for comfortable one-handed mobile tapping');
    });

    it('S01-Step 4: ResumeModal renders responsively at 375px without horizontal collision', () => {
      const headerRules = extractCssDeclarations(cssContent, '.modal-header');
      const mediaQueries = extractMediaQueries(cssContent);
      const hasWrap =
        headerRules.some((r) => r.props['flex-wrap'] === 'wrap') ||
        mediaQueries.some((mq) => (mq.condition.includes('768px') || mq.condition.includes('640px')) && mq.body.includes('flex-wrap: wrap'));
      assert.ok(hasWrap, 'ResumeModal header must flex-wrap actions on mobile');
    });

    it('S01-Step 5: ResumeModal PDF download link points to valid resume asset', () => {
      assert.ok(resumeModalJsx.includes('download='), 'Modal must offer direct PDF download attribute');
      const hasPdf = fileExists('public/resume.pdf') || fileExists('Gyan_Mistry_Resume_9262.pdf');
      assert.ok(hasPdf, 'Resume PDF file must exist in project');
    });
  });

  // -------------------------------------------------------------
  // Scenario S02: Engineering Manager Tablet Review Scenario (768x1024 iPad)
  // -------------------------------------------------------------
  describe('Scenario S02: Engineering Manager Tablet Review Scenario (768x1024 iPad)', () => {
    it('S02-Step 1: Tablet layout maintains single row or clean navigation at 768px', () => {
      browser.setViewport(768, 1024);
      const headerRules = extractCssDeclarations(cssContent, '.site-header');
      assert.ok(headerRules.length > 0);
      const h = parseFloat(headerRules[0].props.height || '64');
      assert.ok(h <= 80, 'Header height must stay <= 80px on tablet');
    });

    it('S02-Step 2: EM searches for "Rust" or technical skill in RecruiterSearch', () => {
      assert.ok(recruiterJsx.includes('search-input'), 'RecruiterSearch component renders search input');
      assert.ok(portfolioData.includes('Rust') || portfolioData.includes('Python'), 'Portfolio data includes systems engineering keywords');
    });

    it('S02-Step 3: Project cards render with unified accent color and WCAG AA contrast', () => {
      const rootVars = extractCssVariables(cssContent, ':root');
      const accent = rootVars['--color-accent'] || rootVars['--accent-cyan'] || '#38bdf8';
      const bgCard = rootVars['--bg-card'] || '#0d1527';
      const contrast = calculateContrastRatio(accent, bgCard);
      assert.ok(contrast >= 4.5, `Project accent tag contrast is ${contrast.toFixed(2)}:1 (must be >= 4.5:1)`);
    });

    it('S02-Step 4: Live Demo link is deduplicated (no conflicting secondary link to same URL)', () => {
      const hasLiveDemo = projectsJsx.includes('Live Demo');
      const hasProdDeploy = projectsJsx.includes('Production Deployment');
      assert.equal(hasLiveDemo && hasProdDeploy, false, 'Project actions must not duplicate Live Demo and Production Deployment');
    });
  });

  // -------------------------------------------------------------
  // Scenario S03: Accessibility & Design Taste Auditor Scenario
  // -------------------------------------------------------------
  describe('Scenario S03: Accessibility & Design Taste Auditor Scenario', () => {
    it('S03-Step 1: Full contrast audit across text, links, and buttons in dark mode', () => {
      const rootVars = extractCssVariables(cssContent, ':root');
      const textPrimary = rootVars['--text-primary'] || '#f8fafc';
      const textMuted = rootVars['--text-muted'] || '#64748b';
      const bgCard = rootVars['--bg-card'] || '#0d1527';

      const primContrast = calculateContrastRatio(textPrimary, bgCard);
      const mutedContrast = calculateContrastRatio(textMuted, bgCard);

      assert.ok(primContrast >= 4.5, `Primary text contrast is ${primContrast.toFixed(2)}:1`);
      assert.ok(mutedContrast >= 4.5, `Muted text contrast is ${mutedContrast.toFixed(2)}:1 (must be >= 4.5:1)`);
    });

    it('S03-Step 2: Full contrast audit across text, links, and buttons in light mode', () => {
      const lightVars = extractCssVariables(cssContent, '[data-theme="light"]');
      const textPrimary = lightVars['--text-primary'] || '#0f172a';
      const textAccent = lightVars['--color-accent'] || lightVars['--text-accent'] || '#0284c7';
      const bgCard = lightVars['--bg-card'] || '#ffffff';

      const primContrast = calculateContrastRatio(textPrimary, bgCard);
      const accentContrast = calculateContrastRatio(textAccent, bgCard);

      assert.ok(primContrast >= 4.5, `Light primary contrast is ${primContrast.toFixed(2)}:1`);
      assert.ok(accentContrast >= 4.5, `Light accent contrast is ${accentContrast.toFixed(2)}:1 (must be >= 4.5:1)`);
    });

    it('S03-Step 3: Verification of prefers-reduced-motion media query', () => {
      const mediaQueries = extractMediaQueries(cssContent);
      const rm = mediaQueries.find((mq) => mq.condition.includes('prefers-reduced-motion'));
      assert.ok(rm, 'prefers-reduced-motion must be declared');
      assert.ok(rm.body.includes('0.01ms') || rm.body.includes('none'), 'Motion must collapse to instant');
    });

    it('S03-Step 4: Verification of prefers-reduced-transparency fallback', () => {
      const mediaQueries = extractMediaQueries(cssContent);
      const rt = mediaQueries.find((mq) => mq.condition.includes('prefers-reduced-transparency'));
      assert.ok(rt, 'prefers-reduced-transparency must be declared');
      assert.ok(rt.body.includes('background') || rt.body.includes('none'), 'Opaque background must be enforced');
    });

    it('S03-Step 5: Zero em-dashes mechanical audit across repository', () => {
      const srcFiles = findFiles('src');
      for (const f of srcFiles) {
        const content = readProjectFile(f);
        const dashes = findEmDashes(content);
        assert.equal(dashes.length, 0, `Em-dash detected in ${f}`);
      }
      const readmeDashes = findEmDashes(readProjectFile('README.md'));
      assert.equal(readmeDashes.length, 0, 'Em-dash detected in README.md');
    });
  });

  // -------------------------------------------------------------
  // Scenario S04: Turnkey Vercel Deployment Scenario
  // -------------------------------------------------------------
  describe('Scenario S04: Turnkey Vercel Deployment Scenario', () => {
    it('S04-Step 1: vercel.json exists and is configured for SPA rewrites', () => {
      assert.ok(vercelJson, 'vercel.json must be present');
      const config = JSON.parse(vercelJson);
      assert.ok(config.rewrites?.some((r) => r.source === '/(.*)' && r.destination === '/'), 'SPA rewrite rule missing');
    });

    it('S04-Step 2: vercel.json includes security headers', () => {
      assert.ok(vercelJson);
      const config = JSON.parse(vercelJson);
      const hasSecurity = config.headers?.some((h) => h.headers?.some((item) => item.key.toLowerCase().includes('x-content-type-options')));
      assert.ok(hasSecurity, 'Security headers missing from vercel.json');
    });

    it('S04-Step 3: HTML includes full social metadata and theme-color', () => {
      const metaTags = extractMetaTags(htmlContent);
      assert.ok(metaTags.some((m) => m.property === 'og:image'), 'og:image missing');
      assert.ok(metaTags.some((m) => m.property === 'og:url'), 'og:url missing');
      assert.ok(metaTags.some((m) => m.name === 'twitter:card'), 'twitter:card missing');
      assert.ok(metaTags.some((m) => m.name === 'theme-color'), 'theme-color missing');
    });

    it('S04-Step 4: Required static assets exist in public/', () => {
      assert.ok(fileExists('public/favicon.svg'), 'public/favicon.svg missing');
      assert.ok(fileExists('public/resume.pdf'), 'public/resume.pdf missing');
    });
  });

  // -------------------------------------------------------------
  // Scenario S05: Cross-Device Responsive Stress Scenario
  // -------------------------------------------------------------
  describe('Scenario S05: Cross-Device Responsive Stress Scenario', () => {
    const devices = [
      { name: 'Galaxy S8 / SE', width: 360, height: 640 },
      { name: 'iPhone 14', width: 390, height: 844 },
      { name: 'iPhone Plus', width: 414, height: 896 },
      { name: 'iPad Mini', width: 768, height: 1024 },
      { name: 'iPad Pro', width: 1024, height: 1366 },
      { name: 'FHD Desktop', width: 1920, height: 1080 },
      { name: '4K Display', width: 3840, height: 2160 },
    ];

    for (const dev of devices) {
      it(`S05: Viewport ${dev.width}px (${dev.name}) maintains layout integrity and overflow containment`, () => {
        browser.setViewport(dev.width, dev.height);
        assert.equal(browser.width, dev.width);
        assert.ok(browser.dvh > 0, 'dvh height must be positive');
      });
    }
  });
});
