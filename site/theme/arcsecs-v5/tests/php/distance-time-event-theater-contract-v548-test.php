<?php
$root = dirname(__DIR__, 2);

function arcsecs_v548_assert_true($condition, $message) {
    if (!$condition) {
        fwrite(STDERR, $message . PHP_EOL);
        exit(1);
    }
}

$template = file_get_contents($root . '/template-parts/distance-time-framework.php');
$functions = file_get_contents($root . '/functions.php');
$llms = file_get_contents($root . '/public-root/llms.txt');
$uai = file_get_contents($root . '/.uai/short-term-memory.uai');
$style = file_get_contents($root . '/style.css');

$requiredAnchors = array(
    'GW170817',
    'GW150914',
    'GW190521',
    'Supernova Light-Curve Stretch',
    'Hubble Tension',
    'GW190814',
    'Synthetic Nearby Binary Neutron Star',
    'Synthetic Void-Line-of-Sight Event',
    'Synthetic Dense-Filament Event',
    'Synthetic AGN-Disk Diffusion Event',
    'Synthetic Missing-Counterpart Event'
);

foreach ($requiredAnchors as $requiredAnchor) {
    arcsecs_v548_assert_true(strpos($template, $requiredAnchor) !== false, 'Missing Event Theater anchor on public page: ' . $requiredAnchor);
}

arcsecs_v548_assert_true(strpos($template, 'pressure-test for whether optical stretch can be modeled as photon propagation/degradation rather than foundational time dilation') !== false, 'Missing Supernova Light-Curve Stretch explanation.');
arcsecs_v548_assert_true(strpos($template, 'comparison case for optical-distance history versus gravity/geometric baseline measurements') !== false, 'Missing Hubble Tension explanation.');
arcsecs_v548_assert_true(strpos($functions, 'Supernova Light-Curve Stretch') !== false, 'Distance-Time schema/metadata is missing Supernova Light-Curve Stretch.');
arcsecs_v548_assert_true(strpos($functions, 'Hubble Tension') !== false, 'Distance-Time schema/metadata is missing Hubble Tension.');
arcsecs_v548_assert_true(strpos($llms, 'v5.0.58 Distance-Time Event Theater anchor alignment') !== false, 'llms.txt is missing v5.0.58 Event Theater alignment note.');
arcsecs_v548_assert_true(strpos($uai, 'v5.0.58 Distance-Time Event Theater anchor alignment') !== false, '.uai short-term memory is missing v5.0.58 Event Theater alignment note.');
arcsecs_v548_assert_true(strpos($style, 'v5.0.58 Distance-Time Event Theater contract anchor alignment') !== false, 'v5.0.58 CSS marker is missing.');
arcsecs_v548_assert_true(stripos($template, 'jquery') === false && stripos($template, 'bootstrap') === false, 'Distance-Time template must not introduce jQuery or Bootstrap.');
arcsecs_v548_assert_true(file_exists($root . '/docs/ArcSecs Distance-Time Event Theater Anchor Alignment v5.0.58.md'), 'v5.0.58 Event Theater alignment documentation is missing.');

echo "ArcSecs v5.0.58 Distance-Time Event Theater contract verification passed." . PHP_EOL;
