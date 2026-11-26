<?php
declare(strict_types=1);require dirname(__DIR__).'/app/models.php';require dirname(__DIR__).'/app/learning.php';require dirname(__DIR__).'/app/explore.php';$passed=0;$failed=0;
function test($name,$fn){global $passed,$failed;try{$fn();$passed++;echo "PASS $name\n";}catch(Throwable $e){$failed++;echo "FAIL $name: {$e->getMessage()}\n";}}
function check($b,$m='assertion'){if(!$b)throw new RuntimeException($m);}
function near($a,$b,$tol=1e-9){check(abs($a-$b)<=$tol*max(1,abs($b)),"$a != $b");}
function metric($r,$name){foreach($r['metrics'] as $m)if($m['label']===$name)return $m['value'];throw new RuntimeException('missing metric');}
foreach(labs() as $id=>$lab){test("$id default deterministic finite series",function()use($id,$lab){$r=calc($id);check($r===calc($id));check(count($r['rows'])>=2);foreach($r['rows'] as $row){check(count($row)===count($lab['series'])+1);foreach($row as $v)check(is_finite((float)$v));}check(str_starts_with($r['sourceUrl'],'https://arcsecs.com/'));});test("$id rejects unknown and invalid bounds",function()use($id,$lab){foreach([['unknown'=>1],[$lab['params'][0]['key']=>$lab['params'][0]['max']+1],[$lab['params'][0]['key']=>'NaN'],[$lab['params'][0]['key']=>[]]] as $bad){try{calc($id,$bad);throw new RuntimeException('accepted invalid input');}catch(InvalidArgumentException $e){}}});}
test('photon massless loss leaves speed unchanged',function(){$r=calc('photon-aging',['gap'=>0]);near(metric($r,'Final speed / C'),1);near(metric($r,'Final energy / initial'),exp(-1.5));near(metric($r,'Stationary arrival stretch'),1);});
test('tiny photon gap stable deficit',function(){$r=calc('photon-aging',['gap'=>1e-8,'drag'=>log(2),'time'=>1]);$d=metric($r,'Stable speed deficit');check(abs($d-2e-16)<1e-28);});
test('zero drag conserves initial energy',function(){$r=calc('photon-aging',['drag'=>0]);near(metric($r,'Final energy / initial'),1);});
test('equal rate clocks, rest comparator',function(){$r=calc('clocks',['rateB'=>1,'beta'=>0]);near(metric($r,'Clock A count'),10);near(metric($r,'Clock B count'),10);near(metric($r,'SR reference count'),10);});
test('SR 0.6 speed ratio',function(){near(metric(calc('clocks'),'SR reference count'),8);});
test('FLRW age scales inversely with H0',function(){$a=metric(calc('big-bang',['h0'=>60]),'Model age');$b=metric(calc('big-bang',['h0'=>90]),'Model age');near($a/$b,1.5);check($a>12&&$a<18);});
test('FLRW default age reasonable',function(){near(metric(calc('big-bang'),'Model age'),13.461,0.002);});
test('zero acceleration recession null',function(){near(metric(calc('recession',['gradient'=>0]),'Final separation multiplier'),1);});
test('positive linear recession analytic',function(){near(metric(calc('recession',['gradient'=>1,'time'=>2]),'Final separation multiplier'),(exp(2)+exp(-2))/2);});
test('book bubble threshold',function(){$r=calc('bubble',['radius'=>1.6]);near(metric($r,'Selected radial force'),0);near(metric($r,'Nonzero balance radius'),1.6);check(metric($r,'Force direction')==='Balanced');});
test('book bubble inward and outward',function(){near(metric(calc('bubble',['radius'=>1]),'Selected radial force'),-2.4*M_PI);near(metric(calc('bubble',['radius'=>2]),'Selected radial force'),3.2*M_PI);});
test('negative pressure no positive threshold',function(){check(metric(calc('bubble',['pressure'=>-1]),'Nonzero balance radius')==='No positive threshold');});
test('shell no-regulator limit',function(){$r=calc('shell',['alpha'=>0]);foreach($r['rows'] as $row)near($row[1],1);});
test('shell reacceleration and Newtonian null',function(){$r=calc('shell');check(metric($r,'Boundary characteristic')<1);check(metric($r,'At twice shell radius')>1);near(metric($r,'Newtonian interior shell acceleration'),0);});
test('population absorbing zero and deterministic seed',function(){$r=calc('population',['initial'=>0]);near(metric($r,'Final domain count'),0);check(calc('population',['seed'=>100])===calc('population',['seed'=>100]));});
test('population rejects noninteger seed',function(){try{calc('population',['seed'=>1.5]);throw new RuntimeException('accepted fractional seed');}catch(InvalidArgumentException $e){}});
test('distance two null biases',function(){$r=calc('distance',['fraction'=>1,'extinction'=>0]);near(metric($r,'Inferred with ignored extinction'),1);near(metric($r,'Inferred with constant emission speed'),1);});
test('distance independent log and extinction reference',function(){$r=calc('distance',['fraction'=>.5,'extinction'=>1]);near(metric($r,'Inferred with ignored extinction'),10**.2);near(metric($r,'Inferred with constant emission speed'),2*log(2));});
test('outflow zero-gap conventional ratios',function(){$r=calc('outflow',['gap'=>0,'redshift'=>2]);near(metric($r,'Energy ratio'),3);near(metric($r,'Arrival stretch'),3);near(metric($r,'Distance duality ratio'),1);});
test('outflow book finite gap result',function(){$r=calc('outflow',['gap'=>.1,'redshift'=>1]);near(metric($r,'Arrival stretch'),2.04166666667);near(metric($r,'Distance duality ratio'),1.026028,1e-6);});
test('outflow forbidden branch',function(){try{calc('outflow',['gap'=>.4,'redshift'=>2]);throw new RuntimeException('accepted forbidden arrival');}catch(InvalidArgumentException $e){}});
test('drive zero capture removes reaction thrust',function(){$r=calc('drive',['capture'=>0]);near(metric($r,'Mass intake'),0);near(metric($r,'Net thrust'),-10);near(metric($r,'Jet power'),0);});
test('drive power cap and radiator',function(){$r=calc('drive',['density'=>-18,'area'=>1e13,'power'=>100]);check(metric($r,'Jet power')<=.7*99+1e-8);check(metric($r,'Ideal radiating area')>0);});
test('escape zero loss conservation',function(){$r=calc('escape',['ratio'=>0]);foreach($r['rows'] as $row){near($row[1]+$row[2]+$row[3],1);near($row[3],0);}});
test('escape critical conversion nondecreasing',function(){$r=calc('escape');$p=-1;foreach($r['rows'] as $row){check($row[4]>=$p-1e-12);$p=$row[4];near($row[1]+$row[2]+$row[3],1);}check(metric($r,'Monotonicity condition')==='Satisfied');});
test('escape negative control coherent backconversion',function(){$r=calc('escape',['ratio'=>0]);$decrease=false;$p=-1;foreach($r['rows'] as $row){if($row[4]<$p-1e-5)$decrease=true;$p=$row[4];}check($decrease);});
test('every content reference and related concept resolves',function(){foreach(topics() as $t){foreach($t['labs'] as $l)check(isset(labs()[$l]));foreach($t['related'] as $s)check(isset(topics()[$s]));foreach($t['sources'] as $s)check(str_starts_with($s['url'],'https://arcsecs.com/'));}});
test('parallax one AU and one arcsecond',function(){near(metric(calc('parallax',['angle'=>1]),'Geometric distance'),1);});
test('parallax known baseline and proper motion',function(){$r=calc('parallax',['baseline'=>2,'angle'=>.5,'motion'=>.1]);near(metric($r,'Geometric distance'),4);near(metric($r,'Transverse speed'),1.896188);});
test('tidal trace and eigenvalues',function(){$r=calc('tides',['strength'=>.3,'length'=>2]);near(metric($r,'Tensor trace'),0);near(metric($r,'Longitudinal relative acceleration'),1.2);near(metric($r,'Transverse relative acceleration'),-.6);near($r['rows'][90][1],-.6);});
test('tidal null',function(){foreach(calc('tides',['strength'=>0])['rows'] as $row)near($row[1],0);});
foreach(labs() as $id=>$l)test('comparison preset valid '.$id,function()use($id){$r=compare_request(['experiment'=>$id,'left'=>[],'right'=>comparison_presets()[$id]]);check($r['left']===calc($id));check($r['right']===calc($id,comparison_presets()[$id]));check(count($r['differences'])===count($r['left']['metrics']));foreach($r['differences'] as $m)if($m['delta']!==null)near($m['delta'],$m['right']-$m['left']);});
test('identical parameters give zero numerical deltas',function(){$r=compare_request(['experiment'=>'photon-aging','left'=>[],'right'=>[]]);foreach($r['differences'] as $m)near($m['delta'],0);});
test('atlas endpoints and glossary links',function(){foreach(atlas_edges() as [$a,$b]){check(isset(topics()[$a],topics()[$b])&&$a!==$b);}foreach(glossary() as $g)check(isset(topics()[$g['topic']]));});
test('learning paths refer to known topics',function(){foreach(learning_paths() as $p)foreach($p['steps'] as $s)check(isset(topics()[$s[0]]));});
foreach(scenes() as $id=>$s)test('scene binding '.$id,function()use($s){check(isset(labs()[$s['lab']],topics()[$s['topic']]));check(in_array($s['mode'],['static','trajectory'],true));check(calc($s['lab'])['experiment']===$s['lab']);});
echo "$passed passed, $failed failed\n";exit($failed?1:0);
