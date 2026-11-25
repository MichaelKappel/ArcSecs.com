<?php
$root = dirname(__DIR__, 2);

function arcsecs_research_library_assert_true($condition, $message) {
    if (!$condition) {
        fwrite(STDERR, $message . PHP_EOL);
        exit(1);
    }
}

$functions = file_get_contents($root . '/functions.php');
$style = file_get_contents($root . '/style.css');
$templatePath = $root . '/template-parts/research-library.php';
$template = file_get_contents($templatePath);
$home = file_get_contents($root . '/template-parts/home-showcase.php');
$hub = file_get_contents($root . '/template-parts/arcsecs-research-hub.php');
$llms = file_get_contents($root . '/public-root/llms.txt');
$uai = file_get_contents($root . '/.uai/short-term-memory.uai');
$docsPath = $root . '/docs/ArcSecs Research Library Source Map v5.0.34.md';

arcsecs_research_library_assert_true(file_exists($templatePath), 'Research Library template is missing.');
arcsecs_research_library_assert_true(strpos($functions, "ARCSECS_RESEARCH_LIBRARY_PATH") !== false, 'Research Library route constant is missing.');
arcsecs_research_library_assert_true(strpos($functions, "^research-library/?$") !== false, 'Research Library rewrite rule is missing.');
arcsecs_research_library_assert_true(strpos($functions, "arcsecs_research_library") !== false, 'Research Library query variable is missing.');
arcsecs_research_library_assert_true(strpos($functions, "get_template_part( 'template-parts/research-library' )") !== false, 'Research Library renderer does not load the template.');
arcsecs_research_library_assert_true(strpos($functions, "'path'        => 'research-library/'") !== false, 'Research Library SEO route entry is missing.');
arcsecs_research_library_assert_true(strpos($functions, 'arcsecs_research_library_schema_graph') !== false, 'Research Library schema helper is missing.');
arcsecs_research_library_assert_true(strpos($functions, 'arcsecs_research_library_metadata') !== false, 'Research Library metadata function is missing.');
arcsecs_research_library_assert_true(strpos($functions, 'arcsecs_research_library_source_type_description') !== false, 'Research Library source-type helper is missing.');
arcsecs_research_library_assert_true(strpos($functions, 'arcsecs_evidence_source_schema_graph') !== false, 'Evidence source schema graph must remain available.');

$requiredTemplateStrings = array(
    'ArcSecs Research Library',
    'A public source map for the observations, constraints, criticisms, speculative models, and engineering analogies behind ArcSecs.',
    'Mainstream observational sources and model constraints remain distinct',
    'Browse Sources',
    'Cosmology pressure points',
    'Galaxy dynamics',
    'Photon mass and Proca constraints',
    'Tired light and redshift checks',
    'Propulsion analogies',
    'Every link carries a role.',
    'arcsecs_render_evidence_sources_component( \'research-library\' )',
    'Open Research Library',
    'Open DM Drive',
    'target="_blank" rel="noopener noreferrer"'
);

foreach ($requiredTemplateStrings as $requiredTemplateString) {
    arcsecs_research_library_assert_true(strpos($template . $functions, $requiredTemplateString) !== false, 'Missing Research Library template string: ' . $requiredTemplateString);
}

$requiredStyleStrings = array(
    'v5.0.34 Research Library page',
    '.research-library-hero',
    '.research-library-mini-nav',
    '.research-library-path-grid',
    '.research-library-type-grid',
    '.home-research-library-cta'
);

foreach ($requiredStyleStrings as $requiredStyleString) {
    arcsecs_research_library_assert_true(strpos($style, $requiredStyleString) !== false, 'Missing Research Library CSS string: ' . $requiredStyleString);
}

arcsecs_research_library_assert_true(strpos($home, 'research-library/') !== false, 'Home page does not link to Research Library.');
arcsecs_research_library_assert_true(strpos($hub, 'research-library/') !== false, 'Research Hub does not link to Research Library.');
arcsecs_research_library_assert_true(strpos($llms, '/research-library/') !== false || strpos($llms, 'Research Library') !== false, 'Static llms.txt does not mention Research Library.');
arcsecs_research_library_assert_true(strpos($uai, 'v5.0.34 Research Library') !== false, '.uai memory does not document Research Library.');
arcsecs_research_library_assert_true(file_exists($docsPath), 'Research Library docs file is missing.');
arcsecs_research_library_assert_true(strlen(trim(file_get_contents($docsPath))) > 1200, 'Research Library docs file is too thin.');
arcsecs_research_library_assert_true(stripos($template, 'jquery') === false && stripos($template, 'bootstrap') === false, 'Research Library must not use jQuery or Bootstrap.');

echo "Research Library page source contract passed." . PHP_EOL;
