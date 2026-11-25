<?php
/**
 * Hard-coded home showcase. It never prints the Home page title/body.
 *
 * @package ArcSecs
 */
$dark_matter_drive_url = arcsecs_dark_matter_drive_simulator_url();
$research_library_url  = arcsecs_ai_access_url( 'research-library/' );
$multi_messenger_url = arcsecs_ai_access_url( 'multi-messenger-light-delay/' );
$distance_time_url = arcsecs_ai_access_url( 'arcsecs-distance-time-framework/' );

$primary_path_cards = array(
    array(
        'step'    => '01',
        'title'   => 'Start Here',
        'summary' => 'Begin with the research map, scientific boundary, and recommended reading order.',
        'url'     => arcsecs_ai_access_url( 'arcsecs-research-hub/' ),
        'action'  => 'Open hub',
    ),
    array(
        'step'    => '02',
        'title'   => 'Compare the Physics',
        'summary' => 'See the mainstream Lambda-CDM lane beside the speculative ArcSecs lane.',
        'url'     => arcsecs_ai_access_url( 'standard-cosmology-vs-arcsecs/' ),
        'action'  => 'Compare',
    ),
    array(
        'step'    => '03',
        'title'   => 'Track Anomalies',
        'summary' => 'Review pressure points, evidence grades, and failure conditions.',
        'url'     => arcsecs_ai_access_url( 'cosmic-anomalies-tracker/' ),
        'action'  => 'Inspect',
    ),
    array(
        'step'    => '04',
        'title'   => 'Run Simulations',
        'summary' => 'Move from essay claims into toggles, telemetry, and replayable experiments.',
        'url'     => arcsecs_ai_access_url( 'arcsecs-physics-engine-demo/' ),
        'action'  => 'Run demo',
    ),
    array(
        'step'    => '05',
        'title'   => 'Distance-Time Framework',
        'summary' => 'Learn the no-lightyear distance and clockless progression framework before comparing gravity-wave baselines against degraded light.',
        'url'     => $distance_time_url,
        'action'  => 'Open framework',
    ),
    array(
        'step'    => '06',
        'title'   => 'Explore Propulsion',
        'summary' => 'Open the plugin-owned Dark Matter Drive propulsion sandbox.',
        'url'     => $dark_matter_drive_url,
        'action'  => 'Open drive',
    ),
    array(
        'step'    => '07',
        'title'   => 'Read Source / Docs',
        'summary' => 'Browse the Research Library, scientific links, constraints, limitations, TypeScript source, llms.txt and the sitemap for research discovery.',
        'url'     => $research_library_url,
        'action'  => 'Open library',
    ),
);
?>
<section class="hero hero-home">
    <div class="hero-bg" aria-hidden="true"><?php arcsecs_render_theme_picture( 'assets/images/Cosmic_vortex_and_radiant_beams.png', '', array( 'loading' => 'eager', 'decoding' => 'async', 'fetchpriority' => 'high', 'width' => '1916', 'height' => '821' ) ); ?></div>
    <div class="wrap hero-grid">
        <div class="hero-copy">
            <div class="eyebrow">Arcseconds of possibility</div>
            <h1><?php esc_html_e('Rethinking gravity, light, and the hidden structure of the universe.', 'arcsecs'); ?></h1>
            <p><?php esc_html_e('ArcSecs is a custom editorial home for bold physics essays: slow-light dark matter, tired light, photon mass, variable light speed, redshift alternatives, and cosmological anomalies treated as invitations to think harder.', 'arcsecs'); ?></p>
            <div class="hero-actions hero-actions--focused">
                <a class="arcsecs-button" href="<?php echo esc_url( arcsecs_ai_access_url( 'arcsecs-research-hub/' ) ); ?>">Start Here</a>
                <a class="arcsecs-button ghost" href="<?php echo esc_url( arcsecs_ai_access_url( 'arcsecs-physics-engine-demo/' ) ); ?>">Run Demo</a>
                <a class="arcsecs-button ghost" href="<?php echo esc_url( $dark_matter_drive_url ); ?>">DM Drive</a>
                <a class="arcsecs-button ghost" href="#primary-path">Primary Path</a>
            </div>
        </div>
        <div class="hero-instrument" aria-hidden="true">
            <div class="orbital-ring ring-a"></div>
            <div class="orbital-ring ring-b"></div>
            <div class="orbital-ring ring-c"></div>
            <div class="measurement-beam"></div>
            <div class="instrument-core">″</div>
            <div class="instrument-caption">ARCSEC FIELD</div>
        </div>
    </div>
</section>

<?php get_template_part( 'template-parts/publications-feature' ); ?>

<section class="sitewide-research-cta wrap" aria-label="ArcSecs research hub call to action">
    <div>
        <div class="eyebrow">Start Here</div>
        <h2>New pages, one research path.</h2>
        <p>Use the ArcSecs Research Hub to move from the premise, to the framework comparison, to the cosmic anomalies tracker, and then into the Physics Engine Demo.</p>
    </div>
    <div class="sitewide-research-cta__actions">
        <a class="arcsecs-button" href="<?php echo esc_url( arcsecs_ai_access_url( 'arcsecs-research-hub/' ) ); ?>">Open Research Hub</a>
        <a class="arcsecs-button ghost" href="<?php echo esc_url( arcsecs_ai_access_url( 'standard-cosmology-vs-arcsecs/' ) ); ?>">Compare the Physics</a>
        <a class="arcsecs-button ghost" href="<?php echo esc_url( arcsecs_ai_access_url( 'cosmic-anomalies-tracker/' ) ); ?>">Track Anomalies</a>
        <a class="arcsecs-button ghost" href="<?php echo esc_url( $research_library_url ); ?>">Research Library</a>
    </div>
</section>

<section class="sitewide-research-cta sitewide-distance-time-cta wrap" aria-label="Distance-Time Framework call to action">
    <div>
        <div class="eyebrow">Measure the universe without lightyears</div>
        <h2>Distance starts with geometry. Time starts with relation.</h2>
        <p>ArcSecs is testing a speculative framework where cosmic distance starts with parallax, parsecs, arcseconds, angular geometry, and gravitational-wave baselines instead of lightyears. Light is treated as an observation channel that can lag, fade, red-shift, stretch, degrade, become uncertain, or disappear below detection threshold.</p>
        <p class="research-hub-disclaimer"><strong>Boundary:</strong> speculative research visualization, built for comparison, testing, validation, and falsification.</p>
    </div>
    <div class="sitewide-research-cta__actions">
        <a class="arcsecs-button" href="<?php echo esc_url( $distance_time_url ); ?>">Learn the Framework</a>
        <a class="arcsecs-button ghost" href="<?php echo esc_url( arcsecs_ai_access_url( 'arcsecs-physics-engine-demo/' ) ); ?>">Open Physics Engine Demo</a>
        <a class="arcsecs-button ghost" href="<?php echo esc_url( $dark_matter_drive_url ); ?>">Open DM Drive</a>
    </div>
</section>

<section class="sitewide-research-cta sitewide-messenger-cta wrap" aria-label="Multi-messenger light delay page call to action">
    <div>
        <div class="eyebrow">Gravity first, light later</div>
        <h2>New multi-messenger timing page.</h2>
        <p>Use GW170817, GW150914, and GW190521 to separate gravitational-wave baselines, electromagnetic source delay, environment diffusion, and speculative light-slowing tests.</p>
    </div>
    <div class="sitewide-research-cta__actions">
        <a class="arcsecs-button" href="<?php echo esc_url( $multi_messenger_url ); ?>">Open Timing Page</a>
        <a class="arcsecs-button ghost" href="<?php echo esc_url( $research_library_url ); ?>#source-multi-messenger-timing">Open Sources</a>
    </div>
</section>

<section class="sitewide-research-cta sitewide-drive-cta wrap" aria-label="Dark Matter Drive Simulator call to action">
    <div>
        <div class="eyebrow">Explore the Dark Matter Drive Simulator</div>
        <h2>A live ArcSecs blueprint for field capture, shielding, energy ledgers, thermal stress, and replayable speculative physics experiments.</h2>
        <p>The simulator page is provided by the ArcSecs plugin. The main site links to it as the propulsion sandbox without duplicating plugin code, TypeScript, or CSS.</p>
    </div>
    <div class="sitewide-research-cta__actions">
        <a class="arcsecs-button" href="<?php echo esc_url( $dark_matter_drive_url ); ?>">Open Simulator</a>
        <a class="arcsecs-button ghost" href="<?php echo esc_url( arcsecs_ai_access_url( 'standard-cosmology-vs-arcsecs/#propulsion-shielding' ) ); ?>">Read Propulsion Context</a>
    </div>
</section>

<section id="primary-path" class="home-primary-path wrap" aria-labelledby="home-primary-path-title">
    <div class="home-primary-path__heading">
        <div>
            <div class="eyebrow">Primary path</div>
            <h2 id="home-primary-path-title">Start simple. Go deeper only when ready.</h2>
        </div>
        <p>The home page now gives visitors one obvious sequence instead of making every advanced page compete for attention at once.</p>
    </div>
    <div class="home-primary-path__grid">
        <?php foreach ( $primary_path_cards as $card ) : ?>
            <a class="home-primary-path__card" href="<?php echo esc_url( $card['url'] ); ?>">
                <span><?php echo esc_html( $card['step'] ); ?></span>
                <strong><?php echo esc_html( $card['title'] ); ?></strong>
                <p><?php echo esc_html( $card['summary'] ); ?></p>
                <em><?php echo esc_html( $card['action'] ); ?> →</em>
            </a>
        <?php endforeach; ?>
    </div>
</section>

<section class="concept-strip wrap" aria-label="Core themes">
    <article><span>01</span><strong>Slow light</strong><p>What if some light slips out of visibility but remains gravitationally present?</p></article>
    <article><span>02</span><strong>No spacetime</strong><p>Questioning whether a mathematical shortcut became mistaken for a physical object.</p></article>
    <article><span>03</span><strong>Variable light</strong><p>Asking what hidden changes in light behavior could do across cosmic distance.</p></article>
</section>

<section class="mission-console wrap" aria-label="ArcSecs signal map">
    <div class="console-panel console-large">
        <div class="eyebrow">Signal map</div>
        <h2><?php esc_html_e('A field guide for the hidden universe.', 'arcsecs'); ?></h2>
        <p><?php esc_html_e('Articles connect redshift, photon behavior, gravity, slow light, cosmological horizons, and the dark sector into a single speculative research language.', 'arcsecs'); ?></p>
    </div>
    <div class="console-panel console-card console-redshift">
        <strong>Redshift</strong>
        <span>Distance, energy loss, and cosmic interpretation.</span>
        <div class="panel-visual" aria-hidden="true"><?php arcsecs_render_theme_picture( 'assets/images/redshift-card.png', '', array( 'width' => '1672', 'height' => '941' ) ); ?></div>
    </div>
    <div class="console-panel console-card console-photon">
        <strong>Photon mass</strong>
        <span>Testing whether light is only a messenger or also a participant.</span>
        <div class="panel-visual" aria-hidden="true"><?php arcsecs_render_theme_picture( 'assets/images/photon-mass-card.png', '', array( 'width' => '1672', 'height' => '941' ) ); ?></div>
    </div>
    <div class="console-panel console-card console-dark-sector">
        <strong>Dark sector</strong>
        <span>Invisible influence, hidden light, and metrology-grade experiments.</span>
        <div class="panel-visual" aria-hidden="true"><?php arcsecs_render_theme_picture( 'assets/images/dark-sector-card.png', '', array( 'width' => '1672', 'height' => '941' ) ); ?></div>
    </div>
</section>



<section class="home-research-library-cta wrap" aria-label="Research library path">
    <div>
        <div class="eyebrow">Evidence library</div>
        <h2>Check the sources behind the claims.</h2>
        <p>Open the Research Library for grouped scientific links, source roles, support statements, limitations, and simulation prompts.</p>
    </div>
    <a class="arcsecs-button" href="<?php echo esc_url( $research_library_url ); ?>">Open Research Library</a>
</section>

<?php arcsecs_render_evidence_sources_component( 'home' ); ?>

<section class="home-drive-card wrap" aria-label="Dark Matter Drive Simulator path card">
    <article class="home-drive-card__panel">
        <div>
            <div class="eyebrow">Propulsion sandbox</div>
            <h2>Run the Dark Matter Drive Simulator</h2>
            <p>Explore shielding, ramjet capture, tired-light energy accounting, massive photon lensing, thermal bottlenecks, and deterministic replay in the ArcSecs speculative physics sandbox.</p>
        </div>
        <a class="arcsecs-button" href="<?php echo esc_url( $dark_matter_drive_url ); ?>">Open Simulator</a>
    </article>
</section>

<section id="latest-signals" class="latest-section wrap">
    <div class="section-heading">
        <div>
            <div class="eyebrow">Latest signals</div>
            <h2><?php esc_html_e('New ArcSecs articles', 'arcsecs'); ?></h2>
        </div>
        <p><?php esc_html_e('The newest essays are shown here automatically. The full archive lives at /blog/.', 'arcsecs'); ?></p>
    </div>
    <div class="post-grid featured-grid">
        <?php
        $latest = new WP_Query(array(
            'posts_per_page'      => 6,
            'ignore_sticky_posts' => true,
            'post_status'         => 'publish',
        ));
        if ($latest->have_posts()) :
            while ($latest->have_posts()) :
                $latest->the_post();
                get_template_part('template-parts/post-card');
            endwhile;
            wp_reset_postdata();
        else :
            get_template_part('template-parts/content', 'none');
        endif;
        ?>
    </div>
</section>
