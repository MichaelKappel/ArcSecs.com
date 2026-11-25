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

test('Public Demo Scenario Checklist panel exists with controls filters and override statuses', () => {
  const php = read('includes/class-arcsecs-physics-engine-shortcodes.php');
  for (const token of [
    'data-arcsecs-public-demo-scenario-checklist',
    'Public Demo Scenario Checklist',
    'data-arcsecs-build-public-demo-checklist',
    'data-arcsecs-export-selected-scenario-evidence-pack-json',
    'data-arcsecs-export-all-demo-evidence-packs-json',
    'data-arcsecs-demo-checklist-filter-scenario',
    'data-arcsecs-demo-checklist-filter-gate-status',
    'data-arcsecs-demo-checklist-filter-completeness',
    'data-arcsecs-demo-checklist-filter-critical',
    'data-arcsecs-demo-checklist-override-status',
    'not-reviewed',
    'ready',
    'ready-with-warnings',
    'blocked',
    'rejected'
  ]) { assert.match(php, literalRegExp(token)); }
});

test('Reviewer Evidence Export Pack panel and required export fields exist', () => {
  const php = read('includes/class-arcsecs-physics-engine-shortcodes.php');
  for (const token of [
    'data-arcsecs-reviewer-evidence-export-pack',
    'Reviewer Evidence Export Pack',
    'demoReadinessGate row',
    'evidenceRepairCompletionLedger rows',
    'evidenceRepairQueue rows',
    'reviewerSignOffSummary',
    'evidenceBundleIntegrityLabels',
    'publicReviewerGalleryManifest or evidence index row',
    'sourceMatrix row',
    'scenarioEquationLibrary row',
    'warnings',
    'falsification notes',
    'speculativeBoundaryText',
    'exportContainsExecutableCode:false'
  ]) { assert.match(php, literalRegExp(token)); }
});

test('required checklist items and inert export blocks are implemented in JavaScript', () => {
  const js = read('assets/js/arcsecs-physics-engine.js');
  for (const token of [
    'buildPublicDemoScenarioChecklist',
    'buildReviewerEvidenceExportPack',
    'publicDemoScenarioChecklist',
    'reviewerEvidenceExportPack',
    'scenario purpose is understandable',
    'speculative boundary is visible',
    'standard comparison is visible',
    'source matrix row is present',
    'equation library row is present',
    'telemetry is finite',
    'screenshot evidence exists or is explicitly not required',
    'falsification trigger is visible',
    'reviewer note exists',
    'export evidence is complete',
    'demo-ready warning copy is visible',
    'demoReadinessGate',
    'evidenceRepairCompletionLedger',
    'evidenceRepairQueue',
    'reviewerSignOffSummary',
    'evidenceBundleIntegrityLabels',
    'publicReviewerGalleryManifest',
    'sourceMatrix',
    'scenarioEquationLibrary',
    'falsificationNotes',
    'speculativeBoundaryText',
    'exportContainsExecutableCode: false'
  ]) { assert.match(js, literalRegExp(token)); }
});

test('TypeScript contracts include public demo checklist and reviewer evidence export pack', () => {
  const ts = read('src/types/arcsecs-space-travel-contracts.ts');
  for (const token of [
    'PublicDemoScenarioChecklistExport',
    'PublicDemoScenarioChecklistRow',
    'PublicDemoChecklistOverrideStatus',
    'ReviewerEvidenceExportPackCollection',
    'ReviewerEvidenceExportPackRow',
    'not-reviewed',
    'ready-with-warnings',
    'ArcSecsPublicDemoScenarioChecklist',
    'ArcSecsReviewerEvidenceExportPackCollection',
    'exportContainsExecutableCode: false'
  ]) { assert.match(ts, literalRegExp(token)); }
});

test('copy boundary safeguards preserve speculative wording and reject proof or established technology claims', () => {
  const combined = read('includes/class-arcsecs-physics-engine-shortcodes.php') + '\n' + read('assets/js/arcsecs-physics-engine.js') + '\n' + read('README.md');
  assert.match(combined, /speculative research visualization/i);
  assert.match(combined, /checklist-ready is not proof/i);
  assert.match(combined, /not operational capability/i);
  assert.match(combined, /local review artifacts/i);
  assert.doesNotMatch(combined, /proves dark matter propulsion/i);
  assert.doesNotMatch(combined, /working propulsion system/i);
  assert.doesNotMatch(combined, /overclaim wording/i);
});

test('docs and uai memory describe v5.8.36 public demo checklist reviewer evidence pack workflow', () => {
  assert.match(read('docs/public-demo-scenario-checklist.md'), /Public Demo Scenario Checklist/);
  assert.match(read('docs/reviewer-evidence-export-pack.md'), /Reviewer Evidence Export Pack/);
  assert.match(read('.uai/short-term-memory.uai'), /v5\.8\.36/);
  assert.match(read('.uai/short-term-memory.uai'), /Public Demo Scenario Checklist/);
  assert.match(read('.uai/short-term-memory.uai'), /Reviewer Evidence Export Pack/);
});
