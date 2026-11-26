<?php
// Local testing only: php -S 127.0.0.1:8124 evidence/_lib/dev-router.php
if(PHP_SAPI!=='cli-server'){http_response_code(403);exit;}
$path=rawurldecode(parse_url($_SERVER['REQUEST_URI'],PHP_URL_PATH)??'');if(preg_match('~^/evidence/_lib(?:/|$)~',$path)){http_response_code(403);exit;}return false;
