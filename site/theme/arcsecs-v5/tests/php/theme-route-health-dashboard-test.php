<?php
$root = dirname(__DIR__, 2);

function arcsecs_route_health_assert_true($condition, $message) {
    if (!$condition) {
        fwrite(STDERR, $message . PHP_EOL);
        exit(1);
    }
}

$functions = file_get_contents($root . '/functions.php');
$repair = file_get_contents($root . '/inc/site-repair.php');
$docs = file_get_contents($root . '/docs/theme-route-health-dashboard-v5.0.25.md');

arcsecs_route_health_assert_true(strpos($repair, 'function arcsecs_get_route_health_targets') !== false, 'Route health target function is missing.');
arcsecs_route_health_assert_true(strpos($repair, 'function arcsecs_get_route_health_rows') !== false, 'Route health row builder is missing.');
arcsecs_route_health_assert_true(strpos($repair, 'function arcsecs_fetch_route_health_result') !== false, 'Live route health fetcher is missing.');
arcsecs_route_health_assert_true(strpos($repair, 'wp_remote_get') !== false, 'Route health dashboard must use wp_remote_get for live checks.');
arcsecs_route_health_assert_true(strpos($repair, 'Run Route Health Check') !== false, 'Run Route Health Check button is missing.');
arcsecs_route_health_assert_true(strpos($repair, 'ArcSecs Route Health Dashboard') !== false, 'Route Health Dashboard heading is missing.');
arcsecs_route_health_assert_true(strpos($repair, 'arcsecs-route-health=1') !== false, 'Route health explicit run flag is missing.');
arcsecs_route_health_assert_true(strpos($repair, 'arcsecs_route_health_dashboard') === false, 'Unexpected snake-case typo found.');

$requiredRoutes = array(
    '/arcsecs-research-hub/',
    '/standard-cosmology-vs-arcsecs/',
    '/cosmic-anomalies-tracker/',
    '/arcsecs-physics-engine-demo/',
    '/dark-matter-drive-simulator/',
    '/llms.txt',
    '/arcsecs-sitemap.xml',
    '/robots.txt',
);

foreach ($requiredRoutes as $requiredRoute) {
    arcsecs_route_health_assert_true(strpos($repair, $requiredRoute) !== false, 'Missing route health target: ' . $requiredRoute);
}

$requiredStrings = array(
    'Theme virtual route',
    'ArcSecs plugin-owned page',
    'Theme AI/crawler endpoint',
    'Theme sitemap endpoint',
    'Top nav',
    'Sitemap',
    'llms.txt',
    'Marker found',
    'Marker missing',
    'Do not create a theme replacement page',
    'arcsecs_route_health_source_state',
    'arcsecs_route_health_nav_state',
    'get_transient',
    'set_transient',
);

foreach ($requiredStrings as $requiredString) {
    arcsecs_route_health_assert_true(strpos($repair, $requiredString) !== false, 'Missing route health string: ' . $requiredString);
}

arcsecs_route_health_assert_true(strpos($functions, 'theme-route-health-dashboard-v5.0.25.md') !== false, 'Route health dashboard documentation is not listed in source documents.');
arcsecs_route_health_assert_true(strlen(trim($docs)) > 1800, 'Route health dashboard documentation is too thin.');
arcsecs_route_health_assert_true(strpos($docs, '/dark-matter-drive-simulator/') !== false, 'Route health docs must mention plugin simulator route.');

// Runtime HTTP results must be checked inside WordPress after install.
echo "ArcSecs route health dashboard source contract passed." . PHP_EOL;
