<?php
// Deterministic broad-domain property checks; independent formulas and RK4 comparator.
declare(strict_types=1);
require dirname(__DIR__,2).'/research/_lib/model.php';
$n=0;$fail=0;function ck(bool $ok,string $label):void{global $n,$fail;$n++;if(!$ok){$fail++;echo "FAIL $label\n";}}
function near(float $a,float $b,float $tol=2e-10):bool{return abs($a-$b)<=$tol*max(1.,abs($a),abs($b));}
function m(array $r,int $i):float{return (float)$r['metrics'][$i]['value'];}
mt_srand(2212026);$cases=0;
foreach(\BSPResearch\models() as $id=>$spec){
 for($i=0;$i<64;$i++){$p=[];foreach($spec['params'] as $d){$f=match($i){0=>0.,1=>1.,2=>.5,default=>mt_rand()/mt_getrandmax()};$p[$d['key']]=$d['min']+($d['max']-$d['min'])*$f;if($i===1)$p[$d['key']]=$d['max'];}
 $r=$spec['kind']==='foundation'?solve($spec['id'],$p):calc($spec['id'],$p);$cases++;
 $finite=true;$ordered=true;$prev=-INF;foreach($r['rows'] as $row){$finite=$finite&&count($row)===count($r['series'])+1;foreach($row as $v)$finite=$finite&&is_numeric($v)&&is_finite((float)$v);$ordered=$ordered&&$row[0]>=$prev;$prev=$row[0];}foreach($r['metrics'] as $v)if(is_numeric($v['value']))$finite=$finite&&is_finite((float)$v['value']);ck($finite&&$ordered,"$id finite rectangular ordered output $i");
 $ok=match($spec['id']){
 'photon-mass'=>near(m($r,0)**2+$p['gap']**2,1)&&near(m($r,0),m($r,1)),
 'constant-time'=>near(m($r,0),$p['rate']*$p['duration'])&&near(m($r,1)/m($r,0),$p['ratio'])&&near((m($r,2)/m($r,0))**2+$p['beta']**2,1),
 'light-slowing'=>near(m($r,0)+m($r,2),1)&&m($r,1)>=0&&m($r,1)<=1+1e-14&&m($r,0)>=$p['gap']-1e-14&&near((m($r,0)*m($r,1))**2+$p['gap']**2,m($r,0)**2),
 'when'=>near(m($r,0),m($r,1))&&near(m($r,2),$p['delay']),
 'where'=>near(m($r,1)-m($r,0),$p['dx'])&&near(m($r,2)**2,$p['dx']**2+$p['dy']**2),
 'physical-existence'=>near(m($r,0)**2,2*$p['energy']**2*(1-cos(deg2rad($p['angle']))))&&m($r,2)===0.,
 'spacetime'=>near((m($r,0)/m($r,1))**2+$p['beta']**2,1),
 'fastest-signal'=>near(m($r,0)*$p['fraction'],m($r,1))&&near(m($r,0)-m($r,1),m($r,2)),
 'separation'=>near(m($r,0),2*$p['beta'])&&near(m($r,1)*(1+$p['beta']**2),m($r,0))&&m($r,1)<1,
 'cosmic-size'=>m($r,2)>0&&m($r,2)<=1&&near(m($r,2),min(1,($p['reach']/$p['domain'])**3)),
 'cosmic-age'=>near(m($r,1)+m($r,2),1)&&m($r,0)>0&&near(m($r,0)*$p['h0'],solve('cosmic-age',['h0'=>70,'matter'=>$p['matter']])['metrics'][0]['value']*70),
 'distance-inference'=>near(5*log10(m($r,0)/m($r,1)),$p['extinction'])&&near(m($r,2),m($r,0)/m($r,1)),
 'escape'=>(function()use($r,$p){$prevEsc=-1.;$prevConv=-1.;foreach($r['rows'] as $row){if(!near($row[1]+$row[2]+$row[3],1)||!near($row[2]+$row[3],$row[4])||min(array_slice($row,1))< -1e-12||$row[3]<$prevEsc-1e-12||($p['ratio']>=4&&$row[4]<$prevConv-1e-12))return false;$prevEsc=$row[3];$prevConv=$row[4];}return true;})(),
 'wall'=>(function()use($r,$p){$e=10**$p['loggap'];$s=$p['ceiling'];$bound=m($r,0);return $bound>0&&$bound<=1&&near(($bound/$e)**2*($s*$s-1+$e*$e),$s*$s)&&(($r['metrics'][3]['value']==='Interval exists')===(m($r,1)<m($r,2)));})(),
 'anchors'=>near(m($r,2)/49.59,m($r,3)/7.576)&&near(m($r,0)*hypot(.09,.54),49.59-m($r,2))&&near(m($r,1)*hypot(.082,.076),7.576-m($r,3)),
 default=>false};ck($ok,"$id physical identity $i");}
 echo "Checked 64 bounded configurations: $id\n";
}
// Independent numerical ODE integration: da/du=-y, dy/du=a-(kappa/2G)y.
foreach([0.,1.,3.999999,4.,4.000001,8.,16.] as $ratio){$a=1.;$y=0.;$r=calc('escape',['ratio'=>$ratio,'duration'=>12]);$h=12/400/12;$deriv=fn($a,$y)=>[-$y,$a-$ratio*$y/2];$max=0.;for($i=1;$i<=400;$i++){for($j=0;$j<12;$j++){[$a1,$y1]=$deriv($a,$y);[$a2,$y2]=$deriv($a+$h*$a1/2,$y+$h*$y1/2);[$a3,$y3]=$deriv($a+$h*$a2/2,$y+$h*$y2/2);[$a4,$y4]=$deriv($a+$h*$a3,$y+$h*$y3);$a+=$h*($a1+2*$a2+2*$a3+$a4)/6;$y+=$h*($y1+2*$y2+2*$y3+$y4)/6;}$max=max($max,abs($r['rows'][$i][1]-$a*$a),abs($r['rows'][$i][2]-$y*$y));}ck($max<1e-8,"RK4 comparison ratio $ratio max $max");echo "RK4 ratio $ratio max absolute population difference $max\n";}
// Independent integration of matter+Lambda Friedmann age with a=t^2 substitution.
foreach([.05,.3,.95] as $om){$sum=0.;$N=4096;for($i=0;$i<=$N;$i++){$t=$i/$N;$v=2*$t*$t/sqrt($om+(1-$om)*$t**6);$sum+=($i===0||$i===$N?1:($i%2?4:2))*$v;}$age=$sum/(3*$N)/(70*1000/3.085677581491367e22)/(365.25*86400*1e9);ck(near($age,m(solve('cosmic-age',['matter'=>$om,'h0'=>70]),0)),"independent age quadrature $om");}
echo "$cases configurations; ".($n-$fail)." passed, $fail failed\n";exit($fail?1:0);
