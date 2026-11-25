<?php
/** Public corpus discovery, local metadata and administrator-only diagnostics. */
if ( ! defined( 'ABSPATH' ) ) { exit; }
function arcsecs_corpus_asset_url( $file ) {
    return arcsecs_publication_asset_url( 'ai-corpus/' . $file );
}
function arcsecs_corpus_inventory() {
    static $inventory = null;
    if ( null !== $inventory ) { return $inventory; }
    $file = get_template_directory() . '/assets/publications/ai-corpus/dataset-inventory.json';
    $inventory = is_readable( $file ) ? json_decode( file_get_contents( $file ), true ) : array();
    if ( ! is_array( $inventory ) || empty( $inventory['configurations'] ) ) { $inventory = array(); }
    return $inventory;
}
function arcsecs_is_corpus_page() {
    if ( '1' === (string) get_query_var( 'arcsecs_corpus' ) ) { return true; }
    $request = isset( $_SERVER['REQUEST_URI'] ) ? wp_parse_url( wp_unslash( $_SERVER['REQUEST_URI'] ), PHP_URL_PATH ) : '';
    return untrailingslashit( (string) $request ) === untrailingslashit( (string) wp_parse_url( home_url( '/ai-corpus/' ), PHP_URL_PATH ) );
}
function arcsecs_corpus_seo_entry() {
    return array( 'path' => 'ai-corpus/', 'owner' => 'Theme', 'title' => 'ArcSecs AI Corpus v1.0.0 | Open Scientific Data', 'name' => 'ArcSecs AI Corpus', 'description' => 'Download the ArcSecs open scientific corpus, 17,279 records in eleven configurations. Free original research for humans and AI, with CC0 scope, provenance and scientific limitations.', 'image' => arcsecs_publications_cover_url(), 'priority' => '0.95', 'changefreq' => 'monthly', 'keywords' => 'ArcSecs, BEYOND SPACETIME, open dataset, theoretical physics, AI training, CC0, scientific reproducibility' );
}
function arcsecs_render_corpus_page() {
    global $wp_query;
    if ( isset( $wp_query ) ) { $wp_query->is_404 = false; $wp_query->is_page = true; $wp_query->is_home = false; }
    status_header( 200 );
    get_header(); get_template_part( 'template-parts/ai-corpus' ); get_footer(); exit;
}
function arcsecs_corpus_metadata() {
    if ( ! arcsecs_is_corpus_page() ) { return; }
    $entry = arcsecs_corpus_seo_entry();
    $url = arcsecs_ai_access_url( 'ai-corpus/' );
    echo '<link rel="canonical" href="' . esc_url( $url ) . '" />' . "\n";
    echo '<meta name="description" content="' . esc_attr( $entry['description'] ) . '" />' . "\n";
    echo '<link rel="alternate" type="application/ld+json" href="' . esc_url( arcsecs_corpus_asset_url( 'dataset.jsonld' ) ) . '" />' . "\n";
    $file = get_template_directory() . '/assets/publications/ai-corpus/dataset.jsonld';
    $data = is_readable( $file ) ? json_decode( file_get_contents( $file ), true ) : null;
    if ( ! is_array( $data ) || empty( $data['distribution'] ) ) { return; }
    $data['mainEntityOfPage'] = $url;
    foreach ( $data['distribution'] as &$distribution ) {
        if ( 'ArcSecs_AI_Corpus_v1.0.0.zip' === $distribution['contentUrl'] ) { $distribution['contentUrl'] = arcsecs_corpus_asset_url( 'ArcSecs_AI_Corpus_v1.0.0.zip' ); }
    }
    unset( $distribution );
    echo '<script type="application/ld+json">' . wp_json_encode( $data, JSON_HEX_TAG | JSON_HEX_AMP | JSON_HEX_APOS | JSON_HEX_QUOT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE ) . '</script>' . "\n";
}
add_action( 'wp_head', 'arcsecs_corpus_metadata', 3 );
function arcsecs_corpus_admin_menu() {
    add_management_page( 'ArcSecs Discovery', 'ArcSecs Discovery', 'manage_options', 'arcsecs-discovery', 'arcsecs_corpus_admin_page' );
}
add_action( 'admin_menu', 'arcsecs_corpus_admin_menu' );
function arcsecs_corpus_admin_page() {
    if ( ! current_user_can( 'manage_options' ) ) { return; }
    $inventory = arcsecs_corpus_inventory();
    $archive = get_template_directory() . '/assets/publications/ai-corpus/ArcSecs_AI_Corpus_v1.0.0.zip';
    $actual = is_readable( $archive ) ? hash_file( 'sha256', $archive ) : '';
    $expected = isset( $inventory['source_package_sha256'] ) ? $inventory['source_package_sha256'] : '';
    $match = $actual && $expected && hash_equals( $expected, $actual );
    echo '<div class="wrap"><h1>ArcSecs discovery diagnostics</h1><p>Local diagnostics only. This page does not contact external providers, change site settings, or verify crawler access.</p><table class="widefat striped"><tbody>';
    $checks = array( 'WordPress search visibility' => get_option( 'blog_public' ) ? 'Indexing enabled in WordPress; host and plugin rules may still block access.' : 'Indexing discouraged in WordPress; existing privacy settings are preserved.', 'Corpus inventory' => $inventory ? 'Readable' : 'Missing or invalid', 'Bundled archive SHA-256' => $match ? 'Matches the v1.0.0 inventory' : 'Missing or mismatch — investigate before distribution', 'Live crawl and training status' => 'Not verified' );
    foreach ( $checks as $label => $value ) { echo '<tr><th scope="row">' . esc_html( $label ) . '</th><td>' . esc_html( $value ) . '</td></tr>'; }
    echo '</tbody></table><h2>Check public endpoints while logged out</h2><ul>';
    foreach ( array( 'ai-corpus/', 'publications/', 'read-book/', 'read-scientific-paper/', 'robots.txt', 'llms.txt', 'arcsecs-sitemap.xml' ) as $path ) { echo '<li><a href="' . esc_url( arcsecs_ai_access_url( $path ) ) . '">' . esc_html( $path ) . '</a></li>'; }
    echo '</ul><p>Verify HTTP status, indexing headers, WAF/CDN policies and actual crawler captures. Submit the working sitemap to Google Search Console and Bing Webmaster Tools. Keep private files outside public web roots.</p></div>';
}
