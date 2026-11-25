<?php
// Isolated contract smoke test; no live WordPress or remote network requests.
require __DIR__ . '/publications-catalog-test.php';
require $root . '/inc/ai-corpus.php';
function esc_html($v) { return htmlspecialchars($v, ENT_QUOTES); }
function current_user_can($v) { return $GLOBALS['admin'] ?? false; }
function get_option($v) { return $GLOBALS['public'] ?? false; }
$GLOBALS['query']=0;
$_SERVER['REQUEST_URI']='/ai-corpus/';ok(arcsecs_is_corpus_page(),'Corpus route missing');
$_SERVER['REQUEST_URI']='/ai-corpus-unknown/';ok(!arcsecs_is_corpus_page(),'Invalid route accepted');
$GLOBALS['query']='1';ok(arcsecs_is_corpus_page(),'Query route missing');
$GLOBALS['query']=0;
$i=arcsecs_corpus_inventory();ok(count($i['configurations'])===11,'Config count');ok(array_sum(array_column($i['configurations'],'records'))===17279,'Record count');
$zip=$root.'/assets/publications/ai-corpus/ArcSecs_AI_Corpus_v1.0.0.zip';ok(hash_file('sha256',$zip)===$i['source_package_sha256'],'ZIP SHA mismatch');
ob_start();require $root.'/template-parts/ai-corpus.php';$out=ob_get_clean();
foreach($i['configurations'] as $v) ok(strpos($out,$v['url'])!==false,'Missing file URL');
foreach(['17,279','31,253','dataset.jsonld','dataset-inventory.json','ArcSecs_AI_Corpus_v1.0.0.zip','Croissant','not independent experimental validation','No held-out'] as $v) ok(strpos($out,$v)!==false,'Missing '.$v);
ok(strpos($default,'ai-corpus/')!==false,'Publications link missing');
$_SERVER['REQUEST_URI']='/ai-corpus/';ob_start();arcsecs_corpus_metadata();$meta=ob_get_clean();preg_match('~<script type="application/ld\+json">(.*?)</script>~s',$meta,$m);$data=json_decode($m[1]??'',true);ok($data['@type']==='Dataset','Dataset schema missing');ok(count($data['distribution'])===12,'Schema distribution count');ok($data['mainEntityOfPage']==='https://arcsecs.com/ai-corpus/','Landing URL missing');ok(strpos(end($data['distribution'])['contentUrl'],'https://arcsecs.com/')===0,'Local mirror URL not absolute');
ob_start();arcsecs_corpus_admin_page();ok(ob_get_clean()==='','Unauthorized admin output');$GLOBALS['admin']=true;ob_start();arcsecs_corpus_admin_page();$admin=ob_get_clean();ok(strpos($admin,'Matches the v1.0.0 inventory')!==false,'Admin checksum result missing');ok(strpos($admin,'Indexing discouraged')!==false,'Privacy warning missing');
$functions=file_get_contents($root.'/functions.php');foreach(['arcsecs_corpus_seo_entry(),','arcsecs_corpus=1','arcsecs_render_corpus_page();','Local corpus ZIP:'] as $v)ok(strpos($functions,$v)!==false,'Route wiring missing: '.$v);
echo "AI corpus smoke test passed.\n";
