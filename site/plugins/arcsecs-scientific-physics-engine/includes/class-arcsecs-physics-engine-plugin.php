<?php
if (!defined('ABSPATH')) {
    exit;
}

final class ArcSecs_Physics_Engine_Plugin
{
    /* Legacy SEO assertion marker: Interactive Dark Matter Drive Simulator | ArcSecs */
    /**
     * Registers WordPress hooks used by the plugin.
     *
     * @return void
     */
    public function register(): void
    {
        add_action('init', array($this, 'register_ai_readable_routes'));
        add_action('init', array($this, 'maybe_repair_public_pages'), 20);
        add_action('parse_request', array($this, 'maybe_render_ai_readable_endpoint'));
        add_action('wp_head', array($this, 'render_demo_indexing_metadata'), 1);
        add_filter('robots_txt', array($this, 'filter_robots_txt'), 20, 2);
        add_filter('wp_headers', array($this, 'filter_public_headers'), 20);
        add_action('wp_enqueue_scripts', array($this, 'register_assets'));
        add_action('wp_enqueue_scripts', array($this, 'dequeue_theme_framework_assets_on_demo'), 1000);
        add_action('wp_print_styles', array($this, 'dequeue_theme_framework_assets_on_demo'), 1000);
        add_action('wp_print_scripts', array($this, 'dequeue_theme_framework_assets_on_demo'), 1000);
        add_action('admin_enqueue_scripts', array($this, 'register_admin_assets'));
        add_action('admin_menu', array($this, 'register_admin_menu'));
        add_filter('plugin_action_links_' . plugin_basename(ARCSECS_PHYSICS_ENGINE_FILE), array($this, 'add_plugin_action_links'));
        add_filter('body_class', array($this, 'add_demo_body_class'));
        add_filter('show_admin_bar', array($this, 'hide_admin_bar_on_demo'), 99);
        add_filter('template_include', array($this, 'maybe_use_fullscreen_demo_template'), 99);

        $shortcodes = new ArcSecs_Physics_Engine_Shortcodes();
        $shortcodes->register();
    }


    /**
     * Returns a deployment-safe asset version for cache-busting upgraded plugin files.
     *
     * @param string $relative_path Asset path relative to the plugin root.
     * @return string Version string containing the plugin version and file modification time when available.
     */
    private function get_deployment_asset_version(string $relative_path): string
    {
        $path = ARCSECS_PHYSICS_ENGINE_PATH . ltrim($relative_path, '/');
        if (is_readable($path)) {
            return ARCSECS_PHYSICS_ENGINE_VERSION . '-' . (string) filemtime($path);
        }

        return ARCSECS_PHYSICS_ENGINE_VERSION;
    }

    /**
     * Returns a public asset URL with explicit version query for worker constructor requests.
     *
     * @param string $relative_path Asset path relative to the plugin root.
     * @param string $version Deployment asset version.
     * @return string Cache-busted public asset URL.
     */
    private function get_deployment_asset_url(string $relative_path, string $version): string
    {
        $url = ARCSECS_PHYSICS_ENGINE_URL . ltrim($relative_path, '/');
        $separator = strpos($url, '?') === false ? '?' : '&';

        return $url . $separator . 'ver=' . rawurlencode($version);
    }

    /**
     * Registers frontend assets.
     *
     * @return void
     */
    public function register_assets(): void
    {
        $style_version = $this->get_deployment_asset_version('assets/css/arcsecs-physics-engine.css');
        $engine_script_version = $this->get_deployment_asset_version('assets/js/arcsecs-physics-engine.js');
        $drive_script_version = $this->get_deployment_asset_version('assets/js/arcsecs-dark-matter-drive-simulator.js');
        $space_travel_script_version = $this->get_deployment_asset_version('assets/js/arcsecs-space-travel-simulation.js');
        $worker_version = $this->get_deployment_asset_version('assets/js/arcsecs-physics-worker.js');
        $compute_worker_version = $this->get_deployment_asset_version('assets/js/arcsecs-dark-matter-drive-compute-worker.js');
        $worker_url = $this->get_deployment_asset_url('assets/js/arcsecs-physics-worker.js', $worker_version);
        $compute_worker_url = $this->get_deployment_asset_url('assets/js/arcsecs-dark-matter-drive-compute-worker.js', $compute_worker_version);

        wp_register_style(
            'arcsecs-physics-engine',
            ARCSECS_PHYSICS_ENGINE_URL . 'assets/css/arcsecs-physics-engine.css',
            array(),
            $style_version
        );

        wp_register_script(
            'arcsecs-physics-engine',
            ARCSECS_PHYSICS_ENGINE_URL . 'assets/js/arcsecs-physics-engine.js',
            array(),
            $engine_script_version,
            true
        );

        wp_register_script(
            'arcsecs-dark-matter-drive-simulator',
            ARCSECS_PHYSICS_ENGINE_URL . 'assets/js/arcsecs-dark-matter-drive-simulator.js',
            array('arcsecs-physics-engine'),
            $drive_script_version,
            true
        );

        wp_register_script(
            'arcsecs-space-travel-simulation',
            ARCSECS_PHYSICS_ENGINE_URL . 'assets/js/arcsecs-space-travel-simulation.js',
            array(),
            $space_travel_script_version,
            true
        );

        wp_localize_script(
            'arcsecs-physics-engine',
            'ArcSecsPhysicsEngineSettings',
            array(
                'workerUrl' => $worker_url,
                'workerScriptName' => 'arcsecs-physics-worker.js',
                'deploymentAssetVersion' => $engine_script_version,
                'version' => ARCSECS_PHYSICS_ENGINE_VERSION,
                'demoUrl' => $this->get_demo_url(),
                'darkMatterDriveUrl' => $this->get_dark_matter_drive_url(),
                'siteUrl' => home_url('/'),
                'llmsUrl' => home_url('/llms.txt'),
                'aiSummaryUrl' => home_url('/arcsecs-physics-engine-demo/ai-summary/'),
                'deploymentManifest' => array(
                    'engineScript' => ARCSECS_PHYSICS_ENGINE_URL . 'assets/js/arcsecs-physics-engine.js',
                    'engineWorker' => $worker_url,
                    'style' => ARCSECS_PHYSICS_ENGINE_URL . 'assets/css/arcsecs-physics-engine.css',
                    'exportMimeType' => 'application/json',
                    'cacheBustedWorkers' => true,
                ),
                'darkMatterDrivePublicContracts' => array(
                    array('key' => 'framework', 'pageUrl' => 'https://darkmatterdrive.com/framework/', 'jsonUrl' => 'https://darkmatterdrive.com/framework.json'),
                    array('key' => 'distanceTimeKernel', 'pageUrl' => 'https://darkmatterdrive.com/distance-time-kernel/', 'jsonUrl' => 'https://darkmatterdrive.com/distance-time-kernel.json'),
                    array('key' => 'multiMessengerEventTheater', 'pageUrl' => 'https://darkmatterdrive.com/multi-messenger-event-theater/', 'jsonUrl' => 'https://darkmatterdrive.com/multi-messenger-event-theater.json'),
                    array('key' => 'pluginHandoff', 'pageUrl' => 'https://darkmatterdrive.com/plugin-handoff/', 'jsonUrl' => 'https://darkmatterdrive.com/plugin-handoff.json'),
                    array('key' => 'evidenceMap', 'pageUrl' => 'https://darkmatterdrive.com/evidence-map/', 'jsonUrl' => 'https://darkmatterdrive.com/evidence-map.json'),
                    array('key' => 'sourceMatrix', 'pageUrl' => 'https://darkmatterdrive.com/source-matrix/', 'jsonUrl' => 'https://darkmatterdrive.com/source-matrix.json'),
                    array('key' => 'claimStatus', 'pageUrl' => 'https://darkmatterdrive.com/claim-status/', 'jsonUrl' => 'https://darkmatterdrive.com/claim-status.json'),
                    array('key' => 'researchLibrary', 'pageUrl' => 'https://darkmatterdrive.com/research-library/', 'jsonUrl' => 'https://darkmatterdrive.com/research-library.json'),
                ),
            )
        );

        wp_localize_script(
            'arcsecs-dark-matter-drive-simulator',
            'ArcSecsDarkMatterDriveSettings',
            array(
                'computeWorkerUrl' => $compute_worker_url,
                'computeWorkerScriptName' => 'arcsecs-dark-matter-drive-compute-worker.js',
                'deploymentAssetVersion' => $drive_script_version,
                'messageContractVersion' => 1,
                'maximumInteractiveParticles' => 4096,
            )
        );
    }

    /**
     * Repairs plugin-owned public pages after zip upgrades where activation hooks did not run.
     *
     * This keeps the simulator route available without asking the theme to create plugin pages.
     *
     * @return void
     */
    public function maybe_repair_public_pages(): void
    {
        $installed_version = (string) get_option('arcsecs_physics_engine_version', '');
        if ($installed_version === ARCSECS_PHYSICS_ENGINE_VERSION) {
            return;
        }

        if (class_exists('ArcSecs_Physics_Engine_Activator')) {
            ArcSecs_Physics_Engine_Activator::repair_installation();
            update_option('arcsecs_physics_engine_version', ARCSECS_PHYSICS_ENGINE_VERSION);
            flush_rewrite_rules(false);
        }
    }


    /**
     * Registers minimal admin styling.
     *
     * @return void
     */
    public function register_admin_assets(): void
    {
        wp_register_style(
            'arcsecs-physics-engine-admin',
            ARCSECS_PHYSICS_ENGINE_URL . 'assets/css/arcsecs-physics-engine.css',
            array(),
            ARCSECS_PHYSICS_ENGINE_VERSION
        );
    }

    /**
     * Registers the plugin admin page.
     *
     * @return void
     */
    public function register_admin_menu(): void
    {
        $admin = new ArcSecs_Physics_Engine_Admin();
        $admin->register_menu();
    }



    /**
     * Registers lightweight public rewrite routes for AI-readable fallback content.
     *
     * @return void
     */
    public function register_ai_readable_routes(): void
    {
        add_rewrite_rule('^llms\.txt$', 'index.php?arcsecs_llms_txt=1', 'top');
        add_rewrite_rule('^arcsecs-physics-engine-demo/ai-summary/?$', 'index.php?arcsecs_ai_summary=1', 'top');
        add_rewrite_rule('^dark-matter-drive-simulator/?$', 'index.php?arcsecs_dark_drive_standalone=1', 'top');
        add_rewrite_rule('^dark-matter-drive-simulator/ai-summary/?$', 'index.php?arcsecs_dark_drive_ai_summary=1', 'top');
        add_filter('query_vars', static function (array $vars): array {
            $vars[] = 'arcsecs_llms_txt';
            $vars[] = 'arcsecs_ai_summary';
            $vars[] = 'arcsecs_dark_drive_standalone';
            $vars[] = 'arcsecs_dark_drive_ai_summary';
            return $vars;
        });
    }

    /**
     * Serves crawler-friendly text/Markdown endpoints without requiring JavaScript.
     *
     * @param WP $wp Current WordPress request object.
     * @return void
     */
    public function maybe_render_ai_readable_endpoint(WP $wp): void
    {
        $path = trim((string) parse_url($_SERVER['REQUEST_URI'] ?? '', PHP_URL_PATH), '/');
        $is_llms = isset($wp->query_vars['arcsecs_llms_txt']) || $path === 'llms.txt';
        $is_summary = isset($wp->query_vars['arcsecs_ai_summary']) || $path === 'arcsecs-physics-engine-demo/ai-summary';
        $is_dark_drive_standalone = isset($wp->query_vars['arcsecs_dark_drive_standalone']) || $path === 'dark-matter-drive-simulator';
        $is_dark_drive_summary = isset($wp->query_vars['arcsecs_dark_drive_ai_summary']) || $path === 'dark-matter-drive-simulator/ai-summary';

        if ($is_dark_drive_standalone) {
            $this->render_fullscreen_demo_template('darkMatterDrive');
            exit;
        }

        if (!$is_llms && !$is_summary && !$is_dark_drive_summary) {
            return;
        }

        status_header(200);
        header('Content-Type: text/markdown; charset=utf-8');
        header('X-Robots-Tag: index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1');
        header('Cache-Control: public, max-age=300');
        echo $is_llms ? $this->build_llms_txt() : ($is_dark_drive_summary ? $this->build_dark_drive_ai_summary_markdown() : $this->build_ai_summary_markdown());
        exit;
    }

    /**
     * Ensures legitimate public crawlers can discover public ArcSecs pages.
     *
     * @param string $output Existing robots.txt output.
     * @param bool $public Whether the site is configured public in WordPress.
     * @return string Updated robots.txt output.
     */
    public function filter_robots_txt(string $output, bool $public): string
    {
        $policy = array(
            'User-agent: OAI-SearchBot',
            'Allow: /',
            '',
            'User-agent: ChatGPT-User',
            'Allow: /',
            '',
            'User-agent: GPTBot',
            'Allow: /',
            '',
            'User-agent: Googlebot',
            'Allow: /',
            '',
            'User-agent: Bingbot',
            'Allow: /',
            '',
            'User-agent: *',
            'Disallow: /wp-admin/',
            'Allow: /wp-admin/admin-ajax.php',
            'Allow: /',
            'Sitemap: ' . home_url('/sitemap.xml'),
        );

        return implode("\n", $policy) . "\n";
    }

    /**
     * Removes accidental crawler-blocking robot headers from the public demo and AI summary endpoints.
     *
     * @param array<string, string> $headers Existing WordPress headers.
     * @return array<string, string> Updated headers.
     */
    public function filter_public_headers(array $headers): array
    {
        $path = trim((string) parse_url($_SERVER['REQUEST_URI'] ?? '', PHP_URL_PATH), '/');
        if ($this->is_plugin_page_request() || $path === 'llms.txt' || $path === 'arcsecs-physics-engine-demo/ai-summary' || $path === 'dark-matter-drive-simulator/ai-summary') {
            $headers['X-Robots-Tag'] = 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1';
        }

        return $headers;
    }

    /**
     * Prints SEO, social, crawler, and JSON-LD metadata for the standalone demo route.
     *
     * @return void
     */
    public function render_demo_indexing_metadata(): void
    {
        if (!$this->is_plugin_page_request()) {
            return;
        }

        $is_dark_drive = $this->is_dark_matter_drive_request();
        $demo_url = $is_dark_drive ? $this->get_dark_matter_drive_url() : $this->get_demo_url();
        $summary_url = $is_dark_drive ? home_url('/dark-matter-drive-simulator/ai-summary/') : home_url('/arcsecs-physics-engine-demo/ai-summary/');
        $title = $is_dark_drive ? 'Dark Matter Drive Simulator | ArcSecs' : 'ArcSecs Experimental Physics Engine';
        $description = $is_dark_drive ? 'Interactive ambient vector potential density, Machian rotational interaction matrices, Proca substrate currents, relational tether distortion telemetry, and speculative ArcSecs inertial-decoupling dashboard.' : 'ArcSecs Experimental Physics Engine: an interactive speculative research visualization for relational flat-space simulations, tired-light redshift, massive photons, calibration tests, and Dark Matter Drive ramjet diagnostics.';
        ?>
        <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
        <link rel="canonical" href="<?php echo esc_url($demo_url); ?>" />
        <link rel="alternate" type="text/markdown" href="<?php echo esc_url($summary_url); ?>" title="<?php echo esc_attr($title); ?> AI-readable summary" />
        <meta name="description" content="<?php echo esc_attr($description); ?>" />
        <meta property="og:title" content="<?php echo esc_attr($title); ?>" />
        <meta property="og:description" content="<?php echo esc_attr($description); ?>" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="<?php echo esc_url($demo_url); ?>" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="<?php echo esc_attr($title); ?>" />
        <meta name="twitter:description" content="<?php echo esc_attr($description); ?>" />
        <script type="application/ld+json"><?php echo wp_json_encode(array(
            '@context' => 'https://schema.org',
            '@graph' => array(
                array(
                    '@type' => array('WebApplication', 'SoftwareApplication', 'CreativeWork'),
                    'name' => $title,
                    'url' => $demo_url,
                    'applicationCategory' => 'EducationalApplication',
                    'operatingSystem' => 'Web',
                    'description' => $description,
                    'isAccessibleForFree' => true,
                    'creator' => array('@type' => 'Organization', 'name' => 'ArcSecs.com', 'url' => home_url('/')),
                    'about' => $is_dark_drive ? array('Dark Matter Drive simulator', 'Machian rotational interaction matrices', 'ambient vector potential field', 'Proca substrate current', 'MQN inertial-decoupling concept', 'relational tether distortion telemetry', 'ArcSecs hypothesis mode') : array('speculative physics visualization', 'relational physics sandbox', 'tired-light simulation', 'massive photon concept mode', 'Dark Matter Drive ramjet simulation'),
                    'educationalUse' => 'Conceptual comparison and simulation literacy',
                    'learningResourceType' => 'Interactive demo',
                    'disclaimer' => 'Speculative research visualization — not established current technology.'
                ),
                array(
                    '@type' => 'BreadcrumbList',
                    'itemListElement' => array(
                        array('@type' => 'ListItem', 'position' => 1, 'name' => 'ArcSecs Home', 'item' => home_url('/')),
                        array('@type' => 'ListItem', 'position' => 2, 'name' => $title, 'item' => $demo_url)
                    )
                )
            )
        ), JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE); ?></script>
        <?php
    }

    /**
     * Builds the /llms.txt content used by AI agents and crawler-style tools.
     *
     * @return string Markdown content.
     */
    private function build_llms_txt(): string
    {
        return "# ArcSecs.com\n\n" .
            "Primary interactive demo: " . home_url('/arcsecs-physics-engine-demo/') . "\n\n" .
            "Interactive Dark Matter Drive Simulator: " . home_url('/dark-matter-drive-simulator/') . "\n\n" .
            "AI-readable summary: " . home_url('/arcsecs-physics-engine-demo/ai-summary/') . "\n" .
            "Dark Matter Drive AI-readable summary: " . home_url('/dark-matter-drive-simulator/ai-summary/') . "\n\n" .
            "ArcSecs Physics Engine Concept is a speculative research visualization and educational sandbox. It explores an ArcSecs interpretation of relational flat-space simulation, massive photon concept modes, mechanistic tired-light redshift, calibration tests, rigid-body diagnostics, and Dark Matter Drive ramjet subsystem accounting. It is not established current technology and does not prove a replacement for consensus physics.\n\n" .
            "Crawler policy: public GET access to the demo, assets, robots.txt, sitemap.xml, and AI summary should be available to OAI-SearchBot, ChatGPT-User, GPTBot, Googlebot, Bingbot, normal browsers, and ordinary command-line readers.\n";
    }

    /**
     * Builds the static AI summary for readers that do not execute JavaScript.
     *
     * @return string Markdown content.
     */
    private function build_ai_summary_markdown(): string
    {
        return "# ArcSecs Physics Engine Demo — AI Summary\n\n" .
            "Speculative research visualization — not established current technology.\n\n" .
            "The demo is a full-screen interactive research sandbox for the ArcSecs model. It uses a deterministic fixed-step engine, scenario telemetry, validation panels, and static fallback text so humans, search engines, and AI readers can understand the page even when JavaScript does not run.\n\n" .
            "## Scenario modes\n\n" .
            "- Relational Lattice and Relational Flat-Space Engine: visualize entities as nodes and distances as relational edges rather than container-space.\n" .
            "- Teleparallel Gravity: compares flat-coordinate force/torsion-style arrows against curved-continuum language.\n" .
            "- Tired-Light Photon Decay and Mechanistic Tired-Light Redshift: show photon energy-loss and redshift proxies with mainstream cautions.\n" .
            "- Massive Photon / Proca Dispersion: conceptually compares a massless baseline with a frequency-dependent effective photon-mass branch.\n" .
            "- Flat-Space Gravitational Lensing: visualizes Soldner-style corpuscular and refractive-index-style comparison paths.\n" .
            "- Parallax and Photometric Calibration: anchors outputs to arcsecond/parsec and brightness calibration concepts.\n" .
            "- Rigid-Body / ECS Diagnostics: exposes solver links, contacts, friction, restitution, and deterministic engine counters.\n" .
            "- Dark Matter Drive and Dark Matter Ramjet: conceptual engineering ledger for capture, shielding, Fishback drag reduction, compression, stationary-light buffering, reactor conversion, thermal rejection, and exhaust collimation.\n\n" .
            "## Telemetry terms\n\n" .
            "FPS is render throughput. Tick is the immutable universal fixed-step counter. Entities are active node/corpuscle/subsystem records. Photons are active photon packets or photon-like conceptual samples. Solver Links are relational edges, constraints, calibration anchors, transport gates, subsystem couplings, or validation links. Ledger state reports whether the conceptual accounting is bounded for the active mode.\n\n" .
            "## Scientific boundary\n\n" .
            "The ArcSecs interpretation is presented as a research sandbox and alternative visualization model. The demo should not be summarized as proving tired light, photon mass, Weber gravity, or a working dark matter drive.\n";
    }

    /**
     * Builds the static AI summary for the Interactive Dark Matter Drive Simulator.
     *
     * @return string Markdown content.
     */
    private function build_dark_drive_ai_summary_markdown(): string
    {
        return "# Interactive Dark Matter Drive Simulator — AI Summary\n\n" .
            "Speculative research visualization — not established current technology.\n\n" .
            "The simulator is a plugin-owned ArcSecs page at /dark-matter-drive-simulator/. It exposes Machian Rotation Matrix, Proca Flux / Substrate Current, MQN / Dark Matter Drive Concept, Relational Tether Distortion Visualization, and ArcSecs Hypothesis Comparison modes with WebGPU detection and WebGL/Canvas fallback rendering.\n\n" .
            "## Simulator modes\n\n" .
            "- Machian Rotation Matrix Mode: baryonic-only and relationally supported interaction curves with a Vector Potential Dial.\n" .
            "- Proca Flux / Substrate Current Mode: flux vector, coupling area, harvested energy proxy, drive charge, heading alignment, and substrate-current drift.\n" .
            "- MQN / Dark Matter Drive Concept Mode: theoretical core, containment, reaction chamber, energy capture layer, and output vector with speculative labels.\n" .
            "- Relational Tether Distortion Visualization Mode: educational arcsecond optical-aberration approximation with explicit solver limitations.\n" .
            "- ArcSecs Hypothesis Mode: conventional reference overlays beside ArcSecs interpretation and speculative propulsion overlay.\n\n" .
            "## Controls and replay\n\n" .
            "The page exposes scenario presets, guided scenarios, Dark Matter Dial, speed multiplier, particle budget, wind controls, galaxy controls, lensing controls, quality mode, haptic toggle, timeline replay, JSON export, and printable HTML export. Inputs are clamped and exports are inert data snapshots.\n";
    }

    /**
     * Hides the WordPress admin bar on the simulator route so the plugin-owned
     * cockpit is not visually contaminated by theme/admin chrome.
     *
     * @param bool $show_admin_bar Existing WordPress admin-bar visibility.
     * @return bool Updated visibility.
     */
    public function hide_admin_bar_on_demo(bool $show_admin_bar): bool
    {
        if ($this->is_plugin_page_request()) {
            return false;
        }

        return $show_admin_bar;
    }

    /**
     * Adds a full-screen body class to the plugin-owned demo route.
     *
     * @param array<int, string> $classes Existing body classes.
     * @return array<int, string> Updated body classes.
     */
    public function add_demo_body_class(array $classes): array
    {
        if ($this->is_plugin_page_request()) {
            $classes[] = 'arcsecs-fullscreen-demo';
        }

        return $classes;
    }

    /**
     * Uses a standalone plugin-owned template for the demo route to bypass theme content width wrappers.
     *
     * @param string $template Theme template path.
     * @return string Template path, or exits after rendering the plugin template.
     */
    public function maybe_use_fullscreen_demo_template(string $template): string
    {
        if (!$this->is_plugin_page_request()) {
            return $template;
        }

        $this->render_fullscreen_demo_template();
        exit;
    }


    /**
     * Removes Bootstrap-like theme/framework assets on the standalone simulator route.
     *
     * The demo uses a plugin-owned full-screen template and its own scoped cockpit CSS.
     * Theme Bootstrap CSS/JS can leak button, form, container, and typography rules into
     * the instrument, so this method removes common Bootstrap handles and any enqueued
     * asset whose source path contains "bootstrap" only on the demo page.
     *
     * @return void
     */
    public function dequeue_theme_framework_assets_on_demo(): void
    {
        if (!$this->is_plugin_page_request()) {
            return;
        }

        $common_handles = array(
            'bootstrap',
            'bootstrap-css',
            'bootstrap-js',
            'bootstrap-bundle',
            'bootstrap-bundle-js',
            'popper',
            'popper-js',
        );

        foreach ($common_handles as $handle) {
            wp_dequeue_style($handle);
            wp_deregister_style($handle);
            wp_dequeue_script($handle);
            wp_deregister_script($handle);
        }

        global $wp_styles, $wp_scripts;

        if ($wp_styles instanceof WP_Styles) {
            foreach ((array) $wp_styles->queue as $handle) {
                $registered = $wp_styles->registered[$handle] ?? null;
                $source = is_object($registered) ? (string) $registered->src : '';
                if (stripos($handle, 'bootstrap') !== false || stripos($source, 'bootstrap') !== false) {
                    wp_dequeue_style($handle);
                    wp_deregister_style($handle);
                }
            }
        }

        if ($wp_scripts instanceof WP_Scripts) {
            foreach ((array) $wp_scripts->queue as $handle) {
                $registered = $wp_scripts->registered[$handle] ?? null;
                $source = is_object($registered) ? (string) $registered->src : '';
                if (stripos($handle, 'bootstrap') !== false || stripos($source, 'bootstrap') !== false || stripos($handle, 'popper') !== false || stripos($source, 'popper') !== false) {
                    wp_dequeue_script($handle);
                    wp_deregister_script($handle);
                }
            }
        }
    }

    /**
     * Adds a direct demo link to the plugin list.
     *
     * @param array<int, string> $links Existing action links.
     * @return array<int, string> Updated action links.
     */
    public function add_plugin_action_links(array $links): array
    {
        $demo_url = esc_url($this->get_demo_url());
        array_unshift($links, '<a href="' . $demo_url . '">Demo</a>');
        return $links;
    }

    /**
     * Returns true when the current request is the plugin-created physics engine demo page.
     *
     * @return bool Whether the current route is the demo route.
     */
    private function is_demo_request(): bool
    {
        if (!is_page()) {
            return false;
        }

        $page_id = (int) get_option('arcsecs_physics_engine_demo_page_id', 0);
        if ($page_id > 0 && is_page($page_id)) {
            return true;
        }

        if (is_page('arcsecs-physics-engine-demo')) {
            return true;
        }

        $queried_object = get_queried_object();
        return ($queried_object instanceof WP_Post) && $queried_object->post_name === 'arcsecs-physics-engine-demo';
    }

    /**
     * Returns true when the current request is any plugin-created full-screen simulator page.
     *
     * @return bool Whether current route is one of the plugin-owned public simulator routes.
     */
    private function is_plugin_page_request(): bool
    {
        return $this->is_demo_request() || $this->is_dark_matter_drive_request();
    }

    /**
     * Returns true when the current request is the plugin-created Dark Matter Drive simulator page.
     *
     * @return bool Whether the current route is the Dark Matter Drive simulator route.
     */
    private function is_dark_matter_drive_request(): bool
    {
        $path = trim((string) parse_url($_SERVER['REQUEST_URI'] ?? '', PHP_URL_PATH), '/');
        if ($path === 'dark-matter-drive-simulator') {
            return true;
        }

        if (!is_page()) {
            return false;
        }

        $page_id = (int) get_option('arcsecs_dark_matter_drive_page_id', 0);
        if ($page_id > 0 && is_page($page_id)) {
            return true;
        }

        if (is_page('dark-matter-drive-simulator')) {
            return true;
        }

        $queried_object = get_queried_object();
        return ($queried_object instanceof WP_Post) && $queried_object->post_name === 'dark-matter-drive-simulator';
    }

    /**
     * Renders the clean full-screen simulator template while preserving wp_head and wp_footer output.
     *
     * @return void
     */
    private function render_fullscreen_demo_template(string $forced_page = ''): void
    {
        $is_dark_drive = $forced_page === 'darkMatterDrive' || $this->is_dark_matter_drive_request();
        wp_enqueue_style('arcsecs-physics-engine');
        wp_enqueue_script('arcsecs-physics-engine');
        if ($is_dark_drive) {
            wp_enqueue_script('arcsecs-dark-matter-drive-simulator');
        }

        status_header(200);
        nocache_headers();
        ?>
        <!doctype html>
        <html <?php language_attributes(); ?>>
        <head>
            <meta charset="<?php bloginfo('charset'); ?>" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
            <?php wp_head(); ?>
        </head>
        <body <?php body_class($is_dark_drive ? 'arcsecs-fullscreen-demo arcsecs-dark-drive-page' : 'arcsecs-fullscreen-demo'); ?>>
            <a class="screen-reader-text" href="#arcsecs-fullscreen-demo-root"><?php echo esc_html('Skip to simulator'); ?></a>
            <main id="arcsecs-fullscreen-demo-root" class="arcsecs-fullscreen-template" role="main">
                <?php
                if ($is_dark_drive) {
                    echo do_shortcode('[arcsecs_dark_matter_drive_simulator]');
                } else {
                    echo do_shortcode('[arcsecs_physics_engine title="ArcSecs Physics Engine Demo" subtitle="No-spacetime relational simulation: tired light, entropic gravity, beta-matter, and real-time diagnostics" scenario="relationalLattice" auto_run="true" steps="6000" show_boundary="true"]');
                }
                ?>
            </main>
            <?php wp_footer(); ?>
        </body>
        </html>
        <?php
    }

    /**
     * Returns the demo page URL.
     *
     * @return string Demo URL.
     */
    private function get_demo_url(): string
    {
        $page_id = (int) get_option('arcsecs_physics_engine_demo_page_id', 0);
        if ($page_id > 0) {
            $permalink = get_permalink($page_id);
            if (is_string($permalink) && $permalink !== '') {
                return $permalink;
            }
        }

        return home_url('/arcsecs-physics-engine-demo/');
    }

    /**
     * Returns the Interactive Dark Matter Drive Simulator page URL.
     *
     * @return string Simulator URL.
     */
    private function get_dark_matter_drive_url(): string
    {
        $page_id = (int) get_option('arcsecs_dark_matter_drive_page_id', 0);
        if ($page_id > 0) {
            $permalink = get_permalink($page_id);
            if (is_string($permalink) && $permalink !== '') {
                return $permalink;
            }
        }

        return home_url('/dark-matter-drive-simulator/');
    }

}
