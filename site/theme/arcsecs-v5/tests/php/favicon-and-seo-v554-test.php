<?php
$root = dirname(__DIR__, 2);
$functions = file_get_contents($root . '/functions.php');
$style = file_get_contents($root . '/style.css');
$llms = file_get_contents($root . '/public-root/llms.txt');
$uai = file_get_contents($root . '/.uai/short-term-memory.uai');

function arcsecs_v554_assert_true($condition, $message) {
    if (!$condition) {
        fwrite(STDERR, $message . PHP_EOL);
        exit(1);
    }
}

arcsecs_v554_assert_true(strpos($style, 'Version: 5.0.58') !== false, 'Theme header must be version 5.0.58.');
arcsecs_v554_assert_true(strpos($functions, "define('ARCSECS_VERSION', '5.0.58')") !== false, 'ARCSECS_VERSION must be 5.0.58.');
arcsecs_v554_assert_true(strpos($functions, "define( 'ARCSECS_AI_ACCESS_THEME_VERSION', '5.0.58' )") !== false, 'AI access version must be 5.0.58.');
arcsecs_v554_assert_true(file_exists($root . '/favicon.ico'), 'Theme root favicon.ico is missing.');
arcsecs_v554_assert_true(file_exists($root . '/assets/icons/arcsecs-icon-32.png'), '32px PNG icon is missing.');
arcsecs_v554_assert_true(file_exists($root . '/assets/icons/arcsecs-icon-180.png'), '180px Apple PNG icon is missing.');
arcsecs_v554_assert_true(file_exists($root . '/assets/icons/arcsecs-icon-192.png'), '192px PNG icon is missing.');
arcsecs_v554_assert_true(file_exists($root . '/assets/icons/arcsecs-icon-512.png'), '512px PNG icon is missing.');
arcsecs_v554_assert_true(file_exists($root . '/assets/icons/site.webmanifest'), 'Site webmanifest is missing.');
$ico = file_get_contents($root . '/favicon.ico');
arcsecs_v554_assert_true(substr($ico, 0, 4) === "\x00\x00\x01\x00", 'favicon.ico does not have ICO header.');
arcsecs_v554_assert_true(strpos($functions, 'arcsecs_output_favicon_and_browser_metadata') !== false, 'Favicon/browser metadata function is missing.');
arcsecs_v554_assert_true(strpos($functions, 'rel="icon"') !== false, 'Favicon link metadata is missing.');
arcsecs_v554_assert_true(strpos($functions, 'rel="apple-touch-icon"') !== false, 'Apple touch icon metadata is missing.');
arcsecs_v554_assert_true(strpos($functions, 'rel="manifest"') !== false, 'Manifest link metadata is missing.');
arcsecs_v554_assert_true(strpos($functions, 'theme-color') !== false, 'Theme color metadata is missing.');
arcsecs_v554_assert_true(strpos($functions, 'og:image:secure_url') !== false, 'Open Graph secure image URL is missing.');
arcsecs_v554_assert_true(strpos($functions, 'ARCSECS_CONTENT_MODIFIED_DATE') !== false && strpos($functions, "'2026-05-31'") !== false, 'Content modified date was not refreshed.');
arcsecs_v554_assert_true(strpos($functions, 'Distance-Time Framework research') !== false, 'Home SEO description was not expanded.');
arcsecs_v554_assert_true(strpos($functions, 'publisher') !== false && strpos($functions, 'logo') !== false, 'Schema publisher logo support is missing.');
arcsecs_v554_assert_true(strpos($llms, 'v5.0.58 Favicon and SEO sweep') !== false, 'llms.txt is missing v5.0.58 SEO note.');
arcsecs_v554_assert_true(strpos($uai, 'v5.0.58 Favicon and SEO sweep') !== false, '.uai short-term memory is missing v5.0.58 SEO note.');
arcsecs_v554_assert_true(file_exists($root . '/docs/ArcSecs Favicon and SEO Sweep v5.0.58.md'), 'v5.0.58 SEO documentation is missing.');

echo 'ArcSecs v5.0.58 favicon and SEO verification passed.' . PHP_EOL;
