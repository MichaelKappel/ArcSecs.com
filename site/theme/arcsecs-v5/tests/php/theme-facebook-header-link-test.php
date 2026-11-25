<?php
$root = dirname(__DIR__, 2);
$header = file_get_contents($root . '/header.php');
$style = file_get_contents($root . '/style.css');

function arcsecs_facebook_header_assert_true($condition, $message) {
    if (!$condition) {
        fwrite(STDERR, $message . PHP_EOL);
        exit(1);
    }
}

arcsecs_facebook_header_assert_true(strpos($header, 'https://www.facebook.com/Arcsecs/') !== false, 'ArcSecs Facebook URL is missing from header.');
arcsecs_facebook_header_assert_true(strpos($header, 'class="arcsecs-facebook-link"') !== false, 'ArcSecs Facebook header link class is missing.');
arcsecs_facebook_header_assert_true(strpos($header, 'target="_blank"') !== false, 'ArcSecs Facebook link should open in a new tab.');
arcsecs_facebook_header_assert_true(strpos($header, 'rel="noopener noreferrer"') !== false, 'ArcSecs Facebook link should use noopener noreferrer.');
arcsecs_facebook_header_assert_true(strpos($header, 'Follow ArcSecs on Facebook') !== false, 'ArcSecs Facebook accessible label is missing.');
arcsecs_facebook_header_assert_true(strpos($style, '.arcsecs-facebook-link') !== false, 'ArcSecs Facebook link CSS is missing.');
arcsecs_facebook_header_assert_true(strpos($style, '.arcsecs-facebook-link__icon') !== false, 'ArcSecs Facebook icon CSS is missing.');
arcsecs_facebook_header_assert_true(strpos($style, '.arcsecs-facebook-link__copy { display: none; }') !== false, 'ArcSecs Facebook compact breakpoint is missing.');
arcsecs_facebook_header_assert_true(stripos($header . $style, 'bootstrap') === false, 'Facebook header link must not introduce Bootstrap.');
arcsecs_facebook_header_assert_true(stripos($header . $style, 'jquery') === false, 'Facebook header link must not introduce jQuery.');

echo "ArcSecs Facebook header link contract passed." . PHP_EOL;
