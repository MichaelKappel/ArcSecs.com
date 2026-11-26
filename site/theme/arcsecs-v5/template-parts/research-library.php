<?php
/**
 * Virtual ArcSecs Research Library page.
 *
 * @package ArcSecs
 */

$hub_url        = arcsecs_ai_access_url( 'arcsecs-research-hub/' );
$comparison_url = arcsecs_ai_access_url( 'standard-cosmology-vs-arcsecs/' );
$anomalies_url  = arcsecs_ai_access_url( 'cosmic-anomalies-tracker/' );
$demo_url       = arcsecs_ai_access_url( 'arcsecs-physics-engine-demo/' );
$drive_url      = arcsecs_dark_matter_drive_simulator_url();
$multi_messenger_url = arcsecs_ai_access_url( 'multi-messenger-light-delay/' );
$llms_url       = arcsecs_ai_access_url( 'llms.txt' );
$topics         = arcsecs_get_evidence_source_topics();
$source_count   = 0;
$type_counts    = array();

foreach ( $topics as $topic ) {
    if ( empty( $topic['sources'] ) || ! is_array( $topic['sources'] ) ) {
        continue;
    }

    foreach ( $topic['sources'] as $source ) {
        $source_count++;
        $source_type = $source['type'];
        if ( ! isset( $type_counts[ $source_type ] ) ) {
            $type_counts[ $source_type ] = 0;
        }
        $type_counts[ $source_type ]++;
    }
}

$library_paths = array(
    array(
        'title'   => 'Multi-messenger timing',
        'summary' => 'GW170817, GW150914, and GW190521 turn gravitational-wave and electromagnetic arrival times into delay-bucket tests.',
        'anchor'  => '#source-multi-messenger-timing',
    ),
    array(
        'title'   => 'Cosmology pressure points',
        'summary' => 'Hubble tension, JWST early galaxies, El Gordo, and Lithium-7 are framed as pressure tests, not automatic proof of ArcSecs.',
        'anchor'  => '#source-hubble-tension',
    ),
    array(
        'title'   => 'Galaxy dynamics',
        'summary' => 'SPARC and rotation-curve sources give the dark-sector discussion a data-first entry point.',
        'anchor'  => '#source-sparc-rotation-curves',
    ),
    array(
        'title'   => 'Photon mass and Proca constraints',
        'summary' => 'Photon-mass upper bounds keep massive-photon simulation branches inside visible scientific guardrails.',
        'anchor'  => '#source-proca-photon-mass-bounds',
    ),
    array(
        'title'   => 'Tired light and redshift checks',
        'summary' => 'Classic failure tests such as Tolman dimming, supernova stretch, image sharpness, and energy accounting stay visible.',
        'anchor'  => '#source-tired-light-constraints',
    ),
    array(
        'title'   => 'Propulsion analogies',
        'summary' => 'Slow light, EIT-style language, field capture, shielding, and thermal stress are treated as engineering analogies and simulator prompts.',
        'anchor'  => '#source-dark-matter-propulsion',
    ),
);
?>
<?php get_template_part( 'template-parts/publications-feature' ); ?>
<article class="research-library-page" aria-labelledby="research-library-title">
    <section class="research-library-hero" id="top" aria-label="ArcSecs Research Library introduction">
        <div class="wrap research-library-hero__grid">
            <div class="research-library-hero__copy">
                <div class="eyebrow">Evidence &amp; Sources</div>
                <h1 id="research-library-title">ArcSecs Research Library</h1>
                <p class="research-library-hero__subtitle">An open scientific library of full-depth reports, manuscript editions, foundations, reproducibility evidence and external scientific sources.</p>
                <p>This page is the credibility layer. It does not claim the ArcSecs framework is proven. It shows what each source supports, what each source does <em>not</em> prove, and where the simulator should turn a claim into a visible test.</p>
                <p class="research-library-disclaimer"><strong>Scientific boundary:</strong> Mainstream observational sources and model constraints remain distinct from ArcSecs simulation prompts and alternative/speculative theory links.</p>
                <div class="hero-actions research-library-hero__actions">
                    <a class="arcsecs-button" href="#scientific-archive">Read the scientific archive</a>
                    <a class="arcsecs-button ghost" href="#evidence-sources-research-library">Browse Sources</a>
                    <a class="arcsecs-button ghost" href="<?php echo esc_url( $comparison_url ); ?>">Compare the Physics</a>
                    <a class="arcsecs-button ghost" href="<?php echo esc_url( $anomalies_url ); ?>">Track Anomalies</a>
                </div>
            </div>
            <aside class="research-library-hero__panel" aria-label="Research library summary">
                <dl>
                    <div><dt>Topic groups</dt><dd><?php echo esc_html( (string) count( $topics ) ); ?> curated source clusters</dd></div>
                    <div><dt>Source cards</dt><dd><?php echo esc_html( (string) $source_count ); ?> support / limitation entries</dd></div>
                    <div><dt>Reader rule</dt><dd>Separate observation, interpretation, speculation, and simulation.</dd></div>
                    <div><dt>Best use</dt><dd>Scan a topic, open the source, then return to the comparison or anomaly page.</dd></div>
                </dl>
            </aside>
        </div>
    </section>

    <nav class="research-library-mini-nav" aria-label="Research library sections">
        <div class="wrap research-library-mini-nav__inner">
            <a href="#scientific-archive">Research reports</a><a href="#source-map">Source map</a>
            <a href="#source-types">Source types</a>
            <a href="#evidence-sources-research-library">Browse sources</a>
            <a href="<?php echo esc_url( $comparison_url ); ?>">Comparison</a>
            <a href="<?php echo esc_url( $anomalies_url ); ?>">Anomalies</a>
            <a href="<?php echo esc_url( $demo_url ); ?>">Demo</a>
            <a href="<?php echo esc_url( $multi_messenger_url ); ?>">Timing</a>
        </div>
    </nav>

    <?php get_template_part( 'template-parts/research-library-catalog' ); ?>

    <section id="source-map" class="research-library-section wrap" aria-labelledby="source-map-title">
        <div class="research-library-section__heading">
            <div class="eyebrow">Source map</div>
            <h2 id="source-map-title">Start with the question, then open the sources.</h2>
            <p>The library groups links by the actual pressure point or modeling claim. Each topic points back into the ArcSecs site so readers can move from source → explanation → simulation hook.</p>
        </div>
        <div class="research-library-path-grid">
            <?php foreach ( $library_paths as $path ) : ?>
                <a class="research-library-path-card" href="<?php echo esc_url( $path['anchor'] ); ?>">
                    <strong><?php echo esc_html( $path['title'] ); ?></strong>
                    <p><?php echo esc_html( $path['summary'] ); ?></p>
                    <span>Open source group →</span>
                </a>
            <?php endforeach; ?>
        </div>
    </section>

    <section id="source-types" class="research-library-section wrap" aria-labelledby="source-types-title">
        <div class="research-library-section__heading">
            <div class="eyebrow">Claim hygiene</div>
            <h2 id="source-types-title">Every link carries a role.</h2>
            <p>A scientific-looking bibliography is not enough. The site labels whether a source is an observation, a mainstream constraint, an alternative/speculative theory, a simulator prompt, or an engineering analogy.</p>
        </div>
        <div class="research-library-type-grid">
            <?php foreach ( $type_counts as $source_type => $count ) : ?>
                <article>
                    <span class="arcsecs-source-type arcsecs-source-type--<?php echo esc_attr( sanitize_title( $source_type ) ); ?>"><?php echo esc_html( $source_type ); ?></span>
                    <strong><?php echo esc_html( (string) $count ); ?> source<?php echo $count === 1 ? '' : 's'; ?></strong>
                    <p><?php echo esc_html( arcsecs_research_library_source_type_description( $source_type ) ); ?></p>
                </article>
            <?php endforeach; ?>
        </div>
    </section>

    <?php arcsecs_render_evidence_sources_component( 'research-library' ); ?>

    <section class="research-library-section research-library-next wrap" aria-labelledby="research-library-next-title">
        <div>
            <div class="eyebrow">Read deeper</div>
            <h2 id="research-library-next-title">Use the library as a launch point, not a dead end.</h2>
            <p>After reviewing sources, jump into the comparison page, anomaly tracker, demo, Dark Matter Drive simulator, or AI-readable memory layer.</p>
        </div>
        <div class="research-library-next__links">
            <a class="arcsecs-button" href="<?php echo esc_url( $comparison_url ); ?>">Open Comparison</a>
            <a class="arcsecs-button ghost" href="<?php echo esc_url( $anomalies_url ); ?>">Open Tracker</a>
            <a class="arcsecs-button ghost" href="<?php echo esc_url( $multi_messenger_url ); ?>">Open Timing Page</a>
            <a class="arcsecs-button ghost" href="<?php echo esc_url( $drive_url ); ?>">Open DM Drive</a>
            <a class="arcsecs-button ghost" href="<?php echo esc_url( $llms_url ); ?>">Open llms.txt</a>
        </div>
    </section>
</article>
