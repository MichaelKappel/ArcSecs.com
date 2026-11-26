<?php
/** Scientific Research Library: local, fixed-catalog routes; no user-controlled file paths. */
if ( ! defined( 'ABSPATH' ) ) { exit; }
function arcsecs_library_asset_url( $path ) { return get_template_directory_uri() . '/assets/research-library/' . $path; }
function arcsecs_library_catalog() {
    static $data = null;
    if ( null === $data ) {
        $file = get_template_directory() . '/assets/research-library/catalog.json';
        $data = is_readable( $file ) ? json_decode( file_get_contents( $file ), true ) : array();
        if ( ! is_array( $data ) || empty( $data['entries'] ) || ! isset( $data['reproducibility'] ) ) { $data = array( 'entries' => array(), 'reproducibility' => array() ); }
    }
    return $data;
}
function arcsecs_library_entries() { return arcsecs_library_catalog()['entries']; }
function arcsecs_library_entry( $slug ) {
    if ( ! is_string( $slug ) ) { return null; }
    if ( 'reproducibility' === $slug && ! empty( arcsecs_library_catalog()['reproducibility'] ) ) {
        return array( 'slug' => $slug, 'kind' => 'reproducibility', 'route' => 'research-library/reproducibility/', 'title' => 'Reproducibility and numerical evidence', 'description' => 'Archived Review 6.0 regression checks, numerical controls, scripts, evidence ledgers and recorded limitations.' );
    }
    foreach ( arcsecs_library_entries() as $entry ) { if ( $entry['slug'] === $slug ) { return $entry; } }
    return null;
}
/** null = other route; false = unknown library detail; string = known detail. */
function arcsecs_library_request() {
    $path = isset( $_SERVER['REQUEST_URI'] ) ? wp_parse_url( wp_unslash( $_SERVER['REQUEST_URI'] ), PHP_URL_PATH ) : '';
    $prefix = trailingslashit( (string) wp_parse_url( home_url( '/research-library/' ), PHP_URL_PATH ) );
    if ( ! is_string( $path ) || 0 !== strpos( $path, $prefix ) ) { return null; }
    $slug = rtrim( substr( $path, strlen( $prefix ) ), '/' );
    if ( '' === $slug ) { return null; }
    return arcsecs_library_entry( $slug ) ? $slug : false;
}
function arcsecs_library_seo_entries() {
    $entries = arcsecs_library_entries();
    if ( $repro = arcsecs_library_entry( 'reproducibility' ) ) { $entries[] = $repro; }
    $out = array();
    foreach ( $entries as $entry ) {
        $out[] = array( 'path' => $entry['route'], 'owner' => 'Theme', 'title' => ( 'report' === $entry['kind'] ? sprintf( 'R%02d · ', $entry['number'] ) : '' ) . $entry['title'] . ' | ArcSecs', 'name' => $entry['title'], 'description' => $entry['description'], 'image' => '', 'priority' => '0.75', 'changefreq' => 'monthly', 'keywords' => 'ArcSecs, scientific research, open knowledge, reproducibility, historical research, theoretical physics' );
    }
    return $out;
}
function arcsecs_library_title( $title ) {
    $request = arcsecs_library_request();
    if ( false === $request ) { return 'Research page not found | ArcSecs'; }
    if ( is_string( $request ) && ( $entry = arcsecs_library_entry( $request ) ) ) { return ( 'report' === $entry['kind'] ? sprintf( 'R%02d · ', $entry['number'] ) : '' ) . $entry['title'] . ' | ArcSecs'; }
    return $title;
}
add_filter( 'pre_get_document_title', 'arcsecs_library_title', 20 );
function arcsecs_library_render( $request ) {
    global $wp_query;
    $entry = is_string( $request ) ? arcsecs_library_entry( $request ) : null;
    if ( $entry && isset( $entry['html_sha256'] ) && ! is_readable( get_template_directory() . '/assets/research-library/' . $entry['slug'] . '/body.html' ) ) { $entry = null; }
    if ( isset( $wp_query ) ) {
        $wp_query->is_404 = ! $entry; $wp_query->is_page = (bool) $entry; $wp_query->is_home = false;
    }
    status_header( $entry ? 200 : 404 );
    if ( ! $entry || ! get_option( 'blog_public' ) ) { header( 'X-Robots-Tag: noindex, nofollow' ); }
    get_header(); get_template_part( 'template-parts/research-library-reader', null, array( 'entry' => $entry ) ); get_footer(); exit;
}
function arcsecs_library_metadata() {
    $request = arcsecs_library_request();
    if ( ! is_string( $request ) || ! ( $entry = arcsecs_library_entry( $request ) ) ) { return; }
    $url = arcsecs_ai_access_url( $entry['route'] );
    $data = array( '@context' => 'https://schema.org', '@type' => 'review' === $entry['kind'] ? 'ScholarlyArticle' : 'CreativeWork', '@id' => $url . '#work', 'name' => $entry['title'], 'url' => $url, 'description' => $entry['description'], 'inLanguage' => 'en', 'isAccessibleForFree' => true, 'isPartOf' => array( '@type' => 'CollectionPage', 'name' => 'ArcSecs Scientific Research Library', 'url' => arcsecs_ai_access_url( 'research-library/' ) ), 'publisher' => array( '@type' => 'Organization', 'name' => 'ArcSecs', 'url' => arcsecs_ai_access_url( '' ) ) );
    if ( ! empty( $entry['source_url'] ) ) { $data['isBasedOn'] = $entry['source_url']; }
    if ( isset( $entry['download_sha256'] ) ) { $data['encoding'] = array( '@type' => 'MediaObject', 'encodingFormat' => 'text/markdown', 'contentUrl' => arcsecs_library_asset_url( $entry['slug'] . '/source.md' ) ); }
    // Link scoped licensing policy rather than implying CC0 for all third-party figures and quotations.
    $data['usageInfo'] = 'https://github.com/MichaelKappel/ArcSecs.com/blob/main/LICENSE.md';
    if ( 'review' === $entry['kind'] && 6 === $entry['number'] ) { $data['mainEntityOfPage'] = arcsecs_ai_access_url( 'read-scientific-paper/' ); }
    echo '<link rel="canonical" href="' . esc_url( $url ) . '" />' . "\n";
    echo '<meta name="description" content="' . esc_attr( $entry['description'] ) . '" />' . "\n";
    foreach ( array( 'og:title' => $entry['title'], 'og:description' => $entry['description'], 'og:url' => $url, 'og:type' => 'article' ) as $property => $value ) { echo '<meta property="' . esc_attr( $property ) . '" content="' . esc_attr( $value ) . '" />' . "\n"; }
    echo '<link rel="alternate" type="application/json" href="' . esc_url( arcsecs_library_asset_url( 'catalog.json' ) ) . '" />' . "\n";
    echo '<script type="application/ld+json">' . wp_json_encode( $data, JSON_HEX_TAG | JSON_HEX_AMP | JSON_HEX_APOS | JSON_HEX_QUOT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE ) . '</script>' . "\n";
}
add_action( 'wp_head', 'arcsecs_library_metadata', 3 );
function arcsecs_library_catalog_metadata() {
    if ( ! arcsecs_is_research_library_page() ) { return; }
    $items = array();
    foreach ( arcsecs_library_seo_entries() as $entry ) { $items[] = array( '@type' => 'ListItem', 'position' => count( $items ) + 1, 'name' => $entry['name'], 'url' => arcsecs_ai_access_url( $entry['path'] ) ); }
    echo '<link rel="alternate" type="application/json" href="' . esc_url( arcsecs_library_asset_url( 'catalog.json' ) ) . '" />' . "\n";
    echo '<script type="application/ld+json">' . wp_json_encode( array( '@context' => 'https://schema.org', '@type' => 'ItemList', 'name' => 'ArcSecs research documents', 'itemListElement' => $items ), JSON_HEX_TAG | JSON_HEX_AMP | JSON_HEX_APOS | JSON_HEX_QUOT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE ) . '</script>' . "\n";
}
add_action( 'wp_head', 'arcsecs_library_catalog_metadata', 4 );
function arcsecs_library_enqueue() {
    if ( arcsecs_is_research_library_page() ) { wp_enqueue_script( 'arcsecs-research-library-filter', get_template_directory_uri() . '/assets/js/research-library-filter.js', array(), '3.141.0', true ); }
}
add_action( 'wp_enqueue_scripts', 'arcsecs_library_enqueue' );
