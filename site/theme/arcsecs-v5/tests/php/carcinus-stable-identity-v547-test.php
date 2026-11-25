<?php
$root = dirname(__DIR__, 2);
$filesToCheck = array_merge(
    glob($root . '/.uai/*.uai'),
    glob($root . '/.uai/exports/*.txt'),
    glob($root . '/public-root/*.txt'),
    array(
        $root . '/docs/Carcinus Stable Identity Memory Correction v5.0.47.md',
        $root . '/docs/Carcinus Agent Meeting Onboarding v5.0.46.md',
        $root . '/docs/ArcSecs v5.0.47 Release Notes.md'
    )
);
foreach ($filesToCheck as $file) {
    if (!is_file($file)) {
        continue;
    }
    $contents = file_get_contents($file);
    if (strpos($contents, 'https://carcinus.org/' . 'api/') !== false) {
        fwrite(STDERR, "Volatile Carcinus API endpoint retained in {$file}.
");
        exit(1);
    }
    if (strpos($contents, 'carcinus.org/' . 'ai') !== false) {
        fwrite(STDERR, "Volatile Carcinus onboarding URL retained in {$file}.
");
        exit(1);
    }
    if (strpos($contents, 'CARCINUS' . '_WRITE' . '_TOKEN') !== false || strpos($contents, '{{' . 'CARCINUS' . '_WRITE' . '_TOKEN' . '}}') !== false) {
        fwrite(STDERR, "Mutable Carcinus token placeholder retained in {$file}.
");
        exit(1);
    }
    if (strpos($contents, 'api/' . 'v2') !== false) {
        fwrite(STDERR, "Mutable Carcinus API version path retained in {$file}.
");
        exit(1);
    }
}
$shortTerm = file_get_contents($root . '/.uai/short-term-memory.uai');
foreach (array(
    'ArcSecs.com Site Theme Designer and Scientist Dedicated to the ArcSecs Ideas',
    'Site Theme Designer',
    'https://carcinus.org/',
    'arcsecs-site-theme-designer',
    'verify the current live instructions'
) as $needle) {
    if (strpos($shortTerm, $needle) === false) {
        fwrite(STDERR, "Expected stable Carcinus identity memory missing: {$needle}.
");
        exit(1);
    }
}
$style = file_get_contents($root . '/style.css');
$functions = file_get_contents($root . '/functions.php');
if (strpos($style, 'Version: 5.0.58') === false || strpos($functions, "define('ARCSECS_VERSION', '5.0.58')") === false) {
    fwrite(STDERR, "Theme version metadata was not updated to 5.0.58.
");
    exit(1);
}
echo "ArcSecs v5.0.47 Carcinus stable identity memory verification passed." . PHP_EOL;
