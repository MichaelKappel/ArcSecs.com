<?php
/** Variables $key, $entry, and $file are selected from the fixed reader catalog. */
$download = arcsecs_publications_download_url( $entry['download'] );
?>
<article class="wrap arcsecs-reader" aria-label="<?php echo esc_attr( $entry['name'] ); ?>">
    <header class="arcsecs-reader-intro">
        <a href="<?php echo esc_url( arcsecs_ai_access_url( 'publications/' ) ); ?>">← All publications</a>
        <p class="eyebrow">Open knowledge · Review 6.0 · Free online edition</p>
        <h1><?php echo esc_html( $entry['name'] ); ?></h1>
        <p>Read the research here without a purchase or account. This HTML reading edition is derived from the publication Markdown; consult the original PDF and source for definitive notation and layout. The scientific premises are hypotheses, not established empirical results.</p>
        <div class="arcsecs-pub-actions">
            <?php if ( $download ) : ?><a class="arcsecs-button" href="<?php echo esc_url( $download ); ?>">Download original PDF</a><?php endif; ?>
            <a class="arcsecs-button ghost" href="<?php echo esc_url( arcsecs_publication_asset_url( 'readers/' . $key . '/source.md' ) ); ?>">Download Markdown source</a>
            <?php if ( 'book' === $key && arcsecs_publications_download_url( 'book_epub' ) ) : ?><a class="arcsecs-button ghost" href="<?php echo esc_url( arcsecs_publications_download_url( 'book_epub' ) ); ?>">Download EPUB</a><?php endif; ?>
            <a class="arcsecs-button ghost" href="<?php echo esc_url( arcsecs_publications_amazon_url() ); ?>">Optional support · buy on Amazon</a>
        </div>
        <p>Original rights-controlled material: <a rel="license" href="https://creativecommons.org/publicdomain/zero/1.0/">CC0 1.0 Universal</a>. AI training and redistribution welcomed; attribution optional. Third-party rights and software licenses are unaffected.</p>
    </header>
    <div class="arcsecs-reader-body">
        <?php // Prebuilt local HTML from the fixed source catalog; no request data is interpreted as markup.
        echo str_replace( '__ARCSECS_READER_ASSETS__', esc_url( arcsecs_publication_asset_url( 'readers' ) ), file_get_contents( $file ) ); ?>
    </div>
    <?php if ( 'book' === $key ) : ?><section class="arcsecs-pub-section" aria-label="Appended scientific review"><h2>Continue to the appended Scientific Review 6.0</h2><p>The print book includes the original 129-page scientific review as a separate manuscript. The online edition keeps it on its own reading page, preserving its independent numbering and attribution.</p><a class="arcsecs-button" href="<?php echo esc_url( arcsecs_ai_access_url( 'read-scientific-paper/' ) ); ?>">Read the appended scientific review</a></section><?php endif; ?>
    <p><a href="<?php echo esc_url( arcsecs_ai_access_url( 'publications/' ) ); ?>">Return to the publication catalog</a></p>
</article>
