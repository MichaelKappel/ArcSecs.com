<?php
$root = dirname(__DIR__, 2);
$template = file_get_contents($root . '/template-parts/space-travel-simulation.php');
$style = file_get_contents($root . '/style.css');
$functions = file_get_contents($root . '/functions.php');

function arcsecs_v557_assert_true($condition, $message) {
    if (!$condition) {
        fwrite(STDERR, $message . PHP_EOL);
        exit(1);
    }
}

arcsecs_v557_assert_true(strpos($style, 'Version: 5.0.58') !== false, 'Theme header must be version 5.0.58.');
arcsecs_v557_assert_true(strpos($functions, "define('ARCSECS_VERSION', '5.0.58')") !== false, 'ARCSECS_VERSION must be 5.0.58.');
arcsecs_v557_assert_true(strpos($template, 'space-travel-hero__quick-read') !== false, 'Hero quick-read chips missing.');
arcsecs_v557_assert_true(strpos($template, 'space-travel-hero-readout') !== false, 'Hero readout missing.');
arcsecs_v557_assert_true(strpos($template, 'Open Dark Matter Drive Simulator') !== false, 'Clear DM Drive CTA missing.');
arcsecs_v557_assert_true(strpos($template, 'space-travel-tradeoff') !== false, 'Dense/void tradeoff visual cards missing.');
arcsecs_v557_assert_true(strpos($template, 'space-travel-telemetry-scan') !== false, 'Telemetry quick-scan strip missing.');
arcsecs_v557_assert_true(strpos($style, 'v5.0.58 Space Travel Simulation readability and CTA polish') !== false, 'v5.0.58 CSS marker missing.');
arcsecs_v557_assert_true(strpos($style, '@media (max-width: 620px)') !== false, 'Mobile fallback styles missing.');
arcsecs_v557_assert_true(strpos($functions, "'@type'            => 'TechArticle'") !== false, 'TechArticle JSON-LD marker missing.');
arcsecs_v557_assert_true(strpos($functions, "'@type'      => 'FAQPage'") !== false, 'FAQPage JSON-LD marker missing.');
arcsecs_v557_assert_true(stripos($template, 'proof') !== false, 'Speculative boundary should discuss not claiming proof.');
arcsecs_v557_assert_true(stripos($template, 'jquery') === false && stripos($template, 'bootstrap') === false, 'Template must not add jQuery or Bootstrap.');
arcsecs_v557_assert_true(file_exists($root . '/docs/ArcSecs Space Travel Simulation Polish v5.0.58.md'), 'v5.0.58 polish documentation missing.');

echo 'ArcSecs v5.0.58 Space Travel Simulation polish verification passed.' . PHP_EOL;
