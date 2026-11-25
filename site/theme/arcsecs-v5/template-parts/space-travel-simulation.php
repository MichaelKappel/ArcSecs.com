<?php
/**
 * Public page-content route for the ArcSecs Space Travel Simulation.
 *
 * This page is intentionally theme/page content only. The live simulator,
 * telemetry, validation, exports, and runtime behavior remain owned by the
 * ArcSecs plugin.
 *
 * @package ArcSecs
 */
$demo_url     = arcsecs_ai_access_url( 'arcsecs-physics-engine-demo/' );
$drive_url    = arcsecs_dark_matter_drive_simulator_url();
$distance_url = arcsecs_distance_time_framework_url();
?>
<main id="primary" class="site-main arcsecs-space-travel-page">
    <section class="space-travel-hero" id="space-travel-overview">
        <div class="wrap space-travel-hero__grid">
            <div class="space-travel-hero__copy">
                <p class="eyebrow"><?php esc_html_e( 'ArcSecs mission model', 'arcsecs' ); ?></p>
                <h1><?php esc_html_e( 'Space Travel Simulation: Ship Transit Through Dense Substrate, Void Corridors, and Torsion Fields', 'arcsecs' ); ?></h1>
                <p class="space-travel-hero__lede"><?php esc_html_e( 'A public guide to the ArcSecs ship-travel simulation: a speculative mission model where a pilot chooses between fuel-rich dense substrate, smoother void corridors, and torsion-field hazards.', 'arcsecs' ); ?></p>
                <div class="space-travel-hero__quick-read" aria-label="Space Travel Simulation quick read">
                    <span><?php esc_html_e( 'Dense = fuel + risk', 'arcsecs' ); ?></span>
                    <span><?php esc_html_e( 'Void = coast + low fuel', 'arcsecs' ); ?></span>
                    <span><?php esc_html_e( 'Map = telemetry mask', 'arcsecs' ); ?></span>
                </div>
                <p class="arcsecs-boundary-note"><?php esc_html_e( 'Speculative research visualization. Theme bridge only: this page explains a proposed simulation model and falsification path; it does not claim proof, settled physics, or established spacecraft technology.', 'arcsecs' ); ?></p>
                <div class="hero-actions hero-actions--focused">
                    <a class="arcsecs-button" href="<?php echo esc_url( $drive_url ); ?>"><?php esc_html_e( 'Open DM Drive', 'arcsecs' ); ?></a>
                    <a class="arcsecs-button ghost" href="<?php echo esc_url( $demo_url ); ?>"><?php esc_html_e( 'Open Physics Demo', 'arcsecs' ); ?></a>
                    <a class="arcsecs-button ghost" href="<?php echo esc_url( $distance_url ); ?>"><?php esc_html_e( 'Read Distance-Time Framework', 'arcsecs' ); ?></a>
                </div>
            </div>
            <aside class="space-travel-hero__panel" aria-label="Space Travel Simulation route model">
                <div class="space-travel-map-mask" aria-hidden="true">
                    <span class="space-travel-map-mask__ship">Ship</span>
                    <span class="space-travel-map-mask__dense">Dense substrate</span>
                    <span class="space-travel-map-mask__void">Void corridor</span>
                    <span class="space-travel-map-mask__torsion">Torsion field</span>
                </div>
                <div class="space-travel-hero-readout" aria-label="Pilot route readout">
                    <span><strong><?php esc_html_e( 'Fuel', 'arcsecs' ); ?></strong><?php esc_html_e( 'Substrate density', 'arcsecs' ); ?></span>
                    <span><strong><?php esc_html_e( 'Risk', 'arcsecs' ); ?></strong><?php esc_html_e( 'Torsion / drag / heat', 'arcsecs' ); ?></span>
                    <span><strong><?php esc_html_e( 'Proof', 'arcsecs' ); ?></strong><?php esc_html_e( 'Exported evidence, not claims', 'arcsecs' ); ?></span>
                </div>
                <h2><?php esc_html_e( 'Mission premise', 'arcsecs' ); ?></h2>
                <p><?php esc_html_e( 'The ship is modeled as a pilotable system moving through regions that trade fuel access against drag, heat, optical lag, and route instability.', 'arcsecs' ); ?></p>
            </aside>
        </div>
    </section>

    <section id="space-travel-live-simulator" class="space-travel-live-simulator" aria-labelledby="space-travel-live-simulator-title">
    <div class="wrap">
        <div class="space-travel-live-simulator__heading">
            <p class="eyebrow">Playable mission simulator</p>
            <h2 id="space-travel-live-simulator-title">Run the Space Travel Mission Simulator</h2>
            <p><?php esc_html_e( 'Use the plugin-owned simulator below to test ship movement, dense substrate zones, void corridors, torsion shear, destination beacon, route advisor, telemetry cards, and Export Run JSON.', 'arcsecs' ); ?></p>
        </div>

        <p class="space-travel-live-simulator__boundary">
            <?php esc_html_e( 'Speculative research visualization. The live simulator, telemetry, export, controls, and ship movement are provided by the ArcSecs plugin; this page only places the shortcode and explains the mission model.', 'arcsecs' ); ?>
        </p>

        <div class="space-travel-shortcode-shell">
            <?php
            if ( shortcode_exists( 'arcsecs_space_travel_simulation' ) ) {
                echo do_shortcode( '[arcsecs_space_travel_simulation]' );
            } else {
                ?>
                <div class="space-travel-shortcode-fallback">
                    <h3><?php esc_html_e( 'Simulator plugin shortcode unavailable', 'arcsecs' ); ?></h3>
                    <p><?php esc_html_e( 'The Space Travel Mission Simulator requires the ArcSecs plugin v5.7.97 or newer with the [arcsecs_space_travel_simulation] shortcode enabled.', 'arcsecs' ); ?></p>
                </div>
                <?php
            }
            ?>
        </div>
    </div>
</section>

<nav class="space-travel-page-map" aria-label="Space Travel Simulation page map">
        <div class="wrap space-travel-page-map__inner">
            <a href="#mission-model"><?php esc_html_e( 'Mission model', 'arcsecs' ); ?></a>
            <a href="#instrument-mask"><?php esc_html_e( 'Instrument mask', 'arcsecs' ); ?></a>
            <a href="#pilot-loop"><?php esc_html_e( 'Pilot loop', 'arcsecs' ); ?></a>
            <a href="#research-stack"><?php esc_html_e( 'Research stack', 'arcsecs' ); ?></a>
            <a href="#telemetry-contract"><?php esc_html_e( 'Telemetry contract', 'arcsecs' ); ?></a>
            <a href="#falsification"><?php esc_html_e( 'Falsification', 'arcsecs' ); ?></a>
            <a href="#faq"><?php esc_html_e( 'FAQ', 'arcsecs' ); ?></a>
        </div>
    </nav>

    <section class="space-travel-drive-cta" aria-label="Open the live Dark Matter Drive Simulator">
        <div class="wrap space-travel-drive-cta__inner">
            <div>
                <p class="eyebrow"><?php esc_html_e( 'Open the live sandbox', 'arcsecs' ); ?></p>
                <h2><?php esc_html_e( 'Use this page as the briefing, then test routes in the Dark Matter Drive Simulator.', 'arcsecs' ); ?></h2>
                <p><?php esc_html_e( 'The theme page explains the mission model. The plugin-owned simulator is where route planning, telemetry, validation, and exports should be exercised after the emergency-safe plugin path is verified.', 'arcsecs' ); ?></p>
            </div>
            <a class="arcsecs-button" href="<?php echo esc_url( $drive_url ); ?>"><?php esc_html_e( 'Open Dark Matter Drive Simulator', 'arcsecs' ); ?></a>
        </div>
    </section>

    <section class="space-travel-section" id="mission-model">
        <div class="wrap">
            <div class="space-travel-section__heading">
                <p class="eyebrow"><?php esc_html_e( 'Route planning', 'arcsecs' ); ?></p>
                <h2><?php esc_html_e( 'Dense substrate and void corridor mission model', 'arcsecs' ); ?></h2>
                <p><?php esc_html_e( 'The public model treats space travel as a route-planning problem through substrate conditions, not as a cartoon shortcut through physical spacetime.', 'arcsecs' ); ?></p>
            </div>
            <div class="space-travel-dual-grid">
                <article class="space-travel-card space-travel-card--dense">
                    <h3><?php esc_html_e( 'Dense substrate: high fuel, high risk', 'arcsecs' ); ?></h3>
                    <p><?php esc_html_e( 'Dense regions are modeled as richer fuel-harvesting corridors where a ship can interact with a Proca-style substrate, slow-light residue, or dark-sector medium. The tradeoff is higher torsion load, more drag, thermal stress, optical lag, and route instability.', 'arcsecs' ); ?></p>
                    <div class="space-travel-tradeoff" aria-label="Dense substrate tradeoff">
                        <span><strong><?php esc_html_e( 'Fuel', 'arcsecs' ); ?></strong><em><?php esc_html_e( 'High', 'arcsecs' ); ?></em></span>
                        <span><strong><?php esc_html_e( 'Drag', 'arcsecs' ); ?></strong><em><?php esc_html_e( 'High', 'arcsecs' ); ?></em></span>
                        <span><strong><?php esc_html_e( 'Optical lag', 'arcsecs' ); ?></strong><em><?php esc_html_e( 'Higher', 'arcsecs' ); ?></em></span>
                    </div>
                    <ul>
                        <li><?php esc_html_e( 'More harvestable substrate/fuel signal.', 'arcsecs' ); ?></li>
                        <li><?php esc_html_e( 'More torsion, drag, heat, and guidance burden.', 'arcsecs' ); ?></li>
                        <li><?php esc_html_e( 'Higher risk of degraded light telemetry and delayed optical confirmation.', 'arcsecs' ); ?></li>
                    </ul>
                </article>
                <article class="space-travel-card space-travel-card--void">
                    <h3><?php esc_html_e( 'Void corridor: smoother coasting, weaker fuel', 'arcsecs' ); ?></h3>
                    <p><?php esc_html_e( 'Void corridors are modeled as smoother inertial coasting lanes where the ship experiences less drag and cleaner navigation but has weaker fuel availability. These routes may be safer for stability while requiring better energy planning.', 'arcsecs' ); ?></p>
                    <div class="space-travel-tradeoff space-travel-tradeoff--void" aria-label="Void corridor tradeoff">
                        <span><strong><?php esc_html_e( 'Fuel', 'arcsecs' ); ?></strong><em><?php esc_html_e( 'Low', 'arcsecs' ); ?></em></span>
                        <span><strong><?php esc_html_e( 'Drag', 'arcsecs' ); ?></strong><em><?php esc_html_e( 'Low', 'arcsecs' ); ?></em></span>
                        <span><strong><?php esc_html_e( 'Coast', 'arcsecs' ); ?></strong><em><?php esc_html_e( 'Smooth', 'arcsecs' ); ?></em></span>
                    </div>
                    <ul>
                        <li><?php esc_html_e( 'Lower drag and cleaner inertial coasting.', 'arcsecs' ); ?></li>
                        <li><?php esc_html_e( 'Weaker available substrate/fuel signal.', 'arcsecs' ); ?></li>
                        <li><?php esc_html_e( 'Better route stability but tighter energy budgeting.', 'arcsecs' ); ?></li>
                    </ul>
                </article>
            </div>
        </div>
    </section>

    <section class="space-travel-section" id="instrument-mask">
        <div class="wrap space-travel-two-column">
            <div>
                <p class="eyebrow"><?php esc_html_e( 'Pilot telemetry', 'arcsecs' ); ?></p>
                <h2><?php esc_html_e( 'The 2D map is an instrument mask, not literal space', 'arcsecs' ); ?></h2>
                <p><?php esc_html_e( 'The route map should be read like a pilot display. It compresses route risk, substrate density, torsion load, energy margin, and optical lag into a navigable telemetry mask. It is not claiming that the universe is literally a flat video-game board.', 'arcsecs' ); ?></p>
                <p><?php esc_html_e( 'This distinction matters because the ArcSecs page is explaining a model. The simulator can compare route strategies without pretending the display itself is the physical territory.', 'arcsecs' ); ?></p>
            </div>
            <aside class="space-travel-callout">
                <h3><?php esc_html_e( 'Instrument reading', 'arcsecs' ); ?></h3>
                <p><?php esc_html_e( 'Dense cells mean fuel potential plus hazard. Void cells mean smooth coasting plus weak fuel. Torsion fields mean route-bending constraints in the proposed teleparallel language.', 'arcsecs' ); ?></p>
            </aside>
        </div>
    </section>

    <section class="space-travel-section" id="pilot-loop">
        <div class="wrap">
            <div class="space-travel-section__heading">
                <p class="eyebrow"><?php esc_html_e( 'Story flow', 'arcsecs' ); ?></p>
                <h2><?php esc_html_e( 'Pilot loop: sense, choose, coast, harvest, verify', 'arcsecs' ); ?></h2>
            </div>
            <ol class="space-travel-loop-list">
                <li><strong><?php esc_html_e( 'Sense the substrate.', 'arcsecs' ); ?></strong> <?php esc_html_e( 'Read density, torsion, heat, drag, optical lag, and available fuel signal.', 'arcsecs' ); ?></li>
                <li><strong><?php esc_html_e( 'Choose the corridor.', 'arcsecs' ); ?></strong> <?php esc_html_e( 'Pick dense substrate for harvesting or void corridors for smoother coasting.', 'arcsecs' ); ?></li>
                <li><strong><?php esc_html_e( 'Ride the safe gradient.', 'arcsecs' ); ?></strong> <?php esc_html_e( 'Stay inside route limits instead of forcing a fragile path through high-risk cells.', 'arcsecs' ); ?></li>
                <li><strong><?php esc_html_e( 'Harvest only when margin allows.', 'arcsecs' ); ?></strong> <?php esc_html_e( 'Dense regions are useful only when drag, heat, and guidance limits remain controlled.', 'arcsecs' ); ?></li>
                <li><strong><?php esc_html_e( 'Verify with exports.', 'arcsecs' ); ?></strong> <?php esc_html_e( 'The plugin-owned simulator should export route state, telemetry, validation, and falsification notes.', 'arcsecs' ); ?></li>
            </ol>
        </div>
    </section>

    <section class="space-travel-section" id="research-stack">
        <div class="wrap">
            <div class="space-travel-section__heading">
                <p class="eyebrow"><?php esc_html_e( 'Research stack', 'arcsecs' ); ?></p>
                <h2><?php esc_html_e( 'Background concepts that frame the simulator language', 'arcsecs' ); ?></h2>
                <p><?php esc_html_e( 'These concepts are terminology anchors for the speculative simulation, not proof that ArcSecs is correct.', 'arcsecs' ); ?></p>
            </div>
            <div class="space-travel-research-grid">
                <article><h3><?php esc_html_e( 'Relational / no-spacetime framing', 'arcsecs' ); ?></h3><p><?php esc_html_e( 'The route model describes relations, gradients, and telemetry rather than a ship warping a literal spacetime fabric.', 'arcsecs' ); ?></p></article>
                <article><h3><?php esc_html_e( 'Teleparallel torsion', 'arcsecs' ); ?></h3><p><?php esc_html_e( 'Torsion language frames route-bending forces without making curvature of physical spacetime the page foundation.', 'arcsecs' ); ?></p></article>
                <article><h3><?php esc_html_e( 'Proca substrate', 'arcsecs' ); ?></h3><p><?php esc_html_e( 'Massive-vector language helps describe a substrate a ship might hypothetically interact with or harvest from.', 'arcsecs' ); ?></p></article>
                <article><h3><?php esc_html_e( 'Mass-Polariton transfer', 'arcsecs' ); ?></h3><p><?php esc_html_e( 'Light-medium momentum transfer is used as a background analogy for coupling electromagnetic energy with material response.', 'arcsecs' ); ?></p></article>
                <article><h3><?php esc_html_e( 'Tired light / graviball substrate', 'arcsecs' ); ?></h3><p><?php esc_html_e( 'The page uses slow-light residue and graviball-style substrate as speculative language for dark-sector fuel availability.', 'arcsecs' ); ?></p></article>
                <article><h3><?php esc_html_e( 'EIT / Dark-State Polariton capture', 'arcsecs' ); ?></h3><p><?php esc_html_e( 'Slow-light and dark-state polariton ideas frame how light-like information or energy might be delayed, stored, or coupled in a medium.', 'arcsecs' ); ?></p></article>
                <article><h3><?php esc_html_e( 'Ramscoop vortex', 'arcsecs' ); ?></h3><p><?php esc_html_e( 'The drive concept treats the ship as shaping intake and routing behavior through a proposed capture vortex, not as free magic propulsion.', 'arcsecs' ); ?></p></article>
            </div>
        </div>
    </section>

    <section class="space-travel-section" id="telemetry-contract">
        <div class="wrap">
            <div class="space-travel-section__heading">
                <p class="eyebrow"><?php esc_html_e( 'Plugin contract', 'arcsecs' ); ?></p>
                <h2><?php esc_html_e( 'Telemetry and export contract expectations', 'arcsecs' ); ?></h2>
                <p><?php esc_html_e( 'This page explains what the plugin-owned simulator should make visible and exportable. The theme does not calculate these values.', 'arcsecs' ); ?></p>
            </div>
            <div class="space-travel-telemetry-scan" aria-label="Telemetry contract quick scan">
                <article><strong><?php esc_html_e( 'Route state', 'arcsecs' ); ?></strong><span><?php esc_html_e( 'corridor, density, torsion, heat, energy margin', 'arcsecs' ); ?></span></article>
                <article><strong><?php esc_html_e( 'Tradeoff', 'arcsecs' ); ?></strong><span><?php esc_html_e( 'fuel vs drag vs stability', 'arcsecs' ); ?></span></article>
                <article><strong><?php esc_html_e( 'Evidence', 'arcsecs' ); ?></strong><span><?php esc_html_e( 'finite values, UTC timestamp, caveats', 'arcsecs' ); ?></span></article>
                <article><strong><?php esc_html_e( 'Falsification', 'arcsecs' ); ?></strong><span><?php esc_html_e( 'what would weaken the route model', 'arcsecs' ); ?></span></article>
            </div>
            <div class="space-travel-table-wrap" role="region" aria-label="Telemetry and export contract table" tabindex="0">
                <table class="space-travel-contract-table">
                    <thead>
                        <tr>
                            <th><?php esc_html_e( 'Contract item', 'arcsecs' ); ?></th>
                            <th><?php esc_html_e( 'What it should show', 'arcsecs' ); ?></th>
                            <th><?php esc_html_e( 'Export quality expectation', 'arcsecs' ); ?></th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr><td><?php esc_html_e( 'Route state', 'arcsecs' ); ?></td><td><?php esc_html_e( 'Active corridor, density, torsion, drag, heat, and energy margin.', 'arcsecs' ); ?></td><td><?php esc_html_e( 'Finite values with UTC timestamp and active scenario label.', 'arcsecs' ); ?></td></tr>
                        <tr><td><?php esc_html_e( 'Dense substrate', 'arcsecs' ); ?></td><td><?php esc_html_e( 'Fuel potential plus higher risk from torsion, drag, heat, and optical lag.', 'arcsecs' ); ?></td><td><?php esc_html_e( 'Separate fuel and hazard fields so dense regions are not treated as automatically good.', 'arcsecs' ); ?></td></tr>
                        <tr><td><?php esc_html_e( 'Void corridor', 'arcsecs' ); ?></td><td><?php esc_html_e( 'Smoother coasting with reduced fuel availability.', 'arcsecs' ); ?></td><td><?php esc_html_e( 'Route comparison should preserve the fuel-versus-stability tradeoff.', 'arcsecs' ); ?></td></tr>
                        <tr><td><?php esc_html_e( 'Autopilot / mission objectives', 'arcsecs' ); ?></td><td><?php esc_html_e( 'Pilot loop state, chosen route, mission phase, and warning state.', 'arcsecs' ); ?></td><td><?php esc_html_e( 'Exports should include enough state for an outside reviewer to replay or critique decisions.', 'arcsecs' ); ?></td></tr>
                        <tr><td><?php esc_html_e( 'Falsification notes', 'arcsecs' ); ?></td><td><?php esc_html_e( 'What would weaken the route model or break the telemetry claim.', 'arcsecs' ); ?></td><td><?php esc_html_e( 'Every evidence packet should include caveats and speculative-boundary text.', 'arcsecs' ); ?></td></tr>
                    </tbody>
                </table>
            </div>
            <p class="space-travel-contract-note"><?php esc_html_e( 'Expected export posture: clear labels, finite telemetry, UTC timestamps, caveats, source references, validation state, and no proof/settled-technology wording.', 'arcsecs' ); ?></p>
            <div class="space-travel-contract-cta">
                <p><?php esc_html_e( 'Ready to compare the briefing against the live sandbox?', 'arcsecs' ); ?></p>
                <a class="arcsecs-button" href="<?php echo esc_url( $drive_url ); ?>"><?php esc_html_e( 'Open Dark Matter Drive Simulator', 'arcsecs' ); ?></a>
            </div>
        </div>
    </section>

    <section class="space-travel-section" id="falsification">
        <div class="wrap space-travel-two-column">
            <div>
                <p class="eyebrow"><?php esc_html_e( 'Falsification first', 'arcsecs' ); ?></p>
                <h2><?php esc_html_e( 'How the model should be challenged', 'arcsecs' ); ?></h2>
                <p><?php esc_html_e( 'The simulator is stronger when it shows how the route model could fail. Dense regions should not be automatically celebrated, and void corridors should not be treated as cost-free shortcuts.', 'arcsecs' ); ?></p>
            </div>
            <ul class="space-travel-falsification-list">
                <li><?php esc_html_e( 'Dense substrate does not increase fuel availability in the exported telemetry.', 'arcsecs' ); ?></li>
                <li><?php esc_html_e( 'Dense substrate increases fuel but does not increase torsion, drag, heat, or optical lag.', 'arcsecs' ); ?></li>
                <li><?php esc_html_e( 'Void corridors do not reduce drag or do not lower fuel availability.', 'arcsecs' ); ?></li>
                <li><?php esc_html_e( 'Autopilot decisions cannot be explained from route telemetry.', 'arcsecs' ); ?></li>
                <li><?php esc_html_e( 'Exported evidence lacks caveats, validation state, or falsification notes.', 'arcsecs' ); ?></li>
            </ul>
        </div>
    </section>

    <section class="space-travel-section" id="faq">
        <div class="wrap">
            <div class="space-travel-section__heading">
                <p class="eyebrow"><?php esc_html_e( 'FAQ', 'arcsecs' ); ?></p>
                <h2><?php esc_html_e( 'Space Travel Simulation questions', 'arcsecs' ); ?></h2>
            </div>
            <div class="space-travel-faq-list">
                <details open><summary><?php esc_html_e( 'Is this claiming working spacecraft technology?', 'arcsecs' ); ?></summary><p><?php esc_html_e( 'No. This is a speculative research visualization and simulator-language page. It describes hypotheses to compare and test.', 'arcsecs' ); ?></p></details>
                <details><summary><?php esc_html_e( 'What is dense substrate?', 'arcsecs' ); ?></summary><p><?php esc_html_e( 'In this public model, dense substrate means a route region with more proposed fuel signal but also more torsion, drag, heat, optical lag, and risk.', 'arcsecs' ); ?></p></details>
                <details><summary><?php esc_html_e( 'What is a void corridor?', 'arcsecs' ); ?></summary><p><?php esc_html_e( 'A void corridor is a smoother coasting region with weaker fuel availability. It is useful for route stability but requires better energy planning.', 'arcsecs' ); ?></p></details>
                <details><summary><?php esc_html_e( 'Does the page run the simulator?', 'arcsecs' ); ?></summary><p><?php esc_html_e( 'No. This theme page explains the model and links to plugin-owned simulator pages. Runtime state, telemetry, validation, exports, and live viewport behavior remain in the plugin.', 'arcsecs' ); ?></p></details>
                <details><summary><?php esc_html_e( 'What should exports prove?', 'arcsecs' ); ?></summary><p><?php esc_html_e( 'Exports should not prove the theory. They should make the simulation run reviewable by exposing route state, telemetry, validation, caveats, and falsification notes.', 'arcsecs' ); ?></p></details>
            </div>
        </div>
    </section>
</main>
