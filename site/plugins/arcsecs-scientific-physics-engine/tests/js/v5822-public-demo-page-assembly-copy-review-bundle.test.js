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

test('Public Demo Page Assembly Checklist and Copy Review Bundle panels exist', () => {
  const php = read('includes/class-arcsecs-physics-engine-shortcodes.php');
  for (const token of [
    'data-arcsecs-public-demo-page-assembly-checklist',
    'Public Demo Page Assembly Checklist',
    'data-arcsecs-copy-review-bundle',
    'Copy Review Bundle',
    'data-arcsecs-build-page-assembly-checklist',
    'data-arcsecs-build-copy-review-bundle',
    'data-arcsecs-export-selected-copy-review-bundle-json',
    'data-arcsecs-export-all-copy-review-bundles-json'
  ]) { assert.match(php, literalRegExp(token)); }
});

test('copy readiness status values and assembly checklist items exist', () => {
  const combined = read('includes/class-arcsecs-physics-engine-shortcodes.php') + '\n' + read('assets/js/arcsecs-physics-engine.js');
  for (const token of [
    'draft', 'reviewer-ready', 'ready-with-warnings', 'blocked', 'rejected',
    'hero/title copy present', 'public summary present', 'script visitor introduction present',
    'standard comparison present', 'ArcSecs speculative change present', 'screenshot caption present',
    'alt text present', 'telemetry callout present', 'source/equation callout present',
    'falsification callout present', 'speculative boundary present', 'placeholder/speculative labels visible',
    'operational-capability disclaimer present', 'export evidence reference present'
  ]) { assert.match(combined, literalRegExp(token)); }
});

test('copy quality checks detect boundary falsification standard source alt proof operational and placeholder issues', () => {
  const js = read('assets/js/arcsecs-physics-engine.js');
  for (const token of [
    'detectCopyQualityWarnings', 'missing speculative boundary language', 'missing falsification language',
    'missing standard comparison language', 'missing source/equation language', 'missing screenshot alt text',
    'proof or operational-capability wording detected', 'unlabeled placeholders', 'proves',
    'real propulsion', 'operational capability', 'unsupported-claim marker'
  ]) { assert.match(js, literalRegExp(token)); }
});

test('export JSON contains publicDemoPageAssemblyChecklist and copyReviewBundle', () => {
  const js = read('assets/js/arcsecs-physics-engine.js');
  assert.match(js, /publicDemoPageAssemblyChecklist/);
  assert.match(js, /copyReviewBundle/);
  assert.match(js, /exportContainsExecutableCode:\s*false/);
});

test('TypeScript contracts include page assembly and copy review bundle exports', () => {
  const ts = read('src/types/arcsecs-space-travel-contracts.ts');
  for (const token of [
    'PublicDemoPageAssemblyChecklistExport', 'PublicDemoPageAssemblyRow',
    'PublicDemoCopyReadinessStatus', 'CopyReviewBundleExport', 'CopyReviewBundleRow',
    'ArcSecsPublicDemoPageAssemblyChecklist', 'ArcSecsCopyReviewBundle', 'exportContainsExecutableCode: false'
  ]) { assert.match(ts, literalRegExp(token)); }
});

test('copy boundary tests preserve speculative wording and reject proof or established technology claims', () => {
  const combined = read('includes/class-arcsecs-physics-engine-shortcodes.php') + '\n' + read('assets/js/arcsecs-physics-engine.js') + '\n' + read('README.md');
  assert.match(combined, /speculative research visualization/i);
  assert.match(combined, /not proof/i);
  assert.match(combined, /not operational capability/i);
  assert.doesNotMatch(combined, /proves dark matter propulsion/i);
  assert.doesNotMatch(combined, /working propulsion system/i);
  assert.doesNotMatch(combined, /unsupported-claim marker is established/i);
});

test('docs and uai memory describe v5.8.36 page assembly and copy review bundle', () => {
  assert.match(read('docs/public-demo-page-assembly-checklist.md'), /Public Demo Page Assembly Checklist/);
  assert.match(read('docs/copy-review-bundle.md'), /Copy Review Bundle/);
  assert.match(read('.uai/short-term-memory.uai'), /v5\.8\.36/);
  assert.match(read('.uai/short-term-memory.uai'), /Public Demo Page Assembly Checklist/);
  assert.match(read('.uai/short-term-memory.uai'), /Copy Review Bundle/);
});
