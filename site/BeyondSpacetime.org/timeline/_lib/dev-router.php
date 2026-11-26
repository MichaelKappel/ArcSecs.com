<?php
if(PHP_SAPI!=='cli-server'){http_response_code(403);exit;}
$path=rawurldecode(parse_url($_SERVER['REQUEST_URI']??'/',PHP_URL_PATH)??'/');if(preg_match('~/(?:_lib)(?:/|$)~i',$path)){http_response_code(403);exit;}return false;
