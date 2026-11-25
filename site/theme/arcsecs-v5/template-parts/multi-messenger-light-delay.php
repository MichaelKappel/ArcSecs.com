<?php
/**
 * Virtual page template for Multi-Messenger Light Delay.
 *
 * @package ArcSecs
 */
$comparison_url = arcsecs_ai_access_url( 'standard-cosmology-vs-arcsecs/' );
$anomalies_url  = arcsecs_ai_access_url( 'cosmic-anomalies-tracker/' );
$demo_url       = arcsecs_ai_access_url( 'arcsecs-physics-engine-demo/' );
$drive_url      = arcsecs_dark_matter_drive_simulator_url();
$library_url    = arcsecs_ai_access_url( 'research-library/' );

$event_rows = array(
    array(
        'name'        => 'GW170817',
        'source'      => 'Binary neutron star merger',
        'distance'    => '~40 Mpc',
        'counterpart' => 'GRB 170817A / kilonova',
        'delay'       => '1.74 seconds',
        'reading'     => 'Best local anchor: gravity-wave timing arrives first, while most of the electromagnetic lag is treated as source/ejecta delay. The uploaded report estimates only a small propagation component.',
        'status'      => 'Benchmark event',
    ),
    array(
        'name'        => 'GW150914',
        'source'      => 'Binary black hole merger',
        'distance'    => '~410 Mpc',
        'counterpart' => 'Weak gamma-ray transient, debated',
        'delay'       => '~0.4 seconds if associated',
        'reading'     => 'Useful stress test because the electromagnetic association is debated and a simple universal slowing law does not fit cleanly without path-density or false-association caveats.',
        'status'      => 'Debated counterpart',
    ),
    array(
        'name'        => 'GW190521',
        'source'      => 'Massive binary black hole merger',
        'distance'    => '~5.3 Gpc nominal',
        'counterpart' => 'Optical flare candidate in AGN environment',
        'delay'       => '~34 days',
        'reading'     => 'The long delay is framed mainly as AGN/accretion-disk environment diffusion rather than pure vacuum propagation delay.',
        'status'      => 'Environmental stress test',
    ),
);

$image_rows = array(
    array(
        'path'    => 'assets/images/multi-messenger-astronomy-event-timeline.png',
        'alt'     => 'Three multi-messenger event timeline comparing gravitational wave detection and later electromagnetic observations for GW170817, GW150914, and GW190521.',
        'caption' => 'Three-event timing overview: gravity-wave detections appear first, while electromagnetic counterparts are observed later with different source and environment caveats.',
        'width'   => '2048',
        'height'  => '1152',
    ),
    array(
        'path'    => 'assets/images/neutron-star-merger-event-timeline.png',
        'alt'     => 'GW170817-like neutron star merger diagram showing gravitational waves detected first and electromagnetic light seen 1.74 seconds later.',
        'caption' => 'GW170817-like event map: the page keeps the 1.74-second lag visible while separating source delay from any proposed propagation component.',
        'width'   => '2048',
        'height'  => '1152',
    ),
    array(
        'path'    => 'assets/images/electromagnetic-lag-vs-distance-analysis.png',
        'alt'     => 'Log-scale chart comparing observed electromagnetic lag after gravitational wave detection against estimated source distance for three events.',
        'caption' => 'Lag-versus-distance analysis: the report-based reading says the values remain extremely close to c and are better handled as source plus environment plus possible propagation effects.',
        'width'   => '2048',
        'height'  => '1152',
    ),
    array(
        'path'    => 'assets/images/light-slowing-energy-degeneration-diagram.png',
        'alt'     => 'ArcSecs speculative diagram comparing gravitational waves, electromagnetic light, velocity attenuation, energy degeneration, and intrinsic source delay.',
        'caption' => 'Model diagram: gravitational waves provide the clean baseline while electromagnetic light is treated as the speculative path-dependent signal in the ArcSecs test model.',
        'width'   => '2048',
        'height'  => '1152',
    ),
);
?>
<article class="multi-messenger-page" aria-labelledby="multi-messenger-title">
    <section class="multi-messenger-hero">
        <div class="wrap multi-messenger-hero__grid">
            <div class="multi-messenger-hero__copy">
                <div class="eyebrow">Multi-messenger timing</div>
                <h1 id="multi-messenger-title">Gravity detected first. Light seen later. What does that really test?</h1>
                <p class="multi-messenger-hero__subtitle">A report-based ArcSecs page for separating gravitational-wave baselines, electromagnetic source delays, environmental diffusion, and the speculative light-slowing / tired-light propagation branch.</p>
                <p class="multi-messenger-boundary"><strong>Scientific boundary:</strong> multi-messenger astronomy is real observational science. The ArcSecs interpretation on this page is speculative and should be treated as a model to test, not a settled replacement for mainstream relativity or astrophysics.</p>
                <div class="multi-messenger-actions">
                    <a class="arcsecs-button" href="#event-ledger">Review the events</a>
                    <a class="arcsecs-button ghost" href="#model-checkpoints">See model checkpoints</a>
                    <a class="arcsecs-button ghost" href="<?php echo esc_url( $demo_url ); ?>">Open Physics Demo</a>
                </div>
            </div>
            <figure class="multi-messenger-hero__visual">
                <?php arcsecs_render_theme_picture( 'assets/images/light-slowing-energy-degeneration-diagram.png', 'Speculative ArcSecs model showing gravitational waves as a baseline and electromagnetic light as a path-dependent delayed signal.', array( 'loading' => 'eager', 'fetchpriority' => 'high', 'width' => '2048', 'height' => '1152' ) ); ?>
                <figcaption>Speculative model map: clean gravity-wave baseline, delayed electromagnetic counterpart, and explicit source-delay caveat.</figcaption>
            </figure>
        </div>
    </section>

    <nav class="multi-messenger-mini-nav" aria-label="Multi-messenger page sections">
        <div class="wrap multi-messenger-mini-nav__inner">
            <a href="#quick-read">Quick read</a>
            <a href="#event-ledger">Events</a>
            <a href="#visual-ledger">Diagrams</a>
            <a href="#model-checkpoints">Checkpoints</a>
            <a href="#simulation-path">Simulation path</a>
            <a href="#evidence-sources-multi-messenger">Sources</a>
        </div>
    </nav>

    <section id="quick-read" class="multi-messenger-section wrap" aria-labelledby="quick-read-title">
        <div class="multi-messenger-section__heading">
            <div class="eyebrow">Scan first</div>
            <h2 id="quick-read-title">The page is not saying every delay is pure slow light.</h2>
            <p>The useful claim is narrower: gravitational waves create a clean timing baseline, while electromagnetic counterparts carry source physics, environmental opacity, and any possible propagation effect together.</p>
        </div>
        <div class="multi-messenger-scan-grid">
            <article><span>01</span><h3>Observation</h3><p>Several candidate multi-messenger readings show gravitational-wave signals detected before electromagnetic light or candidate counterparts.</p></article>
            <article><span>02</span><h3>Mainstream caveat</h3><p>Most of the measured lag is usually explained by source delay, jet breakout, ejecta opacity, association uncertainty, or AGN environment diffusion.</p></article>
            <article><span>03</span><h3>ArcSecs test</h3><p>The speculative branch asks whether a tiny residual propagation component can be modeled as path-dependent electromagnetic slowing and energy degeneration.</p></article>
            <article><span>04</span><h3>Failure condition</h3><p>If a simple slowing law breaks GW150914, supernova timing, lensing, brightness, or image sharpness, the simulator must say so visibly.</p></article>
        </div>
    </section>

    <section id="event-ledger" class="multi-messenger-section wrap" aria-labelledby="event-ledger-title">
        <div class="multi-messenger-section__heading">
            <div class="eyebrow">Event ledger</div>
            <h2 id="event-ledger-title">Three timing cases, three very different caveats.</h2>
            <p>The event cards keep observed timing separate from interpretation. That makes the page harder to misuse as a slogan and more useful as a simulator checklist.</p>
        </div>
        <div class="multi-messenger-event-grid">
            <?php foreach ( $event_rows as $event_row ) : ?>
                <article class="multi-messenger-event-card">
                    <span><?php echo esc_html( $event_row['status'] ); ?></span>
                    <h3><?php echo esc_html( $event_row['name'] ); ?></h3>
                    <dl>
                        <div><dt>Source</dt><dd><?php echo esc_html( $event_row['source'] ); ?></dd></div>
                        <div><dt>Distance</dt><dd><?php echo esc_html( $event_row['distance'] ); ?></dd></div>
                        <div><dt>EM counterpart</dt><dd><?php echo esc_html( $event_row['counterpart'] ); ?></dd></div>
                        <div><dt>Observed lag</dt><dd><?php echo esc_html( $event_row['delay'] ); ?></dd></div>
                    </dl>
                    <p><?php echo esc_html( $event_row['reading'] ); ?></p>
                </article>
            <?php endforeach; ?>
        </div>
    </section>

    <section id="visual-ledger" class="multi-messenger-section wrap" aria-labelledby="visual-ledger-title">
        <div class="multi-messenger-section__heading">
            <div class="eyebrow">Visual ledger</div>
            <h2 id="visual-ledger-title">Use diagrams to keep the model honest.</h2>
            <p>The uploaded graphics are now part of the page so visitors can understand the timing claim visually before reading the dense model logic.</p>
        </div>
        <div class="multi-messenger-visual-grid">
            <?php foreach ( $image_rows as $image_row ) : ?>
                <figure class="multi-messenger-visual-card">
                    <?php arcsecs_render_theme_picture( $image_row['path'], $image_row['alt'], array( 'width' => $image_row['width'], 'height' => $image_row['height'] ) ); ?>
                    <figcaption><?php echo esc_html( $image_row['caption'] ); ?></figcaption>
                </figure>
            <?php endforeach; ?>
        </div>
    </section>

    <section id="model-checkpoints" class="multi-messenger-section wrap" aria-labelledby="model-checkpoints-title">
        <div class="multi-messenger-section__heading">
            <div class="eyebrow">Model checkpoints</div>
            <h2 id="model-checkpoints-title">Turn the diagrams into falsifiable simulator work.</h2>
            <p>The page translates the uploaded report into controls the simulation should expose instead of letting the article become a static claim.</p>
        </div>
        <div class="multi-messenger-check-grid">
            <article><h3>Separate delay buckets</h3><p>Render observed delay as source delay + environment delay + candidate propagation delay. Do not hide the decomposition.</p></article>
            <article><h3>Path-density coefficient</h3><p>Allow electromagnetic attenuation to vary with line-of-sight density instead of assuming one universal slowing constant.</p></article>
            <article><h3>Energy ledger</h3><p>When tired-light energy degeneration is enabled, show where the photon energy is assumed to go.</p></article>
            <article><h3>Causality guardrail</h3><p>Positive electromagnetic lag does not automatically violate causality; the simulator should explain that distinction explicitly.</p></article>
            <article><h3>Lensing test</h3><p>Future lensed multi-messenger events should be treated as a major pass/fail branch for differential GW versus EM delays.</p></article>
            <article><h3>Counterpart uncertainty</h3><p>Debated electromagnetic counterparts must be labeled as debated, not silently treated as confirmed calibration points.</p></article>
        </div>
    </section>

    <section id="simulation-path" class="multi-messenger-section wrap" aria-labelledby="simulation-path-title">
        <div class="multi-messenger-simulation-panel">
            <div>
                <div class="eyebrow">Click deeper</div>
                <h2 id="simulation-path-title">Where this page connects to the rest of ArcSecs.</h2>
                <p>Use this page as the timing bridge between the cosmology comparison, anomalies tracker, source library, and simulation pages.</p>
            </div>
            <div class="multi-messenger-link-grid">
                <a href="<?php echo esc_url( $comparison_url ); ?>#redshift"><strong>Compare redshift models</strong><span>Metric expansion versus tired-light and dispersion tests.</span></a>
                <a href="<?php echo esc_url( $anomalies_url ); ?>#tired-light-redshift-duality"><strong>Track redshift anomalies</strong><span>Read the anomaly card that keeps tired-light constraints visible.</span></a>
                <a href="<?php echo esc_url( $demo_url ); ?>"><strong>Run the Physics Demo</strong><span>Turn timing assumptions into controls, telemetry, and warnings.</span></a>
                <a href="<?php echo esc_url( $drive_url ); ?>"><strong>Open DM Drive</strong><span>Explore the propulsion sandbox that uses the same evidence-ledger discipline.</span></a>
                <a href="<?php echo esc_url( $library_url ); ?>#source-multi-messenger-timing"><strong>Open source map</strong><span>Review the sources and limitations behind the timing discussion.</span></a>
            </div>
        </div>
    </section>

    <?php arcsecs_render_evidence_sources_component( 'multi-messenger', array( 'multi-messenger-timing', 'tired-light-constraints', 'proca-photon-bounds', 'dark-matter-propulsion' ) ); ?>
</article>
