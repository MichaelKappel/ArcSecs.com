"""Run against Apache standalone staging with mod_headers enabled. Native requests only."""
import sys, urllib.request, urllib.error, json, pathlib, re, xml.etree.ElementTree as ET
base=sys.argv[1].rstrip('/') if len(sys.argv)>1 else 'http://127.0.0.1:8171';root=pathlib.Path(__file__).resolve().parents[2];n=0
class NoRedirect(urllib.request.HTTPRedirectHandler):
 def redirect_request(self,*a,**k):return None
opener=urllib.request.build_opener(NoRedirect)
def fetch(p,method='GET',data=None,ctype='application/json',headers=None):
 req=urllib.request.Request(base+p,data=data,method=method,headers={'Content-Type':ctype,**(headers or {})})
 try:r=opener.open(req,timeout=10)
 except urllib.error.HTTPError as e:r=e
 return r.status,r.read(),r.headers

def check(ok,name):
 global n
 assert ok,name;n+=1;print('PASS',name)
mods=['evidence','foundations','global','knowledge-graph','model-comparison','museum','offline','research','timeline','visualizations','experiment-design']
for m in mods:
 for path in [f'/{m}/.htaccess',f'/{m}/_lib/.htaccess',f'/{m}/_lib/']:
  check(fetch(path)[0] in [403,404],path+' inaccessible')
 # all module-specific private files must be denied over HTTP
 for p in (root/m/'_lib').rglob('*'):
  if p.is_file():check(fetch('/'+p.relative_to(root).as_posix())[0] in [403,404],'private '+p.relative_to(root).as_posix())
 if m!='offline':check(fetch(f'/{m}/index.php/quality-extra')[0]==404,m+' PATH_INFO denied')
 else:check(fetch('/offline/index.html/quality-extra')[0]==404,'offline PATH_INFO denied')
 status,b,h=fetch('/'+m+'/');check(status==200,m+' page available')
 for key in ['X-Content-Type-Options','Referrer-Policy','X-Frame-Options','Permissions-Policy','Content-Security-Policy']:
  check(len(h.get_all(key,[]))==1,m+' exactly one '+key)
 check('X-Powered-By' not in h,m+' no PHP version header')
 check(('youtube-nocookie.com' in h['Content-Security-Policy'])==(m=='museum'),m+' frame origin isolated')
 check(fetch('/'+m+'/','HEAD')[1]==b'',m+' HEAD response has no body')
check(fetch('/.htaccess')[0] in [403,404],'standalone root config hidden')
for m in ['museum','knowledge-graph','visualizations','timeline']:
 status,b,h=fetch('/'+m+'/api/','POST',b'{}');check(status==405 and json.loads(b).get('error') and 'application/json' in h['Content-Type'],m+' read-only method error JSON')
for m,expected in [('foundations',400),('global',415)]:
 body=b'{"foundation":"photon-mass","language":"en","lesson":"photon-mass","parameters":{}}'
 status,b,h=fetch('/'+m+'/api/','POST',body,'application/json-invalid');check(status==expected,m+' MIME lookalike rejected')
for m in ['foundations','global','research','model-comparison','evidence']:
 status,b,h=fetch('/'+m+'/api/','POST',b'{');check(status==400 and 'no-store' in h.get('Cache-Control','') and json.loads(b).get('error'),m+' malformed JSON rejected')
 check(fetch('/'+m+'/api/','POST',b'x'*270000)[0]==413,m+' transport body ceiling')
for p in ['/foundations/photon-mass/','/global/es/photon-mass/','/evidence/workbench/escape/']:
 status,b,h=fetch(p,'POST',b'p%5Bunknown%5D=1','application/x-www-form-urlencoded');check(status==422 and 'no-store' in h.get('Cache-Control','') and 'noindex' in h.get('X-Robots-Tag',''),p+' invalid POST noncacheable/nonindexable')
for p in ['/museum/api/?q=%00','/knowledge-graph/api/?action=search&q=%00','/visualizations/api/?scene=photon&p[gap][]=0']:
 check(fetch(p)[0]==400,p+' malformed query rejected')
for p,mime in [('/knowledge-graph/graph.jsonld','application/ld+json'),('/knowledge-graph/nodes.csv','text/csv'),('/offline/manifest.webmanifest','application/manifest+json')]:
 status,b,h=fetch(p);check(status==200 and mime in h['Content-Type'],p+' MIME')
status,b,h=fetch('/offline/sw.js');check('no-cache' in h.get('Cache-Control',''), 'service worker revalidation')
status,b,h=fetch('/knowledge-graph/graph.jsonld');tag=h['ETag'];check(fetch('/knowledge-graph/graph.jsonld',headers={'If-None-Match':tag})[0]==304,'conditional graph request')
status,b,h=fetch('/timeline/compare/');check(status==200 and b'name="a"' in b and b'name="b"' in b and 'noindex' in h['X-Robots-Tag'],'timeline empty comparison chooser')
check(fetch('/timeline/compare/?a=review-6&b=review-6')[0]==400,'timeline explicit invalid pair rejected')
check(fetch('/not-an-installed-exhibit/')[0]==404,'genuine standalone 404')
print(n,'passed, 0 failed')
