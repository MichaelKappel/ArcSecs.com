<?php
/**
 * Virtual page template for Standard Cosmology vs. ArcSecs.
 *
 * @package ArcSecs
 */
$demo_url       = arcsecs_ai_access_url( 'arcsecs-physics-engine-demo/' );
$drive_url      = arcsecs_dark_matter_drive_simulator_url();
$hub_url        = arcsecs_ai_access_url( 'arcsecs-research-hub/' );
$comparison_url = arcsecs_ai_access_url( 'standard-cosmology-vs-arcsecs/' );
$multi_messenger_url = arcsecs_ai_access_url( 'multi-messenger-light-delay/' );
$typescript_sources = function_exists( 'arcsecs_get_typescript_source_contracts' ) ? arcsecs_get_typescript_source_contracts() : array();
?>
<article class="cosmology-comparison-page" aria-labelledby="cosmology-comparison-title">
    <section class="cosmology-hero" aria-label="Standard Cosmology vs ArcSecs introduction">
        <div class="cosmology-hero__background" aria-hidden="true">
            <img src="<?php echo esc_url( arcsecs_cosmology_comparison_image_url() ); ?>" alt="" loading="eager" decoding="async">
        </div>
        <div class="wrap cosmology-hero__grid">
            <div class="cosmology-hero__content">
                <div class="eyebrow">Cosmology comparison</div>
                <h1 id="cosmology-comparison-title">Standard Cosmology vs. the ArcSecs Speculative Framework</h1>
                <p class="cosmology-hero__subtitle">A side-by-side exploration of expanding spacetime, tired light, massive photons, slow-light dark matter, and computational cosmology.</p>
                <p class="cosmology-disclaimer"><strong>Scientific boundary:</strong> ΛCDM is the current mainstream scientific model. ArcSecs is a speculative computational framework intended for exploration, simulation, and debate.</p>
                <div class="cosmology-hero__actions" aria-label="Primary actions">
                    <a class="arcsecs-button" href="#comparison-matrix">Compare the models</a>
                    <a class="arcsecs-button ghost" href="<?php echo esc_url( $hub_url ); ?>">Start Here</a>
                    <a class="arcsecs-button ghost" href="<?php echo esc_url( $demo_url ); ?>">Open Physics Engine Demo</a>
                    <a class="arcsecs-button ghost" href="<?php echo esc_url( $drive_url ); ?>">Dark Matter Drive Simulator</a>
                </div>
            </div>
            <aside class="cosmology-hero__instrument" aria-label="Page summary">
                <div class="cosmology-orbit" aria-hidden="true"></div>
                <dl>
                    <div><dt>Mainstream lane</dt><dd>ΛCDM, general relativity, metric expansion, cold dark matter halos.</dd></div>
                    <div><dt>ArcSecs lane</dt><dd>Static Euclidean relational model, Proca photon modes, tired-light experiments.</dd></div>
                    <div><dt>Testbed</dt><dd>TypeScript simulation architecture designed to expose contradictions.</dd></div>
                </dl>
            </aside>
        </div>
        <div class="wrap">
            <figure class="cosmology-hero-visual">
                <?php arcsecs_render_theme_picture( 'assets/images/standard-cosmology-vs-arcsecs-comparison.png', 'Detailed infographic comparing Standard Cosmology and ArcSecs, including expanding spacetime, massless photons, dark matter halos, Big Bang timeline, Proca massive photons, tired light condensate, Hubble tension, JWST mature early galaxies, SPARC rotation curves, and a core contrasts table.', array( 'width' => '1916', 'height' => '821', 'loading' => 'eager', 'fetchpriority' => 'high' ) ); ?>
                <figcaption>A high-level visual map of the two frameworks, the pressure points between them, and the kinds of simulation contrasts ArcSecs is trying to make explicit.</figcaption>
            </figure>
            <div class="cosmology-highlight-grid" aria-label="Key comparison highlights">
                <article class="cosmology-highlight-card">
                    <span>Framework split</span>
                    <h2>Geometry versus medium.</h2>
                    <p>ΛCDM leans on spacetime geometry and metric expansion. ArcSecs shifts the vocabulary toward relational structure, media, and explicit force or propagation proxies.</p>
                </article>
                <article class="cosmology-highlight-card">
                    <span>Redshift pressure</span>
                    <h2>One observation, competing causes.</h2>
                    <p>The page now foregrounds the redshift split more clearly: expansion in the mainstream lane versus tired light, Proca dispersion, and redshift duality experiments in ArcSecs.</p>
                </article>
                <article class="cosmology-highlight-card">
                    <span>Dark sector question</span>
                    <h2>Particles or condensate?</h2>
                    <p>The dark matter section is easier to scan when visitors can see the core contrast first: particle halos in the mainstream model versus a speculative slow-light condensate substrate.</p>
                </article>
                <article class="cosmology-highlight-card">
                    <span>Visitor workflow</span>
                    <h2>Read, compare, then test.</h2>
                    <p>This page works best as a companion to the demo: scan the visual, read the matrix, inspect the ledger, and then move into the simulation with failure conditions already in mind.</p>
                </article>
            </div>
        </div>
    </section>

    <nav class="cosmology-mini-nav" aria-label="Cosmology comparison sections">
        <div class="wrap cosmology-mini-nav__inner">
            <a href="#cosmology-reader-path">Start</a>
            <a href="#comparison-matrix">Matrix</a>
            <a href="#ontology">Space</a>
            <a href="#redshift">Redshift</a>
            <a href="#observation-checkpoints">Checkpoints</a>
            <a href="#prediction-ledger">Ledger</a>
            <a href="#dark-matter">Dark matter</a>
            <a href="#propulsion-shielding">Propulsion</a>
            <a href="#architecture">Architecture</a>
            <a href="#glossary">Glossary</a>
            <a href="#evidence-sources-cosmology">Sources</a>
            <a href="#demo-companion">Demo</a>
        </div>
    </nav>


    <section id="cosmology-reader-path" class="cosmology-section wrap cosmology-reader-path" aria-labelledby="cosmology-reader-path-title">
        <div class="cosmology-section__heading">
            <div class="eyebrow">Reader path</div>
            <h2 id="cosmology-reader-path-title">Scan the contrast first. Then decide where to go deeper.</h2>
            <p>This page is intentionally dense, so the first pass should not be a wall of theory. Use the guide below to move from overview, to comparison, to failure tests, to simulation.</p>
        </div>
        <div class="cosmology-readability-grid" aria-label="Suggested reading path for the cosmology comparison page">
            <article class="cosmology-readability-card">
                <span>01</span>
                <h3>Start with the boundary</h3>
                <p>Keep the science label clear: ΛCDM is the mainstream baseline; ArcSecs is a speculative simulation framework.</p>
                <a href="#comparison-matrix">Open the comparison matrix →</a>
            </article>
            <article class="cosmology-readability-card">
                <span>02</span>
                <h3>Pick the disputed mechanism</h3>
                <p>Choose the section that matters: spacetime ontology, redshift, dark matter, propulsion, or TypeScript architecture.</p>
                <a href="#redshift">Jump to redshift →</a>
            </article>
            <article class="cosmology-readability-card">
                <span>03</span>
                <h3>Use the ledger, not vibes</h3>
                <p>The prediction ledger turns big claims into explicit observational obligations and failure conditions.</p>
                <a href="#prediction-ledger">Inspect the ledger →</a>
            </article>
            <article class="cosmology-readability-card">
                <span>04</span>
                <h3>Click through to a test</h3>
                <p>After reading the contrast, move into the demo or Dark Matter Drive simulator with the failure state in mind.</p>
                <a href="#demo-companion">Open the demo companion →</a>
            </article>
        </div>
        <div class="cosmology-deeper-links" aria-label="Deeper reading links">
            <a href="#ontology">Space ontology</a>
            <a href="#observation-checkpoints">Observation checkpoints</a>
            <a href="#dark-matter">Dark matter</a>
            <a href="#propulsion-shielding">Propulsion and shielding</a>
            <a href="#architecture">TypeScript source</a>
        </div>
    </section>

    <section id="comparison-matrix" class="cosmology-section wrap" aria-labelledby="comparison-matrix-title">
        <div class="cosmology-section__heading">
            <div class="eyebrow">Quick comparison matrix</div>
            <h2 id="comparison-matrix-title">One question, two different physical languages.</h2>
            <p>The table below keeps the distinction explicit: the left lane summarizes the mainstream model; the right lane explains what ArcSecs wants users to test as a speculative simulation hypothesis.</p>
        </div>
        <div class="cosmology-matrix-wrap" tabindex="0" aria-label="Scrollable comparison matrix">
            <table class="cosmology-matrix">
                <caption>Standard ΛCDM cosmology compared with the ArcSecs speculative framework.</caption>
                <thead>
                    <tr>
                        <th scope="col">Topic</th>
                        <th scope="col">Standard ΛCDM Model</th>
                        <th scope="col">ArcSecs Speculative Framework</th>
                        <th scope="col">What the Demo Should Let Users Explore</th>
                    </tr>
                </thead>
                <tbody>
                    <tr><th scope="row">Geometry of space</th><td>Four-dimensional pseudo-Riemannian spacetime with dynamic metric geometry.</td><td>Static Euclidean relational arena; space is not treated as a physical fabric.</td><td>Switch between geometry-driven language and force / medium interaction language.</td></tr>
                    <tr><th scope="row">Vacuum</th><td>Classical vacuum can be modeled as empty geometry, with quantum fields still present.</td><td>No true empty vacuum; the universe is filled by attenuated mass-energy media.</td><td>Adjust background substrate density and observe propagation, drag, and lensing proxies.</td></tr>
                    <tr><th scope="row">Inertia</th><td>Local property of massive bodies in relativistic dynamics.</td><td>Mach-style relational interaction with the mass-energy distribution of the universe.</td><td>Inspect relational inertia links and conservation ledgers.</td></tr>
                    <tr><th scope="row">Gravity</th><td>Curvature of spacetime governed by Einstein field equations.</td><td>Force and momentum exchange through relational media and Weber-like concepts.</td><td>Compare curvature-inspired baselines with flat-space force proxies.</td></tr>
                    <tr><th scope="row">Light speed</th><td>The vacuum speed of light is invariant in local Lorentz frames.</td><td>Simulation modes may vary effective light speed or group velocity.</td><td>Toggle variable-speed modes and measure downstream contradictions.</td></tr>
                    <tr><th scope="row">Photon mass</th><td>Photon rest mass is treated as zero in Maxwellian electrodynamics.</td><td>Massive-photon / Proca modes are explored as speculative alternatives.</td><td>Move photon mass from zero to non-zero and watch dispersion effects.</td></tr>
                    <tr><th scope="row">Redshift</th><td>Cosmological redshift comes from metric expansion and scale factor growth.</td><td>Tired-light energy loss, Proca dispersion, and covarying constants are tested.</td><td>Compare metric redshift, tired-light decay, brightness dimming, and time dilation.</td></tr>
                    <tr><th scope="row">Dark matter</th><td>Cold, mostly collisionless dark matter halos; candidates include WIMPs, axions, sterile neutrinos, and primordial black holes.</td><td>Slow-light condensate / degraded photon substrate inspired by EIT and dark-state polaritons.</td><td>Compare halo behavior with condensate density and slow-light gravitational effects.</td></tr>
                    <tr><th scope="row">Time dilation</th><td>Relativistic time dilation is a tested consequence of special and general relativity.</td><td>ArcSecs asks whether some observational stretch can be modeled through dispersive light transport.</td><td>Test whether supernova light-curve stretching can be reproduced without hiding failures.</td></tr>
                    <tr><th scope="row">Gravitational lensing</th><td>Light follows null geodesics through curved spacetime.</td><td>Light deflection is framed through massive photons, corpuscular proxies, and medium interactions.</td><td>Compare lensing predictions under different photon and substrate assumptions.</td></tr>
                    <tr><th scope="row">Black holes</th><td>Event horizons arise from spacetime geometry and causal structure.</td><td>ArcSecs models extreme mass capture as light and matter failing to escape deep gravitational wells.</td><td>Inspect escape thresholds and photon-mass capture assumptions.</td></tr>
                    <tr><th scope="row">Propulsion</th><td>Alcubierre-style speculation moves the metric but faces exotic-energy and stability barriers.</td><td>Dark-matter ramjet concept harvests and pushes against a slow-light medium.</td><td>Run scoop-field, reactor-feed, drag, thrust, and thermal-balance scenarios.</td></tr>
                    <tr><th scope="row">Shielding</th><td>Relativistic ships need protection from dust, gas, photons, and radiation hazards.</td><td>HIBE shielding imagines ablative capture and re-ingestion into reactor feedstock.</td><td>Track energy deposition, shield ablation, capture efficiency, and waste heat.</td></tr>
                    <tr><th scope="row">Simulation architecture</th><td>Cosmology is usually tested through observations, numerical relativity, and large-scale structure simulations.</td><td>ArcSecs treats software architecture as the argument: contradictions should surface in telemetry and tests.</td><td>Run typed modules, conservation checks, and no-silent-contradiction diagnostics.</td></tr>
                </tbody>
            </table>
        </div>
    </section>

    <section id="ontology" class="cosmology-section wrap" aria-labelledby="ontology-title">
        <div class="cosmology-section__heading">
            <div class="eyebrow">Ontology of space</div>
            <h2 id="ontology-title">Spacetime fabric or relational emptiness?</h2>
            <p>This is the deepest split. Standard physics uses spacetime as the mathematical stage and gravitational actor. ArcSecs asks what changes if the “stage” is not a physical object at all.</p>
        </div>
        <div class="cosmology-lanes" aria-label="Standard and ArcSecs ontology lanes">
            <article class="cosmology-lane cosmology-lane--standard">
                <span class="cosmology-badge">Mainstream interpretation</span>
                <h3>Standard: matter curves spacetime → curved paths</h3>
                <p>General relativity models gravity through the curvature of a pseudo-Riemannian spacetime manifold. Matter and energy contribute stress-energy; the metric determines how bodies and light move.</p>
                <ul>
                    <li>Gravity is not a Newtonian pull in the deepest formulation.</li>
                    <li>Light follows null geodesics through curved geometry.</li>
                    <li>Local physics preserves the invariant vacuum speed of light.</li>
                </ul>
            </article>
            <article class="cosmology-lane cosmology-lane--arcsecs">
                <span class="cosmology-badge">Speculative ArcSecs model</span>
                <h3>ArcSecs: matter and radiation exchange force and momentum</h3>
                <p>ArcSecs rejects a physical spacetime fabric and treats space as static Euclidean relational emptiness filled with mass-energy media. Inertia is framed through Mach-style relational interactions and Weber-like force concepts.</p>
                <ul>
                    <li>Space is not bent, stretched, compressed, or warped.</li>
                    <li>Motion is interpreted as interaction with a dense relational substrate.</li>
                    <li>The demo should make every conservation cost visible.</li>
                </ul>
            </article>
        </div>
        <div class="cosmology-concept-split" aria-label="Concept split visualization">
            <div><strong>Standard chain</strong><span>Matter</span><em>curves</em><span>spacetime</span><em>guides</em><span>paths</span></div>
            <div><strong>ArcSecs chain</strong><span>Matter + radiation</span><em>interact through</em><span>relational substrate</span><em>exchange</em><span>momentum</span></div>
        </div>
    </section>

    <section id="redshift" class="cosmology-section wrap" aria-labelledby="redshift-title">
        <div class="cosmology-section__heading">
            <div class="eyebrow">Cosmological redshift</div>
            <h2 id="redshift-title">Metric expansion vs. tired-light stress tests.</h2>
            <p>Redshift is where the page must be honest. ΛCDM has strong observational support. Tired-light models have historically faced serious problems. ArcSecs should make those problems visible and testable instead of hiding them.</p>
        </div>
        <div class="cosmology-card-grid cosmology-card-grid--three">
            <article class="cosmology-card">
                <h3>Standard expansion redshift</h3>
                <p>In mainstream cosmology, distant light is redshifted because the scale factor changes while photons travel across the expanding universe. Type Ia supernova light-curve dilation and Tolman surface-brightness expectations are central tests.</p>
            </article>
            <article class="cosmology-card">
                <h3>ArcSecs tired-light revival</h3>
                <p>ArcSecs explores energy loss across cosmological distance, massive-photon / Proca dispersion, frequency-dependent group velocity, and variable-light-speed modes as simulation assumptions rather than settled facts.</p>
            </article>
            <article class="cosmology-card cosmology-card--warning">
                <h3>The burden of proof</h3>
                <p>The simulation should show whether an alternative can reproduce redshift without blurring images, breaking supernova timing, violating surface-brightness behavior, or silently moving contradictions into constants.</p>
            </article>
        </div>
        <div class="cosmology-scan-summary" aria-label="Redshift section scan summary">
            <strong>Quick read:</strong> mainstream cosmology treats redshift as expansion of space; ArcSecs tests whether energy-loss, Proca dispersion, and variable-constant modes can reproduce the same observations without hiding their failures.
        </div>
        <div class="cosmology-callout">
            <strong>Related timing page:</strong> open <a href="<?php echo esc_url( $multi_messenger_url ); ?>">Multi-Messenger Light Delay</a> to compare gravitational-wave baselines with electromagnetic counterpart delays, source-delay caveats, and tired-light energy-accounting tests.
        </div>
        <details class="cosmology-detail">
            <summary>What users should be able to test in the demo</summary>
            <p>Users should compare metric redshift against tired-light decay, adjust decay strength, toggle photon mass, toggle variable speed of light, inspect brightness dimming, and run a supernova time-dilation challenge that reports failure clearly when parameters cannot match observations.</p>
        </details>
    </section>


    <section id="observation-checkpoints" class="cosmology-section wrap" aria-labelledby="observation-checkpoints-title">
        <div class="cosmology-section__heading">
            <div class="eyebrow">Observation checkpoints</div>
            <h2 id="observation-checkpoints-title">The comparison only matters if the hard tests stay visible.</h2>
            <p>This page should not let either lane win by rhetoric. The demo companion should turn major observational constraints into explicit checkpoints with status labels, telemetry, and failure notes.</p>
        </div>
        <div class="cosmology-checkpoint-grid" aria-label="Cosmology observation checkpoint cards">
            <article class="cosmology-checkpoint-card">
                <span class="cosmology-status cosmology-status--standard">Mainstream strength</span>
                <h3>CMB and large-scale structure</h3>
                <p>ΛCDM is strong because it connects the cosmic microwave background, baryon acoustic oscillation patterns, galaxy clustering, and gravitational growth into one quantitative framework.</p>
            </article>
            <article class="cosmology-checkpoint-card">
                <span class="cosmology-status cosmology-status--pressure">Alternative pressure point</span>
                <h3>Supernova time dilation</h3>
                <p>A tired-light mode must report whether dispersive transport can reproduce light-curve stretching without breaking color, brightness, arrival-time, or image-sharpness expectations.</p>
            </article>
            <article class="cosmology-checkpoint-card">
                <span class="cosmology-status cosmology-status--pressure">Alternative pressure point</span>
                <h3>Tolman-style dimming</h3>
                <p>The page keeps surface-brightness behavior visible because static models have historically struggled here. ArcSecs should show pass, tension, failed, or not implemented rather than hide the result.</p>
            </article>
            <article class="cosmology-checkpoint-card">
                <span class="cosmology-status cosmology-status--simulation">Simulation contract</span>
                <h3>Conservation and units ledger</h3>
                <p>Any variable-constant, photon-mass, or condensate scenario should display what changed, what stayed invariant, where energy went, and which assumptions were deliberately relaxed.</p>
            </article>
        </div>
        <div class="cosmology-callout">
            <strong>Better visitor experience:</strong> add the same checkpoint names to the Physics Engine Demo so readers can move from article explanation to concrete telemetry without having to decode the entire theory first.
        </div>
    </section>

    <section id="prediction-ledger" class="cosmology-section wrap" aria-labelledby="prediction-ledger-title">
        <div class="cosmology-section__heading">
            <div class="eyebrow">Prediction pressure ledger</div>
            <h2 id="prediction-ledger-title">Every bold idea needs a place where it can fail.</h2>
            <p>The ledger turns the page from a persuasive article into a test contract. It lists the observational and engineering pressure points that the demo should keep visible when visitors compare mainstream assumptions against ArcSecs simulation modes.</p>
        </div>
        <div class="cosmology-ledger-wrap" tabindex="0" aria-label="Scrollable prediction pressure ledger">
            <table class="cosmology-ledger">
                <caption>Observational and computational tests that the comparison page and demo should keep visible.</caption>
                <thead>
                    <tr>
                        <th scope="col">Pressure point</th>
                        <th scope="col">Mainstream expectation</th>
                        <th scope="col">ArcSecs simulation obligation</th>
                        <th scope="col">Honest status language</th>
                    </tr>
                </thead>
                <tbody>
                    <tr><th scope="row">CMB acoustic structure</th><td>ΛCDM connects the cosmic microwave background, baryon content, dark matter density, and early-universe plasma physics.</td><td>Static or tired-light modes must state what replaces the hot early-universe explanation instead of skipping the constraint.</td><td><span class="cosmology-status cosmology-status--pressure">Must confront</span></td></tr>
                    <tr><th scope="row">Baryon acoustic oscillations</th><td>Expansion history and the sound horizon provide a standard-ruler interpretation for large-scale structure.</td><td>ArcSecs needs a non-expansion mechanism that reproduces the clustering scale and its redshift behavior.</td><td><span class="cosmology-status cosmology-status--pressure">Open challenge</span></td></tr>
                    <tr><th scope="row">Type Ia supernova stretch</th><td>Observed light curves are expected to stretch by a redshift-linked factor in the expanding-universe picture.</td><td>Proca dispersion and tired-light modes must reproduce timing without breaking color, brightness, or image sharpness.</td><td><span class="cosmology-status cosmology-status--simulation">Guided test</span></td></tr>
                    <tr><th scope="row">Tolman surface brightness</th><td>Expansion predicts a strong redshift-dependent dimming law that static models have struggled to match.</td><td>The demo should show the dimming curve, any compensating constants, and when the alternative is outside tolerance.</td><td><span class="cosmology-status cosmology-status--simulation">Telemetry required</span></td></tr>
                    <tr><th scope="row">Photon mass limits</th><td>Maxwellian electrodynamics treats photon rest mass as zero; experiments place very tight limits on any non-zero value.</td><td>Any Proca photon slider must expose the chosen mass scale and flag when a setting is only a thought experiment.</td><td><span class="cosmology-status cosmology-status--neutral">Guardrail</span></td></tr>
                    <tr><th scope="row">Galaxy rotation and lensing</th><td>Cold dark matter halos are used to model rotation curves, lensing maps, and cluster-scale gravitational behavior.</td><td>A slow-light condensate mode must produce halo-like gravity and clearly report where it diverges from lensing observations.</td><td><span class="cosmology-status cosmology-status--pressure">High bar</span></td></tr>
                    <tr><th scope="row">Energy accounting</th><td>Mainstream relativity has local conservation rules and carefully defined stress-energy bookkeeping.</td><td>Tired light must state where photon energy goes, how heat or substrate states change, and whether total accounting closes.</td><td><span class="cosmology-status cosmology-status--simulation">Ledger first</span></td></tr>
                    <tr><th scope="row">Software consistency</th><td>Mainstream baselines can be represented as control modes and comparison curves.</td><td>ArcSecs modes should never let constants, units, conservation checks, or scenario labels contradict each other silently.</td><td><span class="cosmology-status cosmology-status--standard">Source contract</span></td></tr>
                </tbody>
            </table>
        </div>
        <div class="cosmology-callout">
            <strong>Implementation rule:</strong> every future demo control that changes photon mass, light speed, decay strength, condensate density, or ramjet capture efficiency should update this style of ledger with pass, tension, failed, or exploratory labels.
        </div>
    </section>
    <section id="dark-matter" class="cosmology-section wrap" aria-labelledby="dark-matter-title">
        <div class="cosmology-section__heading">
            <div class="eyebrow">Dark matter comparison</div>
            <h2 id="dark-matter-title">Particles, halos, or a slow-light condensate?</h2>
            <p>Mainstream cosmology uses cold dark matter as gravitational scaffolding for structure formation. ArcSecs asks whether degraded or slowed electromagnetic energy could become optically inactive while remaining gravitationally relevant. The related <a href="<?php echo esc_url( $drive_url ); ?>">Dark Matter Drive Simulator</a> applies this speculative substrate idea to field capture, massive photon lensing, energy-ledger, and thermal-stress experiments.</p>
        </div>
        <div class="cosmology-lanes">
            <article class="cosmology-lane cosmology-lane--standard">
                <span class="cosmology-badge">Mainstream candidates</span>
                <h3>Cold dark matter halos</h3>
                <p>Standard dark matter is modeled as mostly collisionless, non-baryonic mass that interacts gravitationally. Candidate families include WIMPs, axions, sterile neutrinos, and primordial black holes.</p>
            </article>
            <article class="cosmology-lane cosmology-lane--arcsecs">
                <span class="cosmology-badge">Speculative alternative</span>
                <h3>Slow-light condensate substrate</h3>
                <p>ArcSecs speculates that tired light may decay into slow-light states: degraded photons that become optically inactive but gravitationally relevant. Dark-state polaritons, EIT, stationary light pulses, and Bose-Einstein-condensate analogies are inspiration, not proof.</p>
            </article>
        </div>
        <div class="cosmology-callout">
            <strong>Boundary line:</strong> this page must not claim the slow-light condensate exists. It frames the idea as an exploratory model that should survive only if the demo can expose its assumptions, predictions, and failure modes.
        </div>
    </section>

    <section id="propulsion-shielding" class="cosmology-section wrap" aria-labelledby="propulsion-title">
        <div class="cosmology-section__heading">
            <div class="eyebrow">Propulsion and shielding</div>
            <h2 id="propulsion-title">Move the geometry, or harvest and push against the medium?</h2>
            <p>The propulsion comparison follows directly from the ontology. If spacetime is physical, a warp metric is imaginable. If space is not physical fabric, ArcSecs needs a medium-based propulsion story.</p>
            <p class="cosmology-inline-cta"><a href="<?php echo esc_url( $drive_url ); ?>">Open the Dark Matter Drive Simulator</a> to test ramjet capture, HIBE shielding, thermal bottlenecks, tired-light energy accounting, field capture, and replayable propulsion scenarios in the plugin-provided sandbox.</p>
        </div>
        <div class="cosmology-propulsion-cards">
            <article class="cosmology-propulsion-card cosmology-propulsion-card--standard">
                <span>Standard speculative FTL</span>
                <h3>Move the geometry.</h3>
                <p>Alcubierre-style concepts reshape the metric into a warp bubble, but they face negative energy, exotic matter, horizon instability, and radiation problems.</p>
            </article>
            <article class="cosmology-propulsion-card cosmology-propulsion-card--arcsecs">
                <span>ArcSecs speculative propulsion</span>
                <h3>Harvest and push against the medium.</h3>
                <p>The dark-matter ramjet concept imagines an EIT scoop field, stationary-light capture, slow-light substrate harvesting, reactor feedstock, and directed exhaust.</p>
            </article>
        </div>
        <div class="cosmology-card-grid cosmology-card-grid--three">
            <article class="cosmology-card"><h3>EIT scoop field</h3><p>A speculative collection region that slows and captures substrate energy for analysis in the simulation.</p></article>
            <article class="cosmology-card"><h3>HIBE shield</h3><p>A high-intensity boundary concept for relativistic protection, ablation capture, and re-ingestion into reactor feedstock.</p></article>
            <article class="cosmology-card"><h3>Thermal honesty</h3><p>Every scoop, shield, reactor, and exhaust claim should show heat, drag, and conservation costs.</p></article>
        </div>
    </section>

    <section id="architecture" class="cosmology-section wrap" aria-labelledby="architecture-title">
        <div class="cosmology-section__heading">
            <div class="eyebrow">Computational architecture</div>
            <h2 id="architecture-title">The TypeScript engine is part of the scientific argument.</h2>
            <p>If assumptions contradict each other, the simulation should reveal it through telemetry, tests, and conservation ledgers. Good software structure is not decoration here; it is how the thought experiment stays honest.</p>
        </div>
        <div class="cosmology-architecture-grid">
            <article class="cosmology-code-card"><code>ConstantsManager.ts</code><span>Coordinates invariant, variable, and covarying constants across scenario modes.</span></article>
            <article class="cosmology-code-card"><code>CorePhysicsEngine.ts</code><span>Runs deterministic simulation steps, entity updates, and comparison baselines.</span></article>
            <article class="cosmology-code-card"><code>Proca photon model</code><span>Tests non-zero photon mass and frequency-dependent group velocity as explicit assumptions.</span></article>
            <article class="cosmology-code-card"><code>Tired-light model</code><span>Reports energy decay, dimming, time-stretch attempts, and observational pressure points.</span></article>
            <article class="cosmology-code-card"><code>Relational inertia model</code><span>Tracks links, forces, and momentum exchange instead of hiding them in language.</span></article>
            <article class="cosmology-code-card"><code>Dark matter condensate model</code><span>Explores slow-light density, optically inactive states, and gravity-relevant behavior.</span></article>
            <article class="cosmology-code-card"><code>UI telemetry renderer</code><span>Turns physics assumptions into visible gauges, charts, warnings, and ledgers.</span></article>
            <article class="cosmology-code-card"><code>Jest test coverage</code><span>Checks conservation laws, route stability, scenario toggles, and no silent contradictions.</span></article>
        </div>
        <div class="cosmology-scan-summary" aria-label="Architecture section scan summary">
            <strong>Quick read:</strong> the TypeScript files below are part of the claim. They expose the assumptions, telemetry hooks, and conservation checks that should prevent silent contradictions.
        </div>

        <details class="cosmology-detail cosmology-typescript-detail" open>
            <summary>No silent physics contradictions — provided TypeScript source contracts</summary>
            <p>The engine should not let a scenario keep a pretty graph while violating its own constants, conservation rules, unit contracts, or observational checkpoints. The package includes actual TypeScript source files under <code>assets/ts/arcsecs-physics-engine/</code>. The browser below is generated from that folder at render time, so adding a source contract file to the folder automatically makes it visible here.</p>
            <?php if ( ! empty( $typescript_sources ) ) : ?>
                <div class="cosmology-typescript-browser" data-typescript-source-browser aria-label="Dynamically loaded TypeScript source browser">
                    <p class="cosmology-typescript-browser__note"><strong>Click a file name to view its bundled source.</strong> Files shown here are read dynamically from <code>assets/ts/arcsecs-physics-engine/</code>.</p>
                    <div class="cosmology-typescript-toolbar" aria-label="TypeScript source browser controls">
                        <label>
                            <span>Filter source files</span>
                            <input type="search" data-typescript-source-filter placeholder="Search filename, path, or code..." autocomplete="off">
                        </label>
                        <button type="button" data-typescript-source-copy>Copy selected source</button>
                        <p data-typescript-source-status aria-live="polite">Source browser ready.</p>
                    </div>
                    <div class="cosmology-typescript-files" aria-label="Provided TypeScript source files">
                        <?php foreach ( $typescript_sources as $source_index => $source_file ) : ?>
                            <?php
                            $source_is_open = isset( $source_file['name'] ) && $source_file['name'] === 'CorePhysicsEngine.ts';
                            $source_search  = strtolower( (string) $source_file['name'] . ' ' . (string) $source_file['path'] . ' ' . (string) $source_file['contents'] );
                            ?>
                            <details class="cosmology-typescript-source" data-typescript-source-panel data-source-name="<?php echo esc_attr( (string) $source_file['name'] ); ?>" data-source-search="<?php echo esc_attr( $source_search ); ?>"<?php echo $source_is_open ? ' open' : ''; ?>>
                                <summary>
                                    <span><?php echo esc_html( (string) $source_file['name'] ); ?></span>
                                    <small><?php echo esc_html( (string) $source_file['path'] ); ?></small>
                                </summary>
                                <div class="cosmology-typescript-source__meta">
                                    <span><?php echo esc_html( strtoupper( (string) $source_file['extension'] ) ); ?></span>
                                    <span><?php echo esc_html( size_format( (int) $source_file['size'] ) ); ?></span>
                                    <span><?php echo esc_html( (string) $source_file['lines'] ); ?> lines</span>
                                    <span>Loaded from theme source folder</span>
                                </div>
                                <pre class="cosmology-code-sample cosmology-source-code"><code><?php echo esc_html( (string) $source_file['contents'] ); ?></code></pre>
                            </details>
                        <?php endforeach; ?>
                    </div>
                </div>
            <?php else : ?>
                <p class="cosmology-typescript-browser__note"><strong>Source browser unavailable:</strong> no readable files were found in <code>assets/ts/arcsecs-physics-engine/</code>.</p>
            <?php endif; ?>
        </details>
    </section>


    <section id="glossary" class="cosmology-section wrap" aria-labelledby="glossary-title">
        <div class="cosmology-section__heading">
            <div class="eyebrow">Translation glossary</div>
            <h2 id="glossary-title">Terms readers should not have to decode alone.</h2>
            <p>This glossary keeps the page readable for curious visitors while still using precise language for physics-minded readers and AI summarizers.</p>
        </div>
        <div class="cosmology-glossary-grid">
            <article class="cosmology-glossary-card"><h3>ΛCDM</h3><p>The mainstream Lambda Cold Dark Matter model: general relativity, expanding spacetime, ordinary matter, cold dark matter, and dark energy.</p></article>
            <article class="cosmology-glossary-card"><h3>Proca electrodynamics</h3><p>A massive-photon extension of electromagnetic equations used here only as a speculative simulation branch.</p></article>
            <article class="cosmology-glossary-card"><h3>Tired light</h3><p>A family of static-universe ideas where photons lose energy over distance. Historically, these models face major observational problems.</p></article>
            <article class="cosmology-glossary-card"><h3>Tolman surface brightness</h3><p>A cosmological dimming test that asks whether distant objects fade with the pattern expected from an expanding universe.</p></article>
            <article class="cosmology-glossary-card"><h3>Type Ia supernova stretch</h3><p>The observed broadening of distant supernova light curves, commonly treated as strong evidence for cosmological time dilation.</p></article>
            <article class="cosmology-glossary-card"><h3>EIT and dark-state polaritons</h3><p>Electromagnetically induced transparency and coupled light-matter states that inspire the ArcSecs slow-light analogy, not proof of cosmic dark matter.</p></article>
            <article class="cosmology-glossary-card"><h3>HIBE shield</h3><p>An ArcSecs shielding concept for relativistic hazards, ablation capture, and possible re-ingestion into reactor feedstock.</p></article>
            <article class="cosmology-glossary-card"><h3>No silent contradictions</h3><p>A software rule: a simulation mode should expose violated assumptions, unit conflicts, missing energy sinks, and observational tension.</p></article>
        </div>
    </section>


    <?php arcsecs_render_evidence_sources_component( 'cosmology' ); ?>

    <section id="demo-companion" class="cosmology-section wrap" aria-labelledby="demo-companion-title">
        <div class="cosmology-demo-panel">
            <div>
                <div class="eyebrow">Interactive demo companion</div>
                <h2 id="demo-companion-title">Turn the article into guided experiments.</h2>
                <p>The comparison page should feed readers into the Physics Engine Demo with concrete experiments instead of leaving them with passive theory.</p>
                <ul class="cosmology-experiment-list">
                    <li>Toggle photon mass from zero to non-zero.</li>
                    <li>Compare metric redshift vs. tired-light redshift.</li>
                    <li>Adjust tired-light decay strength and brightness dimming.</li>
                    <li>Toggle variable speed of light modes.</li>
                    <li>Increase slow-light condensate density.</li>
                    <li>Observe how lensing changes under different assumptions.</li>
                    <li>Compare standard dark matter halo behavior with condensate behavior.</li>
                    <li>Test whether supernova time dilation can be reproduced.</li>
                    <li>Compare brightness dimming against Tolman-style expectations.</li>
                </ul>
                <div class="cosmology-protocol" aria-label="Suggested guided demo protocol">
                    <h3>Suggested five-minute protocol</h3>
                    <ol>
                        <li>Start with the mainstream baseline and note the checkpoint status labels.</li>
                        <li>Turn on exactly one ArcSecs assumption, such as photon mass or tired-light decay.</li>
                        <li>Watch redshift, brightness, timing, lensing, and energy ledgers together instead of one graph alone.</li>
                        <li>Record whether the scenario passes, creates tension, fails, or needs another explicit assumption.</li>
                    </ol>
                </div>
            </div>

<aside class="cosmology-demo-panel__cta">
    <div class="cosmology-demo-console" aria-label="Guided experiment console preview">
        <span class="cosmology-demo-console__status">Demo flow</span>
        <h3>Baseline → one toggle → ledger → failure state.</h3>
        <ol>
            <li><strong>Baseline:</strong> load the mainstream comparison mode.</li>
            <li><strong>Toggle:</strong> enable exactly one ArcSecs assumption.</li>
            <li><strong>Ledger:</strong> watch redshift, brightness, timing, lensing, and energy together.</li>
            <li><strong>Kill test:</strong> mark the run passed, tension, failed, or exploratory.</li>
        </ol>
    </div>
    <p class="cosmology-disclaimer"><strong>Use the demo as a testbed:</strong> speculative models become interesting only when their risks and failure modes are visible.</p>
    <a class="arcsecs-button" href="<?php echo esc_url( $demo_url ); ?>">Run the Physics Engine Demo</a>
    <a class="arcsecs-button ghost" href="<?php echo esc_url( $drive_url ); ?>">Open Dark Matter Drive Simulator</a>
    <a class="arcsecs-button ghost" href="<?php echo esc_url( $comparison_url ); ?>#comparison-matrix">Return to matrix</a>
</aside>
        </div>
    </section>

    <section class="cosmology-section wrap" aria-labelledby="faq-title">
        <div class="cosmology-section__heading">
            <div class="eyebrow">FAQ</div>
            <h2 id="faq-title">How to read this page without overreading it.</h2>
        </div>
        <div class="cosmology-faq-grid">
            <details class="cosmology-detail" open>
                <summary>Is ArcSecs presented as accepted physics?</summary>
                <p>No. ΛCDM is labeled as the current mainstream scientific model. ArcSecs is labeled as a speculative computational framework for exploration, simulation, and debate.</p>
            </details>
            <details class="cosmology-detail">
                <summary>Why compare tired light with expansion redshift?</summary>
                <p>Because the contrast is useful only when the observational pressure points are visible: Type Ia supernova time dilation, Tolman surface brightness, image sharpness, and conservation behavior.</p>
            </details>
            <details class="cosmology-detail">
                <summary>How does the Physics Engine Demo fit into the page?</summary>
                <p>The article gives readers the conceptual map; the demo should turn that map into toggles, telemetry, comparison baselines, and visible failure states.</p>
            </details>
            <details class="cosmology-detail">
                <summary>What is the prediction pressure ledger?</summary>
                <p>It is a source-level checklist for the hard tests: CMB structure, BAO, supernova stretch, Tolman dimming, photon mass limits, lensing, energy accounting, and software consistency.</p>
            </details>
            <details class="cosmology-detail">
                <summary>What would make the ArcSecs model stronger?</summary>
                <p>Sharper predictions, explicit failure states, reproducible telemetry, conservation-law checks, and direct comparison against the best mainstream explanations.</p>
            </details>
        </div>
    </section>
</article>
