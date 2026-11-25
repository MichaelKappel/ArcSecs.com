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

test('Public Demo Script Builder panel exists with controls filters and script status values', () => {
  const php = read('includes/class-arcsecs-physics-engine-shortcodes.php');
  for (const token of [
    'data-arcsecs-public-demo-script-builder',
    'Public Demo Script Builder',
    'data-arcsecs-build-public-demo-scripts',
    'data-arcsecs-export-selected-demo-script-json',
    'data-arcsecs-export-all-demo-scripts-json',
    'data-arcsecs-build-screenshot-caption-pack',
    'data-arcsecs-export-screenshot-caption-pack-json',
    'data-arcsecs-demo-script-filter-scenario',
    'data-arcsecs-demo-script-filter-gate-status',
    'data-arcsecs-demo-script-filter-checklist-override',
    'data-arcsecs-demo-script-filter-warning',
    'data-arcsecs-demo-script-status',
    'draft',
    'reviewer-ready',
    'needs-revision',
    'blocked',
    'rejected'
  ]) { assert.match(php, literalRegExp(token)); }
});

test('Screenshot Caption Pack panel exists with caption table and cautious copy', () => {
  const php = read('includes/class-arcsecs-physics-engine-shortcodes.php');
  for (const token of [
    'data-arcsecs-screenshot-caption-pack',
    'Screenshot Caption Pack',
    'data-arcsecs-screenshot-caption-pack-status',
    'data-arcsecs-screenshot-caption-table',
    'screenshot title',
    'telemetry caption',
    'falsification caption',
    'alt text',
    'Screenshot captions describe local visualization evidence only'
  ]) { assert.match(php, literalRegExp(token)); }
});

test('generated script rows include required public demo sections', () => {
  const js = read('assets/js/arcsecs-physics-engine.js');
  for (const token of [
    'buildPublicDemoScripts',
    'publicDemoScriptBuilder',
    'visitorIntroduction',
    'scenarioGoal',
    'standardComparison',
    'arcsecsSpeculativeChange',
    'telemetryToWatch',
    'screenshotMoment',
    'falsificationCriteria',
    'closingCaveat',
    'not proof and not operational capability',
    'Scripts are communication aids only'
  ]) { assert.match(js, literalRegExp(token)); }
});

test('caption rows include required screenshot communication fields', () => {
  const js = read('assets/js/arcsecs-physics-engine.js');
  for (const token of [
    'buildScreenshotCaptionPack',
    'screenshotCaptionPack',
    'screenshotTitle',
    'shortCaption',
    'longCaption',
    'telemetryCaption',
    'sourceEquationCaption',
    'falsificationCaption',
    'warningCaption',
    'altText',
    'speculativeBoundaryCaption',
    'simulation run, not proof of physics'
  ]) { assert.match(js, literalRegExp(token)); }
});

test('TypeScript contracts include demo scripts and screenshot captions', () => {
  const ts = read('src/types/arcsecs-space-travel-contracts.ts');
  for (const token of [
    'PublicDemoScriptBuilderExport',
    'PublicDemoScriptRow',
    'PublicDemoScriptStatus',
    'ScreenshotCaptionPackExport',
    'ScreenshotCaptionRow',
    'reviewer-ready',
    'ArcSecsPublicDemoScriptBuilder',
    'ArcSecsScreenshotCaptionPack',
    'exportContainsExecutableCode: false'
  ]) { assert.match(ts, literalRegExp(token)); }
});

test('export JSON context contains publicDemoScriptBuilder and screenshotCaptionPack', () => {
  const js = read('assets/js/arcsecs-physics-engine.js');
  assert.match(js, /publicDemoScriptBuilder/);
  assert.match(js, /screenshotCaptionPack/);
  assert.match(js, /exportContainsExecutableCode:\s*false/);
});

test('copy boundary safeguards preserve speculative wording and reject proof or established technology claims', () => {
  const combined = read('includes/class-arcsecs-physics-engine-shortcodes.php') + '\n' + read('assets/js/arcsecs-physics-engine.js') + '\n' + read('README.md');
  assert.match(combined, /speculative research visualization/i);
  assert.match(combined, /communication aids only/i);
  assert.match(combined, /Screenshots are evidence of a simulation run, not proof/i);
  assert.match(combined, /not operational capability/i);
  assert.doesNotMatch(combined, /proves dark matter propulsion/i);
  assert.doesNotMatch(combined, /working propulsion system/i);
  assert.doesNotMatch(combined, /overclaim wording/i);
});

test('docs and uai memory describe v5.8.36 demo scripts and caption pack', () => {
  assert.match(read('docs/public-demo-script-builder.md'), /Public Demo Script Builder/);
  assert.match(read('docs/screenshot-caption-pack.md'), /Screenshot Caption Pack/);
  assert.match(read('.uai/short-term-memory.uai'), /v5\.8\.36/);
  assert.match(read('.uai/short-term-memory.uai'), /Public Demo Script Builder/);
  assert.match(read('.uai/short-term-memory.uai'), /Screenshot Caption Pack/);
});
