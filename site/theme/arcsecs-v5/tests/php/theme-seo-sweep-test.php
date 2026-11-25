<?php
$root = dirname(__DIR__, 2);

function arcsecs_seo_assert_true($condition, $message) {
    if (!$condition) {
        fwrite(STDERR, $message . PHP_EOL);
        exit(1);
    }
}

$functions = file_get_contents($root . '/functions.php');
$docsFile = $root . '/docs/ArcSecs SEO Sweep v5.0.29.md';

arcsecs_seo_assert_true(strpos($functions, 'ARCSECS_CONTENT_MODIFIED_DATE') !== false, 'Stable content modified date constant is missing.');
arcsecs_seo_assert_true(strpos($functions, 'arcsecs_get_public_route_seo_entries') !== false, 'Central public route SEO manifest is missing.');
arcsecs_seo_assert_true(strpos($functions, 'arcsecs_get_public_route_seo_entry') !== false, 'Route SEO lookup helper is missing.');
arcsecs_seo_assert_true(strpos($functions, 'arcsecs_base_schema_graph') !== false, 'Base schema graph helper is missing.');
arcsecs_seo_assert_true(strpos($functions, 'arcsecs_with_base_schema_graph') !== false, 'Schema graph merge helper is missing.');
arcsecs_seo_assert_true(strpos($functions, 'arcsecs_output_route_social_metadata') !== false, 'Shared route social metadata helper is missing.');
arcsecs_seo_assert_true(strpos($functions, 'arcsecs_public_route_document_title') !== false, 'Virtual route document title filter is missing.');
arcsecs_seo_assert_true(strpos($functions, 'arcsecs_home_metadata') !== false, 'Home page metadata function is missing.');
arcsecs_seo_assert_true(strpos($functions, "add_action( 'wp_head', 'arcsecs_home_metadata', 2 )") !== false, 'Home metadata hook is missing.');
arcsecs_seo_assert_true(strpos($functions, 'og:image:width') !== false && strpos($functions, 'og:image:height') !== false, 'Open Graph image dimensions are missing.');
arcsecs_seo_assert_true(strpos($functions, 'og:image:alt') !== false, 'Open Graph image alt metadata is missing.');
arcsecs_seo_assert_true(strpos($functions, 'twitter:image:alt') !== false, 'Twitter/X image alt metadata is missing.');
arcsecs_seo_assert_true(strpos($functions, 'og:locale') !== false, 'Open Graph locale metadata is missing.');
arcsecs_seo_assert_true(strpos($functions, 'article:section') !== false && strpos($functions, 'article:tag') !== false, 'Article section/tag metadata is missing.');
arcsecs_seo_assert_true(strpos($functions, 'SiteNavigationElement') !== false, 'SiteNavigationElement schema is missing.');
arcsecs_seo_assert_true(strpos($functions, "'@type'    => 'Organization'") !== false, 'Organization schema is missing.');
arcsecs_seo_assert_true(strpos($functions, "'@type'    => 'WebSite'") !== false, 'WebSite schema is missing.');
arcsecs_seo_assert_true(strpos($functions, 'SearchAction') !== false, 'WebSite SearchAction schema is missing.');
arcsecs_seo_assert_true(strpos($functions, 'xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"') !== false, 'Image sitemap namespace is missing.');
arcsecs_seo_assert_true(strpos($functions, '<image:image>') !== false && strpos($functions, '<image:loc>') !== false && strpos($functions, '<image:caption>') !== false, 'Image sitemap entries are missing.');
arcsecs_seo_assert_true(strpos($functions, 'SEO route manifest') !== false, 'llms.txt SEO route manifest output is missing.');
arcsecs_seo_assert_true(strpos($functions, 'ArcSecs SEO Sweep v5.0.29') !== false, 'SEO sweep doc is not exposed in source documents.');
arcsecs_seo_assert_true(file_exists($docsFile), 'SEO sweep documentation file is missing.');
arcsecs_seo_assert_true(strlen(trim(file_get_contents($docsFile))) > 2000, 'SEO sweep documentation is too thin.');

$requiredRoutes = array(
    'arcsecs-research-hub/',
    'standard-cosmology-vs-arcsecs/',
    'cosmic-anomalies-tracker/',
    'arcsecs-physics-engine-demo/',
    'dark-matter-drive-simulator/',
    'llms.txt',
    'arcsecs-sitemap.xml',
);
foreach ($requiredRoutes as $requiredRoute) {
    arcsecs_seo_assert_true(strpos($functions, "'path'        => '" . $requiredRoute . "'") !== false, 'Missing SEO route manifest entry: ' . $requiredRoute);
}

echo "SEO sweep source contract passed." . PHP_EOL;
