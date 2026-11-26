<?php
declare(strict_types=1);
function lessons():array{static $all;return $all??=array_column(json_decode(file_get_contents(__DIR__.'/lessons.json'),true,512,JSON_THROW_ON_ERROR),null,'slug');}
function solve(string $id,array $input=[]):array{
 $l=lessons()[$id]??throw new InvalidArgumentException('Unknown foundation.');$p=[];foreach($input as $k=>$v)if(!in_array($k,array_column($l['params'],'key'),true))throw new InvalidArgumentException('Unknown parameter.');foreach($l['params'] as $d){$v=array_key_exists($d['key'],$input)?$input[$d['key']]:$d['default'];if(!is_numeric($v)||!is_finite((float)$v)||$v<$d['min']||$v>$d['max'])throw new InvalidArgumentException($d['label'].' is outside its numerical bounds.');$p[$d['key']]=(float)$v;}
 $rows=[];$m=[];$metric=static function($label,$value,$unit='')use(&$m){$m[]=['label'=>$label,'value'=>$value,'unit'=>$unit];};
 $sweep=static function($a,$b,$fn)use(&$rows){for($i=0;$i<=100;$i++){$x=$a+($b-$a)*$i/100;$rows[]=array_merge([$x],$fn($x));}};
 switch($id){
 case 'photon-mass':$f=fn($g)=>sqrt(1-$g*$g);$sweep(0,.95,fn($g)=>[$f($g),$f($g)]);$metric('Group speed / C',$f($p['gap']));$metric('Normalized momentum',$f($p['gap']));$metric('Energy-equivalent mass / (E/C²)',1);break;
 case 'constant-time':$sr=sqrt(1-$p['beta']**2);$sweep(0,$p['duration'],fn($t)=>[$p['rate']*$t,$p['rate']*$p['ratio']*$t,$p['rate']*$sr*$t]);$metric('Reference counts',$p['rate']*$p['duration']);$metric('Candidate counts',$p['rate']*$p['ratio']*$p['duration']);$metric('SR counts',$p['rate']*$sr*$p['duration']);break;
 case 'light-slowing':$f=function($t)use($p){$g=$p['gap'];$momentum=sqrt(1-$g*$g)*exp(-$p['drag']*$t);$e=hypot($momentum,$g);return [$e,$momentum/$e,1-$e];};$sweep(0,$p['duration'],$f);[$e,$v,$loss]=$f($p['duration']);$metric('Final energy / initial',$e);$metric('Final group speed / C',$v);$metric('Transferred energy',$loss);break;
 case 'when':for($i=0;$i<=10;$i++)$rows[]=[$i,$i*$p['period'],$i*$p['period']+$p['delay']];$metric('Emission interval',$p['period'],'s');$metric('Arrival interval',$p['period'],'s');$metric('First arrival',$p['delay'],'s');break;
 case 'where':$d=hypot($p['dx'],$p['dy']);$sweep(-10,10,fn($x)=>[$x,$x+$p['dx'],$d]);$metric('Object A x',$p['shift']);$metric('Object B x',$p['shift']+$p['dx']);$metric('Invariant separation',$d);break;
 case 'physical-existence':$f=fn($a)=>2*$p['energy']*sin($a*M_PI/360);$sweep(0,180,fn($a)=>[$f($a)]);$metric('System rest energy Mc²',$f($p['angle']));$metric('Total energy',2*$p['energy']);$metric('Individual photon invariant mass',0);break;
 case 'spacetime':$f=fn($v)=>sqrt(1-$v*$v);$sweep(0,.99,fn($v)=>[$p['duration']*$f($v),$p['duration']]);$metric('Proper interval',$p['duration']*$f($p['beta']),'s');$metric('Reference interval',$p['duration'],'s');$metric('Proper/reference interval',$f($p['beta']));break;
 case 'fastest-signal':$sweep(0,$p['distance'],fn($x)=>[$x/$p['fraction'],$x]);$metric('Packet arrival',$p['distance']/$p['fraction']);$metric('Reference arrival',$p['distance']);$metric('Arrival difference',$p['distance']*(1/$p['fraction']-1));break;
 case 'separation':$f=fn($v)=>2*$v/(1+$v*$v);$sweep(0,.99,fn($v)=>[2*$v,$f($v),1]);$metric('Coordinate separation rate / C',2*$p['beta']);$metric('SR relative speed / C',$f($p['beta']));$metric('Local causal benchmark / C',1);break;
 case 'cosmic-size':$f=fn($d)=>min(1,($p['reach']/$d)**3);$sweep(.1,20,fn($d)=>[$f($d)]);$metric('Signal reach',$p['reach']);$metric('Assumed domain radius',$p['domain']);$metric('Accessible fraction',$f($p['domain']));break;
 case 'cosmic-age':$f=fn($h)=>2*asinh(sqrt((1-$p['matter'])/$p['matter']))/(3*sqrt(1-$p['matter'])*($h*1000/3.085677581491367e22))/(365.25*86400*1e9);$sweep(45,95,fn($h)=>[$f($h)]);$metric('Modeled age',$f($p['h0']),'Gyr');$metric('Matter fraction',$p['matter']);$metric('Λ fraction',1-$p['matter']);break;
 case 'distance-inference':$f=fn($a)=>10**($a/5);$sweep(-1,3,fn($a)=>[$p['actual']*$f($a),$p['actual']]);$metric('Inferred distance',$p['actual']*$f($p['extinction']),'Mpc');$metric('Calibrated distance',$p['actual'],'Mpc');$metric('Inferred/calibrated size',$f($p['extinction']));break;
 }
 foreach($rows as $r)foreach($r as $v)if(!is_finite($v))throw new RuntimeException('Nonfinite output.');return ['schema'=>'beyondspacetime.foundation-result.v1','version'=>'1.3.0','foundation'=>$id,'parameters'=>$p,'equation'=>$l['equation'],'xLabel'=>$l['xLabel'],'series'=>$l['series'],'rows'=>$rows,'metrics'=>$m,'limitation'=>$l['limitation'],'source'=>$l['source'],'epistemic_status'=>'conditional_educational_control'];
}
