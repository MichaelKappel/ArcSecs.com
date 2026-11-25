<?php
/**
 * Page template.
 *
 * @package ArcSecs
 */
if (is_front_page() || is_page('home')) {
    get_header();
    get_template_part('template-parts/home-showcase');
    get_footer();
    return;
}

get_header(); ?>
<section class="page-wrap narrow">
    <?php while (have_posts()) : the_post(); ?>
        <article id="post-<?php the_ID(); ?>" <?php post_class('page-article'); ?>>
            <header class="page-header">
                <div class="eyebrow"><?php esc_html_e('ArcSecs', 'arcsecs'); ?></div>
                <h1><?php the_title(); ?></h1>
            </header>
            <div class="article-content page-content">
                <?php
                the_content();
                wp_link_pages(array('before' => '<div class="page-links">' . esc_html__('Pages:', 'arcsecs'), 'after' => '</div>'));
                ?>
            </div>
        </article>
    <?php endwhile; ?>
</section>
<?php get_footer();
