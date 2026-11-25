const test = require('node:test');
const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');

function read(path) {
  return readFileSync(path, 'utf8');
}

const scenarioLabels = [
  'Distance-Time Kernel',
  'Relational Lattice',
  'Tired-Light Photon Energy Ledger',
  'Massive Photon / Proca Dispersion',
  'Flat-Space Lensing',
  'Massive Photon Lensing',
  'MOND Rotation Curves',
  'Parallax Calibration',
  'Dark Matter Ramjet',
  'Multi-Messenger Events'
];

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

test('Live Scenario Audit Console render shell and reviewer buttons exist', () => {
  const php = read('includes/class-arcsecs-physics-engine-shortcodes.php');
  assert.match(php, /data-arcsecs-live-scenario-audit-console/);
  assert.match(php, /Live Scenario Audit Console/);
  assert.match(php, /Audit Current Scenario/);
  assert.match(php, /Copy Audit Summary/);
  assert.match(php, /Export Audit Console JSON/);
  for (const label of scenarioLabels) {
    assert.match(php, new RegExp(label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  }
  for (const field of ['Source matrix row match', 'Equation library row match', 'Standard expectation', 'ArcSecs alternative assumption', 'Normalized controls', 'Derived telemetry', 'Export evidence readiness', 'Falsification trigger', 'Citation status', 'Telemetry finite']) {
    assert.match(php, new RegExp(field.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  }
});

test('Export Diff Review render shell accepts two inert JSON textareas', () => {
  const php = read('includes/class-arcsecs-physics-engine-shortcodes.php');
  assert.match(php, /data-arcsecs-export-diff-review/);
  assert.match(php, /Export Diff Review/);
  assert.match(php, /data-arcsecs-export-diff-json-a/);
  assert.match(php, /data-arcsecs-export-diff-json-b/);
  assert.match(php, /Compare Exports/);
  assert.match(php, /never executed/);
});

test('audit console JavaScript validates source matrix and equation library rows', () => {
  const js = read('assets/js/arcsecs-physics-engine.js');
  assert.match(js, /function validateScientificSourceMatrixExport/);
  assert.match(js, /function validateScenarioEquationLibraryExport/);
  for (const field of ['matrixVersion', 'libraryVersion', 'scenario', 'standardExpectation', 'arcsecsAlternativeAssumption', 'derivedTelemetry', 'exportEvidence', 'falsificationTrigger', 'citationStatus', 'formula', 'formulaKind', 'units', 'controlledInputs', 'exportedEvidence', 'placeholderStatus']) {
    assert.match(js, new RegExp(field));
  }
  assert.match(js, /sourceMatrixValidation/);
  assert.match(js, /scenarioEquationLibraryValidation/);
});

test('export diff review rejects invalid or incomplete inert JSON safely', () => {
  const js = read('assets/js/arcsecs-physics-engine.js');
  assert.match(js, /parseInertArcsecsExport/);
  assert.match(js, /is not valid JSON/);
  assert.match(js, /missing sourceMatrix/);
  assert.match(js, /missing scenarioEquationLibrary/);
  assert.match(js, /Export diff rejected safely/);
  assert.match(js, /never executes imported content|never execute imported content|never executed/);
});

test('export diff review compares required top-level fields', () => {
  const js = read('assets/js/arcsecs-physics-engine.js');
  for (const field of ['packageVersion', 'exportType', 'generatedUtc', 'activeScenario', 'parameters', 'telemetry', 'warnings', 'falsificationNotes', 'sourceMatrix', 'scenarioEquationLibrary']) {
    assert.match(js, new RegExp(field));
  }
  for (const status of ['added', 'removed', 'changed', 'unchanged', 'missing']) {
    assert.match(js, new RegExp(status));
  }
});

test('copy boundary remains cautious for audit and diff features', () => {
  const php = read('includes/class-arcsecs-physics-engine-shortcodes.php');
  const js = read('assets/js/arcsecs-physics-engine.js');
  const combined = php + '\n' + js;
  assert.match(combined, /speculative research visualization/i);
  assert.match(combined, /does not establish real propulsion|not established current technology|No established dark matter propulsion/i);
  assert.doesNotMatch(combined, /proves dark matter propulsion/i);
  assert.doesNotMatch(combined, /working propulsion system/i);
  assert.doesNotMatch(combined, /overclaim wording/i);
});

test('v5.8.36 docs and uai memory describe audit console export diff package', () => {
  const auditDoc = read('docs/live-scenario-audit-console.md');
  const diffDoc = read('docs/export-diff-review.md');
  const shortTerm = read('.uai/short-term-memory.uai');
  assert.match(auditDoc, /Live Scenario Audit Console/);
  assert.match(diffDoc, /Export Diff Review/);
  assert.match(shortTerm, /v5\.8\.36/);
  assert.match(shortTerm, /Live Scenario Audit Console/);
  assert.match(shortTerm, /Export Diff Review/);
});
