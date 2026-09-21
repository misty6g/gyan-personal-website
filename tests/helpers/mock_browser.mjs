/**
 * Virtual Browser Simulator for headless E2E testing of responsive layout,
 * viewport units, media query emulation, and touch interaction targets.
 */
export class MockBrowser {
  constructor(options = {}) {
    this.width = options.width || 1280;
    this.height = options.height || 800;
    this.dvh = options.dvh || this.height;
    this.vh = options.vh || this.height;
    this.reducedMotion = options.reducedMotion || false;
    this.reducedTransparency = options.reducedTransparency || false;
    this.colorScheme = options.colorScheme || 'dark';
    this.scrollY = 0;
    this.events = [];
  }

  setViewport(width, height, options = {}) {
    this.width = width;
    this.height = height;
    // On mobile devices, dvh accounts for address bar collapsing/expanding
    const browserChromeHeight = options.browserChromeHeight || (width <= 640 ? 56 : 0);
    this.dvh = height - browserChromeHeight;
    this.vh = height;
  }

  setReducedMotion(enabled) {
    this.reducedMotion = !!enabled;
  }

  setReducedTransparency(enabled) {
    this.reducedTransparency = !!enabled;
  }

  setColorScheme(scheme) {
    this.colorScheme = scheme === 'light' ? 'light' : 'dark';
  }

  /**
   * Matches CSS media query against current virtual environment.
   */
  matchesMediaQuery(mediaQuery) {
    const q = mediaQuery.toLowerCase();

    if (q.includes('prefers-reduced-motion')) {
      if (q.includes('reduce')) return this.reducedMotion;
      if (q.includes('no-preference')) return !this.reducedMotion;
    }

    if (q.includes('prefers-reduced-transparency')) {
      if (q.includes('reduce')) return this.reducedTransparency;
      if (q.includes('no-preference')) return !this.reducedTransparency;
    }

    if (q.includes('prefers-color-scheme')) {
      if (q.includes('light')) return this.colorScheme === 'light';
      if (q.includes('dark')) return this.colorScheme === 'dark';
    }

    // Width queries: max-width / min-width
    const maxMatch = q.match(/max-width:\s*(\d+)px/);
    if (maxMatch) {
      const maxW = parseInt(maxMatch[1], 10);
      if (this.width > maxW) return false;
    }

    const minMatch = q.match(/min-width:\s*(\d+)px/);
    if (minMatch) {
      const minW = parseInt(minMatch[1], 10);
      if (this.width < minW) return false;
    }

    return true;
  }

  /**
   * Evaluates computed dimensions for a touch element given its CSS declarations.
   */
  computeElementHitArea(cssProps, minFallback = { width: 0, height: 0 }) {
    let width = minFallback.width;
    let height = minFallback.height;

    if (cssProps.width) {
      const px = parseFloat(cssProps.width);
      if (!isNaN(px)) width = px;
    }
    if (cssProps['min-width']) {
      const px = parseFloat(cssProps['min-width']);
      if (!isNaN(px)) width = Math.max(width, px);
    }

    if (cssProps.height) {
      const px = parseFloat(cssProps.height);
      if (!isNaN(px)) height = px;
    }
    if (cssProps['min-height']) {
      const px = parseFloat(cssProps['min-height']);
      if (!isNaN(px)) height = Math.max(height, px);
    }

    // Padding contribution
    const padY = (parseFloat(cssProps['padding-top']) || 0) + (parseFloat(cssProps['padding-bottom']) || 0);
    const padX = (parseFloat(cssProps['padding-left']) || 0) + (parseFloat(cssProps['padding-right']) || 0);
    const fontPx = parseFloat(cssProps['font-size']) || 16;
    const lineHeight = parseFloat(cssProps['line-height']) || 1.5;

    if (!height && (padY || fontPx)) {
      height = fontPx * lineHeight + padY;
    }
    if (!width && padX) {
      width = padX + 24; // text placeholder
    }

    return { width, height };
  }
}
