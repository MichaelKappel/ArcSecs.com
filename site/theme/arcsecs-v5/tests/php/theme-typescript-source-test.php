<?php
$root = dirname(__DIR__, 2);

function arcsecs_typescript_assert_true($condition, $message) {
    if (!$condition) {
        fwrite(STDERR, $message . PHP_EOL);
        exit(1);
    }
}

$requiredFiles = array(
    'assets/ts/arcsecs-physics-engine/PhysicsTypes.ts',
    'assets/ts/arcsecs-physics-engine/ConstantsManager.ts',
    'assets/ts/arcsecs-physics-engine/CorePhysicsEngine.ts',
    'assets/ts/arcsecs-physics-engine/ProcaPhotonModel.ts',
    'assets/ts/arcsecs-physics-engine/TiredLightModel.ts',
    'assets/ts/arcsecs-physics-engine/RelationalInertiaModel.ts',
    'assets/ts/arcsecs-physics-engine/DarkMatterCondensateModel.ts',
    'assets/ts/arcsecs-physics-engine/TelemetryRenderer.ts',
    'assets/ts/arcsecs-physics-engine/README.md',
);

foreach ($requiredFiles as $requiredFile) {
    arcsecs_typescript_assert_true(file_exists($root . '/' . $requiredFile), 'Missing TypeScript source file: ' . $requiredFile);
}

$core = file_get_contents($root . '/assets/ts/arcsecs-physics-engine/CorePhysicsEngine.ts');
$constants = file_get_contents($root . '/assets/ts/arcsecs-physics-engine/ConstantsManager.ts');
$template = file_get_contents($root . '/template-parts/standard-cosmology-comparison.php');
$style = file_get_contents($root . '/style.css');
$sourceBrowserScript = file_get_contents($root . '/assets/js/typescript-source-browser.js');

arcsecs_typescript_assert_true(strpos($core, 'public step(input: SimulationStepInput): TelemetryFrame') !== false, 'Core engine step contract is missing.');
arcsecs_typescript_assert_true(strpos($core, '@param input') !== false && strpos($core, '@returns') !== false, 'Core engine comments are incomplete.');
arcsecs_typescript_assert_true(strpos($constants, 'public getSnapshot(mode: ScenarioMode, elapsedSeconds: number): PhysicalConstantsSnapshot') !== false, 'ConstantsManager snapshot contract is missing.');
$functions = file_get_contents($root . '/functions.php');
arcsecs_typescript_assert_true(strpos($functions, 'function arcsecs_get_typescript_source_contracts()') !== false, 'Dynamic TypeScript source helper is missing.');
arcsecs_typescript_assert_true(strpos($functions, 'glob( $source_directory') !== false || strpos($functions, 'DirectoryIterator') !== false, 'TypeScript source helper must scan the source folder dynamically.');
arcsecs_typescript_assert_true(strpos($functions, 'file_get_contents( $real_source_path )') !== false, 'TypeScript source helper must read source contents.');
arcsecs_typescript_assert_true(strpos($template, '$typescript_sources') !== false, 'Comparison page does not request dynamic TypeScript sources.');
arcsecs_typescript_assert_true(strpos($template, 'data-typescript-source-browser') !== false, 'Comparison page dynamic source browser is missing.');
arcsecs_typescript_assert_true(strpos($template, 'Click a file name to view its bundled source') !== false, 'Comparison page does not instruct users to click source file names.');
arcsecs_typescript_assert_true(strpos($template, 'cosmology-typescript-source') !== false, 'Comparison page does not render clickable TypeScript source details.');
arcsecs_typescript_assert_true(strpos($template, "source_file['contents']") !== false, 'Comparison page does not render source file contents safely.');
arcsecs_typescript_assert_true(strpos($template, 'assets/ts/arcsecs-physics-engine/') !== false, 'Comparison page does not disclose TypeScript source path.');
arcsecs_typescript_assert_true(strpos($template, 'cosmology-code-sample') !== false, 'Comparison page does not show TypeScript code samples.');
arcsecs_typescript_assert_true(strpos($style, '.cosmology-code-sample') !== false, 'TypeScript code sample CSS is missing.');
arcsecs_typescript_assert_true(strpos($style, '.cosmology-typescript-source summary') !== false, 'Clickable TypeScript file summary CSS is missing.');
arcsecs_typescript_assert_true(strpos($functions, 'arcsecs-typescript-source-browser') !== false, 'TypeScript source browser script is not enqueued.');
arcsecs_typescript_assert_true(strpos($functions, "'lines'     => substr_count") !== false, 'TypeScript source helper does not return line counts.');
arcsecs_typescript_assert_true(strpos($template, 'data-typescript-source-filter') !== false, 'Source browser filter input is missing.');
arcsecs_typescript_assert_true(strpos($template, 'data-typescript-source-copy') !== false, 'Source browser copy button is missing.');
arcsecs_typescript_assert_true(strpos($template, 'data-typescript-source-status') !== false, 'Source browser live status is missing.');
arcsecs_typescript_assert_true(strpos($template, 'data-typescript-source-panel') !== false, 'Source browser panel data attribute is missing.');
arcsecs_typescript_assert_true(strpos($style, '.cosmology-typescript-toolbar') !== false, 'TypeScript toolbar CSS is missing.');
arcsecs_typescript_assert_true(strpos($sourceBrowserScript, 'data-typescript-source-filter') !== false, 'Source browser script does not bind the filter input.');
arcsecs_typescript_assert_true(strpos($sourceBrowserScript, 'navigator.clipboard.writeText') !== false, 'Source browser script does not copy selected source.');
arcsecs_typescript_assert_true(strpos($sourceBrowserScript, '#typescript-source-') !== false, 'Source browser script does not support hash deep links.');

echo "ArcSecs TypeScript source contract passed." . PHP_EOL;
