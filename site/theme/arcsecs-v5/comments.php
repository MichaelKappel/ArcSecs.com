<?php
/**
 * Comments template.
 *
 * @package ArcSecs
 */
if (post_password_required()) {
    return;
}
?>
<section id="comments" class="comments-area wrap">
    <?php if (have_comments()) : ?>
        <h2 class="comments-title"><?php comments_number(esc_html__('No comments', 'arcsecs'), esc_html__('One comment', 'arcsecs'), esc_html__('% comments', 'arcsecs')); ?></h2>
        <ol class="comment-list"><?php wp_list_comments(array('style' => 'ol', 'short_ping' => true)); ?></ol>
        <?php the_comments_navigation(); ?>
    <?php endif; ?>
    <?php comment_form(); ?>
</section>
