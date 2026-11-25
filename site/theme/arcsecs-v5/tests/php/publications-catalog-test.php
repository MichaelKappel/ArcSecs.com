<?php
// Isolated rendering smoke test; not a WordPress integration test.
define('ABSPATH', __DIR__);
function add_action(...$a) {}
function get_theme_mod($key,$default='') { return $GLOBALS['settings'][$key] ?? $default; }
function wp_parse_url($url,$part) { return parse_url($url,$part); }
function esc_url_raw($url,$protocols=null) { return filter_var($url,FILTER_VALIDATE_URL) ? $url : ''; }
function esc_url($url) { return htmlspecialchars($url,ENT_QUOTES); }
function esc_attr($value) { return htmlspecialchars($value,ENT_QUOTES); }
function wp_json_encode($value,$flags=0) { return json_encode($value,$flags); }
function get_template_directory() { return dirname(__DIR__,2); }
function get_template_directory_uri() { return 'https://arcsecs.com/wp-content/themes/arcsecs-v5'; }
function arcsecs_ai_access_url($path) { return 'https://arcsecs.com/' . $path; }
function arcsecs_home_social_image_url() { return 'https://arcsecs.com/social.png'; }
function arcsecs_with_base_schema_graph($graph) { return $graph; }
function get_query_var($key) { return $GLOBALS['query'] ?? 0; }
function wp_unslash($v) { return $v; }
function untrailingslashit($v) { return rtrim($v,'/'); }
function home_url($v) { return 'https://arcsecs.com'.$v; }
function ok($test,$msg) { if (!$test) { fwrite(STDERR,$msg."\n"); exit(1); } }
$root=dirname(__DIR__,2); require $root.'/inc/publications.php';
$GLOBALS['settings']=array();
function render_catalog($root) { ob_start(); require $root.'/template-parts/publications.php'; return ob_get_clean(); }
$default=render_catalog($root);
ok(strpos($default,'https://www.amazon.com/dp/B0HST2C7LK/')!==false,'Amazon link missing');
ok(strpos($default,'Download free book PDF')!==false,'Bundled book PDF missing');
ok(strpos($default,'Download free EPUB')!==false,'Bundled EPUB missing');
ok(arcsecs_publications_download_url('book_pdf')==='https://arcsecs.com/wp-content/themes/arcsecs-v5/assets/publications/BEYOND_SPACETIME.pdf','Incorrect default PDF URL');
ok(arcsecs_publications_download_url('zenodo')==='https://zenodo.org/records/24543781','Default Zenodo missing');
ok(strpos($default,'https://zenodo.org/records/24543781')!==false,'Default archive link not rendered');
ok(strpos($default,'review6.bib')!==false && strpos($default,'review6.ris')!==false,'Citation downloads missing');
ok(strpos($default,'Download scientific paper (PDF)')!==false,'Bundled paper missing');
ok(strpos($default,'14,563')!==false,'Dataset link/metadata missing');
ok(strpos($default,'129 pages')!==false,'Paper metadata missing');
$GLOBALS['settings']=['arcsecs_publications_book_pdf'=>'https://arcsecs.com/book.pdf','arcsecs_publications_book_epub'=>'https://arcsecs.com/book.epub','arcsecs_publications_paper_pdf'=>'https://arcsecs.com/paper.pdf','arcsecs_publications_zenodo'=>'https://zenodo.org/records/123','arcsecs_publications_support'=>'https://example.org/support'];
$enabled=render_catalog($root);
ok(arcsecs_publications_download_url('book_pdf')==='https://arcsecs.com/book.pdf','PDF override failed');
foreach (array('Download free book PDF','Download free EPUB','Download scientific paper (PDF)','Zenodo research record','Other ways to support ArcSecs') as $label) ok(strpos($enabled,$label)!==false,'Missing approved button '.$label);
ok(arcsecs_publications_sanitize_url('javascript:alert(1)')==='','Unsafe scheme accepted');
ok(arcsecs_publications_sanitize_url('http://example.org')==='','Non-HTTPS accepted');
$_SERVER['REQUEST_URI']='/publications/';ok(arcsecs_is_publications_page(),'Route not recognized');
ob_start();arcsecs_publications_metadata();$meta=ob_get_clean();preg_match('~<script type="application/ld\+json">(.*?)</script>~s',$meta,$m);$graph=json_decode($m[1]??'',true);ok(isset($graph['@graph'][1]['encoding'][0]),'Structured book encoding missing');ok(isset($graph['@graph'][2]['encoding']),'Paper encoding missing');ok(!isset($graph['@graph'][2]['author']),'Paper author inferred');ok($graph['@graph'][2]['subjectOf']['url']==='https://zenodo.org/records/123','Archive override missing from metadata');ok(!isset($graph['@graph'][2]['identifier']),'Unverified DOI inferred');
if (isset($argv[1]) && $argv[1]==='preview') echo $enabled; else echo "Publications catalog smoke test passed (default and enabled links, route, unsafe URLs, schema).\n";
