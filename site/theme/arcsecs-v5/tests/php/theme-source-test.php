<?php
$root = dirname(__DIR__, 2);

function arcsecs_assert_true($condition, $message) {
    if (!$condition) {
        fwrite(STDERR, $message . PHP_EOL);
        exit(1);
    }
}

$style = file_get_contents($root . '/style.css');
$functions = file_get_contents($root . '/functions.php');
$uai = file_get_contents($root . '/.uai/short-term-memory.uai');

arcsecs_assert_true(strpos($style, 'Version: 5.0.58') !== false, 'Theme header must be version 5.0.58.');
arcsecs_assert_true(strpos($functions, "define('ARCSECS_VERSION', '5.0.58')") !== false, 'ARCSECS_VERSION must be 5.0.58.');
arcsecs_assert_true(strpos($functions, "define( 'ARCSECS_AI_ACCESS_THEME_VERSION', '5.0.58' )") !== false, 'AI access version must be 5.0.58.');
arcsecs_assert_true(strpos($style, 'Cosmic_vortex_and_radiant_beams.png') !== false, 'Cosmic vortex hero image must be referenced.');
arcsecs_assert_true(file_exists($root . '/assets/images/Cosmic_vortex_and_radiant_beams.png'), 'Cosmic vortex image must exist.');
arcsecs_assert_true(strpos($functions, 'arcsecs_ai_access_source_documents') !== false, 'Source-document helper must exist.');
arcsecs_assert_true(strpos($functions, 'arcsecs_append_required_primary_menu_links') !== false, 'Required primary menu link appender is missing.');
arcsecs_assert_true(strpos($functions, 'wp_nav_menu_items') !== false, 'Primary menu item filter is missing.');
arcsecs_assert_true(strpos($functions, 'arcsecs-feature-menu-item--comparison') !== false, 'Cosmology comparison top-menu class is missing.');
arcsecs_assert_true(strpos($functions, 'arcsecs-feature-menu-item--anomalies') !== false, 'Cosmic anomalies top-menu class is missing.');
arcsecs_assert_true(strpos($style, '.primary-nav .arcsecs-feature-menu-item > a') !== false, 'Feature top-menu CSS is missing.');
arcsecs_assert_true(strpos($functions, 'uaix.org/en-us/tools/ai-memory-package-wizard') !== false, 'UAI Memory Package Wizard link must be exposed.');
arcsecs_assert_true(strpos($uai, 'AIWikis raw preservation') !== false, '.uai short-term memory must point long-memory preservation to AIWikis.');
arcsecs_assert_true(strpos($uai, 'Do not keep root `agent-file-handoff/` Markdown as package memory') !== false, '.uai short-term memory must retire root handoff Markdown package memory.');

arcsecs_assert_true(file_exists($root . '/.uai/startup-packet.uai'), 'UAI startup packet is missing.');
arcsecs_assert_true(file_exists($root . '/.uai/receiver-brief.uai'), 'UAI receiver brief is missing.');
arcsecs_assert_true(file_exists($root . '/.uai/short-term-memory.uai'), 'UAI short-term memory is missing.');
arcsecs_assert_true(file_exists($root . '/.uai/long-term-memory.uai'), 'UAI long-term memory pointer is missing.');
arcsecs_assert_true(file_exists($root . '/.uai/intake-outcome-ledger.uai'), 'UAI intake outcome ledger is missing.');
arcsecs_assert_true(file_exists($root . '/docs/ArcSecs Long-Term Memory Index.md'), 'Long-term memory index is missing.');
arcsecs_assert_true(file_exists($root . '/docs/UAIX Memory System Compliance Notes.md'), 'UAIX compliance notes are missing.');
arcsecs_assert_true(file_exists($root . '/docs/ArcSecs Current Project Handoff State.md'), 'Current project handoff state doc is missing.');

$requiredFiles = array(
    '/docs/ArcSecs Physics Engine Fullscreen Upgrade Prompt.md',
    '/docs/ArcSecs Physics Engine Technical Analysis.md',
    '/docs/Scrutinizing ArcSecs Physics Engine Concepts.md',
    '/docs/Alternative Physics Theories Discussion.md',
    '/docs/Reimagining Physics Simulation Architecture.md',
    '/docs/AI Memory Package and File Handoff Guide.md',
    '/.uai/file-handoff.uai',
    '/.uai/wiki-wizard-alignment.uai',
    '/.uai/architecture.uai',
);

foreach ($requiredFiles as $requiredFile) {
    arcsecs_assert_true(file_exists($root . $requiredFile), 'Missing required handoff/source file: ' . $requiredFile);
}

arcsecs_assert_true(file_exists($root . '/tests/php/theme-typescript-source-test.php'), 'TypeScript source contract test is missing.');
echo "ArcSecs v5.0.47 theme source tests passed." . PHP_EOL;
