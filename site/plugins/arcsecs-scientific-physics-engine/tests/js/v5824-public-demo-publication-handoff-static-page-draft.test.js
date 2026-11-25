const test = require('node:test');
const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');

const read = (path) => readFileSync(path, 'utf8');
const plugin = read('arcsecs-scientific-physics-engine.php');
const shortcode = read('includes/class-arcsecs-physics-engine-shortcodes.php');
const script = read('assets/js/arcsecs-physics-engine.js');
const contracts = read('src/types/arcsecs-space-travel-contracts.ts');

test('package identity is v5.8.36 for publication handoff static page draft package', () => {
  assert.match(plugin, /Version:\s*5\.8\.36/);
  assert.match(plugin, /ARCSECS_PHYSICS_ENGINE_VERSION', '5\.8\.36'/);
  assert.equal(JSON.parse(read('package.json')).version, '5.8.36');
  assert.match(read('CHANGELOG.md'), /v5\.8\.36 - Viewport Scrollbar Accessibility Fix/);
});

test('Viewport Scrollbar Accessibility Fix panels exist', () => {
  ['data-arcsecs-public-demo-publication-handoff-manifest', 'Public Demo Publication Handoff Manifest', 'data-arcsecs-static-page-draft-export', 'Static Page Draft Export'].forEach((needle) => assert.match(shortcode, new RegExp(needle.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))));
});

test('publication handoff controls and status values exist', () => {
  ['data-arcsecs-build-publication-handoff-manifest','data-arcsecs-build-static-page-draft-export','data-arcsecs-export-selected-static-page-draft-json','data-arcsecs-export-all-static-page-drafts-json','data-arcsecs-export-publication-handoff-manifest-json','data-arcsecs-publication-handoff-status'].forEach((needle) => assert.match(shortcode, new RegExp(needle)));
  ['draft','reviewer-ready','ready-with-warnings','blocked','rejected'].forEach((value) => assert.match(shortcode, new RegExp(`<option value="${value}">${value}</option>`)));
});

test('handoff rows include route, schema, copy, evidence, source/equation, falsification, warning, and placeholder statuses', () => {
  ['buildPublicDemoPublicationHandoffRow','routeDraftRow','schemaReviewRow','copyReadinessStatus','evidencePackStatus','sourceEquationStatus','falsificationStatus','warningStatus','placeholderLabelStatus','handoffStatus','reviewerHandoffDraftOnly'].forEach((needle) => assert.match(script, new RegExp(needle)));
});

test('static page draft rows include required public-page draft fields', () => {
  ['suggestedSlug','suggestedPageTitle','suggestedMetaTitle','suggestedMetaDescription','suggestedCanonicalNote','suggestedHeroTitle','suggestedIntroParagraph','suggestedDemoScriptSections','suggestedScreenshotCaption','suggestedAltText','suggestedTelemetryCallout','suggestedSourceEquationCallout','suggestedFalsificationCallout','suggestedBoundaryCopy','suggestedSchemaReview','suggestedInternalLinkTextRows','reviewerEvidenceExportPackRow','sourceMatrixRow','scenarioEquationLibraryRow'].forEach((needle) => assert.match(script, new RegExp(needle)));
});

test('handoff quality checks cover required missing and unsafe copy classes', () => {
  ['missing route draft','missing SEO schema review','missing copy review bundle','missing demo script','missing screenshot caption','missing evidence pack','missing source matrix row','missing equation library row','missing falsification callout','missing speculative boundary text','unsupported proof/operational-capability wording','unlabeled placeholder/speculative mode'].forEach((needle) => assert.match(script, new RegExp(needle.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))));
});

test('export JSON contains publication handoff and static page draft blocks', () => {
  assert.match(script, /publicDemoPublicationHandoffManifest/);
  assert.match(script, /staticPageDraftExport/);
  assert.match(script, /ArcSecsPublicDemoPublicationHandoffManifest/);
  assert.match(script, /ArcSecsStaticPageDraftExport/);
  assert.match(script, /exportContainsExecutableCode:\s*false/);
});

test('TypeScript contracts include publication handoff and static draft exports', () => {
  ['ArcSecsPublicDemoPublicationHandoffManifestExport','ArcSecsStaticPageDraftExport','ArcSecsPublicDemoPublicationHandoffRow','ArcSecsStaticPageDraftRow'].forEach((needle) => assert.match(contracts, new RegExp(needle)));
});

test('copy boundary remains cautious and rejects proof or established-technology language', () => {
  const combined = [shortcode, script, read('docs/public-demo-publication-handoff-manifest.md'), read('docs/static-page-draft-export.md')].join('\n');
  assert.match(combined, /speculative research visualization/i);
  assert.match(combined, /not proof/i);
  assert.match(combined, /not operational capability/i);
  assert.match(combined, /do not create WordPress pages|no WordPress pages are created/i);
  assert.doesNotMatch(combined, /ArcSecs is proven|working propulsion system|is validated technology|is established technology/i);
});

test('docs and uai memory describe v5.8.36 handoff and static page draft', () => {
  assert.match(read('docs/public-demo-publication-handoff-manifest.md'), /Public Demo Publication Handoff Manifest/);
  assert.match(read('docs/static-page-draft-export.md'), /Static Page Draft Export/);
  assert.match(read('.uai/short-term-memory.uai'), /v5\.8\.36/);
  assert.match(read('.uai/exports/manifest.json'), /publicDemoPublicationHandoffManifest/);
  assert.match(read('.uai/exports/manifest.json'), /staticPageDraftExport/);
});
