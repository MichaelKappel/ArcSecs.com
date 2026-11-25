<?php
$root = dirname(__DIR__, 2);

function arcsecs_home_hub_polish_assert_true($condition, $message) {
    if (!$condition) {
        fwrite(STDERR, $message . PHP_EOL);
        exit(1);
    }
}

$home = file_get_contents($root . '/template-parts/home-showcase.php');
$hub = file_get_contents($root . '/template-parts/arcsecs-research-hub.php');
$style = file_get_contents($root . '/style.css');
$uai = file_get_contents($root . '/.uai/short-term-memory.uai');

arcsecs_home_hub_polish_assert_true(strpos($home, 'home-primary-path') !== false, 'Home primary path section is missing.');
arcsecs_home_hub_polish_assert_true(strpos($home, 'Start simple. Go deeper only when ready.') !== false, 'Home primary path heading is missing.');
arcsecs_home_hub_polish_assert_true(strpos($home, 'hero-actions--focused') !== false, 'Home hero focused CTA class is missing.');
arcsecs_home_hub_polish_assert_true(strpos($home, 'Read Source / Docs') !== false, 'Home source/docs path card is missing.');
arcsecs_home_hub_polish_assert_true(strpos($home, 'arcsecs-physics-engine-demo/') !== false, 'Home Physics Engine Demo link is missing.');
arcsecs_home_hub_polish_assert_true(strpos($home, 'standard-cosmology-vs-arcsecs/') !== false, 'Home cosmology comparison link is missing.');
arcsecs_home_hub_polish_assert_true(strpos($home, 'cosmic-anomalies-tracker/') !== false, 'Home cosmic anomalies link is missing.');
arcsecs_home_hub_polish_assert_true(strpos($home, 'arcsecs_dark_matter_drive_simulator_url()') !== false, 'Home DM Drive helper is missing.');

arcsecs_home_hub_polish_assert_true(strpos($hub, 'research-hub-primary-path') !== false, 'Research hub primary path section is missing.');
arcsecs_home_hub_polish_assert_true(strpos($hub, 'The eight-step ArcSecs reading path.') !== false, 'Research hub primary path heading is missing.');
arcsecs_home_hub_polish_assert_true(strpos($hub, 'research-hub-stepper') !== false, 'Research hub stepper class is missing.');
arcsecs_home_hub_polish_assert_true(strpos($hub, 'DM Drive') !== false, 'Research hub DM Drive step is missing.');
arcsecs_home_hub_polish_assert_true(strpos($hub, '#primary-path') !== false, 'Research hub primary path nav link is missing.');

arcsecs_home_hub_polish_assert_true(strpos($style, '.home-primary-path') !== false, 'Home primary path CSS is missing.');
arcsecs_home_hub_polish_assert_true(strpos($style, '.research-hub-stepper') !== false, 'Research hub stepper CSS is missing.');
arcsecs_home_hub_polish_assert_true(strpos($style, 'grid-template-columns: repeat(7, minmax(0, 1fr))') !== false, 'Seven-column primary path desktop grid is missing.');
arcsecs_home_hub_polish_assert_true(strpos($style, '@media (max-width: 720px)') !== false, 'Mobile responsive rules are missing.');
arcsecs_home_hub_polish_assert_true(strpos($uai, 'v5.0.33 Home and Research Hub Conversion Polish') !== false, '.uai memory does not document v5.0.33.');

arcsecs_home_hub_polish_assert_true(file_exists($root . '/docs/ArcSecs Home and Research Hub Conversion Polish v5.0.33.md'), 'v5.0.33 documentation is missing.');

echo "Home and Start Here polish source contract passed." . PHP_EOL;
