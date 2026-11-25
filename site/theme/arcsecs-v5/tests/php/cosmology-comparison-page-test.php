<?php
$root = dirname(__DIR__, 2);

function arcsecs_cosmology_assert_true($condition, $message) {
    if (!$condition) {
        fwrite(STDERR, $message . PHP_EOL);
        exit(1);
    }
}

$functions = file_get_contents($root . '/functions.php');
$style = file_get_contents($root . '/style.css');
$templatePath = $root . '/template-parts/standard-cosmology-comparison.php';
$template = file_get_contents($templatePath);
$home = file_get_contents($root . '/template-parts/home-showcase.php');
$uai = file_get_contents($root . '/.uai/short-term-memory.uai');

arcsecs_cosmology_assert_true(file_exists($templatePath), 'Cosmology comparison template part is missing.');
arcsecs_cosmology_assert_true(file_exists($root . '/assets/images/standard-cosmology-vs-arcsecs-comparison.png'), 'Cosmology comparison overview image is missing.');
arcsecs_cosmology_assert_true(strpos($functions, "ARCSECS_COSMOLOGY_COMPARISON_PATH") !== false, 'Cosmology comparison route constant is missing.');
arcsecs_cosmology_assert_true(strpos($functions, "^standard-cosmology-vs-arcsecs/?$") !== false, 'Cosmology comparison rewrite rule is missing.');
arcsecs_cosmology_assert_true(strpos($functions, "arcsecs_cosmology_comparison") !== false, 'Cosmology comparison query variable is missing.');
arcsecs_cosmology_assert_true(strpos($functions, "get_template_part( 'template-parts/standard-cosmology-comparison' )") !== false, 'Cosmology comparison render function does not load the template part.');
arcsecs_cosmology_assert_true(strpos($functions, 'arcsecs_cosmology_comparison_metadata') !== false, 'Cosmology comparison SEO metadata function is missing.');
arcsecs_cosmology_assert_true(strpos($functions, 'arcsecs_cosmology_comparison_schema_graph') !== false, 'Cosmology comparison JSON-LD schema helper is missing.');
arcsecs_cosmology_assert_true(strpos($functions, 'FAQPage') !== false && strpos($functions, 'BreadcrumbList') !== false && strpos($functions, 'Article') !== false, 'Required JSON-LD schema types are missing.');
arcsecs_cosmology_assert_true(strpos($functions, 'JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE') !== false, 'JSON-LD should be encoded with WordPress JSON helpers.');
arcsecs_cosmology_assert_true(strpos($functions, "arcsecs_ai_access_url( 'standard-cosmology-vs-arcsecs/' )") !== false, 'Cosmology comparison URL is not exposed through theme helpers.');

arcsecs_cosmology_assert_true(strpos($template, 'Standard Cosmology vs. the ArcSecs Speculative Framework') !== false, 'Required page title is missing.');
arcsecs_cosmology_assert_true(strpos($template, 'ΛCDM is the current mainstream scientific model. ArcSecs is a speculative computational framework intended for exploration, simulation, and debate.') !== false, 'Required scientific disclaimer is missing.');
arcsecs_cosmology_assert_true(strpos($template, 'class="cosmology-matrix"') !== false, 'Comparison matrix is missing.');
arcsecs_cosmology_assert_true(strpos($template, 'Run the Physics Engine Demo') !== false, 'Physics Engine Demo CTA is missing.');
arcsecs_cosmology_assert_true(strpos($template, "arcsecs-physics-engine-demo/") !== false || strpos($template, '$demo_url') !== false, 'Physics Engine Demo link is missing.');

$requiredTopics = array(
    'Geometry of space',
    'Vacuum',
    'Inertia',
    'Gravity',
    'Light speed',
    'Photon mass',
    'Redshift',
    'Dark matter',
    'Time dilation',
    'Gravitational lensing',
    'Black holes',
    'Propulsion',
    'Shielding',
    'Simulation architecture',
    'ConstantsManager.ts',
    'CorePhysicsEngine.ts',
    'Proca photon model',
    'Tired-light model',
    'Relational inertia model',
    'Dark matter condensate model',
    'UI telemetry renderer',
    'Jest test coverage',
    'No silent physics contradictions',
    'Prediction pressure ledger',
    'Every bold idea needs a place where it can fail',
    'Baryon acoustic oscillations',
    'Photon mass limits',
    'Translation glossary',
    'Terms readers should not have to decode alone',
    'Suggested five-minute protocol',
    'assets/ts/arcsecs-physics-engine/',
    'cosmology-code-sample',
    'Demo flow',
    'Baseline → one toggle → ledger → failure state'
);

foreach ($requiredTopics as $requiredTopic) {
    arcsecs_cosmology_assert_true(strpos($template, $requiredTopic) !== false, 'Missing required topic: ' . $requiredTopic);
}

arcsecs_cosmology_assert_true(strpos($style, 'Standard Cosmology vs ArcSecs comparison page') !== false, 'Cosmology page CSS block is missing.');
arcsecs_cosmology_assert_true(strpos($style, '.cosmology-mini-nav') !== false, 'Sticky mini navigation CSS is missing.');
arcsecs_cosmology_assert_true(strpos($style, '.cosmology-matrix-wrap') !== false, 'Comparison matrix CSS is missing.');
arcsecs_cosmology_assert_true(strpos($style, '.cosmology-lanes') !== false, 'Comparison lane CSS is missing.');
arcsecs_cosmology_assert_true(strpos($style, '.cosmology-hero-visual') !== false, 'Cosmology hero visual CSS is missing.');
arcsecs_cosmology_assert_true(strpos($style, '.cosmology-highlight-grid') !== false, 'Cosmology highlight grid CSS is missing.');
arcsecs_cosmology_assert_true(strpos($style, '.cosmology-code-sample') !== false, 'TypeScript code sample CSS is missing.');
arcsecs_cosmology_assert_true(strpos($template, 'data-typescript-source-browser') !== false, 'Dynamic TypeScript source browser is missing.');
arcsecs_cosmology_assert_true(strpos($template, 'cosmology-typescript-source') !== false, 'Clickable TypeScript source detail rows are missing.');
arcsecs_cosmology_assert_true(strpos($template, 'Click a file name to view its bundled source') !== false, 'TypeScript browser click instruction is missing.');
arcsecs_cosmology_assert_true(strpos($style, '.cosmology-typescript-source summary') !== false, 'Clickable TypeScript source CSS is missing.');
arcsecs_cosmology_assert_true(strpos($style, '.cosmology-demo-console') !== false, 'Demo console CSS is missing.');
arcsecs_cosmology_assert_true(strpos($template, 'id="observation-checkpoints"') !== false, 'Observation checkpoints section is missing.');
arcsecs_cosmology_assert_true(strpos($template, '#observation-checkpoints') !== false, 'Observation checkpoints nav link is missing.');
arcsecs_cosmology_assert_true(strpos($template, 'CMB and large-scale structure') !== false, 'CMB and large-scale structure checkpoint is missing.');
arcsecs_cosmology_assert_true(strpos($template, 'Supernova time dilation') !== false, 'Supernova time dilation checkpoint is missing.');
arcsecs_cosmology_assert_true(strpos($template, 'Tolman-style dimming') !== false, 'Tolman-style dimming checkpoint is missing.');
arcsecs_cosmology_assert_true(strpos($template, 'Conservation and units ledger') !== false, 'Conservation and units ledger checkpoint is missing.');
arcsecs_cosmology_assert_true(strpos($style, '.cosmology-checkpoint-grid') !== false, 'Observation checkpoint CSS grid is missing.');
arcsecs_cosmology_assert_true(strpos($style, '.cosmology-status--pressure') !== false, 'Observation checkpoint status CSS is missing.');
arcsecs_cosmology_assert_true(strpos($template, 'id="prediction-ledger"') !== false, 'Prediction pressure ledger section is missing.');
arcsecs_cosmology_assert_true(strpos($template, '#prediction-ledger') !== false, 'Prediction pressure ledger nav link is missing.');
arcsecs_cosmology_assert_true(strpos($style, '.cosmology-ledger-wrap') !== false, 'Prediction pressure ledger CSS is missing.');
arcsecs_cosmology_assert_true(strpos($template, 'id="glossary"') !== false, 'Glossary section is missing.');
arcsecs_cosmology_assert_true(strpos($template, '#glossary') !== false, 'Glossary nav link is missing.');
arcsecs_cosmology_assert_true(strpos($style, '.cosmology-glossary-grid') !== false, 'Glossary grid CSS is missing.');
arcsecs_cosmology_assert_true(strpos($functions, 'DefinedTermSet') !== false, 'DefinedTermSet schema is missing.');
arcsecs_cosmology_assert_true(strpos($template, 'data-typescript-source-filter') !== false, 'TypeScript source filter is missing from comparison page.');
arcsecs_cosmology_assert_true(strpos($template, 'data-typescript-source-copy') !== false, 'TypeScript source copy button is missing from comparison page.');
arcsecs_cosmology_assert_true(strpos($template, 'How does the Physics Engine Demo fit into the page?') !== false, 'Visible FAQ is missing the Physics Engine Demo question.');
arcsecs_cosmology_assert_true(strpos($functions, 'og:site_name') !== false, 'Open Graph site name is missing.');
arcsecs_cosmology_assert_true(strpos($functions, 'article:published_time') !== false && strpos($functions, 'article:modified_time') !== false, 'Article Open Graph time metadata is missing.');
arcsecs_cosmology_assert_true(strpos($functions, 'Cosmology checkpoints: CMB and large-scale structure') !== false, 'llms.txt checkpoint summary is missing.');
arcsecs_cosmology_assert_true(strpos($functions, 'Prediction pressure ledger: CMB, BAO') !== false, 'llms.txt prediction ledger summary is missing.');
arcsecs_cosmology_assert_true(strpos($functions, 'Glossary: ΛCDM, Proca electrodynamics') !== false, 'llms.txt glossary summary is missing.');
arcsecs_cosmology_assert_true(strpos($style, "inset: 0;
.hero-bg img") === false, 'Home hero CSS still contains malformed nested .hero-bg img selector.');
arcsecs_cosmology_assert_true(strpos($home, "standard-cosmology-vs-arcsecs/") !== false, 'Home page does not link to the comparison page.');
arcsecs_cosmology_assert_true(strpos($uai, 'Cosmology Comparison Page Package') !== false, '.uai does not document the cosmology comparison package.');

$requiredDocs = array(
    'docs/cosmology-comparison-page-plan.md',
    'docs/cosmology-comparison-content-outline.md',
    'docs/cosmology-comparison-implementation-notes.md',
    'docs/cosmology-comparison-test-plan.md',
    'docs/cosmology-comparison-seo-metadata.md',
    'docs/Cosmology Comparison Page Ideas.md',
    'docs/Cosmology Comparison Implementation Prompt.md'
);

foreach ($requiredDocs as $requiredDoc) {
    $fullPath = $root . '/' . $requiredDoc;
    arcsecs_cosmology_assert_true(file_exists($fullPath), 'Missing required documentation file: ' . $requiredDoc);
    arcsecs_cosmology_assert_true(strlen(trim(file_get_contents($fullPath))) > 900, 'Documentation file is too thin: ' . $requiredDoc);
}

arcsecs_cosmology_assert_true(stripos($template, 'jquery') === false, 'Cosmology template must not use jQuery.');
arcsecs_cosmology_assert_true(stripos($template, 'bootstrap') === false, 'Cosmology template must not use Bootstrap.');

// Lightweight internal-link check for the new template. Dynamic PHP URLs are allowed.
arcsecs_cosmology_assert_true(strpos($template, '#comparison-matrix') !== false, 'Matrix anchor link is missing.');
arcsecs_cosmology_assert_true(strpos($template, '#demo-companion') !== false, 'Demo companion anchor link is missing.');

// The full WordPress route and JSON-LD runtime response must be tested after theme installation.
echo "Cosmology comparison page source contract passed." . PHP_EOL;
