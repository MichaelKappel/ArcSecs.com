import json,urllib.request,urllib.error,urllib.parse,sys,pathlib,hashlib,csv,io
from bs4 import BeautifulSoup
root=pathlib.Path(__file__).resolve().parents[2];base=sys.argv[1].rstrip('/') if len(sys.argv)>1 else 'http://127.0.0.1:8173';n=0
class NoRedirect(urllib.request.HTTPRedirectHandler):
 def redirect_request(self,*a,**k):return None
opener=urllib.request.build_opener(NoRedirect)
def req(path,method='GET',data=None,typ='application/json'):
 if isinstance(data,dict):data=json.dumps(data).encode()
 try:r=opener.open(urllib.request.Request(base+path,data=data,method=method,headers={'Content-Type':typ}),timeout=15)
 except urllib.error.HTTPError as e:r=e
 return r.status,r.read(),r.headers
def ck(x,name):
 global n
 assert x,name;n+=1;print('PASS',name)
def api(d):
 s,b,h=req('/experiment-design/api/','POST',d);assert s==200,(s,b[:400]);return json.loads(b)
cat=json.loads((root/'experiment-design/catalog.json').read_text());s,b,h=req('/experiment-design/api/');ck(s==200 and json.loads(b)==cat,'static live catalog exact parity');ck(len(cat['models'])==15 and len(cat['presets'])==5,'all models and worked designs')
for p in ['/experiment-design/','/experiment-design/method/','/experiment-design/replay/']:
 s,b,h=req(p);ck(s==200 and b.count(b'<h1>')==1 and ('https://beyondspacetime.org'+p).encode() in b,p+' route metadata');ck('no-store' in h['Cache-Control'] and "frame-src 'none'" in h['Content-Security-Policy'],p+' security');ck(req(p,'HEAD')[1]==b'',p+' HEAD');
for key in cat['models']:ck(req('/experiment-design/?model='+urllib.parse.quote(key))[0]==200,'custom editor '+key)
for key,p in cat['presets'].items():
 s=api({'action':'seal','protocol':p})['sealed'];ck('research_result' not in s and len(s['seal_sha256'])==64,key+' seal only');r=api({'action':'run','sealed':s})['result'];ck(r['decision']=='criterion_met' and len(r['research_result']['runs'])==4,key+' execute');again=api({'action':'run','sealed':s,'expected_sha256':r['result_sha256']});ck(again['replay_match'] and again['result']==r,key+' exact replay');ck(not api({'action':'run','sealed':s,'expected_sha256':'0'*64})['replay_match'],key+' mismatch replay');
 # No-JS HTML form: extract actual inputs, not inferred field names.
 status,html,_=req('/experiment-design/?preset='+key);soup=BeautifulSoup(html,'html.parser');form=soup.select_one('form.editor');fields=[]
 for el in form.select('input[name],textarea[name],select[name]'):
  if el.name=='input':
   if el.get('type')=='checkbox' and not el.has_attr('checked'):continue
   val=el.get('value','')
  elif el.name=='textarea':val=el.get_text()
  else:val=(el.select_one('option[selected]') or el.select_one('option')).get('value') or (el.select_one('option[selected]') or el.select_one('option')).get_text()
  fields.append((el['name'],val))
 status,html,h=req('/experiment-design/','POST',urllib.parse.urlencode(fields).encode(),'application/x-www-form-urlencoded');ck(status==200 and b'no study cases executed' in html,key+' form seals');seal_html=json.loads(BeautifulSoup(html,'html.parser').select_one('#sealed-json').get_text());ck(seal_html==s,key+' form/API seal parity');ck('noindex' in h['X-Robots-Tag'],key+' POST noindex');
 data=urllib.parse.urlencode({'sealed':json.dumps(s),'action':'run'}).encode();status,html,h=req('/experiment-design/replay/','POST',data,'application/x-www-form-urlencoded');ck(status==200 and b'Numerical criterion met' in html and b'viewBox="0 0 710 245"' in html,key+' no-JS execution chart');
 for action in ['save','download','csv']:
  status,body,h=req('/experiment-design/replay/','POST',urllib.parse.urlencode({'sealed':json.dumps(s),'action':action}).encode(),'application/x-www-form-urlencoded');ck(status==200 and 'attachment' in h['Content-Disposition'],key+' '+action+' export');ck((len(list(csv.reader(io.StringIO(body.decode()))))==5 if action=='csv' else json.loads(body)==(s if action=='save' else r)),key+' '+action+' export data');
 if key=='photon':
  if len(sys.argv)>2:
   out=pathlib.Path(sys.argv[2])/'BeyondSpacetime.org-v2.3.0-Example-Sealed-Protocol.json';out.parent.mkdir(parents=True,exist_ok=True);out.write_text(json.dumps(s,ensure_ascii=False,indent=2)+'\n');out.with_name('BeyondSpacetime.org-v2.3.0-Example-Design-Result.json').write_text(json.dumps(r,ensure_ascii=False,indent=2)+'\n');
  tamper=json.loads(json.dumps(s));tamper['protocol']['criteria']['support']=.7;ck(req('/experiment-design/api/','POST',{'action':'run','sealed':tamper})[0]==400,'tampered seal rejected');
for payload in [b'{',b'{}',b'[]',b'x'*65537]:ck(req('/experiment-design/api/','POST',payload)[0]==400,'bad request '+str(len(payload)))
ck(req('/experiment-design/api/','POST',b'{}','application/json-invalid')[0]==400,'reject MIME lookalike');ck(req('/experiment-design/api/','POST',b'x'*270000)[0]==413,'Apache body cap');ck(req('/experiment-design/api/','DELETE')[0]==405,'reject method');
for path in ['.htaccess','_lib/model.php','_lib/tests.php','_lib/','_lib/.htaccess']:ck(req('/experiment-design/'+path)[0] in [403,404],'private '+path)
ck(req('/experiment-design/index.php/extra')[0]==404,'PATH_INFO denied');ck(req('/experiment-design/api/index.php/extra')[0]==404,'API PATH_INFO denied');ck(req('/experiment-design/unknown/')[0]==404,'unknown route');ck(req('/experiment-design/method/','POST',b'')[0]==405,'method page GET only');print(f'{n} passed, 0 failed')
