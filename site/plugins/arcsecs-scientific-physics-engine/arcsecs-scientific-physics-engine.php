<?php
/**
 * Plugin Name: ArcSecs Scientific Physics Engine
 * Plugin URI: https://arcsecs.com/
 * Description: Scientific TDD Physics simulator for ArcSecs with local reviewer evidence workflows, contact page verification, and viewport scrollbar accessibility fixes for reachable simulator panels on shorter screens.
 * Version: 3.135.0
 * Author: ArcSecs
 * Author URI: https://arcsecs.com/
 * License: GPL-2.0-or-later
 * Text Domain: arcsecs-scientific-physics-engine
 */

if (!defined('ABSPATH')) {
    exit;
}

define('ARCSECS_PHYSICS_ENGINE_VERSION', '3.135.0');
define('ARCSECS_PHYSICS_ENGINE_FILE', __FILE__);
define('ARCSECS_PHYSICS_ENGINE_PATH', plugin_dir_path(__FILE__));
define('ARCSECS_PHYSICS_ENGINE_URL', plugin_dir_url(__FILE__));

require_once ARCSECS_PHYSICS_ENGINE_PATH . 'includes/class-arcsecs-physics-engine-config.php';
require_once ARCSECS_PHYSICS_ENGINE_PATH . 'includes/class-arcsecs-physics-engine-activator.php';
require_once ARCSECS_PHYSICS_ENGINE_PATH . 'includes/class-arcsecs-physics-engine-plugin.php';
require_once ARCSECS_PHYSICS_ENGINE_PATH . 'includes/class-arcsecs-physics-engine-shortcodes.php';
require_once ARCSECS_PHYSICS_ENGINE_PATH . 'includes/class-arcsecs-physics-engine-admin.php';

register_activation_hook(__FILE__, array('ArcSecs_Physics_Engine_Activator', 'activate'));

$arcsecs_physics_engine_plugin = new ArcSecs_Physics_Engine_Plugin();
$arcsecs_physics_engine_plugin->register();
