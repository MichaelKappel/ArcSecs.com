<?php
$functions = file_get_contents(__DIR__ . '/../../functions.php');
$style = file_get_contents(__DIR__ . '/../../style.css');

if (strpos($functions, 'arcsecs_print_self_contained_theme_stylesheet') === false) {
    fwrite(STDERR, "Missing optional inline stylesheet fallback function.
");
    exit(1);
}

if (strpos($functions, "apply_filters( 'arcsecs_enable_inline_stylesheet_fallback', false )") === false) {
    fwrite(STDERR, "Inline full stylesheet fallback must be disabled by default for performance.
");
    exit(1);
}

if (strpos($functions, "ARCSECS_URI . '/style.css'") === false) {
    fwrite(STDERR, "Stylesheet should enqueue from explicit theme URI.
");
    exit(1);
}

if (strpos($functions, 'filemtime($style_path)') === false) {
    fwrite(STDERR, "Stylesheet should use filemtime cache busting.
");
    exit(1);
}

if (strpos($functions, 'arcsecs_resolve_theme_asset_urls_in_css') === false) {
    fwrite(STDERR, "Theme stylesheet should resolve bundled asset URLs from the active theme directory.
");
    exit(1);
}

if (strpos($style, 'Theme Name: ArcSecs V5') === false || strpos($style, 'Version: 5.0.58') === false) {
    fwrite(STDERR, "Theme style metadata is not 5.0.58.
");
    exit(1);
}

if (strpos($style, '.hero-bg') === false || strpos($style, 'Cosmic_vortex_and_radiant_beams.png') === false) {
    fwrite(STDERR, "Theme style is missing the home hero background rule.
");
    exit(1);
}

if (strpos($style, "inset: 0;
.hero-bg img") !== false) {
    fwrite(STDERR, "Home hero CSS has a malformed nested .hero-bg img selector.
");
    exit(1);
}

echo "Performance stylesheet loading test passed.
";
