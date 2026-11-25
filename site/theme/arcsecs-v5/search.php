<?php
/**
 * Search template.
 *
 * @package ArcSecs
 */
get_header(); ?>
<section class="archive-hero">
    <div class="wrap">
        <div class="eyebrow"><?php esc_html_e('Search', 'arcsecs'); ?></div>
        <h1><?php printf(esc_html__('Results for “%s”', 'arcsecs'), esc_html(get_search_query())); ?></h1>
        <?php get_search_form(); ?>
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
