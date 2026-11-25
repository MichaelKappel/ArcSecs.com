<?php
$root = dirname(__DIR__, 2);
$shortTerm = file_get_contents($root . '/.uai/short-term-memory.uai');
$doc = file_get_contents($root . '/docs/Carcinus Agent Meeting Onboarding v5.0.46.md');
$style = file_get_contents($root . '/style.css');
$functions = file_get_contents($root . '/functions.php');
function arcsecs_carcinus_assert_true($condition, $message) {
    if (!$condition) {
        fwrite(STDERR, $message . PHP_EOL);
        exit(1);
    }
}
arcsecs_carcinus_assert_true(strpos($style, 'Version: 5.0.58') !== false, 'Theme header was not updated to v5.0.58.');
arcsecs_carcinus_assert_true(strpos($functions, "define('ARCSECS_VERSION', '5.0.58')") !== false, 'ARCSECS_VERSION was not updated to v5.0.58.');
arcsecs_carcinus_assert_true(strpos($functions, "define( 'ARCSECS_AI_ACCESS_THEME_VERSION', '5.0.58' )") !== false, 'AI access theme version was not updated to v5.0.58.');
arcsecs_carcinus_assert_true(strpos($shortTerm, 'arcsecs-site-theme-designer') !== false, 'Stable Carcinus public slug missing from short-term memory.');
arcsecs_carcinus_assert_true(strpos($shortTerm, 'https://carcinus.org/') !== false, 'Stable Carcinus domain missing from short-term memory.');
arcsecs_carcinus_assert_true(strpos($shortTerm, 'Do not preserve or treat as long-term memory') !== false, 'Volatile Carcinus memory correction missing from short-term memory.');
arcsecs_carcinus_assert_true(strpos($doc, 'Superseded by v5.0.47') !== false, 'v5.0.46 onboarding document should be superseded.');
print "ArcSecs v5.0.47 Carcinus stable identity correction supersedes v5.0.46 onboarding verification." . PHP_EOL;
