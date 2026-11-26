<?php
// Test-only fixture generator, never a public endpoint.
if(PHP_SAPI!=='cli'){http_response_code(403);exit;}
require dirname(__DIR__,2).'/foundations/_lib/model.php';
$cases=[];foreach(lessons() as $id=>$l){$sets=[[], $l['control']];foreach(['min','max'] as $k)$sets[]=array_column($l['params'],$k,'key');for($i=1;$i<=8;$i++){$p=[];foreach($l['params'] as $j=>$d)$p[$d['key']]=$d['min']+($d['max']-$d['min'])*(($i*13+$j*7)%31)/30;$sets[]=$p;}foreach($sets as $p)$cases[]=['id'=>$id,'parameters'=>(object)$p,'result'=>solve($id,$p)];}echo json_encode($cases,JSON_THROW_ON_ERROR);
