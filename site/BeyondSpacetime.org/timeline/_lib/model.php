<?php
declare(strict_types=1);
namespace BSPTimeline;
const ROOT='/timeline/'; const ORIGIN='https://beyondspacetime.org';
function catalog():array{static $c;return $c??=json_decode(file_get_contents(dirname(__DIR__).'/catalog.json'),true,32,JSON_THROW_ON_ERROR);}
function records():array{static $r;return $r??=array_column(catalog()['records'],null,'id');}
function branches():array{$v=array_unique(array_column(records(),'branch'));sort($v);return $v;}
function filters(array $q):array{$out=[];foreach(['q','track','branch','status'] as $k){$v=$q[$k]??'';if(!is_string($v)||strlen($v)>160||!preg_match('//u',$v))throw new \InvalidArgumentException('Invalid '.$k);$out[$k]=trim($v);}foreach(['track'=>array_keys(catalog()['tracks']),'branch'=>branches(),'status'=>array_keys(catalog()['statuses'])] as $k=>$allowed)if($out[$k]!==''&&!in_array($out[$k],$allowed,true))throw new \InvalidArgumentException('Unknown '.$k);return $out;}
function select(array $q):array{$f=filters($q);return array_values(array_filter(records(),function($r)use($f){foreach(['track','branch','status'] as $k)if($f[$k]!==''&&$f[$k]!==$r[$k])return false;return $f['q']===''||stripos(implode(' ',[$r['id'],$r['title'],$r['original_title']??'',$r['summary'],$r['branch'],$r['date']??'']),$f['q'])!==false;}));}
function compare(array $q):array{$a=$q['a']??'';$b=$q['b']??'';if(!is_string($a)||!is_string($b)||$a===$b||!isset(records()[$a],records()[$b]))throw new \InvalidArgumentException('Select two different known records.');return [records()[$a],records()[$b]];}
function date_label(array $r):string{return $r['track']==='reports'?strtoupper($r['id']).' · Archive sequence':($r['date']??'Date not established');}
function adjacent(array $r):array{$list=array_values(array_filter(records(),fn($x)=>$x['track']===$r['track']));$i=array_search($r['id'],array_column($list,'id'),true);return [$list[$i-1]??null,$list[$i+1]??null];}
