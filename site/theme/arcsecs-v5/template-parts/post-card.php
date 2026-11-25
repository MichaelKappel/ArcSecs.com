<?php
/**
 * Post card template.
 *
 * @package ArcSecs
 */
?>
<article id="post-<?php the_ID(); ?>" <?php post_class('post-card'); ?>>
    <a class="post-card-media" href="<?php the_permalink(); ?>" aria-label="<?php the_title_attribute(); ?>">
        <?php if (has_post_thumbnail()) : ?>
            <?php the_post_thumbnail('arcsecs-card'); ?>
        <?php else : ?>
            <span class="post-card-orbit" aria-hidden="true">″</span>
        <?php endif; ?>
    </a>
    <div class="post-card-body">
        <div class="post-card-meta">
            <span><?php echo esc_html(get_the_date()); ?></span>
            <span><?php echo esc_html(arcsecs_reading_time()); ?></span>
        </div>
        <h2><a href="<?php the_permalink(); ?>"><?php the_title(); ?></a></h2>
        <p><?php echo esc_html(wp_trim_words(get_the_excerpt(), 30)); ?></p>
        <a class="read-more" href="<?php the_permalink(); ?>"><?php esc_html_e('Read signal →', 'arcsecs'); ?></a>
    </div>
</article>
