import json,sys,urllib.request,urllib.error,urllib.parse,hashlib,pathlib
from bs4 import BeautifulSoup
base=sys.argv[1].rstrip('/');n=0
root=pathlib.Path(__file__).resolve().parents[1]
def get(path,method='GET'):
 try:r=urllib.request.urlopen(urllib.request.Request(base+path,method=method),timeout=5)
 except urllib.error.HTTPError as e:r=e
 return r.status,r.read(),r.headers
def ck(v,msg):
 global n
 assert v,msg;n+=1;print('PASS',msg)
for path in ['/universal-time/','/universal-time/dinner/','/universal-time/benchmarks/']:
 s,b,h=get(path);soup=BeautifulSoup(b,'html.parser');ck(s==200 and b'</html>' in b and len(soup.find_all('h1'))==1,path+' complete');ck(soup.select_one('link[rel=canonical]')['href']=='https://beyondspacetime.org'+path,path+' canonical');ck("frame-src 'none'" in h['Content-Security-Policy'],path+' CSP');ck(soup.select_one('script[src^="/universal-time/assets/time.js"]') is not None,path+' local JS');
for model,path,params in [('dinner','dinner',{}),('dinner','dinner',{'duration':8,'clock_out':.5,'clock_back':1,'bio_out':.25,'bio_back':2}),('benchmark','benchmarks',{}),('benchmark','benchmarks',{'multiplier':0})]:
 q=urllib.parse.urlencode(params);s,b,h=get('/universal-time/'+path+'/'+('?' + q if q else ''));html=BeautifulSoup(b,'html.parser');a=json.loads(html.select_one('#time-data').string);s2,b2,h2=get('/universal-time/api/?'+urllib.parse.urlencode({'model':model,**params}));r=json.loads(b2);ck(s==s2==200 and a==r,model+' form/API parity '+q);ck(r['solver_sha256']==hashlib.sha256((root/'_lib/model.php').read_bytes()).hexdigest(),model+' source hash');ck('no-store' in h2['Cache-Control'],model+' API not cached');
 if q:ck('noindex' in h['X-Robots-Tag'],model+' parameter variant noindex')
for path in ['?model=bad','?model=dinner&duration=0','?model=dinner&clock_out%5B%5D=1','?model=benchmark&multiplier=4','?model%5B%5D=dinner','?model=dinner&unknown=1','?duration=3']:
 s,b,h=get('/universal-time/api/'+path);ck(s==400 and 'error' in json.loads(b),'reject '+path)
ck(get('/universal-time/dinner/?duration=0')[0]==400,'invalid form status');ck(get('/universal-time/api/','POST')[0]==405,'read-only method');ck(get('/universal-time/.htaccess')[0]==403,'hidden file denied');ck(get('/universal-time/_lib/model.php')[0]==403,'internal model denied');ck(get('/universal-time/index.php/extra')[0]==404,'unexpected path denied');ck(json.loads(get('/universal-time/api/')[1])==json.loads((root/'catalog.json').read_text()),'catalog parity');
ck(json.loads(get('/museum/api/?kind=time')[1])['total']==4,'museum record discovery');ck(json.loads(get('/knowledge-graph/api/?action=node&id=time%3Adinner')[1]) is not None,'graph node discovery');print(f'{n} passed, 0 failed')
