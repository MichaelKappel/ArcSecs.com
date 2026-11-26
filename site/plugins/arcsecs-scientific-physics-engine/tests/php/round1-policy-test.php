<?php
if (PHP_SAPI !== "cli") { http_response_code(404); exit; }
// Isolated WordPress policy/activation test with explicit fakes; not a WordPress integration test.
define('ABSPATH', __DIR__);
class WP_Post { public $ID=7; public $post_type='page'; public $post_status='private'; public $post_password='secret'; }
$GLOBALS['page']=new WP_Post();
function get_option($key,$default=false){return 7;}
function get_post($id){return $GLOBALS['page'];}
function get_page_by_path($slug){return $GLOBALS['page'];}
function update_option($key,$value){}
function wp_update_post($data){throw new Exception('Existing page overwritten');}
function wp_insert_post($data){$GLOBALS['insert']=$data;return 8;}
function is_page($id=null){return true;}
function get_queried_object(){return $GLOBALS['page'];}
function check($condition,$message){if(!$condition){throw new Exception($message);}}
require __DIR__.'/../../includes/class-arcsecs-physics-engine-plugin.php';
require __DIR__.'/../../includes/class-arcsecs-physics-engine-activator.php';
$p=new ArcSecs_Physics_Engine_Plugin();
foreach ([false,true] as $public){$robots="User-agent: GPTBot\nDisallow: /\n";check($p->filter_robots_txt($robots,$public)===$robots,'Robots policy overwritten');}
$headers=['X-Robots-Tag'=>'noindex, nofollow'];check($p->filter_public_headers($headers)===$headers,'Privacy header overwritten');
$ref=new ReflectionMethod($p,'is_plugin_page_request');$ref->setAccessible(true);
check(!$ref->invoke($p),'Private page bypass');$GLOBALS['page']->post_status='publish';check(!$ref->invoke($p),'Password page bypass');$GLOBALS['page']->post_password='';check($ref->invoke($p),'Published page not recognized');
foreach (['create_or_update_demo_page','create_or_update_dark_matter_drive_page','create_or_update_contact_page','create_cosmic_page'] as $method){$m=new ReflectionMethod('ArcSecs_Physics_Engine_Activator',$method);$m->setAccessible(true);check($m->invoke(null)===7,'Existing page not preserved');}
$GLOBALS['page']=null;check($m->invoke(null)===8,'Absent page not created');check($GLOBALS['insert']['post_type']==='page','Wrong inserted type');
echo "Round 1 policy/activation: existing page preservation and creation assertions passed\n";
