<?php
$root = dirname(__DIR__, 2);

function arcsecs_evidence_browser_assert_true($condition, $message) {
    if (!$condition) {
        fwrite(STDERR, $message . PHP_EOL);
        exit(1);
    }
}

$functions = file_get_contents($root . '/functions.php');
$style = file_get_contents($root . '/style.css');
$scriptPath = $root . '/assets/js/evidence-source-browser.js';
$script = file_get_contents($scriptPath);

arcsecs_evidence_browser_assert_true(file_exists($scriptPath), 'Evidence source browser JavaScript is missing.');
arcsecs_evidence_browser_assert_true(strpos($functions, 'arcsecs_should_enqueue_evidence_source_browser') !== false, 'Evidence browser route-aware enqueue helper is missing.');
arcsecs_evidence_browser_assert_true(strpos($functions, "arcsecs-evidence-source-browser") !== false, 'Evidence browser script handle is missing.');
arcsecs_evidence_browser_assert_true(strpos($functions, 'data-evidence-sources') !== false, 'Evidence component missing root data attribute.');
arcsecs_evidence_browser_assert_true(strpos($functions, 'data-evidence-search') !== false, 'Evidence component missing search control.');
arcsecs_evidence_browser_assert_true(strpos($functions, 'data-evidence-type') !== false, 'Evidence component missing type filter.');
arcsecs_evidence_browser_assert_true(strpos($functions, 'data-evidence-reset') !== false, 'Evidence component missing reset button.');
arcsecs_evidence_browser_assert_true(strpos($functions, 'data-source-keywords') !== false, 'Evidence source cards need keyword data for filtering.');
arcsecs_evidence_browser_assert_true(strpos($functions, 'target="_blank" rel="noopener noreferrer"') !== false, 'External source links must keep safe target/rel behavior.');
arcsecs_evidence_browser_assert_true(strpos($style, '.arcsecs-evidence-toolbar') !== false, 'Evidence toolbar CSS is missing.');
arcsecs_evidence_browser_assert_true(strpos($style, '.arcsecs-evidence-topic-nav') !== false, 'Evidence topic nav CSS is missing.');
arcsecs_evidence_browser_assert_true(strpos($script, '[data-evidence-sources]') !== false, 'Evidence browser script does not query component roots.');
arcsecs_evidence_browser_assert_true(strpos($script, '[data-evidence-search]') !== false, 'Evidence browser script does not query search input.');
arcsecs_evidence_browser_assert_true(strpos($script, '[data-evidence-type]') !== false, 'Evidence browser script does not query type selector.');
arcsecs_evidence_browser_assert_true(strpos($script, 'updateEvidenceFilters') !== false, 'Evidence browser script missing filter function.');
arcsecs_evidence_browser_assert_true(strpos($script, 'sourceCard.hidden') !== false, 'Evidence browser script must hide unmatched source cards.');
arcsecs_evidence_browser_assert_true(strpos($script, 'visibleSourceCount') !== false, 'Evidence browser script must update visible source count.');

echo "Evidence source browser test passed." . PHP_EOL;
