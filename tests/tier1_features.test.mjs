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
  PROJECT_ROOT
} from './helpers/test_utils.mjs';
import { searchPortfolio, flattenResults } from '../src/lib/search.js';
import { portfolioData } from '../src/data/portfolioData.js';

const css = readProjectFile('src/index.css') || '';
const html = readProjectFile('index.html') || '';
const app = readProjectFile('src/App.jsx') || '';
const header = readProjectFile('src/components/Header.jsx') || '';
const hero = readProjectFile('src/components/CourtHero.jsx') || '';
const palette = readProjectFile('src/components/CommandPalette.jsx') || '';
const modal = readProjectFile('src/components/ResumeModal.jsx') || '';
const physics = readProjectFile('src/lib/courtPhysics.js') || '';
const mainJsx = readProjectFile('src/main.jsx') || '';
const rootVars = extractCssVariables(css, ':root');
const darkVars = extractCssVariables(css, '[data-theme="dark"]');

const px = (v) => parseFloat(v || '0');

describe('Tier 1: Feature Coverage', () => {
  describe('F01: Viewport units', () => {
    it('F01-1: body reserves min-height: 100dvh', () => {
      const body = extractCssDeclarations(css, /^body$/m);
      assert.ok(body.some((r) => r.props['min-height'] === '100dvh'));
    });

    it('F01-2: resume modal sizes with dvh, never raw vh', () => {
      const rules = extractCssDeclarations(css, '.modal-dialog');
      assert.ok(rules.length > 0);
      assert.ok(rules.some((r) => (r.props.height || '').includes('dvh')));
      for (const r of rules) {
        assert.ok(!/\b\d+vh\b/.test(r.props.height || ''), 'modal must not use vh');
      }
    });

    it('F01-3: stylesheet never uses 100vh or h-screen', () => {
      assert.ok(!/\b100vh\b/.test(css), 'found 100vh');
      assert.ok(!css.includes('h-screen'));
    });

    it('F01-4: sticky reel viewport uses dvh', () => {
      const sticky = extractCssDeclarations(css, '.reel.is-horizontal .reel-sticky');
      assert.ok(sticky.some((r) => r.props.height === '100dvh'));
    });
  });

  describe('F02: Document overflow containment', () => {
    it('F02-1: html clips horizontal overflow without creating a scroll container', () => {
      const rules = extractCssDeclarations(css, /^html$/m);
      assert.ok(rules.some((r) => r.props['overflow-x'] === 'clip'));
    });

    it('F02-2: body clips horizontal overflow (hidden would break position: sticky)', () => {
      const rules = extractCssDeclarations(css, /^body$/m);
      assert.ok(rules.some((r) => r.props['overflow-x'] === 'clip'));
      assert.ok(!rules.some((r) => r.props['overflow-x'] === 'hidden'));
    });

    it('F02-3: .container bounds width and uses gutters', () => {
      const rules = extractCssDeclarations(css, /^\.container$/m);
      assert.ok(rules.some((r) => r.props['max-width'] && r.props.padding));
    });
  });

  describe('F03: Navigation', () => {
    it('F03-1: mobile menu toggle exposes aria-expanded and aria-controls', () => {
      assert.ok(header.includes('mobile-menu-toggle'));
      assert.ok(header.includes('aria-expanded={mobileMenuOpen}'));
      assert.ok(header.includes('aria-controls="mobile-nav"'));
    });

    it('F03-2: drawer links close the menu', () => {
      assert.ok(header.includes('onClick={closeMenu}'));
    });

    it('F03-3: desktop nav hides below 1024px and the toggle appears', () => {
      const mq = extractMediaQueries(css).find((m) => m.condition.includes('max-width: 1023px') && m.body.includes('.desktop-nav'));
      assert.ok(mq, 'expected a 1023px breakpoint for the nav');
      assert.ok(mq.body.includes('.mobile-menu-toggle'));
    });

    it('F03-4: nav bar is a single row no taller than 80px', () => {
      const shell = extractCssDeclarations(css, /^\.nav-shell$/m)[0];
      assert.ok(shell);
      assert.ok(px(shell.props.height) <= 80);
      assert.ok(px(shell.props['max-height']) <= 80);
    });

    it('F03-5: header sits on the documented nav layer', () => {
      const rules = extractCssDeclarations(css, /^\.site-header$/m);
      assert.ok(rules.some((r) => r.props['z-index'] === 'var(--z-nav)'));
      assert.ok(parseInt(rootVars['--z-nav'], 10) >= 10);
    });

    it('F03-6: every nav anchor has a matching section id', () => {
      const anchors = [...header.matchAll(/href: '#([a-z-]+)'/g)].map((m) => m[1]);
      assert.ok(anchors.length >= 4);
      const components = findFiles('src/components', ['.jsx']).map((f) => readProjectFile(f)).join('\n');
      for (const id of anchors) {
        assert.ok(components.includes(`id="${id}"`), `missing section #${id}`);
      }
    });
  });

  describe('F04: Touch targets', () => {
    it('F04-1: .icon-btn is at least 44x44', () => {
      const r = extractCssDeclarations(css, /^\.icon-btn$/m)[0];
      assert.ok(px(r.props.width) >= 44 && px(r.props.height) >= 44);
    });

    it('F04-2: .btn and .btn-sm keep min-height >= 44px', () => {
      const btn = extractCssDeclarations(css, /^\.btn$/m)[0];
      const sm = extractCssDeclarations(css, /^\.btn-sm$/m)[0];
      assert.ok(px(btn.props['min-height']) >= 44);
      assert.ok(px(sm.props['min-height']) >= 44);
    });

    it('F04-3: chips grow to 44px on coarse pointers', () => {
      const mq = extractMediaQueries(css).find((m) => m.condition.includes('pointer: coarse'));
      assert.ok(mq && /\.chip[\s\S]*min-height:\s*44px/.test(mq.body));
    });

    it('F04-4: course tabs, palette options, and text links meet 44px', () => {
      for (const sel of [/^\.course-tab$/m, /^\.palette-option$/m, /^\.text-link$/m]) {
        const r = extractCssDeclarations(css, sel)[0];
        assert.ok(r, `missing ${sel}`);
        assert.ok(px(r.props['min-height']) >= 44, `${sel} too small`);
      }
    });
  });

  describe('F05: Recruiter search engine', () => {
    it('F05-1: empty or whitespace query returns nothing', () => {
      assert.equal(searchPortfolio(portfolioData, '').total, 0);
      assert.equal(searchPortfolio(portfolioData, '   ').total, 0);
    });

    it('F05-2: matching is case-insensitive', () => {
      const a = searchPortfolio(portfolioData, 'pytorch').total;
      const b = searchPortfolio(portfolioData, 'PyTorch').total;
      assert.ok(a > 0);
      assert.equal(a, b);
    });

    it('F05-3: "Rust" finds the Kalshi engine', () => {
      const r = searchPortfolio(portfolioData, 'Rust');
      assert.ok(r.projects.some((p) => p.id === 'kalshi-quant'));
    });

    it('F05-4: "Python" spans experience, projects, and coursework', () => {
      const r = searchPortfolio(portfolioData, 'Python');
      assert.ok(r.experiences.some((e) => e.id === 'lockheed-martin'));
      assert.ok(r.experiences.some((e) => e.id === 'redis'));
      assert.ok(r.projects.length > 0 && r.courses.length > 0);
    });

    it('F05-5: course codes are searchable', () => {
      const r = searchPortfolio(portfolioData, 'CSCI 335');
      assert.ok(r.courses.some((c) => c.id === 'csci-335'));
    });

    it('F05-6: flattened results keep group order and totals', () => {
      const r = searchPortfolio(portfolioData, 'Python');
      const items = flattenResults(r);
      assert.equal(items.length, r.total);
      const groups = [...new Set(items.map((i) => i.group))];
      assert.deepEqual(groups, ['Experience', 'Projects', 'Coursework']);
    });
  });

  describe('F06: Command palette', () => {
    it('F06-1: Cmd/Ctrl+K and "/" open search', () => {
      assert.ok(/e\.metaKey \|\| e\.ctrlKey/.test(app));
      assert.ok(app.includes("e.key.toLowerCase() === 'k'"));
      assert.ok(app.includes("e.key === '/'"));
    });

    it('F06-2: dialog semantics and combobox/listbox roles', () => {
      assert.ok(palette.includes('role="dialog"') && palette.includes('aria-modal="true"'));
      assert.ok(palette.includes('role="combobox"'));
      assert.ok(palette.includes('role="listbox"') && palette.includes('role="option"'));
      assert.ok(palette.includes('aria-activedescendant'));
    });

    it('F06-3: arrow keys, Enter, and Escape are handled', () => {
      for (const key of ['ArrowDown', 'ArrowUp', 'Enter', 'Escape']) {
        assert.ok(palette.includes(`'${key}'`), `missing ${key}`);
      }
    });

    it('F06-4: empty and no-match states give direction', () => {
      assert.ok(palette.includes('Try one of these'));
      assert.ok(palette.includes('Nothing matches'));
    });
  });

  describe('F07: Zero em-dashes', () => {
    it('F07-1: no em-dashes in src/', () => {
      for (const f of findFiles('src')) {
        assert.equal(findEmDashes(readProjectFile(f)).length, 0, `em-dash in ${f}`);
      }
    });

    it('F07-2: no em-dashes in index.html or README.md', () => {
      assert.equal(findEmDashes(html).length, 0);
      assert.equal(findEmDashes(readProjectFile('README.md') || '').length, 0);
    });
  });

  describe('F08: Hero discipline', () => {
    it('F08-1: value proposition is 20 words or fewer', () => {
      assert.ok(countWords(portfolioData.personal.about[0]) <= 20);
      assert.ok(hero.includes('className="hero-bio"'));
    });

    it('F08-2: hero has at most four text elements', () => {
      const textBlocks = ['hero-status', 'hero-name', 'hero-bio', 'hero-actions'].filter((c) => hero.includes(c));
      assert.equal(textBlocks.length, 4);
      assert.ok(!hero.includes('<small'), 'no tagline under the CTAs');
    });

    it('F08-3: physics canvas is decorative and lazy-loaded', () => {
      assert.ok(hero.includes('className="court-canvas" aria-hidden="true"'));
      assert.ok(hero.includes("import('matter-js')"));
      assert.ok(!/^import .*matter-js/m.test(hero), 'matter-js must not be a static import');
    });

    it('F08-4: hero top padding stays at or under 6rem plus nav', () => {
      const r = extractCssDeclarations(css, /^\.hero$/m)[0];
      assert.ok(r.props['padding-top'].includes('76px'));
      assert.ok(/clamp\([^,]+,\s*4vh,\s*3\.5rem\)/.test(r.props['padding-top']));
    });
  });

  describe('F09: Reduced motion', () => {
    it('F09-1: global reduced-motion override exists', () => {
      assert.ok(extractMediaQueries(css).some((m) => m.condition.includes('prefers-reduced-motion: reduce')));
    });

    it('F09-2: every animated component reads useReducedMotion', () => {
      for (const f of ['CourtHero', 'Header', 'ProjectReel', 'RallyTimeline', 'Magnetic', 'CommandPalette', 'ResumeModal', 'AboutBento', 'CountUp']) {
        const src = readProjectFile(`src/components/${f}.jsx`) || '';
        assert.ok(src.includes('useReducedMotion'), `${f} ignores reduced motion`);
      }
    });

    it('F09-3: physics settles off-screen and renders one static frame', () => {
      assert.ok(physics.includes('if (reduceMotion)'));
      assert.ok(/for \(let i = 0; i < \d+; i\+\+\) Engine\.update/.test(physics));
    });

    it('F09-4: smooth scrolling is skipped under reduced motion', () => {
      const s = readProjectFile('src/lib/smoothScroll.js');
      assert.ok(s.includes("matchMedia('(prefers-reduced-motion: reduce)')"));
    });
  });

  describe('F10: Court palette and contrast', () => {
    it('F10-1: brand tokens are declared', () => {
      assert.equal(rootVars['--court-cobalt'], '#2343C9');
      assert.equal(rootVars['--ball-yellow'], '#FFC93C');
    });

    it('F10-2: light theme text passes WCAG AA', () => {
      for (const fg of ['--text', '--text-2', '--text-muted', '--link']) {
        for (const bg of ['--bg', '--surface']) {
          const ratio = calculateContrastRatio(rootVars[fg], rootVars[bg]);
          assert.ok(ratio >= 4.5, `${fg} on ${bg} = ${ratio.toFixed(2)}`);
        }
      }
    });

    it('F10-3: dark theme text passes WCAG AA', () => {
      for (const fg of ['--text', '--text-2', '--text-muted', '--link']) {
        for (const bg of ['--bg', '--surface']) {
          const ratio = calculateContrastRatio(darkVars[fg], darkVars[bg]);
          assert.ok(ratio >= 4.5, `${fg} on ${bg} = ${ratio.toFixed(2)}`);
        }
      }
    });

    it('F10-4: primary buttons pass in both themes', () => {
      assert.ok(calculateContrastRatio(rootVars['--on-primary'], rootVars['--primary']) >= 4.5);
      assert.ok(calculateContrastRatio(darkVars['--on-primary'], darkVars['--primary']) >= 4.5);
      assert.ok(calculateContrastRatio(rootVars['--on-accent'], rootVars['--accent']) >= 4.5);
    });
  });

  describe('F11: Typography and icons', () => {
    it('F11-1: fonts are self-hosted, not linked from Google', () => {
      assert.ok(!html.includes('fonts.googleapis.com'));
      assert.ok(mainJsx.includes('@fontsource-variable/bricolage-grotesque'));
      assert.ok(mainJsx.includes('@fontsource-variable/geist'));
    });

    it('F11-2: Inter and Fira Code are no longer in the stack', () => {
      assert.ok(!/'Inter'|Fira Code/.test(css));
    });

    it('F11-3: components use an icon library, not hand-drawn SVG', () => {
      for (const f of findFiles('src/components', ['.jsx'])) {
        assert.ok(!readProjectFile(f).includes('<svg'), `hand-rolled svg in ${f}`);
      }
    });
  });

  describe('F12: Social metadata', () => {
    const metas = extractMetaTags(html);
    const meta = (key) => metas.find((m) => m.property === key || m.name === key)?.content;

    it('F12-1: Open Graph and Twitter card point to a real image', () => {
      assert.equal(meta('twitter:card'), 'summary_large_image');
      assert.ok(meta('og:image')?.endsWith('/og.png'));
      assert.ok(fileExists('public/og.png'));
    });

    it('F12-2: og.png is 1200x630', () => {
      const buf = fs.readFileSync(path.join(PROJECT_ROOT, 'public/og.png'));
      assert.equal(buf.readUInt32BE(16), 1200);
      assert.equal(buf.readUInt32BE(20), 630);
    });

    it('F12-3: theme-color is declared for both schemes', () => {
      assert.equal(metas.filter((m) => m.name === 'theme-color').length, 2);
    });

    it('F12-4: theme is applied before first paint', () => {
      assert.ok(html.includes("localStorage.getItem('gyan_theme')"));
      assert.ok(app.includes("localStorage.setItem('gyan_theme'"));
    });
  });

  describe('F13: Deployment config', () => {
    const vercel = JSON.parse(readProjectFile('vercel.json') || '{}');
    it('F13-1: SPA rewrite to index', () => {
      assert.ok(vercel.rewrites?.some((r) => r.destination === '/'));
    });

    it('F13-2: framing allows the same-origin resume preview', () => {
      const headers = vercel.headers.flatMap((h) => h.headers);
      assert.equal(headers.find((h) => h.key === 'X-Frame-Options')?.value, 'SAMEORIGIN');
      assert.ok(modal.includes('<iframe'));
    });
  });
});
