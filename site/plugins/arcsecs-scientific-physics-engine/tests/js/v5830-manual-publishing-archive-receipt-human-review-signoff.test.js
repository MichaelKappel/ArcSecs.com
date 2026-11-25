const test = require('node:test');
const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');

const read = (path) => readFileSync(path, 'utf8');

test('package identity is v5.8.36 for manual publishing archive receipt package', () => {
  assert.match(read('arcsecs-scientific-physics-engine.php'), /Version:\s*5\.8\.36/);
  assert.match(read('arcsecs-scientific-physics-engine.php'), /ARCSECS_PHYSICS_ENGINE_VERSION', '5\.8\.36'/);
  assert.equal(JSON.parse(read('package.json')).version, '5.8.36');
  const manifest = JSON.parse(read('.uai/exports/manifest.json'));
  assert.equal(manifest.version, '5.8.36');
  assert.equal(manifest.latestPackage, 'arcsecs-v5.8.36-viewport-scrollbar-accessibility-fix-package.zip');
});

test('manual publishing archive receipt and human review sign-off panels exist', () => {
  const php = read('includes/class-arcsecs-physics-engine-shortcodes.php');
  assert.match(php, /data-arcsecs-manual-publishing-archive-receipt="true"/);
  assert.match(php, /data-arcsecs-human-review-signoff-export="true"/);
  assert.match(php, /Build Manual Publishing Archive Receipt/);
  assert.match(php, /Build Human Review Sign-Off Export/);
  assert.match(php, /Export Selected Archive Receipt JSON/);
  assert.match(php, /Export All Archive Receipts JSON/);
  assert.match(php, /Export Human Review Sign-Off JSON/);
});

test('archive receipt and sign-off status values exist', () => {
  const combined = read('assets/js/arcsecs-physics-engine.js') + read('includes/class-arcsecs-physics-engine-shortcodes.php');
  ['not-reviewed','archived-for-review','archived-with-warnings','needs-revision','blocked','rejected'].forEach((status) => assert.match(combined, new RegExp(status)));
  ['signed-off-for-manual-publishing','signed-off-with-warnings'].forEach((status) => assert.match(combined, new RegExp(status)));
  assert.match(combined, /Build Manual Publishing Archive Receipt/);
  assert.match(combined, /Build Human Review Sign-Off Export/);
});

test('archive receipt rows and human sign-off rows include required fields', () => {
  const js = read('assets/js/arcsecs-physics-engine.js');
  ['manualHandoffStatus','verificationStatus','suggestedSlug','pageTitle','metaTitle','metaDescription','evidenceReferenceNote','warningCount','rejectedPhraseStatus','placeholderSpeculativeLabelStatus','exportArchiveRetainedStatus','archiveReceiptStatus'].forEach((field) => assert.match(js, new RegExp(field)));
  ['publicPageManualPublishingRunbookRow','postDeployVerificationChecklistRow','staticPublishHandoffQaSummaryRow','publicPageContentChecklistRow','pageDraftFreezeBundleRow','sourceMatrixRow','scenarioEquationLibraryRow','falsificationNotes','speculativeBoundaryText','exportContainsExecutableCode'].forEach((field) => assert.match(js, new RegExp(field)));
});

test('archive sign-off quality checks block unsafe or incomplete handoff', () => {
  const js = read('assets/js/arcsecs-physics-engine.js');
  assert.match(js, /Resolve manual handoff status before archive receipt/);
  assert.match(js, /Post-deploy verification confirmations are pending human review/);
  assert.match(js, /Remove rejected proof or operational-capability phrases/);
  assert.match(js, /Complete or explicitly warn about pending post-deploy checklist confirmations/);
  assert.match(js, /Require speculative boundary text/);
  assert.match(js, /Require falsification notes or evidence reference note/);
  assert.match(js, /unresolved recommended fixes/);
});

test('exports contain archive receipt and human sign-off blocks', () => {
  const js = read('assets/js/arcsecs-physics-engine.js');
  assert.match(js, /manualPublishingArchiveReceipt/);
  assert.match(js, /humanReviewSignOffExport/);
  assert.match(js, /ArcSecsManualPublishingArchiveReceipt/);
  assert.match(js, /ArcSecsHumanReviewSignOffExport/);
  assert.match(js, /exportContainsExecutableCode:\s*false/);
});

test('copy boundary preserves cautious scientific wording', () => {
  const combined = read('assets/js/arcsecs-physics-engine.js') + read('README.md') + read('.uai/short-term-memory.uai');
  assert.match(combined, /speculative research visualization/i);
  assert.match(combined, /not proof/i);
  assert.match(combined, /not operational capability/i);
  assert.match(combined, /does not publish|does not create WordPress pages|does not create content/i);
});

test('uai memory remains complete and current after v5.8.36', () => {
  ['.uai/short-term-memory.uai','.uai/progress.uai','.uai/test-plan.uai','.uai/file-handoff.uai','.uai/exports/manifest.json','.uai/exports/llms.txt','.uai/exports/llms-full.txt','.uai/exports/checksums.json'].forEach((path) => {
    const text = read(path);
    assert.match(text, /5\.8\.36|v5\.8\.36|manualPublishingArchiveReceipt|humanReviewSignOffExport|Michael Kappel Contact Page/);
  });
});
