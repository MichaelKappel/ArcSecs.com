<?php
$root = dirname(__DIR__, 2);

function arcsecs_identity_assert_true($condition, $message) {
    if (!$condition) {
        fwrite(STDERR, $message . PHP_EOL);
        exit(1);
    }
}

$shortTerm = file_get_contents($root . '/.uai/short-term-memory.uai');
$currentState = file_get_contents($root . '/.uai/current-state-handoff.uai');
$currentEngine = file_get_contents($root . '/.uai/current-engine-status.uai');
$agentDoc = file_get_contents($root . '/docs/ArcSecs Agent Identity and UAI Update v5.0.47.md');
$releaseNotes = file_get_contents($root . '/docs/ArcSecs v5.0.47 Release Notes.md');
$style = file_get_contents($root . '/style.css');
$functions = file_get_contents($root . '/functions.php');

$identity = 'ArcSecs.com Site Theme Designer and Scientist Dedicated to the ArcSecs Ideas';

arcsecs_identity_assert_true(strpos($shortTerm, $identity) !== false, 'Short-term memory missing Site Theme Designer identity.');
arcsecs_identity_assert_true(strpos($currentState, $identity) !== false, 'Current-state handoff missing Site Theme Designer identity.');
arcsecs_identity_assert_true(strpos($currentEngine, 'plugin-agent work') !== false || strpos($currentEngine, 'plugin agent') !== false, 'Current engine status missing plugin ownership boundary.');
arcsecs_identity_assert_true(strpos($agentDoc, 'Not owned by this agent') !== false, 'Agent identity doc missing ownership boundary.');
arcsecs_identity_assert_true(strpos($releaseNotes, 'memory/handoff pass') !== false, 'Release notes missing pass type.');
arcsecs_identity_assert_true(strpos($style, 'Version: 5.0.58') !== false, 'Theme style header was not updated to v5.0.58.');
arcsecs_identity_assert_true(strpos($functions, "define('ARCSECS_VERSION', '5.0.58')") !== false, 'ARCSECS_VERSION was not updated to v5.0.58.');
arcsecs_identity_assert_true(strpos($functions, "define( 'ARCSECS_AI_ACCESS_THEME_VERSION', '5.0.58' )") !== false, 'AI access version was not updated to v5.0.58.');

print "ArcSecs v5.0.47 UAI agent identity verification passed." . PHP_EOL;
