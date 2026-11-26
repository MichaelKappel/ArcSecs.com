<?php
require __DIR__.'/../../_lib/site.php';
if(!in_array($_SERVER['REQUEST_METHOD']??'GET',['GET','HEAD'],true)){header('Allow: GET, HEAD');http_response_code(405);exit;}
\BSPTimeline\record_page('r21');
