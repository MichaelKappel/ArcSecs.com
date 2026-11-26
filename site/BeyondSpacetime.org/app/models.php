<?php
declare(strict_types=1);
function labs(): array {static $x; return $x ??= array_column(json_decode(file_get_contents(__DIR__.'/labs.json'),true,512,JSON_THROW_ON_ERROR),null,'id');}
function topics(): array {static $x;return $x ??= array_column(json_decode(file_get_contents(__DIR__.'/topics.json'),true,512,JSON_THROW_ON_ERROR),null,'slug');}
function calc(string $id,array $input=[]): array {
 $lab=labs()[$id]??null;if(!$lab)throw new InvalidArgumentException('Unknown experiment.');
 $v=[];$keys=array_column($lab['params'],'key');foreach($input as $k=>$value)if(!in_array($k,$keys,true))throw new InvalidArgumentException('Unknown parameter: '.$k);
 foreach($lab['params'] as $p){$n=array_key_exists($p['key'],$input)?$input[$p['key']]:$p['default'];if(!is_numeric($n)||!is_finite((float)$n)||$n<$p['min']||$n>$p['max'])throw new InvalidArgumentException($p['label'].' is outside the permitted numeric range.');$v[$p['key']]=(float)$n;}
 $rows=[];$metrics=[];$note='';$add=function($label,$value,$unit='')use(&$metrics){$metrics[]=['label'=>$label,'value'=>$value,'unit'=>$unit];};
 switch($id){
 case 'photon-aging':
  $g=$v['gap'];$d=$v['drag'];$T=$v['time'];$p0=sqrt(1-$g*$g);
  for($i=0;$i<=100;$i++){$t=$T*$i/100;$p=$p0*exp(-$d*$t);$E=hypot($p,$g);$speed=$p/$E;$rows[]=[$t,$E,$speed,1-$E];}
  $add('Final energy / initial',$E);$add('Final speed / C',$speed);$add('Stable speed deficit',($g/$E)**2/(1+$speed));$add('Transferred energy fraction',1-$E);$add('Stationary arrival stretch',1,'×');break;
 case 'clocks':
  $a=$v['rateA'];$b=$v['rateB'];$sr=$a*sqrt(1-$v['beta']**2);$T=$v['time'];for($i=0;$i<=100;$i++){$t=$T*$i/100;$rows[]=[$t,$a*$t,$b*$t,$sr*$t];}$add('Clock A count',$a*$T,'cycles');$add('Clock B count',$b*$T,'cycles');$add('SR reference count',$sr*$T,'cycles');$add('B/A count ratio',$b/$a);break;
 case 'big-bang':
  $r=.00009;$m=$v['matter'];$l=1-$m-$r;$H=$v['h0']*1000/3.085677581491367e22;$t=0;$rows[]=[0,0];for($i=1;$i<=10000;$i++){$a=($i-.5)/10000;$t+=.0001*$a/sqrt($r+$m*$a+$l*$a**4)/$H/(365.25*86400*1e9);if($i%100===0)$rows[]=[$t,$i/10000];}$add('Model age',$t,'Gyr');$add('Radiation fraction',$r);$add('Λ fraction',$l);break;
 case 'recession':
  $g=$v['gradient'];$T=$v['time'];for($i=0;$i<=100;$i++){$t=$T*$i/100;$r=cosh(sqrt($g)*$t);$rows[]=[$t,$r];}$add('Final separation multiplier',$r,'×');$add('Fractional increase',$r-1);break;
 case 'bubble':
  $p=$v['pressure'];$s=$v['tension'];$R=$v['radius'];for($i=0;$i<=100;$i++){$r=$i*.05;$fp=4*M_PI*$r*$r*$p;$fs=-8*M_PI*$r*$s;$rows[]=[$r,$fp+$fs,$fp,$fs];}$F=4*M_PI*$R*$R*$p-8*M_PI*$R*$s;$add('Selected radial force',$F);$add('Nonzero balance radius',$p>0&&$s>0?2*$s/$p:'No positive threshold');$add('Force direction',abs($F)<1e-9?'Balanced':($F>0?'Outward':'Inward'));break;
 case 'shell':
  $q=$v['q'];$a=$v['alpha'];$fn=function($x)use($q,$a){$z=$q*$x;$I=$x==0?1:($x<=1?sinh($z)/$z:sinh($q)/$q*exp(-$q*($x-1))/$x);return sqrt((1+$a)/(1+$a*$I*$I));};for($i=0;$i<=150;$i++){$x=$i/50;$rows[]=[$x,$fn($x)];}$add('Boundary characteristic',$fn(1),'× center');$add('At twice shell radius',$fn(2),'× center');$add('Newtonian interior shell acceleration',0);break;
 case 'population':
  foreach(['seed','initial'] as $k)if(floor($v[$k])!==$v[$k])throw new InvalidArgumentException('Seed and population must be integers.');$s=(int)$v['seed'];$rand=function()use(&$s){$s=($s*48271)%2147483647;return $s/2147483647;};$n=(int)$v['initial'];$b=$v['birth'];$d=$v['death'];$T=$v['time'];$t=0.;$events=0;$rows[]=[0,$n,$n];$next=INF;while($n>0&&$b+$d>0&&$events<20000&&$n<10000){$next=$t-log($rand())/($n*($b+$d));if($next>$T)break;$t=$next;$expected=$v['initial']*exp(($b-$d)*$t);$rows[]=[$t,$n,$expected];$n+=$rand()<$b/($b+$d)?1:-1;$rows[]=[$t,$n,$expected];$events++;}$cap=$events>=20000||$n>=10000;$end=$cap?$t:$T;if(!$cap)$rows[]=[$T,$n,$v['initial']*exp(($b-$d)*$T)];$add('Final domain count',$n);$add('Expected domain count',$v['initial']*exp(($b-$d)*$end));$add('Events',$events);$add('Elapsed',$end);if($cap)$note='Resource cap reached: trajectory terminated early.';break;
 case 'distance':
  $D=$v['actual'];$f=$v['fraction'];$ratio=fn($x)=>$x==1?1:-log1p($x-1)/(1-$x);for($i=0;$i<=100;$i++){$x=.05+.95*$i/100;$rows[]=[$x,$ratio($x)];}$ext=10**($v['extinction']/5);$add('Actual distance',$D,'Mpc');$add('Inferred with ignored extinction',$D*$ext,'Mpc');$add('Inferred with constant emission speed',$D*$ratio($f),'Mpc');$add('Travel-time bias',100*($ratio($f)-1),'%');break;
 case 'outflow':
  $g=$v['gap'];$z=$v['redshift'];$W=1/(1+$z);if($W<=$g)throw new InvalidArgumentException('The selected arrival energy is at or below the rest-energy gap.');$fn=function($x)use($g){$w=1/(1+$x);return 1+$w*(1-$w)/($w*$w-$g*$g);};$max=$g>0?min(3, .99/$g-1):3; $max=max($z,$max);for($i=0;$i<=100;$i++){$x=$max*$i/100;$rows[]=[$x,$fn($x),1+$x];}$A=$fn($z);$S=sqrt((1-$g*$g)/($W*$W-$g*$g));$add('Energy ratio',1+$z);$add('Arrival stretch',$A);$add('Distance duality ratio',$S*sqrt((1+$z)*$A)/(1+$z)**2);$add('Arrival relative group speed / C',sqrt(1-($g/$W)**2));break;
 case 'drive':
  $rho=10**$v['density'];$speed=$v['speed']*1000;$md=$rho*$v['area']*$v['capture']*$speed;$fn=function($P)use($md,$speed){$ex=$md>0?min(1e6,sqrt(2*max(0,$P*1e6-1e6)*.7/$md)):0;$jet=.5*$md*$ex*$ex;$heat=.5*$md*$speed*$speed+1e6+$jet/.7-$jet;return [$md*($ex-$speed)-10,$ex,$jet,$heat];};for($i=0;$i<=100;$i++){$x=1+999*$i/100;$rows[]=[$x,$fn($x)[0]];}[$thrust,$ex,$jet,$heat]=$fn($v['power']);$add('Mass intake',$md,'kg/s');$add('Exhaust speed',$ex/1000,'km/s');$add('Net thrust',$thrust,'N');$add('Jet power',$jet/1e6,'MW');$add('Waste heat',$heat/1e6,'MW');$add('Ideal radiating area',$heat/(.9*5.670374419e-8*($v['temperature']**4-3**4)),'m²');break;
 case 'parallax':
  $b=$v['baseline'];$p=$v['angle'];$d=$b/$p;for($i=0;$i<=120;$i++){$x=.001*pow(10000,$i/120);$rows[]=[$x,$b/$x];}$add('Geometric distance',$d,'pc');$add('Transverse speed',4.74047*$v['motion']*$d,'km/s');$add('Angle', $p* M_PI/648000,'rad');break;
 case 'tides':
  $k=$v['strength'];$L=$v['length'];for($i=0;$i<=180;$i++){$c=cos($i*M_PI/180);$rows[]=[$i,$k*$L*(3*$c*$c-1)];}$add('Longitudinal gradient',2*$k);$add('Transverse gradient',-$k);$add('Tensor trace',2*$k-$k-$k);$add('Longitudinal relative acceleration',2*$k*$L);$add('Transverse relative acceleration',-$k*$L);break;
 case 'escape':
  $G=$v['coupling'];$h=$v['ratio']/4;$T=$v['time'];for($i=0;$i<=200;$i++){$t=$T*$i/200;$u=$G*$t;if(abs($h-1)<1e-10){$a=(1+$u)*exp(-$u);$y=$u*exp(-$u);}elseif($h<1){$l=sqrt(1-$h*$h);$a=exp(-$h*$u)*(cos($l*$u)+$h*sin($l*$u)/$l);$y=exp(-$h*$u)*sin($l*$u)/$l;}else{$l=sqrt($h*$h-1);$slow=exp(-$u/($h+$l));$fast=exp(-($h+$l)*$u);$a=($slow+$fast)/2+$h*($slow-$fast)/(2*$l);$y=($slow-$fast)/(2*$l);}$A=$a*$a;$B=$y*$y;$esc=max(0,1-$A-$B);$rows[]=[$t,$A,$B,$esc,1-$A];}$add('Escaped population',$esc);$add('Total converted',1-$A);$add('Monotonicity condition',$v['ratio']>=4?'Satisfied':'Not satisfied');break;
 }
 foreach($rows as $row)foreach($row as $n)if(!is_finite((float)$n))throw new RuntimeException('Nonfinite numerical result.');foreach($metrics as $m)if(is_float($m['value'])&&!is_finite($m['value']))throw new RuntimeException('Nonfinite metric.');
 return ['schema'=>'beyondspacetime.experiment-result.v1','experiment'=>$id,'version'=>'1.2.0','parameters'=>$v,'xLabel'=>$lab['xLabel'],'series'=>$lab['series'],'rows'=>$rows,'metrics'=>$metrics,'note'=>$note,'equation'=>$lab['equation'],'limitation'=>$lab['limitation'],'source'=>$lab['source'],'sourceUrl'=>$lab['sourceUrl']];
}
