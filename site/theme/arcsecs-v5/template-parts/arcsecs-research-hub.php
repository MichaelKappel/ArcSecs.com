<?php
/**
 * Virtual ArcSecs Research Hub / Start Here page.
 *
 * @package ArcSecs
 */

$home_url       = arcsecs_ai_access_url( '' );
$hub_url        = arcsecs_ai_access_url( 'arcsecs-research-hub/' );
$demo_url       = arcsecs_ai_access_url( 'arcsecs-physics-engine-demo/' );
$drive_url      = arcsecs_dark_matter_drive_simulator_url();
$comparison_url = arcsecs_ai_access_url( 'standard-cosmology-vs-arcsecs/' );
$anomalies_url  = arcsecs_ai_access_url( 'cosmic-anomalies-tracker/' );
$ai_summary_url = arcsecs_ai_access_url( 'arcsecs-physics-engine-demo/ai-summary/' );
$llms_url       = arcsecs_ai_access_url( 'llms.txt' );
$library_url    = arcsecs_ai_access_url( 'research-library/' );
$multi_messenger_url = arcsecs_ai_access_url( 'multi-messenger-light-delay/' );
$distance_time_url     = arcsecs_ai_access_url( 'arcsecs-distance-time-framework/' );
$sitemap_url    = arcsecs_ai_access_url( 'arcsecs-sitemap.xml' );

$path_cards = array(
    array(
        'title'   => 'New to ArcSecs?',
        'label'   => 'Start here',
        'summary' => 'Read the premise first: ArcSecs is a speculative research site using software, visual comparisons, and failure conditions to test bold cosmology ideas without pretending they are established science.',
        'url'     => $hub_url . '#new-to-arcsecs',
        'action'  => 'Understand the map',
    ),
    array(
        'title'   => 'Compare the Physics',
        'label'   => 'Framework contrast',
        'summary' => 'Jump into the side-by-side comparison of Lambda-CDM, spacetime, redshift, photon mass, dark matter, propulsion, shielding, and the TypeScript simulation architecture.',
        'url'     => $comparison_url,
        'action'  => 'Open comparison',
    ),
    array(
        'title'   => 'Track Cosmic Anomalies',
        'label'   => 'Observation pressure',
        'summary' => 'Review Hubble tension, JWST mature early galaxies, SPARC rotation curves, El Gordo, Lithium-7, Proca electrodynamics, and ArcSecs simulation hooks.',
        'url'     => $anomalies_url,
        'action'  => 'Open tracker',
    ),

    array(
        'title'   => 'Distance-Time Framework',
        'label'   => 'No lightyears / clockless progression',
        'summary' => 'Learn the ArcSecs attempt to calculate distance without lightyears and model universal progression without local atomic clocks before opening the interactive kernel and event theater.',
        'url'     => $distance_time_url,
        'action'  => 'Open framework',
    ),
    array(
        'title'   => 'Multi-Messenger Timing',
        'label'   => 'Gravity first / light later',
        'summary' => 'Review GW170817, GW150914, and GW190521 as timing cases that separate source delay, environment diffusion, and speculative light-slowing propagation tests.',
        'url'     => $multi_messenger_url,
        'action'  => 'Open timing page',
    ),
    array(
        'title'   => 'Run the Simulation',
        'label'   => 'Interactive testbed',
        'summary' => 'Use the Physics Engine Demo as the place where assumptions should become toggles, ledgers, warnings, conservation checks, and replayable scenarios.',
        'url'     => $demo_url,
        'action'  => 'Run demo',
    ),
    array(
        'title'   => 'Explore Propulsion Concepts',
        'label'   => 'Dark matter ramjet',
        'summary' => 'Follow the speculative thread from tired light and slow-light condensates into dark matter drive, EIT scoop fields, HIBE shielding, and thermal-bottleneck accounting.',
        'url'     => $comparison_url . '#propulsion-shielding',
        'action'  => 'Explore propulsion',
    ),
    array(
        'title'   => 'Dark Matter Drive Simulator',
        'label'   => 'Plugin sandbox',
        'summary' => 'Open the plugin-provided propulsion simulator for field capture, shielding, energy ledgers, thermal stress, deterministic replay, and speculative Dark Matter Drive experiments.',
        'url'     => $drive_url,
        'action'  => 'Open simulator',
    ),
    array(
        'title'   => 'Research Library',
        'label'   => 'Evidence and links',
        'summary' => 'Browse the grouped source map for Hubble tension, JWST galaxies, SPARC, El Gordo, Lithium-7, Proca photon bounds, tired-light constraints, and propulsion analogies.',
        'url'     => $library_url,
        'action'  => 'Open library',
    ),
    array(
        'title'   => 'For AI / Researchers',
        'label'   => 'Machine-readable handoff',
        'summary' => 'Use the AI summary, llms.txt, sitemap, published research records to recover scientific context.',
        'url'     => $ai_summary_url,
        'action'  => 'Open AI summary',
    ),
);
?>
<article class="research-hub-page" aria-labelledby="research-hub-title">
    <section class="research-hub-hero" id="top" aria-label="ArcSecs Research Hub introduction">
        <div class="wrap research-hub-hero__grid">
            <div class="research-hub-hero__copy">
                <div class="eyebrow">Start Here</div>
                <h1 id="research-hub-title">The ArcSecs Research Hub</h1>
                <p class="research-hub-hero__subtitle">A guided path through speculative cosmology, cosmic anomalies, simulation experiments, and AI-readable scientific publications.</p>
                <p>ArcSecs is easier to understand when the site has a deliberate path: first learn the premise, then compare the frameworks, inspect the anomalies, run the demo, and finally read the published research and datasets.</p>
                <p class="research-hub-disclaimer"><strong>Scientific boundary:</strong> ArcSecs is experimental and speculative. The hub separates mainstream cosmology, observational pressure points, and ArcSecs hypotheses so visitors can challenge the model instead of just absorbing it.</p>
                <div class="hero-actions research-hub-hero__actions">
                    <a class="arcsecs-button" href="#path-cards">Choose a path</a>
                    <a class="arcsecs-button ghost" href="<?php echo esc_url( $demo_url ); ?>">Run the Physics Engine Demo</a>
                    <a class="arcsecs-button ghost" href="<?php echo esc_url( $comparison_url ); ?>">Compare the Physics</a>
                </div>
            </div>
            <aside class="research-hub-hero__panel" aria-label="Research hub route summary">
                <span class="research-hub-orbit" aria-hidden="true"></span>
                <dl>
                    <div><dt>Primary flow</dt><dd>Hub → comparison → anomalies → demo.</dd></div>
                    <div><dt>Visitor promise</dt><dd>Clear routes, visible caveats, and no hidden speculation.</dd></div>
                    <div><dt>Research record</dt><dd>Public research materials are versioned; private operational memory is not distributed.</dd></div>
                    <div><dt>Core check</dt><dd>Every bold claim should point to an explanation, a simulation hook, or a failure condition.</dd></div>
                </dl>
            </aside>
        </div>
    </section>

    <nav class="research-hub-mini-nav" aria-label="Research hub sections">
        <div class="wrap research-hub-mini-nav__inner">
            <a href="#primary-path">Primary path</a>
            <a href="#path-cards">Paths</a>
            <a href="#new-to-arcsecs">New visitors</a>
            <a href="#route-map">Route map</a>
            <a href="<?php echo esc_url( $library_url ); ?>">Library</a>
            <a href="<?php echo esc_url( $distance_time_url ); ?>">Distance-Time</a>
            <a href="<?php echo esc_url( $multi_messenger_url ); ?>">Timing</a>
            <a href="#researcher-tools">AI / researchers</a>
            <a href="#evidence-sources-research-hub">Sources</a>
            <a href="#next-actions">Next actions</a>
        </div>
    </nav>

    <?php get_template_part( 'template-parts/publications-feature' ); ?>
    <section id="primary-path" class="research-hub-section research-hub-primary-path wrap" aria-labelledby="research-hub-primary-path-title">
        <div class="research-hub-section__heading">
            <div class="eyebrow">Primary path</div>
            <h2 id="research-hub-primary-path-title">The eight-step ArcSecs reading path.</h2>
            <p>Follow this order when the site feels too technical. It moves from premise to comparison, then evidence, then simulation, then scientific publications.</p>
        </div>
        <div class="research-hub-stepper" aria-label="Recommended ArcSecs reading path">
            <a href="#new-to-arcsecs"><span>01</span><strong>Start Here</strong><em>Learn the premise</em></a>
            <a href="<?php echo esc_url( $comparison_url ); ?>"><span>02</span><strong>Compare</strong><em>Framework split</em></a>
            <a href="<?php echo esc_url( $anomalies_url ); ?>"><span>03</span><strong>Anomalies</strong><em>Pressure points</em></a>
            <a href="<?php echo esc_url( $distance_time_url ); ?>"><span>04</span><strong>Distance-Time</strong><em>No lightyears / clockless progression</em></a>
            <a href="<?php echo esc_url( $demo_url ); ?>"><span>05</span><strong>Demo</strong><em>Simulation hooks</em></a>
            <a href="<?php echo esc_url( $drive_url ); ?>"><span>06</span><strong>DM Drive</strong><em>Propulsion sandbox</em></a>
            <a href="<?php echo esc_url( $multi_messenger_url ); ?>"><span>07</span><strong>Timing</strong><em>GW / EM delay</em></a>
            <a href="<?php echo esc_url( $library_url ); ?>"><span>08</span><strong>Library</strong><em>Reports, premises and evidence</em></a>
        </div>
    </section>

    <section id="path-cards" class="research-hub-section wrap" aria-labelledby="path-cards-title">
        <div class="research-hub-section__heading">
            <div class="eyebrow">Visual path cards</div>
            <h2 id="path-cards-title">Pick the right door into ArcSecs.</h2>
            <p>These cards turn the advanced research pages into a readable learning path for first-time visitors, skeptics, physics-minded readers, and AI/code agents.</p>
        </div>
        <div class="research-hub-card-grid">
            <?php foreach ( $path_cards as $index => $card ) : ?>
                <article class="research-hub-card research-hub-card--<?php echo esc_attr( (string) ( $index + 1 ) ); ?>">
                    <span><?php echo esc_html( $card['label'] ); ?></span>
                    <h3><?php echo esc_html( $card['title'] ); ?></h3>
                    <p><?php echo esc_html( $card['summary'] ); ?></p>
                    <a href="<?php echo esc_url( $card['url'] ); ?>"><?php echo esc_html( $card['action'] ); ?> →</a>
                </article>
            <?php endforeach; ?>
        </div>
    </section>

    <section id="new-to-arcsecs" class="research-hub-section wrap" aria-labelledby="new-to-arcsecs-title">
        <div class="research-hub-section__heading">
            <div class="eyebrow">New to ArcSecs?</div>
            <h2 id="new-to-arcsecs-title">Read the site as a test map, not a declaration of victory.</h2>
            <p>The research pages are intentionally bold, but the hub keeps the caveat visible: mainstream Lambda-CDM remains the accepted scientific baseline, while ArcSecs is a speculative framework for simulation, debate, and contradiction-finding.</p>
        </div>
        <div class="research-hub-lanes">
            <article>
                <h3>Observation lane</h3>
                <p>Start with what is measured: redshift, light curves, galaxy dynamics, cluster collisions, element abundances, and photon-mass bounds.</p>
            </article>
            <article>
                <h3>Mainstream lane</h3>
                <p>Review the standard explanation before jumping to alternatives: expanding spacetime, general relativity, cold dark matter, dark energy, and Big Bang nucleosynthesis.</p>
            </article>
            <article>
                <h3>ArcSecs lane</h3>
                <p>Then inspect the speculative contrast: tired light, Proca photons, relational inertia, slow-light condensates, dark matter ramjets, and simulation-ledger failure tests.</p>
            </article>
        </div>
    </section>

    <section id="route-map" class="research-hub-section wrap" aria-labelledby="route-map-title">
        <div class="research-hub-section__heading">
            <div class="eyebrow">Better internal linking</div>
            <h2 id="route-map-title">The recommended ArcSecs route map.</h2>
            <p>Each page now has a clear job and points visitors to the next useful page instead of leaving them in a dead end.</p>
        </div>
        <ol class="research-hub-route-list">
            <li><strong>Start here:</strong> use this hub to choose a path and understand the disclaimer layer.</li>
            <li><strong>Compare the physics:</strong> open <a href="<?php echo esc_url( $comparison_url ); ?>">Standard Cosmology vs. ArcSecs</a> for the full framework split.</li>
            <li><strong>Track anomalies:</strong> open <a href="<?php echo esc_url( $anomalies_url ); ?>">Cosmic Anomalies Tracker</a> for pressure points, evidence grades, and kill tests.</li>
            <li><strong>Read the Distance-Time Framework:</strong> open <a href="<?php echo esc_url( $distance_time_url ); ?>">Distance-Time Framework</a> for no-lightyear distance, clockless progression, gravity-wave baselines, and degraded-light framing.</li>
            <li><strong>Read timing evidence:</strong> open <a href="<?php echo esc_url( $multi_messenger_url ); ?>">Multi-Messenger Light Delay</a> to separate gravitational-wave baselines, electromagnetic source delays, environmental diffusion, and speculative propagation effects.</li>
            <li><strong>Run scenarios:</strong> open <a href="<?php echo esc_url( $demo_url ); ?>">Physics Engine Demo</a> to turn ideas into toggles, telemetry, and failure states.</li>
            <li><strong>Run the propulsion sandbox:</strong> open <a href="<?php echo esc_url( $drive_url ); ?>">Dark Matter Drive Simulator</a> for field capture, shielding, energy ledgers, thermal stress, and deterministic replay.</li>
            <li><strong>Check the research base:</strong> open <a href="<?php echo esc_url( $library_url ); ?>">Research Library</a> for scientific links grouped by pressure point, source role, support statement, and limitation statement.</li>
            <li><strong>Recover context:</strong> use <a href="<?php echo esc_url( $llms_url ); ?>">llms.txt</a>, <a href="<?php echo esc_url( $sitemap_url ); ?>">ArcSecs sitemap</a>, and published research documents for scientific context.</li>
        </ol>
    </section>

    <section id="researcher-tools" class="research-hub-section wrap" aria-labelledby="researcher-tools-title">
        <div class="research-hub-section__heading">
            <div class="eyebrow">For AI / Researchers</div>
            <h2 id="researcher-tools-title">Machine-readable paths and public research.</h2>
            <p>The public routes tell crawlers and researchers where the readable pages live. The publication catalog connects the book, scientific review, researcher identity, and structured datasets. Private operational memory is not distributed.</p>
        </div>
        <div class="research-hub-tool-grid">
            <a href="<?php echo esc_url( $ai_summary_url ); ?>"><strong>AI summary</strong><span>Physics Engine Demo context and route explanation.</span></a>
            <a href="<?php echo esc_url( $llms_url ); ?>"><strong>llms.txt</strong><span>AI-readable route list and key public concepts.</span></a>
            <a href="<?php echo esc_url( $sitemap_url ); ?>"><strong>ArcSecs sitemap</strong><span>Custom sitemap with virtual research routes.</span></a>
            <a href="<?php echo esc_url( $comparison_url ); ?>#architecture"><strong>Architecture section</strong><span>TypeScript engine as scientific argument.</span></a>
            <a href="<?php echo esc_url( $comparison_url ); ?>#architecture"><strong>Provided TypeScript</strong><span>Source examples are bundled under assets/ts/arcsecs-physics-engine/.</span></a>
            <a href="<?php echo esc_url( $library_url ); ?>"><strong>Research Library</strong><span>Read 41 historical reports, twelve foundations, manuscript history, archived checks, and external evidence with explicit limitations.</span></a>
            <a href="<?php echo esc_url( $distance_time_url ); ?>"><strong>Distance-Time Framework</strong><span>No-lightyear distance, clockless progression, gravity-wave baselines, and degraded electromagnetic-light framing.</span></a>
            <a href="<?php echo esc_url( $multi_messenger_url ); ?>"><strong>Multi-Messenger Timing</strong><span>Report-based GW/EM timing page with diagrams, delay buckets, and falsification checkpoints.</span></a>
            <a href="<?php echo esc_url( $drive_url ); ?>"><strong>Dark Matter Drive Simulator</strong><span>Interactive deterministic replay sandbox for ArcSecs speculative propulsion scenarios.</span></a>
        </div>
    </section>



    <?php arcsecs_render_evidence_sources_component( 'research-hub' ); ?>

    <section id="next-actions" class="research-hub-section wrap" aria-labelledby="next-actions-title">
        <div class="research-hub-final-panel">
            <div>
                <div class="eyebrow">Next action</div>
                <h2 id="next-actions-title">Start with the comparison, then test the pressure points.</h2>
                <p>The most useful visitor path is not to believe ArcSecs immediately. It is to compare the assumptions, inspect the anomalies, and then force the demo to expose whether the speculative branch can carry its own accounting.</p>
            </div>
            <div class="research-hub-final-actions">
                <a class="arcsecs-button" href="<?php echo esc_url( $comparison_url ); ?>">Compare the Physics</a>
                <a class="arcsecs-button ghost" href="<?php echo esc_url( $anomalies_url ); ?>">Track Cosmic Anomalies</a>
                <a class="arcsecs-button ghost" href="<?php echo esc_url( $demo_url ); ?>">Run the Simulation</a>
                <a class="arcsecs-button ghost" href="<?php echo esc_url( $distance_time_url ); ?>">Open Distance-Time Framework</a>
                <a class="arcsecs-button ghost" href="<?php echo esc_url( $drive_url ); ?>">Open Dark Matter Drive</a>
                <a class="arcsecs-button ghost" href="<?php echo esc_url( $library_url ); ?>">Open Research Library</a>
            </div>
        </div>
    </section>
</article>
