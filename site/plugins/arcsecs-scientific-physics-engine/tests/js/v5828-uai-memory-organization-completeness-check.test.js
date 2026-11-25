const test = require('node:test');
const assert = require('node:assert/strict');
const { readFileSync, existsSync } = require('node:fs');

const read = (path) => readFileSync(path, 'utf8');
const manifest = JSON.parse(read('.uai/exports/manifest.json'));

const requiredUaiFiles = [
  '.uai/short-term-memory.uai',
  '.uai/progress.uai',
  '.uai/test-plan.uai',
  '.uai/file-handoff.uai',
  '.uai/memory.uai',
  '.uai/long-term-memory.uai',
  '.uai/export-schema.uai',
  '.uai/release-gate-evidence.uai',
  '.uai/validation-evidence.uai',
  '.uai/memory-index.uai',
  '.uai/project-map.uai',
  '.uai/architecture.uai'
];

test('package identity is v5.8.36 for complete uai memory organization completeness check package', () => {
  assert.match(read('arcsecs-scientific-physics-engine.php'), /Version:\s*5\.8\.36/);
  assert.match(read('arcsecs-scientific-physics-engine.php'), /ARCSECS_PHYSICS_ENGINE_VERSION', '5\.8\.36'/);
  assert.equal(JSON.parse(read('package.json')).version, '5.8.36');
  assert.equal(manifest.version, '5.8.36');
  assert.equal(manifest.latestPackage, 'arcsecs-v5.8.36-viewport-scrollbar-accessibility-fix-package.zip');
  assert.match(read('README.md'), /Viewport Scrollbar Accessibility Fix/);
  assert.match(read('CHANGELOG.md'), /v5\.8\.36 - Viewport Scrollbar Accessibility Fix/);
});

test('required uai memory files exist and identify current package', () => {
  for (const filePath of requiredUaiFiles) {
    assert.equal(existsSync(filePath), true, `${filePath} should exist`);
    const content = read(filePath);
    assert.match(content, /5\.8\.36|v5\.8\.36/);
    assert.match(content, /ArcSecs|uai|UAI|\.uai/);
  }
});

test('uai exports manifest is complete and safe', () => {
  assert.equal(manifest.uaiMemoryOrganizationCompletenessCheck, true);
  assert.equal(manifest.coreRuntimePhysicsChanged, false);
  assert.equal(manifest.publishingAutomationAdded, false);
  assert.equal(manifest.exportContainsExecutableCode, false);
  assert.equal(manifest.exportsAreInertJsonOnly, true);
  assert.match(manifest.boundary, /Speculative research visualization only/);
  ['sourceMatrix','scenarioEquationLibrary','staticPublishHandoffQaSummary','publicPageContentChecklist','uaiMemoryOrganizationCompletenessCheck'].forEach((name) => assert.equal(manifest.exports.includes(name), true));
  requiredUaiFiles.map((item) => item.replace('.uai/', '')).forEach((name) => assert.equal(manifest.requiredUaiFiles.includes(name), true));
});

test('uai archive and llms exports are present and current', () => {
  assert.equal(existsSync('.uai/archives/2026-06-02-arcsecs-v5828-complete-uai-memory-organization-completeness-check.md'), true);
  assert.match(read('.uai/exports/llms.txt'), /v5\.8\.36/);
  assert.match(read('.uai/exports/llms-full.txt'), /v5\.8\.36/);
  assert.match(read('.uai/exports/llms-full.txt'), /Preserved feature stack/);
  assert.equal(existsSync('.uai/exports/checksums.json'), true);
});

test('uai memory boundary rejects unsafe publication or proof claims', () => {
  const combined = requiredUaiFiles.map((filePath) => read(filePath)).join('\n') + read('docs/uai-memory-organization-completeness-check.md');
  assert.match(combined, /speculative research visualization/i);
  assert.match(combined, /not proof|Do not claim ArcSecs is proven/i);
  assert.match(combined, /does not change runtime physics|core runtime physics is unchanged/i);
  assert.doesNotMatch(combined, /working propulsion system enabled|validated technology enabled|publishing automation enabled/i);
});

test('typescript contract includes uai memory organization export', () => {
  const contracts = read('src/types/arcsecs-space-travel-contracts.ts');
  assert.match(contracts, /ArcSecsUaiMemoryOrganizationCompletenessCheckExport/);
  assert.match(contracts, /uai-memory-organization-completeness-check/);
  assert.match(contracts, /exportContainsExecutableCode:\s*false/);
});
