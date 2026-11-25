<?php
// Isolated reader and metadata checks using the publication smoke-test stubs.
require __DIR__ . '/publications-catalog-test.php';
function esc_html($v) { return htmlspecialchars($v, ENT_QUOTES); }
$GLOBALS['query']=0;
$_SERVER['REQUEST_URI']='/read-book/';
ok(arcsecs_reader_key()==='book','Book route not recognized');
$_SERVER['REQUEST_URI']='/read-scientific-paper/';
ok(arcsecs_reader_key()==='paper','Paper route not recognized');
$_SERVER['REQUEST_URI']='/read-other/';
ok(arcsecs_reader_key()==='','Unknown route accepted');
$GLOBALS['query']='../../wp-config';
ok(arcsecs_reader_key()==='','Unexpected reader key accepted');
$GLOBALS['query']=0;
foreach (arcsecs_reader_catalog() as $key=>$entry) {
    $_SERVER['REQUEST_URI']='/'.$entry['path'];
    $file=$root.'/assets/publications/readers/'.$key.'/body.html';
    ok(is_readable($file),'Missing reader file');
    ob_start(); require $root.'/template-parts/publication-reader.php'; $output=ob_get_clean();
    ok(strpos($output,'Download Markdown source')!==false,'Source download missing');
    ok(strpos($output,'<math')!==false,'MathML missing');
    ok(strpos($output,'__ARCSECS_READER_ASSETS__')===false,'Unresolved asset marker');
    ok(strpos($output,'https://creativecommons.org/publicdomain/zero/1.0/')!==false,'License missing');
    if ($key==='book') ok(strpos($output,'Read the appended scientific review')!==false,'Appended paper link missing');
    ob_start(); arcsecs_reader_metadata(); $meta=ob_get_clean();
    ok(strpos($meta,'https://arcsecs.com/'.$entry['path'])!==false,'Canonical URL missing');
    ok(strpos($meta,'rel="license"')!==false,'License metadata missing');
}
foreach (array('read-book/','read-scientific-paper/','publication-manifest.json','OPEN-KNOWLEDGE.txt') as $link) ok(strpos($default,$link)!==false,'Catalog missing '.$link);
echo "Open knowledge reader smoke test passed.\n";
