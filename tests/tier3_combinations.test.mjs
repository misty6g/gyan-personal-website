import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { readProjectFile, extractMediaQueries } from './helpers/test_utils.mjs';

const css = readProjectFile('src/index.css') || '';
const app = readProjectFile('src/App.jsx') || '';
const palette = readProjectFile('src/components/CommandPalette.jsx') || '';
const modal = readProjectFile('src/components/ResumeModal.jsx') || '';
const reel = readProjectFile('src/components/ProjectReel.jsx') || '';
const credentials = readProjectFile('src/components/Credentials.jsx') || '';
const index = readProjectFile('src/components/ProjectIndex.jsx') || '';
const smooth = readProjectFile('src/lib/smoothScroll.js') || '';

describe('Tier 3: Cross-Feature Combinations', () => {
  it('C01: palette and resume modal both lock and release scroll', () => {
    for (const src of [palette, modal]) {
      assert.ok(src.includes('lockScroll(true)'));
      assert.ok(src.includes('lockScroll(false)'));
    }
    assert.ok(smooth.includes('lenis.stop()') && smooth.includes('lenis.start()'));
  });

  it('C02: scrollable overlays opt out of smooth scrolling', () => {
    assert.ok(palette.includes('data-lenis-prevent'));
    assert.ok(modal.includes('data-lenis-prevent'));
  });

  it('C03: theme toggle skips the view transition under reduced motion', () => {
    assert.ok(app.includes('!document.startViewTransition || reduce'));
    assert.ok(app.includes("pseudoElement: '::view-transition-new(root)'"));
  });

  it('C04: reduced transparency removes blur from nav, palette, and modal', () => {
    const mq = extractMediaQueries(css).find((m) => m.condition.includes('prefers-reduced-transparency'));
    assert.ok(mq);
    for (const sel of ['.nav-shell', '.palette-backdrop', '.modal-backdrop']) {
      assert.ok(mq.body.includes(sel), `${sel} not covered`);
    }
  });

  it('C05: jump-to handles the horizontal reel', () => {
    assert.ok(reel.includes("data-horizontal={horizontal ? 'true' : 'false'}"));
    assert.ok(app.includes("reel.dataset.horizontal === 'true'"));
  });

  it('C06: jump-to opens collapsed targets before scrolling', () => {
    assert.ok(app.includes('setRevealId(id)'));
    assert.ok(credentials.includes('revealId') && credentials.includes('setActive(course.category)'));
    assert.ok(index.includes('revealId') && index.includes('.add(revealId)'));
  });

  it('C07: skill chips open the palette pre-filled', () => {
    assert.ok(app.includes('onSelectTag={openSearch}'));
    assert.ok(app.includes('setPalette({ open: true, query })'));
  });

  it('C08: copy-email feedback is announced to screen readers', () => {
    assert.ok(app.includes('role="status"') && app.includes('aria-live="polite"'));
    assert.ok(app.includes('onCopied={announce}'));
  });

  it('C09: shared-layout search surface morphs between nav and palette', () => {
    const header = readProjectFile('src/components/Header.jsx');
    assert.ok(header.includes("'search-surface'") && palette.includes("'search-surface'"));
  });
});
