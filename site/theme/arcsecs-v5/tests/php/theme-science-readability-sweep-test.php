<?php
$root = dirname(__DIR__, 2);

function arcsecs_readability_assert_true($condition, $message) {
    if (!$condition) {
        fwrite(STDERR, $message . PHP_EOL);
        exit(1);
    }
}

$cosmologyTemplate = file_get_contents($root . '/template-parts/standard-cosmology-comparison.php');
$anomaliesTemplate = file_get_contents($root . '/template-parts/cosmic-anomalies-tracker.php');
$style = file_get_contents($root . '/style.css');
$docsFile = $root . '/docs/ArcSecs Science Page Readability Sweep v5.0.33.md';

$cosmologyStrings = array(
    'id="cosmology-reader-path"',
    'Scan the contrast first. Then decide where to go deeper.',
    'cosmology-readability-grid',
    'Use the ledger, not vibes',
    'cosmology-deeper-links',
    'Redshift section scan summary',
    'Architecture section scan summary'
);

foreach ($cosmologyStrings as $requiredString) {
    arcsecs_readability_assert_true(strpos($cosmologyTemplate, $requiredString) !== false, 'Missing cosmology readability string: ' . $requiredString);
}

$anomaliesStrings = array(
    'id="anomalies-reader-path"',
    'Turn the anomaly list into a workflow.',
    'anomalies-readability-grid',
    'End with a kill test',
    'anomalies-deeper-links',
    'Long-form reading guide',
    'the strongest page-to-demo path'
);

foreach ($anomaliesStrings as $requiredString) {
    arcsecs_readability_assert_true(strpos($anomaliesTemplate, $requiredString) !== false, 'Missing anomalies readability string: ' . $requiredString);
}

$styleStrings = array(
    'v5.0.33 science page readability sweep',
    '.cosmology-readability-grid',
    '.anomalies-readability-grid',
    '.cosmology-scan-summary',
    '.anomalies-scan-summary',
    '@media (max-width: 1100px)'
);

foreach ($styleStrings as $requiredString) {
    arcsecs_readability_assert_true(strpos($style, $requiredString) !== false, 'Missing readability CSS string: ' . $requiredString);
}

arcsecs_readability_assert_true(file_exists($docsFile), 'Readability sweep documentation is missing.');
arcsecs_readability_assert_true(strlen(trim(file_get_contents($docsFile))) > 900, 'Readability sweep documentation is too thin.');

echo "Science page readability sweep source contract passed." . PHP_EOL;
