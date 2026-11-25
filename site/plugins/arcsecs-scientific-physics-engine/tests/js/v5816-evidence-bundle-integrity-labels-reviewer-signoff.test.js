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

test('Evidence Bundle Integrity Labels panel and Integrity Review Table exist', () => {
  const php = read('includes/class-arcsecs-physics-engine-shortcodes.php');
  for (const token of [
    'data-arcsecs-evidence-bundle-integrity-labels',
    'Evidence Bundle Integrity Labels',
    'data-arcsecs-build-integrity-labels',
    'data-arcsecs-integrity-filter-status',
    'data-arcsecs-integrity-review-table',
    'data-arcsecs-integrity-review-body',
    'Integrity Review Table for local evidence rows',
    'complete',
    'warning',
    'incomplete',
    'rejected'
  ]) {
    assert.match(php, literalRegExp(token));
  }
});

test('Reviewer Sign-Off Summary panel and selector values exist', () => {
  const php = read('includes/class-arcsecs-physics-engine-shortcodes.php');
  for (const token of [
    'data-arcsecs-reviewer-signoff-summary',
    'Reviewer Sign-Off Summary',
    'data-arcsecs-signoff-reviewer',
    'data-arcsecs-signoff-status',
    'data-arcsecs-signoff-note',
    'data-arcsecs-build-signoff-summary',
    'data-arcsecs-export-signoff-summary-json',
    'pending-review',
    'approved-for-demo',
    'approved-with-warnings',
    'needs-revision',
    'rejected'
  ]) {
    assert.match(php, literalRegExp(token));
  }
});

test('local fingerprint helper exists and avoids secrets or remote validation', () => {
  const js = read('assets/js/arcsecs-physics-engine.js');
  for (const token of [
    'stableLocalFingerprint',
    'normalizeIntegrityPrimitive',
    'secret|password|token|credential|privatePath|certificate|signingKey',
    'usesSecretsSigningKeysPasswordsCertificatesAccountsOrRemoteValidation: false',
    'without secrets, signing keys, passwords, certificates, accounts, or remote validation',
    'exportContainsExecutableCode: false'
  ]) {
    assert.match(js, literalRegExp(token));
  }
});

test('export JSON contains evidenceBundleIntegrityLabels and reviewerSignOffSummary', () => {
  const js = read('assets/js/arcsecs-physics-engine.js');
  for (const token of [
    'buildEvidenceBundleIntegrityLabels',
    'ArcSecsEvidenceBundleIntegrityLabels',
    'buildReviewerSignOffSummary',
    'ArcSecsReviewerSignOffSummary',
    'evidenceBundleIntegrityLabels',
    'reviewerSignOffSummary',
    'publicReviewerGalleryManifest',
    'sourceMatrix',
    'scenarioEquationLibrary',
    'exportReviewerSignOffSummaryJson',
    'arcsecs-reviewer-signoff-summary.json'
  ]) {
    assert.match(js, literalRegExp(token));
  }
});

test('integrity status supports complete warning incomplete rejected', () => {
  const js = read('assets/js/arcsecs-physics-engine.js');
  for (const token of [
    'deriveIntegrityStatus',
    'complete',
    'warning',
    'incomplete',
    'rejected',
    'integrityStatusesSupported',
    'Integrity Review Table'
  ]) {
    assert.match(js, literalRegExp(token));
  }
});

test('TypeScript contracts include integrity labels and signoff summary', () => {
  const ts = read('src/types/arcsecs-space-travel-contracts.ts');
  for (const token of [
    'EvidenceBundleIntegrityLabel',
    'EvidenceBundleIntegrityLabelsExport',
    'ReviewerSignOffStatus',
    'ReviewerSignOffSummaryExport',
    'approved-with-warnings',
    'localFingerprint',
    'exportContainsExecutableCode: false'
  ]) {
    assert.match(ts, literalRegExp(token));
  }
});

test('copy boundary preserves speculative wording and avoids forbidden claims', () => {
  const combined = read('includes/class-arcsecs-physics-engine-shortcodes.php') + '\n' + read('assets/js/arcsecs-physics-engine.js') + '\n' + read('README.md');
  assert.match(combined, /speculative research visualization/i);
  assert.match(combined, /does not establish real propulsion|not established current technology|do not establish real propulsion/i);
  assert.doesNotMatch(combined, /proves dark matter propulsion/i);
  assert.doesNotMatch(combined, /working propulsion system/i);
  assert.doesNotMatch(combined, /overclaim wording/i);
});

test('docs and uai memory describe v5.8.36 integrity signoff workflow', () => {
  assert.match(read('docs/evidence-bundle-integrity-labels.md'), /Evidence Bundle Integrity Labels/);
  assert.match(read('docs/reviewer-sign-off-summary.md'), /Reviewer Sign-Off Summary/);
  assert.match(read('.uai/short-term-memory.uai'), /v5\.8\.36/);
  assert.match(read('.uai/short-term-memory.uai'), /Evidence Bundle Integrity Labels/);
  assert.match(read('.uai/short-term-memory.uai'), /Reviewer Sign-Off Summary/);
});
