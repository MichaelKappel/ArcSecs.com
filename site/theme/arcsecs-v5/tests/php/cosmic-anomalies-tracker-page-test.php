<?php
$root = dirname(__DIR__, 2);

function arcsecs_cosmic_anomalies_assert_true($condition, $message) {
    if (!$condition) {
        fwrite(STDERR, $message . PHP_EOL);
        exit(1);
    }
}

$functions = file_get_contents($root . '/functions.php');
$style = file_get_contents($root . '/style.css');
$templatePath = $root . '/template-parts/cosmic-anomalies-tracker.php';
$template = file_get_contents($templatePath);
$scriptPath = $root . '/assets/js/cosmic-anomalies-tracker.js';
$script = file_get_contents($scriptPath);
$home = file_get_contents($root . '/template-parts/home-showcase.php');
$llms = file_get_contents($root . '/public-root/llms.txt');
$uai = file_get_contents($root . '/.uai/short-term-memory.uai');

arcsecs_cosmic_anomalies_assert_true(file_exists($templatePath), 'Cosmic anomalies tracker template part is missing.');
arcsecs_cosmic_anomalies_assert_true(file_exists($scriptPath), 'Cosmic anomalies tracker JavaScript is missing.');
arcsecs_cosmic_anomalies_assert_true(strpos($functions, "ARCSECS_COSMIC_ANOMALIES_TRACKER_PATH") !== false, 'Cosmic anomalies route constant is missing.');
arcsecs_cosmic_anomalies_assert_true(strpos($functions, "^cosmic-anomalies-tracker/?$") !== false, 'Cosmic anomalies rewrite rule is missing.');
arcsecs_cosmic_anomalies_assert_true(strpos($functions, "arcsecs_cosmic_anomalies_tracker") !== false, 'Cosmic anomalies query variable is missing.');
arcsecs_cosmic_anomalies_assert_true(strpos($functions, "get_template_part( 'template-parts/cosmic-anomalies-tracker' )") !== false, 'Cosmic anomalies render function does not load the template part.');
arcsecs_cosmic_anomalies_assert_true(strpos($functions, 'arcsecs_cosmic_anomalies_tracker_metadata') !== false, 'Cosmic anomalies SEO metadata function is missing.');
arcsecs_cosmic_anomalies_assert_true(strpos($functions, 'arcsecs_cosmic_anomalies_tracker_schema_graph') !== false, 'Cosmic anomalies JSON-LD schema helper is missing.');
arcsecs_cosmic_anomalies_assert_true(strpos($functions, 'TechArticle') !== false && strpos($functions, 'BreadcrumbList') !== false && strpos($functions, 'FAQPage') !== false && strpos($functions, 'HowTo') !== false, 'Required JSON-LD schema types are missing.');
arcsecs_cosmic_anomalies_assert_true(strpos($functions, 'JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE') !== false, 'JSON-LD should be encoded with WordPress JSON helpers.');
arcsecs_cosmic_anomalies_assert_true(strpos($functions, "arcsecs_ai_access_url( 'cosmic-anomalies-tracker/' )") !== false, 'Tracker URL is not exposed through theme helpers.');
arcsecs_cosmic_anomalies_assert_true(strpos($functions, "arcsecs-cosmic-anomalies-tracker") !== false, 'Tracker JavaScript is not enqueued.');
arcsecs_cosmic_anomalies_assert_true(strpos($functions, 'Claim hygiene evidence grading') !== false, 'Claim hygiene schema hasPart is missing.');
arcsecs_cosmic_anomalies_assert_true(strpos($functions, 'Observation-first review mode') !== false, 'Observation-first schema hasPart is missing.');
arcsecs_cosmic_anomalies_assert_true(strpos($functions, 'What do evidence grades mean?') !== false, 'Evidence grade FAQ schema is missing.');
arcsecs_cosmic_anomalies_assert_true(strpos($functions, 'What is observation-first review mode?') !== false, 'Observation-first FAQ schema is missing.');

$requiredTemplateStrings = array(
    'The ArcSecs Cosmic Anomalies Tracker',
    'ArcSecs is an experimental and speculative physics framework.',
    'data-anomalies-search',
    'data-anomalies-category',
    'data-anomalies-status',
    'data-anomalies-evidence',
    'data-evidence-tier',
    'Separate the observation from the interpretation.',
    'Read the sky first, then the theory.',
    'data-anomalies-observation-mode',
    'data-anomalies-speculative-lane',
    'Observation-first off',
    'Established Observation',
    'Boundary Constraint',
    'anomalies-evidence-label',
    'data-anomalies-reset',
    'data-anomalies-card',
    'Hubble Tension',
    'JWST Mature Early Galaxies',
    'SPARC / Galaxy Rotation Curves',
    'El Gordo Cluster Collision',
    'Lithium-7 Problem',
    'Photon Mass / Proca Electrodynamics',
    'Tired Light / Redshift Duality',
    'Dark Matter Drive Implications',
    'Mainstream View',
    'ArcSecs View',
    'Simulation hook',
    'Pressure ledger: what each anomaly costs.',
    'Build a simulation run card.',
    'data-simulation-run-builder',
    'data-simulation-profile-select',
    'data-simulation-profiles',
    'Copy run plan',
    'Failure condition:',
    'Run the Physics Engine Demo',
    'anomalies-hero-banner',
    'cosmic-anomalies-tracker-overview.png',
    'target="_blank" rel="noopener noreferrer"',
    'Conclusion:</strong> test the model, do not worship the model'
);

foreach ($requiredTemplateStrings as $requiredTemplateString) {
    arcsecs_cosmic_anomalies_assert_true(strpos($template, $requiredTemplateString) !== false, 'Missing required tracker template string: ' . $requiredTemplateString);
}

$requiredStyleStrings = array(
    'Cosmic Anomalies Tracker page',
    '.anomalies-hero',
    '.anomalies-mini-nav',
    '.anomalies-dashboard-grid',
    '.anomalies-filter-panel',
    '.anomalies-tracker-grid',
    '.anomalies-ledger-grid',
    '.anomalies-claim-ladder',
    '.anomalies-claim-step',
    '.anomalies-review-grid',
    '.anomalies-filter-mode',
    '.anomalies-observation-mode',
    '.anomalies-evidence-label',
    '.anomalies-run-builder',
    '.anomalies-run-card',
    '.anomalies-meter',
    '.anomalies-status--mainstream-active-debate',
    '.anomalies-status--arcsecs-simulation-target',
    '@media (max-width: 780px)'
);

foreach ($requiredStyleStrings as $requiredStyleString) {
    arcsecs_cosmic_anomalies_assert_true(strpos($style, $requiredStyleString) !== false, 'Missing required tracker CSS string: ' . $requiredStyleString);
}

$requiredScriptStrings = array(
    '[data-anomalies-page]',
    '[data-anomalies-search]',
    'updateFilters',
    'navigator.clipboard.writeText',
    'data-anomalies-reading-progress',
    'URLSearchParams',
    'data-anomalies-reset',
    'data-anomalies-evidence',
    'anomalyEvidence',
    'anomalyMode',
    'data-anomalies-observation-mode',
    'anomalies-observation-mode',
    'data-evidence-tier',
    'matchesEvidence',
    'data-simulation-run-builder',
    'formatSimulationPlanText',
    'renderSimulationProfile',
    'JSON.parse',
    'addEventListener'
);

foreach ($requiredScriptStrings as $requiredScriptString) {
    arcsecs_cosmic_anomalies_assert_true(strpos($script, $requiredScriptString) !== false, 'Missing required tracker JavaScript string: ' . $requiredScriptString);
}

arcsecs_cosmic_anomalies_assert_true(strpos($home, "cosmic-anomalies-tracker/") !== false, 'Home page does not link to the cosmic anomalies tracker.');
arcsecs_cosmic_anomalies_assert_true(strpos($llms, 'Cosmic anomalies tracker') !== false, 'Physical llms.txt does not mention the cosmic anomalies tracker.');
arcsecs_cosmic_anomalies_assert_true(strpos($llms, 'claim-hygiene') !== false || strpos($llms, 'claim hygiene') !== false, 'Physical llms.txt does not mention claim hygiene.');
arcsecs_cosmic_anomalies_assert_true(strpos($llms, 'observation-first mode') !== false, 'Physical llms.txt does not mention observation-first mode.');
arcsecs_cosmic_anomalies_assert_true(strpos($functions, "cosmic-anomalies-tracker/") !== false, 'Functions file does not include the cosmic anomalies URL.');
arcsecs_cosmic_anomalies_assert_true(strpos($uai, 'Cosmic Anomalies Tracker') !== false, '.uai does not document the cosmic anomalies tracker package.');
arcsecs_cosmic_anomalies_assert_true(file_exists($root . '/assets/images/cosmic-anomalies-tracker-overview.png'), 'Cosmic anomalies tracker hero overview image is missing.');
arcsecs_cosmic_anomalies_assert_true(file_exists($root . '/docs/cosmic-anomalies-tracker-page.md'), 'Cosmic anomalies tracker docs file is missing.');
arcsecs_cosmic_anomalies_assert_true(file_exists($root . '/docs/Cosmic Anomalies Tracker Content Plan.md'), 'Cosmic anomalies tracker content plan source doc is missing.');
arcsecs_cosmic_anomalies_assert_true(file_exists($root . '/docs/Cosmic Anomalies Tracker Implementation Prompt.md'), 'Cosmic anomalies tracker implementation prompt source doc is missing.');
arcsecs_cosmic_anomalies_assert_true(strlen(trim(file_get_contents($root . '/docs/cosmic-anomalies-tracker-page.md'))) > 1200, 'Cosmic anomalies tracker docs file is too thin.');
arcsecs_cosmic_anomalies_assert_true(stripos($template, 'jquery') === false && stripos($script, 'jquery') === false, 'Cosmic anomalies tracker must not use jQuery.');
arcsecs_cosmic_anomalies_assert_true(stripos($template, 'bootstrap') === false && stripos($script, 'bootstrap') === false, 'Cosmic anomalies tracker must not use Bootstrap.');

// Runtime HTTP, JSON-LD rendering, and console checks should be performed after WordPress installation.
echo "Cosmic anomalies tracker source contract passed." . PHP_EOL;
