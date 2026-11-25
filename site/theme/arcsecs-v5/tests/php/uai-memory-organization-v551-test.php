<?php
$root = dirname(__DIR__, 2);

function arcsecs_v551_assert_true($condition, $message) {
    if (!$condition) {
        fwrite(STDERR, $message . PHP_EOL);
        exit(1);
    }
}

$requiredFiles = array(
    '.uai/startup-packet.uai',
    '.uai/system-profile.uai',
    '.uai/receiver-brief.uai',
    '.uai/index.md',
    '.uai/context.uai',
    '.uai/constraints.uai',
    '.uai/progress.uai',
    '.uai/operations.uai',
    '.uai/test-plan.uai',
    '.uai/coding-standards.uai',
    '.uai/decisions.uai',
    '.uai/memory.uai',
    '.uai/short-term-memory.uai',
    '.uai/long-term-memory.uai',
    '.uai/file-handoff.uai',
    '.uai/intake-outcome-ledger.uai',
    '.uai/exports/manifest.json',
    '.uai/exports/manifest-overlay.json',
    '.uai/exports/package-model.json',
    '.uai/exports/llms.txt',
    '.uai/exports/llms-full.txt',
    'docs/ArcSecs Perspective Research Report.md',
    'docs/ArcSecs Long-Term Docs Memory Index v5.0.58.md',
    'docs/arcsecs-long-term-docs-manifest-v5.0.58.json',
    'docs/ArcSecs UAI Memory Organization and Completeness Audit v5.0.58.md',
    'docs/ArcSecs v5.0.58 Release Notes.md'
);

foreach ($requiredFiles as $requiredFile) {
    arcsecs_v551_assert_true(file_exists($root . '/' . $requiredFile), 'Missing required UAI/docs file: ' . $requiredFile);
}

$style = file_get_contents($root . '/style.css');
$functions = file_get_contents($root . '/functions.php');
$shortTerm = file_get_contents($root . '/.uai/short-term-memory.uai');
$longTerm = file_get_contents($root . '/.uai/long-term-memory.uai');
$manifest = json_decode(file_get_contents($root . '/docs/arcsecs-long-term-docs-manifest-v5.0.58.json'), true);
$coding = file_get_contents($root . '/.uai/coding-standards.uai');

arcsecs_v551_assert_true(strpos($style, 'Version: 5.0.58') !== false, 'Theme header must be version 5.0.58.');
arcsecs_v551_assert_true(strpos($functions, "define('ARCSECS_VERSION', '5.0.58')") !== false, 'ARCSECS_VERSION must be 5.0.58.');
arcsecs_v551_assert_true(strpos($functions, "define( 'ARCSECS_AI_ACCESS_THEME_VERSION', '5.0.58' )") !== false, 'AI access version must be 5.0.58.');
arcsecs_v551_assert_true(strpos($shortTerm, 'v5.0.58 UAI memory organization and completeness') !== false, 'Short-term memory missing v5.0.58 organization note.');
arcsecs_v551_assert_true(strpos($longTerm, 'v5.0.58 Long-term /docs memory completeness') !== false, 'Long-term memory missing v5.0.58 docs completeness note.');
arcsecs_v551_assert_true(is_array($manifest) && isset($manifest['entries']) && count($manifest['entries']) >= 100, 'Docs manifest must include the long-term docs inventory.');
arcsecs_v551_assert_true(strpos($coding, 'No `any`') !== false && strpos($coding, 'Do not use jQuery') !== false, 'Coding standards must include strict TypeScript/no-jQuery expectations.');
arcsecs_v551_assert_true(strpos($coding, 'WordPress/PHP theme code must remain presentation-focused') !== false, 'Coding standards must include theme boundary.');
arcsecs_v551_assert_true(strpos(file_get_contents($root . '/docs/ArcSecs Perspective Research Report.md'), 'Proca Electrodynamics') !== false, 'Perspective report was not preserved in /docs.');

echo 'ArcSecs v5.0.58 UAI memory organization verification passed.' . PHP_EOL;
