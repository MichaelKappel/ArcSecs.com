<?php
$root = dirname(__DIR__, 2);

function arcsecs_memory_assert_true($condition, $message) {
    if (!$condition) {
        fwrite(STDERR, $message . PHP_EOL);
        exit(1);
    }
}

$functions = file_get_contents($root . '/functions.php');
$shortTermMemory = file_get_contents($root . '/.uai/short-term-memory.uai');
$longTermPointer = file_get_contents($root . '/.uai/long-term-memory.uai');
$longTermIndex = file_get_contents($root . '/docs/ArcSecs Long-Term Memory Index.md');
$researchManifest = file_get_contents($root . '/docs/ArcSecs Research Archive Manifest.md');
$sourceMapping = file_get_contents($root . '/docs/ArcSecs Uploaded Source Brief Mapping.md');
$publicLlms = file_get_contents($root . '/public-root/llms.txt');

$requiredDocs = array(
    'docs/Cosmology Comparison Page Ideas.md',
    'docs/Cosmology Comparison Implementation Prompt.md',
    'docs/Cosmic Anomalies Tracker Content Plan.md',
    'docs/Cosmic Anomalies Tracker Implementation Prompt.md',
    'docs/Dark Matter Drive Main Site Integration Prompt.md',
    'docs/Dark Matter Drive Compact Header Navigation Prompt.md',
    'docs/ArcSecs Uploaded Source Brief Mapping.md',
    'docs/ArcSecs Research Archive Manifest.md',
    'docs/ArcSecs Memory System Audit v5.0.25.md',
    'docs/ArcSecs Long-Term Memory Index.md',
    'docs/UAIX Memory System Compliance Notes.md',
    'docs/ArcSecs Current Project Handoff State.md',
    'docs/Rethinking Light Time and Spacetime.md',
    'docs/Physics Engine Fixes Based on Decoupled Multi-Messenger Propagation.md',
    'docs/ArcSecs Universe Framework Integration Notes v5.0.36.md',
);

foreach ($requiredDocs as $requiredDoc) {
    $fullPath = $root . '/' . $requiredDoc;
    arcsecs_memory_assert_true(file_exists($fullPath), 'Missing required memory/source document: ' . $requiredDoc);
    arcsecs_memory_assert_true(strlen(trim(file_get_contents($fullPath))) > 300, 'Memory/source document is too thin: ' . $requiredDoc);
    arcsecs_memory_assert_true(strpos($functions, $requiredDoc) !== false || strpos($researchManifest, basename($requiredDoc)) !== false, 'Document is not discoverable in functions source list or research manifest: ' . $requiredDoc);
}

arcsecs_memory_assert_true(strpos($shortTermMemory, 'v5.0.25 Active Short-Term Memory') !== false, 'Short-term memory does not mention v5.0.25.');
arcsecs_memory_assert_true(strpos($longTermPointer, 'v5.0.25 Long-Term Memory') !== false, 'Long-term memory pointer does not mention v5.0.25.');
arcsecs_memory_assert_true(strpos($longTermIndex, 'v5.0.25 Memory Completeness Audit') !== false, 'Long-term memory index does not mention v5.0.25 audit.');
arcsecs_memory_assert_true(strpos($sourceMapping, 'Pasted text(50).txt') !== false && strpos($sourceMapping, 'Pasted text(52).txt') !== false, 'Source brief mapping is missing uploaded prompt sources.');
arcsecs_memory_assert_true(strpos($publicLlms, 'v5.0.25 memory update') !== false, 'llms.txt does not mention v5.0.25 memory update.');
arcsecs_memory_assert_true(is_dir($root . '/.uai') && file_exists($root . '/.uai/startup-packet.uai') && file_exists($root . '/.uai/file-handoff.uai'), '.uai memory suite is incomplete.');


arcsecs_memory_assert_true(strpos($shortTermMemory, 'No-Spacetime / No-Literal-Time-Dilation') !== false, 'Short-term memory does not mention v5.0.36 framework memory.');
arcsecs_memory_assert_true(strpos($longTermPointer, 'Rethinking Light Time and Spacetime') !== false, 'Long-term memory pointer does not mention the rethinking light/time/spacetime source.');
arcsecs_memory_assert_true(strpos($researchManifest, 'Physics Engine Fixes Based on Decoupled Multi-Messenger Propagation.md') !== false, 'Research manifest does not list the decoupled multi-messenger propagation source.');
arcsecs_memory_assert_true(strpos($functions, 'ArcSecs Universe Framework Integration Notes v5.0.36') !== false, 'Source-document list does not expose the v5.0.36 framework integration note.');

$markdownDocumentCount = count(glob($root . '/docs/*.md'));
arcsecs_memory_assert_true($markdownDocumentCount >= 98, 'Expected at least 98 long-term Markdown docs after memory audit. Found: ' . $markdownDocumentCount);

// Ensure no stale missing source-document path remains.
arcsecs_memory_assert_true(strpos($functions, 'docs/theme-primary-menu-route-repair-v5.0.23.md') === false, 'functions.php references stale missing v5.0.23 menu repair doc.');
arcsecs_memory_assert_true(strpos($functions, 'docs/theme-primary-menu-route-repair-v5.0.22.md') !== false, 'functions.php should reference existing v5.0.22 menu repair doc.');

echo "ArcSecs memory completeness contract passed." . PHP_EOL;
