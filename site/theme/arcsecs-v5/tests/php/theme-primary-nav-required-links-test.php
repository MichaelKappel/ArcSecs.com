<?php
$root = dirname(__DIR__, 2);
$functions = file_get_contents($root . '/functions.php');
$style = file_get_contents($root . '/style.css');

function arcsecs_nav_assert_true($condition, $message) {
    if (!$condition) {
        fwrite(STDERR, $message . PHP_EOL);
        exit(1);
    }
}

arcsecs_nav_assert_true(strpos($functions, 'function arcsecs_append_required_primary_menu_links') !== false, 'Primary nav required-link function is missing.');
arcsecs_nav_assert_true(strpos($functions, "add_filter( 'wp_nav_menu_items', 'arcsecs_append_required_primary_menu_links'") !== false, 'Primary nav required-link filter is missing.');
arcsecs_nav_assert_true(strpos($functions, 'arcsecs-research-hub/') !== false, 'Research hub route is missing from required nav links.');
arcsecs_nav_assert_true(strpos($functions, 'standard-cosmology-vs-arcsecs/') !== false, 'Standard cosmology route is missing from required nav links.');
arcsecs_nav_assert_true(strpos($functions, 'cosmic-anomalies-tracker/') !== false, 'Cosmic anomalies route is missing from required nav links.');
arcsecs_nav_assert_true(strpos($functions, 'false !== strpos( $items, $required_link[\'path\'] )') !== false, 'Required nav appender should avoid duplicate links.');
arcsecs_nav_assert_true(strpos($functions, 'arcsecs-feature-menu-item--hub') !== false, 'Research hub feature menu class is missing.');
arcsecs_nav_assert_true(strpos($functions, 'arcsecs-feature-menu-item--comparison') !== false, 'Comparison feature menu class is missing.');
arcsecs_nav_assert_true(strpos($functions, 'arcsecs-feature-menu-item--anomalies') !== false, 'Anomalies feature menu class is missing.');
arcsecs_nav_assert_true(strpos($style, '.primary-nav .arcsecs-feature-menu-item > a') !== false, 'Feature menu CSS is missing.');
arcsecs_nav_assert_true(strpos($style, '.primary-nav .arcsecs-feature-menu-item--hub > a') !== false, 'Research hub feature menu CSS is missing.');
arcsecs_nav_assert_true(strpos($style, '.primary-nav .arcsecs-feature-menu-item--anomalies > a') !== false, 'Anomaly feature menu CSS is missing.');

echo "Primary navigation required links source contract passed." . PHP_EOL;
