<?php
/**
 * Blog page slug fallback for cases where Settings -> Reading is not assigned.
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
    <?php
    $blog_query = new WP_Query(array(
        'post_type'           => 'post',
        'post_status'         => 'publish',
        'posts_per_page'      => get_option('posts_per_page', 10),
        'paged'               => max(1, get_query_var('paged')),
        'ignore_sticky_posts' => false,
    ));
    if ($blog_query->have_posts()) : ?>
        <div class="post-grid">
            <?php while ($blog_query->have_posts()) : $blog_query->the_post(); get_template_part('template-parts/post-card'); endwhile; ?>
        </div>
        <div class="pagination-wrap">
            <?php
            echo paginate_links(array(
                'total'   => $blog_query->max_num_pages,
                'current' => max(1, get_query_var('paged')),
            ));
            ?>
        </div>
        <?php wp_reset_postdata(); ?>
    <?php else : ?>
        <?php get_template_part('template-parts/content', 'none'); ?>
    <?php endif; ?>
</section>
<?php get_footer();
