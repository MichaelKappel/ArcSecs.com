<?php
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
$plugin = file_get_contents($pluginFile);
if ($plugin === false || strpos($plugin, 'Version: 5.8.36') === false) {
    fwrite(STDERR, "Plugin identity was not updated to 5.8.36.\n");
    exit(1);
}
exit(0);

assert(strpos($html, 'data-arcsecs-static-publication-review-checklist') !== false);
assert(strpos($html, 'data-arcsecs-page-draft-freeze-bundle') !== false);
