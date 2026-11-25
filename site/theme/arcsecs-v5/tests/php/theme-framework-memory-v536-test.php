<?php
$root = dirname(__DIR__, 2);

function arcsecs_framework_memory_assert_true($condition, $message) {
    if (!$condition) {
        fwrite(STDERR, $message . PHP_EOL);
        exit(1);
    }
}

$functions = file_get_contents($root . '/functions.php');
$frameworkNotes = file_get_contents($root . '/docs/ArcSecs Universe Framework Integration Notes v5.0.36.md');
$shortTermMemory = file_get_contents($root . '/.uai/short-term-memory.uai');
$longTermIndex = file_get_contents($root . '/docs/ArcSecs Long-Term Memory Index.md');

$requiredFiles = array(
    '/docs/Rethinking Light Time and Spacetime.md',
    '/docs/Physics Engine Fixes Based on Decoupled Multi-Messenger Propagation.md',
    '/docs/ArcSecs Universe Framework Integration Notes v5.0.36.md',
);

foreach ($requiredFiles as $requiredFile) {
    arcsecs_framework_memory_assert_true(file_exists($root . $requiredFile), 'Missing framework memory file: ' . $requiredFile);
    arcsecs_framework_memory_assert_true(strlen(trim(file_get_contents($root . $requiredFile))) > 1000, 'Framework memory file is too thin: ' . $requiredFile);
}

$requiredConcepts = array(
    'Do not treat spacetime as a physical substance',
    'Time dilation should be reframed as process-rate or arrival-pattern behavior',
    'Redshift should be framed as a testable split',
    'Multi-messenger timing is an important falsification sandbox',
    'Photon mass / Proca substrate language belongs in the ArcSecs lane',
    'Dark matter and dark energy should be handled as interpretation problems',
    'ArcSecs is a speculative research and simulation framework',
);

foreach ($requiredConcepts as $requiredConcept) {
    arcsecs_framework_memory_assert_true(strpos($frameworkNotes, $requiredConcept) !== false, 'Missing framework concept: ' . $requiredConcept);
}

arcsecs_framework_memory_assert_true(strpos($functions, 'Rethinking Light Time and Spacetime') !== false, 'functions.php source list is missing Rethinking Light Time and Spacetime.');
arcsecs_framework_memory_assert_true(strpos($functions, 'Physics Engine Fixes Based on Decoupled Multi-Messenger Propagation') !== false, 'functions.php source list is missing decoupled multi-messenger source.');
arcsecs_framework_memory_assert_true(strpos($shortTermMemory, 'v5.0.36 No-Spacetime') !== false, '.uai short-term memory missing v5.0.36 note.');
arcsecs_framework_memory_assert_true(strpos($longTermIndex, 'v5.0.36 No-Spacetime') !== false, 'Long-term memory index missing v5.0.36 note.');

// Keep public language bounded: the integration note must explicitly preserve the speculative boundary.
arcsecs_framework_memory_assert_true(strpos($frameworkNotes, 'not scientific consensus') !== false, 'Framework note must preserve scientific-consensus boundary language.');

echo "ArcSecs v5.0.36 framework memory contract passed." . PHP_EOL;
