#!/usr/bin/env node

import { spawn } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.resolve(__dirname, '..');

const TIERS = [
  {
    id: 'tier1',
    name: 'Tier 1: Feature Coverage (F01 - F19)',
    file: path.resolve(__dirname, 'tier1_features.test.mjs'),
  },
  {
    id: 'tier2',
    name: 'Tier 2: Boundary & Corner Cases',
    file: path.resolve(__dirname, 'tier2_boundaries.test.mjs'),
  },
  {
    id: 'tier3',
    name: 'Tier 3: Cross-Feature Combinations',
    file: path.resolve(__dirname, 'tier3_combinations.test.mjs'),
  },
  {
    id: 'tier4',
    name: 'Tier 4: Real-World Application Scenarios',
    file: path.resolve(__dirname, 'tier4_scenarios.test.mjs'),
  },
];

async function runTier(tier) {
  return new Promise((resolve) => {
    const startTime = Date.now();
    const child = spawn('node', ['--test', tier.file], {
      cwd: PROJECT_ROOT,
      stdio: ['inherit', 'pipe', 'pipe'],
      env: { ...process.env, FORCE_COLOR: '1' },
    });

    let stdout = '';
    let stderr = '';

    child.stdout.on('data', (data) => {
      stdout += data.toString();
    });

    child.stderr.on('data', (data) => {
      stderr += data.toString();
    });

    child.on('close', (code) => {
      const duration = Date.now() - startTime;
      // Parse node:test output
      const testsMatch = stdout.match(/ℹ\s+tests\s+(\d+)/);
      const passMatch = stdout.match(/ℹ\s+pass\s+(\d+)/);
      const failMatch = stdout.match(/ℹ\s+fail\s+(\d+)/);

      const tests = testsMatch ? parseInt(testsMatch[1], 10) : 0;
      const pass = passMatch ? parseInt(passMatch[1], 10) : 0;
      const fail = failMatch ? parseInt(failMatch[1], 10) : (code === 0 ? 0 : 1);

      // Extract failed test names
      const failureLines = [];
      const failRegex = /✖\s+([^\n(]+)/g;
      let m;
      while ((m = failRegex.exec(stdout)) !== null) {
        const item = m[1].trim();
        if (!item.startsWith('Tier ') && !item.startsWith('Scenario ') && !item.startsWith('Combination ')) {
          failureLines.push(item);
        }
      }

      resolve({
        tier,
        code,
        duration,
        tests,
        pass,
        fail,
        failures: failureLines,
        rawOutput: stdout,
        stderr,
      });
    });
  });
}

async function main() {
  const args = process.argv.slice(2);
  const selectedTierArg = args.find((a) => a.startsWith('--tier=') || a.startsWith('-t='));
  let selectedTiers = TIERS;

  if (selectedTierArg) {
    const val = selectedTierArg.split('=')[1];
    selectedTiers = TIERS.filter((t) => t.id.includes(val) || t.name.toLowerCase().includes(val.toLowerCase()));
  }

  console.log('\n' + '='.repeat(78));
  console.log('       GYAN MISTRY PORTFOLIO - E2E REQUIREMENT TEST RUNNER       ');
  console.log('='.repeat(78));
  console.log(`Executing ${selectedTiers.length} Test Tiers...\n`);

  const results = [];
  let totalTests = 0;
  let totalPass = 0;
  let totalFail = 0;
  let totalDuration = 0;

  for (const tier of selectedTiers) {
    process.stdout.write(`▶ Running ${tier.name}... `);
    const res = await runTier(tier);
    results.push(res);
    totalTests += res.tests;
    totalPass += res.pass;
    totalFail += res.fail;
    totalDuration += res.duration;

    if (res.fail === 0 && res.code === 0) {
      console.log(`\x1b[32mPASS\x1b[0m (${res.pass}/${res.tests} passed, ${res.duration}ms)`);
    } else {
      console.log(`\x1b[31mFAIL\x1b[0m (${res.pass} passed, ${res.fail} failed, ${res.duration}ms)`);
    }
  }

  console.log('\n' + '-'.repeat(78));
  console.log('                           TIER SUMMARY                           ');
  console.log('-'.repeat(78));

  for (const r of results) {
    const status = r.fail === 0 && r.code === 0 ? '\x1b[32mPASS\x1b[0m' : '\x1b[31mFAIL\x1b[0m';
    const rate = r.tests > 0 ? ((r.pass / r.tests) * 100).toFixed(1) : '0.0';
    console.log(
      `${r.tier.name.padEnd(46)} | ${status} | Pass: ${String(r.pass).padStart(3)} / ${String(r.tests).padStart(3)} (${rate.padStart(5)}%) | ${r.duration}ms`
    );
  }

  console.log('-'.repeat(78));
  const overallRate = totalTests > 0 ? ((totalPass / totalTests) * 100).toFixed(1) : '0.0';
  console.log(
    `TOTALS: ${totalPass} passed, ${totalFail} failed, ${totalTests} total (${overallRate}%) in ${totalDuration}ms\n`
  );

  if (totalFail > 0) {
    console.log('='.repeat(78));
    console.log('                       ACTIONABLE DEFICIENCIES                    ');
    console.log('='.repeat(78));
    for (const r of results) {
      if (r.failures.length > 0) {
        console.log(`\n[\x1b[1m${r.tier.name}\x1b[0m] Failures:`);
        for (const f of r.failures.slice(0, 10)) {
          console.log(`  ✖ ${f}`);
        }
        if (r.failures.length > 10) {
          console.log(`  ... and ${r.failures.length - 10} more in ${r.tier.id}`);
        }
      }
    }
    console.log('\n' + '='.repeat(78));
  }

  // Check if --allow-failure or --baseline is passed
  if (args.includes('--allow-failure') || args.includes('--baseline')) {
    console.log('\n[INFO] --baseline flag active: Exiting 0 for baseline capture.');
    process.exit(0);
  }

  if (totalFail > 0) {
    process.exit(1);
  } else {
    console.log('\n\x1b[32m✔ All E2E requirements satisfied successfully!\x1b[0m\n');
    process.exit(0);
  }
}

main().catch((err) => {
  console.error('Fatal test runner error:', err);
  process.exit(1);
});
