import { describe, it, before } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { readProjectFile, fileExists, PROJECT_ROOT } from './helpers/test_utils.mjs';
import { searchPortfolio, flattenResults } from '../src/lib/search.js';
import { portfolioData } from '../src/data/portfolioData.js';

describe('Tier 4: Real-World Scenarios', () => {
  describe('S01: Recruiter looks for a Python ML intern', () => {
    it('S01-1: palette lists both internships for "Python"', () => {
      const items = flattenResults(searchPortfolio(portfolioData, 'Python'));
      const companies = items.filter((i) => i.group === 'Experience').map((i) => i.title);
      assert.ok(companies.includes('Lockheed Martin') && companies.includes('Redis'));
    });

    it('S01-2: headline metrics come from real bullet points', () => {
      const redis = portfolioData.experiences.find((e) => e.id === 'redis');
      assert.ok(redis.bullets.some((b) => b.includes('95%')));
      assert.ok(redis.bullets.some((b) => b.includes('4,000+')));
      assert.ok(redis.metrics.some((m) => m.value === 95));
    });

    it('S01-3: resume is downloadable and previewable', () => {
      assert.ok(fileExists('public/resume.pdf'));
      const modal = readProjectFile('src/components/ResumeModal.jsx');
      assert.ok(modal.includes('download="Gyan_Mistry_Resume.pdf"'));
    });
  });

  describe('S02: Engineer shares the site on X', () => {
    it('S02-1: link preview image and copy are present', () => {
      const html = readProjectFile('index.html');
      assert.ok(html.includes('twitter:image') && html.includes('og:description'));
    });

    it('S02-2: contact section offers mailto and copy', () => {
      const contact = readProjectFile('src/components/Contact.jsx');
      assert.ok(contact.includes('href={`mailto:${personal.email}`}'));
      assert.ok(contact.includes('<CopyEmailButton'));
    });
  });

  describe('S03: Production build', () => {
    let result;
    before(() => {
      result = spawnSync('npx', ['vite', 'build', '--logLevel', 'error'], { cwd: PROJECT_ROOT, encoding: 'utf8' });
    });

    it('S03-1: vite build exits cleanly', () => {
      assert.equal(result.status, 0, result.stderr);
    });

    it('S03-2: matter-js and lenis ship as separate lazy chunks', () => {
      const assets = fs.readdirSync(path.join(PROJECT_ROOT, 'dist/assets'));
      assert.ok(assets.some((f) => /^matter-.*\.js$/.test(f)), 'matter chunk missing');
      assert.ok(assets.some((f) => /^lenis-.*\.js$/.test(f)), 'lenis chunk missing');
    });

    it('S03-3: built HTML has no third-party font requests', () => {
      const built = readProjectFile('dist/index.html');
      assert.ok(built && !built.includes('fonts.googleapis.com'));
    });

    it('S03-4: static assets are copied to dist', () => {
      for (const f of ['og.png', 'resume.pdf', 'img/project-orbit.jpg', 'img/project-asl.jpg', 'img/project-kalshi.jpg', 'img/volleyball-spike.jpg']) {
        assert.ok(fileExists(`dist/${f}`), `dist/${f} missing`);
      }
    });
  });
});
