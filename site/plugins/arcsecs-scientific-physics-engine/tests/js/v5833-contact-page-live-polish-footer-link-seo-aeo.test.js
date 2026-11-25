const fs = require('fs');
const assert = require('assert');

function read(path) { return fs.readFileSync(path, 'utf8'); }

const plugin = read('arcsecs-scientific-physics-engine.php');
const activator = read('includes/class-arcsecs-physics-engine-activator.php');
const css = read('assets/css/arcsecs-physics-engine.css');
const ts = read('src/types/arcsecs-space-travel-contracts.ts');
const manifest = JSON.parse(read('.uai/exports/manifest.json'));

assert(plugin.includes('Version: 5.8.36'), 'plugin header is v5.8.36');
assert(plugin.includes("ARCSECS_PHYSICS_ENGINE_VERSION', '5.8.36'"), 'constant is v5.8.36');
assert(manifest.packageVersion === '5.8.36', 'manifest package version is v5.8.36');
assert(manifest.latestPackage === 'arcsecs-v5.8.36-viewport-scrollbar-accessibility-fix-package.zip', 'manifest package filename is current');

['create_or_update_contact_page', "get_page_by_path('contact')", "'post_title' => 'Contact Michael Kappel'", "'post_name' => 'contact'", 'add_contact_page_to_menu', 'update_contact_footer_metadata', 'arcsecs_contact_footer_link_metadata'].forEach((needle) => {
  assert(activator.includes(needle), `contact page polish contains ${needle}`);
});

['mike@ns12.com', '(630) 362-7576', '+1-630-362-7576', 'Cicero, Illinois / Chicago area', 'https://mikekappel.com/', 'Senior Software Engineer / Software Architect'].forEach((needle) => {
  assert(activator.includes(needle), `contact page includes ${needle}`);
});

['"@graph"', '"@type": "ContactPage"', '"@type": "Person"', '"@type": "ContactPoint"', 'professional software engineering contact'].forEach((needle) => {
  assert(activator.includes(needle), `ContactPage / Person schema includes ${needle}`);
});

['C#', 'ASP.NET Core', 'SQL Server', 'TypeScript', 'semantic search', 'AI-assisted engineering', 'legacy modernization', 'testing strategy'].forEach((needle) => {
  assert(activator.includes(needle), `background includes ${needle}`);
});

['US Bank', 'Authorize.Net', 'City of Chicago', 'Chicago Airport System'].forEach((forbidden) => {
  assert(!activator.includes(forbidden), `contact page avoids exact employer/client name ${forbidden}`);
});

assert(activator.includes('does not claim ArcSecs is proven'), 'contact page includes proof boundary');
assert(activator.includes('does not present speculative simulator output as operational capability'), 'contact page includes operational-capability boundary');
assert(css.includes('v5.8.36 Contact page live verification notes') || css.includes('v5.8.36 Contact page live verification notes and public trust polish'), 'contact CSS polish exists');
assert(css.includes('@media (max-width: 720px)'), 'mobile contact CSS exists');
assert(ts.includes('ArcSecsContactPageSeoAeoCleanupMetadata'), 'TypeScript contact SEO/AEO contract exists');
assert(read('docs/contact-page-seo-aeo-cleanup.md').includes('ContactPage / Person JSON-LD'), 'SEO/AEO docs mention schema');
assert(read('.uai/short-term-memory.uai').includes('v5.8.36 Contact Page Live Verification Notes'), '.uai short-term memory current');
assert(read('.uai/exports/llms-full.txt').includes('ContactPage / Person JSON-LD'), '.uai llms full current');

console.log('v5.8.36 Contact Page Live Verification Notes checks passed.');
