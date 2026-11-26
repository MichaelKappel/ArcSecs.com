<?php
$catalog = arcsecs_library_catalog();
$entries = $catalog['entries'];
$reports = array_values( array_filter( $entries, function ( $e ) { return 'report' === $e['kind']; } ) );
$reviews = array_values( array_filter( $entries, function ( $e ) { return 'review' === $e['kind']; } ) );
?>
<section id="scientific-archive" class="wrap arcsecs-library-archive" aria-labelledby="library-archive-title">
    <header class="arcsecs-library-intro">
        <div class="eyebrow">Open knowledge · Scientific Research Library</div>
        <h2 id="library-archive-title">Read the research, trace the evidence.</h2>
        <p>Full-depth historical reports, the authoritative twelve foundations, scientific review history and archived computational evidence. Read online without an account, or download the source Markdown for independent analysis and AI research.</p>
        <p class="arcsecs-pub-boundary"><strong>Scientific boundary:</strong> The twelve foundations are stipulated premises. Historical working reports contain interpretations, conditional calculations and unverified claims; none is represented as independent peer review. The latest charter supersedes older eleven-principle enumerations.</p>
        <dl class="arcsecs-library-metrics"><div><dt>Historical reports</dt><dd><?php echo esc_html( count( $reports ) ); ?></dd></div><div><dt>Review editions</dt><dd><?php echo esc_html( count( $reviews ) ); ?></dd></div><div><dt>Stated foundations</dt><dd>12</dd></div><div><dt>Access</dt><dd>Free</dd></div></dl>
        <div class="arcsecs-pub-actions"><a class="arcsecs-button" href="<?php echo esc_url( arcsecs_ai_access_url( 'research-library/foundations/' ) ); ?>">Start with the twelve foundations</a><a class="arcsecs-button ghost" href="<?php echo esc_url( arcsecs_ai_access_url( 'research-library/reproducibility/' ) ); ?>">Reproducibility &amp; data</a><a class="arcsecs-button ghost" href="#evidence-sources-research-library">External evidence &amp; sources</a></div>
    </header>
    <nav class="arcsecs-library-jump" aria-label="Scientific archive sections"><a href="#library-foundations">Twelve foundations</a><a href="#library-reports">41 reports</a><a href="#library-reviews">Review history</a><a href="#library-methods">Methods &amp; access</a><a href="<?php echo esc_url( arcsecs_library_asset_url( 'catalog.json' ) ); ?>">JSON catalog</a></nav>
    <?php $foundation = arcsecs_library_entry( 'foundations' ); if ( ! empty( $foundation['premises'] ) ) : ?>
    <section id="library-foundations" class="arcsecs-library-section" aria-labelledby="library-foundations-title"><div class="eyebrow">Current charter · November 23, 2026</div><h3 id="library-foundations-title">Twelve stipulated premises</h3><p>These are the investigator's research commitments, not established empirical findings. Each link opens the exact statement in the charter; technical interpretation and test objectives are separate in the same document.</p><ol class="arcsecs-library-foundation-list"><?php foreach ( $foundation['premises'] as $premise ) : ?><li><a href="<?php echo esc_url( arcsecs_ai_access_url( 'research-library/foundations/#' . $premise['id'] ) ); ?>"><?php echo esc_html( $premise['text'] ); ?></a></li><?php endforeach; ?></ol></section>
    <?php endif; ?>
    <section id="library-reports" class="arcsecs-library-section" aria-labelledby="library-reports-title">
        <div class="eyebrow">Historical working research</div><h3 id="library-reports-title">Research reports R01–R41</h3>
        <p>Search report titles, numbers and section headings. Original report order and manuscript wording are preserved; the shorter catalog titles for R10–R24 are based on their source-study labels.</p>
        <div class="arcsecs-library-filter" hidden data-library-filter><label for="arcsecs-report-search">Search report catalog</label><div><input id="arcsecs-report-search" type="search" placeholder="e.g. photon, clocks, R34, redshift" autocomplete="off" aria-controls="arcsecs-report-list"><button type="button" class="arcsecs-button ghost" data-library-clear>Clear</button></div><p data-library-count aria-live="polite" role="status"></p></div>
        <noscript><p>All reports are listed below; use your browser's Find command to search.</p></noscript>
        <div class="arcsecs-library-grid" id="arcsecs-report-list">
        <?php foreach ( $reports as $entry ) : $number = sprintf( 'R%02d', $entry['number'] ); $headings = array_column( $entry['headings'], 'title' ); ?>
            <article class="arcsecs-library-card" data-library-report data-library-search="<?php echo esc_attr( $number . ' ' . $entry['title'] . ' ' . implode( ' ', $headings ) ); ?>">
                <p class="arcsecs-library-kicker"><?php echo esc_html( $number ); ?> · Historical working report</p>
                <h4><a href="<?php echo esc_url( arcsecs_ai_access_url( $entry['route'] ) ); ?>"><?php echo esc_html( $entry['title'] ); ?></a></h4>
                <p class="arcsecs-pub-muted"><?php echo esc_html( number_format( $entry['words'] ) ); ?> words · <?php echo esc_html( count( $headings ) ); ?> contents links</p>
                <div class="arcsecs-library-card-links"><a href="<?php echo esc_url( arcsecs_ai_access_url( $entry['route'] ) ); ?>">Read report</a><a href="<?php echo esc_url( arcsecs_library_asset_url( $entry['slug'] . '/source.md' ) ); ?>" download>Markdown</a></div>
            </article>
        <?php endforeach; ?>
        </div>
        <p data-library-empty hidden>No matching reports. Try a different title, topic or report number.</p>
    </section>
    <section id="library-reviews" class="arcsecs-library-section" aria-labelledby="library-reviews-title"><div class="eyebrow">Versioned manuscripts</div><h3 id="library-reviews-title">Scientific review history</h3><p>Read the archived editions in sequence or open the latest Review 6.0. Historical manuscripts are preserved rather than rewritten to match later findings.</p>
        <div class="arcsecs-library-grid"><?php foreach ( array_reverse( $reviews ) as $entry ) : ?><article class="arcsecs-library-card"><p class="arcsecs-library-kicker"><?php echo 6 === $entry['number'] ? 'Current manuscript' : 'Historical edition'; ?></p><h4><a href="<?php echo esc_url( arcsecs_ai_access_url( $entry['route'] ) ); ?>"><?php echo esc_html( $entry['title'] ); ?></a></h4><p><?php echo esc_html( $entry['description'] ); ?></p><a href="<?php echo esc_url( arcsecs_ai_access_url( $entry['reader_route'] ?? $entry['route'] ) ); ?>">Read manuscript</a></article><?php endforeach; ?></div>
    </section>
    <section id="library-methods" class="arcsecs-library-section" aria-labelledby="library-methods-title"><div class="eyebrow">Evidence and open access</div><h3 id="library-methods-title">Investigate independently</h3><div class="arcsecs-library-grid">
        <article class="arcsecs-library-card"><h4><a href="<?php echo esc_url( arcsecs_ai_access_url( 'research-library/evidence-guide/' ) ); ?>">Evidence and verification guide</a></h4><p>Observation, derived mathematics, interpretation, hypothesis, unverified claims and conflict.</p></article>
        <article class="arcsecs-library-card"><h4><a href="<?php echo esc_url( arcsecs_ai_access_url( 'research-library/reproducibility/' ) ); ?>">Reproducibility center</a></h4><p>Original scripts, archived outputs, recorded numerical warnings and source ledgers.</p></article>
        <article class="arcsecs-library-card"><h4><a href="<?php echo esc_url( arcsecs_ai_access_url( 'ai-corpus/' ) ); ?>">AI corpus v1.0.0</a></h4><p>Machine-readable research records, numerical data and source provenance.</p></article>
        <article class="arcsecs-library-card"><h4><a href="<?php echo esc_url( arcsecs_ai_access_url( 'publications/' ) ); ?>">Book and scientific paper</a></h4><p>Free reading, original PDFs and optional Amazon support.</p></article>
    </div><p>Original rights-controlled material is offered under <a href="https://creativecommons.org/publicdomain/zero/1.0/">CC0 1.0</a>. Existing third-party rights, quotations and software licenses remain in effect. <a href="https://github.com/MichaelKappel/ArcSecs.com/blob/main/LICENSE.md">Read the licensing scope.</a></p><p>Machine-readable: <a href="<?php echo esc_url( arcsecs_library_asset_url( 'catalog.json' ) ); ?>">Research catalog and source hashes</a> · <a href="<?php echo esc_url( arcsecs_library_asset_url( 'FIGURE_PROVENANCE.json' ) ); ?>">Figure provenance</a> · <a href="<?php echo esc_url( arcsecs_library_asset_url( 'RENDER_VALIDATION.json' ) ); ?>">Rendering limitations</a>.</p></section>
</section>
