<?php
if (!defined('ABSPATH')) {
    exit;
}

final class ArcSecs_Physics_Engine_Admin
{
    /**
     * Registers the admin options page.
     *
     * @return void
     */
    public function register_menu(): void
    {
        add_options_page(
            'ArcSecs Physics Engine',
            'ArcSecs Physics Engine',
            'manage_options',
            'arcsecs-physics-engine',
            array($this, 'render_settings_page')
        );
    }

    /**
     * Renders the admin page.
     *
     * @return void
     */
    public function render_settings_page(): void
    {
        if (!current_user_can('manage_options')) {
            return;
        }

        wp_enqueue_style('arcsecs-physics-engine-admin');

        if (isset($_POST['arcsecs_repair_installation'])) {
            check_admin_referer('arcsecs_physics_engine_repair');
            $page_id = ArcSecs_Physics_Engine_Activator::repair_installation();
            echo '<div class="notice notice-success"><p>Demo page and menu link repaired. Page ID: ' . esc_html((string) $page_id) . '</p></div>';
        }

        if (isset($_POST['arcsecs_run_route_smoke_check'])) {
            check_admin_referer('arcsecs_physics_engine_route_smoke_check');
            $smoke_check_result = $this->run_route_smoke_checks();
            update_option('arcsecs_route_smoke_check_result', $smoke_check_result, false);
            echo '<div class="notice notice-success"><p>Route smoke check completed. Review the latest results below.</p></div>';
        }

        $page_id = (int) get_option('arcsecs_physics_engine_demo_page_id', 0);
        $menu_item_id = (int) get_option('arcsecs_physics_engine_menu_item_id', 0);
        $dark_drive_page_id = (int) get_option('arcsecs_dark_matter_drive_page_id', 0);
        $dark_drive_menu_item_id = (int) get_option('arcsecs_dark_matter_drive_menu_item_id', 0);
        $demo_url = $page_id > 0 ? get_permalink($page_id) : home_url('/arcsecs-physics-engine-demo/');
        $dark_drive_url = $dark_drive_page_id > 0 ? get_permalink($dark_drive_page_id) : home_url('/dark-matter-drive-simulator/');
        $health_rows = $this->build_route_health_rows($page_id, $dark_drive_page_id, $menu_item_id, $dark_drive_menu_item_id);
        $smoke_check_result = $this->get_last_route_smoke_check_result();
        $health_report = $this->build_route_health_report($page_id, $dark_drive_page_id, $menu_item_id, $dark_drive_menu_item_id, (string) $demo_url, (string) $dark_drive_url, $health_rows, $smoke_check_result);
        $health_report_json = wp_json_encode($health_report, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
        if (!is_string($health_report_json) || $health_report_json === '') {
            $health_report_json = '{}';
        }
        ?>
        <div class="wrap arcsecs-admin-wrap">
            <h1>ArcSecs Scientific Physics Engine</h1>
            <p><strong>Version <?php echo esc_html(ARCSECS_PHYSICS_ENGINE_VERSION); ?></strong></p>
            <p>This plugin adds an immediate-running full-screen scientific cockpit simulator for ArcSecs TDD Physics, speculative cosmology, tired-light energy accounting, Proca photon dispersion, and Dark Matter Drive flow studies.</p>

            <h2>Public Routes</h2>
            <p>
                <a class="button button-primary" href="<?php echo esc_url((string) $demo_url); ?>" target="_blank" rel="noopener noreferrer">Open Physics Engine Demo</a>
                <a class="button button-primary" href="<?php echo esc_url((string) $dark_drive_url); ?>" target="_blank" rel="noopener noreferrer">Open DM Drive Simulator</a>
            </p>
            <p>Stored demo page ID: <code><?php echo esc_html((string) $page_id); ?></code></p>
            <p>Stored demo menu item ID: <code><?php echo esc_html((string) $menu_item_id); ?></code></p>
            <p>Stored DM Drive page ID: <code><?php echo esc_html((string) $dark_drive_page_id); ?></code></p>
            <p>Stored DM Drive menu item ID: <code><?php echo esc_html((string) $dark_drive_menu_item_id); ?></code></p>

            <form method="post">
                <?php wp_nonce_field('arcsecs_physics_engine_repair'); ?>
                <button class="button" type="submit" name="arcsecs_repair_installation" value="1">Repair Plugin Pages, Menu Items, and Rewrite Rules</button>
            </form>

            <h2>Route Health Diagnostics</h2>
            <table class="widefat striped arcsecs-route-health-table">
                <thead>
                    <tr>
                        <th scope="col">Check</th>
                        <th scope="col">Status</th>
                        <th scope="col">Details</th>
                    </tr>
                </thead>
                <tbody>
                    <?php foreach ($health_rows as $row) : ?>
                        <tr>
                            <td><?php echo esc_html($row['label']); ?></td>
                            <td><?php echo $this->render_status_badge((bool) $row['healthy']); ?></td>
                            <td><?php echo esc_html($row['detail']); ?></td>
                        </tr>
                    <?php endforeach; ?>
                </tbody>
            </table>

            <h2>Route Smoke Check</h2>
            <p>Run a server-side HTTP smoke check after installing a zip, repairing pages, or refreshing permalinks. This checks whether WordPress can reach the public plugin routes and AI summary endpoints.</p>
            <form method="post" class="arcsecs-route-smoke-form">
                <?php wp_nonce_field('arcsecs_physics_engine_route_smoke_check'); ?>
                <button class="button" type="submit" name="arcsecs_run_route_smoke_check" value="1">Run Route Smoke Check</button>
            </form>
            <?php $this->render_route_smoke_check_results($smoke_check_result); ?>

            <h2>Route Health Report</h2>
            <p>This JSON is inert diagnostic text you can copy into an issue, handoff, or AI debugging prompt. It does not contain executable code.</p>
            <textarea class="large-text code arcsecs-route-health-report" readonly rows="14" aria-label="ArcSecs route health JSON report"><?php echo esc_textarea($health_report_json); ?></textarea>

            <h2>Repair Checklist</h2>
            <ol class="arcsecs-repair-checklist">
                <li>Click <strong>Repair Plugin Pages, Menu Items, and Rewrite Rules</strong>.</li>
                <li>Open <code>/dark-matter-drive-simulator/</code> in a private browser window.</li>
                <li>If the simulator loads but the theme header looks crowded, fix only the theme navigation label/layout.</li>
                <li>If the simulator still 404s, re-save WordPress permalinks and rerun the repair action.</li>
                <li>Run <strong>Route Smoke Check</strong> and copy the Route Health Report if the problem continues.</li>
                <li>Confirm the theme link points exactly to <code>/dark-matter-drive-simulator/</code>.</li>
            </ol>

            <h2>Shortcode</h2>
            <pre><code>[arcsecs_physics_engine scenario="darkMatterDrive" auto_run="true" steps="6000"]</code></pre>

            <h2>Advanced Shortcode Attributes</h2>
            <pre><code>[arcsecs_physics_engine title="Dark Matter Drive Simulator" scenario="darkMatterDrive" auto_run="true" steps="6000" default_open_controls="false" compact="false" show_boundary="true"]</code></pre>

            <h2>Scientific Modules</h2>
            <ul>
                <li>Full-screen cockpit demo route that bypasses narrow theme page/card wrappers.</li>
                <li>Immediate auto-run demo experience with dashboard controls, telemetry panels, charts, and an accessible console workflow.</li>
                <li>Scenario presets for control cosmology, VSL, tired-light, Proca dispersion, CCC+TL, and Dark Matter Drive substrate-flow studies.</li>
                <li>Data-oriented browser simulation with Float64Array internal buffers.</li>
                <li>Web Worker execution with run IDs, progress updates, timeout handling, and visible worker-failure messages.</li>
                <li>Adaptive time-step diagnostics, energy ledger, alpha drift, photon phase, and propulsion metrics.</li>
                <li>TDD Physics pass/fail matrix with exportable CSV and JSON reports.</li>
            </ul>

            <h2>Immediate-Run Demo Behavior</h2>
            <p>The activation-created page at <code>/arcsecs-physics-engine-demo/</code> now uses a plugin-owned full-screen route template. It starts the default Dark Matter Drive simulation immediately and fills the viewport like a scientific cockpit instead of inheriting a narrow WordPress article column.</p>

            <p><strong>Scientific boundary:</strong> This plugin is a speculative simulation and education tool. It does not establish VSL cosmology, tired light, Proca ordinary photons, relational inertia, or Dark Matter Drive propulsion as accepted physics.</p>
        </div>
        <?php
    }

    /**
     * Builds route health rows for the plugin-owned public pages and fallback route.
     *
     * @param Int32 $demo_page_id Stored Physics Engine Demo page ID.
     * @param Int32 $dark_drive_page_id Stored Dark Matter Drive page ID.
     * @param Int32 $demo_menu_item_id Stored Physics Engine Demo menu item ID.
     * @param Int32 $dark_drive_menu_item_id Stored Dark Matter Drive menu item ID.
     * @return array<int, array{label:string, healthy:bool, detail:string}> Diagnostic rows.
     */
    private function build_route_health_rows(int $demo_page_id, int $dark_drive_page_id, int $demo_menu_item_id, int $dark_drive_menu_item_id): array
    {
        $dark_drive_script_path = ARCSECS_PHYSICS_ENGINE_PATH . 'assets/js/arcsecs-dark-matter-drive-simulator.js';
        $worker_script_path = ARCSECS_PHYSICS_ENGINE_PATH . 'assets/js/arcsecs-physics-worker.js';

        return array(
            array(
                'label' => 'Physics Engine Demo page',
                'healthy' => $demo_page_id > 0 && get_post($demo_page_id) instanceof WP_Post,
                'detail' => $demo_page_id > 0 ? 'Stored page ID ' . $demo_page_id . ' is registered.' : 'Missing stored page ID; use repair.',
            ),
            array(
                'label' => 'Dark Matter Drive Simulator page',
                'healthy' => $dark_drive_page_id > 0 && get_post($dark_drive_page_id) instanceof WP_Post,
                'detail' => $dark_drive_page_id > 0 ? 'Stored page ID ' . $dark_drive_page_id . ' is registered.' : 'Route fallback still works, but the page object should be repaired.',
            ),
            array(
                'label' => 'Dark Matter Drive fallback route',
                'healthy' => true,
                'detail' => '/dark-matter-drive-simulator/ is handled directly by the plugin fallback route.',
            ),
            array(
                'label' => 'Physics demo menu item',
                'healthy' => $demo_menu_item_id > 0,
                'detail' => $demo_menu_item_id > 0 ? 'Stored menu item ID ' . $demo_menu_item_id . ' is available.' : 'Menu item missing or theme owns navigation.',
            ),
            array(
                'label' => 'DM Drive compact menu label',
                'healthy' => $dark_drive_menu_item_id > 0,
                'detail' => $dark_drive_menu_item_id > 0 ? 'Stored menu item ID ' . $dark_drive_menu_item_id . ' should use the compact DM Drive label.' : 'Theme may own navigation; plugin fallback will not duplicate it.',
            ),
            array(
                'label' => 'Dark Matter Drive simulator asset',
                'healthy' => file_exists($dark_drive_script_path),
                'detail' => file_exists($dark_drive_script_path) ? 'Runtime JavaScript asset exists.' : 'Runtime JavaScript asset is missing from the plugin package.',
            ),
            array(
                'label' => 'Shared worker asset',
                'healthy' => file_exists($worker_script_path),
                'detail' => file_exists($worker_script_path) ? 'Shared physics worker asset exists.' : 'Shared physics worker asset is missing from the plugin package.',
            ),
        );
    }

    /**
     * Builds an inert JSON-ready route health report for handoff and debugging.
     *
     * @param Int32 $demo_page_id Stored Physics Engine Demo page ID.
     * @param Int32 $dark_drive_page_id Stored Dark Matter Drive page ID.
     * @param Int32 $demo_menu_item_id Stored Physics Engine Demo menu item ID.
     * @param Int32 $dark_drive_menu_item_id Stored Dark Matter Drive menu item ID.
     * @param string $demo_url Resolved Physics Engine Demo URL.
     * @param string $dark_drive_url Resolved Dark Matter Drive Simulator URL.
     * @param array<int, array{label:string, healthy:bool, detail:string}> $health_rows Existing diagnostic rows.
     * @param array<string, mixed> $smoke_check_result Last stored smoke-check result.
     * @return array<string, mixed> JSON-ready diagnostic report.
     */
    private function build_route_health_report(int $demo_page_id, int $dark_drive_page_id, int $demo_menu_item_id, int $dark_drive_menu_item_id, string $demo_url, string $dark_drive_url, array $health_rows, array $smoke_check_result): array
    {
        return array(
            'reportType' => 'ArcSecs Route Health Report',
            'version' => ARCSECS_PHYSICS_ENGINE_VERSION,
            'generatedAtUtc' => gmdate('c'),
            'routes' => array(
                'physicsEngineDemo' => array(
                    'url' => $demo_url,
                    'expectedPath' => '/arcsecs-physics-engine-demo/',
                    'pageId' => $demo_page_id,
                    'menuItemId' => $demo_menu_item_id,
                ),
                'darkMatterDriveSimulator' => array(
                    'url' => $dark_drive_url,
                    'expectedPath' => '/dark-matter-drive-simulator/',
                    'pageId' => $dark_drive_page_id,
                    'menuItemId' => $dark_drive_menu_item_id,
                    'fallbackRoute' => true,
                    'themeNavigationLabelRecommendation' => 'DM Drive',
                ),
            ),
            'healthRows' => $health_rows,
            'lastRouteSmokeCheck' => $smoke_check_result,
            'repairActions' => array(
                'clickRepairPluginPagesMenuItemsAndRewriteRules',
                'openDarkMatterDriveSimulatorRoute',
                'refreshPermalinksIfRouteStill404s',
                'keepThemeHeaderLayoutInTheme',
                'doNotDuplicateSimulatorCodeInTheme',
            ),
            'themeBoundary' => 'Theme owns the visible header/nav layout. Plugin owns simulator route, page creation, rendering, assets, SEO, docs, and UAI memory.',
        );
    }


    /**
     * Returns the last stored route smoke-check result in a safe shape.
     *
     * @return array<string, mixed> Last route smoke-check result.
     */
    private function get_last_route_smoke_check_result(): array
    {
        $result = get_option('arcsecs_route_smoke_check_result', array());
        if (!is_array($result)) {
            return array(
                'status' => 'not-run',
                'generatedAtUtc' => '',
                'checks' => array(),
            );
        }

        if (!isset($result['checks']) || !is_array($result['checks'])) {
            $result['checks'] = array();
        }

        return $result;
    }

    /**
     * Runs server-side smoke checks against the public plugin routes.
     *
     * @return array<string, mixed> JSON-ready route smoke-check result.
     */
    private function run_route_smoke_checks(): array
    {
        $targets = array(
            array(
                'label' => 'Physics Engine Demo route',
                'url' => home_url('/arcsecs-physics-engine-demo/'),
                'expectedStatus' => 200,
                'expectedContent' => 'ArcSecs',
            ),
            array(
                'label' => 'Dark Matter Drive Simulator route',
                'url' => home_url('/dark-matter-drive-simulator/'),
                'expectedStatus' => 200,
                'expectedContent' => 'Dark Matter Drive',
            ),
            array(
                'label' => 'Physics Engine AI summary',
                'url' => home_url('/arcsecs-physics-engine-demo/ai-summary/'),
                'expectedStatus' => 200,
                'expectedContent' => 'AI Summary',
            ),
            array(
                'label' => 'Dark Matter Drive AI summary',
                'url' => home_url('/dark-matter-drive-simulator/ai-summary/'),
                'expectedStatus' => 200,
                'expectedContent' => 'Interactive Dark Matter Drive Simulator',
            ),
        );

        $checks = array();
        foreach ($targets as $target) {
            $checks[] = $this->run_single_route_smoke_check($target);
        }

        $failed_checks = array_filter($checks, static function (array $check): bool {
            return empty($check['healthy']);
        });

        return array(
            'status' => empty($failed_checks) ? 'pass' : 'repair',
            'generatedAtUtc' => gmdate('c'),
            'checks' => array_values($checks),
        );
    }

    /**
     * Runs a single server-side route smoke check.
     *
     * @param array{label:string,url:string,expectedStatus:Int32,expectedContent:string} $target Route target to check.
     * @return array<string, mixed> JSON-ready smoke-check row.
     */
    private function run_single_route_smoke_check(array $target): array
    {
        $response = wp_remote_get(
            $target['url'],
            array(
                'timeout' => 10,
                'redirection' => 3,
                'headers' => array(
                    'User-Agent' => 'ArcSecs Route Smoke Check/' . ARCSECS_PHYSICS_ENGINE_VERSION,
                ),
            )
        );

        if (is_wp_error($response)) {
            return array(
                'label' => $target['label'],
                'url' => $target['url'],
                'healthy' => false,
                'statusCode' => 0,
                'detail' => $response->get_error_message(),
            );
        }

        $status_code = (int) wp_remote_retrieve_response_code($response);
        $body = (string) wp_remote_retrieve_body($response);
        $has_expected_content = stripos($body, $target['expectedContent']) !== false;
        $healthy = $status_code === (int) $target['expectedStatus'] && $has_expected_content;

        return array(
            'label' => $target['label'],
            'url' => $target['url'],
            'healthy' => $healthy,
            'statusCode' => $status_code,
            'detail' => $healthy ? 'Route returned expected status and content.' : 'Unexpected status or missing expected content marker.',
        );
    }

    /**
     * Renders the latest route smoke-check result table.
     *
     * @param array<string, mixed> $smoke_check_result Last smoke-check result.
     * @return void
     */
    private function render_route_smoke_check_results(array $smoke_check_result): void
    {
        $checks = isset($smoke_check_result['checks']) && is_array($smoke_check_result['checks']) ? $smoke_check_result['checks'] : array();
        if (empty($checks)) {
            echo '<p class="arcsecs-route-smoke-empty">No route smoke check has been run yet.</p>';
            return;
        }
        ?>
        <table class="widefat striped arcsecs-route-smoke-table">
            <thead>
                <tr>
                    <th scope="col">Route</th>
                    <th scope="col">Status</th>
                    <th scope="col">HTTP</th>
                    <th scope="col">Details</th>
                </tr>
            </thead>
            <tbody>
                <?php foreach ($checks as $check) : ?>
                    <?php $healthy = !empty($check['healthy']); ?>
                    <tr>
                        <td><a href="<?php echo esc_url((string) ($check['url'] ?? '')); ?>" target="_blank" rel="noopener noreferrer"><?php echo esc_html((string) ($check['label'] ?? 'Route')); ?></a></td>
                        <td><?php echo $this->render_status_badge($healthy); ?></td>
                        <td><?php echo esc_html((string) ((int) ($check['statusCode'] ?? 0))); ?></td>
                        <td><?php echo esc_html((string) ($check['detail'] ?? '')); ?></td>
                    </tr>
                <?php endforeach; ?>
            </tbody>
        </table>
        <?php
    }


    /**
     * Renders an admin-safe status badge.
     *
     * @param bool $healthy Whether the diagnostic row passed.
     * @return string Safe HTML badge.
     */
    private function render_status_badge(bool $healthy): string
    {
        $label = $healthy ? 'PASS' : 'REPAIR';
        $class_name = $healthy ? 'arcsecs-status-pass' : 'arcsecs-status-repair';
        return '<span class="arcsecs-status-badge ' . esc_attr($class_name) . '">' . esc_html($label) . '</span>';
    }


}
