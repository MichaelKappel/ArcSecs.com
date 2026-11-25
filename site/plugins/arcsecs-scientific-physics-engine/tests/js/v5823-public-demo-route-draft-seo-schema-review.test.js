const test = require('node:test');
const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');

const read = (path) => readFileSync(path, 'utf8');
const plugin = read('arcsecs-scientific-physics-engine.php');
const shortcode = read('includes/class-arcsecs-physics-engine-shortcodes.php');
const script = read('assets/js/arcsecs-physics-engine.js');
const contracts = read('src/types/arcsecs-space-travel-contracts.ts');

test('package identity is v5.8.36 for public demo route draft SEO schema review package', () => {
  assert.match(plugin, /Version:\s*5\.8\.36/);
  assert.match(plugin, /ARCSECS_PHYSICS_ENGINE_VERSION', '5\.8\.36'/);
  assert.equal(JSON.parse(read('package.json')).version, '5.8.36');
  assert.match(read('CHANGELOG.md'), /v5\.8\.36 - Viewport Scrollbar Accessibility Fix/);
});

test('Public Demo Route Draft Bundle and SEO Schema Review panels exist', () => {
  ['data-arcsecs-public-demo-route-draft-bundle', 'Public Demo Route Draft Bundle', 'data-arcsecs-seo-schema-review', 'SEO Schema Review'].forEach((needle) => assert.match(shortcode, new RegExp(needle.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))));
});

test('route draft controls and status values exist', () => {
  ['data-arcsecs-build-route-draft-bundle','data-arcsecs-build-seo-schema-review','data-arcsecs-export-selected-route-draft-json','data-arcsecs-export-all-route-drafts-json','data-arcsecs-export-seo-schema-review-json','data-arcsecs-route-draft-status'].forEach((needle) => assert.match(shortcode, new RegExp(needle)));
  ['draft','reviewer-ready','ready-with-warnings','blocked','rejected'].forEach((value) => assert.match(shortcode, new RegExp(`<option value="${value}">${value}</option>`)));
});

test('route draft rows include requested metadata and review statuses', () => {
  ['suggestedSlug','suggestedPageTitle','suggestedMetaTitle','suggestedMetaDescription','canonicalRouteNote','copyReadinessStatus','routeDraftStatus','routeWarnings','sourceEquationStatus','falsificationStatus'].forEach((needle) => assert.match(script, new RegExp(needle)));
});

test('schema review rows include reviewer-draft schema fields', () => {
  ['suggestedSchemaType','headline','description','imageCaptionNote','authorPublisherNotePlaceholder','aboutTopicNotes','citationSourceNotes','cautionDisclaimerNotes','falsificationNote','reviewerDraftOnly'].forEach((needle) => assert.match(script, new RegExp(needle)));
});

test('text-only internal link suggestions exist and do not fetch or publish links', () => {
  assert.match(script, /buildInternalLinkSuggestions/);
  assert.match(script, /textOnly: true/);
  assert.doesNotMatch(script, /fetch\(.*linkSuggestion/i);
  assert.doesNotMatch(script, /createWordPressPage|publishRouteDraft|injectsLiveSchema:\s*true/);
});

test('route/copy quality checks cover required warning classes', () => {
  ['missing slug','missing meta title','missing meta description','missing speculative boundary','missing falsification note','missing source/equation callout','proof or operational-capability wording detected','unlabeled placeholder/speculative mode'].forEach((needle) => assert.match(script, new RegExp(needle.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))));
});

test('export JSON contains publicDemoRouteDraftBundle and seoSchemaReview', () => {
  assert.match(script, /publicDemoRouteDraftBundle/);
  assert.match(script, /seoSchemaReview/);
  assert.match(script, /ArcSecsPublicDemoRouteDraftBundle/);
  assert.match(script, /ArcSecsSeoSchemaReview/);
  assert.match(script, /exportContainsExecutableCode:\s*false/);
});

test('TypeScript contracts include route draft and SEO schema exports', () => {
  ['ArcSecsPublicDemoRouteDraftBundleExport','ArcSecsSeoSchemaReviewExport','ArcSecsPublicDemoRouteDraftRow','ArcSecsSeoSchemaReviewRow'].forEach((needle) => assert.match(contracts, new RegExp(needle)));
});

test('copy boundary remains cautious and rejects proof or established-technology language', () => {
  const combined = [shortcode, script, read('docs/public-demo-route-draft-bundle.md'), read('docs/seo-schema-review.md')].join('\n');
  assert.match(combined, /speculative research visualization/i);
  assert.match(combined, /not proof/i);
  assert.match(combined, /not operational capability/i);
  assert.doesNotMatch(combined, /ArcSecs is proven|working propulsion system|is validated technology|is established technology/i);
});

test('docs and uai memory describe v5.8.36 route draft and schema review', () => {
  assert.match(read('docs/public-demo-route-draft-bundle.md'), /Public Demo Route Draft Bundle/);
  assert.match(read('docs/seo-schema-review.md'), /SEO Schema Review/);
  assert.match(read('.uai/short-term-memory.uai'), /v5\.8\.36/);
  assert.match(read('.uai/exports/manifest.json'), /publicDemoRouteDraftBundle/);
  assert.match(read('.uai/exports/manifest.json'), /seoSchemaReview/);
});
