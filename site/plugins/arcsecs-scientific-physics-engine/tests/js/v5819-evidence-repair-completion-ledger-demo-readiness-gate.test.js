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

test('Evidence Repair Completion Ledger panel exists with completion controls and statuses', () => {
  const php = read('includes/class-arcsecs-physics-engine-shortcodes.php');
  for (const token of [
    'data-arcsecs-evidence-repair-completion-ledger',
    'Evidence Repair Completion Ledger',
    'data-arcsecs-build-completion-ledger',
    'data-arcsecs-export-completion-ledger-json',
    'data-arcsecs-completion-filter-scenario',
    'data-arcsecs-completion-filter-status',
    'not-started',
    'in-progress',
    'completed',
    'completed-with-warnings',
    'deferred',
    'rejected'
  ]) { assert.match(php, literalRegExp(token)); }
});

test('Demo Readiness Gate panel exists with gate controls and statuses', () => {
  const php = read('includes/class-arcsecs-physics-engine-shortcodes.php');
  for (const token of [
    'data-arcsecs-demo-readiness-gate',
    'Demo Readiness Gate',
    'data-arcsecs-evaluate-demo-readiness-gate',
    'data-arcsecs-export-demo-readiness-gate-json',
    'data-arcsecs-demo-gate-filter-scenario',
    'data-arcsecs-demo-gate-filter-status',
    'data-arcsecs-demo-gate-filter-critical',
    'blocked',
    'needs-review',
    'demo-ready-with-warnings',
    'demo-ready',
    'not proof',
    'not operational capability'
  ]) { assert.match(php, literalRegExp(token)); }
});

test('required evidence checks and exports are implemented', () => {
  const js = read('assets/js/arcsecs-physics-engine.js');
  for (const token of [
    'buildEvidenceRepairCompletionLedger',
    'evaluateDemoReadinessGate',
    'scenarioRunExists',
    'finiteTelemetry',
    'screenshotReady',
    'sourceMatrixRowMatched',
    'equationLibraryRowMatched',
    'citationStatusAcceptable',
    'falsificationTriggerPresent',
    'speculativeBoundaryTextPresent',
    'reviewerNotePresent',
    'signOffStatusPresent',
    'integrityStatusAcceptable',
    'criticalOpenRepair',
    'evidenceRepairCompletionLedger',
    'demoReadinessGate',
    'ArcSecsEvidenceRepairCompletionLedger',
    'ArcSecsDemoReadinessGate',
    'arcsecs-evidence-repair-completion-ledger.json',
    'arcsecs-demo-readiness-gate.json',
    'exportContainsExecutableCode: false'
  ]) { assert.match(js, literalRegExp(token)); }
});

test('TypeScript contracts include completion ledger and demo readiness gate exports', () => {
  const ts = read('src/types/arcsecs-space-travel-contracts.ts');
  for (const token of [
    'EvidenceRepairCompletionLedgerExport',
    'EvidenceRepairCompletionRow',
    'EvidenceRepairCompletionStatus',
    'DemoReadinessGateExport',
    'DemoReadinessGateRow',
    'DemoReadinessGateStatus',
    'not-started',
    'completed-with-warnings',
    'blocked',
    'needs-review',
    'demo-ready-with-warnings',
    'demo-ready',
    'exportContainsExecutableCode: false'
  ]) { assert.match(ts, literalRegExp(token)); }
});

test('copy boundary safeguards reject proof and established technology claims', () => {
  const combined = read('includes/class-arcsecs-physics-engine-shortcodes.php') + '\n' + read('assets/js/arcsecs-physics-engine.js') + '\n' + read('README.md');
  assert.match(combined, /speculative research visualization/i);
  assert.match(combined, /demo-ready is not proof/i);
  assert.match(combined, /not operational capability/i);
  assert.doesNotMatch(combined, /proves dark matter propulsion/i);
  assert.doesNotMatch(combined, /working propulsion system/i);
  assert.doesNotMatch(combined, /overclaim wording/i);
});

test('docs and uai memory describe v5.8.36 completion ledger demo readiness workflow', () => {
  assert.match(read('docs/evidence-repair-completion-ledger.md'), /Evidence Repair Completion Ledger/);
  assert.match(read('docs/demo-readiness-gate.md'), /Demo Readiness Gate/);
  assert.match(read('.uai/short-term-memory.uai'), /v5\.8\.36/);
  assert.match(read('.uai/short-term-memory.uai'), /Evidence Repair Completion Ledger/);
  assert.match(read('.uai/short-term-memory.uai'), /Demo Readiness Gate/);
});
