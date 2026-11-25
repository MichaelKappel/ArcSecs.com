<?php
/**
 * Single post template.
 *
 * @package ArcSecs
 */
get_header();
while (have_posts()) :
    the_post();
    $hero_style = '';
    if (has_post_thumbnail()) {
        $image = get_the_post_thumbnail_url(get_the_ID(), 'arcsecs-hero');
        if ($image) {
            $hero_style = ' style="background-image: linear-gradient(180deg, rgba(2,7,18,.20), rgba(2,7,18,.96) 84%), url(' . esc_url($image) . ');"';
        }
    }
    ?>
    <article id="post-<?php the_ID(); ?>" <?php post_class('single-post-shell'); ?>>
        <header class="single-hero"<?php echo $hero_style; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>>
            <div class="wrap single-hero-content">
                <div class="article-kicker">
                    <span><?php the_category(', '); ?></span>
                    <span><?php echo esc_html(get_the_date()); ?></span>
                    <span><?php echo esc_html(arcsecs_reading_time()); ?></span>
                </div>
                <h1><?php the_title(); ?></h1>
                <?php if (has_excerpt()) : ?><p class="article-excerpt"><?php echo esc_html(get_the_excerpt()); ?></p><?php endif; ?>
            </div>
        </header>
        <div class="article-layout wrap">
            <div class="article-main">
                <div class="article-content">
                    <?php the_content(); ?>
                </div>
                <?php
                wp_link_pages(array('before' => '<div class="page-links">' . esc_html__('Pages:', 'arcsecs'), 'after' => '</div>'));
                ?>
            </div>
            <aside class="article-sidebar" aria-label="<?php esc_attr_e('Article sidebar', 'arcsecs'); ?>">
                <div class="signal-box">
                    <strong><?php esc_html_e('Signal notes', 'arcsecs'); ?></strong>
                    <p><?php esc_html_e('ArcSecs essays are speculative cosmology thought experiments designed to provoke sharper models and better questions.', 'arcsecs'); ?></p>
                </div>
                <?php if (has_tag()) : ?>
                    <div class="signal-box tag-box">
                        <strong><?php esc_html_e('Tags', 'arcsecs'); ?></strong>
                        <?php the_tags('', '', ''); ?>
                    </div>
                <?php endif; ?>
                <?php if (is_active_sidebar('sidebar-1')) : dynamic_sidebar('sidebar-1'); endif; ?>
            </aside>
        </div>
        <nav class="post-nav wrap" aria-label="<?php esc_attr_e('Post navigation', 'arcsecs'); ?>">
            <div><?php previous_post_link('%link', '← %title'); ?></div>
            <div><?php next_post_link('%link', '%title →'); ?></div>
        </nav>
        <?php if (comments_open() || get_comments_number()) : comments_template(); endif; ?>
    </article>
<?php endwhile;
get_footer();
