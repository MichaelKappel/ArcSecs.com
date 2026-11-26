import urllib.request as u,urllib.error as er,json,urllib.parse,sys,copy,pathlib,xml.etree.ElementTree as ET
base=sys.argv[1] if len(sys.argv)>1 else 'http://127.0.0.1:8135';n=0

def get(path,body=None,ctype='application/json',method=None):
 try:r=u.urlopen(u.Request(base+path,data=body,headers={'Content-Type':ctype},method=method),timeout=10)
 except er.HTTPError as e:r=e
 return r.status,r.read().decode(),r.headers

def test(name,ok):
 global n
 assert ok,name;n+=1;print('PASS',name,flush=True)

def post(d):return get('/research/api/',json.dumps(d).encode())
for path in ['/research/','/research/presets/','/research/protocol/']:
 s,h,headers=get(path);test(path,s==200 and h.count('<h1>')==1 and 'href="https://beyondspacetime.org'+path+'"' in h and 'Content-Security-Policy' in headers)
s,h,headers=get('/research/catalog.json');cat=json.loads(h);test('public catalog',s==200 and len(cat['models'])==15 and len(cat['presets'])==5 and len(cat['records'])==26 and len(cat['gates'])==7)
s,h,_=get('/research/api/');test('live catalog matches static',all(json.loads(h)[k]==v for k,v in cat.items()))
s,h,_=get('/research/sitemap.xml');test('three sitemap routes',s==200 and len(list(ET.fromstring(h)))==3)
for path,code in [('/research/_lib/model.php',403),('/research/_lib/tests.php',403),('/evidence/_lib/ledger.json',403),('/foundations/_lib/lessons.json',403),('/research/not-a-page/',404)]:test('protected or unknown '+path,get(path)[0]==code)
for path in ['/research/assets/research.js','/research/assets/research.css','/foundations/','/evidence/']:test('asset or previous hub '+path,get(path)[0]==200)
for id,p in cat['presets'].items():
 s,h,headers=get('/research/?preset='+id);test('preset '+id,s==200 and 'noindex' in headers['X-Robots-Tag'])
 s,h,_=post({'plan':p['plan']});r=json.loads(h)['result'];test('execute '+id,s==200 and len(r['runs'])==len(p['plan']['cases']))
plan=cat['presets']['escape']['plan'];s,h,_=post({'plan':plan});r=json.loads(h)['result'];digest=r['result_sha256'];test('replay same hash',json.loads(post({'plan':r['recipe'],'expected_sha256':digest})[1])['replay_match'] is True);test('replay wrong hash',json.loads(post({'plan':r['recipe'],'expected_sha256':'0'*64})[1])['replay_match'] is False)
s,h,headers=get('/research/',urllib.parse.urlencode({'recipe':json.dumps(plan),'action':'run'}).encode(),'application/x-www-form-urlencoded');test('no-JS form output',s==200 and 'result-data' in h and h.count('class="panel case-output"')==3 and 'noindex' in headers['X-Robots-Tag'])
s,h,headers=get('/research/',urllib.parse.urlencode({'recipe':json.dumps(plan),'action':'download'}).encode(),'application/x-www-form-urlencoded');test('no-JS JSON download',s==200 and json.loads(h)['result_sha256']==digest and 'attachment' in headers['Content-Disposition'])
p=copy.deepcopy(plan);p['title']='<script>alert(1)</script>';s,h,_=get('/research/',urllib.parse.urlencode({'recipe':json.dumps(p)}).encode(),'application/x-www-form-urlencoded');test('user content escaped',s==200 and '<script>alert(1)</script>' not in h and '&lt;script&gt;' in h)
for body in [b'{',b'[]',b'{}',b'x'*65537,b'{"plan":{"schema":"fake"}}',json.dumps({'plan':plan,'expected_sha256':'bad'}).encode(),json.dumps({'plan':plan,'results':[]}).encode(),json.dumps({'threadId':'<bad>','runId':'r','messages':[],'state':{'plan':plan}}).encode()]:test('invalid API '+str(body[:42]),get('/research/api/',body)[0]==400)
test('wrong content type',get('/research/api/',b'{}','text/plain')[0]==400);test('wrong API method',get('/research/api/',method='DELETE')[0]==405);test('read-only presets',get('/research/presets/',b'{}')[0]==405)
s,h,headers=post({'threadId':'t','runId':'r','messages':[],'state':{'plan':plan,'expected_sha256':digest}});ev=[json.loads(x[6:]) for x in h.splitlines() if x.startswith('data: ')];test('SSE event sequence',s==200 and 'text/event-stream' in headers['Content-Type'] and [x['type'] for x in ev]==['RUN_STARTED']+['STEP_STARTED','STEP_FINISHED']*3+['TEXT_MESSAGE_START','TEXT_MESSAGE_CONTENT','TEXT_MESSAGE_END','STATE_SNAPSHOT','RUN_FINISHED']);test('SSE step pairing',[x['stepName'] for x in ev if x['type']=='STEP_STARTED']==[x['stepName'] for x in ev if x['type']=='STEP_FINISHED']==['case-1','case-2','case-3']);test('SSE result parity and replay',ev[-2]['snapshot']['result']==r and ev[-2]['snapshot']['replay_match'] is True and ev[0]['runId']==ev[-1]['runId']=='r')
print(n,'passed, 0 failed')
