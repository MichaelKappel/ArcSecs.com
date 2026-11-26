<?php
if (PHP_SAPI !== "cli") { http_response_code(404); exit; }
$pluginFile = __DIR__ . '/../../arcsecs-scientific-physics-engine.php';
$shortcodeFile = __DIR__ . '/../../includes/class-arcsecs-physics-engine-shortcodes.php';
$php = file_get_contents($shortcodeFile);
if ($php === false) {
    fwrite(STDERR, "Unable to read shortcode file.\n");
    exit(1);
}
$required = array(
    'data-arcsecs-physics-readiness-sweep',
    'data-arcsecs-standard-comparison',
    'data-arcsecs-assumptions-equations',
    'data-arcsecs-space-onboarding',
    'data-arcsecs-space-telemetry-groups',
    'data-arcsecs-drive-what-is-real',
    'data-arcsecs-drive-control-taxonomy',
    'data-arcsecs-drive-hotspot-explanations',
    'data-arcsecs-scientific-source-matrix',
    'data-arcsecs-scenario-equation-library',
    'data-arcsecs-live-scenario-audit-console',
    'data-arcsecs-export-diff-review',
    'data-arcsecs-scenario-screenshot-evidence-pack',
    'data-arcsecs-reviewer-notes-bundle',
    'data-arcsecs-public-reviewer-gallery-manifest',
    'data-arcsecs-evidence-index-table',
    'data-arcsecs-scenario-review-walkthrough-wizard',
    'data-arcsecs-evidence-repair-queue',
    'data-arcsecs-evidence-repair-completion-ledger',
    'data-arcsecs-demo-readiness-gate',
    'data-arcsecs-static-publish-handoff-qa-summary',
    'data-arcsecs-public-page-content-checklist',
    'data-arcsecs-human-review-signoff-export',
    'data-arcsecs-manual-publishing-archive-receipt'
);
foreach ($required as $needle) {
    if (strpos($php, $needle) === false) {
        fwrite(STDERR, "Missing render marker: {$needle}\n");
        exit(1);
    }
}
$required = array('data-arcsecs-static-publication-review-checklist', 'data-arcsecs-page-draft-freeze-bundle');
foreach ($required as $needle) {
    if (strpos($php, $needle) === false) { fwrite(STDERR, "Missing render marker: {$needle}\n"); exit(1); }
}
$plugin = file_get_contents($pluginFile);
$package = json_decode(file_get_contents(__DIR__ . '/../../package.json'), true);
$version = $package['version'];
if ($plugin === false || strpos($plugin, 'Version: ' . $version) === false || strpos($plugin, "ARCSECS_PHYSICS_ENGINE_VERSION', '" . $version . "'") === false) {
    fwrite(STDERR, "Plugin header, runtime version and package version disagree.\n"); exit(1);
}
echo "Shortcode marker and version contracts passed.\n";
