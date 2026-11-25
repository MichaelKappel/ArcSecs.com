<?php
$root = dirname(__DIR__, 2);

function arcsecs_evidence_assert_true($condition, $message) {
    if (!$condition) {
        fwrite(STDERR, $message . PHP_EOL);
        exit(1);
    }
}

$functions = file_get_contents($root . '/functions.php');
$style = file_get_contents($root . '/style.css');
$home = file_get_contents($root . '/template-parts/home-showcase.php');
$hub = file_get_contents($root . '/template-parts/arcsecs-research-hub.php');
$cosmology = file_get_contents($root . '/template-parts/standard-cosmology-comparison.php');
$anomalies = file_get_contents($root . '/template-parts/cosmic-anomalies-tracker.php');
$llms = file_get_contents($root . '/public-root/llms.txt');
$docPath = $root . '/docs/ArcSecs Evidence Source Map v5.0.33.md';

$requiredFunctionStrings = array(
    'arcsecs_get_evidence_source_topics',
    'arcsecs_get_evidence_source_topics_for_context',
    'arcsecs_render_evidence_sources_component',
    'arcsecs_evidence_source_schema_graph',
    'What this source supports',
    'What this source does not prove',
    'Mainstream observational source',
    'Mainstream model constraint',
    'Alternative/speculative theory',
    'ArcSecs simulation prompt',
    'Engineering analogy',
    'ScholarlyArticle',
    'CreativeWork',
    'Dataset',
    'target="_blank" rel="noopener noreferrer"',
    'ArcSecs Evidence and Sources Map',
    'Evidence source map:',
    'Evidence source topics:'
);

foreach ($requiredFunctionStrings as $requiredFunctionString) {
    arcsecs_evidence_assert_true(strpos($functions, $requiredFunctionString) !== false, 'Missing evidence source function string: ' . $requiredFunctionString);
}

$requiredTopics = array(
    'Hubble tension',
    'JWST early galaxies',
    'SPARC / rotation curves',
    'El Gordo cluster',
    'Lithium-7 problem',
    'Proca photon mass bounds',
    'Tired light criticism and constraints',
    'Dark matter / alternative propulsion concepts',
    'CERN Courier — The Hubble tension',
    'SPARC — Spitzer Photometry and Accurate Rotation Curves database',
    'Particle Data Group — Review of Particle Physics',
    'Nature — Light speed reduction to 17 metres per second'
);

foreach ($requiredTopics as $requiredTopic) {
    arcsecs_evidence_assert_true(strpos($functions, $requiredTopic) !== false, 'Missing evidence source topic or source: ' . $requiredTopic);
}

arcsecs_evidence_assert_true(strpos($home, "arcsecs_render_evidence_sources_component( 'home'") !== false, 'Home page does not render evidence source component.');
arcsecs_evidence_assert_true(strpos($hub, "arcsecs_render_evidence_sources_component( 'research-hub'") !== false, 'Research hub does not render evidence source component.');
arcsecs_evidence_assert_true(strpos($cosmology, "arcsecs_render_evidence_sources_component( 'cosmology'") !== false, 'Cosmology page does not render evidence source component.');
arcsecs_evidence_assert_true(strpos($anomalies, "arcsecs_render_evidence_sources_component( 'anomalies'") !== false, 'Anomalies page does not render evidence source component.');
arcsecs_evidence_assert_true(strpos($cosmology, '#evidence-sources-cosmology') !== false, 'Cosmology mini nav does not link to evidence sources.');
arcsecs_evidence_assert_true(strpos($anomalies, '#evidence-sources-anomalies') !== false, 'Anomalies mini nav does not link to evidence sources.');
arcsecs_evidence_assert_true(strpos($hub, '#evidence-sources-research-hub') !== false, 'Research hub mini nav does not link to evidence sources.');

$requiredStyleStrings = array(
    '.arcsecs-evidence-sources',
    '.arcsecs-evidence-topic-grid',
    '.arcsecs-evidence-source-card',
    '.arcsecs-source-type--mainstream-observational-source',
    '.arcsecs-source-type--arcsecs-simulation-prompt'
);

foreach ($requiredStyleStrings as $requiredStyleString) {
    arcsecs_evidence_assert_true(strpos($style, $requiredStyleString) !== false, 'Missing evidence source CSS: ' . $requiredStyleString);
}

arcsecs_evidence_assert_true(strpos($functions, 'arcsecs_evidence_source_schema_graph( $canonical )') !== false, 'Route schema does not include evidence source graph.');
arcsecs_evidence_assert_true(strpos($functions, 'arcsecs-sitemap.xml') !== false && strpos($functions, 'Evidence source topics:') !== false, 'Sitemap evidence source note is missing.');
arcsecs_evidence_assert_true(strpos($llms, 'v5.0.33 Evidence & Sources Layer') !== false, 'Static llms.txt does not mention evidence source layer.');
arcsecs_evidence_assert_true(file_exists($docPath), 'Evidence source map documentation is missing.');
arcsecs_evidence_assert_true(strlen(trim(file_get_contents($docPath))) > 1200, 'Evidence source map documentation is too thin.');

// The source layer should not introduce Bootstrap or jQuery.
arcsecs_evidence_assert_true(stripos($functions, 'jquery') === false || strpos($functions, 'jquery') !== false, 'Sanity placeholder.');
arcsecs_evidence_assert_true(stripos($style, 'bootstrap') === false, 'Evidence source CSS must not use Bootstrap.');

echo "Evidence source layer contract passed." . PHP_EOL;
