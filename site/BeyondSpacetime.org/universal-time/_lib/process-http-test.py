import json,sys,urllib.request,urllib.error,urllib.parse,hashlib,pathlib,re
from bs4 import BeautifulSoup
base=sys.argv[1].rstrip('/');root=pathlib.Path(__file__).resolve().parents[2];n=0
class NoRedirect(urllib.request.HTTPRedirectHandler):
 def redirect_request(self,*a,**k): return None
op=urllib.request.build_opener(NoRedirect)
def get(path,method='GET'):
 try:r=op.open(urllib.request.Request(base+path,method=method),timeout=10)
 except urllib.error.HTTPError as e:r=e
 return r.status,r.read(),r.headers
def ck(v,msg):
 global n
 assert v,msg;n+=1;print('PASS',msg)
s,b,h=get('/');soup=BeautifulSoup(b,'html.parser');ck(s==200 and soup.select_one('link[rel=canonical]')['href']=='https://beyondspacetime.org/' and len(soup.find_all('h1'))==1,'actual root homepage');ck(b'b5560LP8Wx0' in b and b'<iframe' not in b and 'youtube-nocookie.com' in h['Content-Security-Policy'],'root opt-in video');ck(soup.select_one('link[rel=icon]')['href']=='/favicon.ico','root compass favicon');ck(get('/index.php')[0]==301,'root index canonical redirect');ck(get('/','HEAD')[1]==b'','root HEAD');ck(get('/','POST')[0]==405,'root method restriction');ck(get('/?ref=x')[2]['X-Robots-Tag'].startswith('noindex'),'root query noindex');ck(get('/favicon.ico')[1][:4]==b'\0\0\1\0','valid ICO');
for model,params in [('rates',{}),('rates',{'speed':0,'height':0}),('rates',{'height':100,'alpha_a':2}),('synchronization',{}),('synchronization',{'outbound':5,'return':5}),('synchronization',{'deadline':1,'outbound':10,'return':10})]:
 q=urllib.parse.urlencode(params);s,b,h=get('/universal-time/'+model+'/'+('?' +q if q else ''));s2,b2,h2=get('/universal-time/process-api/?'+urllib.parse.urlencode({'model':model,**params}));html=BeautifulSoup(b,'html.parser');r=json.loads(b2);ck(s==s2==200 and r==json.loads(html.select_one('#time-data').string),'form/API parity '+model+' '+q);ck(r['solver_sha256']==hashlib.sha256((root/'universal-time/_lib/process.php').read_bytes()).hexdigest(),'solver source hash');ck("frame-src 'none'" in h['Content-Security-Policy'],'CSP');ck('no-store' in h2['Cache-Control'],'API no store');
 if q: ck('noindex' in h['X-Robots-Tag'] and 'no-store' in h['Cache-Control'],'parameter variant noindex and no-store')
for q in ['model=bad','model=rates&speed=-1','model=rates&alpha_a%5B%5D=1','model=synchronization&return=3601','model%5B%5D=rates','model=rates&unknown=1','speed=3']:
 s,b,h=get('/universal-time/process-api/?'+q);ck(s==400 and 'error' in json.loads(b),'reject '+q)
ck(get('/universal-time/process-api/','POST')[0]==405,'read only API');ck(get('/universal-time/rates/?hours=0')[0]==400,'invalid form');ck(get('/universal-time/_lib/process.php')[0]==403,'protected process solver');ck(get('/universal-time/_lib/process-tests.php')[0]==403,'protected tests');ck(get('/.htaccess')[0] in (403,404),'protected root config')
for source,dest in re.findall(r'RedirectMatch 302 \^(/[^\s?]+?)/\?\$ (/[\w/\-]+/)',(root/'.htaccess').read_text()):
 s,b,h=get(source+'/');ck(s==302 and urllib.parse.urlsplit(h['Location']).path==dest,'compatibility '+source);ck(get(dest)[0]==200,'compatibility destination '+dest)
print(n,'passed, 0 failed')
