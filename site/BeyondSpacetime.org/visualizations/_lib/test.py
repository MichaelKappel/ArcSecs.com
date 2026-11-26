import json,sys,pathlib,urllib.request,urllib.error,urllib.parse,hashlib,subprocess,math
base=sys.argv[1] if len(sys.argv)>1 else 'http://127.0.0.1:8161';root=pathlib.Path(__file__).resolve().parents[2];n=0
def get(path,method='GET'):
 try:r=urllib.request.urlopen(urllib.request.Request(base+path,method=method),timeout=10)
 except urllib.error.HTTPError as e:r=e
 return r.status,r.read(),r.headers
def check(ok,name):
 global n
 assert ok,name;n+=1;print('PASS',name)
c=json.loads((root/'visualizations/catalog.json').read_text());check(len(c['scenes'])==9,'nine scenes');check(sum(s['mode']=='time' for s in c['scenes'])==3,'three time-series scenes')
for s in c['scenes']:
 id=s['id'];url=s['url'];st,b,h=get(url);check(st==200 and b.count(b'<h1>')==1 and ('https://beyondspacetime.org'+url).encode() in b,id+' canonical page');check(b'id="viz-plot"' in b and b'Selected-parameter evidence' in b and b'id="viz-data"' in b,id+' server-rendered evidence');check((b'id="viz-play"' in b)==(s['mode']=='time'),id+' playback restricted to time series');check('frame-src \'none\'' in h['Content-Security-Policy'],id+' frame restriction');
 for p in [{},{d['key']:d['min'] for d in s['params']},{d['key']:d['max'] for d in s['params']}]:
  q=urllib.parse.urlencode({'scene':id,**{f'p[{k}]':v for k,v in p.items()}});st,b,h=get('/visualizations/api/?'+q);check(st==200,id+' API parameters '+str(p));r=json.loads(b);m=s['model'].split(':');expected=json.loads(subprocess.check_output(['php','-r','require "research/_lib/model.php"; $a=json_decode($argv[2],true);echo json_encode(str_starts_with($argv[1],"foundation:")?solve(substr($argv[1],11),$a):calc(substr($argv[1],9),$a));',s['model'],json.dumps(p)],cwd=root));check(expected==r['candidate'],id+' exact solver equivalence');check(r['sourceSolverSha256']==hashlib.sha256((root/('foundations' if m[0]=='foundation' else 'evidence')/'_lib/model.php').read_bytes()).hexdigest(),id+' solver hash');check(all(r['domain'][0]<=row[0]<=r['domain'][1] and all(r['domain'][2]<=v<=r['domain'][3] and math.isfinite(v) for v in row[1:]) for side in ['candidate','reference'] for row in r[side]['rows']),id+' shared domain contains both curves');check(all(r['reference']['parameters'][k]==v for k,v in r['referenceOverrides'].items()),id+' reference overrides');check(h.get('X-Robots-Tag','').startswith('noindex'),id+' API noindex');
 k=s['params'][0]['key'];q=urllib.parse.urlencode({f'p[{k}]':s['params'][0]['max']});st,b,h=get(url+'?'+q);check(st==200 and b'Selected-parameter evidence' in b and 'noindex' in h['X-Robots-Tag'],id+' no-JS form calculation');check(get(url+'?p%5Bbad%5D=1')[0]==400,id+' unknown parameter rejected');check(get(url+'?'+urllib.parse.urlencode({f'p[{k}]':-999}))[0]==400,id+' out of range rejected');check(get('/visualizations/assets/'+id+'.svg')[0]==200,id+' generated thumbnail');
for q in ['','?scene=unknown','?scene%5B%5D=photon','?scene=photon&p=x','?scene=photon&p%5Bgap%5D%5B%5D=0','?scene=photon&p%5Bgap%5D=NaN']:
 check(get('/visualizations/api/'+q)[0]==400,'bad API '+q)
check(get('/visualizations/api/','POST')[0]==405,'API rejects POST');check(get('/visualizations/_lib/site.php')[0]==403,'protected source');check(json.loads(get('/museum/api/?kind=visualization')[1])['total']==9,'museum visual filter');print(n,'passed')
