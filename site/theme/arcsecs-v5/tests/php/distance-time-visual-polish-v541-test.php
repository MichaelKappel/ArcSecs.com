<?php
$root = dirname(__DIR__, 2);

function arcsecs_distance_time_visual_assert_true($condition, $message) {
    if (!$condition) {
        fwrite(STDERR, $message . PHP_EOL);
        exit(1);
    }
}

$template = file_get_contents($root . '/template-parts/distance-time-framework.php');
$style = file_get_contents($root . '/style.css');
$footer = file_get_contents($root . '/footer.php');
$home = file_get_contents($root . '/template-parts/home-showcase.php');
$hub = file_get_contents($root . '/template-parts/arcsecs-research-hub.php');

arcsecs_distance_time_visual_assert_true(strpos($template, 'distance-time-signal-preview') !== false, 'Distance-Time hero must include the static signal preview.');
arcsecs_distance_time_visual_assert_true(strpos($template, 'Theme preview only. The plugin owns the live viewport and event theater.') !== false, 'Static signal preview must clearly preserve the plugin/theme boundary.');
arcsecs_distance_time_visual_assert_true(strpos($template, 'distance-time-readiness-band') !== false, 'Distance-Time page must include the readiness band.');
arcsecs_distance_time_visual_assert_true(strpos($template, 'distance-time-primary-action') !== false, 'Distance-Time page must mark the primary CTA for hierarchy.');

$requiredCssMarkers = array(
    'v5.0.41 Distance-Time live visual polish sweep',
    '.distance-time-signal-preview',
    '.distance-time-readiness-band',
    '@media (max-width: 760px)',
    '@media (max-width: 520px)',
    '.arcsecs-footer-framework-links'
);

foreach ($requiredCssMarkers as $marker) {
    arcsecs_distance_time_visual_assert_true(strpos($style, $marker) !== false, 'Missing v5.0.41 polish CSS marker: ' . $marker);
}

arcsecs_distance_time_visual_assert_true(strpos($style, '.distance-time-hero__actions .arcsecs-button') !== false, 'Hero CTA wrapping CSS is missing.');
arcsecs_distance_time_visual_assert_true(strpos($style, '.distance-time-mini-nav') !== false, 'Mini-nav responsive CSS is missing.');
arcsecs_distance_time_visual_assert_true(strpos($style, '.distance-time-method-grid,') !== false, 'Card grid responsive CSS is missing.');
arcsecs_distance_time_visual_assert_true(strpos($style, 'grid-template-columns: 1fr;') !== false, 'Mobile single-column fallback is missing.');

arcsecs_distance_time_visual_assert_true(strpos($footer, 'arcsecs-footer-framework-links') !== false, 'Footer framework links must remain present.');
arcsecs_distance_time_visual_assert_true(strpos($home, 'Distance-Time Framework') !== false, 'Homepage must remain wired to Distance-Time Framework.');
arcsecs_distance_time_visual_assert_true(strpos($hub, 'Distance-Time Framework') !== false, 'Research Hub must remain wired to Distance-Time Framework.');

arcsecs_distance_time_visual_assert_true(stripos($template . $style . $footer . $home . $hub, 'jquery') === false, 'v5.0.41 visual polish must not introduce jQuery.');
arcsecs_distance_time_visual_assert_true(stripos($template . $style . $footer . $home . $hub, 'bootstrap') === false, 'v5.0.41 visual polish must not introduce Bootstrap.');

arcsecs_distance_time_visual_assert_true(file_exists($root . '/docs/ArcSecs Distance-Time Live Visual Polish v5.0.41.md'), 'v5.0.41 visual polish document is missing.');
arcsecs_distance_time_visual_assert_true(file_exists($root . '/docs/ArcSecs v5.0.41 Release Notes.md'), 'v5.0.41 release notes are missing.');

echo "Distance-Time v5.0.41 visual polish verification passed." . PHP_EOL;
