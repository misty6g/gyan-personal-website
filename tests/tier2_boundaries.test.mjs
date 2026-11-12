import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  readProjectFile,
  fileExists,
  findFiles,
  extractCssDeclarations,
  extractMediaQueries
} from './helpers/test_utils.mjs';
import { MockBrowser } from './helpers/mock_browser.mjs';
import { searchPortfolio } from '../src/lib/search.js';
import { portfolioData } from '../src/data/portfolioData.js';

const css = readProjectFile('src/index.css') || '';
const componentSrc = findFiles('src/components', ['.jsx']).map((f) => readProjectFile(f)).join('\n');
const allSrc = findFiles('src', ['.js', '.jsx']).map((f) => readProjectFile(f)).join('\n');

describe('Tier 2: Boundary & Corner Cases', () => {
  describe('B01: Search input edge cases', () => {
    const odd = ['((', '[', '*', '\\', '?', '$^', 'a'.repeat(500), 'ñ', '  rust  ', 'C#', 'C++'];
    for (const q of odd) {
      it(`B01: query ${JSON.stringify(q.slice(0, 12))} does not throw`, () => {
        assert.doesNotThrow(() => searchPortfolio(portfolioData, q));
      });
    }

    it('B01: padded query trims before matching', () => {
      assert.equal(searchPortfolio(portfolioData, '  rust  ').total, searchPortfolio(portfolioData, 'rust').total);
    });

    it('B01: nonsense query returns an empty result set', () => {
      assert.equal(searchPortfolio(portfolioData, 'zzqxjv').total, 0);
    });
  });

  describe('B02: Data integrity for jump targets', () => {
    it('B02: ids are unique across experience, projects, and coursework', () => {
      const ids = [...portfolioData.experiences, ...portfolioData.projects, ...portfolioData.coursework].map((x) => x.id);
      assert.equal(new Set(ids).size, ids.length);
    });

    it('B02: components render each entity id as a DOM id', () => {
      assert.ok(componentSrc.includes('id={exp.id}'));
      assert.ok(componentSrc.includes('id={project.id}'));
      assert.ok(componentSrc.includes('id={p.id}'));
      assert.ok(componentSrc.includes('id={c.id}'));
    });

    it('B02: featured project images exist and have alt text', () => {
      for (const p of portfolioData.projects.filter((x) => x.featured)) {
        assert.ok(p.image && fileExists(`public${p.image}`), `missing image for ${p.id}`);
        assert.ok(p.imageAlt && p.imageAlt.length > 10, `missing alt for ${p.id}`);
      }
    });

    it('B02: hero skill list stays small enough to settle', () => {
      const n = portfolioData.personal.heroSkills.length;
      assert.ok(n >= 8 && n <= 20, `got ${n}`);
    });
  });

  describe('B03: Responsive breakpoints', () => {
    const mqs = extractMediaQueries(css);
    for (const bp of ['1023px', '960px', '860px', '768px', '680px', '640px', '480px']) {
      it(`B03: layout responds at ${bp}`, () => {
        const exists = mqs.some((m) => m.condition.includes(bp)) || allSrc.includes(`min-width: ${bp}`);
        assert.ok(exists, `no rule at ${bp}`);
      });
    }

    for (const w of [360, 390, 768, 1024, 1440]) {
      it(`B03: nav fits one row at ${w}px`, () => {
        const browser = new MockBrowser();
        browser.setViewport(w, 800);
        const desktopNavHidden = mqs
          .filter((m) => browser.matchesMediaQuery(m.condition))
          .some((m) => /\.desktop-nav[\s\S]*display:\s*none/.test(m.body));
        assert.equal(desktopNavHidden, w < 1024);
      });
    }

    it('B03: bento collapses to one column on phones', () => {
      const mq = mqs.find((m) => m.condition.includes('680px') && m.body.includes('.bento'));
      assert.ok(mq && mq.body.includes('grid-template-columns: 1fr'));
    });

    it('B03: horizontal reel only runs on wide and tall viewports', () => {
      const reel = readProjectFile('src/components/ProjectReel.jsx');
      assert.ok(reel.includes("useMediaQuery('(min-width: 960px) and (min-height: 700px)')"));
      assert.ok(reel.includes('const horizontal = wide && !reduce'));
    });
  });

  describe('B04: Anti-template rules', () => {
    it('B04: no scroll event listeners', () => {
      assert.ok(!/addEventListener\(\s*['"]scroll['"]/.test(allSrc));
    });

    it('B04: exactly one marquee on the page', () => {
      const app = readProjectFile('src/App.jsx');
      assert.equal((app.match(/<Marquee\b/g) || []).length, 1);
    });

    it('B04: no all-caps tracked eyebrow labels', () => {
      assert.ok(!/text-transform:\s*uppercase/.test(css));
    });

    it('B04: z-index values come from the documented scale', () => {
      const raw = [...css.matchAll(/z-index:\s*([^;]+);/g)].map((m) => m[1].trim());
      for (const v of raw) {
        assert.ok(/^var\(--z-[a-z]+\)$/.test(v) || v === '-1' || v === '2', `unexpected z-index ${v}`);
      }
    });

    it('B04: one corner-radius scale', () => {
      const radii = new Set([...css.matchAll(/border-radius:\s*([^;]+);/g)].map((m) => m[1].trim()));
      const allowed = ['var(--r-panel)', 'var(--r-inner)', 'var(--r-pill)', 'inherit', '50%', '2px', '3px', '6px'];
      for (const r of radii) assert.ok(allowed.includes(r), `unexpected radius ${r}`);
    });
  });

  describe('B05: Keyboard and focus', () => {
    it('B05: global focus-visible ring is defined', () => {
      assert.ok(extractCssDeclarations(css, ':focus-visible').some((r) => r.props.outline));
    });

    it('B05: skip link targets main content', () => {
      const app = readProjectFile('src/App.jsx');
      assert.ok(app.includes('href="#main"') && app.includes('id="main"'));
    });

    it('B05: dialogs restore focus without scrolling the page', () => {
      for (const f of ['CommandPalette', 'ResumeModal']) {
        assert.ok(readProjectFile(`src/components/${f}.jsx`).includes('preventScroll: true'), f);
      }
    });
  });
});
