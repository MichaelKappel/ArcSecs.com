<?php
// Isolated contract and rendering tests; no WordPress bootstrap or network.
define( 'ABSPATH', __DIR__ );
$root = dirname( __DIR__, 2 );
function add_action(...$args) {} function add_filter(...$args) {} function wp_enqueue_script(...$args) {}
function get_template_directory(){return dirname(__DIR__,2);} function get_template_directory_uri(){return 'https://arcsecs.test/theme';}
function home_url($path){return 'https://arcsecs.test'.($GLOBALS['site_prefix']??'').$path;}
function arcsecs_ai_access_url($path){return home_url('/'.ltrim($path,'/'));}
function wp_parse_url($s,$part){return parse_url($s,$part);} function wp_unslash($s){return $s;}
function trailingslashit($s){return rtrim($s,'/').'/';} function untrailingslashit($s){return rtrim($s,'/');}
function esc_url($s){return htmlspecialchars((string)$s,ENT_QUOTES);} function esc_html($s){return esc_url($s);} function esc_attr($s){return esc_url($s);}
function wp_json_encode($s,$flags=0){return json_encode($s,$flags);} function arcsecs_is_research_library_page(){return $_SERVER['REQUEST_URI']==='/research-library/';}
function get_template_part($path,$name=null,$args=[]){require get_template_directory().'/'.$path.'.php';}
function check($test,$msg){if(!$test){fwrite(STDERR,$msg."\n");exit(1);}}
require $root.'/inc/research-library-edition.php';
function catalog_html(){ob_start();get_template_part('template-parts/research-library-catalog');return ob_get_clean();}
function reader_html($entry){ob_start();get_template_part('template-parts/research-library-reader',null,['entry'=>$entry]);return ob_get_clean();}
if(($argv[1]??'')==='preview'){
    $slug=$argv[2]??'catalog';echo $slug==='catalog'?catalog_html():reader_html(arcsecs_library_entry($slug));exit;
}
$c=arcsecs_library_catalog();$entries=$c['entries'];check(count($entries)===48,'Document count');check(count(arcsecs_library_seo_entries())===49,'Route count');
check(count(array_filter($entries,fn($e)=>$e['kind']==='report'))===41,'Report count');check(count(array_filter($entries,fn($e)=>$e['kind']==='review'))===5,'Review count');
check(count(arcsecs_library_entry('foundations')['premises'])===12,'Premise count');
foreach(arcsecs_library_seo_entries() as $seo){
    $_SERVER['REQUEST_URI']='/'.$seo['path'];$slug=arcsecs_library_request();check(is_string($slug),'Missing route '.$seo['path']);$entry=arcsecs_library_entry($slug);check($entry['route']===$seo['path'],'Incorrect route');
    $out=reader_html($entry);check(strpos($out,'id="library-reader-title"')!==false,'Missing title');check(strpos($out,'Return to the Scientific Research Library')!==false,'Missing return link');
    check(strpos($out,'__ARCSECS_LIBRARY_')===false,'Unresolved asset placeholder '.$slug);
    if(isset($entry['html_sha256'])){ $base=$root.'/assets/research-library/'.$slug;check(hash_file('sha256',$base.'/body.html')===$entry['html_sha256'],'HTML hash '.$slug);check(hash_file('sha256',$base.'/source.md')===$entry['download_sha256'],'Markdown hash '.$slug);foreach($entry['headings'] as $h)check(strpos($out,'id="'.$h['id'].'"')!==false,'Missing heading '.$slug.' '.$h['id']); }
    ob_start();arcsecs_library_metadata();$meta=ob_get_clean();check(strpos($meta,'rel="canonical"')!==false,'Canonical absent');preg_match('~<script type="application/ld\+json">(.*?)</script>~s',$meta,$match);$data=json_decode($match[1]??'',true);check($data['url']===arcsecs_ai_access_url($seo['path']),'Schema URL mismatch');check(!isset($data['author'])&&!isset($data['identifier']),'Invented author or DOI');
}
foreach(['/research-library/reports/r00/','/research-library/reports/r42/','/research-library/../secret/','/research-library/%2e%2e/','/research-library/reviews/review-7/','/research-library/anything/'] as $path){$_SERVER['REQUEST_URI']=$path;check(arcsecs_library_request()===false,'Unexpected match '.$path);}
foreach(['/','/read-book/','/research-library/','/research-library','/research-library-other/'] as $path){$_SERVER['REQUEST_URI']=$path;check(arcsecs_library_request()===null,'Intercepted unrelated route '.$path);}
$GLOBALS['site_prefix']='/wordpress';$_SERVER['REQUEST_URI']='/wordpress/research-library/reports/r01/';check(arcsecs_library_request()==='reports/r01','Subdirectory route');unset($GLOBALS['site_prefix']);
$_SERVER['REQUEST_URI']='/research-library/';$catalog=catalog_html();check(substr_count($catalog,'data-library-report data-library-search=')===41,'Catalog cards');foreach($entries as $entry)check(strpos($catalog,$entry['route'])!==false,'Missing catalog entry '.$entry['route']);
check(strpos($catalog,'No matching reports')!==false,'Empty state absent');check(strpos($catalog,'foundation-12')!==false,'Premise navigation');
ob_start();arcsecs_library_catalog_metadata();$meta=ob_get_clean();preg_match('~<script type="application/ld\+json">(.*?)</script>~s',$meta,$match);$data=json_decode($match[1]??'',true);check(count($data['itemListElement'])===49,'ItemList count');
check(strpos(reader_html(null),'Research page not found')!==false,'404 template');
check(strpos(reader_html(arcsecs_library_entry('reproducibility')),'maximum subdivisions reached')!==false,'Archived warning absent');
$f=file_get_contents($root.'/functions.php');foreach(['arcsecs_library_render( $library_request )','arcsecs_library_seo_entries()','Scientific library JSON catalog:','arcsecs_library_detail'] as $needle)check(strpos($f,$needle)!==false,'Missing integration '.$needle);
echo "Scientific library smoke test passed: 49 routes, 47 source readers, 48 catalog entries, 12 premises, schema, hash checks, 404 and subdirectory routing.\n";
