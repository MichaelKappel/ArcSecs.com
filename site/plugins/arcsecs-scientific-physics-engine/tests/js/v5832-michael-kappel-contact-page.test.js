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
assert(manifest.packageVersion === '5.8.36', 'manifest version is v5.8.36');
assert(manifest.packageFile === 'arcsecs-v5.8.36-viewport-scrollbar-accessibility-fix-package.zip', 'manifest package is current');

assert(activator.includes('create_or_update_contact_page'), 'contact page repair method exists');
assert(activator.includes("get_page_by_path('contact')"), 'contact page lookup uses /contact/');
assert(activator.includes("'post_title' => 'Contact Michael Kappel'"), 'contact page title exists');
assert(activator.includes("'post_name' => 'contact'"), 'contact page slug exists');
assert(activator.includes('add_contact_page_to_menu'), 'contact menu repair exists');
assert(activator.includes("'menu-item-title' => 'Contact'"), 'Contact menu label exists');
assert(activator.includes('arcsecs_contact_page_id'), 'contact page option is stored');
assert(activator.includes('arcsecs_contact_menu_item_id'), 'contact menu option is stored');

['mike@ns12.com', '(630) 362-7576', '+1-630-362-7576', 'Cicero, Illinois / Chicago area', 'https://mikekappel.com/', 'Senior Software Engineer / Software Architect'].forEach((needle) => {
  assert(activator.includes(needle), `contact page includes ${needle}`);
});

['C#', 'ASP.NET Core', 'SQL Server', 'TypeScript', 'semantic search', 'AI-assisted engineering', 'legacy modernization', 'testing strategy'].forEach((needle) => {
  assert(activator.includes(needle), `background includes ${needle}`);
});

['US Bank', 'Authorize.Net', 'City of Chicago', 'Chicago Airport System'].forEach((forbidden) => {
  assert(!activator.includes(forbidden), `contact page avoids exact employer/client name ${forbidden}`);
});

assert(activator.includes('does not claim ArcSecs is proven'), 'contact page includes proof boundary');
assert(activator.includes('does not present speculative simulator output as operational capability'), 'contact page includes operational-capability boundary');
assert(css.includes('v5.8.36 Contact page live polish'), 'contact CSS exists');
assert(ts.includes('ArcSecsMichaelKappelContactPageMetadata'), 'TypeScript contact metadata contract exists');
assert(read('docs/michael-kappel-contact-page.md').includes('without exact employer or client names'), 'contact page docs mention no employer names');
assert(read('.uai/short-term-memory.uai').includes('v5.8.36 Contact Page Live Verification Notes'), '.uai short-term memory current');
assert(read('.uai/exports/llms-full.txt').includes('Contact Michael Kappel'), '.uai llms full current');

console.log('v5.8.36 Contact Page Live Verification Notes checks passed.');
