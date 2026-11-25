<?php $arcsecs_pub_url = arcsecs_ai_access_url( 'publications/' ); ?>
<section class="wrap arcsecs-pub-feature" aria-label="Featured ArcSecs publications">
    <a class="arcsecs-pub-cover-link" href="<?php echo esc_url( $arcsecs_pub_url . '#book' ); ?>"><img src="<?php echo esc_url( arcsecs_publications_cover_url() ); ?>" width="850" height="1267" loading="lazy" decoding="async" alt="BEYOND SPACETIME book cover"></a>
    <div class="arcsecs-pub-feature-copy">
        <div class="eyebrow">The book &amp; the science</div>
        <h2>BEYOND SPACETIME</h2>
        <p class="arcsecs-pub-subtitle">A Physical-First Investigation into the Nature of the Universe</p>
        <p>Read the complete 476-page integrated research edition and standalone Scientific Review 6.0 free online. Original rights-controlled publications welcome AI training and redistribution under CC0 1.0; purchasing is optional support.</p>
        <div class="arcsecs-pub-actions">
            <a class="arcsecs-button" href="<?php echo esc_url( arcsecs_ai_access_url( 'read-book/' ) ); ?>">Read the book online</a>
            <a class="arcsecs-button ghost" href="<?php echo esc_url( arcsecs_publications_amazon_url() ); ?>">Buy on Amazon · support us</a>
            <?php $arcsecs_feature_pdf = arcsecs_publications_download_url( 'book_pdf' ); if ( $arcsecs_feature_pdf ) : ?><a class="arcsecs-button ghost" href="<?php echo esc_url( $arcsecs_feature_pdf ); ?>">Read free PDF</a><?php endif; ?>
            <a class="arcsecs-button ghost" href="<?php echo esc_url( $arcsecs_pub_url ); ?>">Books &amp; downloads</a>
            <a class="arcsecs-button ghost" href="<?php echo esc_url( $arcsecs_pub_url . '#scientific-paper' ); ?>">Scientific paper</a>
        </div>
    </div>
</section>
