
const fs = require('fs');
const assert = require('assert');

function read(path) { return fs.readFileSync(path, 'utf8'); }

const plugin = read('arcsecs-scientific-physics-engine.php');
const php = read('includes/class-arcsecs-physics-engine-shortcodes.php');
const js = read('assets/js/arcsecs-physics-engine.js');
const ts = read('src/types/arcsecs-space-travel-contracts.ts');
const manifest = JSON.parse(read('.uai/exports/manifest.json'));

assert(plugin.includes('Version: 5.8.36'), 'plugin header is v5.8.36');
assert(plugin.includes("ARCSECS_PHYSICS_ENGINE_VERSION', '5.8.36'"), 'constant is v5.8.36');
assert(manifest.packageVersion === '5.8.36', 'manifest version is v5.8.36');

assert(php.includes('Public Publishing Evidence Archive Index'), 'archive index panel exists');
assert(php.includes('Reviewer Retrieval Notes'), 'reviewer retrieval notes panel exists');
assert(php.includes('data-arcsecs-build-publishing-evidence-archive-index'), 'build archive index control exists');
assert(php.includes('data-arcsecs-build-reviewer-retrieval-notes'), 'build reviewer retrieval notes control exists');
assert(php.includes('data-arcsecs-export-selected-archive-index-json'), 'selected archive index export control exists');
assert(php.includes('data-arcsecs-export-all-archive-index-json'), 'all archive index export control exists');
assert(php.includes('data-arcsecs-export-reviewer-retrieval-notes-json'), 'retrieval notes export control exists');

['not-reviewed','retrievable','retrievable-with-warnings','needs-revision','blocked','rejected'].forEach((status) => {
  assert(php.includes(status), `archive retrieval status ${status} exists`);
});

['suggestedSlug','pageTitle','manualHandoffStatus','verificationStatus','archiveReceiptStatus','signOffStatus','reviewerNameOrHandle','warningCount','rejectedPhraseCount','recommendedFixCount','falsificationNoteStatus','speculativeBoundaryStatus','sourceMatrixStatus','equationLibraryStatus','archiveRetrievalStatus'].forEach((field) => {
  assert(js.includes(field), `archive index field ${field} exists`);
});

['archiveIndexRow','humanSignOffRow','archiveReceiptRow','manualRunbookRow','postDeployVerificationRow','staticPublishHandoffQaSummaryRow','publicPageContentChecklistRow','pageDraftFreezeBundleRow','sourceMatrixRow','scenarioEquationLibraryRow','falsificationNotes','speculativeBoundaryText','exportContainsExecutableCode: false'].forEach((field) => {
  assert(js.includes(field), `retrieval note field ${field} exists`);
});

assert(js.includes('publicPublishingEvidenceArchiveIndex'), 'strict/export JSON includes publicPublishingEvidenceArchiveIndex');
assert(js.includes('reviewerRetrievalNotes'), 'strict/export JSON includes reviewerRetrievalNotes');
assert(js.includes('Block') || js.includes('blocked'), 'quality checks block unsafe retrieval states');
assert(js.includes('proof') && js.includes('operational capability'), 'copy boundary checks preserve no-proof/no-operational-capability wording');
assert(ts.includes('ArcSecsPublicPublishingEvidenceArchiveIndex'), 'TypeScript archive index contract exists');
assert(ts.includes('ArcSecsReviewerRetrievalNotes'), 'TypeScript retrieval notes contract exists');

const shortTerm = read('.uai/short-term-memory.uai');
assert(shortTerm.includes('v5.8.36'), '.uai short-term memory current');
assert(read('.uai/progress.uai').includes('v5.8.36'), '.uai progress current');
assert(read('.uai/file-handoff.uai').includes('arcsecs-v5.8.36-viewport-scrollbar-accessibility-fix-package.zip'), '.uai file handoff package current');
assert(read('.uai/exports/llms-full.txt').includes('Public Publishing Evidence Archive Index'), '.uai llms full current');

console.log('v5.8.36 Viewport Scrollbar Accessibility Fix checks passed.');
