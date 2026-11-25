<?php
/**
 * Home/Blog repair helpers. This file intentionally does not seed posts.
 *
 * @package ArcSecs
 */

if (!defined('ABSPATH')) {
    exit;
}

function arcsecs_find_or_create_page($title, $slug, $content = '') {
    $page = get_page_by_path($slug, OBJECT, 'page');
    if ($page instanceof WP_Post) {
        $updates = array('ID' => $page->ID);
        if ($page->post_status !== 'publish') {
            $updates['post_status'] = 'publish';
        }
        if (!empty($updates) && count($updates) > 1) {
            wp_update_post($updates);
        }
        return (int) $page->ID;
    }

    return (int) wp_insert_post(array(
        'post_type'    => 'page',
        'post_title'   => $title,
        'post_name'    => $slug,
        'post_status'  => 'publish',
        'post_content' => $content,
    ));
}

function arcsecs_ensure_menu_assignment() {
    $locations = get_theme_mod('nav_menu_locations', array());
    if (!empty($locations['primary'])) {
        return;
    }

    $menu = wp_get_nav_menu_object('ArcSecs Main');
    if (!$menu) {
        $menu_id = wp_create_nav_menu('ArcSecs Main');
        if (is_wp_error($menu_id)) {
            return;
        }
        wp_update_nav_menu_item($menu_id, 0, array(
            'menu-item-title'  => __('Home', 'arcsecs'),
            'menu-item-url'    => home_url('/'),
            'menu-item-status' => 'publish',
        ));
        wp_update_nav_menu_item($menu_id, 0, array(
            'menu-item-title'  => __('Blog', 'arcsecs'),
            'menu-item-url'    => home_url('/blog/'),
            'menu-item-status' => 'publish',
        ));
    } else {
        $menu_id = (int) $menu->term_id;
    }

    $locations['primary'] = $menu_id;
    $locations['footer'] = $menu_id;
    set_theme_mod('nav_menu_locations', $locations);
}

function arcsecs_repair_site_structure() {
    $home_id = arcsecs_find_or_create_page('Home', 'home', '');
    $blog_id = arcsecs_find_or_create_page('Blog', 'blog', '');

    if ($home_id > 0 && $blog_id > 0) {
        update_option('show_on_front', 'page');
        update_option('page_on_front', $home_id);
        update_option('page_for_posts', $blog_id);
    }

    arcsecs_ensure_menu_assignment();
    update_option('arcsecs_v3_structure_repaired', time());
}

function arcsecs_after_switch_theme() {
    arcsecs_repair_site_structure();
    flush_rewrite_rules(false);
}
add_action('after_switch_theme', 'arcsecs_after_switch_theme');

function arcsecs_maybe_run_upgrade() {
    if (get_option('arcsecs_theme_version') !== ARCSECS_VERSION) {
        arcsecs_repair_site_structure();
        update_option('arcsecs_theme_version', ARCSECS_VERSION);
        flush_rewrite_rules(false);
    }
}
add_action('init', 'arcsecs_maybe_run_upgrade', 20);

function arcsecs_admin_menu() {
    add_theme_page(
        __('ArcSecs Repair', 'arcsecs'),
        __('ArcSecs Repair', 'arcsecs'),
        'manage_options',
        'arcsecs-repair',
        'arcsecs_repair_page'
    );
}
add_action('admin_menu', 'arcsecs_admin_menu');


/**
 * Return route health targets for the ArcSecs install-health dashboard.
 *
 * Theme-owned routes should resolve through this theme. Plugin-owned routes are
 * checked for discoverability only; the theme must not replace them.
 *
 * @return array<int,array<string,mixed>> Route health rows.
 */
function arcsecs_get_route_health_targets() {
    return array(
        array(
            'label'          => 'Start Here / Research Hub',
            'path'           => '/arcsecs-research-hub/',
            'owner'          => 'Theme virtual route',
            'marker'         => 'Start Here',
            'nav'            => true,
            'sitemap'        => true,
            'llms'           => true,
            'fix'            => 'Save Settings > Permalinks, then run ArcSecs Repair if the route still 404s.',
        ),
        array(
            'label'          => 'Research Library',
            'path'           => '/research-library/',
            'owner'          => 'Theme virtual route',
            'marker'         => 'ArcSecs Research Library',
            'nav'            => false,
            'sitemap'        => true,
            'llms'           => true,
            'fix'            => 'Save Settings > Permalinks. The Research Library is rendered by the active theme.',
        ),
        array(
            'label'          => 'Multi-Messenger Light Delay',
            'path'           => '/multi-messenger-light-delay/',
            'owner'          => 'Theme virtual route',
            'marker'         => 'Gravity detected first',
            'nav'            => false,
            'sitemap'        => true,
            'llms'           => true,
            'fix'            => 'Save Settings > Permalinks. The Multi-Messenger Light Delay page is rendered by the active theme.',
        ),
        array(
            'label'          => 'Standard Cosmology vs. ArcSecs',
            'path'           => '/standard-cosmology-vs-arcsecs/',
            'owner'          => 'Theme virtual route',
            'marker'         => 'Standard Cosmology vs',
            'nav'            => true,
            'sitemap'        => true,
            'llms'           => true,
            'fix'            => 'Refresh permalinks. The comparison page is rendered by the active theme.',
        ),
        array(
            'label'          => 'Cosmic Anomalies Tracker',
            'path'           => '/cosmic-anomalies-tracker/',
            'owner'          => 'Theme virtual route',
            'marker'         => 'Cosmic Anomalies Tracker',
            'nav'            => true,
            'sitemap'        => true,
            'llms'           => true,
            'fix'            => 'Refresh permalinks. The tracker page is rendered by the active theme.',
        ),
        array(
            'label'          => 'Physics Engine Demo',
            'path'           => '/arcsecs-physics-engine-demo/',
            'owner'          => 'Theme demo shell / existing ArcSecs route',
            'marker'         => 'ArcSecs Physics Engine',
            'nav'            => true,
            'sitemap'        => true,
            'llms'           => true,
            'fix'            => 'Refresh permalinks and confirm the demo shell route is still registered by the theme/plugin stack.',
        ),
        array(
            'label'          => 'Dark Matter Drive Simulator',
            'path'           => '/dark-matter-drive-simulator/',
            'owner'          => 'ArcSecs plugin-owned page',
            'marker'         => 'Dark Matter Drive',
            'nav'            => true,
            'sitemap'        => true,
            'llms'           => true,
            'fix'            => 'Activate/update the ArcSecs plugin that owns this simulator, run the plugin repair routine if available, and save permalinks. Do not create a theme replacement page.',
        ),
        array(
            'label'          => 'llms.txt',
            'path'           => '/llms.txt',
            'owner'          => 'Theme AI/crawler endpoint',
            'marker'         => '# ArcSecs.com',
            'nav'            => false,
            'sitemap'        => true,
            'llms'           => false,
            'fix'            => 'Save permalinks. The theme owns the llms.txt rewrite endpoint.',
        ),
        array(
            'label'          => 'ArcSecs XML Sitemap',
            'path'           => '/arcsecs-sitemap.xml',
            'owner'          => 'Theme sitemap endpoint',
            'marker'         => '<urlset',
            'nav'            => false,
            'sitemap'        => true,
            'llms'           => true,
            'fix'            => 'Save permalinks. The theme owns this custom ArcSecs sitemap endpoint.',
        ),
        array(
            'label'          => 'robots.txt',
            'path'           => '/robots.txt',
            'owner'          => 'Theme robots.txt filter / WordPress virtual file',
            'marker'         => 'Sitemap:',
            'nav'            => false,
            'sitemap'        => false,
            'llms'           => false,
            'fix'            => 'Confirm WordPress virtual robots.txt is enabled and not overridden by a physical server file.',
        ),
    );
}

/**
 * Return whether a route is represented in the assigned Primary Menu.
 *
 * @param string $path Site-relative path.
 * @return string Human-readable nav state.
 */
function arcsecs_route_health_nav_state( $path ) {
    $normalized_path = arcsecs_normalize_nav_path( $path );
    $menu_id         = arcsecs_get_assigned_primary_menu_id();

    if ( $menu_id <= 0 ) {
        return 'No assigned Primary Menu; fallback/render filters apply.';
    }

    $items = wp_get_nav_menu_items( $menu_id );

    if ( empty( $items ) || is_wp_error( $items ) ) {
        return 'Assigned Primary Menu has no readable items; fallback/render filters apply.';
    }

    $count = 0;

    foreach ( $items as $item ) {
        if ( $normalized_path === arcsecs_normalize_nav_path( isset( $item->url ) ? $item->url : '' ) ) {
            $count++;
        }
    }

    if ( 0 === $count ) {
        return 'Not assigned; theme appends required nav link at render time.';
    }

    if ( 1 === $count ) {
        return 'Present once in assigned Primary Menu.';
    }

    return 'Duplicate assigned menu items detected: ' . (string) $count;
}

/**
 * Return source-level sitemap/llms membership notes for a route.
 *
 * @param string $path Site-relative path.
 * @param string $source Either sitemap or llms.
 * @param bool   $expected Whether the route is expected in that source.
 * @return string Human-readable source membership state.
 */
function arcsecs_route_health_source_state( $path, $source, $expected ) {
    if ( ! $expected ) {
        return 'Not expected';
    }

    $functions_path = ARCSECS_DIR . '/functions.php';

    if ( ! file_exists( $functions_path ) || ! is_readable( $functions_path ) ) {
        return 'Source unreadable';
    }

    $source_text = file_get_contents( $functions_path );
    $route_slug  = trim( $path, '/' );

    if ( ! is_string( $source_text ) || '' === $route_slug ) {
        return 'Unable to inspect source';
    }

    $source_function = 'llms' === $source ? 'arcsecs_ai_access_output_llms_txt' : 'arcsecs_ai_access_output_sitemap_xml';
    $function_offset = strpos( $source_text, 'function ' . $source_function );

    if ( false === $function_offset ) {
        return 'Missing ' . $source . ' output function';
    }

    $source_fragment = substr( $source_text, $function_offset, 5500 );

    return false !== strpos( $source_fragment, $route_slug ) ? 'Present in theme-owned ' . $source : 'Missing from theme-owned ' . $source;
}

/**
 * Fetch a route health result for live admin diagnostics.
 *
 * @param array<string,mixed> $target Route target row.
 * @return array<string,string> Live route result.
 */
function arcsecs_fetch_route_health_result( $target ) {
    $url        = home_url( (string) $target['path'] );
    $cache_key  = 'arcsecs_route_health_' . md5( $url . '|' . ARCSECS_VERSION );
    $cached     = get_transient( $cache_key );

    if ( is_array( $cached ) ) {
        return $cached;
    }

    $result = array(
        'http_status' => 'Not checked',
        'title'       => 'Not checked',
        'marker'      => 'Not checked',
    );

    $response = wp_remote_get(
        $url,
        array(
            'timeout'     => 6,
            'redirection' => 3,
            'user-agent'  => 'ArcSecs Route Health Dashboard/' . ARCSECS_VERSION . '; ' . home_url( '/' ),
        )
    );

    if ( is_wp_error( $response ) ) {
        $result['http_status'] = 'Error';
        $result['title']       = $response->get_error_message();
        $result['marker']      = 'Not checked after HTTP error';
        set_transient( $cache_key, $result, 60 );
        return $result;
    }

    $code = (int) wp_remote_retrieve_response_code( $response );
    $body = (string) wp_remote_retrieve_body( $response );

    $result['http_status'] = (string) $code;

    if ( preg_match( '/<title[^>]*>(.*?)<\/title>/is', $body, $matches ) ) {
        $result['title'] = trim( wp_strip_all_tags( html_entity_decode( $matches[1], ENT_QUOTES ) ) );
    } else {
        $result['title'] = 'No <title> detected';
    }

    $marker = isset( $target['marker'] ) ? (string) $target['marker'] : '';

    if ( '' === $marker ) {
        $result['marker'] = 'No marker configured';
    } elseif ( false !== stripos( $body, $marker ) ) {
        $result['marker'] = 'Marker found: ' . $marker;
    } else {
        $result['marker'] = 'Marker missing: ' . $marker;
    }

    set_transient( $cache_key, $result, 60 );
    return $result;
}

/**
 * Return route health rows for the admin dashboard.
 *
 * @param bool $live_check Whether to perform HTTP checks.
 * @return array<int,array<string,string>> Route health rows.
 */
function arcsecs_get_route_health_rows( $live_check = false ) {
    $rows = array();

    foreach ( arcsecs_get_route_health_targets() as $target ) {
        $live_result = $live_check ? arcsecs_fetch_route_health_result( $target ) : array(
            'http_status' => 'Click Run Route Health Check',
            'title'       => 'Live HTTP checks are skipped until requested.',
            'marker'      => 'Live marker checks are skipped until requested.',
        );

        $rows[] = array(
            'label'       => (string) $target['label'],
            'path'        => (string) $target['path'],
            'owner'       => (string) $target['owner'],
            'http_status' => (string) $live_result['http_status'],
            'title'       => (string) $live_result['title'],
            'marker'      => (string) $live_result['marker'],
            'nav'         => ! empty( $target['nav'] ) ? arcsecs_route_health_nav_state( (string) $target['path'] ) : 'Not a top-nav route',
            'sitemap'     => arcsecs_route_health_source_state( (string) $target['path'], 'sitemap', ! empty( $target['sitemap'] ) ),
            'llms'        => arcsecs_route_health_source_state( (string) $target['path'], 'llms', ! empty( $target['llms'] ) ),
            'fix'         => (string) $target['fix'],
        );
    }

    return $rows;
}


/**
 * Return route diagnostics for the theme-owned shell and plugin-owned pages.
 *
 * @return array<int,array<string,string>> Diagnostic rows.
 */
function arcsecs_get_route_diagnostics() {
    $routes = array(
        array(
            'label' => 'Home',
            'path'  => '/',
            'owner' => 'Theme / WordPress page',
            'note'  => 'Front page assignment should point to the Home page.',
        ),
        array(
            'label' => 'Research Hub',
            'path'  => '/arcsecs-research-hub/',
            'owner' => 'Theme virtual route',
            'note'  => 'Start Here route rendered by the theme.',
        ),
        array(
            'label' => 'Research Library',
            'path'  => '/research-library/',
            'owner' => 'Theme virtual route',
            'note'  => 'Evidence and scientific link library rendered by the theme.',
        ),
        array(
            'label' => 'Multi-Messenger Light Delay',
            'path'  => '/multi-messenger-light-delay/',
            'owner' => 'Theme virtual route',
            'note'  => 'Report-based multi-messenger timing page rendered by the theme.',
        ),
        array(
            'label' => 'Physics Demo',
            'path'  => '/arcsecs-physics-engine-demo/',
            'owner' => 'Theme virtual route / demo shell',
            'note'  => 'Existing ArcSecs physics demo route.',
        ),
        array(
            'label' => 'Cosmology',
            'path'  => '/standard-cosmology-vs-arcsecs/',
            'owner' => 'Theme virtual route',
            'note'  => 'Comparison page rendered by the theme.',
        ),
        array(
            'label' => 'DM Drive',
            'path'  => '/dark-matter-drive-simulator/',
            'owner' => 'ArcSecs plugin',
            'note'  => 'Do not create this in the theme. If this is missing, activate/update the plugin and refresh permalinks.',
        ),
        array(
            'label' => 'Anomalies',
            'path'  => '/cosmic-anomalies-tracker/',
            'owner' => 'Theme virtual route',
            'note'  => 'Cosmic Anomalies Tracker rendered by the theme.',
        ),
    );

    return $routes;
}

/**
 * Build a simple runtime status for a known route.
 *
 * @param string $path Site-relative path.
 * @return string Human-readable route status.
 */
function arcsecs_get_route_diagnostic_status( $path ) {
    $normalized_path = trailingslashit( '/' . ltrim( $path, '/' ) );

    if ( '/' === $normalized_path ) {
        return (int) get_option( 'page_on_front' ) > 0 ? 'Configured' : 'Needs front-page assignment';
    }

    $slug = trim( $normalized_path, '/' );

    if ( in_array( $normalized_path, array( '/arcsecs-research-hub/', '/arcsecs-physics-engine-demo/', '/standard-cosmology-vs-arcsecs/', '/cosmic-anomalies-tracker/' ), true ) ) {
        return 'Theme route registered; refresh permalinks if it 404s';
    }

    if ( '/dark-matter-drive-simulator/' === $normalized_path ) {
        $page = get_page_by_path( $slug, OBJECT, 'page' );
        return $page instanceof WP_Post ? 'Plugin page exists in WordPress' : 'Plugin page not found in WordPress';
    }

    return 'Unknown';
}

/**
 * Count required primary-nav route occurrences in the assigned menu.
 *
 * @return array<string,int> Route occurrence counts keyed by path.
 */
function arcsecs_count_required_primary_menu_routes() {
    $counts    = array();
    $locations = get_theme_mod( 'nav_menu_locations', array() );
    $menu_id   = isset( $locations['primary'] ) ? (int) $locations['primary'] : 0;

    foreach ( arcsecs_required_primary_menu_links() as $required_link ) {
        $counts[ $required_link['path'] ] = 0;
    }

    if ( $menu_id <= 0 ) {
        return $counts;
    }

    $items = wp_get_nav_menu_items( $menu_id );

    if ( empty( $items ) || is_wp_error( $items ) ) {
        return $counts;
    }

    foreach ( $items as $item ) {
        $item_path = arcsecs_normalize_nav_path( isset( $item->url ) ? $item->url : '' );

        foreach ( arcsecs_required_primary_menu_links() as $required_link ) {
            if ( arcsecs_normalize_nav_path( $required_link['path'] ) === $item_path ) {
                $counts[ $required_link['path'] ]++;
            }
        }
    }

    return $counts;
}

/**
 * Return the assigned primary-menu ID, creating the standard menu when needed.
 *
 * @return int Menu term ID, or 0 when WordPress could not create/read one.
 */
function arcsecs_get_assigned_primary_menu_id() {
    $locations = get_theme_mod( 'nav_menu_locations', array() );

    if ( ! empty( $locations['primary'] ) ) {
        return (int) $locations['primary'];
    }

    arcsecs_ensure_menu_assignment();
    $locations = get_theme_mod( 'nav_menu_locations', array() );

    return ! empty( $locations['primary'] ) ? (int) $locations['primary'] : 0;
}

/**
 * Return true when a menu item looks like a stale Dark Matter Drive link.
 *
 * @param object $item WordPress menu item object.
 * @return bool Whether this is a stale/wrong drive simulator item.
 */
function arcsecs_is_stale_dark_matter_drive_menu_item( $item ) {
    $title = isset( $item->title ) ? strtolower( (string) $item->title ) : '';
    $url   = isset( $item->url ) ? strtolower( (string) $item->url ) : '';
    $path  = arcsecs_normalize_nav_path( $url );

    if ( ARCSECS_DARK_MATTER_DRIVE_SIMULATOR_PATH === $path ) {
        return false;
    }

    $looks_like_drive_title = false !== strpos( $title, 'dark matter drive' ) || false !== strpos( $title, 'dm drive' ) || false !== strpos( $title, 'drive simulator' );
    $looks_like_drive_url   = false !== strpos( $url, 'dark-matter-drive' ) || false !== strpos( $url, 'dark-matter-dive' ) || false !== strpos( $url, 'drive-simulator' );

    return $looks_like_drive_title || $looks_like_drive_url;
}

/**
 * Return a detailed audit of the assigned Primary Menu route links.
 *
 * @return array<int,array<string,string|int>> Audit rows.
 */
function arcsecs_get_primary_menu_route_audit() {
    $menu_id = arcsecs_get_assigned_primary_menu_id();
    $items   = $menu_id > 0 ? wp_get_nav_menu_items( $menu_id ) : array();
    $rows    = array();

    if ( empty( $items ) || is_wp_error( $items ) ) {
        foreach ( arcsecs_required_primary_menu_links() as $required_link ) {
            $rows[] = array(
                'label' => $required_link['label'],
                'path'  => '/' . $required_link['path'],
                'count' => 0,
                'note'  => 'Assigned menu has no readable items; render-time fallback will append this route.',
            );
        }

        return $rows;
    }

    foreach ( arcsecs_required_primary_menu_links() as $required_link ) {
        $count          = 0;
        $label_mismatch = 0;
        $required_path  = arcsecs_normalize_nav_path( $required_link['path'] );

        foreach ( $items as $item ) {
            $item_path = arcsecs_normalize_nav_path( isset( $item->url ) ? $item->url : '' );

            if ( $required_path !== $item_path ) {
                continue;
            }

            $count++;

            if ( isset( $item->title ) && wp_strip_all_tags( (string) $item->title ) !== wp_strip_all_tags( (string) $required_link['label'] ) ) {
                $label_mismatch++;
            }
        }

        if ( 0 === $count ) {
            $note = 'Missing from assigned menu; theme appends it at render time.';
        } elseif ( 1 === $count && 0 === $label_mismatch ) {
            $note = 'Good.';
        } elseif ( $count > 1 ) {
            $note = 'Duplicate assigned menu items detected; repair can remove extras.';
        } else {
            $note = 'Label can be compacted by repair.';
        }

        $rows[] = array(
            'label' => $required_link['label'],
            'path'  => '/' . $required_link['path'],
            'count' => $count,
            'note'  => $note,
        );
    }

    $stale_count = 0;

    foreach ( $items as $item ) {
        if ( arcsecs_is_stale_dark_matter_drive_menu_item( $item ) ) {
            $stale_count++;
        }
    }

    $rows[] = array(
        'label' => 'Stale DM Drive slugs',
        'path'  => '/dark-matter-drive/, /dark-matter-drive-demo/, /dark-matter-dive/',
        'count' => $stale_count,
        'note'  => 0 === $stale_count ? 'Good.' : 'Repair can retarget the first stale item and remove extras.',
    );

    return $rows;
}

/**
 * Repair the assigned Primary Menu route links without touching simulator internals.
 *
 * This creates missing required public links, compacts labels, retargets obvious
 * stale Dark Matter Drive items, and removes duplicate required-route menu items.
 *
 * @return array<string,int> Counts of changes made.
 */
function arcsecs_repair_primary_menu_route_links() {
    $menu_id = arcsecs_get_assigned_primary_menu_id();
    $changes = array(
        'added'     => 0,
        'updated'   => 0,
        'deduped'   => 0,
        'retargeted' => 0,
    );

    if ( $menu_id <= 0 ) {
        return $changes;
    }

    $items = wp_get_nav_menu_items( $menu_id );

    if ( empty( $items ) || is_wp_error( $items ) ) {
        $items = array();
    }

    $items_by_path = array();

    foreach ( $items as $item ) {
        $item_path = arcsecs_normalize_nav_path( isset( $item->url ) ? $item->url : '' );

        if ( ! isset( $items_by_path[ $item_path ] ) ) {
            $items_by_path[ $item_path ] = array();
        }

        $items_by_path[ $item_path ][] = $item;
    }

    $stale_drive_items = array();

    foreach ( $items as $item ) {
        if ( arcsecs_is_stale_dark_matter_drive_menu_item( $item ) ) {
            $stale_drive_items[] = $item;
        }
    }

    if ( ! empty( $stale_drive_items ) && empty( $items_by_path[ ARCSECS_DARK_MATTER_DRIVE_SIMULATOR_PATH ] ) ) {
        $first_stale_item = array_shift( $stale_drive_items );
        wp_update_nav_menu_item(
            $menu_id,
            (int) $first_stale_item->ID,
            array(
                'menu-item-title'  => __( 'DM Drive', 'arcsecs' ),
                'menu-item-url'    => arcsecs_dark_matter_drive_simulator_url(),
                'menu-item-status' => 'publish',
            )
        );
        $changes['retargeted']++;
    }

    foreach ( $stale_drive_items as $stale_drive_item ) {
        wp_delete_post( (int) $stale_drive_item->ID, true );
        $changes['deduped']++;
    }

    $items = wp_get_nav_menu_items( $menu_id );

    if ( empty( $items ) || is_wp_error( $items ) ) {
        $items = array();
    }

    foreach ( arcsecs_required_primary_menu_links() as $required_link ) {
        $required_path = arcsecs_normalize_nav_path( $required_link['path'] );
        $matches       = array();

        foreach ( $items as $item ) {
            $item_path = arcsecs_normalize_nav_path( isset( $item->url ) ? $item->url : '' );

            if ( $required_path === $item_path ) {
                $matches[] = $item;
            }
        }

        if ( empty( $matches ) ) {
            wp_update_nav_menu_item(
                $menu_id,
                0,
                array(
                    'menu-item-title'  => $required_link['label'],
                    'menu-item-url'    => arcsecs_ai_access_url( $required_link['path'] ),
                    'menu-item-status' => 'publish',
                )
            );
            $changes['added']++;
            continue;
        }

        $first_match   = array_shift( $matches );
        $current_title = isset( $first_match->title ) ? wp_strip_all_tags( (string) $first_match->title ) : '';

        if ( $current_title !== wp_strip_all_tags( (string) $required_link['label'] ) ) {
            wp_update_nav_menu_item(
                $menu_id,
                (int) $first_match->ID,
                array(
                    'menu-item-title'  => $required_link['label'],
                    'menu-item-url'    => arcsecs_ai_access_url( $required_link['path'] ),
                    'menu-item-status' => 'publish',
                )
            );
            $changes['updated']++;
        }

        foreach ( $matches as $duplicate_item ) {
            wp_delete_post( (int) $duplicate_item->ID, true );
            $changes['deduped']++;
        }
    }

    return $changes;
}

function arcsecs_repair_page() {
    if (!current_user_can('manage_options')) {
        return;
    }
    $home_id = (int) get_option('page_on_front');
    $blog_id = (int) get_option('page_for_posts');
    ?>
    <div class="wrap">
        <h1><?php esc_html_e('ArcSecs Repair', 'arcsecs'); ?></h1>
        <?php if (isset($_GET['arcsecs-repaired'])) : ?>
            <div class="notice notice-success inline"><p><?php esc_html_e('Repaired. Home and Blog are published and assigned. No posts were created or overwritten.', 'arcsecs'); ?></p></div>
        <?php endif; ?>
        <p><?php esc_html_e('Use this if the front page shows a plain Home page or /blog/ is missing. This only fixes site structure and menus; it does not seed demo posts.', 'arcsecs'); ?></p>
        <form method="post" action="<?php echo esc_url(admin_url('admin-post.php')); ?>">
            <?php wp_nonce_field('arcsecs_repair_site', 'arcsecs_repair_nonce'); ?>
            <input type="hidden" name="action" value="arcsecs_repair_site">
            <?php submit_button(__('Repair Home and Blog', 'arcsecs'), 'primary large'); ?>
        </form>
        <h2><?php esc_html_e('Current status', 'arcsecs'); ?></h2>
        <ul>
            <li><?php echo esc_html__('Homepage ID:', 'arcsecs') . ' ' . esc_html($home_id ?: 'not set'); ?></li>
            <li><?php echo esc_html__('Posts page ID:', 'arcsecs') . ' ' . esc_html($blog_id ?: 'not set'); ?></li>
            <li><?php echo esc_html__('Blog URL:', 'arcsecs') . ' '; ?><a href="<?php echo esc_url(home_url('/blog/')); ?>" target="_blank" rel="noopener"><?php echo esc_html(home_url('/blog/')); ?></a></li>
        </ul>

        <?php $route_health_live_check = isset($_GET['arcsecs-route-health']) && '1' === sanitize_text_field(wp_unslash($_GET['arcsecs-route-health'])); ?>
        <h2><?php esc_html_e('ArcSecs Route Health Dashboard', 'arcsecs'); ?></h2>
        <p><?php esc_html_e('Run this after installing theme and plugin updates. It checks theme-owned virtual routes, plugin-owned simulator discovery, top-nav presence, sitemap membership, llms.txt membership, and marker text.', 'arcsecs'); ?></p>
        <p><a class="button button-primary" href="<?php echo esc_url(admin_url('themes.php?page=arcsecs-repair&arcsecs-route-health=1')); ?>"><?php esc_html_e('Run Route Health Check', 'arcsecs'); ?></a></p>
        <table class="widefat striped arcsecs-route-health-dashboard" style="max-width: 1280px;">
            <thead>
                <tr>
                    <th><?php esc_html_e('Route', 'arcsecs'); ?></th>
                    <th><?php esc_html_e('Owner', 'arcsecs'); ?></th>
                    <th><?php esc_html_e('HTTP', 'arcsecs'); ?></th>
                    <th><?php esc_html_e('Title / marker', 'arcsecs'); ?></th>
                    <th><?php esc_html_e('Top nav', 'arcsecs'); ?></th>
                    <th><?php esc_html_e('Sitemap', 'arcsecs'); ?></th>
                    <th><?php esc_html_e('llms.txt', 'arcsecs'); ?></th>
                    <th><?php esc_html_e('Fix suggestion', 'arcsecs'); ?></th>
                </tr>
            </thead>
            <tbody>
                <?php foreach (arcsecs_get_route_health_rows($route_health_live_check) as $health_row) : ?>
                    <tr>
                        <td><strong><?php echo esc_html($health_row['label']); ?></strong><br><a href="<?php echo esc_url(home_url($health_row['path'])); ?>" target="_blank" rel="noopener noreferrer"><code><?php echo esc_html($health_row['path']); ?></code></a></td>
                        <td><?php echo esc_html($health_row['owner']); ?></td>
                        <td><strong><?php echo esc_html($health_row['http_status']); ?></strong></td>
                        <td><?php echo esc_html($health_row['title']); ?><br><small><?php echo esc_html($health_row['marker']); ?></small></td>
                        <td><?php echo esc_html($health_row['nav']); ?></td>
                        <td><?php echo esc_html($health_row['sitemap']); ?></td>
                        <td><?php echo esc_html($health_row['llms']); ?></td>
                        <td><?php echo esc_html($health_row['fix']); ?></td>
                    </tr>
                <?php endforeach; ?>
            </tbody>
        </table>

        <h2><?php esc_html_e('Route and navigation diagnostics', 'arcsecs'); ?></h2>
        <p><?php esc_html_e('Use this checklist after installing theme/plugin updates. The Dark Matter Drive simulator is plugin-owned; the theme only links to it.', 'arcsecs'); ?></p>
        <table class="widefat striped" style="max-width: 1100px;">
            <thead>
                <tr>
                    <th><?php esc_html_e('Label', 'arcsecs'); ?></th>
                    <th><?php esc_html_e('URL', 'arcsecs'); ?></th>
                    <th><?php esc_html_e('Owner', 'arcsecs'); ?></th>
                    <th><?php esc_html_e('Status', 'arcsecs'); ?></th>
                    <th><?php esc_html_e('Notes', 'arcsecs'); ?></th>
                </tr>
            </thead>
            <tbody>
                <?php foreach (arcsecs_get_route_diagnostics() as $diagnostic) : ?>
                    <tr>
                        <td><strong><?php echo esc_html($diagnostic['label']); ?></strong></td>
                        <td><a href="<?php echo esc_url(home_url($diagnostic['path'])); ?>" target="_blank" rel="noopener noreferrer"><?php echo esc_html($diagnostic['path']); ?></a></td>
                        <td><?php echo esc_html($diagnostic['owner']); ?></td>
                        <td><?php echo esc_html(arcsecs_get_route_diagnostic_status($diagnostic['path'])); ?></td>
                        <td><?php echo esc_html($diagnostic['note']); ?></td>
                    </tr>
                <?php endforeach; ?>
            </tbody>
        </table>

        <h2><?php esc_html_e('Assigned Primary Menu duplicate check', 'arcsecs'); ?></h2>
        <p><?php esc_html_e('Zero means the theme will append the link at render time. One is ideal in a custom menu. More than one should be cleaned up in Appearance > Menus.', 'arcsecs'); ?></p>
        <ul>
            <?php foreach (arcsecs_count_required_primary_menu_routes() as $route => $count) : ?>
                <li><code><?php echo esc_html('/' . $route); ?></code>: <?php echo esc_html((string) $count); ?></li>
            <?php endforeach; ?>
        </ul>

        <?php if (isset($_GET['arcsecs-menu-repaired'])) : ?>
            <div class="notice notice-success inline"><p><?php esc_html_e('Primary Menu route links repaired. Compact labels were applied and duplicate known route links were removed where safe.', 'arcsecs'); ?></p></div>
        <?php endif; ?>

        <h2><?php esc_html_e('Primary Menu route audit and repair', 'arcsecs'); ?></h2>
        <p><?php esc_html_e('Use this when the header gets crowded, uses stale labels, or contains an old Dark Matter Drive slug. This does not create simulator pages or touch plugin code.', 'arcsecs'); ?></p>
        <table class="widefat striped" style="max-width: 1100px;">
            <thead>
                <tr>
                    <th><?php esc_html_e('Expected label', 'arcsecs'); ?></th>
                    <th><?php esc_html_e('Expected route', 'arcsecs'); ?></th>
                    <th><?php esc_html_e('Assigned menu count', 'arcsecs'); ?></th>
                    <th><?php esc_html_e('Audit note', 'arcsecs'); ?></th>
                </tr>
            </thead>
            <tbody>
                <?php foreach (arcsecs_get_primary_menu_route_audit() as $audit_row) : ?>
                    <tr>
                        <td><strong><?php echo esc_html($audit_row['label']); ?></strong></td>
                        <td><code><?php echo esc_html($audit_row['path']); ?></code></td>
                        <td><?php echo esc_html((string) $audit_row['count']); ?></td>
                        <td><?php echo esc_html($audit_row['note']); ?></td>
                    </tr>
                <?php endforeach; ?>
            </tbody>
        </table>
        <form method="post" action="<?php echo esc_url(admin_url('admin-post.php')); ?>" style="margin-top: 1rem;">
            <?php wp_nonce_field('arcsecs_repair_primary_menu_routes', 'arcsecs_repair_primary_menu_routes_nonce'); ?>
            <input type="hidden" name="action" value="arcsecs_repair_primary_menu_routes">
            <?php submit_button(__('Repair Primary Menu Route Links', 'arcsecs'), 'secondary large'); ?>
        </form>

        <h2><?php esc_html_e('If DM Drive returns 404', 'arcsecs'); ?></h2>
        <ol>
            <li><?php esc_html_e('Confirm the ArcSecs plugin version with the simulator page is active.', 'arcsecs'); ?></li>
            <li><?php esc_html_e('Run the plugin repair/activation routine if the plugin provides one.', 'arcsecs'); ?></li>
            <li><?php esc_html_e('Visit Settings > Permalinks and click Save Changes.', 'arcsecs'); ?></li>
            <li><?php esc_html_e('Confirm the WordPress page slug is dark-matter-drive-simulator.', 'arcsecs'); ?></li>
            <li><?php esc_html_e('Do not create a replacement simulator page inside the theme.', 'arcsecs'); ?></li>
        </ol>
    </div>
    <?php
}

function arcsecs_handle_repair_site() {
    if (!current_user_can('manage_options')) {
        wp_die(esc_html__('You do not have permission to repair this site.', 'arcsecs'));
    }
    check_admin_referer('arcsecs_repair_site', 'arcsecs_repair_nonce');
    arcsecs_repair_site_structure();
    flush_rewrite_rules(false);
    wp_safe_redirect(admin_url('themes.php?page=arcsecs-repair&arcsecs-repaired=1'));
    exit;
}
add_action('admin_post_arcsecs_repair_site', 'arcsecs_handle_repair_site');

/**
 * Handle the explicit Primary Menu route-link repair action.
 *
 * @return void
 */
function arcsecs_handle_repair_primary_menu_routes() {
    if (!current_user_can('manage_options')) {
        wp_die(esc_html__('You do not have permission to repair this menu.', 'arcsecs'));
    }

    check_admin_referer('arcsecs_repair_primary_menu_routes', 'arcsecs_repair_primary_menu_routes_nonce');
    arcsecs_repair_primary_menu_route_links();
    wp_safe_redirect(admin_url('themes.php?page=arcsecs-repair&arcsecs-menu-repaired=1'));
    exit;
}
add_action('admin_post_arcsecs_repair_primary_menu_routes', 'arcsecs_handle_repair_primary_menu_routes');
