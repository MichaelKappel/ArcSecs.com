<?php
$root = dirname(__DIR__, 2);

function arcsecs_multi_messenger_assert_true($condition, $message) {
    if (!$condition) {
        fwrite(STDERR, $message . PHP_EOL);
        exit(1);
    }
}

$functions = file_get_contents($root . '/functions.php');
$style = file_get_contents($root . '/style.css');
$templatePath = $root . '/template-parts/multi-messenger-light-delay.php';
$template = file_exists($templatePath) ? file_get_contents($templatePath) : '';
$home = file_get_contents($root . '/template-parts/home-showcase.php');
$hub = file_get_contents($root . '/template-parts/arcsecs-research-hub.php');
$library = file_get_contents($root . '/template-parts/research-library.php');
$comparison = file_get_contents($root . '/template-parts/standard-cosmology-comparison.php');
$anomalies = file_get_contents($root . '/template-parts/cosmic-anomalies-tracker.php');
$siteRepair = file_get_contents($root . '/inc/site-repair.php');
$llms = file_get_contents($root . '/public-root/llms.txt');
$uai = file_get_contents($root . '/.uai/short-term-memory.uai');

arcsecs_multi_messenger_assert_true(file_exists($templatePath), 'Multi-Messenger Light Delay template is missing.');
arcsecs_multi_messenger_assert_true(strpos($functions, 'ARCSECS_MULTI_MESSENGER_LIGHT_DELAY_PATH') !== false, 'Multi-Messenger route constant is missing.');
arcsecs_multi_messenger_assert_true(strpos($functions, "^multi-messenger-light-delay/?$") !== false, 'Multi-Messenger rewrite rule is missing.');
arcsecs_multi_messenger_assert_true(strpos($functions, 'arcsecs_multi_messenger_light_delay') !== false, 'Multi-Messenger query var/helper functions are missing.');
arcsecs_multi_messenger_assert_true(strpos($functions, "get_template_part( 'template-parts/multi-messenger-light-delay' )") !== false, 'Multi-Messenger renderer does not load the template.');
arcsecs_multi_messenger_assert_true(strpos($functions, "'path'        => 'multi-messenger-light-delay/'") !== false, 'Multi-Messenger SEO route entry is missing.');
arcsecs_multi_messenger_assert_true(strpos($functions, 'arcsecs_multi_messenger_light_delay_schema_graph') !== false, 'Multi-Messenger schema helper is missing.');
arcsecs_multi_messenger_assert_true(strpos($functions, 'arcsecs_multi_messenger_light_delay_metadata') !== false, 'Multi-Messenger metadata function is missing.');
arcsecs_multi_messenger_assert_true(strpos($functions, "'slug'        => 'multi-messenger-timing'") !== false, 'Evidence source topic for multi-messenger timing is missing.');

$requiredTemplateStrings = array(
    'Gravity detected first. Light seen later. What does that really test?',
    'GW170817',
    'GW150914',
    'GW190521',
    'Observed lag',
    'source delay + environment delay + candidate propagation delay',
    'multi-messenger-astronomy-event-timeline.png',
    'neutron-star-merger-event-timeline.png',
    'electromagnetic-lag-vs-distance-analysis.png',
    'light-slowing-energy-degeneration-diagram.png',
    'arcsecs_render_evidence_sources_component( \'multi-messenger\'',
    'Open source map',
    'Open DM Drive'
);

foreach ($requiredTemplateStrings as $requiredTemplateString) {
    arcsecs_multi_messenger_assert_true(strpos($template, $requiredTemplateString) !== false, 'Missing Multi-Messenger template string: ' . $requiredTemplateString);
}

$requiredAssets = array(
    '/assets/images/multi-messenger-astronomy-event-timeline.png',
    '/assets/images/neutron-star-merger-event-timeline.png',
    '/assets/images/electromagnetic-lag-vs-distance-analysis.png',
    '/assets/images/light-slowing-energy-degeneration-diagram.png',
    '/docs/Modeling Light Slowing and Energy Degeneration Multi-Messenger Events.md',
    '/docs/Physics Engine Fixes Based on Multi-Messenger Document.md',
    '/docs/ArcSecs Multi-Messenger Light Delay Page v5.0.35.md'
);

foreach ($requiredAssets as $requiredAsset) {
    arcsecs_multi_messenger_assert_true(file_exists($root . $requiredAsset), 'Missing Multi-Messenger asset/doc: ' . $requiredAsset);
}

$requiredStyleStrings = array(
    'v5.0.36 Multi-Messenger Light Delay page',
    '.multi-messenger-hero',
    '.multi-messenger-mini-nav',
    '.multi-messenger-event-grid',
    '.multi-messenger-visual-grid',
    '.multi-messenger-check-grid',
    '.sitewide-messenger-cta'
);

foreach ($requiredStyleStrings as $requiredStyleString) {
    arcsecs_multi_messenger_assert_true(strpos($style, $requiredStyleString) !== false, 'Missing Multi-Messenger CSS string: ' . $requiredStyleString);
}

foreach (array($home, $hub, $library, $comparison, $anomalies, $functions, $siteRepair, $llms, $uai) as $sourceText) {
    arcsecs_multi_messenger_assert_true(strpos($sourceText, 'multi-messenger-light-delay') !== false || strpos($sourceText, 'Multi-Messenger Light Delay') !== false, 'A required source does not mention the Multi-Messenger route.');
}

arcsecs_multi_messenger_assert_true(strpos($functions, 'Multi-Messenger Light Delay') !== false, 'Generated llms/SEO functions do not mention Multi-Messenger Light Delay.');
arcsecs_multi_messenger_assert_true(strpos($siteRepair, '/multi-messenger-light-delay/') !== false, 'Route health dashboard does not include Multi-Messenger route.');
arcsecs_multi_messenger_assert_true(stripos($template, 'jquery') === false && stripos($template, 'bootstrap') === false, 'Multi-Messenger page must not use jQuery or Bootstrap.');

echo "Multi-Messenger Light Delay page source contract passed." . PHP_EOL;
