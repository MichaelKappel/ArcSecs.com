<?php
$root = dirname(__DIR__, 2);

function arcsecs_v558_assert_true($condition, $message) {
    if (!$condition) {
        fwrite(STDERR, $message . PHP_EOL);
        exit(1);
    }
}

$template = file_get_contents($root . '/template-parts/space-travel-simulation.php');
$style = file_get_contents($root . '/style.css');
$functions = file_get_contents($root . '/functions.php');

arcsecs_v558_assert_true(strpos($style, 'Version: 5.0.58') !== false, 'Theme header must be version 5.0.58.');
arcsecs_v558_assert_true(strpos($functions, "define('ARCSECS_VERSION', '5.0.58')") !== false, 'ARCSECS_VERSION must be 5.0.58.');
arcsecs_v558_assert_true(strpos($functions, "define( 'ARCSECS_AI_ACCESS_THEME_VERSION', '5.0.58' )") !== false, 'AI access theme version must be 5.0.58.');

arcsecs_v558_assert_true(strpos($template, '[arcsecs_space_travel_simulation]') !== false, 'Space Travel shortcode is missing from page template.');
arcsecs_v558_assert_true(strpos($template, 'do_shortcode') !== false, 'Space Travel shortcode must be rendered with do_shortcode.');
arcsecs_v558_assert_true(strpos($template, "shortcode_exists( 'arcsecs_space_travel_simulation' )") !== false, 'Space Travel shortcode availability guard is missing.');
arcsecs_v558_assert_true(strpos($template, 'space-travel-live-simulator') !== false, 'Live simulator section is missing.');
arcsecs_v558_assert_true(strpos($template, 'Simulator plugin shortcode unavailable') !== false, 'Shortcode fallback message is missing.');

$shortcodePosition = strpos($template, 'space-travel-live-simulator');
$pageMapPosition = strpos($template, 'space-travel-page-map');
$contractPosition = strpos($template, 'Telemetry');
arcsecs_v558_assert_true($shortcodePosition !== false && $pageMapPosition !== false && $shortcodePosition < $pageMapPosition, 'Shortcode block must appear before the page-map/article navigation.');
arcsecs_v558_assert_true($shortcodePosition !== false && $contractPosition !== false && $shortcodePosition < $contractPosition, 'Shortcode block must appear before telemetry/export article content.');

arcsecs_v558_assert_true(strpos($style, 'v5.0.58 Space Travel Mission Simulator shortcode placement') !== false, 'v5.0.58 CSS marker is missing.');
arcsecs_v558_assert_true(strpos($style, '.space-travel-shortcode-shell') !== false, 'Shortcode shell CSS is missing.');
arcsecs_v558_assert_true(file_exists($root . '/docs/ArcSecs Space Travel Simulator Shortcode Placement v5.0.58.md'), 'v5.0.58 shortcode placement documentation is missing.');

echo 'ArcSecs v5.0.58 Space Travel shortcode placement verification passed.' . PHP_EOL;
