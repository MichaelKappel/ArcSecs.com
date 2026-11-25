<?php
$root = dirname(__DIR__, 2);

function arcsecs_performance_assert_true($condition, $message) {
    if (!$condition) {
        fwrite(STDERR, $message . PHP_EOL);
        exit(1);
    }
}

$functions = file_get_contents($root . '/functions.php');
$style = file_get_contents($root . '/style.css');
$home = file_get_contents($root . '/template-parts/home-showcase.php');
$comparison = file_get_contents($root . '/template-parts/standard-cosmology-comparison.php');
$anomalies = file_get_contents($root . '/template-parts/cosmic-anomalies-tracker.php');

arcsecs_performance_assert_true(strpos($functions, "apply_filters( 'arcsecs_enable_inline_stylesheet_fallback', false )") !== false, 'Full inline stylesheet fallback must be disabled by default.');
arcsecs_performance_assert_true(strpos($functions, "wp_script_add_data('arcsecs-navigation', 'defer', true)") !== false, 'Navigation script should be deferred.');
arcsecs_performance_assert_true(strpos($functions, "wp_script_add_data('arcsecs-cosmic-anomalies-tracker', 'defer', true)") !== false, 'Cosmic anomalies script should be deferred.');
arcsecs_performance_assert_true(strpos($functions, "wp_script_add_data('arcsecs-typescript-source-browser', 'defer', true)") !== false, 'TypeScript source browser script should be deferred.');
arcsecs_performance_assert_true(strpos($functions, "arcsecs_is_cosmic_anomalies_tracker_page() ) {") !== false, 'Cosmic anomalies script should be conditionally enqueued.');
arcsecs_performance_assert_true(strpos($functions, 'arcsecs_preload_route_hero_asset') !== false, 'Route hero preload helper is missing.');
arcsecs_performance_assert_true(strpos($functions, 'arcsecs_render_theme_picture') !== false, 'Optimized local picture helper is missing.');
arcsecs_performance_assert_true(strpos($functions, 'arcsecs_theme_webp_url') !== false, 'WebP helper is missing.');
arcsecs_performance_assert_true(strpos($functions, 'wp_cache_get') !== false && strpos($functions, 'wp_cache_set') !== false, 'TypeScript source scan should use WordPress object cache.');
arcsecs_performance_assert_true(strpos($home, 'arcsecs_render_theme_picture') !== false, 'Home images should use optimized picture helper.');
arcsecs_performance_assert_true(strpos($comparison, 'standard-cosmology-vs-arcsecs-comparison.png') !== false && strpos($comparison, 'arcsecs_render_theme_picture') !== false, 'Cosmology hero image should use optimized picture helper.');
arcsecs_performance_assert_true(strpos($anomalies, 'cosmic-anomalies-tracker-overview.png') !== false && strpos($anomalies, 'arcsecs_render_theme_picture') !== false, 'Anomalies hero image should use optimized picture helper.');
arcsecs_performance_assert_true(strpos($style, '.hero-bg picture') !== false, 'Picture element CSS for hero images is missing.');

$requiredWebpAssets = array(
    'assets/images/Cosmic_vortex_and_radiant_beams.webp',
    'assets/images/redshift-card.webp',
    'assets/images/photon-mass-card.webp',
    'assets/images/dark-sector-card.webp',
    'assets/images/standard-cosmology-vs-arcsecs-comparison.webp',
    'assets/images/cosmic-anomalies-tracker-overview.webp',
);
foreach ($requiredWebpAssets as $asset) {
    arcsecs_performance_assert_true(file_exists($root . '/' . $asset), 'Missing optimized WebP asset: ' . $asset);
}

echo "Performance sweep source contract passed." . PHP_EOL;
