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

test('physics engine demo includes visitor physicist engineer modes and comparison panels', () => {
  const php = read('includes/class-arcsecs-physics-engine-shortcodes.php');
  assert.match(php, /Visitor Mode/);
  assert.match(php, /Physicist Mode/);
  assert.match(php, /Engineer Mode/);
  assert.match(php, /data-arcsecs-scenario-cards/);
  assert.match(php, /data-arcsecs-standard-comparison/);
  assert.match(php, /data-arcsecs-assumptions-equations/);
  assert.match(php, /data-arcsecs-evidence-falsification/);
  assert.match(php, /data-arcsecs-source-reference-panel/);
});

test('space travel page has onboarding grouped telemetry and replay validation guidance', () => {
  const php = read('includes/class-arcsecs-physics-engine-shortcodes.php');
  assert.match(php, /data-arcsecs-space-onboarding/);
  assert.match(php, /Default objective path/);
  assert.match(php, /data-arcsecs-space-telemetry-groups/);
  assert.match(php, /schema version/);
  assert.match(php, /route frames/);
});

test('dark matter drive page separates reality controls placeholders and hotspots', () => {
  const php = read('includes/class-arcsecs-physics-engine-shortcodes.php');
  assert.match(php, /data-arcsecs-drive-what-is-real/);
  assert.match(php, /data-arcsecs-drive-control-taxonomy/);
  assert.match(php, /data-arcsecs-drive-hotspot-explanations/);
  for (const label of ['HIBE Forward Deflector Array', 'EIT Ramscoop / Dark Matter Intake', 'Fishback Solenoid Intake Array', 'MQN Core', 'Reaction Chamber / Energy Conversion Core', 'Capture Layer', 'Propulsion Output Vector', 'Tired-Light Energy Ledger', 'Massive Photon / Lensing Comparison', 'Absolute-Time Oscillator Check']) {
    assert.match(php, new RegExp(label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  }
});

test('copy boundary remains cautious and forbidden proof claims are absent from new public panels', () => {
  const php = read('includes/class-arcsecs-physics-engine-shortcodes.php');
  assert.match(php, /Speculative research visualization/);
  assert.match(php, /not established current technology/);
  assert.doesNotMatch(php, /proves dark matter propulsion/i);
  assert.doesNotMatch(php, /working propulsion system/i);
  assert.doesNotMatch(php, /overclaim wording/i);
});

test('space travel export and replay validation include requested schema fields', () => {
  const js = read('assets/js/arcsecs-space-travel-simulation.js');
  for (const key of ['packageVersion', 'pageSourceRoute', 'activeScenario', 'guidedDemo', 'viewportScale', 'simulatedHoursPerTick', 'beaconDistanceScale', 'densityStrength', 'speedCompression', 'fuel', 'thermalLoad', 'torsionPull', 'weberDrag', 'procaDensity', 'photonLag', 'gravityArrival', 'photonArrival', 'photonDelay', 'photonEnergy', 'refractiveIndex', 'visibilityStatus', 'objectiveStatus', 'evidenceLedger', 'warnings', 'falsificationNotes', 'readinessSweep']) {
    assert.match(js, new RegExp(key));
  }
  for (const validation of ['pluginVersion or packageVersion is required', 'scenarioName or activeScenario is required', 'UTC timestamp is required', 'telemetry fields are required', 'missionOutcome is required']) {
    assert.match(js, new RegExp(validation));
  }
});

test('dark matter drive exports include identity warnings and falsification notes', () => {
  const js = read('assets/js/arcsecs-dark-matter-drive-simulator.js');
  assert.match(js, /ArcSecsDarkMatterDriveArchitectureSweep/);
  assert.match(js, /ArcSecsDarkMatterDriveSimulatorEvidence/);
  assert.match(js, /pageSourceRoute/);
  assert.match(js, /falsificationNotes/);
  assert.match(js, /warnings/);
});


test('v5.8.36 scientific source matrix covers all major requested scenarios', () => {
  const php = read('includes/class-arcsecs-physics-engine-shortcodes.php');
  assert.match(php, /data-arcsecs-scientific-source-matrix/);
  for (const label of ['Distance-Time Kernel', 'Relational Lattice', 'Tired-Light Photon Energy Ledger', 'Massive Photon / Proca Dispersion', 'Flat-Space Lensing', 'Massive Photon Lensing', 'MOND Rotation Curves', 'Parallax Calibration', 'Dark Matter Ramjet', 'Multi-Messenger Events']) {
    assert.match(php, new RegExp(label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  }
  for (const field of ['Source / reference note', 'Standard expectation', 'ArcSecs alternative assumption', 'Normalized parameter', 'Derived telemetry', 'Export evidence', 'Falsification trigger', 'Citation status']) {
    assert.match(php, new RegExp(field.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  }
});

test('v5.8.36 scenario equation library labels pseudo formulas units and export evidence', () => {
  const php = read('includes/class-arcsecs-physics-engine-shortcodes.php');
  assert.match(php, /data-arcsecs-scenario-equation-library/);
  for (const label of ['Photon Delay', 'Ledger Closure', 'Dispersion Proxy', 'Deflection Residual', 'distance(parsec)', 'Route Risk', 'Delay Budget']) {
    assert.equal(php.includes(label), true);
  }
  assert.match(php, /pseudo-formula/);
  assert.match(php, /normalized model proxies/);
  assert.match(php, /Controlled:/);
  assert.match(php, /Derived:/);
  assert.match(php, /Weakens if:/);
});

test('v5.8.36 inert exports include sourceMatrix and scenarioEquationLibrary', () => {
  const physics = read('assets/js/arcsecs-physics-engine.js');
  const space = read('assets/js/arcsecs-space-travel-simulation.js');
  const drive = read('assets/js/arcsecs-dark-matter-drive-simulator.js');
  for (const source of [physics, space, drive]) {
    assert.match(source, /sourceMatrix/);
    assert.match(source, /scenarioEquationLibrary/);
    assert.match(source, /citationStatus/);
    assert.match(source, /standardExpectation/);
    assert.match(source, /arcsecsAlternativeAssumption/);
    assert.match(source, /falsificationTrigger/);
    assert.match(source, /formulaKind/);
    assert.match(source, /precisionBoundary/);
  }
});

test('v5.8.36 docs and uai memory reference source matrix equation library package', () => {
  const sourceMatrixDoc = read('docs/scientific-source-matrix.md');
  const equationDoc = read('docs/scenario-equation-library.md');
  const shortTerm = read('.uai/short-term-memory.uai');
  const manifest = JSON.parse(read('.uai/exports/manifest.json'));
  assert.match(sourceMatrixDoc, /Scientific Source Matrix/);
  assert.match(equationDoc, /Scenario Equation Library/);
  assert.match(shortTerm, /v5\.8\.36/);
  assert.equal(manifest.version, '5.8.36');
  assert.equal(manifest.latestPackage, 'arcsecs-v5.8.36-viewport-scrollbar-accessibility-fix-package.zip');
});
