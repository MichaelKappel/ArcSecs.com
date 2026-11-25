<?php
$root = dirname(__DIR__, 2);
$template = file_get_contents($root . '/template-parts/distance-time-framework.php');
$functions = file_get_contents($root . '/functions.php');
$style = file_get_contents($root . '/style.css');
$llms = file_get_contents($root . '/public-root/llms.txt');
$uai = file_get_contents($root . '/.uai/short-term-memory.uai');

function arcsecs_v550_assert_true($condition, $message) {
    if (!$condition) {
        fwrite(STDERR, $message . PHP_EOL);
        exit(1);
    }
}

arcsecs_v550_assert_true(strpos($style, 'Version: 5.0.58') !== false, 'Theme header must be version 5.0.58.');
arcsecs_v550_assert_true(file_exists($root . '/docs/ArcSecs Perspective Research Report.md'), 'Perspective report must be preserved in /docs/.');
arcsecs_v550_assert_true(strpos($template, 'id="perspective-report"') !== false, 'Distance-Time page is missing perspective report section.');
arcsecs_v550_assert_true(strpos($template, 'Teleparallel gravity') !== false, 'Distance-Time page is missing teleparallel support card.');
arcsecs_v550_assert_true(strpos($template, 'Massive Proca electrodynamics') !== false, 'Distance-Time page is missing Proca support card.');
arcsecs_v550_assert_true(strpos($template, 'Mass-polariton momentum transfer') !== false, 'Distance-Time page is missing mass-polariton support card.');
arcsecs_v550_assert_true(strpos($template, 'CCC+TL') !== false, 'Distance-Time page is missing CCC+TL support card.');
arcsecs_v550_assert_true(strpos($template, 'ArcSecs Perspective Research Report') !== false, 'Distance-Time sources must list the Perspective Research Report.');
arcsecs_v550_assert_true(strpos($template, 'not peer-reviewed proof') !== false, 'Perspective section must keep speculative-boundary language visible.');
arcsecs_v550_assert_true(strpos($functions, 'teleparallel gravity') !== false, 'Schema/metadata must include teleparallel gravity.');
arcsecs_v550_assert_true(strpos($functions, 'Proca electrodynamics') !== false, 'Schema/metadata must include Proca electrodynamics.');
arcsecs_v550_assert_true(strpos($style, 'v5.0.58 ArcSecs Perspective Research Report public-support cards') !== false, 'v5.0.58 CSS marker is missing.');
arcsecs_v550_assert_true(strpos($llms, 'v5.0.58 ArcSecs Perspective Research Report integration') !== false, 'llms.txt is missing perspective report integration note.');
arcsecs_v550_assert_true(strpos($uai, 'v5.0.58 ArcSecs Perspective Research Report integration') !== false, '.uai short-term memory is missing perspective report integration note.');
arcsecs_v550_assert_true(file_exists($root . '/docs/ArcSecs Perspective Research Report Integration v5.0.58.md'), 'v5.0.58 integration documentation is missing.');
arcsecs_v550_assert_true(stripos($template, 'jquery') === false && stripos($template, 'bootstrap') === false, 'Distance-Time template must not introduce jQuery or Bootstrap.');

echo 'ArcSecs v5.0.58 Perspective Research Report integration verification passed.' . PHP_EOL;
