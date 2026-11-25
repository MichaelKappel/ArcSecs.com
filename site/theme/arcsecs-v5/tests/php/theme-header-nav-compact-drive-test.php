<?php
$root = dirname(__DIR__, 2);
$functions = file_get_contents($root . '/functions.php');
$style = file_get_contents($root . '/style.css');

function arcsecs_header_nav_assert_true($condition, $message) {
    if (!$condition) {
        fwrite(STDERR, $message . PHP_EOL);
        exit(1);
    }
}

arcsecs_header_nav_assert_true(strpos($functions, 'function arcsecs_required_primary_menu_links') !== false, 'Required primary menu link helper is missing.');
arcsecs_header_nav_assert_true(strpos($functions, "'label' => __( 'DM Drive', 'arcsecs' )") !== false, 'DM Drive compact label is missing.');
arcsecs_header_nav_assert_true(strpos($functions, "'label' => __( 'Dark Matter Drive', 'arcsecs' )") === false, 'Long Dark Matter Drive label should not be used in primary nav helper.');
arcsecs_header_nav_assert_true(strpos($functions, "'path'  => 'dark-matter-drive-simulator/'") !== false, 'Dark Matter Drive simulator nav path is missing.');
arcsecs_header_nav_assert_true(strpos($functions, "arcsecs_ai_access_url( 'dark-matter-drive-simulator/' )") !== false || strpos($functions, "return arcsecs_ai_access_url( 'dark-matter-drive-simulator/' )") !== false, 'Dark Matter Drive helper must target the exact simulator slug.');
arcsecs_header_nav_assert_true(strpos($functions, 'function arcsecs_compact_primary_menu_item_labels') !== false, 'Custom primary menu label normalizer is missing.');
arcsecs_header_nav_assert_true(strpos($functions, "add_filter( 'wp_nav_menu_objects', 'arcsecs_compact_primary_menu_item_labels'") !== false, 'Primary menu object filter is missing.');
arcsecs_header_nav_assert_true(strpos($functions, '$seen_paths') !== false && strpos($functions, 'continue;') !== false, 'Duplicate route suppression is missing.');
arcsecs_header_nav_assert_true(strpos($functions, 'function arcsecs_is_dark_matter_drive_simulator_page') !== false, 'Dark Matter Drive current-route helper is missing.');
arcsecs_header_nav_assert_true(strpos($functions, 'arcsecs-primary-nav_current_class') === false, 'Unexpected typo in primary nav current class helper.');
arcsecs_header_nav_assert_true(strpos($functions, 'arcsecs_primary_nav_current_class') !== false, 'Primary nav active-state helper is missing.');
arcsecs_header_nav_assert_true(strpos($functions, "add_rewrite_rule( '^dark-matter-drive-simulator") === false, 'Theme must not create the plugin simulator route.');
arcsecs_header_nav_assert_true(strpos($style, '.primary-nav .menu {') !== false && strpos($style, 'flex-wrap: nowrap') !== false, 'Desktop nav nowrap rule is missing.');
arcsecs_header_nav_assert_true(strpos($style, '@media (max-width: 1180px)') !== false, 'Intermediate desktop nav cleanup breakpoint is missing.');
arcsecs_header_nav_assert_true(strpos($style, '.primary-nav .arcsecs-feature-menu-item--drive > a') !== false, 'DM Drive nav styling is missing.');
arcsecs_header_nav_assert_true(strpos($style, '.brand-tagline { display: none; }') !== false, 'Desktop crowding fallback should hide the tagline at narrower widths.');
arcsecs_header_nav_assert_true(stripos($functions . $style, 'jquery') === false, 'Header nav cleanup must not add jQuery.');
arcsecs_header_nav_assert_true(stripos($functions . $style, 'bootstrap') === false, 'Header nav cleanup must not add Bootstrap.');

echo "Compact Dark Matter Drive header navigation contract passed." . PHP_EOL;
