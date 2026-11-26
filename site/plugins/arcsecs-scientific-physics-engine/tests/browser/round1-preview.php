<?php
if (PHP_SAPI !== "cli") { http_response_code(404); exit; }
define('ABSPATH', __DIR__); define('ARCSECS_PHYSICS_ENGINE_VERSION', json_decode(file_get_contents($argv[1].'/package.json'),true)['version']);
function wp_enqueue_style(...$args){} function wp_enqueue_script(...$args){} function shortcode_atts($defaults,$attrs,$tag=''){return array_replace($defaults,array_intersect_key($attrs,$defaults));} function esc_html($s){return htmlspecialchars((string)$s,ENT_QUOTES,'UTF-8');} function esc_attr($s){return esc_html($s);} function esc_url($s){return esc_html($s);} function sanitize_text_field($s){return strip_tags($s);} function home_url($s='/'){return $s;} function wp_unique_id($prefix=''){static $i=0;return $prefix.(++$i);} function wp_generate_uuid4(){return uniqid('test-');}
$base=$argv[1];require $base.'/includes/class-arcsecs-physics-engine-config.php';require $base.'/includes/class-arcsecs-physics-engine-shortcodes.php';$p=new ArcSecs_Physics_Engine_Shortcodes();$demo=$argv[2];
?><!doctype html><html lang="en"><head><meta name="viewport" content="width=device-width, initial-scale=1"><link rel="stylesheet" href="/assets/css/arcsecs-physics-engine.css"></head><body class="<?php echo $demo==='space'?'':'arcsecs-fullscreen-demo'; ?>" style="background:#07111e;color:white;margin:0"><button id="outside">Outside demo</button><?php
if($demo==='cosmic'){echo $p->render_cosmic_shortcode();echo '<script src="/assets/js/arcsecs-cosmic-models.js"></script><script src="/assets/js/arcsecs-cosmic-lab.js"></script>';}
elseif($demo==='space'){echo $p->render_space_travel_simulation_shortcode();echo '<script src="/assets/js/arcsecs-space-travel-simulation.js"></script>';}
elseif($demo==='drive'){echo $p->render_dark_matter_drive_shortcode();echo '<script src="/assets/js/arcsecs-physics-engine.js"></script><script src="/assets/js/arcsecs-dark-matter-drive-simulator.js"></script>';}
else{echo $p->render_engine_shortcode(['steps'=>'500','scenario'=>'control']);echo '<script>window.ArcSecsPhysicsEngineSettings={workerUrl:"/assets/js/arcsecs-physics-worker.js"}</script><script src="/assets/js/arcsecs-physics-engine.js"></script>';}
echo '<script src="/assets/js/arcsecs-review6-models.js"></script><script src="/assets/js/arcsecs-review6-lab.js"></script>';
?></body></html>
