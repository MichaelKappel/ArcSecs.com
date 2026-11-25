<?php
/**
 * ArcSecs theme functions.
 *
 * @package ArcSecs
 */

if (!defined('ABSPATH')) {
    exit;
}

define('ARCSECS_VERSION', '3.138.0');
define('ARCSECS_DIR', get_template_directory());
define('ARCSECS_URI', get_template_directory_uri());
define('ARCSECS_CONTENT_MODIFIED_DATE', '2026-11-25');
define('ARCSECS_DEFAULT_OG_IMAGE_WIDTH', '1916');
define('ARCSECS_DEFAULT_OG_IMAGE_HEIGHT', '821');

function arcsecs_setup() {
    load_theme_textdomain('arcsecs', ARCSECS_DIR . '/languages');

    add_theme_support('title-tag');
    add_theme_support('automatic-feed-links');
    add_theme_support('post-thumbnails');
    add_theme_support('responsive-embeds');
    add_theme_support('align-wide');
    add_theme_support('customize-selective-refresh-widgets');
    add_theme_support('html5', array('search-form', 'comment-form', 'comment-list', 'gallery', 'caption', 'style', 'script'));
    add_theme_support('editor-styles');
    add_editor_style('style.css');

    add_image_size('arcsecs-card', 900, 520, true);
    add_image_size('arcsecs-hero', 1800, 950, true);

    register_nav_menus(array(
        'primary' => __('Primary Menu', 'arcsecs'),
        'footer'  => __('Footer Menu', 'arcsecs'),
    ));
}
add_action('after_setup_theme', 'arcsecs_setup');

function arcsecs_content_width() {
    $GLOBALS['content_width'] = apply_filters('arcsecs_content_width', 1080);
}
add_action('after_setup_theme', 'arcsecs_content_width', 0);

function arcsecs_enqueue_assets() {
    $style_path    = ARCSECS_DIR . '/style.css';
    $style_version = file_exists($style_path) ? (string) filemtime($style_path) : ARCSECS_VERSION;
    $navigation_script_path = ARCSECS_DIR . '/assets/js/navigation.js';
    $navigation_script_version = file_exists($navigation_script_path) ? (string) filemtime($navigation_script_path) : ARCSECS_VERSION;

    wp_enqueue_style('arcsecs-style', ARCSECS_URI . '/style.css', array(), $style_version);
    wp_enqueue_script('arcsecs-navigation', ARCSECS_URI . '/assets/js/navigation.js', array(), $navigation_script_version, true);
    wp_script_add_data('arcsecs-navigation', 'defer', true);

    if ( function_exists( 'arcsecs_is_cosmic_anomalies_tracker_page' ) && arcsecs_is_cosmic_anomalies_tracker_page() ) {
        $tracker_script_path = ARCSECS_DIR . '/assets/js/cosmic-anomalies-tracker.js';
        $tracker_script_version = file_exists($tracker_script_path) ? (string) filemtime($tracker_script_path) : ARCSECS_VERSION;
        wp_enqueue_script('arcsecs-cosmic-anomalies-tracker', ARCSECS_URI . '/assets/js/cosmic-anomalies-tracker.js', array(), $tracker_script_version, true);
        wp_script_add_data('arcsecs-cosmic-anomalies-tracker', 'defer', true);
    }

    if ( function_exists( 'arcsecs_is_cosmology_comparison_page' ) && arcsecs_is_cosmology_comparison_page() ) {
        $typescript_browser_script_path = ARCSECS_DIR . '/assets/js/typescript-source-browser.js';
        $typescript_browser_script_version = file_exists($typescript_browser_script_path) ? (string) filemtime($typescript_browser_script_path) : ARCSECS_VERSION;
        wp_enqueue_script('arcsecs-typescript-source-browser', ARCSECS_URI . '/assets/js/typescript-source-browser.js', array(), $typescript_browser_script_version, true);
        wp_script_add_data('arcsecs-typescript-source-browser', 'defer', true);
    }


    if ( function_exists( 'arcsecs_should_enqueue_evidence_source_browser' ) && arcsecs_should_enqueue_evidence_source_browser() ) {
        $evidence_browser_script_path    = ARCSECS_DIR . '/assets/js/evidence-source-browser.js';
        $evidence_browser_script_version = file_exists( $evidence_browser_script_path ) ? (string) filemtime( $evidence_browser_script_path ) : ARCSECS_VERSION;
        wp_enqueue_script( 'arcsecs-evidence-source-browser', ARCSECS_URI . '/assets/js/evidence-source-browser.js', array(), $evidence_browser_script_version, true );
        wp_script_add_data( 'arcsecs-evidence-source-browser', 'defer', true );
    }
}
add_action('wp_enqueue_scripts', 'arcsecs_enqueue_assets');

/**
 * Resolve theme-local CSS asset URLs when style.css is printed by the theme.
 *
 * WordPress serves style.css from the theme directory, but CSS printed inside
 * the document head resolves relative URLs against the current page. This
 * helper keeps every image reference pointed at the bundled theme assets.
 *
 * @param string $stylesheet The raw style.css contents.
 * @return string Stylesheet with theme-local image URLs converted to absolute theme URLs.
 */
function arcsecs_resolve_theme_asset_urls_in_css( $stylesheet ) {
    $theme_uri = trailingslashit( get_template_directory_uri() );
    $stylesheet = str_replace( "url('assets/", "url('" . $theme_uri . "assets/", $stylesheet );
    $stylesheet = str_replace( 'url("assets/', 'url("' . $theme_uri . 'assets/', $stylesheet );
    $stylesheet = str_replace( 'url(assets/', 'url(' . $theme_uri . 'assets/', $stylesheet );
    return $stylesheet;
}

/**
 * Optionally print the bundled stylesheet as an emergency compatibility fallback.
 *
 * The full stylesheet is normally loaded once as an external, cacheable file.
 * Printing the entire stylesheet in the document head duplicates payload and
 * hurts first render, so this fallback is opt-in only for unusual hosts that
 * strip the normal stylesheet link.
 *
 * @return void
 */
function arcsecs_print_self_contained_theme_stylesheet() {
    if ( is_admin() || ! apply_filters( 'arcsecs_enable_inline_stylesheet_fallback', false ) ) {
        return;
    }

    $style_path = ARCSECS_DIR . '/style.css';
    if ( ! file_exists( $style_path ) || ! is_readable( $style_path ) ) {
        return;
    }

    $stylesheet = file_get_contents( $style_path );
    if ( ! is_string( $stylesheet ) || trim( $stylesheet ) === '' ) {
        return;
    }

    $stylesheet = arcsecs_resolve_theme_asset_urls_in_css( $stylesheet );

    echo "\n<style id=\"arcsecs-v5-inline-style-fallback\" data-arcsecs-version=\"" . esc_attr( ARCSECS_VERSION ) . "\">\n";
    echo "/* ArcSecs V5 optional inline stylesheet fallback. Disabled by default for performance. */\n";
    echo str_replace( '</style', '<\/style', $stylesheet );
    echo "\n</style>\n";
}
add_action( 'wp_head', 'arcsecs_print_self_contained_theme_stylesheet', 100 );

function arcsecs_excerpt_more() {
    return '…';
}
add_filter('excerpt_more', 'arcsecs_excerpt_more');

function arcsecs_reading_time($post_id = null) {
    $post_id = $post_id ?: get_the_ID();
    $content = get_post_field('post_content', $post_id);
    $word_count = str_word_count(wp_strip_all_tags($content));
    $minutes = max(1, (int) ceil($word_count / 225));
    return sprintf(_n('%s min read', '%s min read', $minutes, 'arcsecs'), number_format_i18n($minutes));
}

function arcsecs_body_classes($classes) {
    $classes[] = 'arcsecs-theme-v5';
    if (is_front_page()) {
        $classes[] = 'arcsecs-front';
    }
    if (is_home() || is_page('blog')) {
        $classes[] = 'arcsecs-blog-view';
    }
    if (is_singular('post')) {
        $classes[] = 'arcsecs-reading-view';
    }
    if ( function_exists( 'arcsecs_is_cosmic_anomalies_tracker_page' ) && arcsecs_is_cosmic_anomalies_tracker_page() ) {
        $classes[] = 'arcsecs-cosmic-anomalies-view';
    }
    if ( function_exists( 'arcsecs_is_dark_matter_drive_simulator_page' ) && arcsecs_is_dark_matter_drive_simulator_page() ) {
        $classes[] = 'arcsecs-dark-matter-drive-view';
    }
    if ( function_exists( 'arcsecs_is_space_travel_simulation_page' ) && arcsecs_is_space_travel_simulation_page() ) {
        $classes[] = 'arcsecs-space-travel-view';
    }
    return $classes;
}
add_filter('body_class', 'arcsecs_body_classes');

function arcsecs_widgets_init() {
    register_sidebar(array(
        'name'          => __('Article Sidebar', 'arcsecs'),
        'id'            => 'sidebar-1',
        'description'   => __('Optional widgets for article and archive pages.', 'arcsecs'),
        'before_widget' => '<section id="%1$s" class="widget %2$s">',
        'after_widget'  => '</section>',
        'before_title'  => '<h2 class="widget-title">',
        'after_title'   => '</h2>',
    ));
}
add_action('widgets_init', 'arcsecs_widgets_init');

function arcsecs_fallback_menu() {
    echo '<ul id="primary-menu" class="menu">';
    $home_current_class = arcsecs_primary_nav_current_class( '/' );
    $blog_current_class = arcsecs_primary_nav_current_class( '/blog/' );
    echo '<li class="menu-item' . esc_attr( $home_current_class ) . '"><a href="' . esc_url( home_url( '/' ) ) . '"' . ( $home_current_class ? ' aria-current="page"' : '' ) . '>' . esc_html__( 'Home', 'arcsecs' ) . '</a></li>';
    echo '<li class="menu-item' . esc_attr( $blog_current_class ) . '"><a href="' . esc_url( home_url( '/blog/' ) ) . '"' . ( $blog_current_class ? ' aria-current="page"' : '' ) . '>' . esc_html__( 'Blog', 'arcsecs' ) . '</a></li>';

    echo arcsecs_render_physics_engine_menu_dropdown();

    foreach ( arcsecs_required_primary_menu_links() as $required_link ) {
        $current_class = arcsecs_primary_nav_current_class( '/' . $required_link['path'] );
        echo '<li class="menu-item ' . esc_attr( $required_link['class'] . $current_class ) . '"><a href="' . esc_url( arcsecs_ai_access_url( $required_link['path'] ) ) . '"' . ( $current_class ? ' aria-current="page"' : '' ) . '>' . esc_html( $required_link['label'] ) . '</a></li>';
    }

    echo '</ul>';
}

function arcsecs_has_featured_image($post_id = null) {
    $post_id = $post_id ?: get_the_ID();
    return has_post_thumbnail($post_id);
}

require ARCSECS_DIR . '/inc/site-repair.php';
require ARCSECS_DIR . '/inc/publications.php';


/**
 * Integrated AI/crawler access layer from the former ArcSecs V5 AI Access child theme.
 * This is now part of the single ArcSecs V5 theme package so only one theme needs to be installed.
 */
define( 'ARCSECS_AI_ACCESS_THEME_VERSION', '3.138.0' );
define( 'ARCSECS_AI_ACCESS_DEMO_PATH', '/arcsecs-physics-engine-demo/' );
define( 'ARCSECS_DARK_MATTER_DRIVE_SIMULATOR_PATH', '/dark-matter-drive-simulator/' );
define( 'ARCSECS_SPACE_TRAVEL_SIMULATION_PATH', '/space-travel-simulation/' );
define( 'ARCSECS_RESEARCH_HUB_PATH', '/arcsecs-research-hub/' );
define( 'ARCSECS_RESEARCH_LIBRARY_PATH', '/research-library/' );
define( 'ARCSECS_MULTI_MESSENGER_LIGHT_DELAY_PATH', '/multi-messenger-light-delay/' );
define( 'ARCSECS_COSMOLOGY_COMPARISON_PATH', '/standard-cosmology-vs-arcsecs/' );
define( 'ARCSECS_COSMIC_ANOMALIES_TRACKER_PATH', '/cosmic-anomalies-tracker/' );
define( 'ARCSECS_AI_ACCESS_DISCLAIMER', 'Speculative research visualization — not established current technology.' );

/**
 * Build the canonical ArcSecs URL for a path.
 *
 * @param string $path Site-relative path.
 * @return string Absolute URL.
 */
function arcsecs_ai_access_url( $path ) {
    return home_url( '/' . ltrim( $path, '/' ) );
}


/**
 * Return a theme image URL for a local asset path.
 *
 * @param string $relative_path Theme-relative image path.
 * @return string Absolute asset URL.
 */
function arcsecs_theme_image_url( $relative_path ) {
    return ARCSECS_URI . '/' . ltrim( $relative_path, '/' );
}

/**
 * Return a WebP companion URL when the optimized asset exists.
 *
 * @param string $relative_path Theme-relative original image path.
 * @return string Empty string when no WebP companion exists.
 */
function arcsecs_theme_webp_url( $relative_path ) {
    $relative_path = ltrim( $relative_path, '/' );
    $webp_relative = preg_replace( '/\.(png|jpe?g)$/i', '.webp', $relative_path );
    if ( ! is_string( $webp_relative ) || $webp_relative === $relative_path ) {
        return '';
    }

    if ( file_exists( ARCSECS_DIR . '/' . $webp_relative ) ) {
        return arcsecs_theme_image_url( $webp_relative );
    }

    return '';
}

/**
 * Print a local theme image with an optimized WebP source when available.
 *
 * @param string $relative_path Theme-relative image path.
 * @param string $alt Image alternative text.
 * @param array<string,string|int|bool> $attributes Image attributes.
 * @return void
 */
function arcsecs_render_theme_picture( $relative_path, $alt = '', $attributes = array() ) {
    $relative_path = ltrim( $relative_path, '/' );
    $image_url     = arcsecs_theme_image_url( $relative_path );
    $webp_url      = arcsecs_theme_webp_url( $relative_path );
    $default_attrs = array(
        'loading'  => 'lazy',
        'decoding' => 'async',
    );
    $attributes = array_merge( $default_attrs, $attributes );

    if ( $webp_url !== '' ) {
        echo '<picture>';
        echo '<source srcset="' . esc_url( $webp_url ) . '" type="image/webp">';
    }

    echo '<img src="' . esc_url( $image_url ) . '" alt="' . esc_attr( $alt ) . '"';
    foreach ( $attributes as $attribute_name => $attribute_value ) {
        if ( is_bool( $attribute_value ) ) {
            if ( $attribute_value ) {
                echo ' ' . esc_attr( (string) $attribute_name );
            }
            continue;
        }
        echo ' ' . esc_attr( (string) $attribute_name ) . '="' . esc_attr( (string) $attribute_value ) . '"';
    }
    echo '>';

    if ( $webp_url !== '' ) {
        echo '</picture>';
    }
}



/**
 * Preload the most important local hero image for the current route.
 *
 * @return void
 */
function arcsecs_preload_route_hero_asset() {
    if ( is_admin() ) {
        return;
    }

    $preload_path = '';
    if ( is_front_page() ) {
        $preload_path = 'assets/images/Cosmic_vortex_and_radiant_beams.webp';
    } elseif ( function_exists( 'arcsecs_is_cosmology_comparison_page' ) && arcsecs_is_cosmology_comparison_page() ) {
        $preload_path = 'assets/images/standard-cosmology-vs-arcsecs-comparison.webp';
    } elseif ( function_exists( 'arcsecs_is_cosmic_anomalies_tracker_page' ) && arcsecs_is_cosmic_anomalies_tracker_page() ) {
        $preload_path = 'assets/images/cosmic-anomalies-tracker-overview.webp';
    } elseif ( function_exists( 'arcsecs_is_multi_messenger_light_delay_page' ) && arcsecs_is_multi_messenger_light_delay_page() ) {
        $preload_path = 'assets/images/light-slowing-energy-degeneration-diagram.webp';
    }

    if ( $preload_path === '' || ! file_exists( ARCSECS_DIR . '/' . $preload_path ) ) {
        return;
    }

    echo '<link rel="preload" as="image" href="' . esc_url( arcsecs_theme_image_url( $preload_path ) ) . '" type="image/webp" fetchpriority="high">' . "\n";
}
add_action( 'wp_head', 'arcsecs_preload_route_hero_asset', 2 );

/**
 * Return the plugin-provided Dark Matter Drive Simulator URL.
 *
 * The simulator route is owned by the ArcSecs plugin. The theme only links to
 * it for discovery and does not implement or duplicate simulator internals.
 *
 * @return string Absolute URL.
 */
function arcsecs_dark_matter_drive_simulator_url() {
    return arcsecs_ai_access_url( 'dark-matter-drive-simulator/' );
}

/**
 * Return the public Ship Travel / Space Travel Simulation URL.
 *
 * The page is a theme-owned discovery and bridge route for the plugin-owned
 * propulsion simulator lane. It avoids a public 404 without moving simulator
 * logic, telemetry, or export-builder behavior into the theme.
 *
 * @return string Absolute URL.
 */
function arcsecs_space_travel_simulation_url() {
    return arcsecs_ai_access_url( 'space-travel-simulation/' );
}


/**
 * Return the plugin/demo links that should live under the Physics Engine menu.
 *
 * The theme only links to plugin-owned/public routes. It does not move simulator
 * logic, telemetry, or export-builder behavior into the theme.
 *
 * @return array<int,array<string,string>> Required Physics Engine submenu links.
 */
function arcsecs_physics_engine_menu_links() {
    return array(
        array(
            'path'  => 'arcsecs-physics-engine-demo/',
            'label' => __( 'Physics Demo', 'arcsecs' ),
            'class' => 'arcsecs-feature-menu-item arcsecs-feature-menu-item--demo',
        ),
        array(
            'path'  => 'dark-matter-drive-simulator/',
            'label' => __( 'DM Drive', 'arcsecs' ),
            'class' => 'arcsecs-feature-menu-item arcsecs-feature-menu-item--drive',
        ),
        array(
            'path'  => 'space-travel-simulation/',
            'label' => __( 'Ship Travel', 'arcsecs' ),
            'class' => 'arcsecs-feature-menu-item arcsecs-feature-menu-item--ship-travel',
        ),
    );
}

/**
 * Return whether the current request matches one of the Physics Engine links.
 *
 * @return bool Whether a Physics Engine submenu item is active.
 */
function arcsecs_is_physics_engine_menu_current() {
    foreach ( arcsecs_physics_engine_menu_links() as $physics_engine_link ) {
        if ( arcsecs_primary_nav_current_class( '/' . $physics_engine_link['path'] ) ) {
            return true;
        }
    }

    return false;
}

/**
 * Extract a custom primary-menu URL from rendered menu HTML by label.
 *
 * This preserves site-admin custom URLs such as a plugin-provided Ship Travel
 * route while still grouping those links under the Physics Engine dropdown.
 *
 * @param string $items Rendered menu HTML.
 * @param string $label Link label to search for.
 * @return string Custom URL when found, otherwise empty string.
 */
function arcsecs_extract_primary_menu_url_by_label( $items, $label ) {
    if ( ! preg_match_all( '#<li\b(?:(?!</li>).)*?</li>#is', (string) $items, $matches ) ) {
        return '';
    }

    foreach ( $matches[0] as $menu_item_html ) {
        $plain_label = trim( preg_replace( '/\s+/', ' ', wp_strip_all_tags( $menu_item_html ) ) );

        if ( 0 !== strcasecmp( $plain_label, (string) $label ) ) {
            continue;
        }

        if ( preg_match( '#<a\b[^>]*href=("|\')([^"\']+)\1#i', $menu_item_html, $href_match ) ) {
            return html_entity_decode( $href_match[2], ENT_QUOTES, get_bloginfo( 'charset' ) );
        }
    }

    return '';
}

/**
 * Render the Physics Engine dropdown for the primary menu.
 *
 * @param string $existing_items Existing menu HTML used to preserve custom URLs.
 * @return string Dropdown list item HTML.
 */
function arcsecs_render_physics_engine_menu_dropdown( $existing_items = '' ) {
    $current_class = arcsecs_is_physics_engine_menu_current() ? ' current-menu-ancestor current-menu-item' : '';
    $current_state = arcsecs_is_physics_engine_menu_current() ? 'true' : 'false';
    $submenu_id    = 'arcsecs-physics-engine-submenu';
    $html          = '<li class="menu-item menu-item-has-children arcsecs-feature-menu-item arcsecs-feature-menu-item--physics-engine-dropdown' . esc_attr( $current_class ) . '">';
    $html         .= '<a href="' . esc_url( arcsecs_ai_access_url( 'arcsecs-physics-engine-demo/' ) ) . '" data-arcsecs-route="physics-engine" aria-haspopup="true" aria-expanded="false" aria-controls="' . esc_attr( $submenu_id ) . '">' . esc_html__( 'Physics Engine', 'arcsecs' ) . '</a>';
    $html         .= '<ul id="' . esc_attr( $submenu_id ) . '" class="sub-menu arcsecs-physics-engine-menu" aria-label="' . esc_attr__( 'Physics Engine pages', 'arcsecs' ) . '" data-arcsecs-current="' . esc_attr( $current_state ) . '">';

    foreach ( arcsecs_physics_engine_menu_links() as $physics_engine_link ) {
        $custom_url    = arcsecs_extract_primary_menu_url_by_label( $existing_items, wp_strip_all_tags( $physics_engine_link['label'] ) );
        $link_url      = $custom_url ? $custom_url : arcsecs_ai_access_url( $physics_engine_link['path'] );
        $current_child = arcsecs_primary_nav_current_class( '/' . $physics_engine_link['path'] );
        $html         .= '<li class="menu-item ' . esc_attr( $physics_engine_link['class'] . $current_child ) . '"><a href="' . esc_url( $link_url ) . '" data-arcsecs-route="' . esc_attr( trim( arcsecs_normalize_nav_path( $physics_engine_link['path'] ), '/' ) ) . '">' . esc_html( $physics_engine_link['label'] ) . '</a></li>';
    }

    $html .= '</ul></li>';

    return $html;
}

/**
 * Remove standalone demo links and group them under Physics Engine.
 *
 * @param string $items Rendered menu item HTML.
 * @return string Updated menu item HTML.
 */
function arcsecs_group_primary_menu_demo_links( $items ) {
    $items = (string) $items;

    if ( false !== strpos( $items, 'arcsecs-feature-menu-item--physics-engine-dropdown' ) ) {
        return $items;
    }

    $demo_label_patterns = array(
        'Physics Demo',
        'Physics Engine Demo',
        'DM Drive',
        'Dark Matter Drive Simulator',
        'Ship Travel',
        'Space Travel',
    );

    $demo_paths = array(
        'arcsecs-physics-engine-demo/',
        'dark-matter-drive-simulator/',
        'space-travel-simulation/',
        'ship-travel/',
    );

    $items = (string) preg_replace_callback(
        '#<li\b(?:(?!</li>).)*?</li>#is',
        static function ( $matches ) use ( $demo_label_patterns, $demo_paths ) {
            $menu_item_html = $matches[0];
            $plain_label    = trim( preg_replace( '/\s+/', ' ', wp_strip_all_tags( $menu_item_html ) ) );

            foreach ( $demo_paths as $demo_path ) {
                if ( false !== stripos( $menu_item_html, $demo_path ) ) {
                    return '';
                }
            }

            foreach ( $demo_label_patterns as $demo_label_pattern ) {
                if ( 0 === strcasecmp( $plain_label, $demo_label_pattern ) ) {
                    return '';
                }
            }

            return $menu_item_html;
        },
        $items
    );

    return arcsecs_render_physics_engine_menu_dropdown( (string) $items ) . $items;
}

/**
 * Return the compact required top-navigation links owned by the theme.
 *
 * The simulator route itself is plugin-owned. The theme only links to its
 * public route so visitors can discover it without duplicating simulator code.
 *
 * @return array<int,array<string,string>> Required top-nav links.
 */
function arcsecs_required_primary_menu_links() {
    return array(
        array( 'path' => 'publications/', 'label' => __( 'Books & Papers', 'arcsecs' ), 'class' => 'arcsecs-feature-menu-item arcsecs-feature-menu-item--publications' ),
        array(
            'path'  => 'arcsecs-research-hub/',
            'label' => __( 'Start Here', 'arcsecs' ),
            'class' => 'arcsecs-feature-menu-item arcsecs-feature-menu-item--hub',
        ),
        array(
            'path'  => 'arcsecs-distance-time-framework/',
            'label' => __( 'Distance-Time', 'arcsecs' ),
            'class' => 'arcsecs-feature-menu-item arcsecs-feature-menu-item--distance-time',
        ),
        array(
            'path'  => 'standard-cosmology-vs-arcsecs/',
            'label' => __( 'Cosmology', 'arcsecs' ),
            'class' => 'arcsecs-feature-menu-item arcsecs-feature-menu-item--comparison',
        ),
        array(
            'path'  => 'cosmic-anomalies-tracker/',
            'label' => __( 'Anomalies', 'arcsecs' ),
            'class' => 'arcsecs-feature-menu-item arcsecs-feature-menu-item--anomalies',
        ),
    );
}

/**
 * Normalize a URL or site path for menu comparisons.
 *
 * @param string $url URL or path to normalize.
 * @return string Normalized path with leading and trailing slash.
 */
function arcsecs_normalize_nav_path( $url ) {
    $path = wp_parse_url( (string) $url, PHP_URL_PATH );

    if ( empty( $path ) ) {
        $path = '/';
    }

    return trailingslashit( '/' . ltrim( $path, '/' ) );
}

/**
 * Return the current-menu class when a menu path matches the current request.
 *
 * @param string $path Menu path.
 * @return string Current class fragment, including leading space when active.
 */
function arcsecs_primary_nav_current_class( $path ) {
    $request_path = isset( $_SERVER['REQUEST_URI'] ) ? wp_parse_url( sanitize_text_field( wp_unslash( $_SERVER['REQUEST_URI'] ) ), PHP_URL_PATH ) : '/';

    if ( arcsecs_normalize_nav_path( $path ) === arcsecs_normalize_nav_path( (string) $request_path ) ) {
        return ' current-menu-item';
    }

    return '';
}

/**
 * Compact required primary-menu labels and add theme classes to matching links.
 *
 * Custom WordPress menus can still be used. This filter only normalizes labels
 * for known ArcSecs routes so long labels do not crowd the header.
 *
 * @param array<int,WP_Post> $items Menu item objects.
 * @param stdClass          $args  Menu arguments provided by wp_nav_menu().
 * @return array<int,WP_Post> Updated menu item objects.
 */
function arcsecs_compact_primary_menu_item_labels( $items, $args ) {
    if ( ! isset( $args->theme_location ) || 'primary' !== $args->theme_location ) {
        return $items;
    }

    $required_links = arcsecs_required_primary_menu_links();
    $required_map   = array();

    foreach ( $required_links as $required_link ) {
        $required_map[ arcsecs_normalize_nav_path( $required_link['path'] ) ] = $required_link;
    }

    $seen_paths = array();
    $clean_items = array();

    foreach ( $items as $item ) {
        $item_path = arcsecs_normalize_nav_path( isset( $item->url ) ? $item->url : '' );

        if ( isset( $required_map[ $item_path ] ) ) {
            if ( isset( $seen_paths[ $item_path ] ) ) {
                continue;
            }

            $seen_paths[ $item_path ] = true;
            $item->title              = $required_map[ $item_path ]['label'];
            $item->classes            = is_array( $item->classes ) ? $item->classes : array();
            $item->classes[]          = 'arcsecs-feature-menu-item';

            foreach ( explode( ' ', $required_map[ $item_path ]['class'] ) as $class_name ) {
                $item->classes[] = $class_name;
            }

            if ( arcsecs_primary_nav_current_class( $item_path ) ) {
                $item->classes[] = 'current-menu-item';
            }

            $item->classes = array_values( array_unique( array_filter( $item->classes ) ) );
        }

        $clean_items[] = $item;
    }

    return $clean_items;
}
add_filter( 'wp_nav_menu_objects', 'arcsecs_compact_primary_menu_item_labels', 20, 2 );

/**
 * Append required ArcSecs research pages to custom primary menus.
 *
 * The fallback menu already includes these links, but WordPress ignores the
 * fallback once a site owner assigns a custom Primary Menu. This filter keeps
 * the virtual research pages visible at the top of the site without requiring
 * manual wp-admin menu edits after every package update.
 *
 * @param string   $items Rendered menu item HTML.
 * @param stdClass $args  Menu arguments provided by wp_nav_menu().
 * @return string Updated menu item HTML.
 */
function arcsecs_append_required_primary_menu_links( $items, $args ) {
    if ( ! isset( $args->theme_location ) || 'primary' !== $args->theme_location ) {
        return $items;
    }

    $items = arcsecs_group_primary_menu_demo_links( $items );

    foreach ( arcsecs_required_primary_menu_links() as $required_link ) {
        if ( false !== strpos( $items, $required_link['path'] ) ) {
            continue;
        }

        $current_class = arcsecs_primary_nav_current_class( '/' . $required_link['path'] );
        $items        .= '<li class="menu-item ' . esc_attr( $required_link['class'] . $current_class ) . '"><a href="' . esc_url( arcsecs_ai_access_url( $required_link['path'] ) ) . '">' . esc_html( $required_link['label'] ) . '</a></li>';
    }

    return $items;
}
add_filter( 'wp_nav_menu_items', 'arcsecs_append_required_primary_menu_links', 95, 2 );


/**
 * Add route metadata and active-state attributes to known primary-menu links.
 *
 * WordPress handles many current-menu classes automatically for real pages,
 * but the ArcSecs virtual routes and plugin-owned simulator route need a
 * deterministic current state based on request path.
 *
 * @param array<string,string> $atts Link attributes.
 * @param WP_Post             $menu_item Menu item object.
 * @param stdClass            $args wp_nav_menu() arguments.
 * @param int                 $depth Menu depth.
 * @return array<string,string> Updated link attributes.
 */
function arcsecs_primary_menu_link_attributes( $atts, $menu_item, $args, $depth ) {
    if ( ! isset( $args->theme_location ) || 'primary' !== $args->theme_location ) {
        return $atts;
    }

    $item_url  = isset( $menu_item->url ) ? $menu_item->url : '';
    $item_path = arcsecs_normalize_nav_path( $item_url );

    foreach ( arcsecs_required_primary_menu_links() as $required_link ) {
        $required_path = arcsecs_normalize_nav_path( $required_link['path'] );

        if ( $required_path !== $item_path ) {
            continue;
        }

        $atts['data-arcsecs-route'] = trim( $required_path, '/' );

        if ( arcsecs_primary_nav_current_class( $required_path ) ) {
            $atts['aria-current'] = 'page';
        }
    }

    return $atts;
}
add_filter( 'nav_menu_link_attributes', 'arcsecs_primary_menu_link_attributes', 20, 4 );

/**
 * Remove duplicate required ArcSecs route links from rendered primary-menu HTML.
 *
 * This is a last-pass safety net for cases where another extension or a custom
 * menu injects the same public route after the theme appends required links.
 * It keeps the first matching list item and removes later duplicates.
 *
 * @param string   $items Rendered menu item HTML.
 * @param stdClass $args  Menu arguments provided by wp_nav_menu().
 * @return string De-duplicated menu item HTML.
 */
function arcsecs_deduplicate_primary_menu_route_html( $items, $args ) {
    if ( ! isset( $args->theme_location ) || 'primary' !== $args->theme_location ) {
        return $items;
    }

    foreach ( arcsecs_required_primary_menu_links() as $required_link ) {
        $path_pattern = preg_quote( $required_link['path'], '#' );
        $pattern      = '#<li\b(?:(?!</li>).)*?<a\b(?:(?!</a>).)*?href=("|\')(?:(?!\1).)*?' . $path_pattern . '(?:(?!\1).)*?\1(?:(?!</li>).)*?</li>#is';
        $seen         = false;

        $items = (string) preg_replace_callback(
            $pattern,
            static function ( $matches ) use ( &$seen ) {
                if ( $seen ) {
                    return '';
                }

                $seen = true;
                return $matches[0];
            },
            $items
        );
    }

    return $items;
}
add_filter( 'wp_nav_menu_items', 'arcsecs_deduplicate_primary_menu_route_html', 999, 2 );

/**
 * Return true when the current request is the physics engine demo route.
 *
 * @return bool Whether this is the demo route.
 */
function arcsecs_ai_access_is_demo_page() {
    $request_path = isset( $_SERVER['REQUEST_URI'] ) ? wp_parse_url( sanitize_text_field( wp_unslash( $_SERVER['REQUEST_URI'] ) ), PHP_URL_PATH ) : '';
    return trailingslashit( (string) $request_path ) === ARCSECS_AI_ACCESS_DEMO_PATH;
}

/**
 * Return true when the current request is the plugin-owned Dark Matter Drive Simulator route.
 *
 * @return bool Whether this is the simulator route.
 */
function arcsecs_is_dark_matter_drive_simulator_page() {
    $request_path = isset( $_SERVER['REQUEST_URI'] ) ? wp_parse_url( sanitize_text_field( wp_unslash( $_SERVER['REQUEST_URI'] ) ), PHP_URL_PATH ) : '';
    return trailingslashit( (string) $request_path ) === ARCSECS_DARK_MATTER_DRIVE_SIMULATOR_PATH;
}

/**
 * Return true when the current request is the Ship Travel / Space Travel Simulation route.
 *
 * @return bool Whether this is the Ship Travel route.
 */
function arcsecs_is_space_travel_simulation_page() {
    $request_path = isset( $_SERVER['REQUEST_URI'] ) ? wp_parse_url( sanitize_text_field( wp_unslash( $_SERVER['REQUEST_URI'] ) ), PHP_URL_PATH ) : '';
    return trailingslashit( (string) $request_path ) === ARCSECS_SPACE_TRAVEL_SIMULATION_PATH || ( function_exists( 'get_query_var' ) && get_query_var( 'arcsecs_space_travel_simulation' ) );
}

/**
 * Return true when the current request is the ArcSecs Research Hub route.
 *
 * @return bool Whether this is the research hub route.
 */
function arcsecs_is_research_hub_page() {
    $request_path = isset( $_SERVER['REQUEST_URI'] ) ? wp_parse_url( sanitize_text_field( wp_unslash( $_SERVER['REQUEST_URI'] ) ), PHP_URL_PATH ) : '';
    return trailingslashit( (string) $request_path ) === ARCSECS_RESEARCH_HUB_PATH || ( function_exists( 'get_query_var' ) && get_query_var( 'arcsecs_research_hub' ) );
}

/**
 * Return true when the current request is the ArcSecs Research Library route.
 *
 * @return bool Whether this is the research library route.
 */
function arcsecs_is_research_library_page() {
    $request_path = isset( $_SERVER['REQUEST_URI'] ) ? wp_parse_url( sanitize_text_field( wp_unslash( $_SERVER['REQUEST_URI'] ) ), PHP_URL_PATH ) : '';
    return trailingslashit( (string) $request_path ) === ARCSECS_RESEARCH_LIBRARY_PATH || ( function_exists( 'get_query_var' ) && get_query_var( 'arcsecs_research_library' ) );
}

/**
 * Return true when the current request is the Multi-Messenger Light Delay route.
 *
 * @return bool Whether this is the multi-messenger light-delay route.
 */
function arcsecs_is_multi_messenger_light_delay_page() {
    $request_path = isset( $_SERVER['REQUEST_URI'] ) ? wp_parse_url( sanitize_text_field( wp_unslash( $_SERVER['REQUEST_URI'] ) ), PHP_URL_PATH ) : '';
    return trailingslashit( (string) $request_path ) === ARCSECS_MULTI_MESSENGER_LIGHT_DELAY_PATH || ( function_exists( 'get_query_var' ) && get_query_var( 'arcsecs_multi_messenger_light_delay' ) );
}

/**
 * Return true when the current request is the cosmology comparison route.
 *
 * @return bool Whether this is the cosmology comparison route.
 */
function arcsecs_is_cosmology_comparison_page() {
    $request_path = isset( $_SERVER['REQUEST_URI'] ) ? wp_parse_url( sanitize_text_field( wp_unslash( $_SERVER['REQUEST_URI'] ) ), PHP_URL_PATH ) : '';
    return trailingslashit( (string) $request_path ) === ARCSECS_COSMOLOGY_COMPARISON_PATH || ( function_exists( 'get_query_var' ) && get_query_var( 'arcsecs_cosmology_comparison' ) );
}

/**
 * Return true when the current request is the cosmic anomalies tracker route.
 *
 * @return bool Whether this is the cosmic anomalies tracker route.
 */
function arcsecs_is_cosmic_anomalies_tracker_page() {
    $request_path = isset( $_SERVER['REQUEST_URI'] ) ? wp_parse_url( sanitize_text_field( wp_unslash( $_SERVER['REQUEST_URI'] ) ), PHP_URL_PATH ) : '';
    return trailingslashit( (string) $request_path ) === ARCSECS_COSMIC_ANOMALIES_TRACKER_PATH || ( function_exists( 'get_query_var' ) && get_query_var( 'arcsecs_cosmic_anomalies_tracker' ) );
}

/**
 * Return the preferred social image for the cosmology comparison page.
 *
 * @return string Absolute image URL.
 */
function arcsecs_cosmology_comparison_image_url() {
    return ARCSECS_URI . '/assets/images/standard-cosmology-vs-arcsecs-comparison.png';
}

/**
 * Return the preferred social image for the cosmic anomalies tracker page.
 *
 * @return string Absolute image URL.
 */
function arcsecs_cosmic_anomalies_tracker_image_url() {
    return ARCSECS_URI . '/assets/images/cosmic-anomalies-tracker-overview.png';
}

/**
 * Return the preferred social image for the Multi-Messenger Light Delay page.
 *
 * @return string Absolute image URL.
 */
function arcsecs_multi_messenger_light_delay_image_url() {
    return ARCSECS_URI . '/assets/images/light-slowing-energy-degeneration-diagram.png';
}

/**
 * Return the preferred social image for the ArcSecs home page and demo route.
 *
 * @return string Absolute image URL.
 */
function arcsecs_home_social_image_url() {
    return ARCSECS_URI . '/assets/images/Cosmic_vortex_and_radiant_beams.png';
}

/**
 * Return the preferred ArcSecs organization logo URL for schema data.
 *
 * @return string Absolute image URL.
 */
function arcsecs_schema_logo_url() {
    return ARCSECS_URI . '/assets/images/arcsecs-logo-refined.png';
}

/**
 * Return the theme favicon URL.
 *
 * @return string Absolute theme favicon URL.
 */
function arcsecs_favicon_url() {
    return ARCSECS_URI . '/favicon.ico';
}

/**
 * Return an ArcSecs theme icon URL.
 *
 * @param int $size Icon size in pixels.
 * @return string Absolute icon URL.
 */
function arcsecs_theme_icon_url( $size ) {
    return ARCSECS_URI . '/assets/icons/arcsecs-icon-' . (int) $size . '.png';
}

/**
 * Output favicon, app icon, and lightweight SEO browser metadata.
 *
 * The links are a theme fallback and do not override a WordPress Site Icon
 * configured by an administrator.
 *
 * @return void
 */
function arcsecs_output_favicon_and_browser_metadata() {
    if ( ! function_exists( 'has_site_icon' ) || ! has_site_icon() ) {
        echo '<link rel="icon" href="' . esc_url( arcsecs_favicon_url() ) . '" sizes="any" />' . "
";
        echo '<link rel="icon" type="image/png" sizes="32x32" href="' . esc_url( arcsecs_theme_icon_url( 32 ) ) . '" />' . "
";
        echo '<link rel="icon" type="image/png" sizes="192x192" href="' . esc_url( arcsecs_theme_icon_url( 192 ) ) . '" />' . "
";
        echo '<link rel="apple-touch-icon" sizes="180x180" href="' . esc_url( arcsecs_theme_icon_url( 180 ) ) . '" />' . "
";
    }

    echo '<link rel="manifest" href="' . esc_url( ARCSECS_URI . '/assets/icons/site.webmanifest' ) . '" />' . "
";
    echo '<meta name="theme-color" content="#020713" />' . "
";
    echo '<meta name="application-name" content="ArcSecs" />' . "
";
    echo '<meta name="apple-mobile-web-app-title" content="ArcSecs" />' . "
";
    echo '<meta name="msapplication-TileColor" content="#020713" />' . "
";
    echo '<meta name="msapplication-TileImage" content="' . esc_url( arcsecs_theme_icon_url( 192 ) ) . '" />' . "
";
    echo '<meta name="format-detection" content="telephone=no" />' . "
";
    echo '<link rel="alternate" type="text/plain" title="ArcSecs llms.txt" href="' . esc_url( arcsecs_ai_access_url( 'llms.txt' ) ) . '" />' . "
";
}
add_action( 'wp_head', 'arcsecs_output_favicon_and_browser_metadata', 1 );

/**
 * Return durable SEO definitions for the theme-owned public route graph.
 *
 * @return array<int,array<string,mixed>> SEO route entries.
 */
function arcsecs_get_public_route_seo_entries() {
    return array(
        arcsecs_publications_seo_entry(),
        arcsecs_reader_catalog()['book'],
        arcsecs_reader_catalog()['paper'],
        array(
            'path'        => '',
            'owner'       => 'Theme',
            'title'       => 'ArcSecs | Speculative Cosmology, Tired Light, and Physics Simulation',
            'name'        => 'ArcSecs Home',
            'description' => 'ArcSecs explores speculative cosmology, tired light, massive photon ideas, dark-sector models, Distance-Time Framework research, propulsion thought experiments, and test-driven physics simulations.',
            'image'       => arcsecs_home_social_image_url(),
            'priority'    => '1.0',
            'changefreq'  => 'weekly',
            'keywords'    => 'ArcSecs, speculative cosmology, tired light, photon mass, dark matter, Distance-Time Framework, physics simulation, ArcSecs Physics Engine',
        ),
        array(
            'path'        => 'arcsecs-research-hub/',
            'owner'       => 'Theme',
            'title'       => 'ArcSecs Research Hub | Start Here',
            'name'        => 'ArcSecs Research Hub',
            'description' => 'Start here for ArcSecs speculative cosmology, the Distance-Time Framework, framework comparison, cosmic anomalies, Physics Engine demos, propulsion concepts, and published scientific resources.',
            'image'       => arcsecs_home_social_image_url(),
            'priority'    => '1.0',
            'changefreq'  => 'weekly',
            'keywords'    => 'ArcSecs research hub, Distance-Time Framework, alternative cosmology, physics engine demo, tired light, cosmic anomalies',
        ),
        array(
            'path'        => 'research-library/',
            'owner'       => 'Theme',
            'title'       => 'ArcSecs Research Library | Evidence, Sources, and Scientific Links',
            'name'        => 'ArcSecs Research Library',
            'description' => 'Browse ArcSecs source links grouped by Hubble tension, JWST early galaxies, SPARC rotation curves, El Gordo, Lithium-7, Proca photon bounds, tired-light constraints, and propulsion analogies.',
            'image'       => arcsecs_home_social_image_url(),
            'priority'    => '0.94',
            'changefreq'  => 'weekly',
            'keywords'    => 'ArcSecs research library, Hubble tension sources, JWST early galaxies, SPARC rotation curves, Proca photon mass, tired light constraints, dark matter drive sources',
        ),

        array(
            'path'        => 'arcsecs-distance-time-framework/',
            'owner'       => 'Theme',
            'title'       => 'ArcSecs Distance-Time Framework | Measuring Without Lightyears',
            'name'        => 'ArcSecs Distance-Time Framework',
            'description' => 'ArcSecs explains a speculative Distance-Time Framework for measuring cosmic distance without lightyears and modeling universal progression without local clocks, using parallax, parsecs, gravity-wave baselines, relational time, and multi-messenger tests.',
            'image'       => arcsecs_home_social_image_url(),
            'priority'    => '0.98',
            'changefreq'  => 'weekly',
            'keywords'    => 'ArcSecs distance-time framework, measure universe without lightyears, parallax parsec cosmology, gravitational wave standard sirens, clockless time framework, clockless universal progression, multi-messenger simulation, Supernova Light-Curve Stretch, Hubble Tension, gravity wave baseline, degraded electromagnetic light, exportable evidence packets, Benchmark JSON, Calibration Certificate, Evidence Packet, Research Bundle, Scene JSON, falsification path, speculative cosmology simulator, teleparallel gravity, Proca electrodynamics, mass-polariton theory, CCC+TL cosmology, dark-state polariton, graviball condensate',
        ),
        array(
            'path'        => 'multi-messenger-light-delay/',
            'owner'       => 'Theme',
            'title'       => 'Multi-Messenger Light Delay | Gravity First, Light Later | ArcSecs',
            'name'        => 'Multi-Messenger Light Delay',
            'description' => 'Explore GW170817, GW150914, and GW190521 timing as a speculative ArcSecs test page separating gravitational-wave baselines, electromagnetic source delay, environmental diffusion, tired-light energy accounting, and possible light-slowing propagation effects.',
            'image'       => arcsecs_multi_messenger_light_delay_image_url(),
            'priority'    => '0.94',
            'changefreq'  => 'weekly',
            'keywords'    => 'multi-messenger astronomy, GW170817, GW150914, GW190521, light delay, gravitational waves, electromagnetic counterpart, tired light, variable speed of light, ArcSecs',
        ),
        array(
            'path'        => 'arcsecs-physics-engine-demo/',
            'owner'       => 'Theme',
            'title'       => 'ArcSecs Physics Engine Demo | Speculative Physics Visualization',
            'name'        => 'ArcSecs Physics Engine Demo',
            'description' => 'Interactive ArcSecs speculative physics visualization for relational flat-space modeling, tired light, massive photons, diagnostics, and Dark Matter Drive simulation context.',
            'image'       => arcsecs_home_social_image_url(),
            'priority'    => '1.0',
            'changefreq'  => 'weekly',
            'keywords'    => 'ArcSecs Physics Engine Demo, tired light simulation, massive photons, TypeScript physics engine',
        ),
        array(
            'path'        => 'dark-matter-drive-simulator/',
            'owner'       => 'Plugin',
            'title'       => 'Dark Matter Drive Simulator | ArcSecs',
            'name'        => 'Dark Matter Drive Simulator',
            'description' => 'Plugin-owned ArcSecs speculative propulsion sandbox for field capture, shielding, energy ledgers, thermal stress, and deterministic replay experiments.',
            'image'       => arcsecs_home_social_image_url(),
            'priority'    => '0.96',
            'changefreq'  => 'weekly',
            'keywords'    => 'Dark Matter Drive Simulator, ArcSecs propulsion, ramjet capture, speculative physics sandbox',
        ),
        array(
            'path'        => 'space-travel-simulation/',
            'owner'       => 'Theme',
            'title'       => 'Space Travel Simulation: Ship Transit Through Dense Substrate, Void Corridors, and Torsion Fields',
            'name'        => 'Space Travel Simulation',
            'description' => 'ArcSecs speculative research page explaining a space travel simulation through dense-substrate fuel harvesting, void coasting, teleparallel torsion, Proca substrate interaction, Mass-Polariton transfer, EIT capture, route planning, autopilot, and mission objectives.',
            'image'       => arcsecs_home_social_image_url(),
            'priority'    => '0.94',
            'changefreq'  => 'weekly',
            'keywords'    => 'ArcSecs space travel simulation, dense substrate, void corridor, torsion fields, teleparallel torsion, Proca substrate, Mass-Polariton transfer, tired light, graviball substrate, EIT capture, Dark-State Polariton, ramscoop vortex, route planning, autopilot, mission objectives, telemetry export contract, dense region void corridor tradeoff, falsification path',
        ),

        array(
            'path'        => 'standard-cosmology-vs-arcsecs/',
            'owner'       => 'Theme',
            'title'       => 'Standard Cosmology vs. ArcSecs | Spacetime, Tired Light, and Simulation',
            'name'        => 'Standard Cosmology vs ArcSecs',
            'description' => 'Compare mainstream Lambda-CDM cosmology with the speculative ArcSecs framework, including spacetime, tired light, photon mass, slow-light dark matter, propulsion concepts, and TypeScript simulation architecture.',
            'image'       => arcsecs_cosmology_comparison_image_url(),
            'priority'    => '0.95',
            'changefreq'  => 'weekly',
            'keywords'    => 'Standard Cosmology vs ArcSecs, Lambda-CDM, tired light, Proca electrodynamics, photon mass, TypeScript physics engine',
        ),
        array(
            'path'        => 'cosmic-anomalies-tracker/',
            'owner'       => 'Theme',
            'title'       => 'Cosmic Anomalies Tracker | ArcSecs',
            'name'        => 'Cosmic Anomalies Tracker',
            'description' => 'Track cosmological anomalies including the Hubble tension, JWST early galaxies, galaxy rotation curves, El Gordo, Lithium-7, tired light, Proca photons, and ArcSecs speculative physics models.',
            'image'       => arcsecs_cosmic_anomalies_tracker_image_url(),
            'priority'    => '0.95',
            'changefreq'  => 'weekly',
            'keywords'    => 'cosmic anomalies, Hubble tension, JWST early galaxies, Lambda-CDM problems, tired light, Proca electrodynamics',
        ),
        array(
            'path'        => 'arcsecs-physics-engine-demo/ai-summary/',
            'owner'       => 'Theme',
            'title'       => 'ArcSecs Physics Engine Demo AI Summary',
            'name'        => 'Physics Engine Demo AI Summary',
            'description' => 'AI-readable summary of the ArcSecs speculative Physics Engine Demo routes, scenarios, crawler policy, and simulation boundaries.',
            'image'       => '',
            'priority'    => '0.9',
            'changefreq'  => 'weekly',
            'keywords'    => 'ArcSecs AI summary, llms, physics engine routes',
        ),
        array(
            'path'        => 'llms.txt',
            'owner'       => 'Theme',
            'title'       => 'ArcSecs llms.txt',
            'name'        => 'ArcSecs llms.txt',
            'description' => 'Plain-text AI and crawler guidance for ArcSecs public research routes, simulations, sitemap, and scientific publications.',
            'image'       => '',
            'priority'    => '0.8',
            'changefreq'  => 'weekly',
            'keywords'    => 'llms.txt, ArcSecs AI crawler guidance',
        ),
        array(
            'path'        => 'arcsecs-sitemap.xml',
            'owner'       => 'Theme',
            'title'       => 'ArcSecs XML Sitemap',
            'name'        => 'ArcSecs XML Sitemap',
            'description' => 'Custom ArcSecs XML sitemap for key public research and simulation routes.',
            'image'       => '',
            'priority'    => '0.6',
            'changefreq'  => 'weekly',
            'keywords'    => 'ArcSecs sitemap',
        ),
    );
}

/**
 * Return a single SEO entry by route path.
 *
 * @param string $path Route path without a leading slash.
 * @return array<string,mixed>|null Matching SEO entry or null.
 */
function arcsecs_get_public_route_seo_entry( $path ) {
    $normalized_path = ltrim( (string) $path, '/' );
    foreach ( arcsecs_get_public_route_seo_entries() as $entry ) {
        if ( $entry['path'] === $normalized_path ) {
            return $entry;
        }
    }

    return null;
}

/**
 * Return global Organization, WebSite, and SiteNavigationElement schema nodes.
 *
 * @return array<int,array<string,mixed>> Global schema nodes.
 */
function arcsecs_base_schema_graph() {
    $navigation_items = array();
    $position         = 1;
    foreach ( arcsecs_get_public_route_seo_entries() as $entry ) {
        if ( $entry['path'] === 'llms.txt' || $entry['path'] === 'arcsecs-sitemap.xml' || $entry['path'] === 'arcsecs-physics-engine-demo/ai-summary/' ) {
            continue;
        }

        $navigation_items[] = array(
            '@type'    => 'ListItem',
            'position' => $position,
            'name'     => $entry['name'],
            'url'      => arcsecs_ai_access_url( $entry['path'] ),
        );
        $position++;
    }

    return array(
        array(
            '@context' => 'https://schema.org',
            '@type'    => 'Organization',
            '@id'      => arcsecs_ai_access_url( '#organization' ),
            'name'     => 'ArcSecs',
            'url'      => arcsecs_ai_access_url( '' ),
            'logo'     => array(
                '@type'  => 'ImageObject',
                '@id'    => arcsecs_ai_access_url( '#logo' ),
                'url'    => arcsecs_schema_logo_url(),
                'width'  => 1200,
                'height' => 400,
            ),
        ),
        array(
            '@context' => 'https://schema.org',
            '@type'    => 'WebSite',
            '@id'      => arcsecs_ai_access_url( '#website' ),
            'name'     => 'ArcSecs',
            'url'      => arcsecs_ai_access_url( '' ),
            'publisher' => array( '@id' => arcsecs_ai_access_url( '#organization' ) ),
            'potentialAction' => array(
                '@type'       => 'SearchAction',
                'target'      => arcsecs_ai_access_url( '?s={search_term_string}' ),
                'query-input' => 'required name=search_term_string',
            ),
        ),
        array(
            '@context'        => 'https://schema.org',
            '@type'           => 'ItemList',
            '@id'             => arcsecs_ai_access_url( '#site-navigation' ),
            'name'            => 'ArcSecs core public routes',
            'itemListElement' => $navigation_items,
        ),
        array(
            '@context' => 'https://schema.org',
            '@type'    => 'SiteNavigationElement',
            '@id'      => arcsecs_ai_access_url( '#primary-navigation' ),
            'name'     => 'ArcSecs primary navigation',
            'url'      => array_map(
                function ( $navigation_item ) {
                    return $navigation_item['url'];
                },
                $navigation_items
            ),
        ),
    );
}

/**
 * Append global ArcSecs schema nodes to a route-specific graph.
 *
 * @param array<int,array<string,mixed>> $graph Route-specific graph.
 * @return array<int,array<string,mixed>> Full graph.
 */
function arcsecs_with_base_schema_graph( $graph ) {
    return array_merge( arcsecs_base_schema_graph(), $graph );
}


/**
 * Return curated Evidence & Sources topic groups used across ArcSecs pages.
 *
 * Each source intentionally separates what it supports from what it does not
 * prove so public pages do not blur mainstream evidence, model constraints,
 * alternative hypotheses, ArcSecs simulation prompts, or engineering analogies.
 *
 * @return array<int,array<string,mixed>> Evidence source topic groups.
 */
function arcsecs_get_evidence_source_topics() {
    return array(
        array(
            'slug'        => 'multi-messenger-timing',
            'title'       => 'Multi-messenger timing',
            'summary'     => 'Gravitational-wave detections and electromagnetic counterparts provide a timing laboratory for separating source delay, environment delay, and any speculative propagation effect.',
            'sources'     => array(
                array(
                    'type'         => 'Mainstream observational source',
                    'schemaType'   => 'ScholarlyArticle',
                    'title'        => 'GW170817: A Short Review of the First Multimessenger Event in Gravitational Astronomy',
                    'url'          => 'https://www.mdpi.com/2075-4434/13/5/112',
                    'supports'     => 'GW170817 is the benchmark event where gravitational waves were detected before the gamma-ray and optical counterpart, making it the cleanest local timing anchor.',
                    'doesNotProve' => 'The observed lag does not by itself prove cosmological light slowing; most of the delay can be source and ejecta physics.',
                ),
                array(
                    'type'         => 'Mainstream model constraint',
                    'schemaType'   => 'ScholarlyArticle',
                    'title'        => 'arXiv — The Delay Time of Gravitational Wave / Gamma-Ray Burst Associations',
                    'url'          => 'https://arxiv.org/abs/1905.00781',
                    'supports'     => 'Delay-time modeling is a mainstream concern when connecting gravitational-wave events to electromagnetic transients.',
                    'doesNotProve' => 'It does not establish the ArcSecs attenuation model; it shows why delay decomposition matters.',
                ),
                array(
                    'type'         => 'Mainstream observational source',
                    'schemaType'   => 'ScholarlyArticle',
                    'title'        => 'Fermi GBM observations of LIGO gravitational-wave event GW150914',
                    'url'          => 'https://gammaray.nsstc.nasa.gov/gbm/publications/preprints/gbm_ligo_preprint.pdf',
                    'supports'     => 'GW150914 is useful as a debated electromagnetic-counterpart stress case for any propagation-delay model.',
                    'doesNotProve' => 'The gamma-ray transient association is debated and should not be used as a confirmed calibration point without caveats.',
                ),
                array(
                    'type'         => 'Mainstream model constraint',
                    'schemaType'   => 'ScholarlyArticle',
                    'title'        => 'GW190521: a binary black hole merger inside an active galactic nucleus?',
                    'url'          => 'https://arxiv.org/html/2310.16025v2',
                    'supports'     => 'GW190521 and its possible optical flare counterpart motivate environment and AGN diffusion checks.',
                    'doesNotProve' => 'A delayed optical flare candidate does not prove a universal vacuum light-slowing law; local environment can dominate.',
                ),
                array(
                    'type'         => 'ArcSecs simulation prompt',
                    'schemaType'   => 'CreativeWork',
                    'title'        => 'ArcSecs Multi-Messenger Light Delay page',
                    'url'          => arcsecs_ai_access_url( 'multi-messenger-light-delay/' ),
                    'supports'     => 'A site-owned checklist for simulating gravitational-wave baselines, electromagnetic source delays, environment delays, and candidate propagation attenuation.',
                    'doesNotProve' => 'A page and simulator prompt are not observational confirmation; they define what the model must test and where it can fail.',
                ),
            ),
        ),
        array(
            'slug'        => 'hubble-tension',
            'title'       => 'Hubble tension',
            'summary'     => 'Distance-ladder and early-universe Hubble constant estimates remain a useful pressure test for expansion history, calibration, and redshift interpretation.',
            'sources'     => array(
                array(
                    'type'         => 'Mainstream model constraint',
                    'schemaType'   => 'ScholarlyArticle',
                    'title'        => 'CERN Courier — The Hubble tension',
                    'url'          => 'https://cerncourier.com/a/the-hubble-tension/',
                    'supports'     => 'The mainstream community recognizes the Hubble constant disagreement as a serious precision-cosmology tension.',
                    'doesNotProve' => 'It does not prove tired light, a static universe, or the ArcSecs redshift branch.',
                ),
                array(
                    'type'         => 'Mainstream observational source',
                    'schemaType'   => 'ScholarlyArticle',
                    'title'        => 'arXiv — Dissecting the Hubble tension with sound-horizon-free H0 measurements',
                    'url'          => 'https://arxiv.org/pdf/2601.00650',
                    'supports'     => 'A measurement-comparison framework for separating distance-ladder, model-dependent, and model-independent H0 estimates.',
                    'doesNotProve' => 'It does not establish that metric expansion is wrong; it helps define the comparison problem.',
                ),
                array(
                    'type'         => 'ArcSecs simulation prompt',
                    'schemaType'   => 'CreativeWork',
                    'title'        => 'ArcSecs redshift comparison and failure-ledger prompt',
                    'url'          => arcsecs_ai_access_url( 'standard-cosmology-vs-arcsecs/#redshift' ),
                    'supports'     => 'A site-owned test prompt for comparing metric redshift, tired-light decay, dimming, time stretch, and energy accounting.',
                    'doesNotProve' => 'A prompt is not evidence; it is a checklist for what the simulator must expose.',
                ),
            ),
        ),
        array(
            'slug'        => 'jwst-early-galaxies',
            'title'       => 'JWST early galaxies',
            'summary'     => 'Very distant luminous or mature-looking galaxies stress early-galaxy formation timelines and force better spectroscopy, dust, and population modeling.',
            'sources'     => array(
                array(
                    'type'         => 'Mainstream observational source',
                    'schemaType'   => 'CreativeWork',
                    'title'        => 'NASA Webb — Webb finds most distant known galaxy',
                    'url'          => 'https://science.nasa.gov/blogs/webb/2024/05/30/nasas-james-webb-space-telescope-finds-most-distant-known-galaxy/',
                    'supports'     => 'JWST observations have identified extremely high-redshift galaxies that make early structure formation an active research area.',
                    'doesNotProve' => 'It does not prove the universe is static or that high-redshift galaxies are old in the ArcSecs sense.',
                ),
                array(
                    'type'         => 'Mainstream observational source',
                    'schemaType'   => 'CreativeWork',
                    'title'        => 'Steward Observatory — Webb discovers the earliest known galaxy',
                    'url'          => 'https://astro.arizona.edu/news/webb-discovers-earliest-known-galaxy-now',
                    'supports'     => 'Independent science communication around early JWST galaxy discoveries and the need for follow-up interpretation.',
                    'doesNotProve' => 'It does not remove the need for mainstream astrophysical explanations such as dust, selection, and stellar-population modeling.',
                ),
                array(
                    'type'         => 'ArcSecs simulation prompt',
                    'schemaType'   => 'CreativeWork',
                    'title'        => 'ArcSecs deep-time and optical attenuation prompt',
                    'url'          => arcsecs_ai_access_url( 'cosmic-anomalies-tracker/#jwst-article' ),
                    'supports'     => 'A clear place to test whether static-distance redshift, attenuation, and deep-time interpretation branches create measurable predictions.',
                    'doesNotProve' => 'It is not observational confirmation of ArcSecs; it is a modeling challenge.',
                ),
            ),
        ),
        array(
            'slug'        => 'sparc-rotation-curves',
            'title'       => 'SPARC / rotation curves',
            'summary'     => 'Galaxy rotation curves and radial acceleration relations are valuable because they combine robust observation with deep disagreement about interpretation.',
            'sources'     => array(
                array(
                    'type'         => 'Mainstream observational source',
                    'schemaType'   => 'Dataset',
                    'title'        => 'SPARC — Spitzer Photometry and Accurate Rotation Curves database',
                    'url'          => 'https://astroweb.case.edu/SPARC/',
                    'supports'     => 'High-quality galaxy rotation-curve and photometry data used in dark matter and modified-gravity debates.',
                    'doesNotProve' => 'The data alone does not decide between cold dark matter, modified gravity, or an ArcSecs condensate model.',
                ),
                array(
                    'type'         => 'Mainstream model constraint',
                    'schemaType'   => 'ScholarlyArticle',
                    'title'        => 'arXiv — SPARC galaxies prefer Dark Matter over MOND',
                    'url'          => 'https://arxiv.org/html/2401.10202v1',
                    'supports'     => 'An example of mainstream-model comparison arguing that SPARC data can favor dark matter over MOND-style alternatives.',
                    'doesNotProve' => 'It does not prove any ArcSecs dark-sector interpretation; it sets a bar that alternatives must meet.',
                ),
                array(
                    'type'         => 'ArcSecs simulation prompt',
                    'schemaType'   => 'CreativeWork',
                    'title'        => 'ArcSecs condensate-density and rotation-curve prompt',
                    'url'          => arcsecs_ai_access_url( 'cosmic-anomalies-tracker/#rotation-article' ),
                    'supports'     => 'A route into testing whether a slow-light or Proca-photon condensate can mimic halo-like gravity in a visible simulation ledger.',
                    'doesNotProve' => 'A matching curve is not enough; lensing, structure, and conservation must also be addressed.',
                ),
            ),
        ),
        array(
            'slug'        => 'el-gordo',
            'title'       => 'El Gordo cluster',
            'summary'     => 'Massive high-redshift cluster collisions stress-test formation timelines, rare-event statistics, mass estimates, and merger velocity modeling.',
            'sources'     => array(
                array(
                    'type'         => 'Mainstream model constraint',
                    'schemaType'   => 'CreativeWork',
                    'title'        => 'Physics World — Are giant galaxy clusters defying standard cosmology?',
                    'url'          => 'https://physicsworld.com/a/are-giant-galaxy-clusters-defying-standard-cosmology/',
                    'supports'     => 'A public-facing scientific summary of why very massive clusters can function as structure-formation stress tests.',
                    'doesNotProve' => 'It does not by itself falsify Lambda-CDM or establish a static deep-time universe.',
                ),
                array(
                    'type'         => 'Alternative/speculative theory',
                    'schemaType'   => 'CreativeWork',
                    'title'        => 'Triton Station — The Fat One, a test of structure formation',
                    'url'          => 'https://tritonstation.com/2021/02/05/the-fat-one-a-test-of-structure-formation-with-the-most-massive-cluster-of-galaxies/',
                    'supports'     => 'An alternative-cosmology discussion of El Gordo as a challenge case for structure formation.',
                    'doesNotProve' => 'It is not a consensus source and should be read as a critical interpretation.',
                ),
                array(
                    'type'         => 'ArcSecs simulation prompt',
                    'schemaType'   => 'CreativeWork',
                    'title'        => 'ArcSecs cluster collision and deep-time prompt',
                    'url'          => arcsecs_ai_access_url( 'cosmic-anomalies-tracker/#deep-time-article' ),
                    'supports'     => 'A model-test route for collision velocity, mass, morphology, and available formation time.',
                    'doesNotProve' => 'Granting deep time does not replace the need to reproduce observed mass maps and merger geometry.',
                ),
            ),
        ),
        array(
            'slug'        => 'lithium-7',
            'title'       => 'Lithium-7 problem',
            'summary'     => 'Lithium-7 remains useful because it is a specific abundance mismatch inside an otherwise successful light-element framework.',
            'sources'     => array(
                array(
                    'type'         => 'Mainstream model constraint',
                    'schemaType'   => 'ScholarlyArticle',
                    'title'        => 'arXiv — Big Bang nucleosynthesis and early dark energy constraints',
                    'url'          => 'https://arxiv.org/html/2512.11163v2',
                    'supports'     => 'A technical context for how light-element abundances constrain cosmological models.',
                    'doesNotProve' => 'It does not prove ArcSecs chemistry or eliminate standard Big Bang nucleosynthesis successes.',
                ),
                array(
                    'type'         => 'Alternative/speculative theory',
                    'schemaType'   => 'CreativeWork',
                    'title'        => 'Triton Station — The Deuterium-Lithium tension in Big Bang Nucleosynthesis',
                    'url'          => 'https://tritonstation.com/2025/05/16/the-deuterium-lithium-tension-in-big-bang-nucleosynthesis/',
                    'supports'     => 'A critical discussion of why lithium remains a stubborn mismatch rather than a casual rounding error.',
                    'doesNotProve' => 'It does not prove a non-Big-Bang chemical equilibrium model.',
                ),
                array(
                    'type'         => 'ArcSecs simulation prompt',
                    'schemaType'   => 'CreativeWork',
                    'title'        => 'ArcSecs abundance-ledger prompt',
                    'url'          => arcsecs_ai_access_url( 'cosmic-anomalies-tracker/#lithium-article' ),
                    'supports'     => 'A test-ledger location for separating deuterium, helium, lithium, depletion, and equilibrium branches.',
                    'doesNotProve' => 'A speculative equilibrium idea must preserve successful abundance constraints, not merely explain one mismatch.',
                ),
            ),
        ),
        array(
            'slug'        => 'proca-photon-mass-bounds',
            'title'       => 'Proca photon mass bounds',
            'summary'     => 'Photon mass is not observed; the scientific value is in strict upper bounds and the failure states they impose on any massive-photon simulation branch.',
            'sources'     => array(
                array(
                    'type'         => 'Mainstream model constraint',
                    'schemaType'   => 'CreativeWork',
                    'title'        => 'Particle Data Group — Review of Particle Physics',
                    'url'          => 'https://pdg.lbl.gov/',
                    'supports'     => 'The mainstream constraint environment for particle properties, including extremely tight photon-mass limits.',
                    'doesNotProve' => 'An upper bound is not a detection of photon rest mass.',
                ),
                array(
                    'type'         => 'Mainstream model constraint',
                    'schemaType'   => 'ScholarlyArticle',
                    'title'        => 'arXiv — Photon and graviton mass limits',
                    'url'          => 'https://arxiv.org/abs/0809.1003',
                    'supports'     => 'A technical survey context for mass-limit reasoning and why any non-zero photon mass must remain tiny.',
                    'doesNotProve' => 'It does not show that Proca photons explain redshift, dark matter, or lensing.',
                ),
                array(
                    'type'         => 'ArcSecs simulation prompt',
                    'schemaType'   => 'CreativeWork',
                    'title'        => 'ArcSecs Proca branch and guardrail prompt',
                    'url'          => arcsecs_ai_access_url( 'standard-cosmology-vs-arcsecs/#architecture' ),
                    'supports'     => 'A source-code-backed prompt for making photon-mass sliders expose dispersion, guardrails, and warnings.',
                    'doesNotProve' => 'A simulator control is not a measurement of photon mass.',
                ),
            ),
        ),
        array(
            'slug'        => 'tired-light-constraints',
            'title'       => 'Tired light criticism and constraints',
            'summary'     => 'Tired light deserves a visible failure ledger: supernova stretch, Tolman dimming, image sharpness, CMB structure, and energy accounting cannot be hand-waved.',
            'sources'     => array(
                array(
                    'type'         => 'Mainstream model constraint',
                    'schemaType'   => 'ScholarlyArticle',
                    'title'        => 'Tolman surface brightness test — ADS record',
                    'url'          => 'https://ui.adsabs.harvard.edu/abs/1930PNAS...16..511T/abstract',
                    'supports'     => 'The surface-brightness test is a classic observational constraint that static or tired-light models must confront.',
                    'doesNotProve' => 'It does not rule out every conceivable non-expansion redshift model by itself; it defines a hard test.',
                ),
                array(
                    'type'         => 'Alternative/speculative theory',
                    'schemaType'   => 'ScholarlyArticle',
                    'title'        => 'MNRAS — Redshift duality with Pantheon+SH0ES in a Planck-anchored framework',
                    'url'          => 'https://academic.oup.com/mnras/advance-article/doi/10.1093/mnras/stag726/8659021',
                    'supports'     => 'A modern example of redshift interpretation being explored with observational datasets.',
                    'doesNotProve' => 'It does not prove classic tired light or the ArcSecs Proca/tired-light condensate model.',
                ),
                array(
                    'type'         => 'ArcSecs simulation prompt',
                    'schemaType'   => 'CreativeWork',
                    'title'        => 'ArcSecs tired-light failure-ledger prompt',
                    'url'          => arcsecs_ai_access_url( 'cosmic-anomalies-tracker/#hubble-article' ),
                    'supports'     => 'A public page location for keeping redshift, dimming, timing, blurring, and energy sinks visible together.',
                    'doesNotProve' => 'Matching redshift alone is not enough to validate the branch.',
                ),
            ),
        ),
        array(
            'slug'        => 'dark-matter-propulsion',
            'title'       => 'Dark matter / alternative propulsion concepts',
            'summary'     => 'The propulsion material is explicitly a speculative engineering analogy layer: field capture, slow light, polaritons, shielding, energy ledgers, and thermal stress.',
            'sources'     => array(
                array(
                    'type'         => 'Engineering analogy',
                    'schemaType'   => 'ScholarlyArticle',
                    'title'        => 'Nature — Light speed reduction to 17 metres per second',
                    'url'          => 'https://www.nature.com/articles/17561',
                    'supports'     => 'A real laboratory slow-light result that helps explain why ArcSecs uses slow-light and EIT language as an analogy.',
                    'doesNotProve' => 'Laboratory slow light does not prove dark matter is slow light or that a starship can harvest it.',
                ),
                array(
                    'type'         => 'Engineering analogy',
                    'schemaType'   => 'CreativeWork',
                    'title'        => 'NASA NTRS — Breakthrough Propulsion Physics project overview',
                    'url'          => 'https://ntrs.nasa.gov/citations/20040171929',
                    'supports'     => 'A public research-program context for speculative propulsion being treated as physics-bound inquiry rather than magic.',
                    'doesNotProve' => 'It does not validate the Dark Matter Drive; it supports disciplined speculative propulsion framing.',
                ),
                array(
                    'type'         => 'ArcSecs simulation prompt',
                    'schemaType'   => 'CreativeWork',
                    'title'        => 'ArcSecs Dark Matter Drive Simulator route',
                    'url'          => arcsecs_dark_matter_drive_simulator_url(),
                    'supports'     => 'The plugin-owned place to test field capture, shielding, energy ledgers, thermal bottlenecks, and deterministic replay.',
                    'doesNotProve' => 'A simulator page is not an engineering demonstration or proof of propulsion feasibility.',
                ),
            ),
        ),
    );
}

/**
 * Describe a source-type label for the public Research Library page.
 *
 * @param string $source_type Source type label.
 * @return string Public-facing description.
 */
function arcsecs_research_library_source_type_description( $source_type ) {
    $descriptions = array(
        'Mainstream observational source' => 'Primary or high-quality public evidence about what was measured.',
        'Mainstream model constraint'     => 'A source that defines the scientific bar ArcSecs must meet or explicitly fail.',
        'Alternative/speculative theory'  => 'A non-consensus interpretation useful for comparison, not proof.',
        'ArcSecs simulation prompt'       => 'A site-owned route or prompt that turns a claim into simulator work.',
        'Engineering analogy'             => 'A real technical idea used carefully as an analogy for speculative propulsion framing.',
    );

    return isset( $descriptions[ $source_type ] ) ? $descriptions[ $source_type ] : 'A source role used to separate evidence from interpretation.';
}

/**
 * Return selected Evidence & Sources topic groups by slug.
 *
 * @param array<int,string> $topic_slugs Optional topic slugs to include.
 * @return array<int,array<string,mixed>> Filtered source groups.
 */
function arcsecs_get_evidence_source_topics_for_context( $topic_slugs = array() ) {
    $topics = arcsecs_get_evidence_source_topics();
    if ( empty( $topic_slugs ) ) {
        return $topics;
    }

    $allowed_slugs = array_map( 'strval', $topic_slugs );
    return array_values(
        array_filter(
            $topics,
            function ( $topic ) use ( $allowed_slugs ) {
                return in_array( $topic['slug'], $allowed_slugs, true );
            }
        )
    );
}

/**
 * Determine whether the Evidence & Sources browser should be loaded.
 *
 * @return bool True when the current public route renders the reusable source component.
 */
function arcsecs_should_enqueue_evidence_source_browser() {
    if ( is_admin() ) {
        return false;
    }

    if ( function_exists( 'is_front_page' ) && is_front_page() ) {
        return true;
    }

    if ( function_exists( 'arcsecs_is_research_hub_page' ) && arcsecs_is_research_hub_page() ) {
        return true;
    }

    if ( function_exists( 'arcsecs_is_research_library_page' ) && arcsecs_is_research_library_page() ) {
        return true;
    }

    if ( function_exists( 'arcsecs_is_cosmology_comparison_page' ) && arcsecs_is_cosmology_comparison_page() ) {
        return true;
    }

    if ( function_exists( 'arcsecs_is_cosmic_anomalies_tracker_page' ) && arcsecs_is_cosmic_anomalies_tracker_page() ) {
        return true;
    }

    return false;
}

/**
 * Return all Evidence & Sources type labels in display order.
 *
 * @param array<int,array<string,mixed>> $topics Evidence topics.
 * @return array<int,string> Unique source type labels.
 */
function arcsecs_get_evidence_source_type_labels( $topics ) {
    $labels = array();

    foreach ( $topics as $topic ) {
        if ( empty( $topic['sources'] ) || ! is_array( $topic['sources'] ) ) {
            continue;
        }

        foreach ( $topic['sources'] as $source ) {
            if ( empty( $source['type'] ) || in_array( $source['type'], $labels, true ) ) {
                continue;
            }
            $labels[] = $source['type'];
        }
    }

    return $labels;
}

/**
 * Render a reusable Evidence & Sources component.
 *
 * @param string            $context     Context name used for ids and modifiers.
 * @param array<int,string> $topic_slugs Optional topic slugs to include.
 * @return void
 */
function arcsecs_render_evidence_sources_component( $context = 'default', $topic_slugs = array() ) {
    $topics       = arcsecs_get_evidence_source_topics_for_context( $topic_slugs );
    $source_types = arcsecs_get_evidence_source_type_labels( $topics );
    $source_count = 0;
    $section_id   = 'evidence-sources';

    if ( $context !== 'default' ) {
        $section_id = 'evidence-sources-' . sanitize_title( $context );
    }

    if ( empty( $topics ) ) {
        return;
    }

    foreach ( $topics as $topic ) {
        if ( ! empty( $topic['sources'] ) && is_array( $topic['sources'] ) ) {
            $source_count += count( $topic['sources'] );
        }
    }
    ?>
    <section id="<?php echo esc_attr( $section_id ); ?>" class="arcsecs-evidence-sources arcsecs-evidence-sources--<?php echo esc_attr( sanitize_title( $context ) ); ?> wrap" data-evidence-sources aria-labelledby="<?php echo esc_attr( $section_id ); ?>-title">
        <div class="arcsecs-evidence-sources__heading">
            <div class="eyebrow">Evidence &amp; Sources</div>
            <h2 id="<?php echo esc_attr( $section_id ); ?>-title">Source trail: what supports the pressure points, and what it does not prove.</h2>
            <p>This source layer separates observations, mainstream constraints, alternative ideas, ArcSecs simulation prompts, and engineering analogies. The goal is credibility, not link dumping.</p>
        </div>
        <div class="arcsecs-evidence-toolbar" aria-label="Filter Evidence and Sources">
            <label>
                <span>Search sources</span>
                <input type="search" data-evidence-search placeholder="Search Hubble, JWST, SPARC, Proca, tired light..." autocomplete="off">
            </label>
            <label>
                <span>Source type</span>
                <select data-evidence-type>
                    <option value="all">All source types</option>
                    <?php foreach ( $source_types as $source_type ) : ?>
                        <option value="<?php echo esc_attr( $source_type ); ?>"><?php echo esc_html( $source_type ); ?></option>
                    <?php endforeach; ?>
                </select>
            </label>
            <button type="button" data-evidence-reset>Reset sources</button>
            <p data-evidence-count aria-live="polite"><?php echo esc_html( (string) $source_count ); ?> sources visible across <?php echo esc_html( (string) count( $topics ) ); ?> topics.</p>
        </div>
        <nav class="arcsecs-evidence-topic-nav" aria-label="Evidence source topics">
            <?php foreach ( $topics as $topic ) : ?>
                <a href="#source-<?php echo esc_attr( $topic['slug'] ); ?>"><?php echo esc_html( $topic['title'] ); ?></a>
            <?php endforeach; ?>
        </nav>
        <div class="arcsecs-evidence-topic-grid">
            <?php foreach ( $topics as $topic ) : ?>
                <?php
                $topic_keywords = strtolower( $topic['title'] . ' ' . $topic['summary'] );
                foreach ( $topic['sources'] as $source ) {
                    $topic_keywords .= ' ' . strtolower( $source['type'] . ' ' . $source['title'] . ' ' . $source['supports'] . ' ' . $source['doesNotProve'] );
                }
                ?>
                <article class="arcsecs-evidence-topic-card" id="source-<?php echo esc_attr( $topic['slug'] ); ?>" data-evidence-topic-card data-evidence-topic-keywords="<?php echo esc_attr( $topic_keywords ); ?>">
                    <header>
                        <span><?php echo esc_html( count( $topic['sources'] ) ); ?> sources</span>
                        <h3><?php echo esc_html( $topic['title'] ); ?></h3>
                        <p><?php echo esc_html( $topic['summary'] ); ?></p>
                    </header>
                    <div class="arcsecs-evidence-source-list">
                        <?php foreach ( $topic['sources'] as $source ) : ?>
                            <?php
                            $is_external     = strpos( $source['url'], arcsecs_ai_access_url( '' ) ) !== 0;
                            $source_keywords = strtolower( $topic['title'] . ' ' . $topic['summary'] . ' ' . $source['type'] . ' ' . $source['title'] . ' ' . $source['supports'] . ' ' . $source['doesNotProve'] );
                            ?>
                            <a class="arcsecs-evidence-source-card" href="<?php echo esc_url( $source['url'] ); ?>" data-evidence-source-card data-source-type="<?php echo esc_attr( $source['type'] ); ?>" data-source-keywords="<?php echo esc_attr( $source_keywords ); ?>"<?php echo $is_external ? ' target="_blank" rel="noopener noreferrer"' : ''; ?>>
                                <span class="arcsecs-source-type arcsecs-source-type--<?php echo esc_attr( sanitize_title( $source['type'] ) ); ?>"><?php echo esc_html( $source['type'] ); ?></span>
                                <strong><?php echo esc_html( $source['title'] ); ?></strong>
                                <em>What this source supports</em>
                                <p><?php echo esc_html( $source['supports'] ); ?></p>
                                <em>What this source does not prove</em>
                                <p><?php echo esc_html( $source['doesNotProve'] ); ?></p>
                            </a>
                        <?php endforeach; ?>
                    </div>
                </article>
            <?php endforeach; ?>
        </div>
        <p class="arcsecs-evidence-empty" data-evidence-empty hidden>No evidence sources match those filters.</p>
    </section>
    <?php
}
/**
 * Build schema nodes for the reusable Evidence & Sources map.
 *
 * @param string $page_url Current page canonical URL.
 * @return array<int,array<string,mixed>> Schema nodes.
 */
function arcsecs_evidence_source_schema_graph( $page_url ) {
    $topics     = arcsecs_get_evidence_source_topics();
    $item_list  = array();
    $source_map = array();
    $position   = 1;

    foreach ( $topics as $topic ) {
        $item_list[] = array(
            '@type'    => 'ListItem',
            'position' => $position,
            'name'     => $topic['title'],
            'url'      => $page_url . '#source-' . $topic['slug'],
        );
        $position++;

        foreach ( $topic['sources'] as $source ) {
            $source_map[] = array(
                '@context'    => 'https://schema.org',
                '@type'       => $source['schemaType'],
                'name'        => $source['title'],
                'url'         => $source['url'],
                'genre'       => $source['type'],
                'description' => 'Supports: ' . $source['supports'] . ' Does not prove: ' . $source['doesNotProve'],
                'isPartOf'    => array( '@id' => $page_url . '#evidence-sources' ),
            );
        }
    }

    return array_merge(
        array(
            array(
                '@context'        => 'https://schema.org',
                '@type'           => 'ItemList',
                '@id'             => $page_url . '#evidence-sources',
                'name'            => 'ArcSecs Evidence and Sources Map',
                'description'     => 'Curated source topics grouped by observational pressure point, mainstream constraint, alternative theory, ArcSecs simulation prompt, and engineering analogy.',
                'itemListElement' => $item_list,
            ),
        ),
        $source_map
    );
}

/**
 * Output shared rich social metadata for a public ArcSecs route.
 *
 * @param string               $canonical Page canonical URL.
 * @param array<string,mixed>  $entry     SEO route entry.
 * @param string               $type      Open Graph type.
 * @return void
 */
function arcsecs_output_route_social_metadata( $canonical, $entry, $type ) {
    echo '<meta name="title" content="' . esc_attr( $entry['title'] ) . '" />' . "
";
    echo '<meta name="description" content="' . esc_attr( $entry['description'] ) . '" />' . "
";
    echo '<meta name="keywords" content="' . esc_attr( $entry['keywords'] ) . '" />' . "
";
    echo '<meta property="og:locale" content="en_US" />' . "
";
    echo '<meta property="og:type" content="' . esc_attr( $type ) . '" />' . "
";
    echo '<meta property="og:title" content="' . esc_attr( $entry['title'] ) . '" />' . "
";
    echo '<meta property="og:description" content="' . esc_attr( $entry['description'] ) . '" />' . "
";
    echo '<meta property="og:url" content="' . esc_url( $canonical ) . '" />' . "
";
    echo '<meta property="og:site_name" content="ArcSecs.com" />' . "
";
    if ( ! empty( $entry['image'] ) ) {
        echo '<meta property="og:image" content="' . esc_url( $entry['image'] ) . '" />' . "
";
        echo '<meta property="og:image:secure_url" content="' . esc_url( $entry['image'] ) . '" />' . "
";
        echo '<meta property="og:image:width" content="' . esc_attr( ARCSECS_DEFAULT_OG_IMAGE_WIDTH ) . '" />' . "
";
        echo '<meta property="og:image:height" content="' . esc_attr( ARCSECS_DEFAULT_OG_IMAGE_HEIGHT ) . '" />' . "
";
        echo '<meta property="og:image:alt" content="' . esc_attr( $entry['name'] . ' visual overview' ) . '" />' . "
";
    }
    echo '<meta name="twitter:card" content="summary_large_image" />' . "
";
    echo '<meta name="twitter:title" content="' . esc_attr( $entry['title'] ) . '" />' . "
";
    echo '<meta name="twitter:description" content="' . esc_attr( $entry['description'] ) . '" />' . "
";
    if ( ! empty( $entry['image'] ) ) {
        echo '<meta name="twitter:image" content="' . esc_url( $entry['image'] ) . '" />' . "
";
        echo '<meta name="twitter:image:alt" content="' . esc_attr( $entry['name'] . ' visual overview' ) . '" />' . "
";
    }
}

/**
 * Return a document title for theme-owned ArcSecs virtual routes.
 *
 * @param string $title Existing document title.
 * @return string Updated document title.
 */
function arcsecs_public_route_document_title( $title ) {
    if ( $reader = arcsecs_reader_key() ) { return arcsecs_reader_catalog()[ $reader ]['title']; }
    if ( arcsecs_is_publications_page() ) {
        return arcsecs_publications_seo_entry()['title'];
    }
    if ( is_front_page() ) {
        $entry = arcsecs_get_public_route_seo_entry( '' );
        return is_array( $entry ) ? $entry['title'] : $title;
    }

    if ( arcsecs_is_research_hub_page() ) {
        $entry = arcsecs_get_public_route_seo_entry( 'arcsecs-research-hub/' );
        return is_array( $entry ) ? $entry['title'] : $title;
    }

    if ( arcsecs_is_research_library_page() ) {
        $entry = arcsecs_get_public_route_seo_entry( 'research-library/' );
        return is_array( $entry ) ? $entry['title'] : $title;
    }

    if ( arcsecs_is_multi_messenger_light_delay_page() ) {
        $entry = arcsecs_get_public_route_seo_entry( 'multi-messenger-light-delay/' );
        return is_array( $entry ) ? $entry['title'] : $title;
    }

    if ( arcsecs_is_cosmology_comparison_page() ) {
        $entry = arcsecs_get_public_route_seo_entry( 'standard-cosmology-vs-arcsecs/' );
        return is_array( $entry ) ? $entry['title'] : $title;
    }

    if ( arcsecs_is_cosmic_anomalies_tracker_page() ) {
        $entry = arcsecs_get_public_route_seo_entry( 'cosmic-anomalies-tracker/' );
        return is_array( $entry ) ? $entry['title'] : $title;
    }

    if ( arcsecs_ai_access_is_demo_page() ) {
        $entry = arcsecs_get_public_route_seo_entry( 'arcsecs-physics-engine-demo/' );
        return is_array( $entry ) ? $entry['title'] : $title;
    }

    if ( arcsecs_is_space_travel_simulation_page() ) {
        $entry = arcsecs_get_public_route_seo_entry( 'space-travel-simulation/' );
        return is_array( $entry ) ? $entry['title'] : $title;
    }

    return $title;
}
add_filter( 'pre_get_document_title', 'arcsecs_public_route_document_title', 16 );


/**
 * Return TypeScript source contracts bundled with the theme.
 *
 * The comparison page intentionally reads this folder at render time so new
 * files added to assets/ts/arcsecs-physics-engine/ appear in the source
 * browser without hardcoding another list in the template.
 *
 * @return array<int,array<string,string|int>> Source files for public display.
 */
function arcsecs_get_typescript_source_contracts() {
    static $runtime_cache = null;

    if ( is_array( $runtime_cache ) ) {
        return $runtime_cache;
    }

    $source_directory = ARCSECS_DIR . '/assets/ts/arcsecs-physics-engine';
    $relative_root    = 'assets/ts/arcsecs-physics-engine/';

    if ( ! is_dir( $source_directory ) || ! is_readable( $source_directory ) ) {
        $runtime_cache = array();
        return $runtime_cache;
    }

    $source_files = glob( $source_directory . '/*.{ts,md}', GLOB_BRACE );
    if ( ! is_array( $source_files ) ) {
        $runtime_cache = array();
        return $runtime_cache;
    }

    $cache_version_parts = array();
    foreach ( $source_files as $source_file ) {
        $cache_version_parts[] = basename( (string) $source_file ) . ':' . (string) filemtime( (string) $source_file ) . ':' . (string) filesize( (string) $source_file );
    }
    $cache_key = 'arcsecs_ts_source_contracts_' . md5( implode( '|', $cache_version_parts ) );
    $cached_contracts = wp_cache_get( $cache_key, 'arcsecs' );
    if ( is_array( $cached_contracts ) ) {
        $runtime_cache = $cached_contracts;
        return $runtime_cache;
    }

    $preferred_order = array(
        'README.md'                     => 0,
        'PhysicsTypes.ts'               => 10,
        'ConstantsManager.ts'           => 20,
        'CorePhysicsEngine.ts'          => 30,
        'ProcaPhotonModel.ts'           => 40,
        'TiredLightModel.ts'            => 50,
        'RelationalInertiaModel.ts'     => 60,
        'DarkMatterCondensateModel.ts'  => 70,
        'TelemetryRenderer.ts'          => 80,
    );

    usort(
        $source_files,
        function ( $left_file, $right_file ) use ( $preferred_order ) {
            $left_name  = basename( (string) $left_file );
            $right_name = basename( (string) $right_file );
            $left_rank  = isset( $preferred_order[ $left_name ] ) ? $preferred_order[ $left_name ] : 999;
            $right_rank = isset( $preferred_order[ $right_name ] ) ? $preferred_order[ $right_name ] : 999;

            if ( $left_rank === $right_rank ) {
                return strnatcasecmp( $left_name, $right_name );
            }

            return $left_rank <=> $right_rank;
        }
    );

    $display_files = array();
    foreach ( $source_files as $source_file ) {
        $real_source_path = realpath( (string) $source_file );
        $real_root_path   = realpath( $source_directory );
        if ( ! is_string( $real_source_path ) || ! is_string( $real_root_path ) || strpos( $real_source_path, $real_root_path ) !== 0 ) {
            continue;
        }

        if ( ! is_readable( $real_source_path ) ) {
            continue;
        }

        $file_name = basename( $real_source_path );
        $extension = strtolower( pathinfo( $file_name, PATHINFO_EXTENSION ) );
        if ( $extension !== 'ts' && $extension !== 'md' ) {
            continue;
        }

        $contents = file_get_contents( $real_source_path );
        if ( ! is_string( $contents ) ) {
            continue;
        }

        $display_files[] = array(
            'name'      => $file_name,
            'path'      => $relative_root . $file_name,
            'extension' => $extension,
            'size'      => filesize( $real_source_path ),
            'lines'     => substr_count( $contents, "\n" ) + 1,
            'contents'  => $contents,
        );
    }

    wp_cache_set( $cache_key, $display_files, 'arcsecs', HOUR_IN_SECONDS );
    $runtime_cache = $display_files;

    return $runtime_cache;
}

/**
 * Return static scenario descriptions for AI-readable fallback content and sitemaps.
 *
 * @return array<int,array<string,string>> Scenario rows.
 */
function arcsecs_ai_access_scenarios() {
    return array(
        array( 'name' => 'Relational Flat-Space Engine', 'summary' => 'Shows ArcSecs model entities as relational nodes and solver links instead of a physical spacetime fabric.' ),
        array( 'name' => 'Massive Photon / Proca Dispersion', 'summary' => 'Visualizes an effective-mass photon branch as a speculative comparison against a massless baseline.' ),
        array( 'name' => 'Mechanistic Tired-Light Redshift', 'summary' => 'Shows conceptual photon energy loss through a medium while preserving caution about mainstream objections.' ),
        array( 'name' => 'Flat-Space Gravitational Lensing', 'summary' => 'Compares a Soldner-style corpuscular deflection proxy against a reference baseline.' ),
        array( 'name' => 'Sub-Quantum Gravity / Singularity-Safe Force Law', 'summary' => 'Demonstrates a softened force law for finite interactive simulation output.' ),
        array( 'name' => 'Monte Carlo Photon Pipeline', 'summary' => 'Uses deterministic seeded photon transport for repeatable absorption, scattering, and detector results.' ),
        array( 'name' => 'Parallax and Arcsecond Calibration', 'summary' => 'Demonstrates arcsecond, AU, parsec, and light-year scale conversion benchmarks.' ),
        array( 'name' => 'Photometric Calibration', 'summary' => 'Shows aperture, background, instrumental magnitude, and calibrated magnitude concepts.' ),
        array( 'name' => 'Rigid-Body / ECS Physics Diagnostics', 'summary' => 'Shows deterministic ECS diagnostics, contacts, constraints, restitution, and solver health.' ),
        array( 'name' => 'Dark Matter Drive Ramjet Simulation', 'summary' => 'Visualizes a speculative EIT scoop, HIBE shield, Fishback solenoid, stationary-light buffer, reactor, thermal system, and exhaust collimator pipeline.' ),
    );
}

/**
 * Generate robots.txt content for public AI/search access.
 *
 * @return string robots.txt content.
 */
function arcsecs_ai_access_robots_text() {
    $lines = array(
        '# ArcSecs public crawler policy; applies to all crawlers, including AI and search.',
        'User-agent: *',
        'Disallow: /wp-admin/',
        'Allow: /wp-admin/admin-ajax.php',
        'Disallow: /.uai/',
        'Disallow: /private/',
        'Disallow: /wp-content/uploads/private/',
        'Disallow: /wp-login.php',
        'Allow: /',
        '',
        'Sitemap: ' . arcsecs_ai_access_url( 'wp-sitemap.xml' ),
        'Sitemap: ' . arcsecs_ai_access_url( 'arcsecs-sitemap.xml' ),
    );

    return implode( "\n", $lines ) . "\n";
}

/**
 * Override WordPress virtual robots.txt with ArcSecs crawler policy.
 *
 * @param string $output Existing robots output.
 * @param bool   $public Whether the site is public.
 * @return string New robots output.
 */
function arcsecs_ai_access_filter_robots_txt( $output, $public ) {
    if ( ! $public ) { return $output; }
    // Preserve existing host/plugin directives, including explicit bot exclusions.
    // An additional wildcard group is combined by standards-compliant crawlers.
    return rtrim( $output ) . "\n\n" . str_replace( "Allow: /\n", '', arcsecs_ai_access_robots_text() );
}
add_filter( 'robots_txt', 'arcsecs_ai_access_filter_robots_txt', 20, 2 );

/**
 * Keep public pages indexable unless a plugin or admin page is explicitly doing private work.
 *
 * @param array<string,mixed> $robots Robots directives.
 * @return array<string,mixed> Indexable robots directives.
 */
function arcsecs_ai_access_wp_robots( $robots ) {
    if ( ! get_option( 'blog_public' ) || is_admin() || is_preview() || is_404() || is_search() || is_feed() || is_singular() && post_password_required() ) {
        return $robots;
    }

    if ( ! empty( $robots['noindex'] ) || ! empty( $robots['none'] ) || ! empty( $robots['nofollow'] ) || ! empty( $robots['nosnippet'] ) ) { return $robots; }
    $robots['index']             = true;
    $robots['follow']            = true;
    $robots['max-snippet']       = -1;
    $robots['max-image-preview'] = 'large';
    $robots['max-video-preview'] = -1;

    return $robots;
}
add_filter( 'wp_robots', 'arcsecs_ai_access_wp_robots', 50 );

/**
 * Replace X-Robots-Tag blockers on public pages with crawlable directives.
 *
 * @param array<string,string> $headers HTTP headers.
 * @return array<string,string> Updated HTTP headers.
 */
function arcsecs_ai_access_headers( $headers ) {
    // Preserve host/plugin X-Robots-Tag policies; never force indexing on private content.

    return $headers;
}
add_filter( 'wp_headers', 'arcsecs_ai_access_headers', 50 );

/**
 * Add rewrite endpoints for AI-readable files and ArcSecs sitemap.
 *
 * @return void
 */
function arcsecs_ai_access_rewrite_rules() {
    add_rewrite_rule( '^read-book/?$', 'index.php?arcsecs_reader=book', 'top' );
    add_rewrite_rule( '^read-scientific-paper/?$', 'index.php?arcsecs_reader=paper', 'top' );
    add_rewrite_rule( '^publications/?$', 'index.php?arcsecs_publications=1', 'top' );
    add_rewrite_rule( '^llms\.txt$', 'index.php?arcsecs_llms_txt=1', 'top' );
    add_rewrite_rule( '^arcsecs-sitemap\.xml$', 'index.php?arcsecs_sitemap_xml=1', 'top' );
    add_rewrite_rule( '^arcsecs-physics-engine-demo/ai-summary/?$', 'index.php?arcsecs_ai_summary=1', 'top' );
    add_rewrite_rule( '^arcsecs-research-hub/?$', 'index.php?arcsecs_research_hub=1', 'top' );
    add_rewrite_rule( '^research-library/?$', 'index.php?arcsecs_research_library=1', 'top' );
    add_rewrite_rule( '^multi-messenger-light-delay/?$', 'index.php?arcsecs_multi_messenger_light_delay=1', 'top' );
    add_rewrite_rule( '^standard-cosmology-vs-arcsecs/?$', 'index.php?arcsecs_cosmology_comparison=1', 'top' );
    add_rewrite_rule( '^cosmic-anomalies-tracker/?$', 'index.php?arcsecs_cosmic_anomalies_tracker=1', 'top' );
    add_rewrite_rule( '^space-travel-simulation/?$', 'index.php?arcsecs_space_travel_simulation=1', 'top' );
}
add_action( 'init', 'arcsecs_ai_access_rewrite_rules' );

/**
 * Register custom query variables.
 *
 * @param array<int,string> $vars Existing query vars.
 * @return array<int,string> Updated query vars.
 */
function arcsecs_ai_access_query_vars( $vars ) {
    $vars[] = 'arcsecs_reader';
    $vars[] = 'arcsecs_publications';
    $vars[] = 'arcsecs_llms_txt';
    $vars[] = 'arcsecs_ai_summary';
    $vars[] = 'arcsecs_sitemap_xml';
    $vars[] = 'arcsecs_research_hub';
    $vars[] = 'arcsecs_research_library';
    $vars[] = 'arcsecs_multi_messenger_light_delay';
    $vars[] = 'arcsecs_cosmology_comparison';
    $vars[] = 'arcsecs_cosmic_anomalies_tracker';
    $vars[] = 'arcsecs_space_travel_simulation';
    return $vars;
}
add_filter( 'query_vars', 'arcsecs_ai_access_query_vars' );

/**
 * Flush rewrites when the theme is activated.
 *
 * @return void
 */
function arcsecs_ai_access_after_switch_theme() {
    arcsecs_ai_access_rewrite_rules();
    flush_rewrite_rules();
}
add_action( 'after_switch_theme', 'arcsecs_ai_access_after_switch_theme' );


/**
 * Return public source documents that should remain in the package for AI/code-agent handoff.
 *
 * @return array<int,array<string,string>> Document rows.
 */
function arcsecs_ai_access_source_documents() {
    return array(
        array( 'title' => 'ArcSecs Physics Engine Fullscreen Upgrade Prompt', 'path' => 'docs/ArcSecs Physics Engine Fullscreen Upgrade Prompt.md' ),
        array( 'title' => 'ArcSecs Physics Engine Technical Analysis', 'path' => 'docs/ArcSecs Physics Engine Technical Analysis.md' ),
        array( 'title' => 'Scrutinizing ArcSecs Physics Engine Concepts', 'path' => 'docs/Scrutinizing ArcSecs Physics Engine Concepts.md' ),
        array( 'title' => 'Alternative Physics Theories Discussion', 'path' => 'docs/Alternative Physics Theories Discussion.md' ),
        array( 'title' => 'Reimagining Physics Simulation Architecture', 'path' => 'docs/Reimagining Physics Simulation Architecture.md' ),
        array( 'title' => 'AI Memory Package and File Handoff Guide', 'path' => 'docs/AI Memory Package and File Handoff Guide.md' ),
        array( 'title' => 'ArcSecs Research Hub Page', 'path' => 'docs/arcsecs-research-hub-page.md' ),
        array( 'title' => 'Cosmology Comparison Page Plan', 'path' => 'docs/cosmology-comparison-page-plan.md' ),
        array( 'title' => 'Cosmology Comparison Content Outline', 'path' => 'docs/cosmology-comparison-content-outline.md' ),
        array( 'title' => 'Cosmology Comparison Implementation Notes', 'path' => 'docs/cosmology-comparison-implementation-notes.md' ),
        array( 'title' => 'Cosmology Comparison Test Plan', 'path' => 'docs/cosmology-comparison-test-plan.md' ),
        array( 'title' => 'Cosmology Comparison SEO Metadata', 'path' => 'docs/cosmology-comparison-seo-metadata.md' ),
        array( 'title' => 'Cosmic Anomalies Tracker Page', 'path' => 'docs/cosmic-anomalies-tracker-page.md' ),
        array( 'title' => 'Cosmology Comparison Page Ideas Source', 'path' => 'docs/Cosmology Comparison Page Ideas.md' ),
        array( 'title' => 'Cosmology Comparison Implementation Prompt', 'path' => 'docs/Cosmology Comparison Implementation Prompt.md' ),
        array( 'title' => 'Cosmic Anomalies Tracker Content Plan Source', 'path' => 'docs/Cosmic Anomalies Tracker Content Plan.md' ),
        array( 'title' => 'Cosmic Anomalies Tracker Implementation Prompt', 'path' => 'docs/Cosmic Anomalies Tracker Implementation Prompt.md' ),
        array( 'title' => 'ArcSecs Long-Term Memory Index', 'path' => 'docs/ArcSecs Long-Term Memory Index.md' ),
        array( 'title' => 'UAIX Memory System Compliance Notes', 'path' => 'docs/UAIX Memory System Compliance Notes.md' ),
        array( 'title' => 'ArcSecs Current Project Handoff State', 'path' => 'docs/ArcSecs Current Project Handoff State.md' ),
        array( 'title' => 'Main Site Dark Matter Drive Integration', 'path' => 'docs/main-site-dark-matter-drive-integration.md' ),
        array( 'title' => 'Routes and Internal Linking', 'path' => 'docs/routes-and-internal-linking.md' ),
        array( 'title' => 'Sitemap and llms Ownership', 'path' => 'docs/sitemap-and-llms-ownership.md' ),
        array( 'title' => 'Theme Primary Menu Route Repair v5.0.22', 'path' => 'docs/theme-primary-menu-route-repair-v5.0.22.md' ),
        array( 'title' => 'Theme Route Health Dashboard v5.0.25', 'path' => 'docs/theme-route-health-dashboard-v5.0.25.md' ),
        array( 'title' => 'Dark Matter Drive Main Site Integration Prompt', 'path' => 'docs/Dark Matter Drive Main Site Integration Prompt.md' ),
        array( 'title' => 'Dark Matter Drive Compact Header Navigation Prompt', 'path' => 'docs/Dark Matter Drive Compact Header Navigation Prompt.md' ),
        array( 'title' => 'ArcSecs Uploaded Source Brief Mapping', 'path' => 'docs/ArcSecs Uploaded Source Brief Mapping.md' ),
        array( 'title' => 'ArcSecs Research Archive Manifest', 'path' => 'docs/ArcSecs Research Archive Manifest.md' ),
        array( 'title' => 'ArcSecs Memory System Audit v5.0.28', 'path' => 'docs/ArcSecs Memory System Audit v5.0.28.md' ),
        array( 'title' => 'TypeScript Source Browser v5.0.28', 'path' => 'docs/TypeScript Source Browser v5.0.28.md' ),
        array( 'title' => 'TypeScript Source Explorer Hardening v5.0.28', 'path' => 'docs/TypeScript Source Explorer Hardening v5.0.28.md' ),
        array( 'title' => 'ArcSecs SEO Sweep v5.0.29', 'path' => 'docs/ArcSecs SEO Sweep v5.0.29.md' ),
        array( 'title' => 'ArcSecs Science Page Readability Sweep v5.0.31', 'path' => 'docs/ArcSecs Science Page Readability Sweep v5.0.31.md' ),
        array( 'title' => 'ArcSecs Evidence Source Map v5.0.32', 'path' => 'docs/ArcSecs Evidence Source Map v5.0.32.md' ),
        array( 'title' => 'ArcSecs Evidence Source Map v5.0.33', 'path' => 'docs/ArcSecs Evidence Source Map v5.0.33.md' ),
        array( 'title' => 'ArcSecs Evidence Source Browser v5.0.33', 'path' => 'docs/ArcSecs Evidence Source Browser v5.0.33.md' ),
        array( 'title' => 'ArcSecs Research Library Source Map v5.0.34', 'path' => 'docs/ArcSecs Research Library Source Map v5.0.34.md' ),
        array( 'title' => 'Modeling Light Slowing and Energy Degeneration Multi-Messenger Events', 'path' => 'docs/Modeling Light Slowing and Energy Degeneration Multi-Messenger Events.md' ),
        array( 'title' => 'Physics Engine Fixes Based on Multi-Messenger Document', 'path' => 'docs/Physics Engine Fixes Based on Multi-Messenger Document.md' ),
        array( 'title' => 'ArcSecs Multi-Messenger Light Delay Page v5.0.35', 'path' => 'docs/ArcSecs Multi-Messenger Light Delay Page v5.0.35.md' ),
        array( 'title' => 'Rethinking Light Time and Spacetime', 'path' => 'docs/Rethinking Light Time and Spacetime.md' ),
        array( 'title' => 'Physics Engine Fixes Based on Decoupled Multi-Messenger Propagation', 'path' => 'docs/Physics Engine Fixes Based on Decoupled Multi-Messenger Propagation.md' ),
        array( 'title' => 'ArcSecs Universe Framework Integration Notes v5.0.36', 'path' => 'docs/ArcSecs Universe Framework Integration Notes v5.0.36.md' ),
    );
}

/**
 * Output plain-text llms.txt content.
 *
 * @return void
 */
function arcsecs_ai_access_output_llms_txt() {
    status_header( 200 );
    header( 'Content-Type: text/plain; charset=utf-8' );
    if ( ! get_option( 'blog_public' ) ) { header( 'X-Robots-Tag: noindex, nofollow' ); }

    echo "# ArcSecs.com\n\n";
    echo "ArcSecs.com presents speculative physics visualization, relational theatrical physics, tired-light scenarios, massive-photon concepts, and a Dark Matter Drive Ramjet simulation sandbox.\n\n";
    echo "Research hub / Start Here: " . esc_url_raw( arcsecs_ai_access_url( 'arcsecs-research-hub/' ) ) . "\n";
    echo "Publications: " . esc_url_raw( arcsecs_ai_access_url( 'publications/' ) ) . " — free book and scientific paper, optional purchase.\n";
    echo "Read the entire book: " . esc_url_raw( arcsecs_ai_access_url( 'read-book/' ) ) . "\n";
    echo "Read the scientific paper: " . esc_url_raw( arcsecs_ai_access_url( 'read-scientific-paper/' ) ) . "\n";
    echo "Machine-readable publication manifest: " . esc_url_raw( arcsecs_publication_asset_url( 'publication-manifest.json' ) ) . "\n";
    echo "Open knowledge charter: " . esc_url_raw( arcsecs_publication_asset_url( 'OPEN-KNOWLEDGE.txt' ) ) . "\n";
    echo "Book Markdown: " . esc_url_raw( arcsecs_publication_asset_url( 'readers/book/source.md' ) ) . "\n";
    echo "Scientific paper Markdown: " . esc_url_raw( arcsecs_publication_asset_url( 'readers/paper/source.md' ) ) . "\n";
    foreach ( array( 'book_pdf', 'book_epub', 'paper_pdf' ) as $format ) {
        $download = arcsecs_publications_download_url( $format );
        if ( $download ) { echo $format . ': ' . esc_url_raw( $download ) . "\n"; }
    }
    echo "Hugging Face dataset: https://huggingface.co/datasets/MichaelKappel/ArcSecs-Beyond-Spacetime\n";
    echo "Researcher ORCID: https://orcid.org/0009-0003-3889-1400\n";
    echo "Primary demo: " . esc_url_raw( arcsecs_ai_access_url( 'arcsecs-physics-engine-demo/' ) ) . "\n";
    echo "Dark Matter Drive Simulator: " . esc_url_raw( arcsecs_dark_matter_drive_simulator_url() ) . " — plugin-provided interactive ArcSecs propulsion sandbox for field capture, shielding, energy ledgers, thermal stress, and replayable speculative physics experiments.\n";
    echo "Cosmology comparison: " . esc_url_raw( arcsecs_ai_access_url( 'standard-cosmology-vs-arcsecs/' ) ) . "\n";
    echo "Multi-Messenger Light Delay: " . esc_url_raw( arcsecs_ai_access_url( 'multi-messenger-light-delay/' ) ) . " — report-based page separating gravitational-wave baselines, electromagnetic source delay, environmental diffusion, and speculative light-slowing propagation tests.\n";
    echo "Cosmic anomalies tracker: " . esc_url_raw( arcsecs_ai_access_url( 'cosmic-anomalies-tracker/' ) ) . "\n";
    echo "Research hub path cards: New to ArcSecs, Compare the Physics, Track Cosmic Anomalies, Run the Simulation, Explore Propulsion Concepts, For AI / Researchers, and Dark Matter Drive Simulator.\n";
    echo "Cosmology checkpoints: CMB and large-scale structure, supernova time dilation, Tolman-style dimming, conservation and units ledger.\n";
    echo "Prediction pressure ledger: CMB, BAO, Type Ia stretch, Tolman dimming, photon mass guardrails, galaxy lensing, energy accounting, and software consistency.\n";
    echo "Glossary: ΛCDM, Proca electrodynamics, tired light, Tolman test, Type Ia supernova stretch, EIT, dark-state polaritons, HIBE shielding, and no silent contradictions.\n";
    echo "Cosmic anomalies pressure ledger: observation maturity, mainstream fit pressure, ArcSecs simulation readiness, demo priority, model costs, and explicit failure conditions.\n";
    echo "Cosmic anomalies claim hygiene: established observations, active interpretations, boundary constraints, and speculative extensions are separated with evidence-grade filters.\n";
    echo "Cosmic anomalies observation-first mode: visitors can dim ArcSecs-only speculative lanes while reviewing measurements, mainstream interpretations, and kill tests.\n";
    echo "AI-readable summary: " . esc_url_raw( arcsecs_ai_access_url( 'arcsecs-physics-engine-demo/ai-summary/' ) ) . "\n";
    echo "ArcSecs sitemap: " . esc_url_raw( arcsecs_ai_access_url( 'arcsecs-sitemap.xml' ) ) . "
";
    echo "
SEO route manifest:
";
    foreach ( arcsecs_get_public_route_seo_entries() as $seo_route ) {
        echo "- " . $seo_route['name'] . " [" . $seo_route['owner'] . "] — " . esc_url_raw( arcsecs_ai_access_url( $seo_route['path'] ) ) . " — " . $seo_route['description'] . "
";
    }
    echo "
Evidence source map:
";
    foreach ( arcsecs_get_evidence_source_topics() as $source_topic ) {
        echo "- " . $source_topic['title'] . " — " . $source_topic['summary'] . "
";
        foreach ( $source_topic['sources'] as $source ) {
            echo "  - " . $source['type'] . ": " . $source['title'] . " — supports: " . $source['supports'] . " / does not prove: " . $source['doesNotProve'] . " — " . esc_url_raw( $source['url'] ) . "
";
        }
    }
    echo "
";
    echo "Scientific boundary: " . ARCSECS_AI_ACCESS_DISCLAIMER . "\n\n";
    echo "Crawler policy: public routes are crawlable when site indexing is enabled. Robots rules are not access control. Original rights-controlled publications are released under CC0 1.0; commercial and noncommercial AI training and redistribution are welcomed. Third-party rights and existing software licenses remain unaffected.\n\n";
    echo "Key public concepts:\n";
    foreach ( arcsecs_ai_access_scenarios() as $scenario ) {
        echo "- " . $scenario['name'] . ': ' . $scenario['summary'] . "\n";
    }
    echo "\nThe public book, scientific review and approved research corpus welcome unrestricted reuse under their stated licenses. Private operational memory is not distributed.\n";
    exit;
}

/**
 * Output Markdown AI summary for the physics demo.
 *
 * @return void
 */
function arcsecs_ai_access_output_ai_summary() {
    status_header( 200 );
    header( 'Content-Type: text/markdown; charset=utf-8' );
    if ( ! get_option( 'blog_public' ) ) { header( 'X-Robots-Tag: noindex, nofollow' ); }

    echo "# ArcSecs Physics Engine Demo — AI Summary\n\n";
    echo "URL: " . esc_url_raw( arcsecs_ai_access_url( 'arcsecs-physics-engine-demo/' ) ) . "\n\n";
    echo "Disclaimer: " . ARCSECS_AI_ACCESS_DISCLAIMER . "\n\n";
    echo "The ArcSecs Physics Engine Demo is an interactive research sandbox for visualizing the ArcSecs model: relational theatrical physics, no-spacetime framing, tired-light redshift concepts, massive-photon / Proca-style dispersion, flat-space lensing comparisons, deterministic calibration, and a speculative Dark Matter Drive Ramjet pipeline.\n\n";
    echo "## How to interpret it\n\n";
    echo "The demo compares an ArcSecs interpretation against baseline/reference interpretations. It should not be summarized as proof that General Relativity is false, proof that tired light is correct, proof that photons have rest mass, or proof that a Dark Matter Drive works. It is a conceptual simulation and educational visualization.\n\n";
    echo "## Scenarios\n\n";
    foreach ( arcsecs_ai_access_scenarios() as $scenario ) {
        echo "### " . $scenario['name'] . "\n";
        echo $scenario['summary'] . "\n\n";
    }
    echo "## Important telemetry terms\n\n";
    echo "- Universal Cosmic Clock: global fixed-step simulation clock used by the ArcSecs demo.\n";
    echo "- Local Oscillator Probe: scenario-local mechanical-retardation indicator. The ArcSecs UI should not label this as proven time dilation.\n";
    echo "- Entities: active scenario model nodes such as masses, probes, photons, ships, or fields.\n";
    echo "- Solver Links: active relational edges, constraints, calibration links, subsystem couplings, or boundary conditions.\n";
    echo "- Primary Model Graph: the active scenario signal.\n";
    echo "- Comparison / Ledger Graph: baseline, accounting, energy ledger, thermal, drag, thrust, or calibration comparison signal.\n";
    echo "\n## Source documents preserved in the theme package\n\n";
    foreach ( arcsecs_ai_access_source_documents() as $source_document ) {
        echo "- " . $source_document['title'] . ' — ' . $source_document['path'] . "\n";
    }
    echo "\nUAI Memory Package Wizard: https://uaix.org/en-us/tools/ai-memory-package-wizard/\n";
    echo "\n## Crawler and AI access\n\n";
    echo "Public AI and search crawlers should be allowed to fetch the demo, llms.txt, this summary, robots.txt, wp-sitemap.xml, sitemap.xml, and arcsecs-sitemap.xml.\n";
    exit;
}

/**
 * Output ArcSecs XML sitemap with the key public endpoints.
 *
 * @return void
 */
function arcsecs_ai_access_output_sitemap_xml() {
    status_header( 200 );
    header( 'Content-Type: application/xml; charset=utf-8' );
    if ( ! get_option( 'blog_public' ) ) { header( 'X-Robots-Tag: noindex, nofollow' ); }

    $urls = arcsecs_get_public_route_seo_entries();

    echo '<?xml version="1.0" encoding="UTF-8"?>' . "
";
    echo '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">' . "
";
    echo '  <!-- Evidence source topics: Hubble tension; JWST early galaxies; SPARC rotation curves; El Gordo; Lithium-7; Proca photon mass bounds; tired light criticism and constraints; dark matter and alternative propulsion concepts. -->' . "
";
    foreach ( $urls as $url ) {
        echo "  <url>
";
        echo '    <loc>' . esc_url( arcsecs_ai_access_url( $url['path'] ) ) . "</loc>
";
        echo '    <lastmod>' . esc_html( ARCSECS_CONTENT_MODIFIED_DATE ) . "</lastmod>
";
        echo '    <changefreq>' . esc_html( $url['changefreq'] ) . "</changefreq>
";
        echo '    <priority>' . esc_html( $url['priority'] ) . "</priority>
";
        if ( ! empty( $url['image'] ) ) {
            echo "    <image:image>
";
            echo '      <image:loc>' . esc_url( $url['image'] ) . "</image:loc>
";
            echo '      <image:title>' . esc_html( $url['name'] ) . "</image:title>
";
            echo '      <image:caption>' . esc_html( $url['description'] ) . "</image:caption>
";
            echo "    </image:image>
";
        }
        echo "  </url>
";
    }
    echo '</urlset>' . "
";
    exit;
}

/**
 * Serve virtual endpoints before normal template rendering.
 *
 * @return void
 */
function arcsecs_ai_access_template_redirect() {
    if ( $reader = arcsecs_reader_key() ) { arcsecs_render_reader( $reader ); }
    if ( arcsecs_is_publications_page() ) {
        arcsecs_render_publications_page();
    }
    if ( arcsecs_is_research_hub_page() ) {
        arcsecs_render_research_hub_page();
    }

    if ( arcsecs_is_research_library_page() ) {
        arcsecs_render_research_library_page();
    }

    if ( arcsecs_is_multi_messenger_light_delay_page() ) {
        arcsecs_render_multi_messenger_light_delay_page();
    }

    if ( arcsecs_is_cosmology_comparison_page() ) {
        arcsecs_render_cosmology_comparison_page();
    }

    if ( arcsecs_is_cosmic_anomalies_tracker_page() ) {
        arcsecs_render_cosmic_anomalies_tracker_page();
    }

    if ( arcsecs_is_space_travel_simulation_page() ) {
        arcsecs_render_space_travel_simulation_page();
    }

    if ( get_query_var( 'arcsecs_llms_txt' ) ) {
        arcsecs_ai_access_output_llms_txt();
    }

    if ( get_query_var( 'arcsecs_ai_summary' ) ) {
        arcsecs_ai_access_output_ai_summary();
    }

    if ( get_query_var( 'arcsecs_sitemap_xml' ) ) {
        arcsecs_ai_access_output_sitemap_xml();
    }
}
add_action( 'template_redirect', 'arcsecs_ai_access_template_redirect', 0 );


/**
 * Render the virtual Ship Travel / Space Travel Simulation bridge page.
 *
 * @return void
 */
function arcsecs_render_space_travel_simulation_page() {
    global $wp_query;

    if ( isset( $wp_query ) ) {
        $wp_query->is_404  = false;
        $wp_query->is_page = true;
    }

    status_header( 200 );
    get_header();
    get_template_part( 'template-parts/space-travel-simulation' );
    get_footer();
    exit;
}

/**
 * Output metadata for the Ship Travel / Space Travel Simulation route.
 *
 * @return void
 */
function arcsecs_space_travel_simulation_schema_graph( $canonical ) {
    return array(
        array(
            '@context'         => 'https://schema.org',
            '@type'            => 'TechArticle',
            'headline'         => 'Space Travel Simulation: Ship Transit Through Dense Substrate, Void Corridors, and Torsion Fields',
            'description'      => 'ArcSecs speculative research page explaining a space travel simulation through dense-substrate fuel harvesting, void coasting, teleparallel torsion, Proca substrate interaction, Mass-Polariton transfer, EIT capture, route planning, autopilot, and mission objectives.',
            'mainEntityOfPage' => array(
                '@type' => 'WebPage',
                '@id'   => $canonical,
            ),
            'isAccessibleForFree' => true,
            'dateModified'        => ARCSECS_CONTENT_MODIFIED_DATE,
            'author'              => array(
                '@type' => 'Organization',
                'name'  => 'ArcSecs',
                'url'   => arcsecs_ai_access_url( '' ),
            ),
            'publisher'           => array(
                '@type' => 'Organization',
                'name'  => 'ArcSecs',
                'url'   => arcsecs_ai_access_url( '' ),
                'logo'  => array(
                    '@type' => 'ImageObject',
                    'url'   => arcsecs_schema_logo_url(),
                ),
            ),
            'about'               => array(
                array( '@type' => 'Thing', 'name' => 'Space travel simulation' ),
                array( '@type' => 'Thing', 'name' => 'Dense substrate fuel harvesting' ),
                array( '@type' => 'Thing', 'name' => 'Void corridor coasting' ),
                array( '@type' => 'Thing', 'name' => 'Teleparallel torsion' ),
                array( '@type' => 'Thing', 'name' => 'Proca substrate interaction' ),
                array( '@type' => 'Thing', 'name' => 'Mass-Polariton transfer' ),
                array( '@type' => 'Thing', 'name' => 'EIT capture' ),
                array( '@type' => 'Thing', 'name' => 'Dark-State Polariton' ),
                array( '@type' => 'Thing', 'name' => 'Ramscoop vortex' ),
                array( '@type' => 'Thing', 'name' => 'Falsification-first testing' ),
            ),
            'articleSection'      => array(
                'Mission model',
                'Instrument mask',
                'Pilot loop',
                'Research stack',
                'Telemetry contract',
                'Falsification',
                'FAQ',
            ),
        ),
        array(
            '@context'   => 'https://schema.org',
            '@type'      => 'FAQPage',
            'mainEntity' => array(
                array(
                    '@type'          => 'Question',
                    'name'           => 'Is this claiming working spacecraft technology?',
                    'acceptedAnswer' => array(
                        '@type' => 'Answer',
                        'text'  => 'No. This is a speculative research visualization and simulator-language page. It describes hypotheses to compare and test.',
                    ),
                ),
                array(
                    '@type'          => 'Question',
                    'name'           => 'What is dense substrate?',
                    'acceptedAnswer' => array(
                        '@type' => 'Answer',
                        'text'  => 'Dense substrate means a route region with more proposed fuel signal but also more torsion, drag, heat, optical lag, and risk.',
                    ),
                ),
                array(
                    '@type'          => 'Question',
                    'name'           => 'What is a void corridor?',
                    'acceptedAnswer' => array(
                        '@type' => 'Answer',
                        'text'  => 'A void corridor is a smoother coasting region with weaker fuel availability. It is useful for route stability but requires better energy planning.',
                    ),
                ),
                array(
                    '@type'          => 'Question',
                    'name'           => 'Does the page run the simulator?',
                    'acceptedAnswer' => array(
                        '@type' => 'Answer',
                        'text'  => 'No. This theme page explains the model and links to plugin-owned simulator pages. Runtime state, telemetry, validation, exports, and live viewport behavior remain in the plugin.',
                    ),
                ),
                array(
                    '@type'          => 'Question',
                    'name'           => 'What should exports prove?',
                    'acceptedAnswer' => array(
                        '@type' => 'Answer',
                        'text'  => 'Exports should not prove the theory. They should make the simulation run reviewable by exposing route state, telemetry, validation, caveats, and falsification notes.',
                    ),
                ),
            ),
        ),
    );
}

function arcsecs_space_travel_simulation_metadata() {
    if ( ! arcsecs_is_space_travel_simulation_page() ) {
        return;
    }

    $entry = arcsecs_get_public_route_seo_entry( 'space-travel-simulation/' );
    if ( ! is_array( $entry ) ) {
        return;
    }

    $canonical = arcsecs_space_travel_simulation_url();
    arcsecs_output_route_social_metadata( $canonical, $entry, 'article' );
    $schema = arcsecs_with_base_schema_graph( array_merge( arcsecs_space_travel_simulation_schema_graph( $canonical ), arcsecs_evidence_source_schema_graph( $canonical ) ) );
    echo '<script type="application/ld+json">' . wp_json_encode( $schema, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE ) . '</script>' . "\n";
}
add_action( 'wp_head', 'arcsecs_space_travel_simulation_metadata', 3 );

/**
 * Render the virtual ArcSecs Research Hub page.
 *
 * @return void
 */
function arcsecs_render_research_hub_page() {
    global $wp_query;

    if ( isset( $wp_query ) ) {
        $wp_query->is_404  = false;
        $wp_query->is_page = true;
    }

    status_header( 200 );
    get_header();
    get_template_part( 'template-parts/arcsecs-research-hub' );
    get_footer();
    exit;
}

/**
 * Provide a document title for the virtual ArcSecs Research Hub route.
 *
 * @param string $title Current document title.
 * @return string Updated document title.
 */
function arcsecs_research_hub_document_title( $title ) {
    if ( arcsecs_is_research_hub_page() ) {
        return 'ArcSecs Research Hub | Start Here';
    }

    return $title;
}
add_filter( 'pre_get_document_title', 'arcsecs_research_hub_document_title', 19 );

/**
 * Build schema.org JSON-LD graphs for the ArcSecs Research Hub route.
 *
 * @param string $canonical Canonical page URL.
 * @return array<int,array<string,mixed>> Schema graph items.
 */
function arcsecs_research_hub_schema_graph( $canonical ) {
    return array(
        array(
            '@context'         => 'https://schema.org',
            '@type'            => 'CollectionPage',
            'name'             => 'ArcSecs Research Hub',
            'headline'         => 'The ArcSecs Research Hub',
            'description'      => 'Start here for ArcSecs speculative cosmology, framework comparison, cosmic anomalies, the Physics Engine Demo, propulsion concepts, and published scientific resources.',
            'url'              => $canonical,
            'mainEntityOfPage' => $canonical,
            'isAccessibleForFree' => true,
            'publisher'        => array(
                '@type' => 'Organization',
                'name'  => 'ArcSecs',
                'url'   => arcsecs_ai_access_url( '' ),
            ),
            'dateModified'     => ARCSECS_CONTENT_MODIFIED_DATE,
            'hasPart'          => array(
                array( '@type' => 'WebPageElement', 'name' => 'New to ArcSecs?', 'url' => $canonical . '#new-to-arcsecs' ),
                array( '@type' => 'WebPageElement', 'name' => 'Visual path cards', 'url' => $canonical . '#path-cards' ),
                array( '@type' => 'WebPageElement', 'name' => 'Route map', 'url' => $canonical . '#route-map' ),
                array( '@type' => 'WebPageElement', 'name' => 'For AI / Researchers', 'url' => $canonical . '#researcher-tools' ),
            ),
        ),
        array(
            '@context'        => 'https://schema.org',
            '@type'           => 'ItemList',
            'name'            => 'ArcSecs Research Path',
            'itemListElement' => array(
                array( '@type' => 'ListItem', 'position' => 1, 'name' => 'New to ArcSecs?', 'url' => $canonical . '#new-to-arcsecs' ),
                array( '@type' => 'ListItem', 'position' => 2, 'name' => 'Compare the Physics', 'url' => arcsecs_ai_access_url( 'standard-cosmology-vs-arcsecs/' ) ),
                array( '@type' => 'ListItem', 'position' => 3, 'name' => 'Track Cosmic Anomalies', 'url' => arcsecs_ai_access_url( 'cosmic-anomalies-tracker/' ) ),
                array( '@type' => 'ListItem', 'position' => 4, 'name' => 'Run the Simulation', 'url' => arcsecs_ai_access_url( 'arcsecs-physics-engine-demo/' ) ),
                array( '@type' => 'ListItem', 'position' => 5, 'name' => 'Explore Propulsion Concepts', 'url' => arcsecs_ai_access_url( 'standard-cosmology-vs-arcsecs/#propulsion-shielding' ) ),
                array( '@type' => 'ListItem', 'position' => 6, 'name' => 'For AI / Researchers', 'url' => arcsecs_ai_access_url( 'arcsecs-physics-engine-demo/ai-summary/' ) ),
                array( '@type' => 'ListItem', 'position' => 7, 'name' => 'Dark Matter Drive Simulator', 'url' => arcsecs_dark_matter_drive_simulator_url() ),
            ),
        ),
        array(
            '@context'        => 'https://schema.org',
            '@type'           => 'BreadcrumbList',
            'itemListElement' => array(
                array(
                    '@type'    => 'ListItem',
                    'position' => 1,
                    'name'     => 'Home',
                    'item'     => arcsecs_ai_access_url( '' ),
                ),
                array(
                    '@type'    => 'ListItem',
                    'position' => 2,
                    'name'     => 'Research Hub',
                    'item'     => $canonical,
                ),
            ),
        ),
        array(
            '@context'   => 'https://schema.org',
            '@type'      => 'FAQPage',
            'mainEntity' => array(
                array(
                    '@type'          => 'Question',
                    'name'           => 'Where should new ArcSecs visitors start?',
                    'acceptedAnswer' => array(
                        '@type' => 'Answer',
                        'text'  => 'Start with the ArcSecs Research Hub, then compare the physics, inspect the cosmic anomalies tracker, and run the Physics Engine Demo.',
                    ),
                ),
                array(
                    '@type'          => 'Question',
                    'name'           => 'Is ArcSecs established physics?',
                    'acceptedAnswer' => array(
                        '@type' => 'Answer',
                        'text'  => 'No. ArcSecs is an experimental and speculative framework for simulation, comparison, and debate. The site distinguishes mainstream science from ArcSecs hypotheses.',
                    ),
                ),
            ),
        ),
    );
}

/**
 * Add SEO metadata for the ArcSecs Research Hub page.
 *
 * @return void
 */
function arcsecs_research_hub_metadata() {
    if ( ! arcsecs_is_research_hub_page() ) {
        return;
    }

    $canonical = arcsecs_ai_access_url( 'arcsecs-research-hub/' );
    $entry     = arcsecs_get_public_route_seo_entry( 'arcsecs-research-hub/' );
    if ( ! is_array( $entry ) ) {
        return;
    }

    $schema = arcsecs_with_base_schema_graph( array_merge( arcsecs_research_hub_schema_graph( $canonical ), arcsecs_evidence_source_schema_graph( $canonical ) ) );

    echo '<link rel="canonical" href="' . esc_url( $canonical ) . '" />' . "
";
    arcsecs_output_route_social_metadata( $canonical, $entry, 'website' );
    echo '<script type="application/ld+json">' . wp_json_encode( $schema, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE ) . '</script>' . "
";
}
add_action( 'wp_head', 'arcsecs_research_hub_metadata', 3 );

/**
 * Render the virtual ArcSecs Research Library page.
 *
 * @return void
 */
function arcsecs_render_research_library_page() {
    global $wp_query;

    if ( isset( $wp_query ) ) {
        $wp_query->is_404  = false;
        $wp_query->is_page = true;
    }

    status_header( 200 );
    get_header();
    get_template_part( 'template-parts/research-library' );
    get_footer();
    exit;
}

/**
 * Build schema.org JSON-LD for the ArcSecs Research Library route.
 *
 * @param string $canonical Canonical page URL.
 * @return array<int,array<string,mixed>> Schema graph items.
 */
function arcsecs_research_library_schema_graph( $canonical ) {
    $topics = arcsecs_get_evidence_source_topics();
    $item_list = array();
    $position = 1;

    foreach ( $topics as $topic ) {
        $item_list[] = array(
            '@type'    => 'ListItem',
            'position' => $position,
            'name'     => $topic['title'],
            'url'      => $canonical . '#source-' . $topic['slug'],
        );
        $position++;
    }

    return array(
        array(
            '@context'         => 'https://schema.org',
            '@type'            => 'CollectionPage',
            'name'             => 'ArcSecs Research Library',
            'headline'         => 'ArcSecs Research Library',
            'description'      => 'A curated public source library for ArcSecs evidence, constraints, speculative theory, engineering analogies, and simulation prompts.',
            'url'              => $canonical,
            'mainEntityOfPage' => $canonical,
            'isAccessibleForFree' => true,
            'publisher'        => array( '@id' => arcsecs_ai_access_url( '#organization' ) ),
            'dateModified'     => ARCSECS_CONTENT_MODIFIED_DATE,
            'about'            => array( 'Hubble tension', 'JWST high-redshift galaxies', 'SPARC rotation curves', 'El Gordo galaxy cluster', 'Lithium-7 problem', 'Proca photon mass bounds', 'tired light constraints', 'Dark Matter Drive simulator' ),
        ),
        array(
            '@context'        => 'https://schema.org',
            '@type'           => 'ItemList',
            'name'            => 'ArcSecs Research Library source topics',
            'itemListElement' => $item_list,
        ),
        array(
            '@context'        => 'https://schema.org',
            '@type'           => 'BreadcrumbList',
            'itemListElement' => array(
                array( '@type' => 'ListItem', 'position' => 1, 'name' => 'Home', 'item' => arcsecs_ai_access_url( '' ) ),
                array( '@type' => 'ListItem', 'position' => 2, 'name' => 'Research Library', 'item' => $canonical ),
            ),
        ),
        array(
            '@context'   => 'https://schema.org',
            '@type'      => 'FAQPage',
            'mainEntity' => array(
                array(
                    '@type'          => 'Question',
                    'name'           => 'Does the Research Library prove ArcSecs is correct?',
                    'acceptedAnswer' => array( '@type' => 'Answer', 'text' => 'No. The library separates mainstream observations, model constraints, speculative sources, engineering analogies, and ArcSecs simulation prompts so visitors can see what each source supports and what it does not prove.' ),
                ),
                array(
                    '@type'          => 'Question',
                    'name'           => 'Why include sources that criticize tired light or constrain photon mass?',
                    'acceptedAnswer' => array( '@type' => 'Answer', 'text' => 'Those constraints are essential. ArcSecs claims are only useful when the hard failure tests remain visible instead of being hidden behind rhetoric.' ),
                ),
            ),
        ),
    );
}

/**
 * Add SEO metadata for the ArcSecs Research Library page.
 *
 * @return void
 */
function arcsecs_research_library_metadata() {
    if ( ! arcsecs_is_research_library_page() ) {
        return;
    }

    $canonical = arcsecs_ai_access_url( 'research-library/' );
    $entry     = arcsecs_get_public_route_seo_entry( 'research-library/' );
    if ( ! is_array( $entry ) ) {
        return;
    }

    $schema = arcsecs_with_base_schema_graph( array_merge( arcsecs_research_library_schema_graph( $canonical ), arcsecs_evidence_source_schema_graph( $canonical ) ) );

    echo '<link rel="canonical" href="' . esc_url( $canonical ) . '" />' . "
";
    arcsecs_output_route_social_metadata( $canonical, $entry, 'website' );
    echo '<script type="application/ld+json">' . wp_json_encode( $schema, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE ) . '</script>' . "
";
}
add_action( 'wp_head', 'arcsecs_research_library_metadata', 3 );

/**
 * Render the virtual Multi-Messenger Light Delay route.
 *
 * @return void
 */
function arcsecs_render_multi_messenger_light_delay_page() {
    global $wp_query;

    if ( isset( $wp_query ) ) {
        $wp_query->is_404  = false;
        $wp_query->is_page = true;
    }

    status_header( 200 );
    get_header();
    get_template_part( 'template-parts/multi-messenger-light-delay' );
    get_footer();
    exit;
}

/**
 * Build schema.org JSON-LD for the Multi-Messenger Light Delay route.
 *
 * @param string $canonical Canonical page URL.
 * @param string $image_url Hero image URL.
 * @return array<int,array<string,mixed>> Schema graph items.
 */
function arcsecs_multi_messenger_light_delay_schema_graph( $canonical, $image_url ) {
    return array(
        array(
            '@context'         => 'https://schema.org',
            '@type'            => 'Article',
            'name'             => 'Multi-Messenger Light Delay',
            'headline'         => 'Gravity Detected First, Light Seen Later',
            'description'      => 'A report-based ArcSecs page separating gravitational-wave baselines, electromagnetic source delay, environmental diffusion, tired-light energy accounting, and speculative light-slowing propagation tests.',
            'url'              => $canonical,
            'mainEntityOfPage' => $canonical,
            'image'            => $image_url,
            'isAccessibleForFree' => true,
            'publisher'        => array( '@id' => arcsecs_ai_access_url( '#organization' ) ),
            'dateModified'     => ARCSECS_CONTENT_MODIFIED_DATE,
            'datePublished'    => ARCSECS_CONTENT_MODIFIED_DATE,
            'about'            => array( 'multi-messenger astronomy', 'GW170817', 'GW150914', 'GW190521', 'gravitational waves', 'electromagnetic counterpart delay', 'tired light', 'variable speed of light', 'ArcSecs simulation' ),
            'citation'         => array(
                'https://www.mdpi.com/2075-4434/13/5/112',
                'https://arxiv.org/abs/1905.00781',
                'https://arxiv.org/html/2310.16025v2',
            ),
            'hasPart'          => array(
                array( '@type' => 'WebPageElement', 'name' => 'Quick read', 'url' => $canonical . '#quick-read' ),
                array( '@type' => 'WebPageElement', 'name' => 'Event ledger', 'url' => $canonical . '#event-ledger' ),
                array( '@type' => 'WebPageElement', 'name' => 'Visual ledger', 'url' => $canonical . '#visual-ledger' ),
                array( '@type' => 'WebPageElement', 'name' => 'Model checkpoints', 'url' => $canonical . '#model-checkpoints' ),
            ),
        ),
        array(
            '@context'        => 'https://schema.org',
            '@type'           => 'ItemList',
            'name'            => 'Multi-messenger timing events discussed by ArcSecs',
            'itemListElement' => array(
                array( '@type' => 'ListItem', 'position' => 1, 'name' => 'GW170817', 'description' => 'Binary neutron star benchmark event with GRB 170817A and kilonova counterpart.' ),
                array( '@type' => 'ListItem', 'position' => 2, 'name' => 'GW150914', 'description' => 'Binary black hole event with debated weak gamma-ray transient association.' ),
                array( '@type' => 'ListItem', 'position' => 3, 'name' => 'GW190521', 'description' => 'Massive binary black hole event with optical flare candidate in AGN environment.' ),
            ),
        ),
        array(
            '@context'        => 'https://schema.org',
            '@type'           => 'BreadcrumbList',
            'itemListElement' => array(
                array( '@type' => 'ListItem', 'position' => 1, 'name' => 'Home', 'item' => arcsecs_ai_access_url( '' ) ),
                array( '@type' => 'ListItem', 'position' => 2, 'name' => 'Research Library', 'item' => arcsecs_ai_access_url( 'research-library/' ) ),
                array( '@type' => 'ListItem', 'position' => 3, 'name' => 'Multi-Messenger Light Delay', 'item' => $canonical ),
            ),
        ),
        array(
            '@context'   => 'https://schema.org',
            '@type'      => 'FAQPage',
            'mainEntity' => array(
                array(
                    '@type'          => 'Question',
                    'name'           => 'Does a later electromagnetic counterpart prove light slows across space?',
                    'acceptedAnswer' => array( '@type' => 'Answer', 'text' => 'No. The page explicitly separates source delay, environment delay, counterpart uncertainty, and any candidate propagation delay. The ArcSecs light-slowing branch is speculative and must survive model checks.' ),
                ),
                array(
                    '@type'          => 'Question',
                    'name'           => 'Why include GW150914 and GW190521 if their counterparts are debated or environment-dominated?',
                    'acceptedAnswer' => array( '@type' => 'Answer', 'text' => 'They are useful stress tests. A serious model must label counterpart uncertainty and environment diffusion instead of pretending every delay is clean propagation.' ),
                ),
            ),
        ),
    );
}

/**
 * Add SEO metadata for the Multi-Messenger Light Delay page.
 *
 * @return void
 */
function arcsecs_multi_messenger_light_delay_metadata() {
    if ( ! arcsecs_is_multi_messenger_light_delay_page() ) {
        return;
    }

    $canonical = arcsecs_ai_access_url( 'multi-messenger-light-delay/' );
    $entry     = arcsecs_get_public_route_seo_entry( 'multi-messenger-light-delay/' );
    if ( ! is_array( $entry ) ) {
        return;
    }

    $image_url = arcsecs_multi_messenger_light_delay_image_url();
    $schema    = arcsecs_with_base_schema_graph( array_merge( arcsecs_multi_messenger_light_delay_schema_graph( $canonical, $image_url ), arcsecs_evidence_source_schema_graph( $canonical ) ) );

    echo '<link rel="canonical" href="' . esc_url( $canonical ) . '" />' . "\n";
    arcsecs_output_route_social_metadata( $canonical, $entry, 'article' );
    echo '<script type="application/ld+json">' . wp_json_encode( $schema, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE ) . '</script>' . "\n";
}
add_action( 'wp_head', 'arcsecs_multi_messenger_light_delay_metadata', 3 );

/**
 * Add SEO metadata for the ArcSecs home page.
 *
 * @return void
 */
function arcsecs_home_metadata() {
    if ( ! is_front_page() ) {
        return;
    }

    $canonical = arcsecs_ai_access_url( '' );
    $entry     = arcsecs_get_public_route_seo_entry( '' );
    if ( ! is_array( $entry ) ) {
        return;
    }

    $schema = arcsecs_with_base_schema_graph(
        array_merge(
            array(
                array(
                    '@context'         => 'https://schema.org',
                    '@type'            => 'WebPage',
                    'name'             => 'ArcSecs Home',
                    'headline'         => $entry['title'],
                    'description'      => $entry['description'],
                    'url'              => $canonical,
                    'mainEntityOfPage' => $canonical,
                    'isPartOf'         => array( '@id' => arcsecs_ai_access_url( '#website' ) ),
                    'publisher'        => array( '@id' => arcsecs_ai_access_url( '#organization' ) ),
                    'dateModified'     => ARCSECS_CONTENT_MODIFIED_DATE,
                    'about'            => array( 'speculative cosmology', 'tired light', 'massive photons', 'dark matter', 'physics simulation' ),
                ),
            ),
            arcsecs_evidence_source_schema_graph( $canonical )
        )
    );

    echo '<link rel="canonical" href="' . esc_url( $canonical ) . '" />' . "
";
    arcsecs_output_route_social_metadata( $canonical, $entry, 'website' );
    echo '<script type="application/ld+json">' . wp_json_encode( $schema, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE ) . '</script>' . "
";
}
add_action( 'wp_head', 'arcsecs_home_metadata', 2 );

/**
 * Render the virtual Standard Cosmology vs ArcSecs comparison page.
 *
 * @return void
 */
function arcsecs_render_cosmology_comparison_page() {
    global $wp_query;

    if ( isset( $wp_query ) ) {
        $wp_query->is_404  = false;
        $wp_query->is_page = true;
    }

    status_header( 200 );
    get_header();
    get_template_part( 'template-parts/standard-cosmology-comparison' );
    get_footer();
    exit;
}

/**
 * Provide a document title for the virtual cosmology comparison route.
 *
 * @param string $title Current document title.
 * @return string Updated document title.
 */
function arcsecs_cosmology_comparison_document_title( $title ) {
    if ( arcsecs_is_cosmology_comparison_page() ) {
        return 'Standard Cosmology vs. ArcSecs: Spacetime, Tired Light, Dark Matter, and Simulation';
    }

    return $title;
}
add_filter( 'pre_get_document_title', 'arcsecs_cosmology_comparison_document_title', 20 );

/**
 * Build schema.org JSON-LD graphs for the cosmology comparison route.
 *
 * @param string $canonical Canonical page URL.
 * @param string $image_url Social image URL.
 * @return array<int,array<string,mixed>> Schema graph items.
 */
function arcsecs_cosmology_comparison_schema_graph( $canonical, $image_url ) {
    return array(
        array(
            '@context'      => 'https://schema.org',
            '@type'         => 'Article',
            'headline'      => 'Standard Cosmology vs. the ArcSecs Speculative Framework',
            'description'   => 'Compare mainstream ΛCDM cosmology with the speculative ArcSecs framework, including spacetime, tired light, photon mass, slow-light dark matter, propulsion concepts, and TypeScript simulation architecture.',
            'image'         => $image_url,
            'url'           => $canonical,
            'mainEntityOfPage' => $canonical,
            'author'        => array(
                '@type' => 'Organization',
                'name'  => 'ArcSecs.com',
            ),
            'publisher'     => array(
                '@type' => 'Organization',
                'name'  => 'ArcSecs.com',
                'logo'  => array(
                    '@type' => 'ImageObject',
                    'url'   => ARCSECS_URI . '/assets/images/arcsecs-logo-refined.png',
                ),
            ),
            'dateModified'  => ARCSECS_CONTENT_MODIFIED_DATE,
            'datePublished' => ARCSECS_CONTENT_MODIFIED_DATE,
            'about'         => array(
                'ΛCDM cosmology',
                'general relativity',
                'tired light',
                'Proca electrodynamics',
                'dark matter',
                'slow light',
                'simulation architecture',
                'prediction pressure ledger',
                'cosmology glossary',
            ),
            'keywords'      => 'ΛCDM, ArcSecs, tired light, Proca electrodynamics, photon mass, slow-light dark matter, Tolman surface brightness, Type Ia supernova time dilation, cosmology simulation',
            'hasPart'       => array(
                array(
                    '@type' => 'WebPageElement',
                    'name'  => 'Prediction pressure ledger',
                    'url'   => $canonical . '#prediction-ledger',
                ),
                array(
                    '@type' => 'WebPageElement',
                    'name'  => 'Translation glossary',
                    'url'   => $canonical . '#glossary',
                ),
            ),
        ),
        array(
            '@context'        => 'https://schema.org',
            '@type'           => 'BreadcrumbList',
            'itemListElement' => array(
                array(
                    '@type'    => 'ListItem',
                    'position' => 1,
                    'name'     => 'Home',
                    'item'     => arcsecs_ai_access_url( '' ),
                ),
                array(
                    '@type'    => 'ListItem',
                    'position' => 2,
                    'name'     => 'Standard Cosmology vs. ArcSecs',
                    'item'     => $canonical,
                ),
            ),
        ),
        array(
            '@context'    => 'https://schema.org',
            '@type'       => 'HowTo',
            'name'        => 'Build an ArcSecs anomaly simulation run card',
            'description' => 'Choose a cosmological anomaly, inspect the suggested simulation controls, run the Physics Engine Demo, and compare the pass condition against the failure condition.',
            'step'        => array(
                array( '@type' => 'HowToStep', 'name' => 'Choose an anomaly', 'text' => 'Select Hubble tension, JWST mature galaxies, SPARC rotation curves, El Gordo, Lithium-7, Proca photons, tired light, or dark matter drive implications.' ),
                array( '@type' => 'HowToStep', 'name' => 'Inspect controls', 'text' => 'Review the controls the demo should expose for the selected anomaly, including physics toggles and accounting ledgers.' ),
                array( '@type' => 'HowToStep', 'name' => 'Run the demo', 'text' => 'Open the Physics Engine Demo and use the run card as a checklist for changing simulation parameters.' ),
                array( '@type' => 'HowToStep', 'name' => 'Compare pass and failure conditions', 'text' => 'Treat the ArcSecs branch as useful only when it survives the stated checks without hiding contradictions.' ),
            ),
        ),
        array(
            '@context'   => 'https://schema.org',
            '@type'      => 'FAQPage',
            'mainEntity' => array(
                array(
                    '@type'          => 'Question',
                    'name'           => 'Is ArcSecs presented as accepted physics?',
                    'acceptedAnswer' => array(
                        '@type' => 'Answer',
                        'text'  => 'No. The page labels ΛCDM as the current mainstream scientific model and ArcSecs as a speculative computational framework for exploration, simulation, and debate.',
                    ),
                ),
                array(
                    '@type'          => 'Question',
                    'name'           => 'Why compare tired light with expansion redshift?',
                    'acceptedAnswer' => array(
                        '@type' => 'Answer',
                        'text'  => 'The comparison makes the observational pressure points visible, including Type Ia supernova time dilation and Tolman surface-brightness expectations, so users can see where speculative alternatives must do real work.',
                    ),
                ),
                array(
                    '@type'          => 'Question',
                    'name'           => 'How does the Physics Engine Demo fit into the page?',
                    'acceptedAnswer' => array(
                        '@type' => 'Answer',
                        'text'  => 'The article directs readers into the ArcSecs Physics Engine Demo, where toggles and telemetry can compare assumptions such as photon mass, tired-light decay, variable light-speed modes, and condensate density.',
                    ),
                ),
                array(
                    '@type'          => 'Question',
                    'name'           => 'What is the prediction pressure ledger?',
                    'acceptedAnswer' => array(
                        '@type' => 'Answer',
                        'text'  => 'The ledger is a checklist of hard observational and computational tests, including CMB structure, BAO, supernova stretch, Tolman dimming, photon mass guardrails, lensing, energy accounting, and software consistency.',
                    ),
                ),
            ),
        ),
        array(
            '@context'       => 'https://schema.org',
            '@type'          => 'DefinedTermSet',
            'name'           => 'ArcSecs cosmology comparison glossary',
            'url'            => $canonical . '#glossary',
            'hasDefinedTerm' => array(
                array( '@type' => 'DefinedTerm', 'name' => 'ΛCDM' ),
                array( '@type' => 'DefinedTerm', 'name' => 'Proca electrodynamics' ),
                array( '@type' => 'DefinedTerm', 'name' => 'Tired light' ),
                array( '@type' => 'DefinedTerm', 'name' => 'Tolman surface brightness' ),
                array( '@type' => 'DefinedTerm', 'name' => 'Dark-state polariton' ),
                array( '@type' => 'DefinedTerm', 'name' => 'HIBE shield' ),
            ),
        ),
    );
}

/**
 * Add SEO metadata for the Standard Cosmology vs ArcSecs comparison page.
 *
 * @return void
 */
function arcsecs_cosmology_comparison_metadata() {
    if ( ! arcsecs_is_cosmology_comparison_page() ) {
        return;
    }

    $canonical = arcsecs_ai_access_url( 'standard-cosmology-vs-arcsecs/' );
    $entry     = arcsecs_get_public_route_seo_entry( 'standard-cosmology-vs-arcsecs/' );
    if ( ! is_array( $entry ) ) {
        return;
    }

    $image_url = arcsecs_cosmology_comparison_image_url();
    $schema    = arcsecs_with_base_schema_graph( array_merge( arcsecs_cosmology_comparison_schema_graph( $canonical, $image_url ), arcsecs_evidence_source_schema_graph( $canonical ) ) );

    echo '<link rel="canonical" href="' . esc_url( $canonical ) . '" />' . "
";
    arcsecs_output_route_social_metadata( $canonical, $entry, 'article' );
    echo '<meta property="article:published_time" content="2026-05-30T00:00:00+00:00" />' . "
";
    echo '<meta property="article:modified_time" content="' . esc_attr( ARCSECS_CONTENT_MODIFIED_DATE . 'T00:00:00+00:00' ) . '" />' . "
";
    echo '<meta property="article:section" content="Speculative Cosmology" />' . "
";
    echo '<meta property="article:tag" content="Lambda-CDM" />' . "
";
    echo '<meta property="article:tag" content="Tired Light" />' . "
";
    echo '<meta property="article:tag" content="Proca Electrodynamics" />' . "
";
    echo '<script type="application/ld+json">' . wp_json_encode( $schema, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE ) . '</script>' . "
";
}
add_action( 'wp_head', 'arcsecs_cosmology_comparison_metadata', 4 );

/**
 * Render the virtual ArcSecs Cosmic Anomalies Tracker page.
 *
 * @return void
 */
function arcsecs_render_cosmic_anomalies_tracker_page() {
    global $wp_query;

    if ( isset( $wp_query ) ) {
        $wp_query->is_404  = false;
        $wp_query->is_page = true;
    }

    status_header( 200 );
    get_header();
    get_template_part( 'template-parts/cosmic-anomalies-tracker' );
    get_footer();
    exit;
}

/**
 * Provide a document title for the virtual cosmic anomalies tracker route.
 *
 * @param string $title Current document title.
 * @return string Updated document title.
 */
function arcsecs_cosmic_anomalies_tracker_document_title( $title ) {
    if ( arcsecs_is_cosmic_anomalies_tracker_page() ) {
        return 'Cosmic Anomalies Tracker | ArcSecs';
    }

    return $title;
}
add_filter( 'pre_get_document_title', 'arcsecs_cosmic_anomalies_tracker_document_title', 21 );

/**
 * Build schema.org JSON-LD graphs for the cosmic anomalies tracker route.
 *
 * @param string $canonical Canonical page URL.
 * @param string $image_url Social image URL.
 * @return array<int,array<string,mixed>> Schema graph items.
 */
function arcsecs_cosmic_anomalies_tracker_schema_graph( $canonical, $image_url ) {
    return array(
        array(
            '@context'         => 'https://schema.org',
            '@type'            => 'TechArticle',
            'headline'         => 'The ArcSecs Cosmic Anomalies Tracker',
            'description'      => 'Track cosmological anomalies including the Hubble tension, JWST early galaxies, galaxy rotation curves, El Gordo, Lithium-7, tired light, Proca photons, and ArcSecs speculative physics models.',
            'image'            => $image_url,
            'url'              => $canonical,
            'mainEntityOfPage' => $canonical,
            'author'           => array(
                '@type' => 'Organization',
                'name'  => 'ArcSecs',
            ),
            'publisher'        => array(
                '@type' => 'Organization',
                'name'  => 'ArcSecs',
                'logo'  => array(
                    '@type' => 'ImageObject',
                    'url'   => ARCSECS_URI . '/assets/images/arcsecs-logo-refined.png',
                ),
            ),
            'dateModified'     => ARCSECS_CONTENT_MODIFIED_DATE,
            'datePublished'    => ARCSECS_CONTENT_MODIFIED_DATE,
            'keywords'         => 'cosmic anomalies, Hubble tension, JWST early galaxies, Lambda-CDM problems, tired light, Proca electrodynamics, photon mass, galaxy rotation curves, SPARC, El Gordo cluster, Lithium-7 problem, ArcSecs physics engine, alternative cosmology',
            'about'            => array(
                'Hubble tension',
                'JWST mature early galaxies',
                'SPARC galaxy rotation curves',
                'El Gordo galaxy cluster',
                'Lithium-7 problem',
                'Proca electrodynamics',
                'tired light',
                'ArcSecs Physics Engine',
                'claim hygiene evidence grading',
                'observation-first review mode',
            ),
            'hasPart'          => array(
                array( '@type' => 'WebPageElement', 'name' => 'Anomaly tracker dashboard', 'url' => $canonical . '#tracker-dashboard' ),
                array( '@type' => 'WebPageElement', 'name' => 'Claim hygiene evidence grading', 'url' => $canonical . '#claim-hygiene' ),
                array( '@type' => 'WebPageElement', 'name' => 'Observation-first review mode', 'url' => $canonical . '#observation-first-mode' ),
                array( '@type' => 'WebPageElement', 'name' => 'Interactive anomaly tracker', 'url' => $canonical . '#interactive-tracker' ),
                array( '@type' => 'WebPageElement', 'name' => 'Pressure ledger and failure conditions', 'url' => $canonical . '#pressure-ledger' ),
                array( '@type' => 'WebPageElement', 'name' => 'Simulation run card builder', 'url' => $canonical . '#simulation-run-builder' ),
                array( '@type' => 'WebPageElement', 'name' => 'References', 'url' => $canonical . '#references' ),
            ),
        ),
        array(
            '@context'        => 'https://schema.org',
            '@type'           => 'BreadcrumbList',
            'itemListElement' => array(
                array(
                    '@type'    => 'ListItem',
                    'position' => 1,
                    'name'     => 'Home',
                    'item'     => arcsecs_ai_access_url( '' ),
                ),
                array(
                    '@type'    => 'ListItem',
                    'position' => 2,
                    'name'     => 'Cosmic Anomalies Tracker',
                    'item'     => $canonical,
                ),
            ),
        ),
        array(
            '@context'    => 'https://schema.org',
            '@type'       => 'HowTo',
            'name'        => 'Build an ArcSecs anomaly simulation run card',
            'description' => 'Choose a cosmological anomaly, inspect the suggested simulation controls, run the Physics Engine Demo, and compare the pass condition against the failure condition.',
            'step'        => array(
                array( '@type' => 'HowToStep', 'name' => 'Choose an anomaly', 'text' => 'Select Hubble tension, JWST mature galaxies, SPARC rotation curves, El Gordo, Lithium-7, Proca photons, tired light, or dark matter drive implications.' ),
                array( '@type' => 'HowToStep', 'name' => 'Inspect controls', 'text' => 'Review the controls the demo should expose for the selected anomaly, including physics toggles and accounting ledgers.' ),
                array( '@type' => 'HowToStep', 'name' => 'Run the demo', 'text' => 'Open the Physics Engine Demo and use the run card as a checklist for changing simulation parameters.' ),
                array( '@type' => 'HowToStep', 'name' => 'Compare pass and failure conditions', 'text' => 'Treat the ArcSecs branch as useful only when it survives the stated checks without hiding contradictions.' ),
            ),
        ),
        array(
            '@context'   => 'https://schema.org',
            '@type'      => 'FAQPage',
            'mainEntity' => array(
                array(
                    '@type'          => 'Question',
                    'name'           => 'Is the Cosmic Anomalies Tracker claiming ArcSecs is proven?',
                    'acceptedAnswer' => array(
                        '@type' => 'Answer',
                        'text'  => 'No. The tracker labels ArcSecs as an experimental and speculative physics framework and compares it against mainstream cosmological explanations for research, simulation, and critical-thinking purposes.',
                    ),
                ),
                array(
                    '@type'          => 'Question',
                    'name'           => 'Why are Hubble tension, JWST galaxies, SPARC, El Gordo, and Lithium-7 grouped together?',
                    'acceptedAnswer' => array(
                        '@type' => 'Answer',
                        'text'  => 'They are different kinds of observational pressure points. The page uses them as a structured tracker so visitors can compare mainstream explanations with explicit ArcSecs simulation hooks.',
                    ),
                ),
                array(
                    '@type'          => 'Question',
                    'name'           => 'How does the tracker connect to the Physics Engine Demo?',
                    'acceptedAnswer' => array(
                        '@type' => 'Answer',
                        'text'  => 'Each anomaly includes a simulation hook such as redshift decay, photon mass, dark matter condensate density, cluster collision velocity, or element abundance equilibrium.',
                    ),
                ),
                array(
                    '@type'          => 'Question',
                    'name'           => 'What do evidence grades mean?',
                    'acceptedAnswer' => array(
                        '@type' => 'Answer',
                        'text'  => 'Evidence grades separate established observations, active interpretations, boundary constraints, and speculative extensions so readers can see the difference between data, model inference, and ArcSecs-only simulation ideas.',
                    ),
                ),
                array(
                    '@type'          => 'Question',
                    'name'           => 'What is observation-first review mode?',
                    'acceptedAnswer' => array(
                        '@type' => 'Answer',
                        'text'  => 'Observation-first review mode dims ArcSecs-only speculative lanes so visitors can inspect the observation, mainstream interpretation, and failure condition before reintroducing the alternative model.',
                    ),
                ),
                array(
                    '@type'          => 'Question',
                    'name'           => 'What is the pressure ledger?',
                    'acceptedAnswer' => array(
                        '@type' => 'Answer',
                        'text'  => 'The pressure ledger separates observation maturity, mainstream fit pressure, ArcSecs simulation readiness, demo priority, and failure conditions so the page does not confuse provocative speculation with proof.',
                    ),
                ),
            ),
        ),
    );
}

/**
 * Add SEO metadata for the ArcSecs Cosmic Anomalies Tracker page.
 *
 * @return void
 */
function arcsecs_cosmic_anomalies_tracker_metadata() {
    if ( ! arcsecs_is_cosmic_anomalies_tracker_page() ) {
        return;
    }

    $canonical = arcsecs_ai_access_url( 'cosmic-anomalies-tracker/' );
    $entry     = arcsecs_get_public_route_seo_entry( 'cosmic-anomalies-tracker/' );
    if ( ! is_array( $entry ) ) {
        return;
    }

    $image_url = arcsecs_cosmic_anomalies_tracker_image_url();
    $schema    = arcsecs_with_base_schema_graph( array_merge( arcsecs_cosmic_anomalies_tracker_schema_graph( $canonical, $image_url ), arcsecs_evidence_source_schema_graph( $canonical ) ) );

    echo '<link rel="canonical" href="' . esc_url( $canonical ) . '" />' . "
";
    arcsecs_output_route_social_metadata( $canonical, $entry, 'article' );
    echo '<meta property="article:published_time" content="2026-05-30T00:00:00+00:00" />' . "
";
    echo '<meta property="article:modified_time" content="' . esc_attr( ARCSECS_CONTENT_MODIFIED_DATE . 'T00:00:00+00:00' ) . '" />' . "
";
    echo '<meta property="article:section" content="Cosmic Anomalies" />' . "
";
    echo '<meta property="article:tag" content="Hubble Tension" />' . "
";
    echo '<meta property="article:tag" content="JWST Early Galaxies" />' . "
";
    echo '<meta property="article:tag" content="Galaxy Rotation Curves" />' . "
";
    echo '<script type="application/ld+json">' . wp_json_encode( $schema, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE ) . '</script>' . "
";
}
add_action( 'wp_head', 'arcsecs_cosmic_anomalies_tracker_metadata', 4 );

/**
 * Add metadata for the ArcSecs Physics Engine Demo route.
 *
 * @return void
 */
function arcsecs_ai_access_demo_metadata() {
    if ( ! arcsecs_ai_access_is_demo_page() ) {
        return;
    }

    $canonical = arcsecs_ai_access_url( 'arcsecs-physics-engine-demo/' );
    $entry     = arcsecs_get_public_route_seo_entry( 'arcsecs-physics-engine-demo/' );
    if ( ! is_array( $entry ) ) {
        return;
    }

    $json_ld = arcsecs_with_base_schema_graph(
        array(
            array(
                '@context'            => 'https://schema.org',
                '@type'               => 'WebApplication',
                'name'                => 'ArcSecs Physics Engine Demo',
                'url'                 => $canonical,
                'applicationCategory' => 'EducationalApplication',
                'operatingSystem'     => 'Web',
                'description'         => $entry['description'] . ' ' . ARCSECS_AI_ACCESS_DISCLAIMER,
                'isAccessibleForFree' => true,
                'publisher'           => array( '@id' => arcsecs_ai_access_url( '#organization' ) ),
                'image'               => $entry['image'],
                'about'               => array(
                    'speculative physics visualization',
                    'relational theatrical physics engine',
                    'tired light',
                    'massive photon concepts',
                    'Dark Matter Drive Ramjet Simulation',
                ),
                'relatedLink'         => array( arcsecs_dark_matter_drive_simulator_url() ),
            ),
        )
    );

    echo '<link rel="canonical" href="' . esc_url( $canonical ) . '" />' . "
";
    arcsecs_output_route_social_metadata( $canonical, $entry, 'website' );
    echo '<script type="application/ld+json">' . wp_json_encode( $json_ld, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE ) . '</script>' . "
";
}
add_action( 'wp_head', 'arcsecs_ai_access_demo_metadata', 5 );

/**
 * Add crawler-readable demo fallback copy to the demo route.
 *
 * @return void
 */
function arcsecs_ai_access_demo_static_fallback() {
    if ( ! arcsecs_ai_access_is_demo_page() ) {
        return;
    }

    echo '<section class="arcsecs-card arcsecs-ai-readable-summary" aria-label="AI-readable ArcSecs demo summary">';
    echo '<h2>About the ArcSecs Physics Engine Demo</h2>';
    echo '<p>The ArcSecs Physics Engine Demo is an interactive speculative research visualization for relational theatrical physics, tired-light concepts, massive-photon / Proca-style dispersion, deterministic calibration, and Dark Matter Drive Ramjet simulation.</p>';
    echo '<p class="arcsecs-disclaimer">' . esc_html( ARCSECS_AI_ACCESS_DISCLAIMER ) . '</p>';
    echo '<h3>Scenario guide</h3><ul>';
    foreach ( arcsecs_ai_access_scenarios() as $scenario ) {
        echo '<li><strong>' . esc_html( $scenario['name'] ) . ':</strong> ' . esc_html( $scenario['summary'] ) . '</li>';
    }
    echo '</ul>';
    echo '<div class="arcsecs-demo-drive-cta"><h3>Try the Dark Matter Drive Simulator</h3><p>Use the same ArcSecs simulation framework in an interactive propulsion blueprint with ramjet thermal limits, field capture, tired-light ledger checks, and replay controls.</p><p><a class="arcsecs-button" href="' . esc_url( arcsecs_dark_matter_drive_simulator_url() ) . '">Open Dark Matter Drive Simulator</a></p></div>';
    echo '<h3>Important crawler-readable links</h3><ul>';
    echo '<li><a href="' . esc_url( arcsecs_ai_access_url( 'llms.txt' ) ) . '">llms.txt</a></li>';
    echo '<li><a href="' . esc_url( arcsecs_ai_access_url( 'arcsecs-physics-engine-demo/ai-summary/' ) ) . '">AI-readable demo summary</a></li>';
    echo '<li><a href="' . esc_url( arcsecs_ai_access_url( 'arcsecs-sitemap.xml' ) ) . '">ArcSecs XML sitemap</a></li>';
    echo '</ul>';
    echo '</section>';
}
add_action( 'wp_footer', 'arcsecs_ai_access_demo_static_fallback', 5 );

/**
 * Add a dashboard notice reminding admins to refresh permalinks after activation.
 *
 * @return void
 */
function arcsecs_ai_access_admin_notice() {
    if ( ! current_user_can( 'manage_options' ) ) {
        return;
    }

    echo '<div class="notice notice-info"><p><strong>ArcSecs V5 AI Access:</strong> after activating or updating, visit Settings &gt; Permalinks and click Save Changes if /llms.txt, /arcsecs-sitemap.xml, or /arcsecs-physics-engine-demo/ai-summary/, or /arcsecs-research-hub/ or /research-library/ or /multi-messenger-light-delay/ or /standard-cosmology-vs-arcsecs/ or /cosmic-anomalies-tracker/ or /dark-matter-drive-simulator/ returns 404.</p></div>';
}
add_action( 'admin_notices', 'arcsecs_ai_access_admin_notice' );


/**
 * ArcSecs v5.0.38 Distance-Time Framework route support.
 *
 * Keeps the public framework page theme-facing while the simulator logic stays
 * inside the ArcSecs TypeScript plugin.
 */
if ( ! defined( 'ARCSECS_DISTANCE_TIME_FRAMEWORK_PATH' ) ) {
    define( 'ARCSECS_DISTANCE_TIME_FRAMEWORK_PATH', '/arcsecs-distance-time-framework/' );
}

/**
 * Return true when the current request is the Distance-Time Framework route.
 *
 * @return bool Whether this is the Distance-Time Framework route.
 */
function arcsecs_is_distance_time_framework_page() {
    $request_path = isset( $_SERVER['REQUEST_URI'] ) ? wp_parse_url( sanitize_text_field( wp_unslash( $_SERVER['REQUEST_URI'] ) ), PHP_URL_PATH ) : '';
    return trailingslashit( (string) $request_path ) === ARCSECS_DISTANCE_TIME_FRAMEWORK_PATH || ( function_exists( 'get_query_var' ) && get_query_var( 'arcsecs_distance_time_framework' ) );
}

/**
 * Return the Distance-Time Framework URL.
 *
 * @return string Absolute URL.
 */
function arcsecs_distance_time_framework_url() {
    return arcsecs_ai_access_url( 'arcsecs-distance-time-framework/' );
}

/**
 * Add the Distance-Time Framework rewrite rule.
 *
 * @return void
 */
function arcsecs_distance_time_framework_rewrite_rule() {
    add_rewrite_rule( '^arcsecs-distance-time-framework/?$', 'index.php?arcsecs_distance_time_framework=1', 'top' );
}
add_action( 'init', 'arcsecs_distance_time_framework_rewrite_rule' );

/**
 * Register the Distance-Time Framework query variable.
 *
 * @param array<int,string> $vars Existing query vars.
 * @return array<int,string> Updated query vars.
 */
function arcsecs_distance_time_framework_query_vars( $vars ) {
    $vars[] = 'arcsecs_distance_time_framework';
    return $vars;
}
add_filter( 'query_vars', 'arcsecs_distance_time_framework_query_vars' );

/**
 * Render the virtual Distance-Time Framework page.
 *
 * @return void
 */
function arcsecs_render_distance_time_framework_page() {
    global $wp_query;

    if ( isset( $wp_query ) ) {
        $wp_query->is_404  = false;
        $wp_query->is_page = true;
    }

    status_header( 200 );
    get_header();
    get_template_part( 'template-parts/distance-time-framework' );
    get_footer();
    exit;
}

/**
 * Serve the virtual Distance-Time Framework route.
 *
 * @return void
 */
function arcsecs_distance_time_framework_template_redirect() {
    if ( arcsecs_is_distance_time_framework_page() ) {
        arcsecs_render_distance_time_framework_page();
    }
}
add_action( 'template_redirect', 'arcsecs_distance_time_framework_template_redirect', 0 );

/**
 * Provide document title for the Distance-Time Framework route.
 *
 * @param string $title Existing document title.
 * @return string Updated document title.
 */
function arcsecs_distance_time_framework_document_title( $title ) {
    if ( arcsecs_is_distance_time_framework_page() ) {
        $entry = arcsecs_get_public_route_seo_entry( 'arcsecs-distance-time-framework/' );
        return is_array( $entry ) ? $entry['title'] : 'ArcSecs Distance-Time Framework | Measuring Without Lightyears';
    }

    return $title;
}
add_filter( 'pre_get_document_title', 'arcsecs_distance_time_framework_document_title', 15 );

/**
 * Build schema.org JSON-LD graphs for the Distance-Time Framework route.
 *
 * @param string $canonical Canonical page URL.
 * @return array<int,array<string,mixed>> Schema graph entries.
 */
function arcsecs_distance_time_framework_schema_graph( $canonical ) {
    return array(
        array(
            '@context'         => 'https://schema.org',
            '@type'            => 'TechArticle',
            '@id'              => $canonical . '#techarticle',
            'headline'         => 'ArcSecs Distance-Time Framework',
            'description'      => 'ArcSecs explains a speculative Distance-Time Framework for measuring cosmic distance without lightyears and modeling universal progression without local clocks, using parallax, parsecs, gravity-wave baselines, relational time, and multi-messenger tests.',
            'datePublished'    => '2026-05-31T00:00:00+00:00',
            'dateModified'     => ARCSECS_CONTENT_MODIFIED_DATE . 'T00:00:00+00:00',
            'articleSection'   => 'Speculative Cosmology Simulation',
            'image'            => arcsecs_home_social_image_url(),
            'keywords'         => 'ArcSecs distance-time framework, measure universe without lightyears, parallax, parsec, gravitational-wave standard sirens, clockless universal progression, multi-messenger event testing, Supernova Light-Curve Stretch, Hubble Tension, exportable evidence packets, Benchmark JSON, Calibration Certificate, Evidence Packet, Research Bundle, Scene JSON, falsification path, teleparallel gravity, Proca electrodynamics, mass-polariton theory, CCC+TL, dark-state polariton',
            'isAccessibleForFree' => true,
            'mainEntityOfPage' => array(
                '@type' => 'WebPage',
                '@id'   => $canonical,
            ),
            'author'           => array(
                '@type' => 'Organization',
                'name'  => 'ArcSecs',
                'url'   => home_url( '/' ),
            ),
            'publisher'        => array(
                '@type' => 'Organization',
                'name'  => 'ArcSecs',
                'url'   => home_url( '/' ),
                'logo'  => array(
                    '@type' => 'ImageObject',
                    'url'   => arcsecs_schema_logo_url(),
                ),
            ),
            'about'            => array(
                'speculative cosmology simulation',
                'parallax',
                'parsec',
                'gravitational waves',
                'multi-messenger astronomy',
                'Supernova Light-Curve Stretch',
                'Hubble Tension',
                'relational time',
                'tired light',
                'variable speed of light model',
                'teleparallel gravity',
                'Proca electrodynamics',
                'mass-polariton theory',
                'CCC+TL cosmology',
                'dark-state polariton',
                'graviball condensate',
                'simulation validation',
                'falsification path',
            ),
        ),
        array(
            '@context'        => 'https://schema.org',
            '@type'           => 'BreadcrumbList',
            '@id'             => $canonical . '#breadcrumb',
            'itemListElement' => array(
                array(
                    '@type'    => 'ListItem',
                    'position' => 1,
                    'name'     => 'ArcSecs',
                    'item'     => home_url( '/' ),
                ),
                array(
                    '@type'    => 'ListItem',
                    'position' => 2,
                    'name'     => 'Distance-Time Framework',
                    'item'     => $canonical,
                ),
            ),
        ),
    );
}

/**
 * Add SEO and schema metadata for the Distance-Time Framework page.
 *
 * @return void
 */
function arcsecs_distance_time_framework_metadata() {
    if ( ! arcsecs_is_distance_time_framework_page() ) {
        return;
    }

    $canonical = arcsecs_distance_time_framework_url();
    $entry     = arcsecs_get_public_route_seo_entry( 'arcsecs-distance-time-framework/' );

    if ( ! is_array( $entry ) ) {
        return;
    }

    echo '<link rel="canonical" href="' . esc_url( $canonical ) . '" />' . "\n";
    arcsecs_output_route_social_metadata( $canonical, $entry, 'article' );
    echo '<meta property="article:section" content="Speculative Cosmology Simulation" />' . "\n";
    echo '<meta property="article:tag" content="Distance without lightyears" />' . "\n";
    echo '<meta property="article:tag" content="Clockless universal progression" />' . "\n";
    echo '<meta property="article:tag" content="Multi-messenger astronomy" />' . "\n";

    $schema = arcsecs_with_base_schema_graph( array_merge( arcsecs_distance_time_framework_schema_graph( $canonical ), arcsecs_evidence_source_schema_graph( $canonical ) ) );
    echo '<script type="application/ld+json">' . wp_json_encode( $schema, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE ) . '</script>' . "\n";
}
add_action( 'wp_head', 'arcsecs_distance_time_framework_metadata', 3 );
