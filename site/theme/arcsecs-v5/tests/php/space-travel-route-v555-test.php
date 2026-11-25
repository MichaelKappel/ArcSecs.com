<?php
$root = dirname(__DIR__, 2);
$functions = file_get_contents($root . '/functions.php');
$template = file_get_contents($root . '/template-parts/space-travel-simulation.php');
$style = file_get_contents($root . '/style.css');
$llms = file_get_contents($root . '/public-root/llms.txt');

function arcsecs_v555_assert_true($condition, $message) {
    if (!$condition) {
        fwrite(STDERR, $message . PHP_EOL);
        exit(1);
    }
}

arcsecs_v555_assert_true(strpos($style, 'Version: 5.0.58') !== false, 'Theme header must be version 5.0.58.');
arcsecs_v555_assert_true(strpos($functions, "define('ARCSECS_VERSION', '5.0.58')") !== false, 'ARCSECS_VERSION must be 5.0.58.');
arcsecs_v555_assert_true(strpos($functions, "ARCSECS_SPACE_TRAVEL_SIMULATION_PATH") !== false, 'Missing Space Travel route constant.');
arcsecs_v555_assert_true(strpos($functions, "^space-travel-simulation/?$") !== false, 'Missing Space Travel rewrite rule.');
arcsecs_v555_assert_true(strpos($functions, "arcsecs_space_travel_simulation") !== false, 'Missing Space Travel query var.');
arcsecs_v555_assert_true(strpos($functions, "arcsecs_render_space_travel_simulation_page") !== false, 'Missing Space Travel render function.');
arcsecs_v555_assert_true(strpos($functions, "space-travel-simulation/") !== false, 'Missing Space Travel SEO/menu path.');
arcsecs_v555_assert_true(file_exists($root . '/template-parts/space-travel-simulation.php'), 'Missing Space Travel template part.');
arcsecs_v555_assert_true(strpos($template, 'Theme bridge only') !== false, 'Template must state theme/plugin boundary.');
arcsecs_v555_assert_true(strpos($template, 'Open DM Drive') !== false, 'Template must link to DM Drive.');
arcsecs_v555_assert_true(strpos($template, 'Open Physics Demo') !== false, 'Template must link to Physics Demo.');
arcsecs_v555_assert_true(strpos($style, 'v5.0.58 Space Travel Simulation 404 bridge route') !== false, 'Missing v5.0.58 CSS marker.');
arcsecs_v555_assert_true(strpos($llms, 'v5.0.58 Space Travel route restore') !== false, 'llms.txt missing Space Travel restore note.');
arcsecs_v555_assert_true(file_exists($root . '/docs/ArcSecs Space Travel Route Restore v5.0.58.md'), 'Missing v5.0.58 docs report.');
arcsecs_v555_assert_true(stripos($template, 'jquery') === false && stripos($template, 'bootstrap') === false, 'Space Travel template must not introduce jQuery or Bootstrap.');

echo 'ArcSecs v5.0.58 Space Travel route verification passed.' . PHP_EOL;
