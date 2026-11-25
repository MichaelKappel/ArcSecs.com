<?php
$root = dirname(__DIR__, 2);

function arcsecs_distance_time_wiring_assert_true($condition, $message) {
    if (!$condition) {
        fwrite(STDERR, $message . PHP_EOL);
        exit(1);
    }
}

$home = file_get_contents($root . '/template-parts/home-showcase.php');
$hub = file_get_contents($root . '/template-parts/arcsecs-research-hub.php');
$footer = file_get_contents($root . '/footer.php');
$functions = file_get_contents($root . '/functions.php');
$style = file_get_contents($root . '/style.css');
$llms = file_get_contents($root . '/public-root/llms.txt');

arcsecs_distance_time_wiring_assert_true(strpos($home, "$" . "distance_time_url = arcsecs_ai_access_url( 'arcsecs-distance-time-framework/' );") !== false, 'Home showcase must define the Distance-Time URL variable before using it.');
arcsecs_distance_time_wiring_assert_true(strpos($home, "'title'   => 'Distance-Time Framework'") !== false, 'Home primary path must include a Distance-Time Framework card.');
arcsecs_distance_time_wiring_assert_true(strpos($home, "'url'     => $" . "distance_time_url") !== false, 'Home primary path Distance-Time card must use the shared Distance-Time URL variable.');
arcsecs_distance_time_wiring_assert_true(substr_count($home, '$' . 'distance_time_url') >= 3, 'Home should use the Distance-Time URL in both the card and CTA.');

arcsecs_distance_time_wiring_assert_true(strpos($hub, 'The eight-step ArcSecs reading path.') !== false, 'Research Hub primary path heading must match the eight visible steps.');
arcsecs_distance_time_wiring_assert_true(substr_count($hub, 'id="research-hub-primary-path-title"') === 1, 'Research Hub must not duplicate the primary path heading ID.');
arcsecs_distance_time_wiring_assert_true(strpos($hub, 'Read the Distance-Time Framework:') !== false, 'Research Hub route map must include the Distance-Time Framework.');
arcsecs_distance_time_wiring_assert_true(strpos($hub, '<strong>Distance-Time Framework</strong><span>No-lightyear distance') !== false, 'Research Hub researcher tools must include Distance-Time Framework.');
arcsecs_distance_time_wiring_assert_true(substr_count($hub, '<section id="researcher-tools"') === 1, 'Research Hub researcher tools section should appear once.');

arcsecs_distance_time_wiring_assert_true(strpos($footer, 'Distance-Time Framework') !== false, 'Footer must include Distance-Time Framework link.');
arcsecs_distance_time_wiring_assert_true(strpos($footer, 'Standard Cosmology vs ArcSecs') !== false, 'Footer must include Standard Cosmology vs ArcSecs link.');
arcsecs_distance_time_wiring_assert_true(strpos($footer, 'Cosmic Anomalies Tracker') !== false, 'Footer must include Cosmic Anomalies Tracker link.');

arcsecs_distance_time_wiring_assert_true(strpos($functions, 'arcsecs-feature-menu-item--distance-time') !== false, 'Required nav links must include the Distance-Time menu class.');
arcsecs_distance_time_wiring_assert_true(strpos($style, 'v5.0.40 Distance-Time cleanup verification sweep') !== false, 'v5.0.40 cleanup CSS marker is missing.');
arcsecs_distance_time_wiring_assert_true(strpos($llms, 'Distance-Time Framework: https://arcsecs.com/arcsecs-distance-time-framework/') !== false, 'llms.txt must include the Distance-Time Framework route.');

arcsecs_distance_time_wiring_assert_true(stripos($home . $hub . $footer, 'jquery') === false, 'Distance-Time theme wiring must not introduce jQuery.');
arcsecs_distance_time_wiring_assert_true(stripos($home . $hub . $footer, 'bootstrap') === false, 'Distance-Time theme wiring must not introduce Bootstrap.');

arcsecs_distance_time_wiring_assert_true(file_exists($root . '/docs/ArcSecs Distance-Time Theme Verification v5.0.40.md'), 'v5.0.40 verification document is missing.');
arcsecs_distance_time_wiring_assert_true(file_exists($root . '/docs/ArcSecs v5.0.40 Release Notes.md'), 'v5.0.40 release notes are missing.');

echo "Distance-Time v5.0.40 theme wiring verification passed." . PHP_EOL;
