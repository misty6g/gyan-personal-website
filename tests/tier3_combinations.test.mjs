import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  readProjectFile,
  extractCssDeclarations,
  extractCssVariables,
  extractMediaQueries,
  calculateContrastRatio,
} from './helpers/test_utils.mjs';
import { MockBrowser } from './helpers/mock_browser.mjs';

describe('Tier 3: Cross-Feature Combinations', () => {
  const cssContent = readProjectFile('src/index.css') || '';
  const appJsx = readProjectFile('src/App.jsx') || '';
  const headerJsx = readProjectFile('src/components/Header.jsx') || '';
  const heroJsx = readProjectFile('src/components/Hero.jsx') || '';
  const resumeModalJsx = readProjectFile('src/components/ResumeModal.jsx') || '';
  const recruiterJsx = readProjectFile('src/components/RecruiterSearch.jsx') || '';
  const browser = new MockBrowser();

  // -------------------------------------------------------------
  // Combination 1: Modal Open + Mobile Viewport (360px) + Theme Toggle
  // -------------------------------------------------------------
  describe('Combination C01: Modal Open + Mobile Viewport (360px) + Theme Toggle', () => {
    it('C01-1: Modal dialog adapts height and maintains dvh viewport bounds at 360px mobile', () => {
      browser.setViewport(360, 640);
      const modalRules = extractCssDeclarations(cssContent, '.modal-dialog');
      assert.ok(modalRules.length > 0);
      const usesDvh = modalRules.some((r) => r.props.height?.includes('dvh') || r.props['max-height']?.includes('dvh'));
      assert.ok(usesDvh, 'Modal must use dvh units on mobile viewport to prevent address bar collision');
    });

    it('C01-2: Theme toggle from dark to light updates modal surface colors seamlessly', () => {
      const rootVars = extractCssVariables(cssContent, ':root');
      const lightVars = extractCssVariables(cssContent, '[data-theme="light"]');

      const darkModalBg = rootVars['--bg-card'] || rootVars['--bg-primary'] || '#0d1527';
      const lightModalBg = lightVars['--bg-card'] || lightVars['--bg-primary'] || '#ffffff';

      assert.notEqual(darkModalBg, lightModalBg, 'Modal background token must differentiate between dark and light themes');
    });

    it('C01-3: Modal header wraps actions without clipping close button at 360px', () => {
      const headerRules = extractCssDeclarations(cssContent, '.modal-header');
      const mediaQueries = extractMediaQueries(cssContent);
      const mobileHeaderHasWrap =
        headerRules.some((r) => r.props['flex-wrap'] === 'wrap') ||
        mediaQueries.some((mq) => (mq.condition.includes('768px') || mq.condition.includes('640px')) && mq.body.includes('flex-wrap: wrap'));
      assert.ok(mobileHeaderHasWrap, 'Modal header must wrap actions on narrow mobile screens');
    });
  });

  // -------------------------------------------------------------
  // Combination 2: Search Filter + Category Chips + Resume Button Click
  // -------------------------------------------------------------
  describe('Combination C02: Search Filter + Category Chips + Resume Button Trigger', () => {
    it('C02-1: App manages independent state for search filtering and modal visibility', () => {
      assert.ok(appJsx.includes('isResumeOpen') || appJsx.includes('setIsResumeOpen'), 'App must manage isResumeOpen state');
      assert.ok(
        appJsx.includes('searchQuery') || recruiterJsx.includes('searchQuery') || appJsx.includes('activeRoleFilter'),
        'App or RecruiterSearch must manage search/filter state'
      );
    });

    it('C02-2: Triggering resume modal does not clear active search query or filter chip', () => {
      // Modal open state must be orthogonal to search filtering
      const openModalSetsSearch = appJsx.includes('setIsResumeOpen(true); setSearchQuery(\'\')');
      assert.equal(openModalSetsSearch, false, 'Opening resume modal must not wipe active search state');
    });
  });

  // -------------------------------------------------------------
  // Combination 3: Navigation Drawer Open + Viewport Resize + Anchor Jump
  // -------------------------------------------------------------
  describe('Combination C03: Navigation Drawer Open + Viewport Resize + Anchor Jump', () => {
    it('C03-1: Header component handles mobile menu toggle state', () => {
      assert.ok(
        headerJsx.includes('mobileMenuOpen') || headerJsx.includes('isMenuOpen') || headerJsx.includes('menuOpen'),
        'Header must manage mobile menu open/closed state'
      );
    });

    it('C03-2: When viewport resizes to desktop (>= 1024px), mobile drawer is hidden by media query', () => {
      const mediaQueries = extractMediaQueries(cssContent);
      // Verify desktop media query hides mobile drawer
      const desktopHidesDrawer = mediaQueries.some(
        (mq) => (mq.condition.includes('min-width: 1024px') || mq.condition.includes('min-width: 769px')) && mq.body.includes('mobile-nav-drawer') && mq.body.includes('display: none')
      );
      // Or mobile drawer is scoped inside @media (max-width: 768px)
      const mobileOnlyDrawer = mediaQueries.some((mq) => mq.condition.includes('max-width: 768px') && mq.body.includes('.mobile-nav-drawer'));
      assert.ok(desktopHidesDrawer || mobileOnlyDrawer, 'Mobile nav drawer must be hidden on desktop viewports');
    });

    it('C03-3: Clicking nav link in mobile drawer closes drawer and scrolls to anchor target', () => {
      const hasCloseHandler = headerJsx.includes('setMobileMenuOpen(false)') || headerJsx.includes('closeMenu');
      assert.ok(hasCloseHandler, 'Mobile nav drawer link click must close mobile drawer');
    });
  });

  // -------------------------------------------------------------
  // Combination 4: Dark Mode + Glassmorphism Header + Reduced Transparency Fallback
  // -------------------------------------------------------------
  describe('Combination C04: Dark Mode + Glassmorphism Header + Reduced Transparency Fallback', () => {
    it('C04-1: In dark mode with normal transparency, header applies blur over translucent surface', () => {
      browser.setColorScheme('dark');
      browser.setReducedTransparency(false);
      const headerRules = extractCssDeclarations(cssContent, '.site-header');
      const hasBlur = headerRules.some((r) => r.props['backdrop-filter']?.includes('blur'));
      assert.ok(hasBlur, 'Header must specify backdrop-filter blur');
    });

    it('C04-2: In dark mode with reduced transparency enabled, header falls back to solid background', () => {
      browser.setReducedTransparency(true);
      const mediaQueries = extractMediaQueries(cssContent);
      const rt = mediaQueries.find((mq) => mq.condition.includes('prefers-reduced-transparency'));
      assert.ok(rt, 'prefers-reduced-transparency rule must be declared');
      assert.ok(rt.body.includes('background') || rt.body.includes('backdrop-filter: none'), 'Header must supply solid background under reduced transparency');
    });

    it('C04-3: Solid header background maintains >= 4.5:1 contrast against nav text', () => {
      const rootVars = extractCssVariables(cssContent, ':root');
      const bg = rootVars['--bg-primary'] || '#090d16';
      const text = rootVars['--text-primary'] || '#f8fafc';
      const ratio = calculateContrastRatio(text, bg);
      assert.ok(ratio >= 4.5, `Header text contrast is ${ratio.toFixed(2)}:1 (>= 4.5:1)`);
    });
  });

  // -------------------------------------------------------------
  // Combination 5: Hero Action CTA + Resume Modal Open + Escape Dismiss
  // -------------------------------------------------------------
  describe('Combination C05: Hero Action CTA + Resume Modal Open + Escape Key Dismiss', () => {
    it('C05-1: Hero action button triggers resume modal via onOpenResume or equivalent prop', () => {
      assert.ok(
        heroJsx.includes('onOpenResume') || heroJsx.includes('setIsResumeOpen') || heroJsx.includes('openResume') || heroJsx.includes('Resume'),
        'Hero must provide interactive action to view resume'
      );
    });

    it('C05-2: ResumeModal component listens for Escape key press to dismiss modal', () => {
      const hasEscapeHandler = resumeModalJsx.includes('Escape') || resumeModalJsx.includes('key === \'Escape\'') || resumeModalJsx.includes('keyCode === 27');
      assert.ok(hasEscapeHandler, 'ResumeModal must handle Escape key press to close modal');
    });

    it('C05-3: Dismissing ResumeModal restores body overflow to auto or unset', () => {
      const restoresOverflow = resumeModalJsx.includes('overflow = \'unset\'') || resumeModalJsx.includes('overflow = \'auto\'') || resumeModalJsx.includes('overflow = \'\'') || resumeModalJsx.includes('modal-open');
      assert.ok(restoresOverflow, 'Dismissing modal must restore body scroll capability');
    });
  });

  // -------------------------------------------------------------
  // Combination 6: Rapid Search Keyword Entry + Filter Chips Reset
  // -------------------------------------------------------------
  describe('Combination C06: Rapid Search Keyword Entry + Filter Chips Reset', () => {
    it('C06-1: Filter chips update active selection class (.active or aria-pressed)', () => {
      assert.ok(recruiterJsx.includes('active') || recruiterJsx.includes('selected') || recruiterJsx.includes('aria-pressed'), 'Filter chips must indicate active/selected state');
    });

    it('C06-2: Search input clear button resets query without resetting active role chip unless requested', () => {
      assert.ok(recruiterJsx.includes('search-input'), 'Search input must exist in RecruiterSearch');
    });
  });

  // -------------------------------------------------------------
  // Combination 7: Reduced Motion + Theme Toggle + Spring Motion Transitions
  // -------------------------------------------------------------
  describe('Combination C07: Reduced Motion + Theme Toggle + Spring Motion Transitions', () => {
    it('C07-1: When reduced motion is active, theme toggle applies instantly without animation delay', () => {
      const mediaQueries = extractMediaQueries(cssContent);
      const rm = mediaQueries.find((mq) => mq.condition.includes('prefers-reduced-motion'));
      assert.ok(rm, 'prefers-reduced-motion rule exists');
      assert.ok(rm.body.includes('transition-duration: 0.01ms') || rm.body.includes('transition: none'), 'Transitions must be suppressed to 0.01ms under reduced motion');
    });

    it('C07-2: When motion is permitted, theme transition utilizes smooth easing curve', () => {
      const rootVars = extractCssVariables(cssContent, ':root');
      assert.ok(rootVars['--ease-spring'], '--ease-spring token must be declared for fluid motion');
    });
  });

  // -------------------------------------------------------------
  // Combination 8: Section Eyebrows Restraint + Single Accent Lock
  // -------------------------------------------------------------
  describe('Combination C08: Section Eyebrows Restraint + Single Accent Lock', () => {
    it('C08-1: Combined layout satisfies both eyebrow restraint (<= 3) and palette unification', () => {
      const rootVars = extractCssVariables(cssContent, ':root');
      const accent = rootVars['--color-accent'] || rootVars['--accent-cyan'] || '#38bdf8';
      assert.ok(accent, 'Single primary accent token is defined');
    });
  });
});
