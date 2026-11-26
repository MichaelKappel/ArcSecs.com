<?php
// Static integration contract: no WP bootstrap; actual browser and plugin route tests are separate.
$theme=dirname(__DIR__,2);$source=file_get_contents($theme.'/functions.php');$style=file_get_contents($theme.'/style.css');$plugin=dirname($theme,2).'/plugins/arcsecs-scientific-physics-engine';
function ensure_release($ok,$message){if(!$ok){fwrite(STDERR,$message."\n");exit(1);}}
ensure_release(strpos($style,'Version: 3.142.0')!==false && strpos($source,"define('ARCSECS_VERSION', '3.142.0')")!==false,'Theme version mismatch');
ensure_release(strpos($source,"'path'  => 'cosmic-evolution-simulator/'")!==false,'Missing simulator nav');
ensure_release(strpos($source,"'path'        => 'cosmic-evolution-simulator/'")!==false,'Missing simulator SEO catalog');
ensure_release(strpos($source,"'Cosmic Evolution Simulator',")!==false,'Missing dedupe label');
ensure_release(strpos($source,'arcsecs_get_public_route_seo_entries()')!==false,'Missing sitemap route catalog');
if(is_dir($plugin)){ensure_release(strpos(file_get_contents($plugin.'/includes/class-arcsecs-physics-engine-activator.php'),'[arcsecs_cosmic_evolution]')!==false,'Plugin activation shortcode mismatch');}
echo "Cosmic navigation, version and SEO integration contracts passed.\n";
