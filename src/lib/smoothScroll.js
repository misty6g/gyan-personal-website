let lenis = null;

export async function initSmoothScroll() {
  if (lenis || typeof window === 'undefined') return lenis;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return null;

  const { default: Lenis } = await import('lenis');
  lenis = new Lenis({
    lerp: 0.12,
    anchors: { offset: -88 },
    autoRaf: true
  });
  return lenis;
}

export function destroySmoothScroll() {
  lenis?.destroy();
  lenis = null;
}

export function scrollToY(y) {
  if (lenis) {
    lenis.scrollTo(y, { duration: 1.1 });
  } else {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: y, behavior: reduce ? 'auto' : 'smooth' });
  }
}

export function lockScroll(locked) {
  if (lenis) {
    locked ? lenis.stop() : lenis.start();
  }
  document.documentElement.style.overflow = locked ? 'hidden' : '';
  document.body.style.overflow = locked ? 'hidden' : '';
}
