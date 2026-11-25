<?php
$root = dirname(__DIR__, 2);

function arcsecs_v544_assert_true($condition, $message) {
    if (!$condition) {
        fwrite(STDERR, $message . PHP_EOL);
        exit(1);
    }
}

$template = file_get_contents($root . '/template-parts/distance-time-framework.php');
$style = file_get_contents($root . '/style.css');
$footer = file_get_contents($root . '/footer.php');
$shortTerm = file_get_contents($root . '/.uai/short-term-memory.uai');
$handoff = file_get_contents($root . '/.uai/current-state-handoff.uai');
$manifest = file_get_contents($root . '/.uai/exports/manifest.json');
$packageModel = file_get_contents($root . '/.uai/exports/package-model.json');

$requiredStyleMarkers = array(
    'v5.0.44 production screenshot polish',
    '.distance-time-signal-preview__track--gravity .distance-time-signal-preview__line',
    '.distance-time-signal-preview__track--light .distance-time-signal-preview__line',
    '.arcsecs-footer-framework-links--bar',
    '@media (max-width: 760px)'
);

foreach ($requiredStyleMarkers as $requiredStyleMarker) {
    arcsecs_v544_assert_true(strpos($style, $requiredStyleMarker) !== false, 'Missing v5.0.44 CSS marker: ' . $requiredStyleMarker);
}

arcsecs_v544_assert_true(strpos($footer, 'arcsecs-footer-framework-links--bar') !== false, 'Footer framework links must be moved into the responsive footer link bar.');
arcsecs_v544_assert_true(strpos($footer, 'Distance-Time Framework') !== false, 'Footer must keep Distance-Time Framework link.');
arcsecs_v544_assert_true(strpos($footer, 'Evidence & Sources') !== false, 'Footer must keep Evidence & Sources link.');
arcsecs_v544_assert_true(strpos($template, 'Theme preview only. The plugin owns the live viewport and event theater.') !== false, 'Distance-Time hero must preserve theme/plugin boundary language.');
arcsecs_v544_assert_true(strpos($template, 'distance-time-signal-preview') !== false, 'Distance-Time hero signal preview must remain present.');

$requiredMemoryStrings = array(
    'v5.0.44 Current State Handoff and Cross-Site Contract Alignment',
    'DarkMatterDrive.com source-contract work is now an active plugin-verification input',
    'Distance-Time Kernel',
    'Multi-Messenger Event Theater',
    'ExportBuilderHandoff.ts',
    'Do this next'
);

foreach ($requiredMemoryStrings as $requiredMemoryString) {
    arcsecs_v544_assert_true(strpos($shortTerm . $handoff, $requiredMemoryString) !== false, 'Missing v5.0.44 memory/handoff string: ' . $requiredMemoryString);
}

arcsecs_v544_assert_true(file_exists($root . '/docs/ArcSecs Current State Handoff v5.0.44.md'), 'Current state handoff doc is missing.');
arcsecs_v544_assert_true(file_exists($root . '/.uai/current-state-handoff.uai'), 'Current state handoff UAI file is missing.');
arcsecs_v544_assert_true(file_exists($root . '/docs/ArcSecs Production Screenshot Polish v5.0.44.md'), 'Production screenshot polish doc is missing.');
arcsecs_v544_assert_true(file_exists($root . '/docs/ArcSecs v5.0.44 Release Notes.md'), 'v5.0.44 release notes are missing.');
arcsecs_v544_assert_true(strpos($manifest, '5.0.44') !== false, 'Manifest must reference v5.0.44.');
arcsecs_v544_assert_true(strpos($packageModel, 'Production screenshot polish') !== false, 'Package model must describe v5.0.44 polish pass.');

arcsecs_v544_assert_true(stripos($template . $style . $footer, 'jquery') === false, 'v5.0.44 polish must not introduce jQuery.');
arcsecs_v544_assert_true(stripos($template . $style . $footer, 'bootstrap') === false, 'v5.0.44 polish must not introduce Bootstrap.');

echo "Distance-Time v5.0.44 production screenshot polish verification passed." . PHP_EOL;
