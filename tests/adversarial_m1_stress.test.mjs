import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  readProjectFile,
  extractCssDeclarations,
  extractMediaQueries,
  findFiles,
} from './helpers/test_utils.mjs';
import { MockBrowser } from './helpers/mock_browser.mjs';

describe('Adversarial Stress Test: Milestone 1 (M1)', () => {
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

  const browser = new MockBrowser();

  // =========================================================================
  // 1. Raw `vh` Units Adversarial Audit
  // =========================================================================
  describe('Adversarial Check 1: Zero Raw vh Units in Layout CSS & Components', () => {
    it('ADV-VH-1: CSS stylesheet contains zero raw vh units', () => {
      // Find any occurrences of digits followed by vh that are not dvh, svh, or lvh
      const rawVhRegex = /(?<![dsl])\b\d+(\.\d+)?vh\b/gi;
      const matches = [...cssContent.matchAll(rawVhRegex)];
      assert.equal(
        matches.length,
        0,
        `Found ${matches.length} raw vh unit(s) in src/index.css: ${matches.map((m) => m[0]).join(', ')}`
      );
    });

    it('ADV-VH-2: No raw vh units in any JSX component inline styles or attributes', () => {
      const jsxFiles = findFiles('src', ['.jsx', '.js']);
      for (const file of jsxFiles) {
        const content = readProjectFile(file) || '';
        const rawVhRegex = /(?<![dsl])\b\d+(\.\d+)?vh\b/gi;
        const matches = [...content.matchAll(rawVhRegex)];
        assert.equal(
          matches.length,
          0,
          `Found raw vh in ${file}: ${matches.map((m) => m[0]).join(', ')}`
        );
      }
    });

    it('ADV-VH-3: No raw vh units in index.html', () => {
      const rawVhRegex = /(?<![dsl])\b\d+(\.\d+)?vh\b/gi;
      const matches = [...htmlContent.matchAll(rawVhRegex)];
      assert.equal(matches.length, 0, 'Found raw vh in index.html');
    });

    it('ADV-VH-4: Modal dialogs and full-height sections strictly use dvh units', () => {
      const modalRules = extractCssDeclarations(cssContent, '.modal-dialog');
      const hasDvh = modalRules.some(
        (r) => r.props.height?.includes('dvh') || r.props['max-height']?.includes('dvh')
      );
      assert.ok(hasDvh, 'Modal dialog must use dvh units for viewport stability');
    });
  });

  // =========================================================================
  // 2. Horizontal Overflow Containment Across All 10 Extreme Viewports
  // =========================================================================
  describe('Adversarial Check 2: Horizontal Overflow Containment Across Viewports', () => {
    const viewports = [320, 360, 375, 390, 414, 500, 768, 1024, 1920, 3840];

    it('ADV-OF-ROOT: Root html and body both enforce overflow-x: hidden', () => {
      const htmlRules = extractCssDeclarations(cssContent, 'html');
      const bodyRules = extractCssDeclarations(cssContent, 'body');

      const htmlHidden = htmlRules.some((r) => r.props['overflow-x'] === 'hidden');
      const bodyHidden = bodyRules.some((r) => r.props['overflow-x'] === 'hidden');

      assert.ok(htmlHidden, 'html selector must specify overflow-x: hidden');
      assert.ok(bodyHidden, 'body selector must specify overflow-x: hidden');
    });

    it('ADV-OF-CONTAINER: Containers enforce box-sizing and width bounds', () => {
      const containerRules = extractCssDeclarations(cssContent, '.container');
      assert.ok(containerRules.length > 0, '.container must be defined');
      assert.ok(
        containerRules.some(
          (r) =>
            r.props['box-sizing'] === 'border-box' ||
            cssContent.includes('*, *::before, *::after {\n  box-sizing: border-box;') ||
            cssContent.includes('box-sizing: border-box;')
        ),
        'Container or universal selector must enforce border-box'
      );
    });

    for (const w of viewports) {
      it(`ADV-OF-${w}px: Layout containment verified at ${w}px viewport`, () => {
        browser.setViewport(w, 800);

        // 1. Verify no fixed widths exceed viewport
        const allRules = extractCssDeclarations(cssContent, /^[^{}]+$/);
        const dangerousFixedRules = allRules.filter((r) => {
          // If a rule specifies a fixed px width (not max-width, not media query scoped)
          if (r.props.width && r.props.width.endsWith('px')) {
            const px = parseFloat(r.props.width);
            return px > w;
          }
          return false;
        });
        assert.equal(
          dangerousFixedRules.length,
          0,
          `Found rules with fixed width > ${w}px: ${dangerousFixedRules.map((r) => r.selectors).join(', ')}`
        );

        // 2. Verify drawer does not use 100vw (which includes scrollbar width)
        const drawerRules = extractCssDeclarations(cssContent, '.mobile-nav-drawer');
        const uses100vw = drawerRules.some((r) => r.props.width === '100vw');
        assert.equal(uses100vw, false, 'Mobile nav drawer must not use 100vw');

        // 3. Verify modal dialog has responsive max-width
        const modalRules = extractCssDeclarations(cssContent, '.modal-dialog');
        const modalMaxWidthSafe = modalRules.every((r) => {
          if (!r.props['max-width']) return true;
          return r.props.width === '100%' || parseFloat(r.props['max-width']) <= w || r.props['max-width'].includes('%');
        });
        assert.ok(modalMaxWidthSafe, `Modal dialog must not exceed ${w}px`);

        // 4. Verify Skills Matrix grid columns at small viewports
        if (w <= 640) {
          const mediaQueries = extractMediaQueries(cssContent);
          const hasCol1 = mediaQueries
            .filter((mq) => mq.condition.includes('640px'))
            .some((mq) => mq.body.includes('skills-matrix') && mq.body.includes('1fr'));
          assert.ok(hasCol1, `Skills matrix must collapse to 1fr at ${w}px`);
        }
      });
    }

    it('ADV-OF-TAGS: Badges and tags enforce word breaking to prevent track blowout', () => {
      const badgeRules = extractCssDeclarations(cssContent, '.badge-item');
      const tagRules = extractCssDeclarations(cssContent, '.tag');

      const badgeSafe = badgeRules.some(
        (r) => r.props['word-break'] === 'break-word' || r.props['overflow-wrap'] === 'break-word'
      );
      const tagSafe = tagRules.some(
        (r) =>
          r.props['box-sizing'] === 'border-box' &&
          (r.props['max-width'] === '100%' || cssContent.includes('word-break: break-word'))
      );

      assert.ok(badgeSafe, 'Badge items must allow word breaking');
      assert.ok(tagSafe, 'Tags must enforce border-box and containment');
    });

    it('ADV-OF-MODAL-HEADER: ResumeModal header wraps at narrow viewports (<= 640px)', () => {
      const mediaQueries = extractMediaQueries(cssContent);
      const modalHeaderWrap = mediaQueries
        .filter((mq) => mq.condition.includes('640px'))
        .some((mq) => mq.body.includes('.modal-header') && mq.body.includes('flex-wrap: wrap'));
      assert.ok(modalHeaderWrap, '.modal-header must flex-wrap at <= 640px to prevent 320-360px overflow');
    });
  });

  // =========================================================================
  // 3. Programmatic Touch Target Geometry Audit (All Interactive Elements >= 44x44px)
  // =========================================================================
  describe('Adversarial Check 3: Interactive Touch Target Geometry (>= 44x44px)', () => {
    // Audit all interactive selectors identified across the entire UI
    const interactiveElements = [
      { name: 'Brand logo link', selector: '.brand-logo', component: 'Header.jsx' },
      { name: 'Desktop nav links', selector: '.nav-links a', component: 'Header.jsx' },
      { name: 'Resume navigation button', selector: '.resume-nav-btn', component: 'Header.jsx' },
      { name: 'Theme toggle button', selector: '.btn-icon', component: 'Header.jsx' },
      { name: 'Mobile menu toggle button', selector: '.mobile-menu-toggle', component: 'Header.jsx' },
      { name: 'Mobile nav drawer links', selector: '.mobile-nav-list a', component: 'Header.jsx' },
      { name: 'Mobile drawer resume button', selector: '.mobile-drawer-resume-btn', component: 'Header.jsx' },
      { name: 'Standard button (.btn)', selector: '.btn', component: 'Shared/Hero/Resume' },
      { name: 'Card action button (.card-action-btn)', selector: '.card-action-btn', component: 'Projects.jsx' },
      { name: 'Hero location email link', selector: '.hero-location a', component: 'Hero.jsx' },
      { name: 'Hero social pills', selector: '.social-pill', component: 'Hero.jsx' },
      { name: 'Search input', selector: '.search-input', component: 'RecruiterSearch.jsx' },
      { name: 'Clear search button', selector: '.clear-search-btn', component: 'RecruiterSearch.jsx' },
      { name: 'Quick filter tag button', selector: '.quick-tag', component: 'RecruiterSearch.jsx/Coursework.jsx' },
      { name: 'Filter chips & jump buttons', selector: '.jump-chip', component: 'RecruiterSearch.jsx/Footer.jsx' },
      { name: 'Filter pill buttons', selector: '.filter-pill', component: 'Coursework.jsx' },
      { name: 'Technology tag buttons', selector: '.tag', component: 'TechTags.jsx/SkillsMatrix.jsx' },
      { name: 'Tag expand (+N more) button', selector: '.tag-expand-btn', component: 'TechTags.jsx/SkillsMatrix.jsx' },
      { name: 'Project card repo/demo links', selector: '.link-item', component: 'Projects.jsx' },
      { name: 'Section expand / collapse button', selector: '.expand-btn', component: 'Experience/Projects/Coursework/Skills' },
      { name: 'Footer social links', selector: '.footer-links a', component: 'Footer.jsx' },
      { name: 'Footer back to top button', selector: '.footer-links button', component: 'Footer.jsx' },
      { name: 'Modal download/open action buttons', selector: '.modal-action-btn', component: 'ResumeModal.jsx' },
      { name: 'Modal close button', selector: '.modal-close-btn', component: 'ResumeModal.jsx' },
    ];

    for (const elem of interactiveElements) {
      it(`ADV-TARGET: ${elem.name} (${elem.selector}) satisfies >= 44x44px touch target`, () => {
        const declarations = extractCssDeclarations(cssContent, elem.selector);
        assert.ok(
          declarations.length > 0,
          `CSS must define rules for ${elem.name} (${elem.selector})`
        );

        // Merge properties from matching declarations
        const mergedProps = {};
        for (const decl of declarations) {
          Object.assign(mergedProps, decl.props);
        }

        // Verify min-height / height >= 44px
        const height =
          parseFloat(mergedProps.height) ||
          parseFloat(mergedProps['min-height']) ||
          0;
        assert.ok(
          height >= 44,
          `${elem.name} (${elem.selector}) height must be >= 44px, observed: ${height}px`
        );

        // Verify min-width / width >= 44px (or width: 100% for full-width inputs/buttons)
        const width =
          parseFloat(mergedProps.width) ||
          parseFloat(mergedProps['min-width']) ||
          (mergedProps.width === '100%' ? 44 : 0);
        assert.ok(
          width >= 44 || mergedProps.width === '100%' || mergedProps['min-width'] === '0',
          `${elem.name} (${elem.selector}) width must be >= 44px or flexible, observed: ${width}px`
        );

        // Verify display is not inline (which ignores min-width/min-height in standard CSS)
        const display = mergedProps.display || '';
        if (elem.selector.startsWith('a') || elem.selector.includes(' a')) {
          assert.ok(
            ['inline-flex', 'flex', 'inline-block', 'block'].includes(display),
            `${elem.name} anchor element must have non-inline display to respect touch geometry, observed: ${display}`
          );
        }
      });
    }

    it('ADV-TARGET-INLINE: No JSX files contain hardcoded inline height or padding restricting touch targets < 44px', () => {
      const jsxFiles = findFiles('src/components', ['.jsx']);
      for (const file of jsxFiles) {
        const content = readProjectFile(file) || '';
        // Check for suspicious tiny inline padding on buttons or links
        const badPaddingRegex = /style=\{\{\s*[^}]*padding:\s*['"]0\.[1-3]rem/g;
        const matches = [...content.matchAll(badPaddingRegex)];
        assert.equal(
          matches.length,
          0,
          `Found restrictive inline padding in ${file}: ${matches.map((m) => m[0]).join(', ')}`
        );
      }
    });
  });

  // =========================================================================
  // 4. Mobile Navigation & Drawer Edge Case Verification
  // =========================================================================
  describe('Adversarial Check 4: Mobile Navigation Drawer & Backdrop Resilience', () => {
    it('ADV-NAV-1: Header does not clip drawer when mobile menu is active', () => {
      const headerNormal = extractCssDeclarations(cssContent, '.site-header');
      const fixed64 = headerNormal.some((r) => r.props.height === '64px');
      assert.equal(
        fixed64,
        false,
        '.site-header must not use fixed height: 64px which clips mobile navigation drawer'
      );
    });

    it('ADV-NAV-2: Mobile drawer renders with top: 100% and proper layering', () => {
      const drawerRules = extractCssDeclarations(cssContent, '.mobile-nav-drawer');
      assert.ok(drawerRules.length > 0);
      assert.ok(drawerRules.some((r) => r.props.top === '100%'));
      assert.ok(drawerRules.some((r) => parseInt(r.props['z-index'] || '0', 10) >= 90));
    });

    it('ADV-NAV-3: Mobile nav backdrop exists for tap-to-close behavior', () => {
      const backdropRules = extractCssDeclarations(cssContent, '.mobile-nav-backdrop');
      assert.ok(backdropRules.length > 0, '.mobile-nav-backdrop must be styled');
      assert.ok(
        headerJsx.includes('mobile-nav-backdrop'),
        'Header.jsx must render mobile-nav-backdrop'
      );
      assert.ok(
        headerJsx.includes('closeMenu'),
        'Backdrop must have click handler to close menu'
      );
    });

    it('ADV-NAV-4: Header listens for Escape key to close mobile menu', () => {
      assert.ok(
        headerJsx.includes('Escape') || headerJsx.includes('key === "Escape"'),
        'Header must dismiss mobile drawer on Escape key press'
      );
    });
  });

  // =========================================================================
  // 5. iOS Safari Auto-Zoom Prevention & Input Usability
  // =========================================================================
  describe('Adversarial Check 5: iOS Safari Auto-Zoom & Form Input Usability', () => {
    it('ADV-IOS-1: Search input font-size is strictly >= 16px (1rem) across all media queries', () => {
      const inputRules = extractCssDeclarations(cssContent, '.search-input');
      assert.ok(inputRules.length > 0);
      const baseFontSize = inputRules[0].props['font-size'];
      assert.ok(
        baseFontSize === '1rem' || parseFloat(baseFontSize) >= 16,
        `Base font size must be >= 16px (1rem), observed: ${baseFontSize}`
      );

      // Verify no media query reduces it below 16px
      const mediaQueries = extractMediaQueries(cssContent);
      for (const mq of mediaQueries) {
        if (mq.body.includes('.search-input') && mq.body.includes('font-size')) {
          const mqInputRules = extractCssDeclarations(mq.body, '.search-input');
          for (const rule of mqInputRules) {
            if (rule.props['font-size']) {
              const fs = rule.props['font-size'];
              assert.ok(
                fs === '1rem' || parseFloat(fs) >= 16,
                `Media query (${mq.condition}) reduced .search-input font-size to ${fs}`
              );
            }
          }
        }
      }
    });

    it('ADV-IOS-2: Search input specifies box-sizing: border-box and min-height >= 44px', () => {
      const inputRules = extractCssDeclarations(cssContent, '.search-input');
      assert.ok(inputRules.some((r) => r.props['box-sizing'] === 'border-box'));
      assert.ok(inputRules.some((r) => parseFloat(r.props['min-height']) >= 44));
    });

    it('ADV-IOS-3: Viewport meta tag in index.html is configured properly without user-scalable=no', () => {
      assert.ok(htmlContent.includes('viewport'), 'index.html must have viewport meta tag');
      assert.ok(
        htmlContent.includes('width=device-width'),
        'viewport meta must have width=device-width'
      );
      assert.ok(
        htmlContent.includes('initial-scale=1.0'),
        'viewport meta must have initial-scale=1.0'
      );
      // user-scalable=no is an anti-pattern that violates WCAG 1.4.4
      assert.equal(
        htmlContent.includes('user-scalable=no'),
        false,
        'index.html must not disable user-scalable (WCAG 1.4.4 accessibility)'
      );
    });
  });

  // =========================================================================
  // 6. ResumeModal Background Scroll Locking & Action Layout
  // =========================================================================
  describe('Adversarial Check 6: ResumeModal Background Locking & Action Layout', () => {
    it('ADV-MODAL-1: ResumeModal locks both html and body overflow when open', () => {
      assert.ok(
        resumeModalJsx.includes("document.body.style.overflow = 'hidden'"),
        'ResumeModal must lock body overflow'
      );
      assert.ok(
        resumeModalJsx.includes("document.documentElement.style.overflow = 'hidden'"),
        'ResumeModal must lock documentElement overflow for iOS Safari'
      );
    });

    it('ADV-MODAL-2: ResumeModal restores overflow on close and unmount', () => {
      assert.ok(
        resumeModalJsx.includes("document.body.style.overflow = ''"),
        'ResumeModal must restore body overflow on close'
      );
      assert.ok(
        resumeModalJsx.includes("document.documentElement.style.overflow = ''"),
        'ResumeModal must restore documentElement overflow on close'
      );
    });

    it('ADV-MODAL-3: Modal actions switch to responsive 3-column grid below 640px', () => {
      const mediaQueries = extractMediaQueries(cssContent);
      const hasResponsiveGrid = mediaQueries
        .filter((mq) => mq.condition.includes('640px'))
        .some((mq) => mq.body.includes('.modal-actions') && mq.body.includes('grid-template-columns: 1fr 1fr auto'));
      assert.ok(
        hasResponsiveGrid,
        '.modal-actions must use grid-template-columns: 1fr 1fr auto on mobile'
      );
    });
  });
});
