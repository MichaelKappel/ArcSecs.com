<?php
$activatorFile = __DIR__ . '/../../includes/class-arcsecs-physics-engine-activator.php';
$pluginFile = __DIR__ . '/../../arcsecs-scientific-physics-engine.php';
$activator = file_get_contents($activatorFile);
$plugin = file_get_contents($pluginFile);
if ($activator === false || $plugin === false) {
    fwrite(STDERR, "Unable to read plugin files.
");
    exit(1);
}
$required = array(
    'create_or_update_contact_page',
    'Contact Michael Kappel',
    'mike@ns12.com',
    '(630) 362-7576',
    'Cicero, Illinois / Chicago area',
    'https://mikekappel.com/',
    'Engineering background',
    'How I can help',
    'Best reasons to reach out',
    'arcsecs_contact_footer_link_metadata',
    'ContactPage',
    'Person',
    'ContactPoint',
    'add_contact_page_to_menu',
    'arcsecs_contact_page_id',
    'arcsecs_contact_menu_item_id',
    'does not claim ArcSecs is proven',
    'does not present speculative simulator output as operational capability',
    'does not force unrelated theme footer behavior'
);
foreach ($required as $needle) {
    if (strpos($activator, $needle) === false) {
        fwrite(STDERR, "Missing contact page marker: {$needle}
");
        exit(1);
    }
}
if (strpos($plugin, 'Version: 5.8.36') === false) {
    fwrite(STDERR, "Plugin identity was not updated to 5.8.36.
");
    exit(1);
}
exit(0);

if (strpos($activator, 'arcsecs_contact_page_live_verification_notes') === false) { fwrite(STDERR, "Contact live verification notes option missing.\n"); exit(1); }
