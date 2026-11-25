const test = require('node:test');
const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');

function read(path) {
  return readFileSync(path, 'utf8');
}

function literalRegExp(value) {
  return new RegExp(value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
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

test('Public Reviewer Gallery Manifest panel and Evidence Index table exist', () => {
  const php = read('includes/class-arcsecs-physics-engine-shortcodes.php');
  for (const token of [
    'data-arcsecs-public-reviewer-gallery-manifest',
    'Public Reviewer Gallery Manifest',
    'data-arcsecs-gallery-evidence-pack-json',
    'data-arcsecs-gallery-reviewer-notes-json',
    'data-arcsecs-add-gallery-manifest-row',
    'data-arcsecs-export-gallery-manifest-json',
    'data-arcsecs-clear-gallery-manifest',
    'data-arcsecs-evidence-index-table',
    'data-arcsecs-evidence-index-body',
    'Evidence Index rows built from local inert JSON only'
  ]) {
    assert.match(php, literalRegExp(token));
  }
});

test('Evidence Index filters and reviewer readiness summary exist', () => {
  const php = read('includes/class-arcsecs-physics-engine-shortcodes.php');
  for (const token of [
    'data-arcsecs-gallery-filter-reviewer-status',
    'data-arcsecs-gallery-filter-screenshot-suitability',
    'data-arcsecs-gallery-filter-citation-status',
    'data-arcsecs-gallery-filter-telemetry',
    'data-arcsecs-gallery-filter-source-equation',
    'data-arcsecs-reviewer-readiness-summary',
    'approved-for-demo',
    'needs-revision',
    'screenshot-ready',
    'telemetry-needed',
    'source-needed',
    'falsification-needed',
    'placeholder-needed',
    'future-research'
  ]) {
    assert.match(php, literalRegExp(token));
  }
});

test('JavaScript validates inert Evidence Pack and Reviewer Notes JSON safely', () => {
  const js = read('assets/js/arcsecs-physics-engine.js');
  for (const token of [
    'parseGalleryJson',
    'validateGalleryEvidencePack',
    'validateGalleryReviewerNotes',
    'addPublicReviewerGalleryRow',
    'Invalid JSON rejected safely',
    'It was never executed, uploaded, fetched, or stored remotely.',
    'Evidence Pack JSON exportType must be ArcSecsScenarioScreenshotEvidencePack',
    'Reviewer Notes JSON exportType must be ArcSecsReviewerNotesBundle',
    'exportContainsExecutableCode:false',
    'network probing',
    'credential validation'
  ]) {
    assert.match(js, literalRegExp(token));
  }
});

test('Gallery manifest export includes required fields and evidence row fields', () => {
  const js = read('assets/js/arcsecs-physics-engine.js');
  for (const token of [
    'buildPublicReviewerGalleryManifest',
    'ArcSecsPublicReviewerGalleryManifest',
    'manifestVersion',
    'packageVersion',
    'exportType',
    'generatedUtc',
    'pageSourceRoute',
    'evidenceRows',
    'warnings',
    'rejectedRows',
    'speculativeBoundaryText',
    'exportContainsExecutableCode: false',
    'packageVersion',
    'activeScenario',
    'scenarioLabel',
    'screenshotCaptureStatus',
    'telemetryFiniteStatus',
    'sourceMatrixRowMatch',
    'scenarioEquationLibraryRowMatch',
    'citationStatus',
    'falsificationTrigger',
    'reviewerStatus',
    'screenshotSuitability',
    'readinessScore',
    'speculativeBoundaryStatus'
  ]) {
    assert.match(js, literalRegExp(token));
  }
});

test('Reviewer readiness summary counts required buckets', () => {
  const js = read('assets/js/arcsecs-physics-engine.js');
  for (const token of [
    'buildReviewerReadinessSummary',
    'totalRows',
    'approvedForDemo',
    'needsRevision',
    'rejected',
    'screenshotReady',
    'telemetryNeeded',
    'sourceNeeded',
    'falsificationNeeded',
    'rowsMissingSpeculativeBoundaryText',
    'rowsMissingSourceEquationMatches'
  ]) {
    assert.match(js, literalRegExp(token));
  }
});

test('copy boundary preserves speculative wording and avoids forbidden claims', () => {
  const combined = read('includes/class-arcsecs-physics-engine-shortcodes.php') + '\n' + read('assets/js/arcsecs-physics-engine.js') + '\n' + read('README.md');
  assert.match(combined, /speculative research visualization/i);
  assert.match(combined, /does not establish real propulsion|does not upload files|does not certify real-world physics|not established current technology/i);
  assert.doesNotMatch(combined, /proves dark matter propulsion/i);
  assert.doesNotMatch(combined, /working propulsion system/i);
  assert.doesNotMatch(combined, /overclaim wording/i);
});

test('docs and uai memory describe v5.8.36 gallery manifest workflow', () => {
  assert.match(read('docs/public-reviewer-gallery-manifest.md'), /Public Reviewer Gallery Manifest/);
  assert.match(read('docs/evidence-index.md'), /Evidence Index/);
  assert.match(read('.uai/short-term-memory.uai'), /v5\.8\.36/);
  assert.match(read('.uai/short-term-memory.uai'), /Public Reviewer Gallery Manifest/);
  assert.match(read('.uai/short-term-memory.uai'), /Evidence Index/);
});
