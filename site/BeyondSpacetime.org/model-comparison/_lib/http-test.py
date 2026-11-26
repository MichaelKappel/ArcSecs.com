import urllib.parse, urllib.request as u, urllib.error as err, json, sys, re
base=sys.argv[1] if len(sys.argv)>1 else 'http://127.0.0.1:8156'; passed=0
def req(path,data=None,method=None,ctype='application/json'):
    q=u.Request(base+path,data=data,method=method,headers={'Content-Type':ctype});
    try:r=u.urlopen(q,timeout=15)
    except err.HTTPError as e:r=e
    return r.status,r.read(),r.headers
def test(name,fn):
    global passed
    fn();passed+=1;print('PASS',name)
def check(x):assert x
s,b,h=req('/model-comparison/catalog.json');cat=json.loads(b)
test('catalog 15 models, 7 presets',lambda:check(s==200 and len(cat['models'])==15 and len(cat['presets'])==7))
def page(path):
    s,b,h=req(path);check(s==200 and b.count(b'<h1>')==1 and b'rel="canonical"' in b and 'Content-Security-Policy' in h)
for p in ['/model-comparison/','/model-comparison/protocol/']+[f'/model-comparison/?preset={k}' for k in cat['presets']]:test('page '+p,lambda p=p:page(p))
def post(p):return req('/model-comparison/api/',json.dumps(p).encode())
for k,p in cat['presets'].items():
    def run(p=p):
        s,b,h=post({'plan':p});check(s==200);r=json.loads(b)['result'];check(len(r['rows'])==p['samples']);s,b,h=post({'plan':r['plan'],'expected_sha256':r['result_sha256']});check(s==200 and json.loads(b)['replay_match'] is True)
    test('API and replay '+k,run)
    def form(p=p):
        s,b,h=req('/model-comparison/',urllib.parse.urlencode({'recipe':json.dumps(p)}).encode(),ctype='application/x-www-form-urlencoded');check(s==200 and b'id="cmp-result"' in b and 'noindex' in h.get('X-Robots-Tag',''))
    test('no JS form '+k,form)
for k,v in [('samples',100),('metric','bad'),('start',-2),('schema','bad'),('probe',999),('reference',{'gap':100})]:test('reject '+k,lambda k=k,v=v:check(post({'plan':{**cat['presets']['light'],k:v}})[0]==400))
for p,c in [('/model-comparison/_lib/model.php',403),('/model-comparison/missing/',404),('/model-comparison/sitemap.xml',200),('/model-comparison/assets/comparison.js',200),('/model-comparison/assets/comparison.css',200)]:test('HTTP '+p,lambda p=p,c=c:check(req(p)[0]==c))
test('reject wrong content type',lambda:check(req('/model-comparison/api/',b'{}',ctype='text/plain')[0]==400))
test('reject oversized request',lambda:check(req('/model-comparison/api/',b'x'*65537)[0]==400))
test('reject invalid JSON',lambda:check(req('/model-comparison/api/',b'{')[0]==400))
test('reject unsupported method',lambda:check(req('/model-comparison/api/',method='DELETE')[0]==405))
test('live catalog agrees with static',lambda:check(json.loads(req('/model-comparison/api/')[1])==cat))
# Earlier routes are retained and accessible under the same document root.
for p in ['/foundations/','/evidence/','/research/','/research/presets/','/research/protocol/']:test('preserved route '+p,lambda p=p:check(req(p)[0]==200))
print(passed,'passed, 0 failed')
