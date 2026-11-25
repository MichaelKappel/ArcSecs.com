const test = require('node:test');
const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');

const read = (path) => readFileSync(path, 'utf8');
const plugin = read('arcsecs-scientific-physics-engine.php');
const shortcode = read('includes/class-arcsecs-physics-engine-shortcodes.php');
const script = read('assets/js/arcsecs-physics-engine.js');
const contracts = read('src/types/arcsecs-space-travel-contracts.ts');

test('package identity is v5.8.36 for static publication review checklist page draft freeze package', () => {
  assert.match(plugin, /Version:\s*5\.8\.36/);
  assert.match(plugin, /ARCSECS_PHYSICS_ENGINE_VERSION', '5\.8\.36'/);
  assert.equal(JSON.parse(read('package.json')).version, '5.8.36');
  assert.match(read('CHANGELOG.md'), /v5\.8\.36 - Viewport Scrollbar Accessibility Fix/);
});

test('Viewport Scrollbar Accessibility Fix panels exist', () => {
  ['data-arcsecs-static-publication-review-checklist','Static Publication Review Checklist','data-arcsecs-page-draft-freeze-bundle','Page Draft Freeze Bundle'].forEach((needle) => assert.match(shortcode, new RegExp(needle.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))));
});

test('checklist controls and freeze status values exist', () => {
  ['data-arcsecs-build-static-publication-review-checklist','data-arcsecs-build-page-draft-freeze-bundle','data-arcsecs-export-selected-freeze-bundle-json','data-arcsecs-export-all-freeze-bundles-json','data-arcsecs-static-publication-filter-scenario','data-arcsecs-static-publication-filter-freeze-status'].forEach((needle) => assert.match(shortcode, new RegExp(needle)));
  ['not-reviewed','frozen-for-review','frozen-with-warnings','needs-revision','blocked','rejected'].forEach((value) => assert.match(shortcode, new RegExp(`<option value="${value}">${value}</option>`)));
});

test('checklist rows include required review statuses', () => {
  ['routeMetadataStatus','schemaReviewStatus','copyReviewStatus','evidencePackStatus','sourceEquationStatus','falsificationStatus','boundaryStatus','staleStatus','warningStatus','rejectedPhraseStatus','freezeStatus'].forEach((needle) => assert.match(script, new RegExp(needle)));
});

test('freeze bundle rows include required linked artifacts', () => {
  ['pageReadinessDiffRow','staticPageDraftExportRow','publicationHandoffManifestRow','routeDraftRow','seoSchemaReviewRow','copyReviewBundleRow','publicDemoScriptRow','screenshotCaptionRow','reviewerEvidenceExportPackRow','sourceMatrixRow','scenarioEquationLibraryRow','checklistState','warnings','rejectedPhrases','recommendedFixes','falsificationNotes','speculativeBoundaryText','exportContainsExecutableCode: false'].forEach((needle) => assert.match(script, new RegExp(needle.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))));
});

test('freeze quality checks block missing content, unsafe wording, stale rows, and missing boundary or falsification language', () => {
  ['missing route metadata','missing schema review','missing copy review','missing evidence pack','missing source matrix row','missing equation library row','missing falsification','missing speculative boundary text','unsafe wording risk','stale rows require frozen-with-warnings','unlabeled placeholder/speculative modes'].forEach((needle) => assert.match(script, new RegExp(needle.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))));
});

test('export JSON contains static publication review checklist and page draft freeze bundle blocks', () => {
  assert.match(script, /staticPublicationReviewChecklist/);
  assert.match(script, /pageDraftFreezeBundle/);
  assert.match(script, /ArcSecsStaticPublicationReviewChecklist/);
  assert.match(script, /ArcSecsPageDraftFreezeBundle/);
  assert.match(script, /exportContainsExecutableCode:\s*false/);
});

test('TypeScript contracts include static publication checklist and freeze bundle exports', () => {
  ['ArcSecsStaticPublicationReviewChecklistRow','ArcSecsStaticPublicationReviewChecklistExport','ArcSecsPageDraftFreezeBundleRow','ArcSecsPageDraftFreezeBundleExport'].forEach((needle) => assert.match(contracts, new RegExp(needle)));
});

test('copy boundary remains cautious and rejects proof or established-technology language', () => {
  const combined = [shortcode, script, read('docs/static-publication-review-checklist.md'), read('docs/page-draft-freeze-bundle.md')].join('\n');
  assert.match(combined, /speculative research visualization/i);
  assert.match(combined, /not proof/i);
  assert.match(combined, /not operational capability/i);
  assert.match(combined, /does not publish|not publishing automation|does not create WordPress pages/i);
  assert.doesNotMatch(combined, /ArcSecs is proven|working propulsion system|is validated technology|is established technology/i);
});

test('docs and uai memory describe v5.8.36 static publication review checklist and page draft freeze bundle', () => {
  assert.match(read('docs/static-publication-review-checklist.md'), /Static Publication Review Checklist/);
  assert.match(read('docs/page-draft-freeze-bundle.md'), /Page Draft Freeze Bundle/);
  assert.match(read('.uai/short-term-memory.uai'), /v5\.8\.36/);
  assert.match(read('.uai/exports/manifest.json'), /staticPublicationReviewChecklist/);
  assert.match(read('.uai/exports/manifest.json'), /pageDraftFreezeBundle/);
});
