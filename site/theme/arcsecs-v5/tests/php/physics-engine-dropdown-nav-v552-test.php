<?php
$root = dirname(__DIR__, 2);
$functions = file_get_contents($root . '/functions.php');
$style = file_get_contents($root . '/style.css');

function arcsecs_v552_assert_true($condition, $message) {
    if (!$condition) {
        fwrite(STDERR, $message . PHP_EOL);
        exit(1);
    }
}

arcsecs_v552_assert_true(strpos($style, 'Version: 5.0.58') !== false, 'Theme header must be version 5.0.58.');
arcsecs_v552_assert_true(strpos($functions, "define('ARCSECS_VERSION', '5.0.58')") !== false, 'ARCSECS_VERSION must be 5.0.58.');
arcsecs_v552_assert_true(strpos($functions, "define( 'ARCSECS_AI_ACCESS_THEME_VERSION', '5.0.58' )") !== false, 'AI access theme version must be 5.0.58.');
arcsecs_v552_assert_true(strpos($functions, 'function arcsecs_physics_engine_menu_links()') !== false, 'Physics Engine menu link function is missing.');
arcsecs_v552_assert_true(strpos($functions, 'arcsecs-feature-menu-item--physics-engine-dropdown') !== false, 'Physics Engine dropdown class is missing.');
arcsecs_v552_assert_true(strpos($functions, "'label' => __( 'Physics Demo', 'arcsecs' )") !== false, 'Physics Demo submenu link is missing.');
arcsecs_v552_assert_true(strpos($functions, "'label' => __( 'DM Drive', 'arcsecs' )") !== false, 'DM Drive submenu link is missing.');
arcsecs_v552_assert_true(strpos($functions, "'label' => __( 'Ship Travel', 'arcsecs' )") !== false, 'Ship Travel submenu link is missing.');
arcsecs_v552_assert_true(strpos($functions, "'label' => __( 'Start Here', 'arcsecs' )") !== false, 'Start Here top-level link is missing.');
arcsecs_v552_assert_true(strpos($functions, "'label' => __( 'Distance-Time', 'arcsecs' )") !== false, 'Distance-Time top-level link is missing.');
arcsecs_v552_assert_true(strpos($functions, "'label' => __( 'Cosmology', 'arcsecs' )") !== false, 'Cosmology top-level link is missing.');
arcsecs_v552_assert_true(strpos($functions, "'label' => __( 'Anomalies', 'arcsecs' )") !== false, 'Anomalies top-level link is missing.');
arcsecs_v552_assert_true(strpos($style, 'v5.0.58 Physics Engine dropdown navigation consolidation') !== false, 'v5.0.58 dropdown CSS marker is missing.');
arcsecs_v552_assert_true(strpos($style, '.arcsecs-feature-menu-item--physics-engine-dropdown > .sub-menu') !== false, 'Dropdown submenu CSS is missing.');
arcsecs_v552_assert_true(strpos($style, '@media (max-width: 720px)') !== false, 'Mobile dropdown behavior is missing.');
arcsecs_v552_assert_true(file_exists($root . '/docs/ArcSecs Physics Engine Dropdown Navigation v5.0.58.md'), 'v5.0.58 dropdown documentation is missing.');

echo 'ArcSecs v5.0.58 Physics Engine dropdown navigation verification passed.' . PHP_EOL;
