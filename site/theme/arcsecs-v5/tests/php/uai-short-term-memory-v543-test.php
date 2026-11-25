<?php
$root = dirname(__DIR__, 2);

function arcsecs_uai_v543_assert_true($condition, $message) {
    if (!$condition) {
        fwrite(STDERR, $message . PHP_EOL);
        exit(1);
    }
}

$shortTerm = file_get_contents($root . '/.uai/short-term-memory.uai');
$memory = file_get_contents($root . '/.uai/memory.uai');
$index = file_get_contents($root . '/.uai/index.md');
$handoff = file_get_contents($root . '/.uai/file-handoff.uai');
$ledger = file_get_contents($root . '/.uai/intake-outcome-ledger.uai');
$status = file_get_contents($root . '/.uai/current-engine-status.uai');
$manifest = file_get_contents($root . '/.uai/exports/manifest.json');
$llms = file_get_contents($root . '/.uai/exports/llms.txt');

$requiredShortTermStrings = array(
    'v5.0.43 Active Short-Term Memory Consolidation',
    'Theme owns public documentation, internal links, navigation/footer exposure, SEO/schema',
    'Plugin owns simulator logic, strict TypeScript, Distance-Time Kernel',
    'arcsecs-export-builder-handoff.json',
    'ExportBuilderHandoff.ts',
    'ExportSchemaContracts.ts',
    'Do not add new concept layers during regression',
    'Distance-Time Kernel appears in the simulator scenario/mode selector',
    'What caused the delay?',
    'After every completed ArcSecs pass, end the response with a clear `Do this next:` recommendation'
);

foreach ($requiredShortTermStrings as $requiredShortTermString) {
    arcsecs_uai_v543_assert_true(strpos($shortTerm, $requiredShortTermString) !== false, 'Missing v5.0.43 short-term memory string: ' . $requiredShortTermString);
}

foreach (array($memory, $index, $handoff, $ledger) as $uaiMirrorText) {
    arcsecs_uai_v543_assert_true(strpos($uaiMirrorText, 'v5.0.43 Active Short-Term Memory Consolidation') !== false, 'A mirrored UAI memory file is missing the v5.0.43 consolidation section.');
}

arcsecs_uai_v543_assert_true(strpos($status, 'Current plugin-agent focus') !== false, 'Current engine status must include the active plugin-agent focus.');
arcsecs_uai_v543_assert_true(strpos($manifest, '5.0.43') !== false, 'UAI manifest must reference v5.0.43.');
arcsecs_uai_v543_assert_true(strpos($llms, 'v5.0.43 UAI short-term memory consolidation') !== false, 'UAI llms export must mention v5.0.43 memory consolidation.');
arcsecs_uai_v543_assert_true(file_exists($root . '/docs/ArcSecs UAI Short-Term Memory Consolidation v5.0.43.md'), 'v5.0.43 consolidation doc is missing.');
arcsecs_uai_v543_assert_true(file_exists($root . '/docs/ArcSecs v5.0.43 Release Notes.md'), 'v5.0.43 release notes are missing.');

arcsecs_uai_v543_assert_true(stripos($shortTerm, 'jquery') !== false, 'Short-term memory should retain the no-jQuery rule context.');
arcsecs_uai_v543_assert_true(stripos($shortTerm, 'bootstrap') !== false, 'Short-term memory should retain the no-Bootstrap rule context.');

echo "UAI short-term memory v5.0.43 consolidation verification passed." . PHP_EOL;
