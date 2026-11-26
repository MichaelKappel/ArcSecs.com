import sys,urllib.request,urllib.error,json,re
base=sys.argv[1].rstrip('/') if len(sys.argv)>1 else 'http://127.0.0.1:8159'; n=0
def get(path):
 try: return urllib.request.urlopen(base+path,timeout=5)
 except urllib.error.HTTPError as e:return e
def check(name,fn):
 global n
 assert fn(),name;n+=1;print('PASS',name)
s=get('/offline/sw.js').read().decode();paths=json.loads(re.search(r'const PATHS=(\[.*?\]);',s).group(1).replace("'",'"'))
for path in paths:check('cache resource '+path,lambda path=path:get(path).status==200 and len(get(path).read())>10)
check('private test directory denied',lambda:get('/offline/_lib/fixtures.php').status==403)
check('canonical and no-JS index',lambda:all(x in get('/offline/').read().decode() for x in ['https://beyondspacetime.org/offline/','<noscript>','/foundations/photon-mass/']))
check('manifest scope',lambda:json.load(get('/offline/manifest.webmanifest'))['scope']=='/offline/')
check('previous global route',lambda:get('/global/es/').status==200)
check('previous research route',lambda:get('/research/').status==200)
check('previous timeline route',lambda:get('/timeline/').status==200)
print(n,'passed, 0 failed')
