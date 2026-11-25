<?php
$root = dirname(__DIR__, 2);

function arcsecs_mobile_nav_assert_true($condition, $message) {
    if (!$condition) {
        fwrite(STDERR, $message . PHP_EOL);
        exit(1);
    }
}

$script = file_get_contents($root . '/assets/js/navigation.js');
$style = file_get_contents($root . '/style.css');

$requiredScriptStrings = array(
    'Lightweight ArcSecs header navigation behavior',
    'updateHeaderScrollState',
    'setNavigationOpenState',
    'closeNavigation',
    'handleToggleClick',
    'handleNavigationClick',
    'handleDocumentClick',
    'handleDocumentKeydown',
    'handleViewportChange',
    'Escape',
    'primary-nav-open',
    'aria-expanded',
    'matchMedia',
    'addEventListener',
    'smallScreenQuery'
);

foreach ($requiredScriptStrings as $requiredScriptString) {
    arcsecs_mobile_nav_assert_true(strpos($script, $requiredScriptString) !== false, 'Missing mobile nav JavaScript string: ' . $requiredScriptString);
}

$requiredStyleStrings = array(
    '.primary-nav-open',
    '.menu-toggle[aria-expanded="true"]',
    'max-height: calc(100vh - 92px)',
    'overflow-y: auto',
    'max-height: calc(100vh - 78px)'
);

foreach ($requiredStyleStrings as $requiredStyleString) {
    arcsecs_mobile_nav_assert_true(strpos($style, $requiredStyleString) !== false, 'Missing mobile nav CSS string: ' . $requiredStyleString);
}

arcsecs_mobile_nav_assert_true(strpos($script, 'jQuery(') === false && strpos($script, '$("') === false && strpos($script, "$('" ) === false, 'Navigation script must not call jQuery.');
arcsecs_mobile_nav_assert_true(strpos($script, 'bootstrap.') === false && strpos($script, 'new bootstrap') === false, 'Navigation script must not call Bootstrap.');
arcsecs_mobile_nav_assert_true(strpos($style, '.bootstrap') === false && strpos($style, 'data-bs-') === false, 'Theme CSS must not introduce Bootstrap classes.');

echo "Mobile navigation accessibility source contract passed." . PHP_EOL;
