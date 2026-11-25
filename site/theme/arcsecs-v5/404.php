<?php
/**
 * 404 template.
 *
 * @package ArcSecs
 */
get_header(); ?>
<section class="archive-hero">
    <div class="wrap">
        <div class="eyebrow"><?php esc_html_e('Lost signal', 'arcsecs'); ?></div>
        <h1><?php esc_html_e('404: this coordinate is empty.', 'arcsecs'); ?></h1>
        <p><?php esc_html_e('The page may have drifted beyond the observable archive.', 'arcsecs'); ?></p>
        <div class="hero-actions"><a class="arcsecs-button" href="<?php echo esc_url(home_url('/blog/')); ?>"><?php esc_html_e('Return to the blog', 'arcsecs'); ?></a></div>
    </div>
</section>
<?php get_footer();
