<?php
$root = dirname(__DIR__, 2);
function arcsecs_dark_drive_assert_true($condition, $message) { if (!$condition) { fwrite(STDERR, $message . PHP_EOL); exit(1); } }
$functions = file_get_contents($root . '/functions.php');
$style = file_get_contents($root . '/style.css');
$home = file_get_contents($root . '/template-parts/home-showcase.php');
$hub = file_get_contents($root . '/template-parts/arcsecs-research-hub.php');
$comparison = file_get_contents($root . '/template-parts/standard-cosmology-comparison.php');
$anomalies = file_get_contents($root . '/template-parts/cosmic-anomalies-tracker.php');
$uai = file_get_contents($root . '/.uai/short-term-memory.uai');
$docs = array('docs/main-site-dark-matter-drive-integration.md','docs/routes-and-internal-linking.md','docs/sitemap-and-llms-ownership.md');
arcsecs_dark_drive_assert_true(strpos($functions, 'ARCSECS_DARK_MATTER_DRIVE_SIMULATOR_PATH') !== false, 'Dark Matter Drive simulator route constant is missing.');
arcsecs_dark_drive_assert_true(strpos($functions, 'arcsecs_dark_matter_drive_simulator_url') !== false, 'Dark Matter Drive URL helper is missing.');
arcsecs_dark_drive_assert_true(strpos($functions, 'dark-matter-drive-simulator/') !== false, 'Dark Matter Drive URL is missing from functions.php.');
arcsecs_dark_drive_assert_true(strpos($functions, "add_rewrite_rule( '^dark-matter-drive-simulator") === false, 'Theme must not create the plugin simulator rewrite rule.');
arcsecs_dark_drive_assert_true(strpos($functions, 'false !== strpos( $items, $required_link') !== false, 'Primary menu duplicate prevention is missing.');
arcsecs_dark_drive_assert_true(strpos($functions, "'path'        => 'dark-matter-drive-simulator/'") !== false && strpos($functions, "'priority'    => '0.96'") !== false, 'Theme-owned sitemap/SEO manifest does not include the simulator discovery URL.');
arcsecs_dark_drive_assert_true(strpos($functions, 'Dark Matter Drive Simulator:' ) !== false, 'Theme-owned llms output does not include the simulator discovery line.');
arcsecs_dark_drive_assert_true(strpos($functions, 'Try the Dark Matter Drive Simulator' ) !== false, 'Physics demo fallback CTA is missing.');
arcsecs_dark_drive_assert_true(strpos($functions, 'relatedLink' ) !== false, 'Demo schema relatedLink for simulator is missing.');
arcsecs_dark_drive_assert_true(strpos($home, 'Run the Dark Matter Drive Simulator') !== false, 'Home page simulator path card is missing.');
arcsecs_dark_drive_assert_true(strpos($home, 'Explore the Dark Matter Drive Simulator') !== false, 'Home page sitewide simulator CTA is missing.');
arcsecs_dark_drive_assert_true(strpos($hub, 'Dark Matter Drive Simulator') !== false, 'Research Hub simulator path card is missing.');
arcsecs_dark_drive_assert_true(strpos($hub, 'Interactive deterministic replay sandbox') !== false, 'Research Hub AI/researcher simulator link is missing.');
arcsecs_dark_drive_assert_true(strpos($comparison, 'Dark Matter Drive Simulator') !== false, 'Cosmology comparison simulator link is missing.');
arcsecs_dark_drive_assert_true(strpos($comparison, 'ramjet capture') !== false && strpos($comparison, 'thermal bottlenecks') !== false, 'Cosmology comparison simulator context is too thin.');
arcsecs_dark_drive_assert_true(strpos($anomalies, 'Dark Matter Drive Simulator') !== false, 'Cosmic anomalies tracker simulator link is missing.');
arcsecs_dark_drive_assert_true(strpos($anomalies, 'massive photon lensing') !== false || strpos($anomalies, 'energy accounting') !== false, 'Cosmic anomalies simulator context is too thin.');
arcsecs_dark_drive_assert_true(strpos($style, '.arcsecs-feature-menu-item--drive') !== false, 'Top navigation drive styling is missing.');
arcsecs_dark_drive_assert_true(strpos($style, '.sitewide-drive-cta') !== false, 'Sitewide drive CTA styling is missing.');
arcsecs_dark_drive_assert_true(strpos($style, '.home-drive-card__panel') !== false, 'Home drive card styling is missing.');
foreach ($docs as $doc) { arcsecs_dark_drive_assert_true(file_exists($root . '/' . $doc), 'Missing dark matter integration doc: ' . $doc); arcsecs_dark_drive_assert_true(strlen(trim(file_get_contents($root . '/' . $doc))) > 900, 'Dark matter integration doc is too thin: ' . $doc); }
arcsecs_dark_drive_assert_true(strpos($uai, '/dark-matter-drive-simulator/') !== false, '.uai short-term memory does not mention the simulator route.');
arcsecs_dark_drive_assert_true(stripos($functions . $home . $hub . $comparison . $anomalies, 'localhost') === false, 'Hardcoded localhost link found.');
arcsecs_dark_drive_assert_true(stripos($home . $hub . $comparison . $anomalies, 'http://arcsecs.com') === false, 'HTTP/HTTPS mismatch found.');
arcsecs_dark_drive_assert_true(stripos($home . $hub . $comparison . $anomalies, 'jquery') === false, 'No jQuery should be added for simulator promotion.');
arcsecs_dark_drive_assert_true(stripos($home . $hub . $comparison . $anomalies, 'bootstrap') === false, 'No Bootstrap should be added for simulator promotion.');
echo "Dark Matter Drive main-site integration contract passed." . PHP_EOL;
