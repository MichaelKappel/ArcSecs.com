<?php
$root = dirname(__DIR__, 2);

function arcsecs_distance_time_assert_true($condition, $message) {
    if (!$condition) {
        fwrite(STDERR, $message . PHP_EOL);
        exit(1);
    }
}

$functions = file_get_contents($root . '/functions.php');
$style = file_get_contents($root . '/style.css');
$templatePath = $root . '/template-parts/distance-time-framework.php';
$template = file_exists($templatePath) ? file_get_contents($templatePath) : '';
$home = file_get_contents($root . '/template-parts/home-showcase.php');
$hub = file_get_contents($root . '/template-parts/arcsecs-research-hub.php');
$llms = file_get_contents($root . '/public-root/llms.txt');
$uai = file_get_contents($root . '/.uai/short-term-memory.uai');

arcsecs_distance_time_assert_true(file_exists($templatePath), 'Distance-Time Framework template is missing.');
arcsecs_distance_time_assert_true(strpos($functions, 'ARCSECS_DISTANCE_TIME_FRAMEWORK_PATH') !== false, 'Distance-Time Framework route constant is missing.');
arcsecs_distance_time_assert_true(strpos($functions, "^arcsecs-distance-time-framework/?$") !== false, 'Distance-Time rewrite rule is missing.');
arcsecs_distance_time_assert_true(strpos($functions, 'arcsecs_distance_time_framework') !== false, 'Distance-Time query var/helper functions are missing.');
arcsecs_distance_time_assert_true(strpos($functions, "get_template_part( 'template-parts/distance-time-framework' )") !== false, 'Distance-Time renderer does not load the template.');
arcsecs_distance_time_assert_true(strpos($functions, "'path'        => 'arcsecs-distance-time-framework/'") !== false, 'Distance-Time SEO route entry is missing.');
arcsecs_distance_time_assert_true(strpos($functions, 'arcsecs_distance_time_framework_schema_graph') !== false, 'Distance-Time schema helper is missing.');
arcsecs_distance_time_assert_true(strpos($functions, 'arcsecs_distance_time_framework_metadata') !== false, 'Distance-Time metadata function is missing.');

$requiredTemplateStrings = array(
    'Measuring the Universe Without Lightyears or Local Clocks',
    'Distance can be geometric before it is optical.',
    'A clock is a probe, not necessarily the universe’s master timeline.',
    'What caused the delay?',
    'GW170817',
    'GW150914',
    'GW190521',
    'GW190814',
    'How this could fail',
    'Speculative boundary'
);

foreach ($requiredTemplateStrings as $requiredTemplateString) {
    arcsecs_distance_time_assert_true(strpos($template, $requiredTemplateString) !== false, 'Missing Distance-Time template string: ' . $requiredTemplateString);
}

$requiredTemplateStringsV539 = array(
    'The Distance-Time Kernel.',
    'RelationalDistanceEstimate',
    'UniversalProgressionEstimate',
    'GravityWavefront',
    'PhotonWavefront',
    'Claim → Visual demo → Telemetry → Validation → Export → Falsification path',
    'Synthetic Nearby Binary Neutron Star',
    'Synthetic Void-Line-of-Sight Event',
    'Synthetic Dense-Filament Event',
    'Synthetic AGN-Disk Diffusion Event',
    'Synthetic Missing-Counterpart Event',
    'A framework is only useful if it can fail.',
    'Not lightyears first. Not clocks first. Relations first. Then test it.',
);

foreach ($requiredTemplateStringsV539 as $requiredTemplateStringV539) {
    arcsecs_distance_time_assert_true(strpos($template, $requiredTemplateStringV539) !== false, 'Missing v5.0.39 Distance-Time template string: ' . $requiredTemplateStringV539);
}

$requiredFiles = array(
    '/docs/ArcSecs Distance-Time Framework Page v5.0.38.md',
    '/docs/ArcSecs Integrated Plugin Implementation Prompt v5.0.38.md',
    '/docs/TypeScript Source Sharing and AI-Agent Handoff v5.0.38.md',
    '/docs/Rethinking Cosmic Measurement Framework.md',
    '/.uai/current-engine-status.uai',
    '/docs/typescript-source-manifest.json',
    '/docs/typescript-source-bundle.ts.txt'
);

foreach ($requiredFiles as $requiredFile) {
    arcsecs_distance_time_assert_true(file_exists($root . $requiredFile), 'Missing Distance-Time supporting file: ' . $requiredFile);
}

$requiredStyleStrings = array(
    'v5.0.38 Distance-Time Framework page',
    '.distance-time-hero',
    '.distance-time-mini-nav',
    '.distance-time-claim-grid',
    '.distance-time-event-grid',
    '.sitewide-distance-time-cta'
);

foreach ($requiredStyleStrings as $requiredStyleString) {
    arcsecs_distance_time_assert_true(strpos($style, $requiredStyleString) !== false, 'Missing Distance-Time CSS string: ' . $requiredStyleString);
}

foreach (array($home, $hub, $functions, $llms, $uai) as $sourceText) {
    arcsecs_distance_time_assert_true(strpos($sourceText, 'arcsecs-distance-time-framework') !== false || strpos($sourceText, 'Distance-Time Framework') !== false, 'A required source does not mention the Distance-Time route.');
}

arcsecs_distance_time_assert_true(stripos($template, 'jquery') === false && stripos($template, 'bootstrap') === false, 'Distance-Time page must not use jQuery or Bootstrap.');


arcsecs_distance_time_assert_true(strpos($functions, 'dateModified') !== false && strpos($functions, 'articleSection') !== false, 'Distance-Time schema date/section metadata is missing.');
$footer = file_get_contents($root . '/footer.php');
arcsecs_distance_time_assert_true(strpos($footer, 'Distance-Time Framework') !== false, 'Footer is missing Distance-Time Framework link.');
arcsecs_distance_time_assert_true(strpos($footer, 'Evidence & Sources') !== false, 'Footer is missing Evidence & Sources link.');
arcsecs_distance_time_assert_true(strpos($style, 'v5.0.39 Distance-Time theme completion sweep') !== false, 'v5.0.39 Distance-Time CSS refinements are missing.');
arcsecs_distance_time_assert_true(file_exists($root . '/docs/ArcSecs Theme Distance-Time Completion v5.0.39.md'), 'v5.0.39 theme completion document is missing.');

arcsecs_distance_time_assert_true(strpos($home, "$" . "distance_time_url = arcsecs_ai_access_url( 'arcsecs-distance-time-framework/' );") !== false, 'Home showcase must define the Distance-Time URL before using it.');
arcsecs_distance_time_assert_true(strpos($home, "'title'   => 'Distance-Time Framework'") !== false, 'Home primary path is missing the Distance-Time Framework card.');
arcsecs_distance_time_assert_true(strpos($hub, 'The eight-step ArcSecs reading path.') !== false, 'Research Hub path heading must reflect eight visible steps.');
arcsecs_distance_time_assert_true(substr_count($hub, 'id="research-hub-primary-path-title"') === 1, 'Research Hub primary path title ID must not be duplicated.');
arcsecs_distance_time_assert_true(strpos($hub, 'Read the Distance-Time Framework:') !== false, 'Research Hub route map is missing Distance-Time Framework.');
arcsecs_distance_time_assert_true(strpos($footer, 'Standard Cosmology vs ArcSecs') !== false, 'Footer is missing Standard Cosmology vs ArcSecs link.');
arcsecs_distance_time_assert_true(strpos($footer, 'Cosmic Anomalies Tracker') !== false, 'Footer is missing Cosmic Anomalies Tracker link.');
arcsecs_distance_time_assert_true(strpos($style, 'v5.0.40 Distance-Time cleanup verification sweep') !== false, 'v5.0.40 Distance-Time cleanup CSS marker is missing.');
arcsecs_distance_time_assert_true(file_exists($root . '/docs/ArcSecs Distance-Time Theme Verification v5.0.40.md'), 'v5.0.40 verification document is missing.');


echo "Distance-Time Framework page source contract passed." . PHP_EOL;
