const test = require('node:test');
const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');

const read = (path) => readFileSync(path, 'utf8');
const plugin = read('arcsecs-scientific-physics-engine.php');
const activator = read('includes/class-arcsecs-physics-engine-activator.php');
const css = read('assets/css/arcsecs-physics-engine.css');
const ts = read('src/types/arcsecs-space-travel-contracts.ts');
const manifest = JSON.parse(read('.uai/exports/manifest.json'));

test('package identity is v5.8.36 for contact page live verification notes package', () => {
  assert.match(plugin, /Version:\s*5\.8\.36/);
  assert.match(plugin, /ARCSECS_PHYSICS_ENGINE_VERSION', '5\.8\.36'/);
  assert.equal(JSON.parse(read('package.json')).version, '5.8.36');
  assert.equal(manifest.packageVersion, '5.8.36');
  assert.equal(manifest.latestPackage, 'arcsecs-v5.8.36-viewport-scrollbar-accessibility-fix-package.zip');
});

test('contact page includes visible contact facts and trust sections', () => {
  ['Contact Michael Kappel','mike@ns12.com','(630) 362-7576','+1-630-362-7576','Cicero, Illinois / Chicago area','https://mikekappel.com/','How I can help','Best reasons to reach out','Senior Software Engineer / Software Architect'].forEach((needle) => {
    assert.match(activator, new RegExp(needle.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  });
});

test('contact page avoids exact employer and client names', () => {
  ['US Bank','Authorize.Net','City of Chicago','Chicago Airport System','NS12'].forEach((forbidden) => {
    assert.equal(activator.includes(forbidden), false, `forbidden exact name should not appear: ${forbidden}`);
  });
});

test('contact page preserves ArcSecs boundaries', () => {
  assert.match(activator, /does not claim ArcSecs is proven physics/);
  assert.match(activator, /does not claim dark matter propulsion is established technology/);
  assert.match(activator, /does not present speculative simulator output as operational capability/);
});

test('menu footer and schema remain safe and contact scoped', () => {
  ['add_contact_page_to_menu','update_contact_footer_metadata','arcsecs_contact_footer_link_metadata','does not force unrelated theme footer behavior'].forEach((needle) => assert.match(activator, new RegExp(needle)));
  ['"@type": "ContactPage"','"@type": "Person"','"@type": "ContactPoint"','"@id": "https://arcsecs.com/contact/#contact-page"','"url": "https://arcsecs.com/contact/"'].forEach((needle) => assert.equal(activator.includes(needle), true, `schema includes ${needle}`));
});

test('mobile contact CSS and TypeScript metadata exist', () => {
  assert.match(css, /v5\.8\.36 Contact page live verification notes/);
  assert.match(css, /arcsecs-contact-card/);
  assert.match(css, /@media \(max-width: 420px\)/);
  assert.match(ts, /ArcSecsContactPageDeploymentQaMetadata/);
  assert.equal(manifest.contactPage.mobileCssPresent, true);
});

test('uai memory is current and complete', () => {
  assert.match(read('.uai/short-term-memory.uai'), /v5\.8\.36 Contact Page Live Verification Notes/);
  assert.match(read('.uai/exports/llms-full.txt'), /ContactPage \/ Person \/ ContactPoint JSON-LD is scoped to `\/contact\/` only/);
  assert.equal(manifest.uaiMemoryOrganizationCompletenessCheck, true);
  assert.equal(manifest.coreRuntimePhysicsChanged, false);
  assert.equal(manifest.publishingAutomationAdded, false);
});

test('dark matter drive activation page content remains preserved', () => {
  assert.match(activator, /<h1>Dark Matter Drive Simulator<\/h1>/);
  assert.match(activator, /\[arcsecs_dark_matter_drive_simulator\]/);
});
