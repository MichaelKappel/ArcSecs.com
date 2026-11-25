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

test('Review Bundle Import Reconciliation panel and inert JSON inputs exist', () => {
  const php = read('includes/class-arcsecs-physics-engine-shortcodes.php');
  for (const token of [
    'data-arcsecs-review-bundle-reconciliation',
    'Review Bundle Import Reconciliation',
    'data-arcsecs-reconciliation-gallery-json',
    'data-arcsecs-reconciliation-integrity-json',
    'data-arcsecs-reconciliation-signoff-json',
    'data-arcsecs-reconcile-review-bundle',
    'data-arcsecs-export-reconciliation-json',
    'data-arcsecs-clear-reconciliation-inputs',
    'never executes imported content',
    'never uploads',
    'never fetches'
  ]) { assert.match(php, literalRegExp(token)); }
});

test('reconciliation checks include required comparison fields', () => {
  const js = read('assets/js/arcsecs-physics-engine.js');
  for (const token of [
    'parseReconciliationJson',
    'validateReconciliationImport',
    'normalizeReconciliationRows',
    'packageVersion mismatch',
    'local fingerprint mismatch',
    'reviewer status mismatch',
    'speculative boundary missing',
    'source/equation match missing',
    'matchedRows',
    'mismatchedRows',
    'missingRows',
    'staleRows',
    'rejectedRows'
  ]) { assert.match(js, literalRegExp(token)); }
});

test('Evidence Gap Assistant exists and detects required gaps', () => {
  const php = read('includes/class-arcsecs-physics-engine-shortcodes.php');
  const js = read('assets/js/arcsecs-physics-engine.js');
  assert.match(php, /data-arcsecs-evidence-gap-assistant/);
  assert.match(php, /data-arcsecs-gap-filter-severity/);
  assert.match(php, /data-arcsecs-gap-filter-scenario/);
  for (const token of [
    'buildEvidenceGapForRow',
    'missing screenshot capture',
    'missing or non-finite telemetry',
    'missing source matrix match',
    'missing equation library match',
    'citation status not complete',
    'missing falsification trigger',
    'missing speculative boundary text',
    'approved row conflicts with integrity status',
    'sign-off conflict',
    'recommendedNextAction'
  ]) { assert.match(js, literalRegExp(token)); }
});

test('reconciliation export contains required inert fields', () => {
  const js = read('assets/js/arcsecs-physics-engine.js');
  for (const token of [
    'ArcSecsReviewBundleReconciliation',
    'reconciliationVersion',
    'evidenceGaps',
    'recommendedNextActions',
    'exportContainsExecutableCode: false',
    'reviewBundleReconciliation',
    'arcsecs-review-bundle-reconciliation.json'
  ]) { assert.match(js, literalRegExp(token)); }
});

test('TypeScript contracts include reconciliation exports and gap rows', () => {
  const ts = read('src/types/arcsecs-space-travel-contracts.ts');
  for (const token of [
    'ReviewBundleReconciliationExport',
    'ReviewBundleReconciliationRow',
    'EvidenceGapAssistantRow',
    'ReviewBundleReconciliationState',
    'matched',
    'mismatched',
    'missing',
    'stale',
    'rejected',
    'recommendedNextAction',
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

test('docs and uai memory describe v5.8.36 reconciliation workflow', () => {
  assert.match(read('docs/review-bundle-import-reconciliation.md'), /Review Bundle Import Reconciliation/);
  assert.match(read('docs/evidence-gap-assistant.md'), /Evidence Gap Assistant/);
  assert.match(read('.uai/short-term-memory.uai'), /v5\.8\.36/);
  assert.match(read('.uai/short-term-memory.uai'), /Review Bundle Import Reconciliation/);
  assert.match(read('.uai/short-term-memory.uai'), /Evidence Gap Assistant/);
});
