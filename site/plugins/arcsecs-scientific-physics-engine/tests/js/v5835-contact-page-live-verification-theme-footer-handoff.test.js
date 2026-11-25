const test = require('node:test');
const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');

const read = (path) => readFileSync(path, 'utf8');
const plugin = read('arcsecs-scientific-physics-engine.php');
const activator = read('includes/class-arcsecs-physics-engine-activator.php');
const css = read('assets/css/arcsecs-physics-engine.css');
const ts = read('src/types/arcsecs-space-travel-contracts.ts');
const manifest = JSON.parse(read('.uai/exports/manifest.json'));

test('package identity is v5.8.36 for viewport scrollbar accessibility fix package', () => {
  assert.match(plugin, /Version:\s*5\.8\.36/);
  assert.match(plugin, /ARCSECS_PHYSICS_ENGINE_VERSION', '5\.8\.36'/);
  assert.equal(JSON.parse(read('package.json')).version, '5.8.36');
  assert.equal(manifest.packageVersion, '5.8.36');
  assert.equal(manifest.latestPackage, 'arcsecs-v5.8.36-viewport-scrollbar-accessibility-fix-package.zip');
});

test('contact page live verification metadata exists', () => {
  ['update_contact_live_verification_notes','arcsecs_contact_page_live_verification_notes','contactPageLiveVerificationNotes','verificationRows','footerHandoffGuidance','schemaSafetyStatus','employerClientOmissionStatus','exportContainsExecutableCode'].forEach((needle) => {
    assert.equal(activator.includes(needle), true, `missing ${needle}`);
  });
  ['email visible','phone visible','location visible','MikeKappel.com visible','Contact menu item visible','footer-link metadata available','mobile layout readable','ContactPage / Person / ContactPoint JSON-LD scoped','exact employer/client names omitted','ArcSecs boundary copy visible'].forEach((needle) => {
    assert.equal(activator.includes(needle), true, `missing verification row ${needle}`);
  });
});

test('theme footer handoff guidance remains guidance only', () => {
  assert.match(activator, /Footer contact link metadata only/);
  assert.match(activator, /does not force unrelated theme footer behavior/);
  assert.match(read('docs/theme-footer-contact-handoff.md'), /does not force unrelated theme footer behavior/);
  assert.equal(manifest.contactPage.footerLinkMetadataOption, 'arcsecs_contact_footer_link_metadata');
  assert.equal(manifest.contactPage.liveVerificationNotesOption, 'arcsecs_contact_page_live_verification_notes');
});

test('contact facts schema scope and employer omission remain safe', () => {
  ['mike@ns12.com','(630) 362-7576','+1-630-362-7576','Cicero, Illinois / Chicago area','https://mikekappel.com/','"@type": "ContactPage"','"@type": "Person"','"@type": "ContactPoint"','"@id": "https://arcsecs.com/contact/#contact-page"','"url": "https://arcsecs.com/contact/"'].forEach((needle) => {
    assert.equal(activator.includes(needle), true, `missing ${needle}`);
  });
  ['US Bank','Authorize.Net','City of Chicago','Chicago Airport System','NS12'].forEach((forbidden) => {
    assert.equal(activator.includes(forbidden), false, `forbidden exact name should not appear: ${forbidden}`);
  });
});

test('contact boundary and simulator page remain preserved', () => {
  assert.match(activator, /does not claim ArcSecs is proven physics/);
  assert.match(activator, /does not claim dark matter propulsion is established technology/);
  assert.match(activator, /does not present speculative simulator output as operational capability/);
  assert.match(activator, /<h1>Dark Matter Drive Simulator<\/h1>/);
  assert.match(activator, /\[arcsecs_dark_matter_drive_simulator\]/);
});

test('css types docs and uai memory describe v5.8.36 contact verification', () => {
  assert.match(css, /v5\.8\.36 Contact page live verification notes/);
  assert.match(ts, /ArcSecsContactPageLiveVerificationNotesExport/);
  assert.match(read('docs/contact-page-live-verification-notes.md'), /contactPageLiveVerificationNotes/);
  assert.match(read('docs/contact-page-deployment-qa.md'), /v5\.8\.36 note/);
  assert.match(read('.uai/short-term-memory.uai'), /v5\.8\.36 Contact Page Live Verification Notes/);
  assert.match(read('.uai/exports/llms-full.txt'), /ContactPage \/ Person \/ ContactPoint JSON-LD/);
  assert.equal(manifest.contactPageLiveVerificationNotes, true);
  assert.equal(manifest.themeFooterContactHandoff, true);
  assert.equal(manifest.coreRuntimePhysicsChanged, false);
  assert.equal(manifest.publishingAutomationAdded, false);
});
