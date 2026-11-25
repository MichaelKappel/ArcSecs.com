<?php
$root = dirname(__DIR__, 2);

function arcsecs_distance_time_export_assert_true($condition, $message) {
    if (!$condition) {
        fwrite(STDERR, $message . PHP_EOL);
        exit(1);
    }
}

$template = file_get_contents($root . '/template-parts/distance-time-framework.php');
$style = file_get_contents($root . '/style.css');
$functions = file_get_contents($root . '/functions.php');
$uai = file_get_contents($root . '/.uai/short-term-memory.uai');
$llms = file_get_contents($root . '/public-root/llms.txt');

$requiredTemplateStrings = array(
    'id="evidence-exports"',
    'Exportable evidence packets',
    'Benchmark JSON',
    'Calibration Certificate',
    'Quality Gate',
    'Operator Runbook',
    'Evidence Packet',
    'Research Bundle',
    'Scene JSON',
    'Live run → Telemetry snapshot → Validation result → Evidence export → Falsification path',
    'this section documents the expected export products. The actual export builders',
);

foreach ($requiredTemplateStrings as $requiredTemplateString) {
    arcsecs_distance_time_export_assert_true(strpos($template, $requiredTemplateString) !== false, 'Missing v5.0.42 Distance-Time export evidence template string: ' . $requiredTemplateString);
}

arcsecs_distance_time_export_assert_true(strpos($template, '<a href="#evidence-exports">Evidence exports</a>') !== false, 'Mini nav must link to the evidence exports section.');

$requiredStyleStrings = array(
    'v5.0.42 Distance-Time export evidence documentation sweep',
    '.distance-time-evidence-exports',
    '.distance-time-export-chain',
    '.distance-time-export-grid',
    '.distance-time-boundary--exports',
);

foreach ($requiredStyleStrings as $requiredStyleString) {
    arcsecs_distance_time_export_assert_true(strpos($style, $requiredStyleString) !== false, 'Missing v5.0.42 export evidence CSS marker: ' . $requiredStyleString);
}

$requiredSeoStrings = array(
    'exportable evidence packets',
    'Benchmark JSON',
    'Calibration Certificate',
    'Evidence Packet',
    'Research Bundle',
    'Scene JSON',
);

foreach ($requiredSeoStrings as $requiredSeoString) {
    arcsecs_distance_time_export_assert_true(strpos($functions, $requiredSeoString) !== false, 'Missing v5.0.42 SEO/schema export evidence string: ' . $requiredSeoString);
}

arcsecs_distance_time_export_assert_true(strpos($uai, 'v5.0.42 Distance-Time export evidence documentation') !== false, 'v5.0.42 UAI memory update is missing.');
arcsecs_distance_time_export_assert_true(strpos($llms, 'Exportable Evidence Packets') !== false, 'llms.txt must mention the exportable evidence packet section.');
arcsecs_distance_time_export_assert_true(file_exists($root . '/docs/ArcSecs Distance-Time Export Evidence v5.0.42.md'), 'v5.0.42 export evidence document is missing.');
arcsecs_distance_time_export_assert_true(file_exists($root . '/docs/ArcSecs v5.0.42 Release Notes.md'), 'v5.0.42 release notes are missing.');

arcsecs_distance_time_export_assert_true(stripos($template . $style, 'jquery') === false, 'v5.0.42 export evidence polish must not introduce jQuery.');
arcsecs_distance_time_export_assert_true(stripos($template . $style, 'bootstrap') === false, 'v5.0.42 export evidence polish must not introduce Bootstrap.');

echo "Distance-Time v5.0.42 export evidence documentation verification passed." . PHP_EOL;
