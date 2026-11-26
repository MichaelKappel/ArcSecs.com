import urllib.request, urllib.error, urllib.parse, json, re, xml.etree.ElementTree as ET, sys, pathlib, hashlib, zipfile
base=sys.argv[1] if len(sys.argv)>1 else 'http://127.0.0.1:8160';root=pathlib.Path(__file__).resolve().parents[2]; count=0
def fetch(p,method='GET'):
 try:r=urllib.request.urlopen(urllib.request.Request(base+p,method=method),timeout=10)
 except urllib.error.HTTPError as e:r=e
 return r.status,r.read(),r.headers
def ck(x,name):
 global count
 assert x,name;count+=1;print('PASS',name)
def api(query=''):
 s,b,h=fetch('/museum/api/'+query);assert s==200;return json.loads(b)
c=json.loads((root/'museum/catalog.json').read_text());ck(len(c['entries'])==216,'216 indexed records');ck(len(set(e['id'] for e in c['entries']))==216,'unique IDs');ck(len(c['modules'])==11,'eleven exhibits');
for m,meta in c['sourceCatalogs'].items():ck(hashlib.sha256((root/m/'catalog.json').read_bytes()).hexdigest()==meta['sha256'],m+' source catalog hash')
for p in ['/museum/','/museum/guide/','/museum/search/']:
 s,b,h=fetch(p);ck(s==200 and b.count(b'<h1>')==1 and b'Content-Security-Policy' in str(h).encode(),p+' metadata')
s,b,h=fetch('/museum/');ck(b'b5560LP8Wx0' in b and b'<iframe' not in b and 'youtube-nocookie.com' in h['Content-Security-Policy'],'video opt-in HTML and CSP');ck('noindex' in fetch('/museum/search/')[2]['X-Robots-Tag'],'search noindex');ck("frame-src 'none'" in fetch('/museum/search/')[2]['Content-Security-Policy'],'frame permission restricted');
for kind in set(e['kind'] for e in c['entries']):ck(api('?kind='+kind)['total']==sum(e['kind']==kind for e in c['entries']),'type '+kind)
for lang in ['en','es','fr']:ck(api('?lang='+lang)['total']==sum(e['language']==lang for e in c['entries']),'language '+lang)
ck(api('?q=escape&kind=evidence')['total']>0,'escape evidence query');ck(api('?q=MASA&lang=es')['total']>0,'Spanish case-insensitive search');ck(api('?q='+urllib.parse.quote('ÉNERGIE')+'&lang=fr')['total']>0,'French Unicode case matching');ck(api('?q=photon+mass')['total']>0,'multiword intersection');ck(api('?q=doesnotexist123')['total']==0,'empty result');ck(api('?q=%5B%2E%2A%5D')['total']==0,'regex metacharacters literal');
allids=[]
for p in range(1,12):allids.extend(r['id'] for r in api('?page='+str(p))['results'])
ck(len(allids)==len(set(allids))==216,'pagination no duplicate or missing records');ck(api('?page=999')['filters']['page']==11,'page upper clamp')
for q in ['?kind=bad','?lang=bad','?page=0','?page=-1','?q%5B%5D=x','?q=%FF','?q='+('x'*161)]:ck(fetch('/museum/api/'+q)[0]==400,'reject '+q[:35])
ck(fetch('/museum/api/','POST')[0]==405,'read-only API');ck(fetch('/museum/_lib/site.php')[0]==403,'private source denied');s,b,h=fetch('/museum/search/?q=%3Cscript%3E');ck(s==200 and b'&lt;script&gt;' in b and b'value="<script>"' not in b,'HTML escapes query');
ns='{http://www.sitemaps.org/schemas/sitemap/0.9}';index=ET.fromstring(fetch('/museum/sitemap-index.xml')[1]);pages=set()
for loc in index.iter(ns+'loc'):
 s,b,h=fetch(loc.text.removeprefix('https://beyondspacetime.org'));ck(s==200,'sitemap '+loc.text);pages.update(x.text for x in ET.fromstring(b).iter(ns+'loc'))
for url in sorted(pages):
 p=url.removeprefix('https://beyondspacetime.org');s,b,h=fetch(p);ck(s==200 and b.count(b'<h1>')==1 and url.encode() in b,'canonical '+p)
for p in ['/foundations/','/evidence/','/research/','/model-comparison/','/timeline/','/global/es/']:
 s,b,h=fetch(p);ck(s==200 and b'museum-crossnav' in b and b'/museum/search/' in b,'cross-module navigation '+p)
# Every target, including query-based presets and related links, is actually reachable.
for path in sorted({x['url'] for x in c['entries']}|{r['url'] for x in c['entries'] for r in x['related']}):ck(fetch(path)[0]==200,'record target '+path)
print(f'{count} passed, 0 failed; {len(pages)} distinct canonical sitemap pages')
