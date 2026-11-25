<?php
/**
 * Footer template.
 *
 * @package ArcSecs
 */
?>
</main>
<footer class="site-footer">
    <div class="wrap footer-grid">
        <div>
            <a class="footer-brand footer-brand-image" href="<?php echo esc_url(home_url('/')); ?>" aria-label="<?php echo esc_attr(get_bloginfo('name')); ?>">
                <img src="<?php echo esc_url(get_template_directory_uri() . '/assets/images/arcsecs-logo-refined.png'); ?>" alt="<?php echo esc_attr(get_bloginfo('name')); ?>">
            </a>
            <p><?php esc_html_e('Speculative cosmology essays on light, gravity, redshift, time, and hidden structure.', 'arcsecs'); ?></p>
        </div>
        <nav class="footer-nav" aria-label="<?php esc_attr_e('Footer menu', 'arcsecs'); ?>">
            <?php
            wp_nav_menu(array(
                'theme_location' => 'footer',
                'container'      => false,
                'fallback_cb'    => 'arcsecs_fallback_menu',
            ));
            ?>
        </nav>
        <div class="footer-meta">
            <p>&copy; <?php echo esc_html(gmdate('Y')); ?> <?php bloginfo('name'); ?>.</p>
            <p><?php esc_html_e('Observe. Measure. Question the cosmic ruler.', 'arcsecs'); ?></p>
            <p class="arcsecs-footer-framework-note"><?php esc_html_e('Speculative research visualization for distance without lightyears, clockless progression, gravity-wave baselines, degraded electromagnetic light, validation, and falsification.', 'arcsecs'); ?></p>
        </div>
    </div>
    <nav class="wrap arcsecs-footer-framework-links arcsecs-footer-framework-links--bar" aria-label="<?php esc_attr_e('ArcSecs framework links', 'arcsecs'); ?>">
        <a href="<?php echo esc_url( arcsecs_ai_access_url( 'arcsecs-distance-time-framework/' ) ); ?>"><?php esc_html_e('Distance-Time Framework', 'arcsecs'); ?></a>
        <a href="<?php echo esc_url( arcsecs_ai_access_url( 'arcsecs-physics-engine-demo/' ) ); ?>"><?php esc_html_e('Physics Engine Demo', 'arcsecs'); ?></a>
        <a href="<?php echo esc_url( arcsecs_dark_matter_drive_simulator_url() ); ?>"><?php esc_html_e('Dark Matter Drive Simulator', 'arcsecs'); ?></a>
        <a href="<?php echo esc_url( arcsecs_ai_access_url( 'research-library/' ) ); ?>"><?php esc_html_e('Evidence & Sources', 'arcsecs'); ?></a>
        <a href="<?php echo esc_url( arcsecs_ai_access_url( 'standard-cosmology-vs-arcsecs/' ) ); ?>"><?php esc_html_e('Standard Cosmology vs ArcSecs', 'arcsecs'); ?></a>
        <a href="<?php echo esc_url( arcsecs_ai_access_url( 'cosmic-anomalies-tracker/' ) ); ?>"><?php esc_html_e('Cosmic Anomalies Tracker', 'arcsecs'); ?></a>
    </nav>
</footer>
</div>
<?php wp_footer(); ?>
</body>
</html>
