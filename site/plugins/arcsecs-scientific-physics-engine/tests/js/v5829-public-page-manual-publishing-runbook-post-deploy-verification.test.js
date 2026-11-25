const test = require('node:test');
const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');

const read = (path) => readFileSync(path, 'utf8');

test('package identity is v5.8.36 for manual publishing runbook package', () => {
  assert.match(read('arcsecs-scientific-physics-engine.php'), /Version:\s*5\.8\.36/);
  assert.match(read('arcsecs-scientific-physics-engine.php'), /ARCSECS_PHYSICS_ENGINE_VERSION', '5\.8\.36'/);
  assert.equal(JSON.parse(read('package.json')).version, '5.8.36');
  const manifest = JSON.parse(read('.uai/exports/manifest.json'));
  assert.equal(manifest.version, '5.8.36');
  assert.equal(manifest.latestPackage, 'arcsecs-v5.8.36-viewport-scrollbar-accessibility-fix-package.zip');
});

test('manual publishing runbook and post-deploy panels exist', () => {
  const php = read('includes/class-arcsecs-physics-engine-shortcodes.php');
  assert.match(php, /data-arcsecs-manual-publishing-runbook="true"/);
  assert.match(php, /data-arcsecs-post-deploy-verification-checklist="true"/);
  assert.match(php, /Build Manual Publishing Runbook/);
  assert.match(php, /Build Post-Deploy Verification Checklist/);
  assert.match(php, /Export Selected Manual Runbook JSON/);
  assert.match(php, /Export All Manual Runbooks JSON/);
  assert.match(php, /Export Post-Deploy Verification Checklist JSON/);
});

test('manual handoff status values and quality checks exist', () => {
  const js = read('assets/js/arcsecs-physics-engine.js');
  ['not-reviewed','handoff-ready','handoff-ready-with-warnings','needs-revision','blocked','rejected'].forEach((status) => assert.match(js, new RegExp(status)));
  assert.match(js, /buildPublicPageManualPublishingRunbook/);
  assert.match(js, /buildPostDeployVerificationChecklist/);
  assert.match(js, /Resolve QA status before manual publishing handoff-ready review/);
  assert.match(js, /Complete the Public Page Content Checklist before manual publishing handoff/);
  assert.match(js, /Remove rejected proof or operational-capability phrases/);
  assert.match(js, /unresolved recommended fixes/);
});

test('runbook rows and post-deploy checklist confirmations include required fields', () => {
  const js = read('assets/js/arcsecs-physics-engine.js');
  ['qaStatus','checklistCompletionStatus','suggestedSlug','pageTitle','metaTitle','metaDescription','schemaReviewNote','evidenceReferenceNote','warningCount','rejectedPhraseStatus','placeholderSpeculativeLabelStatus','manualHandoffStatus'].forEach((field) => assert.match(js, new RegExp(field)));
  ['routeManuallyCreatedConfirmation','pageTitleVisibleConfirmation','metaDescriptionReviewedConfirmation','speculativeBoundaryVisibleConfirmation','falsificationCalloutVisibleConfirmation','sourceEquationCalloutVisibleConfirmation','screenshotCaptionVisibleConfirmation','altTextReviewedConfirmation','placeholderSpeculativeLabelsVisibleConfirmation','noProofWordingConfirmation','noOperationalCapabilityWordingConfirmation','evidenceReferenceVisibleConfirmation','exportArchiveRetainedConfirmation'].forEach((field) => assert.match(js, new RegExp(field)));
});

test('exports contain manual publishing and post-deploy blocks', () => {
  const js = read('assets/js/arcsecs-physics-engine.js');
  assert.match(js, /publicPageManualPublishingRunbook/);
  assert.match(js, /postDeployVerificationChecklist/);
  assert.match(js, /ArcSecsPublicPageManualPublishingRunbook/);
  assert.match(js, /ArcSecsPostDeployVerificationChecklist/);
  assert.match(js, /exportContainsExecutableCode:\s*false/);
});

test('copy boundary rejects proof and publishing automation claims', () => {
  const combined = read('assets/js/arcsecs-physics-engine.js') + read('README.md') + read('.uai/short-term-memory.uai');
  assert.match(combined, /speculative research visualization/i);
  assert.match(combined, /not proof/i);
  assert.match(combined, /not operational capability/i);
  assert.match(combined, /does not create WordPress pages|does not publish/i);
  assert.doesNotMatch(combined, /working propulsion system enabled|validated technology enabled|publishing automation enabled/i);
});

test('typescript contracts include manual runbook and post-deploy exports', () => {
  const contracts = read('src/types/arcsecs-space-travel-contracts.ts');
  assert.match(contracts, /ArcSecsPublicPageManualPublishingRunbookExport/);
  assert.match(contracts, /ArcSecsPostDeployVerificationChecklistExport/);
  assert.match(contracts, /ArcSecsManualHandoffStatus/);
  assert.match(contracts, /exportContainsExecutableCode:\s*false/);
});
