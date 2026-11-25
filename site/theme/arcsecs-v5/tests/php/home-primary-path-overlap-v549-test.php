<?php
$root = dirname(__DIR__, 2);
$style = file_get_contents($root . '/style.css');
$home = file_get_contents($root . '/template-parts/home-showcase.php');

function arcsecs_v549_assert_true($condition, $message) {
    if (!$condition) {
        fwrite(STDERR, $message . PHP_EOL);
        exit(1);
    }
}

arcsecs_v549_assert_true(strpos($style, 'Version: 5.0.58') !== false, 'Theme header must be version 5.0.58.');
arcsecs_v549_assert_true(strpos($style, 'v5.0.58 Home primary-path overlap and link visibility fix') !== false, 'v5.0.58 CSS marker is missing.');
arcsecs_v549_assert_true(strpos($style, '@media (max-width: 1500px)') !== false, 'Missing 1500px primary-path breakpoint.');
arcsecs_v549_assert_true(strpos($style, '@media (max-width: 1240px)') !== false, 'Missing 1240px primary-path breakpoint.');
arcsecs_v549_assert_true(strpos($style, '@media (max-width: 940px)') !== false, 'Missing 940px primary-path breakpoint.');
arcsecs_v549_assert_true(strpos($style, '.home-primary-path__card em {') !== false, 'Missing home primary-path action label styling.');
arcsecs_v549_assert_true(strpos($home, 'Open hub') !== false && strpos($home, 'Open library') !== false, 'Home primary-path cards are missing expected action labels.');
arcsecs_v549_assert_true(file_exists($root . '/docs/ArcSecs Home Primary Path Overlap Fix v5.0.58.md'), 'v5.0.58 overlap fix documentation is missing.');

echo 'ArcSecs v5.0.58 home primary-path overlap verification passed.' . PHP_EOL;
