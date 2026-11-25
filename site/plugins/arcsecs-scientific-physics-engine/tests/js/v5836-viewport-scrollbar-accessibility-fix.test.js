const test = require('node:test');
const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');

const read = (path) => readFileSync(path, 'utf8');
const plugin = read('arcsecs-scientific-physics-engine.php');
const css = read('assets/css/arcsecs-physics-engine.css');
const ts = read('src/types/arcsecs-space-travel-contracts.ts');
const manifest = JSON.parse(read('.uai/exports/manifest.json'));

test('package identity is v5.8.36 viewport scrollbar accessibility fix package', () => {
  assert.match(plugin, /Version:\s*5\.8\.36/);
  assert.match(plugin, /ARCSECS_PHYSICS_ENGINE_VERSION', '5\.8\.36'/);
  assert.equal(JSON.parse(read('package.json')).version, '5.8.36');
  assert.equal(manifest.packageVersion, '5.8.36');
  assert.equal(manifest.latestPackage, 'arcsecs-v5.8.36-viewport-scrollbar-accessibility-fix-package.zip');
  assert.equal(manifest.viewportScrollbarAccessibilityFix, true);
});

test('fullscreen body allows vertical scrolling and avoids horizontal overflow', () => {
  assert.match(css, /body\.arcsecs-fullscreen-demo\s*\{[\s\S]*overflow-x:\s*hidden;/);
  assert.match(css, /body\.arcsecs-fullscreen-demo\s*\{[\s\S]*overflow-y:\s*auto;/);
  assert.doesNotMatch(css, /body\.arcsecs-fullscreen-demo\s*\{[\s\S]{0,120}overflow:\s*hidden;/);
  assert.match(css, /scrollbar-gutter:\s*stable/);
  assert.match(css, /scrollbar-color:\s*#68e7ff #020711/);
});

test('physics demo shell no longer traps vertical page content', () => {
  assert.match(css, /\.arcsecs-physics-demo\s*\{[\s\S]*overflow-x:\s*hidden;/);
  assert.match(css, /\.arcsecs-physics-demo\s*\{[\s\S]*overflow-y:\s*visible;/);
  assert.match(css, /\.arcsecs-fullscreen-template\s*\{[\s\S]*overflow-y:\s*visible;/);
  assert.match(css, /width:\s*100%;\s*\n\s*max-width:\s*100vw;/);
});

test('short-height viewport rules keep lower panels reachable', () => {
  assert.match(css, /@media \(max-height:\s*760px\)/);
  assert.match(css, /\.arcsecs-demo-grid\s*\{[\s\S]*height:\s*auto;/);
  assert.match(css, /minmax\(360px,\s*58svh\)/);
  assert.match(css, /@media \(max-height:\s*640px\)/);
  assert.match(css, /padding-bottom:\s*24px/);
});

test('metadata docs and uai describe scroll reachability without physics changes', () => {
  assert.match(ts, /ArcSecsViewportScrollbarAccessibilityFixMetadata/);
  assert.match(read('docs/viewport-scrollbar-accessibility-fix.md'), /overflow-y: auto/);
  assert.match(read('.uai/short-term-memory.uai'), /Viewport Scrollbar Accessibility Fix/);
  assert.match(read('.uai/exports/llms-full.txt'), /overflow-y:auto/);
  assert.equal(manifest.coreRuntimePhysicsChanged, false);
  assert.equal(manifest.publishingAutomationAdded, false);
  assert.equal(manifest.exportContainsExecutableCode, false);
});
