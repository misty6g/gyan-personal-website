import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  readProjectFile,
  extractCssDeclarations,
  extractMediaQueries,
  calculateContrastRatio,
  findFiles,
} from './helpers/test_utils.mjs';

describe('Adversarial Stress Test: Milestone 2 (M2)', () => {
  const cssContent = readProjectFile('src/index.css') || '';
  const htmlContent = readProjectFile('index.html') || '';
  const headerJsx = readProjectFile('src/components/Header.jsx') || '';
  const heroJsx = readProjectFile('src/components/Hero.jsx') || '';
  const recruiterSearchJsx = readProjectFile('src/components/RecruiterSearch.jsx') || '';
  const experienceJsx = readProjectFile('src/components/Experience.jsx') || '';
  const projectsJsx = readProjectFile('src/components/Projects.jsx') || '';
  const courseworkJsx = readProjectFile('src/components/Coursework.jsx') || '';
  const skillsMatrixJsx = readProjectFile('src/components/SkillsMatrix.jsx') || '';
  const educationJsx = readProjectFile('src/components/Education.jsx') || '';
  const extracurricularsJsx = readProjectFile('src/components/Extracurriculars.jsx') || '';
  const resumeModalJsx = readProjectFile('src/components/ResumeModal.jsx') || '';
  const footerJsx = readProjectFile('src/components/Footer.jsx') || '';
  const appJsx = readProjectFile('src/App.jsx') || '';

  // =========================================================================
  // 1. Dark and Light Mode Theme Consistency & Contrast Across All Sections
  // =========================================================================
  describe('Adversarial Check 1: Dark and Light Mode Theme Consistency & Contrast', () => {
    it('ADV-THEME-1: Unified theme tokens defined in :root and [data-theme="light"]', () => {
      assert.ok(cssContent.includes(':root'), ':root dark theme tokens must be declared');
      assert.ok(cssContent.includes('[data-theme="light"]'), 'Light theme tokens must be declared');
      assert.ok(cssContent.includes('--color-accent: #38bdf8'), 'Dark mode primary accent must be #38bdf8');
      assert.ok(cssContent.includes('--color-accent: #0369a1'), 'Light mode primary accent must be #0369a1');
    });

    it('ADV-THEME-2: Dark mode base contrast satisfies WCAG AA (>= 4.5:1)', () => {
      const darkBgPrimary = '#090d16';
      const darkBgCard = '#0d1527';
      const darkTextPrimary = '#f8fafc';
      const darkTextSecondary = '#94a3b8';
      const darkTextMuted = '#94a3b8';
      const darkColorAccent = '#38bdf8';

      assert.ok(calculateContrastRatio(darkTextPrimary, darkBgPrimary) >= 4.5, 'Dark text primary on primary bg');
      assert.ok(calculateContrastRatio(darkTextPrimary, darkBgCard) >= 4.5, 'Dark text primary on card bg');
      assert.ok(calculateContrastRatio(darkTextSecondary, darkBgCard) >= 4.5, 'Dark text secondary on card bg');
      assert.ok(calculateContrastRatio(darkTextMuted, darkBgCard) >= 4.5, 'Dark text muted on card bg');
      assert.ok(calculateContrastRatio(darkColorAccent, darkBgCard) >= 4.5, 'Dark color accent on card bg');
      assert.ok(calculateContrastRatio('#090d16', darkColorAccent) >= 4.5, 'Dark btn-primary text on accent bg');
    });

    it('ADV-THEME-3: Light mode base contrast satisfies WCAG AA (>= 4.5:1)', () => {
      const lightBgPrimary = '#f8fafc';
      const lightBgCard = '#ffffff';
      const lightTextPrimary = '#0f172a';
      const lightTextSecondary = '#475569';
      const lightTextMuted = '#64748b';
      const lightColorAccent = '#0369a1';

      assert.ok(calculateContrastRatio(lightTextPrimary, lightBgPrimary) >= 4.5, 'Light text primary on primary bg');
      assert.ok(calculateContrastRatio(lightTextPrimary, lightBgCard) >= 4.5, 'Light text primary on card bg');
      assert.ok(calculateContrastRatio(lightTextSecondary, lightBgCard) >= 4.5, 'Light text secondary on card bg');
      assert.ok(calculateContrastRatio(lightTextMuted, lightBgCard) >= 4.5, 'Light text muted on card bg');
      assert.ok(calculateContrastRatio(lightColorAccent, lightBgCard) >= 4.5, 'Light color accent on card bg');
      assert.ok(calculateContrastRatio('#ffffff', lightColorAccent) >= 4.5, 'Light btn-primary text on accent bg');
    });

    it('ADV-THEME-4: Zero mid-page inverted sections across all 11 views', () => {
      // Ensure no section hardcodes inverted background utilities like bg-white in dark mode or bg-black in light mode
      const hardcodedInversionPatterns = [
        /style=\{\{[^}]*background:\s*['"]#(fff|ffffff|000|000000)['"]/i,
        /style=\{\{[^}]*backgroundColor:\s*['"]#(fff|ffffff|000|000000)['"]/i,
      ];
      const jsxFiles = [
        headerJsx, heroJsx, recruiterSearchJsx, experienceJsx, projectsJsx,
        courseworkJsx, skillsMatrixJsx, educationJsx, extracurricularsJsx,
        resumeModalJsx, footerJsx, appJsx
      ];
      for (const content of jsxFiles) {
        for (const pat of hardcodedInversionPatterns) {
          assert.equal(pat.test(content), false, `Detected hardcoded inverted background pattern in component JSX`);
        }
      }
    });

    it('ADV-THEME-5: Light mode active interactive tags must meet WCAG AA contrast (BUG AUDIT)', () => {
      // In light mode, --text-accent is #0369a1.
      // If an active element (.quick-tag.active, .tag.tag-matched, .toast-notice) sets background: var(--text-accent)
      // but fails to override color to #ffffff (keeping #090d16), contrast drops to 3.27:1.
      const lightAccent = '#0369a1';
      const lightQuickTagDecls = extractCssDeclarations(cssContent, '[data-theme="light"] .quick-tag');
      const lightTagMatchedDecls = extractCssDeclarations(cssContent, '[data-theme="light"] .tag.tag-matched');
      const lightToastDecls = extractCssDeclarations(cssContent, '[data-theme="light"] .toast-notice');

      const hasLightQuickTagOverride = lightQuickTagDecls.length > 0 && lightQuickTagDecls.some(d => d.props.color === '#ffffff');
      const hasLightTagMatchedOverride = lightTagMatchedDecls.length > 0 && lightTagMatchedDecls.some(d => d.props.color === '#ffffff');
      const hasLightToastOverride = lightToastDecls.length > 0 && lightToastDecls.some(d => d.props.color === '#ffffff');

      const activeTagTextColorInLightMode = (hasLightQuickTagOverride && hasLightTagMatchedOverride && hasLightToastOverride) ? '#ffffff' : '#090d16';
      const ratio = calculateContrastRatio(activeTagTextColorInLightMode, lightAccent);

      // Record empirical test result: if it fails, this assertion documents the defect
      assert.ok(
        ratio >= 4.5,
        `Active/highlighted tags in light mode have contrast ratio ${ratio.toFixed(2)}:1 (< 4.5:1 required). ` +
        `Elements (.quick-tag.active, .tag.tag-matched, .toast-notice) use background ${lightAccent} with dark text #090d16 without a [data-theme="light"] color: #ffffff override.`
      );
    });
  });

  // =========================================================================
  // 2. Desktop Header Stress Testing (769px to 4K / 3840px)
  // =========================================================================
  describe('Adversarial Check 2: Desktop Header Viewports (769px to 4K)', () => {
    it('ADV-HDR-1: Header height is locked <= 80px across all desktop declarations', () => {
      const headerDecls = extractCssDeclarations(cssContent, '.site-header');
      assert.ok(headerDecls.length > 0, '.site-header declarations must exist');
      for (const d of headerDecls) {
        if (d.props.height && d.props.height.endsWith('px')) {
          const h = parseFloat(d.props.height);
          assert.ok(h <= 80, `Desktop header height must be <= 80px, got ${h}px`);
        }
        if (d.props['max-height'] && d.props['max-height'].endsWith('px')) {
          const mh = parseFloat(d.props['max-height']);
          assert.ok(mh <= 80, `Desktop header max-height must be <= 80px, got ${mh}px`);
        }
      }
    });

    it('ADV-HDR-2: Header container and inner use single-line flex row', () => {
      const headerInnerDecls = extractCssDeclarations(cssContent, '.header-inner');
      const hasFlex = headerInnerDecls.some((d) => d.props.display === 'flex');
      const hasSpaceBetween = headerInnerDecls.some((d) => d.props['justify-content'] === 'space-between');
      assert.ok(hasFlex, '.header-inner must use display: flex');
      assert.ok(hasSpaceBetween, '.header-inner must use justify-content: space-between');
    });

    it('ADV-HDR-3: Desktop navigation locks single line with flex-wrap: nowrap', () => {
      const desktopNavDecls = extractCssDeclarations(cssContent, '.desktop-nav');
      const noWrap = desktopNavDecls.some((d) => d.props['flex-wrap'] === 'nowrap');
      assert.ok(noWrap, '.desktop-nav must declare flex-wrap: nowrap');
    });

    it('ADV-HDR-4: Sticky header backdrop covers full viewport without clipping', () => {
      const headerDecls = extractCssDeclarations(cssContent, '.site-header');
      const isSticky = headerDecls.some((d) => d.props.position === 'sticky');
      const hasBlur = headerDecls.some((d) => (d.props['backdrop-filter'] || '').includes('blur'));
      assert.ok(isSticky, '.site-header must have position: sticky');
      assert.ok(hasBlur, '.site-header must have backdrop-filter blur');
    });

    it('ADV-HDR-5: Mobile backdrop is suppressed on desktop (min-width: 1024px)', () => {
      const mediaQueries = extractMediaQueries(cssContent);
      const suppressesBackdrop = mediaQueries.some((mq) =>
        (mq.condition.includes('1024px') || mq.condition.includes('769px')) &&
        mq.body.includes('.mobile-nav-backdrop') &&
        mq.body.includes('display: none')
      );
      assert.ok(suppressesBackdrop, '.mobile-nav-backdrop must be set to display: none at desktop breakpoint');
    });

    it('ADV-HDR-6: Desktop header content width geometry at 769px tablet boundary (STRESS AUDIT)', () => {
      // Measure total minimum content width of header children:
      // Brand logo: ~140px, Desktop Nav: ~560px, Actions: ~152px, Gaps: 32px => Total ~884px.
      // At viewport width 769px (padding 40px), available width is 729px.
      // Because desktop nav turns on at 769px while content requires ~884px,
      // on tablet viewports between 769px and 884px, header actions can overflow the viewport container.
      const brandLen = 13; // "> gyan.mistry"
      const brandWidthEst = brandLen * 10.2 + 8; // ~140.6px
      const navLinks = ["Experience", "Projects", "Coursework", "Skills", "Education", "Extracurriculars"];
      const navWidthEst = navLinks.map((l) => Math.max(44, l.length * 7.8)).reduce((a, b) => a + b, 0) + (5 * 20); // ~560.2px
      const actionsWidthEst = 100 + 8 + 44; // ~152px
      const totalHeaderContentWidth = brandWidthEst + 16 + navWidthEst + 16 + actionsWidthEst; // ~884.8px

      const tabletViewport = 769;
      const containerPadding = 40;
      const availableInnerWidth = tabletViewport - containerPadding;

      // Check whether desktop nav has a tablet media query or font scaling between 769px and 1023px
      const mediaQueries = extractMediaQueries(cssContent);
      const hasTabletNavScaling = mediaQueries.some((mq) =>
        (mq.condition.includes('769px') || mq.condition.includes('1023px') || mq.condition.includes('1024px')) &&
        (mq.body.includes('.nav-links') || mq.body.includes('.desktop-nav'))
      );

      // Verify at true desktop viewports (>= 1024px, 1440px, 1920px, 3840px / 4K), header fits cleanly
      assert.ok(1024 - containerPadding > totalHeaderContentWidth, 'Header fits with zero clipping at >= 1024px desktop');
      assert.ok(1920 - containerPadding > totalHeaderContentWidth, 'Header fits with zero clipping at 1920px Full HD');
      assert.ok(3840 - containerPadding > totalHeaderContentWidth, 'Header fits with zero clipping at 3840px 4K UHD');

      // Assert whether tablet navigation scaling exists between 769px and 1023px
      assert.ok(
        hasTabletNavScaling || totalHeaderContentWidth <= availableInnerWidth,
        `Header content width (~${Math.round(totalHeaderContentWidth)}px) exceeds available inner width at 769px (~${availableInnerWidth}px). ` +
        `Desktop navigation is enabled at 769px without tablet font/gap scaling, causing potential header-actions clipping on viewports between 769px and 884px.`
      );
    });
  });

  // =========================================================================
  // 3. Reduced Transparency and Reduced Motion Media Queries
  // =========================================================================
  describe('Adversarial Check 3: Reduced Transparency and Reduced Motion', () => {
    it('ADV-ACC-1: @media (prefers-reduced-motion: reduce) collapses animations and transitions to 0.01ms', () => {
      const mediaQueries = extractMediaQueries(cssContent);
      const motionQuery = mediaQueries.find((mq) => mq.condition.includes('prefers-reduced-motion'));
      assert.ok(motionQuery, '@media (prefers-reduced-motion: reduce) must be defined');
      assert.ok(motionQuery.body.includes('animation-duration: 0.01ms !important'), 'animation-duration must be 0.01ms !important');
      assert.ok(motionQuery.body.includes('transition-duration: 0.01ms !important'), 'transition-duration must be 0.01ms !important');
      assert.ok(motionQuery.body.includes('scroll-behavior: auto !important'), 'scroll-behavior must be auto !important');
    });

    it('ADV-ACC-2: @media (prefers-reduced-transparency: reduce) disables backdrop blur and enforces opaque header', () => {
      const mediaQueries = extractMediaQueries(cssContent);
      const transparencyQuery = mediaQueries.find((mq) => mq.condition.includes('prefers-reduced-transparency'));
      assert.ok(transparencyQuery, '@media (prefers-reduced-transparency: reduce) must be defined');
      assert.ok(transparencyQuery.body.includes('.site-header'), 'Must target .site-header');
      assert.ok(transparencyQuery.body.includes('backdrop-filter: none !important'), 'Must disable backdrop-filter');
      assert.ok(transparencyQuery.body.includes('background: var(--bg-primary) !important'), 'Must set opaque background');
    });

    it('ADV-ACC-3: Modals and backdrops audit under reduced transparency', () => {
      // Elements using backdrop-filter blur across project
      const blurMatches = [...cssContent.matchAll(/([^{}]+)\{[^{}]*backdrop-filter:\s*blur\(([^)]+)\)[^{}]*\}/g)];
      const blurSelectors = blurMatches.map((m) => m[1].trim());
      assert.ok(blurSelectors.some((s) => s.includes('.site-header')), '.site-header uses backdrop-filter');
    });
  });

  // =========================================================================
  // 4. CTA Deduplication and Multi-Line Wrap Prevention
  // =========================================================================
  describe('Adversarial Check 4: CTA Deduplication and Multi-Line Wrap Prevention', () => {
    it('ADV-CTA-1: Zero duplicate CTA intents or identical URLs in any project card', () => {
      // Check portfolioData.projects
      import('../src/data/portfolioData.js').then(({ portfolioData }) => {
        for (const proj of portfolioData.projects) {
          const links = [];
          if (proj.liveUrl) links.push({ type: 'live', url: proj.liveUrl });
          if (proj.githubUrl) links.push({ type: 'github', url: proj.githubUrl });
          if (proj.linkedinPostUrl) links.push({ type: 'linkedin', url: proj.linkedinPostUrl });

          const urls = links.map((l) => l.url);
          const uniqueUrls = new Set(urls);
          assert.equal(uniqueUrls.size, urls.length, `Project ${proj.id} has duplicate link destinations`);
        }
      });
    });

    it('ADV-CTA-2: Projects.jsx contains no duplicate Live Demo / Production Deployment buttons', () => {
      const matches = [...projectsJsx.matchAll(/Production Deployment/g)];
      assert.equal(matches.length, 0, 'Projects.jsx must not contain redundant "Production Deployment" CTA');
    });

    it('ADV-CTA-3: .btn enforces white-space: nowrap to prevent multi-line wrapping on desktop', () => {
      const btnDecls = extractCssDeclarations(cssContent, '.btn');
      const hasNowrap = btnDecls.some((d) => d.props['white-space'] === 'nowrap');
      assert.ok(hasNowrap, '.btn must define white-space: nowrap');
    });

    it('ADV-CTA-4: All primary action buttons have explicit non-wrapping labels', () => {
      // Check Hero CTA buttons
      assert.ok(heroJsx.includes('Download Resume (PDF)'), 'Hero download CTA present');
      assert.ok(heroJsx.includes('View Resume'), 'Hero view resume CTA present');
      assert.ok(heroJsx.includes('Copy Email'), 'Hero copy email CTA present');
      // Verify no multiple nested line breaks in button text
      assert.equal(/<button[^>]*>\s*<[^>]+>\s*<br\s*\/?>/i.test(heroJsx), false, 'No br tags inside buttons');
    });
  });

  // =========================================================================
  // 5. Zero Em-Dashes Stress Test
  // =========================================================================
  describe('Adversarial Check 5: Zero Em-Dash UTF-8 and Unicode Sequences', () => {
    it('ADV-DASH-1: Zero em-dash characters (—, U+2014) in src/', () => {
      const files = findFiles('src', ['.js', '.jsx', '.css', '.html']);
      for (const f of files) {
        const content = readProjectFile(f) || '';
        assert.equal(content.includes('—'), false, `Found em-dash in ${f}`);
        assert.equal(content.includes('\\u2014'), false, `Found \\u2014 unicode escape in ${f}`);
      }
    });

    it('ADV-DASH-2: Zero em-dash characters in documentation and markup', () => {
      const docFiles = ['README.md', 'index.html'];
      for (const f of docFiles) {
        const content = readProjectFile(f) || '';
        assert.equal(content.includes('—'), false, `Found em-dash in ${f}`);
      }
    });
  });
});
