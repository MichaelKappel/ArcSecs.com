import urllib.request as u,urllib.error as er,json,xml.etree.ElementTree as E,pathlib
import sys
base=sys.argv[1].rstrip('/') if len(sys.argv)>1 else 'http://127.0.0.1:8124';root=pathlib.Path(__file__).resolve().parent.parent;count=0
def get(path,body=None,ctype='application/json',method=None):
 try:r=u.urlopen(u.Request(base+path,data=body,headers={'Content-Type':ctype},method=method),timeout=5)
 except er.HTTPError as e:r=e
 return r.status,r.read().decode(),r.headers
def test(name,ok):
 global count
 assert ok,name;count+=1;print('PASS',name)
urls=[e.text.replace('https://beyondspacetime.org','') for e in E.parse(root/'sitemap.xml').getroot().iter('{http://www.sitemaps.org/schemas/sitemap/0.9}loc')];test('33 unique sitemap URLs',len(urls)==len(set(urls))==33)
for p in urls:
 s,h,headers=get(p);test(p,s==200 and h.count('<h1>')==1 and 'href="https://beyondspacetime.org'+p+'"' in h and 'Content-Security-Policy' in headers)
s,h,_=get('/evidence/ledger/?status=obstruction');test('status filter',h.count('data-record=')==8 and s==200)
s,h,_=get('/evidence/ledger/?q=zzzznotfound');test('empty search',s==200 and 'No matching records' in h)
s,h,_=get('/evidence/ledger/?q=%3Cscript%3E');test('escaped query','value="&lt;script&gt;"' in h)
for path,status in [('/evidence/_lib/ledger.json',403),('/evidence/_lib/tests.php',403),('/evidence/nonexistent/',404)]:test(path,get(path)[0]==status)
for p in ['escape','wall','anchors']:
 s,h,_=get('/evidence/api/',json.dumps({'workbench':p}).encode());r=json.loads(h);test('API '+p,s==200 and len(r['rows'])>100)
 s,h,_=get('/evidence/workbench/'+p+'/',b'p%5B'+({'escape':'ratio','wall':'ceiling','anchors':'percent'}[p]).encode()+b'%5D='+({'escape':'0','wall':'1.1','anchors':'0'}[p]).encode(),'application/x-www-form-urlencoded');test('form '+p,s==200 and 'result-data' in h)
for bad in [b'{',b'[]',b'{"workbench":"unknown"}',b'{"workbench":"escape","parameters":{"ratio":-1}}',b'{"workbench":"escape","parameters":{"ratio":null}}',b'x'*32769]:test('invalid API '+str(bad[:45]),get('/evidence/api/',bad)[0]==400)
test('wrong content type',get('/evidence/api/',b'{}','text/plain')[0]==400);test('read-only ledger',get('/evidence/ledger/',b'{}')[0]==405)
s,h,_=get('/evidence/api/',b'{"record":"wall-crossing"}');test('record lookup',s==200 and json.loads(h)['id']=='wall-crossing')
s,h,headers=get('/evidence/api/',b'{"threadId":"demo","runId":"run-1","messages":[],"state":{"workbench":"escape"}}');events=[json.loads(l[6:]) for l in h.splitlines() if l.startswith('data: ')];test('AG-UI lifecycle',s==200 and [e['type'] for e in events]==['RUN_STARTED','TEXT_MESSAGE_START','TEXT_MESSAGE_CONTENT','TEXT_MESSAGE_END','STATE_SNAPSHOT','RUN_FINISHED'] and 'text/event-stream' in headers['Content-Type'])
s,h,_=get('/evidence/catalog.json');d=json.loads(h);test('catalog consistency',s==200 and len(d['records'])==26 and len(d['gates'])==7 and len(d['workbenches'])==3)
print(count,'passed, 0 failed')
