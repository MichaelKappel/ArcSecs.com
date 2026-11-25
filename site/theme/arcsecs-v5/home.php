<?php
/**
 * Posts page template.
 *
 * @package ArcSecs
 */
get_header(); ?>
<section class="archive-hero blog-hero">
    <div class="wrap">
        <div class="eyebrow"><?php esc_html_e('ArcSecs archive', 'arcsecs'); ?></div>
        <h1><?php esc_html_e('Blog', 'arcsecs'); ?></h1>
        <p><?php esc_html_e('Every signal, theory, map, and speculative cosmology essay in one place.', 'arcsecs'); ?></p>
    </div>
</section>
<section class="archive-grid wrap">
    <?php if (have_posts()) : ?>
        <div class="post-grid">
            <?php while (have_posts()) : the_post(); get_template_part('template-parts/post-card'); endwhile; ?>
        </div>
        <div class="pagination-wrap"><?php the_posts_pagination(array('mid_size' => 2)); ?></div>
    <?php else : ?>
        <?php get_template_part('template-parts/content', 'none'); ?>
    <?php endif; ?>
</section>
<?php get_footer();
