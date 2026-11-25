const test = require('node:test');
const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');

function read(path) {
  return readFileSync(path, 'utf8');
}

test('package identity is v5.8.36 for Viewport Scrollbar Accessibility Fix package', () => {
  const plugin = read('arcsecs-scientific-physics-engine.php');
  const packageJson = JSON.parse(read('package.json'));
  const changelog = read('CHANGELOG.md');
  const readme = read('README.md');
  const manifest = JSON.parse(read('.uai/exports/manifest.json'));
  assert.match(plugin, /Version:\s*5\.8\.36/);
  assert.match(plugin, /ARCSECS_PHYSICS_ENGINE_VERSION', '5\.8\.36'/);
  assert.equal(packageJson.version, '5.8.36');
  assert.match(changelog, /v5\.8\.36 - Viewport Scrollbar Accessibility Fix/);
  assert.match(readme, /arcsecs\-v5\.8\.36\-public\-page\-manual\-publishing\-runbook\-post\-deploy\-verification\-package\.zip/);
  assert.equal(manifest.version, '5.8.36');
  assert.equal(manifest.latestPackage, 'arcsecs-v5.8.36-viewport-scrollbar-accessibility-fix-package.zip');
});

test('Evidence Repair Completion Ledger and Demo Readiness Gate panels exist', () => {
  const php = read('includes/class-arcsecs-physics-engine-shortcodes.php');
  assert.match(php, /data-arcsecs-scenario-screenshot-evidence-pack/);
  assert.match(php, /Scenario Screenshot Evidence Pack/);
  assert.match(php, /data-arcsecs-reviewer-notes-bundle/);
  assert.match(php, /Reviewer Notes Bundle/);
  for (const marker of [
    'data-arcsecs-capture-scenario-screenshot',
    'data-arcsecs-build-reviewer-notes-bundle',
    'data-arcsecs-export-reviewer-notes-json',
    'data-arcsecs-export-evidence-pack-json',
    'data-arcsecs-evidence-readiness-score',
    'data-arcsecs-evidence-readiness-missing',
    'data-arcsecs-reviewer-status',
    'data-arcsecs-screenshot-suitability'
  ]) {
    assert.match(php, new RegExp(marker));
  }
});

test('reviewer selectors include required statuses and screenshot suitability values', () => {
  const php = read('includes/class-arcsecs-physics-engine-shortcodes.php');
  for (const value of ['pending-review', 'approved-for-demo', 'needs-revision', 'rejected', 'not-reviewed', 'screenshot-ready', 'telemetry-needed', 'source-needed', 'falsification-needed']) {
    assert.match(php, new RegExp(value));
  }
});

test('JavaScript builds local-only evidence and notes exports with readiness scoring', () => {
  const js = read('assets/js/arcsecs-physics-engine.js');
  for (const token of [
    'buildScenarioScreenshotEvidencePack',
    'captureScenarioScreenshot',
    'buildReviewerNotesBundle',
    'buildEvidencePackReadiness',
    'renderEvidencePackPanels',
    'scenarioScreenshotEvidencePack',
    'reviewerNotesBundle',
    'latestExportDiffReview',
    'Live Scenario Audit Console summary is missing',
    'Export Diff Review summary is missing',
    'networkUploadUsed: false',
    'privatePathIncluded: false'
  ]) {
    assert.match(js, new RegExp(token.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  }
});

test('main JSON export includes scenarioScreenshotEvidencePack and reviewerNotesBundle blocks', () => {
  const js = read('assets/js/arcsecs-physics-engine.js');
  assert.match(js, /exportJson\(\)/);
  assert.match(js, /scenarioScreenshotEvidencePack/);
  assert.match(js, /reviewerNotesBundle/);
  assert.match(js, /auditValidationStatus/);
});

test('copy boundary preserves speculative wording and avoids forbidden claims', () => {
  const combined = read('includes/class-arcsecs-physics-engine-shortcodes.php') + '\n' + read('assets/js/arcsecs-physics-engine.js') + '\n' + read('README.md');
  assert.match(combined, /speculative research visualization/i);
  assert.match(combined, /does not establish real propulsion|does not establish real-world physics|does not certify real-world physics/i);
  assert.doesNotMatch(combined, /proves dark matter propulsion/i);
  assert.doesNotMatch(combined, /working propulsion system/i);
  assert.doesNotMatch(combined, /overclaim wording/i);
});

test('docs and uai memory describe v5.8.36 reviewer evidence workflow', () => {
  assert.match(read('docs/scenario-screenshot-evidence-pack.md'), /Scenario Screenshot Evidence Pack/);
  assert.match(read('docs/reviewer-notes-bundle.md'), /Reviewer Notes Bundle/);
  assert.match(read('.uai/short-term-memory.uai'), /v5\.8\.36/);
  assert.match(read('.uai/short-term-memory.uai'), /Scenario Screenshot Evidence Pack/);
  assert.match(read('.uai/short-term-memory.uai'), /Reviewer Notes Bundle/);
});
