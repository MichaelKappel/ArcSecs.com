const test = require('node:test');
const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');

const read = (path) => readFileSync(path, 'utf8');
const plugin = read('arcsecs-scientific-physics-engine.php');
const shortcode = read('includes/class-arcsecs-physics-engine-shortcodes.php');
const script = read('assets/js/arcsecs-physics-engine.js');
const contracts = read('src/types/arcsecs-space-travel-contracts.ts');

test('package identity is v5.8.36 for static publish handoff qa summary public page content checklist package', () => {
  assert.match(plugin, /Version:\s*5\.8\.36/);
  assert.match(plugin, /ARCSECS_PHYSICS_ENGINE_VERSION', '5\.8\.36'/);
  assert.equal(JSON.parse(read('package.json')).version, '5.8.36');
  assert.match(read('CHANGELOG.md'), /v5\.8\.36 - Viewport Scrollbar Accessibility Fix/);
});

test('Static Publish Handoff QA Summary and Public Page Content Checklist panels exist', () => {
  ['data-arcsecs-static-publish-handoff-qa-summary','Static Publish Handoff QA Summary','data-arcsecs-public-page-content-checklist','Public Page Content Checklist'].forEach((needle) => assert.match(shortcode, new RegExp(needle.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))));
});

test('QA controls and QA status values exist', () => {
  ['data-arcsecs-build-publish-handoff-qa-summary','data-arcsecs-build-public-page-content-checklist','data-arcsecs-export-selected-qa-summary-json','data-arcsecs-export-all-qa-summaries-json','data-arcsecs-export-public-page-content-checklist-json','data-arcsecs-static-publish-qa-filter-scenario'].forEach((needle) => assert.match(shortcode, new RegExp(needle)));
  ['not-reviewed','qa-ready','qa-ready-with-warnings','needs-revision','blocked','rejected'].forEach((value) => assert.match(shortcode, new RegExp(`<option value="${value}">${value}</option>`)));
});

test('QA rows include freeze status route schema copy evidence source equation falsification boundary warning rejected phrase recommended fix and final QA status', () => {
  ['freezeStatus','routeMetadataStatus','schemaReviewStatus','copyReviewStatus','evidencePackStatus','sourceEquationStatus','falsificationStatus','boundaryStatus','warningCount','rejectedPhraseCount','recommendedFixCount','finalQaStatus'].forEach((needle) => assert.match(script, new RegExp(needle)));
});

test('Public page content checklist rows include route metadata copy fields script sections captions alt text callouts schema links evidence and labels', () => {
  ['suggestedSlug','pageTitle','metaTitle','metaDescription','heroTitle','introParagraph','demoScriptSections','screenshotCaption','altText','telemetryCallout','sourceEquationCallout','falsificationCallout','speculativeBoundaryCopy','schemaReviewNote','internalLinkTextRows','evidenceReferenceNote','rejectedPhraseStatus','placeholderSpeculativeLabelStatus','checklistCompletionStatus'].forEach((needle) => assert.match(script, new RegExp(needle)));
});

test('QA quality checks block missing required content blocked freeze states unsafe wording missing boundary/falsification and unresolved fixes', () => {
  ['blocked/rejected/needs-revision freeze state','Add route metadata before QA-ready review','Add SEO schema review before QA-ready review','Add copy review bundle before QA-ready review','Add reviewer evidence pack before QA-ready review','Add source matrix row and scenario equation library row before QA-ready review','Add falsification callout before QA-ready review','Add speculative boundary copy before QA-ready review','Remove rejected proof or operational-capability phrases before QA-ready review','Recommended fixes remain open'].forEach((needle) => assert.match(script, new RegExp(needle.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))));
});

test('export JSON contains static publish handoff QA summary and public page content checklist blocks', () => {
  assert.match(script, /staticPublishHandoffQaSummary/);
  assert.match(script, /publicPageContentChecklist/);
  assert.match(script, /ArcSecsStaticPublishHandoffQaSummary/);
  assert.match(script, /ArcSecsPublicPageContentChecklist/);
  assert.match(script, /exportContainsExecutableCode:\s*false/);
});

test('TypeScript contracts include static publish QA and public page content checklist exports', () => {
  ['ArcSecsStaticPublishHandoffQaSummaryRow','ArcSecsStaticPublishHandoffQaSummaryExport','ArcSecsPublicPageContentChecklistRow','ArcSecsPublicPageContentChecklistExport'].forEach((needle) => assert.match(contracts, new RegExp(needle)));
});

test('copy boundary remains cautious and rejects proof or established-technology language', () => {
  const combined = [shortcode, script, read('docs/static-publish-handoff-qa-summary.md'), read('docs/public-page-content-checklist.md')].join('\n');
  assert.match(combined, /speculative research visualization/i);
  assert.match(combined, /not proof/i);
  assert.match(combined, /not operational capability/i);
  assert.match(combined, /does not publish|not publishing automation|does not create WordPress pages/i);
  assert.doesNotMatch(combined, /ArcSecs is proven|working propulsion system|is validated technology|is established technology/i);
});

test('docs and uai memory describe v5.8.36 static publish QA and content checklist', () => {
  assert.match(read('docs/static-publish-handoff-qa-summary.md'), /Static Publish Handoff QA Summary/);
  assert.match(read('docs/public-page-content-checklist.md'), /Public Page Content Checklist/);
  assert.match(read('.uai/short-term-memory.uai'), /v5\.8\.36/);
  assert.match(read('.uai/exports/manifest.json'), /staticPublishHandoffQaSummary/);
  assert.match(read('.uai/exports/manifest.json'), /publicPageContentChecklist/);
});
