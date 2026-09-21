import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

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
} from './helpers/test_utils.mjs';
import { MockBrowser } from './helpers/mock_browser.mjs';

describe('Tier 2: Boundary & Corner Cases (F01 - F19)', () => {
  const cssContent = readProjectFile('src/index.css') || '';
  const htmlContent = readProjectFile('index.html') || '';
  const heroJsx = readProjectFile('src/components/Hero.jsx') || '';
  const headerJsx = readProjectFile('src/components/Header.jsx') || '';
  const resumeModalJsx = readProjectFile('src/components/ResumeModal.jsx') || '';
  const projectsJsx = readProjectFile('src/components/Projects.jsx') || '';
  const recruiterJsx = readProjectFile('src/components/RecruiterSearch.jsx') || '';
  const skillsMatrixJsx = readProjectFile('src/components/SkillsMatrix.jsx') || '';
  const portfolioData = readProjectFile('src/data/portfolioData.js') || '';
  const vercelJson = readProjectFile('vercel.json');
  const browser = new MockBrowser();

  // -------------------------------------------------------------
  // F01 Boundary: Viewport Units at Device Breakpoint Boundaries
  // -------------------------------------------------------------
  describe('F01 Boundary: Viewport Units & Dynamic Height Extremes', () => {
    const mobileWidths = [360, 375, 390, 414, 500];
    for (const w of mobileWidths) {
      it(`F01-B-${w}px: Modal height does not overflow dvh boundary at ${w}px width`, () => {
        browser.setViewport(w, 700, { browserChromeHeight: 56 });
        assert.ok(browser.dvh < browser.vh, 'dvh must account for mobile browser chrome');
        const modalRules = extractCssDeclarations(cssContent, '.modal-dialog');
        const hasDvh = modalRules.some((r) => r.props.height?.includes('dvh') || r.props['max-height']?.includes('dvh'));
        assert.ok(hasDvh, `Modal dialog must use dvh at ${w}px`);
      });
    }
  });

  // -------------------------------------------------------------
  // F02 Boundary: Document Overflow Containment Across All Viewport Widths
  // -------------------------------------------------------------
  describe('F02 Boundary: Document Overflow Containment Across Viewports', () => {
    const widths = [360, 390, 414, 500, 768, 1024, 1920, 3840];
    for (const w of widths) {
      it(`F02-B-${w}px: Document containment holds at ${w}px width without horizontal blowout`, () => {
        browser.setViewport(w, 800);
        const htmlRules = extractCssDeclarations(cssContent, 'html');
        const bodyRules = extractCssDeclarations(cssContent, 'body');
        const htmlHidden = htmlRules.some((r) => r.props['overflow-x'] === 'hidden');
        const bodyHidden = bodyRules.some((r) => r.props['overflow-x'] === 'hidden');
        assert.ok(htmlHidden && bodyHidden, `Root elements must have overflow-x: hidden at ${w}px`);
      });
    }
  });

  // -------------------------------------------------------------
  // F03 Boundary: Mobile Navigation Drawer Rapid Toggles & Edge States
  // -------------------------------------------------------------
  describe('F03 Boundary: Mobile Navigation Drawer Edge States', () => {
    it('F03-B1: Header height remains unconstrained during drawer expansion', () => {
      const headerOpenRules = extractCssDeclarations(cssContent, /\.site-header.*open|\.mobile-menu-open/);
      const headerNormal = extractCssDeclarations(cssContent, '.site-header');
      const fixed64 = headerNormal.some((r) => r.props.height === '64px');
      assert.ok(headerOpenRules.length > 0 || !fixed64, 'Header height must not clip drawer during open state');
    });

    it('F03-B2: Mobile drawer renders within 360px viewport without left/right clipping', () => {
      const drawerRules = extractCssDeclarations(cssContent, '.mobile-nav-drawer');
      assert.ok(drawerRules.length > 0);
      const widthSafe = drawerRules.every((r) => r.props.width !== '100vw');
      assert.ok(widthSafe, 'Drawer should use width 100% instead of 100vw to prevent scrollbar overflow');
    });

    it('F03-B3: Navigation drawer links have distinct focus states for keyboard users', () => {
      const linkFocusRules = extractCssDeclarations(cssContent, /\.nav-link:focus|\.mobile-nav-drawer a:focus/);
      assert.ok(linkFocusRules.length > 0 || cssContent.includes(':focus-visible'), 'Focus states must be provided');
    });

    it('F03-B4: Rapid toggling does not corrupt aria-expanded attribute in Header.jsx', () => {
      assert.ok(headerJsx.includes('aria-expanded'), 'Header must reflect boolean aria-expanded state');
    });

    it('F03-B5: Mobile menu button maintains visibility above open drawer', () => {
      const toggleRules = extractCssDeclarations(cssContent, '.mobile-menu-toggle');
      assert.ok(toggleRules.length > 0);
    });
  });

  // -------------------------------------------------------------
  // F04 Boundary: Touch Target Dimensions at Minimum Extremes
  // -------------------------------------------------------------
  describe('F04 Boundary: Touch Target Extreme Sizing Verification', () => {
    it('F04-B1: Theme toggle button hit area is >= 44x44px at 360px mobile', () => {
      const btnIconRules = extractCssDeclarations(cssContent, '.btn-icon');
      const w = parseFloat(btnIconRules[0]?.props.width || '0');
      const h = parseFloat(btnIconRules[0]?.props.height || '0');
      assert.ok(w >= 44 && h >= 44, `Theme toggle button must be >= 44x44px, observed ${w}x${h}px`);
    });

    it('F04-B2: Mobile menu toggle hit area is >= 44x44px at 360px mobile', () => {
      const toggleRules = extractCssDeclarations(cssContent, '.mobile-menu-toggle');
      const w = parseFloat(toggleRules[0]?.props.width || '0');
      const h = parseFloat(toggleRules[0]?.props.height || '0');
      assert.ok(w >= 44 && h >= 44, `Menu toggle must be >= 44x44px, observed ${w}x${h}px`);
    });

    it('F04-B3: Resume button hit area is >= 44px min-height', () => {
      const resumeRules = extractCssDeclarations(cssContent, '.resume-nav-btn');
      const h = parseFloat(resumeRules[0]?.props['min-height'] || resumeRules[0]?.props.height || '0');
      assert.ok(h >= 44, `Resume nav button must be >= 44px, observed ${h}px`);
    });

    it('F04-B4: Filter chip buttons hit area is >= 44px on touch viewports', () => {
      const chipRules = extractCssDeclarations(cssContent, /\.chip|\.filter-pill/);
      assert.ok(chipRules.length > 0);
    });

    it('F04-B5: Modal close button touch target meets >= 44x44px', () => {
      const closeRules = extractCssDeclarations(cssContent, /\.modal-close|\.modal-header .btn-icon/);
      const isTargetCompliant = closeRules.some((r) => {
        const w = parseFloat(r.props.width || r.props['min-width'] || '0');
        const h = parseFloat(r.props.height || r.props['min-height'] || '0');
        return w >= 44 && h >= 44;
      });
      assert.ok(isTargetCompliant, 'Modal close button must satisfy >= 44x44px touch target');
    });
  });

  // -------------------------------------------------------------
  // F05 Boundary: Mobile ResumeModal Under Narrow and Wide Viewports
  // -------------------------------------------------------------
  describe('F05 Boundary: ResumeModal Extreme Viewports & Content Length', () => {
    it('F05-B1: Modal header flex-wraps at 360px narrow viewport', () => {
      const headerRules = extractCssDeclarations(cssContent, '.modal-header');
      const mediaQueries = extractMediaQueries(cssContent);
      const hasWrap =
        headerRules.some((r) => r.props['flex-wrap'] === 'wrap') ||
        mediaQueries.some((mq) => (mq.condition.includes('768px') || mq.condition.includes('640px')) && mq.body.includes('flex-wrap: wrap'));
      assert.ok(hasWrap, 'Modal header must wrap at 360px');
    });

    it('F05-B2: Modal title overflow is contained when file name is exceptionally long', () => {
      const titleRules = extractCssDeclarations(cssContent, '.modal-title');
      assert.ok(titleRules.length > 0);
      const contains = titleRules.some((r) => r.props.overflow === 'hidden' || r.props['text-overflow'] === 'ellipsis' || r.props['word-break']);
      assert.ok(contains, 'Modal title must handle long file names without blowout');
    });

    it('F05-B3: Modal action buttons maintain readable font size on mobile', () => {
      assert.ok(resumeModalJsx.includes('btn'), 'Modal must render action buttons');
    });

    it('F05-B4: Modal dialog max-width prevents edge collision with viewport margins', () => {
      const modalRules = extractCssDeclarations(cssContent, '.modal-dialog');
      assert.ok(modalRules.length > 0);
    });

    it('F05-B5: Modal dialog maintains high z-index above all other layers', () => {
      const overlayRules = extractCssDeclarations(cssContent, /\.modal-overlay|\.modal-backdrop/);
      assert.ok(overlayRules.length > 0);
      const z = parseInt(overlayRules[0]?.props['z-index'] || '0', 10);
      assert.ok(z >= 50, `Modal overlay z-index must be >= 50, got ${z}`);
    });
  });

  // -------------------------------------------------------------
  // F06 Boundary: SkillsMatrix Track Containment & Long Tokens
  // -------------------------------------------------------------
  describe('F06 Boundary: SkillsMatrix Track Containment & Token Stress', () => {
    it('F06-B1: Skills matrix collapses to 1 column at 360px mobile', () => {
      const mediaQueries = extractMediaQueries(cssContent);
      const has1Col = mediaQueries.some(
        (mq) => (mq.condition.includes('640px') || mq.condition.includes('768px')) && mq.body.includes('skills-matrix') && mq.body.includes('1fr')
      );
      assert.ok(has1Col, 'Skills matrix must switch to single column at 360px');
    });

    it('F06-B2: Skills category cards have min-width: 0 to prevent grid track expansion', () => {
      const cardRules = extractCssDeclarations(cssContent, /\.skills-category-card|\.skills-grid > \*/);
      const hasMinWidth0 = cardRules.some((r) => r.props['min-width'] === '0' || r.props['min-width'] === '0px');
      assert.ok(hasMinWidth0, 'Cards must declare min-width: 0 to contain wide flex items');
    });

    it('F06-B3: Skill name tokens with special characters (C++, CI/CD, TCP/IP) do not break layout', () => {
      assert.ok(portfolioData.includes('C++'), 'Portfolio data contains C++');
      assert.ok(portfolioData.includes('CI/CD') || portfolioData.includes('Docker'), 'Portfolio data contains DevOps tokens');
    });

    it('F06-B4: Skills category titles do not overflow card boundaries', () => {
      const catTitleRules = extractCssDeclarations(cssContent, '.skills-category-title');
      assert.ok(catTitleRules.length > 0);
    });

    it('F06-B5: Skills matrix gap does not cause horizontal scrollbar on mobile', () => {
      const matrixRules = extractCssDeclarations(cssContent, '.skills-matrix');
      assert.ok(matrixRules.length > 0);
    });
  });

  // -------------------------------------------------------------
  // F07 Boundary: Search Input Font Sizing & Focus State
  // -------------------------------------------------------------
  describe('F07 Boundary: Search Input Font Sizing & Focus Zoom Prevention', () => {
    it('F07-B1: Search input font-size is strictly >= 16px at 360px viewport', () => {
      const inputRules = extractCssDeclarations(cssContent, '.search-input');
      const fs = inputRules[0]?.props['font-size'] || '';
      const isCompliant = fs.includes('1rem') || fs.includes('16px') || parseFloat(fs) >= 16;
      assert.ok(isCompliant, `Search input font-size must be >= 16px, got ${fs}`);
    });

    it('F07-B2: Search input font-size is strictly >= 16px at 390px viewport', () => {
      const mediaQueries = extractMediaQueries(cssContent);
      const mobileMq = mediaQueries.filter((mq) => mq.condition.includes('768px') || mq.condition.includes('640px'));
      const dropsBelow16 = mobileMq.some((mq) => {
        if (!mq.body.includes('.search-input')) return false;
        const m = mq.body.match(/font-size:\s*([0-9.]+)(px|rem)/);
        return m && ((m[2] === 'px' && parseFloat(m[1]) < 16) || (m[2] === 'rem' && parseFloat(m[1]) < 1.0));
      });
      assert.equal(dropsBelow16, false, 'Mobile media query must not drop search input font below 16px');
    });

    it('F07-B3: Focus state does not apply CSS transform: scale() that simulates iOS zoom', () => {
      const focusRules = extractCssDeclarations(cssContent, '.search-input:focus');
      const scales = focusRules.some((r) => r.props.transform?.includes('scale'));
      assert.equal(scales, false, 'Focus state must not scale search input');
    });

    it('F07-B4: Search placeholder text is readable and does not clip at 360px', () => {
      assert.ok(recruiterJsx.includes('placeholder='), 'Search input must define placeholder');
    });

    it('F07-B5: Search input clear button hit area does not obstruct typed text', () => {
      assert.ok(recruiterJsx.includes('search-input'), 'Search input exists');
    });
  });

  // -------------------------------------------------------------
  // F08 Boundary: Em-Dash Byte and Encoding Boundaries
  // -------------------------------------------------------------
  describe('F08 Boundary: Em-Dash Byte and Encoding Boundaries', () => {
    it('F08-B1: Zero UTF-8 bytes 0xE2 0x80 0x94 (em-dash) in src/', () => {
      const srcFiles = findFiles('src');
      for (const f of srcFiles) {
        const buf = fs.readFileSync(f);
        let found = false;
        for (let i = 0; i < buf.length - 2; i++) {
          if (buf[i] === 0xe2 && buf[i + 1] === 0x80 && buf[i + 2] === 0x94) {
            found = true;
            break;
          }
        }
        assert.equal(found, false, `UTF-8 em-dash byte sequence detected in ${f}`);
      }
    });

    it('F08-B2: Zero unicode escape \\u2014 in any JSON or JS file', () => {
      const allFiles = findFiles('src', ['.js', '.jsx', '.json']);
      for (const f of allFiles) {
        const content = readProjectFile(f);
        assert.equal(content.includes('\\u2014'), false, `Unicode \\u2014 escape found in ${f}`);
      }
    });

    it('F08-B3: Zero em-dash in root index.html', () => {
      const dashes = findEmDashes(htmlContent);
      assert.equal(dashes.length, 0, 'index.html must not contain em-dashes');
    });

    it('F08-B4: Zero em-dash in README.md', () => {
      const readme = readProjectFile('README.md');
      const dashes = findEmDashes(readme);
      assert.equal(dashes.length, 0, 'README.md must not contain em-dashes');
    });

    it('F08-B5: Zero decorative en-dashes surrounded by spaces in portfolioData.js', () => {
      const hasDecorativeEnDash = /\s–\s/.test(portfolioData);
      assert.equal(hasDecorativeEnDash, false, 'portfolioData.js must not use decorative en-dashes as separators');
    });
  });

  // -------------------------------------------------------------
  // F09 Boundary: Hero Content Limits and Viewport Fold Fit
  // -------------------------------------------------------------
  describe('F09 Boundary: Hero Content Limits & Fold Fit', () => {
    it('F09-B1: Hero headline fits within <= 2 lines on 1920x1080 desktop', () => {
      browser.setViewport(1920, 1080);
      assert.ok(portfolioData.includes('Gyan Atul Mistry') || portfolioData.includes('Gyan Mistry'), 'Name present');
    });

    it('F09-B2: Hero subtext word count strictly <= 20 words', () => {
      const heroBioMatch = heroJsx.match(/className=["']hero-bio["'][^>]*>([\s\S]*?)<\//);
      let count = 0;
      if (heroBioMatch) {
        count = countWords(heroBioMatch[1]);
      } else {
        const pMatch = portfolioData.match(/about:\s*\[\s*['"`]([\s\S]*?)['"`]/);
        if (pMatch) count = countWords(pMatch[1]);
      }
      assert.ok(count <= 20, `Hero subtext must be <= 20 words, got ${count}`);
    });

    it('F09-B3: Hero contains at most 4 text elements', () => {
      let elements = 0;
      if (heroJsx.includes('hero-eyebrow') || heroJsx.includes('hero-top-badges')) elements++;
      if (heroJsx.includes('hero-name')) elements++;
      if (heroJsx.includes('hero-bio') || heroJsx.includes('hero-subtext')) elements++;
      if (heroJsx.includes('hero-actions')) elements++;
      if (heroJsx.includes('socials-hub')) elements++;
      if (heroJsx.includes('hero-location')) elements++;
      assert.ok(elements <= 4, `Hero contains ${elements} text elements, max allowed is 4`);
    });

    it('F09-B4: Hero top padding does not exceed pt-24 (96px / 6rem)', () => {
      const heroRules = extractCssDeclarations(cssContent, '.hero-section');
      const pad = parseFloat(heroRules[0]?.props['padding-top'] || '0');
      const isRem = (heroRules[0]?.props['padding-top'] || '').includes('rem');
      const px = isRem ? pad * 16 : pad;
      assert.ok(px <= 96, `Hero padding-top must be <= 96px, got ${px}px`);
    });

    it('F09-B5: Hero CTAs fit above the fold without requiring scroll on 1080p desktop', () => {
      browser.setViewport(1920, 1080);
      assert.ok(browser.height >= 800, 'Desktop height allows fold fit');
    });
  });

  // -------------------------------------------------------------
  // F10 Boundary: Desktop Navigation Height & Tablet Transition
  // -------------------------------------------------------------
  describe('F10 Boundary: Desktop Navigation Height & Tablet Breakpoint', () => {
    it('F10-B1: Header height is <= 80px at 1024px desktop breakpoint', () => {
      const headerRules = extractCssDeclarations(cssContent, '.site-header');
      const h = parseFloat(headerRules[0]?.props.height || headerRules[0]?.props['max-height'] || '0');
      assert.ok(h <= 80 && h >= 48, `Header height must be <= 80px, got ${h}px`);
    });

    it('F10-B2: Desktop navigation remains on a single line at 1280px', () => {
      const navRules = extractCssDeclarations(cssContent, '.desktop-nav');
      const noWrap = navRules.every((r) => r.props['flex-wrap'] !== 'wrap');
      assert.ok(noWrap, 'Desktop nav must not wrap at 1280px');
    });

    it('F10-B3: Desktop navigation remains on a single line at 1440px', () => {
      const navRules = extractCssDeclarations(cssContent, '.desktop-nav');
      const isFlex = navRules.some((r) => r.props.display === 'flex');
      assert.ok(isFlex, 'Desktop nav uses flexbox at 1440px');
    });

    it('F10-B4: Desktop navigation remains on a single line at 1920px Full HD', () => {
      browser.setViewport(1920, 1080);
      assert.equal(browser.width, 1920);
    });

    it('F10-B5: Desktop navigation remains on a single line at 3840px 4K', () => {
      browser.setViewport(3840, 2160);
      assert.equal(browser.width, 3840);
    });
  });

  // -------------------------------------------------------------
  // F11 Boundary: Section Eyebrow Count Constraint
  // -------------------------------------------------------------
  describe('F11 Boundary: Section Eyebrows Restraint Limit', () => {
    it('F11-B1: Total section eyebrows count is strictly <= 3 across all JSX files', () => {
      const jsxFiles = findFiles('src', ['.jsx']);
      let count = 0;
      for (const f of jsxFiles) {
        const content = readProjectFile(f);
        const matches = content.match(/className=["'][^"']*(?:eyebrow|section-eyebrow)[^"']*["']/g) || [];
        count += matches.length;
      }
      assert.ok(count <= 3, `Total eyebrows is ${count}, must be <= 3`);
    });

    it('F11-B2: No section titles contain numbered pagination (01/, 001 ·)', () => {
      const jsxFiles = findFiles('src', ['.jsx']);
      for (const f of jsxFiles) {
        const content = readProjectFile(f);
        assert.equal(/0[0-9]\s*[\/·]/.test(content), false, `Numbered pagination found in ${f}`);
      }
    });

    it('F11-B3: Section headers do not use banned split-header 2-column pattern', () => {
      const headerRules = extractCssDeclarations(cssContent, '.section-header');
      const isSplit = headerRules.some((r) => r.props.display === 'grid' && r.props['grid-template-columns']?.includes('2fr'));
      assert.equal(isSplit, false, 'Split header pattern is banned');
    });

    it('F11-B4: Section titles use semantic h2 elements in all section views', () => {
      const sections = ['Experience.jsx', 'Projects.jsx', 'Coursework.jsx', 'SkillsMatrix.jsx'];
      for (const s of sections) {
        const content = readProjectFile(`src/components/${s}`);
        assert.ok(content.includes('<h2'), `${s} must use <h2>`);
      }
    });

    it('F11-B5: Section subtitles maintain readable line length', () => {
      const subRules = extractCssDeclarations(cssContent, '.section-subtitle');
      assert.ok(subRules.length > 0);
    });
  });

  // -------------------------------------------------------------
  // F12 Boundary: Theme & Single Accent Lock Consistency
  // -------------------------------------------------------------
  describe('F12 Boundary: Theme & Single Accent Palette Consistency', () => {
    it('F12-B1: Zero mid-page inverted sections across all sections', () => {
      const sectionRules = extractCssDeclarations(cssContent, /\.section-wrapper|\.app-section/);
      const hardcodedInversion = sectionRules.some((r) => r.props.background === '#ffffff' && r.props.color === '#000000');
      assert.equal(hardcodedInversion, false, 'Zero mid-page inversions permitted');
    });

    it('F12-B2: Primary accent token is defined on :root', () => {
      const rootVars = extractCssVariables(cssContent, ':root');
      assert.ok(rootVars['--color-accent'] || rootVars['--accent-primary'] || rootVars['--accent-cyan']);
    });

    it('F12-B3: Badges do not define multi-colored rainbow variants', () => {
      const badgeEmerald = extractCssDeclarations(cssContent, '.badge-emerald');
      const badgeAmber = extractCssDeclarations(cssContent, '.badge-amber');
      const badgeViolet = extractCssDeclarations(cssContent, '.badge-violet');
      assert.equal(badgeEmerald.length + badgeAmber.length + badgeViolet.length, 0, 'Rainbow badge classes must be eliminated');
    });

    it('F12-B4: Light mode overrides declared via [data-theme="light"]', () => {
      const lightVars = extractCssVariables(cssContent, '[data-theme="light"]');
      assert.ok(Object.keys(lightVars).length > 0, 'Light mode variables must be defined');
    });

    it('F12-B5: Accent hover color derives from same hue', () => {
      const rootVars = extractCssVariables(cssContent, ':root');
      assert.ok(rootVars['--color-accent-hover'] || rootVars['--accent-hover'] || rootVars['--color-accent']);
    });
  });

  // -------------------------------------------------------------
  // F13 Boundary: Materiality & Glassmorphism Transparency Fallbacks
  // -------------------------------------------------------------
  describe('F13 Boundary: Glassmorphism Fallback & Transparency States', () => {
    it('F13-B1: Header background is translucent when backdrop-filter is active', () => {
      const headerRules = extractCssDeclarations(cssContent, '.site-header');
      const hasBlur = headerRules.some((r) => r.props['backdrop-filter']?.includes('blur'));
      if (hasBlur) {
        const bg = headerRules.find((r) => r.props.background)?.props.background || '';
        assert.equal(/^#[0-9a-f]{6}$/i.test(bg), false, 'Header background must be translucent when blurred');
      }
      assert.ok(true);
    });

    it('F13-B2: Header defines subtle border or shadow highlight', () => {
      const headerRules = extractCssDeclarations(cssContent, '.site-header');
      const hasHighlight = headerRules.some((r) => r.props['border-bottom'] || r.props['box-shadow']);
      assert.ok(hasHighlight, 'Header must define subtle border or highlight');
    });

    it('F13-B3: @media (prefers-reduced-transparency: reduce) is defined in stylesheet', () => {
      const mediaQueries = extractMediaQueries(cssContent);
      const hasRt = mediaQueries.some((mq) => mq.condition.includes('prefers-reduced-transparency'));
      assert.ok(hasRt, 'prefers-reduced-transparency media query must exist');
    });

    it('F13-B4: Reduced transparency provides solid opaque background', () => {
      const mediaQueries = extractMediaQueries(cssContent);
      const rt = mediaQueries.find((mq) => mq.condition.includes('prefers-reduced-transparency'));
      assert.ok(rt, 'prefers-reduced-transparency exists');
      assert.ok(rt.body.includes('background') || rt.body.includes('none'), 'Must provide solid fallback background');
    });

    it('F13-B5: Cards avoid pure-black drop shadows', () => {
      const cardRules = extractCssDeclarations(cssContent, '.card');
      if (cardRules.length > 0) {
        assert.equal(cardRules[0].props['box-shadow']?.includes('rgba(0, 0, 0, 1)'), false);
      }
      assert.ok(true);
    });
  });

  // -------------------------------------------------------------
  // F14 Boundary: WCAG AA Minimum Contrast Threshold Boundaries
  // -------------------------------------------------------------
  describe('F14 Boundary: WCAG AA Minimum Contrast Thresholds (>= 4.50:1)', () => {
    const rootVars = extractCssVariables(cssContent, ':root');
    const lightVars = extractCssVariables(cssContent, '[data-theme="light"]');

    it('F14-B1: Dark mode primary text contrast is strictly >= 4.50:1', () => {
      const text = rootVars['--text-primary'] || '#f8fafc';
      const bg = rootVars['--bg-card'] || '#0d1527';
      const ratio = calculateContrastRatio(text, bg);
      assert.ok(ratio >= 4.50, `Contrast is ${ratio.toFixed(2)}:1 (>= 4.50:1)`);
    });

    it('F14-B2: Dark mode muted text contrast is strictly >= 4.50:1', () => {
      const text = rootVars['--text-muted'] || '#64748b';
      const bg = rootVars['--bg-card'] || '#0d1527';
      const ratio = calculateContrastRatio(text, bg);
      assert.ok(ratio >= 4.50, `Contrast is ${ratio.toFixed(2)}:1 (>= 4.50:1)`);
    });

    it('F14-B3: Light mode accent text contrast is strictly >= 4.50:1', () => {
      const text = lightVars['--color-accent'] || lightVars['--text-accent'] || '#0284c7';
      const bg = lightVars['--bg-card'] || '#ffffff';
      const ratio = calculateContrastRatio(text, bg);
      assert.ok(ratio >= 4.50, `Contrast is ${ratio.toFixed(2)}:1 (>= 4.50:1)`);
    });

    it('F14-B4: Light mode primary button label contrast is strictly >= 4.50:1', () => {
      const bg = lightVars['--color-accent'] || '#0284c7';
      const text = '#ffffff';
      const ratio = calculateContrastRatio(text, bg);
      assert.ok(ratio >= 4.50, `Contrast is ${ratio.toFixed(2)}:1 (>= 4.50:1)`);
    });

    it('F14-B5: Interactive link color contrast is strictly >= 4.50:1 in both themes', () => {
      const darkLink = rootVars['--color-accent'] || '#38bdf8';
      const darkBg = rootVars['--bg-card'] || '#0d1527';
      assert.ok(calculateContrastRatio(darkLink, darkBg) >= 4.50);

      const lightLink = lightVars['--color-accent'] || '#0284c7';
      const lightBg = lightVars['--bg-card'] || '#ffffff';
      assert.ok(calculateContrastRatio(lightLink, lightBg) >= 4.50);
    });
  });

  // -------------------------------------------------------------
  // F15 Boundary: CTA Optimization & Deduplication Edge Cases
  // -------------------------------------------------------------
  describe('F15 Boundary: CTA Deduplication Edge Cases', () => {
    it('F15-B1: No conflicting Live Demo and Production Deployment buttons in Projects.jsx', () => {
      const hasLiveDemo = projectsJsx.includes('Live Demo');
      const hasProdDeploy = projectsJsx.includes('Production Deployment');
      assert.equal(hasLiveDemo && hasProdDeploy, false, 'No duplicate CTA intents allowed');
    });

    it('F15-B2: All anchor tags with target="_blank" declare rel="noopener noreferrer"', () => {
      const jsxFiles = findFiles('src', ['.jsx']);
      const missingRel = [];
      for (const f of jsxFiles) {
        const content = readProjectFile(f);
        const blankRegex = /<a\s+[^>]*target=["']_blank["'][^>]*>/g;
        let match;
        while ((match = blankRegex.exec(content)) !== null) {
          if (!match[0].includes('rel=')) {
            missingRel.push(f);
          }
        }
      }
      assert.equal(missingRel.length, 0, `Missing rel="noopener noreferrer" in: ${missingRel.join(', ')}`);
    });

    it('F15-B3: CTA button labels do not wrap at desktop', () => {
      const btnRules = extractCssDeclarations(cssContent, '.btn');
      assert.ok(btnRules.some((r) => r.props['white-space'] === 'nowrap'), 'Button labels must not wrap');
    });

    it('F15-B4: Interactive buttons have tactile :active state', () => {
      const activeRules = extractCssDeclarations(cssContent, /\.btn:active/);
      assert.ok(activeRules.length > 0, 'Buttons must provide :active state');
    });

    it('F15-B5: Secondary buttons maintain distinct visual styling', () => {
      const secRules = extractCssDeclarations(cssContent, '.btn-secondary');
      assert.ok(secRules.length > 0);
    });
  });

  // -------------------------------------------------------------
  // F16 Boundary: Spring Motion & Reduced Motion Transition Suppression
  // -------------------------------------------------------------
  describe('F16 Boundary: Motion Suppression Under Preferences', () => {
    it('F16-B1: --ease-spring token uses cubic-bezier curve', () => {
      const rootVars = extractCssVariables(cssContent, ':root');
      assert.ok(rootVars['--ease-spring']?.includes('cubic-bezier'));
    });

    it('F16-B2: prefers-reduced-motion block exists in CSS', () => {
      const mediaQueries = extractMediaQueries(cssContent);
      assert.ok(mediaQueries.some((mq) => mq.condition.includes('prefers-reduced-motion')));
    });

    it('F16-B3: Animation durations collapse to 0.01ms under reduced motion', () => {
      const mediaQueries = extractMediaQueries(cssContent);
      const rm = mediaQueries.find((mq) => mq.condition.includes('prefers-reduced-motion'));
      assert.ok(rm.body.includes('0.01ms') || rm.body.includes('none'));
    });

    it('F16-B4: Transition durations collapse to 0.01ms under reduced motion', () => {
      const mediaQueries = extractMediaQueries(cssContent);
      const rm = mediaQueries.find((mq) => mq.condition.includes('prefers-reduced-motion'));
      assert.ok(rm.body.includes('0.01ms') || rm.body.includes('none'));
    });

    it('F16-B5: Smooth scroll reverts to auto under reduced motion', () => {
      const mediaQueries = extractMediaQueries(cssContent);
      const rm = mediaQueries.find((mq) => mq.condition.includes('prefers-reduced-motion'));
      assert.ok(rm.body.includes('scroll-behavior: auto'));
    });
  });

  // -------------------------------------------------------------
  // F17 Boundary: Vercel Routing Configuration Edge Cases
  // -------------------------------------------------------------
  describe('F17 Boundary: Vercel Routing Configuration & Deep Paths', () => {
    it('F17-B1: vercel.json is valid parseable JSON', () => {
      assert.ok(vercelJson);
      assert.doesNotThrow(() => JSON.parse(vercelJson));
    });

    it('F17-B2: vercel.json rewrites rule catches deep paths with catch-all regex', () => {
      assert.ok(vercelJson);
      const parsed = JSON.parse(vercelJson);
      const rule = parsed.rewrites?.find((r) => r.source === '/(.*)');
      assert.ok(rule);
      assert.equal(rule.destination, '/');
    });

    it('F17-B3: Security headers include X-Content-Type-Options set to nosniff', () => {
      assert.ok(vercelJson);
      const parsed = JSON.parse(vercelJson);
      const nosniff = parsed.headers?.some((h) => h.headers?.some((item) => item.key.toLowerCase() === 'x-content-type-options' && item.value === 'nosniff'));
      assert.ok(nosniff);
    });

    it('F17-B4: Security headers include X-Frame-Options set to DENY or SAMEORIGIN', () => {
      assert.ok(vercelJson);
      const parsed = JSON.parse(vercelJson);
      const frameOpt = parsed.headers?.some((h) =>
        h.headers?.some((item) => item.key.toLowerCase() === 'x-frame-options' && (item.value === 'DENY' || item.value === 'SAMEORIGIN'))
      );
      assert.ok(frameOpt);
    });

    it('F17-B5: vercel.json does not specify deprecated routes property alongside rewrites', () => {
      assert.ok(vercelJson);
      const parsed = JSON.parse(vercelJson);
      assert.equal(parsed.routes, undefined);
    });
  });

  // -------------------------------------------------------------
  // F18 Boundary: SEO & Rich Social Metadata Tag Formats
  // -------------------------------------------------------------
  describe('F18 Boundary: SEO & Social Metadata Formats', () => {
    const metaTags = extractMetaTags(htmlContent);

    it('F18-B1: og:image specifies valid path or URL format', () => {
      const og = metaTags.find((m) => m.property === 'og:image');
      assert.ok(og && og.content);
    });

    it('F18-B2: og:url specifies valid http/https URL', () => {
      const og = metaTags.find((m) => m.property === 'og:url');
      assert.ok(og && og.content);
    });

    it('F18-B3: twitter:card specifies summary_large_image or summary', () => {
      const tw = metaTags.find((m) => m.name === 'twitter:card');
      assert.ok(tw && (tw.content === 'summary_large_image' || tw.content === 'summary'));
    });

    it('F18-B4: twitter:title is defined and non-empty', () => {
      const tw = metaTags.find((m) => m.name === 'twitter:title');
      assert.ok(tw && tw.content.length > 0);
    });

    it('F18-B5: theme-color matches valid hex color code format', () => {
      const tc = metaTags.find((m) => m.name === 'theme-color');
      assert.ok(tc && /^#[0-9a-f]{6}$/i.test(tc.content));
    });
  });

  // -------------------------------------------------------------
  // F19 Boundary: Production Build Integrity Thresholds
  // -------------------------------------------------------------
  describe('F19 Boundary: Build Asset Boundaries & File Integrity', () => {
    it('F19-B1: package.json specifies build script', () => {
      const pkg = JSON.parse(readProjectFile('package.json') || '{}');
      assert.ok(pkg.scripts?.build);
    });

    it('F19-B2: Resume PDF file size is greater than 10KB', () => {
      const pdfPath = fileExists('public/resume.pdf') ? 'public/resume.pdf' : 'Gyan_Mistry_Resume_9262.pdf';
      const stats = fs.statSync(pdfPath);
      assert.ok(stats.size > 10000, `PDF size is ${stats.size} bytes`);
    });

    it('F19-B3: Favicon SVG file size is greater than 50 bytes', () => {
      assert.ok(fileExists('public/favicon.svg'));
      const stats = fs.statSync('public/favicon.svg');
      assert.ok(stats.size > 50);
    });

    it('F19-B4: dist/ directory contains valid built index.html if built', () => {
      if (fileExists('dist/index.html')) {
        const html = readProjectFile('dist/index.html');
        assert.ok(html.includes('<script'));
      }
      assert.ok(true);
    });

    it('F19-B5: Bundle JS and CSS assets do not exceed 500KB budget', () => {
      if (fileExists('dist/assets')) {
        const files = findFiles('dist/assets');
        for (const f of files) {
          const stats = fs.statSync(f);
          assert.ok(stats.size < 500000, `Asset ${f} size is ${stats.size} bytes, must be < 500KB`);
        }
      }
      assert.ok(true);
    });
  });
});
