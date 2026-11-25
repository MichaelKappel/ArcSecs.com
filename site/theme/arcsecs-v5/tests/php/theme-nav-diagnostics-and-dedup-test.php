<?php
$root = dirname(__DIR__, 2);
$functions = file_get_contents($root . '/functions.php');
$repair = file_get_contents($root . '/inc/site-repair.php');
$style = file_get_contents($root . '/style.css');

function arcsecs_nav_diag_assert_true($condition, $message) {
    if (!$condition) {
        fwrite(STDERR, $message . PHP_EOL);
        exit(1);
    }
}

arcsecs_nav_diag_assert_true(strpos($functions, 'function arcsecs_primary_menu_link_attributes') !== false, 'Primary menu link attribute helper is missing.');
arcsecs_nav_diag_assert_true(strpos($functions, "add_filter( 'nav_menu_link_attributes', 'arcsecs_primary_menu_link_attributes'") !== false, 'Primary menu link attribute filter is missing.');
arcsecs_nav_diag_assert_true(strpos($functions, "data-arcsecs-route") !== false, 'Primary nav data route attribute is missing.');
arcsecs_nav_diag_assert_true(strpos($functions, "'aria-current'] = 'page'") !== false, 'Primary nav aria-current support is missing.');
arcsecs_nav_diag_assert_true(strpos($functions, 'function arcsecs_deduplicate_primary_menu_route_html') !== false, 'Last-pass primary menu duplicate remover is missing.');
arcsecs_nav_diag_assert_true(strpos($functions, "add_filter( 'wp_nav_menu_items', 'arcsecs_deduplicate_primary_menu_route_html', 999") !== false, 'Last-pass duplicate remover filter is missing.');
arcsecs_nav_diag_assert_true(strpos($functions, 'preg_replace_callback') !== false && strpos($functions, 'dark-matter-drive-simulator/') !== false, 'Rendered menu HTML dedupe should inspect known route URLs.');
arcsecs_nav_diag_assert_true(strpos($repair, 'function arcsecs_get_route_diagnostics') !== false, 'ArcSecs route diagnostics helper is missing.');
arcsecs_nav_diag_assert_true(strpos($repair, 'function arcsecs_count_required_primary_menu_routes') !== false, 'Primary Menu duplicate count helper is missing.');
arcsecs_nav_diag_assert_true(strpos($repair, 'Route and navigation diagnostics') !== false, 'ArcSecs Repair page route diagnostics section is missing.');
arcsecs_nav_diag_assert_true(strpos($repair, 'function arcsecs_get_primary_menu_route_audit') !== false, 'Primary Menu route audit helper is missing.');
arcsecs_nav_diag_assert_true(strpos($repair, 'function arcsecs_repair_primary_menu_route_links') !== false, 'Primary Menu route repair helper is missing.');
arcsecs_nav_diag_assert_true(strpos($repair, 'function arcsecs_is_stale_dark_matter_drive_menu_item') !== false, 'Stale DM Drive menu item detector is missing.');
arcsecs_nav_diag_assert_true(strpos($repair, 'arcsecs_repair_primary_menu_routes') !== false, 'Primary Menu route repair admin action is missing.');
arcsecs_nav_diag_assert_true(strpos($repair, 'Repair Primary Menu Route Links') !== false, 'Primary Menu route repair button is missing.');
arcsecs_nav_diag_assert_true(strpos($repair, 'dark-matter-dive') !== false && strpos($repair, 'dark-matter-drive-demo') !== false, 'Stale DM Drive slug detector should cover common bad slugs.');
arcsecs_nav_diag_assert_true(strpos($repair, 'If DM Drive returns 404') !== false, 'DM Drive 404 repair checklist is missing.');
arcsecs_nav_diag_assert_true(strpos($repair, 'Do not create a replacement simulator page inside the theme') !== false, 'Plugin ownership warning is missing from diagnostics.');
arcsecs_nav_diag_assert_true(strpos($style, 'a[aria-current="page"]') !== false, 'CSS does not style aria-current nav links.');
arcsecs_nav_diag_assert_true(strpos($style, 'data-arcsecs-route="dark-matter-drive-simulator"') !== false, 'CSS does not include compact DM Drive route hook.');
arcsecs_nav_diag_assert_true(strpos($functions . $repair . $style, "add_rewrite_rule( '^dark-matter-drive-simulator") === false, 'Theme must not add a rewrite rule for the plugin simulator route.');
arcsecs_nav_diag_assert_true(stripos($functions . $repair . $style, 'jquery') === false, 'Navigation diagnostics must not add jQuery.');
arcsecs_nav_diag_assert_true(stripos($functions . $repair . $style, 'bootstrap') === false, 'Navigation diagnostics must not add Bootstrap.');

echo "Navigation diagnostics and de-duplication contract passed." . PHP_EOL;
