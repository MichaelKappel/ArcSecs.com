<?php
if (!defined('ABSPATH')) {
    exit;
}

final class ArcSecs_Physics_Engine_Shortcodes
{
    /**
     * Registers shortcodes.
     *
     * @return void
     */
    public function register(): void
    {
        add_shortcode('arcsecs_dark_matter_drive_simulator', array($this, 'render_dark_matter_drive_shortcode'));
        add_shortcode('arcsecs_space_travel_simulation', array($this, 'render_space_travel_simulation_shortcode'));
        add_shortcode('arcsecs_cosmic_evolution', array($this, 'render_cosmic_shortcode'));
        add_shortcode('arcsecs_physics_engine', array($this, 'render_engine_shortcode'));
    }

    /**
     * Renders the ArcSecs scientific physics engine simulator.
     *
     * @param array<string, mixed> $attributes Shortcode attributes supplied by WordPress.
     * @return string HTML markup for the simulator shell.
     */
    private function render_demo_navigation(string $current): void
    {
        $links = array('Physics engine' => '/arcsecs-physics-engine-demo/', 'Dark Matter Drive' => '/dark-matter-drive-simulator/', 'Space travel' => '/space-travel-simulation/', 'Research library' => '/research-library/', 'Reproducibility' => '/research-library/reproducibility/', 'AI corpus' => '/ai-corpus/', 'Cosmic evolution' => '/cosmic-evolution-simulator/');
        echo '<nav class="arcsecs-demo-round-nav" aria-label="Explore ArcSecs experiments and evidence">';
        foreach ($links as $label => $path) {
            echo '<a href="' . esc_url(home_url($path)) . '"' . ($label === $current ? ' aria-current="page"' : '') . '>' . esc_html($label) . '</a>';
        }
        wp_enqueue_script('arcsecs-review6-lab');
        echo '<button type="button" data-lab-open>Review 6 experiment lab</button></nav>';
        require __DIR__ . '/review6-lab.php';
        echo '<p class="arcsecs-demo-round-boundary">Exploratory legacy model, not experimental proof or a complete Review 6 solver. Open the Review 6 experiment lab for source-matched analytical controls. Start a run when ready.</p>';
    }

    public function render_cosmic_shortcode(array $attributes = array()): string
    {
        wp_enqueue_style('arcsecs-physics-engine');
        wp_enqueue_script('arcsecs-cosmic-lab');
        ob_start();
        require __DIR__ . '/cosmic-lab.php';
        return (string) ob_get_clean();
    }

    public function render_engine_shortcode(array $attributes = array()): string
    {
        wp_enqueue_style('arcsecs-physics-engine');
        wp_enqueue_script('arcsecs-physics-engine');

        $attributes = shortcode_atts(
            array(
                'title' => 'ArcSecs Experimental Physics Engine',
                'subtitle' => 'Flat-space theatrical physics, tired light, massive photons, dark-matter ramjet simulation, and real-time diagnostics',
                'scenario' => 'relationalLattice',
                'auto_run' => 'false',
                'auto_grand_experiment' => 'false',
                'auto_guided_tour' => 'false',
                'auto_launch_delay_ms' => '900',
                'steps' => '6000',
                'default_open_controls' => 'false',
                'compact' => 'false',
                'show_boundary' => 'true',
            ),
            $attributes,
            'arcsecs_physics_engine'
        );

        $scenario = ArcSecs_Physics_Engine_Config::normalize_scenario($attributes['scenario']);
        $steps = ArcSecs_Physics_Engine_Config::normalize_steps($attributes['steps']);
        $auto_run = ArcSecs_Physics_Engine_Config::normalize_bool_attribute($attributes['auto_run']);
        $auto_grand_experiment = ArcSecs_Physics_Engine_Config::normalize_bool_attribute($attributes['auto_grand_experiment']);
        $auto_guided_tour = ArcSecs_Physics_Engine_Config::normalize_bool_attribute($attributes['auto_guided_tour']);
        $auto_launch_delay_ms = max(0, min(10000, (int) $attributes['auto_launch_delay_ms']));
        $default_open_controls = ArcSecs_Physics_Engine_Config::normalize_bool_attribute($attributes['default_open_controls']);
        $show_boundary = filter_var($attributes['show_boundary'], FILTER_VALIDATE_BOOLEAN);
        $compact = filter_var($attributes['compact'], FILTER_VALIDATE_BOOLEAN);
        $instance_id = function_exists('wp_unique_id') ? wp_unique_id('arcsecs-engine-') : 'arcsecs-engine-' . wp_rand(1000, 999999);
        $title = (string) $attributes['title'];
        $subtitle = (string) $attributes['subtitle'];
        $main_site_url = home_url('/');
        $root_classes = 'arcsecs-physics-demo arcsecs-engine arcsecs-demo-shell';
        if ($compact) {
            $root_classes .= ' arcsecs-engine--compact';
        }

        ob_start();
        ?>
        <section id="<?php echo esc_attr($instance_id); ?>" class="<?php echo esc_attr($root_classes); ?>" data-arcsecs-engine="true" data-default-scenario="<?php echo esc_attr($scenario); ?>" data-auto-run="<?php echo esc_attr($auto_run); ?>" data-auto-grand-experiment="<?php echo esc_attr($auto_grand_experiment); ?>" data-auto-guided-tour="<?php echo esc_attr($auto_guided_tour); ?>" data-auto-launch-delay-ms="<?php echo esc_attr((string) $auto_launch_delay_ms); ?>" data-auto-launch-version="v5.7.16" data-default-steps="<?php echo esc_attr((string) $steps); ?>" data-default-open-controls="<?php echo esc_attr($default_open_controls); ?>">
            <header class="arcsecs-demo-hero">
                <?php $this->render_demo_navigation('Physics engine'); ?>
                <a class="arcsecs-demo-brand arcsecs-demo-brand-link" href="<?php echo esc_url($main_site_url); ?>" data-arcsecs-brand-home="true" aria-label="Return to ArcSecs.com home page" title="Return to the ArcSecs.com home page. This exits the full-screen research cockpit and opens the main site.">
                    <span class="arcsecs-demo-mark" aria-hidden="true">ARC</span>
                    <span class="arcsecs-demo-brand-copy">
                        <span class="arcsecs-demo-kicker">ArcSecs.com • Relational Theatrical Physics Engine • Live Research Demo</span>
                        <span class="arcsecs-demo-title"><?php echo esc_html($title); ?></span>
                    </span>
                </a>
                <div class="arcsecs-demo-subtitle">
                    <span><?php echo esc_html($subtitle); ?></span>
                    <strong>Speculative Research Visualization</strong><strong>No-Spacetime Simulation</strong><strong>Massive Photon Mode</strong><strong>Tired-Light Engine</strong>
                </div>
                <div class="arcsecs-header-readouts" aria-label="Live simulator readouts">
                    <span>Engine <strong><?php echo esc_html(defined('ARCSECS_PHYSICS_ENGINE_VERSION') ? ARCSECS_PHYSICS_ENGINE_VERSION : '3.2.0'); ?></strong></span>
                    <span>Scenario <strong data-arcsecs-header-scenario="true">Booting</strong></span>
                    <span>Audit <strong data-arcsecs-header-audit="true">Pending</strong></span>
                    <span>Keys <strong>?</strong></span>
                </div>
                <div class="arcsecs-status-legend" data-arcsecs-status-legend="true" aria-label="Simulation status states">
                    <span data-arcsecs-status-state="Idle">Idle</span>
                    <span data-arcsecs-status-state="Running">Running</span>
                    <span data-arcsecs-status-state="Paused">Paused</span>
                    <span data-arcsecs-status-state="Stepping">Stepping</span>
                    <span data-arcsecs-status-state="Warning">Warning</span>
                    <span data-arcsecs-status-state="Failed validation">Failed validation</span>
                </div>
                <nav class="arcsecs-demo-actions" data-testid="command-rail" aria-label="Simulator actions">
                    <a class="arcsecs-demo-back-link" href="<?php echo esc_url($main_site_url); ?>" data-arcsecs-back-home="true" title="Return to the ArcSecs.com home page. Use this when you are done with the simulator.">← Back to ArcSecs.com</a>
                    <a class="arcsecs-demo-back-link" href="<?php echo esc_url(home_url('/arcsecs-physics-engine-demo/')); ?>" title="Reload the main ArcSecs Physics Engine Demo route with the current plugin shell.">Physics Engine Demo</a>
                    <button type="button" data-arcsecs-preset="darkMatterRamjet" title="Dark Matter Ramjet: run the full pipeline from EIT scoop through HIBE shield, Fishback solenoid, buffer, reactor, thermal system, and exhaust.">Dark Matter Drive Simulation</button>
                    <button type="button" data-arcsecs-play-pause="true" aria-pressed="false" title="Pause or resume viewport animation. Worker computation has its own Cancel control.">Pause</button>
                    <button type="button" data-arcsecs-cancel-run="true" disabled>Cancel computation</button>
                    <button type="button" data-arcsecs-run="true" title="Run the selected scenario through the worker simulation and refresh diagnostics, charts, validation, and reports. Watch the main viewport, telemetry strip, and bottom graphs for the visible response.">Run Scenario</button>
                    <button type="button" data-arcsecs-parameter-guide-open="true" aria-haspopup="dialog" title="Open the Run Your Own Simulation Parameter Guide. Choose an example experiment and populate the sandbox controls automatically.">Run Your Own Simulation</button>
                    <button type="button" data-arcsecs-step="true" title="Advance exactly one deterministic simulation tick. Useful for debugging solver and scenario state changes.">Step</button>
                    <button type="button" data-arcsecs-command-palette="true" aria-controls="arcsecs-command-palette" aria-expanded="false" title="Open the command palette and keyboard shortcut reference. Keyboard: ? or H.">Commands</button>
                    <button type="button" data-arcsecs-tour="true" title="Run a guided tour through the major research scenarios in a suggested learning order.">Guided Tour</button>
                    <button type="button" data-arcsecs-guided-tour-next="true" title="Advance the visible Guided Autopilot Tour to the next prompt-required scenario and run it.">Next Tour Stage</button>
                    <button type="button" data-arcsecs-grand-tour="true" title="Run the Grand Experiment Director: a scripted nine-mode sweep that fills the evidence packet, validation summary, and visitor/physicist tour narrative.">Grand Experiment Sweep</button>
                    <button type="button" data-arcsecs-auto-launch="true" title="Restart the page-load autopilot sequence: selected scenario first, then the Grand Experiment evidence sweep when enabled.">Restart Autopilot</button>
                    <button type="button" data-arcsecs-reset="true" title="Reset the active scenario to its configured initial state and rerun the simulation.">Reset</button>
                    <button type="button" data-arcsecs-audience-mode="public" aria-pressed="true" title="Visitor Mode: explain the active scenario in plain language, show what to click first, and describe the visible signal to watch.">Visitor Mode</button>
                    <button type="button" data-arcsecs-audience-mode="physicist" aria-pressed="false" title="Physicist Mode: emphasize assumptions, standard-reference comparisons, units, pseudo-equations, and falsification criteria.">Physicist Mode</button>
                    <button type="button" data-arcsecs-audience-mode="engineer" aria-pressed="false" title="Engineer Mode: emphasize deterministic tick state, finite-output guard status, export readiness, replay compatibility, and renderer fallback state.">Engineer Mode</button>
                    <button type="button" data-arcsecs-layout-mode="focus" aria-pressed="false" title="Focus Stage: expands the visualization priority by visually compressing side-console chrome while keeping controls accessible. Use it when showing the demo to visitors or recording a walkthrough.">Focus Stage</button>
                    <button type="button" data-arcsecs-layout-mode="lab" aria-pressed="true" title="Lab Console: restores the full research instrument layout with controls, diagnostics, validation, and workbench panels visible.">Lab Console</button>
                    <button type="button" data-arcsecs-layout-mode="explain" aria-pressed="false" title="Explain View: emphasizes the plain-language guide, scenario spotlight, and what-to-try prompts for non-specialist visitors.">Explain View</button>
                </nav>
            </header>

            <div class="arcsecs-parameter-guide-modal" data-arcsecs-parameter-guide-modal="true" role="dialog" aria-modal="true" aria-hidden="true" aria-labelledby="arcsecs-parameter-guide-title" hidden>
                <div class="arcsecs-parameter-guide-dialog">
                    <header>
                        <span>Companion Experiment Guide</span>
                        <h2 id="arcsecs-parameter-guide-title">Run Your Own Simulation Parameter Guide</h2>
                        <p>Pick an example demo and the guide will populate the sandbox values for you. Use Apply to inspect the controls first, or Apply &amp; Run to immediately execute the scenario.</p>
                        <button type="button" data-arcsecs-parameter-guide-close="true" aria-label="Close Run Your Own Simulation guide">×</button>
                    </header>
                    <div class="arcsecs-parameter-guide-grid">
                        <nav data-arcsecs-parameter-guide-list="true" class="arcsecs-parameter-guide-list" aria-label="Example simulation presets">Parameter examples loading.</nav>
                        <section class="arcsecs-parameter-guide-detail-stack">
                            <div class="arcsecs-parameter-guide-workspace-rail" data-arcsecs-guide-workspace-rail="true" aria-label="Guide workspaces">
                                <button type="button" data-arcsecs-guide-workspace="overview" aria-pressed="true">Overview</button>
                                <button type="button" data-arcsecs-guide-workspace="recipe" aria-pressed="false">Recipe Lab</button>
                                <button type="button" data-arcsecs-guide-workspace="comparison" aria-pressed="false">Comparison</button>
                                <button type="button" data-arcsecs-guide-workspace="playlist" aria-pressed="false">Playlist</button>
                                <button type="button" data-arcsecs-guide-workspace="notebook" aria-pressed="false">Notebook</button>
                                <button type="button" data-arcsecs-guide-workspace="replay" aria-pressed="false">Replay</button>
                                <button type="button" data-arcsecs-guide-workspace="sensitivity" aria-pressed="false">Sensitivity</button>
                            </div>
                            <div class="arcsecs-parameter-guide-selection" data-arcsecs-guide-selection="true" aria-live="polite">Choose a preset to populate the sandbox, then switch workspaces to compare, queue, replay, or scan it.</div>
                            <section class="arcsecs-guide-workspace-panel is-active" data-arcsecs-guide-panel="overview">
                                <div data-arcsecs-parameter-guide-detail="true" class="arcsecs-parameter-guide-detail" aria-live="polite">Select a preset to preview populated values.</div>
                            </section>
                            <section class="arcsecs-guide-workspace-panel" data-arcsecs-guide-panel="recipe">
                                <div data-arcsecs-recipe-lab="true" class="arcsecs-recipe-lab" aria-live="polite">Recipe Lab waiting for a selected preset.</div>
                            </section>
                            <section class="arcsecs-guide-workspace-panel" data-arcsecs-guide-panel="comparison">
                                <div data-arcsecs-recipe-comparison="true" class="arcsecs-recipe-comparison" aria-live="polite">Comparison Workbench waiting for recipe selections.</div>
                            </section>
                            <section class="arcsecs-guide-workspace-panel" data-arcsecs-guide-panel="playlist">
                                <div data-arcsecs-recipe-playlist="true" class="arcsecs-recipe-playlist" aria-live="polite">Experiment Playlist Runner waiting for queued recipes.</div>
                            </section>
                            <section class="arcsecs-guide-workspace-panel" data-arcsecs-guide-panel="notebook">
                                <div data-arcsecs-lab-notebook="true" class="arcsecs-lab-notebook" aria-live="polite">Experiment Lab Notebook waiting for saved results.</div>
                            </section>
                            <section class="arcsecs-guide-workspace-panel" data-arcsecs-guide-panel="replay">
                                <div data-arcsecs-replay-timeline="true" class="arcsecs-replay-timeline" aria-live="polite">Experiment Replay Timeline waiting for playlist snapshots.</div>
                            </section>
                            <section class="arcsecs-guide-workspace-panel" data-arcsecs-guide-panel="sensitivity">
                                <div data-arcsecs-sensitivity-scanner="true" class="arcsecs-sensitivity-scanner" aria-live="polite">Experiment Sensitivity Scanner waiting for a scenario or playlist result.</div>
                            </section>
                        </section>
                    </div>
                    <footer class="arcsecs-parameter-guide-actions">
                        <div class="arcsecs-parameter-guide-action-groups">
                            <section class="arcsecs-parameter-guide-action-group is-active" data-arcsecs-action-group="overview">
                                <header><strong>Preset Actions</strong><span>Load the selected example or run it immediately.</span></header>
                                <div class="arcsecs-parameter-guide-action-buttons">
                                    <button type="button" data-arcsecs-parameter-guide-apply="true" title="Populate all matching controls with the selected guide preset without running the worker yet.">Apply Values</button>
                                    <button type="button" data-arcsecs-parameter-guide-run="true" title="Populate the controls and immediately run the selected example simulation.">Apply &amp; Run</button>
                                    <button type="button" data-arcsecs-parameter-guide-export="true" title="Export the current parameter guide, selected preset, active configuration, latest metrics, and caution boundary as inert JSON.">Export Guide JSON</button>
                                </div>
                            </section>
                            <section class="arcsecs-parameter-guide-action-group" data-arcsecs-action-group="recipe">
                                <header><strong>Recipe Lab</strong><span>Validate, share, and rerun the current preset as a safe recipe.</span></header>
                                <div class="arcsecs-parameter-guide-action-buttons">
                                    <button type="button" data-arcsecs-recipe-validate="true" title="Validate the selected guide values as a safe shareable experiment recipe before applying them.">Validate Recipe</button>
                                    <button type="button" data-arcsecs-recipe-link="true" title="Create a URL recipe that can repopulate these sandbox controls from the query string.">Create Share Link</button>
                                    <button type="button" data-arcsecs-recipe-apply="true" title="Apply the latest validated/shared recipe values to the sandbox controls.">Apply Recipe</button>
                                    <button type="button" data-arcsecs-recipe-run="true" title="Apply the latest recipe values and immediately run that scenario.">Apply Recipe &amp; Run</button>
                                    <button type="button" data-arcsecs-recipe-export="true" title="Export the latest recipe, share URL, active configuration, and recorder state as inert JSON.">Export Recipe JSON</button>
                                </div>
                            </section>
                            <section class="arcsecs-parameter-guide-action-group" data-arcsecs-action-group="comparison">
                                <header><strong>Comparison Workbench</strong><span>Collect a few presets and compare the assumptions and warnings side by side.</span></header>
                                <div class="arcsecs-parameter-guide-action-buttons">
                                    <button type="button" data-arcsecs-comparison-add="true" title="Add the currently selected preset to the side-by-side Experiment Comparison Workbench.">Add To Comparison</button>
                                    <button type="button" data-arcsecs-comparison-build="true" title="Build the Experiment Comparison Workbench from the selected recipes, latest Grand Experiment evidence, and active sandbox values.">Build Comparison</button>
                                    <button type="button" data-arcsecs-comparison-clear="true" title="Reset the comparison list to the currently selected recipe only.">Clear Comparison</button>
                                    <button type="button" data-arcsecs-comparison-export="true" title="Export the Experiment Comparison Workbench as inert JSON with no executable code.">Export Comparison JSON</button>
                                </div>
                            </section>
                            <section class="arcsecs-parameter-guide-action-group" data-arcsecs-action-group="playlist">
                                <header><strong>Playlist Runner</strong><span>Queue guided recipes and walk through them as a batch experiment.</span></header>
                                <div class="arcsecs-parameter-guide-action-buttons">
                                    <button type="button" data-arcsecs-playlist-add="true" title="Add the currently selected preset to the Experiment Playlist Runner queue.">Add To Playlist</button>
                                    <button type="button" data-arcsecs-playlist-build="true" title="Build the guided Experiment Playlist Runner batch from queued recipes.">Build Playlist</button>
                                    <button type="button" data-arcsecs-playlist-run="true" title="Apply and run the current playlist recipe as a guided batch step.">Run Playlist</button>
                                    <button type="button" data-arcsecs-playlist-next="true" title="Mark the current playlist item complete and run the next queued recipe.">Next Playlist Item</button>
                                    <button type="button" data-arcsecs-playlist-clear="true" title="Clear the playlist queue back to the selected recipe only.">Clear Playlist</button>
                                    <button type="button" data-arcsecs-playlist-export="true" title="Export the Experiment Playlist Runner batch report as inert JSON with no executable code.">Export Playlist JSON</button>
                                </div>
                            </section>
                            <section class="arcsecs-parameter-guide-action-group" data-arcsecs-action-group="notebook">
                                <header><strong>Lab Notebook</strong><span>Capture the latest result and reuse a visitor or physicist summary.</span></header>
                                <div class="arcsecs-parameter-guide-action-buttons">
                                    <button type="button" data-arcsecs-notebook-save="true" title="Save the latest recipe, scenario, or playlist result into the persistent Experiment Lab Notebook.">Save Result to Notebook</button>
                                    <button type="button" data-arcsecs-notebook-copy-visitor="true" title="Copy a visitor-friendly Lab Notebook summary with cautious model language.">Copy Visitor Summary</button>
                                    <button type="button" data-arcsecs-notebook-copy-physicist="true" title="Copy a physicist-facing Lab Notebook summary with validation, warning, and ledger notes.">Copy Physicist Summary</button>
                                    <button type="button" data-arcsecs-notebook-clear="true" title="Clear browser-side Lab Notebook entries for this visitor session.">Clear Notebook</button>
                                    <button type="button" data-arcsecs-notebook-export="true" title="Export the Experiment Lab Notebook as inert JSON with no executable code.">Export Notebook JSON</button>
                                </div>
                            </section>
                            <section class="arcsecs-parameter-guide-action-group" data-arcsecs-action-group="replay">
                                <header><strong>Replay Timeline</strong><span>Walk through stage snapshots, warning markers, and the replay report.</span></header>
                                <div class="arcsecs-parameter-guide-action-buttons">
                                    <button type="button" data-arcsecs-replay-back="true" title="Move the Experiment Replay Timeline back one stage snapshot.">Replay Back</button>
                                    <button type="button" data-arcsecs-replay-play="true" title="Play the Experiment Replay Timeline using the existing playlist snapshots.">Replay Play</button>
                                    <button type="button" data-arcsecs-replay-pause="true" title="Pause the Experiment Replay Timeline for stage inspection.">Replay Pause</button>
                                    <button type="button" data-arcsecs-replay-next="true" title="Advance to the next Experiment Replay Timeline event or stage snapshot.">Replay Next Event</button>
                                    <button type="button" data-arcsecs-replay-warning="true" title="Jump to the next warning marker in the Experiment Replay Timeline.">Jump To Warning</button>
                                    <button type="button" data-arcsecs-replay-export="true" title="Export the Experiment Replay Timeline report as inert JSON with snapshots, before/after metrics, markers, and explanations.">Export Replay Report</button>
                                </div>
                            </section>
                            <section class="arcsecs-parameter-guide-action-group" data-arcsecs-action-group="sensitivity">
                                <header><strong>Sensitivity Scanner</strong><span>Sweep an important parameter and inspect the turning points.</span></header>
                                <div class="arcsecs-parameter-guide-action-buttons">
                                    <button type="button" data-arcsecs-sensitivity-scan="true" title="Build an Experiment Sensitivity Scanner sweep for the active scenario control and show tipping points.">Run Sensitivity Scan</button>
                                    <button type="button" data-arcsecs-sensitivity-export="true" title="Export the Experiment Sensitivity Scanner report as inert JSON with points, tipping thresholds, and context.">Export Sensitivity Report</button>
                                </div>
                            </section>
                        </div>
                        <div class="arcsecs-parameter-guide-footer-bar">
                            <p>Tip: start in Overview, then move to Recipe Lab or Playlist once the preset looks right.</p>
                            <button type="button" data-arcsecs-parameter-guide-close="true">Close</button>
                        </div>
                    </footer>
                </div>
            </div>

            <?php if ($show_boundary) : ?>
                <div class="arcsecs-demo-disclaimer" data-arcsecs-disclaimer="true">Speculative research visualization — not established current technology.</div>
            <?php endif; ?>




            <section class="arcsecs-readiness-sweep-panel arcsecs-physics-engine-onboarding" data-arcsecs-physics-readiness-sweep="true" aria-label="Physics Engine readiness sweep overview">
                <header>
                    <span>v3.142.0 evidence bundle integrity labels</span>
                    <h2>Speculative research visualization with comparison, evidence, and falsification up front</h2>
                    <p>ArcSecs is a speculative research visualization framework. It lets visitors inspect alternative model behavior, compare it against standard references, export evidence, and identify what would falsify the model.</p>
                </header>
                <div class="arcsecs-readiness-mode-grid" aria-label="Visitor Physicist Engineer modes">
                    <article data-arcsecs-visitor-mode="true">
                        <h3>Visitor Mode</h3>
                        <p>Start with one scenario, click <strong>Run Scenario</strong>, then watch the viewport, telemetry strip, comparison graph, and evidence checklist change together.</p>
                        <ul>
                            <li>Success: a visible scene changes and the evidence checklist reports finite telemetry.</li>
                            <li>Warning: the graph is flat, the ledger fails closure, or the model becomes indistinguishable from its baseline.</li>
                            <li>Falsification: the exported notes describe exactly what would weaken the current interpretation.</li>
                        </ul>
                    </article>
                    <article data-arcsecs-physicist-mode="true">
                        <h3>Physicist Mode</h3>
                        <p>Inspect assumptions, normalized units, standard-reference comparison notes, simplified pseudo-equations, and falsification criteria before treating any signal as meaningful.</p>
                        <ul>
                            <li>Use parsec / arcsecond calibration as a hard sanity check.</li>
                            <li>Keep intrinsic source delay separate from line-of-sight propagation delay.</li>
                            <li>Treat tired-light, Proca, MOND, and drive branches as comparison hypotheses, not established replacements.</li>
                        </ul>
                    </article>
                    <article data-arcsecs-engineer-mode="true">
                        <h3>Engineer Mode</h3>
                        <p>Verify deterministic tick state, finite-output guards, export readiness, replay compatibility, payload limits, renderer fallback, and warning visibility.</p>
                        <ul>
                            <li>Step one deterministic tick when checking solver behavior.</li>
                            <li>Export inert JSON only; imports validate data and never execute code.</li>
                            <li>Renderer and performance warnings must stay visible instead of being hidden.</li>
                        </ul>
                    </article>
                </div>
            </section>

            <section class="arcsecs-universal-clock" data-arcsecs-universal-clock="true" aria-label="Universal Cosmic Clock and local oscillator comparison" title="Universal Cosmic Clock: the fixed simulation tick never dilates or slows. Local oscillator probes may mechanically retard, but the global engine clock stays immutable.">
                <div><span>Universal Cosmic Clock</span><strong data-arcsecs-cosmic-tick="true">0</strong></div>
                <div><span>Fixed Step</span><strong data-arcsecs-fixed-step="true">1/60 s</strong></div>
                <div><span>Elapsed Simulation Time</span><strong data-arcsecs-elapsed-time="true">0.000 s</strong></div>
                <div><span>Local Oscillator Probe</span><strong data-arcsecs-oscillator="true">1.000000×</strong></div>
                <div><span>Mechanical Retardation</span><strong data-arcsecs-retardation="true">0.000%</strong></div>
            </section>

            <main class="arcsecs-demo-grid" data-testid="demo-grid" aria-label="ArcSecs no-spacetime relational simulator">
                <aside class="arcsecs-panel arcsecs-control-panel" data-testid="left-panel" aria-label="Control panel">
                    <form data-arcsecs-controls="true" class="arcsecs-control-form">
                        <div class="arcsecs-section-title"><span>01</span><strong>Scenario Selector</strong></div>
                        <label>Scenario
                            <select name="scenario" data-arcsecs-scenario-select="true" title="Choose which experimental physics mode to run. Each mode changes the visualization, parameters, diagnostics, explanation, and validation checks.">
                                <option value="distanceTimeKernel">Distance-Time Kernel</option>
                                <option value="relationalLattice">Relational Lattice</option>
                                <option value="relationalFlatSpaceEngine">Relational Flat-Space Engine</option>
                                <option value="absoluteTimeQuantumOscillator">Absolute Time / Quantum Oscillator Damping</option>
                                <option value="teleparallelGravity">Teleparallel Gravity</option>
                                <option value="tiredLightPhotonDecay">Tired-Light Photon Decay</option>
                                <option value="mechanisticTiredLight">Mechanistic Tired-Light Redshift</option>
                                <option value="entropicBetaMatter">Entropic Gravity / Beta-Matter</option>
                                <option value="mondRotationCurves">MOND Rotation Curves</option>
                                <option value="procaPhotonDispersion">Proca Photon Dispersion</option>
                                <option value="massivePhotonProca">Massive Photon / Proca Dispersion</option>
                                <option value="eitSlowLight">EIT Slow-Light Buffer</option>
                                <option value="flatSpaceLensing">Flat-Space Gravitational Lensing</option>
                                <option value="massivePhotonLensing">Massive Photon Gravitational Lensing</option>
                                <option value="newtonianDarkStar">Newtonian Dark Star / Black Hole Interpretation</option>
                                <option value="superluminalGalilean">Superluminal Galilean Big Bang / Relative Velocity</option>
                                <option value="tiredLightEnergyLedger">Tired-Light Photon Energy Ledger</option>
                                <option value="darkMatterCondensate">Dark Matter / Tired-Light Condensate</option>
                                <option value="singularitySafeGravity">Sub-Quantum Gravity / Singularity-Safe Force Law</option>
                                <option value="monteCarloPhotonPipeline">Monte Carlo Photon Pipeline</option>
                                <option value="parallaxCalibration">Parallax and Arcsecond Calibration</option>
                                <option value="photometricCalibration">Photometric Calibration</option>
                                <option value="rigidBodyDiagnostics">Rigid-Body / ECS Physics Diagnostics</option>
                                <option value="sunSimulation">Sun Simulation</option>
                                <option value="darkMatterDrive">Dark Matter Drive</option>
                                <option value="darkMatterRamjet">Dark Matter Drive Ramjet</option>
                                <option value="ccctl">CCC + Tired Light</option>
                                <option value="control">Control / Fixed Constants</option>
                            </select>
                        </label>
                        <div class="arcsecs-scenario-buttons" aria-label="Scenario presets">
                            <button type="button" data-arcsecs-preset="distanceTimeKernel" title="Distance-Time Kernel: demonstrate no-lightyear distance, clockless progression, gravity-wave baseline arrival, degraded photon arrival, claim-map validation, and event-theater exports.">Distance-Time Kernel</button>
                            <button type="button" data-arcsecs-preset="relationalLattice" title="Relational Lattice: visualize material nodes, relational edges, observer frame measurements, and derived distances without treating spacetime as a physical container.">Relational Lattice</button>
                            <button type="button" data-arcsecs-preset="relationalFlatSpaceEngine" title="Relational Flat-Space Engine: run the flat Euclidean label model with a relational database as the active physics strategy.">Flat-Space Engine</button>
                            <button type="button" data-arcsecs-preset="teleparallelGravity" title="Teleparallel Gravity: show a flat grid where torsion-like or gauge-force vectors redirect motion without rendering curved spacetime.">Teleparallel Gravity</button>
                            <button type="button" data-arcsecs-preset="tiredLightPhotonDecay" title="Tired-Light Photon Decay: show photon energy attenuation across relational distance and the resulting redshift curve.">Tired Light</button>
                            <button type="button" data-arcsecs-preset="mechanisticTiredLight" title="Mechanistic Tired-Light Redshift: show photon-particle encounter energy loss with forward-scattering constraints and mainstream cautions.">Mechanistic Redshift</button>
                            <button type="button" data-arcsecs-preset="entropicBetaMatter" title="Entropic Gravity / Beta-Matter: compare Newtonian gravity against a speculative entropy-gradient and beta-coupling branch.">Beta-Matter</button>
                            <button type="button" data-arcsecs-preset="mondRotationCurves" title="MOND Rotation Curves: compare Newtonian decline against a flatter MOND/beta style low-acceleration curve.">MOND Curves</button>
                            <button type="button" data-arcsecs-preset="procaPhotonDispersion" title="Proca Photon Dispersion: show frequency-dependent group velocity and arrival delay for an effective massive-photon branch.">Proca Photon</button>
                            <button type="button" data-arcsecs-preset="massivePhotonProca" title="Massive Photon / Proca: run the corpuscular photon branch with effective mass, finite group velocity, and arrival-delay diagnostics.">Massive Photon</button>
                            <button type="button" data-arcsecs-preset="eitSlowLight" title="EIT Slow-Light Buffer: show pulse slowing, dark-state polariton storage, and retrieval as a conceptual energy-ledger model.">EIT Buffer</button>
                            <button type="button" data-arcsecs-preset="flatSpaceLensing" title="Flat-Space Gravitational Lensing: compare Newtonian corpuscular deflection, refractive-index correction, and GR reference behavior.">Flat Lensing</button>
                            <button type="button" data-arcsecs-preset="singularitySafeGravity" title="Singularity-Safe Gravity: demonstrate a softened force law that keeps close passes finite and prevents solver blowups.">Singularity-Safe</button>
                            <button type="button" data-arcsecs-preset="monteCarloPhotonPipeline" title="Monte Carlo Photon Pipeline: run deterministic seeded photon transport with absorption, scattering, energy loss, and detector hits.">Monte Carlo Photons</button>
                            <button type="button" data-arcsecs-preset="parallaxCalibration" title="Parallax Calibration: verify the arcsecond, AU, and parsec benchmark where 1 arcsecond resolves to 1 parsec.">Parallax Calibration</button>
                            <button type="button" data-arcsecs-preset="photometricCalibration" title="Photometric Calibration: show aperture/annulus background subtraction, corrected flux, and calibrated magnitude behavior.">Photometry</button>
                            <button type="button" data-arcsecs-preset="rigidBodyDiagnostics" title="Rigid Body / ECS: inspect broadphase, contacts, friction, restitution, spring constraints, and deterministic ECS diagnostics.">Rigid Body / ECS</button>
                            <button type="button" data-arcsecs-preset="sunSimulation" title="Sun Simulation: run the solar gravity scenario with orbit, flux, angular momentum, and numerical stability checks.">Sun Simulation</button>
                            <button type="button" data-arcsecs-preset="darkMatterRamjet" title="Dark Matter Ramjet: run the full pipeline from EIT scoop through HIBE shield, Fishback solenoid, buffer, reactor, thermal system, and exhaust.">Dark Matter Ramjet</button>
                        </div>

                        <div class="arcsecs-section-title"><span>DT</span><strong>Distance-Time Kernel</strong></div>
                        <label>Multi-Messenger Event
                            <select name="distanceTimeEvent" data-arcsecs-distance-time-event="true" title="Choose the real or synthetic event shown by the Distance-Time Kernel and Multi-Messenger Event Theater.">
                                <option value="gw170817">GW170817</option>
                                <option value="gw150914">GW150914</option>
                                <option value="gw190521">GW190521</option>
                                <option value="supernova-light-curve-stretch">Supernova Light-Curve Stretch</option>
                                <option value="hubble-tension">Hubble Tension</option>
                                <option value="gw190814">GW190814</option>
                                <option value="synthetic-nearby-binary-neutron-star">Synthetic Nearby Binary Neutron Star</option>
                                <option value="synthetic-void-line-of-sight">Synthetic Void-Line-of-Sight Event</option>
                                <option value="synthetic-dense-filament">Synthetic Dense-Filament Event</option>
                                <option value="synthetic-agn-disk-diffusion">Synthetic AGN-Disk Diffusion Event</option>
                                <option value="synthetic-missing-counterpart">Synthetic Missing-Counterpart Event</option>
                            </select>
                        </label>
                        <label>Kernel Parallax Arcseconds<input name="distanceTimeParallaxArcseconds" type="number" min="0.000001" step="0.000001" value="0.76813" title="Parallax angle used by the no-lightyear distance estimate." /></label>
                        <label>Kernel Angular Separation Radians<input name="distanceTimeAngularSeparationRadians" type="number" min="0.000000001" step="0.000000001" value="0.000004848" title="Angular separation used by the relational distance estimate." /></label>
                        <label>Kernel Proper Motion arcsec/year<input name="distanceTimeProperMotionArcsecondsPerYear" type="number" min="0" step="0.0001" value="3.85" title="Proper-motion helper used with parsecs, not lightyears." /></label>

                        <div class="arcsecs-section-title"><span>02</span><strong>Runtime</strong></div>
                        <label>Simulation Speed<input name="speedMultiplier" type="range" min="0.1" max="5" step="0.1" value="1" data-arcsecs-speed="true" /></label>
                        <label>Accepted Steps<input name="acceptedSteps" type="number" min="500" max="25000" step="500" value="<?php echo esc_attr((string) $steps); ?>" title="Accepted deterministic worker steps to simulate for each run. Higher values create deeper diagnostics but take longer." /></label>
                        <label>Tired-Light Decay<input name="lossRate" type="number" step="0.001" value="0.042" /></label>
                        <label>Effective Photon Mass<input name="photonMassEv" type="number" step="0.000000000000000001" value="1e-18" /></label>
                        <label>Beta Coupling<input name="betaCoupling" type="number" step="0.05" value="1.25" title="Beta-matter / entropic coupling strength used by the speculative low-acceleration gravity comparison." /></label>
                        <label>Acceleration Threshold<input name="accelerationThreshold" type="number" step="0.01" value="1.2" title="Low-acceleration threshold for MOND/beta-style rotation curve behavior." /></label>
                        <label>Baryonic Mass Proxy<input name="baryonicMass" type="number" step="0.1" value="6.2" title="Baryonic mass proxy for gravity, rotation curve, and lensing scenarios." /></label>
                        <label>Group Velocity Fraction<input name="groupVelocityFraction" type="number" min="0.01" max="1" step="0.01" value="0.08" /></label>
                        <label>Restitution<input name="restitution" type="number" min="0" max="1" step="0.05" value="0.62" /></label>
                        <label>Friction<input name="friction" type="number" min="0" max="1" step="0.05" value="0.24" /></label>
                        
                        <div class="arcsecs-section-title"><span>E</span><strong>Experimental Physics</strong></div>
                        <label>Photon Packet Count<input name="photonPacketCount" type="number" min="8" max="2500" step="8" value="512" title="Photon packet count for Monte Carlo transport and photon visualization modes." /></label>
                        <label>Intergalactic Particle Density<input name="intergalacticParticleDensity" type="number" min="0" max="10" step="0.01" value="1.0" title="Intergalactic particle density proxy for mechanistic tired-light energy-loss encounters." /></label>
                        <label>Forward-Scattering Strictness<input name="forwardScatteringStrictness" type="number" min="0" max="1" step="0.01" value="0.92" title="Forward-scattering strictness. Higher values preserve photon direction more tightly while still allowing energy-loss bookkeeping." /></label>
                        <label>Softening Radius<input name="softeningRadius" type="number" min="0.001" max="10" step="0.001" value="0.16" title="Softening radius for singularity-safe gravity. Prevents force from becoming infinite at very small radius." /></label>
                        <label>Parallax Angle Arcseconds<input name="parallaxArcseconds" type="number" min="0.001" max="1000" step="0.001" value="1" title="Parallax angle in arcseconds. The benchmark is 1 arcsecond resolving to 1 parsec with a 1 AU baseline." /></label>
                        <label>Baseline AU<input name="baselineAu" type="number" min="0.01" max="20" step="0.01" value="1" title="Observer baseline in astronomical units for parallax calibration." /></label>
                        <label>Aperture Radius<input name="apertureRadius" type="number" min="1" max="80" step="1" value="12" title="Photometric aperture radius used to collect simulated star flux." /></label>
                        <label>Sky Background Level<input name="backgroundSkyLevel" type="number" min="0" max="500" step="1" value="24" /></label>

                        <div class="arcsecs-section-title arcsecs-ramjet-controls-title"><span>R</span><strong>Ramjet Pipeline</strong></div>
                        <label>Ramjet Mission Preset
                            <select name="ramjetPreset" data-arcsecs-ramjet-preset-select="true">
                                <option value="stableCruise">Stable Cruise</option>
                                <option value="lowSubstrateDensity">Low Substrate Density</option>
                                <option value="highVelocityDragStress">High Velocity Drag Stress</option>
                                <option value="shieldAblationEvent">Shield Ablation Event</option>
                                <option value="thermalOverload">Thermal Overload</option>
                                <option value="bufferSaturation">Buffer Saturation</option>
                                <option value="reactorEfficiencySweep">Reactor Efficiency Sweep</option>
                                <option value="emergencyIntakeShutdown">Emergency Intake Shutdown</option>
                                <option value="maximumFieldCapture">Maximum Field Capture</option>
                                <option value="educationalSlowMotion">Educational Slow-Motion</option>
                            </select>
                        </label>
                        <div class="arcsecs-ramjet-preset-buttons" aria-label="Ramjet mission presets">
                            <button type="button" data-arcsecs-ramjet-preset="stableCruise" title="Stable Cruise: balanced nominal ramjet operation with no expected critical warnings.">Stable Cruise</button>
                            <button type="button" data-arcsecs-ramjet-preset="highVelocityDragStress" title="High Velocity Drag Stress: increases velocity and intake loading to stress the Fishback drag-reduction model.">Drag Stress</button>
                            <button type="button" data-arcsecs-ramjet-preset="thermalOverload" title="Thermal Overload: reduces thermal margin so waste heat and radiator load warnings become visible.">Thermal Overload</button>
                            <button type="button" data-arcsecs-ramjet-preset="bufferSaturation" title="Buffer Saturation: drives the stationary-light buffer toward capacity to test storage warnings.">Buffer Saturation</button>
                            <button type="button" data-arcsecs-ramjet-preset="emergencyIntakeShutdown" title="Emergency Intake Shutdown: reduces capture/intake flow to test starvation and shutdown behavior.">Intake Shutdown</button>
                            <button type="button" data-arcsecs-ramjet-preset="maximumFieldCapture" title="Maximum Field Capture: expands scoop gain and substrate capture to stress compression, buffer, and thermal systems.">Max Capture</button>
                        </div>
                        <label>Comparison Mode
                            <select name="comparisonMode">
                                <option value="fullPipeline">Full Pipeline</option>
                                <option value="noScoop">No Scoop vs EIT Scoop</option>
                                <option value="noHibeShield">No HIBE Shield vs HIBE Shield</option>
                                <option value="noFishback">No Fishback vs Drag-Decoupled</option>
                                <option value="undersizedRadiator">Undersized Radiator vs Stable Thermal</option>
                                <option value="wideExhaust">Wide Exhaust vs Collimated Exhaust</option>
                            </select>
                        </label>
                        <label>Failure Injection
                            <select name="failureInjectionMode">
                                <option value="none">None</option>
                                <option value="micrometeorBurst">Micrometeor Burst</option>
                                <option value="solenoidQuench">Solenoid Quench</option>
                                <option value="radiatorPanelLoss">Radiator Panel Loss</option>
                                <option value="bufferSaturation">Buffer Saturation</option>
                                <option value="bufferDecoherence">Buffer Decoherence</option>
                                <option value="wideExhaust">Wide Exhaust</option>
                                <option value="shieldOverload">Shield Overload</option>
                                <option value="exhaustPhaseJitter">Exhaust Phase Jitter</option>
                            </select>
                        </label>
                        <div class="arcsecs-button-row arcsecs-failure-buttons" data-arcsecs-failure-buttons="true" aria-label="Failure injection buttons">
                            <button type="button" data-arcsecs-failure-inject="micrometeorBurst" aria-pressed="false" title="Inject a micrometeor burst so shield ablation and hazard warnings visibly increase.">Micrometeor Burst</button>
                            <button type="button" data-arcsecs-failure-inject="solenoidQuench" aria-pressed="false" title="Inject a Fishback solenoid quench so drag load increases and net acceleration drops.">Solenoid Quench</button>
                            <button type="button" data-arcsecs-failure-inject="radiatorPanelLoss" aria-pressed="false" title="Inject radiator panel loss so thermal load rises and reactor output is capacity limited.">Radiator Panel Loss</button>
                            <button type="button" data-arcsecs-failure-inject="bufferSaturation" aria-pressed="false" title="Inject buffer saturation so buffer fill and warning state visibly change.">Buffer Saturation</button>
                            <button type="button" data-arcsecs-failure-inject="bufferDecoherence" aria-pressed="false" title="Inject buffer decoherence so coherence and reactor stability visibly drop.">Buffer Decoherence</button>
                            <button type="button" data-arcsecs-failure-inject="wideExhaust" aria-pressed="false" title="Inject wide exhaust so collimation drops, thrust falls, and exhaust warnings appear.">Wide Exhaust</button>
                            <button type="button" data-arcsecs-failure-inject="shieldOverload" aria-pressed="false" title="Inject shield overload so HIBE protection, crew-dose proxy, and readiness visibly degrade.">Shield Overload</button>
                        </div>
                        <label>Stabilization Gain<input name="stabilizationGain" type="number" min="0" max="2" step="0.01" value="1.0" /></label>
                        <label>Radiator Reserve<input name="radiatorReserve" type="number" min="0" max="2" step="0.01" value="0.35" /></label>
                        <label>Habitat Isolation Factor<input name="habitatIsolationFactor" type="number" min="0" max="1" step="0.01" value="0.82" /></label>
                        <label>Scoop Field Diameter km<input name="scoopFieldDiameterKilometers" type="number" min="100" max="12000" step="100" value="4000" /></label>
                        <label>Substrate Density<input name="substrateDensity" type="number" min="0" max="5" step="0.05" value="1.0" /></label>
                        <label>Ship Velocity c<input name="shipVelocityRatioC" type="number" min="0.01" max="0.95" step="0.01" value="0.32" /></label>
                        <label>Intake Drag Coefficient<input name="intakeDragCoefficient" type="number" min="0" max="5" step="0.05" value="0.9" /></label>
                        <label>Shield Ablation Rate<input name="shieldAblationRate" type="number" min="0" max="1" step="0.01" value="0.08" /></label>
                        <label>Compression Ratio<input name="compressionRatio" type="number" min="1" max="60" step="1" value="18" /></label>
                        <label>Buffer Capacity<input name="bufferCapacity" type="number" min="0.1" max="200" step="0.1" value="48" /></label>
                        <label>Reactor Conversion Efficiency<input name="reactorConversionEfficiency" type="number" min="0.01" max="0.99" step="0.01" value="0.74" /></label>
                        <label>Thermal Rejection Capacity<input name="thermalRejectionCapacity" type="number" min="0.1" max="200" step="0.1" value="36" /></label>
                        <label>Exhaust Collimation Efficiency<input name="exhaustCollimationEfficiency" type="number" min="0.01" max="0.99" step="0.01" value="0.86" /></label>

                        <div class="arcsecs-section-title"><span>03</span><strong>Overlays</strong></div>
                        <label class="arcsecs-toggle"><input name="showLabels" type="checkbox" checked /> Toggle labels</label>
                        <label class="arcsecs-toggle"><input name="showGrid" type="checkbox" checked /> Toggle grid</label>
                        <label class="arcsecs-toggle"><input name="showVectors" type="checkbox" checked /> Toggle vectors</label>
                        <label class="arcsecs-toggle"><input name="showTrails" type="checkbox" checked /> Toggle trails</label>
                        <label class="arcsecs-toggle"><input name="showDiagnostics" type="checkbox" checked /> Toggle diagnostics</label>

                        <div class="arcsecs-section-title"><span>04</span><strong>Scene IO</strong></div>
                        <div class="arcsecs-button-row">
                            <button type="button" data-arcsecs-benchmark="true" title="Run the Validation Lab and benchmark suite. This checks parallax, photon ledger, finite telemetry, speculative labels, and scenario health.">Run Validation Lab</button>
                            <button type="button" data-arcsecs-export-benchmark="true" title="Export the latest automated benchmark suite as JSON for reproducibility and review.">Export Benchmark JSON</button>
                            <button type="button" data-arcsecs-export-certificate="true" title="Export the latest calibration certificate with arcsecond/parsec, photon ledger, finite telemetry, and photometric sanity checks.">Export Calibration Certificate</button>
                            <button type="button" data-arcsecs-export-quality-gate="true" title="Export the quality gate report covering telemetry, TDD pass rate, safe JSON import, no framework-style dependencies and scientific caution guardrails.">Export Quality Gate</button>
                            <button type="button" data-arcsecs-export-release-packet="true" title="Export a release-readiness packet containing validation, quality, scenario, and operator-readiness information.">Export Release Packet</button>
                            <button type="button" data-arcsecs-export-runbook="true" title="Export the operator runbook for the current scenario and recommended validation procedure.">Export Operator Runbook</button>
                            <button type="button" data-arcsecs-copy-summary="true" title="Copy the Operator Summary text to the clipboard.">Copy Operator Summary</button>
                            <button type="button" data-arcsecs-run-queue="true" title="Run or display the guided experiment queue across the major ArcSecs research modes.">Run Experiment Queue</button>
                            <button type="button" data-arcsecs-grand-tour="true" title="Run the Grand Experiment Director scripted sweep across the nine prompt-required research modes.">Run Grand Experiment</button>
                            <button type="button" data-arcsecs-export-evidence-packet="true" title="Export the latest Grand Experiment evidence packet as inert JSON for sharing or review.">Export Evidence Packet</button>
                            <button type="button" data-arcsecs-export-flight-recorder="true" title="Export the visible Autopilot Flight Recorder timeline as inert JSON. This does not include executable code and is safe to attach to bug reports or research notes.">Export Flight Recorder</button>
                            <button type="button" data-arcsecs-export-guided-tour="true" title="Export the Guided Autopilot Tour stage state, evidence summary, and caution labels as inert JSON.">Export Guided Tour</button>
                            <button type="button" data-arcsecs-build-review-cockpit="true" title="Build the Review Cockpit summary from the latest Grand Experiment, Guided Tour, Flight Recorder, and current metrics.">Build Review Cockpit</button>
                            <button type="button" data-arcsecs-export-review-cockpit="true" title="Export the Review Cockpit visitor summary, physicist summary, assumption risk, and next actions as inert JSON.">Export Review Cockpit</button>
                            <button type="button" data-arcsecs-do-next-actions="true" title="Execute the Review Cockpit next-action queue: start the guided tour, open weakest stage, inspect the ledger, run the sweep, and prepare review export work where available.">Do Next Actions</button>
                            <button type="button" data-arcsecs-export-research-bundle="true" title="Export a single cautious research bundle containing next-action plan, Review Cockpit, Grand Experiment, Guided Tour, Flight Recorder, and latest metrics.">Export Research Bundle</button>
                            <button type="button" data-arcsecs-export-scene="true" title="Export the current scenario, settings, entities, overlays, and model state as safe JSON.">Export Scene JSON</button>
                            <label class="arcsecs-import-button" title="Import a previously exported scene JSON file. The plugin validates scenario type, numeric values, and structure before loading; it never executes imported JSON.">Import Scene JSON<input type="file" accept="application/json,.json" data-arcsecs-import-scene="true" /></label>
                            <button type="button" data-arcsecs-screenshot="true" title="Save a screenshot of the current canvas visualization.">Screenshot</button>
                            <button type="button" data-arcsecs-clear-memory="true" title="Clear saved local browser run memory for this demo only.">Clear Memory</button>
                        </div>
                    </form>
                </aside>

                <section class="arcsecs-viewport-column" data-testid="center-stage" data-arcsecs-center-scroll="true" aria-label="Central visualization" title="Center stage: independently scrollable simulation column. The viewport remains prioritized while spotlight cards, telemetry, graphs, and explanation strips scroll inside this middle section instead of forcing the entire page to move.">
                    <div class="arcsecs-current-model" data-arcsecs-current-model="true">
                        <strong>ArcSecs Physics Engine Concept</strong>
                        <span>No-spacetime relational simulation demo.</span>
                    </div>
                    <div class="arcsecs-research-ribbon" aria-label="Active scenario research summary">
                        <span><em>Active Scenario</em><strong data-arcsecs-ribbon-scenario="true">Relational Lattice</strong></span>
                        <span><em>Invariant</em><strong data-arcsecs-ribbon-invariant="true">relation graph stable</strong></span>
                        <span><em>Baseline Δ</em><strong data-arcsecs-ribbon-delta="true">—</strong></span>
                        <span><em>Risk</em><strong data-arcsecs-ribbon-risk="true">pending</strong></span>
                    </div>
                    <section class="arcsecs-scenario-spotlight" data-arcsecs-scenario-spotlight="true" aria-label="Scenario spotlight: what to see, what to try, and what would falsify the model" title="Scenario Spotlight: a short bridge between the scientific cockpit and normal visitors. It explains what the current mode shows, what to try next, and what kind of failure would matter.">
                        <article><strong>What you are seeing</strong><span data-arcsecs-spotlight-see="true">Run a scenario to load the visual interpretation.</span></article>
                        <article><strong>Try this</strong><span data-arcsecs-spotlight-try="true">Move one control, rerun, and watch the graph and ledger change.</span></article>
                        <article><strong>What would break it</strong><span data-arcsecs-spotlight-falsify="true">Failed ledger checks, unstable telemetry, or a baseline mismatch should trigger review.</span></article>
                    </section>

                    <section class="arcsecs-run-guide" data-arcsecs-run-guide="true" aria-label="How to use this scenario" title="How to use this scenario: a quick-start panel that explains exactly what Run, Step, and the main visualization are supposed to do so the center stage never feels empty or unclear.">
                        <header><strong>How to Use This Scenario</strong><span data-arcsecs-run-helper-state="true">waiting for run</span></header>
                        <div class="arcsecs-run-guide-grid" data-arcsecs-run-guide-grid="true">
                            <article><strong>1. Choose a scenario</strong><span>The left column selects the model you want to inspect. The active choice sets the viewport, graphs, and right-hand explanation panels.</span></article>
                            <article><strong>2. Click Run Scenario</strong><span>The main viewport redraws, telemetry updates, and the bottom graphs start showing the active model signal and the comparison / ledger signal.</span></article>
                            <article><strong>3. Use Step for inspection</strong><span>Step advances one deterministic tick. Use it when you want to see small changes without a full rerun.</span></article>
                            <article><strong>4. Check evidence</strong><span>Use the checklist below to confirm the run produced finite telemetry, meaningful structure, and a non-failing ledger.</span></article>
                        </div>
                        <p class="arcsecs-run-guide-note" data-arcsecs-run-helper="true">Nothing is broken if the large viewport area looks quiet before a run. It is the live canvas stage. After you run a scenario, the viewport, telemetry strip, and the two bottom graphs should update together.</p>
                    </section>

                    <section class="arcsecs-evidence-checklist" data-arcsecs-evidence-checklist="true" aria-label="Scenario evidence checklist" title="Scenario Evidence Checklist: turns the current run into a short set of evidence questions that a visitor or physicist can verify before trusting the visualization.">
                        <header><strong>Scenario Evidence Checklist</strong><span data-arcsecs-evidence-score="true">waiting for run</span></header>
                        <div data-arcsecs-evidence-items="true">
                            <div class="arcsecs-evidence-empty-state">
                                <strong>What will appear here?</strong>
                                <p>After you click <em>Run Scenario</em>, this panel will turn into a short evidence checklist for the current mode.</p>
                                <ol>
                                    <li>The viewport will redraw the active scenario.</li>
                                    <li>The telemetry strip will update counters like entities, photons, and solver links.</li>
                                    <li>The bottom left graph will show the main scenario signal.</li>
                                    <li>The bottom right graph will show the baseline, comparison branch, or energy ledger signal.</li>
                                </ol>
                            </div>
                        </div>
                    </section>


                    <section class="arcsecs-readiness-sweep-panel arcsecs-scenario-card-deck" data-arcsecs-scenario-cards="true" aria-label="Scenario cards with purpose hypothesis baseline signal falsification and export evidence">
                        <header><span>Scenario Cards</span><h2>What each major scenario is trying to test</h2><p>Each card names the plain-language purpose, active hypothesis, standard reference, visible signal, failure signal, and export evidence produced.</p></header>
                        <div class="arcsecs-scenario-card-grid">
                            <article data-arcsecs-scenario-card="distance-time-kernel"><h3>Distance-Time Kernel</h3><p><strong>Purpose:</strong> compare parsec distance and clockless progression against gravity-first/light-later messenger behavior.</p><p><strong>Hypothesis:</strong> light can lag, fade, redden, blur, or disappear along dense lines of sight.</p><p><strong>Standard reference:</strong> multi-messenger arrival timing with gravity-wave baseline and electromagnetic counterpart notes.</p><p><strong>Visible signal:</strong> Gravity Arrival, Photon Arrival, Photon Delay, Photon Energy, Refractive Index, and Visibility change together.</p><p><strong>Falsification:</strong> photon delay does not scale with density or missing-counterpart status is presented as proof.</p><p><strong>Export:</strong> distance-time kernel state, claim map, event theater, validation ledger, and quality gate.</p></article>
                            <article data-arcsecs-scenario-card="relational-lattice"><h3>Relational Lattice</h3><p><strong>Purpose:</strong> show material nodes and derived distances without treating the canvas as physical spacetime.</p><p><strong>Hypothesis:</strong> relationships and observer frames can be rendered as labels over a relational graph.</p><p><strong>Standard reference:</strong> coordinate geometry used as a display tool rather than ontology.</p><p><strong>Visible signal:</strong> relation edges, solver links, invariant state, and baseline delta update after a run.</p><p><strong>Falsification:</strong> relation graph produces non-finite telemetry or cannot preserve a stable measurement frame.</p><p><strong>Export:</strong> scene JSON, validation rows, scenario passport, and operator runbook.</p></article>
                            <article data-arcsecs-scenario-card="tired-light-ledger"><h3>Tired-Light Photon Energy Ledger</h3><p><strong>Purpose:</strong> expose photon energy loss, redshift proxy, and ledger closure as inspectable values.</p><p><strong>Hypothesis:</strong> a normalized energy-loss branch can be compared against a reference no-loss branch.</p><p><strong>Standard reference:</strong> cosmological redshift and photometric attenuation are the comparison baseline.</p><p><strong>Visible signal:</strong> photon energy decreases while ledger transfer and closure error remain visible.</p><p><strong>Falsification:</strong> energy ledger fails closure or the branch cannot separate attenuation from redshift proxy.</p><p><strong>Export:</strong> benchmark JSON, calibration certificate, evidence packet, and research bundle.</p></article>
                            <article data-arcsecs-scenario-card="proca-dispersion"><h3>Massive Photon / Proca Dispersion</h3><p><strong>Purpose:</strong> compare a massless photon branch with an effective massive-photon delay branch.</p><p><strong>Hypothesis:</strong> lower-frequency packets lag more strongly in the speculative branch.</p><p><strong>Standard reference:</strong> massless photon propagation constrained by standard electromagnetic expectations.</p><p><strong>Visible signal:</strong> branch divergence appears in arrival delay and dispersion telemetry.</p><p><strong>Falsification:</strong> Proca branch is indistinguishable from the massless baseline within the selected run.</p><p><strong>Export:</strong> telemetry, warnings, falsification notes, and comparison graph metadata.</p></article>
                            <article data-arcsecs-scenario-card="lensing"><h3>Flat-Space / Massive Photon Lensing</h3><p><strong>Purpose:</strong> compare Soldner-style deflection, GR reference labeling, and massive-photon correction as separate branches.</p><p><strong>Hypothesis:</strong> normalized branch deltas can be visually compared without claiming a replacement for GR.</p><p><strong>Standard reference:</strong> standard gravitational lensing baseline remains a named reference.</p><p><strong>Visible signal:</strong> deflection, smear, PSF width, and comparison graph deltas change.</p><p><strong>Falsification:</strong> branch labels blur together or non-finite deflection appears.</p><p><strong>Export:</strong> scene JSON, source notes, comparison branch telemetry, and validation status.</p></article>
                            <article data-arcsecs-scenario-card="mond-parallax-ramjet"><h3>MOND / Parallax / Ramjet</h3><p><strong>Purpose:</strong> inspect calibration and low-acceleration or propulsion-themed comparison modes under cautious labels.</p><p><strong>Hypothesis:</strong> MOND-like curves, parsec calibration, and ramjet accounting can be tested as normalized visualization branches.</p><p><strong>Standard reference:</strong> Newtonian rotation curves, one arcsecond / one AU / one parsec calibration, and conservation-style engineering ledgers.</p><p><strong>Visible signal:</strong> calibration error, branch spread, fuel, drag, heat, and warning state change.</p><p><strong>Falsification:</strong> one arcsecond no longer maps to one parsec, or fuel rises without heat, drag, or risk.</p><p><strong>Export:</strong> calibration certificate, operator runbook, evidence packet, and release packet.</p></article>
                        </div>
                    </section>

                    <section class="arcsecs-readiness-sweep-panel arcsecs-standard-comparison-panel" data-arcsecs-standard-comparison="true" aria-label="Standard-reference comparison layer">
                        <header><span>Standard-Reference Comparison</span><h2>Reference expectations and what ArcSecs changes</h2><p>These notes make the comparison layer explicit. They do not claim the alternative branch is established.</p></header>
                        <div class="arcsecs-comparison-table" role="table" aria-label="Scenario comparison notes">
                            <div role="row"><strong role="columnheader">Scenario</strong><strong role="columnheader">Standard expectation</strong><strong role="columnheader">ArcSecs branch</strong><strong role="columnheader">Telemetry divergence</strong><strong role="columnheader">Weakens if</strong></div>
                            <div role="row"><span>Distance-Time Kernel</span><span>Gravity and light timing are compared from source and propagation budgets.</span><span>Gravity baseline stays first while photon packet can delay, redshift, weaken, stretch, blur, become uncertain, or be missing.</span><span>Gravity Arrival, Photon Arrival, Photon Delay, Photon Energy, Refractive Index, Visibility.</span><span>Delay fails to scale with line-of-sight density or intrinsic source delay is mixed with propagation delay.</span></div>
                            <div role="row"><span>Relational Lattice</span><span>Coordinates are a useful mathematical reference.</span><span>Rendered coordinates are labels over material relation edges.</span><span>Solver Links, invariant state, relation graph stability.</span><span>Finite tick behavior or relation consistency fails.</span></div>
                            <div role="row"><span>Tired-Light Ledger</span><span>Redshift is primarily expansion / standard cosmology comparison.</span><span>Photon energy loss is shown as a normalized proxy with an explicit energy ledger.</span><span>Photon Energy, Tired-Light Loss, ledger closure error.</span><span>Ledger closure fails or coupling drift is confused with tired-light loss.</span></div>
                            <div role="row"><span>Massive Photon / Proca</span><span>Photons are massless in the standard electromagnetic baseline.</span><span>Effective massive-photon branch adds frequency-dependent lag.</span><span>Photon Arrival, Photon Delay, dispersion branch delta.</span><span>Branch becomes indistinguishable from the massless baseline.</span></div>
                            <div role="row"><span>Lensing</span><span>GR lensing is the named standard reference.</span><span>Flat-space or massive-photon branches are shown as visual comparison overlays.</span><span>Deflection, PSF width, smear, branch delta.</span><span>Labels imply proof or branch outputs become non-finite.</span></div>
                            <div role="row"><span>MOND Rotation Curves</span><span>Newtonian decline plus dark matter modeling is the comparison context.</span><span>MOND-style low-acceleration branch is educational/speculative comparison.</span><span>Rotation curve spread and warning state.</span><span>Branch does not differ from baseline or claims are overstated.</span></div>
                            <div role="row"><span>Parallax Calibration</span><span>One arcsecond at one AU corresponds to one parsec.</span><span>ArcSecs uses this as a hard calibration sanity check.</span><span>Calibration error, parsec/arcsecond outputs.</span><span>One arcsecond no longer maps to one parsec.</span></div>
                            <div role="row"><span>Dark Matter Ramjet</span><span>No established dark matter propulsion technology exists.</span><span>Fuel, heat, drag, and risk are simulator accounting proxies.</span><span>Fuel, thermal load, Weber drag, Proca density, warning state.</span><span>Fuel increases without heat, drag, or risk.</span></div>
                        </div>
                    </section>

                    <section class="arcsecs-readiness-sweep-panel arcsecs-equation-panel" data-arcsecs-assumptions-equations="true" aria-label="Assumptions and equations panel">
                        <header><span>Assumptions and Equations</span><h2>What the simulator is doing, not what it proves</h2><p>Values are labeled as direct controls, derived telemetry, normalized proxies, exaggerated visual ranges, or placeholders.</p></header>
                        <div class="arcsecs-equation-grid">
                            <article><h3>Parameter names and units</h3><p>Distances use parsec, arcsecond, AU, pixels, or normalized render units depending on scenario. Controls that are normalized are labeled as normalized proxy values.</p></article>
                            <article><h3>Simplified pseudo-formulas</h3><p><code>Photon Delay ≈ Propagation Delay Budget + Intrinsic Source Delay</code>; <code>Propagation Delay Budget ≈ Line-of-Sight Density × Refractive Index Proxy</code>; <code>Ledger Closure ≈ Photon Loss - Substrate Gain</code>.</p></article>
                            <article><h3>Exaggerated for visualization</h3><p>Extreme density, Proca coupling, ramjet fuel, lensing smear, and drive telemetry ranges are intentionally exaggerated so the browser view visibly changes.</p></article>
                            <article><h3>Derived versus controlled</h3><p>Scenario controls and sliders are direct inputs. Photon delay, energy, visibility, calibration error, route risk, and validation status are derived telemetry.</p></article>
                            <article><h3>Placeholders</h3><p>Locked roadmap modes remain labeled as placeholders. They do not activate propulsion, runtime execution, credential checks, or private network behavior.</p></article>
                            <article><h3>Exported evidence</h3><p>Exports are inert JSON: package version, route, scenario, parameters, derived telemetry, warnings, falsification notes, speculative boundary text, and source/reference notes.</p></article>
                        </div>
                    </section>

                    <section class="arcsecs-readiness-sweep-panel arcsecs-shared-falsification-panel" data-arcsecs-evidence-falsification="true" aria-label="Shared evidence and falsification module">
                        <header><span>Evidence and Falsification</span><h2>What would make a run weaker?</h2><p>A good run is screenshot-ready only when the visible scene, telemetry, comparison baseline, evidence export, warnings, and falsification note agree.</p></header>
                        <ul>
                            <li>Photon delay does not scale with density.</li>
                            <li>Energy ledger fails closure.</li>
                            <li>Standard reference and ArcSecs branch become indistinguishable.</li>
                            <li>Calibration no longer maps one arcsecond and one AU to one parsec.</li>
                            <li>Telemetry becomes non-finite.</li>
                            <li>Dense substrate increases fuel without increasing heat, drag, or risk.</li>
                            <li>Torsion field produces no route curvature.</li>
                            <li>Replay export cannot reproduce the original route.</li>
                            <li>Missing-counterpart event is presented as proof instead of uncertainty.</li>
                        </ul>
                    </section>

                    <section class="arcsecs-readiness-sweep-panel arcsecs-source-reference-panel" data-arcsecs-source-reference-panel="true" aria-label="Sources and standard references panel">
                        <header><span>Sources and Standard References</span><h2>Compact reference anchors for comparison</h2><p>Where exact project citations already exist, use those. Missing references are marked as source-note placeholders for later citation completion.</p></header>
                        <ul>
                            <li>Parsec / arcsecond / parallax calibration: one arcsecond at one AU to one parsec sanity check.</li>
                            <li>Gravitational-wave standard sirens and GW170817 / GRB 170817A timing: multi-messenger comparison anchors.</li>
                            <li>Gravitational lensing baseline and standard cosmology comparison: named standard-reference panels.</li>
                            <li>MOND: comparison model for low-acceleration rotation-curve behavior.</li>
                            <li>Proca / massive photon, tired-light, and teleparallel gravity: speculative or alternative-source-note placeholders pending deeper citation completion.</li>
                            <li>Observational falsification principle: every scenario should name what would weaken the interpretation.</li>
                        </ul>
                    </section>

                    <section class="arcsecs-readiness-sweep-panel arcsecs-scientific-source-matrix" data-arcsecs-scientific-source-matrix="true" aria-label="Scientific Source Matrix with scenario assumptions and falsification triggers">
                        <header>
                            <span>Scientific Source Matrix</span>
                            <h2>Scenario-to-source audit map</h2>
                            <p>Each row separates standard expectation, ArcSecs hypothesis behavior, normalized controls, derived telemetry, exported evidence, and what would weaken the interpretation.</p>
                        </header>
                        <div class="arcsecs-source-matrix-table-wrap" tabindex="0" aria-label="Scrollable scientific source matrix">
                            <table class="arcsecs-source-matrix-table">
                                <thead><tr><th>Scenario</th><th>Source / reference note</th><th>Standard expectation</th><th>ArcSecs alternative assumption</th><th>Normalized parameter</th><th>Derived telemetry</th><th>Export evidence</th><th>Falsification trigger</th><th>Citation status</th></tr></thead>
                                <tbody>
                                    <tr data-arcsecs-source-matrix-row="distanceTimeKernel"><th>Distance-Time Kernel</th><td>Project note anchored to parsec distance and multi-messenger timing.</td><td>Light and gravity propagation are compared through standard relativistic timing references.</td><td>Gravity-wave baseline remains the route reference while electromagnetic packets may lag, weaken, redshift, blur, or disappear.</td><td>Line-of-Sight Density; Refractive Index proxy.</td><td>Gravity Arrival; Photon Arrival; Photon Delay; Visibility.</td><td>Distance-Time export bundle and claim map state.</td><td>Photon delay fails to scale with density or hides intrinsic source delay.</td><td>project-note</td></tr>
                                    <tr data-arcsecs-source-matrix-row="relationalLattice"><th>Relational Lattice</th><td>Project note for node-link relational visualization.</td><td>Coordinate systems normally label events against a metric geometry.</td><td>Scene state is treated as relational edges and solver links in flat labels.</td><td>Node count; Link strength proxy.</td><td>Solver Links; constraint count; finite tick state.</td><td>Benchmark JSON and scene JSON.</td><td>Relational links fail to produce deterministic visible changes.</td><td>project-note</td></tr>
                                    <tr data-arcsecs-source-matrix-row="tiredLightEnergyLedger"><th>Tired-Light Photon Energy Ledger</th><td>Historical alternative redshift source note; citation completion pending.</td><td>Cosmological redshift is usually modeled through expansion plus source/environment effects.</td><td>Photon energy loss is tracked as a ledger and compared against substrate gain.</td><td>Tired-Light Loss; Substrate Coupling proxy.</td><td>Photon Energy; Energy Ledger Closure; Visibility.</td><td>Evidence Packet and notebook JSON.</td><td>Ledger fails closure or loss is presented as proof rather than a test.</td><td>placeholder-needed</td></tr>
                                    <tr data-arcsecs-source-matrix-row="massivePhotonProca"><th>Massive Photon / Proca Dispersion</th><td>Proca / massive photon speculative extension source note.</td><td>Photons are massless in standard electromagnetism.</td><td>Effective massive-photon proxy can alter propagation and blur response for visualization.</td><td>Proca density; coupling drift proxy.</td><td>Photon Delay; Refractive Index; PSF blur; propagation budget.</td><td>Sensitivity report and comparison workbench.</td><td>Proca changes produce non-finite telemetry or no separable divergence.</td><td>future-research</td></tr>
                                    <tr data-arcsecs-source-matrix-row="flatSpaceLensing"><th>Flat-Space Lensing</th><td>Gravitational lensing baseline comparison note.</td><td>General relativity predicts lensing through curved spacetime geometry.</td><td>Flat-space branch uses a visual deflection proxy against the standard baseline.</td><td>Mass proxy; impact parameter proxy.</td><td>Deflection angle; lensing residual; baseline divergence.</td><td>Scene JSON and benchmark JSON.</td><td>Flat branch becomes indistinguishable from baseline or exaggeration is unlabeled.</td><td>confirmed</td></tr>
                                    <tr data-arcsecs-source-matrix-row="massivePhotonLensing"><th>Massive Photon Lensing</th><td>Massive photon lensing comparison source note.</td><td>Massless photon paths are compared against GR lensing expectations.</td><td>Massive-photon proxy adds dispersion and deflection differences for falsification testing.</td><td>Photon mass proxy; lens density proxy.</td><td>Deflection residual; photon lag; visibility status.</td><td>Review cockpit and scene export.</td><td>Massive-photon branch cannot be separated from numerical noise.</td><td>future-research</td></tr>
                                    <tr data-arcsecs-source-matrix-row="mondRotationCurves"><th>MOND Rotation Curves</th><td>MOND comparison model source note.</td><td>Galaxy rotation curves are usually compared with dark-matter halo models or modified dynamics.</td><td>ArcSecs uses MOND as an external comparison branch, not a proof target.</td><td>Acceleration scale proxy; baryon mass proxy.</td><td>Rotation velocity; residual; fit warning.</td><td>Benchmark JSON and sensitivity report.</td><td>MOND and ArcSecs branches are conflated or residuals vanish without explanation.</td><td>confirmed</td></tr>
                                    <tr data-arcsecs-source-matrix-row="parallaxCalibration"><th>Parallax Calibration</th><td>Parsec / arcsecond / AU calibration anchor.</td><td>One arcsecond of parallax at one AU maps to one parsec.</td><td>ArcSecs uses this as a hard calibration sanity check before speculative scenarios.</td><td>Parallax arcseconds; AU baseline.</td><td>Parsec distance; calibration error; pass/fail gate.</td><td>Calibration Certificate.</td><td>One arcsecond and one AU no longer map to one parsec.</td><td>confirmed</td></tr>
                                    <tr data-arcsecs-source-matrix-row="darkMatterRamjet"><th>Dark Matter Ramjet</th><td>Project note for educational drive visualization and locked future concepts.</td><td>No established dark matter propulsion system exists.</td><td>Ramjet controls are model telemetry and exaggerated browser visualization only.</td><td>Density strength; fuel proxy; thermal proxy.</td><td>Fuel; Heat; Drag; Route Risk; Export readiness.</td><td>Flight Recorder, Evidence Packet, Mission Export JSON.</td><td>Dense substrate increases fuel without heat, drag, or risk.</td><td>project-note</td></tr>
                                    <tr data-arcsecs-source-matrix-row="multiMessengerEvents"><th>Multi-Messenger Events</th><td>GW170817 / GRB 170817A and standard-siren comparison anchors.</td><td>Intrinsic source delay and line-of-sight propagation delay must remain separate.</td><td>Photon counterpart may be delayed, weakened, stretched, blurred, uncertain, or missing.</td><td>Intrinsic Source Delay; Propagation Delay Budget.</td><td>Gravity Arrival; Photon Arrival; Photon Delay; Tired-Light Loss; Coupling Drift.</td><td>Event Theater export and Research Bundle.</td><td>Missing counterpart is presented as proof instead of uncertainty.</td><td>confirmed</td></tr>
                                </tbody>
                            </table>
                        </div>
                    </section>

                    <section class="arcsecs-readiness-sweep-panel arcsecs-scenario-equation-library" data-arcsecs-scenario-equation-library="true" aria-label="Scenario Equation Library with simplified formulas and pseudo-formulas">
                        <header>
                            <span>Scenario Equation Library</span>
                            <h2>What the simulator is doing, without false precision</h2>
                            <p>These formulas are simplified visibility and telemetry contracts. Rows marked pseudo-formula are normalized model proxies, not empirical proof.</p>
                        </header>
                        <div class="arcsecs-equation-library-grid">
                            <article data-arcsecs-equation-row="distanceTimeKernel"><h3>Distance-Time Kernel</h3><p><code>Photon Delay ≈ Intrinsic Source Delay + Propagation Delay Budget</code></p><ul><li>Units: ticks, seconds, normalized density.</li><li>Controlled: line-of-sight density, refractive index proxy.</li><li>Derived: Gravity Arrival, Photon Arrival, Photon Delay, Visibility.</li><li>Weakens if: propagation and intrinsic delays are mixed.</li></ul></article>
                            <article data-arcsecs-equation-row="relationalLattice"><h3>Relational Lattice</h3><p><code>Visible Change ≈ Σ(Relational Edge Strength × Solver Step)</code> — pseudo-formula.</p><ul><li>Units: normalized graph units.</li><li>Controlled: node and edge presets.</li><li>Derived: Solver Links, finite tick status.</li><li>Weakens if: repeated ticks are not deterministic.</li></ul></article>
                            <article data-arcsecs-equation-row="tiredLightEnergyLedger"><h3>Tired-Light Photon Energy Ledger</h3><p><code>Ledger Closure ≈ Photon Energy Loss - Substrate Gain</code> — pseudo-formula.</p><ul><li>Units: normalized energy proxy.</li><li>Controlled: loss rate and coupling proxy.</li><li>Derived: Photon Energy, Tired-Light Loss, closure warning.</li><li>Weakens if: energy loss has no matching ledger entry.</li></ul></article>
                            <article data-arcsecs-equation-row="massivePhotonProca"><h3>Massive Photon / Proca Dispersion</h3><p><code>Dispersion Proxy ≈ Proca Density × Coupling Drift</code> — pseudo-formula.</p><ul><li>Units: normalized density and drift.</li><li>Controlled: Proca density proxy.</li><li>Derived: Photon Delay, blur, refractive index.</li><li>Weakens if: proxy creates non-finite values.</li></ul></article>
                            <article data-arcsecs-equation-row="flatSpaceLensing"><h3>Flat-Space Lensing</h3><p><code>Deflection Residual ≈ Flat-Space Proxy - Standard Baseline</code> — pseudo-formula.</p><ul><li>Units: degrees or normalized viewport offset.</li><li>Controlled: mass proxy and impact proxy.</li><li>Derived: lensing residual and comparison warning.</li><li>Weakens if: exaggeration is unlabeled.</li></ul></article>
                            <article data-arcsecs-equation-row="massivePhotonLensing"><h3>Massive Photon Lensing</h3><p><code>Massive-Photon Deflection ≈ Baseline Deflection + Dispersion Term</code> — pseudo-formula.</p><ul><li>Units: normalized deflection proxy.</li><li>Controlled: photon mass proxy, lens density.</li><li>Derived: lag, blur, deflection residual.</li><li>Weakens if: residual cannot be separated from noise.</li></ul></article>
                            <article data-arcsecs-equation-row="mondRotationCurves"><h3>MOND Rotation Curves</h3><p><code>Velocity Residual ≈ Observed Proxy - Comparison Model</code></p><ul><li>Units: normalized velocity curve.</li><li>Controlled: acceleration scale proxy.</li><li>Derived: residual, fit warning, comparison status.</li><li>Weakens if: comparison branches are conflated.</li></ul></article>
                            <article data-arcsecs-equation-row="parallaxCalibration"><h3>Parallax Calibration</h3><p><code>distance(parsec) = 1 / parallax(arcseconds)</code></p><ul><li>Units: arcseconds, AU, parsecs.</li><li>Controlled: parallax arcseconds.</li><li>Derived: parsec distance and calibration gate.</li><li>Weakens if: 1 arcsecond at 1 AU fails the parsec check.</li></ul></article>
                            <article data-arcsecs-equation-row="darkMatterRamjet"><h3>Dark Matter Ramjet</h3><p><code>Route Risk ≈ Fuel Gain + Heat + Drag + Torsion Pull</code> — pseudo-formula.</p><ul><li>Units: normalized fuel, heat, drag, risk.</li><li>Controlled: density, thrust, propulsion mode.</li><li>Derived: fuel, thermal load, route risk, evidence readiness.</li><li>Weakens if: fuel rises without heat, drag, or risk.</li></ul></article>
                            <article data-arcsecs-equation-row="multiMessengerEvents"><h3>Multi-Messenger Events</h3><p><code>Delay Budget = Intrinsic Source Delay + Propagation Delay Budget</code></p><ul><li>Units: seconds, ticks, normalized density.</li><li>Controlled: event preset and line-of-sight profile.</li><li>Derived: Gravity Arrival, Photon Arrival, Visibility, Falsification Note.</li><li>Weakens if: missing counterpart is treated as proof.</li></ul></article>
                        </div>
                    </section>

                    <section class="arcsecs-readiness-sweep-panel arcsecs-live-scenario-audit-console" data-arcsecs-live-scenario-audit-console="true" aria-label="Live Scenario Audit Console for current scenario source matrix and equation library review">
                        <header>
                            <span>Live Scenario Audit Console</span>
                            <h2>Review current scenario against source and equation rows</h2>
                            <p>This console audits the active scenario, finite telemetry, v5.8.12 source-matrix coverage, equation-library coverage, export evidence readiness, and falsification trigger without changing core runtime physics.</p>
                        </header>
                        <div class="arcsecs-button-row arcsecs-audit-button-row">
                            <button type="button" data-arcsecs-audit-current-scenario="true" aria-label="Audit Current Scenario against the source matrix and scenario equation library">Audit Current Scenario</button>
                            <button type="button" data-arcsecs-copy-audit-summary="true" aria-label="Copy Audit Summary as text">Copy Audit Summary</button>
                            <button type="button" data-arcsecs-export-audit-console-json="true" aria-label="Export Audit Console JSON as inert JSON">Export Audit Console JSON</button>
                        </div>
                        <div class="arcsecs-live-audit-summary" data-arcsecs-live-audit-summary="true" aria-live="polite">
                            Audit console waiting. Run or step a scenario, then audit it against the Scientific Source Matrix and Scenario Equation Library.
                        </div>
                        <div class="arcsecs-source-matrix-table-wrap" tabindex="0" aria-label="Scrollable live scenario audit status rows">
                            <table class="arcsecs-source-matrix-table arcsecs-live-audit-table" data-arcsecs-live-audit-table="true">
                                <thead><tr><th>Scenario</th><th>Source matrix row match</th><th>Equation library row match</th><th>Standard expectation</th><th>ArcSecs alternative assumption</th><th>Normalized controls</th><th>Derived telemetry</th><th>Export evidence readiness</th><th>Falsification trigger</th><th>Citation status</th><th>Telemetry finite</th></tr></thead>
                                <tbody>
                                    <tr data-arcsecs-live-audit-row="distanceTimeKernel"><th>Distance-Time Kernel</th><td>Pending audit</td><td>Pending audit</td><td>Multi-messenger timing baseline.</td><td>Photon packet can lag while gravity remains baseline.</td><td>Line-of-Sight Density; Refractive Index</td><td>Gravity Arrival; Photon Arrival; Photon Delay</td><td>Distance-Time export bundle</td><td>Photon delay does not scale with density.</td><td>project-note</td><td data-arcsecs-audit-finite="distanceTimeKernel">Pending</td></tr>
                                    <tr data-arcsecs-live-audit-row="relationalLattice"><th>Relational Lattice</th><td>Pending audit</td><td>Pending audit</td><td>Metric coordinate labels.</td><td>Relational solver links.</td><td>Node count; Link strength</td><td>Solver Links; finite tick state</td><td>Benchmark JSON</td><td>Repeated ticks are not deterministic.</td><td>project-note</td><td data-arcsecs-audit-finite="relationalLattice">Pending</td></tr>
                                    <tr data-arcsecs-live-audit-row="tiredLightPhotonEnergyLedger"><th>Tired-Light Photon Energy Ledger</th><td>Pending audit</td><td>Pending audit</td><td>Expansion/source/environment redshift comparison.</td><td>Photon loss must close against a visible ledger.</td><td>Tired-Light Loss; coupling proxy</td><td>Photon Energy; ledger closure</td><td>Evidence Packet</td><td>Energy ledger fails closure.</td><td>placeholder-needed</td><td data-arcsecs-audit-finite="tiredLightPhotonEnergyLedger">Pending</td></tr>
                                    <tr data-arcsecs-live-audit-row="massivePhotonProcaDispersion"><th>Massive Photon / Proca Dispersion</th><td>Pending audit</td><td>Pending audit</td><td>Massless photon baseline.</td><td>Massive-photon proxy branch for comparison only.</td><td>Proca density; coupling drift</td><td>Photon Delay; Refractive Index; blur</td><td>Sensitivity Report</td><td>No measurable divergence or non-finite output.</td><td>future-research</td><td data-arcsecs-audit-finite="massivePhotonProcaDispersion">Pending</td></tr>
                                    <tr data-arcsecs-live-audit-row="flatSpaceLensing"><th>Flat-Space Lensing</th><td>Pending audit</td><td>Pending audit</td><td>GR lensing baseline.</td><td>Flat-space residual is labeled as comparison.</td><td>Mass proxy; impact parameter</td><td>Deflection residual</td><td>Scene JSON</td><td>Residual is hidden or unlabeled.</td><td>confirmed</td><td data-arcsecs-audit-finite="flatSpaceLensing">Pending</td></tr>
                                    <tr data-arcsecs-live-audit-row="massivePhotonLensing"><th>Massive Photon Lensing</th><td>Pending audit</td><td>Pending audit</td><td>Massless photon path baseline.</td><td>Massive-photon proxy adds lag and deflection residual.</td><td>Photon mass proxy; lens density</td><td>Deflection residual; photon lag</td><td>Review Cockpit</td><td>Residual cannot be separated from numerical noise.</td><td>future-research</td><td data-arcsecs-audit-finite="massivePhotonLensing">Pending</td></tr>
                                    <tr data-arcsecs-live-audit-row="mondRotationCurves"><th>MOND Rotation Curves</th><td>Pending audit</td><td>Pending audit</td><td>Dark-matter halo or modified-dynamics comparison.</td><td>MOND is only an external comparison branch.</td><td>Acceleration scale proxy</td><td>Rotation velocity; residual</td><td>Benchmark JSON</td><td>Branches are conflated.</td><td>confirmed</td><td data-arcsecs-audit-finite="mondRotationCurves">Pending</td></tr>
                                    <tr data-arcsecs-live-audit-row="parallaxCalibration"><th>Parallax Calibration</th><td>Pending audit</td><td>Pending audit</td><td>One arcsecond at one AU maps to one parsec.</td><td>Calibration must pass before speculative interpretation.</td><td>Parallax arcseconds; AU baseline</td><td>Parsec distance; calibration error</td><td>Calibration Certificate</td><td>One arcsecond at one AU fails one parsec.</td><td>confirmed</td><td data-arcsecs-audit-finite="parallaxCalibration">Pending</td></tr>
                                    <tr data-arcsecs-live-audit-row="darkMatterRamjet"><th>Dark Matter Ramjet</th><td>Pending audit</td><td>Pending audit</td><td>No established dark matter propulsion system exists.</td><td>Ramjet controls are model telemetry only.</td><td>Density strength; fuel proxy</td><td>Fuel; Heat; Drag; Route Risk</td><td>Flight Recorder</td><td>Fuel rises without heat, drag, or risk.</td><td>project-note</td><td data-arcsecs-audit-finite="darkMatterRamjet">Pending</td></tr>
                                    <tr data-arcsecs-live-audit-row="multiMessengerEvents"><th>Multi-Messenger Events</th><td>Pending audit</td><td>Pending audit</td><td>Intrinsic and propagation delay stay separate.</td><td>Photon counterpart may lag, fade, blur, or be missing.</td><td>Intrinsic Source Delay; Propagation Delay Budget</td><td>Gravity Arrival; Photon Arrival; Photon Delay</td><td>Research Bundle</td><td>Missing counterpart is presented as proof.</td><td>confirmed</td><td data-arcsecs-audit-finite="multiMessengerEvents">Pending</td></tr>
                                </tbody>
                            </table>
                        </div>
                    </section>

                    <section class="arcsecs-readiness-sweep-panel arcsecs-export-diff-review" data-arcsecs-export-diff-review="true" aria-label="Inert Export Diff Review panel">
                        <header>
                            <span>Export Diff Review</span>
                            <h2>Compare two inert JSON exports safely</h2>
                            <p>Paste two ArcSecs JSON exports to compare identity, parameters, telemetry, warnings, falsification notes, sourceMatrix, and scenarioEquationLibrary fields. Imported text is parsed as inert JSON only and never executed.</p>
                        </header>
                        <div class="arcsecs-export-diff-grid">
                            <label>Export JSON A<textarea data-arcsecs-export-diff-json-a="true" aria-label="Paste inert export JSON A" spellcheck="false" placeholder="Paste export A JSON here"></textarea></label>
                            <label>Export JSON B<textarea data-arcsecs-export-diff-json-b="true" aria-label="Paste inert export JSON B" spellcheck="false" placeholder="Paste export B JSON here"></textarea></label>
                        </div>
                        <div class="arcsecs-button-row arcsecs-export-diff-actions">
                            <button type="button" data-arcsecs-compare-exports="true" aria-label="Compare Exports as inert JSON">Compare Exports</button>
                        </div>
                        <div class="arcsecs-export-diff-result" data-arcsecs-export-diff-result="true" aria-live="polite">Diff review waiting for two inert JSON exports.</div>
                    </section>


                    <section class="arcsecs-readiness-sweep-panel arcsecs-screenshot-evidence-pack" data-arcsecs-scenario-screenshot-evidence-pack="true" aria-label="Scenario Screenshot Evidence Pack panel">
                        <header>
                            <span>Scenario Screenshot Evidence Pack</span>
                            <h2>Capture local screenshot evidence for reviewer bundles</h2>
                            <p>Capture the current canvas locally, connect the latest audit and export-diff summaries, and export inert JSON evidence. Screenshots and notes stay in the browser until a manual export click.</p>
                        </header>
                        <div class="arcsecs-evidence-pack-grid">
                            <article>
                                <h3>Screenshot status</h3>
                                <dl data-arcsecs-screenshot-evidence-summary="true" aria-live="polite">
                                    <dt>Scenario run exists</dt><dd>warning</dd>
                                    <dt>Screenshot capture exists</dt><dd>not captured</dd>
                                    <dt>Telemetry finite</dt><dd>pending</dd>
                                    <dt>Source matrix row matched</dt><dd>pending</dd>
                                    <dt>Equation library row matched</dt><dd>pending</dd>
                                </dl>
                            </article>
                            <article>
                                <h3>Evidence pack readiness score</h3>
                                <div class="arcsecs-readiness-score" data-arcsecs-evidence-readiness-score="true" aria-live="polite">0 / 9 ready — run a scenario, capture a screenshot, audit it, and add reviewer notes.</div>
                                <ul class="arcsecs-readiness-missing" data-arcsecs-evidence-readiness-missing="true"><li>Scenario run missing.</li><li>Screenshot capture missing.</li><li>Reviewer notes missing.</li></ul>
                            </article>
                        </div>
                        <div class="arcsecs-button-row arcsecs-evidence-pack-actions">
                            <button type="button" data-arcsecs-capture-scenario-screenshot="true" aria-label="Capture Scenario Screenshot locally">Capture Scenario Screenshot</button>
                            <button type="button" data-arcsecs-build-reviewer-notes-bundle="true" aria-label="Build Reviewer Notes Bundle">Build Reviewer Notes Bundle</button>
                            <button type="button" data-arcsecs-export-reviewer-notes-json="true" aria-label="Export Reviewer Notes JSON">Export Reviewer Notes JSON</button>
                            <button type="button" data-arcsecs-export-evidence-pack-json="true" aria-label="Export Evidence Pack JSON">Export Evidence Pack JSON</button>
                        </div>
                        <div class="arcsecs-evidence-pack-preview" data-arcsecs-evidence-pack-preview="true" aria-live="polite">Evidence pack waiting. No upload, network service, or browser automation is used.</div>
                    </section>

                    <section class="arcsecs-readiness-sweep-panel arcsecs-reviewer-notes-bundle" data-arcsecs-reviewer-notes-bundle="true" aria-label="Reviewer Notes Bundle panel">
                        <header>
                            <span>Reviewer Notes Bundle</span>
                            <h2>Local notes for scenario review</h2>
                            <p>Reviewer notes are export-only local text. Use them to mark whether a run is screenshot-ready, still needs telemetry, needs source review, or needs a clearer falsification note.</p>
                        </header>
                        <div class="arcsecs-reviewer-notes-grid">
                            <label>Reviewer notes<textarea data-arcsecs-reviewer-notes="true" aria-label="Reviewer notes for local export" spellcheck="true" placeholder="Record what changed visibly, which telemetry changed, what warning appeared, and what would falsify or weaken the run."></textarea></label>
                            <label>Reviewer status<select data-arcsecs-reviewer-status="true" aria-label="Reviewer status">
                                <option value="pending-review">pending-review</option>
                                <option value="approved-for-demo">approved-for-demo</option>
                                <option value="approved-with-warnings">approved-with-warnings</option>
                                <option value="needs-revision">needs-revision</option>
                                <option value="rejected">rejected</option>
                            </select></label>
                            <label>Screenshot suitability<select data-arcsecs-screenshot-suitability="true" aria-label="Screenshot suitability">
                                <option value="not-reviewed">not-reviewed</option>
                                <option value="screenshot-ready">screenshot-ready</option>
                                <option value="telemetry-needed">telemetry-needed</option>
                                <option value="source-needed">source-needed</option>
                                <option value="falsification-needed">falsification-needed</option>
                            </select></label>
                        </div>
                        <div class="arcsecs-reviewer-notes-output" data-arcsecs-reviewer-notes-output="true" aria-live="polite">Reviewer Notes Bundle waiting for local notes.</div>
                    </section>


                    <section class="arcsecs-readiness-sweep-panel arcsecs-public-reviewer-gallery-manifest" data-arcsecs-public-reviewer-gallery-manifest="true" aria-label="Evidence Bundle Integrity Labels and Reviewer Sign-Off Summary panel">
                        <header>
                            <span>Public Reviewer Gallery Manifest</span>
                            <h2>Build a local static evidence index from exported reviewer JSON</h2>
                            <p>Paste inert Scenario Screenshot Evidence Pack JSON and Reviewer Notes JSON to build local review rows. Nothing is uploaded, fetched, executed, or sent to a network service.</p>
                        </header>
                        <div class="arcsecs-gallery-manifest-import-grid">
                            <label>Evidence Pack JSON<textarea data-arcsecs-gallery-evidence-pack-json="true" aria-label="Paste inert Scenario Screenshot Evidence Pack JSON" spellcheck="false" placeholder="Paste exported Evidence Pack JSON here"></textarea></label>
                            <label>Reviewer Notes JSON<textarea data-arcsecs-gallery-reviewer-notes-json="true" aria-label="Paste inert Reviewer Notes JSON" spellcheck="false" placeholder="Paste exported Reviewer Notes JSON here"></textarea></label>
                        </div>
                        <div class="arcsecs-button-row arcsecs-gallery-manifest-actions">
                            <button type="button" data-arcsecs-add-gallery-manifest-row="true" aria-label="Validate pasted JSON and add local evidence row">Validate and Add Evidence Row</button>
                            <button type="button" data-arcsecs-export-gallery-manifest-json="true" aria-label="Export Gallery Manifest JSON">Export Gallery Manifest JSON</button>
                            <button type="button" data-arcsecs-clear-gallery-manifest="true" aria-label="Clear local evidence index rows">Clear Local Evidence Index</button>
                        </div>
                        <div class="arcsecs-gallery-manifest-warning" data-arcsecs-gallery-manifest-warning="true" aria-live="polite">Gallery manifest waiting for inert Evidence Pack JSON and Reviewer Notes JSON. Invalid rows will be rejected visibly.</div>
                        <div class="arcsecs-gallery-filter-grid" aria-label="Evidence Index filters">
                            <label>Reviewer status<select data-arcsecs-gallery-filter-reviewer-status="true" aria-label="Filter Evidence Index by reviewer status">
                                <option value="all">all</option>
                                <option value="pending-review">pending-review</option>
                                <option value="approved-for-demo">approved-for-demo</option>
                                <option value="approved-with-warnings">approved-with-warnings</option>
                                <option value="needs-revision">needs-revision</option>
                                <option value="rejected">rejected</option>
                            </select></label>
                            <label>Screenshot suitability<select data-arcsecs-gallery-filter-screenshot-suitability="true" aria-label="Filter Evidence Index by screenshot suitability">
                                <option value="all">all</option>
                                <option value="not-reviewed">not-reviewed</option>
                                <option value="screenshot-ready">screenshot-ready</option>
                                <option value="telemetry-needed">telemetry-needed</option>
                                <option value="source-needed">source-needed</option>
                                <option value="falsification-needed">falsification-needed</option>
                            </select></label>
                            <label>Citation status<select data-arcsecs-gallery-filter-citation-status="true" aria-label="Filter Evidence Index by citation status">
                                <option value="all">all</option>
                                <option value="confirmed">confirmed</option>
                                <option value="project-note">project-note</option>
                                <option value="placeholder-needed">placeholder-needed</option>
                                <option value="future-research">future-research</option>
                            </select></label>
                            <label>Telemetry finite<select data-arcsecs-gallery-filter-telemetry="true" aria-label="Filter Evidence Index by telemetry status">
                                <option value="all">all</option>
                                <option value="finite">finite</option>
                                <option value="warning-or-pending">warning-or-pending</option>
                            </select></label>
                            <label>Source/equation match<select data-arcsecs-gallery-filter-source-equation="true" aria-label="Filter Evidence Index by source and equation match status">
                                <option value="all">all</option>
                                <option value="matched">matched</option>
                                <option value="missing">missing</option>
                            </select></label>
                        </div>
                        <div class="arcsecs-reviewer-readiness-summary" data-arcsecs-reviewer-readiness-summary="true" aria-live="polite">Reviewer readiness summary waiting for local evidence rows.</div>
                        <div class="arcsecs-evidence-index-wrap" role="region" aria-label="Evidence Index table" tabindex="0">
                            <table class="arcsecs-evidence-index-table" data-arcsecs-evidence-index-table="true">
                                <caption>Evidence Index rows built from local inert JSON only</caption>
                                <thead>
                                    <tr>
                                        <th>Package</th>
                                        <th>Generated UTC</th>
                                        <th>Scenario</th>
                                        <th>Screenshot</th>
                                        <th>Telemetry</th>
                                        <th>Source</th>
                                        <th>Equation</th>
                                        <th>Citation</th>
                                        <th>Falsification</th>
                                        <th>Reviewer</th>
                                        <th>Suitability</th>
                                        <th>Readiness</th>
                                        <th>Warnings</th>
                                        <th>Boundary</th>
                                    </tr>
                                </thead>
                                <tbody data-arcsecs-evidence-index-body="true"><tr><td colspan="14">No evidence rows yet. Paste inert exports and click Validate and Add Evidence Row.</td></tr></tbody>
                            </table>
                        </div>
                    </section>

                    <section class="arcsecs-readiness-sweep-panel arcsecs-evidence-bundle-integrity-labels" data-arcsecs-evidence-bundle-integrity-labels="true" aria-label="Evidence Bundle Integrity Labels panel">
                        <header>
                            <span>Evidence Bundle Integrity Labels</span>
                            <h2>Local integrity labels for exported reviewer evidence</h2>
                            <p>Generate deterministic local fingerprints and completeness labels over normalized inert JSON fields. No signing keys, secrets, accounts, passwords, certificates, uploads, remote validation, fetching, or executable imports are used.</p>
                        </header>
                        <div class="arcsecs-button-row arcsecs-integrity-label-actions">
                            <button type="button" data-arcsecs-build-integrity-labels="true" aria-label="Build Evidence Bundle Integrity Labels">Build Integrity Labels</button>
                            <button type="button" data-arcsecs-build-signoff-summary="true" aria-label="Build Sign-Off Summary">Build Sign-Off Summary</button>
                            <button type="button" data-arcsecs-export-signoff-summary-json="true" aria-label="Export Sign-Off Summary JSON">Export Sign-Off Summary JSON</button>
                        </div>
                        <div class="arcsecs-integrity-filter-grid" aria-label="Integrity Review Table filters">
                            <label>Integrity status<select data-arcsecs-integrity-filter-status="true" aria-label="Filter Integrity Review Table by integrity status">
                                <option value="all">all</option>
                                <option value="complete">complete</option>
                                <option value="warning">warning</option>
                                <option value="incomplete">incomplete</option>
                                <option value="rejected">rejected</option>
                            </select></label>
                        </div>
                        <div class="arcsecs-integrity-review-wrap" role="region" aria-label="Integrity Review Table" tabindex="0">
                            <table class="arcsecs-integrity-review-table" data-arcsecs-integrity-review-table="true">
                                <caption>Integrity Review Table for local evidence rows</caption>
                                <thead>
                                    <tr>
                                        <th>Row Label</th>
                                        <th>Scenario</th>
                                        <th>Reviewer Status</th>
                                        <th>Suitability</th>
                                        <th>Readiness Score</th>
                                        <th>Integrity Status</th>
                                        <th>Warnings</th>
                                        <th>Boundary</th>
                                        <th>Local Fingerprint</th>
                                    </tr>
                                </thead>
                                <tbody data-arcsecs-integrity-review-body="true"><tr><td colspan="9">No integrity labels yet. Build labels from the local Evidence Index.</td></tr></tbody>
                            </table>
                        </div>
                        <div class="arcsecs-integrity-label-output" data-arcsecs-integrity-label-output="true" aria-live="polite">Evidence Bundle Integrity Labels waiting for local Evidence Index rows.</div>
                    </section>

                    <section class="arcsecs-readiness-sweep-panel arcsecs-reviewer-signoff-summary" data-arcsecs-reviewer-signoff-summary="true" aria-label="Reviewer Sign-Off Summary panel">
                        <header>
                            <span>Reviewer Sign-Off Summary</span>
                            <h2>Local reviewer sign-off for evidence index rows</h2>
                            <p>Build a local export-only sign-off summary from the latest Evidence Index rows, readiness summary, rejected row count, missing boundary count, and source/equation match gaps.</p>
                        </header>
                        <div class="arcsecs-signoff-grid">
                            <label>Reviewer name or handle<input type="text" data-arcsecs-signoff-reviewer="true" aria-label="Optional reviewer name or handle" placeholder="optional reviewer name or handle"></label>
                            <label>Sign-off status<select data-arcsecs-signoff-status="true" aria-label="Sign-off status">
                                <option value="pending-review">pending-review</option>
                                <option value="approved-for-demo">approved-for-demo</option>
                                <option value="approved-with-warnings">approved-with-warnings</option>
                                <option value="needs-revision">needs-revision</option>
                                <option value="rejected">rejected</option>
                            </select></label>
                            <label>Sign-off note<textarea data-arcsecs-signoff-note="true" aria-label="Sign-off note" spellcheck="true" placeholder="Summarize reviewer sign-off, warnings, evidence gaps, and whether the run is suitable for a public demo."></textarea></label>
                        </div>
                        <div class="arcsecs-signoff-output" data-arcsecs-signoff-output="true" aria-live="polite">Reviewer Sign-Off Summary waiting for local sign-off data.</div>
                    </section>


                    <section class="arcsecs-readiness-sweep-panel arcsecs-review-bundle-reconciliation" data-arcsecs-review-bundle-reconciliation="true" aria-label="Scenario Review Walkthrough Wizard and Evidence Repair Queue panel">
                        <header>
                            <span>Review Bundle Import Reconciliation</span>
                            <h2>Compare imported reviewer bundles and find evidence gaps</h2>
                            <p>Paste inert Gallery Manifest JSON, Evidence Bundle Integrity Labels JSON, and Reviewer Sign-Off Summary JSON. The browser parses local JSON data only, never executes imported content, never uploads, never fetches, and never performs remote validation.</p>
                        </header>
                        <div class="arcsecs-reconciliation-import-grid">
                            <label>Gallery Manifest JSON<textarea data-arcsecs-reconciliation-gallery-json="true" aria-label="Paste inert Gallery Manifest JSON" spellcheck="false" placeholder="Paste ArcSecsPublicReviewerGalleryManifest JSON here"></textarea></label>
                            <label>Evidence Bundle Integrity Labels JSON<textarea data-arcsecs-reconciliation-integrity-json="true" aria-label="Paste inert Evidence Bundle Integrity Labels JSON" spellcheck="false" placeholder="Paste ArcSecsEvidenceBundleIntegrityLabels JSON here"></textarea></label>
                            <label>Reviewer Sign-Off Summary JSON<textarea data-arcsecs-reconciliation-signoff-json="true" aria-label="Paste inert Reviewer Sign-Off Summary JSON" spellcheck="false" placeholder="Paste ArcSecsReviewerSignOffSummary JSON here"></textarea></label>
                        </div>
                        <div class="arcsecs-button-row arcsecs-reconciliation-actions">
                            <button type="button" data-arcsecs-reconcile-review-bundle="true" aria-label="Reconcile Review Bundle">Reconcile Review Bundle</button>
                            <button type="button" data-arcsecs-export-reconciliation-json="true" aria-label="Export Reconciliation JSON">Export Reconciliation JSON</button>
                            <button type="button" data-arcsecs-clear-reconciliation-inputs="true" aria-label="Clear Reconciliation Inputs">Clear Reconciliation Inputs</button>
                        </div>
                        <div class="arcsecs-reconciliation-filter-grid" aria-label="Evidence Gap Assistant filters">
                            <label>Gap severity<select data-arcsecs-gap-filter-severity="true" aria-label="Filter evidence gaps by severity">
                                <option value="all">all</option>
                                <option value="critical">critical</option>
                                <option value="warning">warning</option>
                                <option value="info">info</option>
                            </select></label>
                            <label>Scenario<select data-arcsecs-gap-filter-scenario="true" aria-label="Filter evidence gaps by scenario">
                                <option value="all">all</option>
                                <option value="distanceTimeKernel">Distance-Time Kernel</option>
                                <option value="relationalLattice">Relational Lattice</option>
                                <option value="tiredLightEnergyLedger">Tired-Light Photon Energy Ledger</option>
                                <option value="massivePhotonLensing">Massive Photon / Proca Dispersion</option>
                                <option value="flatSpaceLensing">Flat-Space Lensing</option>
                                <option value="mondRotationCurves">MOND Rotation Curves</option>
                                <option value="parallaxCalibration">Parallax Calibration</option>
                                <option value="darkMatterRamjet">Dark Matter Ramjet</option>
                                <option value="multiMessengerEvents">Multi-Messenger Events</option>
                            </select></label>
                        </div>
                        <div class="arcsecs-reconciliation-status" data-arcsecs-reconciliation-status="true" aria-live="polite">Review Bundle Import Reconciliation waiting for inert local JSON. Invalid JSON will be rejected visibly.</div>
                        <div class="arcsecs-reconciliation-table-wrap" role="region" aria-label="Reconciliation check table" tabindex="0">
                            <table class="arcsecs-reconciliation-table" data-arcsecs-reconciliation-table="true">
                                <caption>Reconciliation checks for imported review bundle rows</caption>
                                <thead>
                                    <tr>
                                        <th>State</th>
                                        <th>Scenario</th>
                                        <th>Row ID</th>
                                        <th>Package Version</th>
                                        <th>Local Fingerprint</th>
                                        <th>Reviewer Status</th>
                                        <th>Readiness</th>
                                        <th>Integrity</th>
                                        <th>Sign-Off</th>
                                        <th>Source/Equation</th>
                                        <th>Boundary</th>
                                    </tr>
                                </thead>
                                <tbody data-arcsecs-reconciliation-body="true"><tr><td colspan="11">No reconciliation rows yet. Paste inert JSON and click Reconcile Review Bundle.</td></tr></tbody>
                            </table>
                        </div>
                        <section class="arcsecs-evidence-gap-assistant" data-arcsecs-evidence-gap-assistant="true" aria-label="Evidence Gap Assistant">
                            <header><span>Evidence Gap Assistant</span><h3>Local recommended next actions before demo-ready sign-off</h3></header>
                            <div class="arcsecs-gap-summary" data-arcsecs-gap-summary="true" aria-live="polite">No gaps calculated yet.</div>
                            <ul class="arcsecs-gap-list" data-arcsecs-gap-list="true"><li>Run reconciliation to detect missing screenshot, telemetry, source, equation, citation, falsification, boundary, integrity, and sign-off conflicts.</li></ul>
                        </section>
                    </section>

                    <section class="arcsecs-readiness-sweep-panel arcsecs-scenario-review-walkthrough-wizard" data-arcsecs-scenario-review-walkthrough-wizard="true" aria-label="Scenario Review Walkthrough Wizard panel">
                        <header>
                            <span>Scenario Review Walkthrough Wizard</span>
                            <h2>Guided local review of unresolved evidence gaps</h2>
                            <p>Walk one scenario at a time through the latest local reconciliation result. The wizard keeps all review state in the browser, never uploads, never fetches, never executes imported JSON, and never changes runtime physics.</p>
                        </header>
                        <div class="arcsecs-button-row arcsecs-walkthrough-actions">
                            <button type="button" data-arcsecs-start-review-walkthrough="true" aria-label="Start Review Walkthrough">Start Review Walkthrough</button>
                            <button type="button" data-arcsecs-previous-review-scenario="true" aria-label="Previous Scenario">Previous Scenario</button>
                            <button type="button" data-arcsecs-next-review-scenario="true" aria-label="Next Scenario">Next Scenario</button>
                            <button type="button" data-arcsecs-export-walkthrough-json="true" aria-label="Export Walkthrough JSON">Export Walkthrough JSON</button>
                        </div>
                        <div class="arcsecs-walkthrough-status" data-arcsecs-walkthrough-status="true" aria-live="polite">Walkthrough waiting for reconciliation data. Use the reconciliation panel first, or start with a local fallback scenario checklist.</div>
                        <div class="arcsecs-walkthrough-card" data-arcsecs-walkthrough-card="true">
                            <h3 data-arcsecs-walkthrough-scenario-label="true">No scenario selected</h3>
                            <dl>
                                <div><dt>Reviewer status</dt><dd data-arcsecs-walkthrough-reviewer-status="true">pending-review</dd></div>
                                <div><dt>Integrity status</dt><dd data-arcsecs-walkthrough-integrity-status="true">warning</dd></div>
                                <div><dt>Readiness score</dt><dd data-arcsecs-walkthrough-readiness-score="true">0 / 9</dd></div>
                                <div><dt>Source / equation status</dt><dd data-arcsecs-walkthrough-source-equation-status="true">missing</dd></div>
                                <div><dt>Speculative boundary</dt><dd data-arcsecs-walkthrough-boundary-status="true">required</dd></div>
                            </dl>
                        </div>
                        <ol class="arcsecs-walkthrough-steps" data-arcsecs-walkthrough-steps="true">
                            <li>verify scenario run</li>
                            <li>verify finite telemetry</li>
                            <li>capture screenshot</li>
                            <li>confirm source matrix row</li>
                            <li>confirm equation library row</li>
                            <li>confirm falsification trigger</li>
                            <li>confirm speculative boundary text</li>
                            <li>confirm reviewer note</li>
                            <li>confirm sign-off status</li>
                        </ol>
                        <ul class="arcsecs-walkthrough-gap-list" data-arcsecs-walkthrough-gap-list="true"><li>No walkthrough gaps loaded yet.</li></ul>
                    </section>

                    <section class="arcsecs-readiness-sweep-panel arcsecs-evidence-repair-queue" data-arcsecs-evidence-repair-queue="true" aria-label="Evidence Repair Queue panel">
                        <header>
                            <span>Evidence Repair Queue</span>
                            <h2>Queue local repair work before demo-ready review</h2>
                            <p>Build queue items from local evidence gaps, group them by severity, scenario, and repair type, then track local-only status changes. This is review guidance, not scientific certification.</p>
                        </header>
                        <div class="arcsecs-button-row arcsecs-repair-queue-actions">
                            <button type="button" data-arcsecs-build-evidence-repair-queue="true" aria-label="Build Evidence Repair Queue">Build Evidence Repair Queue</button>
                            <button type="button" data-arcsecs-export-repair-queue-json="true" aria-label="Export Repair Queue JSON">Export Repair Queue JSON</button>
                        </div>
                        <div class="arcsecs-repair-filter-grid" aria-label="Evidence Repair Queue filters">
                            <label>Severity<select data-arcsecs-repair-filter-severity="true" aria-label="Filter repair queue by severity"><option value="all">all</option><option value="critical">critical</option><option value="warning">warning</option><option value="info">info</option></select></label>
                            <label>Scenario<select data-arcsecs-repair-filter-scenario="true" aria-label="Filter repair queue by scenario"><option value="all">all</option><option value="distanceTimeKernel">Distance-Time Kernel</option><option value="relationalLattice">Relational Lattice</option><option value="tiredLightEnergyLedger">Tired-Light Photon Energy Ledger</option><option value="massivePhotonLensing">Massive Photon / Proca Dispersion</option><option value="flatSpaceLensing">Flat-Space Lensing</option><option value="mondRotationCurves">MOND Rotation Curves</option><option value="parallaxCalibration">Parallax Calibration</option><option value="darkMatterRamjet">Dark Matter Ramjet</option><option value="multiMessengerEvents">Multi-Messenger Events</option></select></label>
                            <label>Repair type<select data-arcsecs-repair-filter-type="true" aria-label="Filter repair queue by repair type"><option value="all">all</option><option value="screenshot repair">screenshot repair</option><option value="telemetry repair">telemetry repair</option><option value="source repair">source repair</option><option value="equation repair">equation repair</option><option value="citation repair">citation repair</option><option value="falsification repair">falsification repair</option><option value="boundary repair">boundary repair</option><option value="integrity repair">integrity repair</option><option value="sign-off repair">sign-off repair</option></select></label>
                            <label>Queue status<select data-arcsecs-repair-filter-status="true" aria-label="Filter repair queue by status"><option value="all">all</option><option value="open">open</option><option value="in-progress">in-progress</option><option value="resolved">resolved</option><option value="deferred">deferred</option><option value="rejected">rejected</option></select></label>
                        </div>
                        <div class="arcsecs-repair-queue-status" data-arcsecs-repair-queue-status="true" aria-live="polite">Evidence Repair Queue waiting for local evidence gaps.</div>
                        <div class="arcsecs-repair-queue-table-wrap" role="region" aria-label="Evidence Repair Queue table" tabindex="0">
                            <table class="arcsecs-repair-queue-table" data-arcsecs-repair-queue-table="true">
                                <caption>Local repair queue items from evidence gaps</caption>
                                <thead><tr><th>Severity</th><th>Scenario</th><th>Repair type</th><th>Status</th><th>Problem</th><th>Why it matters</th><th>Recommended next action</th><th>Panel to use</th><th>Export to regenerate</th><th>Resolved criteria</th></tr></thead>
                                <tbody data-arcsecs-repair-queue-body="true"><tr><td colspan="10">No repair queue items yet. Click Build Evidence Repair Queue after reconciliation.</td></tr></tbody>
                            </table>
                        </div>
                    </section>



                    <section class="arcsecs-readiness-sweep-panel arcsecs-evidence-repair-completion-ledger" data-arcsecs-evidence-repair-completion-ledger="true" aria-label="Evidence Repair Completion Ledger panel">
                        <header>
                            <span>Evidence Repair Completion Ledger</span>
                            <h2>Record local repair outcomes before demo-readiness review</h2>
                            <p>Build a local completion ledger from the Evidence Repair Queue. This ledger is browser-only review metadata; it does not write to a server, does not validate a real drive, and does not prove the ArcSecs model.</p>
                        </header>
                        <div class="arcsecs-button-row arcsecs-completion-ledger-actions">
                            <button type="button" data-arcsecs-build-completion-ledger="true" aria-label="Build Completion Ledger">Build Completion Ledger</button>
                            <button type="button" data-arcsecs-export-completion-ledger-json="true" aria-label="Export Completion Ledger JSON">Export Completion Ledger JSON</button>
                        </div>
                        <div class="arcsecs-completion-filter-grid" aria-label="Evidence Repair Completion Ledger filters">
                            <label>Scenario<select data-arcsecs-completion-filter-scenario="true" aria-label="Filter completion ledger by scenario"><option value="all">all</option><option value="distanceTimeKernel">Distance-Time Kernel</option><option value="relationalLattice">Relational Lattice</option><option value="tiredLightEnergyLedger">Tired-Light Photon Energy Ledger</option><option value="massivePhotonLensing">Massive Photon / Proca Dispersion</option><option value="flatSpaceLensing">Flat-Space Lensing</option><option value="mondRotationCurves">MOND Rotation Curves</option><option value="parallaxCalibration">Parallax Calibration</option><option value="darkMatterRamjet">Dark Matter Ramjet</option><option value="multiMessengerEvents">Multi-Messenger Events</option></select></label>
                            <label>Completion status<select data-arcsecs-completion-filter-status="true" aria-label="Filter completion ledger by completion status"><option value="all">all</option><option value="not-started">not-started</option><option value="in-progress">in-progress</option><option value="completed">completed</option><option value="completed-with-warnings">completed-with-warnings</option><option value="deferred">deferred</option><option value="rejected">rejected</option></select></label>
                        </div>
                        <div class="arcsecs-completion-ledger-status" data-arcsecs-completion-ledger-status="true" aria-live="polite">Completion Ledger waiting for local Evidence Repair Queue rows.</div>
                        <div class="arcsecs-completion-ledger-table-wrap" role="region" aria-label="Evidence Repair Completion Ledger table" tabindex="0">
                            <table class="arcsecs-completion-ledger-table" data-arcsecs-completion-ledger-table="true">
                                <caption>Local repair completion rows grouped by scenario</caption>
                                <thead><tr><th>Scenario</th><th>Repair type</th><th>Queue status</th><th>Completion status</th><th>Critical?</th><th>Completion notes</th></tr></thead>
                                <tbody data-arcsecs-completion-ledger-body="true"><tr><td colspan="6">No completion rows yet. Click Build Completion Ledger after building the Evidence Repair Queue.</td></tr></tbody>
                            </table>
                        </div>
                    </section>

                    <section class="arcsecs-readiness-sweep-panel arcsecs-demo-readiness-gate" data-arcsecs-demo-readiness-gate="true" aria-label="Demo Readiness Gate panel">
                        <header>
                            <span>Demo Readiness Gate</span>
                            <h2>Check whether each scenario is ready for public visualization demo</h2>
                            <p>Demo-ready means only ready for public demonstration of the visualization. It is not proof, not scientific validation, not operational capability, and not evidence of an established propulsion system.</p>
                        </header>
                        <div class="arcsecs-button-row arcsecs-demo-gate-actions">
                            <button type="button" data-arcsecs-evaluate-demo-readiness-gate="true" aria-label="Evaluate Demo Readiness Gate">Evaluate Demo Readiness Gate</button>
                            <button type="button" data-arcsecs-export-demo-readiness-gate-json="true" aria-label="Export Demo Readiness Gate JSON">Export Demo Readiness Gate JSON</button>
                        </div>
                        <div class="arcsecs-demo-gate-filter-grid" aria-label="Demo Readiness Gate filters">
                            <label>Scenario<select data-arcsecs-demo-gate-filter-scenario="true" aria-label="Filter demo readiness gate by scenario"><option value="all">all</option><option value="distanceTimeKernel">Distance-Time Kernel</option><option value="relationalLattice">Relational Lattice</option><option value="tiredLightEnergyLedger">Tired-Light Photon Energy Ledger</option><option value="massivePhotonLensing">Massive Photon / Proca Dispersion</option><option value="flatSpaceLensing">Flat-Space Lensing</option><option value="mondRotationCurves">MOND Rotation Curves</option><option value="parallaxCalibration">Parallax Calibration</option><option value="darkMatterRamjet">Dark Matter Ramjet</option><option value="multiMessengerEvents">Multi-Messenger Events</option></select></label>
                            <label>Gate status<select data-arcsecs-demo-gate-filter-status="true" aria-label="Filter demo readiness gate by gate status"><option value="all">all</option><option value="blocked">blocked</option><option value="needs-review">needs-review</option><option value="demo-ready-with-warnings">demo-ready-with-warnings</option><option value="demo-ready">demo-ready</option><option value="rejected">rejected</option></select></label>
                            <label>Critical open repairs<select data-arcsecs-demo-gate-filter-critical="true" aria-label="Filter demo readiness gate by critical open repairs"><option value="all">all</option><option value="yes">yes</option><option value="no">no</option></select></label>
                        </div>
                        <div class="arcsecs-demo-gate-copy-safeguard" data-arcsecs-demo-gate-copy-safeguard="true">Copy safeguard: demo-ready is not proof, not operational capability, and only marks local evidence as ready for public demonstration of the visualization.</div>
                        <div class="arcsecs-demo-gate-status" data-arcsecs-demo-gate-status="true" aria-live="polite">Demo Readiness Gate waiting for completion ledger rows.</div>
                        <div class="arcsecs-demo-gate-table-wrap" role="region" aria-label="Demo Readiness Gate table" tabindex="0">
                            <table class="arcsecs-demo-gate-table" data-arcsecs-demo-gate-table="true">
                                <caption>Local demo readiness gate rows</caption>
                                <thead><tr><th>Scenario</th><th>Gate status</th><th>Scenario run</th><th>Finite telemetry</th><th>Screenshot</th><th>Source/equation</th><th>Citation</th><th>Falsification</th><th>Boundary</th><th>Reviewer note</th><th>Sign-off</th><th>Integrity</th><th>Critical repairs</th></tr></thead>
                                <tbody data-arcsecs-demo-gate-body="true"><tr><td colspan="13">No gate rows yet. Click Evaluate Demo Readiness Gate.</td></tr></tbody>
                            </table>
                        </div>
                    </section>

                    <section class="arcsecs-readiness-sweep-panel arcsecs-public-demo-scenario-checklist" data-arcsecs-public-demo-scenario-checklist="true" aria-label="Public Demo Scenario Checklist panel">
                        <header>
                            <span>Public Demo Scenario Checklist</span>
                            <h2>Prepare each scenario for public visualization demo review</h2>
                            <p>Checklist-ready means visualization-demo readiness only. It is not proof, not scientific validation, not operational capability, and not evidence that speculative or placeholder modes are established technology.</p>
                        </header>
                        <div class="arcsecs-button-row arcsecs-public-demo-checklist-actions">
                            <button type="button" data-arcsecs-build-public-demo-checklist="true" aria-label="Build Public Demo Checklist">Build Public Demo Checklist</button>
                            <button type="button" data-arcsecs-export-selected-scenario-evidence-pack-json="true" aria-label="Export Selected Scenario Evidence Pack JSON">Export Selected Scenario Evidence Pack JSON</button>
                            <button type="button" data-arcsecs-export-all-demo-evidence-packs-json="true" aria-label="Export All Demo Evidence Packs JSON">Export All Demo Evidence Packs JSON</button>
                        </div>
                        <div class="arcsecs-public-demo-checklist-filter-grid" aria-label="Public Demo Scenario Checklist filters">
                            <label>Scenario<select data-arcsecs-demo-checklist-filter-scenario="true" aria-label="Filter public demo checklist by scenario"><option value="all">all</option><option value="distanceTimeKernel">Distance-Time Kernel</option><option value="relationalLattice">Relational Lattice</option><option value="tiredLightEnergyLedger">Tired-Light Photon Energy Ledger</option><option value="massivePhotonLensing">Massive Photon / Proca Dispersion</option><option value="flatSpaceLensing">Flat-Space Lensing</option><option value="mondRotationCurves">MOND Rotation Curves</option><option value="parallaxCalibration">Parallax Calibration</option><option value="darkMatterRamjet">Dark Matter Ramjet</option><option value="multiMessengerEvents">Multi-Messenger Events</option></select></label>
                            <label>Gate status<select data-arcsecs-demo-checklist-filter-gate-status="true" aria-label="Filter public demo checklist by gate status"><option value="all">all</option><option value="blocked">blocked</option><option value="needs-review">needs-review</option><option value="demo-ready-with-warnings">demo-ready-with-warnings</option><option value="demo-ready">demo-ready</option><option value="rejected">rejected</option></select></label>
                            <label>Checklist completeness<select data-arcsecs-demo-checklist-filter-completeness="true" aria-label="Filter public demo checklist by completeness"><option value="all">all</option><option value="complete">complete</option><option value="incomplete">incomplete</option></select></label>
                            <label>Critical open repairs<select data-arcsecs-demo-checklist-filter-critical="true" aria-label="Filter public demo checklist by critical open repairs"><option value="all">all</option><option value="yes">yes</option><option value="no">no</option></select></label>
                            <label>Checklist override status<select data-arcsecs-demo-checklist-override-status="true" aria-label="Set local-only checklist override status"><option value="not-reviewed">not-reviewed</option><option value="ready">ready</option><option value="ready-with-warnings">ready-with-warnings</option><option value="blocked">blocked</option><option value="rejected">rejected</option></select></label>
                        </div>
                        <div class="arcsecs-public-demo-checklist-safeguard" data-arcsecs-public-demo-checklist-safeguard="true">Copy safeguard: checklist-ready is not proof, not operational capability, and only means local evidence appears ready for public demonstration of the visualization. Evidence packs are local review artifacts.</div>
                        <div class="arcsecs-public-demo-checklist-status" data-arcsecs-public-demo-checklist-status="true" aria-live="polite">Public Demo Scenario Checklist waiting for Demo Readiness Gate rows.</div>
                        <div class="arcsecs-public-demo-checklist-table-wrap" role="region" aria-label="Public Demo Scenario Checklist table" tabindex="0">
                            <table class="arcsecs-public-demo-checklist-table" data-arcsecs-public-demo-checklist-table="true">
                                <caption>Local checklist rows for public visualization demos</caption>
                                <thead><tr><th>Scenario</th><th>Gate status</th><th>Reviewer status</th><th>Sign-off status</th><th>Readiness score</th><th>Integrity status</th><th>Completion status</th><th>Critical repairs</th><th>Override</th><th>Checklist items</th></tr></thead>
                                <tbody data-arcsecs-public-demo-checklist-body="true"><tr><td colspan="10">No checklist rows yet. Click Build Public Demo Checklist.</td></tr></tbody>
                            </table>
                        </div>
                    </section>

                    <section class="arcsecs-readiness-sweep-panel arcsecs-reviewer-evidence-export-pack" data-arcsecs-reviewer-evidence-export-pack="true" aria-label="Reviewer Evidence Export Pack panel">
                        <header>
                            <span>Reviewer Evidence Export Pack</span>
                            <h2>Export inert evidence packs for selected public demo scenarios</h2>
                            <p>Each reviewer evidence export pack is local inert JSON. It includes checklist, gate, repair, sign-off, integrity, source matrix, equation library, warnings, falsification notes, and speculative boundary text. It never contains executable code.</p>
                        </header>
                        <div class="arcsecs-evidence-pack-control-grid" aria-label="Reviewer Evidence Export Pack controls">
                            <label>Selected scenario<select data-arcsecs-evidence-pack-selected-scenario="true" aria-label="Select scenario for evidence pack export"><option value="active">active scenario</option><option value="distanceTimeKernel">Distance-Time Kernel</option><option value="relationalLattice">Relational Lattice</option><option value="tiredLightEnergyLedger">Tired-Light Photon Energy Ledger</option><option value="massivePhotonLensing">Massive Photon / Proca Dispersion</option><option value="flatSpaceLensing">Flat-Space Lensing</option><option value="mondRotationCurves">MOND Rotation Curves</option><option value="parallaxCalibration">Parallax Calibration</option><option value="darkMatterRamjet">Dark Matter Ramjet</option><option value="multiMessengerEvents">Multi-Messenger Events</option></select></label>
                        </div>
                        <div class="arcsecs-reviewer-evidence-export-status" data-arcsecs-reviewer-evidence-export-status="true" aria-live="polite">Reviewer Evidence Export Pack waiting for checklist rows.</div>
                        <ul class="arcsecs-reviewer-evidence-export-required" data-arcsecs-reviewer-evidence-export-required="true">
                            <li>demoReadinessGate row</li><li>evidenceRepairCompletionLedger rows</li><li>evidenceRepairQueue rows</li><li>reviewerSignOffSummary</li><li>evidenceBundleIntegrityLabels</li><li>publicReviewerGalleryManifest or evidence index row</li><li>sourceMatrix row</li><li>scenarioEquationLibrary row</li><li>warnings</li><li>falsification notes</li><li>speculativeBoundaryText</li><li>exportContainsExecutableCode:false</li>
                        </ul>
                    </section>

                    <section class="arcsecs-readiness-sweep-panel arcsecs-public-demo-script-builder" data-arcsecs-public-demo-script-builder="true" aria-label="Public Demo Script Builder panel">
                        <header>
                            <span>Public Demo Script Builder</span>
                            <h2>Build cautious public demo scripts from local reviewer evidence</h2>
                            <p>Scripts are communication aids only. They are not proof, not scientific validation, not operational capability, and not evidence that speculative or placeholder modes are established technology.</p>
                        </header>
                        <div class="arcsecs-button-row arcsecs-demo-script-actions">
                            <button type="button" data-arcsecs-build-public-demo-scripts="true" aria-label="Build Public Demo Scripts">Build Public Demo Scripts</button>
                            <button type="button" data-arcsecs-export-selected-demo-script-json="true" aria-label="Export Selected Demo Script JSON">Export Selected Demo Script JSON</button>
                            <button type="button" data-arcsecs-export-all-demo-scripts-json="true" aria-label="Export All Demo Scripts JSON">Export All Demo Scripts JSON</button>
                            <button type="button" data-arcsecs-build-screenshot-caption-pack="true" aria-label="Build Screenshot Caption Pack">Build Screenshot Caption Pack</button>
                            <button type="button" data-arcsecs-export-screenshot-caption-pack-json="true" aria-label="Export Screenshot Caption Pack JSON">Export Screenshot Caption Pack JSON</button>
                        </div>
                        <div class="arcsecs-demo-script-filter-grid" aria-label="Public Demo Script Builder filters">
                            <label>Scenario<select data-arcsecs-demo-script-filter-scenario="true" aria-label="Filter demo scripts by scenario"><option value="all">all</option><option value="distanceTimeKernel">Distance-Time Kernel</option><option value="relationalLattice">Relational Lattice</option><option value="tiredLightEnergyLedger">Tired-Light Photon Energy Ledger</option><option value="massivePhotonLensing">Massive Photon / Proca Dispersion</option><option value="flatSpaceLensing">Flat-Space Lensing</option><option value="mondRotationCurves">MOND Rotation Curves</option><option value="parallaxCalibration">Parallax Calibration</option><option value="darkMatterRamjet">Dark Matter Ramjet</option><option value="multiMessengerEvents">Multi-Messenger Events</option></select></label>
                            <label>Gate status<select data-arcsecs-demo-script-filter-gate-status="true" aria-label="Filter demo scripts by gate status"><option value="all">all</option><option value="blocked">blocked</option><option value="needs-review">needs-review</option><option value="demo-ready-with-warnings">demo-ready-with-warnings</option><option value="demo-ready">demo-ready</option><option value="rejected">rejected</option></select></label>
                            <label>Checklist override<select data-arcsecs-demo-script-filter-checklist-override="true" aria-label="Filter demo scripts by checklist override status"><option value="all">all</option><option value="not-reviewed">not-reviewed</option><option value="ready">ready</option><option value="ready-with-warnings">ready-with-warnings</option><option value="blocked">blocked</option><option value="rejected">rejected</option></select></label>
                            <label>Warning status<select data-arcsecs-demo-script-filter-warning="true" aria-label="Filter demo scripts by warning status"><option value="all">all</option><option value="clear">clear</option><option value="warnings">warnings</option></select></label>
                            <label>Script status<select data-arcsecs-demo-script-status="true" aria-label="Set local-only demo script status"><option value="draft">draft</option><option value="reviewer-ready">reviewer-ready</option><option value="needs-revision">needs-revision</option><option value="blocked">blocked</option><option value="rejected">rejected</option></select></label>
                        </div>
                        <div class="arcsecs-demo-script-safeguard" data-arcsecs-demo-script-safeguard="true">Copy safeguard: scripts are communication aids only. Screenshots are evidence of a simulation run, not proof of physics. Demo-ready and reviewer-ready are not operational capability.</div>
                        <div class="arcsecs-demo-script-status" data-arcsecs-demo-script-builder-status="true" aria-live="polite">Public Demo Script Builder waiting for Public Demo Scenario Checklist rows.</div>
                        <div class="arcsecs-demo-script-table-wrap" role="region" aria-label="Public Demo Script Builder table" tabindex="0">
                            <table class="arcsecs-demo-script-table" data-arcsecs-demo-script-table="true">
                                <caption>Local public demo scripts for cautious reviewer-facing communication</caption>
                                <thead><tr><th>Scenario</th><th>Gate</th><th>Checklist</th><th>Readiness</th><th>Integrity</th><th>Source/equation</th><th>Warnings</th><th>Script status</th><th>Script sections</th></tr></thead>
                                <tbody data-arcsecs-demo-script-body="true"><tr><td colspan="9">No demo script rows yet. Click Build Public Demo Scripts.</td></tr></tbody>
                            </table>
                        </div>
                    </section>

                    <section class="arcsecs-readiness-sweep-panel arcsecs-screenshot-caption-pack" data-arcsecs-screenshot-caption-pack="true" aria-label="Screenshot Caption Pack panel">
                        <header>
                            <span>Screenshot Caption Pack</span>
                            <h2>Generate cautious captions and alt text for simulation screenshots</h2>
                            <p>Screenshot captions describe local visualization evidence only. Each row includes a screenshot title, short caption, long caption, telemetry caption, source/equation caption, falsification caption, warning caption, alt text, and speculative boundary caption. They do not imply real propulsion, operational capability, or established physics.</p>
                        </header>
                        <div class="arcsecs-screenshot-caption-status" data-arcsecs-screenshot-caption-pack-status="true" aria-live="polite">Screenshot Caption Pack waiting for generated demo scripts.</div>
                        <div class="arcsecs-screenshot-caption-table-wrap" role="region" aria-label="Screenshot Caption Pack table" tabindex="0">
                            <table class="arcsecs-screenshot-caption-table" data-arcsecs-screenshot-caption-table="true">
                                <caption>Local screenshot captions for public pages, social posts, and reviewer bundles</caption>
                                <thead><tr><th>Scenario</th><th>Title</th><th>Short caption</th><th>Telemetry caption</th><th>Falsification caption</th><th>Alt text</th><th>Boundary</th></tr></thead>
                                <tbody data-arcsecs-screenshot-caption-body="true"><tr><td colspan="7">No caption rows yet. Click Build Screenshot Caption Pack.</td></tr></tbody>
                            </table>
                        </div>
                    </section>




                    <section class="arcsecs-readiness-sweep-panel arcsecs-public-demo-page-assembly-checklist" data-arcsecs-public-demo-page-assembly-checklist="true" aria-label="Public Demo Page Assembly Checklist panel">
                        <header>
                            <span>Public Demo Page Assembly Checklist</span>
                            <h2>Assemble cautious public-page review rows from scripts, captions, evidence, and falsification notes</h2>
                            <p>Page-assembly-ready means copy review readiness for a speculative research visualization only. It is not proof, not operational capability, and not a claim that placeholder or speculative modes are established technology.</p>
                        </header>
                        <div class="arcsecs-button-row arcsecs-page-assembly-actions">
                            <button type="button" data-arcsecs-build-page-assembly-checklist="true" aria-label="Build Page Assembly Checklist">Build Page Assembly Checklist</button>
                            <button type="button" data-arcsecs-build-copy-review-bundle="true" aria-label="Build Copy Review Bundle">Build Copy Review Bundle</button>
                            <button type="button" data-arcsecs-export-selected-copy-review-bundle-json="true" aria-label="Export Selected Copy Review Bundle JSON">Export Selected Copy Review Bundle JSON</button>
                            <button type="button" data-arcsecs-export-all-copy-review-bundles-json="true" aria-label="Export All Copy Review Bundles JSON">Export All Copy Review Bundles JSON</button>
                        </div>
                        <div class="arcsecs-page-assembly-filter-grid" aria-label="Public Demo Page Assembly Checklist filters">
                            <label>Scenario<select data-arcsecs-page-assembly-filter-scenario="true" aria-label="Filter page assembly by scenario"><option value="all">all</option><option value="distanceTimeKernel">Distance-Time Kernel</option><option value="relationalLattice">Relational Lattice</option><option value="tiredLightEnergyLedger">Tired-Light Photon Energy Ledger</option><option value="massivePhotonLensing">Massive Photon / Proca Dispersion</option><option value="flatSpaceLensing">Flat-Space Lensing</option><option value="mondRotationCurves">MOND Rotation Curves</option><option value="parallaxCalibration">Parallax Calibration</option><option value="darkMatterRamjet">Dark Matter Ramjet</option><option value="multiMessengerEvents">Multi-Messenger Events</option></select></label>
                            <label>Script status<select data-arcsecs-page-assembly-filter-script-status="true" aria-label="Filter page assembly by script status"><option value="all">all</option><option value="draft">draft</option><option value="reviewer-ready">reviewer-ready</option><option value="needs-revision">needs-revision</option><option value="blocked">blocked</option><option value="rejected">rejected</option></select></label>
                            <label>Caption status<select data-arcsecs-page-assembly-filter-caption-status="true" aria-label="Filter page assembly by caption status"><option value="all">all</option><option value="present">present</option><option value="missing">missing</option></select></label>
                            <label>Copy readiness<select data-arcsecs-page-assembly-filter-copy-readiness="true" aria-label="Filter page assembly by copy readiness"><option value="all">all</option><option value="draft">draft</option><option value="reviewer-ready">reviewer-ready</option><option value="ready-with-warnings">ready-with-warnings</option><option value="blocked">blocked</option><option value="rejected">rejected</option></select></label>
                            <label>Warning status<select data-arcsecs-page-assembly-filter-warning="true" aria-label="Filter page assembly by warning status"><option value="all">all</option><option value="clear">clear</option><option value="warnings">warnings</option></select></label>
                            <label>Set copy readiness<select data-arcsecs-copy-readiness-status="true" aria-label="Set local-only copy readiness status"><option value="draft">draft</option><option value="reviewer-ready">reviewer-ready</option><option value="ready-with-warnings">ready-with-warnings</option><option value="blocked">blocked</option><option value="rejected">rejected</option></select></label>
                        </div>
                        <div class="arcsecs-copy-review-safeguard" data-arcsecs-copy-review-safeguard="true">Copy safeguard: public copy must stay cautious, falsifiable, and clearly labeled as a speculative research visualization. Copy review bundles are inert local review artifacts only.</div>
                        <div class="arcsecs-page-assembly-status" data-arcsecs-page-assembly-status="true" aria-live="polite">Page Assembly Checklist waiting for demo scripts, captions, and evidence packs.</div>
                        <div class="arcsecs-page-assembly-table-wrap" role="region" aria-label="Public Demo Page Assembly Checklist table" tabindex="0">
                            <table class="arcsecs-page-assembly-table" data-arcsecs-page-assembly-table="true">
                                <caption>Local page assembly rows for public demo copy review</caption>
                                <thead><tr><th>Scenario</th><th>Script</th><th>Caption</th><th>Gate</th><th>Checklist</th><th>Readiness</th><th>Warnings</th><th>Source/equation</th><th>Falsification</th><th>Copy readiness</th><th>Assembly checklist items</th></tr></thead>
                                <tbody data-arcsecs-page-assembly-body="true"><tr><td colspan="11">No assembly rows yet. Click Build Page Assembly Checklist.</td></tr></tbody>
                            </table>
                        </div>
                    </section>

                    <section class="arcsecs-readiness-sweep-panel arcsecs-copy-review-bundle" data-arcsecs-copy-review-bundle="true" aria-label="Copy Review Bundle panel">
                        <header>
                            <span>Copy Review Bundle</span>
                            <h2>Build inert copy bundles with rejected phrase checks and recommended fixes</h2>
                            <p>Copy bundles combine demo scripts, screenshot captions, evidence packs, source/equation rows, falsification notes, suggested page copy, alt text, warnings, rejected phrases, and speculative boundary copy. They do not contain executable content.</p>
                        </header>
                        <div class="arcsecs-copy-review-status" data-arcsecs-copy-review-status="true" aria-live="polite">Copy Review Bundle waiting for page assembly rows.</div>
                        <div class="arcsecs-copy-quality-status" data-arcsecs-copy-quality-status="true" aria-live="polite">Copy quality checks detect missing boundary, falsification, standard comparison, source/equation, alt text, proof wording, operational-capability wording, and unlabeled placeholders.</div>
                        <div class="arcsecs-copy-review-table-wrap" role="region" aria-label="Copy Review Bundle table" tabindex="0">
                            <table class="arcsecs-copy-review-table" data-arcsecs-copy-review-table="true">
                                <caption>Local copy review bundle rows</caption>
                                <thead><tr><th>Scenario</th><th>Suggested title</th><th>Intro paragraph</th><th>Telemetry callout</th><th>Falsification callout</th><th>Boundary copy</th><th>Alt text</th><th>Copy warnings</th><th>Rejected phrases</th></tr></thead>
                                <tbody data-arcsecs-copy-review-body="true"><tr><td colspan="9">No copy bundle rows yet. Click Build Copy Review Bundle.</td></tr></tbody>
                            </table>
                        </div>
                    </section>

                    <section class="arcsecs-readiness-sweep-panel arcsecs-public-demo-route-draft-bundle" data-arcsecs-public-demo-route-draft-bundle="true" aria-label="Public Demo Route Draft Bundle panel">
                        <header>
                            <span>Public Demo Route Draft Bundle</span>
                            <h2>Prepare local reviewer-draft route metadata without publishing</h2>
                            <p>Route drafts are inert local planning artifacts for speculative research visualization pages. They do not create WordPress pages, publish content, fetch URLs, or validate live routes.</p>
                        </header>
                        <div class="arcsecs-button-row arcsecs-route-draft-actions">
                            <button type="button" data-arcsecs-build-route-draft-bundle="true" aria-label="Build Route Draft Bundle">Build Route Draft Bundle</button>
                            <button type="button" data-arcsecs-build-seo-schema-review="true" aria-label="Build SEO Schema Review">Build SEO Schema Review</button>
                            <button type="button" data-arcsecs-export-selected-route-draft-json="true" aria-label="Export Selected Route Draft JSON">Export Selected Route Draft JSON</button>
                            <button type="button" data-arcsecs-export-all-route-drafts-json="true" aria-label="Export All Route Drafts JSON">Export All Route Drafts JSON</button>
                            <button type="button" data-arcsecs-export-seo-schema-review-json="true" aria-label="Export SEO Schema Review JSON">Export SEO Schema Review JSON</button>
                        </div>
                        <div class="arcsecs-route-draft-filter-grid" aria-label="Public Demo Route Draft Bundle filters">
                            <label>Scenario<select data-arcsecs-route-draft-filter-scenario="true" aria-label="Filter route drafts by scenario"><option value="all">all</option><option value="distanceTimeKernel">Distance-Time Kernel</option><option value="relationalLattice">Relational Lattice</option><option value="tiredLightEnergyLedger">Tired-Light Photon Energy Ledger</option><option value="massivePhotonLensing">Massive Photon / Proca Dispersion</option><option value="flatSpaceLensing">Flat-Space Lensing</option><option value="mondRotationCurves">MOND Rotation Curves</option><option value="parallaxCalibration">Parallax Calibration</option><option value="darkMatterRamjet">Dark Matter Ramjet</option><option value="multiMessengerEvents">Multi-Messenger Events</option></select></label>
                            <label>Copy readiness<select data-arcsecs-route-draft-filter-copy-readiness="true" aria-label="Filter route drafts by copy readiness"><option value="all">all</option><option value="draft">draft</option><option value="reviewer-ready">reviewer-ready</option><option value="ready-with-warnings">ready-with-warnings</option><option value="blocked">blocked</option><option value="rejected">rejected</option></select></label>
                            <label>Schema status<select data-arcsecs-route-draft-filter-schema-status="true" aria-label="Filter route drafts by schema status"><option value="all">all</option><option value="reviewer-draft">reviewer-draft</option><option value="needs-review">needs-review</option><option value="blocked">blocked</option></select></label>
                            <label>Route warning status<select data-arcsecs-route-draft-filter-warning="true" aria-label="Filter route drafts by warning status"><option value="all">all</option><option value="clear">clear</option><option value="warnings">warnings</option></select></label>
                            <label>Placeholder labels<select data-arcsecs-route-draft-filter-placeholder="true" aria-label="Filter route drafts by placeholder label status"><option value="all">all</option><option value="labeled">labeled</option><option value="needs-labels">needs-labels</option></select></label>
                            <label>Set route draft status<select data-arcsecs-route-draft-status="true" aria-label="Set local-only route draft status"><option value="draft">draft</option><option value="reviewer-ready">reviewer-ready</option><option value="ready-with-warnings">ready-with-warnings</option><option value="blocked">blocked</option><option value="rejected">rejected</option></select></label>
                        </div>
                        <div class="arcsecs-route-draft-safeguard" data-arcsecs-route-draft-safeguard="true">Route safeguard: suggested slugs, metadata, internal links, and JSON-LD notes are local reviewer drafts only. They are not published, not proof, not operational capability, and contain no executable content.</div>
                        <div class="arcsecs-route-draft-status" data-arcsecs-route-draft-status-output="true" aria-live="polite">Public Demo Route Draft Bundle waiting for Copy Review Bundle rows.</div>
                        <div class="arcsecs-route-draft-table-wrap" role="region" aria-label="Public Demo Route Draft Bundle table" tabindex="0">
                            <table class="arcsecs-route-draft-table" data-arcsecs-route-draft-table="true">
                                <caption>Local route draft rows for public demo planning</caption>
                                <thead><tr><th>Scenario</th><th>Suggested slug</th><th>Page title</th><th>Meta title</th><th>Meta description</th><th>Canonical note</th><th>Readiness</th><th>Warnings</th><th>Source/equation</th><th>Falsification</th><th>Links</th></tr></thead>
                                <tbody data-arcsecs-route-draft-body="true"><tr><td colspan="11">No route draft rows yet. Click Build Route Draft Bundle.</td></tr></tbody>
                            </table>
                        </div>
                    </section>

                    <section class="arcsecs-readiness-sweep-panel arcsecs-seo-schema-review" data-arcsecs-seo-schema-review="true" aria-label="SEO Schema Review panel">
                        <header>
                            <span>SEO Schema Review</span>
                            <h2>Review cautious JSON-LD notes before any future public-page implementation</h2>
                            <p>SEO Schema Review rows are reviewer-draft only. They do not inject schema into live pages, do not call remote services, and do not claim scientific validation.</p>
                        </header>
                        <div class="arcsecs-seo-schema-status" data-arcsecs-seo-schema-status="true" aria-live="polite">SEO Schema Review waiting for route draft rows.</div>
                        <div class="arcsecs-route-quality-status" data-arcsecs-route-quality-status="true" aria-live="polite">Route/copy quality checks detect missing slug, meta title, meta description, speculative boundary, falsification note, source/equation callout, proof wording, operational-capability wording, and unlabeled placeholders.</div>
                        <div class="arcsecs-seo-schema-table-wrap" role="region" aria-label="SEO Schema Review table" tabindex="0">
                            <table class="arcsecs-seo-schema-table" data-arcsecs-seo-schema-table="true">
                                <caption>Reviewer-draft schema and internal link suggestions</caption>
                                <thead><tr><th>Scenario</th><th>Schema type</th><th>Headline</th><th>Description</th><th>Image/caption note</th><th>Author/publisher placeholder</th><th>About/topic notes</th><th>Citation/source notes</th><th>Caution/disclaimer notes</th><th>Falsification note</th></tr></thead>
                                <tbody data-arcsecs-seo-schema-body="true"><tr><td colspan="10">No schema review rows yet. Click Build SEO Schema Review.</td></tr></tbody>
                            </table>
                        </div>
                    </section>

                    <section class="arcsecs-readiness-sweep-panel arcsecs-public-demo-publication-handoff-manifest" data-arcsecs-public-demo-publication-handoff-manifest="true" aria-label="Public Demo Publication Handoff Manifest panel">
                        <header>
                            <span>Public Demo Publication Handoff Manifest</span>
                            <h2>Package reviewer-only publication handoff rows without publishing</h2>
                            <p>Publication handoff rows combine route drafts, SEO schema review notes, copy bundles, scripts, captions, evidence packs, source/equation rows, and falsification notes. They are reviewer handoff drafts only: no WordPress pages are created, no posts are published, no live schema is injected, and no remote services are called.</p>
                        </header>
                        <div class="arcsecs-button-row arcsecs-publication-handoff-actions">
                            <button type="button" data-arcsecs-build-publication-handoff-manifest="true" aria-label="Build Publication Handoff Manifest">Build Publication Handoff Manifest</button>
                            <button type="button" data-arcsecs-build-static-page-draft-export="true" aria-label="Build Static Page Draft Export">Build Static Page Draft Export</button>
                            <button type="button" data-arcsecs-export-selected-static-page-draft-json="true" aria-label="Export Selected Static Page Draft JSON">Export Selected Static Page Draft JSON</button>
                            <button type="button" data-arcsecs-export-all-static-page-drafts-json="true" aria-label="Export All Static Page Drafts JSON">Export All Static Page Drafts JSON</button>
                            <button type="button" data-arcsecs-export-publication-handoff-manifest-json="true" aria-label="Export Publication Handoff Manifest JSON">Export Publication Handoff Manifest JSON</button>
                        </div>
                        <div class="arcsecs-publication-handoff-filter-grid" aria-label="Public Demo Publication Handoff Manifest filters">
                            <label>Scenario<select data-arcsecs-publication-handoff-filter-scenario="true" aria-label="Filter publication handoff by scenario"><option value="all">all</option><option value="distanceTimeKernel">Distance-Time Kernel</option><option value="relationalLattice">Relational Lattice</option><option value="tiredLightEnergyLedger">Tired-Light Photon Energy Ledger</option><option value="massivePhotonLensing">Massive Photon / Proca Dispersion</option><option value="flatSpaceLensing">Flat-Space Lensing</option><option value="mondRotationCurves">MOND Rotation Curves</option><option value="parallaxCalibration">Parallax Calibration</option><option value="darkMatterRamjet">Dark Matter Ramjet</option><option value="multiMessengerEvents">Multi-Messenger Events</option></select></label>
                            <label>Route draft<select data-arcsecs-publication-handoff-filter-route-status="true" aria-label="Filter publication handoff by route draft status"><option value="all">all</option><option value="draft">draft</option><option value="reviewer-ready">reviewer-ready</option><option value="ready-with-warnings">ready-with-warnings</option><option value="blocked">blocked</option><option value="rejected">rejected</option></select></label>
                            <label>Schema status<select data-arcsecs-publication-handoff-filter-schema-status="true" aria-label="Filter publication handoff by schema status"><option value="all">all</option><option value="reviewer-draft">reviewer-draft</option><option value="needs-review">needs-review</option><option value="blocked">blocked</option></select></label>
                            <label>Copy readiness<select data-arcsecs-publication-handoff-filter-copy-readiness="true" aria-label="Filter publication handoff by copy readiness"><option value="all">all</option><option value="draft">draft</option><option value="reviewer-ready">reviewer-ready</option><option value="ready-with-warnings">ready-with-warnings</option><option value="blocked">blocked</option><option value="rejected">rejected</option></select></label>
                            <label>Evidence pack<select data-arcsecs-publication-handoff-filter-evidence-pack="true" aria-label="Filter publication handoff by evidence pack status"><option value="all">all</option><option value="present">present</option><option value="missing">missing</option></select></label>
                            <label>Warning status<select data-arcsecs-publication-handoff-filter-warning="true" aria-label="Filter publication handoff by warning status"><option value="all">all</option><option value="clear">clear</option><option value="warnings">warnings</option></select></label>
                            <label>Set handoff status<select data-arcsecs-publication-handoff-status="true" aria-label="Set local-only publication handoff status"><option value="draft">draft</option><option value="reviewer-ready">reviewer-ready</option><option value="ready-with-warnings">ready-with-warnings</option><option value="blocked">blocked</option><option value="rejected">rejected</option></select></label>
                        </div>
                        <div class="arcsecs-publication-handoff-safeguard" data-arcsecs-publication-handoff-safeguard="true">Publication handoff safeguard: this tool exports inert reviewer handoff drafts only. It does not create pages, publish posts, inject schema, validate links, fetch remote content, prove physics, or imply operational capability.</div>
                        <div class="arcsecs-publication-handoff-status" data-arcsecs-publication-handoff-status-output="true" aria-live="polite">Publication Handoff Manifest waiting for route drafts, schema review, and copy bundles.</div>
                        <div class="arcsecs-publication-handoff-table-wrap" role="region" aria-label="Public Demo Publication Handoff Manifest table" tabindex="0">
                            <table class="arcsecs-publication-handoff-table" data-arcsecs-publication-handoff-table="true">
                                <caption>Reviewer-only publication handoff rows</caption>
                                <thead><tr><th>Scenario</th><th>Slug</th><th>Page title</th><th>Meta title</th><th>Meta description</th><th>Schema</th><th>Copy</th><th>Route warnings</th><th>Evidence</th><th>Source/equation</th><th>Falsification</th><th>Placeholder labels</th><th>Handoff status</th></tr></thead>
                                <tbody data-arcsecs-publication-handoff-body="true"><tr><td colspan="13">No publication handoff rows yet. Click Build Publication Handoff Manifest.</td></tr></tbody>
                            </table>
                        </div>
                    </section>

                    <section class="arcsecs-readiness-sweep-panel arcsecs-static-page-draft-export" data-arcsecs-static-page-draft-export="true" aria-label="Static Page Draft Export panel">
                        <header>
                            <span>Static Page Draft Export</span>
                            <h2>Export inert static page drafts for human reviewer use</h2>
                            <p>Static Page Draft Export rows combine metadata, hero copy, intro copy, demo script sections, screenshot captions, alt text, telemetry/source/equation/falsification callouts, boundary copy, schema review, text-only link rows, evidence packs, and recommended fixes. They are not live pages and contain no executable content.</p>
                        </header>
                        <div class="arcsecs-static-page-draft-status" data-arcsecs-static-page-draft-status="true" aria-live="polite">Static Page Draft Export waiting for publication handoff rows.</div>
                        <div class="arcsecs-handoff-quality-status" data-arcsecs-handoff-quality-status="true" aria-live="polite">Handoff quality checks detect missing route draft, schema review, copy review, demo script, screenshot caption, evidence pack, source matrix, equation library, falsification callout, boundary text, proof wording, operational-capability wording, and unlabeled placeholders.</div>
                        <div class="arcsecs-static-page-draft-table-wrap" role="region" aria-label="Static Page Draft Export table" tabindex="0">
                            <table class="arcsecs-static-page-draft-table" data-arcsecs-static-page-draft-table="true">
                                <caption>Inert static page draft exports for human reviewer handoff</caption>
                                <thead><tr><th>Scenario</th><th>Route metadata</th><th>Hero title</th><th>Intro paragraph</th><th>Script sections</th><th>Screenshot caption</th><th>Alt text</th><th>Telemetry callout</th><th>Source/equation callout</th><th>Falsification callout</th><th>Boundary copy</th><th>Schema review</th><th>Fixes</th></tr></thead>
                                <tbody data-arcsecs-static-page-draft-body="true"><tr><td colspan="13">No static page draft rows yet. Click Build Static Page Draft Export.</td></tr></tbody>
                            </table>
                        </div>
                    </section>



                    <section class="arcsecs-readiness-sweep-panel arcsecs-static-draft-review-import" data-arcsecs-static-draft-review-import="true" aria-label="Static Draft Review Import panel">
                        <header>
                            <span>Static Draft Review Import</span>
                            <h2>Compare pasted inert static draft exports against the current local draft state</h2>
                            <p>Static Draft Review Import accepts pasted Static Page Draft Export JSON and Publication Handoff Manifest JSON for local review only. Invalid JSON and executable-looking content are rejected visibly. Nothing is uploaded, fetched, stored remotely, published, or executed.</p>
                        </header>
                        <div class="arcsecs-button-row arcsecs-static-draft-review-actions">
                            <button type="button" data-arcsecs-import-static-draft-review-json="true" aria-label="Import Static Draft Review JSON">Import Static Draft Review JSON</button>
                            <button type="button" data-arcsecs-build-page-readiness-diff="true" aria-label="Build Page Readiness Diff">Build Page Readiness Diff</button>
                            <button type="button" data-arcsecs-export-page-readiness-diff-json="true" aria-label="Export Page Readiness Diff JSON">Export Page Readiness Diff JSON</button>
                            <button type="button" data-arcsecs-clear-static-draft-review-imports="true" aria-label="Clear Static Draft Review Imports">Clear Static Draft Review Imports</button>
                        </div>
                        <div class="arcsecs-static-draft-review-input-grid">
                            <label>Static Page Draft Export JSON<textarea data-arcsecs-static-page-draft-import-json="true" rows="7" aria-label="Paste inert Static Page Draft Export JSON"></textarea></label>
                            <label>Publication Handoff Manifest JSON<textarea data-arcsecs-publication-handoff-import-json="true" rows="7" aria-label="Paste inert Publication Handoff Manifest JSON"></textarea></label>
                        </div>
                        <div class="arcsecs-static-draft-review-safeguard" data-arcsecs-static-draft-review-safeguard="true">Import safeguard: pasted content is parsed as inert JSON only. Executable-looking strings, scripts, event handlers, javascript URLs, dynamic imports, eval, Function constructors, and require calls are rejected visibly. This tool does not publish, create pages, fetch links, or validate live routes.</div>
                        <div class="arcsecs-static-draft-review-status" data-arcsecs-static-draft-review-status="true" aria-live="polite">Static Draft Review Import waiting for pasted inert JSON.</div>
                        <div class="arcsecs-static-draft-review-table-wrap" role="region" aria-label="Static Draft Review Import summary table" tabindex="0">
                            <table class="arcsecs-static-draft-review-table" data-arcsecs-static-draft-review-table="true">
                                <caption>Imported static draft review summaries</caption>
                                <thead><tr><th>Import</th><th>Status</th><th>Package</th><th>Export type</th><th>Generated UTC</th><th>Scenario count</th><th>Warnings</th><th>Rejected rows</th></tr></thead>
                                <tbody data-arcsecs-static-draft-review-body="true"><tr><td colspan="8">No imports yet. Paste inert JSON and click Import Static Draft Review JSON.</td></tr></tbody>
                            </table>
                        </div>
                    </section>

                    <section class="arcsecs-readiness-sweep-panel arcsecs-page-readiness-diff" data-arcsecs-page-readiness-diff="true" aria-label="Page Readiness Diff panel">
                        <header>
                            <span>Page Readiness Diff</span>
                            <h2>Identify static-page readiness differences before human publishing work</h2>
                            <p>Page Readiness Diff compares imported static drafts and publication handoff manifests against the current local route, copy, schema, evidence, source, equation, and boundary state. It is local-only review metadata and never publishes anything.</p>
                        </header>
                        <div class="arcsecs-page-readiness-filter-grid" aria-label="Page Readiness Diff filters">
                            <label>Scenario<select data-arcsecs-page-readiness-filter-scenario="true" aria-label="Filter page readiness diff by scenario"><option value="all">all</option><option value="distanceTimeKernel">Distance-Time Kernel</option><option value="relationalLattice">Relational Lattice</option><option value="tiredLightEnergyLedger">Tired-Light Photon Energy Ledger</option><option value="massivePhotonLensing">Massive Photon / Proca Dispersion</option><option value="flatSpaceLensing">Flat-Space Lensing</option><option value="mondRotationCurves">MOND Rotation Curves</option><option value="parallaxCalibration">Parallax Calibration</option><option value="darkMatterRamjet">Dark Matter Ramjet</option><option value="multiMessengerEvents">Multi-Messenger Events</option></select></label>
                            <label>Diff status<select data-arcsecs-page-readiness-filter-diff-status="true" aria-label="Filter page readiness diff by diff status"><option value="all">all</option><option value="added">added</option><option value="removed">removed</option><option value="changed">changed</option><option value="unchanged">unchanged</option><option value="missing">missing</option><option value="stale">stale</option><option value="warning">warning</option><option value="rejected">rejected</option></select></label>
                            <label>Warning status<select data-arcsecs-page-readiness-filter-warning="true" aria-label="Filter page readiness diff by warning status"><option value="all">all</option><option value="clear">clear</option><option value="warnings">warnings</option></select></label>
                            <label>Stale status<select data-arcsecs-page-readiness-filter-stale="true" aria-label="Filter page readiness diff by stale status"><option value="all">all</option><option value="current">current</option><option value="stale">stale</option></select></label>
                            <label>Missing fields<select data-arcsecs-page-readiness-filter-missing="true" aria-label="Filter page readiness diff by missing field status"><option value="all">all</option><option value="complete">complete</option><option value="missing-fields">missing-fields</option></select></label>
                            <label>Set diff review status<select data-arcsecs-page-readiness-diff-review-status="true" aria-label="Set local-only diff review status"><option value="not-reviewed">not-reviewed</option><option value="reviewer-ready">reviewer-ready</option><option value="ready-with-warnings">ready-with-warnings</option><option value="needs-revision">needs-revision</option><option value="blocked">blocked</option><option value="rejected">rejected</option></select></label>
                        </div>
                        <div class="arcsecs-page-readiness-status" data-arcsecs-page-readiness-diff-status="true" aria-live="polite">Page Readiness Diff waiting for imported static draft review JSON.</div>
                        <div class="arcsecs-page-readiness-assistant-status" data-arcsecs-page-readiness-assistant-status="true" aria-live="polite">Page Readiness Difference Assistant detects missing route metadata, schema review, copy review, demo script, screenshot caption, alt text, evidence pack, source matrix, equation library, falsification, boundary text, unsafe wording, and stale package versions.</div>
                        <div class="arcsecs-page-readiness-diff-table-wrap" role="region" aria-label="Page Readiness Diff table" tabindex="0">
                            <table class="arcsecs-page-readiness-diff-table" data-arcsecs-page-readiness-diff-table="true">
                                <caption>Local page readiness difference rows</caption>
                                <thead><tr><th>Scenario</th><th>Diff status</th><th>Review status</th><th>Changed fields</th><th>Missing fields</th><th>Warnings</th><th>Rejected phrases</th><th>Recommended fixes</th><th>Stale package</th></tr></thead>
                                <tbody data-arcsecs-page-readiness-diff-body="true"><tr><td colspan="9">No diff rows yet. Import static draft review JSON and click Build Page Readiness Diff.</td></tr></tbody>
                            </table>
                        </div>
                    </section>



                    <section class="arcsecs-readiness-sweep-panel arcsecs-static-publication-review-checklist" data-arcsecs-static-publication-review-checklist="true" aria-label="Static Publication Review Checklist panel">
                        <header>
                            <span>Static Publication Review Checklist</span>
                            <h2>Reviewer-only final freeze checklist for static page drafts</h2>
                            <p>This local checklist turns the Page Readiness Diff into a final human-review freeze checklist. It does not publish, create WordPress pages, inject schema, fetch links, validate routes, or call remote services.</p>
                        </header>
                        <div class="arcsecs-button-row arcsecs-static-publication-review-actions">
                            <button type="button" data-arcsecs-build-static-publication-review-checklist="true" aria-label="Build Static Publication Review Checklist">Build Static Publication Review Checklist</button>
                            <button type="button" data-arcsecs-build-page-draft-freeze-bundle="true" aria-label="Build Page Draft Freeze Bundle">Build Page Draft Freeze Bundle</button>
                            <button type="button" data-arcsecs-export-selected-freeze-bundle-json="true" aria-label="Export Selected Freeze Bundle JSON">Export Selected Freeze Bundle JSON</button>
                            <button type="button" data-arcsecs-export-all-freeze-bundles-json="true" aria-label="Export All Freeze Bundles JSON">Export All Freeze Bundles JSON</button>
                        </div>
                        <div class="arcsecs-static-publication-filter-grid" aria-label="Static Publication Review filters">
                            <label>Scenario<select data-arcsecs-static-publication-filter-scenario="true" aria-label="Filter static publication review by scenario"><option value="all">all</option><option value="distanceTimeKernel">Distance-Time Kernel</option><option value="relationalLattice">Relational Lattice</option><option value="tiredLightEnergyLedger">Tired-Light Photon Energy Ledger</option><option value="massivePhotonLensing">Massive Photon / Proca Dispersion</option><option value="flatSpaceLensing">Flat-Space Lensing</option><option value="mondRotationCurves">MOND Rotation Curves</option><option value="parallaxCalibration">Parallax Calibration</option><option value="darkMatterRamjet">Dark Matter Ramjet</option><option value="multiMessengerEvents">Multi-Messenger Events</option></select></label>
                            <label>Diff status<select data-arcsecs-static-publication-filter-diff-status="true" aria-label="Filter static publication review by diff status"><option value="all">all</option><option value="added">added</option><option value="removed">removed</option><option value="changed">changed</option><option value="unchanged">unchanged</option><option value="missing">missing</option><option value="stale">stale</option><option value="warning">warning</option><option value="rejected">rejected</option></select></label>
                            <label>Freeze status<select data-arcsecs-static-publication-filter-freeze-status="true" aria-label="Filter static publication review by freeze status"><option value="all">all</option><option value="not-reviewed">not-reviewed</option><option value="frozen-for-review">frozen-for-review</option><option value="frozen-with-warnings">frozen-with-warnings</option><option value="needs-revision">needs-revision</option><option value="blocked">blocked</option><option value="rejected">rejected</option></select></label>
                            <label>Warning status<select data-arcsecs-static-publication-filter-warning="true" aria-label="Filter static publication review by warning status"><option value="all">all</option><option value="clear">clear</option><option value="warnings">warnings</option></select></label>
                            <label>Stale status<select data-arcsecs-static-publication-filter-stale="true" aria-label="Filter static publication review by stale status"><option value="all">all</option><option value="current">current</option><option value="stale">stale</option></select></label>
                            <label>Rejected phrase status<select data-arcsecs-static-publication-filter-rejected-phrase="true" aria-label="Filter static publication review by rejected phrase status"><option value="all">all</option><option value="clear">clear</option><option value="rejected-phrases">rejected-phrases</option></select></label>
                            <label>Set freeze status<select data-arcsecs-static-publication-freeze-status="true" aria-label="Set local-only freeze status"><option value="not-reviewed">not-reviewed</option><option value="frozen-for-review">frozen-for-review</option><option value="frozen-with-warnings">frozen-with-warnings</option><option value="needs-revision">needs-revision</option><option value="blocked">blocked</option><option value="rejected">rejected</option></select></label>
                        </div>
                        <div class="arcsecs-static-publication-status" data-arcsecs-static-publication-review-status="true" aria-live="polite">Static Publication Review Checklist waiting for Page Readiness Diff rows.</div>
                        <div class="arcsecs-static-publication-copy-safeguard" data-arcsecs-static-publication-copy-safeguard="true">Freeze safeguard: frozen-for-review means a local human-review artifact only. It is not publishing automation, not proof, not scientific validation, not real propulsion, and not operational capability.</div>
                        <div class="arcsecs-static-publication-table-wrap" role="region" aria-label="Static Publication Review Checklist table" tabindex="0">
                            <table class="arcsecs-static-publication-review-table" data-arcsecs-static-publication-review-table="true">
                                <caption>Static publication review checklist rows</caption>
                                <thead><tr><th>Scenario</th><th>Diff</th><th>Review</th><th>Stale</th><th>Missing fields</th><th>Warnings</th><th>Rejected phrases</th><th>Route metadata</th><th>Schema review</th><th>Copy review</th><th>Evidence pack</th><th>Source/equation</th><th>Falsification</th><th>Boundary</th><th>Freeze status</th></tr></thead>
                                <tbody data-arcsecs-static-publication-review-body="true"><tr><td colspan="15">No checklist rows yet. Build Static Publication Review Checklist.</td></tr></tbody>
                            </table>
                        </div>
                    </section>

                    <section class="arcsecs-readiness-sweep-panel arcsecs-page-draft-freeze-bundle" data-arcsecs-page-draft-freeze-bundle="true" aria-label="Page Draft Freeze Bundle panel">
                        <header>
                            <span>Page Draft Freeze Bundle</span>
                            <h2>Package static page draft rows for final human review</h2>
                            <p>Page Draft Freeze Bundle exports inert JSON review artifacts only. It blocks final freeze when required route metadata, schema review, copy review, script/caption content, evidence/source/equation rows, falsification text, boundary text, or safe wording is missing.</p>
                        </header>
                        <div class="arcsecs-page-draft-freeze-status" data-arcsecs-page-draft-freeze-status="true" aria-live="polite">Page Draft Freeze Bundle waiting for checklist rows.</div>
                        <div class="arcsecs-page-draft-freeze-table-wrap" role="region" aria-label="Page Draft Freeze Bundle table" tabindex="0">
                            <table class="arcsecs-page-draft-freeze-table" data-arcsecs-page-draft-freeze-table="true">
                                <caption>Local inert page draft freeze bundle rows</caption>
                                <thead><tr><th>Scenario</th><th>Freeze status</th><th>Route/static draft</th><th>Schema/copy</th><th>Script/caption</th><th>Evidence/source/equation</th><th>Warnings</th><th>Rejected phrases</th><th>Recommended fixes</th><th>Executable code</th></tr></thead>
                                <tbody data-arcsecs-page-draft-freeze-body="true"><tr><td colspan="10">No freeze bundles yet. Build Page Draft Freeze Bundle.</td></tr></tbody>
                            </table>
                        </div>
                    </section>



                    <section class="arcsecs-readiness-sweep-panel arcsecs-static-publish-handoff-qa-summary" data-arcsecs-static-publish-handoff-qa-summary="true" aria-label="Static Publish Handoff QA Summary panel">
                        <header>
                            <span>Static Publish Handoff QA Summary</span>
                            <h2>Final human-review QA summary for static page handoff</h2>
                            <p>This local-only QA summary reads Page Draft Freeze Bundle rows and summarizes whether each public-page draft is ready for human publishing preparation. It does not create WordPress pages, publish posts, inject schema, fetch links, validate routes, or call remote services.</p>
                        </header>
                        <div class="arcsecs-button-row arcsecs-static-publish-qa-actions">
                            <button type="button" data-arcsecs-build-publish-handoff-qa-summary="true" aria-label="Build Publish Handoff QA Summary">Build Publish Handoff QA Summary</button>
                            <button type="button" data-arcsecs-build-public-page-content-checklist="true" aria-label="Build Public Page Content Checklist">Build Public Page Content Checklist</button>
                            <button type="button" data-arcsecs-export-selected-qa-summary-json="true" aria-label="Export Selected QA Summary JSON">Export Selected QA Summary JSON</button>
                            <button type="button" data-arcsecs-export-all-qa-summaries-json="true" aria-label="Export All QA Summaries JSON">Export All QA Summaries JSON</button>
                            <button type="button" data-arcsecs-export-public-page-content-checklist-json="true" aria-label="Export Public Page Content Checklist JSON">Export Public Page Content Checklist JSON</button>
                        </div>
                        <div class="arcsecs-static-publish-qa-filter-grid" aria-label="Static Publish Handoff QA filters">
                            <label>Scenario<select data-arcsecs-static-publish-qa-filter-scenario="true" aria-label="Filter QA summary by scenario"><option value="all">all</option><option value="distanceTimeKernel">Distance-Time Kernel</option><option value="relationalLattice">Relational Lattice</option><option value="tiredLightEnergyLedger">Tired-Light Photon Energy Ledger</option><option value="massivePhotonLensing">Massive Photon / Proca Dispersion</option><option value="flatSpaceLensing">Flat-Space Lensing</option><option value="mondRotationCurves">MOND Rotation Curves</option><option value="parallaxCalibration">Parallax Calibration</option><option value="darkMatterRamjet">Dark Matter Ramjet</option><option value="multiMessengerEvents">Multi-Messenger Events</option></select></label>
                            <label>Freeze status<select data-arcsecs-static-publish-qa-filter-freeze-status="true" aria-label="Filter QA summary by freeze status"><option value="all">all</option><option value="not-reviewed">not-reviewed</option><option value="frozen-for-review">frozen-for-review</option><option value="frozen-with-warnings">frozen-with-warnings</option><option value="needs-revision">needs-revision</option><option value="blocked">blocked</option><option value="rejected">rejected</option></select></label>
                            <label>QA status<select data-arcsecs-static-publish-qa-filter-qa-status="true" aria-label="Filter QA summary by QA status"><option value="all">all</option><option value="not-reviewed">not-reviewed</option><option value="qa-ready">qa-ready</option><option value="qa-ready-with-warnings">qa-ready-with-warnings</option><option value="needs-revision">needs-revision</option><option value="blocked">blocked</option><option value="rejected">rejected</option></select></label>
                            <label>Warning status<select data-arcsecs-static-publish-qa-filter-warning="true" aria-label="Filter QA summary by warning status"><option value="all">all</option><option value="clear">clear</option><option value="warnings">warnings</option></select></label>
                            <label>Rejected phrase status<select data-arcsecs-static-publish-qa-filter-rejected-phrase="true" aria-label="Filter QA summary by rejected phrase status"><option value="all">all</option><option value="clear">clear</option><option value="rejected-phrases">rejected-phrases</option></select></label>
                            <label>Checklist completion<select data-arcsecs-static-publish-qa-filter-checklist-completion="true" aria-label="Filter public page content checklist by completion"><option value="all">all</option><option value="complete">complete</option><option value="incomplete">incomplete</option></select></label>
                            <label>Set QA status<select data-arcsecs-static-publish-qa-status="true" aria-label="Set local-only QA status"><option value="not-reviewed">not-reviewed</option><option value="qa-ready">qa-ready</option><option value="qa-ready-with-warnings">qa-ready-with-warnings</option><option value="needs-revision">needs-revision</option><option value="blocked">blocked</option><option value="rejected">rejected</option></select></label>
                        </div>
                        <div class="arcsecs-static-publish-qa-status" data-arcsecs-static-publish-handoff-qa-status="true" aria-live="polite">Static Publish Handoff QA Summary waiting for freeze bundle rows.</div>
                        <div class="arcsecs-static-publish-qa-copy-safeguard" data-arcsecs-static-publish-qa-copy-safeguard="true">QA safeguard: qa-ready is a human-review handoff state only. It is not proof, not scientific validation, not real propulsion, not operational capability, and not publishing automation.</div>
                        <div class="arcsecs-static-publish-qa-table-wrap" role="region" aria-label="Static Publish Handoff QA Summary table" tabindex="0">
                            <table class="arcsecs-static-publish-handoff-qa-table" data-arcsecs-static-publish-handoff-qa-table="true">
                                <caption>Static publish handoff QA summary rows</caption>
                                <thead><tr><th>Scenario</th><th>Freeze status</th><th>Route metadata</th><th>Schema review</th><th>Copy review</th><th>Evidence pack</th><th>Source/equation</th><th>Falsification</th><th>Boundary</th><th>Warnings</th><th>Rejected phrases</th><th>Recommended fixes</th><th>Final QA status</th></tr></thead>
                                <tbody data-arcsecs-static-publish-handoff-qa-body="true"><tr><td colspan="13">No QA rows yet. Build Publish Handoff QA Summary.</td></tr></tbody>
                            </table>
                        </div>
                    </section>

                    <section class="arcsecs-readiness-sweep-panel arcsecs-public-page-content-checklist" data-arcsecs-public-page-content-checklist="true" aria-label="Public Page Content Checklist panel">
                        <header>
                            <span>Public Page Content Checklist</span>
                            <h2>Public page content checklist for human publishing preparation</h2>
                            <p>This local checklist summarizes copy fields, route metadata, script sections, screenshot captions, alt text, telemetry/source/equation/falsification/boundary callouts, schema notes, internal link text rows, evidence references, rejected phrases, and placeholder/speculative labels. It does not write to a server.</p>
                        </header>
                        <div class="arcsecs-public-page-content-status" data-arcsecs-public-page-content-checklist-status="true" aria-live="polite">Public Page Content Checklist waiting for QA rows.</div>
                        <div class="arcsecs-public-page-content-table-wrap" role="region" aria-label="Public Page Content Checklist table" tabindex="0">
                            <table class="arcsecs-public-page-content-checklist-table" data-arcsecs-public-page-content-checklist-table="true">
                                <caption>Public page content checklist rows</caption>
                                <thead><tr><th>Scenario</th><th>Route metadata</th><th>Copy fields</th><th>Script sections</th><th>Screenshot caption</th><th>Alt text</th><th>Telemetry/source/equation/falsification/boundary callouts</th><th>Schema note</th><th>Internal links</th><th>Evidence reference</th><th>Rejected phrase status</th><th>Placeholder/speculative label status</th><th>Checklist completion</th></tr></thead>
                                <tbody data-arcsecs-public-page-content-checklist-body="true"><tr><td colspan="13">No content checklist rows yet. Build Public Page Content Checklist.</td></tr></tbody>
                            </table>
                        </div>
                    </section>

                    <section class="arcsecs-readiness-sweep-panel arcsecs-manual-publishing-runbook" data-arcsecs-manual-publishing-runbook="true" aria-label="Public Page Manual Publishing Runbook panel">
                        <header>
                            <span>Public Page Manual Publishing Runbook</span>
                            <h2>Local manual WordPress publishing preparation checklist</h2>
                            <p>This human-review runbook reads the Static Publish Handoff QA Summary, Public Page Content Checklist, and Page Draft Freeze Bundle to prepare manual WordPress publishing. It does not create pages, publish posts, inject schema, fetch links, validate routes, or call remote services.</p>
                        </header>
                        <div class="arcsecs-button-row arcsecs-manual-runbook-actions">
                            <button type="button" data-arcsecs-build-manual-publishing-runbook="true" aria-label="Build Manual Publishing Runbook">Build Manual Publishing Runbook</button>
                            <button type="button" data-arcsecs-build-post-deploy-verification-checklist="true" aria-label="Build Post-Deploy Verification Checklist">Build Post-Deploy Verification Checklist</button>
                            <button type="button" data-arcsecs-export-selected-manual-runbook-json="true" aria-label="Export Selected Manual Runbook JSON">Export Selected Manual Runbook JSON</button>
                            <button type="button" data-arcsecs-export-all-manual-runbooks-json="true" aria-label="Export All Manual Runbooks JSON">Export All Manual Runbooks JSON</button>
                            <button type="button" data-arcsecs-export-post-deploy-verification-checklist-json="true" aria-label="Export Post-Deploy Verification Checklist JSON">Export Post-Deploy Verification Checklist JSON</button>
                        </div>
                        <div class="arcsecs-manual-runbook-filter-grid" aria-label="Manual Publishing Runbook filters">
                            <label>Scenario<select data-arcsecs-manual-runbook-filter-scenario="true" aria-label="Filter manual runbook by scenario"><option value="all">all</option><option value="distanceTimeKernel">Distance-Time Kernel</option><option value="relationalLattice">Relational Lattice</option><option value="tiredLightEnergyLedger">Tired-Light Photon Energy Ledger</option><option value="massivePhotonLensing">Massive Photon / Proca Dispersion</option><option value="flatSpaceLensing">Flat-Space Lensing</option><option value="mondRotationCurves">MOND Rotation Curves</option><option value="parallaxCalibration">Parallax Calibration</option><option value="darkMatterRamjet">Dark Matter Ramjet</option><option value="multiMessengerEvents">Multi-Messenger Events</option></select></label>
                            <label>QA status<select data-arcsecs-manual-runbook-filter-qa-status="true" aria-label="Filter manual runbook by QA status"><option value="all">all</option><option value="not-reviewed">not-reviewed</option><option value="qa-ready">qa-ready</option><option value="qa-ready-with-warnings">qa-ready-with-warnings</option><option value="needs-revision">needs-revision</option><option value="blocked">blocked</option><option value="rejected">rejected</option></select></label>
                            <label>Checklist completion<select data-arcsecs-manual-runbook-filter-checklist-completion="true" aria-label="Filter manual runbook by checklist completion"><option value="all">all</option><option value="complete">complete</option><option value="incomplete">incomplete</option></select></label>
                            <label>Warning status<select data-arcsecs-manual-runbook-filter-warning="true" aria-label="Filter manual runbook by warning status"><option value="all">all</option><option value="clear">clear</option><option value="warnings">warnings</option></select></label>
                            <label>Rejected phrases<select data-arcsecs-manual-runbook-filter-rejected-phrase="true" aria-label="Filter manual runbook by rejected phrase status"><option value="all">all</option><option value="clear">clear</option><option value="rejected-phrases">rejected-phrases</option></select></label>
                            <label>Manual handoff<select data-arcsecs-manual-runbook-filter-manual-handoff="true" aria-label="Filter manual runbook by manual handoff status"><option value="all">all</option><option value="not-reviewed">not-reviewed</option><option value="handoff-ready">handoff-ready</option><option value="handoff-ready-with-warnings">handoff-ready-with-warnings</option><option value="needs-revision">needs-revision</option><option value="blocked">blocked</option><option value="rejected">rejected</option></select></label>
                            <label>Set manual handoff status<select data-arcsecs-manual-handoff-status="true" aria-label="Set local-only manual handoff status"><option value="not-reviewed">not-reviewed</option><option value="handoff-ready">handoff-ready</option><option value="handoff-ready-with-warnings">handoff-ready-with-warnings</option><option value="needs-revision">needs-revision</option><option value="blocked">blocked</option><option value="rejected">rejected</option></select></label>
                        </div>
                        <div class="arcsecs-manual-publishing-runbook-status" data-arcsecs-manual-publishing-runbook-status="true" aria-live="polite">Manual Publishing Runbook waiting for QA rows and public page checklist rows.</div>
                        <div class="arcsecs-manual-publishing-safeguard" data-arcsecs-manual-publishing-safeguard="true">Manual handoff safeguard: handoff-ready is not proof, not scientific validation, not real propulsion, not operational capability, and not publishing automation. A human must publish manually outside this tool.</div>
                        <div class="arcsecs-manual-publishing-runbook-table-wrap" role="region" aria-label="Public Page Manual Publishing Runbook table" tabindex="0">
                            <table class="arcsecs-manual-publishing-runbook-table" data-arcsecs-manual-publishing-runbook-table="true">
                                <caption>Local manual publishing runbook rows</caption>
                                <thead><tr><th>Scenario</th><th>QA status</th><th>Checklist completion</th><th>Suggested slug</th><th>Page title</th><th>Meta title</th><th>Meta description</th><th>Hero title</th><th>Schema note</th><th>Evidence reference</th><th>Warnings</th><th>Rejected phrases</th><th>Manual handoff</th></tr></thead>
                                <tbody data-arcsecs-manual-publishing-runbook-body="true"><tr><td colspan="13">No manual runbook rows yet. Build Manual Publishing Runbook.</td></tr></tbody>
                            </table>
                        </div>
                    </section>

                    <section class="arcsecs-readiness-sweep-panel arcsecs-post-deploy-verification-checklist" data-arcsecs-post-deploy-verification-checklist="true" aria-label="Post-Deploy Verification Checklist panel">
                        <header>
                            <span>Post-Deploy Verification Checklist</span>
                            <h2>Human-only post-deploy verification checklist</h2>
                            <p>This checklist prepares manual post-deploy checks for pages a human may publish later. Values stay local and pending until a human reviews the live page manually. The plugin does not fetch or verify live pages automatically.</p>
                        </header>
                        <div class="arcsecs-post-deploy-verification-status" data-arcsecs-post-deploy-verification-status="true" aria-live="polite">Post-Deploy Verification Checklist waiting for manual runbook rows.</div>
                        <div class="arcsecs-post-deploy-verification-table-wrap" role="region" aria-label="Post-Deploy Verification Checklist table" tabindex="0">
                            <table class="arcsecs-post-deploy-verification-table" data-arcsecs-post-deploy-verification-table="true">
                                <caption>Local post-deploy verification checklist rows</caption>
                                <thead><tr><th>Scenario</th><th>Manual handoff</th><th>Route created</th><th>Title visible</th><th>Meta reviewed</th><th>Boundary visible</th><th>Falsification visible</th><th>Source/equation visible</th><th>Screenshot caption visible</th><th>Alt text reviewed</th><th>Placeholder labels visible</th><th>No proof wording</th><th>No operational-capability wording</th><th>Export archive retained</th></tr></thead>
                                <tbody data-arcsecs-post-deploy-verification-body="true"><tr><td colspan="14">No post-deploy verification rows yet. Build Post-Deploy Verification Checklist.</td></tr></tbody>
                            </table>
                        </div>
                    </section>



                    <section class="arcsecs-readiness-sweep-panel arcsecs-manual-publishing-archive-receipt" data-arcsecs-manual-publishing-archive-receipt="true" aria-label="Manual Publishing Archive Receipt panel">
                        <header>
                            <span>Manual Publishing Archive Receipt</span>
                            <h2>Local archive receipt for manual publishing review</h2>
                            <p>This panel records which manual runbook rows and post-deploy checklist rows are ready for human review. It is local review metadata only and does not publish anything.</p>
                        </header>
                        <div class="arcsecs-button-row arcsecs-archive-receipt-actions">
                            <button type="button" data-arcsecs-build-manual-publishing-archive-receipt="true" aria-label="Build Manual Publishing Archive Receipt">Build Manual Publishing Archive Receipt</button>
                            <button type="button" data-arcsecs-export-selected-archive-receipt-json="true" aria-label="Export Selected Archive Receipt JSON">Export Selected Archive Receipt JSON</button>
                            <button type="button" data-arcsecs-export-all-archive-receipts-json="true" aria-label="Export All Archive Receipts JSON">Export All Archive Receipts JSON</button>
                        </div>
                        <div class="arcsecs-archive-filter-grid" aria-label="Manual Publishing Archive Receipt filters">
                            <label>Scenario<select data-arcsecs-archive-filter-scenario="true" aria-label="Filter archive receipt by scenario"><option value="all">all</option><option value="distanceTimeKernel">Distance-Time Kernel</option><option value="relationalLattice">Relational Lattice</option><option value="tiredLightEnergyLedger">Tired-Light Photon Energy Ledger</option><option value="massivePhotonLensing">Massive Photon / Proca Dispersion</option><option value="flatSpaceLensing">Flat-Space Lensing</option><option value="mondRotationCurves">MOND Rotation Curves</option><option value="parallaxCalibration">Parallax Calibration</option><option value="darkMatterRamjet">Dark Matter Ramjet</option><option value="multiMessengerEvents">Multi-Messenger Events</option></select></label>
                            <label>Manual handoff<select data-arcsecs-archive-filter-manual-handoff="true" aria-label="Filter archive receipt by manual handoff status"><option value="all">all</option><option value="not-reviewed">not-reviewed</option><option value="handoff-ready">handoff-ready</option><option value="handoff-ready-with-warnings">handoff-ready-with-warnings</option><option value="needs-revision">needs-revision</option><option value="blocked">blocked</option><option value="rejected">rejected</option></select></label>
                            <label>Verification<select data-arcsecs-archive-filter-verification="true" aria-label="Filter archive receipt by verification status"><option value="all">all</option><option value="pending-human-verification">pending-human-verification</option><option value="verified-by-human">verified-by-human</option></select></label>
                            <label>Archive receipt<select data-arcsecs-archive-filter-archive-status="true" aria-label="Filter archive receipt by archive status"><option value="all">all</option><option value="not-reviewed">not-reviewed</option><option value="archived-for-review">archived-for-review</option><option value="archived-with-warnings">archived-with-warnings</option><option value="needs-revision">needs-revision</option><option value="blocked">blocked</option><option value="rejected">rejected</option></select></label>
                            <label>Sign-off<select data-arcsecs-archive-filter-signoff-status="true" aria-label="Filter sign-off by status"><option value="all">all</option><option value="not-reviewed">not-reviewed</option><option value="signed-off-for-manual-publishing">signed-off-for-manual-publishing</option><option value="signed-off-with-warnings">signed-off-with-warnings</option><option value="needs-revision">needs-revision</option><option value="blocked">blocked</option><option value="rejected">rejected</option></select></label>
                            <label>Warnings<select data-arcsecs-archive-filter-warning="true" aria-label="Filter archive receipt by warnings"><option value="all">all</option><option value="clear">clear</option><option value="warnings">warnings</option></select></label>
                            <label>Rejected phrases<select data-arcsecs-archive-filter-rejected-phrase="true" aria-label="Filter archive receipt by rejected phrase status"><option value="all">all</option><option value="clear">clear</option><option value="rejected-phrases">rejected-phrases</option></select></label>
                            <label>Set archive receipt status<select data-arcsecs-archive-receipt-status="true" aria-label="Set local-only archive receipt status"><option value="not-reviewed">not-reviewed</option><option value="archived-for-review">archived-for-review</option><option value="archived-with-warnings">archived-with-warnings</option><option value="needs-revision">needs-revision</option><option value="blocked">blocked</option><option value="rejected">rejected</option></select></label>
                        </div>
                        <div class="arcsecs-manual-publishing-archive-receipt-status" data-arcsecs-manual-publishing-archive-receipt-status="true" aria-live="polite">Manual Publishing Archive Receipt waiting for manual runbook and post-deploy rows.</div>
                        <div class="arcsecs-archive-receipt-safeguard">Archive receipts are inert local review metadata only. They are not proof, not operational capability, and not publishing automation.</div>
                        <div class="arcsecs-archive-receipt-table-wrap" role="region" aria-label="Manual Publishing Archive Receipt table" tabindex="0">
                            <table class="arcsecs-archive-receipt-table" data-arcsecs-archive-receipt-table="true">
                                <caption>Local manual publishing archive receipt rows</caption>
                                <thead><tr><th>Scenario</th><th>Manual handoff</th><th>Verification</th><th>Slug</th><th>Page title</th><th>Meta title</th><th>Meta description</th><th>Evidence reference</th><th>Warnings</th><th>Rejected phrases</th><th>Export archive retained</th><th>Archive receipt</th></tr></thead>
                                <tbody data-arcsecs-manual-publishing-archive-receipt-body="true"><tr><td colspan="12">No archive receipt rows yet. Build Manual Publishing Archive Receipt.</td></tr></tbody>
                            </table>
                        </div>
                    </section>

                    <section class="arcsecs-readiness-sweep-panel arcsecs-human-review-signoff-export" data-arcsecs-human-review-signoff-export="true" aria-label="Human Review Sign-Off Export panel">
                        <header>
                            <span>Human Review Sign-Off Export</span>
                            <h2>Local human review sign-off export</h2>
                            <p>This panel creates inert sign-off rows for human publishing review. It keeps reviewer notes local and does not create, publish, validate, fetch, or execute anything.</p>
                        </header>
                        <div class="arcsecs-human-review-signoff-fields">
                            <label>Reviewer name or handle <input type="text" data-arcsecs-human-reviewer-name="true" aria-label="Reviewer name or handle optional" placeholder="optional reviewer name or handle" /></label>
                            <label>Sign-off status<select data-arcsecs-human-review-signoff-status="true" aria-label="Set human review sign-off status"><option value="not-reviewed">not-reviewed</option><option value="signed-off-for-manual-publishing">signed-off-for-manual-publishing</option><option value="signed-off-with-warnings">signed-off-with-warnings</option><option value="needs-revision">needs-revision</option><option value="blocked">blocked</option><option value="rejected">rejected</option></select></label>
                            <label>Review note <textarea data-arcsecs-human-review-note="true" aria-label="Human review note optional" rows="3" placeholder="Optional local review note"></textarea></label>
                        </div>
                        <div class="arcsecs-button-row arcsecs-human-review-signoff-actions">
                            <button type="button" data-arcsecs-build-human-review-signoff-export="true" aria-label="Build Human Review Sign-Off Export">Build Human Review Sign-Off Export</button>
                            <button type="button" data-arcsecs-export-human-review-signoff-json="true" aria-label="Export Human Review Sign-Off JSON">Export Human Review Sign-Off JSON</button>
                        </div>
                        <div class="arcsecs-human-review-signoff-status" data-arcsecs-human-review-signoff-status-output="true" aria-live="polite">Human Review Sign-Off Export waiting for archive receipt rows.</div>
                        <div class="arcsecs-human-review-signoff-table-wrap" role="region" aria-label="Human Review Sign-Off Export table" tabindex="0">
                            <table class="arcsecs-human-review-signoff-table" data-arcsecs-human-review-signoff-table="true">
                                <caption>Local human review sign-off rows</caption>
                                <thead><tr><th>Scenario</th><th>Reviewer</th><th>Sign-off</th><th>Manual handoff</th><th>Verification</th><th>Archive receipt</th><th>Evidence reference</th><th>Warnings</th><th>Rejected phrases</th><th>Recommended fixes</th></tr></thead>
                                <tbody data-arcsecs-human-review-signoff-body="true"><tr><td colspan="10">No sign-off rows yet. Build Human Review Sign-Off Export.</td></tr></tbody>
                            </table>
                        </div>
                    </section>



                    <section class="arcsecs-readiness-sweep-panel arcsecs-public-publishing-evidence-archive-index" data-arcsecs-public-publishing-evidence-archive-index="true" aria-label="Public Publishing Evidence Archive Index panel">
                        <header>
                            <span>Public Publishing Evidence Archive Index</span>
                            <h2>Local reviewer retrieval index for publishing evidence</h2>
                            <p>This panel organizes archive receipts, human sign-off exports, manual runbook rows, post-deploy checklist rows, QA rows, content checklists, freeze bundles, source/equation rows, and falsification notes for retrieval. It is local reviewer retrieval metadata only and does not publish anything.</p>
                        </header>
                        <div class="arcsecs-button-row arcsecs-archive-index-actions">
                            <button type="button" data-arcsecs-build-publishing-evidence-archive-index="true" aria-label="Build Publishing Evidence Archive Index">Build Publishing Evidence Archive Index</button>
                            <button type="button" data-arcsecs-export-selected-archive-index-json="true" aria-label="Export Selected Archive Index JSON">Export Selected Archive Index JSON</button>
                            <button type="button" data-arcsecs-export-all-archive-index-json="true" aria-label="Export All Archive Index JSON">Export All Archive Index JSON</button>
                        </div>
                        <div class="arcsecs-archive-index-filter-grid" aria-label="Public Publishing Evidence Archive Index filters">
                            <label>Scenario<select data-arcsecs-archive-index-filter-scenario="true" aria-label="Filter archive index by scenario"><option value="all">all</option><option value="distanceTimeKernel">Distance-Time Kernel</option><option value="relationalLattice">Relational Lattice</option><option value="tiredLightEnergyLedger">Tired-Light Photon Energy Ledger</option><option value="massivePhotonLensing">Massive Photon / Proca Dispersion</option><option value="flatSpaceLensing">Flat-Space Lensing</option><option value="mondRotationCurves">MOND Rotation Curves</option><option value="parallaxCalibration">Parallax Calibration</option><option value="darkMatterRamjet">Dark Matter Ramjet</option><option value="multiMessengerEvents">Multi-Messenger Events</option></select></label>
                            <label>Archive receipt<select data-arcsecs-archive-index-filter-archive-status="true" aria-label="Filter archive index by archive receipt status"><option value="all">all</option><option value="not-reviewed">not-reviewed</option><option value="archived-for-review">archived-for-review</option><option value="archived-with-warnings">archived-with-warnings</option><option value="needs-revision">needs-revision</option><option value="blocked">blocked</option><option value="rejected">rejected</option></select></label>
                            <label>Sign-off<select data-arcsecs-archive-index-filter-signoff-status="true" aria-label="Filter archive index by sign-off status"><option value="all">all</option><option value="not-reviewed">not-reviewed</option><option value="signed-off-for-manual-publishing">signed-off-for-manual-publishing</option><option value="signed-off-with-warnings">signed-off-with-warnings</option><option value="needs-revision">needs-revision</option><option value="blocked">blocked</option><option value="rejected">rejected</option></select></label>
                            <label>Retrieval<select data-arcsecs-archive-index-filter-retrieval-status="true" aria-label="Filter archive index by retrieval status"><option value="all">all</option><option value="not-reviewed">not-reviewed</option><option value="retrievable">retrievable</option><option value="retrievable-with-warnings">retrievable-with-warnings</option><option value="needs-revision">needs-revision</option><option value="blocked">blocked</option><option value="rejected">rejected</option></select></label>
                            <label>Warnings<select data-arcsecs-archive-index-filter-warning="true" aria-label="Filter archive index by warnings"><option value="all">all</option><option value="clear">clear</option><option value="warnings">warnings</option></select></label>
                            <label>Rejected phrases<select data-arcsecs-archive-index-filter-rejected-phrase="true" aria-label="Filter archive index by rejected phrase status"><option value="all">all</option><option value="clear">clear</option><option value="rejected-phrases">rejected-phrases</option></select></label>
                            <label>Source/equation<select data-arcsecs-archive-index-filter-source-equation="true" aria-label="Filter archive index by source and equation status"><option value="all">all</option><option value="complete">complete</option><option value="missing">missing</option></select></label>
                            <label>Boundary<select data-arcsecs-archive-index-filter-boundary="true" aria-label="Filter archive index by boundary status"><option value="all">all</option><option value="boundary-present">boundary-present</option><option value="boundary-missing">boundary-missing</option></select></label>
                            <label>Archive retrieval status<select data-arcsecs-archive-retrieval-status="true" aria-label="Set local-only archive retrieval status"><option value="not-reviewed">not-reviewed</option><option value="retrievable">retrievable</option><option value="retrievable-with-warnings">retrievable-with-warnings</option><option value="needs-revision">needs-revision</option><option value="blocked">blocked</option><option value="rejected">rejected</option></select></label>
                        </div>
                        <div class="arcsecs-archive-index-status" data-arcsecs-publishing-evidence-archive-index-status="true" aria-live="polite">Public Publishing Evidence Archive Index waiting for archive receipt and sign-off rows.</div>
                        <div class="arcsecs-archive-index-safeguard">Archive retrieval metadata is local-only. It does not publish pages, create content, inject schema, fetch links, prove physics, or imply operational capability.</div>
                        <div class="arcsecs-archive-index-table-wrap" role="region" aria-label="Public Publishing Evidence Archive Index table" tabindex="0">
                            <table class="arcsecs-archive-index-table" data-arcsecs-publishing-evidence-archive-index-table="true">
                                <caption>Local public publishing evidence archive index rows</caption>
                                <thead><tr><th>Scenario</th><th>Slug</th><th>Page title</th><th>Manual handoff</th><th>Verification</th><th>Archive receipt</th><th>Sign-off</th><th>Reviewer</th><th>Warnings</th><th>Rejected phrases</th><th>Recommended fixes</th><th>Falsification</th><th>Boundary</th><th>Source/equation</th><th>Retrieval</th></tr></thead>
                                <tbody data-arcsecs-publishing-evidence-archive-index-body="true"><tr><td colspan="15">No archive index rows yet. Build Publishing Evidence Archive Index.</td></tr></tbody>
                            </table>
                        </div>
                    </section>

                    <section class="arcsecs-readiness-sweep-panel arcsecs-reviewer-retrieval-notes" data-arcsecs-reviewer-retrieval-notes="true" aria-label="Reviewer Retrieval Notes panel">
                        <header>
                            <span>Reviewer Retrieval Notes</span>
                            <h2>Local retrieval notes for archived publishing evidence</h2>
                            <p>This panel builds retrieval note rows from the archive index, sign-off rows, archive receipts, manual runbooks, post-deploy checklists, QA rows, content checklists, freeze bundles, source/equation rows, and falsification notes. It keeps all data local and export-only.</p>
                        </header>
                        <div class="arcsecs-reviewer-retrieval-note-fields">
                            <label>Retrieval note <textarea data-arcsecs-reviewer-retrieval-note="true" aria-label="Reviewer retrieval note optional" rows="3" placeholder="Optional local retrieval note"></textarea></label>
                        </div>
                        <div class="arcsecs-button-row arcsecs-reviewer-retrieval-note-actions">
                            <button type="button" data-arcsecs-build-reviewer-retrieval-notes="true" aria-label="Build Reviewer Retrieval Notes">Build Reviewer Retrieval Notes</button>
                            <button type="button" data-arcsecs-export-reviewer-retrieval-notes-json="true" aria-label="Export Reviewer Retrieval Notes JSON">Export Reviewer Retrieval Notes JSON</button>
                        </div>
                        <div class="arcsecs-reviewer-retrieval-notes-status" data-arcsecs-reviewer-retrieval-notes-status="true" aria-live="polite">Reviewer Retrieval Notes waiting for archive index rows.</div>
                        <div class="arcsecs-reviewer-retrieval-notes-table-wrap" role="region" aria-label="Reviewer Retrieval Notes table" tabindex="0">
                            <table class="arcsecs-reviewer-retrieval-notes-table" data-arcsecs-reviewer-retrieval-notes-table="true">
                                <caption>Local reviewer retrieval note rows</caption>
                                <thead><tr><th>Scenario</th><th>Retrieval</th><th>Archive receipt</th><th>Sign-off</th><th>Source matrix</th><th>Equation library</th><th>Boundary</th><th>Falsification notes</th><th>Warnings</th><th>Recommended fixes</th><th>Retrieval note</th></tr></thead>
                                <tbody data-arcsecs-reviewer-retrieval-notes-body="true"><tr><td colspan="11">No retrieval note rows yet. Build Reviewer Retrieval Notes.</td></tr></tbody>
                            </table>
                        </div>
                    </section>

                    <div class="arcsecs-ramjet-pipeline-deck" aria-label="Dark Matter Drive Ramjet subsystem quick inspector">
                        <button type="button" data-arcsecs-subsystem-focus="eitScoop" title="Inspect the Projected EIT Scoop Field: conceptual capture field diameter, capture rate, field stability, and low-density fuel collection risk."><strong>01</strong><span>EIT Scoop</span><em>field capture</em></button>
                        <button type="button" data-arcsecs-subsystem-focus="hibeShield" title="Inspect the HIBE Composite Ice Shield: ablation armor, shield integrity, hazard flux, and critical shield warnings."><strong>02</strong><span>HIBE Shield</span><em>ablation armor</em></button>
                        <button type="button" data-arcsecs-subsystem-focus="intakeVortex" title="Inspect the Intake Throat / Ramscoop Vortex: controlled inflow, compression preparation, turbulence, and intake drag risk."><strong>03</strong><span>Ramscoop</span><em>vortex intake</em></button>
                        <button type="button" data-arcsecs-subsystem-focus="fishbackSolenoid" title="Inspect the Fishback Solenoid: drag decoupling, effective residual drag, saturation, and quench risk."><strong>04</strong><span>Fishback</span><em>drag decouple</em></button>
                        <button type="button" data-arcsecs-subsystem-focus="stationaryBuffer" title="Inspect the Stationary-Light / Dark-State Polariton Buffer: stored-energy fill level, saturation, decoherence, and reactor starvation risk."><strong>05</strong><span>DSP Buffer</span><em>stored light</em></button>
                        <button type="button" data-arcsecs-subsystem-focus="reactorCore" title="Inspect the Reactor Core: massive-photon re-energization proxy, reactor input/output power, efficiency, and overload risk."><strong>06</strong><span>Reactor</span><em>re-energize</em></button>
                        <button type="button" data-arcsecs-subsystem-focus="thermalSystem" title="Inspect the Thermal Management System: waste heat, radiator load, rejection capacity, and thermal overload risk."><strong>07</strong><span>Thermal</span><em>waste heat</em></button>
                        <button type="button" data-arcsecs-subsystem-focus="exhaustCollimator" title="Inspect the Exhaust Collimator: directional photon exhaust, thrust proxy, divergence, and phase-jitter risk."><strong>08</strong><span>Exhaust</span><em>thrust wake</em></button>
                    </div>
                    <article class="arcsecs-viewport-wrap" data-testid="main-viewport">
                        <canvas data-arcsecs-viewport="true" title="Main live visualization viewport. This is the primary scientific scene for the selected scenario; the panels around it explain the current model and diagnostics." width="1600" height="900" aria-label="Canvas visualization of the selected ArcSecs physics scenario">ArcSecs physics engine visualization canvas.</canvas>
                        <div class="arcsecs-viewport-overlay" data-arcsecs-overlay="true"></div>
                        <div class="arcsecs-viewport-corner top-left">RELATIONAL FIELD</div>
                        <div class="arcsecs-viewport-corner top-right">LIVE SOLVER</div>
                        <div class="arcsecs-viewport-corner bottom-left">NO-SPACETIME MODEL</div>
                        <div class="arcsecs-viewport-corner bottom-right">ARCSECS.COM</div>
                    </article>
                    <section class="arcsecs-distance-time-kernel" data-arcsecs-distance-time-kernel="true" aria-label="Distance-Time Kernel demonstration">
                        <header><span>Distance-Time Kernel</span><h2>No-Lightyear Distance / Clockless Time</h2><p>Speculative research visualization: gravity-wave baseline first, electromagnetic light later, weaker, redder, stretched, faded, uncertain, or missing.</p></header>
                        <div class="arcsecs-distance-time-telemetry" data-arcsecs-distance-time-telemetry="true" aria-live="polite">Run the Distance-Time Kernel to populate parsec distance, clockless progression, wavefront, and photon-degradation telemetry.</div>
                    </section>
                    <section class="arcsecs-event-theater" data-arcsecs-event-theater="true" aria-label="Multi-Messenger Event Theater">
                        <header><span>Multi-Messenger Event Theater</span><h2>What caused the delay?</h2></header>
                        <div data-arcsecs-event-theater-panel="true" aria-live="polite">Select an event and run the Distance-Time Kernel to compare gravity and light arrivals.</div>
                    </section>

                    <div class="arcsecs-telemetry-strip" data-testid="telemetry-strip">
                        <span>FPS <strong data-arcsecs-fps="true">—</strong></span>
                        <span>Tick <strong data-arcsecs-tick="true">0</strong></span>
                        <span>Frame ms <strong data-arcsecs-frame-ms="true">—</strong></span>
                        <span>Entities <strong data-arcsecs-entity-count="true">—</strong></span>
                        <span>Photons <strong data-arcsecs-photon-count="true">—</strong></span>
                        <span title="Solver Links / Constraints. Counts the active structural relationships, calibration constraints, relation edges, field boundary conditions, rigid-body constraints, or subsystem couplings used by the active scenario.">Solver Links <strong data-arcsecs-constraint-count="true">—</strong></span>
                        <span>Status <strong data-arcsecs-status="true" role="status" aria-live="polite">Initializing</strong></span>
                    </div>
                    <section class="arcsecs-bottom-graphs" data-testid="bottom-graphs" aria-label="Graphs and telemetry" title="Bottom graph strip: these two panels are not extra empty content. They are reserved for live scenario charts: the left graph shows the active model signal, and the right graph shows the baseline, comparison, or energy-ledger signal.">
                        <article class="arcsecs-graph-card" title="Primary Model Graph: this lower-left area is reserved for the main live chart of the active scenario. Depending on the selected mode it can show photon energy, redshift, force magnitude, capture rate, calibration error, rigid-body energy, or solver stability.">
                            <header><strong>Primary Model Graph</strong><span data-arcsecs-primary-graph-caption="true">Main scenario signal</span></header>
                            <p>The main plotted value for the selected mode.</p>
                            <canvas data-arcsecs-graph="primary" title="Primary live graph. This plots the main quantity for the active scenario, such as photon energy, redshift, force behavior, capture rate, calibration error, or solver stability." width="900" height="260" aria-label="Primary model graph"></canvas>
                        </article>
                        <article class="arcsecs-graph-card" title="Comparison / Ledger Graph: this lower-right area is reserved for baseline comparison and ledger behavior. It shows how the speculative branch differs from the reference model or where energy, drag, heat, and thrust proxies are moving.">
                            <header><strong>Comparison / Ledger Graph</strong><span data-arcsecs-secondary-graph-caption="true">Baseline and accounting signal</span></header>
                            <p>The reference model, comparison branch, or energy accounting signal.</p>
                            <canvas data-arcsecs-graph="secondary" title="Secondary comparison graph. This plots the baseline or comparison model, such as massless versus massive photons, Newtonian versus speculative branch, or thermal/ledger comparison." width="900" height="260" aria-label="Secondary comparison graph"></canvas>
                        </article>
                    </section>
                </section>

                <aside class="arcsecs-panel arcsecs-diagnostics-panel" data-testid="right-panel" aria-label="Diagnostics and model panels">
                    <section class="arcsecs-priority-panel">
                        <h2>Operator Summary</h2>
                        <p data-arcsecs-operator-summary="true">Select a scenario or run the default relational lattice to populate the mission summary.</p>
                    </section>
                    <section class="arcsecs-priority-panel arcsecs-claim-map-panel" data-arcsecs-claim-map="true" aria-label="Framework Claim Map">
                        <h2>What This Demonstrates</h2>
                        <p>Claim → Visual demo → Telemetry → Validation → Export → Falsification path.</p>
                        <div data-arcsecs-claim-map-cards="true" class="arcsecs-claim-map-cards">Run the Distance-Time Kernel to activate claim cards.</div>
                        <div data-arcsecs-claim-map-explanation="true" class="arcsecs-claim-map-explanation" aria-live="polite">Click a claim card to highlight the viewport, telemetry, validation, and export evidence path.</div>
                    </section>

                    <section class="arcsecs-priority-panel arcsecs-live-health-panel" title="Live Demo Health Monitor: verifies that the visible cockpit is receiving fresh, finite, scenario-derived telemetry and that the Universal Cosmic Clock is not stale.">
                        <h2>Live Demo Health Monitor</h2>
                        <div data-arcsecs-live-health="true">Run a scenario to verify clock motion, telemetry integrity, solver-link counts, and finite scenario output.</div>
                    </section>
                    <section class="arcsecs-priority-panel arcsecs-experiment-recipes-panel" title="Quick Experiment Recipes: plain-language experiments a visitor can try immediately without understanding the full model.">
                        <h2>Quick Experiment Recipes</h2>
                        <div data-arcsecs-experiment-recipes="true">Run a scenario to load simple experiment recipes for the current mode.</div>
                    </section>
                    <section class="arcsecs-priority-panel arcsecs-parameter-guide-launch-panel" title="Run Your Own Simulation Parameter Guide: curated example demos that populate every relevant sandbox option for visitors.">
                        <h2>Run Your Own Simulation</h2>
                        <p>Open example demos that set photon mass, tired-light loss, oscillator damping, dark-star capture, Galilean relative velocity, condensate halo growth, ramjet stress, or validation-lab values for you.</p>
                        <button type="button" data-arcsecs-parameter-guide-open="true" title="Open the modal parameter guide and choose a preset experiment.">Open Parameter Guide</button>
                    </section>

                    <section class="arcsecs-priority-panel arcsecs-signal-legend-panel" title="Signal Legend: decodes the major colors, counters, and graph regions so the display is readable without guessing.">
                        <h2>Signal Legend</h2>
                        <div data-arcsecs-signal-legend="true">Run a scenario to load the color, counter, and graph legend for the active mode.</div>
                    </section>
                    <section class="arcsecs-priority-panel arcsecs-public-guide-panel">
                        <h2>Public Guide</h2>
                        <div data-arcsecs-public-guide="true">Run a scenario to load a plain-language explanation, analogy, and first experiment to try.</div>
                    </section>
                    <section class="arcsecs-priority-panel arcsecs-physicist-notes-panel">
                        <h2>Physicist Notes</h2>
                        <div data-arcsecs-physicist-notes="true">Run a scenario to load invariants, baseline comparison, numerical health, and caution text.</div>
                    </section>
                    <section>
                        <h2>How to Read This Mode</h2>
                        <div data-arcsecs-walkthrough="true" class="arcsecs-walkthrough">A short step-by-step reading guide will appear after the first run.</div>
                    </section>
                    <section>
                        <h2>Assumption Ladder</h2>
                        <div data-arcsecs-assumption-ladder="true" class="arcsecs-assumption-ladder">Run a scenario to separate reference physics, implementation choices, speculative assumptions, and warnings.</div>
                    </section>
                    <section>
                        <h2>Equation / Ledger Card</h2>
                        <div data-arcsecs-equation-ledger="true" class="arcsecs-equation-ledger">Run a scenario to see the conceptual equation and current baseline delta.</div>
                    </section>
                    <section>
                        <h2>Slider Impact Map</h2>
                        <div data-arcsecs-slider-impact="true" class="arcsecs-slider-impact">Run a scenario to see which controls matter most for the selected mode.</div>
                    </section>
                    <section>
                        <h2>Physicist Scorecard</h2>
                        <div data-arcsecs-physicist-scorecard="true" class="arcsecs-physicist-scorecard">Run a scenario to populate the pass rate, finite-output status, ledger state, and warning state.</div>
                    </section>
                    <section>
                        <h2>Mini Glossary</h2>
                        <div data-arcsecs-glossary="true" class="arcsecs-glossary">Run a scenario to load concise definitions for baseline, ledger, speculative module, and deterministic run.</div>
                    </section>
                    <section class="arcsecs-relational-architecture-panel" title="Relational Architecture Console: explains the graph-based ECS, arcsecond/parsec scale, local oscillator probe, Soldner comparison, and Machian/Weber proxy emitted by the active scenario.">
                        <h2>Relational Architecture Console</h2>
                        <div data-arcsecs-relational-architecture="true">Run a scenario to populate the relational ECS topology, arcsecond/parsec scale, local oscillator probe, Soldner comparison, and Machian/Weber proxy.</div>
                    </section>
                    <section class="arcsecs-relational-workbench-panel" title="Relational Workbench: summarizes dynamic distance tethers, local oscillator probes, and the Leibniz Void demonstration. This is the practical UI layer for the ArcSecs relational design.">
                        <h2>Relational Workbench</h2>
                        <div data-arcsecs-relational-workbench="true">Run a scenario to populate dynamic distance tethers, local oscillator probes, and the Leibniz Void demonstration state.</div>
                    </section>
                    <section class="arcsecs-distance-time-story-panel" aria-label="How to Measure the Universe Without Lightyears">
                        <h2>How to Measure the Universe Without Lightyears</h2>
                        <div data-arcsecs-distance-time-story="true" class="arcsecs-distance-time-story" aria-live="polite">Story path waiting for the Distance-Time Kernel.</div>
                    </section>

                    <section class="arcsecs-visitor-storyboard-panel" title="Visitor Storyboard: explains the active mode as a presentation sequence, keeping the science interesting without removing the speculative boundary.">
                        <h2>Visitor Storyboard</h2>
                        <div data-arcsecs-visitor-storyboard="true" class="arcsecs-visitor-storyboard">Run a scenario to populate the visitor storyboard.</div>
                    </section>
                    <section>
                        <h2>Current Model Panel</h2>
                        <dl data-arcsecs-model-panel="true"></dl>
                    </section>
                    <section>
                        <h2>Diagnostics Panel</h2>
                        <dl data-arcsecs-diagnostics="true"></dl>
                    </section>
                    <section>
                        <h2>Model Comparison Panel</h2>
                        <div data-arcsecs-comparison="true"></div>
                    </section>
                    <section>
                        <h2>Explanation Panel</h2>
                        <div data-arcsecs-explanation="true"></div>
                    </section>
                    <section>
                        <h2>Scenario Contract</h2>
                        <div data-arcsecs-contract="true" class="arcsecs-contract-panel">Scenario contract pending.</div>
                    </section>
                    <section>
                        <h2>Runtime Audit</h2>
                        <div data-arcsecs-audit="true" class="arcsecs-audit-panel">Audit trail will appear after the first run.</div>
                    </section>
                    <section>
                        <h2>Validation Lab</h2>
                        <p>Deterministic internal consistency checks: parallax benchmark, photon ledger, finite telemetry, and speculative-label guardrails.</p>
                        <div data-arcsecs-validation-lab="true" class="arcsecs-validation-lab">Run a scenario to populate validation benchmarks.</div>
                    </section>
                    <section>
                        <h2>Observation Frame</h2>
                        <p>Synthetic measurement readout comparing the active speculative module against a baseline model.</p>
                        <div data-arcsecs-observation-frame="true" class="arcsecs-observation-frame">Observation frame pending.</div>
                    </section>
                    <section>
                        <h2>Calibration Certificate</h2>
                        <p>Checks the arcsecond/parsec benchmark, photon energy ledger, finite telemetry, and photometric sanity output.</p>
                        <div data-arcsecs-calibration-certificate="true" class="arcsecs-calibration-certificate">Run a scenario to issue a calibration certificate.</div>
                    </section>
                    <section>
                        <h2>Mode Readiness Matrix</h2>
                        <p>Tracks whether the selected mode has visualization, controls, diagnostics, baseline comparison, serialization, and scientific boundary text.</p>
                        <div data-arcsecs-readiness-matrix="true" class="arcsecs-readiness-matrix">Mode readiness pending.</div>
                    </section>
                    <section>
                        <h2>Quality Gate Report</h2>
                        <p>Deployment-oriented checks for finite telemetry, no Bootstrap, no legacy query library, safe import behavior, and active TDD pass rate.</p>
                        <div data-arcsecs-quality-gate="true" class="arcsecs-quality-gate">Run a scenario to populate the quality gate report.</div>
                    </section>
                    <section>
                        <h2>Scenario Passport</h2>
                        <p>Compact export-friendly summary of the active scenario assumptions, telemetry headline, and next recommended experiment.</p>
                        <div data-arcsecs-scenario-passport="true" class="arcsecs-scenario-passport">Scenario passport pending.</div>
                    </section>
                    <section>
                        <h2>Anomaly Triage</h2>
                        <p>Operator-focused list of numerical, ledger, warning-bus, and TDD issues detected in the current run.</p>
                        <div data-arcsecs-anomaly-triage="true" class="arcsecs-anomaly-triage">No anomaly triage yet.</div>
                    </section>
                    <section>
                        <h2>Accessibility Audit</h2>
                        <p>Static smoke audit for keyboard, labels, canvas fallback, focus, and visible disclaimer requirements.</p>
                        <div data-arcsecs-accessibility-audit="true" class="arcsecs-accessibility-audit">Accessibility audit pending.</div>
                    </section>
                    <section>
                        <h2>Performance Envelope</h2>
                        <p>Conceptual runtime budget showing worker isolation, particle load, frame budget estimate, and operator recommendation.</p>
                        <div data-arcsecs-performance-envelope="true" class="arcsecs-performance-envelope">Performance envelope pending.</div>
                    </section>
                    <section>
                        <h2>Test Coverage Dashboard</h2>
                        <p>Scenario-aware coverage view for math, simulation, photons, calibration, ramjet, and WordPress shell checks.</p>
                        <div data-arcsecs-test-coverage="true" class="arcsecs-test-coverage">Test coverage dashboard pending.</div>
                    </section>
                    <section>
                        <h2>Numerical Stability Drilldown</h2>
                        <p>Deterministic stability inspection for finite telemetry, frame budget, solver drift, and energy ledger closure.</p>
                        <div data-arcsecs-stability-drilldown="true" class="arcsecs-stability-drilldown">Numerical stability drilldown pending.</div>
                    </section>
                    <section>
                        <h2>Scenario Capability Map</h2>
                        <p>Shows which engine capabilities are active for the selected scenario, including renderer, solver, calibration, comparison, serialization, and warnings.</p>
                        <div data-arcsecs-capability-map="true" class="arcsecs-capability-map">Scenario capability map pending.</div>
                    </section>
                    <section>
                        <h2>Operator Runbook</h2>
                        <p>Step-by-step operator procedure for the current mode, with safe interpretation language and next actions.</p>
                        <div data-arcsecs-operator-runbook="true" class="arcsecs-operator-runbook">Operator runbook pending.</div>
                    </section>
                    <section>
                        <h2>Release Readiness Checklist</h2>
                        <p>Deployment checklist for WordPress route safety, assets, tests, exports, accessibility, and speculative boundary wording.</p>
                        <div data-arcsecs-release-checklist="true" class="arcsecs-release-checklist">Release readiness checklist pending.</div>
                    </section>
                    <section>
                        <h2>Guided Autopilot Tour</h2>
                        <p>Self-running visitor tour that turns the prompt-required modes into visible stage cards with plain-language goals, physicist checkpoints, pause/resume, and exportable progress.</p>
                        <div class="arcsecs-button-row">
                            <button type="button" data-arcsecs-tour="true" title="Start or restart the Guided Autopilot Tour from the current stage without hiding manual controls.">Start Guided Tour</button>
                            <button type="button" data-arcsecs-guided-tour-previous="true" title="Move the Guided Autopilot Tour to the previous scenario stage and run it.">Previous Stage</button>
                            <button type="button" data-arcsecs-guided-tour-next="true" title="Move the Guided Autopilot Tour to the next scenario stage and run it.">Next Stage</button>
                            <button type="button" data-arcsecs-guided-tour-pause="true" title="Pause the Guided Autopilot Tour narrative while leaving the current simulation inspectable.">Pause Tour</button>
                            <button type="button" data-arcsecs-guided-tour-resume="true" title="Resume the Guided Autopilot Tour narrative without forcing an automatic scenario change.">Resume Tour</button>
                            <button type="button" data-arcsecs-export-guided-tour="true" title="Export the Guided Autopilot Tour stage state, evidence summary, and caution labels as inert JSON.">Export Guided Tour</button>
                        </div>
                        <div data-arcsecs-guided-tour-panel="true" class="arcsecs-guided-tour-panel" aria-live="polite">Guided Autopilot Tour is queued. The selected scenario starts automatically, then the visible tour cards explain the nine-mode path.</div>
                    </section>


                    <section>
                        <h2>Review Cockpit</h2>
                        <p>Visitor and physicist review layer that summarizes the automatic tour, Grand Experiment evidence, flight recorder, weakest assumptions, and next actions.</p>
                        <div class="arcsecs-button-row">
                            <button type="button" data-arcsecs-build-review-cockpit="true" title="Rebuild the visitor and physicist review from the current Grand Experiment, Guided Tour, Flight Recorder, and latest metrics.">Build Review Cockpit</button>
                            <button type="button" data-arcsecs-export-review-cockpit="true" title="Export the Review Cockpit as inert JSON with no executable payloads.">Export Review Cockpit</button>
                        </div>
                        <div data-arcsecs-review-cockpit="true" class="arcsecs-review-cockpit" aria-live="polite">Review Cockpit waiting for Grand Experiment or Autopilot evidence.</div>
                    </section>

                    <section>
                        <h2>Next Action Command Center</h2>
                        <p>Executable follow-up queue generated from the Review Cockpit. It starts or resumes the tour, opens the weakest scenario, inspects the photon ledger, runs the evidence sweep, and prepares the cautious research bundle.</p>
                        <div class="arcsecs-button-row">
                            <button type="button" data-arcsecs-do-next-actions="true" title="Execute every currently available Review Cockpit next action without auto-claiming proof.">Do Next Actions</button>
                            <button type="button" data-arcsecs-export-research-bundle="true" title="Export the Review Cockpit, next-action plan, evidence sweep, guided tour, flight recorder, latest metrics, and caution boundary as inert JSON.">Export Research Bundle</button>
                        </div>
                        <div data-arcsecs-next-action-panel="true" class="arcsecs-next-action-panel" aria-live="polite">Next Action Command Center waiting for review evidence.</div>
                        <div data-arcsecs-ledger-next-action="true" class="arcsecs-ledger-next-action" aria-live="polite">Photon ledger action inspector waiting.</div>
                    </section>

                    <section>
                        <h2>Experiment Recorder</h2>
                        <p>Compact replay-style record of the current run, including mode, measured output, warning state, and export readiness.</p>
                        <div data-arcsecs-experiment-recorder="true" class="arcsecs-experiment-recorder" aria-live="polite">Autopilot Flight Recorder pending.</div>
                    </section>
                    <section>
                        <h2>Experiment Queue</h2>
                        <p>One-click ordered path through the largest ArcSecs experimental modes.</p>
                        <div data-arcsecs-experiment-queue="true" class="arcsecs-experiment-queue">Run any scenario to populate the queue.</div>
                    </section>

                    <section>
                        <h2>Plugin Implementation Memory</h2>
                        <p>Maintainer handoff for future agents: summarizes the current plugin architecture, crawler-access policy, Universal Cosmic Clock contract, telemetry-source rules, and test commands.</p>
                        <div data-arcsecs-uai-status="true" class="arcsecs-uai-status">Implementation memory pending until the first deterministic run completes.</div>
                    </section>

                    <section>
                        <h2>Automated Benchmark Suite</h2>
                        <p>Run the major scenarios as a compact validation sweep without changing the visible scene.</p>
                        <div data-arcsecs-benchmark-panel="true" class="arcsecs-benchmark-panel">Click Run Validation Lab to execute the multi-scenario benchmark.</div>
                    </section>
                    <section>
                        <h2>Grand Experiment Director</h2>
                        <p>Runs the nine prompt-required scenarios as a visitor-to-physicist sweep and creates an exportable evidence packet with caution labels.</p>
                        <div data-arcsecs-autolaunch-panel="true" class="arcsecs-autolaunch-panel">Page-load autopilot is queued: the selected scenario starts first, then the Grand Experiment evidence sweep starts automatically.</div>
                        <div data-arcsecs-grand-tour-panel="true" class="arcsecs-grand-tour-panel">Click Grand Experiment Sweep to run the scripted evidence path.</div>
                    </section>
                    <section>
                        <h2>Measurement History</h2>
                        <div data-arcsecs-measurement-history="true" class="arcsecs-measurement-history">No measurements recorded this session.</div>
                    </section>
                    <section>
                        <h2>Ramjet Subsystem Inspector</h2>
                        <div class="arcsecs-inspector-lede">Click a pipeline subsystem above to inspect its role, dependencies, warnings, and current telemetry.</div>
                        <div data-arcsecs-ramjet-inspector="true" class="arcsecs-ramjet-inspector">Select Dark Matter Ramjet to inspect EIT scoop, HIBE shield, Fishback solenoid, stationary-light buffer, reactor, thermal management, and exhaust.</div>
                    </section>
                    <section>
                        <h2>Energy Flow Graph</h2>
                        <div data-arcsecs-energy-flow="true" class="arcsecs-energy-flow">Capture → Intake → Compression → Buffer → Reactor → Thermal → Exhaust</div>
                    </section>
                    <section>
                        <h2>Ramjet Flight Director</h2>
                        <div data-arcsecs-flight-director="true" class="arcsecs-flight-director">Run the Dark Matter Ramjet scenario to receive stability, thermal, drag, and readiness calls.</div>
                    </section>
                    <section>
                        <h2>Subsystem State Table</h2>
                        <div data-arcsecs-subsystem-table="true" class="arcsecs-subsystem-table">Subsystem telemetry pending.</div>
                    </section>
                    <section>
                        <h2>Warning Timeline</h2>
                        <div data-arcsecs-warning-timeline="true" class="arcsecs-warning-timeline">No warning timeline yet.</div>
                    </section>
                    <section>
                        <h2>Ramjet Comparison Mode</h2>
                        <div data-arcsecs-ramjet-comparison="true" class="arcsecs-ramjet-comparison">Comparison output pending.</div>
                    </section>
                    <section>
                        <h2>Scene Memory</h2>
                        <div class="arcsecs-button-row"><button type="button" data-arcsecs-save-run="true">Save Run</button><button type="button" data-arcsecs-export-json="true">Export Report JSON</button><button type="button" data-arcsecs-export-csv="true">Export CSV</button></div>
                        <div data-arcsecs-memory-list="true" class="arcsecs-memory-list">No saved runs.</div>
                    </section>
                    <footer class="arcsecs-demo-footer">ArcSecs.com</footer>
                </aside>
            </main>

            <section class="arcsecs-ai-readable-summary" data-arcsecs-ai-summary="true" aria-label="AI-readable static summary of the ArcSecs Physics Engine Demo">
                <h2>About this simulation</h2>
                <p><strong>Speculative research visualization — not established current technology.</strong> The ArcSecs Physics Engine Demo is an interactive research sandbox for the ArcSecs model: relational flat-space simulation, tired-light redshift concepts, massive-photon/Proca-style comparison modes, calibration checks, rigid-body/ECS diagnostics, and Dark Matter Drive ramjet subsystem accounting.</p>
                <p>This static section exists for screen readers, search engines, AI agents, and crawler-style tools that may not execute the JavaScript simulator. The live cockpit above remains the primary interactive experience.</p>
                <h3>Scenario guide</h3>
                <ul>
                    <li><strong>Relational Lattice / Relational Flat-Space Engine:</strong> entities are material nodes and distances are relational edges; coordinates are rendering labels rather than physical containers.</li>
                    <li><strong>Teleparallel Gravity:</strong> displays flat-coordinate force/torsion-style vectors while avoiding claims that the visualization proves a replacement for General Relativity.</li>
                    <li><strong>Tired-Light and Mechanistic Redshift:</strong> tracks conceptual photon energy loss, redshift proxy, and forward-scattering cautions.</li>
                    <li><strong>Massive Photon / Proca Dispersion:</strong> compares a massless baseline against an effective massive-photon branch where low-frequency packets lag first.</li>
                    <li><strong>Flat-Space and Massive Photon Lensing:</strong> compares Soldner-style corpuscular deflection, configurable massive-photon correction, and a standard GR reference baseline.</li>
                    <li><strong>Absolute Time / Quantum Oscillator Damping:</strong> keeps one global tick count while near-mass oscillator probes show fewer local transitions.</li>
                    <li><strong>Newtonian Dark Star:</strong> shows photon escape velocity threshold, apogee, and captured or escaping state.</li>
                    <li><strong>Superluminal Galilean Relative Velocity:</strong> shows arithmetic relative velocity without a Lorentz limiter in this alternative hypothesis mode.</li>
                    <li><strong>Tired-Light Energy Ledger and Condensate:</strong> tracks energy lost by photons, ledger transfer, closure error, redshift, and halo-like condensate density.</li>
                    <li><strong>Calibration modes:</strong> parallax uses the one-arcsecond-to-one-parsec benchmark; photometry uses aperture/background subtraction and magnitude conversion.</li>
                    <li><strong>Rigid-Body / ECS Diagnostics:</strong> exposes entities, solver links, contacts, friction, restitution, constraints, and deterministic engine counters.</li>
                    <li><strong>Dark Matter Drive / Ramjet:</strong> visualizes a conceptual pipeline: EIT scoop, HIBE shield, ramscoop vortex, Fishback solenoid, compression, stationary-light buffer, reactor, thermal management, and exhaust collimator.</li>
                </ul>
                <h3>Telemetry interpretation</h3>
                <p><strong>FPS</strong> is render throughput. <strong>Tick</strong> is the immutable universal fixed-step counter. <strong>Entities</strong> are active scenario nodes, bodies, photons, or subsystems. <strong>Photons</strong> are active photon packets or photon-like samples. <strong>Solver Links</strong> are relational edges, constraints, calibration anchors, transport gates, or subsystem couplings. <strong>Ledger</strong>, <strong>risk</strong>, <strong>stability</strong>, and <strong>warning</strong> values are conceptual diagnostics, not measured physical performance.</p>
                <h3>ArcSecs interpretation boundaries</h3>
                <p>The demo uses careful language: ArcSecs model, ArcSecs interpretation, speculative simulation, alternative physics visualization, research sandbox, and conceptual model. It should not be summarized as proving tired light, photon mass, Weber gravity, or an operational dark matter drive.</p>
                <p><a href="<?php echo esc_url(home_url('/arcsecs-physics-engine-demo/ai-summary/')); ?>" title="Open the static AI-readable Markdown summary for the ArcSecs Physics Engine Demo.">Open AI-readable summary</a> · <a href="<?php echo esc_url(home_url('/llms.txt')); ?>" title="Open the site-level llms.txt crawler summary.">Open llms.txt</a></p>
            </section>

            <section id="arcsecs-command-palette" class="arcsecs-command-palette" data-arcsecs-command-panel="true" hidden aria-label="ArcSecs command palette">
                <div class="arcsecs-command-card">
                    <header><strong>Command Palette</strong><button type="button" data-arcsecs-command-close="true" aria-label="Close command palette">×</button></header>
                    <p>Keyboard: Space play/pause, R reset, S step, ? commands, 1-9 switch core scenarios.</p>
                    <div class="arcsecs-command-grid">
                        <button type="button" data-arcsecs-preset="distanceTimeKernel" title="Distance-Time Kernel: demonstrate no-lightyear distance, clockless progression, gravity-wave baseline arrival, degraded photon arrival, claim-map validation, and event-theater exports.">Distance-Time Kernel</button>
                            <button type="button" data-arcsecs-preset="relationalLattice" title="Keyboard 1. Relational Lattice: visualize material nodes, relational edges, observer frame measurements, and derived distances without treating spacetime as a physical container.">1 Relational Lattice</button>
                        <button type="button" data-arcsecs-preset="absoluteTimeQuantumOscillator" title="Keyboard 2. Absolute Time / Quantum Oscillator Damping: one global tick with near-mass local oscillator damping.">2 Oscillator Damping</button>
                        <button type="button" data-arcsecs-preset="massivePhotonLensing" title="Keyboard 3. Massive Photon Lensing: curved photon paths with Soldner and GR reference comparison.">3 Massive Photon Lensing</button>
                        <button type="button" data-arcsecs-preset="newtonianDarkStar" title="Keyboard 4. Newtonian Dark Star: escape velocity threshold, apogee, capture, and escaping states.">4 Newtonian Dark Star</button>
                        <button type="button" data-arcsecs-preset="superluminalGalilean" title="Keyboard 5. Superluminal Galilean mode: arithmetic relative velocity with no Lorentz factor.">5 Galilean Relative Velocity</button>
                        <button type="button" data-arcsecs-preset="tiredLightEnergyLedger" title="Keyboard 6. Tired-Light Energy Ledger: photon energy loss must equal substrate ledger gain.">6 Energy Ledger</button>
                        <button type="button" data-arcsecs-preset="darkMatterCondensate" title="Keyboard 7. Dark Matter / Tired-Light Condensate: ledgered tired-light energy accumulates into a halo-like distribution.">7 Condensate</button>
                        <button type="button" data-arcsecs-preset="darkMatterRamjet" title="Keyboard 8. Dark Matter Ramjet: EIT scoop, HIBE shield, Fishback solenoid, buffer, reactor, thermal, and exhaust pipeline.">8 Dark Matter Ramjet</button>
                        <button type="button" data-arcsecs-preset="parallaxCalibration" title="Keyboard 9. Validation Lab: arcsecond / AU / parsec calibration, deterministic replay, finite telemetry, and ledger checks.">9 Validation Lab</button>
                        <button type="button" data-arcsecs-preset="sunSimulation" title="Sun Simulation remains available as a regression scenario from the scenario selector and preset list.">Sun Simulation</button>
                    </div>
                </div>
            </section>
        </section>
        <?php
        return (string) ob_get_clean();
    }

    /**
     * Renders the Interactive Dark Matter Drive Simulator plugin page shell.
     *
     * @param array<string, mixed> $attributes Shortcode attributes supplied by WordPress.
     * @return string HTML markup for the simulator page.
     */
    public function render_dark_matter_drive_shortcode(array $attributes = array()): string
    {
        wp_enqueue_style('arcsecs-physics-engine');
        wp_enqueue_script('arcsecs-physics-engine');
        wp_enqueue_script('arcsecs-dark-matter-drive-simulator');

        $attributes = shortcode_atts(
            array(
                'title' => 'Dark Matter Drive Simulator',
                'subtitle' => 'Explore ambient vector potential density, Machian rotational interaction matrices, relational tether distortion and optical aberration effects, dynamic Proca field flux and substrate currents, speculative inertial decoupling behavior, and the uploaded light-slowing model’s concrete electromagnetic speed-loss calibration.',
                'preset' => 'interactiveBlueprint',
            ),
            $attributes,
            'arcsecs_dark_matter_drive_simulator'
        );

        $title = (string) $attributes['title'];
        $subtitle = (string) $attributes['subtitle'];
        $preset = preg_replace('/[^a-zA-Z0-9_-]/', '', (string) $attributes['preset']) ?: 'interactiveBlueprint';
        $instance_id = function_exists('wp_unique_id') ? wp_unique_id('arcsecs-dark-drive-') : 'arcsecs-dark-drive-' . wp_rand(1000, 999999);

        ob_start();
        ?>
        <section id="<?php echo esc_attr($instance_id); ?>" class="arcsecs-dark-drive arcsecs-physics-demo" data-arcsecs-dark-drive="true" data-default-preset="<?php echo esc_attr($preset); ?>" tabindex="0" aria-label="Dark Matter Drive simulator; focus here to use flight keyboard shortcuts">
            <header class="arcsecs-drive-hero">
                <?php $this->render_demo_navigation('Dark Matter Drive'); ?>
                <div class="arcsecs-drive-hero-main">
                    <a class="arcsecs-demo-brand arcsecs-demo-brand-link" href="<?php echo esc_url(home_url('/')); ?>" aria-label="Return to ArcSecs.com home page">
                        <span class="arcsecs-demo-mark" aria-hidden="true">ARC</span>
                        <span class="arcsecs-demo-brand-copy">
                            <span class="arcsecs-demo-kicker">ArcSecs.com • Scientific Cockpit • Speculative Model Boundary</span>
                            <span class="arcsecs-demo-title"><?php echo esc_html($title); ?></span>
                        </span>
                    </a>
                    <h1><?php echo esc_html($title); ?></h1>
                    <p><?php echo esc_html($subtitle); ?></p>
                    <div class="arcsecs-drive-hero-actions" aria-label="Primary simulator actions">
                        <button type="button" data-arcsecs-drive-start="true">Start Simulation</button>
                        <label class="arcsecs-drive-demo-picker"><span>Demo</span><select data-arcsecs-drive-demo-select="true" aria-label="Select Dark Matter Drive demo"><option value="demo-flight">Demo Flight</option><option value="dark-matter-ship-travel">Dark Matter Ship Travel</option><option value="dark-matter-ship-travel-sandbox">Dark Matter Ship Travel Sandbox</option><option value="dark-matter-ship-travel-autopilot">Ship Travel Autopilot</option><option value="acceptance-flight">Acceptance Flight</option><option value="acceptance-evidence-bundle">Acceptance Evidence Bundle</option></select></label>
                            <button type="button" data-arcsecs-drive-demo="selected">Run Selected Demo</button>
                            <button type="button" data-arcsecs-drive-acceptance-run="true">Run Acceptance Flight</button>
                        <button type="button" data-arcsecs-drive-scenario-action="load">Load Guided Scenario</button>
                        <button type="button" data-arcsecs-drive-science-notes="true">Read the Science Notes</button>
                        <button type="button" data-arcsecs-drive-fullscreen="true">Fullscreen Cockpit</button>
                    </div>
                </div>
                <aside class="arcsecs-drive-capability-card" aria-label="Browser capability status">
                    <strong>Runtime Status</strong>
                    <p data-arcsecs-drive-renderer-status="true">Detecting renderer support.</p>
                    <ul>
                        <li>WebGPU <span data-arcsecs-drive-capability="webgpu">detecting</span></li>
                        <li>WebGL <span data-arcsecs-drive-capability="webgl">detecting</span></li>
                        <li>Gamepad <span data-arcsecs-drive-capability="gamepad">detecting</span></li>
                        <li>Haptics <span data-arcsecs-drive-capability="haptics">detecting</span></li>
                        <li>WebXR <span data-arcsecs-drive-capability="webxr">detecting</span></li>
                    </ul>
                </aside>
                <nav class="arcsecs-drive-hero-links" aria-label="Related ArcSecs links">
                    <a href="<?php echo esc_url(home_url('/')); ?>">ArcSecs Home</a>
                    <a href="<?php echo esc_url(home_url('/arcsecs-physics-engine-demo/')); ?>">Physics Engine Demo</a>
                    <a href="<?php echo esc_url(home_url('/standard-cosmology-vs-arcsecs/')); ?>">Compare the Physics</a>
                    <a href="<?php echo esc_url(home_url('/cosmic-anomalies-tracker/')); ?>">Track Cosmic Anomalies</a>
                    <a href="<?php echo esc_url(home_url('/research-library/')); ?>">Research Library</a>
                    <a href="<?php echo esc_url(home_url('/llms.txt')); ?>">llms.txt</a>
                </nav>
                <div class="arcsecs-drive-boundary" data-arcsecs-drive-boundary-note="true">Speculative research visualization — not established current technology.</div>
            </header>



            <section class="arcsecs-readiness-sweep-panel arcsecs-drive-real-boundary" data-arcsecs-drive-what-is-real="true" aria-label="What is real here">
                <header><span>What is real here?</span><h2>Separate browser reality from model telemetry and hypothesis controls</h2></header>
                <div class="arcsecs-drive-reality-grid">
                    <article><h3>Real</h3><p>The browser renderer, UI controls, telemetry calculations, warnings, and exported JSON evidence of the simulation run are real software artifacts.</p></article>
                    <article><h3>Model telemetry</h3><p>Fuel, drive charge, photon lag, lensing smear, thermal load, and route risk are simulator telemetry, not measured spacecraft performance.</p></article>
                    <article><h3>Not established technology</h3><p>Dark matter propulsion, warp behavior, inertial decoupling, tired-light cosmology, and ordinary massive photons are not established operational technologies.</p></article>
                    <article><h3>Placeholders</h3><p>Extreme ranges and future modes remain labeled as educational, hypothesis-only, placeholder, or renderer/performance controls.</p></article>
                </div>
            </section>

            <section class="arcsecs-readiness-sweep-panel arcsecs-drive-control-taxonomy" data-arcsecs-drive-control-taxonomy="true" aria-label="Control taxonomy">
                <header><span>Control Taxonomy</span><h2>Active controls, educational controls, hypothesis controls, placeholders, instrument proxies, and renderer controls</h2></header>
                <div class="arcsecs-drive-taxonomy-grid">
                    <article><strong>Active model controls</strong><span>Simulation mode, scenario preset, density normalization, visible matter, halo radius, Proca flux, thermal stress.</span></article>
                    <article><strong>Educational visualization controls</strong><span>Lensing overlays, relational tether distortion, point-spread width, route stage scrubbers.</span></article>
                    <article><strong>Hypothesis-only controls</strong><span>Machian matrix, Proca substrate-current, ArcSecs comparison, MQN concept, quantized inertia proxy.</span></article>
                    <article><strong>Future / placeholder controls</strong><span>Locked roadmap modes do not activate propulsion or hidden runtime behavior.</span></article>
                    <article><strong>Instrument proxy controls</strong><span>Haloscope proxy, absolute-time oscillator check, navigation buoy, route-confidence telemetry.</span></article>
                    <article><strong>Renderer / performance controls</strong><span>WebGPU availability, WebGL/canvas fallback, particle budget, replay limits, reduced-motion safety.</span></article>
                </div>
            </section>

            <section class="arcsecs-readiness-sweep-panel arcsecs-drive-hotspot-explanations" data-arcsecs-drive-hotspot-explanations="true" aria-label="Component hotspot explanations">
                <header><span>Component Hotspot Explanations</span><h2>Concept, status, telemetry, export evidence, and falsification watch</h2></header>
                <div class="arcsecs-drive-hotspot-grid">
                    <article><h3>HIBE Forward Deflector Array</h3><p>Status: speculative/educational shield proxy. Affects hazard, shield, and warning telemetry. Export evidence: stage verification and architecture sweep. Weakens if shield claims hide hazard or thermal tradeoffs.</p></article>
                    <article><h3>EIT Ramscoop / Dark Matter Intake</h3><p>Status: speculative active-model control. Affects fuel, density, drag, and thermal telemetry. Weakens if dense substrate adds fuel without heat, drag, or route risk.</p></article>
                    <article><h3>Fishback Solenoid Intake Array</h3><p>Status: educational/speculative drag-decoupling proxy. Affects residual drag, stability, and risk. Weakens if drag decoupling has no exported warning state.</p></article>
                    <article><h3>MQN Core</h3><p>Status: hypothesis-only concept. Affects conceptual charge and drive-core readouts. Weakens if copy implies established engineering.</p></article>
                    <article><h3>Reaction Chamber / Energy Conversion Core</h3><p>Status: model telemetry ledger. Affects energy conversion, thermal load, and overload warning. Weakens if energy accounting is not exported.</p></article>
                    <article><h3>Capture Layer</h3><p>Status: speculative intake proxy. Affects capture rate and density response. Weakens if capture rises without turbulence or thermal tradeoff.</p></article>
                    <article><h3>Propulsion Output Vector</h3><p>Status: educational vector output. Affects thrust proxy and route visuals. Weakens if it is presented as real propulsion.</p></article>
                    <article><h3>Tired-Light Energy Ledger</h3><p>Status: speculative comparison ledger. Affects photon energy and redshift proxy. Weakens if ledger closure fails.</p></article>
                    <article><h3>Massive Photon / Lensing Comparison</h3><p>Status: speculative comparison branch. Affects delay, deflection, and PSF telemetry. Weakens if branch is indistinguishable from standard reference.</p></article>
                    <article><h3>Absolute-Time Oscillator Check</h3><p>Status: conceptual oscillator diagnostic. Affects local oscillator readout while global tick remains fixed. Weakens if tick state becomes non-deterministic.</p></article>
                </div>
            </section>

            <div class="arcsecs-drive-statusbar" aria-label="Simulator status bar">
                <span>Status <strong data-arcsecs-drive-running-label="true">Paused</strong></span>
                <span>Mode <strong data-arcsecs-drive-mode-label="true">Booting</strong></span>
                <span data-arcsecs-drive-compact-telemetry="true">Telemetry initializing.</span>
                <label class="arcsecs-drive-haptic-toggle"><input type="checkbox" data-arcsecs-drive-haptics="true" /> Enable haptics</label>
            </div>

            <main class="arcsecs-drive-layout" aria-label="Interactive Dark Matter Drive Simulator">
                <aside class="arcsecs-drive-dock arcsecs-drive-control-dock" aria-label="Physical parameter controls">
                    <h2>Physical Controls</h2>
                    <label>Simulation mode
                        <select data-arcsecs-drive-control="mode">
                            <option value="galaxyRotation">Machian Rotation Matrix</option>
                            <option value="darkMatterWind">Proca Flux / Substrate Current</option>
                            <option value="mqnDriveConcept">MQN / Dark Matter Drive Concept</option>
                            <option value="lensingVisualization">Relational Tether Distortion Visualization</option>
                            <option value="arcsecsHypothesis">ArcSecs Hypothesis Comparison</option>
                        </select>
                    </label>
                    <label>Scenario preset
                        <select data-arcsecs-drive-control="scenarioPreset">
                            <option value="interactiveBlueprint">Interactive Dark Matter Drive Blueprint</option>
                            <option value="whyGalaxiesNeedMoreMass">Why Galaxies Need More Mass</option>
                            <option value="sailDarkMatterWind">Sail the Dark Matter Wind</option>
                            <option value="approachMassiveHalo">Approach a Massive Halo</option>
                            <option value="mqnDriveWalkthrough">MQN Drive Concept Walkthrough</option>
                            <option value="arcsecsComparison">ArcSecs Comparison</option>
                            <option value="ramjetThermalStress">Dark Matter Ramjet Thermal Stress Test</option>
                            <option value="massivePhotonLensing">Massive Photon Lensing</option>
                            <option value="tiredLightGalaxyDimming">Tired-Light Galaxy Dimming</option>
                            <option value="absoluteTimeOscillator">Absolute-Time Oscillator</option>
                            <option value="newtonianDarkStarCapture">Newtonian Dark Star Capture</option>
                        </select>
                    </label>
                    <section class="arcsecs-drive-control-group arcsecs-drive-dial-group" aria-label="Vector Potential Dial">
                        <h3>Vector Potential Dial</h3>
                        <label>Density normalization <span data-arcsecs-drive-control-readout="darkMatterDial">1×</span><input type="range" min="0" max="5" step="0.05" value="1" data-arcsecs-drive-control="darkMatterDial" aria-label="Vector Potential Dial" /></label>
                        <div class="arcsecs-drive-dial-labels" aria-hidden="true"><span>No vector potential</span><span>Low substrate coupling</span><span>Reference coupling</span><span>High coupling</span><span>Extreme / exaggerated visualization</span></div>
                        <p data-arcsecs-drive-exaggeration-note="true" hidden>Extreme range is visually exaggerated for education and should not be read as a precision physical output.</p>
                    </section>
                    <section class="arcsecs-drive-control-group" aria-label="Machian rotational interaction controls">
                        <h3>Machian Rotation Matrix</h3>
                        <label>Visible matter mass <span data-arcsecs-drive-control-readout="visibleMatterMass">42</span><input type="range" min="1" max="100" step="1" value="42" data-arcsecs-drive-control="visibleMatterMass" /></label>
                        <label>Halo radius <span data-arcsecs-drive-control-readout="haloRadius">70</span><input type="range" min="10" max="140" step="1" value="70" data-arcsecs-drive-control="haloRadius" /></label>
                        <label>Orbital test point<input type="range" min="1" max="120" step="1" value="46" data-arcsecs-drive-control="orbitalTestPoint" /></label>
                    </section>
                    <section class="arcsecs-drive-control-group" aria-label="Proca substrate current controls">
                        <h3>Proca Flux / Substrate Current</h3>
                        <label>Flux direction <span data-arcsecs-drive-control-readout="windDirectionDegrees">35°</span><input type="range" min="0" max="360" step="1" value="35" data-arcsecs-drive-control="windDirectionDegrees" /></label>
                        <label>Flux density<input type="range" min="0" max="5" step="0.05" value="1" data-arcsecs-drive-control="windDensity" /></label>
                        <label>Turbulence<input type="range" min="0" max="1" step="0.01" value="0.16" data-arcsecs-drive-control="turbulence" /></label>
                        <label>Magnetic scoop strength<input type="range" min="0" max="1" step="0.01" value="0.7" data-arcsecs-drive-control="magneticScoopStrength" /></label>
                        <label>Drive coupling<input type="range" min="0" max="1" step="0.01" value="0.54" data-arcsecs-drive-control="driveCoupling" /></label>
                        <label>Ship heading <span data-arcsecs-drive-control-readout="shipHeadingDegrees">32°</span><input type="range" min="0" max="360" step="1" value="32" data-arcsecs-drive-control="shipHeadingDegrees" /></label>
                    </section>
                    <section class="arcsecs-drive-control-group" aria-label="Lensing controls">
                        <h3>Lensing Approximation</h3>
                        <label>Mass <span data-arcsecs-drive-control-readout="mass">35</span><input type="range" min="1" max="120" step="1" value="35" data-arcsecs-drive-control="mass" /></label>
                        <label>Distance<input type="range" min="10" max="400" step="1" value="120" data-arcsecs-drive-control="distance" /></label>
                        <label>Impact parameter <span data-arcsecs-drive-control-readout="impactParameter">28</span><input type="range" min="1" max="120" step="1" value="28" data-arcsecs-drive-control="impactParameter" /></label>
                        <label>Lensing strength exaggeration <span data-arcsecs-drive-control-readout="lensingExaggeration">1.25×</span><input type="range" min="0.1" max="10" step="0.05" value="1.25" data-arcsecs-drive-control="lensingExaggeration" /></label>
                        <label>Observer angle<input type="range" min="0" max="360" step="1" value="12" data-arcsecs-drive-control="observerAngleDegrees" /></label>
                    </section>
                    <section class="arcsecs-drive-control-group" aria-label="Advanced theoretical and optical telemetry controls">
                        <h3>Advanced Telemetry Layer</h3>
                        <label>Quantized inertia dampening <span data-arcsecs-drive-control-readout="quantizedInertiaDampening">42%</span><input type="range" min="0" max="1" step="0.01" value="0.42" data-arcsecs-drive-control="quantizedInertiaDampening" /></label>
                        <label>Rindler horizon bias <span data-arcsecs-drive-control-readout="rindlerHorizonBias">35%</span><input type="range" min="0" max="1" step="0.01" value="0.35" data-arcsecs-drive-control="rindlerHorizonBias" /></label>
                        <label>Haloscope tuning <span data-arcsecs-drive-control-readout="haloscopeTuningMicroElectronVolts">21.5 µeV</span><input type="range" min="19" max="24" step="0.1" value="21.5" data-arcsecs-drive-control="haloscopeTuningMicroElectronVolts" /></label>
                        <label>Alcubierre metric strength <span data-arcsecs-drive-control-readout="alcubierreMetricStrength">18%</span><input type="range" min="0" max="1" step="0.01" value="0.18" data-arcsecs-drive-control="alcubierreMetricStrength" /></label>
                        <label>Negative energy reserve <span data-arcsecs-drive-control-readout="negativeEnergyReserve">20%</span><input type="range" min="0" max="1" step="0.01" value="0.2" data-arcsecs-drive-control="negativeEnergyReserve" /></label>
                        <label>Optical aperture <span data-arcsecs-drive-control-readout="opticalApertureMeters">2.4 m</span><input type="range" min="0.5" max="12" step="0.1" value="2.4" data-arcsecs-drive-control="opticalApertureMeters" /></label>
                        <label>Optical wavelength <span data-arcsecs-drive-control-readout="opticalWavelengthNanometers">550 nm</span><input type="range" min="380" max="780" step="5" value="550" data-arcsecs-drive-control="opticalWavelengthNanometers" /></label>
                        <label>Telescope jitter <span data-arcsecs-drive-control-readout="telescopeJitterArcseconds">0.65 arcsec</span><input type="range" min="0" max="5" step="0.05" value="0.65" data-arcsecs-drive-control="telescopeJitterArcseconds" /></label>
                        <p>These controls expose the newly documented Quantized Inertia, haloscope sailing, Alcubierre visualization, J-factor, and point-spread-function telemetry as hypothesis or instrument proxies.</p>
                    </section>
                    <section class="arcsecs-drive-control-group arcsecs-drive-light-slowing-controls" aria-label="Electromagnetic slowing and energy degeneration controls">
                        <h3>Interferometric Wavefront Tracker / Light Slowing / Energy Degeneration</h3>
                        <label>Calibration event
                            <select data-arcsecs-drive-control="multiMessengerEventPreset" aria-label="Multi-messenger calibration event">
                                <option value="gw170817" selected>GW170817 / GRB 170817A anchor</option>
                                <option value="gw150914">GW150914 weak gamma-ray candidate</option>
                                <option value="gw190521">GW190521 / AGN optical flare</option>
                                <option value="supernovaLightCurveStretch">Supernova Light-Curve Stretch contract anchor</option>
                                <option value="hubbleTension">Hubble Tension optical-history anchor</option>
                                <option value="gw190814">GW190814 missing-counterpart test</option>
                                <option value="custom">Custom line of sight</option>
                            </select>
                        </label>
                        <label>Substrate density profile
                            <select data-arcsecs-drive-control="substrateDensityProfile" aria-label="Proca substrate density profile">
                                <option value="void">Cosmic void</option>
                                <option value="standard" selected>Standard intergalactic substrate</option>
                                <option value="filament">Dense filament / halo crossing</option>
                                <option value="agnDisk">AGN accretion disk diffusion</option>
                            </select>
                        </label>
                        <label>Multi-messenger distance <span data-arcsecs-drive-control-readout="multiMessengerDistanceMegaparsecs">40 Mpc</span><input type="range" min="1" max="2000" step="1" value="40" data-arcsecs-drive-control="multiMessengerDistanceMegaparsecs" /></label>
                        <label>Target redshift <span data-arcsecs-drive-control-readout="lightSlowingTargetRedshift">0.0099</span><input type="range" min="0" max="1" step="0.0001" value="0.0099" data-arcsecs-drive-control="lightSlowingTargetRedshift" /></label>
                        <label>Propagation delay budget <span data-arcsecs-drive-control-readout="lightSlowingPropagationDelaySeconds">0.020 s</span><input type="range" min="0" max="3600" step="0.001" value="0.020" data-arcsecs-drive-control="lightSlowingPropagationDelaySeconds" /></label>
                        <label>Intrinsic source delay <span data-arcsecs-drive-control-readout="intrinsicEmissionDelaySeconds">1.72 s</span><input type="range" min="0" max="3000000" step="0.01" value="1.72" data-arcsecs-drive-control="intrinsicEmissionDelaySeconds" /></label>
                        <label>Line-of-sight optical resistance <span data-arcsecs-drive-control-readout="lineOfSightOpticalResistance">1×</span><input type="range" min="0" max="5" step="0.01" value="1" data-arcsecs-drive-control="lineOfSightOpticalResistance" /></label>
                        <label>Covarying coupling redshift <span data-arcsecs-drive-control-readout="covaryingCouplingRedshift">0</span><input type="range" min="0" max="1" step="0.0001" value="0" data-arcsecs-drive-control="covaryingCouplingRedshift" /></label>
                        <label>Proper motion <span data-arcsecs-drive-control-readout="sourceProperMotionArcsecondsPerYear">0.25 arcsec/yr</span><input type="range" min="0" max="120" step="0.01" value="0.25" data-arcsecs-drive-control="sourceProperMotionArcsecondsPerYear" /></label>
                        <label>Source distance <span data-arcsecs-drive-control-readout="sourceDistanceParsecs">1,000,000 pc</span><input type="range" min="1" max="1000000000" step="1000" value="1000000" data-arcsecs-drive-control="sourceDistanceParsecs" /></label>
                        <p>Shows gravity-wave and photon wavefronts separately: the gravity-wave baseline remains c0, while electromagnetic packets slow and lose energy through the selected Proca substrate density profile. Composite redshift keeps tired-light loss separate from covarying coupling drift.</p>
                    </section>
                    <section class="arcsecs-drive-control-group" aria-label="Relational optics compute and quantum readiness controls">
                        <h3>Compute / Relativity / Quantum Readiness</h3>
                        <label>Reference velocity <span data-arcsecs-drive-control-readout="relativeVelocityFractionOfLight">0.35 c</span><input type="range" min="0" max="0.99" step="0.01" value="0.35" data-arcsecs-drive-control="relativeVelocityFractionOfLight" /></label>
                        <label>Rest mass proxy <span data-arcsecs-drive-control-readout="spacecraftRestMassProxy">12</span><input type="range" min="0.1" max="100" step="0.1" value="12" data-arcsecs-drive-control="spacecraftRestMassProxy" /></label>
                        <label>Compute particle budget <span data-arcsecs-drive-control-readout="computeParticleBudget">4,096 particles</span><input type="range" min="256" max="1048576" step="256" value="4096" data-arcsecs-drive-control="computeParticleBudget" /></label>
                        <label>Compute workgroup size <span data-arcsecs-drive-control-readout="computeWorkgroupSize">128</span><input type="range" min="32" max="512" step="32" value="128" data-arcsecs-drive-control="computeWorkgroupSize" /></label>
                        <label>Density-field feedback gain <span data-arcsecs-drive-control-readout="densityFieldFeedbackGain">1×</span><input type="range" min="0" max="3" step="0.05" value="1" data-arcsecs-drive-control="densityFieldFeedbackGain" aria-describedby="arcsecs-density-field-feedback-help" /></label>
                        <small id="arcsecs-density-field-feedback-help">Experimental GPU feedback gain. The compute branch automatically downshifts this gain when finite-output guard clamp rates rise.</small>
                        <label>Guide-star magnitude <span data-arcsecs-drive-control-readout="psfMagnitude">7.5 mag</span><input type="range" min="-5" max="18" step="0.1" value="7.5" data-arcsecs-drive-control="psfMagnitude" /></label>
                        <label>Stereopsis disparity <span data-arcsecs-drive-control-readout="stereopsisDisparityArcseconds">15 arcsec</span><input type="range" min="0" max="60" step="1" value="15" data-arcsecs-drive-control="stereopsisDisparityArcseconds" /></label>
                        <label>Qubit phase rotation <span data-arcsecs-drive-control-readout="quantumPhaseRotationDegrees">42°</span><input type="range" min="0" max="360" step="1" value="42" data-arcsecs-drive-control="quantumPhaseRotationDegrees" /></label>
                        <label>Quantum gate depth <span data-arcsecs-drive-control-readout="quantumGateDepth">12 layers</span><input type="range" min="1" max="128" step="1" value="12" data-arcsecs-drive-control="quantumGateDepth" /></label>
                        <label>Qubit noise level <span data-arcsecs-drive-control-readout="qubitNoiseLevel">8%</span><input type="range" min="0" max="1" step="0.01" value="0.08" data-arcsecs-drive-control="qubitNoiseLevel" /></label>
                        <p>This layer now includes the first actual bounded WebGPU compute shader branch where supported, while keeping semi-implicit readiness, dynamic PSF bounding boxes, relativistic reference telemetry, educational qubit signal enhancement, and Canvas/WebGL fallback visible.</p>
                    </section>
                    <section class="arcsecs-drive-control-group" aria-label="Navigation guidance route planning and sensor buoy controls">
                        <h3>Navigation / Buoy Mapping</h3>
                        <label>Sensor buoy count <span data-arcsecs-drive-control-readout="sensorBuoyCount">6 buoys</span><input type="range" min="0" max="32" step="1" value="6" data-arcsecs-drive-control="sensorBuoyCount" /></label>
                        <label>Guide-star target <span data-arcsecs-drive-control-readout="guideStarTargetArcseconds">0 arcsec</span><input type="range" min="-120" max="120" step="1" value="0" data-arcsecs-drive-control="guideStarTargetArcseconds" /></label>
                        <label>Observed guide-star error <span data-arcsecs-drive-control-readout="guideStarErrorArcseconds">1.2 arcsec</span><input type="range" min="-120" max="120" step="0.1" value="1.2" data-arcsecs-drive-control="guideStarErrorArcseconds" /></label>
                        <label>Autopilot gain <span data-arcsecs-drive-control-readout="autopilotGain">55%</span><input type="range" min="0" max="1" step="0.01" value="0.55" data-arcsecs-drive-control="autopilotGain" /></label>
                        <label>Navigation waypoints <span data-arcsecs-drive-control-readout="navigationWaypoints">4 waypoints</span><input type="range" min="1" max="16" step="1" value="4" data-arcsecs-drive-control="navigationWaypoints" /></label>
                        <label>Trajectory lookahead <span data-arcsecs-drive-control-readout="trajectoryLookaheadSeconds">240 s</span><input type="range" min="30" max="3600" step="30" value="240" data-arcsecs-drive-control="trajectoryLookaheadSeconds" /></label>
                        <label>Slingshot safety margin <span data-arcsecs-drive-control-readout="slingshotSafetyMargin">40%</span><input type="range" min="0" max="1" step="0.01" value="0.4" data-arcsecs-drive-control="slingshotSafetyMargin" /></label>
                        <label>Dark matter anomaly density <span data-arcsecs-drive-control-readout="darkMatterAnomalyDensity">35%</span><input type="range" min="0" max="1" step="0.01" value="0.35" data-arcsecs-drive-control="darkMatterAnomalyDensity" /></label>
                        <label>Route risk tolerance <span data-arcsecs-drive-control-readout="routeRiskTolerance">50%</span><input type="range" min="0" max="1" step="0.01" value="0.5" data-arcsecs-drive-control="routeRiskTolerance" /></label>
                        <p>This layer turns the strategic plan's tactical mechanics into browser-safe route advisories: sensor buoys map dark-sector weather, guide-star error is converted to arcsecond correction, and route confidence is checked against reserve margin.</p>
                    </section>
                    <section class="arcsecs-drive-control-group" aria-label="Runtime and quality controls">
                        <h3>Runtime</h3>
                        <label>Speed multiplier <span data-arcsecs-drive-control-readout="speedMultiplier">1×</span><input type="range" min="0.1" max="5" step="0.1" value="1" data-arcsecs-drive-control="speedMultiplier" /></label>
                        <label>Photon packet count <span data-arcsecs-drive-control-readout="photonPacketCount">900 packets</span><input type="number" min="8" max="2500" step="1" value="900" data-arcsecs-drive-control="photonPacketCount" /></label>
                        <label>Photon mass proxy <span data-arcsecs-drive-control-readout="photonMassProxy">3e-18</span><input type="number" min="0" max="0.000000000001" step="0.000000000000000001" value="0.000000000000000003" data-arcsecs-drive-control="photonMassProxy" /></label>
                        <label>Baryonic mass <span data-arcsecs-drive-control-readout="baryonicMass">18</span><input type="range" min="0" max="50" step="0.5" value="18" data-arcsecs-drive-control="baryonicMass" /></label>
                        <label>Tired light decay rate <span data-arcsecs-drive-control-readout="lossRate">22%</span><input type="range" min="0" max="1" step="0.01" value="0.22" data-arcsecs-drive-control="lossRate" /></label>
                        <label>Compression ratio <span data-arcsecs-drive-control-readout="compressionRatio">34:1</span><input type="range" min="1" max="80" step="1" value="34" data-arcsecs-drive-control="compressionRatio" /></label>
                        <label>Thermal rejection capacity <span data-arcsecs-drive-control-readout="thermalRejectionCapacity">72%</span><input type="range" min="0.05" max="1" step="0.01" value="0.72" data-arcsecs-drive-control="thermalRejectionCapacity" /></label>
                        <label>Quality mode
                            <select data-arcsecs-drive-control="qualityMode">
                                <option value="low">Low</option>
                                <option value="medium" selected>Medium</option>
                                <option value="high">High</option>
                                <option value="experimental">Experimental</option>
                            </select>
                        </label>
                        <label>Failure injection mode
                            <select data-arcsecs-drive-control="failureMode">
                                <option value="none">None</option>
                                <option value="radiatorBottleneck">Radiator bottleneck</option>
                                <option value="bufferSaturation">Buffer saturation</option>
                                <option value="fuelStarvation">Fuel starvation</option>
                                <option value="thermalOverload">Thermal overload</option>
                                <option value="captureThreshold">Capture threshold</option>
                            </select>
                        </label>
                        <label class="arcsecs-drive-checkbox"><input type="checkbox" data-arcsecs-drive-control="reducedVisualIntensity" /> Reduced visual intensity</label>
                    </section>
                    <div class="arcsecs-drive-button-grid">
                        <button type="button" data-arcsecs-drive-run="true">Run</button>
                        <button type="button" data-arcsecs-drive-pause="true">Pause</button>
                        <button type="button" data-arcsecs-drive-resume="true">Resume</button>
                        <button type="button" data-arcsecs-drive-rerun="true">Rerun Settings</button>
                        <button type="button" data-arcsecs-drive-reset="true">Reset</button>
                        <button type="button" data-arcsecs-drive-export-state="true">Export State JSON</button>
                    </div>
                    <section class="arcsecs-drive-progress-panel" aria-label="Simulation progress and status">
                        <h3>Simulation Progress</h3>
                        <div class="arcsecs-drive-progress-row"><span>Run progress</span><div class="arcsecs-drive-progress-track" role="progressbar" aria-valuemin="0" aria-valuemax="100"><i data-arcsecs-drive-progress="simulation"></i></div></div>
                        <div class="arcsecs-drive-progress-row"><span>Mission progress</span><div class="arcsecs-drive-progress-track" role="progressbar" aria-valuemin="0" aria-valuemax="100"><i data-arcsecs-drive-progress="mission"></i></div></div>
                        <p data-arcsecs-drive-status="true">Paused and ready for parameter changes.</p>
                        <p data-arcsecs-drive-eta="true">Estimated step time remaining: —</p>
                        <p data-arcsecs-drive-step-detail="true">Timeline step details will appear here.</p>
                    </section>
                    <section class="arcsecs-drive-log-panel" aria-label="Processing log">
                        <h3>Processing Log</h3>
                        <ol data-arcsecs-drive-processing-log="true">
                            <li class="is-info"><strong>Ready</strong><span>Change a parameter, start the mission, or run the simulator to populate the processing log.</span></li>
                        </ol>
                    </section>
                </aside>

                <section class="arcsecs-drive-stage" aria-label="Simulation viewport and science guidance">
                    <div class="arcsecs-drive-blueprint-shell">
                        <svg data-arcsecs-drive-blueprint="true" class="arcsecs-drive-blueprint" viewBox="0 0 100 100" role="img" aria-label="Clickable Dark Matter Drive blueprint hotspots"></svg>
                        <canvas data-arcsecs-drive-canvas="true" class="arcsecs-drive-canvas" width="1280" height="640" aria-label="Animated Machian matrix, Proca substrate current, relational tether distortion, and inertial-decoupling visualization">Dark Matter Drive particle visualization.</canvas>
                    </div>
                    <div data-arcsecs-drive-performance="true" class="arcsecs-drive-performance-note">Performance budget nominal.</div>
                    <section data-arcsecs-drive-explanation="true" class="arcsecs-drive-explanation-panel" aria-live="polite"></section>
                    <section data-arcsecs-drive-panel="true" class="arcsecs-drive-component-panel" aria-live="polite">Select a blueprint hotspot.</section>
                    <section class="arcsecs-drive-distance-time-dock" data-arcsecs-drive-claim-map="true" aria-label="Compact Distance-Time Kernel dock">
                        <h2>Claim → Demo → Test</h2>
                        <p>Navigation should rely on parsecs, guide-star arcseconds, gravity-wave signals, and substrate-density maps rather than lightyear assumptions.</p>
                        <div data-arcsecs-drive-event-theater="true">Compact Event Theater: gravity-wave baseline first, electromagnetic channel secondary.</div>
                    </section>
                    <section class="arcsecs-drive-guided-scenario" aria-label="Guided scenario controls">
                        <header><span>Guided Scenario</span><h2>Learn by changing one thing at a time</h2></header>
                        <label>Scenario
                            <select data-arcsecs-drive-guided-scenario="true">
                                <option value="whyGalaxiesNeedMoreMass">Why Galaxies Need More Mass</option>
                                <option value="sailDarkMatterWind">Sail the Dark Matter Wind</option>
                                <option value="approachMassiveHalo">Approach a Massive Halo</option>
                                <option value="mqnDriveWalkthrough">MQN Drive Concept Walkthrough</option>
                                <option value="arcsecsComparison">ArcSecs Comparison</option>
                            </select>
                        </label>
                        <div class="arcsecs-drive-button-grid">
                            <button type="button" data-arcsecs-drive-scenario-action="load">Load Guided Scenario</button>
                            <button type="button" data-arcsecs-drive-scenario-action="next">Next Step</button>
                            <button type="button" data-arcsecs-drive-scenario-action="reset">Reset Scenario</button>
                        </div>
                        <div data-arcsecs-drive-guided-panel="true" class="arcsecs-drive-guided-panel" aria-live="polite"></div>
                    </section>
                    <section class="arcsecs-drive-mission-sequencer" aria-label="Guided mission scenario sequencer">
                        <header>
                            <span>Guided Mission Sequencer</span>
                            <h2>Run the drive as a staged mission</h2>
                            <p data-arcsecs-drive-mission-summary="true">Start the mission to step through shield survival, intake capture, solenoid geometry, thermal bottleneck, ledger audit, lensing comparison, and absolute-time oscillator checks.</p>
                        </header>
                        <div class="arcsecs-drive-button-grid">
                            <button type="button" data-arcsecs-drive-mission="back">Mission Back</button>
                            <button type="button" data-arcsecs-drive-mission="play">Start Mission</button>
                            <button type="button" data-arcsecs-drive-mission="pause">Pause Mission</button>
                            <button type="button" data-arcsecs-drive-mission="next">Next Mission Stage</button>
                            <button type="button" data-arcsecs-drive-mission="warning">Jump To Stage Warning</button>
                            <button type="button" data-arcsecs-drive-mission="reset">Reset Mission</button>
                            <button type="button" data-arcsecs-drive-mission="export">Export Mission Report</button>
                        </div>
                        <div data-arcsecs-drive-mission-panel="true" class="arcsecs-drive-mission-panel" aria-live="polite">Mission stages loading.</div>
                    </section>
                    <section class="arcsecs-drive-demo-director" aria-label="Demo Flight Director">
                        <header>
                            <span>Demo Flight Director</span>
                            <h2>Autoplay a visible proof-of-motion sequence</h2>
                            <p>Cycles through scoop alignment, dense-filament light degradation, AGN diffusion, missing-counterpart, and thermal-bottleneck states while keeping all claims speculative.</p>
                        </header>
                        <div class="arcsecs-drive-button-grid">
                            <button type="button" data-arcsecs-drive-demo="play">Play Demo Flight</button>
                            <button type="button" data-arcsecs-drive-acceptance-run="true">Run Acceptance Flight</button>
                            <button type="button" data-arcsecs-drive-demo="next">Next Demo Stage</button>
                            <button type="button" data-arcsecs-drive-demo="stop">Stop Demo Flight</button>
                            <button type="button" data-arcsecs-drive-export-demo="true">Export Demo Flight Verification</button>
                            <button type="button" data-arcsecs-drive-export-demo-evidence="true">Export Demo Flight Evidence</button>
                            <button type="button" data-arcsecs-drive-export-architecture="true">Export Architecture Sweep</button>
                            <button type="button" data-arcsecs-drive-export-debrief="true">Export Mission Debrief</button>
                            <button type="button" data-arcsecs-drive-export-acceptance="true">Export Acceptance Flight</button>
                            <button type="button" data-arcsecs-drive-export-certificate="true">Export Acceptance Certificate</button>
                            <button type="button" data-arcsecs-drive-export-acceptance-bundle="true">Export Acceptance Evidence Bundle</button>
                            <button type="button" data-arcsecs-drive-export-json="true">Export Replay JSON</button>
                        </div>
                        <label class="arcsecs-drive-operator-notes"><span>Operator notes for exported evidence</span><textarea data-arcsecs-drive-operator-notes="true" rows="3" placeholder="Record what you saw in the cockpit before exporting."></textarea></label>
                        <div data-arcsecs-drive-demo-director-panel="true" class="arcsecs-drive-demo-director-panel" aria-live="polite">Demo Flight Director ready.</div>
                    </section>
                </section>

                <aside class="arcsecs-drive-dock arcsecs-drive-telemetry-dock" aria-label="Telemetry dock">
                    <h2>Telemetry Dock</h2>
                    <div data-arcsecs-drive-telemetry="true" class="arcsecs-drive-telemetry-grid" aria-live="polite"></div>
                    <h2>Timeline Replay</h2>
                    <div class="arcsecs-drive-button-grid">
                        <button type="button" data-arcsecs-drive-timeline="back">Back</button>
                        <button type="button" data-arcsecs-drive-timeline="play">Play</button>
                        <button type="button" data-arcsecs-drive-timeline="pause">Pause</button>
                        <button type="button" data-arcsecs-drive-timeline="next">Next event</button>
                        <button type="button" data-arcsecs-drive-timeline="warning">Jump to warning</button>
                    </div>
                    <div data-arcsecs-drive-timeline-panel="true" class="arcsecs-drive-timeline-panel" aria-live="polite"></div>
                    <div class="arcsecs-drive-button-grid">
                        <button type="button" data-arcsecs-drive-export-json="true">Export replay JSON</button>
                        <button type="button" data-arcsecs-drive-export-html="true">Export printable HTML</button>
                    </div>
                </aside>

                <section class="arcsecs-drive-event-log" aria-label="Bottom event log timeline">
                    <h2>Event Log</h2>
                    <ol data-arcsecs-drive-event-log="true" aria-live="polite"></ol>
                </section>
            </main>

            <section class="arcsecs-drive-readable-content" data-arcsecs-drive-science-panel="true" aria-label="AI-readable simulator content">
                <h2>What the simulator demonstrates</h2>
                <p>The simulator compares Machian rotational interaction matrices, ambient vector potential normalization, Proca substrate-current visualization, relational tether distortion, Weber/Machian inertia proxies, vector-potential coupling concepts, and ArcSecs speculative inertial-decoupling overlays. It keeps observable readouts, relational reference models, ArcSecs interpretation, and speculative engineering ideas visibly separated.</p>
                <h2>Simulation modes</h2>
                <ul>
                    <li><strong>Machian Rotation Matrix:</strong> compares baryonic interaction strength with a Machian matrix-supported relation.</li>
                    <li><strong>Proca Flux / Substrate Current:</strong> visualizes flux direction, coupling area, drive charge rate, and relational drift.</li>
                    <li><strong>MQN / Dark Matter Drive Concept:</strong> labels theoretical core, containment, reaction chamber, capture layer, and propulsion vector.</li>
                    <li><strong>Relational Tether Distortion Visualization:</strong> gives a bounded relational optical-aberration approximation with an explicit non-precision warning.</li>
                    <li><strong>ArcSecs Hypothesis:</strong> compares Newtonian relational reference language, Weber/Machian reference language, ArcSecs interpretation, and speculative overlay.</li>
                </ul>
                <h2>Scientific and speculative model notes</h2>
                <p>The simulator is educational and exploratory. It does not establish inertial-decoupling propulsion, MQN engineering, tired-light cosmology, massive ordinary photons, or a replacement for consensus physics. The purpose is to make assumptions adjustable and visible.</p>
                <h2>Dark Matter Dial explanation</h2>
                <p>The Vector Potential Dial changes Machian matrix support, ambient vector potential visualization, Proca substrate flux, drive charge rate, and relational tether-distortion strength. The extreme range is deliberately exaggerated for visual learning.</p>
                <h2>Arcseconds and telemetry</h2>
                <p>Telemetry includes degrees-to-arcseconds, radians-to-arcseconds, live tether-distortion deflection, angular offset, simulation time, frames per second, body count, drive charge, J-factor proxy, optical point-spread full width, Quantized Inertia thrust proxy, haloscope yoctowatt proxy, Alcubierre stability proxy, and warnings.</p>
                <h2>Advanced theoretical layer</h2>
                <p>The advanced controls map the uploaded strategic enhancement plan into explicit, labeled telemetry. Quantized Inertia, haloscope sailing, and Alcubierre behavior remain hypothesis or speculative visualization modes, while optical diffraction, jitter, and density-squared line-of-sight readouts are shown as simplified educational proxies.</p>
                <h2>Navigation and sensor-buoy layer</h2>
                <p>The navigation layer adds sensor-buoy mapping, guide-star arcsecond correction, route confidence, slingshot opportunity, and energy reserve margin. These are deterministic cockpit advisories that make invisible dark-sector weather and route risk understandable without pretending the simulator is an autonomous spacecraft controller.</p>
                <h2>Known limitations</h2>
                <p>WebGPU detection is present, but the current pass uses a WebGPU-ready adapter shell with Canvas/WebGL fallback rendering. Future slices can replace the adapter internals with GPU buffers, worker orchestration, route propagation, and compute shaders without changing the page contract.</p>
                <h2>Related ArcSecs pages</h2>
                <p><a href="<?php echo esc_url(home_url('/arcsecs-physics-engine-demo/')); ?>">ArcSecs Physics Engine Demo</a>, <a href="<?php echo esc_url(home_url('/standard-cosmology-vs-arcsecs/')); ?>">Cosmology Comparison</a>, <a href="<?php echo esc_url(home_url('/cosmic-anomalies-tracker/')); ?>">Cosmic Anomalies Tracker</a>, and <a href="<?php echo esc_url(home_url('/research-library/')); ?>">Research Library</a>.</p>
            </section>
        </section>
        <?php
        return (string) ob_get_clean();
    }

    /**
     * Renders the ArcSecs Space Travel Mission Simulator shortcode.
     *
     * @param array<string, mixed> $attributes Shortcode attributes supplied by WordPress.
     * @return string HTML markup for the interactive space travel mission simulator.
     */
    public function render_space_travel_simulation_shortcode(array $attributes = array()): string
    {
        wp_enqueue_style('arcsecs-physics-engine');
        wp_enqueue_script('arcsecs-space-travel-simulation');

        $attributes = shortcode_atts(
            array(
                'title' => 'ArcSecs Space Travel Mission Simulator',
                'subtitle' => 'Fly through dense Proca substrate, void corridors, torsion shear, and beacon approach zones.',
                'show_notes' => 'true',
            ),
            $attributes,
            'arcsecs_space_travel_simulation'
        );

        $title = sanitize_text_field((string) $attributes['title']);
        $subtitle = sanitize_text_field((string) $attributes['subtitle']);
        $show_notes = ArcSecs_Physics_Engine_Config::normalize_bool_attribute($attributes['show_notes']);
        $instance_id = 'arcsecs-space-travel-' . wp_generate_uuid4();

        ob_start();
        ?>
        <section id="<?php echo esc_attr($instance_id); ?>" class="arcsecs-space-travel-simulator" data-arcsecs-space-travel-simulation="true" tabindex="0" aria-label="Space travel simulator; focus here to use mission keyboard shortcuts">
            <header class="arcsecs-space-travel-hero">
                <?php $this->render_demo_navigation('Space travel'); ?>
                <p class="arcsecs-space-travel-kicker">ArcSecs Mission Model • Interactive Demo • Speculative Boundary</p>
                <h2><?php echo esc_html($title); ?></h2>
                <p><?php echo esc_html($subtitle); ?></p>
                <p class="arcsecs-space-travel-boundary">Speculative ArcSecs mission visualization — not established physics or spacecraft technology. Dense substrate, Proca interaction, torsion pull, GravityWavefront, PhotonWavefront, Mass-Polariton transfer, and Ramscoop capture are model components for testing and visualization.</p>
            </header>



            <section class="arcsecs-readiness-sweep-panel arcsecs-space-onboarding" data-arcsecs-space-onboarding="true" aria-label="First-time mission onboarding">
                <header><span>First-Time Mission Onboarding</span><h2>Fly the route, collect evidence, then replay the export</h2><p>This mission page is a speculative research visualization. It is a playable instrument mask for dense substrate, void corridor, torsion shear, beacon approach, messenger delay, fuel, heat, drag, and route evidence.</p></header>
                <div class="arcsecs-space-onboarding-grid">
                    <article><h3>Default objective path</h3><ol><li>Move.</li><li>Collect route evidence.</li><li>Trigger signal event.</li><li>Reach beacon or complete a route segment.</li><li>Export JSON.</li><li>Replay JSON.</li></ol></article>
                    <article><h3>Best Next Action examples</h3><ul><li>Start thrust.</li><li>Enter dense region for fuel.</li><li>Leave dense region to cool down.</li><li>Avoid torsion shear.</li><li>Trigger signal event.</li><li>Export run when evidence score is ready.</li><li>Load replay after export.</li></ul></article>
                    <article><h3>Replay validation checklist</h3><ul><li>schema version</li><li>scenario name</li><li>frame count</li><li>calibration state</li><li>telemetry fields</li><li>falsification note</li><li>UTC timestamp</li><li>route frames</li><li>mission outcome</li></ul></article>
                </div>
            </section>

            <div class="arcsecs-space-travel-layout">
                <section class="arcsecs-space-travel-cockpit" aria-label="Interactive space travel simulation cockpit">
                    <canvas data-arcsecs-space-canvas="true" tabindex="0" width="860" height="520" aria-label="ArcSecs space travel mission simulator canvas"></canvas>
                    <div class="arcsecs-space-travel-demo-director" aria-label="Guided mission demo director">
                        <label for="<?php echo esc_attr($instance_id . '-demo'); ?>">Guided demo</label>
                        <select id="<?php echo esc_attr($instance_id . '-demo'); ?>" data-arcsecs-space-demo-select="true">
                            <option value="free-flight">Free Flight</option>
                            <option value="dense-harvest">Harvest Dense Filament</option>
                            <option value="void-coast">Coast Void Corridor</option>
                            <option value="torsion-shear">Cross Torsion Shear</option>
                            <option value="multi-messenger">Trigger Multi-Messenger Event</option>
                            <option value="grand-tour">Grand Tour Challenge</option>
                            <option value="beacon-approach">Beacon Approach</option>
                        </select>
                        <button type="button" data-arcsecs-space-action="demo">Run Selected Demo</button>
                    </div>
                    <div class="arcsecs-space-travel-propulsion-lab" aria-label="Propulsion mode lab">
                        <label for="<?php echo esc_attr($instance_id . '-propulsion'); ?>">Propulsion Mode</label>
                        <select id="<?php echo esc_attr($instance_id . '-propulsion'); ?>" data-arcsecs-space-propulsion-select="true">
                            <option value="inertial-coast">Inertial Coast</option>
                            <option value="ramscoop-harvest">Ramscoop Harvest</option>
                            <option value="torsion-shear-assist">Torsion-Shear Assist</option>
                            <option value="proca-gradient-ride">Proca Gradient Ride</option>
                            <option value="beacon-approach">Beacon Approach</option>
                            <option value="quantized-inertia-placeholder">Quantized Inertia Placeholder — Future speculative mode — not active in this package.</option>
                            <option value="haloscope-sail-placeholder">Haloscope Sail Placeholder — Future speculative mode — not active in this package.</option>
                            <option value="warp-bubble-placeholder">Warp Bubble Placeholder — Future speculative mode — not active in this package.</option>
                        </select>
                        <button type="button" data-arcsecs-space-action="propulsion">Apply Propulsion Mode</button>
                        <p>Locked placeholders are visible for roadmap continuity but do not activate new physics in this package.</p>
                    </div>
                    <div class="arcsecs-space-travel-calibration-lab" aria-label="Mission calibration lab">
                        <h3>Mission Calibration Lab</h3>
                        <p>Adjust simulator scale safely. These controls change model/display parameters only and export calibration evidence.</p>
                        <label>
                            <span>Viewport Gpc Scale</span>
                            <input type="range" min="3" max="18" step="0.1" value="9.2" data-arcsecs-space-calibration="viewportScale" aria-label="Viewport gigaparsec scale">
                        </label>
                        <label>
                            <span>Simulated Hours / Tick</span>
                            <input type="range" min="0.0025" max="0.1" step="0.0025" value="0.0166666667" data-arcsecs-space-calibration="simulatedHoursPerTick" aria-label="Simulated hours per mission tick">
                        </label>
                        <label>
                            <span>Beacon Distance Scale</span>
                            <input type="range" min="0.25" max="3" step="0.05" value="1" data-arcsecs-space-calibration="beaconDistanceScale" aria-label="Beacon distance scale">
                        </label>
                        <label>
                            <span>Density Strength</span>
                            <input type="range" min="0.25" max="2.5" step="0.05" value="1" data-arcsecs-space-calibration="densityStrength" aria-label="Substrate density strength">
                        </label>
                        <label>
                            <span>Speed Compression</span>
                            <input type="range" min="0.2" max="4" step="0.05" value="1" data-arcsecs-space-calibration="speedCompression" aria-label="Speed compression scale">
                        </label>
                        <div class="arcsecs-space-travel-calibration-actions">
                            <button type="button" data-arcsecs-space-action="calibration">Apply Calibration</button>
                            <button type="button" data-arcsecs-space-action="calibrationReset">Reset Calibration</button>
                        </div>
                    </div>
                    <div class="arcsecs-space-travel-replay-viewer" aria-label="Mission replay export viewer">
                        <h3>Mission Replay Export Viewer</h3>
                        <p>Load an exported run JSON, validate it, and visually replay route frames, calibration state, telemetry, and falsification notes.</p>
                        <div class="arcsecs-space-travel-replay-import">
                            <label>
                                <span>Replay JSON File</span>
                                <input type="file" accept="application/json,.json" data-arcsecs-space-replay-file="true" aria-label="Load replay JSON file">
                            </label>
                            <label>
                                <span>Paste Export JSON</span>
                                <textarea data-arcsecs-space-replay-json="true" rows="4" spellcheck="false" aria-label="Paste exported replay JSON"></textarea>
                            </label>
                        </div>
                        <div class="arcsecs-space-travel-replay-actions">
                            <button type="button" data-arcsecs-space-action="loadCurrentReplay">Load Current Run as Replay</button>
                            <button type="button" data-arcsecs-space-action="importReplay">Load Replay JSON</button>
                            <button type="button" data-arcsecs-space-action="replayPrev">Replay Previous Frame</button>
                            <button type="button" data-arcsecs-space-action="replayNext">Replay Next Frame</button>
                            <button type="button" data-arcsecs-space-action="replayPlayPause">Play / Pause Replay</button>
                            <button type="button" data-arcsecs-space-action="replayClear">Clear Replay Import</button>
                        </div>
                    </div>
                    <div class="arcsecs-space-travel-controls" aria-label="Mission controls">
                        <button type="button" data-arcsecs-space-action="start">Start / Pause</button>
                        <button type="button" data-arcsecs-space-action="thrust">Hold Thrust</button>
                        <button type="button" data-arcsecs-space-action="brake">Hold Brake</button>
                        <button type="button" data-arcsecs-space-action="left">Hold Turn Left</button>
                        <button type="button" data-arcsecs-space-action="right">Hold Turn Right</button>
                        <button type="button" data-arcsecs-space-action="scoop">Toggle Scoop</button>
                        <button type="button" data-arcsecs-space-action="assist">Toggle Inertial Assist</button>
                        <button type="button" data-arcsecs-space-action="autopilot">Autopilot to Beacon</button>
                        <button type="button" data-arcsecs-space-action="signal">Trigger Signal Event</button>
                        <button type="button" data-arcsecs-space-action="fieldOverlay">Toggle Proca Field</button>
                        <button type="button" data-arcsecs-space-action="psfOverlay">Toggle PSF/Lensing</button>
                        <button type="button" data-arcsecs-space-action="torsionOverlay">Toggle Torsion Vectors</button>
                        <button type="button" data-arcsecs-space-action="inspectReplay">Inspect Replay</button>
                        <button type="button" data-arcsecs-space-action="clearTrail">Clear Trail</button>
                        <button type="button" data-arcsecs-space-action="reset">Reset Mission</button>
                        <button type="button" data-arcsecs-space-action="export">Export Run JSON</button>
                    </div>
                    <p class="arcsecs-space-travel-keyboard">Focus the simulator or its canvas for keyboard controls: W/↑ thrust, S/↓ brake, A/← turn left, D/→ turn right. Hold buttons on touch devices.</p>
                </section>

                <aside class="arcsecs-space-travel-panel" aria-label="Mission telemetry">
                    <div class="arcsecs-space-travel-status">
                        <span>Status</span>
                        <strong data-arcsecs-space-value="status">Paused</strong>
                    </div>
                    <div class="arcsecs-space-travel-telemetry-grid">
                        <article><span>Fuel Charge</span><strong data-arcsecs-space-value="fuel">0%</strong></article>
                        <article><span>Thermal Load</span><strong data-arcsecs-space-value="thermal">0%</strong></article>
                        <article><span>Torsion Pull</span><strong data-arcsecs-space-value="torsion">0</strong></article>
                        <article><span>Weber Drag</span><strong data-arcsecs-space-value="drag">0</strong></article>
                        <article><span>Proca Density</span><strong data-arcsecs-space-value="density">0</strong></article>
                        <article><span>Photon Lag</span><strong data-arcsecs-space-value="lag">0</strong></article>
                        <article><span>Arcsecs to Beacon</span><strong data-arcsecs-space-value="arcseconds">0</strong></article>
                        <article><span>Mission Score</span><strong data-arcsecs-space-value="score">0</strong></article>
                        <article><span>Gravity Arrival</span><strong data-arcsecs-space-value="gravityArrival">Pending</strong></article>
                        <article><span>Photon Arrival</span><strong data-arcsecs-space-value="photonArrival">Pending</strong></article>
                        <article><span>Photon Delay</span><strong data-arcsecs-space-value="photonDelay">0 ticks</strong></article>
                        <article><span>Photon Energy</span><strong data-arcsecs-space-value="photonEnergy">1.000</strong></article>
                        <article><span>Refractive Index</span><strong data-arcsecs-space-value="refractiveIndex">1.000</strong></article>
                        <article><span>Visibility</span><strong data-arcsecs-space-value="visibility">No signal event yet</strong></article>
                        <article class="arcsecs-space-travel-wide-card"><span>Guided Demo</span><strong data-arcsecs-space-value="demo">Select a guided mission demo or fly manually.</strong></article>
                        <article><span>Objective Score</span><strong data-arcsecs-space-value="objectiveScore">0 • Ready</strong></article>
                        <article><span>Challenge Score</span><strong data-arcsecs-space-value="challengeScore">0 • Ready</strong></article>
                        <article><span>Replay Frames</span><strong data-arcsecs-space-value="replayFrames">0</strong></article>
                        <article><span>Evidence Score</span><strong data-arcsecs-space-value="evidenceScore">0 • Collect</strong></article>
                        <article><span>Relational Arcsecs</span><strong data-arcsecs-space-value="relationalArcseconds">0.000</strong></article>
                        <article><span>Parallax</span><strong data-arcsecs-space-value="parallaxArcseconds">0.000000</strong></article>
                        <article><span>Parsec Equivalent</span><strong data-arcsecs-space-value="parsecEquivalent">0.000</strong></article>
                        <article><span>Proper Motion</span><strong data-arcsecs-space-value="properMotion">0.000000</strong></article>
                        <article class="arcsecs-space-travel-wide-card"><span>Relational State</span><strong data-arcsecs-space-value="relationalStateKey">arcsec:0.000:0.000</strong></article>
                        <article><span>Proca Field</span><strong data-arcsecs-space-value="procaFieldDensity">0.000</strong></article>
                        <article><span>Proca Gradient</span><strong data-arcsecs-space-value="procaGradient">0.000</strong></article>
                        <article><span>Proca Energy</span><strong data-arcsecs-space-value="procaFieldEnergy">0.000</strong></article>
                        <article><span>PSF Blur</span><strong data-arcsecs-space-value="psfBlur">0.00</strong></article>
                        <article><span>Lensing Deflection</span><strong data-arcsecs-space-value="lensingDeflection">0.00</strong></article>
                        <article><span>Optical Turbulence</span><strong data-arcsecs-space-value="opticalTurbulence">0.000</strong></article>
                        <article class="arcsecs-space-travel-wide-card"><span>PSF / Lensing Status</span><strong data-arcsecs-space-value="lensingStatus">PSF/lensing visualization ready.</strong></article>
                        <article><span>Torsion Vector</span><strong data-arcsecs-space-value="torsionVectorMagnitude">0.000</strong></article>
                        <article><span>Torsion Curl</span><strong data-arcsecs-space-value="torsionCurl">0.000</strong></article>
                        <article><span>Route Curvature</span><strong data-arcsecs-space-value="routeCurvature">0.000</strong></article>
                        <article><span>Curvature Radius</span><strong data-arcsecs-space-value="curvatureRadius">0.0</strong></article>
                        <article><span>Curvature Risk</span><strong data-arcsecs-space-value="curvatureRisk">0.0</strong></article>
                        <article><span>Viewport Scale</span><strong data-arcsecs-space-value="viewportScale">9.2 × 5.6 Gpc</strong></article>
                        <article><span>Distance to Beacon</span><strong data-arcsecs-space-value="distanceGpc">0.000</strong></article>
                        <article><span>Speed Gpc/hr</span><strong data-arcsecs-space-value="speedGpcHour">0.000000</strong></article>
                        <article><span>Speed pc/hr</span><strong data-arcsecs-space-value="speedParsecHour">0.0</strong></article>
                        <article><span>Speed ly/hr</span><strong data-arcsecs-space-value="speedLightYearHour">0.0</strong></article>
                        <article class="arcsecs-space-travel-wide-card"><span>Curvature Status</span><strong data-arcsecs-space-value="curvatureStatus">Route curvature inspector ready.</strong></article>
                        <article class="arcsecs-space-travel-wide-card"><span>Scale Status</span><strong data-arcsecs-space-value="scaleStatus">Cosmic scale telemetry ready.</strong></article>
                        <article><span>Propulsion Mode</span><strong data-arcsecs-space-value="propulsionMode">Inertial Coast</strong></article>
                        <article><span>Fuel Model</span><strong data-arcsecs-space-value="propulsionFuelModel">balanced inertial baseline</strong></article>
                        <article><span>Propulsion Efficiency</span><strong data-arcsecs-space-value="propulsionEfficiency">0.0%</strong></article>
                        <article><span>Propulsion Risk</span><strong data-arcsecs-space-value="propulsionRisk">0.0%</strong></article>
                        <article class="arcsecs-space-travel-wide-card"><span>Propulsion Evidence</span><strong data-arcsecs-space-value="propulsionEvidence">No propulsion mode state available.</strong></article>
                        <article><span>Arcsecs to Beacon</span><strong data-arcsecs-space-value="arcsecsToBeaconNative">0.000</strong></article>
                        <article><span>Parsecs to Beacon</span><strong data-arcsecs-space-value="parsecsToBeaconNative">0.000 pc</strong></article>
                        <article><span>Parsec Velocity</span><strong data-arcsecs-space-value="parsecVelocityNative">0.000 pc/sim hr</strong></article>
                        <article><span>Parsecs / Tick</span><strong data-arcsecs-space-value="parsecsPerTick">0.000 pc/tick</strong></article>
                        <article><span>km/s Legacy Helper</span><strong data-arcsecs-space-value="kmSecondEquivalent">0.00 km/s legacy helper</strong></article>
                        <article><span>Current Region Area</span><strong data-arcsecs-space-value="currentRegionArea">0 sq pc</strong></article>
                        <article><span>Density / sq pc</span><strong data-arcsecs-space-value="densityPerSquareParsec">0/sq pc</strong></article>
                        <article><span>Route Area Crossed</span><strong data-arcsecs-space-value="routeAreaCrossed">0 sq pc</strong></article>
                        <article class="arcsecs-space-travel-wide-card"><span>Route Mix</span><strong data-arcsecs-space-value="routeMix">No route mix yet.</strong></article>
                        <article><span>Gravity Wave ETA</span><strong data-arcsecs-space-value="gravityEta">No signal</strong></article>
                        <article><span>Photon ETA</span><strong data-arcsecs-space-value="photonEtaNative">No signal</strong></article>
                        <article><span>Line-of-Sight Density</span><strong data-arcsecs-space-value="lineOfSightDensity">0.000</strong></article>
                        <article class="arcsecs-space-travel-wide-card"><span>Wavefront Tracker</span><strong data-arcsecs-space-value="wavefrontTracker">Trigger a signal event.</strong></article>
                        <article class="arcsecs-space-travel-wide-card"><span>Best Next Action</span><strong data-arcsecs-space-value="bestNextAction">Start moving.</strong></article>
                        <article class="arcsecs-space-travel-wide-card"><span>Route Advisor</span><strong data-arcsecs-space-value="routeAdvisorMessage">Start the mission.</strong></article>
                        <article><span>Mission Outcome</span><strong data-arcsecs-space-value="missionOutcome">Ready</strong></article>
                        <article><span>Calibration Profile</span><strong data-arcsecs-space-value="calibrationProfile">Default ArcSecs parsec mission calibration</strong></article>
                        <article><span>Calibration Viewport</span><strong data-arcsecs-space-value="calibrationViewport">9.20 × 5.60 Gpc</strong></article>
                        <article><span>Calibration Tick</span><strong data-arcsecs-space-value="calibrationTickHours">0.01667 hr/tick</strong></article>
                        <article><span>Beacon Scale</span><strong data-arcsecs-space-value="calibrationBeaconScale">×1.00</strong></article>
                        <article><span>Density Strength</span><strong data-arcsecs-space-value="calibrationDensityStrength">×1.00</strong></article>
                        <article><span>Speed Compression</span><strong data-arcsecs-space-value="calibrationSpeedCompression">×1.00</strong></article>
                        <article class="arcsecs-space-travel-wide-card"><span>Calibration Evidence</span><strong data-arcsecs-space-value="calibrationEvidence">Default calibration active.</strong></article>
                        <article class="arcsecs-space-travel-wide-card"><span>Replay Viewer Status</span><strong data-arcsecs-space-value="replayViewerStatus">No export loaded.</strong></article>
                        <article><span>Replay Frames</span><strong data-arcsecs-space-value="replayViewerFrames">0</strong></article>
                        <article><span>Replay Frame</span><strong data-arcsecs-space-value="replayViewerFrame">None</strong></article>
                        <article><span>Replay Scenario</span><strong data-arcsecs-space-value="replayViewerScenario"></strong></article>
                        <article class="arcsecs-space-travel-wide-card"><span>Replay Validation</span><strong data-arcsecs-space-value="replayViewerValidation">No validation yet.</strong></article>
                        <article class="arcsecs-space-travel-wide-card"><span>Replay Falsification</span><strong data-arcsecs-space-value="replayViewerFalsification">No replay falsification note loaded.</strong></article>
                        <article class="arcsecs-space-travel-wide-card"><span>Replay Inspector</span><strong data-arcsecs-space-value="replayInspector">Replay inspector ready.</strong></article>
                        <article class="arcsecs-space-travel-wide-card"><span>Primary Objective</span><strong data-arcsecs-space-value="objectivePrimary">Select a guided demo.</strong></article>
                    </div>

                    <section class="arcsecs-readiness-sweep-panel arcsecs-space-telemetry-groups" data-arcsecs-space-telemetry-groups="true" aria-label="Grouped mission telemetry guide">
                        <h3>Grouped Mission HUD Guide</h3>
                        <div class="arcsecs-space-telemetry-group-grid">
                            <article><strong>Ship state</strong><span>fuel, thermal load, hull stress, speed, heading, propulsion mode</span></article>
                            <article><strong>Route state</strong><span>region, route mix, parsecs to beacon, torsion pull, Weber drag</span></article>
                            <article><strong>Optical / messenger state</strong><span>Gravity Arrival, Photon Arrival, Photon Delay, Photon Energy, Refractive Index, Visibility</span></article>
                            <article><strong>Calibration state</strong><span>viewport scale, simulated hours per tick, beacon distance, density strength, speed compression</span></article>
                            <article><strong>Evidence / replay state</strong><span>evidence ledger, route advisor, replay validation, replay frame count</span></article>
                            <article><strong>Falsification state</strong><span>finite telemetry, dense-region tradeoff, route reproducibility, warning visibility</span></article>
                        </div>
                    </section>

                    <div class="arcsecs-space-travel-advisor">
                        <h3>Route Advisor</h3>
                        <p><strong data-arcsecs-space-value="region">Launch pocket</strong></p>
                        <p data-arcsecs-space-value="advice">Start the mission, steer through dense zones to harvest fuel, then coast through void corridors to cool down.</p>
                        <p class="arcsecs-space-travel-messenger" data-arcsecs-space-value="messenger">Trigger a signal event to compare gravity baseline against delayed photon propagation.</p>
                        <div class="arcsecs-space-travel-objective-hud">
                            <h3>Mission Objective HUD</h3>
                            <p data-arcsecs-space-value="objectiveActive">No active objective yet.</p>
                            <p class="arcsecs-space-travel-achievements" data-arcsecs-space-value="challengeAchievements">No achievements yet.</p>
                            <p class="arcsecs-space-travel-evidence" data-arcsecs-space-value="evidenceStatus">Evidence ledger ready.</p>
                        </div>
                    </div>
                </aside>
            </div>

            <section class="arcsecs-space-travel-falsification" aria-label="Evidence and falsification">
                <h3>Evidence &amp; Falsification</h3>
                <p>This game is useful only if the exported evidence can replay finite telemetry and if dense, void, torsion, wavefront, and propulsion claims create distinct tradeoffs.</p>
                <ul>
                    <li>Dense regions should increase fuel, drag, heat, photon lag, and route risk together.</li>
                    <li>Void corridors should reduce drag and photon lag while producing weaker fuel gain.</li>
                    <li>Photon lag should vary with substrate density.</li>
                    <li>Torsion fields should bend the route and show correction pressure.</li>
                    <li>Propulsion modes should produce distinct fuel, heat, speed, and route telemetry.</li>
                    <li>Exported evidence should replay the run without NaN or Infinity.</li>
                </ul>
                <button type="button" data-arcsecs-space-action="copyFalsification">Copy Falsification Summary</button>
            </section>

            <?php if ($show_notes) : ?>
                <section class="arcsecs-space-travel-notes">
                    <h3>What this demo is showing</h3>
                    <div>
                        <article>
                            <h4>Dense regions</h4>
                            <p>Dense substrate gives the Ramscoop more fuel, but increases torsion pull, Weber drag, thermal load, and optical lag.</p>
                        </article>
                        <article>
                            <h4>Void corridors</h4>
                            <p>Void corridors provide smoother inertial coasting and lower drag, but weaker fuel recovery.</p>
                        </article>
                        <article>
                            <h4>Replay trail</h4>
                            <p>The simulator records a ghost trail and challenge frames so exports can show the route, regions crossed, score, and checkpoint evidence.</p>
                        </article>
                        <article>
                            <h4>Mission objective scorecard</h4>
                            <p>The HUD scores each run for movement, fuel reserve, thermal safety, scenario evidence, and export-ready finite telemetry.</p>
                        </article>
                        <article>
                            <h4>Guided mission demos</h4>
                            <p>Use the demo selector to jump into dense harvest, void coast, torsion shear, multi-messenger, or beacon approach behavior without needing to learn the controls first.</p>
                        </article>
                        <article>
                            <h4>Multi-messenger wavefronts</h4>
                            <p>Trigger a signal event to see a fast GravityWavefront and slower red/fading PhotonWavefront. Dense Proca substrate increases photon delay and may weaken the electromagnetic counterpart.</p>
                        </article>
                        <article>
                            <h4>Instrument mask</h4>
                            <p>The canvas is pilot telemetry, not literal space. It maps relational ArcSecs vectors, Proca density, torsion, and mission evidence into a playable view.</p>
                        </article>
                    </div>
                </section>
            <?php endif; ?>
        </section>
        <?php
        return (string) ob_get_clean();
    }



}
