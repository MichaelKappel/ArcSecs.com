<?php
if(PHP_SAPI!=='cli-server'){http_response_code(403);exit;}
$p=rawurldecode(parse_url($_SERVER['REQUEST_URI']??'/',PHP_URL_PATH)??'');if(preg_match('~(?:^|/)(?:_lib|\.[^/]+)(?:/|$)~i',$p)){http_response_code(403);exit('Forbidden');}return false;
