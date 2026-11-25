const test = require('node:test');
const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');

function read(path) { return readFileSync(path, 'utf8'); }
function literalRegExp(value) { return new RegExp(value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')); }

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

test('Scenario Review Walkthrough Wizard panel and buttons exist', () => {
  const php = read('includes/class-arcsecs-physics-engine-shortcodes.php');
  for (const token of [
    'data-arcsecs-scenario-review-walkthrough-wizard',
    'Scenario Review Walkthrough Wizard',
    'data-arcsecs-start-review-walkthrough',
    'data-arcsecs-next-review-scenario',
    'data-arcsecs-previous-review-scenario',
    'data-arcsecs-export-walkthrough-json',
    'verify scenario run',
    'verify finite telemetry',
    'capture screenshot',
    'confirm source matrix row',
    'confirm equation library row',
    'confirm falsification trigger',
    'confirm speculative boundary text',
    'confirm reviewer note',
    'confirm sign-off status'
  ]) { assert.match(php, literalRegExp(token)); }
});

test('Evidence Repair Queue panel filters and local status values exist', () => {
  const php = read('includes/class-arcsecs-physics-engine-shortcodes.php');
  for (const token of [
    'data-arcsecs-evidence-repair-queue',
    'Evidence Repair Queue',
    'data-arcsecs-build-evidence-repair-queue',
    'data-arcsecs-export-repair-queue-json',
    'data-arcsecs-repair-filter-severity',
    'data-arcsecs-repair-filter-scenario',
    'data-arcsecs-repair-filter-type',
    'data-arcsecs-repair-filter-status',
    'open',
    'in-progress',
    'resolved',
    'deferred',
    'rejected'
  ]) { assert.match(php, literalRegExp(token)); }
});

test('repair item fields and recommendations are implemented', () => {
  const js = read('assets/js/arcsecs-physics-engine.js');
  for (const token of [
    'buildScenarioReviewWalkthroughWizard',
    'buildEvidenceRepairQueue',
    'mapGapToRepairType',
    'problem',
    'whyItMatters',
    'recommendedNextAction',
    'panelToUse',
    'exportToRegenerate',
    'resolvedCriteria',
    'screenshot repair',
    'telemetry repair',
    'source repair',
    'equation repair',
    'citation repair',
    'falsification repair',
    'boundary repair',
    'integrity repair',
    'sign-off repair'
  ]) { assert.match(js, literalRegExp(token)); }
});

test('exports contain walkthrough and repair queue blocks', () => {
  const js = read('assets/js/arcsecs-physics-engine.js');
  for (const token of [
    'ArcSecsScenarioReviewWalkthroughWizard',
    'ArcSecsEvidenceRepairQueue',
    'scenarioReviewWalkthroughWizard',
    'evidenceRepairQueue',
    'arcsecs-scenario-review-walkthrough.json',
    'arcsecs-evidence-repair-queue.json',
    'exportContainsExecutableCode: false'
  ]) { assert.match(js, literalRegExp(token)); }
});

test('TypeScript contracts include walkthrough and repair queue exports', () => {
  const ts = read('src/types/arcsecs-space-travel-contracts.ts');
  for (const token of [
    'ScenarioReviewWalkthroughWizardExport',
    'ScenarioReviewWalkthroughStep',
    'EvidenceRepairQueueExport',
    'EvidenceRepairQueueItem',
    'EvidenceRepairQueueStatus',
    'open',
    'in-progress',
    'resolved',
    'deferred',
    'rejected',
    'exportContainsExecutableCode: false'
  ]) { assert.match(ts, literalRegExp(token)); }
});

test('copy boundary preserves speculative wording and avoids forbidden claims', () => {
  const combined = read('includes/class-arcsecs-physics-engine-shortcodes.php') + '\n' + read('assets/js/arcsecs-physics-engine.js') + '\n' + read('README.md');
  assert.match(combined, /speculative research visualization/i);
  assert.match(combined, /does not establish real propulsion|not established current technology|does not claim established physics/i);
  assert.doesNotMatch(combined, /proves dark matter propulsion/i);
  assert.doesNotMatch(combined, /working propulsion system/i);
  assert.doesNotMatch(combined, /overclaim wording/i);
});

test('docs and uai memory describe v5.8.36 walkthrough repair workflow', () => {
  assert.match(read('docs/scenario-review-walkthrough-wizard.md'), /Scenario Review Walkthrough Wizard/);
  assert.match(read('docs/evidence-repair-queue.md'), /Evidence Repair Queue/);
  assert.match(read('.uai/short-term-memory.uai'), /v5\.8\.36/);
  assert.match(read('.uai/short-term-memory.uai'), /Scenario Review Walkthrough Wizard/);
  assert.match(read('.uai/short-term-memory.uai'), /Evidence Repair Queue/);
});
