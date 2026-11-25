const test = require('node:test');
const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');

const read = (path) => readFileSync(path, 'utf8');
const plugin = read('arcsecs-scientific-physics-engine.php');
const shortcode = read('includes/class-arcsecs-physics-engine-shortcodes.php');
const script = read('assets/js/arcsecs-physics-engine.js');
const contracts = read('src/types/arcsecs-space-travel-contracts.ts');

test('package identity is v5.8.36 for static draft review import page readiness diff package', () => {
  assert.match(plugin, /Version:\s*5\.8\.36/);
  assert.match(plugin, /ARCSECS_PHYSICS_ENGINE_VERSION', '5\.8\.36'/);
  assert.equal(JSON.parse(read('package.json')).version, '5.8.36');
  assert.match(read('CHANGELOG.md'), /v5\.8\.36 - Viewport Scrollbar Accessibility Fix/);
});

test('Viewport Scrollbar Accessibility Fix panels exist', () => {
  ['data-arcsecs-static-draft-review-import', 'Static Draft Review Import', 'data-arcsecs-page-readiness-diff', 'Page Readiness Diff'].forEach((needle) => assert.match(shortcode, new RegExp(needle.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))));
});

test('import controls and diff review status values exist', () => {
  ['data-arcsecs-import-static-draft-review-json','data-arcsecs-build-page-readiness-diff','data-arcsecs-export-page-readiness-diff-json','data-arcsecs-clear-static-draft-review-imports','data-arcsecs-static-page-draft-import-json','data-arcsecs-publication-handoff-import-json'].forEach((needle) => assert.match(shortcode, new RegExp(needle)));
  ['not-reviewed','reviewer-ready','ready-with-warnings','needs-revision','blocked','rejected'].forEach((value) => assert.match(shortcode, new RegExp(`<option value="${value}">${value}</option>`)));
});

test('invalid JSON and executable-looking content are rejected visibly', () => {
  ['parseInertStaticDraftJson','invalid JSON','executable-looking content','<script','javascript:','onerror=','eval(','new function','import(','require(','exportContainsExecutableCode:true'].forEach((needle) => assert.match(script, new RegExp(needle.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))));
});

test('diff rows compare required static page draft fields', () => {
  ['suggestedSlug','suggestedPageTitle','suggestedMetaTitle','suggestedMetaDescription','suggestedCanonicalNote','suggestedHeroTitle','suggestedIntroParagraph','suggestedDemoScriptSections','suggestedScreenshotCaption','suggestedAltText','suggestedTelemetryCallout','suggestedSourceEquationCallout','suggestedFalsificationCallout','suggestedBoundaryCopy','suggestedSchemaReview','suggestedInternalLinkTextRows','reviewerEvidenceExportPackRow','sourceMatrixRow','scenarioEquationLibraryRow','routeWarnings','copyWarnings','rejectedPhrases','recommendedFixes','speculativeBoundaryText','exportContainsExecutableCode'].forEach((needle) => assert.match(script, new RegExp(needle)));
});

test('difference assistant detects missing fields, unsafe wording, and stale package version', () => {
  ['missing route metadata','missing SEO schema review','missing copy review bundle','missing demo script sections','missing screenshot caption','missing alt text','missing evidence pack row','missing source matrix row','missing equation library row','missing falsification callout','missing speculative boundary text','unsafe wording risk','stale package version'].forEach((needle) => assert.match(script, new RegExp(needle.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))));
});

test('export JSON contains static draft review import and page readiness diff blocks', () => {
  assert.match(script, /staticDraftReviewImport/);
  assert.match(script, /pageReadinessDiff/);
  assert.match(script, /ArcSecsStaticDraftReviewImport/);
  assert.match(script, /ArcSecsPageReadinessDiff/);
  assert.match(script, /exportContainsExecutableCode:\s*false/);
});

test('TypeScript contracts include static draft review and page readiness diff exports', () => {
  ['ArcSecsStaticDraftReviewImportExport','ArcSecsStaticDraftReviewImportSummary','ArcSecsPageReadinessDiffRow','ArcSecsPageReadinessDiffExport'].forEach((needle) => assert.match(contracts, new RegExp(needle)));
});

test('copy boundary remains cautious and rejects proof or established-technology language', () => {
  const combined = [shortcode, script, read('docs/static-draft-review-import.md'), read('docs/page-readiness-diff.md')].join('\n');
  assert.match(combined, /speculative research visualization/i);
  assert.match(combined, /not proof/i);
  assert.match(combined, /not operational capability/i);
  assert.match(combined, /do not publish|no pages are created|does not publish/i);
  assert.doesNotMatch(combined, /ArcSecs is proven|working propulsion system|is validated technology|is established technology/i);
});

test('docs and uai memory describe v5.8.36 static draft review import and page readiness diff', () => {
  assert.match(read('docs/static-draft-review-import.md'), /Static Draft Review Import/);
  assert.match(read('docs/page-readiness-diff.md'), /Page Readiness Diff/);
  assert.match(read('.uai/short-term-memory.uai'), /v5\.8\.36/);
  assert.match(read('.uai/exports/manifest.json'), /staticDraftReviewImport/);
  assert.match(read('.uai/exports/manifest.json'), /pageReadinessDiff/);
});
