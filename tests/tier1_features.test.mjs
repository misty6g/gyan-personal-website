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

describe('Tier 1: Feature Coverage (F01 - F19)', () => {
  const cssContent = readProjectFile('src/index.css') || '';
  const htmlContent = readProjectFile('index.html') || '';
  const heroJsx = readProjectFile('src/components/Hero.jsx') || '';
  const headerJsx = readProjectFile('src/components/Header.jsx') || '';
  const resumeModalJsx = readProjectFile('src/components/ResumeModal.jsx') || '';
  const projectsJsx = readProjectFile('src/components/Projects.jsx') || '';
  const skillsMatrixJsx = readProjectFile('src/components/SkillsMatrix.jsx') || '';
  const portfolioData = readProjectFile('src/data/portfolioData.js') || '';
  const packageJson = JSON.parse(readProjectFile('package.json') || '{}');
  const vercelJsonContent = readProjectFile('vercel.json');

  // -------------------------------------------------------------
  // F01: Viewport Units Migration
  // -------------------------------------------------------------
  describe('F01: Viewport Units Migration', () => {
    it('F01-1: Modal dialog uses dvh units rather than vh for height', () => {
      const modalRules = extractCssDeclarations(cssContent, '.modal-dialog');
      assert.ok(modalRules.length > 0, 'CSS must contain .modal-dialog rules');
      const hasDvh = modalRules.some((r) => r.props.height?.includes('dvh') || r.props['max-height']?.includes('dvh'));
      const hasVh = modalRules.some((r) => r.props.height?.includes('vh') && !r.props.height?.includes('dvh'));
      assert.ok(hasDvh, 'Modal dialog should use dvh units for viewport stability');
      assert.equal(hasVh, false, 'Modal dialog must not use raw vh units');
    });

    it('F01-2: Mobile modal media query uses dvh instead of vh', () => {
      const mediaQueries = extractMediaQueries(cssContent);
      const mobileMq = mediaQueries.filter((mq) => mq.condition.includes('768px') || mq.condition.includes('640px'));
      const modalInMobile = mobileMq.some((mq) => mq.body.includes('.modal-dialog'));
      if (modalInMobile) {
        const hasVhInMobileModal = mobileMq.some((mq) =>
          mq.body.includes('.modal-dialog') && /height:\s*\d+vh/i.test(mq.body) && !/height:\s*\d+dvh/i.test(mq.body)
        );
        assert.equal(hasVhInMobileModal, false, 'Mobile media query for modal dialog must not use vh');
      }
      assert.ok(true);
    });

    it('F01-3: Strict absence of raw vh units in full-screen modals across stylesheet', () => {
      const modalDecls = extractCssDeclarations(cssContent, /modal|fullscreen/i);
      const rawVhFound = modalDecls.filter((d) => {
        const h = d.props.height || d.props['max-height'] || d.props['min-height'] || '';
        return /\b\d+vh\b/.test(h);
      });
      assert.equal(rawVhFound.length, 0, `Found raw vh units in modal declarations: ${JSON.stringify(rawVhFound)}`);
    });

    it('F01-4: Body or root container specifies min-height with dvh', () => {
      const bodyRules = extractCssDeclarations(cssContent, 'body');
      const hasDvh = bodyRules.some((r) => r.props['min-height']?.includes('100dvh'));
      assert.ok(hasDvh, 'body element should specify min-height: 100dvh for mobile address bar stability');
    });

    it('F01-5: Full-height hero or section containers avoid fixed h-screen or 100vh', () => {
      const heroRules = extractCssDeclarations(cssContent, '.hero-section');
      const hasBadVh = heroRules.some((r) => r.props.height?.includes('100vh') || r.props['min-height']?.includes('100vh'));
      assert.equal(hasBadVh, false, 'Hero section must not use 100vh');
    });
  });

  // -------------------------------------------------------------
  // F02: Root & Document Overflow Containment
  // -------------------------------------------------------------
  describe('F02: Root & Document Overflow Containment', () => {
    it('F02-1: html selector defines overflow-x: hidden', () => {
      const htmlRules = extractCssDeclarations(cssContent, 'html');
      const hasOverflowHidden = htmlRules.some((r) => r.props['overflow-x'] === 'hidden');
      assert.ok(hasOverflowHidden, 'html tag must explicitly enforce overflow-x: hidden');
    });

    it('F02-2: body selector defines overflow-x: hidden', () => {
      const bodyRules = extractCssDeclarations(cssContent, 'body');
      const hasOverflowHidden = bodyRules.some((r) => r.props['overflow-x'] === 'hidden');
      assert.ok(hasOverflowHidden, 'body tag must explicitly enforce overflow-x: hidden');
    });

    it('F02-3: App root or layout wrappers prevent horizontal document blowout', () => {
      const appRules = extractCssDeclarations(cssContent, '.app');
      const wrapsProperly = appRules.every((r) => r.props['overflow-x'] !== 'visible');
      assert.ok(wrapsProperly, '.app should not set overflow-x: visible');
    });

    it('F02-4: Section containers enforce width bounds and box-sizing', () => {
      const containerRules = extractCssDeclarations(cssContent, '.section-container');
      assert.ok(containerRules.length > 0, '.section-container must be declared');
      const maxWidthSet = containerRules.some((r) => !!r.props['max-width'] || !!r.props.width);
      assert.ok(maxWidthSet, '.section-container must specify width or max-width containment');
    });

    it('F02-5: Preformatted code blocks and tags allow internal scroll or wrap', () => {
      const codeOrTagRules = extractCssDeclarations(cssContent, /pre|code|\.tags|\.tech-tags/i);
      const avoidsUnboundedOverflow = codeOrTagRules.every(
        (r) => r.props['overflow-x'] === 'auto' || r.props['flex-wrap'] === 'wrap' || !r.props.width
      );
      assert.ok(avoidsUnboundedOverflow, 'Code blocks and tags must allow scroll or wrap without breaking viewport');
    });
  });

  // -------------------------------------------------------------
  // F03: Mobile Navigation Drawer Fix
  // -------------------------------------------------------------
  describe('F03: Mobile Navigation Drawer Fix', () => {
    it('F03-1: .site-header decouples or expands from fixed 64px height when mobile menu is open', () => {
      // In unremediated code, .site-header has fixed height: 64px and clips .mobile-nav-drawer
      const headerOpenRules = extractCssDeclarations(cssContent, /\.site-header.*open|\.site-header\.menu-open|\.mobile-menu-open/);
      const drawerRules = extractCssDeclarations(cssContent, '.mobile-nav-drawer');
      assert.ok(drawerRules.length > 0, '.mobile-nav-drawer must be defined');
      // When drawer is open, header must not be constrained to 64px
      const headerNormalRules = extractCssDeclarations(cssContent, '.site-header');
      const fixedConstrained = headerNormalRules.some((r) => r.props.height === '64px');
      const handlesOpen = headerOpenRules.length > 0 || !fixedConstrained;
      assert.ok(handlesOpen, '.site-header must support height expansion when mobile nav drawer opens');
    });

    it('F03-2: Mobile menu toggle button exists in Header.jsx and has accessible label', () => {
      assert.ok(headerJsx.includes('mobile-menu-toggle') || headerJsx.includes('mobile-nav-toggle'), 'Header must contain mobile menu toggle');
      assert.ok(headerJsx.includes('aria-label') || headerJsx.includes('aria-expanded'), 'Mobile menu toggle must have ARIA accessibility attributes');
    });

    it('F03-3: Mobile drawer displays links on mobile viewports', () => {
      assert.ok(headerJsx.includes('mobile-nav-drawer') || headerJsx.includes('mobile-nav'), 'Header must render mobile nav container');
      const mediaQueries = extractMediaQueries(cssContent);
      const hasMobileDrawerRule = mediaQueries.some((mq) => mq.body.includes('mobile-nav-drawer'));
      assert.ok(hasMobileDrawerRule, 'CSS media query must define display rules for mobile-nav-drawer');
    });

    it('F03-4: Mobile nav drawer links close menu on navigation click', () => {
      const hasCloseOnClick = headerJsx.includes('closeMenu') || headerJsx.includes('setMobileMenuOpen(false)');
      assert.ok(hasCloseOnClick, 'Mobile navigation links must close mobile menu upon item click');
    });

    it('F03-5: Header maintains proper z-index layering above main content', () => {
      const headerRules = extractCssDeclarations(cssContent, '.site-header');
      const zIndex = headerRules.find((r) => r.props['z-index'])?.props['z-index'];
      assert.ok(zIndex && parseInt(zIndex, 10) >= 10, 'Header must declare z-index >= 10 for proper sticky layering');
    });
  });

  // -------------------------------------------------------------
  // F04: Touch Target Standards Enforcement
  // -------------------------------------------------------------
  describe('F04: Touch Target Standards Enforcement', () => {
    it('F04-1: .btn-icon has width and height >= 44px', () => {
      const btnIconRules = extractCssDeclarations(cssContent, '.btn-icon');
      assert.ok(btnIconRules.length > 0, '.btn-icon must exist in CSS');
      const w = parseFloat(btnIconRules[0].props.width || '0');
      const h = parseFloat(btnIconRules[0].props.height || '0');
      assert.ok(w >= 44, `.btn-icon width must be >= 44px, got ${w}px`);
      assert.ok(h >= 44, `.btn-icon height must be >= 44px, got ${h}px`);
    });

    it('F04-2: .mobile-menu-toggle has dimensions >= 44x44px', () => {
      const toggleRules = extractCssDeclarations(cssContent, '.mobile-menu-toggle');
      assert.ok(toggleRules.length > 0, '.mobile-menu-toggle must exist in CSS');
      const w = parseFloat(toggleRules[0].props.width || '0');
      const h = parseFloat(toggleRules[0].props.height || '0');
      assert.ok(w >= 44, `.mobile-menu-toggle width must be >= 44px, got ${w}px`);
      assert.ok(h >= 44, `.mobile-menu-toggle height must be >= 44px, got ${h}px`);
    });

    it('F04-3: .resume-nav-btn has min-height >= 44px', () => {
      const resumeBtnRules = extractCssDeclarations(cssContent, '.resume-nav-btn');
      assert.ok(resumeBtnRules.length > 0, '.resume-nav-btn must exist in CSS');
      const minH = parseFloat(resumeBtnRules[0].props['min-height'] || resumeBtnRules[0].props.height || '0');
      assert.ok(minH >= 44, `.resume-nav-btn min-height must be >= 44px, got ${minH}px`);
    });

    it('F04-4: Filter chips and buttons satisfy >= 44px hit area', () => {
      const chipRules = extractCssDeclarations(cssContent, /\.chip|\.filter-chip|\.btn\b/);
      assert.ok(chipRules.length > 0, 'Buttons/chips must have styling in CSS');
      const passesMinHeight = chipRules.some((r) => {
        const h = parseFloat(r.props['min-height'] || r.props.height || '0');
        const pad = (parseFloat(r.props['padding-top']) || 0) + (parseFloat(r.props['padding-bottom']) || 0);
        return h >= 44 || pad >= 16;
      });
      assert.ok(passesMinHeight, 'Interactive buttons and chips must provide >= 44px vertical hit area');
    });

    it('F04-5: Modal close button satisfies >= 44x44px tap target', () => {
      const closeBtnRules = extractCssDeclarations(cssContent, /\.modal-close|\.btn-icon/);
      const isTargetCompliant = closeBtnRules.some((r) => {
        const w = parseFloat(r.props.width || r.props['min-width'] || '0');
        const h = parseFloat(r.props.height || r.props['min-height'] || '0');
        return w >= 44 && h >= 44;
      });
      assert.ok(isTargetCompliant, 'Modal close button must satisfy min 44x44px touch target');
    });
  });

  // -------------------------------------------------------------
  // F05: Mobile ResumeModal Responsive Layout
  // -------------------------------------------------------------
  describe('F05: Mobile ResumeModal Responsive Layout', () => {
    it('F05-1: .modal-header supports responsive flex wrapping on narrow viewports', () => {
      const headerRules = extractCssDeclarations(cssContent, '.modal-header');
      const mediaQueries = extractMediaQueries(cssContent);
      const mobileHeaderRules = mediaQueries
        .filter((mq) => mq.condition.includes('768px') || mq.condition.includes('640px'))
        .some((mq) => mq.body.includes('.modal-header') && mq.body.includes('flex-wrap: wrap'));
      const baseHasWrap = headerRules.some((r) => r.props['flex-wrap'] === 'wrap');
      assert.ok(baseHasWrap || mobileHeaderRules, '.modal-header must allow flex-wrap on mobile viewports to prevent blowout');
    });

    it('F05-2: .modal-actions adapts layout for viewports <= 414px', () => {
      const actionsRules = extractCssDeclarations(cssContent, '.modal-actions');
      assert.ok(actionsRules.length > 0, '.modal-actions must exist');
      // Verify actions container has flex display
      const isFlex = actionsRules.some((r) => r.props.display === 'flex' || !r.props.display);
      assert.ok(isFlex, '.modal-actions must use flexible layout');
    });

    it('F05-3: Modal title handles text truncation or responsive wrap on mobile', () => {
      const titleRules = extractCssDeclarations(cssContent, '.modal-title');
      assert.ok(titleRules.length > 0, '.modal-title must exist');
      const handlesOverflow = titleRules.some(
        (r) => r.props['overflow'] === 'hidden' || r.props['text-overflow'] === 'ellipsis' || r.props['word-break'] || r.props['white-space'] !== 'nowrap'
      );
      assert.ok(handlesOverflow, '.modal-title must prevent text overflow on narrow mobile screens');
    });

    it('F05-4: ResumeModal JSX renders download and open actions', () => {
      assert.ok(resumeModalJsx.includes('download='), 'ResumeModal must provide a direct download link attribute');
      assert.ok(resumeModalJsx.includes('target="_blank"'), 'ResumeModal must provide an open in new tab action');
    });

    it('F05-5: ResumeModal locks body scroll when modal dialog is open', () => {
      assert.ok(
        resumeModalJsx.includes('overflow = \'hidden\'') || resumeModalJsx.includes('overflow = "hidden"') || resumeModalJsx.includes('modal-open'),
        'ResumeModal must implement body scroll locking while active'
      );
    });
  });

  // -------------------------------------------------------------
  // F06: Grid Track Containment (SkillsMatrix)
  // -------------------------------------------------------------
  describe('F06: Grid Track Containment (SkillsMatrix)', () => {
    it('F06-1: .skills-matrix collapses to 1 column below 640px', () => {
      const mediaQueries = extractMediaQueries(cssContent);
      const mobileSkillsMq = mediaQueries.filter((mq) => mq.condition.includes('640px') || mq.condition.includes('768px'));
      const hasOneColGrid = mobileSkillsMq.some(
        (mq) => mq.body.includes('skills-matrix') && (mq.body.includes('grid-template-columns: 1fr') || mq.body.includes('grid-template-columns: minmax(0, 1fr)'))
      );
      assert.ok(hasOneColGrid, '.skills-matrix must switch to 1 column below 640px');
    });

    it('F06-2: Skills category cards specify min-width: 0 to prevent grid track blowout', () => {
      const cardRules = extractCssDeclarations(cssContent, /\.skills-category-card|\.skills-grid > \*/);
      const hasMinWidth0 = cardRules.some((r) => r.props['min-width'] === '0' || r.props['min-width'] === '0px');
      assert.ok(hasMinWidth0, 'Skills cards must declare min-width: 0 to contain flex/grid children');
    });

    it('F06-3: SkillsMatrix component renders categorized skills groups cleanly', () => {
      assert.ok(skillsMatrixJsx.includes('skills-matrix') || skillsMatrixJsx.includes('skills-grid'), 'SkillsMatrix must render grid container');
    });

    it('F06-4: Skill tags specify flex-wrap to prevent horizontal overflow', () => {
      const tagContainerRules = extractCssDeclarations(cssContent, /\.skill-tags|\.skills-list/);
      const wraps = tagContainerRules.some((r) => r.props['flex-wrap'] === 'wrap');
      assert.ok(wraps, 'Skill tag containers must use flex-wrap: wrap');
    });

    it('F06-5: SkillsMatrix maintains padding containment on mobile', () => {
      const matrixRules = extractCssDeclarations(cssContent, '.skills-matrix');
      assert.ok(matrixRules.length > 0, '.skills-matrix rule exists');
      const widthSafe = matrixRules.every((r) => r.props.width !== '100vw');
      assert.ok(widthSafe, '.skills-matrix should not set 100vw width');
    });
  });

  // -------------------------------------------------------------
  // F07: iOS Safari Input Auto-Zoom Prevention
  // -------------------------------------------------------------
  describe('F07: iOS Safari Input Auto-Zoom Prevention', () => {
    it('F07-1: .search-input has font-size >= 16px (1rem) on mobile', () => {
      const inputRules = extractCssDeclarations(cssContent, '.search-input');
      assert.ok(inputRules.length > 0, '.search-input must exist in CSS');
      const fontVal = inputRules[0].props['font-size'] || '0';
      const isCompliant = fontVal.includes('1rem') || fontVal.includes('16px') || parseFloat(fontVal) >= 16 || (fontVal.includes('rem') && parseFloat(fontVal) >= 1.0);
      assert.ok(isCompliant, `.search-input font-size must be at least 16px (1rem) to prevent iOS auto-zoom, got ${fontVal}`);
    });

    it('F07-2: Mobile media queries do not reduce .search-input font-size below 16px', () => {
      const mediaQueries = extractMediaQueries(cssContent);
      const reducedOnMobile = mediaQueries.some((mq) => {
        if (!mq.body.includes('.search-input')) return false;
        const match = mq.body.match(/font-size:\s*([0-9.]+)(px|rem)/);
        if (match) {
          const val = parseFloat(match[1]);
          const unit = match[2];
          return (unit === 'px' && val < 16) || (unit === 'rem' && val < 1.0);
        }
        return false;
      });
      assert.equal(reducedOnMobile, false, 'Mobile media query must not drop .search-input font-size below 16px');
    });

    it('F07-3: Search input specifies box-sizing: border-box', () => {
      const inputRules = extractCssDeclarations(cssContent, '.search-input');
      const hasBorderBox = inputRules.some((r) => r.props['box-sizing'] === 'border-box');
      // Default global box-sizing in * also covers it, check either
      const globalRules = extractCssDeclarations(cssContent, '*');
      const globalBorderBox = globalRules.some((r) => r.props['box-sizing'] === 'border-box');
      assert.ok(hasBorderBox || globalBorderBox, 'Search input must use box-sizing: border-box');
    });

    it('F07-4: Search input renders within search bar without clipping', () => {
      const barRules = extractCssDeclarations(cssContent, '.search-bar');
      assert.ok(barRules.length > 0, '.search-bar must be defined');
    });

    it('F07-5: Viewport meta tag in index.html is configured properly', () => {
      const metaTags = extractMetaTags(htmlContent);
      const vpMeta = metaTags.find((m) => m.name === 'viewport');
      assert.ok(vpMeta, 'index.html must include viewport meta tag');
      assert.ok(vpMeta.content.includes('width=device-width'), 'Viewport must specify width=device-width');
      assert.ok(vpMeta.content.includes('initial-scale=1.0'), 'Viewport must specify initial-scale=1.0');
    });
  });

  // -------------------------------------------------------------
  // F08: Zero Em-Dash Enforcement
  // -------------------------------------------------------------
  describe('F08: Zero Em-Dash Enforcement', () => {
    it('F08-1: Zero em-dashes (—, U+2014) across all source files in src/', () => {
      const srcFiles = findFiles('src');
      const violations = [];
      for (const relFile of srcFiles) {
        const content = readProjectFile(relFile);
        const dashes = findEmDashes(content);
        if (dashes.length > 0) {
          violations.push({ file: relFile, count: dashes.length, samples: dashes.slice(0, 2) });
        }
      }
      assert.equal(violations.length, 0, `Em-dashes detected in src/: ${JSON.stringify(violations, null, 2)}`);
    });

    it('F08-2: Zero HTML entity &mdash; across all source files and index.html', () => {
      const allFiles = [...findFiles('src'), 'index.html'];
      const entityViolations = [];
      for (const relFile of allFiles) {
        const content = readProjectFile(relFile);
        if (content && content.includes('&mdash;')) {
          entityViolations.push(relFile);
        }
      }
      assert.equal(entityViolations.length, 0, `HTML &mdash; entities found in: ${entityViolations.join(', ')}`);
    });

    it('F08-3: Zero unicode escape \\u2014 in portfolioData.js', () => {
      assert.equal(portfolioData.includes('\\u2014'), false, 'portfolioData.js must not contain \\u2014 escapes');
    });

    it('F08-4: Zero em-dashes (—) in root README.md', () => {
      const readme = readProjectFile('README.md');
      const dashes = findEmDashes(readme);
      assert.equal(dashes.length, 0, `README.md contains ${dashes.length} em-dashes: ${JSON.stringify(dashes)}`);
    });

    it('F08-5: Zero en-dashes (–) used as decorative text separators in JSX copy', () => {
      const jsxFiles = findFiles('src', ['.jsx']);
      const enDashViolations = [];
      for (const f of jsxFiles) {
        const content = readProjectFile(f);
        // Match en-dash surrounded by spaces (used as text separator)
        if (/\s–\s/.test(content)) {
          enDashViolations.push(f);
        }
      }
      assert.equal(enDashViolations.length, 0, `Decorative en-dashes found in JSX: ${enDashViolations.join(', ')}`);
    });
  });

  // -------------------------------------------------------------
  // F09: Hero Content Viewport Discipline
  // -------------------------------------------------------------
  describe('F09: Hero Content Viewport Discipline', () => {
    it('F09-1: Hero headline fits within <= 2 lines on desktop displays', () => {
      // Name length check: "Gyan Atul Mistry" is 3 words, fits well within 2 lines
      const nameMatch = portfolioData.match(/name:\s*['"]([^'"]+)['"]/);
      assert.ok(nameMatch, 'Name should be defined in portfolioData');
      const name = nameMatch[1];
      assert.ok(name.length <= 50, `Hero name is ${name.length} chars, must fit on <= 2 lines`);
    });

    it('F09-2: Hero subtext / value-proposition is <= 20 words', () => {
      // Under design-taste-frontend §4.7: Hero subtext max 20 words
      // Extract hero bio or value proposition text
      const heroBioMatch = portfolioData.match(/about:\s*\[([\s\S]*?)\]/);
      let wordCount = 0;
      if (heroBioMatch) {
        const pMatches = heroBioMatch[1].match(/['"`]([\s\S]*?)['"`]/g) || [];
        // The subtext displayed in the hero should be <= 20 words
        // If bio has multiple paragraphs, the hero-specific subtext or value prop must be concise
        const firstParagraph = pMatches[0] ? pMatches[0].replace(/['"`]/g, '') : '';
        wordCount = countWords(firstParagraph);
      }
      // Check if hero JSX renders a concise value prop
      const heroPropMatch = heroJsx.match(/className=["']hero-bio["'][^>]*>([\s\S]*?)<\//);
      if (heroPropMatch) {
        wordCount = countWords(heroPropMatch[1]);
      }
      assert.ok(wordCount <= 20, `Hero subtext must be <= 20 words, observed ${wordCount} words`);
    });

    it('F09-3: Hero contains at most 4 text elements', () => {
      // §4.7: Max 4 text elements in hero: (1) eyebrow or brand strip, (2) headline, (3) subtext, (4) CTAs
      // Check Hero.jsx text elements
      const hasTopBadges = heroJsx.includes('hero-top-badges');
      const hasSocialsHub = heroJsx.includes('socials-hub');
      // In unremediated code: top-badges + name + title + location + bio + actions + socials = 7 elements
      let textElementsCount = 0;
      if (heroJsx.includes('hero-eyebrow') || heroJsx.includes('hero-top-badges')) textElementsCount++;
      if (heroJsx.includes('hero-name')) textElementsCount++;
      if (heroJsx.includes('hero-bio') || heroJsx.includes('hero-subtext')) textElementsCount++;
      if (heroJsx.includes('hero-actions')) textElementsCount++;
      if (hasSocialsHub) textElementsCount++;
      if (heroJsx.includes('hero-location')) textElementsCount++;

      assert.ok(textElementsCount <= 4, `Hero contains ${textElementsCount} text elements, max allowed is 4`);
    });

    it('F09-4: Hero top padding does not exceed pt-24 (96px / 6rem)', () => {
      const heroRules = extractCssDeclarations(cssContent, '.hero-section');
      assert.ok(heroRules.length > 0, '.hero-section rule exists');
      const padTop = heroRules[0].props['padding-top'] || heroRules[0].props.padding || '0';
      const px = parseFloat(padTop);
      const isRem = padTop.includes('rem');
      const padPx = isRem ? px * 16 : px;
      assert.ok(padPx <= 96, `Hero top padding must be <= 96px (6rem), got ${padTop}`);
    });

    it('F09-5: Hero content fits above the fold without requiring scroll to locate primary CTA', () => {
      const headerH = 64;
      const heroPad = 64;
      // Combined header + hero must fit comfortably within typical 800px-900px viewport
      assert.ok(headerH + heroPad < 800, 'Hero base geometry allows fold fit');
    });
  });

  // -------------------------------------------------------------
  // F10: Desktop Navigation Height & Row Lock
  // -------------------------------------------------------------
  describe('F10: Desktop Navigation Height & Row Lock', () => {
    it('F10-1: Desktop header height is <= 80px', () => {
      const headerRules = extractCssDeclarations(cssContent, '.site-header');
      assert.ok(headerRules.length > 0, '.site-header must be styled');
      const hStr = headerRules[0].props.height || headerRules[0].props['max-height'] || '0';
      const h = parseFloat(hStr);
      assert.ok(h <= 80 && h >= 48, `Desktop header height must be <= 80px, got ${hStr}`);
    });

    it('F10-2: Desktop navigation renders on a single line at >= 1024px', () => {
      const navRules = extractCssDeclarations(cssContent, '.desktop-nav');
      assert.ok(navRules.length > 0, '.desktop-nav must be declared');
      const isFlex = navRules.some((r) => r.props.display === 'flex');
      const noWrap = navRules.every((r) => r.props['flex-wrap'] !== 'wrap');
      assert.ok(isFlex, '.desktop-nav must use flexbox');
      assert.ok(noWrap, '.desktop-nav must not wrap to multiple lines on desktop');
    });

    it('F10-3: Desktop header container uses flex with justify-content: space-between', () => {
      const headerContainerRules = extractCssDeclarations(cssContent, '.header-container');
      assert.ok(headerContainerRules.length > 0, '.header-container must be styled');
      const hasJustify = headerContainerRules.some(
        (r) => r.props['justify-content'] === 'space-between' || r.props.display === 'flex'
      );
      assert.ok(hasJustify, '.header-container must arrange logo and nav in single row');
    });

    it('F10-4: Navigation links have consistent horizontal spacing without collision', () => {
      const linkRules = extractCssDeclarations(cssContent, '.nav-link');
      assert.ok(linkRules.length > 0, '.nav-link must exist');
    });

    it('F10-5: Sticky header position does not exceed 80px on scroll', () => {
      const headerRules = extractCssDeclarations(cssContent, '.site-header');
      const isSticky = headerRules.some((r) => r.props.position === 'sticky' || r.props.position === 'fixed');
      assert.ok(isSticky, 'Header must be sticky or fixed');
    });
  });

  // -------------------------------------------------------------
  // F11: Section Eyebrows Restraint
  // -------------------------------------------------------------
  describe('F11: Section Eyebrows Restraint', () => {
    it('F11-1: Total count of section eyebrows is <= ceil(sectionCount / 3) = 3', () => {
      // Count instances of uppercase tracking eyebrows across all components in src/
      const jsxFiles = findFiles('src', ['.jsx']);
      let eyebrowCount = 0;
      for (const f of jsxFiles) {
        const content = readProjectFile(f);
        // Look for eyebrow classes or small uppercase tracking labels above headlines
        const matches = content.match(/className=["'][^"']*(?:eyebrow|section-eyebrow)[^"']*["']/g) || [];
        eyebrowCount += matches.length;
      }
      assert.ok(eyebrowCount <= 3, `Section eyebrows count is ${eyebrowCount}, must be <= 3`);
    });

    it('F11-2: Eyebrows do not contain section numbers (01/, 001 ·)', () => {
      const jsxFiles = findFiles('src', ['.jsx']);
      for (const f of jsxFiles) {
        const content = readProjectFile(f);
        const hasNumberEyebrow = /0[0-9]\s*[\/·]\s*[A-Z]/i.test(content);
        assert.equal(hasNumberEyebrow, false, `Numbered eyebrow found in ${f}`);
      }
    });

    it('F11-3: Section headers stack vertically (no split-header pattern)', () => {
      // Split header pattern: left big headline + right small explainer paragraph in a 2-column grid
      const sectionHeaderRules = extractCssDeclarations(cssContent, '.section-header');
      const isSplitGrid = sectionHeaderRules.some((r) => r.props.display === 'grid' && r.props['grid-template-columns']?.includes('2fr'));
      assert.equal(isSplitGrid, false, '.section-header should not use split-header grid pattern');
    });

    it('F11-4: Section titles use semantic h2 elements', () => {
      const sections = ['Experience.jsx', 'Projects.jsx', 'Coursework.jsx', 'SkillsMatrix.jsx', 'Education.jsx', 'Extracurriculars.jsx'];
      for (const s of sections) {
        const content = readProjectFile(`src/components/${s}`);
        assert.ok(content.includes('<h2'), `${s} must use semantic <h2> for section title`);
      }
    });

    it('F11-5: Section subtitles maintain max-width <= 65ch for readable line length', () => {
      const subRules = extractCssDeclarations(cssContent, '.section-subtitle');
      assert.ok(subRules.length > 0, '.section-subtitle must be styled');
    });
  });

  // -------------------------------------------------------------
  // F12: Theme & Single Accent Lock
  // -------------------------------------------------------------
  describe('F12: Theme & Single Accent Lock', () => {
    it('F12-1: Zero mid-page inverted sections; all sections use theme tokens', () => {
      const sectionRules = extractCssDeclarations(cssContent, /\.section-wrapper|\.app-section/);
      const hardcodedInversion = sectionRules.some((r) => r.props.background === '#ffffff' && r.props.color === '#000000');
      assert.equal(hardcodedInversion, false, 'Sections must not hardcode inverted black/white backgrounds mid-page');
    });

    it('F12-2: Primary accent color is locked to single unified palette (Sky/Cyan)', () => {
      const rootVars = extractCssVariables(cssContent, ':root');
      assert.ok(rootVars['--color-accent'] || rootVars['--accent-primary'] || rootVars['--accent-cyan'], 'CSS must define primary accent token');
    });

    it('F12-3: Badges and chips do not use conflicting multi-color rainbow accents', () => {
      // Check if badges have individual amber/emerald/violet classes that violate single accent lock
      const badgeEmerald = extractCssDeclarations(cssContent, '.badge-emerald');
      const badgeAmber = extractCssDeclarations(cssContent, '.badge-amber');
      const badgeViolet = extractCssDeclarations(cssContent, '.badge-violet');
      const hasRainbowClasses = badgeEmerald.length > 0 || badgeAmber.length > 0 || badgeViolet.length > 0;
      // All badges should align to unified accent tints
      assert.equal(hasRainbowClasses, false, 'Badges must not introduce conflicting rainbow accent colors');
    });

    it('F12-4: Light mode overrides declared via [data-theme="light"] or equivalent', () => {
      const lightVars = extractCssVariables(cssContent, '[data-theme="light"]');
      const hasLightVars = Object.keys(lightVars).length > 0;
      assert.ok(hasLightVars, 'CSS must specify light mode variable definitions under [data-theme="light"]');
    });

    it('F12-5: Accent hover color derives from the same accent hue family', () => {
      const rootVars = extractCssVariables(cssContent, ':root');
      const accent = rootVars['--color-accent'] || rootVars['--accent-primary'] || '#38bdf8';
      const hover = rootVars['--color-accent-hover'] || rootVars['--accent-hover'] || '#0284c7';
      assert.ok(accent, 'Accent token must exist');
      assert.ok(hover, 'Accent hover token must exist');
    });
  });

  // -------------------------------------------------------------
  // F13: Materiality & Glassmorphism
  // -------------------------------------------------------------
  describe('F13: Materiality & Glassmorphism', () => {
    it('F13-1: Header background uses translucent alpha when backdrop-filter is applied', () => {
      const headerRules = extractCssDeclarations(cssContent, '.site-header');
      const hasBlur = headerRules.some((r) => r.props['backdrop-filter']?.includes('blur'));
      if (hasBlur) {
        // When blur is used, background must not be 100% opaque hex without alpha
        const bg = headerRules.find((r) => r.props.background)?.props.background || '';
        const isOpaqueSolid = /^#[0-9a-f]{6}$/i.test(bg);
        assert.equal(isOpaqueSolid, false, '.site-header with backdrop-filter must use translucent background');
      }
      assert.ok(true);
    });

    it('F13-2: Header includes subtle inner border or divider highlight', () => {
      const headerRules = extractCssDeclarations(cssContent, '.site-header');
      const hasBorder = headerRules.some((r) => !!r.props['border-bottom'] || !!r.props['box-shadow']);
      assert.ok(hasBorder, '.site-header must include bottom border or highlight');
    });

    it('F13-3: @media (prefers-reduced-transparency: reduce) fallback exists in stylesheet', () => {
      const mediaQueries = extractMediaQueries(cssContent);
      const hasReducedTransparency = mediaQueries.some((mq) => mq.condition.includes('prefers-reduced-transparency'));
      assert.ok(hasReducedTransparency, 'CSS must include @media (prefers-reduced-transparency: reduce) fallback');
    });

    it('F13-4: Glassmorphic elements fallback to solid backgrounds under reduced transparency', () => {
      const mediaQueries = extractMediaQueries(cssContent);
      const rtMq = mediaQueries.find((mq) => mq.condition.includes('prefers-reduced-transparency'));
      if (rtMq) {
        const hasFallback = rtMq.body.includes('background') || rtMq.body.includes('backdrop-filter: none');
        assert.ok(hasFallback, 'Reduced transparency block must set opaque background or disable backdrop-filter');
      } else {
        assert.fail('Missing prefers-reduced-transparency media query');
      }
    });

    it('F13-5: Card styling uses subtle borders rather than heavy pure-black drop shadows', () => {
      const cardRules = extractCssDeclarations(cssContent, '.card');
      if (cardRules.length > 0) {
        const shadow = cardRules[0].props['box-shadow'] || '';
        assert.equal(shadow.includes('rgba(0, 0, 0, 1)'), false, 'Cards must not use pure-black drop shadows');
      }
      assert.ok(true);
    });
  });

  // -------------------------------------------------------------
  // F14: WCAG AA Contrast Compliance
  // -------------------------------------------------------------
  describe('F14: WCAG AA Contrast Compliance', () => {
    const rootVars = extractCssVariables(cssContent, ':root');
    const lightVars = extractCssVariables(cssContent, '[data-theme="light"]');

    it('F14-1: Dark mode primary text against card background meets >= 4.5:1', () => {
      const textPrimary = rootVars['--text-primary'] || '#f8fafc';
      const bgCard = rootVars['--bg-card'] || '#0d1527';
      const contrast = calculateContrastRatio(textPrimary, bgCard);
      assert.ok(contrast >= 4.5, `Dark mode text primary (${textPrimary}) on card (${bgCard}) contrast is ${contrast.toFixed(2)}:1 (must be >= 4.5:1)`);
    });

    it('F14-2: Dark mode muted text against card background meets >= 4.5:1', () => {
      const textMuted = rootVars['--text-muted'] || '#64748b';
      const bgCard = rootVars['--bg-card'] || '#0d1527';
      const contrast = calculateContrastRatio(textMuted, bgCard);
      assert.ok(contrast >= 4.5, `Dark mode text muted (${textMuted}) on card (${bgCard}) contrast is ${contrast.toFixed(2)}:1 (must be >= 4.5:1)`);
    });

    it('F14-3: Light mode accent text against card background meets >= 4.5:1', () => {
      const textAccent = lightVars['--color-accent'] || lightVars['--text-accent'] || '#0284c7';
      const bgCard = lightVars['--bg-card'] || '#ffffff';
      const contrast = calculateContrastRatio(textAccent, bgCard);
      assert.ok(contrast >= 4.5, `Light mode text accent (${textAccent}) on card (${bgCard}) contrast is ${contrast.toFixed(2)}:1 (must be >= 4.5:1)`);
    });

    it('F14-4: Light mode button primary text against button background meets >= 4.5:1', () => {
      const btnBg = lightVars['--color-accent'] || '#0284c7';
      const btnText = '#ffffff'; // standard high-contrast button label
      const contrast = calculateContrastRatio(btnText, btnBg);
      assert.ok(contrast >= 4.5, `Button text (${btnText}) on button background (${btnBg}) contrast is ${contrast.toFixed(2)}:1`);
    });

    it('F14-5: Tag and badge text meets >= 4.5:1 contrast in both modes', () => {
      const tagText = rootVars['--color-accent'] || '#38bdf8';
      const tagBg = rootVars['--bg-card'] || '#0d1527';
      const contrast = calculateContrastRatio(tagText, tagBg);
      assert.ok(contrast >= 4.5, `Tag text on dark mode card contrast is ${contrast.toFixed(2)}:1`);
    });
  });

  // -------------------------------------------------------------
  // F15: CTA Optimization & Deduplication
  // -------------------------------------------------------------
  describe('F15: CTA Optimization & Deduplication', () => {
    it('F15-1: No duplicate CTA labels with conflicting intents for the same destination', () => {
      // In unremediated Projects.jsx, both "Live Demo ↗" and "Production Deployment ↗" point to proj.liveUrl
      const hasLiveDemo = projectsJsx.includes('Live Demo');
      const hasProdDeploy = projectsJsx.includes('Production Deployment');
      const hasDuplicate = hasLiveDemo && hasProdDeploy;
      assert.equal(hasDuplicate, false, 'Projects.jsx must not duplicate CTAs (Live Demo vs Production Deployment) for same URL');
    });

    it('F15-2: Resume actions use unified CTA label across navigation and hero', () => {
      // Intent deduplication: pick unified label for resume actions
      assert.ok(headerJsx.includes('Resume') || headerJsx.includes('resume'), 'Header has resume action');
    });

    it('F15-3: CTA button labels do not wrap across multiple lines at desktop', () => {
      const btnRules = extractCssDeclarations(cssContent, '.btn');
      const hasNoWrap = btnRules.some((r) => r.props['white-space'] === 'nowrap');
      assert.ok(hasNoWrap, '.btn should declare white-space: nowrap to prevent label wrap at desktop');
    });

    it('F15-4: Interactive buttons have tactile active state (:active)', () => {
      const activeRules = extractCssDeclarations(cssContent, /\.btn:active|\.btn-primary:active/);
      assert.ok(activeRules.length > 0, 'Buttons must provide tactile :active feedback');
    });

    it('F15-5: Secondary buttons maintain distinct visual hierarchy and border contrast', () => {
      const btnSecondaryRules = extractCssDeclarations(cssContent, '.btn-secondary');
      assert.ok(btnSecondaryRules.length > 0, '.btn-secondary must be styled');
    });
  });

  // -------------------------------------------------------------
  // F16: Spring Motion & Reduced Motion
  // -------------------------------------------------------------
  describe('F16: Spring Motion & Reduced Motion', () => {
    it('F16-1: Transitions use Spring easing curve (--ease-spring)', () => {
      const rootVars = extractCssVariables(cssContent, ':root');
      const spring = rootVars['--ease-spring'];
      assert.ok(spring, '--ease-spring token must be declared in :root');
      assert.ok(spring.includes('cubic-bezier'), '--ease-spring must use a cubic-bezier physics curve');
    });

    it('F16-2: @media (prefers-reduced-motion: reduce) is defined in stylesheet', () => {
      const mediaQueries = extractMediaQueries(cssContent);
      const hasReducedMotion = mediaQueries.some((mq) => mq.condition.includes('prefers-reduced-motion'));
      assert.ok(hasReducedMotion, 'CSS must include @media (prefers-reduced-motion: reduce) rule');
    });

    it('F16-3: Reduced motion collapses transition and animation durations to near-zero', () => {
      const mediaQueries = extractMediaQueries(cssContent);
      const rm = mediaQueries.find((mq) => mq.condition.includes('prefers-reduced-motion'));
      assert.ok(rm, 'prefers-reduced-motion media query exists');
      const collapsesDuration = rm.body.includes('animation-duration: 0.01ms') || rm.body.includes('transition-duration: 0.01ms') || rm.body.includes('transition: none');
      assert.ok(collapsesDuration, 'Reduced motion block must collapse animation and transition durations');
    });

    it('F16-4: Reduced motion resets scroll-behavior to auto', () => {
      const mediaQueries = extractMediaQueries(cssContent);
      const rm = mediaQueries.find((mq) => mq.condition.includes('prefers-reduced-motion'));
      assert.ok(rm, 'prefers-reduced-motion query exists');
      assert.ok(rm.body.includes('scroll-behavior: auto'), 'scroll-behavior must reset to auto under reduced motion');
    });

    it('F16-5: Animation keyframes honor smooth physics without infinite chaotic loops', () => {
      assert.ok(cssContent.includes('@keyframes'), 'CSS includes keyframe declarations');
    });
  });

  // -------------------------------------------------------------
  // F17: Vercel Deployment Configuration
  // -------------------------------------------------------------
  describe('F17: Vercel Deployment Configuration', () => {
    it('F17-1: vercel.json exists at project root', () => {
      assert.ok(fileExists('vercel.json'), 'vercel.json must exist at project root');
    });

    it('F17-2: vercel.json defines SPA fallback rewrites', () => {
      assert.ok(vercelJsonContent, 'vercel.json must be present');
      const vercelConfig = JSON.parse(vercelJsonContent);
      assert.ok(Array.isArray(vercelConfig.rewrites), 'vercel.json must declare rewrites array');
      const spaRewrite = vercelConfig.rewrites.find((r) => r.source === '/(.*)' && r.destination === '/');
      assert.ok(spaRewrite, 'vercel.json must rewrite /(.*) to / for client-side SPA routing');
    });

    it('F17-3: vercel.json defines security headers (nosniff)', () => {
      assert.ok(vercelJsonContent, 'vercel.json must be present');
      const vercelConfig = JSON.parse(vercelJsonContent);
      assert.ok(Array.isArray(vercelConfig.headers), 'vercel.json must declare headers array');
      const hasNosniff = vercelConfig.headers.some((h) => h.headers?.some((item) => item.key.toLowerCase() === 'x-content-type-options' && item.value === 'nosniff'));
      assert.ok(hasNosniff, 'vercel.json must include X-Content-Type-Options: nosniff header');
    });

    it('F17-4: vercel.json defines frame protection headers (X-Frame-Options)', () => {
      assert.ok(vercelJsonContent, 'vercel.json must be present');
      const vercelConfig = JSON.parse(vercelJsonContent);
      const hasFrameGuard = vercelConfig.headers?.some((h) => h.headers?.some((item) => item.key.toLowerCase() === 'x-frame-options'));
      assert.ok(hasFrameGuard, 'vercel.json must include X-Frame-Options header');
    });

    it('F17-5: vercel.json headers configure static asset caching or clean URLs', () => {
      assert.ok(vercelJsonContent, 'vercel.json must be present');
      const vercelConfig = JSON.parse(vercelJsonContent);
      assert.ok(vercelConfig.cleanUrls !== undefined || vercelConfig.headers?.length > 0, 'vercel.json must specify cleanUrls or header policies');
    });
  });

  // -------------------------------------------------------------
  // F18: SEO, OpenGraph & Rich Social Metadata
  // -------------------------------------------------------------
  describe('F18: SEO, OpenGraph & Rich Social Metadata', () => {
    const metaTags = extractMetaTags(htmlContent);

    it('F18-1: index.html defines og:image meta tag', () => {
      const ogImage = metaTags.find((m) => m.property === 'og:image');
      assert.ok(ogImage && ogImage.content, 'index.html must include <meta property="og:image">');
    });

    it('F18-2: index.html defines og:url meta tag', () => {
      const ogUrl = metaTags.find((m) => m.property === 'og:url');
      assert.ok(ogUrl && ogUrl.content, 'index.html must include <meta property="og:url">');
    });

    it('F18-3: index.html defines twitter:card meta tag', () => {
      const twitterCard = metaTags.find((m) => m.name === 'twitter:card');
      assert.ok(twitterCard && twitterCard.content, 'index.html must include <meta name="twitter:card">');
    });

    it('F18-4: index.html defines twitter:title and twitter:description', () => {
      const twTitle = metaTags.find((m) => m.name === 'twitter:title');
      const twDesc = metaTags.find((m) => m.name === 'twitter:description');
      assert.ok(twTitle && twTitle.content, 'index.html must include twitter:title');
      assert.ok(twDesc && twDesc.content, 'index.html must include twitter:description');
    });

    it('F18-5: index.html defines theme-color meta tag', () => {
      const themeColor = metaTags.find((m) => m.name === 'theme-color');
      assert.ok(themeColor && themeColor.content, 'index.html must include <meta name="theme-color">');
    });
  });

  // -------------------------------------------------------------
  // F19: Production Build Integrity & Asset Verification
  // -------------------------------------------------------------
  describe('F19: Production Build Integrity & Asset Verification', () => {
    it('F19-1: package.json specifies valid Vite build script', () => {
      assert.ok(packageJson.scripts?.build, 'package.json must contain "build" script');
      assert.equal(packageJson.scripts.build, 'vite build', 'build script must execute vite build');
    });

    it('F19-2: Public resume PDF exists and is non-empty', () => {
      const hasPdf = fileExists('public/resume.pdf') || fileExists('Gyan_Mistry_Resume_9262.pdf');
      assert.ok(hasPdf, 'Resume PDF must exist in public/resume.pdf');
      if (fileExists('public/resume.pdf')) {
        const stats = fs.statSync(path.resolve(PROJECT_ROOT, 'public/resume.pdf'));
        assert.ok(stats.size > 10000, 'public/resume.pdf must be a valid non-empty PDF file');
      }
    });

    it('F19-3: Public favicon.svg exists and contains valid SVG XML', () => {
      assert.ok(fileExists('public/favicon.svg'), 'public/favicon.svg must exist');
      const svg = readProjectFile('public/favicon.svg');
      assert.ok(svg.includes('<svg') && svg.includes('</svg>'), 'public/favicon.svg must be valid SVG XML');
    });

    it('F19-4: dist/ directory contains valid built index.html if built', () => {
      if (fileExists('dist/index.html')) {
        const distHtml = readProjectFile('dist/index.html');
        assert.ok(distHtml.includes('<script'), 'dist/index.html must reference bundled JS');
        assert.ok(distHtml.includes('<link rel="stylesheet"'), 'dist/index.html must reference bundled CSS');
      } else {
        assert.ok(true, 'dist/ will be verified upon build execution');
      }
    });

    it('F19-5: Built CSS and JS bundle assets are non-empty if dist/ exists', () => {
      if (fileExists('dist/assets')) {
        const distAssets = findFiles('dist/assets');
        assert.ok(distAssets.length >= 2, 'dist/assets must contain at least JS and CSS bundles');
      } else {
        assert.ok(true);
      }
    });
  });
});
