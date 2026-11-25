<?php
/**
 * Header template.
 *
 * @package ArcSecs
 */
?><!doctype html>
<html <?php language_attributes(); ?>>
<head>
    <meta charset="<?php bloginfo('charset'); ?>">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <?php wp_head(); ?>
</head>
<body <?php body_class(); ?>>
<?php wp_body_open(); ?>
<a class="skip-link screen-reader-text" href="#primary"><?php esc_html_e('Skip to content', 'arcsecs'); ?></a>
<div class="site-shell">
<header class="site-header" id="masthead">
    <div class="wrap header-wrap">
        <a class="brand brand-image" href="<?php echo esc_url(home_url('/')); ?>" rel="home" aria-label="<?php echo esc_attr(get_bloginfo('name')); ?>">
            <img class="brand-logo-img" src="<?php echo esc_url(get_template_directory_uri() . '/assets/images/arcsecs-logo-refined.png'); ?>" alt="<?php echo esc_attr(get_bloginfo('name')); ?>">
            <span class="brand-tagline"><?php echo esc_html(get_bloginfo('description') ?: __('Exploring the universe with an open mind.', 'arcsecs')); ?></span>
        </a>
        <a class="arcsecs-facebook-link" href="https://www.facebook.com/Arcsecs/" target="_blank" rel="noopener noreferrer" aria-label="<?php esc_attr_e('Follow ArcSecs on Facebook', 'arcsecs'); ?>">
            <span class="arcsecs-facebook-link__icon" aria-hidden="true">f</span>
            <span class="arcsecs-facebook-link__copy">
                <span><?php esc_html_e('Follow', 'arcsecs'); ?></span>
                <strong><?php esc_html_e('Facebook', 'arcsecs'); ?></strong>
            </span>
        </a>
        <button class="menu-toggle" type="button" aria-controls="primary-menu" aria-expanded="false">
            <span class="screen-reader-text"><?php esc_html_e('Menu', 'arcsecs'); ?></span>
            <span></span><span></span><span></span>
        </button>
        <nav class="primary-nav" aria-label="<?php esc_attr_e('Primary menu', 'arcsecs'); ?>">
            <?php
            wp_nav_menu(array(
                'theme_location' => 'primary',
                'menu_id'        => 'primary-menu',
                'container'      => false,
                'fallback_cb'    => 'arcsecs_fallback_menu',
            ));
            ?>
        </nav>
    </div>
</header>
<main id="primary" class="site-main">
