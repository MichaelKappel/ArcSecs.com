<?php
/** Book and scientific publication catalog. Bundled public editions with optional owner-configured HTTPS overrides. */
if ( ! defined( 'ABSPATH' ) ) { exit; }

function arcsecs_publications_amazon_url() {
    return 'https://www.amazon.com/dp/B0HST2C7LK/';
}
function arcsecs_publications_cover_url() {
    return get_template_directory_uri() . '/assets/images/beyond-spacetime-cover.webp';
}
function arcsecs_publications_download_url( $key ) {
    $allowed = array( 'book_pdf', 'book_epub', 'paper_pdf', 'zenodo', 'support' );
    if ( ! in_array( $key, $allowed, true ) ) { return ''; }
    $override = arcsecs_publications_sanitize_url( get_theme_mod( 'arcsecs_publications_' . $key, '' ) );
    if ( $override ) { return $override; }
    $bundled = array( 'book_pdf' => 'BEYOND_SPACETIME.pdf', 'book_epub' => 'BEYOND_SPACETIME.epub', 'paper_pdf' => 'ArcSecs_Scientific_Review_6.pdf' );
    if ( ! isset( $bundled[ $key ] ) ) { return ''; }
    $relative = '/assets/publications/' . $bundled[ $key ];
    if ( ! is_readable( get_template_directory() . $relative ) ) { return ''; }
    return esc_url_raw( get_template_directory_uri() . $relative, array( 'http', 'https' ) );
}
function arcsecs_publications_sanitize_url( $value ) {
    $value = trim( (string) $value );
    if ( ! preg_match( '~^https://~i', $value ) || ! wp_parse_url( $value, PHP_URL_HOST ) ) { return ''; }
    return esc_url_raw( $value, array( 'https' ) );
}
function arcsecs_publications_customize( $customizer ) {
    $customizer->add_section( 'arcsecs_publications', array( 'title' => __( 'ArcSecs Publications', 'arcsecs' ), 'description' => __( 'The approved book PDF, EPUB and scientific paper are bundled and available by default. Enter an HTTPS URL to override a bundled file. Leave Zenodo or support blank to hide those optional links.', 'arcsecs' ), 'priority' => 30 ) );
    $fields = array(
        'book_pdf' => 'Free book PDF URL override',
        'book_epub' => 'Free book EPUB URL override',
        'paper_pdf' => 'Scientific Review 6.0 PDF URL override',
        'zenodo' => 'Published Zenodo record or DOI URL',
        'support' => 'Optional additional support URL',
    );
    foreach ( $fields as $key => $label ) {
        $id = 'arcsecs_publications_' . $key;
        $customizer->add_setting( $id, array( 'default' => '', 'sanitize_callback' => 'arcsecs_publications_sanitize_url', 'transport' => 'refresh', 'capability' => 'edit_theme_options' ) );
        $customizer->add_control( $id, array( 'section' => 'arcsecs_publications', 'label' => $label, 'type' => 'url' ) );
    }
}
add_action( 'customize_register', 'arcsecs_publications_customize' );
function arcsecs_is_publications_page() {
    if ( get_query_var( 'arcsecs_publications' ) ) { return true; }
    $request = isset( $_SERVER['REQUEST_URI'] ) ? wp_parse_url( wp_unslash( $_SERVER['REQUEST_URI'] ), PHP_URL_PATH ) : '';
    return untrailingslashit( (string) $request ) === untrailingslashit( (string) wp_parse_url( home_url( '/publications/' ), PHP_URL_PATH ) );
}
function arcsecs_publications_seo_entry() {
    return array( 'path' => 'publications/', 'owner' => 'Theme', 'title' => 'BEYOND SPACETIME | ArcSecs Books, Scientific Papers & Open Data', 'name' => 'ArcSecs Publications', 'description' => 'Explore BEYOND SPACETIME and Scientific Review 6.0, purchase the book to support ArcSecs, and discover available scientific downloads and AI research datasets.', 'image' => arcsecs_home_social_image_url(), 'priority' => '0.98', 'changefreq' => 'monthly', 'keywords' => 'BEYOND SPACETIME, ArcSecs, Michael Joseph Kappel, Scientific Review 6.0, theoretical physics, photon propagation, relational inertia, open research' );
}
function arcsecs_render_publications_page() {
    global $wp_query;
    if ( isset( $wp_query ) ) { $wp_query->is_404 = false; $wp_query->is_page = true; $wp_query->is_home = false; }
    status_header( 200 );
    get_header();
    get_template_part( 'template-parts/publications' );
    get_footer();
    exit;
}
function arcsecs_publications_metadata() {
    if ( ! arcsecs_is_publications_page() ) { return; }
    $url = arcsecs_ai_access_url( 'publications/' );
    $entry = arcsecs_publications_seo_entry();
    $book = array( '@type' => 'Book', '@id' => $url . '#book', 'name' => 'BEYOND SPACETIME', 'isAccessibleForFree' => true, 'license' => 'https://creativecommons.org/publicdomain/zero/1.0/', 'alternateName' => 'A Physical-First Investigation into the Nature of the Universe', 'author' => array( '@type' => 'Person', 'name' => 'Michael Joseph Kappel', 'sameAs' => 'https://orcid.org/0009-0003-3889-1400' ), 'creditText' => 'Book credits: Machine Intelligence and Michael Joseph Kappel. Special thanks: Gary Lyon Otto.', 'inLanguage' => 'en', 'numberOfPages' => 476, 'bookEdition' => 'Review 6.0 integrated research edition', 'image' => arcsecs_publications_cover_url(), 'url' => arcsecs_ai_access_url( 'read-book/' ), 'sameAs' => arcsecs_publications_amazon_url() );
    $paper = array( '@type' => 'ScholarlyArticle', '@id' => $url . '#scientific-paper', 'name' => 'ArcSecs: A Physical-Process Research Program for Photon Propagation, Cosmic Distance, and Relational Inertia', 'alternativeHeadline' => 'Scientific Review 6.0', 'version' => '6.0', 'isAccessibleForFree' => true, 'license' => 'https://creativecommons.org/publicdomain/zero/1.0/', 'inLanguage' => 'en', 'dateCreated' => '2026-11-24', 'url' => arcsecs_ai_access_url( 'read-scientific-paper/' ), 'creditText' => 'Original ArcSecs research-program attribution; human-directed, AI-assisted. No named author inferred.', 'description' => 'Conditional physical models and numerical investigations through Part XXXIV, not experimental validation.' );
    foreach ( array( 'book_pdf' => 'application/pdf', 'book_epub' => 'application/epub+zip' ) as $key => $mime ) {
        $download = arcsecs_publications_download_url( $key );
        if ( $download ) { $book['encoding'][] = array( '@type' => 'MediaObject', 'contentUrl' => $download, 'encodingFormat' => $mime ); }
    }
    $pdf = arcsecs_publications_download_url( 'paper_pdf' );
    if ( $pdf ) { $paper['encoding'] = array( '@type' => 'MediaObject', 'contentUrl' => $pdf, 'encodingFormat' => 'application/pdf' ); }
    $doi = arcsecs_publications_download_url( 'zenodo' );
    if ( $doi ) { $paper['sameAs'] = $doi; }
    $graph = array( '@context' => 'https://schema.org', '@graph' => arcsecs_with_base_schema_graph( array( array( '@type' => 'CollectionPage', '@id' => $url, 'name' => $entry['name'], 'url' => $url, 'description' => $entry['description'], 'mainEntity' => array( array( '@id' => $url . '#book' ), array( '@id' => $url . '#scientific-paper' ) ) ), $book, $paper ) ) );
    echo '<link rel="canonical" href="' . esc_url( $url ) . '" />' . "\n";
    // Avoid forcing a robots meta tag on sites with indexing disabled.
    echo '<meta name="description" content="' . esc_attr( $entry['description'] ) . '" />' . "\n";
    echo '<link rel="license" href="https://creativecommons.org/publicdomain/zero/1.0/" />' . "\n";
    echo '<meta property="og:title" content="' . esc_attr( $entry['title'] ) . '" /><meta property="og:description" content="' . esc_attr( $entry['description'] ) . '" /><meta property="og:url" content="' . esc_url( $url ) . '" /><meta property="og:image" content="' . esc_url( arcsecs_publications_cover_url() ) . '" />' . "\n";
    echo '<script type="application/ld+json">' . wp_json_encode( $graph, JSON_HEX_TAG | JSON_HEX_AMP | JSON_HEX_APOS | JSON_HEX_QUOT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE ) . '</script>' . "\n";
}
add_action( 'wp_head', 'arcsecs_publications_metadata', 3 );

/** Public reading editions, built offline from the original publication Markdown. */
function arcsecs_reader_catalog() {
    return array(
        'book' => array( 'path' => 'read-book/', 'owner' => 'Theme', 'title' => 'Read BEYOND SPACETIME — Free Online Book | ArcSecs', 'name' => 'Read BEYOND SPACETIME', 'description' => 'Online main-book edition of BEYOND SPACETIME, with equations, figures, source downloads, and the linked appended scientific review. Independent theoretical research; no purchase required.', 'image' => arcsecs_publications_cover_url(), 'priority' => '0.95', 'changefreq' => 'monthly', 'keywords' => 'BEYOND SPACETIME, free book, ArcSecs', 'download' => 'book_pdf' ),
        'paper' => array( 'path' => 'read-scientific-paper/', 'owner' => 'Theme', 'title' => 'Read Scientific Review 6.0 — ArcSecs Research Paper', 'name' => 'Read Scientific Review 6.0', 'description' => 'Online reading edition of the full ArcSecs scientific review, with equations, figures, and original Markdown. Conditional calculations, not experimental validation.', 'image' => arcsecs_publications_cover_url(), 'priority' => '0.95', 'changefreq' => 'monthly', 'keywords' => 'ArcSecs, scientific review, photon propagation, mathematical physics', 'download' => 'paper_pdf' ),
    );
}
function arcsecs_reader_key() {
    $value = (string) get_query_var( 'arcsecs_reader' );
    $catalog = arcsecs_reader_catalog();
    if ( isset( $catalog[ $value ] ) ) { return $value; }
    $request = isset( $_SERVER['REQUEST_URI'] ) ? wp_parse_url( wp_unslash( $_SERVER['REQUEST_URI'] ), PHP_URL_PATH ) : '';
    foreach ( $catalog as $key => $entry ) {
        if ( untrailingslashit( (string) $request ) === untrailingslashit( (string) wp_parse_url( home_url( '/' . $entry['path'] ), PHP_URL_PATH ) ) ) { return $key; }
    }
    return '';
}
function arcsecs_publication_asset_url( $asset ) {
    return get_template_directory_uri() . '/assets/publications/' . $asset;
}
function arcsecs_render_reader( $key ) {
    $catalog = arcsecs_reader_catalog();
    if ( ! isset( $catalog[ $key ] ) ) { return; }
    $entry = $catalog[ $key ];
    $file = get_template_directory() . '/assets/publications/readers/' . $key . '/body.html';
    if ( ! is_readable( $file ) ) { return; }
    global $wp_query;
    if ( isset( $wp_query ) ) { $wp_query->is_404 = false; $wp_query->is_page = true; $wp_query->is_home = false; }
    status_header( 200 );
    get_header();
    require get_template_directory() . '/template-parts/publication-reader.php';
    get_footer();
    exit;
}
function arcsecs_reader_metadata() {
    $key = arcsecs_reader_key();
    if ( ! $key ) { return; }
    $entry = arcsecs_reader_catalog()[ $key ];
    $url = arcsecs_ai_access_url( $entry['path'] );
    echo '<link rel="canonical" href="' . esc_url( $url ) . '" />' . "\n";
    echo '<meta name="description" content="' . esc_attr( $entry['description'] ) . '" />' . "\n";
    echo '<link rel="license" href="https://creativecommons.org/publicdomain/zero/1.0/" />' . "\n";
    $schema = array( '@context' => 'https://schema.org', '@type' => 'WebPage', 'name' => $entry['name'], 'url' => $url, 'description' => $entry['description'], 'isAccessibleForFree' => true, 'mainEntity' => array( '@id' => arcsecs_ai_access_url( 'publications/' ) . ( 'book' === $key ? '#book' : '#scientific-paper' ) ) );
    echo '<script type="application/ld+json">' . wp_json_encode( $schema, JSON_HEX_TAG | JSON_HEX_AMP | JSON_HEX_APOS | JSON_HEX_QUOT | JSON_UNESCAPED_SLASHES ) . '</script>' . "\n";
}
add_action( 'wp_head', 'arcsecs_reader_metadata', 3 );
