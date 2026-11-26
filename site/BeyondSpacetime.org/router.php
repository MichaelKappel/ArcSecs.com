<?php
// For PHP's local development server only: php -S 127.0.0.1:8080 router.php
$path=parse_url($_SERVER['REQUEST_URI']??'/',PHP_URL_PATH)??'/';
if($path==='/favicon.ico'&&is_file(__DIR__.$path))return false;
if(preg_match('~^/assets/[a-zA-Z0-9._-]+$~D',$path)&&is_file(__DIR__.$path))return false;
if(preg_match('~^/(?:app|tests)(?:/|$)|^/(?:router\.php|README\.md|DEPLOYMENT\.md|LICENSE\.md|TEST-RESULTS\.txt|SHA256SUMS\.txt)$~i',$path)||preg_match('~^/\.(?!well-known/)~',$path)){http_response_code(403);echo 'Forbidden';return true;}
require __DIR__.'/index.php';
