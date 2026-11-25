<?php
$root = dirname(__DIR__, 2);

function arcsecs_research_hub_assert_true($condition, $message) {
    if (!$condition) {
        fwrite(STDERR, $message . PHP_EOL);
        exit(1);
    }
}

$functions = file_get_contents($root . '/functions.php');
$style = file_get_contents($root . '/style.css');
$templatePath = $root . '/template-parts/arcsecs-research-hub.php';
$template = file_get_contents($templatePath);
$home = file_get_contents($root . '/template-parts/home-showcase.php');
$llms = file_get_contents($root . '/public-root/llms.txt');

arcsecs_research_hub_assert_true(file_exists($templatePath), 'Research hub template part is missing.');
arcsecs_research_hub_assert_true(strpos($functions, "ARCSECS_RESEARCH_HUB_PATH") !== false, 'Research hub route constant is missing.');
arcsecs_research_hub_assert_true(strpos($functions, "^arcsecs-research-hub/?$") !== false, 'Research hub rewrite rule is missing.');
arcsecs_research_hub_assert_true(strpos($functions, "arcsecs_research_hub") !== false, 'Research hub query variable is missing.');
arcsecs_research_hub_assert_true(strpos($functions, "get_template_part( 'template-parts/arcsecs-research-hub' )") !== false, 'Research hub render function does not load the template part.');
arcsecs_research_hub_assert_true(strpos($functions, 'arcsecs_research_hub_metadata') !== false, 'Research hub SEO metadata function is missing.');
arcsecs_research_hub_assert_true(strpos($functions, 'arcsecs_research_hub_schema_graph') !== false, 'Research hub schema helper is missing.');
arcsecs_research_hub_assert_true(strpos($functions, 'CollectionPage') !== false && strpos($functions, 'ItemList') !== false && strpos($functions, 'BreadcrumbList') !== false && strpos($functions, 'FAQPage') !== false, 'Research hub schema types are missing.');
arcsecs_research_hub_assert_true(strpos($functions, "arcsecs_ai_access_url( 'arcsecs-research-hub/' )") !== false, 'Research hub URL is not exposed through helpers.');
arcsecs_research_hub_assert_true(strpos($functions, "arcsecs-research-hub/") !== false, 'Research hub route is not referenced in functions.');

$requiredTemplateStrings = array(
    'The ArcSecs Research Hub',
    'Start Here',
    'New to ArcSecs?',
    'Compare the Physics',
    'Track Cosmic Anomalies',
    'Run the Simulation',
    'Explore Propulsion Concepts',
    'For AI / Researchers',
    'research-hub-card-grid',
    'research-hub-route-list',
    'research-hub-tool-grid',
    'arcsecs-physics-engine-demo/',
    'standard-cosmology-vs-arcsecs/',
    'cosmic-anomalies-tracker/',
    'llms.txt',
    'arcsecs-sitemap.xml',
    'Scientific boundary:'
);

foreach ($requiredTemplateStrings as $requiredTemplateString) {
    arcsecs_research_hub_assert_true(strpos($template, $requiredTemplateString) !== false, 'Missing required research hub template string: ' . $requiredTemplateString);
}

$requiredStyleStrings = array(
    'ArcSecs Research Hub / Start Here page',
    '.research-hub-hero',
    '.research-hub-card-grid',
    '.research-hub-mini-nav',
    '.research-hub-route-list',
    '.research-hub-tool-grid',
    '.sitewide-research-cta',
    '@media (max-width: 720px)'
);

foreach ($requiredStyleStrings as $requiredStyleString) {
    arcsecs_research_hub_assert_true(strpos($style, $requiredStyleString) !== false, 'Missing required research hub CSS string: ' . $requiredStyleString);
}

arcsecs_research_hub_assert_true(strpos($home, 'sitewide-research-cta') !== false, 'Home page sitewide CTA strip is missing.');
arcsecs_research_hub_assert_true(strpos($home, "arcsecs-research-hub/") !== false, 'Home page does not link to the research hub.');
arcsecs_research_hub_assert_true(strpos($llms, 'Research hub / Start Here') !== false, 'Physical llms.txt does not mention the research hub.');
arcsecs_research_hub_assert_true(file_exists($root . '/docs/arcsecs-research-hub-page.md'), 'Research hub docs file is missing.');
arcsecs_research_hub_assert_true(stripos($template, 'jquery') === false, 'Research hub template must not use jQuery.');
arcsecs_research_hub_assert_true(stripos($template, 'bootstrap') === false, 'Research hub template must not use Bootstrap.');

echo "ArcSecs Research Hub source contract passed." . PHP_EOL;
