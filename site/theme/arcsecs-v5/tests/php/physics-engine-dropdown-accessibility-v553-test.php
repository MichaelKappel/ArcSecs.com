<?php
$root = dirname(__DIR__, 2);
$functions = file_get_contents($root . '/functions.php');
$style = file_get_contents($root . '/style.css');
$navigation = file_get_contents($root . '/assets/js/navigation.js');

function arcsecs_v553_assert_true($condition, $message) {
    if (!$condition) {
        fwrite(STDERR, $message . PHP_EOL);
        exit(1);
    }
}

arcsecs_v553_assert_true(strpos($style, 'Version: 5.0.58') !== false, 'Theme header must be version 5.0.58.');
arcsecs_v553_assert_true(strpos($functions, "define('ARCSECS_VERSION', '5.0.58')") !== false, 'ARCSECS_VERSION must be 5.0.58.');
arcsecs_v553_assert_true(strpos($functions, 'aria-expanded="false"') !== false, 'Physics Engine dropdown trigger must expose aria-expanded.');
arcsecs_v553_assert_true(strpos($functions, 'aria-controls="') !== false, 'Physics Engine dropdown trigger must expose aria-controls.');
arcsecs_v553_assert_true(strpos($functions, 'arcsecs-physics-engine-submenu') !== false, 'Physics Engine submenu must have a stable ID.');
arcsecs_v553_assert_true(strpos($navigation, 'setPhysicsEngineDropdownExpanded') !== false, 'Navigation script must synchronize Physics Engine dropdown state.');
arcsecs_v553_assert_true(strpos($navigation, 'handlePhysicsEngineDropdownClick') !== false, 'Navigation script must support touch/mobile dropdown click behavior.');
arcsecs_v553_assert_true(strpos($navigation, "event.key !== 'Escape'") !== false, 'Navigation script must handle Escape behavior.');
arcsecs_v553_assert_true(strpos($style, 'v5.0.58 Physics Engine dropdown accessibility and resilience polish') !== false, 'v5.0.58 dropdown accessibility CSS marker is missing.');
arcsecs_v553_assert_true(strpos($style, '.is-submenu-open > .sub-menu') !== false, 'Dropdown CSS must support explicit open state.');
arcsecs_v553_assert_true(file_exists($root . '/docs/ArcSecs Physics Engine Dropdown Accessibility v5.0.58.md'), 'v5.0.58 dropdown accessibility documentation is missing.');

echo 'ArcSecs v5.0.58 Physics Engine dropdown accessibility verification passed.' . PHP_EOL;
