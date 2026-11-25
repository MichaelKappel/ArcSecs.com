<?php
$root = dirname(__DIR__, 2);
$requiredFiles = array(
    'style.css',
    'functions.php',
    'template-parts/home-showcase.php',
    'assets/images/Cosmic_vortex_and_radiant_beams.png',
    'assets/images/Cosmic_vortex_and_radiant_beams.webp',
    'assets/images/redshift-card.png',
    'assets/images/redshift-card.webp',
    'assets/images/photon-mass-card.png',
    'assets/images/photon-mass-card.webp',
    'assets/images/dark-sector-card.png',
    'assets/images/dark-sector-card.webp',
    '.uai/short-term-memory.uai',
    '.uai/startup-packet.uai',
    '.uai/receiver-brief.uai',
    '.uai/intake-outcome-ledger.uai',
    '.uai/file-handoff.uai',
    '.uai/long-term-memory.uai',
    '.uai/wiki-wizard-alignment.uai',
    'docs/AI Memory Package and File Handoff Guide.md',
);
foreach ($requiredFiles as $file) {
    if (!file_exists($root . '/' . $file)) {
        fwrite(STDERR, "Missing required theme-local file: {$file}\n");
        exit(1);
    }
}
$functions = file_get_contents($root . '/functions.php');
$home = file_get_contents($root . '/template-parts/home-showcase.php');
$uai = file_get_contents($root . '/.uai/short-term-memory.uai');
if (strpos($functions, "define('ARCSECS_VERSION', '5.0.58')") === false) {
    fwrite(STDERR, "Theme version constant was not updated to 5.0.58.\n");
    exit(1);
}
if (strpos($functions, 'arcsecs_resolve_theme_asset_urls_in_css') === false) {
    fwrite(STDERR, "Theme asset URL resolver is missing.\n");
    exit(1);
}
if (strpos($functions, 'arcsecs-v5-inline-style-fallback') === false) {
    fwrite(STDERR, "Optional inline stylesheet fallback output is missing.\n");
    exit(1);
}
if (strpos($functions, "apply_filters( 'arcsecs_enable_inline_stylesheet_fallback', false )") === false) {
    fwrite(STDERR, "Inline stylesheet fallback should be opt-in and disabled by default.\n");
    exit(1);
}
if (strpos($home, 'Cosmic_vortex_and_radiant_beams.png') === false || strpos($home, 'redshift-card.png') === false || strpos($home, 'photon-mass-card.png') === false || strpos($home, 'dark-sector-card.png') === false) {
    fwrite(STDERR, "Home template does not render bundled theme-local image tags.\n");
    exit(1);
}
if (strpos($uai, 'everything needed for the public site except the separate ArcSecs Physics Engine Demo plugin') === false) {
    fwrite(STDERR, ".uai does not include the theme-local asset contract.\n");
    exit(1);
}
if (strpos($uai, 'AIWikis raw preservation') === false) {
    fwrite(STDERR, ".uai does not include the AIWikis raw preservation contract.\n");
    exit(1);
}
echo "Theme-local asset and memory contract passed.\n";
