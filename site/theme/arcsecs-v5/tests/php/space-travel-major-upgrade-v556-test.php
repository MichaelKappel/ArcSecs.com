<?php
$root = dirname(__DIR__, 2);
$template = file_get_contents($root . '/template-parts/space-travel-simulation.php');
$functions = file_get_contents($root . '/functions.php');
$style = file_get_contents($root . '/style.css');
$llms = file_get_contents($root . '/public-root/llms.txt');

function arcsecs_v556_assert_true($condition, $message) {
    if (!$condition) {
        fwrite(STDERR, $message . PHP_EOL);
        exit(1);
    }
}

arcsecs_v556_assert_true(strpos($style, 'Version: 5.0.58') !== false, 'Theme header must be version 5.0.58.');
arcsecs_v556_assert_true(strpos($functions, "define('ARCSECS_VERSION', '5.0.58')") !== false, 'ARCSECS_VERSION must be 5.0.58.');
arcsecs_v556_assert_true(strpos($functions, 'Space Travel Simulation: Ship Transit Through Dense Substrate, Void Corridors, and Torsion Fields') !== false, 'SEO title is missing.');
arcsecs_v556_assert_true(strpos($functions, 'ArcSecs speculative research page explaining a space travel simulation through dense-substrate fuel harvesting') !== false, 'Meta description is missing.');
arcsecs_v556_assert_true(strpos($functions, "'@type'            => 'TechArticle'") !== false, 'TechArticle JSON-LD graph is missing.');
arcsecs_v556_assert_true(strpos($functions, "'@type'      => 'FAQPage'") !== false, 'FAQPage JSON-LD graph is missing.');
arcsecs_v556_assert_true(strpos($template, 'Dense substrate: high fuel, high risk') !== false, 'Dense substrate mission model is missing.');
arcsecs_v556_assert_true(strpos($template, 'Void corridor: smoother coasting, weaker fuel') !== false, 'Void corridor mission model is missing.');
arcsecs_v556_assert_true(strpos($template, 'The 2D map is an instrument mask, not literal space') !== false, 'Instrument-mask explanation is missing.');
arcsecs_v556_assert_true(strpos($template, 'Pilot loop: sense, choose, coast, harvest, verify') !== false, 'Pilot loop story flow is missing.');
arcsecs_v556_assert_true(strpos($template, 'Relational / no-spacetime framing') !== false, 'Research stack relational card is missing.');
arcsecs_v556_assert_true(strpos($template, 'Teleparallel torsion') !== false, 'Teleparallel torsion card is missing.');
arcsecs_v556_assert_true(strpos($template, 'Proca substrate') !== false, 'Proca substrate card is missing.');
arcsecs_v556_assert_true(strpos($template, 'Mass-Polariton transfer') !== false, 'Mass-Polariton card is missing.');
arcsecs_v556_assert_true(strpos($template, 'EIT / Dark-State Polariton capture') !== false, 'EIT / Dark-State Polariton card is missing.');
arcsecs_v556_assert_true(strpos($template, 'Ramscoop vortex') !== false, 'Ramscoop vortex card is missing.');
arcsecs_v556_assert_true(strpos($template, 'Telemetry and export contract expectations') !== false, 'Telemetry/export contract section is missing.');
arcsecs_v556_assert_true(strpos($template, 'How the model should be challenged') !== false, 'Falsification-first section is missing.');
arcsecs_v556_assert_true(strpos($template, '/dark-matter-drive-simulator/') !== false || strpos($template, '$drive_url') !== false, 'Dark Matter Drive link is missing.');
arcsecs_v556_assert_true(strpos($template, 'arcsecs-physics-engine-demo') !== false || strpos($template, '$demo_url') !== false, 'Physics Engine Demo link is missing.');
arcsecs_v556_assert_true(strpos($template, 'arcsecs-distance-time-framework') !== false || strpos($template, '$distance_url') !== false, 'Distance-Time Framework link is missing.');
arcsecs_v556_assert_true(strpos($style, 'space-travel-table-wrap') !== false && strpos($style, 'overflow-x: auto') !== false, 'Mobile table overflow styling is missing.');
arcsecs_v556_assert_true(stripos($template, 'jquery') === false && stripos($template, 'bootstrap') === false, 'Template must not introduce jQuery or Bootstrap.');
arcsecs_v556_assert_true(strpos($llms, 'v5.0.58 Space Travel Simulation major page upgrade') !== false, 'llms.txt v5.0.58 note is missing.');
arcsecs_v556_assert_true(file_exists($root . '/docs/ArcSecs Space Travel Simulation Major Page Upgrade v5.0.58.md'), 'v5.0.58 documentation is missing.');

echo 'ArcSecs v5.0.58 Space Travel Simulation major page verification passed.' . PHP_EOL;
