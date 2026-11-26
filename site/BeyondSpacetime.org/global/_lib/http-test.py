import json,urllib.request,urllib.error,urllib.parse,sys,xml.etree.ElementTree as ET,re
base=sys.argv[1].rstrip('/') if len(sys.argv)>1 else 'http://127.0.0.1:8158';origin='https://beyondspacetime.org';count=0
def req(path,body=None,method=None,ctype='application/json'):
 try:r=urllib.request.urlopen(urllib.request.Request(base+path,data=body,method=method,headers={'Content-Type':ctype}),timeout=10)
 except urllib.error.HTTPError as e:r=e
 return r.status,r.read(),r.headers
def check(name,fn):
 global count
 fn();count+=1;print('PASS '+name)
def ok(v):assert v
cat=json.loads(req('/global/catalog.json')[1]);langs=cat['languages'];sitemap=ET.fromstring(req('/global/sitemap.xml')[1]);ns={'s':'http://www.sitemaps.org/schemas/sitemap/0.9','x':'http://www.w3.org/1999/xhtml'}
urls={e.find('s:loc',ns).text:e for e in sitemap};check('43 unique canonical URLs',lambda:ok(len(urls)==43))
for url,e in urls.items():
 path=url.removeprefix(origin)
 def page():
  s,b,h=req(path);text=b.decode();assert s==200 and text.count('<h1>')==1 and f'rel="canonical" href="{url}"' in text and 'Content-Security-Policy' in h
  if path!='/global/':
   lang=path.split('/')[2];assert f'<html lang="{lang}">' in text
   alts=e.findall('x:link',ns);assert len(alts)==4
   for a in alts:
    href=a.attrib['href'];code=a.attrib['hreflang'];assert href in urls and f'hreflang="{code}" href="{href}"' in text
    assert url in [v.attrib['href'] for v in urls[href].findall('x:link',ns)]
 check('route metadata and reciprocal alternates '+path,page)
for lang,group in langs.items():
 for l in group['lessons']:
  id=l['id'];path=l['url'].removeprefix(origin)
  def form():
   p={f'p[{p["key"]}]':p['default'] for p in l['parameter_schema']};s,b,h=req(path,urllib.parse.urlencode(p).encode(),'POST','application/x-www-form-urlencoded');assert s==200 and h['X-Robots-Tag']=='noindex';m=re.search(rb'<script type="application/json" id="gresult">(.*?)</script>',b,re.S);r=json.loads(m.group(1));assert r['language']==lang and r['lesson']==id
   s,b,h=req('/global/api/',json.dumps(dict(language=lang,lesson=id,parameters={p['key']:p['default'] for p in l['parameter_schema']})).encode(),'POST');assert s==200 and json.loads(b)==r
   s,b,h=req('/global/api/?language='+lang+'&lesson='+id);assert s==200 and json.loads(b)['original_statement']==l['original_statement']
  check(f'{lang} {id} no-JS form, API and source identity',form)
for path,status in [('/global/_lib/translations.json',403),('/global/_lib/site.php',403),('/global/api/?language=zz',400),('/global/api/?lesson=nope',404)]:check('status '+path,lambda:ok(req(path)[0]==status))
for body,status in [(b'{',400),(b'{"language":"es","lesson":"nope"}',400),(b'{"language":"fr","lesson":"separation","parameters":{"beta":2}}',400),(b'x'*32769,413)]:check('invalid POST '+str(status),lambda:ok(req('/global/api/',body,'POST')[0]==status))
check('wrong content type',lambda:ok(req('/global/api/',b'{}','POST','text/plain')[0]==415));check('POST hub rejected',lambda:ok(req('/global/es/',b'','POST')[0]==405));check('invalid localized form',lambda:ok(req('/global/es/separation/',b'p%5Bbeta%5D=2','POST','application/x-www-form-urlencoded')[0]==422));check('API method rejected',lambda:ok(req('/global/api/',method='DELETE')[0]==405));print(f'{count} passed, 0 failed')
